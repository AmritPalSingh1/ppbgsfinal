from django import template
from userprogress.models import UserAttemptedChallenge

register = template.Library()

@register.filter
def get_user_grade(obj, user):
    return obj.get_user_grade(user)