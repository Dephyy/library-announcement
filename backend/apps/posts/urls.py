from django.urls import path

from .views import PostCommentListCreateView, PostDetailView, PostListView, PostVoteView

urlpatterns = [
    path("", PostListView.as_view(), name="post-list"),
    path("<int:post_id>/", PostDetailView.as_view(), name="post-detail"),
    path("<int:post_id>/vote/", PostVoteView.as_view(), name="post-vote"),
    path("<int:post_id>/comments/", PostCommentListCreateView.as_view(), name="post-comments"),
]
