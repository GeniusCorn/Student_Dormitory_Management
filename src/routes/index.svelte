<script context="module">
	export async function load({ fetch, session }) {
		if (session.user.isLoggedIn) {
			return {
				status: 301,
				redirect: "/student_manage"
			};
		}
		return {
			status: 200
		};
	}
</script>

<script>
	import { goto } from "$app/navigation";

	let account;
	let password;

	function check() {
		if (account == undefined) {
			alert("您的账户格式有误！");
			return false;
		} else if (password == undefined) {
			alert("您的密码格式有误！");
			return false;
		}
		login();
	}

	async function login() {
		const data = JSON.stringify({
			account: account,
			password: password
		});
		const res = await fetch("/api/auth/login", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.status == "error") {
			alert("登录失败。原因：" + jsonRes.msg);
			return false;
		} else {
			window.location.replace("/student_manage");
		}
	}

	function forgotPassword() {
		alert("请联系管理员重置账号。");
		return false;
	}
</script>

<svelte:head>
	<title>登录 | 学生宿舍管理系统</title>
</svelte:head>

<div class="flex h-screen">
	<div class="m-auto card shadow-2xl max-w-md">
		<div class="card-body">
			<h2 class="text-3xl font-bold text-gray-700 text-center">学生宿舍管理系统</h2>

			<h3 class="mt-1 text-sm font-medium text-center">即刻管理宿舍</h3>
			<div class="form-control">
				<p class="label">
					<span class="label-text">账户</span>
				</p>
				<input bind:value={account} type="text" placeholder="账户" class="input input-bordered" />
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">密码</span>
				</p>
				<input
					bind:value={password}
					type="password"
					placeholder="密码"
					class="input input-bordered"
				/>
			</div>

			<br />
			<button
				on:click={forgotPassword}
				class="text-sm text-gray-600 hover:text-gray-500 hover:underline"
				>忘记了您的账户或密码？</button
			>

			<div class="justify-end card-actions">
				<button on:click={check} class="btn btn-outline" type="button"> 登录 </button>
			</div>
		</div>
		<div class="flex items-center justify-center py-4 text-center bg-gray-100 dark:bg-gray-700">
			<span class="text-sm text-gray-600 dark:text-gray-200">没有账户？</span>

			<a
				href="/register"
				class="mx-2 text-sm font-bold text-blue-600 hover:text-blue-500 hover:underline"
				>创建您的账户</a
			>
		</div>
	</div>
</div>

<div class="m-8 w-full mx-auto text-center">
	<div class="font-bold text-4xl">您的账户适用于学生宿舍管理系统的全部服务</div>
	<div class="font-light text-xl">使用一个账户和密码即可访问所有学生宿舍管理系统的服务。</div>
</div>
