from django.urls import path

from . import views

urlpatterns = [
    path('<str:topic_name>', views.topic, name='topic'),
    path('topic/videos', views.videos, name='videos'),
    path('topic/notes', views.notes, name='notes'),
    path('topic/extra', views.extra, name='extra'),
    path('topic/quiz', views.quiz, name='quiz'),
    path('topic/check_answer', views.check_answer, name='check_answer'),
    path('topic/questions', views.questions, name='questions'),
    path('topic/add_question', views.add_question, name='add_question'),
    path('topic/question', views.question, name='question'),
    path('topic/add_comment', views.add_comment, name='add_comment'),
    path('topic/challenge', views.challenge, name='challenge'),
    path('topic/challenge/hint', views.hint, name='hint'),
    path('topic/challenge/double_points', views.double_points, name='double_points'),
    path('topic/challenge/free_win', views.free_win, name='free_win'),
    path('topic/challenges', views.challenges, name='challenges'),
    path('topic/result', views.result, name='result'),
    path('topic/result_update', views.result_update, name='result_update'),
]
