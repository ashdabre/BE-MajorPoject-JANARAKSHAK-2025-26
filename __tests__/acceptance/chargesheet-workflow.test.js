// Mock workflow functions
const mockCreateChargesheet = (caseData, sections) => {
  return {
    id: `chargesheet_${Date.now()}`,
    caseId: caseData.caseId,
    content: `FORM IFS - ${caseData.caseId}`,
    sections: sections,
    generatedAt: new Date().toISOString(),
    status: 'generated',
    confidence: 0.9
  };
};

const mockVerifySections = (caseDescription, appliedSections) => {
  const hasTheft = caseDescription.toLowerCase().includes('theft');
  const hasFraud = caseDescription.toLowerCase().includes('fraud');
  
  const appropriateSections = [];
  if (hasTheft) appropriateSections.push('IPC 379', 'IPC 380');
  if (hasFraud) appropriateSections.push('IPC 420', 'IPC 406');
  
  const missingSections = appropriateSections.filter(s => !appliedSections.includes(s));
  const irrelevantSections = appliedSections.filter(s => !appropriateSections.includes(s));
  
  return {
    isAppropriate: missingSections.length === 0 && irrelevantSections.length === 0,
    confidence: 0.85,
    missingSections,
    irrelevantSections,
    warnings: irrelevantSections.length > 0 ? ['Some sections may not be appropriate'] : []
  };
};

describe('Chargesheet Workflow Tests', () => {
  const mockCaseData = {
    caseId: 'FIR/2024/001234',
    firNumber: 'FIR-1234/2024',
    incidentDescription: 'Theft of mobile phone and wallet'
  };

  test('creates chargesheet with correct structure', () => {
    const sections = ['IPC 379', 'IPC 420'];
    const chargesheet = mockCreateChargesheet(mockCaseData, sections);
    
    expect(chargesheet.id).toContain('chargesheet_');
    expect(chargesheet.caseId).toBe(mockCaseData.caseId);
    expect(chargesheet.content).toContain('FORM IFS');
    expect(chargesheet.sections).toEqual(sections);
    expect(chargesheet.status).toBe('generated');
    expect(chargesheet.confidence).toBeGreaterThan(0.8);
  });

  test('verifies appropriate sections for theft case', () => {
    const caseDescription = 'Theft of laptop from office';
    const appliedSections = ['IPC 379', 'IPC 380'];
    
    const verification = mockVerifySections(caseDescription, appliedSections);
    
    expect(verification.isAppropriate).toBe(true);
    expect(verification.confidence).toBe(0.85);
    expect(verification.missingSections).toHaveLength(0);
    expect(verification.irrelevantSections).toHaveLength(0);
  });

  test('flags inappropriate sections for case type', () => {
    const caseDescription = 'Theft case';
    const appliedSections = ['IPC 302', 'IPC 420']; // Murder section is inappropriate
    
    const verification = mockVerifySections(caseDescription, appliedSections);
    
    expect(verification.isAppropriate).toBe(false);
    expect(verification.irrelevantSections).toContain('IPC 302');
    expect(verification.warnings).toContain('Some sections may not be appropriate');
  });

  test('identifies missing appropriate sections', () => {
    const caseDescription = 'Theft and fraud case';
    const appliedSections = ['IPC 379']; // Missing fraud sections
    
    const verification = mockVerifySections(caseDescription, appliedSections);
    
    expect(verification.isAppropriate).toBe(false);
    expect(verification.missingSections).toContain('IPC 420');
    expect(verification.missingSections).toContain('IPC 406');
  });

  test('handles empty case description', () => {
    const verification = mockVerifySections('', ['IPC 379']);
    
    expect(verification.isAppropriate).toBe(false);
    expect(verification.confidence).toBe(0.85);
  });
});