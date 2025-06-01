const message = document.getElementById('message');
const birthdayText = document.getElementById("birthdayText");
const birthdayMusic = document.getElementById("birthdayMusic");

// Gift box running away logic
let giftBoxRunningTimer = null;
let giftBoxMoveTimer = null;
let animationFrameId = null;
let isGiftBoxRunning = false;
let hasRunAwayOnce = false; // Track if the gift box has already run away
const giftBox = document.getElementById("giftBox");
const giftContainer = document.querySelector(".gift-container");

// Movement animation variables
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;
let animationSpeed = 0.08; // Smooth interpolation speed

// Add hover event listeners for gift box running away
giftBox.addEventListener("mouseenter", function () {
    if (!isGiftBoxRunning && !hasRunAwayOnce) {
        startGiftBoxRunning();
    }
});

// Add event listener to stop running when mouse leaves gift box area
giftContainer.addEventListener("mouseleave", function () {
    if (isGiftBoxRunning && !hasRunAwayOnce) {
        // Only auto-stop if it hasn't run away yet (shouldn't happen now, but kept for safety)
        setTimeout(() => {
            if (isGiftBoxRunning) {
                stopGiftBoxRunning();
            }
        }, 1000); // Give 1 second delay before stopping
    }
});

function startGiftBoxRunning() {
    isGiftBoxRunning = true;
    hasRunAwayOnce = true; // Mark that the gift box has run away once
    giftBox.classList.add("running");

    console.log('Gift box starting to run away - this will only happen once per page load');

    // Clear any existing timers and animations
    if (giftBoxRunningTimer) {
        clearTimeout(giftBoxRunningTimer);
    }
    if (giftBoxMoveTimer) {
        clearInterval(giftBoxMoveTimer);
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // Initialize starting position
    const rect = giftContainer.getBoundingClientRect();
    currentX = rect.left;
    currentY = rect.top;

    // Set initial position with hardware acceleration
    giftContainer.style.position = 'fixed';
    giftContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    giftContainer.style.left = '0';
    giftContainer.style.top = '0';
    giftContainer.style.justifyContent = 'flex-start';
    giftContainer.style.alignItems = 'flex-start';
    giftContainer.style.minHeight = 'auto';

    // Start smooth movement animation
    startSmoothMovement();

    // Change target position every 200ms for more dynamic movement
    giftBoxMoveTimer = setInterval(() => {
        setNewTargetPosition();
    }, 200);

    // Stop running after 5 seconds
    giftBoxRunningTimer = setTimeout(() => {
        stopGiftBoxRunning();
    }, 5000);
}

function setNewTargetPosition() {
    const maxX = window.innerWidth - 200; // Account for gift box width
    const maxY = window.innerHeight - 200; // Account for gift box height

    // Generate new target position with some boundaries to keep it visible
    const margin = 50;
    targetX = margin + Math.random() * (maxX - 2 * margin);
    targetY = margin + Math.random() * (maxY - 2 * margin);

    // Add some randomness to animation speed for more natural movement
    animationSpeed = 0.06 + Math.random() * 0.08; // Between 0.06 and 0.14
}

function startSmoothMovement() {
    let lastFrameTime = 0;
    const targetFPS = 60; // Target 60 FPS
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime) {
        if (!isGiftBoxRunning) {
            return; // Stop animation if no longer running
        }

        // Throttle to target FPS for consistent performance
        if (currentTime - lastFrameTime < frameInterval) {
            animationFrameId = requestAnimationFrame(animate);
            return;
        }
        lastFrameTime = currentTime;

        // Smooth interpolation towards target position
        const deltaX = targetX - currentX;
        const deltaY = targetY - currentY;

        // Use easing for more natural movement
        const easedSpeedX = deltaX * animationSpeed;
        const easedSpeedY = deltaY * animationSpeed;

        currentX += easedSpeedX;
        currentY += easedSpeedY;

        // Use transform3d for hardware acceleration
        giftContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

        // Add subtle rotation based on movement direction for more dynamic effect
        const rotation = Math.atan2(easedSpeedY, easedSpeedX) * (180 / Math.PI) * 0.05;
        giftBox.style.transform = `rotate(${rotation}deg)`;

        // Continue animation
        animationFrameId = requestAnimationFrame(animate);
    }

    // Set initial target
    setNewTargetPosition();
    animationFrameId = requestAnimationFrame(animate);
}

