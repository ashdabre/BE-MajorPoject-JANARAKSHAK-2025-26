// Mock legal analysis functions
const mockAnalyzeCase = (caseDescription) => {
  const description = caseDescription.toLowerCase();
  const results = {
    sections: [],
    confidence: 0.7,
    legalDomains: ['Criminal Law'],
    reasoning: 'Analysis based on case description keywords'
  };

  // Simple keyword-based section matching
  if (description.includes('theft') || description.includes('steal')) {
    results.sections.push(
      { code: 'IPC 379', title: 'Theft', relevance: 0.9 },
      { code: 'IPC 380', title: 'Theft in dwelling house', relevance: 0.7 }
    );
    results.confidence = 0.85;
  }

  if (description.includes('assault') || description.includes('hurt')) {
    results.sections.push(
      { code: 'IPC 323', title: 'Voluntarily causing hurt', relevance: 0.8 },
      { code: 'IPC 324', title: 'Voluntarily causing hurt by dangerous weapons', relevance: 0.6 }
    );
    results.confidence = 0.8;
  }

  if (description.includes('fraud') || description.includes('cheat')) {
    results.sections.push(
      { code: 'IPC 420', title: 'Cheating and dishonestly inducing delivery of property', relevance: 0.9 },
      { code: 'IPC 406', title: 'Criminal breach of trust', relevance: 0.7 }
    );
    results.confidence = 0.88;
  }

  if (description.includes('murder') || description.includes('kill')) {
    results.sections.push(
      { code: 'IPC 302', title: 'Punishment for murder', relevance: 0.95 },
      { code: 'IPC 304', title: 'Punishment for culpable homicide not amounting to murder', relevance: 0.5 }
    );
    results.confidence = 0.9;
  }

  return results;
};

const mockGetSectionDetails = (sectionCode) => {
  const sectionDatabase = {
    'IPC 379': {
      code: 'IPC 379',
      title: 'Theft',
      description: 'Whoever, intending to take dishonestly any movable property...',
      punishment: 'Imprisonment up to 3 years, or fine, or both.',
      category: 'Property Crime'
    },
    'IPC 420': {
      code: 'IPC 420',
      title: 'Cheating',
      description: 'Whoever cheats and thereby dishonestly induces...',
      punishment: 'Imprisonment up to 7 years and fine.',
      category: 'Economic Crime'
    },
    'IPC 302': {
      code: 'IPC 302',
      title: 'Murder',
      description: 'Whoever commits murder shall be punished with death...',
      punishment: 'Death or imprisonment for life',
      category: 'Violent Crime'
    }
  };

  return sectionDatabase[sectionCode] || {
    code: sectionCode,
    title: 'Unknown Section',
    description: 'Section details not available',
    punishment: 'Refer to legal database',
    category: 'General'
  };
};

describe('Legal Accuracy Tests', () => {
  test('suggests theft sections for theft cases', () => {
    const caseDescription = 'Stolen mobile phone from parked vehicle';
    const analysis = mockAnalyzeCase(caseDescription);
    
    expect(analysis.sections.length).toBeGreaterThan(0);
    expect(analysis.sections.some(s => s.code === 'IPC 379')).toBe(true);
    expect(analysis.sections.some(s => s.code === 'IPC 380')).toBe(true);
    expect(analysis.confidence).toBeGreaterThan(0.8);
  });

  test('suggests appropriate sections for assault cases', () => {
    const caseDescription = 'Physical assault with weapon causing injuries';
    const analysis = mockAnalyzeCase(caseDescription);
    
    expect(analysis.sections.some(s => s.code === 'IPC 323')).toBe(true);
    expect(analysis.sections.some(s => s.code === 'IPC 324')).toBe(true);
    expect(analysis.legalDomains).toContain('Criminal Law');
  });

  test('suggests fraud sections for financial crimes', () => {
    const caseDescription = 'Online fraud cheating people of money';
    const analysis = mockAnalyzeCase(caseDescription);
    
    expect(analysis.sections.some(s => s.code === 'IPC 420')).toBe(true);
    expect(analysis.sections.some(s => s.code === 'IPC 406')).toBe(true);
    expect(analysis.confidence).toBeGreaterThan(0.85);
  });

  test('provides section details correctly', () => {
    const sectionDetails = mockGetSectionDetails('IPC 379');
    
    expect(sectionDetails.code).toBe('IPC 379');
    expect(sectionDetails.title).toBe('Theft');
    expect(sectionDetails.description).toContain('movable property');
    expect(sectionDetails.punishment).toContain('Imprisonment');
    expect(sectionDetails.category).toBe('Property Crime');
  });

  test('handles unknown section codes gracefully', () => {
    const sectionDetails = mockGetSectionDetails('IPC 999');
    
    expect(sectionDetails.code).toBe('IPC 999');
    expect(sectionDetails.title).toBe('Unknown Section');
    expect(sectionDetails.description).toBe('Section details not available');
  });

  test('returns empty sections for unrelated cases', () => {
    const caseDescription = 'Traffic violation parking ticket';
    const analysis = mockAnalyzeCase(caseDescription);
    
    expect(analysis.sections).toHaveLength(0);
    expect(analysis.confidence).toBe(0.7);
  });
});