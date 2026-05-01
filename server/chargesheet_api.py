from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
import io
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders

app = Flask(__name__)
CORS(app)

# Mock database for cases
cases_db = {
    "FIR/2024/001234": {
        "fir_number": "FIR-1234/2024",
        "police_station": "Sector 5 Police Station",
        "incident_date": "2024-01-10",
        "incident_location": "MG Road Metro Station Parking",
        "complainant": "Rahul Sharma",
        "accused": "Unknown (CCTV footage available)",
        "ipc_sections": ["IPC 379"],
        "evidence": ["CCTV footage from metro station", "Recovered stolen items", "Witness statements"],
        "witnesses": ["Security Guard - Raj Kumar", "Shop Owner - Priya Singh"],
        "investigation_summary": "The accused was captured on CCTV committing theft from a parked vehicle. Investigation led to recovery of stolen items.",
        "status": "Under Investigation",
        "officer_in_charge": "Inspector Rajesh Kumar"
    },
    "FIR/2024/001235": {
        "fir_number": "FIR-1235/2024",
        "police_station": "Sector 5 Police Station",
        "incident_date": "2024-01-12",
        "incident_location": "Brigade Road Shopping Complex",
        "complainant": "Priya Patel",
        "accused": "Raj Kumar (Arrested)",
        "ipc_sections": ["IPC 420"],
        "evidence": ["Bank transaction records", "Forged documents", "Email communications"],
        "witnesses": ["Bank Manager - Anil Verma", "Victim's friend - Sameer Joshi"],
        "investigation_summary": "Accused cheated complainant of ₹5,00,000 through fake investment scheme. Digital evidence collected from email and bank records.",
        "status": "Chargesheet Pending",
        "officer_in_charge": "Sub-Inspector Meera Sharma"
    }
}

# IPC Sections database
ipc_sections = {
    "IPC 379": {
        "title": "Theft",
        "punishment": "Imprisonment up to 3 years, or fine, or both.",
        "description": "Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft."
    },
    "IPC 380": {
        "title": "Theft in dwelling house",
        "punishment": "Imprisonment up to 7 years and fine.",
        "description": "Theft committed in any building, tent or vessel used as a human dwelling or for custody of property."
    },
    "IPC 420": {
        "title": "Cheating and dishonestly inducing delivery of property",
        "punishment": "Imprisonment up to 7 years and fine.",
        "description": "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person."
    }
}

@app.route('/api/search-case', methods=['POST'])
def search_case():
    data = request.json
    case_id = data.get('case_id')
    fir_number = data.get('fir_number')
    
    # Search by case ID or FIR number
    case_data = None
    for case_id_key, case_info in cases_db.items():
        if case_id_key == case_id or case_info['fir_number'] == fir_number:
            case_data = {**case_info, 'case_id': case_id_key}
            break
    
    if case_data:
        return jsonify({
            'success': True,
            'case_data': case_data
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Case not found. Please check the Case ID or FIR number.'
        }), 404

@app.route('/api/generate-chargesheet', methods=['POST'])
def generate_chargesheet():
    try:
        data = request.json
        case_data = data.get('case_data')
        
        # Generate chargesheet content
        chargesheet_content = generate_chargesheet_content(case_data)
        
        # Generate PDF
        pdf_buffer = generate_pdf(chargesheet_content, case_data)
        
        # Save to temporary file (in production, save to database/storage)
        filename = f"chargesheet_{case_data.get('case_id', 'unknown')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = f"/tmp/{filename}"
        
        with open(filepath, 'wb') as f:
            f.write(pdf_buffer.getvalue())
        
        return jsonify({
            'success': True,
            'chargesheet': chargesheet_content,
            'file_url': f"/api/download-chargesheet/{filename}",
            'filename': filename,
            'generated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error generating chargesheet: {str(e)}'
        }), 500

@app.route('/api/download-chargesheet/<filename>', methods=['GET'])
def download_chargesheet(filename):
    try:
        filepath = f"/tmp/{filename}"
        return send_file(filepath, as_attachment=True, download_name=filename)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'File not found'
        }), 404

