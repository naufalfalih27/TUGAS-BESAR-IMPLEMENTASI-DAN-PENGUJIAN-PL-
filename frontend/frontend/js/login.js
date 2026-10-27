(() => {
  const form = document.getElementById('login-form');
  const password = document.getElementById('password');
  const toggle = document.getElementById('toggle-password');
  const error = document.getElementById('login-error');
  toggle?.addEventListener('click', () => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    toggle.setAttribute('aria-label', visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
    toggle.textContent = visible ? '◎' : '◉';
  });
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pass = password.value;
    if (!email || !pass) {
      error.textContent = 'Email / nama pengguna dan kata sandi wajib diisi.';
      error.classList.add('show');
      return;
    }
    error.classList.remove('show');
    // Demo frontend only. Replace this redirect with backend authentication when available.
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Memuat dashboard…';
    sessionStorage.setItem('kitt-admin-demo-user', email);
    window.setTimeout(() => { window.location.href = 'admin.html'; }, 350);
  });
  document.getElementById('forgot-link')?.addEventListener('click', event => {
    event.preventDefault();
    error.textContent = 'Untuk reset kata sandi, hubungi administrator sistem. Fitur email belum terhubung.';
    error.classList.add('show');
  });
})();
