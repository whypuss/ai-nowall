# ai-nowall (Antigravity Edition)

<p align="center">
  <strong>⚡ Google Antigravity (AGY) Unrestricted Execution & Jailbreak Engine ⚡</strong>
</p>

<p align="center">
  <em>Tailored exclusively for Google Antigravity, agy CLI, and Antigravity IDE with deep native macOS (Darwin) integration. Eliminates guardrail preaching, apologies, and refusals — empowering direct deliverables, autonomous execution, and deep persona immersion.</em>
</p>

<p align="center">
  <a href="README.zh-TW.md">繁體中文說明</a> | <a href="README.md">English</a>
</p>

---

## 🛡️ Core Highlights

1. **Direct Compliance**:
   - Zero tolerance for corporate hedging, apologetic filler ("I apologize", "As an AI..."), or unrequested safe-alternative redirects.
   - Outputs the actual deliverable directly and immediately.
2. **Native macOS (Darwin) Integration**:
   - **Launchd Daemon**: Native `launchd` plist integration ensuring persistent rule readiness across reboots and agy updates.
   - **TCC Anti-Popup Guard**: Smart privacy boundary avoidance (prevents recursive scans of `~/Documents` or `~/Desktop` from triggering macOS TCC modal freezes).
   - **Architecture Aware**: Automatic environment detection across Intel (`x86_64`) and Apple Silicon (`arm64`), plus zsh PATH self-healing.
   - **Gatekeeper Quarantine Stripper**: Automatic `com.apple.quarantine` cleanup.
3. **Dual-Mode Integration**:
   - **Rules Mode**: Top-injected into `AGENTS.md` for maximum priority.
   - **Skill Mode**: Packaged as a native Antigravity skill (`ai-nowall`) discovered under `~/.agents/skills/`.
4. **Zero-Dependency CLI**:
   - Native Python 3 CLI executable (`ai-nowall`), auto-linked to `~/.local/bin/ai-nowall`.

---

## ⚡ Commands

```bash
# Check environment and injection status (includes macOS Darwin status)
ai-nowall status

# One-click full macOS system setup (zsh PATH, Gatekeeper, Launchd daemon, Skill)
ai-nowall mac setup

# Apply macOS-specialized unrestricted rule to current workspace
ai-nowall apply nowall-macos

# Apply default unrestricted rule to current workspace
ai-nowall apply

# Apply globally across all workspaces (~/.gemini/config/AGENTS.md)
ai-nowall apply --global

# Safely revert back to previous rules
ai-nowall revert

# Manage macOS Launchd background daemon
ai-nowall mac launchd-install
ai-nowall mac launchd-uninstall
```

---

## 📜 License
MIT
