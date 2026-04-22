from django.db import models

from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone
from cloudinary.models import CloudinaryField
from django.utils import translation




class About(models.Model):
    # =========================
    # HISTORIQUE
    # =========================
    historique_title_fr = models.CharField(
        max_length=255, verbose_name="Titre Historique (FR)"
    )
    historique_title_en = models.CharField(
        max_length=255, verbose_name="History Title (EN)", blank=True, null=True
    )

    historique_description_fr = models.TextField(
        verbose_name="Description Historique (FR)"
    )
    historique_description_en = models.TextField(
        verbose_name="History Description (EN)", blank=True, null=True
    )

    historique_image = CloudinaryField(
        'Historique Image', folder='about/historique', blank=True, null=True
    )

    # =========================
    # VISION / MISSION / VALEURS
    # =========================
    vision_title_fr = models.CharField(max_length=255)
    vision_title_en = models.CharField(max_length=255, blank=True, null=True)

    vision_description_fr = models.TextField()
    vision_description_en = models.TextField(blank=True, null=True)

    vision_image = CloudinaryField(
        'Vision Image', folder='about/vision', blank=True, null=True
    )

    # =========================
    # ORGANISATION & GOUVERNANCE
    # =========================
    organisation_title_fr = models.CharField(max_length=255)
    organisation_title_en = models.CharField(max_length=255, blank=True, null=True)

    organisation_description_fr = models.TextField()
    organisation_description_en = models.TextField(blank=True, null=True)

    organisation_image = CloudinaryField(
        'Organisation Image', folder='about/organisation', blank=True, null=True
    )

    # =========================
    # MESSAGE DE LA DIRECTION
    # =========================
    direction_title_fr = models.CharField(max_length=255)
    direction_title_en = models.CharField(max_length=255, blank=True, null=True)

    direction_message_fr = models.TextField()
    direction_message_en = models.TextField(blank=True, null=True)

    direction_image = CloudinaryField(
        'Direction Image', folder='about/direction', blank=True, null=True
    )

    # =========================
    # META
    # =========================
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About"
        verbose_name_plural = "About"
        ordering = ['-created_at']

    def __str__(self):
        return self.historique_title_fr




from django.db import models
from django.utils import timezone
from cloudinary.models import CloudinaryField

class EquipeMember(models.Model):

    ROLE_CHOICES = (
        ("dirigeant", "Dirigeant"),
        ("membre", "Membre"),
    )

    # 🧑 Identité
    full_name = models.CharField(max_length=255)

    # 🏷️ Poste (FR / EN)
    position_fr = models.CharField(
        max_length=255,
        verbose_name="Poste (FR)"
    )
    position_en = models.CharField(
        max_length=255,
        verbose_name="Position (EN)",
        blank=True,
        null=True
    )

    # 📝 Bio (FR / EN)
    bio_fr = models.TextField(
        verbose_name="Biographie (FR)",
        blank=True,
        null=True
    )
    bio_en = models.TextField(
        verbose_name="Biography (EN)",
        blank=True,
        null=True
    )

    # 🖼️ Photo (Cloudinary)
    photo = CloudinaryField(
        "Photo",
        folder="team",
        blank=True,
        null=True
    )

       # 🖼️ Cover image (Cloudinary)
    cover_image = CloudinaryField(
        "Cover Image",
        folder="team/covers",
        blank=True,
        null=True
    )


    # 🔗 Contacts
    email = models.EmailField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)

    # 👑 Rôle dans l’équipe
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="membre"
    )

    # ⚡ Flag pratique (JSX accepte les deux)
    is_leader = models.BooleanField(
        default=False,
        help_text="Coché si membre dirigeant"
    )

    # 🔄 État
    is_active = models.BooleanField(default=True)

    # ⏱️ Dates
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Membre d'équipe"
        verbose_name_plural = "Membres d'équipe"
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.role})"



from django.db import models

