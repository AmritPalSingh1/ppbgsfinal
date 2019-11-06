from django import template
from userprogress.models import UserAttemptedChallenge
from pages.views import get_all_topics_progress

register = template.Library()

@register.filter
def get_user_progress(obj, user):
    topics_progress = get_all_topics_progress(user)
    average = 0
    for key in topics_progress:
      average = average + topics_progress[key]
    return average//10
      