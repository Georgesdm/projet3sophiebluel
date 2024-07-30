import { fetchWorks } from './works.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalContainer');
    const openModalButton = document.getElementById('editAdminButton');
    const closeModalButton = document.querySelector('.close');
    const modalGallery = document.getElementById('modalGallery');

    openModalButton.addEventListener('click', () => {
        modal.style.display = 'block';
        fetchAndDisplayModalGallery();
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    async function fetchAndDisplayModalGallery() {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des works');
            }
            const works = await response.json();
            displayGalleryModal(works);
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    function displayGalleryModal(works) {
        modalGallery.innerHTML = '';
        works.forEach(work => {
            const workContainer = document.createElement('div');
            workContainer.classList.add('work-container');

            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;

            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';

            workContainer.appendChild(img);
            workContainer.appendChild(deleteIcon);
            modalGallery.appendChild(workContainer);

            deleteIcon.addEventListener('click', () => {
                deleteWork(work.id, workContainer);
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
                    'Authorization': `Bearer ${token}`
                }
            });

            //supprimer l'élément du DOM
            workContainer.remove();

            //supprimer l'élément correspondant de la galerie principale
            const workElement = gallery.querySelector(`.work-container[data-id='${workId}']`);
            if (workElement) {
                workElement.remove();
            }

            //rafraîchir les works
            await fetchWorks();
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
});