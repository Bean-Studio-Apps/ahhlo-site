// Landing-page behavior: lightweight funnel tracking.
//
// Events go through the `landing_capture` Supabase Edge Function, which adds
// per-IP rate limiting and validation.
//  - On load:            record a 'view' event.
//  - On App Store click: record a 'cta_click' event (the link still navigates).

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
    if (cta) {
      cta.addEventListener('click', function () {
        track('cta_click');
      });
    }
  });
})();
