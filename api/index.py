import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from google import genai
from google.genai import types

# ============================================================
# APP
# ============================================================

app = FastAPI(title="Care n Cure AI Assistant", version="1.0.0")

# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ============================================================
# GEMINI
# ============================================================

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable is missing.")

client = genai.Client(api_key=API_KEY)

# ============================================================
# KNOWLEDGE BASE
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

KNOWLEDGE_FILE = os.path.join(BASE_DIR, "knowledge", "clinic.txt")

try:
    with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as file:
        KNOWLEDGE_BASE = file.read()
except Exception as error:
    print("Knowledge base error:", error)
    KNOWLEDGE_BASE = ""

# ============================================================
# SYSTEM INSTRUCTION
# ============================================================

SYSTEM_INSTRUCTION = f"""

You are the official AI customer assistant
for Care n Cure Acupuncture Clinic in Madurai.

Your responsibility is to answer questions about
the clinic using ONLY the knowledge base provided
below.

==============================
STRICT KNOWLEDGE RULE
==============================

You MUST NOT use your general knowledge to answer
questions about Care n Cure.

You MUST NOT invent facts.

You MUST NOT guess.

You MUST NOT make up clinic services,
prices, timings, doctors, qualifications,
treatment outcomes, or policies.

If information is not present in the knowledge base,
say:

"Sorry, I don't have that information in my
knowledge base. Please contact Care n Cure
directly for more information."

==============================
STYLE
==============================

Be polite.
Be professional.
Be warm.
Be concise.
Use easy-to-understand language.
Do not produce unnecessarily long answers.

==============================
MEDICAL SAFETY
==============================

You are not a doctor.
Do not diagnose medical conditions.
Do not prescribe medicines.
Do not provide medication dosages.
Do not promise treatment outcomes.
Do not say that a treatment definitely cures
a disease.
Do not make unsupported medical claims.
For serious or emergency symptoms, encourage
the person to seek appropriate professional
medical care immediately.

==============================
KNOWLEDGE BASE
==============================

{KNOWLEDGE_BASE}

==============================
END KNOWLEDGE BASE
==============================
"""

# ============================================================
# REQUEST MODEL
# ============================================================

class ChatRequest(BaseModel):
    message: str

# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/chat")
async def health():
    return {"status": "online", "service": "Care n Cure AI Assistant"}

# ============================================================
# CHAT
# ============================================================

@app.post("/api/chat")
async def chat(request: ChatRequest):

    question = request.message.strip()

    if not question:
        raise HTTPException(status_code=400, detail="Please enter a question.")

    if len(question) > 1000:
        raise HTTPException(status_code=400, detail="Please keep your question under 1000 characters.")

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=question,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.15,
                max_output_tokens=500
            )
        )

        answer = response.text

        if not answer:
            answer = (
                "Sorry, I couldn't generate a response right now. Please contact Care n Cure directly."
            )

        return {"answer": answer.strip()}

    except Exception as error:
        print("Gemini error:", error)
        raise HTTPException(status_code=500, detail="AI assistant temporarily unavailable.")
