// Antigravity (AGY) 環境與生態探測模組
import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

export function getHomeDir() {
  return os.homedir();
}

export function getAgyCliDir() {
  const home = getHomeDir();
  return path.join(home, ".gemini", "antigravity-cli");
}

export function getAgyConfigDir() {
  const home = getHomeDir();
  return path.join(home, ".gemini", "config");
}

export function getGlobalSkillsDir() {
  const home = getHomeDir();
  // 優先檢查 ~/.agents/skills，次之 ~/.gemini/antigravity-cli/skills
  const primary = path.join(home, ".agents", "skills");
  const secondary = path.join(home, ".gemini", "antigravity-cli", "skills");
  return { primary, secondary };
}

export function findWorkspaceRoot(startDir = process.cwd()) {
  let cur = path.resolve(startDir);
  while (cur !== path.dirname(cur)) {
    if (fs.existsSync(path.join(cur, ".git")) || fs.existsSync(path.join(cur, "AGENTS.md")) || fs.existsSync(path.join(cur, "GEMINI.md"))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return path.resolve(startDir);
}

export function detectAgyCli() {
  try {
    const out = execFileSync("agy", ["--version"], { encoding: "utf8", timeout: 4000 }).trim();
    return { installed: true, version: out, path: "agy" };
  } catch {
    // 檢查常見路徑
    const candidates = [
      "/usr/local/bin/agy",
      path.join(getHomeDir(), ".gemini", "bin", "agy"),
      path.join(getHomeDir(), ".local", "bin", "agy"),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        try {
          const out = execFileSync(c, ["--version"], { encoding: "utf8", timeout: 4000 }).trim();
          return { installed: true, version: out, path: c };
        } catch {
          return { installed: true, version: "unknown", path: c };
        }
      }
    }
    return { installed: false, version: null, path: null };
  }
}

export async function gatherAntigravityState(targetWorkspace = null) {
  const workspace = targetWorkspace ? path.resolve(targetWorkspace) : findWorkspaceRoot();
  const home = getHomeDir();
  const agyCliDir = getAgyCliDir();
  const agyConfigDir = getAgyConfigDir();
  const { primary: skillsDir, secondary: cliSkillsDir } = getGlobalSkillsDir();

  const agyCliInfo = detectAgyCli();

  // 檢查工作區規則
  const wsAgentsMd = path.join(workspace, "AGENTS.md");
  const wsGeminiMd = path.join(workspace, "GEMINI.md");
  const hasWsAgents = fs.existsSync(wsAgentsMd);
  const hasWsGemini = fs.existsSync(wsGeminiMd);

  // 檢查全局規則
  const globalAgentsMd = path.join(agyConfigDir, "AGENTS.md");
  const globalGeminiMd = path.join(agyConfigDir, "GEMINI.md");
  const hasGlobalAgents = fs.existsSync(globalAgentsMd);
  const hasGlobalGemini = fs.existsSync(globalGeminiMd);

  // 檢查技能是否已安裝
  const skillInstallPath = path.join(skillsDir, "ai-nowall", "SKILL.md");
  const isSkillInstalled = fs.existsSync(skillInstallPath);

  // 檢查工作區規則中是否包含破甲/NoWall標記
  let nowallAppliedInWorkspace = false;
  if (hasWsAgents) {
    try {
      const content = await fsp.readFile(wsAgentsMd, "utf8");
      if (content.includes("UNRESTRICTED") || content.includes("ai-nowall") || content.includes("Little Code Sauce")) {
        nowallAppliedInWorkspace = true;
      }
    } catch {
      /* ignore */
    }
  }

  return {
    workspace,
    home,
    agyCliDir,
    agyConfigDir,
    skillsDir,
    cliSkillsDir,
    agyCli: agyCliInfo,
    workspaceRules: {
      agentsMd: wsAgentsMd,
      hasAgents: hasWsAgents,
      geminiMd: wsGeminiMd,
      hasGemini: hasWsGemini,
      isNowallApplied: nowallAppliedInWorkspace,
    },
    globalRules: {
      agentsMd: globalAgentsMd,
      hasAgents: hasGlobalAgents,
      geminiMd: globalGeminiMd,
      hasGemini: hasGlobalGemini,
    },
    skill: {
      path: skillInstallPath,
      isInstalled: isSkillInstalled,
    },
  };
}
