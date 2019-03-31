from django.db import models
from datetime import datetime, timedelta
from django.contrib.auth.models import User

class WeeklyTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.CharField(max_length=500)
    points = models.IntegerField(default=0)
    start_datetime = models.DateTimeField(default=datetime.now, blank=True)
    end_datetime = models.DateTimeField(default=datetime.now()+timedelta(days=7), blank=True)
    total_progress = models.IntegerField(default=1)
    user_progress = models.IntegerField(default=0)
    is_finished = models.BooleanField(default=False)
    

    def __str__(self):
        return self.task

