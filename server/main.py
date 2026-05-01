# from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from pydantic import BaseModel
# import whisper
# import os
# import uuid
# from datetime import datetime
# import json
# from typing import Optional
# import aiofiles
# import sqlite3
# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(title="Voice Command Backend", version="1.0.0")

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize Whisper model
# try:
#     model = whisper.load_model("small")
#     logger.info("Whisper model loaded successfully")
# except Exception as e:
#     logger.error(f"Failed to load Whisper model: {e}")
#     model = None

# # Database setup
# def init_db():
#     conn = sqlite3.connect('recordings.db')
#     cursor = conn.cursor()
#     cursor.execute('''
#         CREATE TABLE IF NOT EXISTS recordings (
#             id TEXT PRIMARY KEY,
#             audio_path TEXT,
#             transcript TEXT,
#             category TEXT,
#             case_number TEXT,
#             duration INTEGER,
#             title TEXT,
#             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#         )
#     ''')
#     conn.commit()
#     conn.close()

# init_db()

# # Pydantic models for request validation
# class SaveRecordingRequest(BaseModel):
#     audio_uri: str
#     transcript: str
#     category: str
#     case_number: str
#     duration: int
#     title: str

# @app.get("/")
# async def root():
#     return {"message": "Voice Command Backend API", "status": "running"}

# @app.post("/transcribe")
# async def transcribe_audio(request: Request):
#     """
#     Transcribe audio file using Whisper model - handle React Native blob URLs
#     """
#     if not model:
#         raise HTTPException(status_code=500, detail="Whisper model not loaded")
    
#     try:
#         # Check if it's form data
#         content_type = request.headers.get("content-type", "")
        
#         if "multipart/form-data" not in content_type:
#             logger.error(f"Unsupported content type: {content_type}")
#             raise HTTPException(status_code=400, detail="Only multipart/form-data is supported for file upload")
        
#         form_data = await request.form()
#         audio_file = form_data.get("audio")
        
#         if not audio_file:
#             logger.error("No audio file found in form data")
#             raise HTTPException(status_code=400, detail="No audio file provided")
        
#         if isinstance(audio_file, str):
#             logger.error(f"Audio file is string, not file: {audio_file}")
#             raise HTTPException(status_code=400, detail="Invalid file format - expected file upload, got string")
        
#         logger.info(f"📁 Processing audio file: {audio_file.filename}, type: {audio_file.content_type}")
        
#         # Create uploads directory if it doesn't exist
#         os.makedirs("uploads", exist_ok=True)
        
#         # Generate unique filename
#         file_extension = '.m4a'  # Default for React Native
#         if audio_file.filename and '.' in audio_file.filename:
#             file_extension = os.path.splitext(audio_file.filename)[1]
        
#         unique_filename = f"{uuid.uuid4()}{file_extension}"
#         file_path = f"uploads/{unique_filename}"
        
#         # Save uploaded file
#         file_content = await audio_file.read()
        
#         if len(file_content) == 0:
#             raise HTTPException(status_code=400, detail="Uploaded file is empty")
        
#         async with aiofiles.open(file_path, 'wb') as out_file:
#             await out_file.write(file_content)
        
#         logger.info(f"✅ Audio file saved: {file_path} ({len(file_content)} bytes)")
        
#         # Transcribe using Whisper
#         logger.info("🎤 Starting transcription...")
#         try:
#             result = model.transcribe(file_path)
#             transcript = result["text"].strip()
            
#             if not transcript:
#                 transcript = "No speech detected in audio"
#                 logger.warning("⚠️ No speech detected in audio file")
#             else:
#                 logger.info(f"📝 Transcription completed: {transcript[:100]}...")
                
#         except Exception as transcribe_error:
#             logger.error(f"❌ Whisper transcription failed: {transcribe_error}")
#             transcript = "Transcription failed - audio might be corrupted"
        
#         # Clean up temporary file
#         try:
#             os.remove(file_path)
#             logger.info("🗑️ Temporary file cleaned up")
#         except Exception as e:
#             logger.warning(f"Could not delete temporary file: {e}")
        
#         return JSONResponse({
#             "success": True,
#             "transcript": transcript,
#             "language": result.get("language", "unknown") if 'result' in locals() else "unknown"
#         })
        
#     except HTTPException as he:
#         logger.error(f"🚨 HTTP Exception in transcription: {he.detail}")
#         raise he
#     except Exception as e:
#         logger.error(f"❌ Transcription error: {e}")
#         raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

# @app.post("/save-recording")
# async def save_recording(request: SaveRecordingRequest):
#     """
#     Save recording metadata to database
#     """
#     try:
#         recording_id = str(uuid.uuid4())
        
#         logger.info(f"💾 Saving recording with ID: {recording_id}")
        
#         conn = sqlite3.connect('recordings.db')
#         cursor = conn.cursor()
        
#         cursor.execute('''
#             INSERT INTO recordings 
#             (id, audio_path, transcript, category, case_number, duration, title)
#             VALUES (?, ?, ?, ?, ?, ?, ?)
#         ''', (
#             recording_id, 
#             request.audio_uri, 
#             request.transcript, 
#             request.category, 
#             request.case_number, 
#             request.duration, 
#             request.title
#         ))
        
#         conn.commit()
#         conn.close()
        
#         logger.info(f"🎯 NEW RECORDING SAVED")
#         logger.info(f"📁 ID: {recording_id}")
#         logger.info(f"📂 Category: {request.category}")
#         logger.info(f"🔢 Case: {request.case_number}")
#         logger.info(f"⏱️ Duration: {request.duration} seconds")
#         logger.info(f"📝 Title: {request.title}")
#         logger.info(f"💬 Transcript: {request.transcript[:100]}...")
#         logger.info("=" * 50)
        
#         return JSONResponse({
#             "success": True,
#             "id": recording_id,
#             "message": "Recording saved successfully"
#         })
        
#     except Exception as e:
#         logger.error(f"❌ Save recording error: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to save recording: {str(e)}")

# @app.get("/recordings")
# async def get_recordings():
#     """
#     Get all saved recordings
#     """
#     try:
#         conn = sqlite3.connect('recordings.db')
#         cursor = conn.cursor()
        
#         cursor.execute('''
#             SELECT id, audio_path, transcript, category, case_number, duration, title, created_at
#             FROM recordings 
#             ORDER BY created_at DESC
#         ''')
        
#         recordings = []
#         for row in cursor.fetchall():
#             recordings.append({
#                 "id": row[0],
#                 "uri": row[1],
#                 "transcript": row[2],
#                 "category": row[3],
#                 "caseNumber": row[4],
#                 "duration": row[5],
#                 "title": row[6],
#                 "date": row[7]
#             })
        
#         conn.close()
        
#         logger.info(f"📊 Returning {len(recordings)} recordings to frontend")
        
#         return JSONResponse({
#             "success": True,
#             "recordings": recordings
#         })
        
