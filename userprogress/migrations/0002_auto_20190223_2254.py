# Generated by Django 2.1.5 on 2019-02-24 06:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('userprogress', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userattemptedquestion',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='topics.Question'),
        ),
        migrations.AlterField(
            model_name='userattemptedquestion',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userwatchedvideo',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userwatchedvideo',
            name='video',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='topics.Video'),
        ),
    ]
