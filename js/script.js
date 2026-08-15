/* -------------------------------------------------------------
   SHIVANI BIRTHDAY CELEBRATION - INTERACTIVE LOGIC
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // STATE VARIABLES
    // ---------------------------------------------------------
    let currentSceneId = 'scene-loading';
    let musicStarted = false;
    let isMuted = false;
    
    // Cake interactions state
    let litCandles = new Set();
    const totalCandles = 5;
    let candlesBlown = false;
    let wishMade = false;
    let cakeCut = false;
    
    // Playful rules state
    let clickedRules = new Set();
    
    // Particle Engine variables
    const canvas = document.getElementById('celebration-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId = null;
    let activeEffectType = 'ambient'; // ambient, confetti, balloons, smoke, stars

    // Audio elements
    const bgMusic = document.getElementById('bg-music');
    const musicWidget = document.getElementById('music-widget');
    const musicToggle = document.getElementById('music-toggle');

    // ---------------------------------------------------------
    // CANVAS PARTICLE ENGINE
    // ---------------------------------------------------------
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(type, x, y) {
            this.type = type; // 'confetti', 'petal', 'balloon', 'spark', 'smoke', 'star'
            this.x = x || Math.random() * canvas.width;
            this.y = y || (type === 'balloon' ? canvas.height + 50 : Math.random() * -50);
            
            // Speed and dynamics based on particle type
            if (type === 'confetti') {
                this.size = Math.random() * 8 + 6;
                this.speedX = Math.random() * 4 - 2;
                this.speedY = Math.random() * 3 + 2;
                this.color = ['#A94B6B', '#D6B36A', '#651F3A', '#E8B8C7', '#FFF7F8'][Math.floor(Math.random() * 5)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 4 - 2;
                this.width = Math.random() * 6 + 4;
            } else if (type === 'petal') {
                this.size = Math.random() * 10 + 8;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 1.5 + 1;
                this.color = '#E8B8C7';
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 1 - 0.5;
                this.swaySpeed = Math.random() * 0.02 + 0.01;
                this.swayOffset = Math.random() * Math.PI;
            } else if (type === 'balloon') {
                this.size = Math.random() * 20 + 25;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = -(Math.random() * 2 + 1.5);
                this.color = ['#A94B6B', '#D6B36A', '#651F3A', '#E8B8C7'][Math.floor(Math.random() * 4)];
                this.swaySpeed = Math.random() * 0.03 + 0.01;
                this.swayOffset = Math.random() * Math.PI;
                this.tailLength = this.size * 0.8;
            } else if (type === 'spark') {
                this.size = Math.random() * 3 + 2;
                this.speedX = Math.random() * 6 - 3;
                this.speedY = Math.random() * -6 - 2;
                this.color = ['#D6B36A', '#FFF7F8', '#ffaa00'][Math.floor(Math.random() * 3)];
                this.opacity = 1;
                this.decay = Math.random() * 0.02 + 0.015;
            } else if (type === 'smoke') {
                this.size = Math.random() * 6 + 4;
                this.speedX = Math.random() * 0.8 - 0.4;
                this.speedY = -(Math.random() * 1 + 0.5);
                this.color = 'rgba(180, 180, 180, 0.4)';
                this.opacity = 0.6;
                this.decay = Math.random() * 0.01 + 0.008;
            } else if (type === 'star') {
                this.size = Math.random() * 2 + 1;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.color = '#FFF7F8';
                this.opacity = Math.random();
                this.fadeDirection = Math.random() > 0.5 ? 0.01 : -0.01;
            }
        }

        update() {
            if (this.type === 'confetti') {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;
            } else if (this.type === 'petal') {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.5;
                this.rotation += this.rotationSpeed;
            } else if (this.type === 'balloon') {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.8;
            } else if (this.type === 'spark') {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedY += 0.1; // gravity
                this.opacity -= this.decay;
            } else if (this.type === 'smoke') {
                this.x += this.speedX;
                this.y += this.speedY;
                this.size += 0.1; // expand
                this.opacity -= this.decay;
            } else if (this.type === 'star') {
                this.opacity += this.fadeDirection;
                if (this.opacity >= 1) {
                    this.fadeDirection = -0.005 - Math.random() * 0.005;
                } else if (this.opacity <= 0.1) {
                    this.fadeDirection = 0.005 + Math.random() * 0.005;
                }
            }
        }

        draw() {
            ctx.save();
            if (this.type === 'confetti') {
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size/2, -this.width/2, this.size, this.width);
            } else if (this.type === 'petal') {
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, this.size/3, 0, this.size);
                ctx.bezierCurveTo(this.size, this.size/3, this.size/2, -this.size/2, 0, 0);
                ctx.fill();
            } else if (this.type === 'balloon') {
                // Balloon body
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(this.x, this.y, this.size * 0.75, this.size, 0, 0, Math.PI * 2);
                ctx.fill();

                // Balloon tie
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + this.size);
                ctx.lineTo(this.x - 5, this.y + this.size + 6);
                ctx.lineTo(this.x + 5, this.y + this.size + 6);
                ctx.closePath();
                ctx.fill();

                // Balloon string
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 247, 248, 0.4)';
                ctx.lineWidth = 1;
                ctx.moveTo(this.x, this.y + this.size + 6);
                ctx.bezierCurveTo(
                    this.x + 5, this.y + this.size + 15,
                    this.x - 5, this.y + this.size + this.tailLength * 0.5,
                    this.x, this.y + this.size + this.tailLength
                );
                ctx.stroke();
            } else if (this.type === 'spark') {
                ctx.globalAlpha = Math.max(0, this.opacity);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'smoke') {
                ctx.globalAlpha = Math.max(0, this.opacity);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'star') {
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Always maintain some background ambient stars
        if (particles.filter(p => p.type === 'star').length < 40) {
            for (let i = 0; i < 15; i++) {
                particles.push(new Particle('star'));
            }
        }

        // Draw and update all particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();

            // Recycle / remove offscreen or decayed particles
            if (p.type === 'spark' && p.opacity <= 0) {
                particles.splice(i, 1);
            } else if (p.type === 'smoke' && p.opacity <= 0) {
                particles.splice(i, 1);
            } else if (p.type === 'balloon' && p.y < -100) {
                particles.splice(i, 1);
            } else if ((p.type === 'confetti' || p.type === 'petal') && p.y > canvas.height + 20) {
                // If ambient or active celebration, respawn some at top
                if (activeEffectType === 'confetti' && Math.random() < 0.2) {
                    particles[i] = new Particle(p.type);
                } else {
                    particles.splice(i, 1);
                }
            }
        }
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // Spawners
    function spawnSparks(x, y, count = 25) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle('spark', x, y));
        }
    }

    function spawnSmoke(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle('smoke', x, y));
        }
    }

    function triggerConfetti(count = 150) {
        activeEffectType = 'confetti';
        for (let i = 0; i < count; i++) {
            particles.push(new Particle('confetti'));
        }
        // Spawn rose petals alongside confetti for luxury feel
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle('petal'));
        }
    }

    function triggerBalloons(count = 25) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                particles.push(new Particle('balloon'));
            }, i * 150);
        }
    }

    function setAmbientMode() {
        activeEffectType = 'ambient';
        // Spawn gentle ambient rose petals floating down
        for (let i = 0; i < 20; i++) {
            particles.push(new Particle('petal'));
        }
    }

    // Start particle system right away
    animate();
    setAmbientMode();


    // ---------------------------------------------------------
    // SCENE TRANSITION FUNCTIONS
    // ---------------------------------------------------------
    function showScene(sceneId) {
        const currentScene = document.getElementById(currentSceneId);
        const targetScene = document.getElementById(sceneId);
        
        if (currentScene) {
            currentScene.classList.remove('active');
        }
        
        // Perform scene specific entry actions
        handleSceneEntry(sceneId);

        setTimeout(() => {
            if (targetScene) {
                targetScene.classList.add('active');
                currentSceneId = sceneId;
            }
        }, 150); // slight offset for clean transition flow
    }

    function handleSceneEntry(sceneId) {
        // Reset special states when transitioning
        if (sceneId === 'scene-reveal') {
            runRevealSequence();
        } else if (sceneId === 'scene-wishes') {
            triggerConfetti(60);
            setTimeout(revealWishCards, 600);
        } else if (sceneId === 'scene-gallery') {
            setAmbientMode();
            // Reset scroll position of polaroids
            document.getElementById('gallery-ribbon').scrollLeft = 0;
        } else if (sceneId === 'scene-event') {
            setTimeout(() => {
                document.querySelectorAll('#scene-event .story-para').forEach((p, idx) => {
                    setTimeout(() => p.classList.add('show'), idx * 1200 + 400);
                });
            }, 500);
        } else if (sceneId === 'scene-final-celebration') {
            triggerConfetti(100);
            triggerBalloons(30);
            // Continuous sparks from lit cake in final screen
            const interval = setInterval(() => {
                if (currentSceneId !== 'scene-final-celebration') {
                    clearInterval(interval);
                    return;
                }
                const cakeRect = document.getElementById('interactive-cake-wrapper').getBoundingClientRect();
                spawnSparks(cakeRect.left + cakeRect.width/2, cakeRect.top + 30, 4);
            }, 800);
        } else if (sceneId === 'scene-final-wish') {
            // Sequential fade in of the paragraphs
            document.querySelectorAll('#scene-final-wish .flirty-para, #scene-final-wish .flirty-headline, #scene-final-wish .flirty-wish-line, #scene-final-wish .btn').forEach(el => {
                el.style.opacity = '0';
            });
        } else if (sceneId === 'scene-secret-reveal') {
            triggerBalloons(5);
        }
    }


    // ---------------------------------------------------------
    // 1. LOADING SCREEN TIMERS
    // ---------------------------------------------------------
    setTimeout(() => {
        const txt1 = document.getElementById('loading-txt-1');
        const txt2 = document.getElementById('loading-txt-2');
        if (txt1 && txt2) {
            txt1.classList.add('hidden');
            txt2.classList.remove('hidden');
            txt2.classList.add('fade-in-out');
            
            setTimeout(() => {
                showScene('scene-welcome');
            }, 1800);
        }
    }, 2200);


    // ---------------------------------------------------------
    // 2. WELCOME SCREEN EVENTS
    // ---------------------------------------------------------
    const btnEnterParty = document.getElementById('btn-enter-party');
    btnEnterParty.addEventListener('click', () => {
        startBackgroundMusic();
        showScene('scene-reveal');
    });


    // ---------------------------------------------------------
    // MUSIC CONTROLS (ROBUST LOADER)
    // ---------------------------------------------------------
    function startBackgroundMusic() {
        if (musicStarted) return;
        musicStarted = true;

        bgMusic.play()
            .then(() => {
                musicWidget.classList.remove('hidden');
                musicToggle.classList.add('playing');
                isMuted = false;
                musicToggle.querySelector('.music-text').textContent = "Mute";
            })
            .catch(error => {
                console.log("Autoplay blocked or file missing. Waiting for user interaction. Error: ", error);
                // Still show the widget so they can manually trigger it
                musicWidget.classList.remove('hidden');
                musicToggle.classList.remove('playing');
                musicToggle.querySelector('.music-text').textContent = "Play";
                musicStarted = false; // allow retry
            });
    }

    // Toggle Music button listener
    musicToggle.addEventListener('click', () => {
        if (!musicStarted) {
            startBackgroundMusic();
            return;
        }

        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                musicToggle.querySelector('.music-text').textContent = "Mute";
                isMuted = false;
            });
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.querySelector('.music-text').textContent = "Play";
            isMuted = true;
        }
    });

    // Handle audio error gracefully (e.g. if birthday.mp3 is missing)
    bgMusic.addEventListener('error', (e) => {
        console.warn("Audio file missing or failed to load. Disabling music widget gracefully.", e);
        musicWidget.classList.add('hidden'); // Hide the widget so it doesn't look broken
    });


    // ---------------------------------------------------------
    // 3. PERSONALIZED NAME REVEAL TIMERS
    // ---------------------------------------------------------
    function runRevealSequence() {
        const sub1 = document.getElementById('reveal-sub-1');
        const sub2 = document.getElementById('reveal-sub-2');
        const heading = document.getElementById('reveal-name-heading');
        const sub3 = document.getElementById('reveal-sub-3');
        const continueBtn = document.getElementById('btn-reveal-continue');

        // Hide all initially
        sub1.classList.remove('show');
        sub2.classList.add('hidden');
        heading.classList.add('hidden');
        sub3.classList.add('hidden');
        continueBtn.classList.add('hidden');

        // Trigger sequence
        setTimeout(() => sub1.classList.add('show'), 300);
        
        setTimeout(() => {
            sub2.classList.remove('hidden');
            setTimeout(() => sub2.classList.add('show'), 50);
        }, 1800);

        setTimeout(() => {
            heading.classList.remove('hidden');
            setTimeout(() => {
                heading.classList.add('show');
                const rect = heading.getBoundingClientRect();
                spawnSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
            }, 50);
        }, 3300);

        setTimeout(() => {
            sub3.classList.remove('hidden');
            setTimeout(() => sub3.classList.add('show'), 50);
        }, 5000);

        setTimeout(() => {
            continueBtn.classList.remove('hidden');
            setTimeout(() => continueBtn.classList.add('show'), 50);
        }, 6200);
    }

    const btnRevealContinue = document.getElementById('btn-reveal-continue');
    btnRevealContinue.addEventListener('click', () => {
        showScene('scene-party-room');
    });


    // ---------------------------------------------------------
    // 4. PARTY ROOM CAKE AND BLOWING LOGIC
    // ---------------------------------------------------------
    const btnLightCandles = document.getElementById('btn-light-candles');
    const btnWishReady = document.getElementById('btn-wish-ready');
    const blowPanel = document.getElementById('blow-panel');
    const btnBlowFallback = document.getElementById('btn-blow-fallback');
    const btnCutCake = document.getElementById('btn-cut-cake');
    const btnPartyContinue = document.getElementById('btn-party-continue');
    
    const cakeInstruction = document.getElementById('cake-instruction');
    const cakeSubInstruction = document.getElementById('cake-sub-instruction');
    const cakeWrapper = document.getElementById('interactive-cake-wrapper');
    const cakeKnife = document.getElementById('cake-knife');

    // Stage 1: Lighting Candles
    btnLightCandles.addEventListener('click', () => {
        btnLightCandles.style.display = 'none';
        
        const candles = document.querySelectorAll('.candles-container .candle');
        candles.forEach((candle, index) => {
            setTimeout(() => {
                candle.classList.add('lit');
                const rect = candle.getBoundingClientRect();
                // Add spark burst when lit
                spawnSparks(rect.left + rect.width / 2, rect.top, 12);
                litCandles.add(candle.dataset.id);
                
                // When final candle is lit
                if (litCandles.size === totalCandles) {
                    setTimeout(() => {
                        cakeInstruction.textContent = "Perfect. ✨";
                        cakeSubInstruction.textContent = "Now, click to make your wish.";
                        btnWishReady.classList.remove('hidden');
                    }, 600);
                }
            }, index * 400); // 400ms delay between lighting each candle
        });
    });

    // Make individual candle lighting clickable as well (in case they want to tap them)
    document.querySelectorAll('.candles-container .candle').forEach(candle => {
        candle.addEventListener('click', () => {
            if (btnLightCandles.style.display !== 'none') {
                btnLightCandles.style.display = 'none';
            }
            if (!candle.classList.contains('lit')) {
                candle.classList.add('lit');
                const rect = candle.getBoundingClientRect();
                spawnSparks(rect.left + rect.width/2, rect.top, 15);
                litCandles.add(candle.dataset.id);

                if (litCandles.size === totalCandles) {
                    cakeInstruction.textContent = "Perfect. ✨";
                    cakeSubInstruction.textContent = "Now, click to make your wish.";
                    btnWishReady.classList.remove('hidden');
                }
            }
        });
    });

    // Stage 2: Ready to Wish
    btnWishReady.addEventListener('click', () => {
        btnWishReady.classList.add('hidden');
        wishMade = true;
        
        // Dim the background and highlight the cake
        document.getElementById('scene-party-room').style.background = 'radial-gradient(circle at center, #1b0710 0%, #030204 100%)';
        cakeInstruction.innerHTML = "<span class='text-glow-gold'>MAKE YOUR WISH</span>";
        cakeSubInstruction.textContent = "Close your eyes, think of what you want, and prepare to blow.";
        
        setTimeout(() => {
            blowPanel.classList.remove('hidden');
            startMicDetection();
        }, 1500);
    });

    // Stage 3: Blowing Candles
    let micStreamRef = null;
    let micAnalyserRef = null;
    let micScriptNodeRef = null;

    function startMicDetection() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log("Microphone access not supported on this browser.");
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                micStreamRef = stream;
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);
                const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
                
                micAnalyserRef = analyser;
                micScriptNodeRef = javascriptNode;

                analyser.smoothingTimeConstant = 0.7;
                analyser.fftSize = 512;
                
                microphone.connect(analyser);
                analyser.connect(javascriptNode);
                javascriptNode.connect(audioContext.destination);
                
                javascriptNode.onaudioprocess = () => {
                    if (candlesBlown) return;
                    
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    
                    let sum = 0;
                    for (let i = 0; i < array.length; i++) {
                        sum += array[i];
                    }
                    const averageVolume = sum / array.length;
                    
                    // Trigger blow if threshold met (blowing creates a high volume spike)
                    if (averageVolume > 48) {
                        blowOutCandles();
                        stopMicrophone();
                    }
                };
            })
            .catch(err => {
                console.log("Microphone permission denied or error: ", err);
            });
    }

    function stopMicrophone() {
        if (micStreamRef) {
            micStreamRef.getTracks().forEach(track => track.stop());
            micStreamRef = null;
        }
        if (micScriptNodeRef) {
            micScriptNodeRef.disconnect();
            micScriptNodeRef = null;
        }
    }

    function blowOutCandles() {
        if (candlesBlown) return;
        candlesBlown = true;
        stopMicrophone();

        blowPanel.classList.add('hidden');
        
        // Extinguish candles
        const candles = document.querySelectorAll('.candles-container .candle');
        candles.forEach(candle => {
            candle.classList.remove('lit');
            const rect = candle.getBoundingClientRect();
            // Emit smoke particles
            spawnSmoke(rect.left + rect.width / 2, rect.top - 5, 8);
        });

        // Dim screen briefly to simulate lights turning off/blown candle shock
        const room = document.getElementById('scene-party-room');
        room.style.filter = 'brightness(0.2)';
        
        setTimeout(() => {
            room.style.filter = 'brightness(1)';
            room.style.background = 'radial-gradient(circle at center, var(--burgundy) 0%, var(--bg-color) 100%)';
            
            cakeInstruction.innerHTML = "<span class='text-glow-gold'>WISH SENT. ✨</span>";
            cakeSubInstruction.innerHTML = "<span class='text-glow-rose'>HAPPY BIRTHDAY SHIVANI! 🎉</span>";
            
            // Trigger massive party celebration!
            triggerConfetti(160);
            triggerBalloons(20);

            setTimeout(() => {
                cakeInstruction.textContent = "Okay... NOW we celebrate.";
                cakeSubInstruction.textContent = "One more thing... You can't have a birthday without cake.";
                btnCutCake.classList.remove('hidden');
            }, 2000);
        }, 800);
    }

    // Manual blow fallback
    btnBlowFallback.addEventListener('click', () => {
        blowOutCandles();
    });

    // Make tapping the cake/candles also act as a blow fallback once in wish state
    cakeWrapper.addEventListener('click', (e) => {
        if (wishMade && !candlesBlown) {
            // Prevent duplicate trigger if clicking a candle
            e.stopPropagation();
            blowOutCandles();
        }
    });

    // Stage 4: Cake Cutting
    btnCutCake.addEventListener('click', () => {
        btnCutCake.classList.add('hidden');
        
        // Trigger knife cutting motion
        cakeKnife.classList.add('ready');
        setTimeout(() => {
            cakeKnife.classList.add('animating');
        }, 100);

        // Slice the cake
        setTimeout(() => {
            cakeWrapper.classList.add('sliced');
            const cakeRect = document.getElementById('interactive-cake-wrapper').getBoundingClientRect();
            spawnSparks(cakeRect.left + cakeRect.width / 2, cakeRect.top + 80, 30);
            triggerConfetti(60);
        }, 1000); // Trigger slice halfway through knife animation

        // Clean up knife and present cake slice text
        setTimeout(() => {
            cakeKnife.classList.remove('animating', 'ready');
            
            cakeInstruction.innerHTML = "Your slice is ready. 😌";
            cakeSubInstruction.innerHTML = "I would have saved you the biggest piece... <br>but you have to earn it. 😂";
            
            btnPartyContinue.classList.remove('hidden');
        }, 2200);
    });

    btnPartyContinue.addEventListener('click', () => {
        showScene('scene-wishes');
    });


    // ---------------------------------------------------------
    // 5. REVEAL WISH CARDS (STAGGERED)
    // ---------------------------------------------------------
    function revealWishCards() {
        const cards = document.querySelectorAll('#scene-wishes .wish-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('revealed');
                const rect = card.getBoundingClientRect();
                spawnSparks(rect.left + rect.width/2, rect.top + rect.height/2, 8);
            }, index * 400);
        });
    }

    const btnWishesContinue = document.getElementById('btn-wishes-continue');
    btnWishesContinue.addEventListener('click', () => {
        showScene('scene-gallery');
    });


    // ---------------------------------------------------------
    // 6. PHOTO GALLERY PARALLAX & LIGHTBOX ZOOM
    // ---------------------------------------------------------
    const galleryRibbon = document.getElementById('gallery-ribbon');

    // Horizontal Parallax Wheel effect for desktop mouse
    galleryRibbon.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            galleryRibbon.scrollLeft += e.deltaY;
        }
    });

    // Expand Polaroid on Tap / Click
    const polaroidCards = document.querySelectorAll('.polaroid-card');
    polaroidCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If already zoomed, shrink it
            if (card.classList.contains('zoomed')) {
                card.classList.remove('zoomed');
                card.style.transform = `rotate(${card.dataset.origRotation || '0deg'}) scale(0.95)`;
                card.style.zIndex = '';
            } else {
                // Shrink any other zoomed card first
                polaroidCards.forEach(c => {
                    if (c.classList.contains('zoomed')) {
                        c.classList.remove('zoomed');
                        c.style.transform = `rotate(${c.dataset.origRotation || '0deg'}) scale(0.95)`;
                        c.style.zIndex = '';
                    }
                });

                // Store original rotation if not done
                if (!card.dataset.origRotation) {
                    card.dataset.origRotation = card.style.getPropertyValue('--rotation');
                }

                card.classList.add('zoomed');
                card.style.transform = 'rotate(0deg) scale(1.15)';
                card.style.zIndex = '50';
                
                // Add tiny sparkles around the zoomed memory
                const rect = card.getBoundingClientRect();
                spawnSparks(rect.left + rect.width/2, rect.top + rect.height/2, 15);
            }
        });
    });

    const btnGalleryContinue = document.getElementById('btn-gallery-continue');
    btnGalleryContinue.addEventListener('click', () => {
        // Close any zoomed images
        polaroidCards.forEach(c => {
            if (c.classList.contains('zoomed')) {
                c.classList.remove('zoomed');
                c.style.transform = `rotate(${c.dataset.origRotation || '0deg'}) scale(0.95)`;
                c.style.zIndex = '';
            }
        });
        showScene('scene-event');
    });


    // ---------------------------------------------------------
    // 7. EVENT STORY TIMERS
    // ---------------------------------------------------------
    const btnEventContinue = document.getElementById('btn-event-continue');
    btnEventContinue.addEventListener('click', () => {
        showScene('scene-tease');
    });


    // ---------------------------------------------------------
    // 8. TEASING RULES EVENTS
    // ---------------------------------------------------------
    const ruleBoxes = document.querySelectorAll('.rule-box');
    const btnTeaseContinue = document.getElementById('btn-tease-continue');

    ruleBoxes.forEach(box => {
        box.addEventListener('click', () => {
            if (!box.classList.contains('revealed')) {
                box.classList.add('revealed');
                clickedRules.add(box.id);
                
                const rect = box.getBoundingClientRect();
                spawnSparks(rect.left + rect.width - 20, rect.top + rect.height / 2, 10);

                // Enable continue button if all three rules are clicked
                if (clickedRules.size === 3) {
                    btnTeaseContinue.removeAttribute('disabled');
                    btnTeaseContinue.classList.add('btn-primary');
                    btnTeaseContinue.classList.remove('btn-secondary');
                }
            } else {
                box.classList.remove('revealed');
            }
        });
    });

    btnTeaseContinue.addEventListener('click', () => {
        showScene('scene-quiz');
    });


    // ---------------------------------------------------------
    // 9. MINI QUIZ EVENTS
    // ---------------------------------------------------------
    const quizOptions = document.querySelectorAll('.quiz-option-btn');
    const quizResult = document.getElementById('quiz-result');
    const optionsContainer = document.querySelector('.quiz-options');

    quizOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            opt.classList.add('selected');
            optionsContainer.style.opacity = '0.3';
            optionsContainer.style.pointerEvents = 'none';
            
            const rect = opt.getBoundingClientRect();
            spawnSparks(rect.left + rect.width/2, rect.top + rect.height/2, 15);

            setTimeout(() => {
                quizResult.classList.remove('hidden');
                // Scroll down if on small mobile screen
                quizResult.scrollIntoView({ behavior: 'smooth' });
            }, 600);
        });
    });

    const btnQuizContinue = document.getElementById('btn-quiz-continue');
    btnQuizContinue.addEventListener('click', () => {
        showScene('scene-secret-trigger');
    });


    // ---------------------------------------------------------
    // 10. SECRET TRIGGER & REVEAL EVENTS
    // ---------------------------------------------------------
    const btnSecretPsst = document.getElementById('btn-secret-psst');
    btnSecretPsst.addEventListener('click', () => {
        showScene('scene-secret-reveal');
    });

    const btnSecretContinue = document.getElementById('btn-secret-continue');
    btnSecretContinue.addEventListener('click', () => {
        showScene('scene-final-celebration');
    });


    // ---------------------------------------------------------
    // 11. GRAND FINAL SCREEN EVENTS
    // ---------------------------------------------------------
    const btnFinalContinue = document.getElementById('btn-final-continue');
    btnFinalContinue.addEventListener('click', () => {
        showScene('scene-final-wish');
    });


    // ---------------------------------------------------------
    // 12. FINAL FLIRTY SCREEN SEQUENTIAL FADE
    // ---------------------------------------------------------
    // Custom sequential reveal for text since it needs a paced read
    function revealFinalWishText() {
        const paragraphs = document.querySelectorAll('#scene-final-wish .flirty-para, #scene-final-wish .flirty-headline, #scene-final-wish .flirty-wish-line, #scene-final-wish .btn');
        paragraphs.forEach((para, idx) => {
            // Apply inline transition
            para.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            para.style.transform = 'translateY(10px)';
            
            // Delays matching their classes
            let delay = 500;
            if (para.classList.contains('delay-1')) delay = 400;
            else if (para.classList.contains('delay-2')) delay = 1800;
            else if (para.classList.contains('delay-3')) delay = 3000;
            else if (para.classList.contains('delay-4')) delay = 4800;
            else if (para.classList.contains('delay-5')) delay = 6200;
            else if (para.classList.contains('delay-6')) delay = 7200;
            else if (para.classList.contains('delay-7')) delay = 8400;
            else if (para.classList.contains('delay-8')) delay = 9600;
            else if (para.classList.contains('delay-9')) delay = 10800;

            setTimeout(() => {
                para.style.opacity = '1';
                para.style.transform = 'translateY(0)';
                if (para.classList.contains('flirty-wish-line')) {
                    const rect = para.getBoundingClientRect();
                    spawnSparks(rect.left + rect.width/2, rect.top + rect.height/2, 8);
                }
            }, delay);
        });
    }

    // Trigger reveal when scene becomes active
    const finalWishObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active')) {
                    revealFinalWishText();
                }
            }
        });
    });
    finalWishObserver.observe(document.getElementById('scene-final-wish'), { attributes: true });

    const btnFinalWishContinue = document.getElementById('btn-final-wish-continue');
    btnFinalWishContinue.addEventListener('click', () => {
        showScene('scene-final-portrait');
    });


    // ---------------------------------------------------------
    // 13. FINAL PORTRAIT & REPLAY SYSTEM
    // ---------------------------------------------------------
    const btnReplayJourney = document.getElementById('btn-replay-journey');
    btnReplayJourney.addEventListener('click', () => {
        // Reset interactive state variables
        litCandles.clear();
        candlesBlown = false;
        wishMade = false;
        cakeCut = false;
        clickedRules.clear();

        // Reset DOM classes/elements
        // Welcome
        document.querySelectorAll('#scene-welcome .welcome-para, #scene-welcome .btn').forEach(el => el.removeAttribute('style'));
        
        // Cake & candles
        document.querySelectorAll('.candles-container .candle').forEach(c => c.classList.remove('lit'));
        cakeInstruction.textContent = "The candles are waiting...";
        cakeSubInstruction.textContent = "Light them to begin the celebration.";
        cakeWrapper.classList.remove('sliced');
        document.getElementById('scene-party-room').removeAttribute('style');
        
        btnLightCandles.style.display = '';
        btnWishReady.classList.add('hidden');
        blowPanel.classList.add('hidden');
        btnCutCake.classList.add('hidden');
        btnPartyContinue.classList.add('hidden');

        // Wishes
        document.querySelectorAll('#scene-wishes .wish-card').forEach(c => c.classList.remove('revealed'));

        // Rules
        ruleBoxes.forEach(r => r.classList.remove('revealed'));
        btnTeaseContinue.setAttribute('disabled', 'true');
        btnTeaseContinue.classList.remove('btn-primary');
        btnTeaseContinue.classList.add('btn-secondary');

        // Quiz
        optionsContainer.style.opacity = '';
        optionsContainer.style.pointerEvents = '';
        quizOptions.forEach(o => o.classList.remove('selected'));
        quizResult.classList.add('hidden');

        // Story paragraphs
        document.querySelectorAll('#scene-event .story-para').forEach(p => p.classList.remove('show'));

        // Final wish text
        document.querySelectorAll('#scene-final-wish .flirty-para, #scene-final-wish .flirty-headline, #scene-final-wish .flirty-wish-line, #scene-final-wish .btn').forEach(el => {
            el.style.opacity = '0';
        });

        // Trigger confetti on reset
        triggerConfetti(50);
        
        // Go back to welcome screen
        showScene('scene-welcome');
    });
});
