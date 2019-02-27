from django.contrib import admin

from .models import UserWatchedVideo, UserAttemptedQuestion, TotalPoints



admin.site.register(UserWatchedVideo)
admin.site.register(UserAttemptedQuestion)
admin.site.register(TotalPoints)
