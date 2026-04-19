from typing import TypedDict

from apps.documents.models import Document
from django.db.models import Q


class DocumentRecord(TypedDict):
    id: int
    title: str
    category: str
    keywords: str
    file_url: str
    file_name: str
    mime_type: str
    file_size: int
    created_at: str


class DocumentRepository:
    @staticmethod
    def list_documents(*, query: str = "", limit: int = 10, offset: int = 0) -> list[DocumentRecord]:
        queryset = Document.objects.all()
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query)
                | Q(category__icontains=query)
                | Q(keywords__icontains=query)
            )
        queryset = queryset[offset : offset + limit]
        return [
            {
                "id": doc.id,
                "title": doc.title,
                "category": doc.category,
                "keywords": doc.keywords,
                "file_url": doc.file_url,
                "file_name": doc.file_name,
                "mime_type": doc.mime_type,
                "file_size": doc.file_size,
                "created_at": doc.created_at.isoformat(),
            }
            for doc in queryset
        ]

    @staticmethod
    def create_document(**data) -> DocumentRecord:
        document = Document.objects.create(**data)
        return {
            "id": document.id,
            "title": document.title,
            "category": document.category,
            "keywords": document.keywords,
            "file_url": document.file_url,
            "file_name": document.file_name,
            "mime_type": document.mime_type,
            "file_size": document.file_size,
            "created_at": document.created_at.isoformat(),
        }