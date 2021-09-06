import { db } from "$lib/db";

export async function get(request) {
	const [rows, fields] = await db.execute(
		"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info LEFT JOIN student_pos ON student_info.account = student_pos.account"
	);
	return {
		status: 200,
		body: rows
	};
}

export async function post(request) {
	const data = JSON.parse(request.body);

	let account = data.account;
	let name = data.name;
	let gender = data.gender;
	let age = data.age;
	let faculty = data.faculty;
	let grade = data.grade;
	let phone = data.phone;

	const [rows1, fields1] = await db.execute("SELECT account FROM student_info WHERE account = ?", [
		account
	]);
	let result = JSON.stringify(rows1);
	if (result.length == 2) {
		const [
			rows2,
			fields2
		] = await db.query(
			"INSERT INTO student_info (account, name, gender, age, faculty, grade, phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[account, name, gender, age, faculty, grade, phone]
		);
		const [rows3, fields3] = await db.query("INSERT INTO student_pos (account) VALUES (?)", [
			account
		]);

		return {
			body: {
				status: "succees"
			}
		};
	} else {
		return {
			body: {
				status: "error",
				msg: "学生信息表中已存在该学号的学生。"
			}
		};
	}
}

export async function put(request) {}

export async function del(request) {}
