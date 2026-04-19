from rest_framework import serializers


class UploadUrlRequestSerializer(serializers.Serializer):
    file_name = serializers.CharField(max_length=255)
    mime_type = serializers.CharField(max_length=120)
    file_size = serializers.IntegerField(min_value=1, max_value=10 * 1024 * 1024)


class DocumentCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    category = serializers.CharField(max_length=100)
    keywords = serializers.CharField(max_length=255, allow_blank=True, required=False)
    file_url = serializers.URLField(max_length=1000)
    file_name = serializers.CharField(max_length=255)
    mime_type = serializers.CharField(max_length=120)
    file_size = serializers.IntegerField(min_value=1, max_value=10 * 1024 * 1024)