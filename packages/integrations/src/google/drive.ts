/**
 * Google Drive Service
 *
 * Handles Google Drive API interactions for:
 * - Creating folders
 * - Listing files/folders
 * - Uploading files
 * - Downloading files
 * - Creating Google Docs
 */

import { google, drive_v3 } from 'googleapis';
import { createAuthenticatedClient, type AuthenticatedClientOptions } from './oauth';
import type { DriveFolderDto, DriveFileDto } from '../types/integration-dto';

// ============================================================
// TYPES
// ============================================================

export interface CreateFolderOptions {
  name: string;
  parentId?: string;
  description?: string;
}

export interface ListFilesOptions {
  folderId?: string;
  mimeType?: string;
  query?: string;
  pageSize?: number;
  pageToken?: string;
  orderBy?: string;
}

export interface UploadFileOptions {
  name: string;
  content: string | Buffer;
  mimeType: string;
  folderId?: string;
  description?: string;
  convert?: boolean; // Convert to Google Doc format
}

export interface CreateDocOptions {
  title: string;
  content?: string;
  folderId?: string;
}

// ============================================================
// DRIVE CLIENT
// ============================================================

/** Create Drive client */
export function createDriveClient(authOptions: AuthenticatedClientOptions) {
  const auth = createAuthenticatedClient(authOptions);
  return google.drive({ version: 'v3', auth });
}

// ============================================================
// FOLDER OPERATIONS
// ============================================================

/** Create a folder in Drive */
export async function createFolder(
  authOptions: AuthenticatedClientOptions,
  options: CreateFolderOptions
): Promise<DriveFolderDto> {
  const drive = createDriveClient(authOptions);

  const fileMetadata: drive_v3.Schema$File = {
    name: options.name,
    mimeType: 'application/vnd.google-apps.folder',
    description: options.description,
  };

  if (options.parentId) {
    fileMetadata.parents = [options.parentId];
  }

  const { data } = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, webViewLink',
  });

  return {
    id: data.id || '',
    name: data.name || options.name,
    webViewLink: data.webViewLink || undefined,
  };
}

/** Get or create SearchFit folder */
export async function getOrCreateSearchFitFolder(
  authOptions: AuthenticatedClientOptions,
  folderName: string = 'SearchFit'
): Promise<DriveFolderDto> {
  const drive = createDriveClient(authOptions);

  // Check if folder already exists
  const { data } = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name, webViewLink)',
    pageSize: 1,
  });

  if (data.files && data.files.length > 0) {
    const existing = data.files[0];
    return {
      id: existing.id || '',
      name: existing.name || folderName,
      webViewLink: existing.webViewLink || undefined,
    };
  }

  // Create new folder
  return createFolder(authOptions, { name: folderName });
}

/** Get folder by ID */
export async function getFolder(
  authOptions: AuthenticatedClientOptions,
  folderId: string
): Promise<DriveFolderDto | null> {
  const drive = createDriveClient(authOptions);

  try {
    const { data } = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, webViewLink',
    });

    return {
      id: data.id || folderId,
      name: data.name || '',
      webViewLink: data.webViewLink || undefined,
    };
  } catch {
    return null;
  }
}

// ============================================================
// FILE OPERATIONS
// ============================================================

/** List files in a folder */
export async function listFiles(
  authOptions: AuthenticatedClientOptions,
  options: ListFilesOptions = {}
): Promise<{ files: DriveFileDto[]; nextPageToken?: string }> {
  const drive = createDriveClient(authOptions);

  // Build query
  const queryParts: string[] = ['trashed=false'];

  if (options.folderId) {
    queryParts.push(`'${options.folderId}' in parents`);
  }

  if (options.mimeType) {
    queryParts.push(`mimeType='${options.mimeType}'`);
  }

  if (options.query) {
    queryParts.push(`name contains '${options.query}'`);
  }

  const { data } = await drive.files.list({
    q: queryParts.join(' and '),
    fields: 'nextPageToken, files(id, name, mimeType, webViewLink, iconLink, createdTime, modifiedTime)',
    pageSize: options.pageSize || 50,
    pageToken: options.pageToken,
    orderBy: options.orderBy || 'modifiedTime desc',
  });

  const files: DriveFileDto[] = (data.files || []).map((file) => ({
    id: file.id || '',
    name: file.name || '',
    mimeType: file.mimeType || '',
    webViewLink: file.webViewLink || undefined,
    iconLink: file.iconLink || undefined,
    createdTime: file.createdTime || undefined,
    modifiedTime: file.modifiedTime || undefined,
  }));

  return {
    files,
    nextPageToken: data.nextPageToken || undefined,
  };
}

