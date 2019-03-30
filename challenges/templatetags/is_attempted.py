from django import template
from challenges.models import Challenge

register = template.Library()

@register.filter
def is_attempted(obj, user):
    return obj.is_attempted(user)