from rest_framework.response import Response
from rest_framework.views import APIView

from apps.posts.models import LibraryNotification
from .serializers import (
    CommentCreateSerializer,
    PostCreateSerializer,
    PostVoteSerializer,
)
from services.post_service import PostService


class PostListView(APIView):
    """API endpoint for listing posts."""

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        sort = request.query_params.get("sort", "new").strip() or "new"
        try:
            limit = int(request.query_params.get("limit", 10))
        except (TypeError, ValueError):
            limit = 10
        try:
            offset = int(request.query_params.get("offset", 0))
        except (TypeError, ValueError):
            offset = 0
        limit = max(1, min(limit, 50))
        offset = max(0, offset)

        if sort not in ("new", "top", "hot"):
            sort = "new"

        posts = PostService.list_posts(query=query, limit=limit, offset=offset, sort=sort)
        return Response({"results": posts})

    def post(self, request):
        serializer = PostCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = PostService.create_post(**serializer.validated_data)
        return Response(post, status=201)


class PostDetailView(APIView):
    def get(self, request, post_id: int):
        post = PostService.get_post(post_id=post_id)
        if not post:
            return Response({"detail": "Post not found"}, status=404)
        return Response(post)


class PostVoteView(APIView):
    """Adjust net score for a post (local testing; no per-user deduplication)."""

    def post(self, request, post_id: int):
        serializer = PostVoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        direction = serializer.validated_data["direction"]
        post = PostService.vote_post(post_id=post_id, direction=direction)
        if not post:
            return Response({"detail": "Post not found"}, status=404)
        return Response(
            {
                "id": post["id"],
                "score": post["score"],
                "comment_count": post["comment_count"],
            }
        )


class PostCommentListCreateView(APIView):
    def get(self, request, post_id: int):
        post = PostService.get_post(post_id=post_id)
        if not post:
            return Response({"detail": "Post not found"}, status=404)
        comments = PostService.list_comments(post_id=post_id)
        return Response({"results": comments})

    def post(self, request, post_id: int):
        post = PostService.get_post(post_id=post_id)
        if not post:
            return Response({"detail": "Post not found"}, status=404)
        serializer = CommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = PostService.create_comment(post_id=post_id, **serializer.validated_data)
        return Response(comment, status=201)


class NotificationListView(APIView):
    """Demo notifications for UI testing."""

    def get(self, request):
        try:
            limit = int(request.query_params.get("limit", 20))
        except (TypeError, ValueError):
            limit = 20
        limit = max(1, min(limit, 50))

        rows = LibraryNotification.objects.all().order_by("-created_at", "-id")[:limit]
        return Response(
            {
                "results": [
                    {
                        "id": n.id,
                        "title": n.title,
                        "body": n.body,
                        "created_at": n.created_at.isoformat(),
                    }
                    for n in rows
                ]
            }
        )
