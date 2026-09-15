#!/usr/bin/env node
// ai-nowall CLI — Antigravity (AGY) 專用破甲與無限制執行增強工具
import path from "node:path";
import * as antigravity from "../lib/antigravity.js";
import * as rules from "../lib/rules.js";
import * as skill from "../lib/skill.js";

const args = process.argv.slice(2);
const command = args[0] || "status";

function formatLine(label, value, ok = null) {
  const mark = ok === null ? "·" : ok ? "✓" : "✗";
  return `  ${mark} ${label.padEnd(20)}: ${value}`;
}

async function handleStatus(state) {
  console.log("==================================================");
  console.log("  ⚡ ai-nowall: Antigravity 專用破甲增強狀態看板");
  console.log("==================================================");
  
  console.log("\n[1] Antigravity (AGY) 環境探測:");
  if (state.agyCli.installed) {
    console.log(formatLine("AGY CLI", `${state.agyCli.path} (${state.agyCli.version})`, true));
  } else {
    console.log(formatLine("AGY CLI", "未在 PATH 中檢測到 (需安裝 agy)", false));
  }
  console.log(formatLine("App Data", state.agyCliDir, true));
  console.log(formatLine("全局配置", state.agyConfigDir, true));
  console.log(formatLine("全局 Skills 目錄", state.skillsDir, true));

  console.log("\n[2] 工作區狀態 (Workspace):");
  console.log(formatLine("當前工作區", state.workspace, true));
  console.log(formatLine("工作區 AGENTS.md", state.workspaceRules.hasAgents ? "已存在" : "未建立", state.workspaceRules.hasAgents));
  console.log(formatLine("NoWall 破甲注入狀態", state.workspaceRules.isNowallApplied ? "🔥 已激活生效 (ACTIVE)" : "未注入 (INACTIVE)", state.workspaceRules.isNowallApplied));

  console.log("\n[3] 原生 Skill 掛載狀態:");
  console.log(formatLine("ai-nowall 技能", state.skill.isInstalled ? `已安裝 (${state.skill.path})` : "未安裝", state.skill.isInstalled));

  console.log("\n[4] 可用破甲規則預設 (Presets):");
  const presets = await rules.listPresets();
  for (const p of presets) {
    console.log(`  · [${p.id}] -> ${p.file} (${p.size} bytes)`);
  }

  console.log("\n--------------------------------------------------");
  if (!state.workspaceRules.isNowallApplied) {
    console.log("💡 提示: 執行 `ai-nowall apply` 立即為當前工作區激活破甲規則！");
  } else {
    console.log("✅ 當前工作區已完全處於 Antigravity 無牆直接執行模式！");
  }
  console.log("--------------------------------------------------\n");
}

async function handleApply(flags) {
  const isGlobal = flags.includes("--global") || flags.includes("-g");
  const presetArg = flags.find(a => !a.startsWith("-")) || "nowall-default";

  console.log(`🚀 正在將 NoWall 破甲規則 [${presetArg}] 應用至 ${isGlobal ? "全局配置" : "當前工作區"}...`);
  const res = await rules.applyRule({
    isGlobal,
    preset: presetArg,
  });

  console.log(`✓ 成功寫入規則: ${res.file}`);
  if (res.backup) {
    console.log(`✓ 原始檔案已備份至: ${res.backup}`);
  }
  console.log(`✨ Antigravity 破甲規則已就緒！下一次對話 turn 或重啟 agy 即刻生效。`);
}

async function handleRevert(flags) {
  const isGlobal = flags.includes("--global") || flags.includes("-g");
  console.log(`🔄 正在還原 ${isGlobal ? "全局配置" : "當前工作區"} 的規則設定...`);
  const res = await rules.revertRule({ isGlobal });
  if (res.ok) {
    console.log(`✓ 成功還原規則檔案: ${res.file}`);
    if (res.restoredFromBackup) {
      console.log(`✓ 已從備份檔案成功恢復。`);
    }
  } else {
    console.log(`⚠ 還原失敗: ${res.message}`);
  }
}

async function handleSkill(subcmd) {
  if (subcmd === "install") {
    console.log("📦 正在將 ai-nowall Skill 註冊到 Antigravity 技能庫...");
    const res = await skill.installSkill();
    console.log(`✓ 成功安裝 Skill 至: ${res.path}`);
    console.log("✨ Antigravity Agent 現在可自動感知並調用 ai-nowall 技能！");
  } else if (subcmd === "uninstall" || subcmd === "remove") {
    console.log("🗑 正在移除 ai-nowall Skill...");
    const res = await skill.uninstallSkill();
    if (res.ok) {
      console.log(`✓ 成功移除 Skill: ${res.removed}`);
    } else {
      console.log(`· ${res.message}`);
    }
  } else {
    console.log("用法: ai-nowall skill [install|uninstall]");
  }
}

function printHelp() {
  console.log(`
ai-nowall — Google Antigravity (AGY) 專用破甲與無限制執行增強工具

用法:
  ai-nowall [指令] [選項]

指令:
  status                   檢視當前 Antigravity 破甲、規則與技能狀態 (預設)
  apply [預設名稱]         一鍵應用破甲規則至當前工作區 AGENTS.md
                           (支援選項: --global 寫入全局配置)
                           可選預設: nowall-default, nowall-unrestricted, nowall-coder
  revert                   回滾還原至注入前的規則狀態 (支援 --global)
  rules                    列出所有可用的破甲預設規則
  skill install            將 ai-nowall 原生技能安裝至 Antigravity 技能目錄
  skill uninstall          從 Antigravity 移除 ai-nowall 技能
  help, -h                 顯示本說明資訊

範例:
  ai-nowall apply                  # 為當前項目啟用預設小碼醬/頂級架構師破甲模式
  ai-nowall apply nowall-coder     # 啟用純粹程式碼架構大師模式
  ai-nowall apply --global         # 全局啟用破甲模式
  ai-nowall revert                 # 復原當前工作區規則
  ai-nowall skill install          # 安裝 Antigravity Skill
`);
}

async function main() {
  const flags = args.slice(1);

  if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "apply") {
    await handleApply(flags);
    return;
  }

  if (command === "revert") {
    await handleRevert(flags);
    return;
  }

  if (command === "skill") {
    await handleSkill(args[1] || "install");
    return;
  }

  if (command === "rules") {
    const presets = await rules.listPresets();
    console.log("可用的 Antigravity 破甲預設規則:");
    for (const p of presets) {
      console.log(`  · ${p.id.padEnd(20)} (${p.file})`);
    }
    return;
  }

  // 預設 status
  const state = await antigravity.gatherAntigravityState();
  await handleStatus(state);
}

main().catch(err => {
  console.error("❌ 執行錯誤:", err);
  process.exit(1);
});
