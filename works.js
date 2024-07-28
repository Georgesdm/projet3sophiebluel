// Attend que le contenu du document soit complètement chargé avant d'exécuter le code à l'intérieur
document.addEventListener('DOMContentLoaded', async () => {
    await fetchWorks();
    await fetchCategories();
});

//allWorks = tableau contenant tous les 'work' from 'works'
let allWorks = [];
//initialise un Set vide pour stocker les noms des catégories sans doublons
let allCategories = new Set();

// function pour recuperer les works depuis l'api
async function fetchWorks() {
    try {
        const apiResponse = await fetch('http://localhost:5678/api/works');
        //console.log(apiresponse) pour debug
        if (apiResponse.status === 200) {
            const data = await apiResponse.json();
            allWorks = data; // Stocke les travaux dans la variable globale
            displayWorks(allWorks); // Affiche tous les travaux au chargement initial
        } else {
            // Si le code de statut n'est pas 200
            throw new Error('Erreur réseau : ' + apiResponse.status);
        }
    } catch (error) {
        // Affiche une erreur dans la console si la requête échoue
        console.error('Problème opération fetch:', error);
    }
}

  // afficher les travaux dans la galerie
function displayWorks(works) {
    const gallery = document.getElementById('gallery');
    // Vide le contenu actuel de la galerie pour éviter les doublons
    gallery.innerHTML = '';
  
    works.forEach(work => {
      const project = document.createElement('project');
      console.log(project) //pour debug
      // Remplit l'élément avec une image et une légende
      project.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      `;
  
      // Ajoute l'élément 'project' à la galerie
      gallery.appendChild(project);
    });
}

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
    try {
        const apiResponse = await fetch('http://localhost:5678/api/categories');
        if (apiResponse.status === 200) {
            const data = await apiResponse.json();
            // Utilisation de Set pour obtenir une liste de catégories uniques
            // `data.map(category => category.name)` crée un tableau de noms de catégories
            allCategories = ['Tous', ...new Set(data.map(category => category.name))];
            // Génère le menu des catégories en utilisant la liste unique
            generateCategoryMenu(allCategories);
        } else {
            throw new Error('Erreur réseau : ' + apiResponse.status);
        }
    } catch (error) {
        console.error('Problème opération fetch:', error);
    }
}

// Fonction pour générer le menu des catégories
function generateCategoryMenu(categories) {
    const categoryContainer = document.getElementById('categories');
     // Vide le contenu actuel
    categoryContainer.innerHTML = '';

    categories.forEach(category => {
        // Crée un bouton pour chaque catégorie
        const button = document.createElement('button');
        button.innerText = category;
        button.addEventListener('click', () => filterWorks(category));
        categoryContainer.appendChild(button);
    });
}

//filtrer les travaux par catégorie au click
function filterWorks(category) {
    if (category === 'Tous') {
        displayWorks(allWorks);
    } else {
        //compare la category name de chaque
        const filteredWorks = allWorks.filter(work => work.category.name === category);
        displayWorks(filteredWorks);
    }
}

