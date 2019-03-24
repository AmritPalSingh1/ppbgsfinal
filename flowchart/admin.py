from django.contrib import admin

# Register your models here.

from .models import FlowchartQuestion, Progress



admin.site.register(FlowchartQuestion)
admin.site.register(Progress)
