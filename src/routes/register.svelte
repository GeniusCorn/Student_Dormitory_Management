<script>
	import { goto } from "$app/navigation";

	let name;
	let account;
	let password;
	let rePassword;

	function check() {
		if (name == undefined || name.length < 2) {
			alert("姓名格式有误。");
			return false;
		} else if (account == undefined || account.length != 12) {
			alert("学号格式有误。");
			return false;
		} else if (password == undefined) {
			alert("请确认密码。");
			return false;
		} else if (rePassword == undefined) {
			alert("请确认密码。");
			return false;
		} else if (password.length < 6) {
			alert("密码必须大于六位。");
			return false;
		} else if (password != rePassword) {
			alert("两次密码输入不一致。");
			return false;
		} else {
			register();
		}
	}

	async function register() {
		const register_data = {
			name: name,
			account: account,
			password: password
		};

		let data = JSON.stringify(register_data);
		const res = await fetch("/api/auth/register", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();

		if (jsonRes.status == "error") {
			alert("注册失败。原因：" + jsonRes.msg);
			return false;
		} else {
			alert("注册成功，返回登入页面。");
			goto("/");
		}
	}
</script>

<svelte:head>
	<title>注册 | 学生宿舍管理系统</title>
</svelte:head>

<div class="flex h-screen">
	<div class="m-auto card shadow-2xl max-w-md">
		<div class="card-body">
			<h2 class="text-3xl font-bold text-gray-700 text-center">创建您的帐户</h2>

			<h3 class="mt-1 text-sm font-medium text-center">
				只需一个账户，您即可访问学生宿舍管理系统的所有内容。
			</h3>

			<p class="mt-1 text-sm text-center">
				已有账户？
				<a href="/" class="mx-2 text-sm font-bold text-blue-600 hover:text-blue-500 hover:underline"
					>在此登录></a
				>
			</p>

			<div class="form-control">
				<p class="label">
					<span class="label-text">姓名</span>
				</p>
				<input bind:value={name} type="text" placeholder="姓名" class="input input-bordered" />
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">学号</span>
				</p>
				<input bind:value={account} type="text" placeholder="学号" class="input input-bordered" />
				<p class="px-2 mt-2 text-gray-500 text-sm">学号将作为您的登录账户。</p>
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
			<div class="form-control">
				<p class="label">
					<span class="label-text">确认密码</span>
				</p>
				<input
					bind:value={rePassword}
					type="password"
					placeholder="确认密码"
					class="input input-bordered"
				/>
			</div>

			<p class="px-2 mt-2 text-gray-500 text-sm font-bold text-center">
				您的账户信息被用于确保您能够安全登录并访问您的数据。出于安全性、支持和报告的目的，学生宿舍管理系统会记录您的某些使用情况数据。
			</p>

			<div class="justify-end card-actions">
				<button on:click={check} class="btn btn-outline" type="button"> 注册 </button>
			</div>
		</div>
	</div>
</div>
