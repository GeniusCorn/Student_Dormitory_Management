import { db } from "$lib/db";

export async function get() {}

export async function post(request) {
	const data = JSON.parse(request.body);

	let search = data.search;
	let selected = data.selected;

	switch (selected) {
		case "building":
			const [rows, fields] = await db.execute(
				"SELECT id, building, room, price, gender FROM dormitory_info WHERE building LIKE '%" +
					search +
					"%' ORDER BY building, room, price"
			);
			return {
				status: 200,
				body: rows
			};
			break;
		case "room":
			const [rows1, fields1] = await db.execute(
				"SELECT id, building, room, price, gender FROM dormitory_info WHERE room LIKE '%" +
					search +
					"%' ORDER BY building, room, price"
			);
			return {
				status: 200,
				body: rows1
			};
			break;
		default:
			break;
	}
}

export async function put(request) {}

export async function del(request) {}
