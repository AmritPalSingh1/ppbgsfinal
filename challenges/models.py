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
