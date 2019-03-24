from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class FlowchartQuestion(models.Model):
    question = models.TextField()
    option1 = models.CharField(max_length=500)
    option2 = models.CharField(max_length=500)
    option3 = models.CharField(max_length=500)
    option4 = models.CharField(max_length=500)
    ONE = '1'
    TWO = '2'
    THREE = '3'
    FOUR = '4'
    answers = (
        (ONE, '1'),
        (TWO, '2'),
        (THREE, '3'),
        (FOUR, '4'),
    )
    answer = models.CharField(
        max_length=6,
        choices=answers,
        default=ONE,
    )
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
    image = models.ImageField(upload_to='flowchart/%Y/%m/%d/', blank=True)    

    def __str__(self):
        return self.question



class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    current_question = models.IntegerField(default=1) 
    correct = models.IntegerField(default=0)
    EASY = 'easy'
    MEDIUM = 'medium'
    HARD = 'hard'
    Difficulty_levels = (
        (EASY, 'Easy'),
        (MEDIUM, 'Medium'),
        (HARD, 'Hard'),
    )
    user_difficulty = models.CharField(
        max_length=6,
        choices=Difficulty_levels,
        default=MEDIUM,
    )
    ONE = '1'
    TWO = '2'
    THREE = '3'
    FOUR = '4'
    answers = (
        (ONE, '1'),
        (TWO, '2'),
        (THREE, '3'),
        (FOUR, '4'),
    )
    answer1 = models.CharField(
        max_length=6,
        choices=answers,
        default=ONE,
    )
    answer2 = models.CharField(
        max_length=6,
        choices=answers,
        default=ONE,
    )
    answer3 = models.CharField(
        max_length=6,
        choices=answers,
        default=ONE,
    )