/** Upload a file to Drive */
export async function uploadFile(
  authOptions: AuthenticatedClientOptions,
  options: UploadFileOptions
): Promise<DriveFileDto> {
  const drive = createDriveClient(authOptions);

  const fileMetadata: drive_v3.Schema$File = {
    name: options.name,
    description: options.description,
  };

  if (options.folderId) {
    fileMetadata.parents = [options.folderId];
  }

  // Determine if we should convert to Google format
  let uploadMimeType = options.mimeType;
  if (options.convert) {
    // Map common formats to Google formats
    if (options.mimeType === 'text/markdown' || options.mimeType === 'text/plain') {
      fileMetadata.mimeType = 'application/vnd.google-apps.document';
    }
  }

  const media = {
    mimeType: uploadMimeType,
    body: typeof options.content === 'string' 
      ? options.content 
      : options.content,
  };

  const { data } = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, mimeType, webViewLink, iconLink, createdTime, modifiedTime',
  });

  return {
    id: data.id || '',
    name: data.name || options.name,
    mimeType: data.mimeType || options.mimeType,
    webViewLink: data.webViewLink || undefined,
    iconLink: data.iconLink || undefined,
    createdTime: data.createdTime || undefined,
    modifiedTime: data.modifiedTime || undefined,
  };
}

/** Download file content */
export async function downloadFile(
  authOptions: AuthenticatedClientOptions,
  fileId: string,
  exportMimeType?: string
): Promise<string> {
  const drive = createDriveClient(authOptions);

  // If export mime type specified, export (for Google Docs)
  if (exportMimeType) {
    const { data } = await drive.files.export({
      fileId,
      mimeType: exportMimeType,
    });
    return data as string;
  }

  // Otherwise, get file content directly
  const { data } = await drive.files.get({
    fileId,
    alt: 'media',
  });

  return data as string;
}

/** Get file metadata */
export async function getFile(
  authOptions: AuthenticatedClientOptions,
  fileId: string
): Promise<DriveFileDto | null> {
  const drive = createDriveClient(authOptions);

  try {
    const { data } = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, webViewLink, iconLink, createdTime, modifiedTime',
    });

    return {
      id: data.id || fileId,
      name: data.name || '',
      mimeType: data.mimeType || '',
      webViewLink: data.webViewLink || undefined,
      iconLink: data.iconLink || undefined,
      createdTime: data.createdTime || undefined,
      modifiedTime: data.modifiedTime || undefined,
    };
  } catch {
    return null;
  }
}

/** Delete file */
export async function deleteFile(
  authOptions: AuthenticatedClientOptions,
  fileId: string
): Promise<void> {
  const drive = createDriveClient(authOptions);
  await drive.files.delete({ fileId });
}

/** Move file to trash */
export async function trashFile(
  authOptions: AuthenticatedClientOptions,
  fileId: string
): Promise<void> {
  const drive = createDriveClient(authOptions);
  await drive.files.update({
    fileId,
    requestBody: { trashed: true },
  });
}

// ============================================================
// GOOGLE DOCS SPECIFIC
// ============================================================

/** Create a new Google Doc */
export async function createGoogleDoc(
  authOptions: AuthenticatedClientOptions,
  options: CreateDocOptions
): Promise<DriveFileDto> {
  const drive = createDriveClient(authOptions);

  const fileMetadata: drive_v3.Schema$File = {
    name: options.title,
    mimeType: 'application/vnd.google-apps.document',
  };

  if (options.folderId) {
    fileMetadata.parents = [options.folderId];
  }

  // Create empty doc first
  const { data } = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, mimeType, webViewLink, iconLink, createdTime, modifiedTime',
  });

  const doc: DriveFileDto = {
    id: data.id || '',
    name: data.name || options.title,
    mimeType: data.mimeType || 'application/vnd.google-apps.document',
    webViewLink: data.webViewLink || undefined,
    iconLink: data.iconLink || undefined,
    createdTime: data.createdTime || undefined,
    modifiedTime: data.modifiedTime || undefined,
  };

  // If content provided, update the doc
  if (options.content && data.id) {
    await updateGoogleDocContent(authOptions, data.id, options.content);
  }

  return doc;
}

