from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AboutViewSet, EquipeMemberViewSet, ServiceViewSet, NewsViewSet, PortfolioViewSet, LoginView




router = DefaultRouter()
router.register(r'about', AboutViewSet, basename='about')
router.register(r'equipe-members', EquipeMemberViewSet, basename='equipe_member')
router.register(r"services", ServiceViewSet, basename="services")
router.register(r'news', NewsViewSet, basename='news')
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')


urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
  

]