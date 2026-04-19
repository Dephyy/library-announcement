from django.db import models


class Document(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    keywords = models.CharField(max_length=255, blank=True, default="")
    file_url = models.URLField(max_length=1000)
    file_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=120)
    file_size = models.PositiveBigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self) -> str:
        return self.title