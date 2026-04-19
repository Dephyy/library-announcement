from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.documents.models import Document
from apps.posts.models import Comment, LibraryNotification, Post
from apps.users.models import UserProfile, UserRole


class Command(BaseCommand):
    help = "Seed demo forum and document data for local testing."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing posts/comments/documents before reseeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        reset = options["reset"]

        if reset:
            Comment.objects.all().delete()
            Post.objects.all().delete()
            LibraryNotification.objects.all().delete()
            Document.objects.all().delete()
            self.stdout.write(self.style.WARNING("Existing forum and document data cleared."))

        users = self._seed_users()
        posts = self._seed_posts_and_comments(users)
        notif_count = self._seed_notifications()
        docs = self._seed_documents()

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeding complete: {len(posts)} posts, {notif_count} notifications, {docs} documents."
            )
        )

    def _seed_users(self):
        User = get_user_model()

        seed_users = [
            ("admin", "Admin@123", "admin@batstateu.edu.ph", UserRole.ADMIN),
            ("librarian", "Lib@123", "librarian@batstateu.edu.ph", UserRole.LIBRARIAN),
            ("student1", "Student@123", "student1@batstateu.edu.ph", UserRole.STUDENT),
            ("student2", "Student@123", "student2@batstateu.edu.ph", UserRole.STUDENT),
        ]

        results = {}
        for username, password, email, role in seed_users:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={"email": email},
            )
            if created or not user.check_password(password):
                user.set_password(password)
                user.email = email
                user.save()

            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.role = role
            profile.save()
            results[username] = user

        return results

    def _seed_posts_and_comments(self, users):
        post_payloads = [
            {
                "title": "Library Operating Hours Update",
                "content": "Starting next week, weekday library hours are extended until 8:00 PM.",
                "comments": [
                    ("student1", "Will Saturday hours also be extended?"),
                    ("librarian", "Saturday remains 8:00 AM to 5:00 PM for now."),
                ],
            },
            {
                "title": "Thesis Consultation Schedule",
                "content": "Book your thesis consultation slots every Wednesday at the reference desk.",
                "comments": [
                    ("student2", "Can we reserve online?"),
                    ("admin", "Online reservation page will be published tomorrow."),
                ],
            },
            {
                "title": "New E-Journal Access",
                "content": "Engineering and IT journals were added to the digital repository this semester.",
                "comments": [
                    ("student1", "Can alumni access this too?"),
                    ("librarian", "Access is currently limited to active university accounts."),
                ],
            },
            {
                "title": "Forum Rules Reminder",
                "content": "Please keep discussions academic, respectful, and on-topic for all announcements.",
                "comments": [
                    ("admin", "Violations will be moderated as part of policy enforcement."),
                ],
            },
            {
                "title": "Printing Services Maintenance",
                "content": "The printing station will undergo maintenance Friday 1:00 PM to 3:00 PM.",
                "comments": [
                    ("student2", "Is there an alternative printing station?"),
                    ("librarian", "Yes, use the temporary station near the circulation desk."),
                ],
            },
        ]

        seeded_posts = []
        for payload in post_payloads:
            post, _ = Post.objects.get_or_create(
                title=payload["title"],
                defaults={"content": payload["content"]},
            )
            if post.content != payload["content"]:
                post.content = payload["content"]
                post.save(update_fields=["content"])

            for author_username, content in payload["comments"]:
                Comment.objects.get_or_create(
                    post=post,
                    author_name=author_username,
                    content=content,
                )

            seeded_posts.append(post)

        score_seed = [3, 18, 7, 0, 11]
        for idx, post in enumerate(seeded_posts):
            target = score_seed[idx % len(score_seed)]
            if post.score != target:
                post.score = target
                post.save(update_fields=["score"])

        return seeded_posts

    def _seed_notifications(self):
        payloads = [
            {
                "title": "Reading week extended hours",
                "body": "Main library stays open until 9 PM during finals week.",
            },
            {
                "title": "New JSTOR collections",
                "body": "Additional engineering archives are now available on campus VPN.",
            },
            {
                "title": "Workshop: citation tools",
                "body": "Join Friday 2 PM at the digital scholarship lab.",
            },
        ]
        count = 0
        for payload in payloads:
            _, created = LibraryNotification.objects.get_or_create(
                title=payload["title"],
                defaults={"body": payload["body"]},
            )
            if created:
                count += 1
        return LibraryNotification.objects.count()

    def _seed_documents(self):
        documents = [
            {
                "title": "Library Handbook 2026",
                "category": "Handbook",
                "keywords": "policy,library,rules",
                "file_url": "http://localhost:8000/uploads/seed-library-handbook-2026.pdf",
                "file_name": "library-handbook-2026.pdf",
                "mime_type": "application/pdf",
                "file_size": 245760,
            },
            {
                "title": "Thesis Formatting Guide",
                "category": "Research",
                "keywords": "thesis,format,guide",
                "file_url": "http://localhost:8000/uploads/seed-thesis-formatting-guide.pdf",
                "file_name": "thesis-formatting-guide.pdf",
                "mime_type": "application/pdf",
                "file_size": 184320,
            },
            {
                "title": "E-Resources Access Manual",
                "category": "Manual",
                "keywords": "eresources,digital,manual",
                "file_url": "http://localhost:8000/uploads/seed-eresources-access-manual.pdf",
                "file_name": "eresources-access-manual.pdf",
                "mime_type": "application/pdf",
                "file_size": 163840,
            },
            {
                "title": "Circulation Workflow",
                "category": "Operations",
                "keywords": "circulation,workflow,library",
                "file_url": "http://localhost:8000/uploads/seed-circulation-workflow.pdf",
                "file_name": "circulation-workflow.pdf",
                "mime_type": "application/pdf",
                "file_size": 102400,
            },
            {
                "title": "Reference Services Overview",
                "category": "Reference",
                "keywords": "reference,services,overview",
                "file_url": "http://localhost:8000/uploads/seed-reference-services-overview.pdf",
                "file_name": "reference-services-overview.pdf",
                "mime_type": "application/pdf",
                "file_size": 131072,
            },
        ]

        created_count = 0
        for payload in documents:
            _, created = Document.objects.get_or_create(
                title=payload["title"],
                defaults=payload,
            )
            if created:
                created_count += 1

        return created_count