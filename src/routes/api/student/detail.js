import { db } from "$lib/db";

export async function post(request) {
	const data = JSON.parse(request.body);

	let account = data.account;

	const [
		rows,
		fields
	] = await db.execute(
		"SELECT student_info.account, student_info.name, student_info.gender, student_info.age, student_info.faculty, student_info.grade, student_info.phone, student_pos.building, student_pos.room FROM student_info LEFT JOIN student_pos ON student_info.account = student_pos.account WHERE student_info.account = ?",
		[account]
	);
	return {
		status: 200,
		body: rows
	};
}

export async function put(request) {
	const data = JSON.parse(request.body);

	let account = data.account;
	let name = data.name;
	let gender = data.gender;
	let age = data.age;
	let faculty = data.faculty;
	let grade = data.grade;
	let phone = data.phone;
	let building = data.building;
	let room = data.room;

	const [
		rows,
		fields
	] = await db.execute(
		"UPDATE student_info SET name = ?, gender = ?, age = ?, faculty = ?, grade = ?, phone = ? WHERE account = ?",
		[name, gender, age, faculty, grade, phone, account]
	);

	if (typeof building == "string" && typeof room == "string") {
		if (building != "" && room != "") {
			const [
				rows2,
				fields2
			] = await db.execute(
				"SELECT building, room FROM dormitory_info WHERE building = ? AND room = ?",
				[building, room]
			);
			if (JSON.stringify(rows2).length == 2) {
				return {
					body: {
						status: "error",
						msg: "不存在该宿舍。"
					}
				};
			} else {
				const [
					rows3,
					fields3
				] = await db.execute(
					"SELECT count(*) AS amount FROM student_pos WHERE building = ? AND room = ?",
					[building, room]
				);

				const [
					rows4,
					fields4
				] = await db.execute(
					"SELECT account, building, room FROM student_pos WHERE account = ? AND building = ? AND room = ?",
					[account, building, room]
				);

				if (rows3[0].amount >= 4) {
					if (JSON.stringify(rows4).length == 2) {
						return {
							body: {
								status: "error",
								msg: "该宿舍已满员。"
							}
						};
					}
				}

				const [
					rows5,
					fields5
				] = await db.execute("SELECT gender FROM dormitory_info WHERE building = ? AND room = ?", [
					building,
					room
				]);
				if (rows5[0].gender != gender) {
					return {
						body: {
							status: "error",
							msg: "该宿舍与该学生的性别不匹配。"
						}
					};
				}

				const [
					rows1,
					fields1
				] = await db.query("UPDATE student_pos SET building = ?, room = ? WHERE account = ?", [
					building,
					room,
					account
				]);

				return {
					body: {
						status: "success",
						body: rows
					}
				};
			}
		} else {
			const [
				rows6,
				fields6
			] = await db.query("UPDATE student_pos SET building = NULL, room = NULL WHERE account = ?", [
				account
			]);

			return {
				body: {
					status: "success"
				}
			};
		}
	}

	return {
		body: {
			status: "success"
		}
	};
}

export async function del(request) {
	const data = JSON.parse(request.body);

	let account = data.account;

	const [rows1, fields1] = await db.query("DELETE FROM student_info WHERE account = ?", [account]);
	const [rows2, fields2] = await db.query("DELETE FROM student_pos WHERE account = ?", [account]);
	return {
		body: {
			status: "success"
		}
	};
}
