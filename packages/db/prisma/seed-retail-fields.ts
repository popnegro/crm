/**
 * Seed retail-specific custom fields for CONTACT records.
 * Run after the main seed or on an existing database:
 *
 *   bun run --filter=@crm/db exec tsx prisma/seed-retail-fields.ts
 *
 * Fields created (all on CONTACT, agentFilled = true):
 * - preferred_size   (SELECT)  Talla preferida
 * - preferred_color  (TEXT)    Color preferido
 * - instagram_handle (TEXT)    Instagram handle
 * - pickup_preference (SELECT) Preferencia de pickup
 */

import { db } from "../src/client";
import { fieldKeyFromLabel } from "../src/fields-shape";
import { FieldType } from "../src/generated/prisma/enums";

const SIZES = [
	"XS",
	"S",
	"M",
	"L",
	"XL",
	"XXL",
	"36",
	"38",
	"40",
	"42",
	"44",
	"Única",
] as const;

const PICKUP_OPTIONS = [
	"Tienda física",
	"Envío a domicilio",
	"Ambos",
	"Sin preferencia",
] as const;

type SeededField = {
	id: string;
	key: string;
	options: { id: string; label: string }[];
};

async function upsertField(
	label: string,
	type: FieldType,
	position: number,
	options: readonly string[] = [],
	agentBrief?: string,
): Promise<SeededField> {
	const key = fieldKeyFromLabel(label);
	const definition = await db.fieldDefinition.upsert({
		where: { entity_key: { entity: "CONTACT", key } },
		create: {
			entity: "CONTACT",
			key,
			label,
			type,
			showOnTable: true,
			showOnFilter: true,
			showOnSheet: true,
			agentFilled: true,
			agentBrief:
				agentBrief ??
				`Retail field: capture ${label.toLowerCase()} when mentioned in Instagram, WhatsApp or store conversations.`,
			position,
			options: {
				create: options.map((optionLabel, index) => ({
					label: optionLabel,
					position: index,
				})),
			},
		},
		update: {
			label,
			showOnTable: true,
			showOnFilter: true,
			showOnSheet: true,
			agentFilled: true,
			agentBrief:
				agentBrief ??
				`Retail field: capture ${label.toLowerCase()} when mentioned in Instagram, WhatsApp or store conversations.`,
		},
		include: { options: true },
	});

	// Ensure SELECT options exist (idempotent for re-runs)
	if (type === FieldType.SELECT && options.length > 0) {
		for (const [index, optionLabel] of options.entries()) {
			const existing = definition.options.find((o) => o.label === optionLabel);
			if (!existing) {
				await db.fieldOption.create({
					data: {
						fieldId: definition.id,
						label: optionLabel,
						position: index,
					},
				});
			}
		}
	}

	const refreshed = await db.fieldDefinition.findUniqueOrThrow({
		where: { id: definition.id },
		include: { options: true },
	});

	return {
		id: refreshed.id,
		key: refreshed.key,
		options: refreshed.options,
	};
}

async function main() {
	console.log("Seeding retail custom fields for CONTACT…");

	const preferredSize = await upsertField(
		"Talla preferida",
		FieldType.SELECT,
		100,
		SIZES,
		"Talla que el cliente menciona con más frecuencia (ropa, calzado, etc.).",
	);

	const preferredColor = await upsertField(
		"Color preferido",
		FieldType.TEXT,
		101,
		[],
		"Color o gama que el cliente suele pedir o menciona como favorito.",
	);

	const instagramHandle = await upsertField(
		"Instagram handle",
		FieldType.TEXT,
		102,
		[],
		"Handle de Instagram del cliente (sin @). Útil para seguimiento de DMs.",
	);

	const pickupPreference = await upsertField(
		"Preferencia de pickup",
		FieldType.SELECT,
		103,
		PICKUP_OPTIONS,
		"Si prefiere recoger en tienda física, envío a domicilio, o ambos.",
	);

	console.log("Retail fields ready:");
	console.log(`  - ${preferredSize.key} (${preferredSize.options.length} options)`);
	console.log(`  - ${preferredColor.key}`);
	console.log(`  - ${instagramHandle.key}`);
	console.log(`  - ${pickupPreference.key} (${pickupPreference.options.length} options)`);
	console.log("Done. These fields appear on the contact sheet and are agent-fillable.");
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await db.$disconnect();
	});
