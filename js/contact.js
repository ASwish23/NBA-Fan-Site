document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    
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

    // Real-time validation
    const submitBtn = form.querySelector('button[type="submit"]');

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

    Object.keys(patterns).forEach(field => {
        const input = document.getElementById(field);
        const errorElement = document.getElementById(`${field}Error`);
        
        input.addEventListener('input', () => {
            validateField(field, input, errorElement);
            updateSubmitState();
        });
    });

    // initialize submit state
    updateSubmitState();

    // Form submission
    form.addEventListener('submit', (e) => {
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
        
        // If form is valid, submit
        if (isValid) {
            // EmailJS automatic send configuration
            // IMPORTANT: create an EmailJS account and replace the placeholders below.
            const USE_EMAILJS = true; // set to true to use EmailJS
            const EMAILJS_SERVICE_ID = 'your_service_id'; // e.g. 'service_xxx'
            const EMAILJS_TEMPLATE_ID = 'your_template_id'; // e.g. 'template_xxx'
            const EMAILJS_USER_ID = 'your_user_id'; // e.g. 'user_xxx'

            // Collect form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (USE_EMAILJS) {
                if (submitBtn) submitBtn.disabled = true;

                function doSend() {
                    try {
                        emailjs.init(EMAILJS_USER_ID);
                        const templateParams = {
                            from_name: name,
                            from_email: email,
                            phone: phone || '-',
                            subject,
                            message
                        };

                        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                            .then(() => {
                                alert('Mesaj trimis cu succes.');
                                form.reset();
                                updateSubmitState();
                            }, (err) => {
                                console.error('EmailJS error:', err);
                                alert('A apărut o eroare la trimiterea mesajului.');
                                if (submitBtn) submitBtn.disabled = false;
                            });
                    } catch (err) {
                        console.error('EmailJS init error:', err);
                        alert('Eroare la inițializarea serviciului de trimitere.');
                        if (submitBtn) submitBtn.disabled = false;
                    }
                }

                // Load SDK if necessary
                if (typeof emailjs === 'undefined') {
                    const s = document.createElement('script');
                    s.src = 'https://cdn.emailjs.com/sdk/2.3.2/email.min.js';
                    s.onload = doSend;
                    document.head.appendChild(s);
                } else {
                    doSend();
                }

            } else {
                // Fallback: open user's mail client with pre-filled message
                const RECEIVER_EMAIL = 'biro.allen23@yahoo.com';
                const bodyLines = [
                    `Nume: ${name}`,
                    `Email: ${email}`,
                    `Telefon: ${phone || '-'}`,
                    '',
                    'Mesaj:',
                    message
                ];
                const mailtoLink = `mailto:${encodeURIComponent(RECEIVER_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
                window.location.href = mailtoLink;
                alert('Se va deschide clientul de email implicit cu mesajul precompletat.');
            }
        }
    });

    // Validation function
    function validateField(field, input, errorElement) {
        const value = input.value.trim();
        
        // Skip validation for optional phone field if empty
        if (field === 'phone' && value === '') {
            errorElement.textContent = '';
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