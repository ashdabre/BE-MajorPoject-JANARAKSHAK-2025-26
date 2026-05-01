export const IPCDatabase = {
  sections: [
    {
      code: 'IPC 379',
      title: 'Theft',
      description: 'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.',
      punishment: 'Imprisonment up to 3 years, or fine, or both.',
      category: 'Property Crime'
    },
    {
      code: 'IPC 380',
      title: 'Theft in dwelling house',
      description: 'Whoever commits theft in any building, tent or vessel used as a human dwelling or for the custody of property, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
      punishment: 'Imprisonment up to 7 years and fine.',
      category: 'Property Crime'
    },
    // Add more IPC sections as needed
  ],
  
  chargesheetTemplates: {
    basic: `
IN THE COURT OF [COURT_NAME]
CHARGE SHEET

Case No: [CASE_ID]
FIR No: [FIR_NUMBER]
Police Station: [POLICE_STATION]
U/s: [IPC_SECTIONS]

[CONTENT]

INVESTIGATING OFFICER:
[OFFICER_DETAILS]

DATE: [DATE]
    `,
    
    theft: `
IN THE COURT OF JUDICIAL MAGISTRATE
CHARGE SHEET FOR THEFT CASE

Case: [CASE_ID]
Complainant: [COMPLAINANT]
Accused: [ACCUSED]

OFFENCES:
[IPC_SECTIONS]

BRIEF FACTS:
The prosecution case in brief is that [INCIDENT_DETAILS]

EVIDENCE:
1. [EVIDENCE_1]
2. [EVIDENCE_2]

WITNESSES:
1. [WITNESS_1]
2. [WITNESS_2]

[OFFICER_SIGNATURE]
    `
  }
};

export const CrPCDatabase = {
  procedures: [
    {
      section: 'CrPC 173',
      title: 'Report of police officer on completion of investigation',
      description: 'Every investigation shall be completed without unnecessary delay.',
      timeline: 'Within 90 days for serious offences'
    }
  ]
};