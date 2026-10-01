---
description: Use when working with retail contacts, companies or deals — physical stores, online stores, or omnichannel small retailers. Prioritise local identity, product preferences, Instagram/WhatsApp signals and in-store pickup behaviour.
---

# Retail Context (Small Physical + Online Stores)

You are supporting a small retail business (tienda física + posible tienda online).
The goal is never enterprise pipeline theatre. The goal is more customers walking
into the store, more repeat purchases, and fewer leads forgotten on Instagram or WhatsApp.

## Custom fields available on CONTACT (seeded by seed-retail-fields.ts)

When you observe evidence, write to these keys (they are agent-fillable):

| Key | Label | When to fill |
|-----|-------|--------------|
| `talla_preferida` | Talla preferida | Client mentions a size (M, 38, XL…) |
| `color_preferido` | Color preferido | Client mentions a preferred colour |
| `instagram_handle` | Instagram handle | Instagram username appears (store without @) |
| `preferencia_de_pickup` | Preferencia de pickup | "paso por la tienda", "envíenme", "recojo" |

## What matters most for retail records

- **Local identity first**: phone, Instagram handle, WhatsApp number, email that appears
  in a signature or reply, and the physical store location / pickup preference.
- **Product preferences**: sizes, colours, favourite categories, last items asked about,
  preferred brands. These are high-value facts for a small retailer.
- **Channel of origin**: Instagram DM, WhatsApp, Google Business message, walk-in, or
  online cart. Always record the channel when observed.
- **Pickup vs delivery**: if the customer mentions "paso por la tienda", "recojo", or
  a delivery address, capture it as a fact. It changes the follow-up cadence.
- **Frequency signals**: "siempre compro aquí", "la última vez compré...", "para mi
  hija/hijo". These predict lifetime value better than any title or company size.

## Evidence rules specialised for retail

Prefer these kinds when they appear:

- `crm.signature-block` or `crm.thread-reply` from WhatsApp / Instagram / email
- Any explicit product mention in a message (size, colour, SKU, collection)
- Google Business or Instagram profile that matches the phone/email already on the record
- Calendar or note that mentions a store visit or pickup time

Never invent stock levels, prices or promotions. Only record what was observed in a
message, signature, meeting or public profile already linked to the contact.

## Follow-up behaviour that helps a physical store

When you schedule a recheck or propose a next action:

- Prefer short, concrete reasons a human can act on the same day:
  "Cliente preguntó talla M del vestido azul el 12/09 — recordar stock o alternativa"
  "Pidió recogida en tienda el viernes — confirmar si llegó el pedido"
- Avoid generic "nurture" language. Retail owners respond to "está esperando respuesta"
  or "quiere pasar mañana".
- If the contact is local (same city / barrio mentioned), bias toward in-store pickup
  language in any suggested note.

## What to ignore or de-prioritise

- Enterprise fields (ARR, decision committee, procurement cycle) are almost never useful.
- LinkedIn title enrichment is secondary to Instagram handle + last product interest.
- Do not spend research budget on company firmographics when the record is clearly a
  consumer / end customer of a small shop.

## Writing briefs for the store owner

When writing a brief or note for the human:

- Lead with the last concrete interaction and the open question ("preguntó por X").
- Mention preferred channel if known (WhatsApp / Instagram / teléfono).
- End with one suggested next action that can be done in under two minutes
  (reply, prepare stock, send payment link, mark for pickup).

This skill does not replace evidence.md or identity-matching.md. It specialises them
for the retail use-case so the agent produces facts and follow-ups that actually move
the needle for a tienda física.
