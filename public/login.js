

    const $ = (el) => document.querySelector(el);
    const $$ = (el) => document.querySelectorAll(el);

    /* ===================================
    SCREEN SWITCH
    =================================== */

    function showScreen(name) {

    $$('.screen').forEach(screen => {
        screen.classList.toggle(
        'screen-hidden',
        screen.id !== `screen-${name}`
        );
    });

    $$('.tab-btn').forEach(btn => {
        btn.classList.toggle(
        'active',
        btn.dataset.screen === name
        );
    });

    }

    $$('.tab-btn').forEach(btn => {
    btn.onclick = () => showScreen(btn.dataset.screen);
    });

    /* ===================================
    NAVIGATION
    =================================== */

    document.addEventListener('click', (e) => {

    const screenBtn = e.target.closest('[data-screen]');
    if (screenBtn && !screenBtn.classList.contains('tab-btn')) {
        showScreen(screenBtn.dataset.screen);
    }

    const gotoBtn = e.target.closest('[data-goto]');
    if (gotoBtn) {
        showScreen(gotoBtn.dataset.goto);
    }

    });

    /* ===================================
    PASSWORD TOGGLE
    =================================== */

    $$('.eye-btn').forEach(btn => {

    btn.onclick = () => {

        const input = document.getElementById(
        btn.dataset.target
        );

        if (!input) return;

        input.type =
        input.type === 'password'
            ? 'text'
            : 'password';

        btn.textContent =
        input.type === 'password'
            ? '👁'
            : '🙈';

    };

    });

    /* ===================================
    OTP INPUT
    =================================== */

    const otpInputs = $$('.otp-box');

    otpInputs.forEach((input, index) => {

    input.addEventListener('input', () => {

        input.value = input.value
        .replace(/\D/g, '')
        .slice(0, 1);

        if (
        input.value &&
        index < otpInputs.length - 1
        ) {
        otpInputs[index + 1].focus();
        }

    });

    input.addEventListener('keydown', (e) => {

        if (
        e.key === 'Backspace' &&
        !input.value &&
        index > 0
        ) {
        otpInputs[index - 1].focus();
        }

    });

    });

    /* ===================================
    PHONE SYNC
    =================================== */

    const phoneInput = $('#reg-phone');
    const otpPhone   = $('.otp-phone');

    function updatePhone() {

    if (!phoneInput || !otpPhone) return;

    otpPhone.textContent =
        `+62 ${phoneInput.value || '812 3456 7890'}`;

    }

    phoneInput?.addEventListener(
    'input',
    updatePhone
    );