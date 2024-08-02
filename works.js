import { fetchWorks, fetchCategories } from './callapi.js';

// Attend que le contenu du document soit complètement chargé avant d'exécuter le code à l'intérieur
document.addEventListener('DOMContentLoaded', async () => {
    await initGallery();
});

let allWorks = [];
let allCategories = new Set();

// Initialiser Gallery (filtres + works)
async function initGallery() {
    try {
        allWorks = await fetchWorks();
        displayWorks(allWorks);
        const categories = await fetchCategories();
        allCategories = ['Tous', ...new Set(categories.map(category => category.name))];
        generateCategoryMenu(allCategories);
    } catch (error) {
        console.error('Erreur initialisation Gallery:', error);
    }
}

// Afficher les works dans la galerie
function displayWorks(works) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Vide le contenu actuel de la galerie

    works.forEach(work => {
        const project = document.createElement('project');
        project.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(project);
    });
}

export async function fetchAndDisplayWorks() {
    allWorks = await fetchWorks();
    displayWorks(allWorks);
}

// Générer le menu des catégories
function generateCategoryMenu(categories) {
    const categoryContainer = document.getElementById('categories');
    categoryContainer.innerHTML = ''; // Vide le contenu actuel

    categories.forEach(category => {
        const button = document.createElement('button');
        button.innerText = category;
        button.addEventListener('click', () => filterWorks(category));
        categoryContainer.appendChild(button);
    });
}

// Filtrer les travaux par catégorie au clic
function filterWorks(category) {
    if (category === 'Tous') {
        displayWorks(allWorks);
    } else {
        const filteredWorks = allWorks.filter(work => work.category.name === category);
        displayWorks(filteredWorks);
    }
}