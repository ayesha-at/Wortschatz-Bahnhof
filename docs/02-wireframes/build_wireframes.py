from PIL import Image, ImageDraw, ImageFont
import os

W, H = 375, 720
BG = (255,255,255)
LINE = (60,60,60)
LINE_LT = (150,150,150)
FILL_LT = (235,235,235)
FILL_MD = (210,210,210)
TXT = (40,40,40)
TXT_LT = (130,130,130)

def font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

F_LABEL = font(10)
F_SMALL = font(11)
F_BODY  = font(13)
F_H2    = font(15, bold=True)
F_H1    = font(20, bold=True)

def new_canvas(title, screen_num, total=5):
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    # phone frame
    d.rectangle([0,0,W-1,H-1], outline=LINE, width=2)
    # top meta bar (annotation, not part of the UI itself)
    d.rectangle([0,0,W,26], fill=(20,20,20))
    d.text((10,6), f"WIREFRAME {screen_num}/{total} — {title}", font=F_LABEL, fill=(255,255,255))
    return img, d

def box(d, xy, fill=None, outline=LINE, width=1, dash=False):
    if dash:
        x0,y0,x1,y1 = xy
        step = 6
        x = x0
        while x < x1:
            d.line([(x,y0),(min(x+step*0.6,x1),y0)], fill=outline, width=width)
            d.line([(x,y1),(min(x+step*0.6,x1),y1)], fill=outline, width=width)
            x += step
        y = y0
        while y < y1:
            d.line([(x0,y),(x0,min(y+step*0.6,y1))], fill=outline, width=width)
            d.line([(x1,y),(x1,min(y+step*0.6,y1))], fill=outline, width=width)
            y += step
        if fill: d.rectangle(xy, fill=fill)
        # redraw fill under dashed border properly
        if fill:
            d.rectangle(xy, fill=fill)
            x = x0
            while x < x1:
                d.line([(x,y0),(min(x+step*0.6,x1),y0)], fill=outline, width=width)
                d.line([(x,y1),(min(x+step*0.6,x1),y1)], fill=outline, width=width)
                x += step
            y = y0
            while y < y1:
                d.line([(x0,y),(x0,min(y+step*0.6,y1))], fill=outline, width=width)
                d.line([(x1,y),(x1,min(y+step*0.6,y1))], fill=outline, width=width)
                y += step
    else:
        d.rectangle(xy, fill=fill, outline=outline, width=width)

def text_lines(d, xy, w, n=1, fill=LINE_LT, gap=6, h=8):
    x0,y0 = xy
    for i in range(n):
        lw = w if i < n-1 else w*0.6
        d.rectangle([x0, y0+i*(h+gap), x0+lw, y0+i*(h+gap)+h], fill=fill)

def label(d, xy, text, font=F_LABEL, fill=TXT_LT, anchor=None):
    d.text(xy, text, font=font, fill=fill, anchor=anchor)

def centered_text(d, box_xy, text, fnt=F_BODY, fill=TXT):
    x0,y0,x1,y1 = box_xy
    bbox = d.textbbox((0,0), text, font=fnt)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    d.text(((x0+x1-tw)/2, (y0+y1-th)/2 - bbox[1]), text, font=fnt, fill=fill)

def header_block(d, active_tab=0):
    """Shared header: title, stats, progress bar, gleis tabs, filter chips.
    Returns y-offset where content area begins."""
    y = 34
    # header card
    box(d, [12,y,W-12,y+150], fill=FILL_LT, outline=LINE)
    d.text((22,y+10), "WORTSCHATZ-BAHNHOF", font=F_H2, fill=TXT)
    d.text((22,y+30), "eyebrow / subtitle", font=F_LABEL, fill=TXT_LT)
    # stat chips top-right
    box(d, [W-90,y+8,W-52,y+34], fill=(255,255,255))
    centered_text(d, [W-90,y+8,W-52,y+34], "streak", fnt=F_LABEL, fill=TXT_LT)
    box(d, [W-46,y+8,W-24,y+34], fill=(255,255,255))
    # progress bar
    box(d, [22, y+52, W-22, y+58], fill=(255,255,255))
    box(d, [22, y+52, 22+int((W-44)*0.35), y+58], fill=FILL_MD)
    label(d, (22, y+62), "progress label", font=F_LABEL)
    # gleis tabs
    tab_w = (W-44)/3
    for i in range(3):
        x0 = 22 + i*tab_w
        fill = FILL_MD if i==active_tab else (255,255,255)
        box(d, [x0, y+82, x0+tab_w-6, y+118], fill=fill)
        centered_text(d, [x0, y+82, x0+tab_w-6, y+100], f"GLEIS {i+1}", fnt=F_LABEL, fill=TXT)
        centered_text(d, [x0, y+98, x0+tab_w-6, y+118], ["Karteikarten","Artikel-Quiz","Sortierbahnhof"][i], fnt=F_LABEL, fill=TXT_LT)
    # filter chips
    cx = 22
    for lbl,wd in [("ALL",34),("DER",36),("DIE",34),("DAS",34),("DUE ONLY",58)]:
        box(d, [cx,y+128,cx+wd,y+146], fill=(255,255,255))
        centered_text(d, [cx,y+128,cx+wd,y+146], lbl, fnt=F_LABEL, fill=TXT_LT)
        cx += wd+6
    return y+164

