export async function fetchWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        if (response.status === 200) {
            return await response.json();
        } else {
            throw new Error('Erreur réseau : ' + response.status);
        }
    } catch (error) {
        console.error('Problème opération fetch:', error);
        throw error;
    }
}

export async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (response.status === 200) {
            return await response.json();
        } else {
            throw new Error('Erreur réseau : ' + response.status);
        }
    } catch (error) {
        console.error('Problème opération fetch:', error);
        throw error;
    }
}

//login.js renvoi le token
export async function loginUser(email, password) {
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return response.json();
}


//modal.js

export async function deleteWork(workId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` // Token de connexion
        }
    });

    if (!response.status === 204) {
        throw new Error('Erreur suppression du work');
    }
    return response.status;
}

export async function addWork(formData) {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    if (response.status !== 201) {
        throw new Error('Erreur upload nouveau work');
    }
    const newWork = await response.json();
    return newWork;
}