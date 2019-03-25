from django import template
from userprogress.models import UserAttemptedChallenge

register = template.Library()

@register.filter
def get_user_rank(obj, user):
    return obj.get_user_rank(user)