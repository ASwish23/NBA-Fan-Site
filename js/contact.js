document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('formStatus');
    
    // Validation patterns
    const patterns = {
        name: /^[a-zA-ZăîșțâĂÎȘȚÂ\s]{3,50}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        phone: /^(\+4|0)?[0-9]{9,10}$/,
        subject: /^.{5,100}$/,
        message: /^[\s\S]{10,1000}$/
    };

    // Error messages
    const errorMessages = {
        name: 'Numele trebuie să conțină între 3 și 50 de caractere și să nu conțină cifre sau caractere speciale.',
        email: 'Introduceți o adresă de email validă.',
        phone: 'Numărul de telefon trebuie să fie în format românesc (10 cifre, opțional cu prefix +4).',
        subject: 'Subiectul trebuie să conțină între 5 și 100 de caractere.',
        message: 'Mesajul trebuie să conțină între 10 și 1000 de caractere.'
    };

    function validateField(field, input, errorElement) {
        const value = input.value.trim();
        
        // Phone is optional
        if (field === 'phone' && value === '') {
            errorElement.textContent = '';
            input.classList.remove('error');
            return true;
        }
        
        if (!patterns[field].test(value)) {
            errorElement.textContent = errorMessages[field];
            input.classList.add('error');
            return false;
        }
        
        errorElement.textContent = '';
        input.classList.remove('error');
        return true;
    }

    function isFormValid() {
        return Object.keys(patterns).every(field => {
            const input = document.getElementById(field);
            const value = input.value.trim();
            if (field === 'phone' && value === '') return true; // optional
            return patterns[field].test(value);
        });
    }

    function updateSubmitState() {
        if (!submitBtn) return;
        submitBtn.disabled = !isFormValid();
    }

    // Real-time validation
    Object.keys(patterns).forEach(field => {
        const input = document.getElementById(field);
        const errorElement = document.getElementById(`${field}Error`);
        
        input.addEventListener('input', () => {
            validateField(field, input, errorElement);
            updateSubmitState();
        });
    });

    // Initialize submit state
    updateSubmitState();

    // Form submission with Formspree
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        Object.keys(patterns).forEach(field => {
            const input = document.getElementById(field);
            const errorElement = document.getElementById(`${field}Error`);
            
            if (!validateField(field, input, errorElement)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Se trimite...';
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                formStatus.style.display = 'block';
                formStatus.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 255, 136, 0.15))';
                formStatus.style.border = '1px solid rgba(0, 212, 255, 0.4)';
                formStatus.style.color = 'var(--text-color)';
                formStatus.innerHTML = '✅ <strong>Mesajul a fost trimis cu succes!</strong><br>Vă vom răspunde în cel mai scurt timp.';
                form.reset();
                updateSubmitState();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formStatus.style.display = 'block';
            formStatus.style.background = 'linear-gradient(135deg, rgba(255, 0, 0, 0.15), rgba(255, 100, 0, 0.15))';
            formStatus.style.border = '1px solid rgba(255, 0, 0, 0.4)';
            formStatus.style.color = 'var(--text-color)';
            formStatus.innerHTML = '❌ <strong>Eroare la trimiterea mesajului.</strong><br>Vă rugăm să încercați din nou sau să ne contactați direct la <a href="mailto:biro.allen23@yahoo.com" style="color: var(--primary-color);">biro.allen23@yahoo.com</a>';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Trimite Mesajul';
        }
    });
            return true;
        }
        
        if (!patterns[field].test(value)) {
            errorElement.textContent = errorMessages[field];
            input.classList.add('invalid');
            return false;
        } else {
            errorElement.textContent = '';
            input.classList.remove('invalid');
            return true;
        }
    }
});