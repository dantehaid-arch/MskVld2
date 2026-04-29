document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

  // Mobile menu
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.navbar__links');
  burger?.addEventListener('click', () => navLinks?.classList.toggle('active'));

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.menu-grid').forEach(g => g.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab)?.classList.add('active');
    });
  });

  // Modal
  const modal = document.getElementById('booking-modal');
  document.querySelectorAll('.open-modal').forEach(b => b.addEventListener('click', e => { e.preventDefault(); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }));
  document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; } });

  // Form
  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');
  const ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.disabled = true; submitBtn.textContent = 'Отправляем...'; statusEl.textContent = ''; statusEl.className = 'form-status';
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
      if (res.ok) { statusEl.textContent = '✅ Заявка принята! Подтвердим бронь в течение 15 минут.'; statusEl.classList.add('success'); form.reset(); setTimeout(() => { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }, 2500); }
      else throw new Error();
    } catch { statusEl.textContent = '❌ Ошибка. Позвоните нам: +7 (423) 123-45-67'; statusEl.classList.add('error'); }
    finally { submitBtn.disabled = false; submitBtn.textContent = 'Отправить заявку'; }
  });

  // Phone mask
  const phone = document.querySelector('input[name="phone"]');
  phone?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    if (v && v[0] !== '7') v = '7' + v;
    if (v.length > 11) v = v.slice(0, 11);
    let f = '';
    if (v.length) f = '+7';
    if (v.length > 1) f += ' (' + v.slice(1, 4);
    if (v.length > 4) f += ') ' + v.slice(4, 7);
    if (v.length > 7) f += '-' + v.slice(7, 9);
    if (v.length > 9) f += '-' + v.slice(9, 11);
    e.target.value = f;
  });

  // Date min
  const date = document.querySelector('input[name="date"]');
  if (date) date.setAttribute('min', new Date().toISOString().split('T')[0]);
});
