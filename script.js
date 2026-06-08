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


    // === COOKIE BANNER LOGIC ===
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieReject = document.getElementById('cookie-reject');
    const openCookieSettings = document.getElementById('open-cookie-settings');

    if (cookieBanner) {
        // Check if user has already made a choice
        const cookieChoice = localStorage.getItem('cookieChoice');
        
        if (!cookieChoice) {
            // Slight delay before showing banner for better UX
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        const handleCookieAction = (choice) => {
            localStorage.setItem('cookieChoice', choice);
            cookieBanner.classList.remove('show');
            
            // If accepted, we could initialize analytics here
            if (choice === 'accepted') {
                console.log('Cookies accepted - initializing analytics...');
            }
        };

        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => handleCookieAction('accepted'));
        }

        if (cookieReject) {
            cookieReject.addEventListener('click', () => handleCookieAction('rejected'));
        }

        // Allow user to reopen cookie settings from footer
        if (openCookieSettings) {
            openCookieSettings.addEventListener('click', (e) => {
                e.preventDefault();
                cookieBanner.classList.add('show');
            });
        }
    }

    // === CATALOGS MODAL LOGIC ===

    // === CATALOGS MODAL LOGIC ===
    const catalogData = {
        'https://www.eta.it': {
            name: 'ETA',
            officialLink: 'https://www.eta.it/it/cataloghi/',
            catalogs: [
                { name: 'Catalogo Generale', file: 'cataloghi/catalogo_2026_eta.pdf' },
                { name: 'Listino Prezzi', file: 'cataloghi/listino_2026_eta.pdf' }
            ]
        },
        'https://www.arcluce.it': {
            name: 'Arcluce',
            officialLink: 'https://www.arcluce.it/it/download',
            catalogs: [
                { name: 'Catalogo Indoor 2026', file: 'cataloghi/catalogo_2026_arcluce.pdf' },
                { name: 'Catalogo Outdoor 2026', file: 'cataloghi/outdoor_2026_arcluce.pdf' }
            ]
        },
        'https://www.amra-chauvin-arnoux.it': {
            name: 'AMRA',
            officialLink: 'https://www.amra-chauvin-arnoux.it/',
            catalogs: [
                { name: 'Catalogo Strumentazione 2026', file: 'cataloghi/catalogo_2026_amra.pdf' }
            ]
        },
        'https://www.chauvin-arnoux.com/it': {
            name: 'Chauvin Arnoux',
            officialLink: 'https://www.chauvin-arnoux.com/it',
            catalogs: [
                { name: 'Catalogo Prodotti 2026', file: 'cataloghi/catalogo_2026_chauvin-arnoux.pdf' }
            ]
        },
        'https://www.icar.com': {
            name: 'Icar',
            officialLink: 'https://www.icar.com/',
            catalogs: [
                { name: 'Catalogo Rifasamento 2026', file: 'cataloghi/catalogo_2026_icar.pdf' }
            ]
        },
        'https://www.ortea.com/it': {
            name: 'Ortea',
            officialLink: 'https://www.ortea.com/it',
            catalogs: [
                { name: 'Catalogo Power Quality 2026', file: 'cataloghi/catalogo_2026_ortea.pdf' }
            ]
        },
        'https://www.ilme.com/it': {
            name: 'ILME',
            officialLink: 'https://www.ilme.com/it/download/cataloghi/',
            catalogs: [
                { name: 'Catalogo Generale Connettori 2026', file: 'cataloghi/catalogo_2026_ilme.pdf' },
                { name: 'Novità Prodotti 2026', file: 'cataloghi/novita_2026_ilme.pdf' }
            ]
        },
        'https://www.teknomega.it': {
            name: 'Teknomega',
            officialLink: 'https://www.teknomega.it/',
            catalogs: [
                { name: 'Catalogo Fissaggio 2026', file: 'cataloghi/catalogo_2026_teknomega.pdf' }
            ]
        },
        'https://www.zamet.it': {
            name: 'Zamet',
            officialLink: 'https://www.zamet.it/',
            catalogs: [
                { name: 'Catalogo Canalisazioni 2026', file: 'cataloghi/catalogo_2026_zamet.pdf' }
            ]
        }
    };

    const modalOverlay = document.getElementById('catalog-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalBrandName = document.getElementById('modal-brand-name');
    const modalOfficialLink = document.getElementById('modal-official-link');
    const modalCatalogList = document.getElementById('modal-catalog-list');
    const openModalBtns = document.querySelectorAll('.open-catalog-modal');

    if (modalOverlay) {
        // Open Modal
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const brandKey = btn.getAttribute('data-brand');
                const data = catalogData[brandKey];
                
                if (data) {
                    modalBrandName.textContent = 'Cataloghi ' + data.name;
                    modalOfficialLink.href = data.officialLink;
                    
                    // Populate catalog list
                    modalCatalogList.innerHTML = '';
                    data.catalogs.forEach(cat => {
                        const link = document.createElement('a');
                        link.href = cat.file;
                        link.download = '';
                        link.className = 'catalog-item';
                        link.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            ${cat.name}
                        `;
                        modalCatalogList.appendChild(link);
                    });
                    
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        // Close Modal logic
        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // === VIDEO VETRINA LOGIC (YOUTUBE AUTOMATION) ===
    const loadYouTubeVetrina = async () => {
        const prodottiGrid = document.getElementById('prodotti-grid');
        if (!prodottiGrid) return;
        
        prodottiGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; width: 100%;"><div class="spinner" style="margin: 0 auto 1rem;"></div><p>Sincronizzazione vetrina prodotti in corso...</p></div>';

        // Official YouTube Channel IDs for the brands
        const brands = [
            { id: 'UC8RUoMHUXQrcxb8_hj_A08w', name: 'ETA S.p.A.' },
            { id: 'UC-qS9T55vW4a-9L8a-6l2_A', name: 'Arcluce' },
            { id: 'UC-m-R2pY_D_S834p5r1-z_Q', name: 'ILME' },
            { id: 'UCqwcSga4ZzG3ntf6hYRu_Nw', name: 'Ortea Next' },
            { id: 'UCx39e9waTxaUg8GdQ7P7NUg', name: 'AMRA' },
            { id: 'UCYfG3qD5q2cJXlpq6YHtGbA', name: 'Chauvin Arnoux' },
            { id: 'UCIH8vVkJ4wY0ojELBHSUpiw', name: 'Teknomega' },
            { id: 'UCnPpV1pxJb6qZ6IKGXfuqUw', name: 'Zamet SpA' }
        ];
        
        try {
            let allVideos = [];
            
            // Parole chiave per identificare video di prodotti/tecnici (incluso l'inglese per i canali internazionali come Chauvin Arnoux UK)
            const technicalKeywords = [
                'nuovo', 'nuova', 'prodotto', 'gamma', 'quadro', 'quadri', 'installazione', 'tecnic', 'serie', 'sistema', 'soluzion', 'illuminazione', 'led', 'catalogo', 'novità', 'tutorial', 'guida', 'accessori', 'inox', 'relè', 'stabilizzator', 'condizionator', 'fiera', 'sps', 'presentazione', 'strument', 'misura',
                'product', 'steel', 'tester', 'unboxing', 'guide', 'multifunction', 'system', 'monitoring', 'energy', 'logger', 'efficiency', 'accessories', 'solution', 'instrument', 'measurement', 'how to', 'overview', 'features', 'industrial', 'commercial', 'meter'
            ];

            // Calcola la data limite (esattamente 6 mesi fa)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const sixMonthsAgoTime = sixMonthsAgo.getTime();

            // Fetch videos from all channels in parallel
            await Promise.all(brands.map(async (brand) => {
                const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${brand.id}`;
                const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
                
                try {
                    const response = await fetch(apiUrl);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === 'ok' && data.items) {
                            
                            // Filtra solo i video tecnici e caricati negli ultimi 6 mesi
                            const techVideos = data.items.filter(item => {
                                const titleLower = item.title.toLowerCase();
                                const isTechnical = technicalKeywords.some(kw => titleLower.includes(kw));
                                const isRecent = new Date(item.pubDate).getTime() >= sixMonthsAgoTime;
                                return isTechnical && isRecent;
                            });

                            // Prendi i primi 5 video tecnici per ogni brand
                            const items = techVideos.slice(0, 5).map(item => ({
                                ...item,
                                brandName: brand.name,
                                timestamp: new Date(item.pubDate).getTime()
                            }));
                            allVideos = allVideos.concat(items);
                        }
                    }
                } catch (e) {
                    console.error(`Errore caricamento brand ${brand.name}:`, e);
                }
            }));
            
            // Sort all collected videos by newest first
            allVideos.sort((a, b) => b.timestamp - a.timestamp);
            
            // Take the newest 15 overall to display in the grid
            const displayVideos = allVideos.slice(0, 15);
            
            if (displayVideos.length === 0) {
                prodottiGrid.innerHTML = '<p style="color: var(--text-secondary); width: 100%; text-align: center;">Nessun video prodotto disponibile al momento.</p>';
                return;
            }
            
            let html = '';
            displayVideos.forEach(video => {
                // Formatting Date
                const dateObj = new Date(video.pubDate);
                const formattedDate = dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
                
                // Extract YouTube Video ID
                const videoId = video.link.includes('v=') ? video.link.split('v=')[1].split('&')[0] : '';

                html += `
                    <div class="product-card">
                        <div class="product-image-container" style="position: relative; cursor: pointer;" onclick="openVideo('${videoId}')">
                            <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                            <div style="position: absolute; background: rgba(0,0,0,0.6); color: white; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            </div>
                        </div>
                        <div class="product-content">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <span class="product-brand">${video.brandName}</span>
                                <span style="font-size: 0.8rem; color: var(--text-secondary);">${formattedDate}</span>
                            </div>
                            <h3 class="product-title" style="font-size: 1.1rem;">${video.title}</h3>
                            <button onclick="openVideo('${videoId}')" class="btn-primary" style="margin-top: auto; border: none; cursor: pointer; width: 100%; justify-content: center; font-family: inherit;">Guarda il video</button>
                        </div>
                    </div>
                `;
            });
            
            prodottiGrid.innerHTML = html;
            
            // Inizializza logica Slider
            initSlider(displayVideos.length);
            
        } catch (error) {
            console.error('Errore globale caricamento vetrina video:', error);
            prodottiGrid.innerHTML = '<p style="color: var(--error); width: 100%; text-align: center;">Si è verificato un errore nel caricamento della Vetrina Automatica.</p>';
        }
    };
    
    // Funzione per gestire lo slider
    function initSlider(totalItems) {
        const track = document.getElementById('prodotti-grid');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');
        const dotsContainer = document.getElementById('slider-dots');
        
        if(!track || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        
        // Calcola quanti elementi mostrare in base alla finestra
        let itemsPerView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
        let maxIndex = Math.max(0, totalItems - itemsPerView);
        
        // Genera i dots
        dotsContainer.innerHTML = '';
        const numDots = Math.ceil(totalItems / itemsPerView);
        for(let i=0; i<numDots; i++) {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${i===0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                currentIndex = Math.min(i * itemsPerView, maxIndex);
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
        
        function updateSlider() {
            // Aggiorna offset track
            const itemWidth = track.children[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            const moveAmount = (itemWidth + gap) * currentIndex;
            track.style.transform = `translateX(-${moveAmount}px)`;
            
            // Aggiorna stato bottoni
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
            
            // Aggiorna dots
            const activeDotIndex = Math.floor(currentIndex / itemsPerView);
            Array.from(dotsContainer.children).forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
            });
        }
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex = Math.max(0, currentIndex - itemsPerView);
                updateSlider();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex = Math.min(maxIndex, currentIndex + itemsPerView);
                updateSlider();
            }
        });
        
        window.addEventListener('resize', () => {
            itemsPerView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
            maxIndex = Math.max(0, totalItems - itemsPerView);
            if(currentIndex > maxIndex) currentIndex = maxIndex;
            updateSlider();
            
            // Rigenera dots su resize per correttezza
            dotsContainer.innerHTML = '';
            const numDots = Math.ceil(totalItems / itemsPerView);
            for(let i=0; i<numDots; i++) {
                const dot = document.createElement('div');
                dot.className = `slider-dot ${Math.floor(currentIndex/itemsPerView)===i ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    currentIndex = Math.min(i * itemsPerView, maxIndex);
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        });
        
        updateSlider();
    }
    
    loadYouTubeVetrina();

    // === VIDEO MODAL LOGIC ===
    window.openVideo = function(videoId) {
        if (!videoId) return;
        const videoModal = document.getElementById('video-modal');
        const youtubePlayer = document.getElementById('youtube-player');
        if (videoModal && youtubePlayer) {
            youtubePlayer.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeVideoModal = document.getElementById('close-video-modal');
    if (closeVideoModal) {
        closeVideoModal.addEventListener('click', () => {
            const videoModal = document.getElementById('video-modal');
            const youtubePlayer = document.getElementById('youtube-player');
            if (videoModal && youtubePlayer) {
                videoModal.classList.remove('active');
                youtubePlayer.src = '';
                document.body.style.overflow = '';
            }
        });
    }

    // Close video modal on outside click
    window.addEventListener('click', (e) => {
        const videoModal = document.getElementById('video-modal');
        if (videoModal && e.target === videoModal) {
            const youtubePlayer = document.getElementById('youtube-player');
            videoModal.classList.remove('active');
            if (youtubePlayer) youtubePlayer.src = '';
            document.body.style.overflow = '';
        }
    });

