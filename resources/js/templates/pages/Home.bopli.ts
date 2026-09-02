import { definePageTemplate, field } from '@bopli/theme-sdk/authoring';

export default definePageTemplate({
  name: 'Cosmic Terminal home',
  fields: {
    body: field.longText(),
  },
});
