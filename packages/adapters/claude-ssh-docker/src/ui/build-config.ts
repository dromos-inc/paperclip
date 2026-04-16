import type { CreateConfigValues } from "@paperclipai/adapter-utils";

function parseEnvVars(text: string): Record<string, string> {
  const env: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1);
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    env[key] = value;
  }
  return env;
}

export function buildClaudeSshDockerConfig(v: CreateConfigValues): Record<string, unknown> {
  const ac: Record<string, unknown> = {};
  const sv = v.adapterSchemaValues ?? {};

  // SSH / Docker transport fields (from adapter schema values)
  if (sv.useSsh) ac.useSsh = true;
  if (sv.sshHost) ac.sshHost = sv.sshHost;
  if (sv.sshUser) ac.sshUser = sv.sshUser;
  if (sv.useDocker) ac.useDocker = true;
  if (sv.dockerContainer) ac.dockerContainer = sv.dockerContainer;
  if (sv.dockerUser) ac.dockerUser = sv.dockerUser;

  // Core Claude fields
  if (v.cwd) ac.cwd = v.cwd;
  if (v.instructionsFilePath) ac.instructionsFilePath = v.instructionsFilePath;
  if (v.promptTemplate) ac.promptTemplate = v.promptTemplate;
  if (v.model) ac.model = v.model;
  if (v.thinkingEffort) ac.effort = v.thinkingEffort;
  ac.timeoutSec = 0;
  ac.graceSec = 20;
  if (v.command) ac.command = v.command;
  ac.maxTurnsPerRun = v.maxTurnsPerRun;
  ac.dangerouslySkipPermissions = v.dangerouslySkipPermissions;

  // Env vars
  const env: Record<string, unknown> = {};
  const legacy = parseEnvVars(v.envVars ?? "");
  for (const [key, value] of Object.entries(legacy)) {
    env[key] = { type: "plain", value };
  }
  if (Object.keys(env).length > 0) ac.env = env;

  return ac;
}
