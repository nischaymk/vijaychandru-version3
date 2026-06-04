// script.js - Global functionality with enhanced animations

document.addEventListener('DOMContentLoaded', function() {
    // ==================== COUNTDOWN TIMER ====================
    function updateCountdown() {
        const targetDate = new Date('Jan 1, 2030 00:00:00').getTime();
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (86400000)) / (3600000));
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            // Update with pulse animation
            updateCountdownElement('days', days);
            updateCountdownElement('hours', String(hours).padStart(2, '0'));
            updateCountdownElement('minutes', String(minutes).padStart(2, '0'));
            updateCountdownElement('seconds', String(seconds).padStart(2, '0'));
        }
    }
    
    function updateCountdownElement(id, value) {
        const element = document.getElementById(id);
        if (element && element.innerText != value) {
            element.classList.add('update');
            element.innerText = value;
            setTimeout(() => {
                element.classList.remove('update');
            }, 300);
        } else if (element) {
            element.innerText = value;
        }
    }
    
    if (document.getElementById('days')) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ==================== SCROLL ANIMATIONS WITH INTERSECTION OBSERVER ====================
    // Select all elements that need animation
    const animatedElements = document.querySelectorAll(`
        .animate-in,
        .animate-fade-left,
        .animate-fade-right,
        .animate-scale,
        .animate-zoom,
        .pillar-card,
        .timeline-section,
        .pub-card-small,
        .countdown-block,
        .service-card,
        .pursuit-card,
        .intro-card,
        .news-section,
        .hero-section,
        .mission-section,
        .pillars-section,
        .about-grid .portrait-card,
        .about-grid .service-card,
        .about-grid .pursuit-card,
        .contact-info-card.centered,
        .contact-icons,
        .additional-pubs,
        .book-viewer,
        .pdf-viewer-container,
        .two-col .col-text,
        .two-col .col-media,
        .side-quote,
        .poem-quote
    `);
    
    // Create observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class based on element type
                if (entry.target.classList.contains('pillar-card') ||
                    entry.target.classList.contains('timeline-section') ||
                    entry.target.classList.contains('pub-card-small')) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Special handling for two-column content - animate each column separately
    const twoColTexts = document.querySelectorAll('.two-col .col-text');
    const twoColMedias = document.querySelectorAll('.two-col .col-media');
    
    twoColTexts.forEach(el => {
        el.classList.add('animate-fade-left');
        observer.observe(el);
    });
    
    twoColMedias.forEach(el => {
        el.classList.add('animate-fade-right');
        observer.observe(el);
    });

    // ==================== MOBILE MENU ====================
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            // Animate menu button
            const spans = menuBtn.querySelectorAll('span');
            if (navLinks.classList.contains('show')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // ==================== TIMELINE SCROLL SPY WITH ANIMATION ====================
    const sections = document.querySelectorAll('.timeline-section');
    const navLinksTimeline = document.querySelectorAll('.timeline-link');
    if (sections.length && navLinksTimeline.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            navLinksTimeline.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ==================== SHARE MODAL FUNCTIONALITY ====================
    const shareModal = document.getElementById('shareModal');
    const modalClose = document.getElementById('modalClose');
    const shareBtns = document.querySelectorAll('.share-btn');
    const modalOverlay = document.querySelector('.modal-overlay');

    if (shareModal && modalClose) {
        function closeModal() {
            shareModal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                shareModal.style.display = 'none';
                shareModal.style.animation = '';
            }, 300);
        }
        
        modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        
        shareBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = btn.getAttribute('data-platform');
                const url = encodeURIComponent(window.location.href);
                let shareUrl = '';
                
                if (platform === 'twitter') {
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=Check%20out%20this%20publication%20by%20Vijay%20Chandru`;
                } else if (platform === 'linkedin') {
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                } else if (platform === 'email') {
                    shareUrl = `mailto:?subject=Publication%20Share&body=${url}`;
                } else if (platform === 'copy') {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied!');
                    closeModal();
                    return;
                }
                
                if (shareUrl) window.open(shareUrl, '_blank');
                closeModal();
            });
        });
    }
});

// ==================== PDF.JS INTEGRATION FOR PUBLICATIONS PAGE ====================
(function() {
    const canvas = document.getElementById('pdfCanvas');
    if (!canvas) return;
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    
    const PDF_URL = 'Vijay Chandru.pdf';
    
    let pdfDoc = null;
    let currentPage = 1;
    let totalPages = 0;
    let currentZoom = 1.0;
    let isRendering = false;
    let renderTask = null;
    
    const ctx = canvas.getContext('2d');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const mobilePrevBtn = document.getElementById('mobilePrevBtn');
    const mobileNextBtn = document.getElementById('mobileNextBtn');
    const currentPageSpan = document.getElementById('currentPageNum');
    const totalPagesSpan = document.getElementById('totalPagesNum');
    const mobileCurrentPageSpan = document.getElementById('mobileCurrentPage');
    const mobileTotalPagesSpan = document.getElementById('mobileTotalPages');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomLevelSpan = document.getElementById('zoomLevel');
    const downloadBtn = document.getElementById('downloadBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const pdfLoading = document.getElementById('pdfLoading');
    const pdfContainer = document.getElementById('pdfCanvasContainer');
    const pdfWrapper = document.getElementById('pdfCanvasWrapper');
    
    function calculateOptimalZoom() {
        if (!pdfDoc || !pdfWrapper) return currentZoom;
        const containerWidth = pdfWrapper.clientWidth - 40;
        
        return pdfDoc.getPage(currentPage).then(function(page) {
            const originalWidth = page.getViewport({ scale: 1 }).width;
            let optimalZoom = containerWidth / originalWidth;
            optimalZoom = Math.min(Math.max(optimalZoom, 0.5), 1.2);
            return optimalZoom;
        }).catch(function() { return currentZoom; });
    }
    
    function loadPDF() {
        if (!pdfLoading) return;
        pdfLoading.style.display = 'flex';
        pdfLoading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading PDF document...';
        
        pdfjsLib.getDocument(PDF_URL).promise.then(function(pdfDoc_) {
            pdfDoc = pdfDoc_;
            totalPages = pdfDoc.numPages;
            if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
            if (mobileTotalPagesSpan) mobileTotalPagesSpan.textContent = totalPages;
            currentPage = 1;
            
            calculateOptimalZoom().then(function(optimalZoom) {
                currentZoom = optimalZoom;
                updateZoomDisplay();
                renderPage(currentPage);
            });
            
            if (pdfLoading) pdfLoading.style.display = 'none';
        }).catch(function(error) {
            console.error('Error loading PDF:', error);
            if (pdfLoading) {
                pdfLoading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error loading PDF. Please ensure the file "Vijay Chandru.pdf" exists.';
                pdfLoading.style.color = '#d4af37';
                pdfLoading.style.display = 'flex';
            }
        });
    }
    
    function renderPage(pageNumber) {
        if (!pdfDoc || isRendering) return;
        if (renderTask) { renderTask.cancel(); renderTask = null; }
        
        isRendering = true;
        if (pdfLoading) {
            pdfLoading.style.display = 'flex';
            pdfLoading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading page ' + pageNumber + '...';
        }
        
        pdfDoc.getPage(pageNumber).then(function(page) {
            const viewport = page.getViewport({ scale: currentZoom });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            canvas.style.maxWidth = viewport.width + 'px';
            
            if (pdfContainer) {
                pdfContainer.innerHTML = '';
                pdfContainer.appendChild(canvas);
                pdfContainer.style.width = '100%';
                pdfContainer.style.display = 'flex';
                pdfContainer.style.justifyContent = 'center';
                pdfContainer.style.overflowX = 'auto';
            }
            
            const renderContext = { canvasContext: ctx, viewport: viewport };
            renderTask = page.render(renderContext);
            renderTask.promise.then(function() {
                if (currentPageSpan) currentPageSpan.textContent = currentPage;
                if (mobileCurrentPageSpan) mobileCurrentPageSpan.textContent = currentPage;
                updateButtonStates();
                isRendering = false;
                renderTask = null;
                if (pdfLoading) pdfLoading.style.display = 'none';
            }).catch(function(error) {
                if (error.name !== 'RenderingCancelledException') {
                    console.error('Error rendering page:', error);
                }
                isRendering = false;
                renderTask = null;
                if (pdfLoading) pdfLoading.style.display = 'none';
            });
        }).catch(function(error) {
            console.error('Error getting page:', error);
            isRendering = false;
            if (pdfLoading) pdfLoading.style.display = 'none';
        });
    }
    
    function updateButtonStates() {
        const hasPrev = currentPage > 1;
        const hasNext = currentPage < totalPages;
        if (prevBtn) prevBtn.disabled = !hasPrev;
        if (nextBtn) nextBtn.disabled = !hasNext;
        if (mobilePrevBtn) mobilePrevBtn.disabled = !hasPrev;
        if (mobileNextBtn) mobileNextBtn.disabled = !hasNext;
    }
    
    function updateZoomDisplay() {
        if (zoomLevelSpan) zoomLevelSpan.textContent = Math.round(currentZoom * 100) + '%';
    }
    
    function nextPage() {
        if (pdfDoc && currentPage < totalPages && !isRendering) {
            currentPage++;
            renderPage(currentPage);
        }
    }
    
    function prevPage() {
        if (pdfDoc && currentPage > 1 && !isRendering) {
            currentPage--;
            renderPage(currentPage);
        }
    }
    
    function zoomIn() {
        if (currentZoom < 2.0) {
            currentZoom = Math.min(currentZoom + 0.1, 2.0);
            updateZoomDisplay();
            renderPage(currentPage);
        }
    }
    
    function zoomOut() {
        if (currentZoom > 0.5) {
            currentZoom = Math.max(currentZoom - 0.1, 0.5);
            updateZoomDisplay();
            renderPage(currentPage);
        }
    }
    
    function resetZoomToFit() {
        calculateOptimalZoom().then(function(optimalZoom) {
            currentZoom = optimalZoom;
            updateZoomDisplay();
            renderPage(currentPage);
        });
    }
    
    function downloadPDF() {
        const link = document.createElement('a');
        link.href = PDF_URL;
        link.download = 'Vijay_Chandru_Publications.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function toggleFullscreen() {
        const viewer = document.querySelector('.pdf-viewer-container');
        if (!document.fullscreenElement) {
            viewer.requestFullscreen().catch(err => console.error('Error:', err));
        } else {
            document.exitFullscreen();
        }
    }
    
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (pdfDoc && !isRendering) {
                calculateOptimalZoom().then(function(optimalZoom) {
                    currentZoom = optimalZoom;
                    updateZoomDisplay();
                    renderPage(currentPage);
                });
            }
        }, 300);
    }
    
    function handleKeyPress(e) {
        if (e.key === 'ArrowLeft') { prevPage(); e.preventDefault(); }
        else if (e.key === 'ArrowRight') { nextPage(); e.preventDefault(); }
        else if (e.key === '+' || e.key === '=') { zoomIn(); e.preventDefault(); }
        else if (e.key === '-' || e.key === '_') { zoomOut(); e.preventDefault(); }
    }
    
    let touchStartX = 0;
    function handleTouchStart(e) { touchStartX = e.changedTouches[0].screenX; }
    function handleTouchEnd(e) {
        const swipeDistance = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(swipeDistance) > 50) {
            swipeDistance > 0 ? prevPage() : nextPage();
        }
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    if (mobilePrevBtn) mobilePrevBtn.addEventListener('click', prevPage);
    if (mobileNextBtn) mobileNextBtn.addEventListener('click', nextPage);
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadPDF);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    document.addEventListener('keydown', handleKeyPress);
    window.addEventListener('resize', handleResize);
    
    const viewerContainer = document.querySelector('.pdf-viewer-container');
    if (viewerContainer) {
        viewerContainer.addEventListener('touchstart', handleTouchStart);
        viewerContainer.addEventListener('touchend', handleTouchEnd);
    }
    
    let lastTap = 0;
    if (canvas) {
        canvas.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            if (currentTime - lastTap < 500 && currentTime - lastTap > 0) {
                resetZoomToFit();
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    }
    
    loadPDF();
})();