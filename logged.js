document.addEventListener('DOMContentLoaded', function() {
    console.log('logged.js est lancé');

    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const editAdminButton = document.getElementById('editAdminButton');
    const editModeBar = document.getElementById('editModeBar');
    const header = document.querySelector('header');

    //console.log('loginLink:', loginLink);
    //console.log('logoutLink:', logoutLink);
    //console.log('editAdminButton:', editAdminButton);

    function checkLoginStatus() {
        const token = localStorage.getItem('authToken');
        //console.log('Token:', token);
        return !!token;  //retourne vrai si un token est présent
    }

    function displayAdminSection(userLoggedIn) {
        if (userLoggedIn) {
            //console.log('Utilisateur connecté');
            loginLink.style.display = 'none';
            logoutLink.style.display = 'block';
            editAdminButton.style.display = 'flex';
            editModeBar.style.display = 'block';
            header.style.marginTop = '99px';
        } else {
            //console.log('Aucun utilisateur connecté');
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
            editAdminButton.style.display = 'none';
            editModeBar.style.display = 'none';
            header.style.marginTop = '50px 0';
        }
    }

    const userLoggedIn = checkLoginStatus();
    displayAdminSection(userLoggedIn);

    logoutLink.addEventListener('click', function(event) {
        localStorage.removeItem('authToken');
        //console.log('Utilisateur déconnecté');
        header.style.marginTop = '50px 0';
        const isLoggedIn = checkLoginStatus();
        displayAdminSection(isLoggedIn);
    });
});