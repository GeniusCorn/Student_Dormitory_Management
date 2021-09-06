import { db } from "$lib/db";

export async function get(request) {
	const [rows, fields] = await db.execute(
		"SELECT checkin.id, checkin.account, student_info.name, checkin.action, checkin.time FROM checkin LEFT JOIN student_info ON checkin.account = student_info.account ORDER BY id DESC"
	);

	return {
		body: rows
	};
}

export async function post(request) {
	const data = JSON.parse(request.body);

	let account = data.account;
	let action = data.action;

	const [rows1, fields1] = await db.execute("SELECT account FROM student_info WHERE account = ?", [
		account
	]);
	if (JSON.stringify(rows1).length == 2) {
		return {
			body: {
				status: "error",
				msg: "该学号不存在于学生信息表中。"
			}
		};
	}

	const [rows, fields] = await db.query("INSERT INTO checkin (account, action) VALUES (?, ?)", [
		account,
		action
	]);

	return {
		body: {
			status: "success"
		}
	};
}

export async function del(request) {
	const data = JSON.parse(request.body);

	let id = data.id;

	const [rows, fields] = await db.query("DELETE FROM checkin WHERE id = ?", [id]);

	return {
		status: 200,
		body: rows
	};
}
