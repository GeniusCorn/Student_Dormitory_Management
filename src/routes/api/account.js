import { db } from "$lib/db";

export async function get(request) {
	const [rows, fields] = await db.execute("SELECT account, admin FROM user_account");

	return {
		status: 200,
		body: rows
	};
}

export async function post(request) {
	const data = JSON.parse(request.body);

	let account = data.account;
	let password = data.password;

	const [
		rows,
		fields
	] = await db.execute("SELECT account, admin FROM user_account WHERE account = ?", [account]);

	if (JSON.stringify(rows).length != 2) {
		return {
			body: {
				status: "error",
				msg: "该账号已存在。"
			}
		};
	}

	const [
		rows1,
		fields1
	] = await db.query("INSERT INTO user_account (account, password, admin) VALUES (?, ?, 1)", [
		account,
		password
	]);

	return {
		body: rows1
	};
}

export async function del(request) {
	const data = JSON.parse(request.body);

	let account = data.account;

	const [rows, fields] = await db.query("DELETE FROM user_account WHERE account = ?", [account]);

	return {
		status: 200,
		body: {
			status: "success"
		}
	};
}
