// works.js
import { fetchWorks, fetchCategories } from './callapi.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializePage();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
});

// Fonction pour initialiser la page
async function initializePage() {
    const works = await fetchWorks();
    allWorks = works;
    displayWorks(allWorks);

    const categories = await fetchCategories();
    allCategories = ['Tous', ...new Set(categories.map(category => category.name))];
    generateCategoryMenu(allCategories);
}

let allWorks = [];
let allCategories = new Set();

// Fonction pour afficher les travaux
function displayWorks(works) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    works.forEach(work => {
        const project = createProjectElement(work);
        gallery.appendChild(project);
    });
}

// Fonction pour créer un élément de projet
function createProjectElement(work) {
    const project = document.createElement('project');
    project.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
    `;
    return project;
}

// Fonction pour générer le menu des catégories
function generateCategoryMenu(categories) {
    const categoryContainer = document.getElementById('categories');
    categoryContainer.innerHTML = '';
    categories.forEach(category => {
        const button = createCategoryButton(category);
        categoryContainer.appendChild(button);
    });
}

// Fonction pour créer un bouton de catégorie
function createCategoryButton(category) {
    const button = document.createElement('button');
    button.innerText = category;
    button.addEventListener('click', () => filterWorks(category));
    return button;
}

// Fonction pour filtrer les travaux par catégorie
function filterWorks(category) {
    if (category === 'Tous') {
        displayWorks(allWorks);
    } else {
        const filteredWorks = allWorks.filter(work => work.category.name === category);
        displayWorks(filteredWorks);
    }
}