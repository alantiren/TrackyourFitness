//public/auth.js
// Function to handle user signup
async function signupUser(email, password) {
    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message); // Show success message
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to signup');
        }
    } catch (error) {
        console.error('Error signing up:', error);
        alert('An error occurred while signing up.');
    }
}

// Function to handle user login
async function loginUser(email, password) {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message); // Show success message
            localStorage.setItem('token', data.token); // Store token in localStorage
            window.location.href = '/dashboard'; // Redirect to dashboard page after successful login
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to login');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in.');
    }
}

// Function to store token in localStorage
function storeToken(token) {
    localStorage.setItem('token', token);
}

// Function to retrieve token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Function to logout user
function logoutUser() {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/login'; // Redirect to login page after logout
}
