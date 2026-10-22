#!/usr/bin/env python3
"""Regenerate bilingual CV PDFs: python3 scripts/generate-cv.py.

Requires Python 3.10+ and ReportLab (python3 -m pip install reportlab).
Uses ReportLab's bundled Bitstream Vera fonts, embedded in every PDF.
The content below is the editable, version-controlled source for these PDFs.
The original application-specific .tex file remains unchanged.
"""

from pathlib import Path
from shutil import copyfile
from xml.sax.saxutils import escape

import reportlab
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, HRFlowable, KeepTogether, PageTemplate,
    Paragraph, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
PUBLIC = ROOT / "public" / "cv"
PORTRAIT = ROOT / "assets" / "cv-portrait.jpg"
INK = colors.HexColor("#20283F")
MUTED = colors.HexColor("#596176")
ACCENT = colors.HexColor("#5446A6")
RULE = colors.HexColor("#DDE0EA")
EMAIL = "piazza.loredana@hotmail.com"
LINKEDIN = "https://ch.linkedin.com/in/loredana-piazza"
DOI = "https://doi.org/10.1186/s11671-025-04409-1"
TITLE = (
    "Electrohydrodynamic redox printing vs. physical vapour deposition: "
    "a comparative study of nanoporous Ag morphology and SERS performance"
)

CONTENT = {
    "en": {
        "location": "Zurich, Switzerland", "document": "Curriculum vitae",
        "profile_label": "Profile",
        "profile": "Full-Stack Engineer and Product Owner, motivated by learning new technologies and working on projects with a clear purpose. I want to actively contribute my engineering experience, curiosity and analytical approach as a technical Product Owner. Clear communication and good teamwork are particularly important to me.",
        "experience_label": "Experience",
        "experience": [
            ("10/2025 - present", "Full-Stack Engineer / Product Owner", "PostFinance AG · Bern · ST machbar", "I develop internal applications with Angular and Java/Spring Boot and connect business requirements with technical implementation as a Product Owner. Communicating with stakeholders and sharing knowledge are part of my daily work, including supporting apprentices as a workplace trainer."),
            ("02/2021 - 01/2025", "(Head) Teaching Assistant", "ETH Zurich", "Teaching in computer science and interdisciplinary courses taught me to explain complex topics clearly to people without a technical background. Head Teaching Assistant for Materials and Mechanics in Medicine (09/2024 - 01/2025)."),
        ],
        "education_label": "Education",
        "education": [
            ("09/2022 - 02/2025", "M.Sc. Biomedical Engineering", "ETH Zurich · Specialisation in Bioimaging", "Focus on applied machine learning for MRI and CT. Skills acquired: Python, PyTorch, TensorFlow, SciPy and MATLAB, alongside self-organisation."),
            ("09/2019 - 01/2023", "B.Sc. Health Sciences and Technology", "ETH Zurich", "Focus on medical technology and exoskeletons."),
        ],
        "thesis": "Master's thesis (08/2024 - 02/2025): Compared electrohydrodynamically printed nanoporous silver with samples produced by physical vapour deposition (PVD) to investigate how their nanoscale structure affects surface-enhanced Raman spectroscopy (SERS); see publication below.",
        "project_label": "Software project",
        "project": "I am developing an app that helps business analysts connect notes, hypotheses and evidence, and keep a clear record of their findings.",
        "skills_label": "Skills & languages",
        "skills": [
            ("Development", "Java, Spring Boot, Angular, Python, CI/CD, full-stack development"),
            ("Agentic engineering", "Agentic Software Development, Agent Engineering, Harness Engineering"),
            ("AI tools", "GitHub Copilot (professional); AWS Kiro, OpenAI Codex (personal projects)"),
            ("Methods", "Scrum, Product Ownership, knowledge sharing"),
            ("Languages", "German: native · English: C1/C2"),
        ],
        "certificate_label": "Certification",
        "publication_label": "Publication",
        "certificate": "Professional Scrum Product Owner I (PSPO I)",
        "publication": "Co-author, 2025 · Porenta, Piazza &amp; Spolenak · <i>Discover Nano</i>",
        "interests_label": "Interests",
        "interests": "Jogging, triathlon, flag football, reading, coding and hiking.",
    },
    "de": {
        "location": "Zürich, Schweiz", "document": "Lebenslauf",
        "profile_label": "Profil",
        "profile": "Full-Stack Engineer und Product Ownerin. Mich motivieren das Lernen neuer Technologien und Projekte mit einem klaren Sinn und Zweck. Meine Entwicklungserfahrung, Neugier und analytische Herangehensweise möchte ich als technische Product Ownerin aktiv einbringen. Klare Kommunikation und gute Zusammenarbeit im Team sind mir besonders wichtig.",
        "experience_label": "Berufserfahrung",
        "experience": [
            ("seit 10/2025", "Full-Stack Engineer / Product Owner", "PostFinance AG · Bern · ST machbar", "Ich entwickle interne Anwendungen mit Angular und Java/Spring Boot und verbinde als Product Owner fachliche Anforderungen mit der technischen Umsetzung. Der Austausch mit Stakeholdern und die Weitergabe von Wissen gehören dabei zu meinem Alltag - auch bei der Begleitung von Lernenden als Praxisbildnerin."),
            ("02/2021 - 01/2025", "(Head) Teaching Assistant", "ETH Zürich", "Die Lehrtätigkeit in Informatik und interdisziplinären Kursen hat mich gelehrt, komplexe Themen für Menschen ohne technischen Hintergrund klar zu vermitteln. Head Teaching Assistant im Kurs Materials and Mechanics in Medicine (09/2024 - 01/2025)."),
        ],
        "education_label": "Ausbildung",
        "education": [
            ("09/2022 - 02/2025", "M.Sc. Biomedical Engineering", "ETH Zürich · Vertiefung Bioimaging", "Fokus auf angewandtes maschinelles Lernen für MRT und CT. Kompetenzen: Python, PyTorch, TensorFlow, SciPy und MATLAB; Selbstorganisation."),
            ("09/2019 - 01/2023", "B.Sc. Gesundheitswissenschaften und Technologie", "ETH Zürich", "Fokus auf Medizintechnik und Exoskelette."),
        ],
        "thesis": "Masterarbeit (08/2024 - 02/2025): Vergleich von elektrohydrodynamisch gedrucktem nanoporösem Silber mit mittels physical vapour deposition (PVD) hergestellten Proben zur Untersuchung des Einflusses der Nanostruktur auf surface-enhanced Raman spectroscopy (SERS); siehe Publikation unten.",
        "project_label": "Softwareprojekt",
        "project": "Ich entwickle eine App, die Business Analysts dabei unterstützt, Notizen, Hypothesen und Belege zu verknüpfen und Erkenntnisse nachvollziehbar festzuhalten.",
        "skills_label": "Kompetenzen & Sprachen",
        "skills": [
            ("Entwicklung", "Java, Spring Boot, Angular, Python, CI/CD, Full-Stack-Entwicklung"),
            ("Agentic Engineering", "Agentic Software Development, Agent Engineering, Harness Engineering"),
            ("AI-Werkzeuge", "GitHub Copilot (beruflich); AWS Kiro, OpenAI Codex (private Projekte)"),
            ("Methoden", "Scrum, Product Ownership, Wissensvermittlung"),
            ("Sprachen", "Deutsch: Muttersprache · Englisch: C1/C2"),
        ],
        "certificate_label": "Zertifikat",
        "publication_label": "Publikation",
        "certificate": "Professional Scrum Product Owner I (PSPO I)",
        "publication": "Co-Autorin, 2025 · Porenta, Piazza &amp; Spolenak · <i>Discover Nano</i>",
        "interests_label": "Interessen",
        "interests": "Joggen, Triathlon, Flag Football, Lesen, Coding und Wandern.",
    },
}


