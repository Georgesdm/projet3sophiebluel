document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalContainer');
    const openModalButton = document.getElementById('editAdminButton');
    const closeModalButton = document.querySelector('.close');

    openModalButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});