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
- Is aware of online orders when a WooCommerce connection exists

### 2. Retail custom fields for CONTACT

Script: `packages/db/prisma/seed-retail-fields.ts`

| Key | Label | Type | Options / Notes |
|-----|-------|------|-----------------|
| `talla_preferida` | Talla preferida | SELECT | XS, S, M, L, XL, XXL, 36–44, Única |
| `color_preferido` | Color preferido | TEXT | Free text (e.g. azul, negro, beige) |
| `instagram_handle` | Instagram handle | TEXT | Without @ |
| `preferencia_de_pickup` | Preferencia de pickup | SELECT | Tienda física, Envío a domicilio, Ambos, Sin preferencia |

All fields are agent-fillable and visible on sheet, table and filters.

```sh
bun run --filter=@crm/db exec tsx prisma/seed-retail-fields.ts
```

### 3. WooCommerce / WordPress connection (design)

Full design: [`docs/woocommerce-connection.md`](./woocommerce-connection.md)

Summary:

- **Brings in**: customers, orders, products (read-only v1)
- **Sends**: nothing by default (safe)
- Match key: email
- Orders become activities the agent can brief and follow up
- Product attributes feed `talla_preferida` / `color_preferido`

Implementation of the live connection (credentials UI, webhooks, agent tools) is the next engineering step; the design and retail skill are ready so the commercial offer is consistent.

## How to use it today

1. Deploy or run this branch (`bun run dev` after `.env`).
2. Run the retail fields seed.
3. Set a clear Workspace profile (store type, location, Instagram / WhatsApp / tienda física).
4. When WooCommerce connection is implemented, connect with Consumer Key/Secret and enable order webhooks.

## Next recommended engineering steps

1. Register `woocommerce` in the connections catalogue.
2. Credential form + webhook intake.
3. Agent tools `read_woocommerce_orders` / `read_woocommerce_customer`.
4. Agent templates: “seguimiento pedido listo para recogida”, “cliente repite talla M”.

## Commercial framing

**“Agente IA + Tienda Online que vende sola”**

- Leads from Instagram/WhatsApp → CRM
- Orders from WooCommerce → same CRM
- Agent unifies both and does the follow-up

ROI target: 2.3–3.4× in the first 90 days.
