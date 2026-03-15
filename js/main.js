document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const textarea = document.getElementById('main-textarea');
    const clearBtn = document.getElementById('clear-btn');
    const statusDot = document.querySelector('.dot');
    const statusText = document.querySelector('.status-indicator').lastChild;

    // Stat Elements
    const domWords = document.getElementById('val-words');
    const domChars = document.getElementById('val-chars');
    const domCharsNoSpace = document.getElementById('val-chars-nospaces');
    const domParagraphs = document.getElementById('val-paragraphs');
    const domLines = document.getElementById('val-lines');
    const domTimeM = document.getElementById('val-time-m');
    const domTimeS = document.getElementById('val-time-s');

    // --- Core Logic (Frontend Realtime) ---
    function analyzeTextLocal(text) {
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s+/g, '').length;

        // Match words handling different languages and boundaries
        const wordsMatch = text.match(/\b\w+\b/g);
        const words = wordsMatch ? wordsMatch.length : 0;

        const lines = text === '' ? 0 : text.split('\n').length;
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

        const wpm = 225;
        const totalMinutes = words / wpm;
        const minutes = Math.floor(totalMinutes);
        const seconds = Math.floor((totalMinutes - minutes) * 60);

        return {
            words,
            chars,
            charsNoSpaces,
            lines,
            paragraphs,
            minutes,
            seconds
        };
    }

    // --- UI Updaters ---
    function animateValue(element, newValue) {
        const currentValue = parseInt(element.innerText, 10) || 0;
        if (currentValue !== newValue) {
            element.innerText = newValue;
            // Trigger CSS animation
            element.classList.remove('update-anim');
            void element.offsetWidth; // force reflow
            element.classList.add('update-anim');
        }
    }

    function updateDashboard(stats) {
        animateValue(domWords, stats.words);
        animateValue(domChars, stats.chars);
        animateValue(domCharsNoSpace, stats.charsNoSpaces);
        animateValue(domParagraphs, stats.paragraphs);
        animateValue(domLines, stats.lines);
        animateValue(domTimeM, stats.minutes);
        animateValue(domTimeS, stats.seconds);
    }

    // --- Event Listeners ---
    textarea.addEventListener('input', (e) => {
        const text = e.target.value;
        const stats = analyzeTextLocal(text);
        updateDashboard(stats);

        // Update status indicator
        if (text.length > 0) {
            statusDot.classList.remove('pulse');
            statusDot.style.backgroundColor = '#3b82f6'; // Blue
            statusText.textContent = ' Analizando...';

            // Revert back to active after a short delay to simulate "saved/processed"
            clearTimeout(window.statusTimeout);
            window.statusTimeout = setTimeout(() => {
                statusDot.style.backgroundColor = '#22c55e'; // Green
                statusText.textContent = ' Procesado';
            }, 500);
        } else {
            statusDot.classList.add('pulse');
            statusDot.style.backgroundColor = '#22c55e';
            statusText.textContent = ' Listo para escribir';
        }
    });

    clearBtn.addEventListener('click', () => {
        textarea.value = '';
        updateDashboard(analyzeTextLocal(''));
        textarea.focus();
        statusDot.classList.add('pulse');
        statusDot.style.backgroundColor = '#22c55e';
        statusText.textContent = ' Listo para escribir';
    });

    // --- FAQ Accordions ---
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
});
