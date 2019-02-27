from django.contrib import admin

from .models import UserWatchedVideo, UserAttemptedQuestion, TotalPoints, TotalCoins



admin.site.register(UserWatchedVideo)
admin.site.register(UserAttemptedQuestion)
admin.site.register(TotalPoints)
admin.site.register(TotalCoins)
