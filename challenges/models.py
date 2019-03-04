from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from topics.models import Topic


class Challenge(models.Model):
    topic = models.OneToOneField(Topic, on_delete=models.CASCADE)
    mock_data = models.FileField(upload_to='mock_data/%Y/%m/%d/')
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