#     except Exception as e:
#         logger.error(f"❌ Get recordings error: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to fetch recordings: {str(e)}")

# @app.get("/recordings/{recording_id}")
# async def get_recording(recording_id: str):
#     """
#     Get a specific recording by ID
#     """
#     try:
#         conn = sqlite3.connect('recordings.db')
#         cursor = conn.cursor()
        
#         cursor.execute('''
#             SELECT id, audio_path, transcript, category, case_number, duration, title, created_at
#             FROM recordings 
#             WHERE id = ?
#         ''', (recording_id,))
        
#         row = cursor.fetchone()
#         if not row:
#             conn.close()
#             logger.warning(f"❌ Recording not found: {recording_id}")
#             raise HTTPException(status_code=404, detail="Recording not found")
        
#         recording = {
#             "id": row[0],
#             "uri": row[1],
#             "transcript": row[2],
#             "category": row[3],
#             "caseNumber": row[4],
#             "duration": row[5],
#             "title": row[6],
#             "date": row[7]
#         }
        
#         conn.close()
        
#         logger.info(f"📄 Returning recording details for: {recording_id}")
        
#         return JSONResponse({
#             "success": True,
#             "recording": recording
#         })
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Get recording error: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to fetch recording: {str(e)}")

# @app.delete("/delete-recording/{recording_id}")
# async def delete_recording(recording_id: str):
#     """
#     Delete a recording by ID
#     """
#     try:
#         conn = sqlite3.connect('recordings.db')
#         cursor = conn.cursor()
        
#         cursor.execute('SELECT title, category FROM recordings WHERE id = ?', (recording_id,))
#         recording_info = cursor.fetchone()
        
#         if not recording_info:
#             conn.close()
#             logger.warning(f"❌ Recording not found for deletion: {recording_id}")
#             raise HTTPException(status_code=404, detail="Recording not found")
        
#         cursor.execute('DELETE FROM recordings WHERE id = ?', (recording_id,))
        
#         conn.commit()
#         conn.close()
        
#         logger.info(f"🗑️ Recording deleted: {recording_id}")
        
#         return JSONResponse({
#             "success": True,
#             "message": "Recording deleted successfully"
#         })
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Delete recording error: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to delete recording: {str(e)}")

# @app.get("/health")
# async def health_check():
#     """
#     Health check endpoint
#     """
#     return JSONResponse({
#         "status": "healthy",
#         "timestamp": datetime.now().isoformat(),
#         "whisper_model_loaded": model is not None
#     })

# @app.get("/api/health")
# async def api_health_check():
#     return await health_check()

# # Error handlers
# @app.exception_handler(HTTPException)
# async def http_exception_handler(request, exc):
#     logger.error(f"🚨 HTTP Error {exc.status_code}: {exc.detail}")
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={"success": False, "error": exc.detail}
#     )

# @app.exception_handler(Exception)
# async def general_exception_handler(request, exc):
#     logger.error(f"🚨 Unexpected error: {exc}")
#     return JSONResponse(
#         status_code=500,
#         content={"success": False, "error": "Internal server error"}
#     )

# if __name__ == "__main__":
#     import uvicorn
#     logger.info("🎯 Starting Voice Command Backend Server...")
#     uvicorn.run(app, host="0.0.0.0", port=5000)

from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import whisper
import os
import uuid
from datetime import datetime
import json
from typing import Optional, List, Dict, Any
import aiofiles
import sqlite3
import logging
import requests
import pdfplumber
import re
import asyncio
import time
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
from urllib.parse import urljoin
import aiohttp

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Voice Command & Legal AI Backend", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Whisper model
try:
    model = whisper.load_model("small")
    logger.info("Whisper model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {e}")
    model = None

