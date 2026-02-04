$(document).ready(function () {
    // Initialize background hearts
    createHearts();

    // Start background music interaction check (browsers block auto-audio, so we'll leave it silent or add if requested)

    // Center the "No" button initially
    $('#no-btn').css('position', 'relative');

    // Carousel flow logic
    $('#photoCarousel').on('slid.bs.carousel', function () {
        // Check if we are at the last item
        if ($('.carousel-item:last').hasClass('active')) {
            $('#gallery-btn')
                .text('One Last Question... 🥺')
                .addClass('final-step-ready')
                .removeClass('btn-custom')
                .addClass('btn-danger animate__animated');
        }
    });
});

function nextPhotoOrStep() {
    const btn = $('#gallery-btn');

    if (btn.hasClass('final-step-ready')) {
        nextStep(4);
    } else {
        // Go to next slide
        $('#photoCarousel').carousel('next');
    }
}

function nextStep(step) {
    // Hide all steps
    $('.wizard-step').addClass('d-none').removeClass('d-block');

    // Show requested step
    $('#step-' + step).removeClass('d-none').addClass('d-block');

    // Add entrance animation
    $('#step-' + step).addClass('animate__animated animate__fadeInUp');

    if (step === 4) {
        startNoButtonBehavior();
    }
}

function createHearts() {
    const container = document.getElementById('hearts-container');
    const heartCount = 20;

    // Create hearts periodically
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');

        // Randomize position and animation duration
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 3 + 4 + "s"; // 4-7s
        heart.style.opacity = Math.random() * 0.5 + 0.3;

        // Randomize color slightly
        const colors = ['#ff4d6d', '#ff8fa3', '#c9184a', '#ffccd5'];
        heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(heart);

        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 300);
}

// Global variables for the No button
let wanderInterval;

function startNoButtonBehavior() {
    const btn = $('#no-btn');

    // Make sure it's fixed so it can move freely
    btn.css({
        'position': 'fixed',
        'z-index': '1000',
        'transition': 'all 2s ease-in-out' // Slow movement initially
    });

    // Start wandering "here and there slowly"
    moveRandomlySlow();
    wanderInterval = setInterval(moveRandomlySlow, 2000); // Change direction every 2s

    // Add proximity detector for "mouse should not be present to click"
    // We use document mousemove to detect if mouse is close, rather than just hover
    $(document).on('mousemove', function (e) {
        if (!$('#step-4').hasClass('d-none')) { // Only active in step 4
            const offset = btn.offset();
            const btnX = offset.left + btn.width() / 2;
            const btnY = offset.top + btn.height() / 2;
            const dist = Math.sqrt(Math.pow(e.pageX - btnX, 2) + Math.pow(e.pageY - btnY, 2));

            // If mouse is within 150px, RUN FAST!
            if (dist < 150) {
                clearInterval(wanderInterval); // Stop wandering
                btn.css('transition', 'all 0.6s ease-out'); // Switch to fast mode
                moveRandomlyFast();

                // Resume wandering after a second of safety
                // Clear any existing timeout to avoid overlapping
                if (btn.data('timeout')) clearTimeout(btn.data('timeout'));

                const t = setTimeout(() => {
                    btn.css('transition', 'all 2s ease-in-out'); // Back to slow
                    moveRandomlySlow();
                    if (wanderInterval) clearInterval(wanderInterval);
                    wanderInterval = setInterval(moveRandomlySlow, 2000);
                }, 1000);
                btn.data('timeout', t);
            }
        }
    });
}

function moveRandomlySlow() {
    const btn = $('#no-btn');
    const { x, y } = getRandomPosition(btn);
    btn.css({ left: x + 'px', top: y + 'px' });
}

function moveRandomlyFast() {
    const btn = $('#no-btn');
    // Move further away than the slow wander
    const { x, y } = getRandomPosition(btn);
    btn.css({ left: x + 'px', top: y + 'px' });
}

function getRandomPosition(btn) {
    const margin = 100; // Large margin to ensure it stays totally on screen
    const maxX = $(window).width() - btn.outerWidth() - margin;
    const maxY = $(window).height() - btn.outerHeight() - margin;

    // Ensure we don't return negative values if screen is small
    const randomX = Math.max(margin, Math.min(maxX, Math.random() * maxX));
    const randomY = Math.max(margin, Math.min(maxY, Math.random() * maxY));

    return { x: randomX, y: randomY };
}

function handleYes() {
    // Trigger Confetti
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    // Stop button behavior
    if (wanderInterval) clearInterval(wanderInterval);
    $(document).off('mousemove');

    nextStep(5);
}
