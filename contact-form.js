(() => {
  // Contact form. With a Web3Forms access key set in the form, messages are sent straight to the inbox.
  // Until then it falls back to opening the visitor's email app with the message already written.
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = form.querySelector('.contact-status');
  const button = form.querySelector('.contact-send');
  const say = (text, kind) => { status.textContent = text; status.dataset.kind = kind || ''; };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (form.botcheck.checked) return;
    const data = new FormData(form);
    const needs = data.getAll('needs').join(', ');
    const key = data.get('access_key');
    if (!key) {
      const body = `${data.get('message')}\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nBrand: ${data.get('brand') || '-'}\nNeeds: ${needs || '-'}`;
      location.href = `mailto:hello@liliastudios.com?subject=${encodeURIComponent('Hello from ' + data.get('name'))}&body=${encodeURIComponent(body)}`;
      say('Your email app should open with your message ready to send.');
      return;
    }
    data.set('needs', needs);
    data.delete('consent');
    button.disabled = true;
    say('Sending…');
    try {
      const response = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Failed');
      form.reset();
      say("Thank you! Your message is on its way. I'll get back to you within two working days.", 'ok');
    } catch (error) {
      say('Something went wrong. Please email hello@liliastudios.com instead.', 'error');
    } finally {
      button.disabled = false;
    }
  });
})();
