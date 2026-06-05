document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Sticky Navbar & Scroll Effects
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.includes('.html')) return;
            
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

    // Intersection Observer for Reveal Animations
    const revealElements = document.querySelectorAll('.reveal, .sector-card, .brand-card');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a stats counter, trigger the animation
                if (entry.target.classList.contains('stat-item')) {
                    const numberEl = entry.target.querySelector('.stat-number');
                    if (numberEl && !numberEl.classList.contains('counted')) {
                        const target = parseInt(numberEl.getAttribute('data-target'));
                        animateValue(numberEl, 0, target, 2000);
                        numberEl.classList.add('counted');
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        // Add reveal class to cards that don't have it explicitly
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
        revealObserver.observe(el);
    });

    // Function to animate numbers
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuart easing function
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end;
            }
        };
        window.requestAnimationFrame(step);
    }



    // === LIGHT/DARK MODE TOGGLE ===
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'dark') {
        document.body.classList.add('dark-theme');
    } else if (currentTheme == 'light') {
        document.body.classList.remove('dark-theme');
    } else if (prefersDarkScheme.matches) {
        // If no preference is stored, use system preference
        document.body.classList.add('dark-theme');
    }

    // Toggle logic with View Transitions API (Light/Dark expanding circle)
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const toggleTheme = () => {
                document.body.classList.toggle('dark-theme');
                const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                localStorage.setItem('theme', theme);
            };

            // Check if browser supports View Transitions API
            if (!document.startViewTransition) {
                toggleTheme();
                return;
            }

            // Get click coordinates
            const x = e.clientX;
            const y = e.clientY;

            // Calculate the distance to the furthest corner to ensure full coverage
            const endRadius = Math.hypot(
                Math.max(x, innerWidth - x),
                Math.max(y, innerHeight - y)
            );

            // Start the transition
            const transition = document.startViewTransition(() => {
                toggleTheme();
            });

            // Wait for pseudo-elements to be created, then animate
            transition.ready.then(() => {
                const clipPath = [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`
                ];

                document.documentElement.animate(
                    {
                        clipPath: clipPath,
                    },
                    {
                        duration: 500,
                        easing: 'ease-out',
                        pseudoElement: '::view-transition-new(root)',
                    }
                );
            });
        });
    });

    // === SPOTLIGHT EFFECT (LIGHTING THEME) ===
    const spotlightCards = document.querySelectorAll('.sector-card, .brand-ext-card, .stat-item, .contact-form-panel');
    
    spotlightCards.forEach(card => {
        card.classList.add('spotlight-card');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });
