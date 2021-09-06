import * as cookie from "cookie";

export async function handle({ request, resolve }) {
	const token = cookie.parse(request.headers.cookie || "");
	if (token.account) {
		request.locals.isLoggedIn = true;
		request.locals.account = token.account;
		request.locals.admin = token.admin;
	} else {
		request.locals.isLoggedIn = false;
	}

	const response = await resolve(request);

	return {
		...response,
		headers: {
			...response.headers
		}
	};
}

export async function getSession(request) {
	return {
		user: {
			isLoggedIn: request.locals.isLoggedIn,
			account: request.locals.account,
			admin: request.locals.admin
		}
	};
}
