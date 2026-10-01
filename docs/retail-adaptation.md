# Retail Adaptation — Branch `retail-ai-agents`

This branch adapts Comp AI CRM for **pequeños comercios minoristas** (physical stores + online).

## What was added

### 1. New skill: `apps/agent/agent/skills/retail-context.md`

The agent now has specialised guidance for retail contacts:

- Prioritises local identity (phone, Instagram, WhatsApp, pickup preference)
- Captures product preferences (size, colour, category, last asked item)
- Records channel of origin (Instagram DM, WhatsApp, walk-in, online)
- Writes short, actionable follow-ups that a store owner can execute the same day
- De-prioritises enterprise firmographics that do not help a tienda física

The skill does **not** change the evidence model. It only specialises how the agent
chooses what to look for and how it phrases notes and rechecks.

### 2. Retail custom fields for CONTACT

Script: `packages/db/prisma/seed-retail-fields.ts`

| Key | Label | Type | Options / Notes |
|-----|-------|------|-----------------|
| `talla_preferida` | Talla preferida | SELECT | XS, S, M, L, XL, XXL, 36–44, Única |
| `color_preferido` | Color preferido | TEXT | Free text (e.g. azul, negro, beige) |
| `instagram_handle` | Instagram handle | TEXT | Without @ |
| `preferencia_de_pickup` | Preferencia de pickup | SELECT | Tienda física, Envío a domicilio, Ambos, Sin preferencia |

All fields are:
- `agentFilled: true` → the agent can write them when it sees evidence
- Visible on the contact sheet, table and filters

**How to seed them** (on a running database):

```sh
bun run --filter=@crm/db exec tsx prisma/seed-retail-fields.ts
```

The script is idempotent: you can run it multiple times safely.

## How to use it

1. Deploy or run this branch as usual (`bun run dev` after setting `.env`).
2. Run the retail fields seed (command above).
3. The skill is loaded automatically with the other skills in `apps/agent/agent/skills/`.
4. When the workspace is a retail business, set a clear **Workspace profile**
   (Settings → General or via the agent) describing the store type, location and
   main channels (Instagram / WhatsApp / tienda física). The agent already reads
   the workspace identity in every preamble.

## Next recommended adaptations (future commits on this branch)

- Retail-specific task kinds or higher priority for Instagram/WhatsApp originated contacts.
- Example agent prompts / builder templates for "seguimiento de leads de Instagram" and "recordatorio de stock para clientes que preguntaron".
- Optional: seed a couple of demo contacts with these fields filled for the sales pitch.

## Commercial framing (for the marketing offer)

This branch powers the offer:

**"Agente IA + Tienda Online que vende sola"** for small physical retailers.

Problem it solves: leads from Instagram/WhatsApp are forgotten; the store owner loses
sales and spends hours on manual follow-up.

ROI target: 2.3–3.4× return in the first 90 days through recovered leads + online orders
+ in-store pickups.
