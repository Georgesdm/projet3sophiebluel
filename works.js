// Attend que le contenu du document soit complètement chargé avant d'exécuter le code à l'intérieur
document.addEventListener('DOMContentLoaded', async () => {
    await fetchWorks();
});

//allWorks = tableau contenant tous les 'work' from 'works'
let allWorks = [];

// function pour recuperer les works depuis l'api
async function fetchWorks() {
    try {
        const apiresponse = await fetch('http://localhost:5678/api/works');
        //console.log(apiresponse) pour debug
        if (apiresponse.status === 200) {
            const data = await apiresponse.json();
            allWorks = data; // Stocke les travaux dans la variable globale
            displayWorks(allWorks); // Affiche tous les travaux au chargement initial
        } else {
            // Si le code de statut n'est pas 200
            throw new Error('Erreur réseau : ' + apiresponse.status);
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