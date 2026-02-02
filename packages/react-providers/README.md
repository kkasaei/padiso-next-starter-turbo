# @workspace/react-providers

Shared React context providers for state management across all apps.

## Providers

### ActiveBrandProvider

Provides the current brand context to child components.

```tsx
import { ActiveBrandProvider, useActiveBrand } from '@workspace/react-providers/active-brand';

function App({ brand }) {
  return (
    <ActiveBrandProvider brand={brand}>
      <YourComponent />
    </ActiveBrandProvider>
  );
}

function YourComponent() {
  const brand = useActiveBrand();
  return <div>{brand.name}</div>;
}
```

### ActiveOrganizationProvider

Provides the current organization context.

```tsx
import { ActiveOrganizationProvider, useActiveOrganization } from '@workspace/react-providers/active-organization';

function App({ organization }) {
  return (
    <ActiveOrganizationProvider organization={organization}>
      <YourComponent />
    </ActiveOrganizationProvider>
  );
}
```

### MediaUploadProvider

Provides project/brand context for file uploads.

```tsx
import { MediaUploadProvider, useMediaUploadContext } from '@workspace/react-providers/media-upload';

function App({ projectId }) {
  return (
    <MediaUploadProvider projectId={projectId}>
      <Editor />
    </MediaUploadProvider>
  );
}
```