/** Update Google Doc content with proper formatting (using Docs API) */
export async function updateGoogleDocContent(
  authOptions: AuthenticatedClientOptions,
  documentId: string,
  content: string
): Promise<void> {
  const auth = createAuthenticatedClient(authOptions);
  const docs = google.docs({ version: 'v1', auth });

  // First, get current document to find end index
  const { data: doc } = await docs.documents.get({ documentId });
  const endIndex = doc.body?.content?.reduce((max, element) => {
    return Math.max(max, element.endIndex || 0);
  }, 1) || 1;

  // Delete existing content (except the required newline at index 1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requests: any[] = [];

  if (endIndex > 2) {
    requests.push({
      deleteContentRange: {
        range: {
          startIndex: 1,
          endIndex: endIndex - 1,
        },
      },
    });
  }

  // Parse markdown and convert to Google Docs formatting
  const { plainText, formattingRequests } = parseMarkdownForGoogleDocs(content);

  // Insert plain text first
  requests.push({
    insertText: {
      location: { index: 1 },
      text: plainText,
    },
  });

  // Execute text insertion first
  await docs.documents.batchUpdate({
    documentId,
    requestBody: { requests },
  });

  // Now apply formatting in a separate batch
  if (formattingRequests.length > 0) {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests: formattingRequests },
    });
  }
}

// ============================================================
// MARKDOWN TO GOOGLE DOCS FORMATTING
// ============================================================

interface FormattingRequest {
  updateParagraphStyle?: {
    paragraphStyle: {
      namedStyleType: string;
    };
    range: { startIndex: number; endIndex: number };
    fields: string;
  };
  updateTextStyle?: {
    textStyle: {
      bold?: boolean;
      italic?: boolean;
      strikethrough?: boolean;
      underline?: boolean;
    };
    range: { startIndex: number; endIndex: number };
    fields: string;
  };
  createParagraphBullets?: {
    range: { startIndex: number; endIndex: number };
    bulletPreset: string;
  };
}

interface ParsedMarkdown {
  plainText: string;
  formattingRequests: FormattingRequest[];
}

/**
 * Parse markdown content and generate Google Docs formatting requests
 */
