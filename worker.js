export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. اگر مسیر /api بود، به منطق API برو
    if (path.startsWith('/api')) {
      return await handleAPI(request, env);
    }

    // 2. اگر مسیر ریشه (/) یا فایل‌های استاتیک بود، از GitHub Pages بیاور
    if (path === '/' || path === '/index.html' || path === '/login.css' || path === '/index.js' || path === '/api.js') {
      return fetch('https://salhamir146-prog.github.io/2222222222222222' + path);
    }

    // 3. برای بقیه مسیرها، 404
    return new Response('Not Found', { status: 404 });
  }
};

// ============================================================
// منطق API (همان کدهای قبلی)
// ============================================================

async function handleAPI(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (path === '/api/send-otp' && request.method === 'POST') {
    return await handleSendOTP(request, env, corsHeaders);
  }

  if (path === '/api/check-user' && request.method === 'POST') {
    return await handleCheckUser(request, env, corsHeaders);
  }

  if (path === '/api/verify-otp' && request.method === 'POST') {
    return await handleVerifyOTP(request, env, corsHeaders);
  }

  return new Response('Not Found', { status: 404 });
}

async function handleSendOTP(request, env, corsHeaders) {
  const body = await request.json();
  const { phone, referralCode, isRegistration } = body;

  const phoneRegex = /^09[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    return new Response(JSON.stringify({ message: 'شماره موبایل نامعتبر' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (isRegistration) {
    const existingUser = await env.USERS_KV.get(`user_${phone}`);
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'این شماره قبلاً ثبت‌نام شده است. لطفاً وارد شوید.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await env.OTP_KV.put(`otp_${phone}`, otpCode, { expirationTtl: 120 });

  console.log(`کد تایید برای ${phone}: ${otpCode}`);

  return new Response(JSON.stringify({ success: true, message: 'کد تایید ارسال شد.' }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleCheckUser(request, env, corsHeaders) {
  const body = await request.json();
  const { phone } = body;

  const existingUser = await env.USERS_KV.get(`user_${phone}`);
  return new Response(JSON.stringify({ exists: !!existingUser }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleVerifyOTP(request, env, corsHeaders) {
  const body = await request.json();
  const { phone, otpCode, registerData } = body;

  const storedOTP = await env.OTP_KV.get(`otp_${phone}`);
  if (!storedOTP || storedOTP !== otpCode) {
    return new Response(JSON.stringify({ message: 'کد تایید اشتباه است یا منقضی شده است.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  await env.OTP_KV.delete(`otp_${phone}`);

  const existingUser = await env.USERS_KV.get(`user_${phone}`);
  if (existingUser) {
    const userData = JSON.parse(existingUser);
    const token = generateToken(phone);
    return new Response(JSON.stringify({
      success: true,
      action: 'login',
      message: 'ورود موفقیت‌آمیز!',
      token,
      user: userData
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } else {
    if (!registerData) {
      return new Response(JSON.stringify({ message: 'برای ثبت‌نام نیاز به اطلاعات کامل دارید.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const nationalCodeKey = `national_${registerData.nationalCode}`;
    const existingNational = await env.USERS_KV.get(nationalCodeKey);
    if (existingNational) {
      return new Response(JSON.stringify({ message: 'این کد ملی قبلاً در سیستم ثبت شده است.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const newUser = {
      phone: phone,
      name: registerData.name,
      nationalCode: registerData.nationalCode,
      birthDate: registerData.birthDate,
      gender: registerData.gender,
      referralCode: registerData.referralCode || null,
      points: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await env.USERS_KV.put(`user_${phone}`, JSON.stringify(newUser));
    await env.USERS_KV.put(nationalCodeKey, phone);

    const token = generateToken(phone);
    return new Response(JSON.stringify({
      success: true,
      action: 'register',
      message: 'ثبت‌نام با موفقیت انجام شد! خوش آمدید.',
      token,
      user: newUser
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

function generateToken(phone) {
  return btoa(`token_${phone}_${Date.now()}`);
}
