from rest_framework import serializers
from .models import About
from rest_framework import serializers
from .models import About

class AboutSerializer(serializers.ModelSerializer):
    # Transformation des CloudinaryField en URL pour React
    historique_image_url = serializers.SerializerMethodField()
    vision_image_url = serializers.SerializerMethodField()
    organisation_image_url = serializers.SerializerMethodField()
    direction_image_url = serializers.SerializerMethodField()

    class Meta:
        model = About
        fields = '__all__'  # garde tous les champs du modèle

    # Méthodes pour générer les URLs
    def get_historique_image_url(self, obj):
        if obj.historique_image:
            return obj.historique_image.url
        return None

    def get_vision_image_url(self, obj):
        if obj.vision_image:
            return obj.vision_image.url
        return None

    def get_organisation_image_url(self, obj):
        if obj.organisation_image:
            return obj.organisation_image.url
        return None

    def get_direction_image_url(self, obj):
        if obj.direction_image:
            return obj.direction_image.url
        return None







from rest_framework import serializers
from .models import EquipeMember

class EquipeMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = EquipeMember
        fields = "__all__"

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None


from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'title_fr',
            'title_en',
            'description_fr',
            'description_en',
            'image',
            'is_active',
            'created_at',
            'updated_at'
        ]


from .models import News
# Base/serializers.py — remplace ton NewsSerializer par ceci

# Base/serializers.py — remplace ton NewsSerializer

from cloudinary.models import CloudinaryField

class NewsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = "__all__"

    def get_image_url(self, obj):
        """
        CloudinaryField.url retourne directement
        https://res.cloudinary.com/dqculak64/image/upload/...
        Pas besoin de request.build_absolute_uri()
        """
        if not obj.image:
            return None
        try:
            return obj.image.url  # URL Cloudinary complète
        except Exception:
            return None


# serializers.py
from rest_framework import serializers
from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    # URLs pour Cloudinary
    cover_photo_url = serializers.SerializerMethodField()
    image_1_url = serializers.SerializerMethodField()
    image_2_url = serializers.SerializerMethodField()
    image_3_url = serializers.SerializerMethodField()
    image_4_url = serializers.SerializerMethodField()
    image_5_url = serializers.SerializerMethodField()
    image_6_url = serializers.SerializerMethodField()
    image_7_url = serializers.SerializerMethodField()
    image_8_url = serializers.SerializerMethodField()
    image_9_url = serializers.SerializerMethodField()
    image_10_url = serializers.SerializerMethodField()
    image_11_url = serializers.SerializerMethodField()
    image_12_url = serializers.SerializerMethodField()
    image_13_url = serializers.SerializerMethodField()
    image_14_url = serializers.SerializerMethodField()
    image_15_url = serializers.SerializerMethodField()
    image_16_url = serializers.SerializerMethodField()
    image_17_url = serializers.SerializerMethodField()
    image_18_url = serializers.SerializerMethodField()
    image_19_url = serializers.SerializerMethodField()
    image_20_url = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = "__all__"  # Tous les champs + URLs

    # -------------------------------
    # Méthodes pour récupérer les URLs
    # -------------------------------
    def get_cover_photo_url(self, obj):
        return obj.cover_photo.url if obj.cover_photo else None

    def get_image_1_url(self, obj): return obj.image_1.url if obj.image_1 else None
    def get_image_2_url(self, obj): return obj.image_2.url if obj.image_2 else None
    def get_image_3_url(self, obj): return obj.image_3.url if obj.image_3 else None
    def get_image_4_url(self, obj): return obj.image_4.url if obj.image_4 else None
    def get_image_5_url(self, obj): return obj.image_5.url if obj.image_5 else None
    def get_image_6_url(self, obj): return obj.image_6.url if obj.image_6 else None
    def get_image_7_url(self, obj): return obj.image_7.url if obj.image_7 else None
    def get_image_8_url(self, obj): return obj.image_8.url if obj.image_8 else None
    def get_image_9_url(self, obj): return obj.image_9.url if obj.image_9 else None
    def get_image_10_url(self, obj): return obj.image_10.url if obj.image_10 else None
    def get_image_11_url(self, obj): return obj.image_11.url if obj.image_11 else None
    def get_image_12_url(self, obj): return obj.image_12.url if obj.image_12 else None
    def get_image_13_url(self, obj): return obj.image_13.url if obj.image_13 else None
    def get_image_14_url(self, obj): return obj.image_14.url if obj.image_14 else None
    def get_image_15_url(self, obj): return obj.image_15.url if obj.image_15 else None
    def get_image_16_url(self, obj): return obj.image_16.url if obj.image_16 else None
    def get_image_17_url(self, obj): return obj.image_17.url if obj.image_17 else None
    def get_image_18_url(self, obj): return obj.image_18.url if obj.image_18 else None
    def get_image_19_url(self, obj): return obj.image_19.url if obj.image_19 else None
    def get_image_20_url(self, obj): return obj.image_20.url if obj.image_20 else None
