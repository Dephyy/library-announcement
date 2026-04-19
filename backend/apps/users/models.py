from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    LIBRARIAN = "LIBRARIAN", "Librarian"
    STUDENT = "STUDENT", "Student"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.STUDENT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.user.username} ({self.role})"
