import { fetchWorks } from './works.js'; // Importer la fonction fetchWorks

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalContainer');
    const openModalButton = document.getElementById('editAdminButton');
    const closeModalButton = document.querySelector('.close');
    const modalGallery = document.getElementById('modalGallery');
    const addWorkButton = document.getElementById('addWorkButton');
    const backToGalleryButton = document.querySelector('.past');
    const modalGalleryView = document.getElementById('modalGalleryView');
    const addWorkView = document.getElementById('addWorkView');
    const workImgInput = document.getElementById('workImg');
    const previewImg = document.getElementById('previewImg');
    const placeholderImg = document.getElementById('placeholderImg');
    const addPhotoText = document.getElementById('addPhotoText');
    const maxSizeText = document.getElementById('maxSizeText');
    const addPhotoForm = document.getElementById('addPhotoForm');
    const formError = document.getElementById('formError');

    //gerer 'pages' de la modale
    openModalButton.addEventListener('click', () => {
        console.log('Ouverture modale');
        modal.style.display = 'block'; //affiche modale
        modalGalleryView.style.display = 'block'; //affiche galerie
        addWorkView.style.display = 'none'; //masque la page 2
        fetchAndDisplayModalGallery(); //charge+affiche galerie modale
    });

    //fermer la modale
    closeModalButton.addEventListener('click', () => {
        console.log('Fermeture modale');
        modal.style.display = 'none';
    });

     //ferme modal si click en dehors
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    //afficher page 2
    addWorkButton.addEventListener('click', () => {
        console.log('Affichage page2 modale');
        modalGalleryView.style.display = 'none'; //masque galerie
        addWorkView.style.display = 'flex'; //affiche page 2
        backToGalleryButton.style.display = 'flex'; //affiche bouton precdent
    });

    //retour a la galerie modale
    backToGalleryButton.addEventListener('click', () => {
        console.log('Retour galerie modale');
        modalGalleryView.style.display = 'block'; //affiche galerie
        addWorkView.style.display = 'none'; //masque la page 2
        backToGalleryButton.style.display = 'none'; //masque bouton precedent
    });

    //charge+affiche galerie les works dans la modale
    async function fetchAndDisplayModalGallery() {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des works');
            }
            const works = await response.json();
            console.log('Works récupérés');
            displayGalleryModal(works); //afficher les works dans la galerie de la modale
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
    //afficher les works dans galerie modale
    function displayGalleryModal(works) {
        modalGallery.innerHTML = ''; //vide contenu actuel
        works.forEach(work => {
            const workContainer = document.createElement('div'); //crée container pour chaque work
            workContainer.classList.add('work-container');
            workContainer.dataset.id = work.id; //ajoute un id au conteneur

            const img = document.createElement('img'); //crée img
            img.src = work.imageUrl;
            img.alt = work.title;

            //delete icon
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';

            workContainer.appendChild(img); //ajoute img au container
            workContainer.appendChild(deleteIcon); //ajoute icon au container
            modalGallery.appendChild(workContainer); //ajoute le container a la galerie modale

            deleteIcon.addEventListener('click', () => {
                console.log(`Suppression de ID: ${work.id}`);
                deleteWork(work.id, workContainer); //supprime un work
            });
        });
    }

    async function deleteWork(workId, workContainer) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` //token connexion
                }
            });

            if (!response.ok) {
                throw new Error('Erreur suppression du work');
            }

            //supprime l'élément du DOM
            workContainer.remove();
            console.log("Suppression OK");
            //supprimer l'élément de la galerie principale
            const workElement = document.querySelector(`.work-container[data-id='${workId}']`);
            if (workElement) {
                workElement.remove();
            }

            //maj affichage des works
            await fetchWorks(); //fonction de works.js

        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    //preview de l'image
    workImgInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; //recuperer le fichier upload
        if (file) {
            const reader = new FileReader(); //nouvel objet FileReader
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                previewImg.style.display = 'block'; //afficher preview

                //masquer les éléments d'upload preview
                placeholderImg.classList.add('hidden');
                addPhotoText.classList.add('hidden');
                maxSizeText.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        } else { //si pas d'img upload
            previewImg.src = ''; //reset
            previewImg.style.display = 'none'; //cacher img preview

            //afficher les élements d'upload preview
            placeholderImg.classList.remove('hidden');
            addPhotoText.classList.remove('hidden');
            maxSizeText.classList.remove('hidden');
        }
    });

    //ajouter work formulaire
    addPhotoForm.addEventListener('submit', async (event) => {
        event.preventDefault(); //empecher comportement par defaut

        const file = workImgInput.files[0]; //img du work
        const title = document.getElementById('workTitle').value;
        const category = document.getElementById('workCategory').value;

        console.log('Fichier:', file);
        console.log('Titre:', title);
        console.log('Catégorie:', category);

        if (!file || !title || !category) { //message erreur
            console.log('Formulaire incomplet');
            formError.style.display = 'block';
            return;
        } else {
            formError.style.display = 'none';
        }
        
        //fromdata objet
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('category', category);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur upload nouveau work');
            }

            const newWork = await response.json();
            console.log('Nouveau work ajouté', newWork);

            //ajouter le nouveau work à la galerie de la modale
            fetchAndDisplayModalGallery();

            //ajouter le nouveau work à la galerie principale
            const mainGallery = document.getElementById('gallery');
            const workContainer = document.createElement('div');
            workContainer.classList.add('work-container');
            workContainer.dataset.id = newWork.id;

            const img = document.createElement('img');
            img.src = newWork.imageUrl;
            img.alt = newWork.title;

            workContainer.appendChild(img);
            mainGallery.appendChild(workContainer);

            // Fermer la modale
            modal.style.display = 'none';

            //reinitialiser le formulaire de la page2
            addPhotoForm.reset();
            previewImg.src = '';
            previewImg.style.display = 'none';
            placeholderImg.classList.remove('hidden');
            addPhotoText.classList.remove('hidden');
            maxSizeText.classList.remove('hidden');

            // Rafraîchir les works
            await fetchWorks(); //import depuis works.js
            console.log('Modale fermee et galerie maj');
        } catch (error) {
            console.error('Erreur:', error);
        }
    });
});