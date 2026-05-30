/* =========================================================
   HM PEPTIDE — script.js
   ========================================================= */

// ============================================================
// ACTIVE NAVIGATION STATE - MAIN FIX
// This MUST run first and will work on ALL pages
// ============================================================
(function setActiveNav() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('#mainNav a');
    if (!navLinks.length) return;

    // Get current page URL
    let currentUrl = window.location.href;
    let currentPage = window.location.pathname.split('/').pop();
    
    // Handle empty path (homepage)
    if (currentPage === "" || currentPage === "/" || currentPage === null) {
        currentPage = "index.html";
    }
    
    // Remove any query parameters
    if (currentPage.indexOf('?') !== -1) {
        currentPage = currentPage.split('?')[0];
    }
    
    // For detail pages, highlight the parent page
    if (currentPage === 'hmpeptide-product-detail.html') {
        currentPage = 'product.html';
    }
    if (currentPage === 'hmpeptide-sale-detail.html') {
        currentPage = 'hmpeptide-sales.html';
    }
    
    // Remove active class from ALL links first
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the link that matches current page
    navLinks.forEach(link => {
        let href = link.getAttribute('href');
        
        // Skip WhatsApp external link
        if (href && href.includes('wa.me')) return;
        if (href && href.includes('https://')) return;
        
        // Compare the href with current page
        if (href === currentPage) {
            link.classList.add('active');
        }
        
        // Special case for homepage
        if (currentPage === 'index.html' && (href === 'index.html' || href === '/' || href === '')) {
            link.classList.add('active');
        }
    });
    
    // Also check by URL contains (fallback)
    if (!document.querySelector('#mainNav a.active')) {
        navLinks.forEach(link => {
            let href = link.getAttribute('href');
            if (href && currentUrl.indexOf(href) !== -1 && href !== 'https://wa.me/85293157951') {
                link.classList.add('active');
            }
        });
    }
})();

// ============================================================
// MOBILE NAVIGATION
// ============================================================
function toggleNav() {
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mainNav');
    const hamburger = document.getElementById('hamburger');
    
    if (nav && hamburger && !nav.contains(event.target) && !hamburger.contains(event.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', function() {
        const nav = document.getElementById('mainNav');
        if (nav) nav.classList.remove('open');
    });
});

// ============================================================
// HERO SLIDESHOW (if exists)
// ============================================================
(function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (slides.length && dots.length) {
        let current = 0;
        let autoTimer;

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }

        function startAuto() {
            if (autoTimer) clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(current + 1), 5500);
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
            nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goTo(parseInt(dot.dataset.index, 10));
                startAuto();
            });
        });

        startAuto();
    }
})();

// ============================================================
// BACK TO TOP BUTTON
// ============================================================
const backTop = document.getElementById('backToTop');
if (backTop) {
    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// NEWSLETTER SUBSCRIPTION
// ============================================================
function handleNewsletterSubmit() {
    const emailInput = document.querySelector('.email-row input');
    if (emailInput) {
        const email = emailInput.value;
        if (email && email.includes('@')) {
            alert('Thank you for subscribing! You will receive our price list soon.');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const arrowBtn = document.querySelector('.arrow-btn');
    if (arrowBtn) {
        arrowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleNewsletterSubmit();
        });
    }
    
    const emailInput = document.querySelector('.email-row input');
    if (emailInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleNewsletterSubmit();
            }
        });
    }
});

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function openLiveChat() {
    alert('Live chat support coming soon! Please email or WhatsApp us for immediate assistance.');
}

function showWeChat() {
    alert('Add our WeChat: HM_Peptide_Official\n\nScan QR code or search this ID to connect with us on WeChat.');
}
function toggleNav() { document.getElementById('mainNav').classList.toggle('open'); }
// track-visitor.js - Universal Visitor Tracking for HM Peptide Website
// Include this script on EVERY page of your website

