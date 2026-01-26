# AEO Domain Input - Embeddable Web Component

A standalone web component for the AEO domain input form that can be embedded in Webflow or any website.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server with preview
pnpm dev

# Build for production
pnpm build
```

## Build Output

After running `pnpm build`, you'll find in the `dist/` folder:

- `aeo-domain-input.iife.js` - Main JavaScript bundle
- `aeo-domain-input.css` - Styles

## Deploy to Cloudflare R2

1. **Create an R2 bucket** in your Cloudflare dashboard
2. **Enable public access** for the bucket
3. **Upload the files** from `dist/`:
   - Upload `aeo-domain-input.iife.js`
   - Upload `aeo-domain-input.css`

### Using Wrangler CLI (Optional)

```bash
# Install wrangler if needed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create bucket (one time)
wrangler r2 bucket create aeo-embed

# Upload files
wrangler r2 object put aeo-embed/aeo-domain-input.iife.js --file=dist/aeo-domain-input.iife.js --content-type="application/javascript"
wrangler r2 object put aeo-embed/aeo-domain-input.css --file=dist/aeo-domain-input.css --content-type="text/css"
```

## Usage in Webflow

### 1. Add to Page Settings → Custom Code → Head

```html
<script src="https://pub-xxxxx.r2.dev/aeo-domain-input.iife.js"></script>
<link rel="stylesheet" href="https://pub-xxxxx.r2.dev/aeo-domain-input.css">
```

Replace `pub-xxxxx.r2.dev` with your R2 bucket's public URL.

### 2. Add an Embed Element

Add an "Embed" component in Webflow and paste:

```html
<aeo-domain-input
  redirect-url="https://searchfit.io/report"
  turnstile-key="your-turnstile-site-key"
  theme="light"
></aeo-domain-input>
```

## Available Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `redirect-url` | string | `https://searchfit.io/report` | Where to redirect after form submission |
| `turnstile-key` | string | - | Cloudflare Turnstile site key (optional) |
| `theme` | `light` \| `dark` | `light` | Color theme |
| `show-verticals` | boolean | `true` | Show business type dropdown |
| `placeholder` | string | - | Custom placeholder text |

## Events

The component dispatches a custom event when the form is submitted:

```javascript
document.addEventListener('aeo-domain-submitted', (event) => {
  console.log('Domain:', event.detail.domain);
  console.log('Vertical:', event.detail.vertical);
  console.log('Turnstile Token:', event.detail.token);
});
```

## Custom Styling

Override CSS variables to customize colors:

```css
aeo-domain-input {
  --primary: 220 90% 56%;
  --primary-foreground: 0 0% 100%;
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;
  --border: 214 32% 91%;
  --muted-foreground: 215 16% 47%;
}
```
