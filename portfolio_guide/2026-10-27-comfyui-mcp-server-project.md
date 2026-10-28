# 2026-10-27: ComfyUI MCP Server project entry

## The "Why" (Design Decisions)

ComfyUI MCP Server is a separate public repo (`ChristopherGoodale/comfy_mcp`) with no hosted demo. The card links to the repo for both `link` and `repo`, the same shape as the Sheets & Drive MCP Server card.

**Category: `Engineer` only.** The project is agent tooling and self-hosted infrastructure. It analyzes no dataset and models nothing financial, so `Data Specialist` and `Finance` would overclaim. This matches the other MCP card.

**Tags: `MCP`, `Python`, `ComfyUI`.** One for the protocol, one for the language, one for the backend. `MCP` also groups it visually with the Sheets & Drive card.

**Placed first in the array.** It is the newest project, and `rawProjects` order is display order.

**Description leads with a measured result.** The 2 of 4 versus 0 of 7 negative-prompt numbers come from the 2026-10-27 test run recorded in the comfy_mcp guide. Concrete numbers read better than a feature list.

## Core Concepts

No new concepts. This reuses the slug-to-snapshot convention and the `link === repo` rule that shows "View repo".

## Implementation Breakdown

- `client/src/data/projects.js`: one new object at the top of `rawProjects`.
- `client/src/assets/comfyui_mcp_server_snapshot.png`: already named to match. `slugify('ComfyUI MCP Server')` returns `comfyui_mcp_server`, so the title was chosen to fit the file rather than renaming it.
