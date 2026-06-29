const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// ── Supabase tracking (no-op until window.SUPABASE_URL/ANON_KEY are set) ──
(function () {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;
  if (!url || !key) return;

  function getSessionId() {
    let id = sessionStorage.getItem('kh_session_id');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('kh_session_id', id);
    }
    return id;
  }

  function track(eventType, label) {
    fetch(`${url}/rest/v1/interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        event_type: eventType,
        label: label || null,
        page: window.location.pathname,
        session_id: getSessionId()
      })
    }).catch(() => {});
  }
  window.khTrack = track;

  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => track('cta_click', el.getAttribute('data-track')));
  });

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = signupForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      if (!email) return;
      const status = signupForm.querySelector('.signup-status');
      try {
        await fetch(`${url}/rest/v1/signups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({ email, source_page: window.location.pathname })
        });
        signupForm.reset();
        if (status) status.textContent = "You're in — we'll be in touch.";
      } catch {
        if (status) status.textContent = 'Something went wrong, please try again.';
      }
    });
  }
})();
