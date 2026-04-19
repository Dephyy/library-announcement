import os
import secrets
from pathlib import Path

from repositories.documents.document_repository import DocumentRecord, DocumentRepository


ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
}


class DocumentService:
    @staticmethod
    def list_documents(*, query: str = "", limit: int = 10, offset: int = 0) -> list[DocumentRecord]:
        return DocumentRepository.list_documents(query=query, limit=limit, offset=offset)

    @staticmethod
    def request_upload_url(*, file_name: str, mime_type: str, file_size: int) -> dict:
        if mime_type not in ALLOWED_MIME_TYPES:
            raise ValueError("Unsupported file type")

        safe_name = Path(file_name).name
        token = secrets.token_hex(8)
        object_name = f"{token}-{safe_name}"
        upload_path = Path("uploads") / object_name

        return {
            "upload_url": f"http://localhost:8000/api/documents/local-upload/{object_name}",
            "file_url": f"http://localhost:8000/uploads/{object_name}",
            "object_name": object_name,
            "max_file_size": file_size,
            "mime_type": mime_type,
            "upload_path": str(upload_path),
        }

    @staticmethod
    def create_document(**data) -> DocumentRecord:
        data["title"] = data["title"].strip()
        data["category"] = data["category"].strip()
        data["keywords"] = data.get("keywords", "").strip()
        return DocumentRepository.create_document(**data)

    @staticmethod
    def ensure_upload_directory() -> None:
        os.makedirs("uploads", exist_ok=True)