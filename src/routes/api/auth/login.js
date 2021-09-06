import { db } from "$lib/db";
import * as cookie from "cookie";

export async function post(request) {
	const body = JSON.parse(request.body);
	let account = body.account;
	let password = body.password;

	const [
		rows,
		fields
	] = await db.execute("SELECT account, password, admin FROM user_account WHERE account = ?", [
		account
	]);

	if (JSON.stringify(rows).length == 2 || rows[0].password != password) {
		return {
			body: {
				status: "error",
				msg: "错误的用户名或密码。"
			}
		};
	}

	const [rows1, fields1] = await db.execute("SELECT name FROM student_info WHERE account = ?", [
		account
	]);

	const headers = {
		"Set-cookie": [
			cookie.serialize("account", account, { path: "/" }),
			cookie.serialize("admin", rows[0].admin, { path: "/" })
		]
	};

	return {
		headers
	};
}
