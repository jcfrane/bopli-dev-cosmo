import { definePageTemplate, field } from '@bopli/theme-sdk/authoring';

export default definePageTemplate({
  name: 'Cosmic Terminal about',
  fields: {
    body: field.richText({ label: 'Biography' }),
    skills: field.list(
      {
        label: field.text({ label: 'Skill', required: true }),
      },
      { label: 'What I work with', maxItems: 20 },
    ),
    timeline: field.list(
      {
        year: field.text({ required: true }),
        description: field.longText({ required: true }),
      },
      { label: 'Career timeline', maxItems: 20 },
    ),
  },
});
