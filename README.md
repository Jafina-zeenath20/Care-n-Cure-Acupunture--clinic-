# Care n Cure Acupuncture Clinic

Static website with a FastAPI-backed AI assistant using Google Gemini (via `google-genai`).

Local development:

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\Activate.ps1 on Windows PowerShell
pip install -r requirements.txt
```

2. Set the Gemini API key (PowerShell):

```powershell
$env:GEMINI_API_KEY="YOUR_API_KEY"
uvicorn api.index:app --reload
```

Or run with Vercel locally:

```bash
npm install -g vercel
vercel dev
```

Do not commit `.env` containing secrets.
