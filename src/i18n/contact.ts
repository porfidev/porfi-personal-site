// src/i18n/contact.ts
export const contactCopy = {
  es: {
    title: 'Contacto',
    leadTitle: '¿Tienes algo en mente?',
    leadBody:
      'Será un gusto leerte. Ya sea una duda, una propuesta o simplemente quieras iniciar una conversación, este espacio está abierto para ti.',
    note: 'Déjame un mensaje y te responderé lo antes posible.',
    form: {
      name: 'Nombre',
      namePlaceholder: 'Ingresa tu nombre',
      email: 'Correo electrónico',
      emailPlaceholder: 'tucorreo@tudominio.com',
      message: 'Comentarios',
      messagePlaceholder: 'Ingresa tu mensaje aquí',
      submit: 'Enviar',
    },
  },
  en: {
    title: 'Contact',
    leadTitle: 'Have something in mind?',
    leadBody:
      'I would be happy to hear from you. Whether it is a question, a proposal, or just the start of a conversation, this space is open for you.',
    note: 'Leave me a message and I will get back to you as soon as possible.',
    form: {
      name: 'Name',
      namePlaceholder: 'Enter your name',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      message: 'Comments',
      messagePlaceholder: 'Enter your message here',
      submit: 'Send',
    },
  },
} as const;

export type ContactLang = keyof typeof contactCopy;
