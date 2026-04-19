from django.contrib import admin

from .models import Comment, LibraryNotification, Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "score", "created_at")
    search_fields = ("title", "content")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "post", "author_name", "created_at")


@admin.register(LibraryNotification)
class LibraryNotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_at")
