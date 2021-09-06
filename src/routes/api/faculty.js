import { db } from "$lib/db";

export async function get(request) {
	const [rows, fields] = await db.execute("SELECT id, item FROM faculty");

	return {
		status: 200,
		body: rows
	};
}

export async function post(request) {
	const data = JSON.parse(request.body);

	let faculty = data.faculty;

	const [rows, fields] = await db.execute("SELECT id, item FROM faculty WHERE item = ?", [faculty]);
	if (JSON.stringify(rows).length != 2) {
		return {
			status: 400,
			body: {
				status: "error",
				msg: "已存在该院系。"
			}
		};
	} else {
		const [rows1, fields1] = await db.query("INSERT INTO faculty ( item ) VALUES ( ? )", [faculty]);
		return {
			status: 201,
			body: {
				status: "success"
			}
		};
	}
}

export async function del(request) {
	const data = JSON.parse(request.body);

	let id = data.id;

	const [rows, fields] = await db.query("DELETE FROM faculty WHERE id = ?", [id]);

	return {
		status: 200,
		body: {
			status: "success"
		}
	};
}
