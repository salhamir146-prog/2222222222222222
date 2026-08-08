document.addEventListener('DOMContentLoaded', () => {
    // المان‌های صفحه ورود
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
    const referralToggle = document.getElementById('referralToggle');
    const submitBtn = document.getElementById('submitBtn');

    // المان‌های صفحه ثبت‌نام
    const goToRegister = document.getElementById('goToRegister');
    const registerSection = document.getElementById('registerSection');
    const loginSection = document.getElementById('loginSection');
    const backToLogin = document.getElementById('backToLogin');

    // پاپ‌آپ‌ها
    const termsOverlay = document.getElementById('termsOverlay');
    const privacyOverlay = document.getElementById('privacyOverlay');
    const referralOverlay = document.getElementById('referralOverlay');
    const referralCodeInput = document.getElementById('referralCodeInput');
    const confirmReferral = document.getElementById('confirmReferral');

    // ----- توابع کمکی پاپ‌آپ -----
    function openOverlay(overlay) { overlay.classList.add('active'); }
    function closeOverlay(overlay) { overlay.classList.remove('active'); }

    // ----- رویدادهای پاپ‌آپ قوانین و حریم خصوصی -----
    document.getElementById('openTerms').addEventListener('click', () => openOverlay(termsOverlay));
    document.getElementById('closeTerms').addEventListener('click', () => closeOverlay(termsOverlay));
    document.getElementById('openPrivacy').addEventListener('click', () => openOverlay(privacyOverlay));
    document.getElementById('closePrivacy').addEventListener('click', () => closeOverlay(privacyOverlay));

    // ----- رویداد چک‌باکس کد معرف (باز کردن پاپ‌آپ) -----
    referralToggle.addEventListener('change', function() {
        if (this.checked) {
            openOverlay(referralOverlay);
        }
    });

    // ----- بستن پاپ‌آپ کد معرف -----
    document.getElementById('closeReferral').addEventListener('click', () => {
        closeOverlay(referralOverlay);
        referralToggle.checked = false;
    });

    // ----- تایید کد معرف در پاپ‌آپ -----
    confirmReferral.addEventListener('click', () => {
        const code = referralCodeInput.value.trim();
        if (code) {
            alert('کد معرف "' + code + '" ثبت شد.');
            closeOverlay(referralOverlay);
        } else {
            alert('لطفاً کد معرف را وارد کنید.');
        }
    });

    // ----- رفتن به صفحه ثبت‌نام و بازگشت -----
    goToRegister.addEventListener('click', () => {
        loginSection.style.display = 'none';
        registerSection.classList.add('active');
    });
    backToLogin.addEventListener('click', () => {
        registerSection.classList.remove('active');
        loginSection.style.display = 'block';
    });

    // ----- منوی کشویی سفارشی جنسیت -----
    const genderSelect = document.getElementById('genderSelect');
    const genderDisplay = document.getElementById('genderDisplay');
    const genderOptions = document.getElementById('genderOptions');
    const options = genderOptions.querySelectorAll('.custom-option');

    genderSelect.addEventListener('click', () => {
        genderSelect.classList.toggle('active');
        genderOptions.classList.toggle('open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const text = option.textContent;
            const value = option.getAttribute('data-value');
            genderDisplay.textContent = text;
            genderSelect.classList.remove('active');
            genderOptions.classList.remove('open');
            genderSelect.setAttribute('data-selected', value);
        });
    });

    document.addEventListener('click', (e) => {
        if (!genderSelect.contains(e.target) && !genderOptions.contains(e.target)) {
            genderSelect.classList.remove('active');
            genderOptions.classList.remove('open');
        }
    });

    // ----- ارسال فرم ورود (با امنیت بالا) -----
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const phone = phoneInput.value.trim();
        const referralCode = referralToggle.checked ? referralCodeInput.value.trim() : null;

        // اعتبارسنجی شماره موبایل
        const phoneRegex = /^09[0-9]{9}$/;
        if (!phoneRegex.test(phone)) {
            alert('لطفاً شماره موبایل معتبر (۱۱ رقمی، شروع با ۰۹) وارد کنید.');
            return;
        }

        // جلوگیری از ارسال مکرر
        submitBtn.disabled = true;
        submitBtn.textContent = 'در حال ارسال...';

        try {
            // ارسال به Cloudflare Worker
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, referralCode })
            });

            const data = await response.json();

            if (response.ok) {
                alert('کد تایید به شماره شما ارسال شد.');
                // هدایت به صفحه تایید کد در آینده
            } else {
                alert(data.message || 'خطا در ارسال کد.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('خطای ارتباط با سرور.');
        } finally {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'دریافت کد ورود';
            }, 5000);
        }
    });
});
