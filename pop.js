(function () {
  "use strict";

  // Prevent popup from showing again in the same browsing session
  if (sessionStorage.getItem("arhicaPopupShown")) {
    return;
  }

  // Set launch date: 15th May 2026 at 9:00 AM EAT (UTC+3)
  const launchDate = new Date(2026, 4, 15, 9, 0, 0); // Month is 0-indexed, so 4 = May

  // Function to update countdown timer
  function updateCountdown(daysElem, hoursElem, minutesElem, secondsElem) {
    const now = new Date();
    const difference = launchDate - now;

    if (difference <= 0) {
      // Launch has passed
      daysElem.textContent = "0";
      hoursElem.textContent = "0";
      minutesElem.textContent = "0";
      secondsElem.textContent = "0";
      return true;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysElem.textContent = days;
    hoursElem.textContent = hours.toString().padStart(2, "0");
    minutesElem.textContent = minutes.toString().padStart(2, "0");
    secondsElem.textContent = seconds.toString().padStart(2, "0");

    return false;
  }

  // Function to create and show the popup
  function showLaunchPopup() {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "arhica-popup-overlay";
    overlay.id = "arhicaLaunchPopup";

    // Create popup container
    const popup = document.createElement("div");
    popup.className = "arhica-popup";

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "arhica-popup-close";
    closeBtn.innerHTML = "×";
    closeBtn.setAttribute("aria-label", "Close popup");
    closeBtn.title = "Close";

    // Popup inner content with countdown timer
    popup.innerHTML = `
        <div class="arhica-popup-header">
          <div class="arhica-popup-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <h2>Official Launch!</h2>
          <div class="arhica-popup-date">15th May 2026 | Palmers Hotel, Kisumu</div>
        </div>
        <div class="arhica-popup-body">
          <p>🎉 <strong>Welcome to ARHICA!</strong> 🎉</p>
          <div class="arhica-welcome-message">
            <i class="fas fa-hand-peace"></i> You're cordially invited to the Official Launch!
          </div>
          
          <!-- Countdown Timer Section -->
          <div class="arhica-countdown">
            <div class="arhica-countdown-title">
              <i class="fas fa-hourglass-half"></i> Countdown to Launch
            </div>
            <div class="arhica-timer">
              <div class="arhica-timer-item">
                <div class="arhica-timer-number" id="countdownDays">--</div>
                <div class="arhica-timer-label">Days</div>
              </div>
              <div class="arhica-timer-item">
                <div class="arhica-timer-number" id="countdownHours">--</div>
                <div class="arhica-timer-label">Hours</div>
              </div>
              <div class="arhica-timer-item">
                <div class="arhica-timer-number" id="countdownMinutes">--</div>
                <div class="arhica-timer-label">Mins</div>
              </div>
              <div class="arhica-timer-item">
                <div class="arhica-timer-number" id="countdownSeconds">--</div>
                <div class="arhica-timer-label">Secs</div>
              </div>
            </div>
          </div>
          
          <div class="arhica-launch-highlight">
            <i class="fas fa-map-marker-alt"></i> <strong>📍 Palmers Hotel, Kisumu</strong><br>
            <i class="fas fa-clock"></i> <strong>⏰ 15th May 2026 | 9:00 AM EAT</strong><br>
            <i class="fas fa-users"></i> <strong>👥 Join us in person or virtually!</strong>
          </div>
          <p><strong>What to expect:</strong> Keynote speeches from climate leaders, interactive sessions on inclusive climate action, networking opportunities, and a glimpse into our flagship initiatives including SamakiLog, Sustainable Fish Cage Enterprises, and Environmental Restoration programs.</p>
          <p><strong>Why attend?</strong> Be part of a movement that's transforming challenges into opportunities. Learn how we're building climate resilience, creating decent jobs for youth, and advancing gender equality across the region.</p>
          <p><strong>RSVP:</strong> Kindly confirm your attendance by contacting us at arhicakis@gmail.com or call +254728697188. You can also register through this link 
  <a href="https://docs.google.com/forms/d/e/1FAIpQLSdBzO2xZwEym4INJF3SvKMhRX7QmI3aYFX_NzxRmV445IDM8w/viewform?usp=preview" target="_blank">
    Register Here➡️
  </a>
</p>
          <p>Together, let's build climate resilience and leave no one behind! 🌍💚</p>
        </div>
        <div class="arhica-popup-footer">
          <div class="arhica-auto-close-info">
            <i class="fas fa-clock"></i> This message will close in 20 seconds
          </div>
        </div>
      `;

    // Add close button to popup
    popup.insertBefore(closeBtn, popup.firstChild);

    // Assemble popup
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Get countdown elements
    const daysElem = document.getElementById("countdownDays");
    const hoursElem = document.getElementById("countdownHours");
    const minutesElem = document.getElementById("countdownMinutes");
    const secondsElem = document.getElementById("countdownSeconds");

    // Start countdown timer (updates every second)
    let countdownInterval = null;

    if (daysElem && hoursElem && minutesElem && secondsElem) {
      // Initial update
      updateCountdown(daysElem, hoursElem, minutesElem, secondsElem);

      // Update every second
      countdownInterval = setInterval(function () {
        const isLaunched = updateCountdown(
          daysElem,
          hoursElem,
          minutesElem,
          secondsElem
        );
        if (isLaunched) {
          // If launch time has passed, stop the interval
          clearInterval(countdownInterval);
        }
      }, 1000);
    }

    // Auto-close after 20 seconds
    let autoCloseTimer = setTimeout(function () {
      removePopup(overlay);
    }, 20000);

    // Function to remove popup with animation
    function removePopup(overlayElement) {
      // Clear the countdown interval if it exists
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      if (overlayElement && overlayElement.parentNode) {
        overlayElement.classList.add("arhica-fade-out");
        setTimeout(function () {
          if (overlayElement.parentNode) {
            overlayElement.parentNode.removeChild(overlayElement);
          }
        }, 200);
        sessionStorage.setItem("arhicaPopupShown", "true");
      }
    }

    // Manual close button event
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      clearTimeout(autoCloseTimer);
      removePopup(overlay);
    });

    // Close when clicking outside the popup (on overlay)
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        clearTimeout(autoCloseTimer);
        removePopup(overlay);
      }
    });

    // Prevent closing when clicking inside popup
    popup.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // Wait for DOM to be ready before showing popup
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(showLaunchPopup, 100);
    });
  } else {
    setTimeout(showLaunchPopup, 100);
  }
})();