# ---------------- 1. HOME / DASHBOARD ----------------
img, d = new_canvas("Home / Dashboard (= persistent header)", 1)
y = header_block(d, active_tab=0)
box(d, [12,y,W-12,H-24], outline=LINE_LT, dash=True)
centered_text(d, [12,y,W-12,H-24], "( content area — see\nscreens 2 / 3 / 4 )", fnt=F_SMALL, fill=TXT_LT)
label(d, (12, H-18), "* not a separate route — always visible", font=F_LABEL)
img.save('/home/claude/vocab/wireframes/1-home-dashboard.png')

# ---------------- 2. PRACTICE (FLASHCARDS) ----------------
img, d = new_canvas("Practice — Flashcards (Gleis 1)", 2)
y = header_block(d, active_tab=0)
cy = y+14
# session bar
box(d, [22,cy,W-22,cy+6], fill=(255,255,255))
box(d, [22,cy,22+60,cy+6], fill=FILL_MD)
label(d, (W-70,cy-2), "n / total", font=F_LABEL)
cy += 26
# flashcard
card_h = 250
box(d, [30,cy,W-30,cy+card_h], fill=(255,255,255), width=2)
centered_text(d, [30,cy+16,W-30,cy+34], "SUBSTANTIV / NOUN", fnt=F_LABEL, fill=TXT_LT)
centered_text(d, [30,cy+50,W-30,cy+90], "Tisch", fnt=F_H1, fill=TXT)
box(d, [ (W)/2-60, cy+110, (W)/2+60, cy+150], outline=LINE)
centered_text(d, [(W)/2-60, cy+110, (W)/2+60, cy+150], "···", fnt=F_H2, fill=TXT_LT)
text_lines(d, (60, cy+170), W-120, n=1)
label(d, (60, cy+188), "translation (hidden until reveal)", font=F_LABEL)
box(d, [60, cy+205, W-60, cy+235], outline=LINE_LT, dash=True)
centered_text(d, [60, cy+205, W-60, cy+235], "plural note (conditional)", fnt=F_LABEL, fill=TXT_LT)
cy += card_h+16
box(d, [30,cy,W-30,cy+40], fill=FILL_LT)
centered_text(d, [30,cy,W-30,cy+40], "ARTIKEL ZEIGEN / SHOW ARTICLE", fnt=F_SMALL)
cy += 50
box(d, [30,cy,(W)/2-4,cy+44], outline=LINE)
centered_text(d, [30,cy,(W)/2-4,cy+44], "↺ Practice\nagain", fnt=F_LABEL)
box(d, [(W)/2+4,cy,W-30,cy+44], outline=LINE)
centered_text(d, [(W)/2+4,cy,W-30,cy+44], "✓ Got it!", fnt=F_LABEL)
img.save('/home/claude/vocab/wireframes/2-practice-flashcards.png')

# ---------------- 3. TEST (ARTICLE QUIZ) ----------------
img, d = new_canvas("Test — Article Quiz (Gleis 2)", 3)
y = header_block(d, active_tab=1)
cy = y+14
cx = 22
for lbl in ["Correct: n","Streak: n","Total: n"]:
    box(d, [cx,cy,cx+95,cy+20], outline=LINE_LT)
    centered_text(d, [cx,cy,cx+95,cy+20], lbl, fnt=F_LABEL, fill=TXT_LT)
    cx += 100
