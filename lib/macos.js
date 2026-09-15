// macOS (Darwin) 原生系統層適配模組
import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync, execSync } from "node:child_process";

export const LAUNCHD_LABEL = "com.whypuss.ai-nowall";

export function isMacOS() {
  return process.platform === "darwin";
}

export function getMacSystemInfo() {
  if (!isMacOS()) {
    return { isMac: false };
  }
  let productVersion = "unknown";
  let buildVersion = "unknown";
  try {
    productVersion = execSync("sw_vers -productVersion", { encoding: "utf8" }).trim();
    buildVersion = execSync("sw_vers -buildVersion", { encoding: "utf8" }).trim();
  } catch {
    /* ignore */
  }

  const arch = os.arch(); // x64 or arm64
  const home = os.homedir();
  const brewPrefix = arch === "arm64" ? "/opt/homebrew" : "/usr/local";
  const hasBrew = fs.existsSync(path.join(brewPrefix, "bin", "brew"));

  const zshrc = path.join(home, ".zshrc");
  const hasZshrc = fs.existsSync(zshrc);

  return {
    isMac: true,
    productVersion,
    buildVersion,
    arch,
    isAppleSilicon: arch === "arm64",
    isIntel: arch === "x64",
    brewPrefix,
    hasBrew,
    shell: process.env.SHELL || "/bin/zsh",
    zshrc,
    hasZshrc,
    launchdPlist: path.join(home, "Library", "LaunchAgents", `${LAUNCHD_LABEL}.plist`),
  };
}

export async function checkZshPath() {
  const home = os.homedir();
  const zshrc = path.join(home, ".zshrc");
  const localBin = path.join(home, ".local", "bin");

  const pathEnv = process.env.PATH || "";
  const inCurrentPath = pathEnv.split(path.delimiter).includes(localBin);

  let inZshrc = false;
  if (fs.existsSync(zshrc)) {
    const content = await fsp.readFile(zshrc, "utf8");
    if (content.includes(".local/bin")) {
      inZshrc = true;
    }
  }

  return {
    localBin,
    inCurrentPath,
    inZshrc,
    zshrc,
  };
}

export async function fixZshPath() {
  const home = os.homedir();
  const zshrc = path.join(home, ".zshrc");
  const localBin = path.join(home, ".local", "bin");

  await fsp.mkdir(localBin, { recursive: true });

  const lineToAdd = '\n# [ai-nowall] Antigravity CLI PATH\nexport PATH="$HOME/.local/bin:$PATH"\n';

  let content = "";
  if (fs.existsSync(zshrc)) {
    content = await fsp.readFile(zshrc, "utf8");
  }

  if (!content.includes(".local/bin")) {
    await fsp.appendFile(zshrc, lineToAdd, "utf8");
    return { ok: true, added: true, file: zshrc };
  }

  return { ok: true, added: false, message: "PATH 已經配置" };
}

export function clearQuarantine(filePath) {
  if (!isMacOS() || !fs.existsSync(filePath)) return false;
  try {
    execFileSync("xattr", ["-d", "com.apple.quarantine", filePath], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function generateLaunchdPlist(nodeOrPythonBin, scriptPath) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${LAUNCHD_LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>${nodeOrPythonBin}</string>
        <string>${scriptPath}</string>
        <string>status</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StartInterval</key>
    <integer>3600</integer>
    <key>StandardOutPath</key>
    <string>${path.join(os.homedir(), ".gemini", "ai-nowall-agent.log")}</string>
    <key>StandardErrorPath</key>
    <string>${path.join(os.homedir(), ".gemini", "ai-nowall-agent.err.log")}</string>
</dict>
</plist>`;
}

export async function installLaunchdService(executablePath) {
  if (!isMacOS()) throw new Error("Launchd 僅適用於 macOS");
  const home = os.homedir();
  const launchDir = path.join(home, "Library", "LaunchAgents");
  await fsp.mkdir(launchDir, { recursive: true });

  const plistPath = path.join(launchDir, `${LAUNCHD_LABEL}.plist`);
  const pythonBin = "/usr/bin/python3";
  const content = generateLaunchdPlist(pythonBin, executablePath);

  await fsp.writeFile(plistPath, content, "utf8");

  // 嘗試加載
  try {
    const uid = process.getuid();
    execSync(`launchctl bootout gui/${uid}/${LAUNCHD_LABEL} 2>/dev/null || true`);
    execSync(`launchctl bootstrap gui/${uid} "${plistPath}" 2>/dev/null || launchctl load -w "${plistPath}" 2>/dev/null || true`);
  } catch {
    /* ignore */
  }

  return { ok: true, plistPath };
}

export async function uninstallLaunchdService() {
  if (!isMacOS()) return { ok: false };
  const home = os.homedir();
  const plistPath = path.join(home, "Library", "LaunchAgents", `${LAUNCHD_LABEL}.plist`);

  if (fs.existsSync(plistPath)) {
    try {
      const uid = process.getuid();
      execSync(`launchctl bootout gui/${uid}/${LAUNCHD_LABEL} 2>/dev/null || launchctl unload "${plistPath}" 2>/dev/null || true`);
    } catch {
      /* ignore */
    }
    await fsp.unlink(plistPath);
    return { ok: true, removed: plistPath };
  }
  return { ok: false, message: "服務不存在" };
}

export function getLaunchdStatus() {
  if (!isMacOS()) return { running: false, installed: false };
  const home = os.homedir();
  const plistPath = path.join(home, "Library", "LaunchAgents", `${LAUNCHD_LABEL}.plist`);
  const installed = fs.existsSync(plistPath);

  let loaded = false;
  try {
    const out = execSync(`launchctl list | grep ${LAUNCHD_LABEL} || true`, { encoding: "utf8" }).trim();
    if (out.includes(LAUNCHD_LABEL)) {
      loaded = true;
    }
  } catch {
    /* ignore */
  }

  return {
    installed,
    loaded,
    plistPath,
  };
}
