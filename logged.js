document.addEventListener('DOMContentLoaded', function() {
    console.log('logged.js est lancé'); //debug

    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    
    console.log('loginLink:', loginLink); //debug
    console.log('logoutLink:', logoutLink); //debug

    // Vérifier si l'utilisateur est déjà connecté
    function checkLoginStatus() {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token); //debug
        if (token) { //si un token existe = un utilisateur est connecté
            console.log('Utilisateur connecté. Token:', token); //debug
            loginLink.style.display = 'none'; //enlève le bouton login
            logoutLink.style.display = 'block'; //display le bouton logout
        } else {
            console.log('Aucun utilisateur connecté');
            loginLink.style.display = 'block'; //display le bouton login
            logoutLink.style.display = 'none'; //enlève le bouton logout
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