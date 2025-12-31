/**
 * Scroll Reveal Animation using IntersectionObserver
 */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-section').forEach(section => {
    observer.observe(section);
});

/**
 * Typing Effect for Hero Description
 */
const typingElement = document.getElementById('hero-description');
if (typingElement) {
    const text = typingElement.textContent.replace(/\s+/g, ' ').trim();
    // Set min-height to prevent layout shift
    typingElement.style.minHeight = typingElement.offsetHeight + 'px';
    
    typingElement.textContent = '';
    typingElement.classList.add('cursor-blink');

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        }
    }
    setTimeout(typeWriter, 1000);
}

/**
 * Story Mode Intro Logic
 */
const introOverlay = document.getElementById('story-intro-overlay');
const consoleContainer = document.getElementById('console-lines');
const skipBtn = document.getElementById('story-skip');
const progressBar = document.getElementById('intro-progress');
const timerDisplay = document.getElementById('intro-timer');

const introLines = [
    { text: "booting veer_rathod.dev...", delay: 200 },
    { text: "loading profile: student - builder - SIH winner", delay: 800 },
    { text: "spinning up projects: InternYojna, Portfolio v2, AI tools", delay: 1500 },
    { text: "establishing secure connection...", delay: 2200 },
    { text: "status: <span class='text-green-400 font-bold'>ONLINE</span>", delay: 2800 },
    { text: "entering main interface...", delay: 3400 }
];

/**
 * Timer update for intro
 */
let startTime = Date.now();
let timerInterval;

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const ms = Math.floor((elapsed % 1000) / 10);
    const s = Math.floor((elapsed / 1000) % 60);
    const m = Math.floor((elapsed / (1000 * 60)) % 60);
    if(timerDisplay) {
        timerDisplay.innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}:${ms.toString().padStart(2,'0')}`;
    }
}

/**
 * Play intro sound effect using Web Audio API
 */
function playIntroSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
}

/**
 * Finish intro sequence and hide overlay
 */
function finishIntro() {
    clearInterval(timerInterval);
    if (introOverlay && !introOverlay.classList.contains('intro-hidden')) {
        playIntroSound();
        // Fill progress bar instantly
        if(progressBar) progressBar.style.width = '100%';
        
        introOverlay.classList.add('intro-hidden');
        
        // Remove from DOM after transition to clean up
        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 500);
    }
}

// Check for reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (introOverlay) {
    if (prefersReducedMotion) {
        introOverlay.style.display = 'none';
    } else {
        timerInterval = setInterval(updateTimer, 30);
        
        // Play intro sequence
        let totalDuration = introLines[introLines.length - 1].delay + 800;
        
        introLines.forEach((line, index) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.className = 'console-line';
                div.innerHTML = `<span class="text-primary mr-2">&gt;</span> ${line.text}`;
                
                // Manage blinking cursor
                const prevCursor = consoleContainer.querySelector('.cursor-blink');
                if(prevCursor) prevCursor.classList.remove('cursor-blink');
                
                div.classList.add('cursor-blink');
                consoleContainer.appendChild(div);
                
                // Update progress bar based on steps
                const progress = ((index + 1) / introLines.length) * 100;
                if(progressBar) progressBar.style.width = `${progress}%`;
                
            }, line.delay);
        });

        // Auto finish after sequence
        setTimeout(finishIntro, totalDuration);
    }
}

// Skip handlers
if (skipBtn) {
    skipBtn.addEventListener('click', finishIntro);
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') finishIntro();
});

/**
 * Contact Form Submission and Animation Logic
 */
function handleContactSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('contact-submit');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('.btn-icon');
    const form = document.getElementById('contact-form');
    const successCard = document.getElementById('success-card');
    
    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        form.reset();
        alert("Message sent successfully!");
        return;
    }

    // Form Submission
    const formData = new FormData(form);
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            finishTransmission();
        } else {
            alert('Oops! There was a problem submitting your form');
        }
    }).catch(error => {
        alert('Oops! There was a problem submitting your form');
    });
    

    // Animation Sequence
    // 1. Button Press
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => btn.style.transform = 'scale(1)', 150);

    // 2. Transmission
    btn.classList.add('btn-transmitting');
    btnIcon.style.display = 'none';
    
    const states = [
        "> uploading message...",
        "> encrypting payload...",
        "> transmitting to server..."
    ];
    
    let step = 0;
    
    // Simulate steps (even if fetch is faster/slower)
    const animInterval = setInterval(() => {
        if(step < states.length) {
            btnText.innerText = states[step];
            step++;
        } else {
            clearInterval(animInterval);
            // finishTransmission is called by fetch response
        }
    }, 600);

    function finishTransmission() {
        // 3. Success State
        btn.classList.remove('btn-transmitting');
        btn.classList.add('btn-success');
        btnText.innerText = "> transmission complete";
        btnIcon.innerText = "check";
        btnIcon.style.display = 'inline-block';
        
        // 4. Show Card
        setTimeout(() => {
            successCard.classList.remove('hidden');
            // Trigger reflow for transition
            void successCard.offsetWidth;
            successCard.classList.remove('opacity-0');
            successCard.classList.add('opacity-100');
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                btn.classList.remove('btn-success');
                btnText.innerText = "Send Message";
                btnIcon.innerText = "send";
                
                // Hide card after a while
                setTimeout(() => {
                    successCard.classList.remove('opacity-100');
                    successCard.classList.add('opacity-0');
                    setTimeout(() => successCard.classList.add('hidden'), 500);
                }, 4000);
            }, 2000);
        }, 1000);
    }
}

/**
 * Interactive Orbs in Contact Section
 */
const contactSection = document.querySelector('.contact-container .glass-panel');
const orbs = document.querySelectorAll('.contact-orb');

if (contactSection && orbs.length > 0) {
    contactSection.addEventListener('mousemove', (e) => {
        const rect = contactSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        orbs.forEach((orb, index) => {
            const factor = (index + 1) * 15; // Adjust movement intensity
            const moveX = ((x - centerX) / centerX) * factor;
            const moveY = ((y - centerY) / centerY) * factor;
            
            orb.style.setProperty('--orb-x', `${moveX}px`);
            orb.style.setProperty('--orb-y', `${moveY}px`);
        });
    });
    
    contactSection.addEventListener('mouseleave', () => {
        orbs.forEach(orb => {
            orb.style.setProperty('--orb-x', '0px');
            orb.style.setProperty('--orb-y', '0px');
        });
    });
}

// Make handleContactSubmit global so HTML can calling it
window.handleContactSubmit = handleContactSubmit;
