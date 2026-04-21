import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Grid3x3, List, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import CONFIG from "../../config/config";

const Projects = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language.toUpperCase().substring(0, 2);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

  // Catégories avec t() pour multilingue
  const getCategoryTranslation = (value) => {
    const translations = {
      all: t('categories.all') || 'Tous les projets',
      selected_projects: t('categories.selected_projects') || 'Projets sélectionnés',
      adaptive_transformation: t('categories.adaptive_transformation') || 'Transformation adaptative',
      advisory_services: t('categories.advisory_services') || 'Services de conseil',
      aviation: t('categories.aviation') || 'Aviation',
      branded_environments: t('categories.branded_environments') || 'Environnements de marque',
      corporate_commercial: t('categories.corporate_commercial') || 'Corporate et commercial',
      cultural_civic: t('categories.cultural_civic') || 'Culturel et civique',
      federal: t('categories.federal') || 'Fédéral',
      health: t('categories.health') || 'Santé',
      health_education: t('categories.health_education') || 'Éducation à la santé',
      higher_education: t('categories.higher_education') || 'Enseignement supérieur',
      hospitality: t('categories.hospitality') || 'Hôtellerie',
      k12_education: t('categories.k12_education') || 'Éducation K-12',
      landscape_architecture: t('categories.landscape_architecture') || 'Architecture paysagère',
      residential: t('categories.residential') || 'Résidentiel',
      science_technology: t('categories.science_technology') || 'Science et technologie',
      sports_entertainment: t('categories.sports_entertainment') || 'Sports et divertissement',
      transportation: t('categories.transportation') || 'Transport',
      urban_design: t('categories.urban_design') || 'Design urbain',
      workplace: t('categories.workplace') || 'Espace de travail',
    };
    return translations[value] || value;
  };

  // Liste des catégories pour le dropdown
  const allCategories = [
    { value: "all" },
    { value: "selected_projects" },
    { value: "adaptive_transformation" },
    { value: "advisory_services" },
    { value: "aviation" },
    { value: "branded_environments" },
    { value: "corporate_commercial" },
    { value: "cultural_civic" },
    { value: "federal" },
    { value: "health" },
    { value: "health_education" },
    { value: "higher_education" },
    { value: "hospitality" },
    { value: "k12_education" },
    { value: "landscape_architecture" },
    { value: "residential" },
    { value: "science_technology" },
    { value: "sports_entertainment" },
    { value: "transportation" },
    { value: "urban_design" },
    { value: "workplace" },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${CONFIG.BASE_URL}/api/portfolio/`);
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();
        
        let projectsArray = [];
        if (Array.isArray(data)) {
          projectsArray = data;
        } else if (data.results && Array.isArray(data.results)) {
          projectsArray = data.results;
        }
        
        const activeProjects = projectsArray.filter(p => p.is_active === true);
        setProjects(activeProjects);
        setFilteredProjects(activeProjects);
      } catch (err) {
        console.error('Fetch error:', err);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) => p.category === selectedCategory)
      );
    }
  }, [selectedCategory, projects]);

  const getText = (project, field) => {
    if (!project) return '';
    return currentLang === 'FR' 
      ? (project[`${field}_fr`] || project[`${field}_en`] || '')
      : (project[`${field}_en`] || project[`${field}_fr`] || '');
  };

  const getCategoryLabel = (value) => {
    return getCategoryTranslation(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-gray-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Espace pour le header fixe - Augmenté */}
      <div className="h-32"></div>

      {/* Header Ultra Moderne avec Glass Morphism */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 ">
        <div className="max-w-[1900px] mx-auto px-6 lg:px-20 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Left: Dropdown + Count */}
            <div className="flex items-center gap-6 flex-1">
              {/* Dropdown Categories - Design moderne */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="group flex items-center gap-4 px-8 py-4 bg-black text-white hover:bg-gradient-to-r hover:from-black hover:to-gray-800 transition-all duration-500 text-base font-bold min-w-[320px] justify-between shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5" />
                    <span>{getCategoryLabel(selectedCategory)}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-3 w-[420px] bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl max-h-[75vh] overflow-y-auto z-50 rounded-lg">
                      <div className="p-2">
                        {allCategories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => {
                              setSelectedCategory(cat.value);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-6 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm font-medium ${
                              selectedCategory === cat.value 
                                ? 'bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black' 
                                : 'text-gray-700'
                            }`}
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {getCategoryTranslation(cat.value)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Project Count */}
              <div className="hidden lg:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full">
                <span className="text-2xl font-bold text-black" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {filteredProjects.length}
                </span>
                <span className="text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {currentLang === 'FR' ? 'projets' : 'projects'}
                </span>
              </div>
            </div>

            {/* Right: View Toggle */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-full transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-gray-400 hover:text-black hover:bg-white'
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-full transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-gray-400 hover:text-black hover:bg-white'
                }`}
                title="List View"
              >
                <List className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Poussé vers le centre et espacé du header */}
      <div className="max-w-[1900px] mx-auto px-6 lg:px-20 py-32">
        
        {/* Featured Work Title avec animation */}
        <div className="mb-20 flex items-center gap-8 group">
          <div className="w-32 h-0.5 bg-gradient-to-r from-black to-transparent group-hover:w-40 transition-all duration-500"></div>
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {t('projects.featured_work') || (currentLang === 'FR' ? 'Travaux en vedette' : 'Featured Work')}
          </h2>
        </div>
        
        {/* No projects */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-32">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {t('projects.no_projects') || (currentLang === 'FR' ? 'Aucun projet trouvé' : 'No projects found')}
              </h3>
              <p className="text-gray-600 mb-8 text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {currentLang === 'FR' ? 'Aucun projet dans' : 'No projects in'}: <strong>{getCategoryLabel(selectedCategory)}</strong>
              </p>
              {selectedCategory !== "all" && (
                <button 
                  onClick={() => setSelectedCategory("all")}
                  className="px-10 py-4 bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {t('projects.show_all') || (currentLang === 'FR' ? 'Afficher tous les projets' : 'Show All Projects')}
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Masonry Grid View - Images gardent leur aspect ratio */}
            {viewMode === 'grid' && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 lg:gap-4 space-y-3 lg:space-y-4">
                {filteredProjects.map((project) => {
                  const title = getText(project, 'project_name') || `Project ${project.id}`;
                  const location = getText(project, 'location');
                  const cover = project.cover_photo_url || project.cover_photo || project.image_1_url || "/placeholder.jpg";

                  return (
                    <div 
                      key={project.id}
                      className="break-inside-avoid cursor-pointer group mb-3 lg:mb-4"
                      onClick={() => navigate(`/portfolio/${project.id}`)}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      {/* Image Container - Garde l'aspect ratio de l'image */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 mb-2 transition-all duration-700">
                        <img
                          src={cover}
                          alt={title}
                          className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* Overlay gradient on hover */}
                        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> */}
                        
                        {/* Hover info */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {t('projects.view_project') || (currentLang === 'FR' ? 'Voir le projet' : 'View Project')} →
                          </p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="px-2">
                        <h3 
                          className="text-lg font-bold text-black mb-2 group-hover:text-gray-600 transition-colors duration-300 leading-tight"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {title}
                        </h3>
                        {location && (
                          <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {location}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List View - Tableau minimaliste moderne */}
            {viewMode === 'list' && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-8 pb-6 mb-8 border-b-2 border-black font-bold text-sm uppercase tracking-wider"
                     style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <div className="col-span-4">{t('projects.title') || (currentLang === 'FR' ? 'Titre' : 'Title')}</div>
                  <div className="col-span-3">{t('projects.location') || (currentLang === 'FR' ? 'Localisation' : 'Location')}</div>
                  <div className="col-span-2">{t('projects.year') || (currentLang === 'FR' ? 'Année' : 'Year')}</div>
                  <div className="col-span-3">{t('projects.size') || (currentLang === 'FR' ? 'Taille' : 'Size')}</div>
                </div>

                {/* Table Rows */}
                <div className="space-y-0">
                  {filteredProjects.map((project) => {
                    const title = getText(project, 'project_name') || `Project ${project.id}`;
                    const location = getText(project, 'location') || '—';
                    const completionDate = getText(project, 'completion_date') || '—';
                    const surface = getText(project, 'surface') || '—';

                    return (
                      <div 
                        key={project.id}
                        className="grid grid-cols-12 gap-8 py-6 border-b border-gray-200/60 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300 rounded-lg hover:shadow-md px-4 -mx-4"
                        onClick={() => navigate(`/portfolio/${project.id}`)}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        <div className="col-span-4 font-bold text-black hover:underline text-lg">
                          {title}
                        </div>
                        <div className="col-span-3 text-gray-600">
                          {location}
                        </div>
                        <div className="col-span-2 text-gray-600">
                          {completionDate}
                        </div>
                        <div className="col-span-3 text-gray-600">
                          {surface}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;