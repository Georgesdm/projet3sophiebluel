import { loginUser } from './callapi.js';

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const data = await loginUser(email, password);
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            window.location.href = 'index.html';
        } else {
            errorMessage.innerText = 'E-mail ou mot de passe incorrect.';
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
    }
});