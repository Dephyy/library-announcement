from typing import TypedDict

from apps.posts.models import Comment, Post
from django.db.models import Count, F, Q


class PostRecord(TypedDict):
    id: int
    title: str
    content: str
    created_at: str
    comment_count: int
    score: int


class CommentRecord(TypedDict):
    id: int
    post_id: int
    author_name: str
    content: str
    created_at: str


class PostRepository:
    """Data-access layer for post reads."""

    @staticmethod
    def list_posts(
        *,
        query: str = "",
        limit: int = 10,
        offset: int = 0,
        sort: str = "new",
    ) -> list[PostRecord]:
        queryset = Post.objects.all().annotate(comment_count=Count("comments"))
        if query:
            queryset = queryset.filter(Q(title__icontains=query) | Q(content__icontains=query))

        sort_key = (sort or "new").lower()
        if sort_key == "top":
            queryset = queryset.order_by("-comment_count", "-created_at", "-id")
        elif sort_key == "hot":
            queryset = queryset.order_by("-score", "-comment_count", "-created_at", "-id")
        else:
            queryset = queryset.order_by("-created_at", "-id")

        queryset = queryset[offset : offset + limit]
        return [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "created_at": post.created_at.isoformat(),
                "comment_count": post.comment_count,
                "score": post.score,
            }
            for post in queryset
        ]

    @staticmethod
    def create_post(*, title: str, content: str) -> PostRecord:
        post = Post.objects.create(title=title, content=content)
        return {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "created_at": post.created_at.isoformat(),
            "comment_count": 0,
            "score": post.score,
        }

    @staticmethod
    def get_post(*, post_id: int) -> PostRecord | None:
        post = (
            Post.objects.filter(id=post_id)
            .annotate(comment_count=Count("comments"))
            .first()
        )
        if not post:
            return None
        return {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "created_at": post.created_at.isoformat(),
            "comment_count": post.comment_count,
            "score": post.score,
        }

    @staticmethod
    def list_comments(*, post_id: int) -> list[CommentRecord]:
        queryset = Comment.objects.filter(post_id=post_id)
        return [
            {
                "id": comment.id,
                "post_id": comment.post_id,
                "author_name": comment.author_name,
                "content": comment.content,
                "created_at": comment.created_at.isoformat(),
            }
            for comment in queryset
        ]

    @staticmethod
    def create_comment(*, post_id: int, author_name: str, content: str) -> CommentRecord:
        comment = Comment.objects.create(
            post_id=post_id,
            author_name=author_name,
            content=content,
        )
        return {
            "id": comment.id,
            "post_id": comment.post_id,
            "author_name": comment.author_name,
            "content": comment.content,
            "created_at": comment.created_at.isoformat(),
        }

    @staticmethod
    def apply_vote(*, post_id: int, direction: str) -> PostRecord | None:
        delta = 0
        if direction == "up":
            delta = 1
        elif direction == "down":
            delta = -1
        else:
            return None

        updated = Post.objects.filter(id=post_id).update(score=F("score") + delta)
        if not updated:
            return None
        return PostRepository.get_post(post_id=post_id)
