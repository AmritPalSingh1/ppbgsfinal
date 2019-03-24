from django.contrib import admin

# Register your models here.

from .models import Challenge, DoublePoint, FreeWin, Hint

class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('id', 'topic', 'difficulty', 'exercise')
    list_display_links = ('id', 'topic')
    list_filter = ('topic', 'difficulty')
    list_per_page = 15


admin.site.register(Challenge, ChallengeAdmin)
admin.site.register(DoublePoint)
admin.site.register(FreeWin)
admin.site.register(Hint)
