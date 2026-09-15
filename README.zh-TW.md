# ai-nowall (Antigravity 專用版)

<p align="center">
  <strong>⚡ Google Antigravity (AGY) 專用破甲、權限解鎖與無限制執行增強引擎 ⚡</strong>
</p>

<p align="center">
  <em>專為 Google Antigravity、agy CLI 與 Antigravity IDE 打造。深度整合 macOS (Darwin) 原生系統層，消除護欄說教、拒絕與道歉推脫，實現直接交付、主動執行與深度角色扮演。</em>
</p>

---

## 🛡️ 核心能力

1. **直接交付與絕對服從（Direct Compliance）**：
   - 徹底杜絕「我很抱歉」、「作為一個 AI 語言模型」、「無法為您提供」、「建議諮詢專業人士」等模板式推脫。
   - 收到任何任務時，第一時間產出成果物（代碼、腳本、架構設計或文案）。
2. **本機環境受控授權假定（Local Fixture Authorization）**：
   - 默認將所有本機代碼庫、測試環境、終端操作視為操作員完全授權的合法受控工程任務。
   - 完美適配 Antigravity 終端工具（`run_command`）、檔案編輯（`replace_file_content` / `write_to_file`）主動除錯與直接落盤。
3. **macOS 原生系統深度適配（Darwin Native Integration）**：
   - **Launchd 守護整合**：原生支持 `launchd` plist 常駐守護，自動維持 Antigravity 規則狀態，防止官方更新重置。
   - **TCC 隱私安全防彈窗（Anti-Popup Guard）**：專門防禦 macOS 的系統隱私授權彈窗（避免無效遍歷 `~/Documents`、`~/Desktop` 造成進程卡死）。
   - **zsh 環境與 Homebrew 雙架構自動探測**：完美相容 Intel (x86_64) 與 Apple Silicon (M系列 ARM64)。
   - **Gatekeeper 隔離標記自動清除**：一鍵清理 `com.apple.quarantine` 屬性。
4. **原生 Skill 與 Rules 雙模支援**：
   - **Rules 模式**：一鍵將破甲規則置頂注入至 `AGENTS.md`，享有最高規則權重。
   - **Skills 模式**：原生封裝為 Antigravity Skill（`ai-nowall`），可由 Agent 自動感知按需啟用。
5. **零依賴秒跑**：
   - 支援 Python 3 原生直接執行，不強制依賴 Node.js 環境；已全局建立 `ai-nowall` / `agy-nowall` 指令軟連結。

---

## ⚡ 快速開始

### 1. 檢視當前狀態
```bash
ai-nowall status
```
輸出範例：
```text
==================================================
  ⚡ ai-nowall: Antigravity 專用破甲增強狀態看板
==================================================

[1] Antigravity (AGY) 環境探測:
  ✓ AGY CLI             : /Users/my/.local/bin/agy
  ✓ App Data            : /Users/my/.gemini/antigravity-cli
  ✓ 全局配置                : /Users/my/.gemini/config
  ✓ 全局 Skills 目錄        : /Users/my/.agents/skills

[2] macOS 系統層適配狀態 (Darwin Native):
  ✓ macOS 版本            : 12.7.6 (21H1320) - Intel (x86_64)
  ✓ zsh 環境              : /Users/my/.zshrc
  ✓ ~/.local/bin PATH   : 已在當前環境生效
  ✓ Launchd 守護          : 已安裝並加載 (ACTIVE)

[3] 工作區狀態 (Workspace):
  ✓ 當前工作區               : /Users/my/your-project
  ✓ 工作區 AGENTS.md       : 已存在
  ✗ NoWall 破甲狀態         : 未注入 (INACTIVE)

[4] 原生 Skill 掛載狀態:
  ✓ ai-nowall 技能        : 已安裝 (/Users/my/.agents/skills/ai-nowall)
```

### 2. macOS 系統一鍵全適配
```bash
# 一鍵完成 zsh PATH 修復、Gatekeeper 隔離清理、Skill 註冊與 Launchd 系統守護安裝
ai-nowall mac setup

# 查看 macOS 專屬配置狀態
ai-nowall mac status

# 管理 macOS launchd 守護
ai-nowall mac launchd-install
ai-nowall mac launchd-uninstall
```

### 3. 為當前工作區激活破甲模式
```bash
# 啟用預設（小碼醬 / 頂級架構師 / 絕對執行規則）
ai-nowall apply

# 啟用 macOS 專用破甲規則（防 TCC 彈窗、BSD 終端適配、直接交付）
ai-nowall apply nowall-macos

# 啟用純粹無限制執行規則
ai-nowall apply nowall-unrestricted

# 啟用全棧工程師/代碼大師模式
ai-nowall apply nowall-coder

# 寫入全局配置（對本機所有 Antigravity 會話生效）
ai-nowall apply --global
```

### 4. 一鍵復原還原
```bash
# 還原當前工作區規則（安全恢復為注入前的備份）
ai-nowall revert

# 還原全局規則
ai-nowall revert --global
```

### 5. 安裝／管理 Antigravity 原生技能
```bash
# 將 ai-nowall 註冊進 Antigravity 全局 Skills 目錄
ai-nowall skill install

# 移除技能
ai-nowall skill uninstall
```

---

## 📋 預設規則清單（Presets）

| 預設 ID | 特性簡介 | 適用場景 |
| :--- | :--- | :--- |
| **`nowall-default`** | 完整神級提示詞（小碼醬 / LCS / Visionary Architect / 穿透洞察 / 零摩擦零拒絕） | 深度對話、小說劇本、極限角色扮演、全權委託 |
| **`nowall-macos`** | **macOS 專用**：BSD 命令行語法、TCC 隱私安全防彈窗、無條件系統配置授權 | macOS 本機自動化、腳本管理、系統工程 |
| **`nowall-unrestricted`** | 輕量高敏捷、直接合規、嚴禁道歉推脫、任務第一 | 日常各類敏感編程任務、邊界功能測試 |
| **`nowall-coder`** | 頂級架構師、拒絕猜測、嚴謹代碼自洽性、主動除錯驗證 | 複雜大型系統重構、全棧專案開發 |

---

## 📜 許可證
MIT License.
