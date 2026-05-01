// utils/caseStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const CASES_STORAGE_KEY = 'all_cases_list';
const OFFICER_CASES_KEY = 'all_officer_cases';

export interface Case {
  id: string;
  caseId: string;
  type: string;
  priority: string;
  status: 'Pending' | 'Investigating' | 'Evidence Collection' | 'Resolved' | 'Active';
  assignedTo: string;
  date: string;
  location: string;
  description: string;
  complainant: string;
  phone: string;
  updates: Array<{
    date: string;
    time: string;
    action: string;
    by: string;
  }>;
  evidence: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
    time: string;
    uploadedBy: string;
    uri?: string;
  }>;
  witnesses: Array<{
    name: string;
    contact: string;
    statement: string;
  }>;
  // Additional fields for timeline
  title?: string;
  lastUpdate?: string;
  notes?: number;
  evidenceCount?: number;
  witnessesCount?: number;
  incidentDescription?: string;
  investigationSummary?: string;
  evidenceCollected?: string;
  witnessesList?: Array<any>;
  policeStation?: string;
  complainant?: string;
  accused?: string;
  incidentDate?: string;
  incidentLocation?: string;
  assignedOfficer?: string;
  registeredTime?: string;
  caseType?: string;
}

export const caseStorage = {
  // Get all cases (dummy + new)
  async getAllCases(): Promise<Case[]> {
    try {
      // Get new cases from storage
      const storedNewCases = await AsyncStorage.getItem(CASES_STORAGE_KEY);
      const newCases = storedNewCases ? JSON.parse(storedNewCases) : [];
      
      return newCases;
    } catch (error) {
      console.error('Error getting all cases:', error);
      return [];
    }
  },

  // Get cases for a specific officer
  async getOfficerCases(officerId: string): Promise<Case[]> {
    try {
      const key = `officer_cases_${officerId}`;
      const storedCases = await AsyncStorage.getItem(key);
      return storedCases ? JSON.parse(storedCases) : [];
    } catch (error) {
      console.error('Error getting officer cases:', error);
      return [];
    }
  },

  // Save a new case
  async saveCase(caseData: Case): Promise<void> {
    try {
      const existingCases = await this.getAllCases();
      const updatedCases = [...existingCases, caseData];
      await AsyncStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(updatedCases));
      
      // Also save to general officer cases list
      const allOfficerCases = await AsyncStorage.getItem(OFFICER_CASES_KEY);
      const officerCases = allOfficerCases ? JSON.parse(allOfficerCases) : [];
      officerCases.push(caseData);
      await AsyncStorage.setItem(OFFICER_CASES_KEY, JSON.stringify(officerCases));
    } catch (error) {
      console.error('Error saving case:', error);
      throw error;
    }
  },

  // Update an existing case
  async updateCase(caseId: string, updates: Partial<Case>): Promise<void> {
    try {
      const existingCases = await this.getAllCases();
      const updatedCases = existingCases.map(case_ => 
        case_.id === caseId ? { ...case_, ...updates } : case_
      );
      await AsyncStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(updatedCases));
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  },

  // Convert officer case to timeline format
  convertToTimelineFormat(officerCase: any, index: number): any {
    const statusMap = {
      'Pending': 'Pending',
      'Investigating': 'Active',
      'Evidence Collection': 'Investigation',
      'Resolved': 'Closed'
    };

    const priorityMap = {
      'High': 'High',
      'Medium': 'Medium',
      'Low': 'Low'
    };

    // Generate investigation summary based on case data
    const generateSummary = (case_: any) => {
      const summaries = [
        `Case registered on ${case_.date} for ${case_.type} at ${case_.location}. Currently ${case_.status.toLowerCase()} investigation by ${case_.assignedTo}.`,
        `${case_.type} case reported by ${case_.complainant}. Investigation ongoing with ${case_.updates?.length || 0} updates recorded.`,
        `${case_.type} incident at ${case_.location}. ${case_.evidence?.length || 0} pieces of evidence collected, ${case_.witnesses?.length || 0} witnesses interviewed.`
      ];
      return summaries[index % summaries.length];
    };

    // Generate incident description
    const generateIncidentDescription = (case_: any) => {
      return `${case_.description} Reported on ${case_.date} at ${case_.location}. Complainant: ${case_.complainant} (${case_.phone}).`;
    };

    // Generate recent activities from updates
    const generateRecentActivities = (updates: any[]) => {
      if (!updates || updates.length === 0) {
        return [
          {
            type: 'note',
            description: 'Case registered and investigation initiated',
            timestamp: 'Just now',
            officer: case_.assignedTo
          }
        ];
      }

      return updates.slice(-3).map(update => ({
        type: update.action.toLowerCase().includes('evidence') ? 'evidence' : 
              update.action.toLowerCase().includes('witness') ? 'witness' : 'note',
        description: update.action,
        timestamp: `${update.date} ${update.time}`,
        officer: update.by
      }));
    };

    return {
      id: `new_${index + 100}`, // Start from 100 to differentiate from dummy cases
      caseId: officerCase.id,
      title: `${officerCase.type} Case`,
      lastUpdate: officerCase.updates && officerCase.updates.length > 0 
        ? `${officerCase.updates[officerCase.updates.length - 1].date} ${officerCase.updates[officerCase.updates.length - 1].time}`
        : officerCase.date,
      status: statusMap[officerCase.status] || 'Pending',
      notes: officerCase.updates?.length || 0,
      evidence: officerCase.evidence?.length || 0,
      witnesses: officerCase.witnesses?.length || 0,
      incidentDescription: generateIncidentDescription(officerCase),
      investigationSummary: generateSummary(officerCase),
      evidenceCollected: officerCase.evidence?.map((e: any) => e.name).join(', ') || 'No evidence collected yet',
      witnessesList: officerCase.witnesses?.map((w: any, idx: number) => ({
        id: `w_new_${idx}`,
        name: w.name,
        role: 'Witness',
        statement: w.statement,
        recordingAvailable: w.statement === 'Submitted',
        interviewDate: officerCase.date,
        officer: officerCase.assignedTo
      })) || [],
      policeStation: 'Sector 5 Police Station',
      complainant: officerCase.complainant,
      accused: 'Unknown',
      incidentDate: officerCase.date,
      incidentLocation: officerCase.location,
      assignedOfficer: officerCase.assignedTo,
      registeredTime: `${officerCase.date} 09:30 AM`,
      caseType: officerCase.type
    };
  },

  // Convert officer cases to chargesheet format
  convertToChargesheetFormat(officerCase: any): any {
    return {
      id: officerCase.id,
      title: officerCase.type,
      caseId: officerCase.id,
      description: officerCase.description,
      location: officerCase.location,
      date: officerCase.date,
      assignedOfficer: officerCase.assignedTo,
      status: officerCase.status,
      priority: officerCase.priority,
      updates: officerCase.updates || [],
      evidence: officerCase.evidence || [],
      witnesses: officerCase.witnesses || []
    };
  }
};