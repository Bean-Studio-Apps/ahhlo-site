// Landing-page behavior: painted-door funnel.
//
// All writes go through the `landing_capture` Supabase Edge Function — the
// landing tables no longer accept direct anonymous inserts. The function adds
// per-IP rate limiting, a honeypot check, validation, and email dedupe.
//  - On load:      record a 'view' event.
//  - On CTA click: record a 'cta_click' event, reveal the reserve form.
//  - On submit:    send the email (+ honeypot) to the waitlist.

(function () {
  var URL = window.SPROUT_SUPABASE_URL;
  var KEY = window.SPROUT_SUPABASE_KEY;

  function post(payload) {
    return fetch(URL + '/functions/v1/landing_capture', {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: 'Bearer ' + KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  function track(kind) {
    post({ action: 'event', kind: kind }).catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    track('view');

    var cta = document.getElementById('cta');
    var reserve = document.getElementById('reserve');
    var form = document.getElementById('waitlist-form');
    var email = document.getElementById('email');
    var hp = document.getElementById('hp-website');
    var error = document.getElementById('reserve-error');
    var done = document.getElementById('reserve-done');

    cta.addEventListener('click', function (e) {
      e.preventDefault();
      track('cta_click');
      reserve.hidden = false;
      reserve.scrollIntoView({ behavior: 'smooth' });
      email.focus();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      error.hidden = true;
      var value = email.value.trim();
      if (value.indexOf('@') < 1 || value.length < 3) {
        error.hidden = false;
        return;
      }
      var btn = form.querySelector('button');
      btn.disabled = true;
      btn.textContent = 'Reserving…';

      post({ action: 'waitlist', email: value, website: hp ? hp.value : '' })
        .then(function (res) {
          if (!res.ok) throw new Error('request failed');
          form.hidden = true;
          done.hidden = false;
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Reserve my spot';
          error.hidden = false;
        });
    });
  });
})();