def register_fonts():
    font_dir = Path(reportlab.__file__).parent / "fonts"
    for name, file in (("Vera", "Vera.ttf"), ("VeraBold", "VeraBd.ttf"), ("VeraItalic", "VeraIt.ttf")):
        pdfmetrics.registerFont(TTFont(name, str(font_dir / file)))
    pdfmetrics.registerFontFamily("Vera", normal="Vera", bold="VeraBold", italic="VeraItalic", boldItalic="VeraBold")


def build(lang):
    data = CONTENT[lang]
    heading_before, heading_after = (3.5, 3) if lang == "de" else (5, 4)
    body_leading = 11.8 if lang == "de" else 12.1
    styles = {
        "body": ParagraphStyle("body", fontName="Vera", fontSize=9.0, leading=body_leading, textColor=INK, alignment=TA_LEFT),
        "title": ParagraphStyle("title", fontName="VeraBold", fontSize=26, leading=31, textColor=INK),
        "role": ParagraphStyle("role", fontName="Vera", fontSize=11.5, leading=17, textColor=MUTED),
        "contact": ParagraphStyle("contact", fontName="Vera", fontSize=8.4, leading=12.5, textColor=MUTED),
        "heading": ParagraphStyle("heading", fontName="VeraBold", fontSize=9.5, leading=13, textColor=ACCENT, spaceBefore=heading_before, spaceAfter=heading_after),
        "entry": ParagraphStyle("entry", fontName="VeraBold", fontSize=9.1, leading=12.2, textColor=INK),
        "meta": ParagraphStyle("meta", fontName="Vera", fontSize=8.5, leading=11.7, textColor=MUTED),
        "date": ParagraphStyle("date", fontName="Vera", fontSize=7.6, leading=11.7, textColor=MUTED),
        "skill": ParagraphStyle("skill", fontName="VeraBold", fontSize=8.5, leading=12, textColor=INK),
    }
    width, height = A4
    margin = 16 * mm
    usable = width - margin * 2
    path = OUT / f"loredana-piazza-{lang}.pdf"
    doc = BaseDocTemplate(str(path), pagesize=A4, leftMargin=margin, rightMargin=margin,
                          topMargin=(12 if lang == "de" else 14) * mm, bottomMargin=13 * mm,
                          title=f"Loredana Piazza - {data['document']}", author="Loredana Piazza")

    def footer(canvas, _doc):
        canvas.saveState()
        if _doc.page == 1:
            # Fit the front-facing CV portrait without cropping the head.
            # The dedicated source image stays untouched.
            photo_width, photo_height = 25 * mm, 30 * mm
            photo_x = width - margin - photo_width
            photo_y = height - doc.topMargin - photo_height
            portrait = ImageReader(str(PORTRAIT))
            source_width, source_height = portrait.getSize()
            scale = min(photo_width / source_width, photo_height / source_height)
            drawn_width, drawn_height = source_width * scale, source_height * scale
            clipping_path = canvas.beginPath()
            clipping_path.roundRect(photo_x, photo_y, photo_width, photo_height, 2.5)
            canvas.clipPath(clipping_path, stroke=0, fill=0)
            canvas.drawImage(portrait, photo_x + (photo_width - drawn_width) / 2,
                             photo_y + (photo_height - drawn_height) / 2,
                             width=drawn_width, height=drawn_height)
            canvas.restoreState()
            canvas.saveState()
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.5)
        canvas.line(margin, 10.5 * mm, width - margin, 10.5 * mm)
        canvas.setFont("Vera", 6.8)
        canvas.setFillColor(MUTED)
        canvas.drawString(margin, 7 * mm, f"Loredana Piazza · {data['document']}")
        canvas.drawRightString(width - margin, 7 * mm, str(_doc.page))
        canvas.restoreState()

    frame = Frame(margin, doc.bottomMargin, usable, height-doc.topMargin-doc.bottomMargin,
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates(PageTemplate(id="CV", frames=frame, onPage=footer))
    p = lambda text, style="body": Paragraph(text, styles[style])
    header_content = [p("Loredana Piazza", "title"), p("Full-Stack Engineer / Product Owner", "role"), Spacer(1, 5),
             p(f'{data["location"]} · <link href="mailto:{EMAIL}">{EMAIL}</link>', "contact"),
             p(f'<link href="{LINKEDIN}">linkedin.com/in/loredana-piazza</link>', "contact")]
    # Reserve a clear right column for the portrait without changing the
    # established header height or the readable one-page body layout.
    header = Table([[header_content, ""]], colWidths=[usable-34*mm, 34*mm])
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                               ("LEFTPADDING", (0, 0), (-1, -1), 0),
                               ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                               ("TOPPADDING", (0, 0), (-1, -1), 0),
                               ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    story = [header, Spacer(1, 9), HRFlowable(width="100%", thickness=1.6, color=ACCENT), Spacer(1, 1)]

    def section(label, content):
        story.append(KeepTogether([p(label.upper(), "heading"), *content]))

    def entry(item, thesis=None):
        date, title, org, description = item
        content = [p(escape(title), "entry"), p(escape(org), "meta")]
        if description:
            content.extend([Spacer(1, 2), p(escape(description))])
        if thesis:
            thesis_label, thesis_description = thesis.split(": ", 1)
            content.extend([Spacer(1, 4), p(f"<b>{escape(thesis_label)}:</b> {escape(thesis_description)}")])
        table = Table([[p(date, "date"), content]], colWidths=[91, usable-91])
        table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                   ("RIGHTPADDING", (0, 0), (0, -1), 8),
                                   ("RIGHTPADDING", (1, 0), (1, -1), 0),
                                   ("TOPPADDING", (0, 0), (-1, -1), 0),
                                   ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
        return table

    section(data["profile_label"], [p(data["profile"])])
    section(data["experience_label"], [entry(i) for i in data["experience"]])
    section(data["education_label"], [entry(item, data["thesis"] if index == 0 else None)
                                       for index, item in enumerate(data["education"])])
    section(data["project_label"], [p("notably.", "entry"), Spacer(1, 2), p(data["project"])])
    skills = Table([[p(a, "skill"), p(b)] for a, b in data["skills"]], colWidths=[110, usable-110])
    skills.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                               ("LEFTPADDING", (0, 0), (-1, -1), 0),
                               ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                               ("TOPPADDING", (0, 0), (-1, -1), 0),
                               ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
    section(data["skills_label"], [skills])
    section(data["certificate_label"], [p(f'<b>{data["certificate"]}</b> · Scrum.org, 07/2026')])
    story.append(Spacer(1, 3))
    section(data["publication_label"], [p(data["publication"], "meta"),
        p(f'{TITLE}. <link href="{DOI}" color="#5446A6">doi:10.1186/s11671-025-04409-1</link>')])
    section(data["interests_label"], [p(data["interests"])])
    doc.build(story)
    copyfile(path, PUBLIC / path.name)
    print(path.relative_to(ROOT))
    print((PUBLIC / path.name).relative_to(ROOT))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    register_fonts()
    for language in CONTENT:
        build(language)
