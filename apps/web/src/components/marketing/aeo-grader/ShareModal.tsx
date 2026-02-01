'use client';

import * as React from 'react';
import { Check, Copy, Share2, Award } from 'lucide-react';
import {
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  XIcon,
  FacebookShareButton,
  FacebookIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  PinterestShareButton,
  PinterestIcon
} from 'react-share';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  getLinkedInShareText,
  getTwitterShareText,
  getFacebookShareText,
  getInstagramShareText,
  getTikTokShareText
} from '@/lib/social-share-text';
import { baseURL } from '@/routes';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  domain: string;
  score: number;
}

export function ShareModal({
  open,
  onOpenChange,
  url,
  domain,
  score
}: ShareModalProps): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);
  const [textCopied, setTextCopied] = React.useState<string | null>(null);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Generate OG image URL for Pinterest
  const ogImageUrl = `${baseURL}/api/og/report?domain=${encodeURIComponent(domain)}&score=${score}`;

  const copyToClipboard = async (text: string, identifier?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (identifier) {
        setTextCopied(identifier);
        setTimeout(() => setTextCopied(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyLinkToClipboard = async () => {
    await copyToClipboard(url);
  };

  const copyShareText = (platform: string) => {
    let text = '';
    switch (platform) {
      case 'linkedin':
        text = getLinkedInShareText(domain, score);
        break;
      case 'twitter':
        text = getTwitterShareText(domain, score);
        break;
      case 'facebook':
        text = getFacebookShareText(domain, score);
        break;
      case 'instagram':
        text = getInstagramShareText(domain, score);
        break;
      case 'tiktok':
        text = getTikTokShareText(domain, score);
        break;
    }
    if (text) {
      copyToClipboard(text + '\n\n' + url, platform);
    }
  };

  const shareToInstagram = () => {
    copyShareText('instagram');
    window.open('https://www.instagram.com/', '_blank');
  };

  const shareToTikTok = () => {
    copyShareText('tiktok');
    window.open('https://www.tiktok.com/upload', '_blank');
  };

  const shareToBluesky = () => {
    const text = `${domain} scored ${score}/100 on AI Answer Engine Optimization! 🎯\n\n${url}\n\n#searchfitai #aeo`;
    const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;
    window.open(blueskyUrl, '_blank', 'width=600,height=600');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl">
        <div className="grid md:grid-cols-2">
          {/* Left Column - Share Actions */}
          <div className="p-6 md:p-8">
            <DialogHeader className="space-y-3 text-left">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Share2 className="size-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold">Share Report</DialogTitle>
              <DialogDescription className="text-base">
                Share this AEO performance report with your network.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Copy Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Copy Link</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={url}
                    className="font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyLinkToClipboard}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Share to Social Media</label>
                <p className="text-xs text-muted-foreground">
                  Click to share - text and hashtags copied automatically!
                </p>
                <div className="grid grid-cols-3 gap-3">
                {/* LinkedIn */}
                <div className="flex flex-col items-center gap-1 rounded-md border border-input bg-background px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <LinkedinShareButton
                    url={url}
                    title={getLinkedInShareText(domain, score)}
                    beforeOnClick={() => copyShareText('linkedin')}
                  >
                    <LinkedinIcon size={24} round />
                  </LinkedinShareButton>
                  <span className="text-xs">LinkedIn</span>
                  {textCopied === 'linkedin' && (
                    <Check className="size-3 text-green-500" />
                  )}
                </div>

                {/* Twitter/X */}
                <div className="flex flex-col items-center gap-1 rounded-md border border-input bg-background px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <TwitterShareButton
                    url={url}
                    title={getTwitterShareText(domain, score)}
                  >
                    <XIcon size={24} round />
                  </TwitterShareButton>
                  <span className="text-xs">Twitter</span>
                </div>

                {/* Meta/Facebook */}
                <div className="flex flex-col items-center gap-1 rounded-md border border-input bg-background px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <FacebookShareButton
                    url={url}
                    hashtag="#searchfitai"
                    beforeOnClick={() => copyShareText('facebook')}
                  >
                    <FacebookIcon size={24} round />
                  </FacebookShareButton>
                  <span className="text-xs">Meta</span>
                  {textCopied === 'facebook' && (
                    <Check className="size-3 text-green-500" />
                  )}
                </div>

                <Button
                  variant="outline"
                  className="flex flex-col gap-1 h-auto py-3"
                  onClick={shareToInstagram}
                  title="Share on Instagram"
                >
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="text-xs">Instagram</span>
                  {textCopied === 'instagram' && (
                    <Check className="size-3 text-green-500" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col gap-1 h-auto py-3"
                  onClick={shareToTikTok}
                  title="Share on TikTok"
                >
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                  <span className="text-xs">TikTok</span>
                  {textCopied === 'tiktok' && (
                    <Check className="size-3 text-green-500" />
                  )}
                </Button>

                {/* Reddit */}
                <div className="flex flex-col items-center gap-1 rounded-md border border-input bg-background px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <RedditShareButton
                    url={url}
                    title={`${domain} scored ${score}/100 on AI Answer Engine Optimization (AEO)`}
                  >
                    <RedditIcon size={24} round />
                  </RedditShareButton>
                  <span className="text-xs">Reddit</span>
                </div>

                {/* Telegram */}
                <div className="flex flex-col items-center gap-1 rounded-md border border-input bg-background px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <TelegramShareButton
                    url={url}
                    title={`${domain} scored ${score}/100 on AI Answer Engine Optimization! 🎯 #searchfitai #aeo`}
                  >
                    <TelegramIcon size={24} round />
                  </TelegramShareButton>
                  <span className="text-xs">Telegram</span>
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col items-center gap-1 rounded-md border border-input bg-background px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <WhatsappShareButton
                    url={url}
                    title={`*${domain}* scored *${score}/100* on AI Answer Engine Optimization! 🎯\n\nCheck out the full report:`}
                    separator=" "
                  >
                    <WhatsappIcon size={24} round />
                  </WhatsappShareButton>
                  <span className="text-xs">WhatsApp</span>
                </div>

                {/* Pinterest */}
                <div className="flex flex-col items-center gap-1 rounded-md border border-input bg-background px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <PinterestShareButton
                    url={url}
                    media={ogImageUrl}
                    description={`${domain} scored ${score}/100 on AI Answer Engine Optimization! 🎯 #searchfitai #aeo #AI #SEO`}
                  >
                    <PinterestIcon size={24} round />
                  </PinterestShareButton>
                  <span className="text-xs">Pinterest</span>
                </div>

                {/* Bluesky */}
                <Button
                  variant="outline"
                  className="flex flex-col gap-1 h-auto py-3"
                  onClick={shareToBluesky}
                  title="Share on Bluesky"
                >
                  <div className="size-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
                    </svg>
                  </div>
                  <span className="text-xs">Bluesky</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Why Share */}
        <div className="hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:flex md:flex-col">
          <div className="flex flex-col h-full">
            {/* Icon Section - 70% */}
            <div className="flex-[3.5] flex flex-col items-center justify-center text-center space-y-8">
              <div className="inline-flex size-56 items-center justify-center rounded-full bg-primary/10">
                <Award className="size-32 text-primary" strokeWidth={1.5} />
              </div>
              <h4 className="text-4xl font-bold">
                Share Your Results
              </h4>
            </div>

            {/* Score Section - 30% */}
            <div className="flex-[1.5] flex items-center justify-center">
              <div className="rounded-2xl bg-primary/5 p-8 text-center w-full">
                <p className="text-5xl font-bold mb-2">{score}/100</p>
                <p className="text-sm text-muted-foreground">
                  {domain} • {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
