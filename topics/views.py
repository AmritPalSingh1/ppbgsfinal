from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from .models import Topic, Video, Question, Pdf, Query, Comment
from userprogress.models import UserAttemptedQuestion
from django.contrib.auth.models import User
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.contrib.auth.decorators import login_required
from challenges.models import Challenge

from userprogress.models import TotalPoints, TotalCoins


@login_required
def topic(request, topic_name):

    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # list of all the users
    allUsers = TotalPoints.objects.order_by('-points')

    # current user's rank
    rank=1
    for singleUser in allUsers:
        if singleUser.user == request.user:
            break
        rank += 1

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)


    # get current topic otherwise 404 page
    topic = get_object_or_404(Topic, topicName=topic_name)

    # default video for videos page
    videos = Video.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'video': videos[0].key,
        'userPoints': userPoints,
        'rank': rank,
        'allUsers': allUsers,
        'userCoins': userCoins
    }

    return render(request, 'pages/topic.html', context)


@login_required
def videos(request):

    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # list of all the users
    allUsers = TotalPoints.objects.order_by('-points')

    # current user's rank
    rank=1
    for singleUser in allUsers:
        if singleUser.user == request.user:
            break
        rank += 1

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = Topic.objects.get(topicName=topic_name)

    # Fetch all the videos related to current topic
    videos = Video.objects.filter(topic=topic)

    # key of the default video to display
    key = request.GET['key']

    context = {
        'topic': topic,
        'videos': videos,
        'key': key,
        'userPoints': userPoints,
        'rank': rank,
        'allUsers': allUsers,
        'userCoins': userCoins
    }

    return render(request, 'pages/videos.html', context)


@login_required
def notes(request):

    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # list of all the users
    allUsers = TotalPoints.objects.order_by('-points')

    # current user's rank
    rank=1
    for singleUser in allUsers:
        if singleUser.user == request.user:
            break
        rank += 1

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)

    # retreive topic name from GET request    
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = Topic.objects.get(topicName=topic_name)

    # Fetch current topic's pdf
    pdf = Pdf.objects.get(topic=topic)

    # default video for videos page
    videos = Video.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'video': videos[0].key,
        'pdf': pdf,
        'userPoints': userPoints,
        'rank': rank,
        'allUsers': allUsers,
        'userCoins': userCoins
    }
    return render(request, 'pages/notes.html', context)


@login_required
def quiz(request):

    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # list of all the users
    allUsers = TotalPoints.objects.order_by('-points')

    # current user's rank
    rank=1
    for singleUser in allUsers:
        if singleUser.user == request.user:
            break
        rank += 1

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)

    # retreive topic name from GET request    
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # default values of context variables
    submitted_question = None
    user_answer = None

    # if user submits a answer
    if request.method == 'POST':
        # retreive question and user data
        user_id = request.POST['user_id']
        question_number = request.POST['question_number']
        user_answer = int(request.POST['radio'])

        # Fetch question submitted by user
        submitted_question = Question.objects.get(id=question_number)

        # check if user has previously submitted the question
        if request.user.is_authenticated:
            current_user = request.user
            already_attempted_question = UserAttemptedQuestion.objects.filter(question=submitted_question, user=current_user)

        # when user is attempting question again
        if already_attempted_question:
            if (user_answer == submitted_question.answer):
                if already_attempted_question[0].isCorrect:
                    messages.success(request, 'Correct answer! +0 pts')
                else:
                    already_attempted_question[0].isCorrect = True
                    already_attempted_question[0].save()
                    messages.success(request, 'Correct answer! +1 pts')
            else:
                messages.error(request, 'Incorrect answer :(')
        # when user is attempting the question for first time
        else:
            if (user_answer == submitted_question.answer):
                attemptedQuestion = UserAttemptedQuestion(question=submitted_question, user=request.user, isCorrect=True)
                attemptedQuestion.save()
                messages.success(request, 'Correct answer! +1 pts')
            else:
                attemptedQuestion = UserAttemptedQuestion(question=submitted_question, user=request.user, isCorrect=False)
                attemptedQuestion.save()   
                messages.error(request, 'Incorrect answer :(')  

    # Fetch current topic
    topic = Topic.objects.get(topicName=topic_name)

    # Fetching all the questions of current topic
    questions = Question.objects.filter(topic=topic)

    # allow only one question to display on each page
    paginator = Paginator(questions, 1)
    page = request.GET.get('page')
    paged_questions = paginator.get_page(page)

    # default video for videos page
    videos = Video.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'questions': paged_questions,  
        'submitted_question': submitted_question,
        'video': videos[0].key,
        'user_answer': user_answer,
        'userPoints': userPoints,
        'rank': rank,
        'allUsers': allUsers,
        'userCoins': userCoins
    }
    
    return render(request, 'pages/quiz.html', context)

@login_required
def questions(request):

    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # list of all the users
    allUsers = TotalPoints.objects.order_by('-points')

    # current user's rank
    rank=1
    for singleUser in allUsers:
        if singleUser.user == request.user:
            break
        rank += 1

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)

    # retreive topic name from GET request    
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']
    
    # Fetch current topic
    topic = Topic.objects.get(topicName=topic_name)

    # if user posts a question
    if 'question' in request.POST:
        question = request.POST['question']
        details = request.POST['details']
        query = Query(topic=topic, user=request.user, question=question, details=details)
        query.save()

    # list of all the questions of current topic
    questions = Query.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'questions': questions,
        'userPoints': userPoints,
        'rank': rank,
        'allUsers': allUsers,
        'userCoins': userCoins
    }

    return render(request, 'pages/questions.html', context)


@login_required
def question(request):

    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # list of all the users
    allUsers = TotalPoints.objects.order_by('-points')

    # current user's rank
    rank=1
    for singleUser in allUsers:
        if singleUser.user == request.user:
            break
        rank += 1

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)

    # retreive topic name from GET request    
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = Topic.objects.get(topicName=topic_name)

    # current question/query
    if 'questionID' in request.GET:
        questionID = request.GET['questionID']

    query = Query.objects.get(id=questionID)

    # if user posts a comment
    if 'comment' in request.POST:
        comment = request.POST['comment']
        new_comment = Comment(user=request.user, query=query, comment=comment)
        new_comment.save()
    
    # list of all the comments of current topic
    comments = Comment.objects.filter(query=query)

    context = {
        'topic': topic,
        'query': query,
        'comments': comments,
        'userPoints': userPoints,
        'rank': rank,
        'allUsers': allUsers,
        'userCoins': userCoins
    }

    return render(request, 'pages/question.html', context)


@login_required
def leaderboards(request):
    return render(request, 'pages/leaderboards.html')

@login_required
def challenge(request):
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = Topic.objects.get(topicName=topic_name)

    challenge = Challenge.objects.filter(topic=topic)

    context = {
        'challenge': challenge,
    }

    return render(request, 'pages/challenge.html', context)

