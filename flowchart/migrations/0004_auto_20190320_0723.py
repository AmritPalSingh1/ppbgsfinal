# Generated by Django 2.1.5 on 2019-03-20 07:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowchart', '0003_progress'),
    ]

    operations = [
        migrations.AddField(
            model_name='progress',
            name='answer1',
            field=models.CharField(choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4')], default='1', max_length=6),
        ),
        migrations.AddField(
            model_name='progress',
            name='answer2',
            field=models.CharField(choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4')], default='1', max_length=6),
        ),
        migrations.AddField(
            model_name='progress',
            name='answer3',
            field=models.CharField(choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4')], default='1', max_length=6),
        ),
    ]
