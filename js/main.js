document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('active'); observer.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => observer.observe(el));

  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger?.addEventListener('click', () => { nav.classList.toggle('active'); burger.classList.toggle('active'); });
  document.querySelectorAll('.nav a').forEach(l => l.addEventListener('click', () => { nav.classList.remove('active'); burger.classList.remove('active'); }));

  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.menu-tab').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  const modal = document.getElementById('booking-modal');
  document.querySelectorAll('.open-modal').forEach(b => b.addEventListener('click', e => { e.preventDefault(); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }));
  document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }));
  modal?.querySelector('.modal__overlay').addEventListener('click', () => { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; } });

  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');
  const ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // ЗАМЕНИ НА СВОЙ
  
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.disabled = true; submitBtn.textContent = 'Отправляем...'; statusEl.textContent = ''; statusEl.className = 'form-status';
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
      if(res.ok) { statusEl.textContent = '✅ Заявка принята! Мы свяжемся с вами в течение 15 минут.'; statusEl.classList.add('success'); form.reset(); setTimeout(() => { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }, 2000); }
      else throw new Error();
    } catch { statusEl.textContent = '❌ Ошибка. Позвоните нам.'; statusEl.classList.add('error'); }
    finally { submitBtn.disabled = false; submitBtn.textContent = 'Отправить заявку'; }
  });

  const phone = document.querySelector('input[name="phone"]');
  const date = document.querySelector('input[name="date"]');
  if(date) date.setAttribute('min', new Date().toISOString().split('T')[0]);
  if(phone) {
    phone.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if(v && v[0] !== '7') v = '7' + v;
      if(v.length > 11) v = v.slice(0, 11);
      let f = '';
      if(v.length) f = '+7';
      if(v.length > 1) f += ' (' + v.slice(1,4);
      if(v.length > 4) f += ') ' + v.slice(4,7);
      if(v.length > 7) f += '-' + v.slice(7,9);
      if(v.length > 9) f += '-' + v.slice(9,11);
      e.target.value = f;
    });
  }
});
