import { db } from "$lib/db";

export async function get() {
	const [rows, fields] = await db.execute(
		"SELECT student_pos.account, student_info.name, student_info.gender, student_info.faculty, student_info.grade, student_pos.building, student_pos.room FROM student_pos INNER JOIN student_info ON building IS NULL AND student_pos.account = student_info.account ORDER BY student_info.account"
	);

	return {
		body: rows
	};
}

export async function post(request) {
	const data = JSON.parse(request.body);

	let faculty = data.faculty;
	let grade = data.grade;

	if (grade == undefined) {
		const [
			students,
			fields1
		] = await db.execute(
			"SELECT student_info.account, student_info.name, student_info.gender, student_info.faculty FROM student_pos INNER JOIN student_info ON building IS NULL AND student_info.account = student_pos.account WHERE student_info.faculty = ?",
			[faculty]
		);
		const [dormitories, fields2] = await db.execute(
			"SELECT building, room, gender FROM dormitory_info"
		);

		if (JSON.stringify(students).length == 2) {
			return {
				body: {
					status: "error",
					msg: "该院系已无待分配学生。"
				}
			};
		}

		let amount_students = Object.keys(students).length;
		let amount_dormitories = Object.keys(dormitories).length;

		for (let i = 0; i < amount_students; i = i + 1) {
			for (let j = 0; j < amount_dormitories; j = j + 1) {
				if (dormitories[j].gender == students[i].gender) {
					const [
						margin,
						fields3
					] = await db.execute(
						"SELECT count(*) AS amount FROM student_pos WHERE building = ? AND room = ?",
						[dormitories[j].building, dormitories[j].room]
					);
					if (margin[0].amount < 4) {
						const [
							update,
							fields4
						] = await db.query("UPDATE student_pos SET building = ?, room = ? WHERE account = ?", [
							dormitories[j].building,
							dormitories[j].room,
							students[i].account
						]);
						break;
					} else {
						continue;
					}
				}
			}
		}
		return {
			body: {
				status: "success"
			}
		};
	} else {
		const [
			students,
			fields1
		] = await db.execute(
			"SELECT student_info.account, student_info.name, student_info.gender, student_info.grade, student_info.faculty FROM student_pos INNER JOIN student_info ON building IS NULL AND student_info.account = student_pos.account WHERE student_info.grade = ?",
			[grade]
		);
		const [dormitories, fields2] = await db.execute(
			"SELECT building, room, gender FROM dormitory_info"
		);

		if (JSON.stringify(students).length == 2) {
			return {
				body: {
					status: "error",
					msg: "该年级已无待分配学生。"
				}
			};
		}

		let amount_students = Object.keys(students).length;
		let amount_dormitories = Object.keys(dormitories).length;

		for (let i = 0; i < amount_students; i = i + 1) {
			for (let j = 0; j < amount_dormitories; j = j + 1) {
				if (dormitories[j].gender == students[i].gender) {
					const [
						margin,
						fields3
					] = await db.execute(
						"SELECT count(*) AS amount FROM student_pos WHERE building = ? AND room = ?",
						[dormitories[j].building, dormitories[j].room]
					);
					if (margin[0].amount < 4) {
						const [
							update,
							fields4
						] = await db.query("UPDATE student_pos SET building = ?, room = ? WHERE account = ?", [
							dormitories[j].building,
							dormitories[j].room,
							students[i].account
						]);
						break;
					} else {
						continue;
					}
				}
			}
		}
		return {
			body: {
				status: "success"
			}
		};
	}
}
