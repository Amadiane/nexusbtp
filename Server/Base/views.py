# from django.shortcuts import render


# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth import authenticate
# from rest_framework_simplejwt.tokens import RefreshToken

# class LoginView(APIView):
#     permission_classes = []

#     def post(self, request):
#         email = request.data.get("email") or request.data.get("username")
#         password = request.data.get("password")

#         if not email or not password:
#             return Response(
#                 {"detail": "Email et mot de passe requis"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         user = authenticate(username=email, password=password)

#         if user is None:
#             return Response(
#                 {"detail": "Identifiants incorrects"},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )

#         refresh = RefreshToken.for_user(user)

#         return Response({
#             "refresh": str(refresh),
#             "access": str(refresh.access_token),
#             "user": {
#                 "id": user.id,
#                 "email": user.email,
#                 "username": user.username
#             }
#         })


# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAdminUser
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator

# from .models import About
# from .serializers import AboutSerializer


# @method_decorator(csrf_exempt, name='dispatch')
# class AboutViewSet(viewsets.ModelViewSet):
#     """
#     CRUD complet pour la section About
#     """
#     queryset = About.objects.all()
#     serializer_class = AboutSerializer

#     def get_permissions(self):
#         """
#         DEV :
#         - Lecture publique
#         - Création / modification / suppression autorisées
#         PROD :
#         - Remplacer AllowAny par IsAdminUser
#         """
#         return [AllowAny()]

#         # 🔐 Version PROD (à activer plus tard)
#         # if self.action in ['list', 'retrieve']:
#         #     return [AllowAny()]
#         # return [IsAdminUser()]

#     def list(self, request, *args, **kwargs):
#         """
#         GET /api/about/
#         """
#         serializer = self.get_serializer(self.get_queryset(), many=True)
#         return Response(serializer.data)

#     def retrieve(self, request, *args, **kwargs):
#         """
#         GET /api/about/{id}/
#         """
#         serializer = self.get_serializer(self.get_object())
#         return Response(serializer.data)

#     def create(self, request, *args, **kwargs):
#         """
#         POST /api/about/
#         """
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def update(self, request, *args, **kwargs):
#         """
#         PUT /api/about/{id}/
#         """
#         serializer = self.get_serializer(
#             self.get_object(),
#             data=request.data
#         )
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

#     def partial_update(self, request, *args, **kwargs):
#         """
#         PATCH /api/about/{id}/
#         """
#         serializer = self.get_serializer(
#             self.get_object(),
#             data=request.data,
#             partial=True
#         )
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

#     def destroy(self, request, *args, **kwargs):
#         """
#         DELETE /api/about/{id}/
#         """
#         self.get_object().delete()
#         return Response(
#             {"detail": "Contenu About supprimé avec succès"},
#             status=status.HTTP_204_NO_CONTENT
#         )




# # Base/views.py — remplace ton EquipeMemberViewSet

# from rest_framework import viewsets
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import EquipeMember
# from .serializers import EquipeMemberSerializer

# class EquipeMemberViewSet(viewsets.ModelViewSet):
#     queryset = EquipeMember.objects.all()
#     serializer_class = EquipeMemberSerializer

#     def get_permissions(self):
#         """
#         GET (list/retrieve) → public, pas de token requis
#         POST/PUT/PATCH/DELETE → authentification requise
#         """
#         if self.action in ['list', 'retrieve']:
#             return [AllowAny()]
#         return [IsAuthenticated()]




# # Base/views.py
# from rest_framework.viewsets import ModelViewSet
# from .models import Service
# from .serializers import ServiceSerializer

# class ServiceViewSet(ModelViewSet):
#     queryset = Service.objects.all().order_by("-created_at")
#     serializer_class = ServiceSerializer


# # ------------------------------
# # News ViewSet
# # ------------------------------

# from rest_framework.viewsets import ModelViewSet
# from .models import News
# from .serializers import NewsSerializer
# # ──────────────────────────────────────────────────────────────
# # Dans Base/views.py — remplace ton NewsViewSet existant par ceci
# # ──────────────────────────────────────────────────────────────

