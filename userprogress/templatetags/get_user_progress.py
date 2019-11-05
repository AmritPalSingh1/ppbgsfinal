from django import template
from userprogress.models import UserAttemptedChallenge

register = template.Library()

@register.filter
def get_user_progress(obj, user):
    return obj.get_user_progress(user)