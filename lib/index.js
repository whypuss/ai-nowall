// ai-nowall: Antigravity 專用破甲與無限制執行引擎入口
import * as antigravity from "./antigravity.js";
import * as rules from "./rules.js";
import * as skill from "./skill.js";

export const name = "ai-nowall";
export const version = "2.0.0";
export const target = "Antigravity (AGY)";

export { antigravity, rules, skill };

export default {
  name,
  version,
  target,
  antigravity,
  rules,
  skill,
};
