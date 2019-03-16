from django.contrib import admin

# Register your models here.

from .models import Challenge, DoublePoint, FreeWin, Hint



admin.site.register(Challenge)
admin.site.register(DoublePoint)
admin.site.register(FreeWin)
admin.site.register(Hint)
