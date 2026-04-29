document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); revealObserver.unobserve(entry.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  const header = document.getElementById('header');
  window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 50); });

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => { nav.classList.toggle('active'); burger.classList.toggle('active'); });
  document.querySelectorAll('.nav a').forEach(link => { link.addEventListener('click', () => { nav.classList.remove('active'); burger.classList.remove('active'); }); });

  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.menu-tab');
  tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); contents.forEach(c => c.classList.remove('active')); tab.classList.add('active'); document.getElementById(tab.dataset.tab).classList.add('active'); }); });

  const modal = document.getElementById('booking-modal');
  const openBtns = document.querySelectorAll('.open-modal');
  const closeBtns = document.querySelectorAll('.close-modal');
  const openModal = (e) => { e.preventDefault(); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');
  const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // ЗАМЕНИТЕ НА ВАШ ENDPOINT
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true; submitBtn.textContent = 'Отправляем...'; statusEl.textContent = ''; statusEl.className = 'form-status';
    try {
      const response = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
      if (response.ok) { statusEl.textContent = '✅ Заявка принята! Мы свяжемся с вами в течение 15 минут.'; statusEl.classList.add('success'); form.reset(); setTimeout(closeModal, 2000); }
      else { throw new Error('Ошибка отправки'); }
    } catch (error) { statusEl.textContent = '❌ Произошла ошибка. Пожалуйста, позвоните нам.'; statusEl.classList.add('error'); }
    finally { submitBtn.disabled = false; submitBtn.textContent = 'Отправить заявку'; }
  });

  const phoneInput = document.querySelector('input[name="phone"]');
  const dateInput = document.querySelector('input[name="date"]');
  if (dateInput) { dateInput.setAttribute('min', new Date().toISOString().split('T')[0]); }
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 0 && val[0] !== '7') val = '7' + val;
      if (val.length > 11) val = val.slice(0, 11);
      let formatted = '';
      if (val.length > 0) formatted = '+7';
      if (val.length > 1) formatted += ' (' + val.slice(1, 4);
      if (val.length > 4) formatted += ') ' + val.slice(4, 7);
      if (val.length > 7) formatted += '-' + val.slice(7, 9);
      if (val.length > 9) formatted += '-' + val.slice(9, 11);
      e.target.value = formatted;
    });
  }
  console.log('🐴🐅 Москва-Владивосток | Site loaded');
});