// event-popup.js
// Event Popup Module - Handles display, auto-close, and interactions

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        autoCloseSeconds: 40,
        popupId: 'eventPopupOverlay',
        closeBtnId: 'closeEventPopupBtn',
        joinBtnId: 'eventJoinNowBtn',
        countdownSpanId: 'popupCountdown',
        timerFillId: 'popupTimerFill',
        storageKey: 'eventPopupClosed',
        eventDate: new Date(2026, 5, 5) // June 5th, 2026
    };
    
    // DOM Elements
    let popupElement = null;
    let closeButton = null;
    let joinButton = null;
    let countdownSpan = null;
    let timerFill = null;
    
    // Timer variables
    let timerInterval = null;
    let secondsLeft = CONFIG.autoCloseSeconds;
    let startTime = null;
    
    // Check if event has already passed
    function isEventPassed() {
        const today = new Date();
        return today > CONFIG.eventDate;
    }
    
    // Check if popup was already closed in this session
    function wasPopupClosed() {
        return sessionStorage.getItem(CONFIG.storageKey) === 'true';
    }
    
    // Mark popup as closed for this session
    function markPopupClosed() {
        sessionStorage.setItem(CONFIG.storageKey, 'true');
    }
    
    // Update timer UI
    function updateTimerUI() {
        if (countdownSpan) {
            countdownSpan.innerText = secondsLeft;
        }
        if (timerFill) {
            const percent = (secondsLeft / CONFIG.autoCloseSeconds) * 100;
            timerFill.style.width = percent + '%';
        }
    }
    
    // Close the popup with animation
    function closePopup() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        if (popupElement) {
            popupElement.classList.add('hidden-popup');
            setTimeout(() => {
                if (popupElement) {
                    popupElement.style.display = 'none';
                }
            }, 400);
        }
    }
    
    // Start the auto-close countdown timer
    function startCountdown() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        startTime = Date.now();
        secondsLeft = CONFIG.autoCloseSeconds;
        updateTimerUI();
        
        timerInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const remaining = Math.max(0, CONFIG.autoCloseSeconds - elapsed);
            secondsLeft = Math.floor(remaining);
            updateTimerUI();
            
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                closePopup();
                markPopupClosed();
            }
        }, 200);
    }
    
    // Handle Join button click
    function onJoinClick(e) {
        e.preventDefault();
        
        // Show registration/success message
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
        
        // Optional: track click event
        console.log('Event Popup: User clicked Join button');
        
        closePopup();
        markPopupClosed();
    }
    
    // Handle Close button click
    function onCloseClick(e) {
        e.preventDefault();
        closePopup();
        markPopupClosed();
        console.log('Event Popup: User dismissed popup');
    }
    
    // Handle overlay click (click outside to close)
    function onOverlayClick(e) {
        if (e.target === popupElement) {
            closePopup();
            markPopupClosed();
        }
    }
    
    // Initialize event listeners
    function initEventListeners() {
        if (closeButton) {
            closeButton.addEventListener('click', onCloseClick);
        }
        
        if (joinButton) {
            joinButton.addEventListener('click', onJoinClick);
        }
        
        if (popupElement) {
            popupElement.addEventListener('click', onOverlayClick);
        }
    }
    
    // Show the popup (if conditions are met)
    function showPopup() {
        // Don't show if event has passed
        if (isEventPassed()) {
            console.log('Event Popup: Event date has passed, not showing');
            return false;
        }
        
        // Don't show if already closed in this session
        if (wasPopupClosed()) {
            console.log('Event Popup: Already closed in this session');
            return false;
        }
        
        // Get popup element
        popupElement = document.getElementById(CONFIG.popupId);
        if (!popupElement) {
            console.error('Event Popup: Element not found');
            return false;
        }
        
        // Get button elements
        closeButton = document.getElementById(CONFIG.closeBtnId);
        joinButton = document.getElementById(CONFIG.joinBtnId);
        countdownSpan = document.getElementById(CONFIG.countdownSpanId);
        timerFill = document.getElementById(CONFIG.timerFillId);
        
        // Make sure popup is visible
        popupElement.style.display = 'flex';
        popupElement.classList.remove('hidden-popup');
        
        // Initialize
        initEventListeners();
        startCountdown();
        
        console.log('Event Popup: Displayed successfully');
        return true;
    }
    
    // Delay popup appearance to allow page to load smoothly
    function showPopupWithDelay(delayMs = 500) {
        setTimeout(() => {
            showPopup();
        }, delayMs);
    }
    
    // Force show popup (bypass session check - for testing)
    function forceShowPopup() {
        sessionStorage.removeItem(CONFIG.storageKey);
        showPopup();
    }
    
    // Reset popup session (for testing/debugging)
    function resetPopupSession() {
        sessionStorage.removeItem(CONFIG.storageKey);
        console.log('Event Popup: Session reset');
    }
    
    // Export functions to global scope for external control if needed
    window.EventPopup = {
        show: showPopup,
        showDelayed: showPopupWithDelay,
        forceShow: forceShowPopup,
        resetSession: resetPopupSession,
        close: closePopup
    };
    
    // Auto-show popup when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => showPopupWithDelay(800));
    } else {
        showPopupWithDelay(800);
    }
    
})();