@app.route('/api/share-chargesheet', methods=['POST'])
def share_chargesheet():
    data = request.json
    email = data.get('email')
    filename = data.get('filename')
    message = data.get('message', 'Please find the attached chargesheet.')
    
    try:
        # In production, implement actual email sending
        # This is a mock implementation
        send_email_with_attachment(email, filename, message)
        
        return jsonify({
            'success': True,
            'message': f'Chargesheet shared successfully with {email}'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error sharing chargesheet: {str(e)}'
        }), 500

def generate_chargesheet_content(case_data):
    """Generate formatted chargesheet content"""
    
    ipc_details = []
    for section in case_data.get('ipc_sections', []):
        if section in ipc_sections:
            ipc_details.append(f"{section} - {ipc_sections[section]['title']}")
    
    content = f"""
IN THE COURT OF JUDICIAL MAGISTRATE, BANGALORE
CHARGE SHEET

Case No: {case_data.get('case_id', 'N/A')}
FIR No: {case_data.get('fir_number', 'N/A')}
Police Station: {case_data.get('police_station', 'N/A')}
Date of Incident: {case_data.get('incident_date', 'N/A')}
U/s: {', '.join(case_data.get('ipc_sections', []))}

COMPLAINANT:
Name: {case_data.get('complainant', 'N/A')}
Address: [Address to be filled]

ACCUSED:
{case_data.get('accused', 'N/A')}
Address: [Address to be filled]
Father's Name: [To be filled]
Occupation: [To be filled]

OFFENCES:
{chr(10).join([f"- {detail}" for detail in ipc_details])}

BRIEF FACTS OF THE CASE:
{case_data.get('investigation_summary', 'Investigation summary to be provided...')}

EVIDENCE COLLECTED:
{chr(10).join([f"{i+1}. {evidence}" for i, evidence in enumerate(case_data.get('evidence', []))])}

WITNESSES:
{chr(10).join([f"{i+1}. {witness}" for i, witness in enumerate(case_data.get('witnesses', []))])}

INVESTIGATION DETAILS:
- Date of FIR: {case_data.get('incident_date', 'N/A')}
- Investigation Officer: {case_data.get('officer_in_charge', 'N/A')}
- Police Station: {case_data.get('police_station', 'N/A')}
- Case Status: {case_data.get('status', 'N/A')}

CONCLUSION:
Based on the evidence collected and investigation conducted, it is established that the accused has committed the offence(s) as mentioned above.

INVESTIGATING OFFICER:
{case_data.get('officer_in_charge', 'N/A')}
Station House Officer
{case_data.get('police_station', 'N/A')}

DATE OF FILING: {datetime.now().strftime('%d/%m/%Y')}

NOTE: This chargesheet has been generated using the AI-Powered Legal Assistant System. All details should be verified before submission to court.
"""
    return content

def generate_pdf(content, case_data):
    """Generate PDF from chargesheet content"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=1,  # Center aligned
        textColor=colors.HexColor('#1E293B')
    )
    story.append(Paragraph("CHARGE SHEET", title_style))
    
    # Case details table
    case_details = [
        ["Case No:", case_data.get('case_id', 'N/A')],
        ["FIR No:", case_data.get('fir_number', 'N/A')],
        ["Police Station:", case_data.get('police_station', 'N/A')],
        ["Date of Incident:", case_data.get('incident_date', 'N/A')],
        ["Sections:", ', '.join(case_data.get('ipc_sections', []))]
    ]
    
    case_table = Table(case_details, colWidths=[2*inch, 4*inch])
    case_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F1F5F9')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1E293B')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0'))
    ]))
    story.append(case_table)
    story.append(Spacer(1, 20))
    
    # Add content sections
    sections = content.split('\n\n')
    for section in sections:
        if section.strip():
            if ':' in section and len(section.split(':')[0]) < 50:
                # Section title
                story.append(Paragraph(
                    section.split(':')[0] + ':',
                    styles['Heading2']
                ))
                story.append(Paragraph(
                    ':'.join(section.split(':')[1:]).strip(),
                    styles['Normal']
                ))
            else:
                story.append(Paragraph(section, styles['Normal']))
            story.append(Spacer(1, 12))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

def send_email_with_attachment(email, filename, message):
    """Mock email sending function"""
    # In production, implement actual email sending with SMTP
    print(f"Mock: Sending email to {email} with attachment {filename}")
    print(f"Message: {message}")
    return True

if __name__ == '__main__':
    app.run(debug=True, port=5000)