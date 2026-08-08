document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ index.js loaded successfully');

    // =============================================================
    // 1. المان‌های صفحه ورود
    // =============================================================
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const goToRegister = document.getElementById('goToRegister');
    const loginSection = document.getElementById('loginSection');

    // =============================================================
    // 2. المان‌های صفحه ثبت‌نام
    // =============================================================
    const registerSection = document.getElementById('registerSection');
    const registerForm = document.getElementById('registerForm');
    const regPhone = document.getElementById('regPhone');
    const regName = document.getElementById('regName');
    const regNationalCode = document.getElementById('regNationalCode');
    const regBirthDate = document.getElementById('regBirthDate');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');
    const backToLoginFromRegister = document.getElementById('backToLoginFromRegister');

    // =============================================================
    // 3. المان‌های صفحه OTP
    // =============================================================
    const otpSection = document.getElementById('otpSection');
    const otpPhoneDisplay = document.getElementById('otpPhoneDisplay');
    const otpInput = document.getElementById('otpInput');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const resendBtn = document.getElementById('resendBtn');
    const backToLoginFromOtp = document.getElementById('backToLoginFromOtp');

    // =============================================================
    // 4. پاپ‌آپ‌ها
    // =============================================================
    const termsOverlay = document.getElementById('termsOverlay');
    const privacyOverlay = document.getElementById('privacyOverlay');
    const referralOverlay = document.getElementById('referralOverlay');
    const referralCodeInput = document.getElementById('referralCodeInput');
    const confirmReferral = document.getElementById('confirmReferral');
    const closeTerms = document.getElementById('closeTerms');
    const closePrivacy = document.getElementById('closePrivacy');
    const closeReferral = document.getElementById('closeReferral');
    const openTerms = document.getElementById('openTerms');
    const openPrivacy = document.getElementById('openPrivacy');

    // =============================================================
    // 5. چک‌باکس کد معرف
    // =============================================================
    const referralToggle = document.getElementById('referralToggle');

    // =============================================================
    // 6. توابع کمکی پاپ‌آپ
    // =============================================================
    function openOverlay(overlay) {
        if (overlay) overlay.classList.add('active');
    }
    function closeOverlay(overlay) {
        if (overlay) overlay.classList.remove('active');
    }

    // =============================================================
    // 7. چک‌باکس کد معرف
    // =============================================================
    if (referralToggle) {
        referralToggle.addEventListener('change', function() {
            if (this.checked) {
                openOverlay(referralOverlay);
            } else {
                closeOverlay(referralOverlay);
            }
        });
    }

    // =============================================================
    // 8. لینک‌های قوانین و حریم خصوصی
    // =============================================================
    if (openTerms) {
        openTerms.addEventListener('click', function(e) {
            e.preventDefault();
            openOverlay(termsOverlay);
        });
    }
    if (closeTerms) {
        closeTerms.addEventListener('click', function() {
            closeOverlay(termsOverlay);
        });
    }

    if (openPrivacy) {
        openPrivacy.addEventListener('click', function(e) {
            e.preventDefault();
            openOverlay(privacyOverlay);
        });
    }
    if (closePrivacy) {
        closePrivacy.addEventListener('click', function() {
            closeOverlay(privacyOverlay);
        });
    }

    // =============================================================
    // 9. پاپ‌آپ کد معرف
    // =============================================================
    if (closeReferral) {
        closeReferral.addEventListener('click', function() {
            closeOverlay(referralOverlay);
            if (referralToggle) referralToggle.checked = false;
        });
    }
    if (confirmReferral) {
        confirmReferral.addEventListener('click', function() {
            const code = referralCodeInput ? referralCodeInput.value.trim() : '';
            if (code) {
                alert('کد معرف "' + code + '" ثبت شد.');
                closeOverlay(referralOverlay);
            } else {
                alert('لطفاً کد معرف را وارد کنید.');
            }
        });
    }

    // =============================================================
    // 10. رفتن به صفحه ثبت‌نام و بازگشت
    // =============================================================
    if (goToRegister) {
        goToRegister.addEventListener('click', function() {
            if (loginSection) loginSection.style.display = 'none';
            if (registerSection) registerSection.classList.add('active');
        });
    }
    if (backToLoginFromRegister) {
        backToLoginFromRegister.addEventListener('click', function() {
            if (registerSection) registerSection.classList.remove('active');
            if (loginSection) loginSection.style.display = 'block';
        });
    }
    if (backToLoginFromOtp) {
        backToLoginFromOtp.addEventListener('click', function() {
            if (otpSection) otpSection.style.display = 'none';
            if (loginSection) loginSection.style.display = 'block';
        });
    }

    // =============================================================
    // 11. ارسال فرم ورود
    // =============================================================
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phone = phoneInput ? phoneInput.value.trim() : '';
            if (!phone) {
                alert('لطفاً شماره موبایل را وارد کنید.');
                return;
            }
            alert('درخواست کد تایید به شماره ' + phone + ' ارسال شد.');
        });
    }

    // =============================================================
    // 12. ارسال فرم ثبت‌نام
    // =============================================================
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('فرم ثبت‌نام ارسال شد.');
        });
    }

    // =============================================================
    // 13. دکمه تایید OTP
    // =============================================================
    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', function() {
            const code = otpInput ? otpInput.value.trim() : '';
            if (!code || code.length !== 6) {
                alert('لطفاً کد ۶ رقمی را کامل وارد کنید.');
                return;
            }
            alert('کد ' + code + ' تایید شد.');
        });
    }

    // =============================================================
    // 14. تایمر
    // =============================================================
    if (resendBtn) {
        resendBtn.addEventListener('click', function() {
            alert('درخواست ارسال مجدد کد.');
        });
    }

    console.log('✅ All event listeners attached successfully.');
});
