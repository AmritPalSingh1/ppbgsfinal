from django.urls import path

from . import views

urlpatterns = [
    path('start', views.start, name="start"),
    path('final', views.final, name='final'),
    path('submit', views.submit, name='submit'),
    path('undo', views.undo, name='undo'),
]
