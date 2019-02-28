from django.shortcuts import render
from django.http import HttpResponse


def code_editor(request):
    return render(request, 'pages/code_editor.html')