function stopGiftBoxRunning() {
    isGiftBoxRunning = false;
    giftBox.classList.remove("running");

    // Clear timers and animations
    if (giftBoxRunningTimer) {
        clearTimeout(giftBoxRunningTimer);
        giftBoxRunningTimer = null;
    }
    if (giftBoxMoveTimer) {
        clearInterval(giftBoxMoveTimer);
        giftBoxMoveTimer = null;
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Reset gift box rotation
    giftBox.style.transform = '';

    // Reset position to center with smooth transition
    giftContainer.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    giftContainer.style.position = 'relative';
    giftContainer.style.transform = 'none';
    giftContainer.style.left = 'auto';
    giftContainer.style.top = 'auto';
    giftContainer.style.justifyContent = 'center';
    giftContainer.style.alignItems = 'center';
    giftContainer.style.minHeight = '100vh';

    // Keep pointer events disabled until quiz is completed
    giftBox.style.pointerEvents = 'none';
    giftBox.style.cursor = 'default';

    // Remove transition after animation completes
    setTimeout(() => {
        giftContainer.style.transition = '';
    }, 800);

    console.log('Gift box stopped running, showing quiz...');

    // Show quiz after gift box settles
    setTimeout(() => {
        showQuiz();
    }, 1000);
}

// Create floating hearts
function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "💖";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 3 + 4 + "s";
    heart.style.fontSize = Math.random() * 20 + 15 + "px";
    document.getElementById("hearts").appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 7000);
}

// Create hearts periodically
setInterval(createHeart, 800);

// Gift box click handler
document.getElementById("giftBox").addEventListener("click", function (e) {
    console.log('Gift box clicked, isGiftBoxRunning:', isGiftBoxRunning);

    // Only allow click if not running away
    if (isGiftBoxRunning) {
        console.log('Click blocked - gift box is running');
        e.preventDefault();
        e.stopPropagation();
        return;
    }

    console.log('Opening gift box...');
    const lid = document.getElementById("boxLid");
    const letterContainer = document.getElementById("letterContainer");
    const letter = document.getElementById("letter");
    const pathwayContainer = document.querySelector(".pathway-container");

    // Open gift box
    lid.style.transform = "translateY(-50px) rotateX(-45deg)";
    lid.style.opacity = "0.7";    // Show letter after delay
    setTimeout(() => {
        letterContainer.style.display = "flex";

        // Coordinate Hello Kitty entrance animations
        const helloKitties = document.querySelectorAll('.hello-kitty');
        helloKitties.forEach((kitty, index) => {
            // Reset animation to ensure synchronized start
            kitty.style.animation = 'none';
            kitty.offsetHeight; // Force reflow
            // Restart with synchronized timing
            const entranceDelay = 0.5 + (index * 0.2); // 0.5s, 0.7s, 0.9s, 1.1s
            const danceDelay = 1.7 + (index * 0.2); // 1.7s, 1.9s, 2.1s, 2.3s
            kitty.style.animation = `
                kittyEntrance 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${entranceDelay}s both,
                syncDance 4s ease-in-out ${danceDelay}s infinite
            `;
        });

        setTimeout(() => {
            letter.classList.add("show");

            // Show pathway only when letter starts appearing for synchronized effect
            const pathwayContainer = document.querySelector(".pathway-container");
            pathwayContainer.style.display = "block";

            // Add smooth fade-in effect for pathway
            pathwayContainer.style.opacity = "0";
            pathwayContainer.style.transition = "opacity 0.8s ease-in-out";

            // Fade in pathway gradually
            setTimeout(() => {
                pathwayContainer.style.opacity = "1";
            }, 100);

            // Coordinate pathway friends animations after pathway appears
            setTimeout(() => {
                const friends = document.querySelectorAll('.friend');
                friends.forEach((friend, index) => {
                    friend.style.animation = 'none';
                    friend.offsetHeight; // Force reflow
                    if (friend.classList.contains('friend-4')) {
                        friend.style.animation = 'syncWalkingLarge 2s ease-in-out infinite -1.5s';
                    } else {
                        const delay = index * -0.5; // 0s, -0.5s, -1s
                        friend.style.animation = `syncWalking 2s ease-in-out infinite ${delay}s`;
                    }
                });
            }, 300); // Start walking animations 300ms after pathway appears

            // Start typewriter effect
            setTimeout(startTypewriter, 800);
        }, 100);
    }, 1000);
});

