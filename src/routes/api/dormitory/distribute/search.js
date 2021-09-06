import { db } from "$lib/db";

export async function get() {}

export async function post(request) {
	const data = JSON.parse(request.body);

	let search = data.search;
	let selected = data.selected;

	switch (selected) {
		case "account":
			const [rows, fields] = await db.execute(
				"SELECT student_pos.account, student_info.name, student_info.gender, student_info.faculty, student_info.grade, student_pos.building, student_pos.room FROM student_pos INNER JOIN student_info ON building IS NULL AND student_pos.account = student_info.account AND student_info.account = student_pos.account AND student_info.account LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows
			};
			break;
		case "name":
			const [rows1, fields1] = await db.execute(
				"SELECT student_pos.account, student_info.name, student_info.gender, student_info.faculty, student_info.grade, student_pos.building, student_pos.room FROM student_pos INNER JOIN student_info ON building IS NULL AND student_pos.account = student_info.account AND student_info.account = student_pos.account AND student_info.name LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows1
			};
			break;
		case "gender":
			const [rows2, fields2] = await db.execute(
				"SELECT student_pos.account, student_info.name, student_info.gender, student_info.faculty, student_info.grade, student_pos.building, student_pos.room FROM student_pos INNER JOIN student_info ON building IS NULL AND student_pos.account = student_info.account AND student_info.account = student_pos.account AND student_info.gender LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows2
			};
			break;
		case "faculty":
			const [rows3, fields3] = await db.execute(
				"SELECT student_pos.account, student_info.name, student_info.gender, student_info.faculty, student_info.grade, student_pos.building, student_pos.room FROM student_pos INNER JOIN student_info ON building IS NULL AND student_pos.account = student_info.account AND student_info.account = student_pos.account AND student_info.faculty LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows3
			};
			break;
		default:
			break;
	}
}

export async function put(request) {}

export async function del(request) {}
