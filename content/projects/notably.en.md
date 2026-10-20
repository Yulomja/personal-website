---
id: notably
locale: en
slug: notably
title: notably.
description: An offline macOS app in development for connecting notes, assumptions, evidence and conclusions in business analysis.
date: '2026-10-20'
tags: [Personal project, Business analysis]
draft: false
---
## From notes to reasoned conclusions

notably. is a personal desktop app I’m developing for business analysts. It connects meeting notes with assumptions, questions, tasks and conclusions, keeping the evidence and reasoning in view.

[![notably. analysis with assumptions, questions and supporting evidence. Example data.](/images/notably-analysis.jpg)](/images/notably-analysis.jpg)

*Inside notably. — assumptions, questions and evidence in one view. Example data. [View screenshot](/images/notably-analysis.jpg).*

The current implementation includes a note editor with linked questions and tasks, protected source passages, and conclusions that retain evidence snapshots and earlier versions. Analysis views and standalone overviews use the same underlying records.

## Current stage

notably. is **in development**. It runs offline on a single Mac, with a React/TypeScript interface in Tauri, Rust services and a local SQLite library. It has no accounts, collaboration or cloud synchronization. Optional Markdown export covers saved notes; complete-library backup is separate.

[Give your notes a next step — meet notably.](/en/blog/building-notably/).
