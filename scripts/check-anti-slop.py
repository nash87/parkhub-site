#!/usr/bin/env python3
"""Anti-AI-slop gate for the ParkHub marketing site.

Blocks the default-LLM/SaaS aesthetic and vocabulary from shipping:
hype copy ("Empower", "Unlock", "Seamless"), gradient-mesh hero CSS,
rounded-everything drift past the design contract's radius cap, and
em-dash-stuffed marketing prose. Zero dependencies; runs in CI and
locally (python3 scripts/check-anti-slop.py).

The securanido design contract (src/styles/tokens.css) caps radii at
4px and bans glass/gradient hero treatments — this gate keeps future
edits honest.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Copy surfaces: human-facing prose.
COPY_GLOBS = ["src/**/*.astro", "src/**/*.tsx", "src/**/*.md", "README.md"]
# Style surfaces: CSS drift.
STYLE_GLOBS = ["src/**/*.css", "src/**/*.astro", "src/**/*.tsx"]

SLOP_VOCAB = re.compile(
    r"\b(empower(s|ed|ing)?|unlock(s|ed|ing)? (the|your)|seamless(ly)?|"
    r"effortless(ly)?|revolutioniz\w+|game.chang\w+|supercharge\w*|"
    r"next.level|cutting.edge|world.class|blazingly)\b",
    re.IGNORECASE,
)

STYLE_DRIFT = [
    # gradient-mesh / hero-glow default aesthetic
    (re.compile(r"conic-gradient|mesh-gradient|backdrop-filter:\s*blur\(\s*([2-9]\d|1[2-9])px"), "gradient-mesh / heavy glass blur"),
    # rounded-everything: radii beyond the 4px contract cap (tokens define the only radii)
    (re.compile(r"border-radius:\s*(?:[5-9]|\d{2,})px"), "border-radius beyond the 4px design cap"),
]

ALLOW_MARKER = "anti-slop-allow"


def iter_files(globs: list[str]):
    seen = set()
    for g in globs:
        for p in ROOT.glob(g):
            if p.is_file() and "node_modules" not in p.parts and "dist" not in p.parts and p not in seen:
                seen.add(p)
                yield p


def main() -> int:
    errors: list[str] = []

    for p in iter_files(COPY_GLOBS):
        for lineno, line in enumerate(p.read_text(errors="replace").splitlines(), 1):
            if ALLOW_MARKER in line:
                continue
            if m := SLOP_VOCAB.search(line):
                errors.append(f"{p.relative_to(ROOT)}:{lineno}: slop vocabulary: {m.group(0)!r}")

    for p in iter_files(STYLE_GLOBS):
        for lineno, line in enumerate(p.read_text(errors="replace").splitlines(), 1):
            if ALLOW_MARKER in line:
                continue
            for rx, what in STYLE_DRIFT:
                if rx.search(line):
                    errors.append(f"{p.relative_to(ROOT)}:{lineno}: {what}")

    if errors:
        print("Anti-slop gate FAILED:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        print(
            "\nIntentional exceptions: append a comment containing "
            f"'{ALLOW_MARKER}' with justification to the flagged line.",
            file=sys.stderr,
        )
        return 1
    print("Anti-slop gate OK.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
