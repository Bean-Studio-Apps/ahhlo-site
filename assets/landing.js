// Landing-page behavior: painted-door funnel.
//  - On load:        record a 'view' event.
//  - On CTA click:   record a 'cta_click' event, reveal the reserve form.
//  - On submit:      insert the email into the waitlist.
// Events/inserts go straight to Supabase PostgREST with the publishable key
// (RLS allows anon INSERT only — rows can't be read back from the client).

(function () {
  var URL = window.SPROUT_SUPABASE_URL;
  var KEY = window.SPROUT_SUPABASE_KEY;

  function post(path, payload) {
    return fetch(URL + '/rest/v1/' + path, {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: 'Bearer ' + KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
  }

  function track(kind) {
    post('landing_events', { kind: kind }).catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    track('view');

    var cta = document.getElementById('cta');
    var reserve = document.getElementById('reserve');
    var form = document.getElementById('waitlist-form');
    var email = document.getElementById('email');
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

      post('waitlist', { email: value, source: 'landing' })
        .then(function (res) {
          if (!res.ok) throw new Error('insert failed');
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
