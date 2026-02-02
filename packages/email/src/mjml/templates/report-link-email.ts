export interface ReportLinkEmailProps {
  firstName: string;
  lastName: string;
  domain: string;
  reportUrl: string;
  appName: string;
  // AEO Scores
  overallScore: number;
  chatGptScore: number;
  perplexityScore: number;
  geminiScore: number;
  // Report metadata
  reportGeneratedDate: string; // e.g., "December 15, 2025"
  // Waitlist URL
  waitlistUrl: string;
}

/**
 * Generate MJML template for report link email
 * Elegant design with rounded edges, borders, and top banner
 */
export function generateReportLinkEmail(props: ReportLinkEmailProps): string {
  const {
    firstName,
    domain,
    reportUrl,
    overallScore,
    chatGptScore,
    perplexityScore,
    geminiScore,
    reportGeneratedDate,
    waitlistUrl
  } = props;

  // Helper function to get score status (monochrome)
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { status: 'Excellent' };
    if (score >= 70) return { status: 'Good' };
    if (score >= 60) return { status: 'Fair' };
    return { status: 'Needs Improvement' };
  };

  const overallStatus = getScoreStatus(overallScore);

  return `
    <mjml>
      <mj-head>
        <mj-title>Your SearchFit Report is Ready</mj-title>
        <mj-preview>Access your comprehensive AEO report for ${domain}</mj-preview>
        <mj-attributes>
          <mj-all font-family="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" />
          <mj-text font-size="15px" color="#374151" line-height="24px" />
        </mj-attributes>
        <mj-style inline="inline">
          .link-button { text-decoration: none; }
          /* Default link colors - white for dark backgrounds */
          a { color: inherit; text-decoration: none; }
          a:visited { color: inherit; }
          a:hover { opacity: 0.8; }
          /* Force span colors to override auto-detected links */
          span { color: inherit !important; }
          strong span { color: inherit !important; }
        </mj-style>
      </mj-head>

      <mj-body background-color="#ffffff">
        <!-- Top Spacer -->
        <mj-section padding="40px 0 20px 0">
          <mj-column></mj-column>
        </mj-section>

        <!-- Unified Card - All Sections Connected -->
        <mj-wrapper padding="0" border="1px solid #e5e5e5" border-radius="16px">
          <!-- Top Banner -->
          <mj-section background-color="#000000" padding="0" border-radius="16px 16px 0 0">
            <mj-column>
              <mj-spacer height="40px" />
              <mj-image src="https://cdn.searchfit.ai/assets/icons/logo.png" alt="SearchFit" width="60px" align="center" padding="0" />
              <mj-text align="center" color="#ffffff" font-size="14px" font-weight="600" padding="8px 0 0 0">
                searchfit.ai
              </mj-text>
              <mj-spacer height="24px" />
              <mj-text align="center" font-size="32px" font-weight="700" color="#ffffff" padding="0 20px" letter-spacing="-0.5px">
                Your Report is Ready
              </mj-text>
              <mj-text align="center" font-size="16px" color="#a3a3a3" padding="10px 20px 0" line-height="24px">
                Comprehensive AEO Analysis for <strong style="color: #ffffff !important;"><span style="color: #ffffff !important;">${domain}</span></strong><br/>
                <span style="font-size: 13px; color: #737373;">Report generated on ${reportGeneratedDate}</span>
              </mj-text>
              <mj-spacer height="40px" />
            </mj-column>
          </mj-section>

          <!-- White Content Section -->
          <mj-section background-color="#ffffff" padding="0">
            <mj-column>
              <mj-spacer height="40px" />

              <!-- Greeting -->
              <mj-text font-size="20px" font-weight="600" color="#000000" padding="0 32px 20px">
                Hi ${firstName}
              </mj-text>

              <!-- Main Message -->
              <mj-text padding="0 32px 20px" color="#525252" line-height="26px">
                Thank you for your interest in SearchFit. We're excited to help your brand grow with AI-powered search optimization.
              </mj-text>

              <mj-text padding="0 32px 32px" color="#525252" line-height="26px">
                Your comprehensive AEO report for <strong style="color: #000000 !important;"><span style="color: #000000 !important;">${domain}</span></strong> is ready. <strong>SearchFit helps you be more visible where search is happening and generate content that ranks in AI search results—at scale.</strong>
              </mj-text>

              <!-- AEO Score Card -->
              <mj-text align="center" font-size="18px" font-weight="600" color="#000000" padding="0 32px 16px">
                Overall AEO Score
              </mj-text>

              <mj-text align="center" padding="0 32px 8px">
                <span style="font-size: 56px; font-weight: 700; color: #000000;">${overallScore}</span>
                <span style="font-size: 24px; color: #737373;">/100</span>
              </mj-text>

              <mj-text align="center" padding="0 32px 24px">
                <span style="display: inline-block; padding: 6px 16px; background-color: #f5f5f5; color: #000000; border: 1px solid #e5e5e5; border-radius: 20px; font-size: 14px; font-weight: 600;">${overallStatus.status}</span>
              </mj-text>

              <!-- Platform Breakdown -->
              <mj-text align="center" font-size="15px" font-weight="600" color="#525252" padding="0 32px 16px">
                Score Breakdown by AI Platform
              </mj-text>

              <mj-table padding="0 32px 32px">
                <tr>
                  <td style="padding: 16px; background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; text-align: center; width: 33.33%;">
                    <img src="https://cdn.searchfit.ai/assets/icons/openai.png" alt="ChatGPT" style="width: 32px; height: 32px; margin: 0 auto 8px; display: block; filter: grayscale(100%);" />
                    <div style="font-size: 11px; color: #737373; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">ChatGPT</div>
                    <div style="font-size: 28px; font-weight: 700; color: #000000;">${chatGptScore}</div>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="padding: 16px; background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; text-align: center; width: 33.33%;">
                    <img src="https://cdn.searchfit.ai/assets/icons/perplexity.png" alt="Perplexity" style="width: 32px; height: 32px; margin: 0 auto 8px; display: block; filter: grayscale(100%);" />
                    <div style="font-size: 11px; color: #737373; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Perplexity</div>
                    <div style="font-size: 28px; font-weight: 700; color: #000000;">${perplexityScore}</div>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="padding: 16px; background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; text-align: center; width: 33.33%;">
                    <img src="https://cdn.searchfit.ai/assets/icons/gemini.png" alt="Gemini" style="width: 32px; height: 32px; margin: 0 auto 8px; display: block; filter: grayscale(100%);" />
                    <div style="font-size: 11px; color: #737373; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Gemini</div>
                    <div style="font-size: 28px; font-weight: 700; color: #000000;">${geminiScore}</div>
                  </td>
                </tr>
              </mj-table>

              <mj-divider border-color="#e5e5e5" border-width="1px" padding="0 32px 32px" />

              <!-- Report Insights Box -->
              <mj-text padding="0 32px 20px" font-size="17px" font-weight="600" color="#000000">
                What's inside your report:
              </mj-text>

              <mj-text padding="0 32px 12px" color="#262626" line-height="26px">
                <strong style="color: #000000;">•</strong> <strong>Visibility Score Analysis</strong><br/>
                <span style="color: #737373; font-size: 14px; margin-left: 14px;">How your brand appears in AI search engines</span>
              </mj-text>

              <mj-text padding="0 32px 12px" color="#262626" line-height="26px">
                <strong style="color: #000000;">•</strong> <strong>Competitive Intelligence</strong><br/>
                <span style="color: #737373; font-size: 14px; margin-left: 14px;">See how you stack up against competitors</span>
              </mj-text>

              <mj-text padding="0 32px 12px" color="#262626" line-height="26px">
                <strong style="color: #000000;">•</strong> <strong>Brand Perception Insights</strong><br/>
                <span style="color: #737373; font-size: 14px; margin-left: 14px;">Understand how AI models perceive your brand</span>
              </mj-text>

              <mj-text padding="0 32px 12px" color="#262626" line-height="26px">
                <strong style="color: #000000;">•</strong> <strong>Strategic Recommendations</strong><br/>
                <span style="color: #737373; font-size: 14px; margin-left: 14px;">Actionable steps to boost your AI visibility</span>
              </mj-text>

              <mj-text padding="0 32px 28px" color="#262626" line-height="26px">
                <strong style="color: #000000;">•</strong> <strong>Content Strategy</strong><br/>
                <span style="color: #737373; font-size: 14px; margin-left: 14px;">AI-powered ideas to rank in search results</span>
              </mj-text>

              <!-- CTA Button -->
              <mj-button
                background-color="#000000"
                color="#ffffff"
                font-size="16px"
                font-weight="600"
                border-radius="8px"
                padding="0 32px"
                inner-padding="16px 36px"
                href="${reportUrl}"
                css-class="link-button"
              >
                View Your Report →
              </mj-button>

              <mj-text align="center" font-size="13px" color="#737373" padding="16px 32px 0" line-height="20px">
                Or copy this link: <a href="${reportUrl}" style="color: #000000 !important; word-break: break-all; text-decoration: underline;">${reportUrl}</a>
              </mj-text>

              <mj-spacer height="40px" />
            </mj-column>
          </mj-section>

          <!-- Divider -->
          <mj-section background-color="#ffffff" padding="0">
            <mj-column>
              <mj-divider border-color="#e5e5e5" border-width="1px" padding="0" />
            </mj-column>
          </mj-section>

          <!-- What You Can Do Next Section -->
          <mj-section background-color="#000000" padding="0">
            <mj-column>
              <mj-spacer height="48px" />

              <mj-text align="center" font-size="13px" font-weight="600" color="#737373" padding="0 40px 12px" letter-spacing="2px">
                NEXT STEPS
              </mj-text>

              <mj-text align="center" font-size="26px" font-weight="600" color="#ffffff" padding="0 40px 20px" line-height="36px">
                Continuous AEO Monitoring
              </mj-text>

              <mj-text align="center" color="#d4d4d4" font-size="15px" padding="0 40px 40px" line-height="26px">
                Transform <strong style="color: #ffffff !important;"><span style="color: #ffffff !important;">${domain}</span></strong> into a tracked project to monitor your visibility trends and maintain your competitive edge.
              </mj-text>

              <!-- Feature List -->
              <mj-table padding="0 40px 0">
                <tr>
                  <td style="padding: 20px 24px; background-color: #0a0a0a; border-top: 1px solid #262626; text-align: left;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="vertical-align: top; width: 24px; padding-right: 16px;">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="20" x2="12" y2="10"></line>
                            <line x1="18" y1="20" x2="18" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="16"></line>
                          </svg>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 6px; letter-spacing: -0.3px;">Real-Time Analytics</div>
                          <div style="font-size: 14px; color: #a3a3a3; line-height: 22px;">Track score fluctuations across all major AI platforms continuously.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </mj-table>

              <mj-table padding="0 40px 0">
                <tr>
                  <td style="padding: 20px 24px; background-color: #0a0a0a; border-top: 1px solid #262626; text-align: left;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="vertical-align: top; width: 24px; padding-right: 16px;">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="6"></circle>
                            <circle cx="12" cy="12" r="2"></circle>
                          </svg>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 6px; letter-spacing: -0.3px;">Competitive Intelligence</div>
                          <div style="font-size: 14px; color: #a3a3a3; line-height: 22px;">Monitor competitor positioning and identify market opportunities.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </mj-table>

              <mj-table padding="0 40px 40px">
                <tr>
                  <td style="padding: 20px 24px; background-color: #0a0a0a; border-top: 1px solid #262626; border-bottom: 1px solid #262626; text-align: left;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="vertical-align: top; width: 24px; padding-right: 16px;">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                          </svg>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 6px; letter-spacing: -0.3px;">Strategic Insights</div>
                          <div style="font-size: 14px; color: #a3a3a3; line-height: 22px;">Receive actionable recommendations to enhance visibility.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </mj-table>

              <mj-button
                background-color="#ffffff"
                color="#000000"
                font-size="15px"
                font-weight="600"
                border-radius="8px"
                inner-padding="16px 32px"
                href="${waitlistUrl}"
              >
                Join Waitlist
              </mj-button>

              <mj-spacer height="48px" />
            </mj-column>
          </mj-section>

          <!-- Divider -->
          <mj-section background-color="#ffffff" padding="0">
            <mj-column>
              <mj-divider border-color="#e5e5e5" border-width="1px" padding="0" />
            </mj-column>
          </mj-section>

          <!-- Why AEO Matters Section -->
          <mj-section background-color="#fafafa" padding="36px 32px">
            <mj-column>
              <mj-text align="center" font-size="22px" font-weight="600" color="#000000" padding-bottom="28px">
                Why growing brands choose searchfit.ai
              </mj-text>

              <!-- Feature 1 -->
              <mj-table padding-bottom="20px">
                <tr>
                  <td style="vertical-align: top; padding-right: 16px; width: 6px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                      <polyline points="17 2 12 7 7 2"></polyline>
                    </svg>
                  </td>
                  <td style="vertical-align: top;">
                    <div style="font-weight: 600; color: #000000; margin-bottom: 4px; font-size: 16px;">AI is reshaping search</div>
                    <div style="color: #525252; font-size: 14px; line-height: 22px;">Over 50% of searches now show AI-generated answers. Your brand needs to be part of the conversation.</div>
                  </td>
                </tr>
              </mj-table>

              <!-- Feature 2 -->
              <mj-table padding-bottom="20px">
                <tr>
                  <td style="vertical-align: top; padding-right: 16px; width: 6px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                  </td>
                  <td style="vertical-align: top;">
                    <div style="font-weight: 600; color: #000000; margin-bottom: 4px; font-size: 16px;">Visibility drives growth</div>
                    <div style="color: #525252; font-size: 14px; line-height: 22px;">Brands mentioned in AI search results get 10x more engagement and authority.</div>
                  </td>
                </tr>
              </mj-table>

              <!-- Feature 3 -->
              <mj-table>
                <tr>
                  <td style="vertical-align: top; padding-right: 16px; width: 6px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </td>
                  <td style="vertical-align: top;">
                    <div style="font-weight: 600; color: #000000; margin-bottom: 4px; font-size: 16px;">Scale your content strategy</div>
                    <div style="color: #525252; font-size: 14px; line-height: 22px;">Generate content that ranks in AI search results—automatically and at scale.</div>
                  </td>
                </tr>
              </mj-table>
            </mj-column>
          </mj-section>

          <!-- Divider -->
          <mj-section background-color="#ffffff" padding="0">
            <mj-column>
              <mj-divider border-color="#e5e5e5" border-width="1px" padding="0" />
            </mj-column>
          </mj-section>

          <!-- Support Section -->
          <mj-section background-color="#ffffff" padding="32px" border-radius="0 0 16px 16px">
            <mj-column>
              <mj-text align="center" color="#525252" padding-bottom="18px" line-height="24px">
                Questions about your report? We'd love to hear from you and help your brand succeed.
              </mj-text>

              <mj-button
                background-color="#ffffff"
                color="#000000"
                font-size="15px"
                font-weight="600"
                border-radius="8px"
                border="2px solid #000000"
                inner-padding="12px 28px"
                href="mailto:support@searchfit.ai"
              >
                Let's Chat
              </mj-button>
            </mj-column>
          </mj-section>

          <!-- Divider -->
          <mj-section background-color="#ffffff" padding="0">
            <mj-column>
              <mj-divider border-color="#e5e5e5" border-width="1px" padding="0" />
            </mj-column>
          </mj-section>

          <!-- Footer -->
          <mj-section background-color="#000000" padding="40px 20px 30px" border-radius="0 0 16px 16px">
            <mj-column>
              <mj-image src="https://cdn.searchfit.ai/assets/icons/logo.png" alt="SearchFit" width="50px" align="center" padding="0 0 8px 0" />

              <mj-text align="center" color="#ffffff" font-size="16px" font-weight="600" padding="0 0 16px 0">
                searchfit.ai
              </mj-text>

              <mj-text align="center" color="#a3a3a3" font-size="14px" padding-bottom="20px" line-height="22px">
                Be more visible where search is happening.<br/>
                Generate content that ranks—at scale.
              </mj-text>

              <!-- Social Media Links -->
              <mj-table padding-bottom="24px">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://www.linkedin.com/company/searchfitai/" style="display: inline-block; margin: 0 12px;">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#ffffff"/>
                      </svg>
                    </a>
                    <a href="https://x.com/searchfitai" style="display: inline-block; margin: 0 12px;">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#ffffff"/>
                      </svg>
                    </a>
                    <a href="https://searchfit.substack.com/" style="display: inline-block; margin: 0 12px;">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" fill="#ffffff"/>
                      </svg>
                    </a>
                  </td>
                </tr>
              </mj-table>

              <mj-divider border-color="#262626" border-width="1px" padding="20px 0" />

              <mj-text align="center" color="#a3a3a3" font-size="12px" line-height="20px" padding-top="4px">
                You're receiving this email because you requested a report for <strong style="color: #ffffff !important;"><span style="color: #ffffff !important;">${domain}</span></strong>.
              </mj-text>

              <mj-text align="center" color="#737373" font-size="11px" line-height="18px" padding-top="16px">
                <strong style="color: #a3a3a3;">Disclaimer:</strong> This report is generated using AI technology. While we strive for accuracy, AI can make mistakes and we cannot guarantee exact numbers. Please use this report as a guide for insights and trends.
              </mj-text>

              <mj-text align="center" color="#737373" font-size="11px" padding-top="12px">
                © ${new Date().getFullYear()} searchfit.ai. All rights reserved.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>

        <!-- Final Spacer -->
        <mj-section padding="40px 0">
          <mj-column></mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `.trim();
}