// Typewriter effect
function startTypewriter() {
    const messageLines = document.querySelectorAll(".message-line");
    const signature = document.querySelector(".signature");

    // Store original text and clear content
    const originalTexts = [];
    messageLines.forEach((line, index) => {
        originalTexts[index] = line.textContent;
        line.textContent = '';
        line.style.opacity = "1";
        line.style.transform = "translateX(0)";
    }); let currentLineIndex = 0;
    let currentCharIndex = 0;
    let currentDelay = 150; // Initial delay before starting (reduced from 300)

    function typeNextCharacter() {
        if (currentLineIndex >= messageLines.length) {
            // All lines completed, now show signature with typewriter effect
            const originalSignature = signature.textContent;
            signature.textContent = '';
            signature.style.opacity = "1";
            signature.style.transform = "translateX(0)";

            let signatureCharIndex = 0;
            function typeSignature() {
                if (signatureCharIndex < originalSignature.length) {
                    signature.textContent += originalSignature.charAt(signatureCharIndex);
                    signatureCharIndex++;
                    setTimeout(typeSignature, 15 + Math.random() * 15); // Faster signature typing (reduced from 20+20)
                }
            }
            setTimeout(typeSignature, 100); // Reduced delay before signature (from 200)
            return;
        }

        const currentLine = messageLines[currentLineIndex];
        const currentText = originalTexts[currentLineIndex];

        if (currentCharIndex >= currentText.length) {
            // Current line completed, move to next line
            currentLineIndex++;
            currentCharIndex = 0;
            currentDelay = 300; // Pause between lines (reduced from 600)
        } else {
            // Type next character
            currentLine.textContent += currentText.charAt(currentCharIndex);
            currentCharIndex++;

            // Variable typing speed for more natural feeling (all speeds reduced)
            if (currentText.charAt(currentCharIndex - 1) === ' ') {
                currentDelay = 50 + Math.random() * 25; // Longer pause after space (reduced from 100+50)
            } else if (currentText.charAt(currentCharIndex - 1).match(/[.!?]/)) {
                currentDelay = 100 + Math.random() * 50; // Longer pause after punctuation (reduced from 200+100)
            } else {
                currentDelay = 30 + Math.random() * 20; // Normal typing speed (reduced from 60+40)
            }
        }

        setTimeout(typeNextCharacter, currentDelay);
    }

    // Start typing after initial delay
    setTimeout(typeNextCharacter, 250); // Reduced from 500
}

// Close button
document
    .getElementById("closeBtn")
    .addEventListener("click", function () {
        const letterContainer = document.getElementById("letterContainer");
        const letter = document.getElementById("letter");
        const lid = document.getElementById("boxLid"); letter.classList.remove("show");
        setTimeout(() => {
            letterContainer.style.display = "none";
            // Hide pathway with proper reset
            const pathwayContainer = document.querySelector(".pathway-container");
            if (pathwayContainer) {
                pathwayContainer.style.display = "none";
                pathwayContainer.style.opacity = "1"; // Reset opacity
                pathwayContainer.style.transition = ""; // Reset transition
            }
            // Reset gift box
            lid.style.transform = "translateY(0) rotateX(0deg)";
            lid.style.opacity = "1";

            // Reset message lines and signature
            const messageLines = document.querySelectorAll(".message-line");
            const signature = document.querySelector(".signature");

            // Store original text for reset
            const originalMessages = [
                "💖 Chúc mừng sinh nhật em yêu của anh! 💖",
                "🌸 Hôm nay là ngày đặc biệt nhất của em 🌸",
                "✨ Anh chúc em luôn xinh đẹp, hạnh phúc ✨",
                "🎂 Và mãi mãi là công chúa của anh! 🎂",
                "💕 Anh yêu em nhiều lắm! 💕"
            ];

            messageLines.forEach((line, index) => {
                line.textContent = originalMessages[index];
                line.style.opacity = "0";
                line.style.transform = "translateX(-50px)";
                line.style.animation = "none";
            });
            signature.textContent = "Yêu em, ❤️ Chồng yêu";
            signature.style.opacity = "0";
            signature.style.transform = "translateX(50px)";
            signature.style.animation = "none";
        }, 800);
    });

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
document.head.appendChild(style);

// Quiz functionality
let quizActive = false;
let currentQuestionIndex = 0;
let quizAnswers = {};
let quizAttempts = 0;

const quizData = {
    1: { type: 'multiple', correctAnswer: '11/06/2002' },
    2: { type: 'multiple', correctAnswer: '43' },
    3: { type: 'multiple', correctAnswer: 'Homestay Booking Rooms' },
    4: { type: 'text', correctAnswer: 'any' }, // Any text is acceptable
    5: { type: 'multiple', correctAnswer: 'Yêu vai lon' }
};

function showQuiz() {
    console.log('Showing quiz...');
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.style.display = 'flex';
    quizActive = true;
    currentQuestionIndex = 1;
    quizAnswers = {};
    quizAttempts++;

    // Reset to first question
    showQuestion(1);
    updateNavigationButtons();

    // Clear any previous results
    document.getElementById('quizResult').innerHTML = '';
    document.getElementById('quizResult').className = 'quiz-result';
}

function hideQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.style.display = 'none';
    quizActive = false;
}

