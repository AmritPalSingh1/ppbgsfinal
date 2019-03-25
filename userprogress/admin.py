from django.contrib import admin

from .models import UserWatchedVideo, UserAttemptedQuestion, TotalPoints, TotalCoins, UserReadNotes, UserLastLocation, UserAttemptedChallenge, Level



admin.site.register(UserWatchedVideo)
admin.site.register(UserReadNotes)
admin.site.register(UserAttemptedQuestion)
admin.site.register(UserAttemptedChallenge)
admin.site.register(TotalPoints)
admin.site.register(TotalCoins)
admin.site.register(UserLastLocation)
admin.site.register(Level)

