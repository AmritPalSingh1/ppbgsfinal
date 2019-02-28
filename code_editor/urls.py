from django.urls import path
from . import views

urlpatterns = [
    path('', views.code_editor, name='code_editor'),
]
