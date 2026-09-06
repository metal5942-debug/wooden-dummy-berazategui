/* ==========================================================================
   WOODEN DUMMY BERAZATEGUI - MAIN INTERACTION & APP LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // 3. Header Scroll Effect & Active Link Highlight
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            navbar.style.background = 'rgba(13, 15, 19, 0.96)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(20, 23, 31, 0.85)';
        }

        // Active Section Scroll Highlight
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Hero Carousel Crossfade
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // 4b. About Section Carousel
    const aboutSlides = document.querySelectorAll('.about-slide');
    const aboutDots = document.querySelectorAll('#about-dots .dot');
    const aboutPrev = document.getElementById('about-prev');
    const aboutNext = document.getElementById('about-next');

    if (aboutSlides.length > 0) {
        let currentAboutIdx = 0;
        let aboutTimer = null;

        function showAboutSlide(index) {
            aboutSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            aboutDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentAboutIdx = index;
        }

        function nextAboutSlide() {
            const nextIdx = (currentAboutIdx + 1) % aboutSlides.length;
            showAboutSlide(nextIdx);
        }

        function prevAboutSlide() {
            const prevIdx = (currentAboutIdx - 1 + aboutSlides.length) % aboutSlides.length;
            showAboutSlide(prevIdx);
        }

        function startAboutTimer() {
            stopAboutTimer();
            aboutTimer = setInterval(nextAboutSlide, 4500);
        }

        function stopAboutTimer() {
            if (aboutTimer) clearInterval(aboutTimer);
        }

        if (aboutNext) {
            aboutNext.addEventListener('click', () => {
                nextAboutSlide();
                startAboutTimer();
            });
        }

        if (aboutPrev) {
            aboutPrev.addEventListener('click', () => {
                prevAboutSlide();
                startAboutTimer();
            });
        }

        aboutDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.getAttribute('data-index'), 10);
                showAboutSlide(idx);
                startAboutTimer();
            });
        });

        startAboutTimer();
    }

    // 5. Product Catalog Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 6. Interactive Customizer / Quote Generator
    initCustomizer();

    // 7. FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 8. Floating WhatsApp Widget Popup
    const waFloatBtn = document.getElementById('wa-float-btn');
    const waChatPopup = document.getElementById('wa-chat-popup');
    const waPopupClose = document.getElementById('wa-popup-close');

    if (waFloatBtn && waChatPopup) {
        waFloatBtn.addEventListener('click', () => {
            waChatPopup.classList.toggle('active');
        });

        if (waPopupClose) {
            waPopupClose.addEventListener('click', () => {
                waChatPopup.classList.remove('active');
            });
        }
    }

    // 9. Copy Address to Clipboard Button
    const btnCopyAddr = document.getElementById('btn-copy-address');
    if (btnCopyAddr) {
        btnCopyAddr.addEventListener('click', () => {
            const addressText = "Calle 29 #5942, Berazategui, Provincia de Buenos Aires, Argentina";
            navigator.clipboard.writeText(addressText).then(() => {
                const span = btnCopyAddr.querySelector('span');
                const originalText = span.textContent;
                span.textContent = "¡Copiado!";
                btnCopyAddr.style.borderColor = "var(--primary-gold)";
                btnCopyAddr.style.color = "var(--primary-gold)";
                setTimeout(() => {
                    span.textContent = originalText;
                    btnCopyAddr.style.borderColor = "";
                    btnCopyAddr.style.color = "";
                }, 2000);
            }).catch(err => {
                console.error("Error al copiar dirección:", err);
            });
        });
    }
});

/* ==========================================================================
   PRODUCT THUMBNAIL GALLERY FUNCTIONS
   ========================================================================== */
function changeImage(thumbnail, targetId) {
    const mainImage = document.getElementById(targetId);
    if (!mainImage) return;

    mainImage.src = thumbnail.src;

    const thumbnails = thumbnail.parentElement.querySelectorAll('img');
    thumbnails.forEach(thumb => thumb.classList.remove('active-thumb'));
    thumbnail.classList.add('active-thumb');
}

/* ==========================================================================
   CUSTOMIZER / QUOTE GENERATOR LOGIC
   ========================================================================== */
