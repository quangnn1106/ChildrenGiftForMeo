const message = document.getElementById('message');
const birthdayText = document.getElementById("birthdayText");
const birthdayMusic = document.getElementById("birthdayMusic");

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
document.getElementById("giftBox").addEventListener("click", function () {
    const lid = document.getElementById("boxLid");
    const letterContainer = document.getElementById("letterContainer");
    const letter = document.getElementById("letter");
    const pathwayContainer = document.querySelector(".pathway-container");

    // Open gift box
    lid.style.transform = "translateY(-50px) rotateX(-45deg)";
    lid.style.opacity = "0.7";

    // Show letter after delay
    setTimeout(() => {
        letterContainer.style.display = "flex";
        // Show pathway
        pathwayContainer.style.display = "block";
        setTimeout(() => {
            letter.classList.add("show");
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
    });    let currentLineIndex = 0;
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
            // Hide pathway
            const pathwayContainer = document.querySelector(".pathway-container");
            if (pathwayContainer) {
                pathwayContainer.style.display = "none";
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


