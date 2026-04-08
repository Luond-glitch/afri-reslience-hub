(function(){
    const PAYBILL='522533', ACCOUNT='8074844', EMAIL_ENDPOINT='https://formsubmit.co/ajax/arhicakis@gmail.com';
    
    // ─── NAV SCROLL ───
    const nav=document.getElementById('navbar');
    window.addEventListener('scroll',()=>{
      nav.classList.toggle('scrolled',window.scrollY>60);
    },{passive:true});
  
    // ─── PARTICLE CANVAS ───
    const canvas=document.getElementById('particlesCanvas');
    const ctx=canvas.getContext('2d');
    let W,H,particles=[];
    function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
    resize();
    window.addEventListener('resize',resize);
    function Particle(){
      this.x=Math.random()*W;this.y=Math.random()*H;
      this.r=Math.random()*2+0.5;this.vx=(Math.random()-0.5)*0.3;this.vy=(Math.random()-0.5)*0.3;
      this.alpha=Math.random()*0.4+0.1;
    }
    for(let i=0;i<80;i++)particles.push(new Particle());
    function drawParticles(){
      ctx.clearRect(0,0,W,H);
      particles.forEach(p=>{
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(201,168,76,${p.alpha})`;ctx.fill();
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1;
        if(p.y<0||p.y>H)p.vy*=-1;
      });
      // draw some connecting lines
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<100){
            ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
            ctx.strokeStyle=`rgba(201,168,76,${0.06*(1-dist/100)})`;ctx.lineWidth=0.5;ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  
    // ─── SCROLL REVEAL ───
    const reveals=document.querySelectorAll('.reveal');
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
    },{threshold:0.12});
    reveals.forEach(el=>observer.observe(el));
  
    // ─── AMOUNT PRESETS ───
    const amtBtns=document.querySelectorAll('.amt-btn');
    const customInput=document.getElementById('customAmount');
    let selectedAmount=500;
  
    amtBtns[0].classList.add('active');
  
    amtBtns.forEach(btn=>{
      btn.addEventListener('click',function(){
        amtBtns.forEach(b=>b.classList.remove('active'));
        this.classList.add('active');
        const val=parseInt(this.getAttribute('data-amount'));
        if(this.id==='customTrigger'){
          customInput.style.display='block';
          customInput.focus();
          selectedAmount=0;
        } else {
          customInput.style.display='none';
          customInput.value='';
          selectedAmount=val;
        }
      });
    });
  
    customInput.addEventListener('input',function(){
      const v=parseFloat(this.value);
      selectedAmount=(!isNaN(v)&&v>0)?v:0;
    });
  
    // ─── EMAIL ───
    async function sendEmail(data){
      const {fullName,email,phone,amount,message,donationType,timestamp}=data;
      const body=`🌱 NEW DONATION INTENT — ARHICA\n\nDonor: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nAmount: KES ${amount.toLocaleString()}\nType: ${donationType}\nMessage: ${message||'—'}\nTime: ${timestamp}\n\nPayment: Paybill ${PAYBILL}, Account ${ACCOUNT}`;
      const fd=new FormData();
      fd.append('email',EMAIL_ENDPOINT);
      fd.append('subject',`Donation Intent — ${fullName} · KES ${amount.toLocaleString()}`);
      fd.append('message',body);
      fd.append('_replyto',email);
      fd.append('_captcha','false');
      try{
        const r=await fetch(`https://formsubmit.co/ajax/arhicakis@gmail.com`,{method:'POST',body:fd});
        return r.ok;
      }catch{return false;}
    }
  
    // ─── FORM SUBMIT ───
    const form=document.getElementById('donationForm');
    const submitBtn=document.getElementById('submitBtn');
    const successDiv=document.getElementById('donationSuccessMsg');
  
    form.addEventListener('submit',async function(e){
      e.preventDefault();
      const fullName=document.getElementById('fullName').value.trim();
      const email=document.getElementById('email').value.trim();
      const phone=document.getElementById('phone').value.trim();
      const message=document.getElementById('message').value;
      const donationType=document.getElementById('donationType').value;
      let amount=selectedAmount;
      const cv=customInput.value.trim();
      if(cv!==''){const n=parseFloat(cv);if(!isNaN(n)&&n>0)amount=n;}
      if(!fullName||!email||!phone){alert('Please fill in your full name, email and phone number.');return;}
      if(!amount||amount<10){alert('Please select or enter a valid donation amount (minimum KES 10).');return;}
  
      submitBtn.disabled=true;
      const orig=submitBtn.innerHTML;
      submitBtn.innerHTML='<span class="spinner"></span> Sending...';
  
      const record={fullName,email,phone,amount,message,donationType,paybill:PAYBILL,account:ACCOUNT,timestamp:new Date().toLocaleString('en-KE',{timeZone:'Africa/Nairobi'})};
      let donations=JSON.parse(localStorage.getItem('arhica_donations')||'[]');
      donations.push(record);
      localStorage.setItem('arhica_donations',JSON.stringify(donations));
      const sent=await sendEmail(record);
  
      const firstName=fullName.split(' ')[0];
      successDiv.style.display='block';
      successDiv.innerHTML=`
        <div class="check">✅</div>
        <h4>Thank you, ${firstName}!</h4>
        <p>Your donation intent of <strong>KES ${amount.toLocaleString()}</strong> has been recorded.<br>
        Complete payment via M-Pesa to finalise.</p>
        <div class="badge">Paybill 522533 · Acc 8074844</div>
        <p style="margin-top:0.8rem;font-size:0.78rem;color:#5a7a65;">${sent?'📧 Confirmation sent to our team.':'📝 Intent saved locally — complete your payment to finalise.'}</p>`;
      form.reset();
      customInput.style.display='none';
      customInput.value='';
      selectedAmount=500;
      amtBtns.forEach(b=>b.classList.remove('active'));
      amtBtns[0].classList.add('active');
      submitBtn.disabled=false;
      submitBtn.innerHTML=orig;
      successDiv.scrollIntoView({behavior:'smooth',block:'center'});
    });
  
    // ─── SMOOTH ANCHOR SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',function(e){
        const target=document.querySelector(this.getAttribute('href'));
        if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
      });
    });
  })();