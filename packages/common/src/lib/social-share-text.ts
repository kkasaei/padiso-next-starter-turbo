/**
 * Generate social media share text with proper formatting and hashtags
 *
 * Rules:
 * - Always include #searchfitai #aeo
 * - Add up to 3 more relevant hashtags (max 5 total)
 * - Tailor text for each platform's best practices
 */

interface ShareTextOptions {
  domain: string;
  score: number;
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'email';
}

/**
 * Get relevant hashtags based on score
 */
function getRelevantHashtags(score: number): string[] {
  const baseHashtags = ['searchfitai', 'aeo'];

  // Add score-based hashtags
  if (score >= 80) {
    return [...baseHashtags, 'aiseo', 'digitalmarketing', 'seotools'];
  } else if (score >= 60) {
    return [...baseHashtags, 'seostrategy', 'contentmarketing', 'aisearch'];
  } else {
    return [...baseHashtags, 'seoaudit', 'webperformance', 'aisearch'];
  }
}

/**
 * Generate share text for LinkedIn
 * LinkedIn allows longer posts and professional tone
 */
export function getLinkedInShareText(domain: string, score: number): string {
  const hashtags = getRelevantHashtags(score).map(tag => `#${tag}`).join(' ');

  if (score >= 80) {
    return `🎯 Impressive! ${domain} scored ${score}/100 on AI Answer Engine Optimization!

This site is performing excellently across ChatGPT, Perplexity, and other AI search engines.

Want to see how your site performs in the age of AI search? Get your free AEO report now! 👇

${hashtags}`;
  } else if (score >= 60) {
    return `📊 ${domain} scored ${score}/100 on AI Answer Engine Optimization

Solid performance across ChatGPT, Perplexity, and other AI search engines, with room for optimization.

Curious about your site's visibility in AI search? Get your free AEO report! 👇

${hashtags}`;
  } else {
    return `🔍 ${domain} scored ${score}/100 on AI Answer Engine Optimization

There's significant opportunity to improve visibility across ChatGPT, Perplexity, and other AI search engines.

Ready to optimize for AI search? Get your free AEO report now! 👇

${hashtags}`;
  }
}

/**
 * Generate share text for Twitter/X
 * Twitter has 280 char limit, keep it concise
 */
export function getTwitterShareText(domain: string, score: number): string {
  const hashtags = getRelevantHashtags(score).slice(0, 5).map(tag => `#${tag}`).join(' ');

  if (score >= 80) {
    return `🎯 ${domain} scored ${score}/100 on AEO! Excellent AI search visibility across ChatGPT & Perplexity. via @SearchFit

${hashtags}`;
  } else if (score >= 60) {
    return `📊 ${domain} scored ${score}/100 on AEO. Good AI search performance with optimization opportunities. via @SearchFit

${hashtags}`;
  } else {
    return `🔍 ${domain} scored ${score}/100 on AEO. Big opportunity to improve AI search visibility! via @SearchFit

${hashtags}`;
  }
}

/**
 * Generate share text for Facebook
 * Facebook allows longer posts, conversational tone
 */
export function getFacebookShareText(domain: string, score: number): string {
  const hashtags = getRelevantHashtags(score).map(tag => `#${tag}`).join(' ');

  if (score >= 80) {
    return `🎯 Just checked ${domain}'s AI Answer Engine Optimization score - an impressive ${score}/100!

The site is performing excellently across ChatGPT, Perplexity, and other AI search engines.

Want to see how your website ranks in the new era of AI search? Get your free report! 👇

${hashtags}`;
  } else if (score >= 60) {
    return `📊 Interesting! ${domain} scored ${score}/100 on AI Answer Engine Optimization.

Solid performance across AI search engines like ChatGPT and Perplexity, with some room for improvement.

Curious about your site's AI search visibility? Check out the free AEO report tool! 👇

${hashtags}`;
  } else {
    return `🔍 ${domain} scored ${score}/100 on AI Answer Engine Optimization.

There's a big opportunity here to improve visibility across ChatGPT, Perplexity, and other AI search engines!

Want to optimize your site for AI search? Get your free report now! 👇

${hashtags}`;
  }
}

/**
 * Generate share text for Instagram
 * Instagram caption style, emoji-rich, engaging
 */
