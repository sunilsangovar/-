document.addEventListener('DOMContentLoaded', function() {
    // Initialize static functionality only
    initSidebar();
    initThemeToggle();
    fixSidebarLinks();
    
    // Set current year in footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Enable search
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    if (searchInput && searchButton) {
        // Enable search controls
        searchInput.disabled = false;
        searchButton.disabled = false;
        
        // Initialize search functionality
        initSearch();
    }
    
    // Initialize mobile search after page has loaded
    initMobileSearch();
    
    // Theme switching
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
        });
    });
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // Check for saved dark mode preference
        const isDarkMode = localStorage.getItem('darkMode') === 'true' || localStorage.getItem('darkMode') === 'enabled';
        
        // Set initial state
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        // Handle toggle change
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }
});

// Initialize sidebar functionality
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        // Function to save sidebar state to localStorage (desktop only)
        function saveSidebarState() {
            if (window.innerWidth > 768) {
                if (sidebar.classList.contains('collapsed')) {
                    localStorage.setItem('sidebarState', 'collapsed');
                } else {
                    localStorage.setItem('sidebarState', 'expanded');
                }
            }
        }
        
        // Toggle sidebar when clicking the toggle button
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (window.innerWidth <= 768) {
                // Mobile: Just toggle visibility
                sidebar.classList.toggle('active');
                document.body.classList.toggle('sidebar-open');
            } else {
                // Desktop: Toggle between expanded and collapsed
                if (sidebar.classList.contains('collapsed')) {
                    sidebar.classList.remove('collapsed');
                } else {
                    sidebar.classList.add('collapsed');
                }
                
                // Save state to localStorage (desktop only)
                saveSidebarState();
            }
        });
    
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !e.target.closest('#sidebar') && 
                !e.target.closest('#sidebar-toggle') && 
                sidebar.classList.contains('active')) {
                
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
        
        // Set initial state based on screen size and localStorage
        function setInitialSidebarState() {
            if (window.innerWidth <= 768) {
                // On mobile, start with sidebar hidden
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
                // Remove collapsed class on mobile
                sidebar.classList.remove('collapsed');
            } else {
                // On desktop, add active class
                sidebar.classList.add('active');
                
                // Check localStorage for saved state (desktop only)
                const savedState = localStorage.getItem('sidebarState');
                if (savedState === 'collapsed') {
                    sidebar.classList.add('collapsed');
                } else {
                    sidebar.classList.remove('collapsed');
                }
            }
        }
        
        // Set initial state
        setInitialSidebarState();
        
        // Update sidebar state on window resize
        window.addEventListener('resize', function() {
            setInitialSidebarState();
        });
    }
}

// Initialize theme toggle functionality
function initThemeToggle() {
    // Theme selection
    const themeButtons = document.querySelectorAll('.theme-btn');
    if (themeButtons) {
        themeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                document.body.className = '';
                document.body.classList.add(`theme-${theme}`);
                localStorage.setItem('theme', theme);
            });
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // Check if dark mode was previously enabled
        const isDarkMode = localStorage.getItem('darkMode') === 'true' || localStorage.getItem('darkMode') === 'enabled';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }

    // Load saved theme if any
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = '';
        document.body.classList.add(`theme-${savedTheme}`);
    }
}

// Global Variables
const siteTitleText = document.getElementById('site-title-text');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const breadcrumbContainer = document.getElementById('breadcrumb');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const currentYear = document.getElementById('current-year');

// Function to set theme
function setTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('theme', theme);
    
    // Update active state on theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        if (button.getAttribute('data-theme') === theme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Search functionality
function initSearch() {
    const searchContainer = document.querySelector('.search-container');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.display = 'none';
    searchContainer.appendChild(searchResults);
    
    // Initialize search with the DOM elements
    setupSearchFunctionality(searchInput, searchButton, searchContainer, searchResults);
}

