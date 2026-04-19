from django.urls import path

from .views import DocumentListCreateView, DocumentUploadUrlView, LocalUploadView

urlpatterns = [
    path("", DocumentListCreateView.as_view(), name="document-list-create"),
    path("upload-url/", DocumentUploadUrlView.as_view(), name="document-upload-url"),
    path("local-upload/<str:object_name>", LocalUploadView.as_view(), name="document-local-upload"),
]