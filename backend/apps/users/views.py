from rest_framework.response import Response
from rest_framework.views import APIView

from services.auth_service import AuthService


class SessionView(APIView):
    def get(self, request):
        context = AuthService.get_session_context(request.user)
        return Response(context)