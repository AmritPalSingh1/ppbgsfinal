from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from topics.models import Topic


class Challenge(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    exercise = models.FileField(upload_to='exercises/%Y/%m/%d/', blank=True)
    EASY = 'easy'
    MEDIUM = 'medium'
    HARD = 'hard'
    Difficulty_levels = (
        (EASY, 'Easy'),
        (MEDIUM, 'Medium'),
        (HARD, 'Hard'),
    )
    difficulty = models.CharField(
        max_length=6,
        choices=Difficulty_levels,
        default=MEDIUM,
    )

class DoublePoint(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class FreeWin(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Hint(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hints_baught = models.IntegerField(default=1)
    