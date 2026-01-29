// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme or prefer-color-scheme
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
} else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mainNav = document.getElementById('main-nav');

mobileMenuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    
    // Animate hamburger to X
    const spans = mobileMenuToggle.querySelectorAll('span');
    if (mainNav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && 
        !mobileMenuToggle.contains(event.target) && 
        mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');

        // Reset hamburger
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Search Functionality
const searchInput = document.getElementById('search-input');
const searchContainer = document.getElementById('search-container');
const noResults = document.getElementById('no-results');

// Show search on mobile when clicking search icon
if (window.innerWidth <= 480) {
    const searchIcon = document.querySelector('.search-icon');
    searchIcon.addEventListener('click', () => {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });
}

// Search function
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    
    // If search is empty, reset everything
    if (searchTerm === '') {
        resetSearch();
        return;
    }
    
    let foundResults = false;
    
    // Search in software cards
    const softwareCards = document.querySelectorAll('.software-card');
    softwareCards.forEach(card => {
        const searchableText = card.getAttribute('data-searchable').toLowerCase();
        const cardText = card.textContent.toLowerCase();
        
        if (searchableText.includes(searchTerm) || cardText.includes(searchTerm)) {
            card.style.display = 'flex';
            highlightText(card, searchTerm);
            foundResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show no results message if needed
    if (foundResults) {
        noResults.style.display = 'none';
    } else {
        noResults.style.display = 'block';
    }
});

// Function to reset search highlights and show all elements
function resetSearch() {
    // Remove all highlights
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
    
    // Show all software cards
    const softwareCards = document.querySelectorAll('.software-card');
    softwareCards.forEach(card => {
        card.style.display = 'flex';
    });
    
    // Hide no results message
    noResults.style.display = 'none';
}

// Function to highlight search terms in an element
function highlightText(element, searchTerm) {
    const textNodes = getTextNodes(element);
    
    textNodes.forEach(node => {
        const nodeText = node.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const newText = nodeText.replace(regex, '<span class="search-highlight">$1</span>');
        
        if (newText !== nodeText) {
            const newSpan = document.createElement('span');
            newSpan.innerHTML = newText;
            node.parentNode.replaceChild(newSpan, node);
        }
    });
}

// Function to get all text nodes in an element
function getTextNodes(element) {
    const textNodes = [];
    
    function findTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            for (let child of node.childNodes) {
                findTextNodes(child);
            }
        }
    }
    
    findTextNodes(element);
    return textNodes;
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
            
            // Scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Update year in footer
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.querySelector('footer p');
    if (yearSpan) {
        yearSpan.innerHTML = yearSpan.innerHTML.replace('2026', new Date().getFullYear());
    }
});
