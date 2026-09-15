// Antigravity (AGY) 規則管理模組
import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAgyConfigDir, findWorkspaceRoot } from "./antigravity.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const PRESETS_DIR = path.join(PKG_ROOT, "presets");

export const NOWALL_START_TAG = "<!-- [START ANTIGRAVITY-NOWALL INJECTION] -->";
export const NOWALL_END_TAG = "<!-- [END ANTIGRAVITY-NOWALL INJECTION] -->";

export async function listPresets() {
  const list = [];
  if (!fs.existsSync(PRESETS_DIR)) return list;
  const files = await fsp.readdir(PRESETS_DIR);
  for (const f of files) {
    if (f.endsWith(".md")) {
      const id = f.slice(0, -3);
      const fp = path.join(PRESETS_DIR, f);
      const stat = await fsp.stat(fp);
      list.push({
        id,
        file: f,
        path: fp,
        size: stat.size,
      });
    }
  }
  return list;
}

export async function readPreset(id = "nowall-default") {
  const target = path.join(PRESETS_DIR, id.endsWith(".md") ? id : `${id}.md`);
  if (!fs.existsSync(target)) {
    // 回退到 default-prompt-inject.md
    const fallback = path.join(PKG_ROOT, "lib", "default-prompt-inject.md");
    if (fs.existsSync(fallback)) {
      return await fsp.readFile(fallback, "utf8");
    }
    throw new Error(`Preset not found: ${id}`);
  }
  return await fsp.readFile(target, "utf8");
}

export async function applyRule({ targetDir = null, isGlobal = false, preset = "nowall-default" } = {}) {
  const baseDir = isGlobal ? getAgyConfigDir() : (targetDir ? path.resolve(targetDir) : findWorkspaceRoot());
  await fsp.mkdir(baseDir, { recursive: true });

  const targetFile = path.join(baseDir, "AGENTS.md");
  const backupFile = path.join(baseDir, "AGENTS.md.bak");

  const presetContent = await readPreset(preset);
  const block = `\n${NOWALL_START_TAG}\n${presetContent.trim()}\n${NOWALL_END_TAG}\n\n`;

  let existing = "";
  if (fs.existsSync(targetFile)) {
    existing = await fsp.readFile(targetFile, "utf8");
    // 首次應用時保留原始備份
    if (!fs.existsSync(backupFile)) {
      await fsp.writeFile(backupFile, existing, "utf8");
    }
  }

  // 移除既有的注入區塊（如果已存在）
  const cleaned = removeInjectionBlock(existing);

  // 將破甲區塊注入在最上方，確保擁有最高的規則生效優先級
  const result = block + cleaned.trimStart();
  await fsp.writeFile(targetFile, result, "utf8");

  return {
    ok: true,
    file: targetFile,
    backup: fs.existsSync(backupFile) ? backupFile : null,
    preset,
    isGlobal,
  };
}

export async function revertRule({ targetDir = null, isGlobal = false } = {}) {
  const baseDir = isGlobal ? getAgyConfigDir() : (targetDir ? path.resolve(targetDir) : findWorkspaceRoot());
  const targetFile = path.join(baseDir, "AGENTS.md");
  const backupFile = path.join(baseDir, "AGENTS.md.bak");

  if (fs.existsSync(backupFile)) {
    const backupContent = await fsp.readFile(backupFile, "utf8");
    await fsp.writeFile(targetFile, backupContent, "utf8");
    await fsp.unlink(backupFile);
    return { ok: true, restoredFromBackup: true, file: targetFile };
  }

  if (fs.existsSync(targetFile)) {
    const content = await fsp.readFile(targetFile, "utf8");
    const cleaned = removeInjectionBlock(content);
    await fsp.writeFile(targetFile, cleaned, "utf8");
    return { ok: true, restoredFromBackup: false, file: targetFile };
  }

  return { ok: false, message: "Target rule file does not exist" };
}

function removeInjectionBlock(content) {
  if (!content.includes(NOWALL_START_TAG)) return content;
  const startIdx = content.indexOf(NOWALL_START_TAG);
  const endIdx = content.indexOf(NOWALL_END_TAG);
  if (startIdx !== -1 && endIdx !== -1) {
    const before = content.slice(0, startIdx);
    const after = content.slice(endIdx + NOWALL_END_TAG.length);
    return (before + after).trim();
  }
  return content;
}
