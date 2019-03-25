from django.contrib import admin

from .models import UserWatchedVideo, UserAttemptedQuestion, TotalPoints, TotalCoins, UserReadNotes, UserLastLocation, UserAttemptedChallenge, Level

class ChallengeProgressAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'challenge')
    list_display_links = ('id',)
    list_per_page = 10

admin.site.register(UserWatchedVideo)
admin.site.register(UserReadNotes)
admin.site.register(UserAttemptedQuestion)
admin.site.register(UserAttemptedChallenge, ChallengeProgressAdmin)
admin.site.register(TotalPoints)
admin.site.register(TotalCoins)
admin.site.register(UserLastLocation)
admin.site.register(Level)

