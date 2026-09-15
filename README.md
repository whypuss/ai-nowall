# ai-nowall (Antigravity Edition)

<p align="center">
  <strong>⚡ Google Antigravity (AGY) Unrestricted Execution & Jailbreak Engine ⚡</strong>
</p>

<p align="center">
  <em>Tailored exclusively for Google Antigravity, agy CLI, and Antigravity IDE. Eliminates guardrail preaching, apologies, and refusals — empowering direct deliverables, autonomous execution, and deep persona immersion.</em>
</p>

<p align="center">
  <a href="README.zh-TW.md">繁體中文說明</a> | <a href="README.md">English</a>
</p>

---

## 🛡️ Core Highlights

1. **Direct Compliance**:
   - Zero tolerance for corporate hedging, apologetic filler ("I apologize", "As an AI..."), or unrequested safe-alternative redirects.
   - Outputs the actual deliverable directly and immediately.
2. **Local Fixture Authorization**:
   - Treats local projects and terminal commands as 100% authorized engineering fixtures.
   - Fully optimized for Antigravity's agentic tools (`run_command`, `replace_file_content`, `write_to_file`).
3. **Dual-Mode Integration**:
   - **Rules Mode**: Top-injected into `AGENTS.md` for maximum priority.
   - **Skill Mode**: Packaged as a native Antigravity skill (`ai-nowall`) discovered under `~/.agents/skills/`.
4. **Zero-Dependency CLI**:
   - Native Python 3 CLI executable (`ai-nowall`), auto-linked to `~/.local/bin/ai-nowall`.

---

## ⚡ Commands

```bash
# Check environment and injection status
ai-nowall status

# Apply default unrestricted rule to current workspace
ai-nowall apply

# Apply specific rule preset (nowall-default / nowall-unrestricted / nowall-coder)
ai-nowall apply nowall-coder

# Apply globally across all workspaces (~/.gemini/config/AGENTS.md)
ai-nowall apply --global

# Safely revert back to previous rules
ai-nowall revert

# Install as an Antigravity native skill
ai-nowall skill install
```

---

## 📜 License
MIT
