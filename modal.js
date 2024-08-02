import { fetchWorks, deleteWork, addWork } from './callapi.js';
import { fetchAndDisplayWorks } from './works.js';

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

    //**MODAL NAVIGATION AND EXIT EVENTS
    openModalButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);
    addWorkButton.addEventListener('click', showAddWorkView);
    backToGalleryButton.addEventListener('click', backToGalleryView);
    //clique en dehors de la modale = exit
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    function openModal() {
        console.log('Ouverture modale');
        modal.style.display = 'block';
        modalGalleryView.style.display = 'block';
        addWorkView.style.display = 'none';
        fetchAndDisplayModalGallery();
    }

    function closeModal() {
        console.log('Fermeture modale');
        modal.style.display = 'none';
    }

    function showAddWorkView() {
        console.log('Affichage page2 modale');
        modalGalleryView.style.display = 'none';
        addWorkView.style.display = 'flex';
        backToGalleryButton.style.display = 'flex';
    }

    function backToGalleryView() {
        console.log('Retour galerie modale');
        modalGalleryView.style.display = 'block';
        addWorkView.style.display = 'none';
        backToGalleryButton.style.display = 'none';
    }
    //**MODAL NAVIGATION AND EXIT EVENTS

    // Fonction pour charger et afficher la galerie des works dans la modale
    async function fetchAndDisplayModalGallery() {
        try {
            const works = await fetchWorks();
            console.log('Works récupérés');
            displayGalleryModal(works); // Afficher les works dans la galerie de la modale
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
    // Fonction pour afficher les works dans la galerie de la modale
    function displayGalleryModal(works) {
        modalGallery.innerHTML = ''; // Vider le contenu actuel

        works.forEach(work => {
            const workContainer = document.createElement('div'); // Crée container pour chaque work
            workContainer.classList.add('work-container');
            workContainer.dataset.id = work.id; // Ajoute un id au conteneur

            const img = document.createElement('img'); // Crée img
            img.src = work.imageUrl;
            img.alt = work.title;

            // Delete icon
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';

            workContainer.appendChild(img); // Ajoute img au container
            workContainer.appendChild(deleteIcon); // Ajoute icon au container
            modalGallery.appendChild(workContainer); // Ajoute le container à la galerie modale

            deleteIcon.addEventListener('click', async (event) => {
                event.preventDefault(); // Empêcher l'action par défaut
                event.stopPropagation(); // Empêcher d'autres événements d'être déclenchés
                console.log(`Suppression de ID: ${work.id}`);
                await handleDeleteWork(work.id, workContainer); // Supprimer un work
            });
        });
    }

    //gérer la suppression d'un work
    async function handleDeleteWork(workId, workContainer) {
        try {
            await deleteWork(workId);
            // Supprimer l'élément du DOM
            workContainer.remove();
            console.log("Suppression du work du DOM effectuée");

            // Supprimer l'élément de la galerie principale
            const mainWorkElement = document.querySelector(`.work-container[data-id='${workId}']`);
            if (mainWorkElement) {
                mainWorkElement.remove();
                console.log("Suppression du work de la galerie principale effectuée");
            }

            // Mettre à jour l'affichage des works dans la modale
            await fetchAndDisplayModalGallery();
            console.log("Mise à jour de la galerie effectuée");
        } catch (error) {
            console.error('Erreur lors de la suppression du work:', error);
        }
    }

    //PREVIEW NEW WORK
    workImgInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            previewImage(file);
        } else {
            resetPreview()
        }
    });

    function previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            placeholderImg.classList.add('hidden');
            addPhotoText.classList.add('hidden');
            maxSizeText.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
    function resetPreview() {
        previewImg.src = '';
        previewImg.style.display = 'none';
        placeholderImg.classList.remove('hidden');
        addPhotoText.classList.remove('hidden');
        maxSizeText.classList.remove('hidden');
    }

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
            formError.innerText = 'Tous les champs sont obligatoires';
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
            const newWork = await addWork(formData);
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
            closeModal();
            await resetForm();

            // Rafraîchir les works
            await fetchAndDisplayWorks(); //import depuis works.js
            console.log('Modale fermee et galerie maj');
        } catch (error) {
            console.error('Erreur:', error);
        }
    });

    async function resetForm() {
        //reinitialiser le formulaire de la page2
        addPhotoForm.reset();
        previewImg.src = '';
        previewImg.style.display = 'none';
        placeholderImg.classList.remove('hidden');
        addPhotoText.classList.remove('hidden');
        maxSizeText.classList.remove('hidden');
    }
});