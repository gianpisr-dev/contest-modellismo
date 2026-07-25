/**
 * Contest Modellismo - Main JavaScript
 * Entry point for the application
 */

// Sample data - Replace with API calls later
const sampleModels = [
    {
        id: 1,
        title: "Ferrari F40",
        category: "Auto",
        description: "Modello in scala 1:43 della Ferrari F40 classica",
        image: "https://via.placeholder.com/300x250?text=Ferrari+F40"
    },
    {
        id: 2,
        title: "Spitfire MkIX",
        category: "Aerei",
        description: "Fighter britannico della II guerra mondiale",
        image: "https://via.placeholder.com/300x250?text=Spitfire"
    },
    {
        id: 3,
        title: "HMS Victory",
        category: "Navi",
        description: "Nave da guerra britannica del XVIII secolo",
        image: "https://via.placeholder.com/300x250?text=HMS+Victory"
    }
];

/**
 * Initialize the application
 */
function init() {
    console.log('Contest Modellismo - Application initialized');
    loadGallery();
    setupEventListeners();
}

/**
 * Load and render gallery items
 */
function loadGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    
    // Clear placeholder
    galleryGrid.innerHTML = '';
    
    // Render items
    sampleModels.forEach(model => {
        const item = createGalleryItem(model);
        galleryGrid.appendChild(item);
    });
}

/**
 * Create a gallery item DOM element
 * @param {Object} model - Model data
 * @returns {HTMLElement} - Gallery item element
 */
function createGalleryItem(model) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <img src="${model.image}" alt="${model.title}" onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
        <div class="gallery-item-content">
            <span class="badge" style="display: inline-block; background: #dbeafe; color: #0369a1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; margin-bottom: 0.5rem;">
                ${model.category}
            </span>
            <h3>${model.title}</h3>
            <p>${model.description}</p>
        </div>
    `;
    
    item.addEventListener('click', () => viewModelDetail(model));
    return item;
}

/**
 * View model detail
 * @param {Object} model - Model data
 */
function viewModelDetail(model) {
    console.log('Viewing model:', model);
    alert(`${model.title}\n\n${model.description}\n\nCategoria: ${model.category}`);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Explore gallery button
    const exploreBtn = document.querySelector('.btn-primary');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Add a new model to the gallery (for future use)
 * @param {Object} model - Model data
 */
function addModel(model) {
    sampleModels.push(model);
    loadGallery();
}

/**
 * Start the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', init);
