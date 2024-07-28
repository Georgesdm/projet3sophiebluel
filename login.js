const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Ajouter un listener pour le formulaire
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire (rechargement de la page)
    
    // Récupérer les valeurs des champs de formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Envoyer une requête POST à l'API 
    fetch('http://localhost:5678/api/users/login', { 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Données reçues:', data);
        if (data.token) {
            // Si la réponse contient un token, la connexion est réussie
            console.log('Token reçu:', data.token); // debug
            localStorage.setItem('authToken', data.token); // stock le token
            console.log('Token stocké dans localStorage'); // debug
            window.location.href = 'index.html'; // redirection vers index
        } else {
            // Si la connexion a échoué, afficher un message d'erreur
            errorMessage.innerText = 'E-mail ou mot de passe incorrect.';
        }
    })
});