// Theme functionality
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';
document.body.dataset.theme = currentTheme;

// Safe-guard in case element is missing on some pages
if (themeToggle) {
    // initialize icon/state
    themeToggle.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-pressed', currentTheme === 'dark');

    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        // update button icon and aria
        themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
    });
}

// Search functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const content = document.querySelectorAll('.searchable');
    
    content.forEach(element => {
        const text = element.textContent.toLowerCase();
        element.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Help button & modal
const helpBtn = document.getElementById('helpBtn');
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Need Help?</h2>
        <div class="faq-section">
            <h3>Frequently Asked Questions</h3>
            <ul>
                <li><strong>Cum pot căuta conținut?</strong><br>Folosiți bara de căutare din partea de sus a paginii.</li>
                <li><strong>Cum schimb tema site-ului?</strong><br>Apăsați butonul cu simbol lună/soare din bara de navigare.</li>
                <li><strong>Unde găsesc statisticile echipelor?</strong><br>Accesați pagina "Echipe" din meniul principal.</li>
            </ul>
        </div>
    </div>
`;
document.body.appendChild(modal);

helpBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Scroll to top functionality
const scrollTopBtn = document.getElementById('scrollTopBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');

window.addEventListener('scroll', () => {
    // show/hide scroll to top
    if (scrollTopBtn) {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    // show/hide scroll to bottom (only when not near bottom)
    if (scrollDownBtn) {
        const nearBottom = (window.innerHeight + window.pageYOffset) >= (document.body.scrollHeight - 300);
        if (!nearBottom) {
            scrollDownBtn.classList.add('visible');
        } else {
            scrollDownBtn.classList.remove('visible');
        }
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
}

// Active page highlighting
const highlightCurrentPage = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
};

highlightCurrentPage();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.querySelector('.nav-links');
if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const expanded = navLinksContainer.classList.contains('active');
        navToggle.setAttribute('aria-expanded', expanded);
        // Change icon
        navToggle.textContent = expanded ? '✕' : '☰';
    });
    // close menu when a link is clicked (mobile)
    navLinksContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navLinksContainer.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.textContent = '☰';
        }
    });
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
            navLinksContainer.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.textContent = '☰';
        }
    });
}

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'YOUR-GA-ID');