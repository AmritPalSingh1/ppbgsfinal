# Generated by Django 2.1.5 on 2019-03-06 12:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('topics', '0011_auto_20190223_2302'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('userprogress', '0004_totalcoins'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserReadNotes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Pdf', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='topics.Pdf')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]