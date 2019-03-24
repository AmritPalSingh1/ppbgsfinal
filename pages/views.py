from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from userprogress.models import TotalPoints, TotalCoins, UserLastLocation
from topics.models import Video, Topic, Question, Query
from challenges.models import Challenge
from userprogress.models import UserReadNotes, UserAttemptedQuestion, UserWatchedVideo
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from flowchart.models import Progress


def get_all_topics():
    all_topics = {
        'topic1': 'Intro to Html',
        'topic2': 'JavaScript Expressions',
        'topic3': 'DOM Manipulation',
        'topic4': 'JavaScript Conditionals',
        'topic5': 'Loops',
        'topic6': 'Drawing With Canvas',
        'topic7': 'Functions',
        'topic8': 'Functions and Events',
        'topic9': 'Arrays',
        'topic10': 'Objects',
    }

    return all_topics


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

def get_all_topics_progress(request):

    all_topics = get_all_topics()

    all_topics_progress = {}
    

    for topic_number in all_topics:
        #
        # Total progress possible per topic
        #
        
        # add pdf
        topic_total_progress = 1
        # get topic
        topic = Topic.objects.get(topicName=all_topics[topic_number])
        # add videos
        topic_total_progress = topic_total_progress + Video.objects.filter(topic=topic).count()
        # add practice questions
        topic_total_progress = topic_total_progress + Question.objects.filter(topic=topic).count()
        # add challenges
        topic_total_progress = topic_total_progress + Challenge.objects.filter(topic=topic).count()

        #
        # User Progess per topic
        #

        topic_progress = 0
        # check if user has viewed the pdf file
        topic_progress = topic_progress + UserReadNotes.objects.filter(user=request.user, pdf__topic=topic).count()

        # add watched videos
        topic_progress = topic_progress + UserWatchedVideo.objects.filter(user=request.user, video__topic=topic).count()

        # add attempted practice questions
        topic_progress = topic_progress + UserAttemptedQuestion.objects.filter(
        user=request.user, question__topic=topic).count()

        progress = (topic_progress / topic_total_progress) * 100

        all_topics_progress[topic_number] = progress
    
    return all_topics_progress



@login_required
def index(request):

    flowchart_progress = Progress.objects.get(user=request.user)
    if flowchart_progress.correct != 3:
        return redirect('start') 



    get_all_topics_progress(request)

    user_last_location = UserLastLocation.objects.get(user=request.user)

    # current user's info
    user_data = user_info(request)

    # default video for videos page link
    videos = Video.objects.filter(topic=user_last_location.topic)

    # just the names of all the topics
    all_topics = get_all_topics()

    # topics progress
    all_topics_progress = get_all_topics_progress(request)

    # Latest Questions asked
    latest_questions = Query.objects.all().order_by('-id')[:5]


    context = {
        'user_last_location': user_last_location,
        'video': videos[0].key,
        'all_topics': all_topics,
        'all_topics_progress': all_topics_progress,
        'latest_questions': latest_questions,
        'user_data': user_data
    }
    return render(request, 'pages/index.html', context)


@login_required
def topics(request):

    flowchart_progress = Progress.objects.get(user=request.user)
    if flowchart_progress.correct != 3:
        return redirect('start') 

    user_data = user_info(request)

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

    all_topics = get_all_topics()

    context = {
        'all_topics': all_topics,
        'user_data': user_data
    }
    return render(request, 'pages/topics.html', context)


@login_required
def leaderboards(request):

    flowchart_progress = Progress.objects.get(user=request.user)
    if flowchart_progress.correct != 3:
        return redirect('start') 

    # all users total points
    all_total_points = TotalPoints.objects.order_by('-points')

    entries = 10

    if 'entries' in request.GET:
        entries = request.GET['entries']
        username = request.GET['username']
        #all_total_points = all_total_points.filter(user__icontains=username)

    # allow only one question to display on each page
    paginator = Paginator(all_total_points, entries)
    page = request.GET.get('page')
    paged_all_total_points = paginator.get_page(page)

    context = {
        'all_total_points': paged_all_total_points,
    }

    return render(request, 'pages/leaderboards.html', context)
