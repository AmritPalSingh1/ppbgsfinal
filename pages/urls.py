from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('topics', views.topics, name='topics'),
    path('leaderboards/', views.leaderboards, name='leaderboards'),
    path('profile/<int:profile_id>', views.profile, name='profile'),
]
