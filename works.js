// Attend que le contenu du document soit complètement chargé avant d'exécuter le code à l'intérieur
document.addEventListener('DOMContentLoaded', async () => {
    await fetchWorks();
    await fetchCategories();
});

//allWorks = tableau contenant tous les 'work' from 'works'
let allWorks = [];
//initialise un Set vide
let allCategories = new Set();

// function pour recuperer les works depuis l'api
export async function fetchWorks() {
    try {
        const apiResponse = await fetch('http://localhost:5678/api/works');
        //console.log(apiresponse) pour debug
        if (apiResponse.status === 200) {
            const data = await apiResponse.json();
            allWorks = data;
            displayWorks(allWorks);
        } else {
            // Si le code de statut n'est pas 200
            throw new Error('Erreur réseau : ' + apiResponse.status);
        }
    } catch (error) {
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
      //console.log(project)
      //ajoute image+légende
      project.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      `;
  
      // Ajoute l'élément 'project' à la galerie
      gallery.appendChild(project);
    });
}

//récupérer les catégories depuis l'API
async function fetchCategories() {
    try {
        const apiResponse = await fetch('http://localhost:5678/api/categories');
        if (apiResponse.status === 200) {
            const data = await apiResponse.json();
            //set=liste de catégories uniques
            //data.map(category => category.name)crée un tableau de noms de catégories
            allCategories = ['Tous', ...new Set(data.map(category => category.name))];
            //genere menu catégories
            generateCategoryMenu(allCategories);
        } else {
            throw new Error('Erreur réseau : ' + apiResponse.status);
        }
    } catch (error) {
        console.error('Problème opération fetch:', error);
    }
}

//générer le menu des catégories
function generateCategoryMenu(categories) {
    const categoryContainer = document.getElementById('categories');
     //vide contenu
    categoryContainer.innerHTML = '';

    categories.forEach(category => {
        //crée un bouton pour chaque catégorie
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