(function() {
    // ======================= CONFIGURATION =======================
    const SUPABASE_URL = 'https://jhuwtkhztehhhifetqgb.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_RRDIuWw0eo26aKCHZGRKyQ_BFotKqyV';
    
    let supabase = null;
    let visitorId = null;
    let heartbeatInterval = null;
    
    // Initialize Supabase
    function initSupabase() {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('[VisitorTracker] Supabase initialized');
            return true;
        } else {
            console.error('[VisitorTracker] Supabase library not loaded');
            return false;
        }
    }
    
    // Get or create visitor ID (persists across pages using localStorage)
    function getVisitorId() {
        let id = localStorage.getItem('hm_visitor_id');
        if (!id) {
            id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('hm_visitor_id', id);
            console.log('[VisitorTracker] New visitor ID created:', id);
        }
        return id;
    }
    
    // Get current page URL
    function getCurrentPage() {
        return window.location.pathname + window.location.search;
    }
    
    // Get IP address (async, but we don't wait for it to complete)
    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch(e) {
            console.log('[VisitorTracker] Could not fetch IP:', e.message);
            return 'Unknown';
        }
    }
    
    // Get referrer (where they came from)
    function getReferrer() {
        return document.referrer || 'Direct';
    }
    
    // Track page view / update visitor
    async function trackPageView() {
        if (!supabase) return;
        
        try {
            const ip = await getIPAddress();
            const page = getCurrentPage();
            const referrer = getReferrer();
            
            const visitorData = {
                id: visitorId,
                ip_address: ip,
                page: page,
                referrer: referrer,
                user_agent: navigator.userAgent.substring(0, 500),
                last_seen: new Date().toISOString(),
                status: 'online',
                first_seen: localStorage.getItem('hm_first_seen') || new Date().toISOString(),
                total_page_views: parseInt(localStorage.getItem('hm_page_views') || '0') + 1
            };
            
            // Store first seen time
            if (!localStorage.getItem('hm_first_seen')) {
                localStorage.setItem('hm_first_seen', visitorData.first_seen);
            }
            
            // Update page view count
            localStorage.setItem('hm_page_views', visitorData.total_page_views);
            
            // Upsert to Supabase
            const { error } = await supabase
                .from('visitors')
                .upsert(visitorData, { onConflict: 'id' });
            
            if (error) throw error;
            
            console.log('[VisitorTracker] Tracked:', page, '- Views:', visitorData.total_page_views);
            
        } catch(e) {
            console.error('[VisitorTracker] Tracking error:', e.message);
        }
    }
    
    // Send heartbeat to keep session alive
    function startHeartbeat() {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        
        // Update last_seen every 25 seconds
        heartbeatInterval = setInterval(async () => {
            if (!supabase) return;
            
            try {
                const page = getCurrentPage();
                const { error } = await supabase
                    .from('visitors')
                    .update({ 
                        last_seen: new Date().toISOString(),
                        page: page
                    })
                    .eq('id', visitorId);
                
                if (error) throw error;
                
            } catch(e) {
                console.error('[VisitorTracker] Heartbeat error:', e.message);
            }
        }, 25000);
    }
    
    // Handle page visibility change (user switches tabs)
    function setupVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // User came back to the page
                trackPageView();
            }
        });
    }
    
    // Handle beforeunload (optional: mark as offline)
    function setupOfflineTracking() {
        window.addEventListener('beforeunload', () => {
            if (supabase && visitorId) {
                // Optionally mark as offline, but we'll let the admin dashboard handle expiry
                console.log('[VisitorTracker] Page closing');
            }
        });
    }
    
    // Main initialization
    async function init() {
        console.log('[VisitorTracker] Initializing...');
        
        // Wait for Supabase to be available
        if (typeof window.supabase === 'undefined') {
            console.error('[VisitorTracker] Supabase JS not loaded. Please add the script tag.');
            return;
        }
        
        if (!initSupabase()) return;
        
        visitorId = getVisitorId();
        
        // Track initial page view
        await trackPageView();
        
        // Start heartbeat
        startHeartbeat();
        
        // Setup additional tracking
        setupVisibilityTracking();
        setupOfflineTracking();
        
        console.log('[VisitorTracker] Active - Visitor ID:', visitorId);
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();