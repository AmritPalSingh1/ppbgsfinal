from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from userprogress.models import TotalPoints, TotalCoins, UserLastLocation
from topics.models import Video

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


@login_required
def index(request):
    user_last_location = UserLastLocation.objects.get(user=request.user)

    # default video for videos page link
    videos = Video.objects.filter(topic=user_last_location.topic)

    context = {
        'user_last_location': user_last_location,
        'video': videos[0].key,
    }
    return render(request, 'pages/index.html', context)

@login_required
def topics(request):

    user_data = user_info(request)

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

    context = {
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
        'user_data': user_data
    }
    return render(request, 'pages/topics.html', context)