from django.db import models

from django.contrib.auth.models import User
from datetime import datetime, timedelta
from topics.models import Video, Question, Pdf, Topic
from challenges.models import Challenge

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
