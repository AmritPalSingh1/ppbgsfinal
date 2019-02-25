from django.db import models
from django.contrib.auth.models import User
from datetime import datetime


class Topic(models.Model):
    topicName = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.topicName


class Video(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    title = models.TextField()
    key = models.CharField(max_length=300)
    channelName = models.CharField(max_length=400)

    def __str__(self):
        return self.title

class Pdf(models.Model):
    topic = models.OneToOneField(Topic, on_delete=models.CASCADE)
    file = models.FileField(upload_to='pdfs/%Y/%m/%d/')

    


class Question(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    question = models.TextField()
    option1 = models.CharField(max_length=500)
    option2 = models.CharField(max_length=500)
    option3 = models.CharField(max_length=500)
    option4 = models.CharField(max_length=500)
    answer = models.IntegerField()
    solution = models.TextField()

    def __str__(self):
        return self.question

class Query(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(default=datetime.now, blank=True)
    question = models.TextField()
    details = models.TextField()
    noOfComments = models.IntegerField(default=0)

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    query = models.ForeignKey(Query, on_delete=models.CASCADE)
    comment = models.TextField()
    date = models.DateTimeField(default=datetime.now, blank=True)