class Service(models.Model):
    title_fr = models.CharField("Titre (FR)", max_length=255)
    title_en = models.CharField("Title (EN)", max_length=255, blank=True, null=True)
    description_fr = models.TextField("Description (FR)", blank=True, null=True)
    description_en = models.TextField("Description (EN)", blank=True, null=True)
    image = models.URLField("Image", blank=True, null=True)  # Cloudinary URL
    is_active = models.BooleanField("Actif", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Retourne le titre selon la langue par défaut
        from django.utils import translation
        lang = translation.get_language() or 'en'
        if lang.startswith('fr'):
            return self.title_fr or self.title_en or ""
        return self.title_en or self.title_fr or ""






class News(models.Model):
    title_fr = models.CharField(max_length=255, verbose_name="Titre (FR)")
    title_en = models.CharField(max_length=255, verbose_name="Title (EN)", blank=True, null=True)

    content_fr = models.TextField(verbose_name="Contenu (FR)")
    content_en = models.TextField(verbose_name="Content (EN)", blank=True, null=True)

    image = CloudinaryField('Image', folder='news', blank=True, null=True)

    is_active = models.BooleanField(default=True)  # 👈 ajouté ici

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "News"
        verbose_name_plural = "News"
        ordering = ["-created_at"]

    @property
    def display_title(self):
        lang = translation.get_language() or "en"
        return self.title_fr if lang.startswith("fr") else self.title_en or self.title_fr


from django.db import models
from cloudinary.models import CloudinaryField
from django.utils import timezone

# models.py
from django.db import models
from cloudinary.models import CloudinaryField
from django.utils import timezone


class Portfolio(models.Model):

    # =========================
    # CATÉGORIES (EN ONLY)
    # =========================
    CATEGORY_CHOICES = [
        ("selected_projects", "Selected Projects"),
        ("adaptive_transformation", "Adaptive Transformation"),
        ("advisory_services", "Advisory Services"),
        ("aviation", "Aviation"),
        ("branded_environments", "Branded Environments"),
        ("corporate_commercial", "Corporate and Commercial"),
        ("cultural_civic", "Cultural and Civic"),
        ("federal", "Federal"),
        ("health", "Health"),
        ("health_education", "Health Education"),
        ("higher_education", "Higher Education"),
        ("hospitality", "Hospitality"),
        ("k12_education", "K-12 Education"),
        ("landscape_architecture", "Landscape Architecture"),
        ("residential", "Residential"),
        ("science_technology", "Science and Technology"),
        ("sports_entertainment", "Sports, Recreation, and Entertainment"),
        ("transportation", "Transportation"),
        ("urban_design", "Urban Design"),
        ("workplace", "Workplace"),
    ]

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        blank=True,
        null=True,
        verbose_name="Category"
    )

    # =========================
    # NOM DU PROJET
    # =========================
    project_name_fr = models.CharField(max_length=255, blank=True, null=True)
    project_name_en = models.CharField(max_length=255, blank=True, null=True)

    # =========================
    # LOCALISATION
    # =========================
    location_fr = models.CharField(max_length=255, blank=True, null=True)
    location_en = models.CharField(max_length=255, blank=True, null=True)

    # =========================
    # TITRE DESCRIPTION
    # =========================
    description_title_fr = models.CharField(max_length=255, blank=True, null=True)
    description_title_en = models.CharField(max_length=255, blank=True, null=True)

    # =========================
    # DESCRIPTION
    # =========================
    description_fr = models.TextField(blank=True, null=True)
    description_en = models.TextField(blank=True, null=True)

    # =========================
    # CLIENT
    # =========================
    client_fr = models.CharField(max_length=255, blank=True, null=True)
    client_en = models.CharField(max_length=255, blank=True, null=True)

    # =========================
    # SURFACE
    # =========================
    surface_fr = models.CharField(max_length=255, blank=True, null=True)
    surface_en = models.CharField(max_length=255, blank=True, null=True)

    # =========================
    # DATE DE RÉALISATION
    # =========================
    completion_date_fr = models.CharField(max_length=255, blank=True, null=True)
    completion_date_en = models.CharField(max_length=255, blank=True, null=True)

    # =========================
    # IMAGE PRINCIPALE
    # =========================
    cover_photo = CloudinaryField('Cover Photo', folder='portfolio/cover', blank=True, null=True)

    # =========================
    # IMAGES (1 → 20)
    # =========================
    image_1 = CloudinaryField('Image 1', folder='portfolio/images', blank=True, null=True)
    image_2 = CloudinaryField('Image 2', folder='portfolio/images', blank=True, null=True)
    image_3 = CloudinaryField('Image 3', folder='portfolio/images', blank=True, null=True)
    image_4 = CloudinaryField('Image 4', folder='portfolio/images', blank=True, null=True)
    image_5 = CloudinaryField('Image 5', folder='portfolio/images', blank=True, null=True)
    image_6 = CloudinaryField('Image 6', folder='portfolio/images', blank=True, null=True)
    image_7 = CloudinaryField('Image 7', folder='portfolio/images', blank=True, null=True)
    image_8 = CloudinaryField('Image 8', folder='portfolio/images', blank=True, null=True)
    image_9 = CloudinaryField('Image 9', folder='portfolio/images', blank=True, null=True)
    image_10 = CloudinaryField('Image 10', folder='portfolio/images', blank=True, null=True)
    image_11 = CloudinaryField('Image 11', folder='portfolio/images', blank=True, null=True)
    image_12 = CloudinaryField('Image 12', folder='portfolio/images', blank=True, null=True)
    image_13 = CloudinaryField('Image 13', folder='portfolio/images', blank=True, null=True)
    image_14 = CloudinaryField('Image 14', folder='portfolio/images', blank=True, null=True)
    image_15 = CloudinaryField('Image 15', folder='portfolio/images', blank=True, null=True)
    image_16 = CloudinaryField('Image 16', folder='portfolio/images', blank=True, null=True)
    image_17 = CloudinaryField('Image 17', folder='portfolio/images', blank=True, null=True)
    image_18 = CloudinaryField('Image 18', folder='portfolio/images', blank=True, null=True)
    image_19 = CloudinaryField('Image 19', folder='portfolio/images', blank=True, null=True)
    image_20 = CloudinaryField('Image 20', folder='portfolio/images', blank=True, null=True)

    # =========================
    # META
    # =========================
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.project_name_en or self.project_name_fr or "Portfolio Project"
