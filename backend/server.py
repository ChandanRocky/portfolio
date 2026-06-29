from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import re
import resend
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend
resend.api_key = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "chandangowdaa.h17@gmail.com")

app = FastAPI()
api_router = APIRouter(prefix="/api")


# --- Models ---
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(default="Portfolio inquiry", max_length=200)
    message: str = Field(..., min_length=10, max_length=4000)


# --- Routes ---
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


def _escape(text: str) -> str:
    return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace('"', "&quot;").replace("\n", "<br>"))


def _build_owner_html(req: ContactRequest) -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:#050505; color:#F8F9FA; padding:24px;">
      <tr><td>
        <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#0a0a0a; border:1px solid #1a1a1a;">
          <tr><td style="padding:24px 24px 8px 24px; border-bottom:1px solid #1a1a1a;">
            <div style="font-size:11px; letter-spacing:0.3em; color:#CCFF00; text-transform:uppercase;">// NEW MESSAGE · PORTFOLIO</div>
            <div style="font-size:22px; color:#fff; margin-top:8px; font-weight:700;">{_escape(req.subject)}</div>
          </td></tr>
          <tr><td style="padding:20px 24px;">
            <table cellpadding="6" cellspacing="0" style="font-size:14px; color:#bbb; width:100%;">
              <tr><td style="color:#8B949E; width:80px;">From</td><td style="color:#fff;">{_escape(req.name)} &lt;{_escape(req.email)}&gt;</td></tr>
              <tr><td style="color:#8B949E;">When</td><td style="color:#fff;">{datetime.now(timezone.utc).strftime('%d %b %Y · %H:%M UTC')}</td></tr>
            </table>
            <hr style="border:none; border-top:1px solid #1a1a1a; margin:16px 0;">
            <div style="font-size:15px; line-height:1.7; color:#e9ecef;">{_escape(req.message)}</div>
          </td></tr>
          <tr><td style="padding:12px 24px 24px 24px; border-top:1px solid #1a1a1a; font-size:11px; color:#666;">
            Reply directly to this email to respond to {_escape(req.name)}.
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


def _build_reply_html(req: ContactRequest) -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:#050505; color:#F8F9FA; padding:24px;">
      <tr><td>
        <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#0a0a0a; border:1px solid #1a1a1a;">
          <tr><td style="padding:24px 24px 8px 24px; border-bottom:1px solid #1a1a1a;">
            <div style="font-size:11px; letter-spacing:0.3em; color:#CCFF00; text-transform:uppercase;">// TRANSMISSION RECEIVED</div>
            <div style="font-size:22px; color:#fff; margin-top:8px; font-weight:700;">Got your message, {_escape(req.name)}.</div>
          </td></tr>
          <tr><td style="padding:20px 24px; font-size:15px; line-height:1.7; color:#e9ecef;">
            <p>Thanks for reaching out — your note just landed in my inbox.</p>
            <p>I personally read every message and usually reply within <b style="color:#CCFF00;">24–48 hours</b>. If it's something time-sensitive, feel free to ping me on LinkedIn too.</p>
            <p style="margin-top:24px; color:#8B949E; font-size:13px;">
              — Chandan Gowda AH<br>
              <span style="color:#666;">GenAI Data Engineer</span>
            </p>
          </td></tr>
          <tr><td style="padding:12px 24px 24px 24px; border-top:1px solid #1a1a1a; font-size:11px; color:#666;">
            This is an automated confirmation. Your message is below for your records.
          </td></tr>
          <tr><td style="padding:12px 24px 24px 24px; background:#070707; font-size:13px; color:#8B949E; border-top:1px solid #1a1a1a;">
            <div style="color:#CCFF00; font-size:10px; letter-spacing:0.3em; text-transform:uppercase; margin-bottom:8px;">// Your message</div>
            <div><b>Subject:</b> {_escape(req.subject)}</div>
            <div style="margin-top:8px; line-height:1.6;">{_escape(req.message)}</div>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


@api_router.post("/contact")
async def contact(req: ContactRequest):
    if not resend.api_key:
        raise HTTPException(status_code=500, detail="Email service not configured")

    # 1) Email to portfolio owner
    owner_params = {
        "from": SENDER_EMAIL,
        "to": [OWNER_EMAIL],
        "reply_to": req.email,
        "subject": f"[Portfolio] {req.subject} — from {req.name}",
        "html": _build_owner_html(req),
    }

    try:
        owner_resp = await asyncio.to_thread(resend.Emails.send, owner_params)
    except Exception as e:
        logger.error(f"Failed to send owner email: {e}")
        raise HTTPException(status_code=500, detail="Could not deliver your message. Please email directly.")

    # 2) Confirmation reply to sender (best-effort, don't fail if blocked)
    reply_params = {
        "from": SENDER_EMAIL,
        "to": [req.email],
        "subject": "✅ Got your message — Chandan Gowda AH",
        "html": _build_reply_html(req),
    }
    try:
        await asyncio.to_thread(resend.Emails.send, reply_params)
    except Exception as e:
        # Resend sandbox / domain not verified often blocks sending to arbitrary recipients.
        # Owner still received the message — log and continue.
        logger.warning(f"Confirmation email skipped: {e}")

    return {
        "status": "ok",
        "message": "Message delivered. I'll get back to you soon.",
        "email_id": owner_resp.get("id"),
    }


# Mount
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
