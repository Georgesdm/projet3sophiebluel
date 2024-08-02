document.addEventListener('DOMContentLoaded', function() {
    console.log('logged.js est lancé');

    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const editAdminButton = document.getElementById('editAdminButton');
    const editModeBar = document.getElementById('editModeBar');
    const header = document.querySelector('header');
    
    console.log('loginLink:', loginLink);
    console.log('logoutLink:', logoutLink);
    console.log('editAdminButton:', editAdminButton);

    //vérifier si l'utilisateur est déjà connecté
    function checkLoginStatus() {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token); //debug
        if (token) { //si un token existe = un utilisateur est connecté
            console.log('Utilisateur connecté. Token:', token);
            loginLink.style.display = 'none'; //enlève login
            logoutLink.style.display = 'block'; //display logout
            editAdminButton.style.display = 'flex';
            editModeBar.style.display = 'block'; // Affiche la barre de notification
            header.style.marginTop = '99px'; // Réinitialise la marge supérieure du header

        } else {
            console.log('Aucun utilisateur connecté');
            loginLink.style.display = 'block'; //display lelogin
            logoutLink.style.display = 'none'; //enlève logout
            editAdminButton.style.display = 'none';
            editModeBar.style.display = 'none'; // Cache la barre de notification
            header.style.marginTop = '50px 0'; // Réinitialise la marge supérieure du header
        }
    }

    checkLoginStatus();

    //gestion déconnexion
    logoutLink.addEventListener('click', function(event) {
        localStorage.removeItem('authToken'); //delete Token
        console.log('Utilisateur déconnecté');
        header.style.marginTop = '50px 0'; // Réinitialise la marge supérieure du header
        checkLoginStatus();
    });
});