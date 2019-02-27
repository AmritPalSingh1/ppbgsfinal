from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from userprogress.models import TotalPoints


@login_required
def topics(request):
    userPoints = TotalPoints.objects.get(user=request.user)
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
        'userPoints': userPoints
    }
    return render(request, 'pages/topics.html', context)
