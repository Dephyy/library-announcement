from pathlib import Path

from django.conf import settings
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DocumentCreateSerializer, UploadUrlRequestSerializer
from services.documents.document_service import DocumentService


class DocumentListCreateView(APIView):
    def get(self, request):
        query = request.query_params.get("q", "").strip()
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

        documents = DocumentService.list_documents(query=query, limit=limit, offset=offset)
        return Response({"results": documents})

    def post(self, request):
        serializer = DocumentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        document = DocumentService.create_document(**serializer.validated_data)
        return Response(document, status=status.HTTP_201_CREATED)


class DocumentUploadUrlView(APIView):
    def post(self, request):
        serializer = UploadUrlRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            payload = DocumentService.request_upload_url(**serializer.validated_data)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(payload)


class LocalUploadView(APIView):
    def put(self, request, object_name: str):
        DocumentService.ensure_upload_directory()

        if not request.body:
            return Response({"detail": "File body is required"}, status=status.HTTP_400_BAD_REQUEST)

        upload_dir = Path(settings.BASE_DIR) / "uploads"
        target = upload_dir / Path(object_name).name
        target.write_bytes(request.body)
        return HttpResponse(status=200)