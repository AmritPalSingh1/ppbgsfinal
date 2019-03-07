from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.contrib.auth.decorators import login_required

# Import required models
from .models import Topic, Video, Question, Pdf, Query, Comment
from userprogress.models import UserAttemptedQuestion, UserWatchedVideo, UserReadNotes, TotalCoins, TotalPoints
from django.contrib.auth.models import User
from challenges.models import Challenge
from userprogress.models import TotalPoints, TotalCoins


def user_info(request):
    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # list of all the users
    allUsers = TotalPoints.objects.order_by('-points')

    # current user's rank
    rank = 1
    for singleUser in allUsers:
        if singleUser.user == request.user:
            break
        rank += 1

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)

    user_data = {
        'userPoints': userPoints,
        'rank': rank,
        'allUsers': allUsers,
        'userCoins': userCoins
    }

    return user_data

def update_user_points(request, points):
    # update total points
    total_points = TotalPoints.objects.get(user=request.user)
    total_points.points = total_points.points + points
    total_points.save()

def update_user_coins(request, coins):
    # update total coins
    total_coins = TotalCoins.objects.get(user=request.user)
    total_coins.coins = total_coins.coins + coins
    total_coins.save()

@login_required
def topic(request, topic_name):

    user_data = user_info(request)

    # get current topic otherwise 404 page
    topic = get_object_or_404(Topic, topicName=topic_name)

    # default video for videos page
    videos = Video.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'video': videos[0].key,
        'user_data': user_data
    }

    return render(request, 'pages/topic.html', context)



@login_required
def videos(request):

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Fetch all the videos related to current topic
    videos = Video.objects.filter(topic=topic)

    # key of the current video to display
    key = request.GET['key']

    #current video
    current_video = Video.objects.get(topic=topic, key=key)

    already_watched_video = UserWatchedVideo.objects.filter(video=current_video, user=request.user)

    if not already_watched_video:
        # add video to user watched history
        watched_video = UserWatchedVideo(video=current_video, user=request.user)
        watched_video.save()

        update_user_points(request, 2)
        update_user_coins(request, 4)

    user_data = user_info(request)

    context = {
        'topic': topic,
        'videos': videos,
        'key': key,
        'user_data': user_data
    }

    return render(request, 'pages/videos.html', context)


@login_required
def notes(request):

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Fetch current topic's pdf
    pdf = Pdf.objects.get(topic=topic)


    already_read_notes = UserReadNotes.objects.filter(pdf=pdf, user=request.user)
    if not already_read_notes:
        read_notes = UserReadNotes(pdf=pdf, user=request.user)
        read_notes.save()

        update_user_points(request, 4)
        update_user_coins(request, 8)

    # default video for videos page
    videos = Video.objects.filter(topic=topic)

    user_data = user_info(request)

    context = {
        'topic': topic,
        'video': videos[0].key,
        'pdf': pdf,
        'user_data': user_data
    }
    return render(request, 'pages/notes.html', context)


@login_required
def quiz(request):
    
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
            already_attempted_question = UserAttemptedQuestion.objects.filter(
                question=submitted_question, user=current_user)

        # when user is attempting question again
        if already_attempted_question:
            if (user_answer == submitted_question.answer):
                if already_attempted_question[0].isCorrect:
                    messages.success(request, 'Correct answer! +0 pts')
                else:
                    already_attempted_question[0].isCorrect = True
                    already_attempted_question[0].save()
                    update_user_points(request, 1)
                    update_user_coins(request, 2)
                    messages.success(request, 'Correct answer! +1 pts')
            else:
                messages.error(request, 'Incorrect answer :(')
        # when user is attempting the question for first time
        else:
            if (user_answer == submitted_question.answer):
                attemptedQuestion = UserAttemptedQuestion(
                    question=submitted_question, user=request.user, isCorrect=True)
                attemptedQuestion.save()
                update_user_points(request, 1)
                update_user_coins(request, 2)
                messages.success(request, 'Correct answer! +1 pts')
            else:
                attemptedQuestion = UserAttemptedQuestion(
                    question=submitted_question, user=request.user, isCorrect=False)
                attemptedQuestion.save()
                messages.error(request, 'Incorrect answer :(')

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Fetching all the questions of current topic
    questions = Question.objects.filter(topic=topic)

    # allow only one question to display on each page
    paginator = Paginator(questions, 1)
    page = request.GET.get('page')
    paged_questions = paginator.get_page(page)

    # default video for videos page
    videos = Video.objects.filter(topic=topic)

    user_data = user_info(request)

    context = {
        'topic': topic,
        'questions': paged_questions,
        'submitted_question': submitted_question,
        'video': videos[0].key,
        'user_answer': user_answer,
        'user_data': user_data
    }

    return render(request, 'pages/quiz.html', context)


@login_required
def questions(request):

    user_data = user_info(request)
    
    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # if user posts a question
    if 'question' in request.POST:
        question = request.POST['question']
        details = request.POST['details']
        query = Query(topic=topic, user=request.user,
                      question=question, details=details)
        query.save()

    # list of all the questions of current topic
    questions = Query.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'questions': questions,
        'user_data': user_data
    }

    return render(request, 'pages/questions.html', context)


@login_required
def question(request):

    user_data = user_info(request)

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

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
        'user_data': user_data
    }

    return render(request, 'pages/question.html', context)


@login_required
def leaderboards(request):
    return render(request, 'pages/leaderboards.html')


@login_required
def challenges(request):
    user_data = user_info(request)

    # retreive topic name from GET request
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Fetch easy challenges
    easy_challenges = Challenge.objects.filter(topic=topic, difficulty="easy")

    # Fetch medium challenges
    medium_challenges = Challenge.objects.filter(topic=topic, difficulty="medium")

    # Fetch hard challenges
    hard_challenges = Challenge.objects.filter(topic=topic, difficulty="hard")


    context = {
        'topic': topic,
        'easy_challenges': easy_challenges,
        'medium_challenges': medium_challenges,
        'hard_challenges': hard_challenges,
        'user_data': user_data,
    }

    return render(request, 'pages/challenges.html', context)


@login_required
def challenge(request):

    # data related to user: coins, points, rank
    user_data = user_info(request)

    # get current topic name
    if 'topic_name' in request.POST:
        topic_name = request.POST['topic_name']

    # get current challenge id
    if 'ch_id' in request.POST:
        ch_id = request.POST['ch_id']
    else:
        return redirect('topics')


    # Fetch current topic
    topic = get_object_or_404(Topic, topicName=topic_name)

    # Current challenge
    challenge = Challenge.objects.get(topic=topic, id=ch_id)
    print(challenge.exercise.url)

    context = {
        'challenge': challenge,
    }

    return render(request, 'pages/code_editor.html', context)
