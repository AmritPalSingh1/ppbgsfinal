from django.contrib import admin

# Register your models here.

from .models import FlowchartQuestion, Progress

class FlowchartQuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'difficulty', 'image')
    list_display_links = ('question',)
    list_filter = ('difficulty',)
    list_per_page = 20



admin.site.register(FlowchartQuestion ,FlowchartQuestionAdmin)
admin.site.register(Progress)
