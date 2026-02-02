import mjml2html from 'mjml';

/**
 * Render MJML template to HTML
 *
 * @param mjmlString - MJML template string
 * @returns Rendered HTML and plain text
 */
export function renderMJML(mjmlString: string): { html: string; text: string } {
  const { html, errors } = mjml2html(mjmlString, {
    validationLevel: 'soft',
    minify: true,
  });

  if (errors.length > 0) {
    console.error('MJML rendering errors:', errors);
  }

  // Generate plain text version (basic conversion)
  const text = html
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return { html, text };
}
