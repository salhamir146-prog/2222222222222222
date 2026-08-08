import { requestOTP, checkUserExists, verifyOTPAndLogin, startOTPTimer, stopOTPTimer } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const goToRegister = document.getElementById('goToRegister');

    const otpSection = document.getElementById('otpSection');
    const otpPhoneDisplay = document.getElementById('otpPhoneDisplay');
    const otpInput = document.getElementById('otpInput');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const resendBtn = document.getElementById('resendBtn');
    const backToLoginFromOtp = document.getElementById('backToLoginFromOtp');

    const registerSection = document.getElementById('registerSection');
    const registerForm = document.getElementById('registerForm');
    const regPhone = document.getElementById('regPhone');
    const regName = document.getElementById('regName');
    const regNationalCode = document.getElementById('regNationalCode');
    const regBirthDate = document.getElementById('regBirthDate');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');
    const backToLoginFromRegister = document.getElementById('backToLoginFromRegister');

    let currentPhone = '';
    let isRegistrationMode = false;
    let registrationData = null;

    const termsOverlay = document.getElementById('termsOverlay');
    const privacyOverlay = document.getElementById('privacyOverlay');
    const referralOverlay = document.getElementById('referralOverlay');
    const referralToggle = document.getElementById('referralToggle');
    const referralCodeInput = document.getElementById('referralCodeInput');
    const confirmReferral = document.getElementById('confirmReferral');

    function openOverlay(overlay) { overlay.classList.add('active'); }
    function closeOverlay(overlay) { overlay.classList.remove('active'); }

    document.getElementById('openTerms').addEventListener('click', () => openOverlay(termsOverlay));
    document.getElementById('closeTerms').addEventListener('click', () => closeOverlay(termsOverlay));
    document.getElementById('openPrivacy').addEventListener('click', () => openOverlay(privacyOverlay));
    document.getElementById('closePrivacy').addEventListener('click', () => closeOverlay(privacyOverlay));

    referralToggle.addEventListener('change', function() {
        if (this.checked) openOverlay(referralOverlay);
    });
    document.getElementById('closeReferral').addEventListener('click', () => {
        closeOverlay(referralOverlay);
        referralToggle.checked = false;
    });
    confirmReferral.addEventListener('click', () => {
        const code = referralCodeInput.value.trim();
        if (code) {
            alert('کد معرف "' + code + '" ثبت شد.');
            closeOverlay(referralOverlay);
        } else {
            alert('لطفاً کد معرف را وارد کنید.');
        }
    });

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

    goToRegister.addEventListener('click', () => {
        loginSection.style.display = 'none';
        registerSection.classList.add('active');
    });
    backToLoginFromRegister.addEventListener('click', () => {
        registerSection.classList.remove('active');
        loginSection.style.display = 'block';
    });
    backToLoginFromOtp.addEventListener('click', () => {
        otpSection.style.display = 'none';
        loginSection.style.display = 'block';
        stopOTPTimer();
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = phoneInput.value.trim();
        const referralCode = referralToggle.checked ? referralCodeInput.value.trim() : null;
        if (!/^09[0-9]{9}$/.test(phone)) {
            alert('لطفاً شماره موبایل معتبر (۱۱ رقمی، شروع با ۰۹) وارد کنید.');
            return;
        }
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.textContent = 'در حال بررسی...';
        try {
            const userExists = await checkUserExists(phone);
            if (userExists) {
                await requestOTP(phone, referralCode, false);
                currentPhone = phone;
                isRegistrationMode = false;
                showOtpSection(phone);
                alert('کد تایید به شماره شما ارسال شد.');
            } else {
                alert('حسابی با این شماره پیدا نشد. لطفاً ابتدا ثبت‌نام کنید.');
                goToRegister.click();
                regPhone.value = phone;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            loginSubmitBtn.disabled = false;
            loginSubmitBtn.textContent = 'دریافت کد ورود';
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = regName.value.trim();
        const phone = regPhone.value.trim();
        const nationalCode = regNationalCode.value.trim();
        const birthDate = regBirthDate.value.trim();
        const gender = genderSelect.getAttribute('data-selected');
        if (!name || !phone || !nationalCode || !birthDate || !gender) {
            alert('لطفاً تمام فیلدهای اجباری را پر کنید.');
            return;
        }
        if (!/^09[0-9]{9}$/.test(phone)) {
            alert('شماره موبایل معتبر وارد کنید.');
            return;
        }
        if (!/^[0-9]{10}$/.test(nationalCode)) {
            alert('کد ملی باید ۱۰ رقم باشد.');
            return;
        }
        registerSubmitBtn.disabled = true;
        registerSubmitBtn.textContent = 'در حال ارسال کد...';
        try {
            await requestOTP(phone, null, true);
            currentPhone = phone;
            isRegistrationMode = true;
            registrationData = { name, phone, nationalCode, birthDate, gender };
            showOtpSection(phone);
            alert('کد تایید به شماره شما ارسال شد.');
        } catch (error) {
            alert(error.message);
        } finally {
            registerSubmitBtn.disabled = false;
            registerSubmitBtn.textContent = 'دریافت کد تایید و ثبت‌نام';
        }
    });

    function showOtpSection(phone) {
        loginSection.style.display = 'none';
        registerSection.classList.remove('active');
        otpSection.style.display = 'block';
        otpPhoneDisplay.textContent = phone;
        otpInput.value = '';
        verifyOtpBtn.disabled = false;
        startOTPTimer(timerDisplay, resendBtn, () => {
            resendBtn.textContent = 'ارسال مجدد کد';
        });
    }

    verifyOtpBtn.addEventListener('click', async () => {
        const otpCode = otpInput.value.trim();
        if (!otpCode || otpCode.length !== 6) {
            alert('لطفاً کد ۶ رقمی را کامل وارد کنید.');
            return;
        }
        verifyOtpBtn.disabled = true;
        verifyOtpBtn.textContent = 'در حال تایید...';
        try {
            let result;
            if (isRegistrationMode) {
                result = await verifyOTPAndLogin(currentPhone, otpCode, registrationData);
            } else {
                result = await verifyOTPAndLogin(currentPhone, otpCode, null);
            }
            stopOTPTimer();
            if (result.success) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userData', JSON.stringify(result.user));
                alert(result.message || 'ورود/ثبت‌نام با موفقیت انجام شد!');
                console.log('کاربر:', result.user);
                console.log('توکن:', result.token);
            } else {
                alert(result.message || 'خطا در تایید کد.');
            }
        } catch (error) {
            alert(error.message);
        } finally {
            verifyOtpBtn.disabled = false;
            verifyOtpBtn.textContent = 'تایید و ورود';
        }
    });

    resendBtn.addEventListener('click', async () => {
        try {
            await requestOTP(currentPhone, null, isRegistrationMode);
            alert('کد مجدداً ارسال شد.');
            startOTPTimer(timerDisplay, resendBtn, () => {
                resendBtn.textContent = 'ارسال مجدد کد';
            });
        } catch (error) {
            alert(error.message);
        }
    });
});
