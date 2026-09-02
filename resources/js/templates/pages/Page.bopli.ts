import { definePageTemplate, field } from '@bopli/theme-sdk/authoring';

export default definePageTemplate({
  name: 'Cosmic Terminal page',
  default: true,
  fields: {
    body: field.longText(),
  },
});