function parseMarkdownForGoogleDocs(markdown: string): ParsedMarkdown {
  const lines = markdown.split('\n');
  const formattingRequests: FormattingRequest[] = [];
  let plainTextLines: string[] = [];
  let currentIndex = 1; // Google Docs starts at index 1
  
  // Track bullet list ranges for batch bullet creation
  const bulletRanges: Array<{ start: number; end: number; ordered: boolean }> = [];
  let currentBulletStart: number | null = null;
  let currentBulletOrdered: boolean | null = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const lineStartIndex = currentIndex;
    
    // Check for headings
    const h1Match = line.match(/^# (.+)$/);
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);
    const h4Match = line.match(/^#### (.+)$/);
    
    // Check for lists
    const bulletMatch = line.match(/^[-*] (.+)$/);
    const numberedMatch = line.match(/^\d+\. (.+)$/);
    
    // Check for blockquote
    const blockquoteMatch = line.match(/^> (.+)$/);
    
    let processedLine = line;
    let headingStyle: string | null = null;
    let isBullet = false;
    let isOrdered = false;
    
    if (h1Match) {
      processedLine = h1Match[1];
      headingStyle = 'HEADING_1';
    } else if (h2Match) {
      processedLine = h2Match[1];
      headingStyle = 'HEADING_2';
    } else if (h3Match) {
      processedLine = h3Match[1];
      headingStyle = 'HEADING_3';
    } else if (h4Match) {
      processedLine = h4Match[1];
      headingStyle = 'HEADING_4';
    } else if (bulletMatch) {
      processedLine = bulletMatch[1];
      isBullet = true;
    } else if (numberedMatch) {
      processedLine = numberedMatch[1];
      isBullet = true;
      isOrdered = true;
    } else if (blockquoteMatch) {
      processedLine = blockquoteMatch[1];
    }
    
    // Process inline formatting (bold, italic) and get plain text
    const { text: cleanText, inlineFormats } = processInlineFormatting(processedLine, lineStartIndex);
    processedLine = cleanText;
    
    // Add inline formatting requests
    formattingRequests.push(...inlineFormats);
    
    // Add the line (with newline)
    const lineWithNewline = processedLine + '\n';
    plainTextLines.push(lineWithNewline);
    const lineEndIndex = currentIndex + lineWithNewline.length;
    
    // Add heading style if applicable
    if (headingStyle) {
      formattingRequests.push({
        updateParagraphStyle: {
          paragraphStyle: {
            namedStyleType: headingStyle,
          },
          range: {
            startIndex: lineStartIndex,
            endIndex: lineEndIndex - 1, // Don't include the newline
          },
          fields: 'namedStyleType',
        },
      });
    }
    
    // Track bullet ranges
    if (isBullet) {
      if (currentBulletStart === null || currentBulletOrdered !== isOrdered) {
        // Start new bullet range
        if (currentBulletStart !== null) {
          bulletRanges.push({
            start: currentBulletStart,
            end: lineStartIndex - 1,
            ordered: currentBulletOrdered!,
          });
        }
        currentBulletStart = lineStartIndex;
        currentBulletOrdered = isOrdered;
      }
    } else if (currentBulletStart !== null) {
      // End bullet range
      bulletRanges.push({
        start: currentBulletStart,
        end: lineStartIndex - 1,
        ordered: currentBulletOrdered!,
      });
      currentBulletStart = null;
      currentBulletOrdered = null;
    }
    
    currentIndex = lineEndIndex;
  }
  
  // Close any remaining bullet range
  if (currentBulletStart !== null) {
    bulletRanges.push({
      start: currentBulletStart,
      end: currentIndex - 1,
      ordered: currentBulletOrdered!,
    });
  }
  
  // Add bullet formatting requests
  for (const range of bulletRanges) {
    formattingRequests.push({
      createParagraphBullets: {
        range: {
          startIndex: range.start,
          endIndex: range.end,
        },
        bulletPreset: range.ordered ? 'NUMBERED_DECIMAL_NESTED' : 'BULLET_DISC_CIRCLE_SQUARE',
      },
    });
  }
  
  return {
    plainText: plainTextLines.join(''),
    formattingRequests,
  };
}

interface InlineFormat {
  updateTextStyle: {
    textStyle: {
      bold?: boolean;
      italic?: boolean;
      strikethrough?: boolean;
      link?: { url: string };
    };
    range: { startIndex: number; endIndex: number };
    fields: string;
  };
}

/**
 * Process inline formatting (bold, italic, etc.) and return clean text + formatting requests
 */
