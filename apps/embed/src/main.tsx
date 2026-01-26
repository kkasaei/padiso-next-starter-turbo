import React from 'react';
import ReactDOM from 'react-dom/client';
import { AEODomainInput, AEODomainInputProps } from './components/aeo-domain-input';

// Web Component Definition
class AEODomainInputElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;

  static get observedAttributes() {
    return [
      'turnstile-key',
      'redirect-url',
      'theme',
      'button-text',
      'show-verticals',
      'placeholder',
    ];
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  private getProps(): AEODomainInputProps {
    return {
      turnstileKey: this.getAttribute('turnstile-key') || undefined,
      redirectUrl: this.getAttribute('redirect-url') || undefined,
      theme: (this.getAttribute('theme') as 'light' | 'dark') || 'light',
      buttonText: this.getAttribute('button-text') || undefined,
      showVerticals: this.getAttribute('show-verticals') !== 'false',
      placeholder: this.getAttribute('placeholder') || undefined,
    };
  }

  private render() {
    if (!this.root) {
      const container = document.createElement('div');
      container.style.width = '100%';
      this.appendChild(container);
      this.root = ReactDOM.createRoot(container);
    }

    const props = this.getProps();
    this.root.render(
      <React.StrictMode>
        <AEODomainInput {...props} />
      </React.StrictMode>
    );
  }
}

// Register the custom element
if (!customElements.get('aeo-domain-input')) {
  customElements.define('aeo-domain-input', AEODomainInputElement);
}

export { AEODomainInput } from './components/aeo-domain-input';
