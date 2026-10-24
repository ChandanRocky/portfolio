import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_favicons():
    public_dir = 'frontend/public'
    os.makedirs(public_dir, exist_ok=True)
    
    # 1. Create scalable crisp SVG Favicon
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#CCFF00" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="0"/>
    </radialGradient>
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Background -->
  <rect width="64" height="64" rx="14" fill="#050505"/>
  <rect width="64" height="64" rx="14" fill="url(#glow)"/>
  
  <!-- Outer glowing border -->
  <rect x="2.5" y="2.5" width="59" height="59" rx="12" fill="none" stroke="#CCFF00" stroke-width="2.5" filter="url(#neon-glow)"/>
  
  <!-- Stylized Sci-Fi Monogram "CG" -->
  <text x="32" y="44" 
        font-family="Orbitron, -apple-system, sans-serif" 
        font-size="30" 
        font-weight="900" 
        letter-spacing="-1.5"
        text-anchor="middle" 
        fill="#CCFF00"
        filter="url(#neon-glow)">CG</text>
  
  <!-- Subtle cyan accent indicator dot -->
  <circle cx="51" cy="14" r="2.5" fill="#00F0FF" />
</svg>'''
    
    with open(os.path.join(public_dir, 'favicon.svg'), 'w') as f:
        f.write(svg_content)
    print("Created favicon.svg")

    # 2. Render master high-res raster image (512x512)
    size = 512
    img = Image.new('RGBA', (size, size), (5, 5, 5, 255))
    draw = ImageDraw.Draw(img)
    
    # Outer squircle border
    rad = 110
    draw.rounded_rectangle([(18, 18), (size - 18, size - 18)], radius=rad, fill=(5, 7, 10, 255), outline=(204, 255, 0, 240), width=18)
    
    # Radial glow inside
    glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([(60, 60), (size - 60, size - 60)], fill=(204, 255, 0, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)
    
    # Orbitron Font for CG
    orbitron_cg = ImageFont.truetype('/tmp/Orbitron.ttf', 240)
    
    # Measure text
    text = "CG"
    bbox = orbitron_cg.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    tx = (size - tw) // 2 - bbox[0]
    ty = (size - th) // 2 - bbox[1]
    
    # Draw text glow
    text_glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    tgdraw = ImageDraw.Draw(text_glow)
    tgdraw.text((tx, ty), text, font=orbitron_cg, fill=(204, 255, 0, 200))
    text_glow = text_glow.filter(ImageFilter.GaussianBlur(12))
    img = Image.alpha_composite(img, text_glow)
    
    # Draw crisp text
    draw = ImageDraw.Draw(img)
    draw.text((tx, ty), text, font=orbitron_cg, fill=(204, 255, 0, 255))
    
    # Cyan status dot top right
    draw.ellipse([(size - 85, 45), (size - 55, 75)], fill=(0, 240, 255, 255))
    
    # 3. Export PNG variants
    apple_icon = img.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save(os.path.join(public_dir, 'apple-touch-icon.png'), 'PNG')
    
    icon_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32.save(os.path.join(public_dir, 'favicon-32x32.png'), 'PNG')
    
    icon_16 = img.resize((16, 16), Image.Resampling.LANCZOS)
    icon_16.save(os.path.join(public_dir, 'favicon-16x16.png'), 'PNG')
    
    icon_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join(public_dir, 'android-chrome-192x192.png'), 'PNG')
    img.save(os.path.join(public_dir, 'android-chrome-512x512.png'), 'PNG')
    
    # 4. Multi-resolution favicon.ico
    img.save(os.path.join(public_dir, 'favicon.ico'), format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print("Successfully generated high-definition CG favicons using Orbitron!")

if __name__ == '__main__':
    create_favicons()
