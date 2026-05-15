import axios from 'axios';
import { FormData } from 'node-fetch-native';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

const notyf = new Notyf({
  position: { x: 'left', y: 'top' },
});
const contactFormElement: HTMLFormElement | null = document.querySelector('#contact-form');
let widgetId: string | undefined;

function setFormDisable(form: HTMLFormElement, disabled: boolean) {
  const formElements = form.querySelectorAll<
    HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement
  >('input, button, select, textarea');

  formElements.forEach((element) => (element.disabled = disabled));
}

async function onSubmitFormElement(event: SubmitEvent) {
  event.preventDefault();
  if (!widgetId) {
    notyf.error('El captcha aún no está listo');
    return;
  }

  const form = event.currentTarget as HTMLFormElement;

  try {
    const formData = new FormData(form);
    setFormDisable(form, true);

    const data = Object.fromEntries(formData.entries());
    const responseToken = turnstile.getResponse(widgetId);

    console.log('TOKEN', responseToken);

    const response = await axios.post('http://localhost:3030/email/send', {
      //to: 'hola@porfi.dev',
      subject: 'Mensaje de contacto',
      comments: `Hola de ${data.name} / ${data.email} te escribo ${data.message}`,
    });

    if (response.status === 200) {
      const { data: result } = response;
      if (result.success) {
        notyf.success(result.message);
        contactFormElement?.reset();
        return;
      }

      return notyf.error(result.message);
    }

    return notyf.error('error');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ?? error.message ?? 'Ocurrió un error inesperado';

      notyf.error(message);
      return;
    }

    notyf.error('Error desconocido');
  } finally {
    setFormDisable(form, false);
    turnstile.reset(widgetId);
  }
}

if (contactFormElement) {
  setFormDisable(contactFormElement, true);
  contactFormElement?.addEventListener('submit', onSubmitFormElement);

  widgetId = turnstile.render('#turnstile-container', {
    sitekey: siteKey,
    callback: function (token) {
      console.log('Success:', token);
      setFormDisable(contactFormElement, false);
    },
    'error-callback': function (errorCode) {
      console.error('Turnstile error:', errorCode);
    },
  });
}
