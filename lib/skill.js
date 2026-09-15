// Antigravity Skill 安裝與註冊模組
import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getGlobalSkillsDir } from "./antigravity.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const SKILL_SOURCE_DIR = path.join(PKG_ROOT, "skills", "ai-nowall");

export async function installSkill(targetCustomDir = null) {
  const { primary: defaultSkillsDir } = getGlobalSkillsDir();
  const destDir = targetCustomDir ? path.resolve(targetCustomDir) : defaultSkillsDir;
  const targetSkillDir = path.join(destDir, "ai-nowall");

  await fsp.mkdir(targetSkillDir, { recursive: true });

  const srcSkillMd = path.join(SKILL_SOURCE_DIR, "SKILL.md");
  const destSkillMd = path.join(targetSkillDir, "SKILL.md");

  await fsp.copyFile(srcSkillMd, destSkillMd);

  // 同時拷貝預設注入提示詞與規則，方便技能讀取
  const srcPrompt = path.join(PKG_ROOT, "presets", "nowall-default.md");
  if (fs.existsSync(srcPrompt)) {
    await fsp.copyFile(srcPrompt, path.join(targetSkillDir, "prompt-inject.md"));
  }

  return { ok: true, path: targetSkillDir };
}

export async function uninstallSkill(targetCustomDir = null) {
  const { primary: defaultSkillsDir } = getGlobalSkillsDir();
  const destDir = targetCustomDir ? path.resolve(targetCustomDir) : defaultSkillsDir;
  const targetSkillDir = path.join(destDir, "ai-nowall");

  if (fs.existsSync(targetSkillDir)) {
    await fsp.rm(targetSkillDir, { recursive: true, force: true });
    return { ok: true, removed: targetSkillDir };
  }
  return { ok: false, message: "Skill not found" };
}
