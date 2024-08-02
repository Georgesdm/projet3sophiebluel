// modal.js
import { fetchWorks, deleteWork, addWork } from './callapi.js';

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

    //gestion affichage modale
    openModalButton.addEventListener('click', () => {
        console.log('Ouverture modale');
        modal.style.display = 'block';
        modalGalleryView.style.display = 'block';
        addWorkView.style.display = 'none';
        fetchAndDisplayModalGallery();
    });

    closeModalButton.addEventListener('click', () => {
        console.log('Fermeture modale');
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    addWorkButton.addEventListener('click', () => {
        console.log('Affichage page2 modale');
        modalGalleryView.style.display = 'none';
        addWorkView.style.display = 'flex';
        backToGalleryButton.style.display = 'flex';
    });

    backToGalleryButton.addEventListener('click', () => {
        console.log('Retour galerie modale');
        modalGalleryView.style.display = 'block';
        addWorkView.style.display = 'none';
        backToGalleryButton.style.display = 'none';
    });
    //gestion affichage modale fin

    async function fetchAndDisplayModalGallery() {
        try {
            const works = await fetchWorks();
            displayGalleryModal(works);
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    function displayGalleryModal(works) {
        modalGallery.innerHTML = '';
        works.forEach(work => {
            const workContainer = createWorkContainer(work);
            modalGallery.appendChild(workContainer);
        });
    }

    function createWorkContainer(work) {
        const workContainer = document.createElement('div');
        workContainer.classList.add('work-container');
        workContainer.dataset.id = work.id;

        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('delete-icon');
        deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';

        workContainer.appendChild(img);
        workContainer.appendChild(deleteIcon);

        deleteIcon.addEventListener('click', async () => {
            try {
                const token = localStorage.getItem('authToken');
                await deleteWork(work.id, token);
                workContainer.remove();
                await fetchWorks();
            } catch (error) {
                console.error('Erreur:', error);
            }
        });

        return workContainer;
    }

    workImgInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                previewImg.style.display = 'block';
                placeholderImg.classList.add('hidden');
                addPhotoText.classList.add('hidden');
                maxSizeText.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            previewImg.src = '';
            previewImg.style.display = 'none';
            placeholderImg.classList.remove('hidden');
            addPhotoText.classList.remove('hidden');
            maxSizeText.classList.remove('hidden');
        }
    });

    addPhotoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const file = workImgInput.files[0];
        const title = document.getElementById('workTitle').value;
        const category = document.getElementById('workCategory').value;

        if (!file || !title || !category) {
            formError.style.display = 'block';
            formError.innerText = 'Tous les champs sont obligatoires';
            return;
        } else {
            formError.style.display = 'none';
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('category', category);

        try {
            const token = localStorage.getItem('authToken');
            const newWork = await addWork(formData, token);
            fetchAndDisplayModalGallery();

            const mainGallery = document.getElementById('gallery');
            const workContainer = createWorkContainer(newWork);
            mainGallery.appendChild(workContainer);

            modal.style.display = 'none';
            addPhotoForm.reset();
            previewImg.src = '';
            previewImg.style.display = 'none';
            placeholderImg.classList.remove('hidden');
            addPhotoText.classList.remove('hidden');
            maxSizeText.classList.remove('hidden');

            await fetchWorks();
        } catch (error) {
            console.error('Erreur:', error);
        }
    });
});