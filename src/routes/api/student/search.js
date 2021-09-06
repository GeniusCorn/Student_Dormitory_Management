import { db } from "$lib/db";

export async function get() {
	const [rows, fields] = await db.execute(
		"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info RIGHT JOIN student_pos ON student_info.account = student_pos.account"
	);

	return {
		status: 200,
		body: rows
	};
}

export async function post(request) {
	const data = JSON.parse(request.body);

	let search = data.search;
	let selected = data.selected;

	switch (selected) {
		case "name":
			const [rows, fields] = await db.execute(
				"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info LEFT JOIN student_pos ON student_info.account = student_pos.account WHERE student_info.name LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows
			};
			break;
		case "gender":
			const [rows1, fields1] = await db.execute(
				"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info LEFT JOIN student_pos ON student_info.account = student_pos.account WHERE student_info.gender LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows1
			};
			break;
		case "age":
			const [rows2, fields2] = await db.execute(
				"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info LEFT JOIN student_pos ON student_info.account = student_pos.account WHERE student_info.age LIKE '%" +
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
				"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info LEFT JOIN student_pos ON student_info.account = student_pos.account WHERE student_info.faculty LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows3
			};
			break;
		case "grade":
			const [rows4, fields4] = await db.execute(
				"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info LEFT JOIN student_pos ON student_info.account = student_pos.account WHERE student_info.grade LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows4
			};
			break;
		case "building":
			const [rows5, fields5] = await db.execute(
				"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info LEFT JOIN student_pos ON student_info.account = student_pos.account WHERE student_pos.building LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows5
			};
			break;
		case "room":
			const [rows6, fields6] = await db.execute(
				"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info LEFT JOIN student_pos ON student_info.account = student_pos.account WHERE student_pos.room LIKE '%" +
					search +
					"%'"
			);
			return {
				status: 200,
				body: rows6
			};
			break;
		default:
			break;
	}
}

export async function put(request) {}

export async function del(request) {}
