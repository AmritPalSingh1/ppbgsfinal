from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from .models import Topic, Video, Question, Pdf, Query, Comment
from userprogress.models import UserAttemptedQuestion
from django.contrib.auth.models import User
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.contrib.auth.decorators import login_required



@login_required
def topic(request, topic_name):
    topic = get_object_or_404(Topic, topicName=topic_name)
    videos = Video.objects.filter(topic=topic)
    context = {
        'topic': topic,
        'video': videos[0].key
    }

    return render(request, 'pages/topic.html', context)

@login_required
def videos(request):
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    topic = Topic.objects.get(topicName=topic_name)
    videos = Video.objects.filter(topic=topic)

    key = request.GET['key']
    context = {
        'topic': topic,
        'videos': videos,
        'key': key
    }

    return render(request, 'pages/videos.html', context)

@login_required
def notes(request):
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    topic = Topic.objects.get(topicName=topic_name)
    pdf = Pdf.objects.get(topic=topic)

    videos = Video.objects.filter(topic=topic)
    context = {
        'topic': topic,
        'video': videos[0].key,
        'pdf': pdf
    }
    return render(request, 'pages/notes.html', context)

@login_required
def quiz(request):
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    submitted_question = None
    user_answer = None

    if request.method == 'POST':
        user_id = request.POST['user_id']
        question_number = request.POST['question_number']
        user_answer = int(request.POST['radio'])

        submitted_question = Question.objects.get(id=question_number)

        if request.user.is_authenticated:
            current_user = request.user
            already_attempted_question = UserAttemptedQuestion.objects.filter(question=submitted_question, user=current_user)

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
        else:
            if (user_answer == submitted_question.answer):
                attemptedQuestion = UserAttemptedQuestion(question=submitted_question, user=request.user, isCorrect=True)
                attemptedQuestion.save()
                messages.success(request, 'Correct answer! +1 pts')
            else:
                attemptedQuestion = UserAttemptedQuestion(question=submitted_question, user=request.user, isCorrect=False)
                attemptedQuestion.save()   
                messages.error(request, 'Incorrect answer :(')  

    topic = Topic.objects.get(topicName=topic_name)
    questions = Question.objects.filter(topic=topic)

    paginator = Paginator(questions, 1)
    page = request.GET.get('page')
    paged_questions = paginator.get_page(page)

    videos = Video.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'questions': paged_questions,  
        'submitted_question': submitted_question,
        'video': videos[0].key,
        'user_answer': user_answer
    }
    
    return render(request, 'pages/quiz.html', context)

@login_required
def questions(request):
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']
    
    topic = Topic.objects.get(topicName=topic_name)

    if 'question' in request.POST:
        question = request.POST['question']
        details = request.POST['details']
        query = Query(topic=topic, user=request.user, question=question, details=details)
        query.save()

    questions = Query.objects.filter(topic=topic)

    context = {
        'topic': topic,
        'questions': questions
    }

    return render(request, 'pages/questions.html', context)

@login_required
def question(request):
    if 'topic_name' in request.GET:
        topic_name = request.GET['topic_name']

    topic = Topic.objects.get(topicName=topic_name)

    if 'questionID' in request.GET:
        questionID = request.GET['questionID']

    query = Query.objects.get(id=questionID)

    if 'comment' in request.POST:
        comment = request.POST['comment']
        new_comment = Comment(user=request.user, query=query, comment=comment)
        new_comment.save()
    

    comments = Comment.objects.filter(query=query)

    context = {
        'topic': topic,
        'query': query,
        'comments': comments
    }

    return render(request, 'pages/question.html', context)


@login_required
def leaderboards(request):
    return render(request, 'pages/leaderboards.html')
