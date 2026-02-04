import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { APP_NAME } from '@workspace/common';

export const runtime = 'nodejs'; // Changed from edge to support fs

/**
 * Generate dynamic Open Graph image for report pages
 * Shows domain name and AEO score in a visually appealing format
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || 'example.com';
    const score = parseInt(searchParams.get('score') || '0', 10);

    // Get individual provider scores
    const chatgptScore = parseInt(
      searchParams.get('chatgpt') || score.toString(),
      10
    );
    const perplexityScore = parseInt(
      searchParams.get('perplexity') || score.toString(),
      10
    );
    const geminiScore = parseInt(
      searchParams.get('gemini') || score.toString(),
      10
    );

    // Get date (use current date if not provided)
    const dateParam = searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // Load local Inter fonts
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');

    const [fontRegular, fontBold] = await Promise.all([
      readFile(
        join(process.cwd(), 'public/fonts/Inter/static/Inter_18pt-Regular.ttf')
      ),
      readFile(
        join(process.cwd(), 'public/fonts/Inter/static/Inter_18pt-Bold.ttf')
      ),
    ]);

    // Determine score category (classy monochrome theme)
    const getScoreInfo = (score: number) => {
      if (score >= 80) {
        return { label: 'Excellent' };
      } else if (score >= 70) {
        return { label: 'Good' };
      } else if (score >= 60) {
        return { label: 'Fair' };
      } else {
        return { label: 'Needs Improvement' };
      }
    };

    const scoreInfo = getScoreInfo(score);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            position: 'relative',
          }}
        >
          {/* 2-Column Grid Layout */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
            }}
          >
            {/* LEFT COLUMN - SearchFit Branding */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                backgroundColor: '#000000',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                gap: '32px',
              }}
            >
              {/* Logo */}
              <img
                src="https://cdn.searchfit.ai/assets/icons/logo.png"
                width="100"
                height="100"
                alt="SearchFit Logo"
              />

              {/* Brand Name - Smaller */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#a3a3a3',
                  letterSpacing: '0.5px',
                }}
              >
                searchfit.ai
              </div>

              {/* Divider Line */}
              <div
                style={{
                  display: 'flex',
                  width: '80px',
                  height: '2px',
                  backgroundColor: '#404040',
                }}
              />

              {/* Report Title */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '26px',
                  fontWeight: '600',
                  color: '#ffffff',
                  textAlign: 'center',
                  maxWidth: '380px',
                  lineHeight: '1.3',
                }}
              >
                AEO Performance Report
              </div>

              {/* Domain - More Visible */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '32px',
                  color: '#ffffff',
                  fontWeight: '700',
                  textAlign: 'center',
                  maxWidth: '420px',
                  lineHeight: '1.2',
                  letterSpacing: '-0.5px',
                }}
              >
                {domain}
              </div>

              {/* Date Generated */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '16px',
                  color: '#737373',
                  fontWeight: '500',
                  marginTop: '8px',
                }}
              >
                Generated {formattedDate}
              </div>
            </div>

            {/* RIGHT COLUMN - Score & Providers */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                backgroundColor: '#ffffff',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                gap: '50px',
              }}
            >
              {/* Score Section */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#525252',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  AEO Score
                </div>

                {/* Single Score Display */}
                <div
                  style={{
                    display: 'flex',
                    fontSize: '140px',
                    fontWeight: '800',
                    color: '#000000',
                    lineHeight: '1',
                    letterSpacing: '-4px',
                  }}
                >
                  {score}
                </div>

                {/* Status Badge */}
                <div
                  style={{
                    display: 'flex',
                    padding: '12px 32px',
                    backgroundColor: '#f5f5f5',
                    border: '2px solid #e5e5e5',
                    borderRadius: '30px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#000000',
                  }}
                >
                  {scoreInfo.label}
                </div>
              </div>

              {/* Provider Logos & Scores Section */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#737373',
                    letterSpacing: '0.5px',
                  }}
                >
                  Analyzed Across
                </div>

                {/* 3 Providers with Scores */}
                <div
                  style={{
                    display: 'flex',
                    gap: '40px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* ChatGPT */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <img
                      src="https://cdn.searchfit.ai/assets/icons/openai.png"
                      width="56"
                      height="56"
                      alt="ChatGPT"
                    />
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#000000',
                        letterSpacing: '-1px',
                      }}
                    >
                      {chatgptScore}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#737373',
                      }}
                    >
                      ChatGPT
                    </div>
                  </div>

                  {/* Perplexity */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <img
                      src="https://cdn.searchfit.ai/assets/icons/perplexity.png"
                      width="56"
                      height="56"
                      alt="Perplexity"
                    />
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#000000',
                        letterSpacing: '-1px',
                      }}
                    >
                      {perplexityScore}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#737373',
                      }}
                    >
                      Perplexity
                    </div>
                  </div>

                  {/* Gemini */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <img
                      src="https://cdn.searchfit.ai/assets/icons/gemini.png"
                      width="56"
                      height="56"
                      alt="Gemini"
                    />
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#000000',
                        letterSpacing: '-1px',
                      }}
                    >
                      {geminiScore}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#737373',
                      }}
                    >
                      Gemini
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Divider Line */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: '#e5e5e5',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontRegular,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter',
            data: fontBold,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);

    // Fallback error image (simple, no fonts needed)
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          {APP_NAME}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
