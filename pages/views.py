from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from userprogress.models import TotalPoints, TotalCoins, UserLastLocation
from topics.models import Video, Topic, Question, Query
from challenges.models import Challenge
from userprogress.models import UserReadNotes, UserAttemptedQuestion, UserWatchedVideo, Level, TotalCoins, TotalPoints, UserAttemptedChallenge
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from flowchart.models import Progress
from django.contrib.auth.models import User
from django.db.models import Avg
from datetime import datetime, timedelta


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

    # current user's level
    userLevel = Level.objects.get(user=request.user)

    user_data = {
        'userPoints': userPoints,
        'rank': rank,
        'allUsers': allUsers,
        'userCoins': userCoins,
        'userLevel': userLevel,
    }

    return user_data

def get_all_topics_progress(user):

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
        topic_progress = topic_progress + UserReadNotes.objects.filter(user=user, pdf__topic=topic).count()

        # add watched videos
        topic_progress = topic_progress + UserWatchedVideo.objects.filter(user=user, video__topic=topic).count()

        # add attempted practice questions
        topic_progress = topic_progress + UserAttemptedQuestion.objects.filter(
        user=user, question__topic=topic).count()

        progress = (topic_progress / topic_total_progress) * 100

        all_topics_progress[topic_number] = progress
    
    return all_topics_progress



@login_required
def index(request):

    flowchart_progress = Progress.objects.get(user=request.user)
    if flowchart_progress.correct != 3:
        return redirect('start') 


    user_last_location = UserLastLocation.objects.get(user=request.user)

    # current user's info
    user_data = user_info(request)

    # default video for videos page link
    videos = Video.objects.filter(topic=user_last_location.topic)

    # just the names of all the topics
    all_topics = get_all_topics()

    # topics progress
    all_topics_progress = get_all_topics_progress(request.user)

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


@login_required
def profile(request, profile_id):

    user = get_object_or_404(User, id=profile_id)

    # get user rank

    # list of all the users
    allUsers = TotalPoints.objects.order_by('-points')
    rank = 1
    for singleUser in allUsers:
        if singleUser.user == user:
            break
        rank += 1

    # get user points
    user_points = TotalPoints.objects.get(user=user).points

    # get user Level
    user_level = Level.objects.get(user=user)

    # get user coins
    user_coins = TotalCoins.objects.get(user=user).coins

    # topics progress
    all_topics_progress = get_all_topics_progress(user)

    # average grade calculations
    average_grade_aggregate = UserAttemptedChallenge.objects.filter(user=user, time_taken__gt=timedelta(seconds=0)).aggregate(Avg('grade'))

    if average_grade_aggregate['grade__avg']:
        average_grade = int(average_grade_aggregate['grade__avg'])
    else:
        average_grade = 0
    # average time taken to solve challenges calculation
    average_time_taken = UserAttemptedChallenge.objects.filter(user=user, time_taken__gt=timedelta(seconds=0)).aggregate(Avg('time_taken'))
    average_time = str(average_time_taken['time_taken__avg']).split('.')[0]
    # total challenges attempted by user
    user_attempted_challenges = UserAttemptedChallenge.objects.filter(user=user).count()

    # total questions attempted by user
    user_attempted_questions = UserAttemptedQuestion.objects.filter(user=user).count()

    # total videos watched by user
    user_watched_videos = UserWatchedVideo.objects.filter(user=user).count()

    # total notes read by user
    user_read_notes = UserReadNotes.objects.filter(user=user).count()

    pre_level = user_level.level - 1
    next_level = user_level.level + 1
    progress = user_level.progress
    tries_left = 5 - user_level.tries

    # managing user progress this way because I'm not cool enough
    rel_progress = 0
    stay_progress = 0
    pro_progress = 0
    if progress == 1:
        rel_progress = 25
    elif progress == 2:
        rel_progress = 50
    elif progress == 3:
        rel_progress = 75
    elif progress == 4:
        rel_progress = 100
    elif progress == 5:
        rel_progress = 100
        stay_progress = 20
    elif progress == 6:
        rel_progress = 100
        stay_progress = 40
    elif progress == 7:
        rel_progress = 100
        stay_progress = 60
    elif progress == 8:
        rel_progress = 100
        stay_progress = 80
    elif progress == 9:
        rel_progress = 100
        stay_progress = 100
    elif progress == 10:
        rel_progress = 100
        stay_progress = 100
        pro_progress = 16.5
    elif progress == 11:
        rel_progress = 100
        stay_progress = 100
        pro_progress = 33.3
    elif progress == 12:
        rel_progress = 100
        stay_progress = 100
        pro_progress = 50
    elif progress == 13:
        rel_progress = 100
        stay_progress = 100
        pro_progress = 66.6
    elif progress == 14:
        rel_progress = 100
        stay_progress = 100
        pro_progress = 83.3
    elif progress == 15:
        rel_progress = 100
        stay_progress = 100
        pro_progress = 100
    

    context = {
        'user': user,
        'rank': rank,
        'user_points': user_points,
        'user_level': user_level,
        'user_coins': user_coins,
        'all_topics_progress': all_topics_progress,
        'average_grade': average_grade,
        'user_attempted_challenges': user_attempted_challenges,
        'user_attempted_questions': user_attempted_questions,
        'user_watched_videos': user_watched_videos,
        'user_read_notes': user_read_notes,
        'pre_level': pre_level,
        'next_level': next_level,
        'tries_left': tries_left,
        'rel_progress': rel_progress,
        'stay_progress': stay_progress,
        'pro_progress': pro_progress,
        'average_time': average_time,
    }

    return render(request, 'pages/profile.html', context)