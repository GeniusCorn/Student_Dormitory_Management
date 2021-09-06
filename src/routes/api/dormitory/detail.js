import { db } from "$lib/db";

export async function get(request) {}

export async function post(request) {
	const data = JSON.parse(request.body);

	let id = data.id;

	const [
		rows,
		fields
	] = await db.query(
		"SELECT dormitory_info.id, dormitory_info.building, dormitory_info.room, dormitory_info.price, dormitory_info.gender, student_pos.account FROM dormitory_info LEFT JOIN student_pos ON dormitory_info.building = student_pos.building AND dormitory_info.room = student_pos.room WHERE dormitory_info.id = ?",
		[id]
	);
	return {
		body: rows
	};
}

export async function put(request) {
	const data = JSON.parse(request.body);

	let id = data.id;
	let building = data.building;
	let room = data.room;
	let price = data.price;
	let gender = data.gender;

	const [
		rows1,
		fields1
	] = await db.query("UPDATE dormitory_info SET price = ?, gender = ? WHERE id = ?", [
		price,
		gender,
		id
	]);

	return {
		status: 201,
		body: {
			status: "success"
		}
	};
}

export async function del(request) {
	const data = JSON.parse(request.body);

	let id = data.id;
	let building = data.building;
	let room = data.room;

	const [rows1, fields1] = await db.query("DELETE FROM dormitory_info WHERE id = ?", [id]);
	const [
		rows2,
		fields2
	] = await db.query(
		"UPDATE student_pos SET building = NULL, room = NULL WHERE building = ? AND room = ?",
		[building, room]
	);

	return {
		status: 200,
		body: {
			msg: "success"
		}
	};
}
