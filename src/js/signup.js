/**
 * Signup Form Handler
 */

/**
 * Handle signup form submission
 * @param {Event} event - Form submission event
 */
function handleSignup(event) {
    event.preventDefault();

    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    
    // Reset messages
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');
    errorDiv.textContent = '';
    successDiv.textContent = '';

    // Get form data
    const formData = new FormData(event.target);
    
    // Validate form
    const validation = validateSignupForm(formData);
    
    if (!validation.isValid) {
        errorDiv.textContent = validation.error;
        errorDiv.classList.add('show');
        return;
    }

    // Simulate signup (in production, send to backend)
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        username: formData.get('username'),
        interests: formData.getAll('interests'),
        newsletter: formData.get('newsletter') === 'on'
    };

    console.log('User Data:', userData);

    // Show success message
    successDiv.textContent = `✓ Account creato con successo! Benvenuto, ${userData.firstName}! Un email di verifica è stato inviato a ${userData.email}`;
    successDiv.classList.add('show');

    // Reset form
    event.target.reset();

    // In production, redirect to login or dashboard
    setTimeout(() => {
        // window.location.href = 'login.html';
    }, 2000);
}

/**
 * Validate signup form data
 * @param {FormData} formData - Form data
 * @returns {Object} - Validation result
 */
function validateSignupForm(formData) {
    const firstName = formData.get('firstName')?.trim();
    const lastName = formData.get('lastName')?.trim();
    const email = formData.get('email')?.trim();
    const username = formData.get('username')?.trim();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');

    // Check required fields
    if (!firstName || !lastName) {
        return { isValid: false, error: '❌ Nome e cognome sono obbligatori' };
    }

    if (!email) {
        return { isValid: false, error: '❌ Email è obbligatoria' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: '❌ Email non valida' };
    }

    if (!username) {
        return { isValid: false, error: '❌ Nome utente è obbligatorio' };
    }

    // Validate username length
    if (username.length < 3) {
        return { isValid: false, error: '❌ Nome utente deve avere almeno 3 caratteri' };
    }

    // Validate username format (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return { isValid: false, error: '❌ Nome utente può contenere solo lettere, numeri e underscore' };
    }

    if (!password) {
        return { isValid: false, error: '❌ Password è obbligatoria' };
    }

    // Validate password strength
    if (password.length < 8) {
        return { isValid: false, error: '❌ Password deve avere almeno 8 caratteri' };
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
        return { 
            isValid: false, 
            error: '❌ Password deve contenere almeno una maiuscola, una minuscola, un numero e un simbolo (@$!%*?&)' 
        };
    }

    if (password !== confirmPassword) {
        return { isValid: false, error: '❌ Le password non corrispondono' };
    }

    if (!terms) {
        return { isValid: false, error: '❌ Devi accettare i termini di servizio' };
    }

    return { isValid: true };
}

/**
 * Real-time username validation
 */
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    
    if (usernameInput) {
        usernameInput.addEventListener('blur', () => {
            const username = usernameInput.value.trim();
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            
            if (username && !usernameRegex.test(username)) {
                usernameInput.style.borderColor = '#ef4444';
            } else {
                usernameInput.style.borderColor = 'var(--border-color)';
            }
        });
    }

    // Password strength indicator (optional enhancement)
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = calculatePasswordStrength(password);
            console.log('Password strength:', strength);
        });
    }
});

/**
 * Calculate password strength
 * @param {string} password - Password string
 * @returns {string} - Strength level
 */
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    if (strength <= 2) return 'Debole';
    if (strength <= 3) return 'Media';
    if (strength <= 4) return 'Forte';
    return 'Molto Forte';
}
