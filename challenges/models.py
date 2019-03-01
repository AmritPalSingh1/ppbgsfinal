from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from topics.models import Topic

class Challenge(models.Model):
    topic = models.OneToOneField(Topic, on_delete=models.CASCADE)
    mock_data = models.FileField(upload_to='mock_data/%Y/%m/%d/')

