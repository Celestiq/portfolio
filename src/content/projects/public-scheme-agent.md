---
title: Public Scheme Agent
description: "A Gradio chat app that matches users to Indian government welfare schemes by running retrieval-augmented generation over a roughly 3,000-scheme policy database, with SQLite-backed conversation persistence."
link: https://github.com/Celestiq/public-scheme-agent
---

## Problem

Government scheme eligibility in India is scattered across thousands of entries with fine-print conditions (income ceilings, caste category, state, occupation) and bureaucratic phrasing. The system prompt in `src/core/prompts.py` goes to unusual lengths to strip that away: no symbols, numerals spelled out in words, Indian units (lakh, crore), short conversational sentences, and explicit follow-up questions when eligibility facts are missing. That formatting discipline, plus an unused `SARVAMAI_API_KEY` placeholder in `.env.example` (Sarvam AI builds Indic speech models), points to a target audience read to or reached over voice or SMS rather than a typical markdown-rendering chat UI.

## Constraints

- No managed vector database or hosted DB — everything runs as one local process, consistent with the project's origin as a Hugging Face Spaces Gradio scaffold (see the HF-authored initial commit and `sdk: gradio` config).
- The knowledge base (`policies_db.json`, ~21 MB, ~26,000 chunks after splitting) is static, so re-embedding it on every boot is treated as unaffordable — chunks and the FAISS index are cached to disk, keyed by a content hash.
- Single-file SQLite checkpointing rather than a database server, keeping deployment to one process with one file.
- No test suite or CI — small, single-maintainer scope.

## Decision log

- Used LangGraph's tool-calling agent (`agent.py`, `ToolNode`/`tools_condition`) over the original linear retrieve-then-generate pipeline (`src/rag.py`, deleted in the "agent created & db hidden" commit) because a fixed retrieve-always flow couldn't skip retrieval for small talk or issue more than one query per turn.
- Used `gpt-5-mini` over the initially wired `gpt-5-nano` (changed in the same commit that introduced the agent) because eligibility matching needs multi-step reasoning over retrieved facts, not just cheap lookup.
- Used a detailed, facet-based query-construction policy (`TOOLS_POLICY`) over a one-line "call the tool" instruction (visible commented out in prompt history) because a single free-text query against a ~26k-chunk index returned weak, generic matches.
- Used FAISS with a hash-keyed on-disk cache over a hosted vector store because rebuilding the index is slow and rate-limited in practice — confirmed to take several minutes and repeatedly hit OpenAI embedding rate limits — and the source data rarely changes.