cy += 40
centered_text(d, [22,cy,W-22,cy+50], "Tisch", fnt=F_H1, fill=TXT)
cy += 60
box(d, [22,cy,W-22,cy+24], outline=LINE_LT, dash=True)
centered_text(d, [22,cy,W-22,cy+24], "(English hint — optional)", fnt=F_LABEL, fill=TXT_LT)
cy += 40
box(d, [22,cy,W-22,cy+30], outline=LINE_LT, dash=True)
centered_text(d, [22,cy,W-22,cy+30], "feedback text (post-answer)", fnt=F_LABEL, fill=TXT_LT)
cy += 46
bw = (W-44-16)/3
for i,lbl in enumerate(["DER","DIE","DAS"]):
    x0 = 22+i*(bw+8)
    box(d, [x0,cy,x0+bw,cy+64], outline=LINE, width=2)
    centered_text(d, [x0,cy,x0+bw,cy+64], lbl, fnt=F_H2)
cy += 80
box(d, [22,cy,W-22,cy+40], fill=FILL_LT)
centered_text(d, [22,cy,W-22,cy+40], "WEITER / NEXT →", fnt=F_SMALL)
img.save('/home/claude/vocab/wireframes/3-test-article-quiz.png')

# ---------------- 4. GAME (SORTIERBAHNHOF) ----------------
img, d = new_canvas("Game — Sortierbahnhof (Gleis 3)", 4)
y = header_block(d, active_tab=2)
cy = y+14
box(d, [22,cy,90,cy+40], outline=LINE, width=2)
centered_text(d, [22,cy,90,cy+40], "0:45", fnt=F_H2)
box(d, [W-110,cy,W-22,cy+40], outline=LINE_LT)
centered_text(d, [W-110,cy,W-22,cy+40], "Score\nn", fnt=F_LABEL, fill=TXT_LT)
cy += 70
centered_text(d, [22,cy,W-22,cy+50], "Socke", fnt=F_H1, fill=TXT)
cy += 70
bw = (W-44-16)/3
for i,lbl in enumerate(["DER","DIE","DAS"]):
    x0 = 22+i*(bw+8)
    box(d, [x0,cy,x0+bw,cy+64], outline=LINE, width=2)
    centered_text(d, [x0,cy,x0+bw,cy+64], lbl, fnt=F_H2)
cy += 100
box(d, [40,cy,W-40,cy+120], outline=LINE_LT, dash=True)
centered_text(d, [40,cy,W-40,cy+120], "end-of-round summary\n(score, best, replay)\n— shown after timer hits 0", fnt=F_SMALL, fill=TXT_LT)
img.save('/home/claude/vocab/wireframes/4-game-sortierbahnhof.png')

# ---------------- 5. PROGRESS (does not exist yet) ----------------
img, d = new_canvas("Progress — proposed, NOT YET BUILT", 5)
y = 34
box(d, [12,y,W-12,y+40], fill=(30,30,30))
d.text((22,y+12), "⚠ THIS SCREEN DOES NOT EXIST YET", font=F_SMALL, fill=(255,255,255))
y += 56
box(d, [12,y,W-12,y+90], fill=FILL_LT, outline=LINE)
d.text((22,y+10), "Mastery by article", font=F_SMALL, fill=TXT)
bw = (W-24-44-2*10)/3
for i,(lbl) in enumerate(["DER","DIE","DAS"]):
    x0 = 22+i*(bw+10)
    box(d, [x0,y+34,x0+bw,y+34+40], outline=LINE_LT)
    centered_text(d, [x0,y+34,x0+bw,y+34+40], f"{lbl}\nx/y", fnt=F_LABEL, fill=TXT_LT)
y += 106
box(d, [12,y,W-12,y+70], fill=FILL_LT, outline=LINE)
d.text((22,y+10), "Streak calendar", font=F_SMALL, fill=TXT)
for i in range(7):
    x0 = 22+i*((W-44)/7)
    box(d, [x0,y+30,x0+(W-44)/7-4,y+30+24], outline=LINE_LT, fill=(255,255,255) if i%2 else FILL_MD)
y += 86
box(d, [12,y,W-12,y+150], fill=FILL_LT, outline=LINE)
d.text((22,y+10), '"Anschluss verpasst" — mistakes list', font=F_SMALL, fill=TXT)
for i in range(3):
    yy = y+34+i*36
    box(d, [22,yy,W-22,yy+26], outline=LINE_LT)
    text_lines(d, (30,yy+8), 120, n=1)
    label(d, (W-60,yy+8), "n/m", font=F_LABEL)
y += 166
label(d, (12, y+6), "See DECISIONS.md Step 3 for why this is deferred, not skipped.", font=F_LABEL)
img.save('/home/claude/vocab/wireframes/5-progress-proposed.png')

print("done, files:", os.listdir('/home/claude/vocab/wireframes'))
