from django.db import models

from django.contrib.auth.models import User
from datetime import datetime, timedelta
from topics.models import Video, Question, Pdf, Topic
from challenges.models import Challenge
from django.db.models import Avg
# from .views import get_topics_progress

import math



class UserWatchedVideo(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class UserReadNotes(models.Model):
    pdf = models.ForeignKey(Pdf, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class UserAttemptedQuestion(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    isCorrect = models.BooleanField()


class TotalPoints(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)

    def get_user_rank(self, user):
        # list of all the users
        allUsers = TotalPoints.objects.order_by('-points')

        user_points = TotalPoints.objects.get(user=user).points

        rank = 1
        for singleUser in allUsers:
            if singleUser.points == user_points:
                break
            rank += 1
        return rank

    def get_user_level(self, user):
        return Level.objects.get(user=user).level
    
    def get_user_challenges(self, user):
        return UserAttemptedChallenge.objects.filter(user=user).count()

    def get_user_grade(self, user):
        average_grade_aggregate = UserAttemptedChallenge.objects.filter(user=user, time_taken__gt=timedelta(seconds=0)).aggregate(Avg('grade'))
        if average_grade_aggregate['grade__avg']:
            average_grade = int(average_grade_aggregate['grade__avg'])
        else:
            average_grade = 0
        return average_grade

    # def get_user_progress(self, user):
    #     progress = get_all_topics_progress(user)
    #     return progress



class TotalCoins(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    coins = models.IntegerField(default=0)


class UserLastLocation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    NOTES = 'notes'
    VIDEOS = 'videos'
    QUIZ = 'quiz'
    CHALLENGES = 'challenges'
    Last_location = (
        (NOTES, 'Notes'),
        (VIDEOS, 'Videos'),
        (QUIZ, 'Quiz'),
        (CHALLENGES, 'Challenges'),
    )
    location = models.CharField(
        max_length=10,
        choices=Last_location,
        default=NOTES,
    )


class UserAttemptedChallenge(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_datetime = models.DateTimeField(default=datetime.now, blank=True)
    end_datetime = models.DateTimeField(default=datetime.now, blank=True)
    time_taken = models.DurationField(blank=True, default=timedelta(seconds=0))
    grade = models.IntegerField(default=0)

    def minutes_taken(self):
        return round(self.time_taken.seconds / 60, 1)

    def get_user_rank(self, user):
        # list of all the users
        allUsers = TotalPoints.objects.order_by('-points')

        rank = 1
        for singleUser in allUsers:
            if singleUser.user == user:
                break
            rank += 1
        return rank

    def get_user_level(self, user):
        return Level.objects.get(user=user).level
       


class Level(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.IntegerField(default=1)
    tries = models.IntegerField(default=0)
    progress = models.IntegerField(default=0)


