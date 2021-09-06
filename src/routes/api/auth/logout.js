import * as cookie from 'cookie';

export async function post(request) {
	const headers = {
		'Set-cookie': cookie.serialize('account', 'deleted', {
			maxAge: -1,
			path: '/'
		})
	};

	return {
		status: 301,
		headers,
		redirect: '/'
	};
}
