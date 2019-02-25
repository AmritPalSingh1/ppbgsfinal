from django.contrib import admin

from .models import Topic, Video, Question, Pdf, Query, Comment

class TopicAdmin(admin.ModelAdmin):
    list_display = ('id', 'topicName')
    list_display_links = ('id', 'topicName')
    list_filter = ('id',)
    search_fields = ('topicName',)
    list_per_page = 10

class VideoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'key', 'topic')
    list_display_links = ('id', 'title')
    list_filter = ('topic', )
    search_fields = ('title', 'key', 'channelName', 'id')
    list_per_page = 25

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'topic')
    list_display_links = ('id', 'question')
    list_filter = ('topic',)
    search_fields = ('question', 'id')
    list_per_page = 25

class PdfAdmin(admin.ModelAdmin):
    list_display = ('id', 'topic', 'file')
    list_display_links = ('id', 'topic')
    list_filter = ('topic',)
    search_fields = ('file', 'id')

class QueryAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'topic', 'user', 'date')
    list_display_links = ('id', 'question')
    list_filter = ('topic', 'date')
    search_fields = ('question', 'id')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'comment', 'query', 'user', 'date')
    list_display_links = ('id', 'comment')
    list_filter = ('query', 'date')
    search_fields = ('comment', 'id')

admin.site.register(Topic, TopicAdmin)
admin.site.register(Video, VideoAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Pdf, PdfAdmin)
admin.site.register(Query, QueryAdmin)
admin.site.register(Comment, CommentAdmin)
