const API_BASE = 'https://2222222222222222.salhamir146.workers.dev';
let otpTimer = null;
let remainingTime = 0;

export async function requestOTP(phone, referralCode = null, isRegistration = false) {
    const response = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, referralCode, isRegistration })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'خطا در ارسال کد');
    return data;
}

export async function checkUserExists(phone) {
    const response = await fetch(`${API_BASE}/check-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
    });
    const data = await response.json();
    return data.exists;
}

export async function verifyOTPAndLogin(phone, otpCode, registerData = null) {
    const response = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otpCode, registerData })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'خطا در تایید کد');
    return data;
}

export function startOTPTimer(timerElement, resendButton, onResend) {
    remainingTime = 120;
    timerElement.textContent = `زمان باقی‌مانده: ${remainingTime} ثانیه`;
    resendButton.disabled = true;
    if (otpTimer) clearInterval(otpTimer);
    otpTimer = setInterval(() => {
        remainingTime--;
        timerElement.textContent = `زمان باقی‌مانده: ${remainingTime} ثانیه`;
        if (remainingTime <= 0) {
            clearInterval(otpTimer);
            timerElement.textContent = 'می‌توانید کد را دوباره دریافت کنید.';
            resendButton.disabled = false;
            if (onResend) onResend();
        }
    }, 1000);
}

export function stopOTPTimer() {
    if (otpTimer) {
        clearInterval(otpTimer);
        otpTimer = null;
    }
}
