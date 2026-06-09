// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 2. Navbar Scroll Effect & ScrollSpy
    const navbar = document.getElementById('navbar');
    // On the homepage, links correspond to sections. On other pages they might not.
    // So we use standard querySelectorAll for nav links that are internal (#...)
    const navItems = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href^="index.html#"]');
    
    // Funzione per capire se siamo sulla homepage
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('montunato/');
    
    // Per ScrollSpy: raccogliamo le sezioni della homepage
    const sections = [];
    if (isHomePage) {
        navItems.forEach(item => {
            // Estrai l'ID, sia che sia href="#id" o href="index.html#id"
            let targetId = '';
            if (item.getAttribute('href').startsWith('#')) {
                targetId = item.getAttribute('href').substring(1);
            } else if (item.getAttribute('href').includes('#')) {
                targetId = item.getAttribute('href').split('#')[1];
            }
            
            if (targetId) {
                const section = document.getElementById(targetId);
                if (section) {
                    sections.push({
                        element: section,
                        link: item
                    });
                }
            }
        });
    }

    window.addEventListener('scroll', () => {
        // Navbar Scrolled style
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // ScrollSpy logic (only on home page where sections exist)
        if (isHomePage && sections.length > 0) {
            let current = '';
            const scrollPosition = window.scrollY + window.innerHeight / 3; // Punto di intersezione
            
            sections.forEach(sec => {
                const sectionTop = sec.element.offsetTop;
                const sectionHeight = sec.element.offsetHeight;
                
                // Se la posizione di scroll è all'interno della sezione
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = sec.link;
                }
            });
            
            // Caso speciale per l'ultima sezione (se siamo arrivati in fondo alla pagina)
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
                current = sections[sections.length - 1].link;
            }
            
            // Aggiorna le classi active
            navItems.forEach(item => {
                item.classList.remove('active');
            });
            
            if (current) {
                current.classList.add('active');
            } else if (window.scrollY < sections[0].element.offsetTop) {
                // Se siamo in cima prima della prima sezione
                sections[0].link.classList.add('active');
            }
        }
    });
    
    // Inizializza subito lo stato (nel caso la pagina venga caricata già a metà scroll)
    window.dispatchEvent(new Event('scroll'));

    // 3. Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger immediately for elements in viewport on load

    // 4. Smooth Scrolling for Anchor Links (Home Page mostly)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Stat Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateStats = () => {
        if (hasAnimated) return;

        stats.forEach(stat => {
            const elementTop = stat.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 50) {
                hasAnimated = true; // Previene ri-animazione
                
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.innerText = target;
                    }
                };
                updateCounter();
            }
        });
    };

    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load

    // 6. Theme Toggle (Light/Dark Mode)
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            
            // Save preference
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 7. Cookie Banner Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    const settingsBtn = document.getElementById('open-cookie-settings');

    if (cookieBanner) {
        // Show banner after short delay if no preference saved
        if (!localStorage.getItem('cookie_preference')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        const closeBannerAndSave = (pref) => {
            localStorage.setItem('cookie_preference', pref);
            cookieBanner.classList.remove('show');
        };

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => closeBannerAndSave('all'));
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => closeBannerAndSave('essential'));
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                cookieBanner.classList.add('show');
            });
        }
    }

    // 8. Dynamic Products Slider (Youtube)
    const initSlider = () => {
        const sliderTrack = document.getElementById('prodotti-grid');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');
        const dotsContainer = document.getElementById('slider-dots');
        
        if (!sliderTrack) return;

        // Dati dei video di YouTube
        const videos = [
            { id: "JcO06t7z268", brand: "Ortea", title: "Presentazione Aziendale e Prodotti" },
            { id: "9E_q_9v3j2Q", brand: "Teknomega", title: "Soluzioni per Cablaggio e Quadristica" },
            { id: "mJ2L4Dmsr4o", brand: "Zamet", title: "Sistemi di Canalizzazione Portacavi" },
            { id: "5z_E2vOq7L4", brand: "ILME", title: "Connettori Industriali Multipolari" },
            { id: "A5PzZ-m-rN0", brand: "Arcluce", title: "Illuminazione Architetturale LED" },
            { id: "T9_8Vb0s1_M", brand: "ETA", title: "Quadri Elettrici in Acciaio Inox" },
            { id: "8k2_H6g-Y4Y", brand: "Chauvin Arnoux", title: "Strumentazione di Misura e Collaudo" },
            { id: "M9_0Y5k1-hI", brand: "Icar", title: "Rifasamento e Condensatori" },
            { id: "K3_9L5m-G6H", brand: "AMRA", title: "Relè Elettromeccanici di Sicurezza" }
        ];

        // Se non ci sono video, nascondi la sezione
        if (videos.length === 0) {
            document.getElementById('prodotti-vetrina').style.display = 'none';
            return;
        }

        // Genera le card dei video
        sliderTrack.innerHTML = videos.map((video, index) => `
            <div class="video-card" data-index="${index}">
                <div class="video-thumbnail-wrapper" onclick="openVideo('${video.id}')">
                    <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" 
                         alt="${video.title}" 
                         class="video-thumbnail"
                         onerror="this.src='https://img.youtube.com/vi/${video.id}/hqdefault.jpg'">
                    <div class="play-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
                <div class="video-info">
                    <div class="video-brand">${video.brand}</div>
                    <h4 class="video-title">${video.title}</h4>
                </div>
            </div>
        `).join('');

        // Logica dello Slider
        let currentSlide = 0;
        let cardsPerView = window.innerWidth > 768 ? 3 : 1;
        const totalSlides = Math.ceil(videos.length / cardsPerView);

        // Genera i punti
        if (dotsContainer) {
            dotsContainer.innerHTML = Array.from({ length: totalSlides }).map((_, i) => 
                `<div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
            ).join('');

            // Aggiungi event listener ai punti
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
            });
        }

        const updateSlider = () => {
            const cardWidth = 100 / cardsPerView;
            sliderTrack.style.transform = `translateX(-${currentSlide * cardsPerView * cardWidth}%)`;
            
            // Aggiorna stato pulsanti
            if (prevBtn) prevBtn.disabled = currentSlide === 0;
            if (nextBtn) nextBtn.disabled = currentSlide >= totalSlides - 1;

            // Aggiorna punti
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
        };

        const goToSlide = (index) => {
            currentSlide = index;
            updateSlider();
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateSlider();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentSlide < totalSlides - 1) {
                    currentSlide++;
                    updateSlider();
                }
            });
        }

        // Gestione ridimensionamento finestra
        window.addEventListener('resize', () => {
            const newCardsPerView = window.innerWidth > 768 ? 3 : 1;
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentSlide = 0; // Resetta alla prima slide
                // Ricrea i punti se necessario
                const newTotalSlides = Math.ceil(videos.length / cardsPerView);
                if (dotsContainer) {
                    dotsContainer.innerHTML = Array.from({ length: newTotalSlides }).map((_, i) => 
                        `<div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
                    ).join('');
                    
                    const dots = dotsContainer.querySelectorAll('.dot');
                    dots.forEach((dot, index) => {
                        dot.addEventListener('click', () => goToSlide(index));
                    });
                }
                updateSlider();
            }
        });

        // Inizializza stato iniziale
        updateSlider();
    };

    initSlider();

    // Funzione globale per aprire il modale video
    window.openVideo = (videoId) => {
        const modal = document.getElementById('video-modal');
        const iframe = document.getElementById('youtube-player');
        
        if (modal && iframe) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Previeni scroll della pagina
        }
    };

    // Chiudi modale video
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-video-modal');

    const closeVideoModal = () => {
        if (videoModal) {
            const iframe = document.getElementById('youtube-player');
            if (iframe) iframe.src = ''; // Ferma il video
            videoModal.classList.remove('active');
            document.body.style.overflow = ''; // Ripristina scroll
        }
    };

    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', closeVideoModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }
    
    // 9. Catalog Modal System
    const catalogModal = document.getElementById('catalog-modal');
    const closeCatalogBtn = document.getElementById('close-catalog-modal');
    const modalBrandTitle = document.getElementById('modal-brand-title');
    const modalCatalogList = document.getElementById('catalog-files-list');
    
    if (catalogModal && closeCatalogBtn) {
        
        // Funzione per chiudere il modale e ripristinare il body
        const closeCatalogModal = () => {
            catalogModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        // Chiudi cliccando la X
        closeCatalogBtn.addEventListener('click', closeCatalogModal);

        // Chiudi cliccando fuori dal contenuto
        catalogModal.addEventListener('click', (e) => {
            if (e.target === catalogModal) {
                closeCatalogModal();
            }
        });

        // Aggiungi event listener a tutte le card brand che hanno la classe
        document.querySelectorAll('.open-catalog-modal').forEach(card => {
            card.addEventListener('click', async function() {
                const brandKey = this.getAttribute('data-brand');
                if (brandKey) {
                    
                    // Mostra il modale e cambia il titolo per prima cosa (UI instantanea)
                    const data = getBrandData(brandKey);
                    modalBrandTitle.textContent = `Cataloghi ${data.displayName}`;
                    catalogModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                    
                    // Show loading state
                    modalCatalogList.innerHTML = '<div style="width:100%; text-align:center; padding: 2rem 0;"><div class="spinner" style="margin:0 auto 1rem;"></div><p style="color:var(--text-secondary);">Ricerca cataloghi in corso...</p></div>';
                    
                    try {
                        const response = await fetch(`https://api.github.com/repos/ilmirco/montunatorappresentanze/contents/cataloghi/${data.folder}`);
                        
                        if (!response.ok) {
                            if (response.status === 404) {
                                modalCatalogList.innerHTML = '<p style="text-align:center; width:100%; color:var(--text-secondary); line-height: 1.6;">Nessun catalogo caricato al momento per questa azienda.<br>Per ricevere maggiori informazioni in merito, <a href="index.html#contatti" onclick="document.getElementById(\'close-catalog-modal\').click();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 500;">contattaci</a>.</p>';
                                return;
                            }
                            throw new Error('Errore API GitHub');
                        }
                        
                        const files = await response.json();
                        const pdfs = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
                        
                        modalCatalogList.innerHTML = '';
                        
                        if (pdfs.length === 0) {
                            modalCatalogList.innerHTML = '<p style="text-align:center; width:100%; color:var(--text-secondary); line-height: 1.6;">Nessun catalogo caricato al momento per questa azienda.<br>Per ricevere maggiori informazioni in merito, <a href="index.html#contatti" onclick="document.getElementById(\'close-catalog-modal\').click();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 500;">contattaci</a>.</p>';
                            return;
                        }
                        
                        pdfs.forEach(file => {
                            // Format the name: remove .pdf, replace _ and - with spaces
                            let label = file.name.substring(0, file.name.lastIndexOf('.'));
                            label = label.replace(/[_-]/g, ' ');
                            
                            // Formatta la dimensione
                            const sizeKB = (file.size / 1024).toFixed(1);
                            const sizeText = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB';
                            
                            const html = `
                                <a href="${file.download_url}" target="_blank" class="catalog-file-item">
                                    <div class="catalog-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    </div>
                                    <span class="catalog-name">${label}</span>
                                    <span class="catalog-meta">PDF • ${sizeText}</span>
                                </a>
                            `;
                            modalCatalogList.insertAdjacentHTML('beforeend', html);
                        });
                        
                    } catch (error) {
                        console.error('Error fetching catalogs:', error);
                        modalCatalogList.innerHTML = '<p style="text-align:center; width:100%; color:var(--accent-primary);">Errore durante il caricamento dei cataloghi. Riprova più tardi.</p>';
                    }
                }
            });
        });
    }
});

// Helper Function per mappare il brand in folder GitHub
function getBrandData(brandKey) {
    const registry = {
        'eta': { folder: 'eta', displayName: 'ETA' },
        'arcluce': { folder: 'arcluce', displayName: 'Arcluce' },
        'amra': { folder: 'amra', displayName: 'AMRA' },
        'chauvin-arnoux': { folder: 'chauvin-arnoux', displayName: 'Chauvin Arnoux' },
        'icar': { folder: 'icar', displayName: 'Icar' },
        'ilme': { folder: 'ilme', displayName: 'ILME' },
        'ortea': { folder: 'ortea', displayName: 'Ortea' },
        'teknomega': { folder: 'teknomega', displayName: 'Teknomega' },
        'zamet': { folder: 'zamet', displayName: 'Zamet' }
    };
    
    return registry[brandKey] || { folder: brandKey, displayName: brandKey.toUpperCase() };
}
