document.addEventListener('DOMContentLoaded', function() {
    // المان‌های صفحه ورود
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
    const referralToggle = document.getElementById('referralToggle');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const goToRegister = document.getElementById('goToRegister');

    // المان‌های صفحه ثبت‌نام
    const registerSection = document.getElementById('registerSection');
    const registerForm = document.getElementById('registerForm');
    const regPhone = document.getElementById('regPhone');
    const regName = document.getElementById('regName');
    const regNationalCode = document.getElementById('regNationalCode');
    const regBirthDate = document.getElementById('regBirthDate');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');
    const backToLoginFromRegister = document.getElementById('backToLoginFromRegister');

    // المان‌های صفحه OTP
    const otpSection = document.getElementById('otpSection');
    const otpPhoneDisplay = document.getElementById('otpPhoneDisplay');
    const otpInput = document.getElementById('otpInput');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const resendBtn = document.getElementById('resendBtn');
    const backToLoginFromOtp = document.getElementById('backToLoginFromOtp');

    // پاپ‌آپ‌ها
    const termsOverlay = document.getElementById('termsOverlay');
    const privacyOverlay = document.getElementById('privacyOverlay');
    const referralOverlay = document.getElementById('referralOverlay');
    const referralCodeInput = document.getElementById('referralCodeInput');
    const confirmReferral = document.getElementById('confirmReferral');
    const closeTerms = document.getElementById('closeTerms');
    const closePrivacy = document.getElementById('closePrivacy');
    const closeReferral = document.getElementById('closeReferral');

    // چک‌باکس کد معرف
    if (referralToggle) {
        referralToggle.addEventListener('change', function() {
            if (this.checked) {
                openOverlay(referralOverlay);
            }
        });
    }

    // رفتن به ثبت‌نام و بازگشت
    if (goToRegister) {
        goToRegister.addEventListener('click', function() {
            loginSection.style.display = 'none';
            registerSection.classList.add('active');
        });
    }
    if (backToLoginFromRegister) {
        backToLoginFromRegister.addEventListener('click', function() {
            registerSection.classList.remove('active');
            loginSection.style.display = 'block';
        });
    }
    if (backToLoginFromOtp) {
        backToLoginFromOtp.addEventListener('click', function() {
            otpSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    // توابع پاپ‌آپ
    function openOverlay(overlay) {
        if (overlay) overlay.classList.add('active');
    }
    function closeOverlay(overlay) {
        if (overlay) overlay.classList.remove('active');
    }

    // دکمه‌های بستن پاپ‌آپ
    if (closeTerms) closeTerms.addEventListener('click', () => closeOverlay(termsOverlay));
    if (closePrivacy) closePrivacy.addEventListener('click', () => closeOverlay(privacyOverlay));
    if (closeReferral) closeReferral.addEventListener('click', () => closeOverlay(referralOverlay));

    // تایید کد معرف
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

    // ارسال فرم ورود
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
});
