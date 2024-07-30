document.addEventListener('DOMContentLoaded', function() {
    console.log('logged.js est lancé'); //debug

    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const editAdminButton = document.getElementById('editAdminButton');
    
    console.log('loginLink:', loginLink); //debug
    console.log('logoutLink:', logoutLink); //debug
    console.log('editAdminButton:', editAdminButton); //debug

    // Vérifier si l'utilisateur est déjà connecté
    function checkLoginStatus() {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token); //debug
        if (token) { //si un token existe = un utilisateur est connecté
            console.log('Utilisateur connecté. Token:', token); //debug
            loginLink.style.display = 'none'; //enlève login
            logoutLink.style.display = 'block'; //display logout
            editAdminButton.style.display = 'flex';

        } else {
            console.log('Aucun utilisateur connecté');
            loginLink.style.display = 'block'; //display lelogin
            logoutLink.style.display = 'none'; //enlève logout
            editAdminButton.style.display = 'none';
        }
    }

    checkLoginStatus();

    // Gestion de la déconnexion
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); //enlève comportement par défaut du lien
        localStorage.removeItem('authToken'); //delete Token
        console.log('Utilisateur déconnecté'); //debug
        checkLoginStatus();
    });
});