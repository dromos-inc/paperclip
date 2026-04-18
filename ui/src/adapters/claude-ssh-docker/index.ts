import type { UIAdapterModule } from "../types";
import { parseClaudeStdoutLine, buildClaudeSshDockerConfig } from "@paperclipai/adapter-claude-ssh-docker/ui";
import { SchemaConfigFields, buildSchemaAdapterConfig } from "../schema-config-fields";

export const claudeSshDockerUIAdapter: UIAdapterModule = {
  type: "claude_ssh_docker",
  label: "Claude (SSH/Docker)",
  parseStdoutLine: parseClaudeStdoutLine,
  ConfigFields: SchemaConfigFields,
  buildAdapterConfig: buildClaudeSshDockerConfig,
};
