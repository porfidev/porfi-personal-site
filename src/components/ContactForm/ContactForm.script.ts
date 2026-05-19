import axios from 'axios';
import { FormData } from 'node-fetch-native';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
const publiApiUrl = import.meta.env.PUBLIC_API_URL;

const notyf = new Notyf({
  position: { x: 'left', y: 'top' },
});
const contactFormElement: HTMLFormElement | null = document.querySelector('#contact-form');
const turnstileElement = document.querySelector<HTMLElement>('#turnstile-contact');
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

    const response = await axios.post(`${publiApiUrl}/email/send`, {
      to: 'hola@porfi.dev',
      subject: 'Mensaje de contacto',
      comments: `Hola de ${data.name} / ${data.email} te escribo ${data.message}`,
      token: responseToken,
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

contactFormElement?.addEventListener('submit', onSubmitFormElement);

turnstileElement?.addEventListener('turnstile:success', (event) => {
  const customEvent = event as CustomEvent<{ token: string; widgetId: string }>;
  widgetId = customEvent.detail.widgetId;

  console.log('SE HIZO SUCCESS', widgetId);

  if (contactFormElement) {
    setFormDisable(contactFormElement, false);
  }
});
