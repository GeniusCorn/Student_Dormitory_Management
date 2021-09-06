import { db } from "$lib/db";

export async function post(request) {
	const data = JSON.parse(request.body);
	let name = data.name;
	let account = data.account;
	let password = data.password;

	const [
		rows1,
		fields1
	] = await db.execute("SELECT account, name FROM student_info WHERE account = ? AND name = ?", [
		account,
		name
	]);
	if (JSON.stringify(rows1).length == 2) {
		return {
			body: {
				status: "error",
				msg: "学生信息表中不存在该学生信息，请联系管理员。"
			}
		};
	}

	const [
		rows,
		fields
	] = await db.query("INSERT INTO user_account (account, password, admin) VALUES (?, ?, 0)", [
		account,
		password
	]);

	return {
		body: {
			status: "success"
		}
	};
}