function showQuestion(questionNum) {
    // Hide all questions
    document.querySelectorAll('.question-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show current question
    const currentQuestion = document.querySelector(`[data-question="${questionNum}"]`);
    if (currentQuestion) {
        currentQuestion.classList.add('active');
    }

    // Reset option selections for current question
    const currentOptions = currentQuestion.querySelectorAll('.quiz-option');
    currentOptions.forEach(option => {
        option.classList.remove('selected', 'correct', 'wrong');
    });

    currentQuestionIndex = questionNum;
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Previous button
    prevBtn.disabled = currentQuestionIndex === 1;

    // Next/Submit button logic
    if (currentQuestionIndex === 5) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function selectAnswer(questionNum, answer, element) {
    // Store the answer
    quizAnswers[questionNum] = answer;

    // Update visual selection for multiple choice
    if (element) {
        const currentQuestion = document.querySelector(`[data-question="${questionNum}"]`);
        const options = currentQuestion.querySelectorAll('.quiz-option');
        options.forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
    }
}

function validateQuiz() {
    let allCorrect = true;
    let incorrectQuestions = [];

    // Check each question
    for (let i = 1; i <= 5; i++) {
        const questionData = quizData[i];
        const userAnswer = quizAnswers[i];

        if (!userAnswer || userAnswer.trim() === '') {
            allCorrect = false;
            incorrectQuestions.push(i);
            continue;
        }

        if (questionData.type === 'multiple') {
            if (userAnswer !== questionData.correctAnswer) {
                allCorrect = false;
                incorrectQuestions.push(i);
            }
        } else if (questionData.type === 'text') {
            // For text question (love question), any non-empty answer is correct
            if (userAnswer.trim().length < 3) {
                allCorrect = false;
                incorrectQuestions.push(i);
            }
        }
    }

    return { allCorrect, incorrectQuestions };
}

function handleQuizSubmit() {
    const validation = validateQuiz();
    const resultDiv = document.getElementById('quizResult');

    if (validation.allCorrect) {
        // Correct answers - open gift box
        resultDiv.innerHTML = '🎉 Chính xác! Em đã trả lời đúng tất cả! 🎉<br>💝 Hộp quà sẽ mở ngay bây giờ! 💝';
        resultDiv.className = 'quiz-result success';

        setTimeout(() => {
            hideQuiz();
            // Trigger gift box opening
            openGiftBoxDirectly();
        }, 2000);

    } else {
        // Wrong answers - show sad message and make gift box run away again
        const attempts = quizAttempts > 1 ? ` (Lần thử thứ ${quizAttempts})` : '';
        resultDiv.innerHTML = `😢 Có ${validation.incorrectQuestions.length} câu chưa đúng${attempts}!<br>💔 Hộp quà sẽ chạy trốn lại! Thử lại nhé! 💔`;
        resultDiv.className = 'quiz-result error';

        // Add screen shake effect
        document.body.classList.add('screen-shake');
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, 600);

        setTimeout(() => {
            hideQuiz();
            // Make gift box run away again
            resetGiftBoxForNewAttempt();
        }, 3000);
    }
}

function openGiftBoxDirectly() {
    // Simulate gift box click to open it
    const giftBoxClickEvent = new Event('click');
    document.getElementById("giftBox").dispatchEvent(giftBoxClickEvent);
}

function resetGiftBoxForNewAttempt() {
    // Reset the gift box state to allow it to run away again
    hasRunAwayOnce = false;
    isGiftBoxRunning = false;

    // Ensure gift box is in normal state
    const giftBox = document.getElementById("giftBox");
    const giftContainer = document.querySelector(".gift-container");

    giftBox.classList.remove("running");
    giftBox.style.transform = '';
    giftBox.style.pointerEvents = 'auto';
    giftBox.style.cursor = 'pointer';

    // Reset container position
    giftContainer.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    giftContainer.style.position = 'relative';
    giftContainer.style.transform = 'none';
    giftContainer.style.left = 'auto';
    giftContainer.style.top = 'auto';
    giftContainer.style.justifyContent = 'center';
    giftContainer.style.alignItems = 'center';
    giftContainer.style.minHeight = '100vh';

    setTimeout(() => {
        giftContainer.style.transition = '';
    }, 800);

    console.log('Gift box reset for new attempt');
}

// Event listeners for quiz
document.addEventListener('DOMContentLoaded', function () {
    // Quiz option click handlers
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function () {
            const questionItem = this.closest('.question-item');
            const questionNum = parseInt(questionItem.dataset.question);
            const answer = this.textContent.trim();
            selectAnswer(questionNum, answer, this);
        });
    });

    // Love input handler
    const loveInput = document.querySelector('.love-input');
    if (loveInput) {
        loveInput.addEventListener('input', function () {
            selectAnswer(4, this.value, null);
        });
    }

    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', function () {
        if (currentQuestionIndex > 1) {
            showQuestion(currentQuestionIndex - 1);
        }
    });

    document.getElementById('nextBtn').addEventListener('click', function () {
        if (currentQuestionIndex < 5) {
            showQuestion(currentQuestionIndex + 1);
        }
    });

    document.getElementById('submitBtn').addEventListener('click', function () {
        handleQuizSubmit();
    });
});


