// Mock chargesheet generation function
const generateFormIFSContent = (caseData, sections = []) => {
  const sectionNumbers = sections.map(s => s.replace('IPC ', '')).join(', ');
  
  return `FORM IFS
FINAL FORM / REPORT
(Under Section 173 CR. P.C.)

Case: ${caseData.caseId || 'N/A'}
FIR: ${caseData.firNumber || 'N/A'}
Sections: ${sectionNumbers || 'None'}

Brief Facts:
${caseData.incidentDescription || 'No description provided'}`;
};

describe('Chargesheet Generation Tests', () => {
  const mockCaseData = {
    caseId: 'FIR/2024/001234',
    firNumber: 'FIR-1234/2024',
    policeStation: 'Sector 5 Police Station',
    incidentDescription: 'Theft of laptop from office premises'
  };

  test('generates FORM IFS content with case details', () => {
    const sections = ['IPC 379'];
    const content = generateFormIFSContent(mockCaseData, sections);
    
    expect(content).toContain('FORM IFS');
    expect(content).toContain('FINAL FORM / REPORT');
    expect(content).toContain(mockCaseData.caseId);
    expect(content).toContain(mockCaseData.firNumber);
    expect(content).toContain('379');
  });

  test('includes incident description in brief facts', () => {
    const sections = ['IPC 379'];
    const content = generateFormIFSContent(mockCaseData, sections);
    
    expect(content).toContain('Brief Facts:');
    expect(content).toContain(mockCaseData.incidentDescription);
  });

  test('handles multiple IPC sections correctly', () => {
    const sections = ['IPC 379', 'IPC 420', 'IPC 380'];
    const content = generateFormIFSContent(mockCaseData, sections);
    
    expect(content).toContain('379, 420, 380');
  });

  test('handles empty sections array gracefully', () => {
    const sections = [];
    const content = generateFormIFSContent(mockCaseData, sections);
    
    expect(content).toContain('FORM IFS');
    expect(content).toContain('Sections: None');
  });

  test('handles missing case data', () => {
    const emptyCaseData = {};
    const sections = ['IPC 379'];
    const content = generateFormIFSContent(emptyCaseData, sections);
    
    expect(content).toContain('Case: N/A');
    expect(content).toContain('FIR: N/A');
    expect(content).toContain('No description provided');
  });
});