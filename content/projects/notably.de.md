---
id: notably
locale: de
slug: notably
title: notably.
description: Eine offline nutzbare macOS-App in Entwicklung, die Notizen, Annahmen, Belege und Schlussfolgerungen für Business Analysis verbindet.
date: '2026-10-20'
tags: [Persönliches Projekt, Business Analysis]
draft: false
---
## Von Notizen zu begründeten Schlussfolgerungen

notably. ist eine persönliche Desktop-App, die ich für Business Analysts entwickle. Sie verbindet Gesprächsnotizen mit Annahmen, Fragen, Aufgaben und Schlussfolgerungen und hält die zugehörigen Belege und Überlegungen sichtbar.

[![Analyse in notably. mit Annahmen, Fragen und zugehörigen Belegen. Beispieldaten.](/images/notably-analysis.jpg)](/images/notably-analysis.jpg)

*Einblick in notably. — Annahmen, Fragen und Belege in einer Ansicht. Beispieldaten. [Screenshot ansehen](/images/notably-analysis.jpg).*

Die aktuelle Implementierung umfasst einen Notizeditor mit verknüpften Fragen und Aufgaben, geschützte Quellpassagen und Schlussfolgerungen mit Momentaufnahmen der Belege und früheren Fassungen. Analyseansichten und eigenständige Übersichten verwenden dieselben Datensätze.

## Aktueller Stand

notably. ist **in Entwicklung**. Die App läuft offline auf einem einzelnen Mac: mit einer React/TypeScript-Oberfläche in Tauri, Rust-Services und einer lokalen SQLite-Bibliothek. Benutzerkonten, gemeinsame Bearbeitung und Cloud-Synchronisierung gehören nicht zum aktuellen Umfang. Der optionale Markdown-Export umfasst gespeicherte Notizen; die vollständige Bibliothekssicherung ist davon getrennt.

[Gib deinen Notizen einen nächsten Schritt — mit notably.](/de/blog/notably-von-notizen-zu-entscheidungen/).