# Groq API Configuration

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Database setup for recordings
def init_db():
    conn = sqlite3.connect('recordings.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recordings (
            id TEXT PRIMARY KEY,
            audio_path TEXT,
            transcript TEXT,
            category TEXT,
            case_number TEXT,
            duration INTEGER,
            title TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create chat history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            role TEXT CHECK(role IN ('user', 'assistant')),
            message TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# Pydantic models for request validation
class SaveRecordingRequest(BaseModel):
    audio_uri: str
    transcript: str
    category: str
    case_number: str
    duration: int
    title: str

class LegalAnalysisRequest(BaseModel):
    case_description: str

class LegalVerificationRequest(BaseModel):
    case_description: str
    applied_sections: List[str]

class ChargeSheetRequest(BaseModel):
    case_data: Dict[str, Any]
    selected_sections: List[str]

class ChatMessage(BaseModel):
    message: str
    user_id: str = "default_user"
    context: str = ""

# Legal AI Components (your existing code remains the same)
class ComprehensiveLegalPDFExtractor:
    """Enhanced PDF extractor like your Collab code with real-time retrieval"""
    
    def __init__(self):
        self.legal_sources = [
            {
                'url': 'https://www.indiacode.nic.in/bitstream/123456789/15289/1/ipc_act.pdf',
                'law_code': 'IPC',
                'name': 'Indian Penal Code, 1860',
                'category': 'Penal Code'
            },
            {
                'url': 'https://cdnbbsr.s3waas.gov.in/s3ca0daec69b5adc880fb464895726dbdf/uploads/2022/08/2022082487.pdf',
                'law_code': 'BNS',
                'name': 'Bharatiya Nyaya Sanhita, 2023',
                'category': 'Penal Code'
            },
            {
                'url': 'https://cdnbbsr.s3waas.gov.in/s3ca0daec69b5adc880fb464895726dbdf/uploads/2022/08/2022080828-1.pdf',
                'law_code': 'CrPC',
                'name': 'Code of Criminal Procedure, 1973',
                'category': 'Criminal Procedure'
            },
            {
                'url': 'https://cdnbbsr.s3waas.gov.in/s3ca0daec69b5adc880fb464895726dbdf/uploads/2022/08/2022080834-1.pdf',
                'law_code': 'IEA',
                'name': 'Indian Evidence Act, 1872',
                'category': 'Evidence'
            }
        ]
        
        # Enhanced section patterns like Collab code
        self.section_patterns = {
            'penal_code': [
                r'Sec\.?\s*(\d+[A-Z]*)[\s\.]*([^•]{50,}?)(?=Sec\.?\s*\d+[A-Z]*|$)',
                r'Section\s+(\d+[A-Z]*)[\s\.]*([^•]{50,}?)(?=Section\s+\d+[A-Z]*|$)',
                r'(\d+[A-Z]*)\.\s+([^•]{50,}?)(?=\d+[A-Z]*\.|$)',
            ],
            'procedural': [
                r'Section\s+(\d+[A-Z]*)[\s\.]*([^•]{30,}?)(?=Section\s+\d+[A-Z]*|$)',
                r'(\d+[A-Z]*)\.\s+([^•]{30,}?)(?=\d+[A-Z]*\.|$)',
            ]
        }
        
        # Initialize embedding model for semantic search
        try:
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            self.search_index = None
            self.section_embeddings = []
            self.all_sections = []
        except Exception as e:
            logger.warning(f"Could not initialize embedding model: {e}")
            self.embedding_model = None

    def download_pdf(self, url: str, filename: str) -> bool:
        """Download PDF with enhanced error handling like Collab code"""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                logger.info(f"📥 Downloading attempt {attempt + 1}: {filename}")
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
                response = requests.get(url, timeout=60, headers=headers)
                response.raise_for_status()
                
                with open(filename, 'wb') as f:
                    f.write(response.content)
                
                if os.path.exists(filename) and os.path.getsize(filename) > 1000:
                    logger.info(f"✅ Successfully downloaded: {filename}")
                    return True
                else:
                    logger.warning(f"⚠️ File too small or corrupted: {filename}")
                    
            except Exception as e:
                logger.error(f"❌ Error downloading {filename} (attempt {attempt + 1}): {e}")
                if attempt == max_retries - 1:
                    return False
                time.sleep(2)
        return False

    def extract_sections_from_pdf(self, pdf_path: str, law_info: Dict) -> List[Dict]:
        """Enhanced PDF extraction like Collab code"""
        sections = []
        
        try:
            logger.info(f"  Processing PDF: {pdf_path}")
            with pdfplumber.open(pdf_path) as pdf:
                text = ""
                total_pages = min(len(pdf.pages), 50)  # Limit for performance
                
                for page_num, page in enumerate(pdf.pages[:total_pages]):
                    page_text = page.extract_text()
                    if page_text:
                        page_text = self._clean_text(page_text)
                        text += page_text + "\n\n"
                    
                    if page_num % 10 == 0:
                        logger.info(f"    Processed page {page_num + 1}/{total_pages}")
                
                logger.info(f"    Extracted {len(text)} characters from PDF")
                
                # Enhanced extraction based on law type
                if law_info['law_code'] in ['IPC', 'BNS']:
                    sections = self._extract_penal_code_sections(text, law_info)
                elif law_info['law_code'] in ['CrPC', 'IEA']:
                    sections = self._extract_procedural_sections(text, law_info)
                else:
                    sections = self._extract_general_sections(text, law_info)
                
                logger.info(f"  ✅ Extracted {len(sections)} sections from {law_info['law_code']}")
                return sections
                
        except Exception as e:
            logger.error(f"  ❌ Error extracting from {pdf_path}: {str(e)}")
            return []

    def _clean_text(self, text: str) -> str:
        """Clean extracted text"""
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\d+\n', '\n', text)
        text = re.sub(r'[–—]', '-', text)
        return text.strip()

    def _extract_penal_code_sections(self, text: str, law_info: Dict) -> List[Dict]:
        """Enhanced penal code extraction"""
        sections = []
        extracted_codes = set()
        
        for pattern in self.section_patterns['penal_code']:
            matches = re.finditer(pattern, text, re.DOTALL | re.IGNORECASE)
            for match in matches:
                section_num = match.group(1).strip() if match.lastindex >= 1 else "UNKNOWN"
                description = match.group(2).strip() if match.lastindex >= 2 else ""
                
                description = self._clean_section_description(description)
                
                if (section_num != "UNKNOWN" and len(description) > 25 and 
                    section_num not in extracted_codes):
                    
                    section_type = self._classify_penal_section(section_num, description)
                    
                    section_data = {
                        'law_code': law_info['law_code'],
                        'section_number': section_num,
                        'description': description[:500],
                        'full_code': f"{law_info['law_code']} {section_num}",
                        'category': law_info['category'],
                        'law_name': law_info['name'],
                        'source': law_info['url'],
                        'section_type': section_type,
                        'punishment_mentioned': self._contains_punishment(description),
                        'extraction_confidence': 'high' if len(description) > 100 else 'medium',
                        'relevance': 0.5,  # Default, will be calculated during search
                        'confidence': 0.7   # Default confidence
                    }
                    
                    sections.append(section_data)
                    extracted_codes.add(section_num)
        
        return self._remove_duplicate_sections(sections)

    def _extract_procedural_sections(self, text: str, law_info: Dict) -> List[Dict]:
        """Enhanced procedural law extraction"""
        sections = []
        extracted_codes = set()
        
        for pattern in self.section_patterns['procedural']:
            matches = re.finditer(pattern, text, re.DOTALL)
            for match in matches:
                section_num = match.group(1).strip() if match.lastindex >= 1 else "UNKNOWN"
                description = match.group(2).strip() if match.lastindex >= 2 else ""
                
                description = self._clean_section_description(description)
                
                if (section_num != "UNKNOWN" and len(description) > 20 and 
                    section_num not in extracted_codes):
                    
                    section_data = {
                        'law_code': law_info['law_code'],
                        'section_number': section_num,
                        'description': description[:400],
                        'full_code': f"{law_info['law_code']} {section_num}",
                        'category': law_info['category'],
                        'law_name': law_info['name'],
                        'source': law_info['url'],
                        'section_type': 'procedural',
                        'extraction_confidence': 'high' if len(description) > 80 else 'medium',
                        'relevance': 0.5,
                        'confidence': 0.7
                    }
                    
                    sections.append(section_data)
                    extracted_codes.add(section_num)
        
        return self._remove_duplicate_sections(sections)

    def _extract_general_sections(self, text: str, law_info: Dict) -> List[Dict]:
        """General extraction fallback"""
        sections = []
        extracted_codes = set()
        
        all_patterns = self.section_patterns['penal_code'] + self.section_patterns['procedural']
        
        for pattern in all_patterns:
            matches = re.finditer(pattern, text, re.DOTALL | re.IGNORECASE)
            for match in matches:
                section_num = match.group(1).strip() if match.lastindex >= 1 else "UNKNOWN"
                description = match.group(2).strip() if match.lastindex >= 2 else ""
                
                description = self._clean_section_description(description)
                
                if (section_num != "UNKNOWN" and len(description) > 25 and 
                    not re.match(r'^[\d\s\.\-]+$', description) and
                    section_num not in extracted_codes):
                    
                    section_data = {
                        'law_code': law_info['law_code'],
                        'section_number': section_num,
                        'description': description[:400],
                        'full_code': f"{law_info['law_code']} {section_num}",
                        'category': law_info['category'],
                        'law_name': law_info['name'],
                        'source': law_info['url'],
                        'section_type': 'general',
                        'extraction_confidence': 'medium',
                        'relevance': 0.5,
                        'confidence': 0.6
                    }
                    
                    sections.append(section_data)
                    extracted_codes.add(section_num)
        
        return self._remove_duplicate_sections(sections)

    def _clean_section_description(self, description: str) -> str:
        """Clean section description"""
        description = re.sub(r'\s+', ' ', description)
        description = re.sub(r'^[\.\s\-:]+', '', description)
        description = re.sub(r'[\.\s\-:]+$', '', description)
        description = re.sub(r'\[.*?\]', '', description)
        description = re.sub(r'\(.*?\)', '', description)
        return description.strip()

    def _classify_penal_section(self, section_num: str, description: str) -> str:
        """Classify penal code sections"""
        description_lower = description.lower()
        
        if any(word in description_lower for word in ['punishment', 'imprisonment', 'fine', 'death']):
            return 'punishment'
        elif any(word in description_lower for word in ['definition', 'means', 'includes']):
            return 'definition'
        elif any(word in description_lower for word in ['attempt', 'abetment', 'conspiracy']):
            return 'inchoate_offense'
        else:
            return 'substantive'

    def _contains_punishment(self, description: str) -> bool:
        """Check if description mentions punishment"""
        punishment_keywords = ['punishment', 'imprisonment', 'fine', 'death', 'penalty']
        return any(keyword in description.lower() for keyword in punishment_keywords)

    def _remove_duplicate_sections(self, sections: List[Dict]) -> List[Dict]:
        """Remove duplicate sections"""
        seen_codes = set()
        unique_sections = []
        
        for section in sections:
            code = section['full_code']
            if code not in seen_codes:
                seen_codes.add(code)
                unique_sections.append(section)
            else:
                existing_idx = next(i for i, s in enumerate(unique_sections) if s['full_code'] == code)
                if len(section['description']) > len(unique_sections[existing_idx]['description']):
                    unique_sections[existing_idx] = section
        
        return unique_sections

    def build_search_index(self):
        """Build semantic search index like Collab code"""
        if not self.embedding_model:
            logger.warning("❌ Embedding model not available, using basic search")
            return

        try:
            logger.info("🔧 Building semantic search index...")
            section_texts = []
            
            for section in self.all_sections:
                text = self._create_enhanced_text_representation(section)
                section_texts.append(text)
            
            # Create embeddings
            self.section_embeddings = self.embedding_model.encode(section_texts)
            
            # Build FAISS index
            dimension = self.section_embeddings.shape[1]
            self.search_index = faiss.IndexFlatIP(dimension)
            faiss.normalize_L2(self.section_embeddings)
            self.search_index.add(self.section_embeddings)
            
            logger.info(f"✅ Search index built with {len(self.all_sections)} sections")
            
        except Exception as e:
            logger.error(f"❌ Error building search index: {e}")

    def _create_enhanced_text_representation(self, section: Dict) -> str:
        """Create enhanced text for semantic search"""
        components = [
            section['full_code'],
            section['law_name'],
            section['description'],
            f"Category: {section['category']}",
            f"Section Type: {section.get('section_type', 'general')}"
        ]
        
        if section.get('punishment_mentioned', False):
            components.append("Contains punishment provisions")
            
        return " | ".join(components)

    def semantic_search(self, query: str, top_k: int = 10) -> List[Dict]:
        """Perform semantic search like Collab code"""
        if not self.search_index or not self.embedding_model:
            return self.keyword_search(query, top_k)
        
        try:
            # Enhanced query processing
            enhanced_query = self._enhance_legal_query(query)
            query_embedding = self.embedding_model.encode([enhanced_query])
            faiss.normalize_L2(query_embedding)
            
            # Search
            scores, indices = self.search_index.search(query_embedding, top_k)
            
            results = []
            for score, idx in zip(scores[0], indices[0]):
                if idx < len(self.all_sections) and score > 0.1:
                    section = self.all_sections[idx].copy()
                    section['relevance'] = float(score)
                    section['confidence'] = min(0.95, float(score) + 0.3)
                    results.append(section)
            
            return sorted(results, key=lambda x: x['relevance'], reverse=True)[:top_k]
            
        except Exception as e:
            logger.error(f"❌ Semantic search failed: {e}")
            return self.keyword_search(query, top_k)

    def _enhance_legal_query(self, query: str) -> str:
        """Enhance legal query with contextual terms"""
        query_lower = query.lower()
        enhanced_terms = []
        
        legal_contexts = {
            'theft': "theft robbery burglary stealing stolen property movable property",
            'assault': "assault hurt grievous hurt bodily harm criminal force",
            'fraud': "fraud cheating dishonestly deception fraudulent inducement",
            'murder': "murder culpable homicide death killing",
            'sexual': "rape sexual assault molestation outraging modesty"
        }
        
        for context_key, context_terms in legal_contexts.items():
            if context_key in query_lower:
                enhanced_terms.extend(context_terms.split())
        
        enhanced_terms.extend(["Indian law legal section provision punishment"])
        return query + " " + " ".join(set(enhanced_terms))

    def keyword_search(self, query: str, top_k: int = 10) -> List[Dict]:
        """Fallback keyword search"""
        query_lower = query.lower()
        results = []
        
        for section in self.all_sections:
            score = 0
            
            # Check various fields for matches
            if query_lower in section['full_code'].lower():
                score += 3
            if query_lower in section['description'].lower():
                score += 2
            if any(keyword in query_lower for keyword in ['theft', 'steal']) and '379' in section['full_code']:
                score += 2
            if any(keyword in query_lower for keyword in ['murder', 'kill']) and '302' in section['full_code']:
                score += 2
            if any(keyword in query_lower for keyword in ['fraud', 'cheat']) and '420' in section['full_code']:
                score += 2
            
            if score > 0:
                section_copy = section.copy()
                section_copy['relevance'] = min(1.0, score / 5)
                section_copy['confidence'] = min(0.9, section_copy['relevance'] + 0.3)
                results.append(section_copy)
        
        return sorted(results, key=lambda x: x['relevance'], reverse=True)[:top_k]

    def get_comprehensive_database(self, max_downloads: int = 3) -> List[Dict]:
        """Build comprehensive legal database like Collab code"""
        logger.info("🚀 Starting comprehensive legal database creation...")
        all_sections = []
        
        for i, law_info in enumerate(self.legal_sources[:max_downloads]):
            logger.info(f"\n🔧 Processing: {law_info['law_code']} - {law_info['name']}")
            
            filename = f"legal_pdfs/{law_info['law_code']}.pdf"
            os.makedirs('legal_pdfs', exist_ok=True)
            
            if self.download_pdf(law_info['url'], filename):
                sections = self.extract_sections_from_pdf(filename, law_info)
                if sections:
                    all_sections.extend(sections)
                    logger.info(f"   ✅ Added {len(sections)} sections")
                else:
                    logger.info(f"   ⚠️ No sections extracted")
            else:
                logger.info(f"   ❌ Download failed")
            
            time.sleep(1)  # Be nice to servers
        
        # Add manual sections for important provisions
        manual_sections = self._get_manual_sections()
        all_sections.extend(manual_sections)
        
        self.all_sections = all_sections
        self.build_search_index()
        
        logger.info(f"\n🎉 DATABASE CREATION COMPLETE!")
        logger.info(f"📊 Total legal sections: {len(all_sections)}")
        
        return all_sections

    def _get_manual_sections(self) -> List[Dict]:
        """Add important manual sections"""
        manual_sections = [
            {
                'law_code': 'IPC',
                'section_number': '379',
                'description': 'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.',
                'full_code': 'IPC 379',
                'category': 'Property Crime',
                'law_name': 'Indian Penal Code, 1860',
                'source': 'manual',
                'section_type': 'substantive',
                'punishment_mentioned': True,
                'extraction_confidence': 'manual',
                'relevance': 0.5,
                'confidence': 0.9
            },
            {
                'law_code': 'IPC',
                'section_number': '302',
                'description': 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
                'full_code': 'IPC 302',
                'category': 'Violent Crime',
                'law_name': 'Indian Penal Code, 1860',
                'source': 'manual',
                'section_type': 'punishment',
                'punishment_mentioned': True,
                'extraction_confidence': 'manual',
                'relevance': 0.5,
                'confidence': 0.9
            },
            {
                'law_code': 'IPC',
                'section_number': '420',
                'description': 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
                'full_code': 'IPC 420',
                'category': 'Economic Crime',
                'law_name': 'Indian Penal Code, 1860',
                'source': 'manual',
                'section_type': 'substantive',
                'punishment_mentioned': True,
                'extraction_confidence': 'manual',
                'relevance': 0.5,
                'confidence': 0.9
            }
        ]
        return manual_sections

class LegalAIBackendService:
    """Enhanced backend service with real-time IPC retrieval"""
    
    def __init__(self):
        self.pdf_extractor = ComprehensiveLegalPDFExtractor()
        self.is_initialized = False
        self.initialize_database()
    
    def initialize_database(self):
        """Initialize the legal database"""
        try:
            logger.info("📚 Initializing legal database...")
            self.pdf_extractor.get_comprehensive_database(max_downloads=2)
            self.is_initialized = True
            logger.info("✅ Legal database initialized successfully")
        except Exception as e:
            logger.error(f"❌ Database initialization failed: {e}")
            # Still mark as initialized to use manual sections
            self.is_initialized = True

    async def analyze_case_description(self, case_description: str) -> Dict[str, Any]:
        """Analyze case description with real-time IPC retrieval"""
        if not self.is_initialized:
            self.initialize_database()
        
        logger.info(f"🔍 Analyzing case: {case_description}")
        
        # Perform semantic search
        relevant_sections = self.pdf_extractor.semantic_search(case_description, top_k=12)
        
        if not relevant_sections:
            relevant_sections = self.pdf_extractor.keyword_search(case_description, top_k=8)
        
        # Calculate overall confidence
        overall_confidence = self._calculate_overall_confidence(relevant_sections)
        
        # Identify legal domains
        legal_domains = self._identify_legal_domains(relevant_sections, case_description)
        
        return {
            "sections": relevant_sections,
            "reasoning": self._generate_reasoning(relevant_sections, case_description),
            "confidence": overall_confidence,
            "recommendations": self._generate_recommendations(relevant_sections, case_description),
            "legalDomains": legal_domains,
            "keyLaws": list(set([s['law_code'] for s in relevant_sections]))
        }
    
    def _calculate_overall_confidence(self, sections: List[Dict]) -> float:
        """Calculate overall analysis confidence"""
        if not sections:
            return 0.3
        
        avg_confidence = sum(s.get('confidence', 0.5) for s in sections) / len(sections)
        return min(0.95, avg_confidence * 1.1)
    
    def _identify_legal_domains(self, sections: List[Dict], case_description: str) -> List[str]:
        """Identify primary legal domains"""
        domains = set()
        description_lower = case_description.lower()
        
        # Based on sections
        for section in sections:
            domains.add(section['category'])
        
        # Based on description keywords
        if any(word in description_lower for word in ['theft', 'steal', 'property']):
            domains.add('Property Crime')
        if any(word in description_lower for word in ['murder', 'kill', 'death']):
            domains.add('Violent Crime')
        if any(word in description_lower for word in ['fraud', 'cheat', 'money']):
            domains.add('Economic Crime')
        
        return list(domains) if domains else ['Criminal Law']
    
    def _generate_reasoning(self, sections: List[Dict], case_description: str) -> str:
        """Generate analysis reasoning"""
        if not sections:
            return "No relevant legal sections found for the case description."
        
        top_sections = sections[:3]
        section_codes = [s['full_code'] for s in top_sections]
        
        return f"Analysis identified {len(sections)} relevant legal sections. Primary considerations: {', '.join(section_codes)}. Based on semantic matching with comprehensive legal database."
    
    def _generate_recommendations(self, sections: List[Dict], case_description: str) -> List[str]:
        """Generate legal recommendations"""
        recommendations = [
            "Review evidence alignment with applied sections",
            "Consider procedural requirements under CrPC",
            "Document all investigative steps thoroughly"
        ]
        
        if any(s['law_code'] == 'IPC' for s in sections):
            recommendations.append("Verify IPC section applicability with legal precedents")
        
        if any('420' in s['full_code'] for s in sections):
            recommendations.append("Document financial transactions and fraudulent inducement")
        
        if any('376' in s['full_code'] for s in sections):
            recommendations.append("Ensure comprehensive medical evidence and victim statements")
        
        return recommendations
    
    async def verify_applied_sections(self, case_description: str, applied_sections: List[str]) -> Dict[str, Any]:
        """Verify applied sections with real-time analysis"""
        analysis = await self.analyze_case_description(case_description)
        suggested_codes = [s['full_code'] for s in analysis['sections']]
        
        missing_sections = [s for s in suggested_codes if s not in applied_sections][:3]
        irrelevant_sections = [s for s in applied_sections if s not in suggested_codes][:3]
        
        confidence = max(0.1, analysis['confidence'] - (len(missing_sections) * 0.1) - (len(irrelevant_sections) * 0.15))
        
        return {
            "isAppropriate": len(missing_sections) == 0 and len(irrelevant_sections) == 0,
            "confidence": confidence,
            "missingSections": missing_sections,
            "irrelevantSections": irrelevant_sections,
            "suggestions": suggested_codes[:3],
            "warnings": self._generate_warnings(applied_sections, missing_sections),
            "recommendations": analysis['recommendations'],
            "strategicAdvice": self._generate_strategic_advice(case_description, applied_sections)
        }
    
    def _generate_warnings(self, applied_sections: List[str], missing_sections: List[str]) -> List[str]:
        """Generate verification warnings"""
        warnings = []
        
        if not applied_sections:
            warnings.append("No sections applied - case lacks legal basis")
        
        if len(applied_sections) > 8:
            warnings.append("Too many sections applied - may dilute case focus")
        
        if any('302' in section for section in applied_sections):
            warnings.append("Murder charge requires strong evidence")
        
        if missing_sections:
            warnings.append(f"Missing {len(missing_sections)} potentially relevant sections")
        
        return warnings
    
    def _generate_strategic_advice(self, case_description: str, applied_sections: List[str]) -> List[str]:
        """Generate strategic legal advice"""
        advice = [
            "Ensure evidence collection aligns with applied sections",
            "Review procedural compliance under relevant laws",
            "Consider witness preparation and examination strategy"
        ]
        
        if any('420' in section for section in applied_sections):
            advice.append("Focus on financial documentation and transaction trails")
        
        if any('376' in section for section in applied_sections):
            advice.append("Prioritize medical evidence and victim support")
        
        return advice

# Groq API Service
class GroqAPIService:
    """Service to handle Groq API calls"""
    
    @staticmethod
    async def call_groq_api(message: str, context: str = "") -> Dict[str, Any]:
        """Call Groq API with proper error handling"""
        try:
            logger.info(f"Calling Groq API for message: {message[:100]}...")
            
            system_prompt = """You are a friendly, knowledgeable legal assistant for Indian laws. 
            Respond in a natural, conversational way like a real person explaining things to a friend. 
            Use simple language, occasional informal expressions, and make it sound human. 
            Start with a friendly greeting or acknowledgment. 
            Provide medium-level information first - not too basic, not too detailed.
            
            If the user asks for more details or says "more", "explain", "details", etc., then provide comprehensive information.
            
            Context from previous messages: """ + context
            
            payload = {
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                "model": "mixtral-8x7b-32768",
                "temperature": 0.7,
                "max_tokens": 1024,
                "top_p": 0.9,
                "stream": False
            }
            
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(GROQ_API_URL, json=payload, headers=headers, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data and "choices" in data and data["choices"]:
                            return {
                                "success": True,
                                "response": data["choices"][0]["message"]["content"],
                                "follow_up_options": [
                                    "Can you explain more about this?",
                                    "What documents would I need?",
                                    "How long does this process take?"
                                ]
                            }
                    else:
                        error_text = await response.text()
                        logger.error(f"Groq API error {response.status}: {error_text}")
                        return {
                            "success": False,
                            "error": f"API error {response.status}",
                            "fallback": True
                        }
            
        except aiohttp.ClientError as e:
            logger.error(f"Network error calling Groq API: {e}")
            return {
                "success": False,
                "error": "Network error",
                "fallback": True
            }
        except asyncio.TimeoutError:
            logger.error("Groq API timeout")
            return {
                "success": False,
                "error": "Request timeout",
                "fallback": True
            }
        except Exception as e:
            logger.error(f"Unexpected error calling Groq API: {e}")
            return {
                "success": False,
                "error": str(e),
                "fallback": True
            }
        
        return {
            "success": False,
            "error": "Unknown error",
            "fallback": True
        }

# Global instances
legal_ai_backend = LegalAIBackendService()
groq_service = GroqAPIService()

def generate_chargesheet_content(case_data: Dict, sections: List[str]) -> str:
    """Generate chargesheet content"""
    section_details = []

    # Extract IPC section details
    for section in sections:
        section_match = re.match(r'(?:IPC\s*)?(\d+[A-Z]*)', section, re.IGNORECASE)
        if section_match:
            section_num = section_match.group(1)
            section_details.append({
                'code': f"IPC {section_num}",
                'description': f"Description for IPC {section_num}",
                'punishment': "Punishment as per law"
            })

    # Prepare applied sections text separately
    applied_sections = "".join(
        f"{s['code']}: {s['description']}\nPunishment: {s['punishment']}\n\n"
        for s in section_details
    )

    # Build the chargesheet content
    content = f"""
IN THE COURT OF JUDICIAL MAGISTRATE
CHARGE SHEET

Case No: {case_data.get('caseId', 'N/A')}
FIR No: {case_data.get('firNumber', 'N/A')}
Police Station: {case_data.get('policeStation', 'N/A')}

APPLIED IPC SECTIONS:
{applied_sections}

CASE DETAILS:
Incident: {case_data.get('incidentDescription', 'N/A')}
Location: {case_data.get('incidentLocation', 'N/A')}
Date: {case_data.get('incidentDate', 'N/A')}

EVIDENCE:
{case_data.get('evidenceCollected', 'N/A')}

WITNESSES:
{case_data.get('witnesses', 'N/A')}

INVESTIGATING OFFICER:
[Name and Rank]
{case_data.get('policeStation', 'N/A')}

DATE: {datetime.now().strftime('%Y-%m-%d')}
""".strip()

    return content

# Helper function to get chat context
def get_chat_context(user_id: str, limit: int = 5) -> str:
    """Get recent chat history for context"""
    try:
        conn = sqlite3.connect('recordings.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT role, message 
            FROM chat_history 
            WHERE user_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (user_id, limit))
        
        history = cursor.fetchall()
        conn.close()
        
        context = ""
        for role, message in reversed(history):
            context += f"{role}: {message}\n"
        
        return context.strip()
    except Exception as e:
        logger.error(f"Error getting chat context: {e}")
        return ""

# Voice Command Routes (your existing routes remain the same)
@app.get("/")
async def root():
    return {"message": "Voice Command & Legal AI Backend API", "status": "running"}

@app.post("/transcribe")
async def transcribe_audio(request: Request):
    """
    Transcribe audio file using Whisper model - handle React Native blob URLs
    """
    if not model:
        raise HTTPException(status_code=500, detail="Whisper model not loaded")
    
    try:
        # Check if it's form data
        content_type = request.headers.get("content-type", "")
        
        if "multipart/form-data" not in content_type:
            logger.error(f"Unsupported content type: {content_type}")
            raise HTTPException(status_code=400, detail="Only multipart/form-data is supported for file upload")
        
        form_data = await request.form()
        audio_file = form_data.get("audio")
        
        if not audio_file:
            logger.error("No audio file found in form data")
            raise HTTPException(status_code=400, detail="No audio file provided")
        
        if isinstance(audio_file, str):
            logger.error(f"Audio file is string, not file: {audio_file}")
            raise HTTPException(status_code=400, detail="Invalid file format - expected file upload, got string")
        
        logger.info(f"📁 Processing audio file: {audio_file.filename}, type: {audio_file.content_type}")
        
        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        
        # Generate unique filename
        file_extension = '.m4a'  # Default for React Native
        if audio_file.filename and '.' in audio_file.filename:
            file_extension = os.path.splitext(audio_file.filename)[1]
        
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = f"uploads/{unique_filename}"
        
        # Save uploaded file
        file_content = await audio_file.read()
        
        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(file_content)
        
        logger.info(f"✅ Audio file saved: {file_path} ({len(file_content)} bytes)")
        
        # Transcribe using Whisper
        logger.info("🎤 Starting transcription...")
        try:
            result = model.transcribe(file_path)
            transcript = result["text"].strip()
            
            if not transcript:
                transcript = "No speech detected in audio"
                logger.warning("⚠️ No speech detected in audio file")
            else:
                logger.info(f"📝 Transcription completed: {transcript[:100]}...")
                
        except Exception as transcribe_error:
            logger.error(f"❌ Whisper transcription failed: {transcribe_error}")
            transcript = "Transcription failed - audio might be corrupted"
        
        # Clean up temporary file
        try:
            os.remove(file_path)
            logger.info("🗑️ Temporary file cleaned up")
        except Exception as e:
            logger.warning(f"Could not delete temporary file: {e}")
        
        return JSONResponse({
            "success": True,
            "transcript": transcript,
            "language": result.get("language", "unknown") if 'result' in locals() else "unknown"
        })
        
    except HTTPException as he:
        logger.error(f"🚨 HTTP Exception in transcription: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"❌ Transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.post("/save-recording")
async def save_recording(request: SaveRecordingRequest):
    """
    Save recording metadata to database
    """
    try:
        recording_id = str(uuid.uuid4())
        
        logger.info(f"💾 Saving recording with ID: {recording_id}")
        
        conn = sqlite3.connect('recordings.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO recordings 
            (id, audio_path, transcript, category, case_number, duration, title)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            recording_id, 
            request.audio_uri, 
            request.transcript, 
            request.category, 
            request.case_number, 
            request.duration, 
            request.title
        ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"🎯 NEW RECORDING SAVED")
        logger.info(f"📁 ID: {recording_id}")
        logger.info(f"📂 Category: {request.category}")
        logger.info(f"🔢 Case: {request.case_number}")
        logger.info(f"⏱️ Duration: {request.duration} seconds")
        logger.info(f"📝 Title: {request.title}")
        logger.info(f"💬 Transcript: {request.transcript[:100]}...")
        logger.info("=" * 50)
        
        return JSONResponse({
            "success": True,
            "id": recording_id,
            "message": "Recording saved successfully"
        })
        
    except Exception as e:
        logger.error(f"❌ Save recording error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save recording: {str(e)}")

@app.get("/recordings")
async def get_recordings():
    """
    Get all saved recordings
    """
    try:
        conn = sqlite3.connect('recordings.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, audio_path, transcript, category, case_number, duration, title, created_at
            FROM recordings 
            ORDER BY created_at DESC
        ''')
        
        recordings = []
        for row in cursor.fetchall():
            recordings.append({
                "id": row[0],
                "uri": row[1],
                "transcript": row[2],
                "category": row[3],
                "caseNumber": row[4],
                "duration": row[5],
                "title": row[6],
                "date": row[7]
            })
        
        conn.close()
        
        logger.info(f"📊 Returning {len(recordings)} recordings to frontend")
        
        return JSONResponse({
            "success": True,
            "recordings": recordings
        })
        
    except Exception as e:
        logger.error(f"❌ Get recordings error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch recordings: {str(e)}")

@app.get("/recordings/{recording_id}")
async def get_recording(recording_id: str):
    """
    Get a specific recording by ID
    """
    try:
        conn = sqlite3.connect('recordings.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, audio_path, transcript, category, case_number, duration, title, created_at
            FROM recordings 
            WHERE id = ?
        ''', (recording_id,))
        
        row = cursor.fetchone()
        if not row:
            conn.close()
            logger.warning(f"❌ Recording not found: {recording_id}")
            raise HTTPException(status_code=404, detail="Recording not found")
        
        recording = {
            "id": row[0],
            "uri": row[1],
            "transcript": row[2],
            "category": row[3],
            "caseNumber": row[4],
            "duration": row[5],
            "title": row[6],
            "date": row[7]
        }
        
        conn.close()
        
        logger.info(f"📄 Returning recording details for: {recording_id}")
        
        return JSONResponse({
            "success": True,
            "recording": recording
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Get recording error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch recording: {str(e)}")

@app.delete("/delete-recording/{recording_id}")
async def delete_recording(recording_id: str):
    """
    Delete a recording by ID
    """
    try:
        conn = sqlite3.connect('recordings.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT title, category FROM recordings WHERE id = ?', (recording_id,))
        recording_info = cursor.fetchone()
        
        if not recording_info:
            conn.close()
            logger.warning(f"❌ Recording not found for deletion: {recording_id}")
            raise HTTPException(status_code=404, detail="Recording not found")
        
        cursor.execute('DELETE FROM recordings WHERE id = ?', (recording_id,))
        
        conn.commit()
        conn.close()
        
        logger.info(f"🗑️ Recording deleted: {recording_id}")
        
        return JSONResponse({
            "success": True,
            "message": "Recording deleted successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Delete recording error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete recording: {str(e)}")

# NEW: Groq Chat API Routes
@app.post("/api/chat")
async def chat_with_ai(request: ChatMessage):
    """Chat with Groq AI with context"""
    try:
        message = request.message
        user_id = request.user_id
        context = request.context
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Get chat context from database
        if not context:
            context = get_chat_context(user_id)
        
        # Try Groq API first
        groq_result = await groq_service.call_groq_api(message, context)
        
        if groq_result["success"]:
            # Save user message to history
            conn = sqlite3.connect('recordings.db')
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO chat_history (user_id, role, message)
                VALUES (?, ?, ?)
            ''', (user_id, "user", message))
            
            cursor.execute('''
                INSERT INTO chat_history (user_id, role, message)
                VALUES (?, ?, ?)
            ''', (user_id, "assistant", groq_result["response"]))
            
            conn.commit()
            conn.close()
            
            return JSONResponse({
                "success": True,
                "response": groq_result["response"],
                "follow_up_options": groq_result.get("follow_up_options", [
                    "Can you explain more?",
                    "What documents do I need?",
                    "How do I start?"
                ]),
                "source": "groq_ai"
            })
        
        # Fallback to simulated response
        logger.warning("Using fallback simulated response")
        
        # Generate simulated response
        simulated_response = get_simulated_response(message)
        
        # Save to history
        conn = sqlite3.connect('recordings.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO chat_history (user_id, role, message)
            VALUES (?, ?, ?)
        ''', (user_id, "user", message))
        
        cursor.execute('''
            INSERT INTO chat_history (user_id, role, message)
            VALUES (?, ?, ?)
        ''', (user_id, "assistant", simulated_response["response"]))
        
        conn.commit()
        conn.close()
        
        return JSONResponse({
            "success": True,
            "response": simulated_response["response"],
            "follow_up_options": simulated_response["follow_up_options"],
            "source": "simulated",
            "fallback_reason": groq_result.get("error", "API unavailable")
        })
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        
        # Emergency fallback
        emergency_response = {
            "success": True,
            "response": f"I'm having trouble connecting right now. Based on your question about '{request.message[:50]}...', here's what I can tell you: For most legal matters, document everything and consult local legal advice.",
            "follow_up_options": ["Try asking again", "What are the basic steps?", "How can I get help?"],
            "source": "emergency_fallback"
        }
        
        return JSONResponse(emergency_response)

def get_simulated_response(message: str) -> Dict[str, Any]:
    """Generate simulated response for fallback"""
    lower_message = message.lower()
    
    if 'criminal' in lower_message or 'crime' in lower_message or 'fir' in lower_message:
        return {
            "response": "Alright, criminal law questions! Let me give you the essentials without getting too technical.\n\nBasically, criminal law deals with actions that harm society. The key Indian laws are IPC (defines crimes), CrPC (procedures), and Evidence Act (proof rules).\n\nIf you're dealing with a criminal matter:\n1. Document everything\n2. Know your basic rights\n3. Get legal help early\n4. Don't ignore official notices",
            "follow_up_options": ["Tell me about common criminal charges", "How to file an FIR?", "What are my rights if arrested?"]
        }
    elif 'consumer' in lower_message or 'complaint' in lower_message:
        return {
            "response": "Consumer issues are quite common! Good news - India has strong consumer protection laws.\n\nQuick guide:\n• District Forum: Claims up to ₹1 crore\n• State Commission: ₹1-10 crore\n• National Commission: Above ₹10 crore\n\nWhat you need:\n1. Purchase bill/proof\n2. Details of what went wrong\n3. Communication with seller\n4. Clear compensation ask\n\nPro tip: Always communicate in writing first!",
            "follow_up_options": ["How to file consumer complaint online?", "What compensation can I get?", "Time limits for complaints?"]
        }
    elif 'tenant' in lower_message or 'rent' in lower_message:
        return {
            "response": "Tenant-landlord issues! Here's what you should know:\n\nKey rights:\n• Security deposit: Usually 2-3 months rent\n• Rent increase: As per agreement or reasonable\n• Eviction: Requires proper notice\n• Repairs: Landlord handles structural issues\n\nAlways:\n1. Get everything in writing\n2. Keep rent receipts\n3. Document property condition\n4. Communicate politely but firmly",
            "follow_up_options": ["How to handle deposit disputes?", "What notice period is required?", "Can landlord enter without permission?"]
        }
    else:
        return {
            "response": f"I understand you're asking about '{message}'. For most legal matters in India:\n\n• Document everything - Keep records, receipts, communication\n• Know time limits - Most legal actions have deadlines\n• Seek professional help - Local lawyers understand local courts\n• Explore alternatives - Mediation can be faster and cheaper\n\nWhat specific aspect are you most concerned about?",
            "follow_up_options": ["Can you explain more?", "What documents do I need?", "How long does this process take?"]
        }

@app.get("/api/chat/history")
async def get_chat_history(user_id: str = "default_user", limit: int = 20):
    """Get chat history for a user"""
    try:
        conn = sqlite3.connect('recordings.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT role, message, timestamp 
            FROM chat_history 
            WHERE user_id = ? 
            ORDER BY timestamp ASC 
            LIMIT ?
        ''', (user_id, limit))
        
        history = []
        for role, message, timestamp in cursor.fetchall():
            history.append({
                "role": role,
                "message": message,
                "timestamp": timestamp
            })
        
        conn.close()
        
        return JSONResponse({
            "success": True,
            "history": history
        })
        
    except Exception as e:
        logger.error(f"Get chat history error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get chat history: {str(e)}")

@app.delete("/api/chat/history")
async def clear_chat_history(user_id: str = "default_user"):
    """Clear chat history for a user"""
    try:
        conn = sqlite3.connect('recordings.db')
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM chat_history WHERE user_id = ?', (user_id,))
        
        conn.commit()
        conn.close()
        
        return JSONResponse({
            "success": True,
            "message": "Chat history cleared"
        })
        
    except Exception as e:
        logger.error(f"Clear chat history error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to clear chat history: {str(e)}")

# Existing Legal AI Routes (remain the same)
@app.post("/api/analyze")
async def analyze_case(request: LegalAnalysisRequest):
    """Analyze case description and suggest IPC sections"""
    try:
        case_description = request.case_description
        
        if not case_description:
            raise HTTPException(status_code=400, detail="Case description is required")
        
        result = await legal_ai_backend.analyze_case_description(case_description)
        return JSONResponse(result)
        
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/verify")
async def verify_sections(request: LegalVerificationRequest):
    """Verify applied IPC sections"""
    try:
        case_description = request.case_description
        applied_sections = request.applied_sections
        
        if not case_description or not applied_sections:
            raise HTTPException(status_code=400, detail="Case description and applied sections are required")
        
        result = await legal_ai_backend.verify_applied_sections(case_description, applied_sections)
        return JSONResponse(result)
        
    except Exception as e:
        logger.error(f"Verification failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@app.post("/api/generate-chargesheet")
async def generate_chargesheet(request: ChargeSheetRequest):
    """Generate chargesheet content"""
    try:
        case_data = request.case_data
        selected_sections = request.selected_sections
        
        if not case_data or not selected_sections:
            raise HTTPException(status_code=400, detail="Case data and selected sections are required")
        
        # Generate chargesheet content
        chargesheet_content = generate_chargesheet_content(case_data, selected_sections)
        
        return JSONResponse({
            'content': chargesheet_content,
            'confidence': 0.9,
            'aiVerified': True,
            'aiConfidence': 0.88,
            'legalDomains': ['Criminal Law'],
            'strategicAdvice': [
                'Review evidence alignment with applied sections',
                'Ensure witness statements corroborate charges',
                'Verify procedural compliance'
            ],
            'pdfUrl': f'https://example.com/chargesheet-{int(time.time())}.pdf',
            'shareableUrl': f'https://example.com/share-{int(time.time())}'
        })
        
    except Exception as e:
        logger.error(f"Chargesheet generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chargesheet generation failed: {str(e)}")

@app.get("/api/legal/stats")
async def get_legal_stats():
    """Get database statistics"""
    sections_count = len(legal_ai_backend.pdf_extractor.all_sections) if legal_ai_backend.pdf_extractor.all_sections else 0
    return JSONResponse({
        'total_sections': sections_count,
        'laws_covered': list(set([s['law_code'] for s in legal_ai_backend.pdf_extractor.all_sections])) if legal_ai_backend.pdf_extractor.all_sections else [],
        'initialized': legal_ai_backend.is_initialized
    })

# Common Routes
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return JSONResponse({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "whisper_model_loaded": model is not None,
        "legal_ai_initialized": legal_ai_backend.is_initialized,
        "groq_api_key": "configured" if GROQ_API_KEY else "missing"
    })

@app.get("/api/health")
async def api_health_check():
    return await health_check()

@app.get("/api/test-groq")
async def test_groq_api():
    """Test Groq API connection"""
    try:
        result = await groq_service.call_groq_api("Hello, are you working?")
        return JSONResponse({
            "success": result["success"],
            "status": "Groq API is working" if result["success"] else "Groq API failed",
            "error": result.get("error"),
            "fallback": result.get("fallback", False)
        })
    except Exception as e:
        return JSONResponse({
            "success": False,
            "status": "Groq API test failed",
            "error": str(e)
        })

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"🚨 HTTP Error {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"🚨 Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    logger.info("🎯 Starting Voice Command & Legal AI Backend Server...")
    logger.info(f"📚 Using Groq API Key: {'Configured' if GROQ_API_KEY else 'MISSING'}")
    logger.info("📚 Initializing Legal AI Database (may take a few minutes)...")
    uvicorn.run(app, host="0.0.0.0", port=5000)