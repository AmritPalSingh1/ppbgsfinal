from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta
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

    def is_attempted(self, user):
        from userprogress.models import UserAttemptedChallenge
        attempted_challenges = UserAttemptedChallenge.objects.filter(challenge=self, user=user)
        if attempted_challenges:
            return True
        else:
            return False

    def is_only_started(self, user):
        from userprogress.models import UserAttemptedChallenge
        attempted_challenges = UserAttemptedChallenge.objects.filter(challenge=self, user=user)
        if attempted_challenges:
            challenge = UserAttemptedChallenge.objects.get(challenge=self, user=user)
            if challenge.time_taken == timedelta(seconds=0):
                return True
        return False

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
    