import mysql from "mysql2/promise";

export const db = mysql.createPool({
	host: "127.0.0.1",
	user: "corn",
	password: "corn",
	database: "test"
});
