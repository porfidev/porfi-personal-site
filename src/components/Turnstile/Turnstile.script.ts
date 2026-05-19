const container = document.querySelector<HTMLDivElement>('.turnstile');

if (container) {
  if (!container.dataset.sitekey) {
    throw Error('No se declaro la sitekey de turnstile en el elemento');
  }
  const widgetId = turnstile.render(container, {
    sitekey: container.dataset.sitekey ?? '',
    callback: function (token) {
      console.log('Success:', token);
      container.dispatchEvent(
        new CustomEvent('turnstile:success', {
          bubbles: true,
          detail: { token, widgetId },
        })
      );
    },
    'error-callback': function (errorCode) {
      console.error('Turnstile error:', errorCode);
    },
    'expired-callback': function () {
      console.error('Caducó');
      container.dispatchEvent(
        new CustomEvent('turnstile:expired', {
          bubbles: true,
          detail: { widgetId },
        })
      );
    },
  });

  container.dataset.widgetId = widgetId;
}