// Initialize mobile search functionality
function initMobileSearch() {
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    
    if (!mobileSearchToggle) return;
    
    // Create mobile search popup if it doesn't exist
    let mobileSearchPopup = document.querySelector('.mobile-search-popup');
    
    if (!mobileSearchPopup) {
        mobileSearchPopup = document.createElement('div');
        mobileSearchPopup.className = 'mobile-search-popup';
        mobileSearchPopup.style.display = 'none'; // Explicitly set to none initially
        
        // Create search container for mobile
        const mobileSearchContainer = document.createElement('div');
        mobileSearchContainer.className = 'search-container';
        
        // Create input field
        const mobileSearchInput = document.createElement('input');
        mobileSearchInput.type = 'text';
        mobileSearchInput.id = 'mobile-search-input';
        mobileSearchInput.placeholder = 'Search tools...';
        
        // Create search button
        const mobileSearchButton = document.createElement('button');
        mobileSearchButton.id = 'mobile-search-button';
        mobileSearchButton.innerHTML = '<i class="fas fa-search"></i>';
        mobileSearchButton.setAttribute('type', 'button'); // Ensure it doesn't submit a form
        
        // Append elements
        mobileSearchContainer.appendChild(mobileSearchInput);
        mobileSearchContainer.appendChild(mobileSearchButton);
        mobileSearchPopup.appendChild(mobileSearchContainer);
        
        // Add to body
        document.body.appendChild(mobileSearchPopup);
        
        // Create search results container
        const mobileSearchResults = document.createElement('div');
        mobileSearchResults.className = 'search-results';
        mobileSearchResults.style.display = 'none';
        mobileSearchContainer.appendChild(mobileSearchResults);
        
        // Initialize search functionality for mobile
        setupSearchFunctionality(mobileSearchInput, mobileSearchButton, mobileSearchContainer, mobileSearchResults, true);
    }
    
    // Toggle mobile search popup
    mobileSearchToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling up
        
        // Toggle active class
        mobileSearchPopup.classList.toggle('active');
        
        // Force display style to ensure visibility
        if (mobileSearchPopup.classList.contains('active')) {
            mobileSearchPopup.style.display = 'block';
            
            // Focus on input when opened
            const mobileSearchInput = document.getElementById('mobile-search-input');
            if (mobileSearchInput) {
                setTimeout(() => {
                    mobileSearchInput.focus();
                }, 300);
            }
        } else {
            // Let CSS handle hiding with a delay
            setTimeout(() => {
                if (!mobileSearchPopup.classList.contains('active')) {
                    mobileSearchPopup.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        // Only handle this if popup is active
        if (!mobileSearchPopup.classList.contains('active')) return;
        
        // Check if click is outside popup and not on toggle button
        if (!mobileSearchPopup.contains(e.target) && 
            e.target !== mobileSearchToggle && 
            !mobileSearchToggle.contains(e.target)) {
            mobileSearchPopup.classList.remove('active');
            mobileSearchPopup.style.display = 'none'; // Explicitly hide
        }
    });
    
    // Update mobile search visibility on resize
    window.addEventListener('resize', function() {
        const isMobileView = window.innerWidth <= 992;
        if (!isMobileView && mobileSearchPopup) {
            mobileSearchPopup.classList.remove('active');
            mobileSearchPopup.style.display = 'none'; // Explicitly hide
        }
    });
}

// Shared search functionality for both desktop and mobile
function setupSearchFunctionality(searchInput, searchButton, searchContainer, searchResults, isMobile = false) {
    // Tool data - these paths are relative to the root
    const tools = [
        { name: "Remove Tags Comma", url: "tools/remove-tags-comma.html", icon: "fa-solid fa-tag", description: "Remove tags and commas from text" },
        { name: "Add Hash Tags", url: "tools/add-hash-tags.html", icon: "fa-solid fa-hashtag", description: "Add hash tags to text" },
        { name: "Gemini AI Tool", url: "tools/gemini-ai-tool.html", icon: "fa-solid fa-microchip", description: "Use Gemini AI to analyze text" },
        { name: "Age Calculator", url: "tools/age-calculator.html", icon: "fa-solid fa-calendar-days", description: "Calculate exact age from birthdate" },
        { name: "Resume Builder", url: "tools/resume-builder.html", icon: "fa-solid fa-user-pen", description: "Create a professional resume" },
        { name: "Youtube Downloader", url: "tools/youtube-downloader.html", icon: "fab fa-youtube", description: "Download YouTube videos" },
        { name: "YT Thumb Downloader", url: "tools/youtube-thumbnail-downloader.html", icon: "fab fa-youtube", description: "Download YouTube video thumbnails" },
        { name: "Sitemap Generator", url: "tools/sitemap-generator.html", icon: "fa-solid fa-sitemap", description: "Generate a sitemap for your website" },
        { name: "Video Rotate", url: "tools/rotate-video.html", icon: "fa-solid fa-video", description: "Rotate videos to any angle" },
        { name: "Loan Calculator", url: "tools/loan-calculator.html", icon: "fas fa-money-bill", description: "Calculate loan EMIs and payment schedules" },
        { name: "QR Code Generator", url: "tools/qr-code-generator.html", icon: "fas fa-qrcode", description: "Generate custom QR codes for links and text" },
        { name: "Text to Speech", url: "tools/text-to-speech.html", icon: "fas fa-volume-up", description: "Convert text to spoken audio" },
        { name: "Background Remover", url: "tools/background-remover.html", icon: "fas fa-cut", description: "Remove backgrounds from images" },
        { name: "Merge PDF", url: "tools/merge-pdf.html", icon: "fas fa-file-pdf", description: "Combine multiple PDF files into one" },
        { name: "Image Resizer", url: "tools/image-resizer.html", icon: "fa-solid fa-image", description: "Resize images to any size" },
        { name: "PDF To Word", url: "tools/pdf-to-word.html", icon: "fas fa-edit", description: "Convert PDF files to Word documents" },
        { name: "Grammar Checker", url: "tools/grammar-checker.html", icon: "fas fa-spell-check", description: "Check text for grammar and spelling errors" }
    ];
    
    // Add page entries for search results
    const pages = [
        { name: "About Us", url: "pages/about.html", icon: "fa-solid fa-info-circle", description: "Learn about our website and team" },
        { name: "Contact Us", url: "pages/contact.html", icon: "fa-solid fa-envelope", description: "Get in touch with our team" },
        { name: "Sitemap", url: "pages/sitemap.html", icon: "fa-solid fa-sitemap", description: "View all pages on our website" },
        { name: "Privacy Policy", url: "pages/privacy-policy.html", icon: "fa-solid fa-user-shield", description: "View our privacy policy" },
        { name: "Add New Tool", url: "pages/add-new-tool.html", icon: "fa-solid fa-plus", description: "Add a new tool to our website" },
        { name: "Terms of Conditions", url: "pages/terms-of-conditions.html", icon: "fa-solid fa-file-contract", description: "View our terms of conditions" },
        { name: "Cookie consent", url: "pages/cookie-consent.html", icon: "fa-solid fa-cookie", description: "View our cookie consent" },
        { name: "Disclaimer", url: "pages/disclaimer.html", icon: "fa-solid fa-exclamation-triangle", description: "View our disclaimer" }
        
    ];
    
    // Merge tools and pages for search
    const searchableItems = [...tools, ...pages];
    
    // Determine base URL based on current location
    const basePath = getBaseUrl();
    
    // Handle search input
    searchInput.addEventListener('input', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        // Filter items based on search query
        const filteredItems = searchableItems.filter(item => {
            return item.name.toLowerCase().includes(query) || 
                   item.description.toLowerCase().includes(query);
        });
        
        // Display search results
        if (filteredItems.length > 0) {
            renderSearchResults(filteredItems);
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            searchResults.style.display = 'block';
        }
    });
    
    // Handle search button click
    searchButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length < 2) {
            return;
        }
        
        // Trigger search
        const event = new Event('input');
        searchInput.dispatchEvent(event);
    });
    
    // Handle click inside search container
    searchContainer.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent closing when clicking inside
    });
    
    // Handle click outside search results to close - specific to this container
    if (!isMobile) {
        document.addEventListener('click', function(event) {
            if (searchResults.style.display === 'block' && !searchContainer.contains(event.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    // Handle mobile back button
    window.addEventListener('popstate', function() {
        searchResults.style.display = 'none';
    });
    
    // Handle mobile keyboard events
    searchInput.addEventListener('focus', function() {
        if (window.innerWidth <= 768) {
            // On mobile, show results when input is focused
            const query = this.value.toLowerCase().trim();
            if (query.length >= 2) {
                const event = new Event('input');
                this.dispatchEvent(event);
            }
        }
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        if (searchResults.style.display === 'none') return;
        
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        const activeItem = searchResults.querySelector('.search-result-item.active');
        let index = -1;
        
        if (activeItem) {
            index = Array.from(resultItems).indexOf(activeItem);
        }
        
        // Down arrow key
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (index < resultItems.length - 1) {
                if (activeItem) activeItem.classList.remove('active');
                resultItems[index + 1].classList.add('active');
            }
        }
        
        // Up arrow key
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
                if (activeItem) activeItem.classList.remove('active');
                resultItems[index - 1].classList.add('active');
            }
        }
        
        // Enter key
        if (e.key === 'Enter') {
            if (activeItem) {
                e.preventDefault();
                window.location.href = activeItem.href;
            }
        }
        
        // Escape key
        if (e.key === 'Escape') {
            searchResults.style.display = 'none';
            if (isMobile) {
                document.querySelector('.mobile-search-popup').classList.remove('active');
            }
        }
    });
    
    // Render search results
    function renderSearchResults(results) {
        searchResults.innerHTML = '';
        
        results.slice(0, 5).forEach(item => {
            const resultItem = document.createElement('a');
            resultItem.href = basePath + item.url;
            resultItem.className = 'search-result-item';
            
            resultItem.innerHTML = `
                <div class="search-result-icon"><i class="${item.icon}"></i></div>
                <div class="search-result-content">
                    <div class="search-result-title">${item.name}</div>
                    <div class="search-result-description">${item.description}</div>
                </div>
            `;
            
            // Add touch feedback for mobile
            resultItem.addEventListener('touchstart', function() {
                this.style.backgroundColor = 'rgba(var(--primary-color-rgb), 0.1)';
            });
            
            resultItem.addEventListener('touchend', function() {
                this.style.backgroundColor = '';
            });
            
            searchResults.appendChild(resultItem);
        });
        
        if (results.length > 5) {
            const showMoreItem = document.createElement('div');
            showMoreItem.className = 'search-show-more';
            showMoreItem.textContent = `See all ${results.length} results`;
            searchResults.appendChild(showMoreItem);
            
            // Handle "See all results" click
            showMoreItem.addEventListener('click', function() {
                // Show all results
                searchResults.innerHTML = '';
                
                results.forEach(item => {
                    const resultItem = document.createElement('a');
                    resultItem.href = basePath + item.url;
                    resultItem.className = 'search-result-item';
                    
                    resultItem.innerHTML = `
                        <div class="search-result-icon"><i class="${item.icon}"></i></div>
                        <div class="search-result-content">
                            <div class="search-result-title">${item.name}</div>
                            <div class="search-result-description">${item.description}</div>
                        </div>
                    `;
                    
                    // Add touch feedback for mobile
                    resultItem.addEventListener('touchstart', function() {
                        this.style.backgroundColor = 'rgba(var(--primary-color-rgb), 0.1)';
                    });
                    
                    resultItem.addEventListener('touchend', function() {
                        this.style.backgroundColor = '';
                    });
                    
                    searchResults.appendChild(resultItem);
                });
            });
        }
    }
}

// Adjust base URL for tools based on current location
function getBaseUrl() {
    const path = window.location.pathname;
    if (path.includes('/tools/')) {
        return '../';
    } else if (path.includes('/pages/')) {
        return '../';
    }
    return '';
}

// Function to fix sidebar links based on current location
function fixSidebarLinks() {
    // Get all links in the sidebar
    const sidebarLinks = document.querySelectorAll('#sidebar a');
    const isInToolsDirectory = window.location.pathname.includes('/tools/');
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Fix home link
        if (href === '/') {
            link.setAttribute('href', (isInToolsDirectory || isInPagesDirectory) ? '../' : '/');
            return;
        }
        
        // Fix tool links when in tools directory
        if (isInToolsDirectory && href.startsWith('tools/')) {
            // Remove the 'tools/' prefix
            const fixedHref = href.replace('tools/', '');
            link.setAttribute('href', fixedHref);
        }
        
        // Fix tool links when in pages directory
        if (isInPagesDirectory && href.startsWith('tools/')) {
            // Add proper relative path
            const fixedHref = '../' + href;
            link.setAttribute('href', fixedHref);
        }
        
        // Fix page links when in tools directory
        if (isInToolsDirectory && href.startsWith('pages/')) {
            // Add proper relative path
            const fixedHref = '../' + href;
            link.setAttribute('href', fixedHref);
        }
    });
    
    // Also fix footer links when in tools or pages directory
    if (isInToolsDirectory || isInPagesDirectory) {
        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Fix page links in footer
            if (href && href.startsWith('pages/')) {
                const fixedHref = isInPagesDirectory ? href.replace('pages/', '') : '../' + href;
                link.setAttribute('href', fixedHref);
            }
            // Fix tool links in footer
            if (href && href.startsWith('tools/')) {
                const fixedHref = isInToolsDirectory ? href.replace('tools/', '') : '../' + href;
                link.setAttribute('href', fixedHref);
            }
            // Fix home link
            if (href === '/') {
                link.setAttribute('href', '../');
            }
        });
    }
}

// Also fix links after window is completely loaded (for any dynamic content)
window.addEventListener('load', function() {
    fixSidebarLinks();
}); 