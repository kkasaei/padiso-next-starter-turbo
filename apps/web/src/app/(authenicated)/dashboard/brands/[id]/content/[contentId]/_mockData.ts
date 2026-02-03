export interface LocaleInfo {
  code: string
  name: string
  flag: string
  status: 'draft' | 'published' | 'scheduled'
}

// Locale-specific content data (only the fields that change per locale)
export interface LocaleContentData {
  title: string
  content: string
  metaDescription: string
  slug: string
  targetKeyword: string
  wordCount: number
  keywordCount: number
}

export interface ContentData {
  id: string
  title: string
  type: 'blog' | 'article' | 'landing_page' | 'social'
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  author: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  readTime: string
  content: string
  // SEO & Article Metrics
  articleScore: number
  isOptimized: boolean
  optimizationMessage?: string
  targetKeyword: string
  searchVolume: number
  difficulty: number
  wordCount: number
  keywordCount: number
  imageCount: number
  internalLinks: number
  externalLinks: number
  slug: string
  metaDescription: string
  featuredImage?: string | null
  // Localization
  primaryLocale?: LocaleInfo
  locales?: LocaleInfo[]
}

export const mockContentData: Record<string, ContentData> = {
  'content-1': {
    id: 'content-1',
    title: 'The Complete Guide to AI Visibility: How to Get Your Brand Mentioned by ChatGPT, Perplexity, and Gemini',
    type: 'blog',
    status: 'published',
    author: 'Marketing Team',
    publishedAt: new Date('2026-01-15'),
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-15'),
    readTime: '12 min read',
    articleScore: 96,
    isOptimized: true,
    optimizationMessage: 'Your article is well-optimized for search engines. No further actions are needed.',
    targetKeyword: 'ai visibility guide',
    searchVolume: 480,
    difficulty: 3,
    wordCount: 3899,
    keywordCount: 12,
    imageCount: 2,
    internalLinks: 1,
    externalLinks: 10,
    slug: 'complete-guide-ai-visibility-chatgpt-perplexity-gemini',
    metaDescription: 'Learn how to improve your brand\'s visibility in AI-powered search engines like ChatGPT, Perplexity, and Google Gemini. Complete guide with actionable strategies.',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop',
    primaryLocale: { code: 'en', name: 'English', flag: '🇺🇸', status: 'published' },
    locales: [
      { code: 'es', name: 'Spanish', flag: '🇪🇸', status: 'published' },
      { code: 'fr', name: 'French', flag: '🇫🇷', status: 'published' },
      { code: 'de', name: 'German', flag: '🇩🇪', status: 'published' },
      { code: 'it', name: 'Italian', flag: '🇮🇹', status: 'draft' },
      { code: 'pt', name: 'Portuguese', flag: '🇵🇹', status: 'published' },
      { code: 'nl', name: 'Dutch', flag: '🇳🇱', status: 'scheduled' },
      { code: 'pl', name: 'Polish', flag: '🇵🇱', status: 'draft' },
      { code: 'ja', name: 'Japanese', flag: '🇯🇵', status: 'published' },
      { code: 'ko', name: 'Korean', flag: '🇰🇷', status: 'published' },
      { code: 'zh', name: 'Chinese', flag: '🇨🇳', status: 'published' },
      { code: 'ar', name: 'Arabic', flag: '🇸🇦', status: 'draft' },
      { code: 'ru', name: 'Russian', flag: '🇷🇺', status: 'published' },
      { code: 'hi', name: 'Hindi', flag: '🇮🇳', status: 'draft' },
      { code: 'tr', name: 'Turkish', flag: '🇹🇷', status: 'published' },
      { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', status: 'scheduled' },
      { code: 'th', name: 'Thai', flag: '🇹🇭', status: 'draft' },
      { code: 'id', name: 'Indonesian', flag: '🇮🇩', status: 'published' },
      { code: 'sv', name: 'Swedish', flag: '🇸🇪', status: 'published' },
      { code: 'da', name: 'Danish', flag: '🇩🇰', status: 'draft' },
      { code: 'no', name: 'Norwegian', flag: '🇳🇴', status: 'published' },
      { code: 'fi', name: 'Finnish', flag: '🇫🇮', status: 'scheduled' },
      { code: 'cs', name: 'Czech', flag: '🇨🇿', status: 'draft' },
      { code: 'el', name: 'Greek', flag: '🇬🇷', status: 'published' },
      { code: 'he', name: 'Hebrew', flag: '🇮🇱', status: 'draft' },
    ],
    content: `
## Introduction

In today's rapidly evolving digital landscape, a new frontier has emerged in brand visibility: AI-powered search engines and conversational assistants. As millions of users turn to ChatGPT, Perplexity, Google Gemini, and similar AI platforms to find answers, recommendations, and solutions, brands face both an unprecedented opportunity and a significant challenge.

The question is no longer just "How do we rank on Google?" but increasingly "How do we ensure AI systems recommend our brand when users ask for solutions?" This comprehensive guide will walk you through everything you need to know about AI visibility—what it is, why it matters, and most importantly, how to improve it.

## What Is AI Visibility?

AI visibility refers to how frequently and favorably your brand appears in responses generated by large language models (LLMs) and AI-powered search engines. Unlike traditional SEO, which focuses on ranking in search engine results pages (SERPs), AI visibility is about being part of the AI's "knowledge" and being recommended in conversational responses.

When a user asks ChatGPT "What's the best project management tool for remote teams?" or queries Perplexity about "top CRM platforms for small businesses," the AI draws from its training data and real-time information to formulate a response. Your AI visibility score measures how often your brand appears in these responses, in what context, and with what sentiment.

### The Three Pillars of AI Visibility

**1. Recognition**: Does the AI know your brand exists? This is the foundation—if you're not in the AI's knowledge base, you can't be recommended.

**2. Positioning**: When your brand is mentioned, how is it characterized? Are you positioned as a leader, an alternative, or merely one option among many?

**3. Sentiment**: What tone does the AI use when discussing your brand? Positive associations with quality, innovation, and reliability significantly impact recommendation likelihood.

## Why AI Visibility Matters Now

The shift toward AI-assisted decision-making represents one of the most significant changes in consumer behavior since the advent of mobile search. Consider these trends:

### Changing User Behavior

Users increasingly prefer conversational AI for product research because it provides synthesized, personalized answers rather than lists of links to evaluate. A recent study found that 67% of users who tried AI search continued using it as their primary research method.

### The Trust Factor

AI recommendations carry significant weight. When ChatGPT or Perplexity suggests a product or service, users perceive it as a vetted recommendation from an intelligent, unbiased source. This perceived objectivity makes AI mentions incredibly valuable for brand trust.

### First-Mover Advantage

The brands establishing strong AI visibility now will have a significant advantage as these platforms become more dominant. Like early SEO adopters who built lasting organic traffic, early AI visibility leaders are building brand associations that will be difficult for competitors to displace.

## How AI Systems Form Brand Opinions

Understanding how AI models develop their "opinions" about brands is crucial for improving your visibility. Here's what influences AI recommendations:

### Training Data Sources

Large language models are trained on vast datasets that include:

- **Web content**: Blog posts, articles, product descriptions, and company websites
- **Wikipedia and encyclopedic sources**: Often weighted heavily for factual information
- **News articles**: Particularly from authoritative publications
- **User-generated content**: Reviews, forum discussions, and social media
- **Academic and industry reports**: Research papers and market analyses

### Real-Time Information

Newer AI systems like Perplexity and Google Gemini incorporate real-time web search, meaning your current online presence directly impacts recommendations. This includes:

- Recent news coverage and press releases
- Updated website content and blog posts
- Current social media presence and engagement
- Fresh reviews and testimonials

### Pattern Recognition

AI models identify patterns across their training data. If your brand is consistently mentioned alongside quality, innovation, or specific use cases, these associations strengthen over time.

## Strategies to Improve Your AI Visibility

Now for the actionable part—here's how to systematically improve your brand's AI visibility across major platforms.

### 1. Content Strategy for AI Consumption

**Create Comprehensive, Authoritative Content**

AI models favor content that thoroughly addresses topics. Instead of thin content targeting specific keywords, develop in-depth resources that establish your expertise:

- Detailed guides and tutorials
- Original research and data
- Expert interviews and thought leadership
- Comprehensive product documentation

**Structure for AI Understanding**

Use clear headings, bullet points, and structured data to help AI systems understand and extract information:

- Implement FAQ schema markup
- Use clear, descriptive headings (H1, H2, H3)
- Include summary sections that directly answer common questions
- Add structured product information (specifications, pricing, features)

**Answer Questions Directly**

AI systems often look for direct answers to user queries. Structure some content to directly answer common questions about your industry, products, or services. Start paragraphs with the answer, then provide supporting details.

### 2. Build Authoritative Backlinks and Mentions

**Earn Coverage in Authoritative Publications**

AI models weight authoritative sources heavily. Pursue coverage in:

- Industry-leading publications and blogs
- Major news outlets (for significant announcements)
- Academic or research publications
- Government and institutional websites

**Develop Wikipedia Presence**

Wikipedia is one of the most referenced sources in AI training data. Ensure your brand has accurate Wikipedia coverage (following their guidelines) and that information is current and well-sourced.

**Participate in Industry Research**

Contributing to or sponsoring industry research and reports creates lasting, authoritative mentions that AI systems reference.

### 3. Optimize Your Digital Ecosystem

**Maintain Consistent Brand Information**

Ensure your brand name, descriptions, and key information are consistent across:

- Your website (especially About and Product pages)
- Google Business Profile
- Social media profiles
- Directory listings
- Review platforms

**Keep Information Current**

AI systems that incorporate real-time data prioritize fresh content. Regularly update:

- Product information and pricing
- Company news and announcements
- Blog content and resources
- Case studies and testimonials

### 4. Leverage Reviews and Social Proof

**Encourage Authentic Reviews**

Reviews on platforms like G2, Capterra, Trustpilot, and industry-specific sites contribute to AI understanding of your brand. Focus on:

- Volume: More reviews create stronger signals
- Recency: Recent reviews carry more weight
- Quality: Detailed reviews that mention specific features and use cases
- Sentiment: Overall positive sentiment improves recommendations

**Showcase Customer Success**

Detailed case studies and customer testimonials provide rich, specific content that AI systems can reference when making recommendations.

### 5. Monitor and Measure AI Visibility

**Track Brand Mentions Across AI Platforms**

Regularly query major AI platforms with prompts relevant to your business:

- "What are the best [your category] tools?"
- "Compare [your brand] vs [competitor]"
- "What do people say about [your brand]?"

**Analyze Competitor Visibility**

Understand how competitors appear in AI responses to identify gaps and opportunities in your strategy.

**Measure Sentiment and Positioning**

Track not just whether you're mentioned, but how you're positioned and with what sentiment. Are you recommended as a leader, an alternative, or an afterthought?

## Common Mistakes to Avoid

### Over-Optimizing for Traditional SEO

While SEO and AI visibility overlap, they're not identical. Keyword-stuffed content that ranks well on Google may not translate to AI recommendations. Focus on genuinely helpful, comprehensive content.

### Neglecting Brand Consistency

Inconsistent brand information across platforms confuses AI systems and dilutes your brand signal. Audit and align your digital presence.

### Ignoring Negative Sentiment

AI systems pick up on negative sentiment. Address negative reviews professionally, resolve customer complaints publicly when possible, and proactively manage your online reputation.

### Focusing Only on Text

AI systems increasingly incorporate multimodal data. Ensure your visual content (images, videos, infographics) is properly labeled and described for AI comprehension.

## The Future of AI Visibility

As AI continues to evolve, several trends will shape the future of brand visibility:

**Multimodal AI**: Systems that understand images, video, and audio will require brands to optimize across all content types.

**Personalized Recommendations**: AI will increasingly tailor recommendations to individual users, making broad brand positioning even more important.

**Real-Time Integration**: More AI systems will incorporate real-time data, making ongoing content freshness and reputation management critical.

**Vertical AI Assistants**: Industry-specific AI tools will emerge, requiring specialized visibility strategies for different verticals.

## Conclusion

AI visibility represents a fundamental shift in how consumers discover and evaluate brands. The organizations that recognize this shift and adapt their strategies accordingly will capture disproportionate value as AI becomes the primary interface for information and recommendations.

Start by auditing your current AI visibility across major platforms. Identify gaps in your content, authority, and brand consistency. Then systematically implement the strategies outlined in this guide, measuring progress and adjusting your approach based on results.

The brands that master AI visibility today will be the ones that thrive in tomorrow's AI-first world. The time to start is now.

---

*Want to track your AI visibility across ChatGPT, Perplexity, and Gemini? Our platform provides real-time monitoring and actionable insights to improve your brand's AI presence. [Get started free →]*
    `,
  },
  'content-2': {
    id: 'content-2',
    title: '10 Ways to Improve Your Brand Recognition in AI Search',
    type: 'article',
    status: 'draft',
    author: 'Content Writer',
    publishedAt: null,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-24'),
    readTime: '8 min read',
    articleScore: 72,
    isOptimized: false,
    optimizationMessage: 'Add more internal links and increase word count to 2,500+ words for better optimization.',
    targetKeyword: 'brand recognition ai search',
    searchVolume: 210,
    difficulty: 2,
    wordCount: 1245,
    keywordCount: 8,
    imageCount: 1,
    internalLinks: 0,
    externalLinks: 5,
    slug: '10-ways-improve-brand-recognition-ai-search',
    metaDescription: 'Discover 10 proven strategies to boost your brand\'s recognition in AI-powered search platforms and conversational assistants.',
    content: `
## Draft Content

This article is currently being written. Check back soon for the full content.

### Outline:

1. Create comprehensive, authoritative content
2. Build quality backlinks from reputable sources
3. Maintain consistent brand information
4. Optimize for featured snippets
5. Develop strong Wikipedia presence
6. Encourage customer reviews
7. Publish original research
8. Engage in industry discussions
9. Keep content fresh and updated
10. Monitor and measure your AI visibility
    `,
  },
}

// Locale-specific content for content-1
export const localeContentData: Record<string, Record<string, LocaleContentData>> = {
  'content-1': {
    'en': {
      title: 'The Complete Guide to AI Visibility: How to Get Your Brand Mentioned by ChatGPT, Perplexity, and Gemini',
      targetKeyword: 'ai visibility guide',
      slug: 'complete-guide-ai-visibility-chatgpt-perplexity-gemini',
      metaDescription: 'Learn how to improve your brand\'s visibility in AI-powered search engines like ChatGPT, Perplexity, and Google Gemini. Complete guide with actionable strategies.',
      wordCount: 3899,
      keywordCount: 12,
      content: mockContentData['content-1']?.content || '',
    },
    'es': {
      title: 'La Guía Completa de Visibilidad en IA: Cómo Hacer que ChatGPT, Perplexity y Gemini Mencionen tu Marca',
      targetKeyword: 'guía visibilidad ia',
      slug: 'guia-completa-visibilidad-ia-chatgpt-perplexity-gemini',
      metaDescription: 'Aprende cómo mejorar la visibilidad de tu marca en motores de búsqueda impulsados por IA como ChatGPT, Perplexity y Google Gemini. Guía completa con estrategias prácticas.',
      wordCount: 4150,
      keywordCount: 14,
      content: `
## Introducción

En el panorama digital actual en rápida evolución, ha surgido una nueva frontera en la visibilidad de marca: los motores de búsqueda impulsados por IA y los asistentes conversacionales. A medida que millones de usuarios recurren a ChatGPT, Perplexity, Google Gemini y plataformas de IA similares para encontrar respuestas, recomendaciones y soluciones, las marcas enfrentan tanto una oportunidad sin precedentes como un desafío significativo.

La pregunta ya no es solo "¿Cómo posicionamos en Google?" sino cada vez más "¿Cómo aseguramos que los sistemas de IA recomienden nuestra marca cuando los usuarios buscan soluciones?" Esta guía completa te llevará a través de todo lo que necesitas saber sobre la visibilidad en IA: qué es, por qué importa y, lo más importante, cómo mejorarla.

## ¿Qué es la Visibilidad en IA?

La visibilidad en IA se refiere a la frecuencia y favorabilidad con la que tu marca aparece en las respuestas generadas por grandes modelos de lenguaje (LLMs) y motores de búsqueda impulsados por IA. A diferencia del SEO tradicional, que se centra en el ranking en las páginas de resultados de motores de búsqueda (SERPs), la visibilidad en IA se trata de ser parte del "conocimiento" de la IA y ser recomendado en respuestas conversacionales.

Cuando un usuario pregunta a ChatGPT "¿Cuál es la mejor herramienta de gestión de proyectos para equipos remotos?" o consulta a Perplexity sobre "las mejores plataformas de CRM para pequeñas empresas", la IA extrae de sus datos de entrenamiento e información en tiempo real para formular una respuesta. Tu puntuación de visibilidad en IA mide con qué frecuencia aparece tu marca en estas respuestas, en qué contexto y con qué sentimiento.

### Los Tres Pilares de la Visibilidad en IA

**1. Reconocimiento**: ¿La IA sabe que tu marca existe? Esta es la base: si no estás en la base de conocimientos de la IA, no puedes ser recomendado.

**2. Posicionamiento**: Cuando tu marca es mencionada, ¿cómo se caracteriza? ¿Estás posicionado como líder, una alternativa, o simplemente una opción más entre muchas?

**3. Sentimiento**: ¿Qué tono usa la IA al hablar de tu marca? Las asociaciones positivas con calidad, innovación y confiabilidad impactan significativamente la probabilidad de recomendación.

## Por Qué la Visibilidad en IA Importa Ahora

El cambio hacia la toma de decisiones asistida por IA representa uno de los cambios más significativos en el comportamiento del consumidor desde la llegada de la búsqueda móvil. Considera estas tendencias:

### Comportamiento del Usuario en Evolución

Los usuarios prefieren cada vez más la IA conversacional para la investigación de productos porque proporciona respuestas sintetizadas y personalizadas en lugar de listas de enlaces para evaluar. Un estudio reciente encontró que el 67% de los usuarios que probaron la búsqueda por IA continuaron usándola como su método principal de investigación.

### El Factor Confianza

Las recomendaciones de IA tienen un peso significativo. Cuando ChatGPT o Perplexity sugiere un producto o servicio, los usuarios lo perciben como una recomendación verificada de una fuente inteligente e imparcial. Esta objetividad percibida hace que las menciones de IA sean increíblemente valiosas para la confianza de marca.

### Ventaja del Pionero

Las marcas que establecen una fuerte visibilidad en IA ahora tendrán una ventaja significativa a medida que estas plataformas se vuelvan más dominantes. Como los primeros adoptantes de SEO que construyeron tráfico orgánico duradero, los primeros líderes en visibilidad en IA están construyendo asociaciones de marca que serán difíciles de desplazar para los competidores.

## Estrategias para Mejorar tu Visibilidad en IA

Ahora la parte práctica: aquí está cómo mejorar sistemáticamente la visibilidad de tu marca en IA en las principales plataformas.

### 1. Estrategia de Contenido para Consumo de IA

**Crea Contenido Completo y Autoritativo**

Los modelos de IA favorecen el contenido que aborda los temas de manera exhaustiva. En lugar de contenido superficial dirigido a palabras clave específicas, desarrolla recursos en profundidad que establezcan tu experiencia:

- Guías y tutoriales detallados
- Investigación y datos originales
- Entrevistas con expertos y liderazgo de pensamiento
- Documentación completa del producto

**Estructura para la Comprensión de IA**

Usa encabezados claros, viñetas y datos estructurados para ayudar a los sistemas de IA a entender y extraer información:

- Implementa marcado de esquema FAQ
- Usa encabezados claros y descriptivos (H1, H2, H3)
- Incluye secciones de resumen que respondan directamente a preguntas comunes
- Agrega información estructurada del producto (especificaciones, precios, características)

### 2. Construye Backlinks y Menciones Autoritativas

**Obtén Cobertura en Publicaciones Autoritativas**

Los modelos de IA ponderan fuertemente las fuentes autoritativas. Busca cobertura en:

- Publicaciones y blogs líderes de la industria
- Principales medios de comunicación (para anuncios significativos)
- Publicaciones académicas o de investigación
- Sitios web gubernamentales e institucionales

**Desarrolla Presencia en Wikipedia**

Wikipedia es una de las fuentes más referenciadas en los datos de entrenamiento de IA. Asegúrate de que tu marca tenga cobertura precisa en Wikipedia (siguiendo sus directrices) y que la información esté actualizada y bien documentada.

## Conclusión

La visibilidad en IA representa un cambio fundamental en cómo los consumidores descubren y evalúan marcas. Las organizaciones que reconozcan este cambio y adapten sus estrategias en consecuencia captarán un valor desproporcionado a medida que la IA se convierta en la interfaz principal para información y recomendaciones.

Comienza auditando tu visibilidad actual en IA en las principales plataformas. Identifica brechas en tu contenido, autoridad y consistencia de marca. Luego implementa sistemáticamente las estrategias descritas en esta guía, midiendo el progreso y ajustando tu enfoque según los resultados.

Las marcas que dominen la visibilidad en IA hoy serán las que prosperen en el mundo de IA del mañana. El momento de comenzar es ahora.

---

*¿Quieres rastrear tu visibilidad en IA en ChatGPT, Perplexity y Gemini? Nuestra plataforma proporciona monitoreo en tiempo real e insights accionables para mejorar la presencia de tu marca en IA. [Comienza gratis →]*
      `,
    },
  },
}
