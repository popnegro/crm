# WooCommerce / WordPress Connection — Design

Branch: `retail-ai-agents`

This document defines the **WooCommerce connection** for small retailers who already
have (or will have) a WordPress + WooCommerce store. It follows the project rule:

> **A connection is a capability. An automation is an agent.**

## Goal for retail

Bring **orders, customers and products** from the online store into the CRM so the
agent can:

- Create or match CONTACT records from WooCommerce customers
- Attach order history to the contact (as deals or activities)
- Surface product preferences (talla, color, last purchase) into the retail custom fields
- Trigger follow-ups when an order is placed, cancelled or ready for pickup

## Direction of the connection

| Direction | What |
|-----------|------|
| **Brings in** | Customers, Orders, Products (read-only by default) |
| **Sends** | Nothing by default (safe for migration). Optional later: order notes, tags |

“Sends: Nothing” is intentional. A small retailer connecting their store must not fear
that the CRM will change prices or stock in WooCommerce.

## Identity matching

Primary match key: **email** (WooCommerce customer email ↔ CRM contact email).

Secondary signals (when email is missing or weak):

- Phone number
- Billing / shipping name
- Instagram handle if present in order notes or meta

Unmatched customers stay unmatched. The agent never invents a contact from a weak match.
The connection page surfaces the count of unmatched customers so the gap is visible.

## Capabilities the connection exposes

These become taggable in the agent builder as `woocommerce:orders`, `woocommerce:customers`, etc.

1. **woocommerce:customers** — list / read customers (email, name, phone, addresses)
2. **woocommerce:orders** — list / read orders (status, line items, totals, dates)
3. **woocommerce:products** — list / read products (name, SKU, attributes such as size/colour)

No write scopes in v1.

## Data mapping (v1)

| WooCommerce | CRM |
|-------------|-----|
| Customer | CONTACT (match by email) |
| Order | DEAL or Activity of type ORDER (decision below) |
| Order line items | Notes on the deal/contact + retail fields when attributes match |
| Product attributes (size, colour) | `talla_preferida`, `color_preferido` when the customer repeatedly buys the same |

**Decision for v1**: treat an order as an **Activity** of a new type `ORDER` (or reuse
NOTE with structured meta) rather than a full Deal pipeline. Small retailers think in
“pedidos”, not in “pipeline stages”. Deals remain available for high-value or B2B cases.

## Authentication

WooCommerce REST API with **Application Passwords** or **Consumer Key / Secret**
(recommended for stores on managed hosting).

Stored as a connection credential (never in the agent sandbox).

Webhook secret for `order.created`, `order.updated`, `customer.created` so the CRM
receives events without polling.

## Intake endpoint (future implementation)

```
POST /internal/connections/woocommerce/webhook
```

- Verifies the WooCommerce signature
- Upserts contact by email
- Creates an activity / deal for the order
- Queues an agent task (`identify` or a new `woocommerce-order` kind) so the agent
  can enrich retail fields and schedule follow-ups

## What the agent may do once connected

- Read recent orders for a contact and write a short brief for the store owner
- Fill `talla_preferida` / `color_preferido` from repeated line-item attributes
- Schedule a recheck when an order is “processing” or “ready for pickup”
- Never push stock or price changes back to WooCommerce in v1

## Implementation status on this branch

| Item | Status |
|------|--------|
| Design document (this file) | Done |
| Retail skill aware of online orders | Updated |
| Connection UI / OAuth / webhook | Not yet (next iteration) |
| Agent tools `read_woocommerce_*` | Not yet |

## Next engineering steps (ordered)

1. Register the connection type in the connections catalogue (brings-in / sends).
2. Add credential storage and a simple “Connect with Consumer Key” form.
3. Webhook intake + contact upsert by email.
4. Agent tools that read orders/customers for a given contact id.
5. Optional: map product attributes → retail custom fields automatically.

## Commercial framing

This connection closes the loop of the offer **“Agente IA + Tienda Online que vende sola”**:

- Leads from Instagram/WhatsApp land in the CRM
- Orders from the online store land in the same CRM
- The agent unifies both and does the follow-up so the store owner only attends the store