function processInlineFormatting(
  text: string,
  startIndex: number
): { text: string; inlineFormats: InlineFormat[] } {
  const formats: InlineFormat[] = [];
  let cleanText = text;
  let offset = 0;
  
  // Process bold (**text** or __text__)
  const boldRegex = /\*\*(.+?)\*\*|__(.+?)__/g;
  let match;
  
  // First pass: identify all formatting
  const boldMatches: Array<{ start: number; end: number; text: string }> = [];
  const italicMatches: Array<{ start: number; end: number; text: string }> = [];
  const strikeMatches: Array<{ start: number; end: number; text: string }> = [];
  
  // Find links [text](url) - must be processed first
  const linkMatches: Array<{ start: number; end: number; text: string; url: string }> = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  while ((match = linkRegex.exec(text)) !== null) {
    linkMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      url: match[2],
    });
  }
  
  // Find bold
  const boldRegex2 = /\*\*(.+?)\*\*/g;
  while ((match = boldRegex2.exec(text)) !== null) {
    // Make sure this isn't inside a link
    const isInLink = linkMatches.some(
      (l) => match!.index >= l.start && match!.index < l.end
    );
    if (!isInLink) {
      boldMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
      });
    }
  }
  
  // Find italic (*text* but not **text**)
  const italicRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g;
  while ((match = italicRegex.exec(text)) !== null) {
    // Make sure this isn't part of a bold marker or link
    const isBold = boldMatches.some(
      (b) => match!.index >= b.start && match!.index < b.end
    );
    const isInLink = linkMatches.some(
      (l) => match!.index >= l.start && match!.index < l.end
    );
    if (!isBold && !isInLink) {
      italicMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
      });
    }
  }
  
  // Find strikethrough (~~text~~)
  const strikeRegex = /~~(.+?)~~/g;
  while ((match = strikeRegex.exec(text)) !== null) {
    // Make sure this isn't inside a link
    const isInLink = linkMatches.some(
      (l) => match!.index >= l.start && match!.index < l.end
    );
    if (!isInLink) {
      strikeMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
      });
    }
  }
  
  // Remove markdown syntax and calculate new positions
  // We need to process from end to start to maintain correct indices
  const allMatches = [
    ...linkMatches.map((m) => ({ ...m, type: 'link' as const, markers: m.end - m.start - m.text.length })),
    ...boldMatches.map((m) => ({ ...m, type: 'bold' as const, markers: 4, url: undefined as string | undefined })),
    ...italicMatches.map((m) => ({ ...m, type: 'italic' as const, markers: 2, url: undefined as string | undefined })),
    ...strikeMatches.map((m) => ({ ...m, type: 'strike' as const, markers: 4, url: undefined as string | undefined })),
  ].sort((a, b) => b.start - a.start); // Sort descending
  
  // Calculate clean text and new positions
  let positionOffsets: Array<{ originalStart: number; newStart: number; length: number; type: string; url?: string }> = [];
  let tempText = text;
  let totalRemoved = 0;
  
  // Process from end to start
  for (const m of allMatches) {
    const newStart = m.start - totalRemoved;
    
    // Replace in temp text (remove markdown syntax, keep only the text)
    tempText = tempText.slice(0, m.start) + m.text + tempText.slice(m.end);
    
    positionOffsets.push({
      originalStart: m.start,
      newStart,
      length: m.text.length,
      type: m.type,
      url: m.url,
    });
    
    totalRemoved += m.markers;
  }
  
  cleanText = tempText;
  
  // Recalculate positions for ascending order
  positionOffsets.reverse();
  let runningOffset = 0;
  
  for (const pos of positionOffsets) {
    const adjustedStart = pos.originalStart - runningOffset;
    const docStart = startIndex + adjustedStart;
    const docEnd = docStart + pos.length;
    
    if (pos.type === 'link' && pos.url) {
      formats.push({
        updateTextStyle: {
          textStyle: { link: { url: pos.url } },
          range: { startIndex: docStart, endIndex: docEnd },
          fields: 'link',
        },
      });
      // Link markers: [](url) = 4 chars + url length
      runningOffset += 4 + pos.url.length;
    } else if (pos.type === 'bold') {
      formats.push({
        updateTextStyle: {
          textStyle: { bold: true },
          range: { startIndex: docStart, endIndex: docEnd },
          fields: 'bold',
        },
      });
      runningOffset += 4; // ** on each side
    } else if (pos.type === 'italic') {
      formats.push({
        updateTextStyle: {
          textStyle: { italic: true },
          range: { startIndex: docStart, endIndex: docEnd },
          fields: 'italic',
        },
      });
      runningOffset += 2; // * on each side
    } else if (pos.type === 'strike') {
      formats.push({
        updateTextStyle: {
          textStyle: { strikethrough: true },
          range: { startIndex: docStart, endIndex: docEnd },
          fields: 'strikethrough',
        },
      });
      runningOffset += 4; // ~~ on each side
    }
  }
  
  return { text: cleanText, inlineFormats: formats };
}

// ============================================================
// MIME TYPE HELPERS
// ============================================================

export const GOOGLE_MIME_TYPES = {
  folder: 'application/vnd.google-apps.folder',
  document: 'application/vnd.google-apps.document',
  spreadsheet: 'application/vnd.google-apps.spreadsheet',
  presentation: 'application/vnd.google-apps.presentation',
  form: 'application/vnd.google-apps.form',
} as const;

export const EXPORT_MIME_TYPES = {
  document: {
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pdf: 'application/pdf',
    txt: 'text/plain',
    html: 'text/html',
    md: 'text/markdown',
  },
  spreadsheet: {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
    csv: 'text/csv',
  },
} as const;

