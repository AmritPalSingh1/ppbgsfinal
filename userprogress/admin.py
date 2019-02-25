from django.contrib import admin

from .models import UserWatchedVideo, UserAttemptedQuestion



admin.site.register(UserWatchedVideo)
admin.site.register(UserAttemptedQuestion)
