import { defineEntryTemplate, field } from '@bopli/theme-sdk/authoring';

export default defineEntryTemplate({
  name: 'Cosmic Terminal project',
  default: true,
  fields: {
    summary: field.longText({ required: true }),
    externalUrl: field.text({ label: 'External URL' }),
  },
});
