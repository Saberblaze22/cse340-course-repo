// Function to handle user signup
function signup() {
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const serviceType = document.getElementById('serviceType').value;

    // Validate required fields
    if (!name || !email || !phone || !serviceType) {
        alert('All fields are required. Please fill in all information.');
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Validate phone number (basic check for digits and length)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        alert('Please enter a valid phone number (at least 10 digits).');
        return false;
    }

    // Prepare data for submission
    const signupData = {
        name: name,
        email: email,
        phone: phone,
        serviceType: serviceType
    };

    // Submit data to server (example using fetch)
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Signup successful! Welcome ' + name);
            // Optionally redirect or clear form
            document.getElementById('signupForm').reset();
        } else {
            alert('Signup failed: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during signup. Please try again.');
    });

    return false; // Prevent default form submission
}

// Optional: Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            signup();
        });
    }
});