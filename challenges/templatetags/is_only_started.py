from django import template
from challenges.models import Challenge

register = template.Library()

@register.filter
def is_only_started(obj, user):
    return obj.is_only_started(user)