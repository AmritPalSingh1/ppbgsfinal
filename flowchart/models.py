from django.db import models

# Create your models here.


class FlowchartQuestion(models.Model):
    question = models.TextField()
    option1 = models.CharField(max_length=500)
    option2 = models.CharField(max_length=500)
    option3 = models.CharField(max_length=500)
    option4 = models.CharField(max_length=500)
    answer = models.IntegerField()
    solution = models.TextField()
    difficulty = models.IntegerField()

    def __str__(self):
        return self.question