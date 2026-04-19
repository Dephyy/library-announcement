from rest_framework import serializers


class PostCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    content = serializers.CharField(max_length=5000)


class CommentCreateSerializer(serializers.Serializer):
    author_name = serializers.CharField(max_length=120)
    content = serializers.CharField(max_length=2000)


class PostVoteSerializer(serializers.Serializer):
    direction = serializers.ChoiceField(choices=("up", "down"))
