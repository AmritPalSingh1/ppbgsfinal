from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required


@login_required
def start(request):
    return render(request, 'flowchart/question.html')

@login_required
def final(request):
    return render(request, 'flowchart/result.html')

