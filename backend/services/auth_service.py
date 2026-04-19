from typing import TypedDict


class SessionContext(TypedDict):
    is_authenticated: bool
    username: str | None
    role: str | None


class AuthService:
    @staticmethod
    def get_session_context(user) -> SessionContext:
        if not user or not user.is_authenticated:
            return {
                "is_authenticated": False,
                "username": None,
                "role": None,
            }

        role = None
        profile = getattr(user, "profile", None)
        if profile is not None:
            role = profile.role

        return {
            "is_authenticated": True,
            "username": user.get_username(),
            "role": role,
        }