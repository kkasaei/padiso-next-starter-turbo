import { StyleSheet } from '@react-pdf/renderer';

/**
 * PDF Styles for AEO Report - SearchFit Design System
 * Matches the exact format from SerchFIT.io based report.pdf
 */

export const colors = {
  // Brand colors - Purple/Indigo theme
  primary: '#6366F1', // Indigo-500
  primaryDark: '#4F46E5', // Indigo-600

  // Text colors
  text: '#000000', // Pure black for main text
  textGray: '#64748B', // Slate-500

  // Background
  white: '#FFFFFF',
  backgroundCurves: '#E2E8F0', // Light gray for decorative curves
};

export const pdfStyles = StyleSheet.create({
  // ===== PAGE LAYOUTS =====
  page: {
    width: 1280,
    height: 720,
    backgroundColor: colors.white,
    fontFamily: 'Helvetica',
    position: 'relative',
  },

  // ===== DECORATIVE CURVES =====
  curvesContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 600,
    overflow: 'hidden',
  },

  // ===== COVER PAGE =====
  coverPage: {
    paddingHorizontal: 80,
    paddingVertical: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },

  coverTitle: {
    fontSize: 80,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    marginBottom: 40,
    letterSpacing: -2,
  },

  coverSubtitle: {
    fontSize: 32,
    fontFamily: 'Helvetica',
    color: colors.text,
    marginBottom: 8,
  },

  coverFooter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    border: `4pt solid ${colors.primary}`,
  },

  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
  },

  profileName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    marginBottom: 4,
  },

  profileTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    marginBottom: 12,
  },

  profileContact: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    marginBottom: 2,
  },

  reportId: {
    position: 'absolute',
    bottom: 10,
    left: 80,
    fontSize: 12,
    color: colors.textGray,
  },

  // ===== CONTENT PAGES =====
  contentPage: {
    paddingHorizontal: 80,
    paddingVertical: 60,
  },

  sectionName: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: colors.primary,
    marginBottom: 20,
  },

  pageTitle: {
    fontSize: 64,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    marginBottom: 24,
    letterSpacing: -1,
  },

  description: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: colors.text,
    lineHeight: 1.6,
    marginBottom: 32,
  },

  // ===== CONTACT/CTA PAGE =====
  contactPage: {
    paddingHorizontal: 80,
    paddingVertical: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contactHeader: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },

  contactTitle: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    marginBottom: 60,
    textAlign: 'center',
  },

  contactProfileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    border: `5pt solid ${colors.primary}`,
    marginBottom: 24,
  },

  contactName: {
    fontSize: 32,
    fontFamily: 'Helvetica',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },

  contactPosition: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },

  contactDetails: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },

  // ===== THANK YOU PAGE =====
  thankYouPage: {
    paddingHorizontal: 80,
    paddingVertical: 200,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  thankYouText: {
    fontSize: 120,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    letterSpacing: -3,
  },

  // ===== CONTENT SECTIONS =====
  contentSection: {
    marginBottom: 32,
  },

  contentText: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: colors.text,
    lineHeight: 1.8,
    marginBottom: 12,
  },

  contentList: {
    marginTop: 16,
    marginBottom: 16,
  },

  contentListItem: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: colors.text,
    lineHeight: 1.8,
    marginBottom: 8,
    paddingLeft: 20,
  },

  // ===== SCORE CARDS =====
  scoreCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },

  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreValue: {
    fontSize: 40,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },

  scoreInfo: {
    display: 'flex',
    flexDirection: 'column',
  },

  scoreLabel: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    marginBottom: 4,
  },

  scoreDescription: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: colors.textGray,
  },
});
