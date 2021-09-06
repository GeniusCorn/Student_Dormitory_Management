import { db } from "$lib/db";

export async function get() {}

export async function post(request) {
	const data = JSON.parse(request.body);

	let search = data.search;
	let selected = data.selected;

	switch (selected) {
		case "account":
			const [rows, fields] = await db.execute(
				"SELECT checkin.id, checkin.account, student_info.name, checkin.action, checkin.time FROM checkin LEFT JOIN student_info ON checkin.account = student_info.account WHERE checkin.account LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows
			};
			break;
		case "action":
			const [rows1, fields1] = await db.execute(
				"SELECT checkin.id, checkin.account, student_info.name, checkin.action, checkin.time FROM checkin LEFT JOIN student_info ON checkin.account = student_info.account WHERE checkin.action LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows1
			};
			break;
		case "time":
			const [rows2, fields2] = await db.execute(
				"SELECT checkin.id, checkin.account, student_info.name, checkin.action, checkin.time FROM checkin LEFT JOIN student_info ON checkin.account = student_info.account WHERE checkin.time LIKE '%" +
					search +
					"%'"
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
