/**
 * Mock Database Layer
 * 
 * TODO: Replace with actual database implementation
 * This file provides mock implementations of all database operations
 * to allow the AI package to be self-contained and decoupled from database concerns.
 */

// ============================================================
// Mock Data Stores
// ============================================================

const mockPublicReports = new Map<string, any>();
const mockWebsiteAudits = new Map<string, any>();
const mockPageAudits = new Map<string, any>();
const mockLinkAudits: any[] = [];
const mockAssetAudits: any[] = [];
const mockPerformanceAudits = new Map<string, any>();
const mockProjects = new Map<string, any>();

// ============================================================
// Mock Prisma Client Interface
// ============================================================

export const mockPrisma = {
  // Public Reports
  publicReport: {
    findUnique: async ({ where }: any) => {
      const report = mockPublicReports.get(where.domain || where.id);
      return report || null;
    },
    
    create: async ({ data }: any) => {
      const id = `report_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const report = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPublicReports.set(data.domain, report);
      return report;
    },
    
    update: async ({ where, data }: any) => {
      const existing = mockPublicReports.get(where.domain) || 
                      Array.from(mockPublicReports.values()).find(r => r.id === where.id);
      
      if (!existing) throw new Error('Report not found');
      
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      
      mockPublicReports.set(existing.domain, updated);
      return updated;
    },
    
    updateMany: async ({ where, data }: any) => {
      let count = 0;
      mockPublicReports.forEach((report, key) => {
        if (matchesWhere(report, where)) {
          mockPublicReports.set(key, { ...report, ...data, updatedAt: new Date() });
          count++;
        }
      });
      return { count };
    },
    
    deleteMany: async ({ where }: any) => {
      let count = 0;
      const keysToDelete: string[] = [];
      
      mockPublicReports.forEach((report, key) => {
        if (matchesWhere(report, where)) {
          keysToDelete.push(key);
          count++;
        }
      });
      
      keysToDelete.forEach(key => mockPublicReports.delete(key));
      return { count };
    },
    
    count: async ({ where }: any = {}) => {
      if (!where) return mockPublicReports.size;
      
      let count = 0;
      mockPublicReports.forEach(report => {
        if (matchesWhere(report, where)) count++;
      });
      return count;
    },
    
    findMany: async ({ where, select, orderBy, take }: any) => {
      let results = Array.from(mockPublicReports.values());
      
      if (where) {
        results = results.filter(report => matchesWhere(report, where));
      }
      
      if (orderBy) {
        results = sortResults(results, orderBy);
      }
      
      if (take) {
        results = results.slice(0, take);
      }
      
      if (select) {
        results = results.map(r => selectFields(r, select));
      }
      
      return results;
    },
  },
  
  // Website Audits
  websiteAudit: {
    findUnique: async ({ where }: any) => {
      return mockWebsiteAudits.get(where.id) || null;
    },
    
    update: async ({ where, data }: any) => {
      const existing = mockWebsiteAudits.get(where.id);
      if (!existing) throw new Error('WebsiteAudit not found');
      
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      
      mockWebsiteAudits.set(where.id, updated);
      return updated;
    },
  },
  
  // Page Audits
  pageAudit: {
    create: async ({ data, select }: any) => {
      const id = `page_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const pageAudit = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPageAudits.set(id, pageAudit);
      
      if (select) {
        return selectFields(pageAudit, select);
      }
      
      return pageAudit;
    },
    
    findUnique: async ({ where, select }: any) => {
      const pageAudit = mockPageAudits.get(where.id);
      
      if (!pageAudit) return null;
      
      if (select) {
        return selectFields(pageAudit, select);
      }
      
      return pageAudit;
    },
    
    findMany: async ({ where, select }: any) => {
      let results = Array.from(mockPageAudits.values());
      
      if (where) {
        results = results.filter(page => matchesWhere(page, where));
      }
      
      if (select) {
        results = results.map(p => selectFields(p, select));
      }
      
      return results;
    },
    
    update: async ({ where, data }: any) => {
      const existing = mockPageAudits.get(where.id);
      if (!existing) throw new Error('PageAudit not found');
      
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      
      mockPageAudits.set(where.id, updated);
      return updated;
    },
  },
  
  // Link Audits
  linkAudit: {
    createMany: async ({ data }: any) => {
      const records = Array.isArray(data) ? data : [data];
      records.forEach(record => {
        mockLinkAudits.push({
          id: `link_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          ...record,
          createdAt: new Date(),
        });
      });
      return { count: records.length };
    },
  },
  
  // Asset Audits
  assetAudit: {
    createMany: async ({ data }: any) => {
      const records = Array.isArray(data) ? data : [data];
      records.forEach(record => {
        mockAssetAudits.push({
          id: `asset_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          ...record,
          createdAt: new Date(),
        });
      });
      return { count: records.length };
    },
  },
  
  // Performance Audits
  performanceAudit: {
    upsert: async ({ where, update, create }: any) => {
      const key = `${where.pageAuditId_device?.pageAuditId}_${where.pageAuditId_device?.device}`;
      const existing = mockPerformanceAudits.get(key);
      
      if (existing) {
        const updated = { ...existing, ...update, updatedAt: new Date() };
        mockPerformanceAudits.set(key, updated);
        return updated;
      } else {
        const created = {
          id: `perf_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          ...create,
          createdAt: new Date(),
        };
        mockPerformanceAudits.set(key, created);
        return created;
      }
    },
  },
  
  // Projects
  project: {
    findUnique: async ({ where, select }: any) => {
      const project = mockProjects.get(where.id);
      
      if (!project) return null;
      
      if (select) {
        return selectFields(project, select);
      }
      
      return project;
    },
  },
};

// ============================================================
// Helper Functions
// ============================================================

function matchesWhere(record: any, where: any): boolean {
  if (!where) return true;
  
  for (const [key, value] of Object.entries(where)) {
    if (key === 'in' && Array.isArray(value)) {
      const field = Object.keys(where)[0];
      if (!value.includes(record[field])) return false;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Handle operators like lt, gt, etc.
      const field = key;
      const operators = value as any;
      
      if (operators.lt !== undefined && !(record[field] < operators.lt)) return false;
      if (operators.gt !== undefined && !(record[field] > operators.gt)) return false;
      if (operators.not !== undefined && record[field] === operators.not) return false;
    } else if (record[key] !== value) {
      return false;
    }
  }
  
  return true;
}

function selectFields(record: any, select: any): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(select)) {
    if (value === true) {
      result[key] = record[key];
    }
  }
  
  return result;
}

function sortResults(results: any[], orderBy: any): any[] {
  const field = Object.keys(orderBy)[0];
  const direction = orderBy[field];
  
  return results.sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// ============================================================
// Mock Vector Analytics Functions
// ============================================================

export const mockVectorAnalytics = {
  queryAnalysisHistory: async (
    projectId: string,
    query: string,
    limit: number = 3
  ): Promise<any[]> => {
    // Mock implementation - returns empty array
    console.log(`[Mock] queryAnalysisHistory: ${projectId}, ${query}, ${limit}`);
    return [];
  },
  
  queryCompetitorInsights: async (
    projectId: string,
    query: string,
    limit: number = 3
  ): Promise<any[]> => {
    // Mock implementation - returns empty array
    console.log(`[Mock] queryCompetitorInsights: ${projectId}, ${query}, ${limit}`);
    return [];
  },
};

// ============================================================
// Helper to add mock data for testing
// ============================================================

export function addMockProject(id: string, data: any) {
  mockProjects.set(id, {
    id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export function addMockWebsiteAudit(id: string, data: any) {
  mockWebsiteAudits.set(id, {
    id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export function clearMockData() {
  mockPublicReports.clear();
  mockWebsiteAudits.clear();
  mockPageAudits.clear();
  mockLinkAudits.length = 0;
  mockAssetAudits.length = 0;
  mockPerformanceAudits.clear();
  mockProjects.clear();
}