function initCustomizer() {
    const modelCards = document.querySelectorAll('#opt-model .option-card');
    const heightCards = document.querySelectorAll('#opt-height .option-card');
    const selectFinish = document.getElementById('select-finish');
    const chkPads = document.getElementById('chk-pads');
    const chkSoporte = document.getElementById('chk-soporte');
    const chkEnvio = document.getElementById('chk-envio');

    const sumModel = document.getElementById('sum-model');
    const sumHeight = document.getElementById('sum-height');
    const sumFinish = document.getElementById('sum-finish');
    const sumExtras = document.getElementById('sum-extras');
    const btnSendWA = document.getElementById('btn-send-custom-wa');

    if (!sumModel) return;

    let selectedModel = "Modelo Clásico de Pared";
    let selectedHeight = "1.70m - 1.82m (Estándar)";

    // Model selection
    modelCards.forEach(card => {
        card.addEventListener('click', () => {
            modelCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedModel = card.getAttribute('data-value');
            updateSummary();
        });
    });

    // Height selection
    heightCards.forEach(card => {
        card.addEventListener('click', () => {
            heightCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedHeight = card.getAttribute('data-value');
            updateSummary();
        });
    });

    // Finish dropdown & checkboxes listener
    if (selectFinish) selectFinish.addEventListener('change', updateSummary);
    if (chkPads) chkPads.addEventListener('change', updateSummary);
    if (chkSoporte) chkSoporte.addEventListener('change', updateSummary);
    if (chkEnvio) chkEnvio.addEventListener('change', updateSummary);

    function getExtras() {
        const extras = [];
        if (chkPads && chkPads.checked) extras.push("Pads de Impacto");
        if (chkSoporte && chkSoporte.checked) extras.push("Soporte Regulable");
        if (chkEnvio && chkEnvio.checked) extras.push("Envío a Domicilio");
        return extras.length > 0 ? extras.join(', ') : "Ninguno seleccionado";
    }

    function updateSummary() {
        sumModel.textContent = selectedModel;
        sumHeight.textContent = selectedHeight;
        sumFinish.textContent = selectFinish ? selectFinish.options[selectFinish.selectedIndex].text : '';
        sumExtras.textContent = getExtras();
    }

    // Send WhatsApp Action
    if (btnSendWA) {
        btnSendWA.addEventListener('click', () => {
            const finishText = selectFinish ? selectFinish.value : '';
            const extrasText = getExtras();

            const message = `Hola Wooden Dummy Berazategui! 👋 Quisiera solicitar un presupuesto personalizado con la siguiente configuración:

🪵 *Modelo:* ${selectedModel}
📏 *Estatura:* ${selectedHeight}
🎨 *Acabado / Madera:* ${finishText}
🛠️ *Accesorios / Adicionales:* ${extrasText}

¿Podrían indicarme precio y tiempos de fabricación? ¡Muchas gracias!`;

            const encodedMessage = encodeURIComponent(message);
            const waUrl = `https://wa.me/541164992982?text=${encodedMessage}`;
            window.open(waUrl, '_blank');
        });
    }
}

/* ==========================================================================
   LIGHTBOX MODAL & GALLERY ZOOM LOGIC
   ========================================================================== */
let currentSlideIndex = 0;
let currentImageGroup = [];
let isZoomed = false;

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    let targetImg = element;
    if (element && element.tagName !== 'IMG') {
        targetImg = element.querySelector('img') || element;
    }
    if (!targetImg || !targetImg.src) return;

    const groupName = targetImg.getAttribute('data-group');
    if (groupName) {
        const groupElements = document.querySelectorAll(`img[data-group="${groupName}"]`);
        const uniqueSources = [...new Set(Array.from(groupElements).map(el => el.src))];
        currentImageGroup = uniqueSources;
        currentSlideIndex = currentImageGroup.indexOf(targetImg.src);
        if (currentSlideIndex === -1) currentSlideIndex = 0;
    } else {
        currentImageGroup = [targetImg.src];
        currentSlideIndex = 0;
    }

    updateLightboxImage();
    lightbox.classList.add('active');
}

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-img');
    const thumbsContainer = document.getElementById('lightbox-thumbs');

    if (!lightboxImg || currentImageGroup.length === 0) return;

    lightboxImg.src = currentImageGroup[currentSlideIndex];
    
    // Reset zoom
    isZoomed = false;
    lightboxImg.classList.remove('zoomed');
    lightboxImg.style.transform = '';
    const zoomText = document.getElementById('zoom-text');
    if (zoomText) zoomText.textContent = "Zoom HD";

    // Build Modal Thumbnails
    if (thumbsContainer) {
        thumbsContainer.innerHTML = '';
        if (currentImageGroup.length > 1) {
            thumbsContainer.style.display = 'flex';
            currentImageGroup.forEach((src, idx) => {
                const thumb = document.createElement('img');
                thumb.src = src;
                thumb.className = `lightbox-thumb ${idx === currentSlideIndex ? 'active' : ''}`;
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentSlideIndex = idx;
                    updateLightboxImage();
                });
                thumbsContainer.appendChild(thumb);
            });
        } else {
            thumbsContainer.style.display = 'none';
        }
    }
}

function changeSlide(n) {
    if (currentImageGroup.length === 0) return;
    currentSlideIndex = (currentSlideIndex + n + currentImageGroup.length) % currentImageGroup.length;
    updateLightboxImage();
}

function toggleZoom() {
    const lightboxImg = document.getElementById('lightbox-img');
    const zoomText = document.getElementById('zoom-text');
    if (!lightboxImg) return;

    isZoomed = !isZoomed;
    if (isZoomed) {
        lightboxImg.classList.add('zoomed');
        if (zoomText) zoomText.textContent = "Alejar";
    } else {
        lightboxImg.classList.remove('zoomed');
        lightboxImg.style.transform = '';
        if (zoomText) zoomText.textContent = "Zoom HD";
    }
}

// Lightbox Listeners
const lightboxClose = document.getElementById('lightbox-close');
const lightboxModal = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-body')) {
            lightboxModal.classList.remove('active');
        }
    });

    if (lightboxImg) {
        lightboxImg.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleZoom();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') lightboxModal.classList.remove('active');
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
    });
}