# from rest_framework import viewsets
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import News
# from .serializers import NewsSerializer

# class NewsViewSet(viewsets.ModelViewSet):
#     queryset = News.objects.all().order_by('-created_at')
#     serializer_class = NewsSerializer

#     def get_permissions(self):
#         """
#         - GET (list / retrieve) : public, pas besoin de token
#         - POST / PUT / PATCH / DELETE : authentification requise
#         """
#         if self.action in ['list', 'retrieve']:
#             return [AllowAny()]
#         return [IsAuthenticated()]



# # Base/views.py

# from rest_framework import viewsets
# from rest_framework.parsers import MultiPartParser, FormParser
# from .models import Portfolio
# from .serializers import PortfolioSerializer

# class PortfolioViewSet(viewsets.ModelViewSet):
#     queryset = Portfolio.objects.all()
#     serializer_class = PortfolioSerializer
#     parser_classes = [MultiPartParser, FormParser]  # <- IMPORTANT pour recevoir les fichiers


from django.shortcuts import render
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import About, EquipeMember, News, Service, Portfolio
from .serializers import (
    AboutSerializer, EquipeMemberSerializer,
    NewsSerializer, ServiceSerializer, PortfolioSerializer
)


# ══════════════════════════════════════════════════════
# Mixin réutilisable — lecture publique, écriture protégée
# ══════════════════════════════════════════════════════
class PublicReadPrivateWriteMixin:
    """
    - GET list / retrieve  → AllowAny  (pas besoin de token)
    - POST / PUT / PATCH / DELETE → IsAuthenticated (token JWT requis)

    Le trick : on vide authentication_classes pour les actions publiques
    pour éviter que DEFAULT_PERMISSION_CLASSES=IsAuthenticated du settings
    ne bloque avant même qu'on arrive à get_permissions().
    """

    def get_authenticators(self):
        if self.request.method == 'GET':
            return []  # Pas d'auth pour la lecture
        return [JWTAuthentication()]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]


# ══════════════════════════════════════════════════════
# LOGIN
# ══════════════════════════════════════════════════════
class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email    = request.data.get("email") or request.data.get("username")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email et mot de passe requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=email, password=password)

        if user is None:
            return Response(
                {"detail": "Identifiants incorrects"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access":  str(refresh.access_token),
            "user": {
                "id":       user.id,
                "email":    user.email,
                "username": user.username,
            }
        })


# ══════════════════════════════════════════════════════
# ABOUT — tout public (lecture + écriture) pour l'instant
# ══════════════════════════════════════════════════════
@method_decorator(csrf_exempt, name='dispatch')
class AboutViewSet(viewsets.ModelViewSet):
    queryset          = About.objects.all()
    serializer_class  = AboutSerializer
    authentication_classes = []
    permission_classes     = [AllowAny]


# ══════════════════════════════════════════════════════
# ÉQUIPE
# ══════════════════════════════════════════════════════
class EquipeMemberViewSet(PublicReadPrivateWriteMixin, viewsets.ModelViewSet):
    queryset         = EquipeMember.objects.all()
    serializer_class = EquipeMemberSerializer


# ══════════════════════════════════════════════════════
# NEWS
# ══════════════════════════════════════════════════════
class NewsViewSet(PublicReadPrivateWriteMixin, viewsets.ModelViewSet):
    queryset         = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer


# ══════════════════════════════════════════════════════
# SERVICES
# ══════════════════════════════════════════════════════
class ServiceViewSet(PublicReadPrivateWriteMixin, viewsets.ModelViewSet):
    queryset         = Service.objects.all().order_by('-created_at')
    serializer_class = ServiceSerializer


# ══════════════════════════════════════════════════════
# PORTFOLIO
# ══════════════════════════════════════════════════════
class PortfolioViewSet(PublicReadPrivateWriteMixin, viewsets.ModelViewSet):
    queryset         = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    parser_classes   = [MultiPartParser, FormParser]