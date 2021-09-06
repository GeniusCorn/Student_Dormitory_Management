import { db } from "$lib/db";

export async function get(request) {
	const [rows, fields] = await db.execute(
		"SELECT id, building, room, price, gender FROM dormitory_info ORDER BY building"
	);
	return {
		status: 200,
		body: rows
	};
}

export async function post(request) {
	const data = JSON.parse(request.body);

	let building = data.building;
	let room = data.room;
	let price = data.price;
	let gender = data.gender;

	const [
		rows,
		fields
	] = await db.execute(
		"SELECT building, room FROM dormitory_info WHERE building = ? AND room = ?",
		[building, room]
	);
	if (JSON.stringify(rows).length != 2) {
		return {
			status: 400,
			body: {
				status: "error",
				msg: "已存在该宿舍。"
			}
		};
	} else {
		const [
			rows1,
			fields1
		] = await db.query(
			"INSERT INTO dormitory_info (building, room, price, gender) VALUES (?, ?, ?, ?)",
			[building, room, price, gender]
		);
		return {
			status: 201,
			body: {
				status: "success",
				msg: "成功"
			}
		};
	}
}

export async function put(request) {}

export async function del(request) {}
