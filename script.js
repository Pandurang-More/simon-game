document.addEventListener("DOMContentLoaded", function () {
    // Game state variables
    let gameSeq = [];
    let userSeq = [];
    let btns = ["red", "yellow", "green", "purple"];
    let started = false;
    let level = 0;
    let score = 0;
    let userTurn = false;
    let soundEnabled = true;
    let gameOver = false;
    let showingSequence = false;

    // DOM elements
    const h2 = document.getElementById("game-status");
    const levelDisplay = document.getElementById("level");
    const scoreDisplay = document.getElementById("score");
    const startBtn = document.getElementById("start-btn");
    const restartBtn = document.getElementById("restart-btn");
    const soundToggleBtn = document.getElementById("sound-toggle");
    const gameOverScreen = document.getElementById("game-over-screen");
    const playAgainBtn = document.getElementById("play-again-btn");
    const finalScore = document.getElementById("final-score");
    const finalLevel = document.getElementById("final-level");
    const allBtns = document.querySelectorAll(".btn");

    // Audio context for sound effects
    let audioContext;
    
    // Initialize audio context
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Play sound for button
    function playSound(frequency, duration = 300) {
        if (!soundEnabled || !audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }

    // Play error sound
    function playErrorSound() {
        if (!soundEnabled || !audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 150;
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Flash button with game sequence
    function gameFlash(btn) {
        const frequency = parseFloat(btn.dataset.sound);
        playSound(frequency);
        
        btn.classList.add("flash");
        setTimeout(() => {
            btn.classList.remove("flash");
        }, 400);
    }

    // Flash button when user clicks
    function userFlash(btn) {
        const frequency = parseFloat(btn.dataset.sound);
        playSound(frequency);
        
        btn.classList.add("user-flash");
        setTimeout(() => {
            btn.classList.remove("user-flash");
        }, 200);
    }

    // Flash button on error
    function errorFlash(btn) {
        playErrorSound();
        
        btn.classList.add("error-flash");
        setTimeout(() => {
            btn.classList.remove("error-flash");
        }, 500);
    }

    // Update displays
    function updateDisplay() {
        levelDisplay.textContent = level;
        scoreDisplay.textContent = score;
    }

    // Start new game
    function startGame() {
        initAudio();
        gameSeq = [];
        userSeq = [];
        level = 0;
        score = 0;
        started = true;
        gameOver = false;
        userTurn = false;
        showingSequence = false;
        
        startBtn.style.display = "none";
        restartBtn.style.display = "inline-block";
        
        h2.textContent = "Watch the sequence...";
        updateDisplay();
        
        // Enable buttons
        allBtns.forEach(btn => btn.classList.remove("disabled"));
        
        setTimeout(levelUp, 1000);
    }

    // Level up - add new color to sequence
    function levelUp() {
        level++;
        score += level * 10; // Bonus points for higher levels
        userSeq = [];
        userTurn = false;
        showingSequence = true;
        
        updateDisplay();
        h2.textContent = `Level ${level} - Watch carefully!`;
        
        // Disable buttons during sequence display
        allBtns.forEach(btn => btn.classList.add("disabled"));
        
        // Add random color to sequence
        const randomIdx = Math.floor(Math.random() * btns.length);
        const randomColor = btns[randomIdx];
        gameSeq.push(randomColor);
        
        // Show sequence with delays
        showSequence();
    }

    // Show the current sequence
    function showSequence() {
        let i = 0;
        const interval = setInterval(() => {
            if (i >= gameSeq.length) {
                clearInterval(interval);
                showingSequence = false;
                userTurn = true;
                h2.textContent = "Your turn - repeat the sequence!";
                
                // Enable buttons for user input
                allBtns.forEach(btn => btn.classList.remove("disabled"));
                return;
            }
            
            const color = gameSeq[i];
            const btn = document.querySelector(`.${color}`);
            gameFlash(btn);
            i++;
        }, 800);
    }

    // Handle button press
    function btnPress() {
        if (!started || !userTurn || showingSequence) return;
        
        const btn = this;
        const color = btn.dataset.color;
        
        userFlash(btn);
        userSeq.push(color);
        
        // Check if current input is correct
        const currentIndex = userSeq.length - 1;
        if (userSeq[currentIndex] !== gameSeq[currentIndex]) {
            // Wrong input - game over
            gameOverHandler();
            return;
        }
        
        // Check if user completed the sequence
        if (userSeq.length === gameSeq.length) {
            // Correct sequence completed
            userTurn = false;
            h2.textContent = "Correct! Get ready for next level...";
            
            // Disable buttons temporarily
            allBtns.forEach(btn => btn.classList.add("disabled"));
            
            setTimeout(() => {
                levelUp();
            }, 1500);
        }
    }

    // Handle game over
    function gameOverHandler() {
        gameOver = true;
        started = false;
        userTurn = false;
        
        h2.textContent = "Game Over!";
        
        // Flash all buttons red
        allBtns.forEach(btn => {
            errorFlash(btn);
            btn.classList.add("disabled");
        });
        
        // Show game over screen
        setTimeout(() => {
            finalScore.textContent = score;
            finalLevel.textContent = level;
            gameOverScreen.style.display = "flex";
        }, 1000);
    }

    // Reset game
    function resetGame() {
        gameSeq = [];
        userSeq = [];
        level = 0;
        score = 0;
        started = false;
        userTurn = false;
        gameOver = false;
        showingSequence = false;
        
        h2.textContent = "Press START to begin";
        updateDisplay();
        
        startBtn.style.display = "inline-block";
        restartBtn.style.display = "none";
        gameOverScreen.style.display = "none";
        
        // Enable buttons
        allBtns.forEach(btn => btn.classList.remove("disabled"));
    }

    // Toggle sound
    function toggleSound() {
        soundEnabled = !soundEnabled;
        soundToggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
        soundToggleBtn.title = soundEnabled ? "Sound On" : "Sound Off";
    }

    // Event listeners
    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", resetGame);
    playAgainBtn.addEventListener("click", resetGame);
    soundToggleBtn.addEventListener("click", toggleSound);

    // Keyboard support
    document.addEventListener("keydown", function(event) {
        if (!started && (event.key === " " || event.key === "Enter")) {
            event.preventDefault();
            startGame();
        } else if (started && event.key === "Escape") {
            event.preventDefault();
            resetGame();
        } else if (started && userTurn && !showingSequence) {
            // Number keys 1-4 for button presses
            const keyMap = {
                "1": "red",
                "2": "yellow", 
                "3": "green",
                "4": "purple"
            };
            
            if (keyMap[event.key]) {
                event.preventDefault();
                const btn = document.querySelector(`.${keyMap[event.key]}`);
                if (btn && !btn.classList.contains("disabled")) {
                    btnPress.call(btn);
                }
            }
        }
    });

    // Add click listeners to buttons
    allBtns.forEach(btn => {
        btn.addEventListener("click", btnPress);
    });

    // Initialize display
    updateDisplay();
    
    // Set initial sound button state
    soundToggleBtn.title = "Sound On";
    
    console.log("Simon Game loaded successfully!");
});