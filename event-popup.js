// event-popup.js - COMPLETELY FIXED (No duplicate issues)

(function() {
    'use strict';
    
    // Prevent multiple executions
    if (window._eventPopupInitialized) {
        console.log('Event Popup already initialized, skipping');
        return;
    }
    
    const CONFIG = {
        autoCloseSeconds: 40,
        popupId: 'eventPopupOverlay',
        closeBtnId: 'closeEventPopupBtn',
        joinBtnId: 'eventJoinNowBtn',
        closeXBtnId: 'eventPopupCloseX',
        countdownSpanId: 'popupCountdown',
        timerFillId: 'popupTimerFill',
        localStorageKey: 'eventPopupSeen'
    };
    
    let popupElement = null;
    let timerInterval = null;
    let secondsLeft = CONFIG.autoCloseSeconds;
    let startTime = null;
    let isClosed = false;
    
    // Check if user has already seen the popup
    function hasUserSeenPopup() {
        const seen = localStorage.getItem(CONFIG.localStorageKey);
        return seen === 'true';
    }
    
    // Mark popup as seen
    function markPopupAsSeen() {
        localStorage.setItem(CONFIG.localStorageKey, 'true');
        console.log('Event Popup: Marked as seen');
    }
    
    // Update timer UI
    function updateTimerUI() {
        const countdownSpan = document.getElementById(CONFIG.countdownSpanId);
        const timerFill = document.getElementById(CONFIG.timerFillId);
        
        if (countdownSpan) {
            countdownSpan.innerText = secondsLeft;
        }
        if (timerFill) {
            const percent = (secondsLeft / CONFIG.autoCloseSeconds) * 100;
            timerFill.style.width = percent + '%';
        }
    }
    
    // Close the popup
    function closePopup() {
        if (isClosed) return;
        isClosed = true;
        
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        if (popupElement && popupElement.style.display !== 'none') {
            popupElement.classList.add('hidden-popup');
            setTimeout(() => {
                if (popupElement) {
                    popupElement.style.display = 'none';
                }
            }, 400);
        }
    }
    
    // Start countdown timer
    function startCountdown() {
        if (timerInterval) clearInterval(timerInterval);
        
        startTime = Date.now();
        secondsLeft = CONFIG.autoCloseSeconds;
        updateTimerUI();
        
        timerInterval = setInterval(() => {
            if (isClosed) return;
            
            const elapsed = (Date.now() - startTime) / 1000;
            const remaining = Math.max(0, CONFIG.autoCloseSeconds - elapsed);
            secondsLeft = Math.floor(remaining);
            updateTimerUI();
            
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                closePopup();
                markPopupAsSeen();
            }
        }, 200);
    }
    
    // Handle Join button click
    function onJoinClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isClosed) return;
        
        const message = `🚴‍♂️ Thank you for your interest in the Water Cycles Expedition!\n\n` +
            `📅 Date: 5th June 2026 (World Environment Day)\n` +
            `⏰ Time: 2:00 PM - 4:30 PM\n` +
            `📍 Starting Point: COOP-KENYA KONDELE\n` +
            `🏁 Finish: Dunga Fish Market, Kisumu\n\n` +
            `For registration and more details, please contact:\n` +
            `📞 +254728697188\n` +
            `✉️ arhicakis@gmail.com\n\n` +
            `Together for climate! 🌍💚`;
        
        alert(message);
        closePopup();
        markPopupAsSeen();
    }
    
    // Handle Close button click
    function onCloseClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!isClosed) {
            closePopup();
            markPopupAsSeen();
        }
    }
    
    // Handle overlay click
    function onOverlayClick(e) {
        if (e.target === popupElement && !isClosed) {
            closePopup();
            markPopupAsSeen();
        }
    }
    
    // Initialize event listeners
    function initEventListeners() {
        // Get fresh references to buttons
        const closeBtn = document.getElementById(CONFIG.closeBtnId);
        const joinBtn = document.getElementById(CONFIG.joinBtnId);
        const closeXBtn = document.getElementById(CONFIG.closeXBtnId);
        
        // Remove existing listeners by replacing with clones
        if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.addEventListener('click', onCloseClick);
        }
        
        if (joinBtn) {
            const newJoinBtn = joinBtn.cloneNode(true);
            joinBtn.parentNode.replaceChild(newJoinBtn, joinBtn);
            newJoinBtn.addEventListener('click', onJoinClick);
        }
        
        if (closeXBtn) {
            const newCloseXBtn = closeXBtn.cloneNode(true);
            closeXBtn.parentNode.replaceChild(newCloseXBtn, closeXBtn);
            newCloseXBtn.addEventListener('click', onCloseClick);
        }
        
        if (popupElement) {
            popupElement.addEventListener('click', onOverlayClick);
        }
    }
    
    // Show the popup
    function showPopup() {
        // Check if user has already seen the popup
        if (hasUserSeenPopup()) {
            console.log('Event Popup: User has already seen this popup');
            return false;
        }
        
        // Get popup element
        popupElement = document.getElementById(CONFIG.popupId);
        if (!popupElement) {
            console.error('Event Popup: Element not found');
            return false;
        }
        
        // Reset state
        isClosed = false;
        
        // Make popup visible
        popupElement.style.display = 'flex';
        popupElement.classList.remove('hidden-popup');
        
        // Initialize
        initEventListeners();
        startCountdown();
        
        console.log('Event Popup: Displayed successfully');
        return true;
    }
    
    // Reset popup (for testing)
    function resetPopup() {
        localStorage.removeItem(CONFIG.localStorageKey);
        console.log('Event Popup: Reset');
        location.reload(); // Reload to see the popup again
    }
    
    // Mark as initialized
    window._eventPopupInitialized = true;
    
    // Wait for popup to be in DOM then show it
    function waitForAndShowPopup() {
        // Check if popup element exists
        if (document.getElementById(CONFIG.popupId)) {
            setTimeout(showPopup, 500);
            return;
        }
        
        // Wait for popup to be added to DOM
        const observer = new MutationObserver(function(mutations) {
            if (document.getElementById(CONFIG.popupId)) {
                observer.disconnect();
                setTimeout(showPopup, 500);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Fallback timeout
        setTimeout(() => {
            observer.disconnect();
            if (document.getElementById(CONFIG.popupId)) {
                showPopup();
            }
        }, 3000);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForAndShowPopup);
    } else {
        waitForAndShowPopup();
    }
    
    // Export for debugging
    window.EventPopup = {
        reset: resetPopup,
        close: closePopup
    };
    
    console.log('Event Popup: Script loaded and ready');
})();