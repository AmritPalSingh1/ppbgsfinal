from django.urls import path

from . import views

urlpatterns = [
    path('topics', views.topics, name='topics'),
]
