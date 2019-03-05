from django.urls import path

from . import views

urlpatterns = [
    path('<str:topic_name>', views.topic, name='topic'),
    path('topic/videos', views.videos, name='videos'),
    path('topic/notes', views.notes, name='notes'),
    path('topic/quiz', views.quiz, name='quiz'),
    path('topic/questions', views.questions, name='questions'),
    path('topic/question', views.question, name='question'),
    path('topic/challenge', views.challenge, name='challenge'),
    path('topic/challenges', views.challenges, name='challenges'),
    path('leaderboards/', views.leaderboards, name='leaderboards'),
]