export function getInstagramShareText(domain: string, score: number): string {
  const hashtags = getRelevantHashtags(score).map(tag => `#${tag}`).join(' ');

  if (score >= 80) {
    return `🎯✨ ${domain} is crushing it with a ${score}/100 AEO score!

Amazing visibility across:
✅ ChatGPT
✅ Perplexity
✅ Other AI search engines

Want to know how YOUR site performs in AI search?
🔗 Link in bio for free AEO report!

${hashtags}`;
  } else if (score >= 60) {
    return `📊 ${domain} scored ${score}/100 on AI Answer Engine Optimization

Good performance with room to grow! 📈

Check across:
• ChatGPT
• Perplexity
• More AI engines

🔗 Get your free AEO report (link in bio)

${hashtags}`;
  } else {
    return `🔍 ${domain} scored ${score}/100 on AEO

HUGE opportunity to boost AI search visibility! 🚀

Optimize for:
• ChatGPT 🤖
• Perplexity 🔮
• AI search engines

🔗 Free report in bio!

${hashtags}`;
  }
}

/**
 * Generate share text for TikTok
 * TikTok style: short, punchy, trending format
 */
export function getTikTokShareText(domain: string, score: number): string {
  const hashtags = getRelevantHashtags(score).map(tag => `#${tag}`).join(' ');

  if (score >= 80) {
    return `🎯 ${score}/100 AEO Score Alert!

${domain} is DOMINATING AI search 🔥

ChatGPT ✅
Perplexity ✅
AI Engines ✅

Want YOUR score? 👇
Link in bio for free report!

${hashtags} #aitools #tech #marketing`;
  } else if (score >= 60) {
    return `📊 ${domain} got ${score}/100 on AEO

Not bad but could be better! 📈

Check your AI search visibility:
• ChatGPT
• Perplexity
• More

Free report link in bio! 🔗

${hashtags} #aitools #seo #marketing`;
  } else {
    return `🔍 ${domain} scored ${score}/100 on AEO

Time to level up that AI search game! 🚀

Get optimized for:
ChatGPT 🤖
Perplexity 🔮
AI search

Free report in bio! 👇

${hashtags} #aitools #seotips #growth`;
  }
}

/**
 * Generate email subject and body
 */
export function getEmailShareText(domain: string, score: number): { subject: string; body: string } {
  const subject = `${domain} - AEO Performance Report (Score: ${score}/100)`;

  let body: string;

  if (score >= 80) {
    body = `Hi there,

I thought you'd be interested in this AI Answer Engine Optimization report for ${domain}.

🎯 Score: ${score}/100 - Excellent Performance!

${domain} is performing excellently across ChatGPT, Perplexity, and other AI search engines. This is a great example of strong AI search visibility.

Check out the full report to see the detailed breakdown across all major AI platforms.

Want to analyze your own site's performance? You can get a free AEO report at the same link!

Best regards`;
  } else if (score >= 60) {
    body = `Hi there,

I wanted to share this AI Answer Engine Optimization report for ${domain}.

📊 Score: ${score}/100 - Good Performance

${domain} shows solid performance across ChatGPT, Perplexity, and other AI search engines, with some interesting opportunities for optimization.

View the full report to see detailed insights and recommendations.

Curious about your own site's AI search visibility? Get a free AEO report at the same link!

Best regards`;
  } else {
    body = `Hi there,

I came across this interesting AI Answer Engine Optimization report for ${domain}.

🔍 Score: ${score}/100 - Optimization Opportunity

There's significant potential to improve ${domain}'s visibility across ChatGPT, Perplexity, and other AI search engines.

Check out the full report for specific recommendations and insights.

Want to see how your site performs? You can get a free AEO report at the same link!

Best regards`;
  }

  return { subject, body };
}

/**
 * Main function to get share text for any platform
 */
export function getShareText(options: ShareTextOptions): string | { subject: string; body: string } {
  const { domain, score, platform } = options;

  switch (platform) {
    case 'linkedin':
      return getLinkedInShareText(domain, score);
    case 'twitter':
      return getTwitterShareText(domain, score);
    case 'facebook':
      return getFacebookShareText(domain, score);
    case 'instagram':
      return getInstagramShareText(domain, score);
    case 'tiktok':
      return getTikTokShareText(domain, score);
    case 'email':
      return getEmailShareText(domain, score);
    default:
      return getLinkedInShareText(domain, score);
  }
}

