//for login.js
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

//for works.js
export async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error('Erreur: ' + response.status);
    }
}

export async function fetchCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error('Erreur: ' + response.status);
    }
}

export async function deleteWork(workId, token) {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Erreur suppression du work');
    }
    return response.json();
}

export async function addWork(formData, token) {
    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    if (!response.ok) {
        throw new Error('Erreur upload nouveau work');
    }
    return response.json();
}