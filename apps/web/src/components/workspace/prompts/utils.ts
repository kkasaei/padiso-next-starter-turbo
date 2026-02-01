
export const getProviderIcon = (provider?: string) => {
    if (!provider) return '/icons/default.svg';
    // Map provider to icon filename
    const iconMap: Record<string, string> = {
      'claude': 'claude',
      'openai': 'openai',
      'perplexity': 'perplexity',
      'gemini': 'gemini',
      'grok': 'grok',
      'mistral': 'mistral',
      'llama': 'meta-brand', // Llama uses Meta icon
    };
    
    const iconName = iconMap[provider.toLowerCase()] || provider.toLowerCase();
    return `/icons/${iconName}.svg`;
  };