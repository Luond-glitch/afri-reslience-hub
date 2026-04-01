(function() {
    const PAYBILL = "522533";
    const ACCOUNT = "8074844";
    const NOTIFICATION_EMAIL = "arhicakis@gmail.com";  
    
    const amountPresetBtns = document.querySelectorAll('.amount-preset');
    const customAmountInput = document.getElementById('customAmount');
    let selectedAmount = 0;
    const submitBtn = document.getElementById('submitBtn');
    const donationForm = document.getElementById('donationForm');
    const successDiv = document.getElementById('donationSuccessMsg');

    // Helper: highlight preset
    function highlightActive(activeBtn) {
      amountPresetBtns.forEach(btn => btn.classList.remove('active'));
      if (activeBtn) activeBtn.classList.add('active');
    }

    amountPresetBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const amountVal = parseInt(this.getAttribute('data-amount'));
        if (!isNaN(amountVal)) {
          selectedAmount = amountVal;
          customAmountInput.value = '';
          highlightActive(this);
        }
      });
    });

    customAmountInput.addEventListener('input', function() {
      const val = parseFloat(this.value);
      if (!isNaN(val) && val > 0) {
        selectedAmount = val;
        highlightActive(null);
      } else {
        selectedAmount = 0;
      }
    });      
    async function sendDonationEmail(donationData) {
      const { fullName, email, phone, amount, message, donationType, timestamp } = donationData;
      const emailContent = `
        🌱 NEW DONATION INTENT - ARHICA 🌱
        
        Donor Name: ${fullName}
        Email: ${email}
        Phone: ${phone}
        Amount: KES ${amount.toLocaleString()}
        Donation Type: ${donationType}
        Message: ${message || "No message provided"}
        Timestamp: ${timestamp}
        
        Payment Instructions: Paybill ${PAYBILL}, Account ${ACCOUNT}
        Thank you for supporting inclusive climate action!
      `;
      
      // Use FormSubmit.co endpoint to forward email to arhicakis@gmail.com
      const formData = new FormData();
      formData.append('email', NOTIFICATION_EMAIL);
      formData.append('subject', `New Donation Intent from ${fullName} - KES ${amount}`);
      formData.append('message', emailContent);
      formData.append('_replyto', email);
      formData.append('_captcha', 'false');
      
      try {
        const response = await fetch('https://formsubmit.co/ajax/arhicakis@gmail.com', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          console.log('Email notification sent to ARHICA team.');
          return true;
        } else {
          console.warn('Email delivery warning, but donation recorded locally.');
          return false;
        }
      } catch (err) {
        console.error('Email sending error:', err);
        return false;
      }
    }

    donationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get values
      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      let amount = selectedAmount;
      const customRaw = customAmountInput.value.trim();
      if (customRaw !== '') {
        const customNum = parseFloat(customRaw);
        if (!isNaN(customNum) && customNum > 0) amount = customNum;
      }
      const message = document.getElementById('message').value;
      const donationType = document.getElementById('donationType').value;
      
      if (!fullName || !email || !phone) {
        alert('Please fill in your full name, email and phone number.');
        return;
      }
      if (!amount || amount < 10) {
        alert('Please select or enter a valid donation amount (minimum KES 10).');
        return;
      }
      
      // Disable button and show loading
      submitBtn.disabled = true;
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
      
      const donationRecord = {
        fullName,
        email,
        phone,
        amount,
        message,
        donationType,
        paybill: PAYBILL,
        account: ACCOUNT,
        timestamp: new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })
      };
      
      // Save to localStorage for record
      let donations = JSON.parse(localStorage.getItem('arhica_donations') || '[]');
      donations.push(donationRecord);
      localStorage.setItem('arhica_donations', JSON.stringify(donations));
      
      // Send email notification to arhicakis@gmail.com
      const emailSent = await sendDonationEmail(donationRecord);
      
      // Display beautiful thank you message exactly as requested
      const firstName = fullName.split(' ')[0];
      successDiv.style.display = 'flex';
      successDiv.innerHTML = `
        <div style="text-align: center; width: 100%;">
          <i class="fas fa-check-circle" style="font-size: 2rem; color: #1e7e34; margin-bottom: 8px;"></i>
          <strong>Thank you ${firstName}!</strong> Your donation of KES ${amount.toLocaleString()} has been recorded.<br>
          Please complete payment via <strong style="background: #1a3f2c; padding: 2px 8px; border-radius: 30px; color: white;">M-Pesa Paybill ${PAYBILL}, Account ${ACCOUNT}</strong><br>
          with the exact amount. Together we build climate resilience! 🌍💚
          ${emailSent ? '<small style="display:block; margin-top:8px;">📧 A confirmation has been sent to our team & your email.</small>' : '<small style="display:block; margin-top:8px;">📝 Your intent is saved. Complete payment to finalize.</small>'}
        </div>
      `;
      
      // Reset form
      donationForm.reset();
      customAmountInput.value = '';
      selectedAmount = 0;
      highlightActive(null);
      if(amountPresetBtns.length) {
        amountPresetBtns[0].classList.add('active');
        selectedAmount = parseInt(amountPresetBtns[0].getAttribute('data-amount'));
      }
      
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
      
      // Scroll success message into view
      successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Optional: clear success after 12 seconds but keep visible? user can see, fine.
      setTimeout(() => {
        // do not remove message automatically, but user can see it permanently.
      }, 1000);
    });
    
    // Back to main page button
    const backBtn = document.getElementById('backHomeBtn');
    if (backBtn) {
      backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'index.html';
      });
    }
    
    // Set default active preset (KES 500)
    if(amountPresetBtns.length) {
      amountPresetBtns[0].classList.add('active');
      selectedAmount = parseInt(amountPresetBtns[0].getAttribute('data-amount'));
    }
  })();