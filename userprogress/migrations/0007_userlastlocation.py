# Generated by Django 2.1.5 on 2019-03-08 16:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('topics', '0011_auto_20190223_2302'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('userprogress', '0006_auto_20190306_1212'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserLastLocation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(choices=[('notes', 'Notes'), ('videos', 'Videos'), ('hard', 'Quiz'), ('challenges', 'Challenges')], default='notes', max_length=10)),
                ('topic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='topics.Topic')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
