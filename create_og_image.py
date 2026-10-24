import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

def create_og_banner():
    W, H = 1200, 630
    bg_path = '/Users/chandangowda/.gemini/antigravity-ide/brain/139129a4-4299-4661-b4a6-34f5f9c36110/og_cyber_bg_1792842729513.jpg'
    profile_path = '/tmp/profile.jpeg'
    badge_path = 'frontend/public/certificates/claude-architect-badge-1024.png'
    
    # 1. Base canvas & Background
    bg = Image.open(bg_path).convert('RGBA')
    bg = ImageOps.fit(bg, (W, H), method=Image.Resampling.LANCZOS)
    
    # Base darkening
    dim = Image.new('RGBA', (W, H), (5, 7, 10, 160))
    base = Image.alpha_composite(bg, dim)
    
    # Ambient glows
    glow_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow_layer)
    gdraw.ellipse([(-60, -60), (450, 400)], fill=(204, 255, 0, 40))
    gdraw.ellipse([(650, 250), (1250, 650)], fill=(0, 240, 255, 35))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(80))
    base = Image.alpha_composite(base, glow_layer)
    
    # Fonts
    orbitron_bold = ImageFont.truetype('/tmp/Orbitron.ttf', 50)
    orbitron_small = ImageFont.truetype('/tmp/Orbitron.ttf', 15)
    mono_bold = ImageFont.truetype('/tmp/JetBrainsMono.ttf', 18)
    mono_regular = ImageFont.truetype('/tmp/JetBrainsMono.ttf', 15)
    mono_small = ImageFont.truetype('/tmp/JetBrainsMono.ttf', 13)
    mono_large = ImageFont.truetype('/tmp/JetBrainsMono.ttf', 21)
    
    # Colors
    NEON_LIME = (204, 255, 0, 255)       # #CCFF00
    NEON_CYAN = (0, 240, 255, 255)       # #00F0FF
    TEXT_WHITE = (248, 249, 250, 255)    # #F8F9FA
    TEXT_MUTED = (175, 185, 200, 255)
    BORDER_LIME = (204, 255, 0, 180)
    
    # 2. UI layer
    ui_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    uidraw = ImageDraw.Draw(ui_layer)
    
    # Outer cyber frame
    pad = 32
    uidraw.rectangle([(pad, pad), (W - pad, H - pad)], outline=(255, 255, 255, 30), width=1)
    
    # Corner brackets (Cyberpunk HUD)
    blen = 28
    corners = [(pad, pad), (W - pad, pad), (pad, H - pad), (W - pad, H - pad)]
    for cx, cy in corners:
        dx = blen if cx == pad else -blen
        dy = blen if cy == pad else -blen
        uidraw.line([(cx, cy), (cx + dx, cy)], fill=NEON_LIME, width=2)
        uidraw.line([(cx, cy), (cx, cy + dy)], fill=NEON_LIME, width=2)

    # TOP BAR
    top_y = 54
    uidraw.ellipse([(pad + 24, top_y + 4), (pad + 36, top_y + 16)], fill=NEON_LIME)
    uidraw.text((pad + 46, top_y), "SYSTEM STATUS: ONLINE // VERIFIED ARCHITECT", font=mono_small, fill=NEON_LIME)
    
    domain_text = "chandan-ai-engineer.vercel.app"
    bbox = mono_small.getbbox(domain_text)
    tr_w = bbox[2] - bbox[0]
    uidraw.text((W - pad - 24 - tr_w, top_y), domain_text, font=mono_small, fill=(255, 255, 255, 160))
    uidraw.line([(pad + 24, top_y + 26), (W - pad - 24, top_y + 26)], fill=(255, 255, 255, 30), width=1)

    # LEFT PANEL - Solid dark glass plate for maximum text legibility
    left_x = pad + 24
    panel_w = 690
    panel_h = 390
    panel_y = 110
    uidraw.rounded_rectangle([(left_x, panel_y), (left_x + panel_w, panel_y + panel_h)], radius=6, fill=(5, 8, 10, 235), outline=(255, 255, 255, 25), width=1)
    
    # Inner left content
    cx = left_x + 28
    
    # Role label
    uidraw.text((cx, panel_y + 24), "> GENAI DATA ENGINEER · LLM ARCHITECT", font=mono_bold, fill=NEON_LIME)
    
    # Name
    uidraw.text((cx, panel_y + 56), "CHANDAN GOWDA AH", font=orbitron_bold, fill=TEXT_WHITE)
    
    # Core headline
    uidraw.text((cx, panel_y + 124), "Designing AI Agents · RAG Systems · Data Pipelines", font=mono_large, fill=(235, 240, 250, 255))
    
    # Bio description
    desc_y = panel_y + 160
    uidraw.text((cx, desc_y), "Claude Certified Architect with 3+ years engineering enterprise AI,", font=mono_regular, fill=TEXT_MUTED)
    uidraw.text((cx, desc_y + 24), "scalable data pipelines, Copilot Studio agents & autonomous platforms.", font=mono_regular, fill=TEXT_MUTED)
    
    # FEATURE PILLS
    pills = [
        ("> CLAUDE CERTIFIED ARCHITECT", NEON_LIME, (204, 255, 0, 30)),
        ("> 10+ PRODUCTION AI PROJECTS & AGENTS", NEON_CYAN, (0, 240, 255, 26)),
        ("> AWS · DATABRICKS · GOOGLE CLOUD · OCI", TEXT_WHITE, (255, 255, 255, 22)),
    ]
    
    pill_y = panel_y + 225
    for ptext, border_c, bg_c in pills:
        bbox = mono_regular.getbbox(ptext)
        pw = bbox[2] - bbox[0] + 32
        ph = 36
        uidraw.rounded_rectangle([(cx, pill_y), (cx + pw, pill_y + ph)], radius=4, fill=bg_c, outline=border_c, width=1)
        uidraw.text((cx + 16, pill_y + 9), ptext, font=mono_regular, fill=ptext.startswith("> CLAUDE") and NEON_LIME or TEXT_WHITE)
        pill_y += 46

    # BOTTOM FOOTER BAR
    bot_y = 515
    uidraw.line([(pad + 24, bot_y - 12), (W - pad - 24, bot_y - 12)], fill=(255, 255, 255, 25), width=1)
    uidraw.text((pad + 24, bot_y), "INTERACTIVE 3D PORTFOLIO · AUDIO INTERFACE · CERTIFIED CREDENTIALS", font=mono_small, fill=NEON_LIME)
    uidraw.text((pad + 24, bot_y + 22), "Built with React 19, Framer Motion, Three.js & Tailwind CSS", font=mono_small, fill=(255, 255, 255, 120))

    # RIGHT COLUMN - HUD CARD
    card_w = 370
    card_h = 390
    card_x = W - pad - card_w - 24
    card_y = 110
    
    uidraw.rounded_rectangle([(card_x, card_y), (card_x + card_w, card_y + card_h)], radius=6, fill=(8, 12, 10, 235), outline=BORDER_LIME, width=1)
    
    # Header strip inside card
    uidraw.rounded_rectangle([(card_x, card_y), (card_x + card_w, card_y + 34)], radius=4, fill=(204, 255, 0, 30))
    uidraw.text((card_x + 14, card_y + 9), "ENGINEER PROFILE // ID: CGAH-04", font=mono_small, fill=NEON_LIME)
    uidraw.text((card_x + card_w - 74, card_y + 9), "VERIFIED", font=mono_small, fill=NEON_CYAN)

    # Composite UI onto base
    base = Image.alpha_composite(base, ui_layer)
    draw = ImageDraw.Draw(base)

    # Profile photo & Claude Badge
    center_y = card_y + 52
    
    if os.path.exists(profile_path):
        prof = Image.open(profile_path).convert('RGBA')
        prof_size = 126
        prof = prof.resize((prof_size, prof_size), Image.Resampling.LANCZOS)
        
        mask = Image.new('L', (prof_size, prof_size), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.ellipse([(0, 0), (prof_size - 1, prof_size - 1)], fill=255)
        
        prof_x = card_x + 30
        prof_y = center_y + 8
        
        ring_pad = 4
        draw.ellipse([(prof_x - ring_pad, prof_y - ring_pad), 
                      (prof_x + prof_size + ring_pad, prof_y + prof_size + ring_pad)], 
                     outline=NEON_LIME, width=2)
        base.paste(prof, (prof_x, prof_y), mask)

    if os.path.exists(badge_path):
        badge = Image.open(badge_path).convert('RGBA')
        b_size = 130
        badge = badge.resize((b_size, b_size), Image.Resampling.LANCZOS)
        badge_x = card_x + card_w - b_size - 24
        badge_y = center_y + 6
        base.paste(badge, (badge_x, badge_y), badge)

    # Sub-card Name & Title
    name_y = card_y + 208
    draw.text((card_x + 20, name_y), "CHANDAN GOWDA AH", font=orbitron_small, fill=TEXT_WHITE)
    draw.text((card_x + 20, name_y + 22), "GenAI & LLM Solutions Specialist", font=mono_small, fill=NEON_LIME)

    # HUD Specs table
    table_y = name_y + 50
    draw.line([(card_x + 20, table_y), (card_x + card_w - 20, table_y)], fill=(255, 255, 255, 30), width=1)
    
    specs = [
        ("EXPERIENCE", "3+ YEARS PRODUCTION"),
        ("AI AGENTS", "7 SHIPPED TO PROD"),
        ("CERTIFICATIONS", "15+ (AWS·GCP·OCI)"),
        ("AVAILABILITY", "OPEN FOR OPPORTUNITIES"),
    ]
    
    sy = table_y + 12
    for label, val in specs:
        draw.text((card_x + 20, sy), label, font=mono_small, fill=(155, 165, 180, 255))
        vbbox = mono_small.getbbox(val)
        vw = vbbox[2] - vbbox[0]
        color = NEON_LIME if label == "AVAILABILITY" else TEXT_WHITE
        draw.text((card_x + card_w - 20 - vw, sy), val, font=mono_small, fill=color)
        sy += 22

    # Save to public/og-image.png
    out_path = 'frontend/public/og-image.png'
    base.convert('RGB').save(out_path, format='PNG', optimize=True)
    # Also save as JPEG for compatibility with any platform requiring .jpg
    base.convert('RGB').save('frontend/public/og-image.jpg', format='JPEG', quality=95)
    print(f"Successfully generated Open Graph banner at {out_path} and og-image.jpg")

if __name__ == '__main__':
    create_og_banner()
