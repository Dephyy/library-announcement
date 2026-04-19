from repositories.post_repository import CommentRecord, PostRecord, PostRepository


class PostService:
    """Business logic layer for post operations."""

    @staticmethod
    def list_posts(
        *,
        query: str = "",
        limit: int = 10,
        offset: int = 0,
        sort: str = "new",
    ) -> list[PostRecord]:
        posts = PostRepository.list_posts(query=query, limit=limit, offset=offset, sort=sort)
        if posts:
            return posts

        # Provide a stable first-run record until admin CRUD is added.
        return [
            {
                "id": 0,
                "title": "No announcements yet",
                "content": "The system is ready. Add the first post in Step 6.",
                "created_at": "",
                "comment_count": 0,
                "score": 0,
            }
        ]

    @staticmethod
    def create_post(*, title: str, content: str) -> PostRecord:
        sanitized_title = title.strip()
        sanitized_content = content.strip()
        return PostRepository.create_post(title=sanitized_title, content=sanitized_content)

    @staticmethod
    def get_post(*, post_id: int) -> PostRecord | None:
        return PostRepository.get_post(post_id=post_id)

    @staticmethod
    def list_comments(*, post_id: int) -> list[CommentRecord]:
        return PostRepository.list_comments(post_id=post_id)

    @staticmethod
    def create_comment(*, post_id: int, author_name: str, content: str) -> CommentRecord:
        sanitized_author = author_name.strip()
        sanitized_content = content.strip()
        return PostRepository.create_comment(
            post_id=post_id,
            author_name=sanitized_author,
            content=sanitized_content,
        )

    @staticmethod
    def vote_post(*, post_id: int, direction: str) -> PostRecord | None:
        return PostRepository.apply_vote(post_id=post_id, direction=direction)
