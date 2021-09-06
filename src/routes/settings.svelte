<script context="module">
	export async function load({ fetch, session }) {
		if (!session.user.isLoggedIn) {
			return {
				status: 301,
				redirect: "/"
			};
		}

		const res = await fetch("/api/faculty");
		const jsonRes = await res.json();

		const res1 = await fetch("/api/account");
		const jsonRes1 = await res1.json();

		return {
			status: 200,
			props: {
				items: jsonRes,
				accounts: jsonRes1,
				user_account: session.user.account,
				admin: session.user.admin
			}
		};
	}
</script>

<script>
	import Footer from "$lib/Footer.svelte";
	import Sidebar from "$lib/Sidebar.svelte";

	export let user_account;
	export let items;
	export let admin;
	export let accounts;

	let faculty;
	let id;
	let account;
	let password;

	async function logout() {
		const res = await fetch("/api/auth/logout", {
			method: "POST"
		});
		window.location.replace("/");
	}

	function checkInsertFacultyInfo() {
		if (faculty == undefined) {
			alert("请输入你想要新增的院系名称！");
			return false;
		} else {
			insertFacultyInfo();
		}
	}

	async function insertFacultyInfo() {
		const data = JSON.stringify({
			faculty: faculty
		});

		const res = await fetch("/api/faculty", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.status == "success") {
			updateFacultyInfo();
			alert("新增院系数据成功。");
		} else {
			alert("新增院系数据失败：" + jsonRes.msg);
		}
	}

	async function insertAdminAccount() {
		const data = JSON.stringify({
			account: account,
			password: password
		});

		const res = await fetch("/api/account", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.status == "error") {
			alert("新建管理员数据失败：" + jsonRes.msg);
		} else {
			alert("新建管理员数据成功。");
			updateAccountInfo();
		}
	}

	async function delFacultyInfo(id) {
		const data = JSON.stringify({
			id: id
		});

		const res = await fetch("/api/faculty", {
			method: "DELETE",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.msg == "error") {
			alert("删除院系信息失败：" + jsonRes.msg);
		} else {
			alert("删除院系信息成功。");
			updateFacultyInfo();
		}
	}

	async function delAccount(account) {
		if (account == user_account) {
			alert("删除账号信息失败：无法删除当前正在使用账户，请切换至其他账号重试。");
			return false;
		}

		const data = JSON.stringify({
			account: account
		});

		const res = await fetch("/api/account", {
			method: "DELETE",
			body: data
		});
		const jsonRes = await res.json();

		if (jsonRes.msg == "error") {
			alert("删除账号信息失败：" + jsonRes.msg);
		} else {
			alert("删除账号信息成功。");
			updateAccountInfo();
		}
	}

	async function updateFacultyInfo() {
		const res = await fetch("/api/faculty");
		const jsonRes = await res.json();
		items = jsonRes;

		faculty = "";
	}

	async function updateAccountInfo() {
		const res = await fetch("/api/account");
		const jsonRes = await res.json();
		accounts = jsonRes;

		account = "";
		password = "";
	}
</script>

<svelte:head>
	<title>系统设置 | 学生宿舍管理系统</title>
</svelte:head>

<Sidebar>
	<svelte:fragment slot="account">{user_account}</svelte:fragment>
</Sidebar>

<div class="grid grid-cols-3 gap-4">
	{#if admin == 1}
		<div class="card shadow-2xl m-8">
			<div class="card-body">
				<p class="card-title">院系信息管理</p>

				<div class="grid grid-cols-2 gap-3">
					<div class="form-control">
						<p class="label">
							<span class="label-text">新建院系</span>
						</p>
						<input
							bind:value={faculty}
							type="text"
							placeholder="院系"
							class="input input-bordered"
						/>
					</div>
				</div>
				<div class="justify-end card-actions">
					<button on:click={checkInsertFacultyInfo} class="btn btn-outline" type="button">
						提交
					</button>
				</div>
				<div class="overflow-x-auto">
					<table class="table w-full table-compact">
						<thead>
							<tr>
								<th>院系</th>
								<th>操作</th>
							</tr>
						</thead>

						<tbody>
							{#each items as item}
								<tr>
									<td>{item.item}</td>
									<td>
										<button
											on:click={() => delFacultyInfo(item.id)}
											class="btn btn-xs"
											type="button"
										>
											删除<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												class="inline-block w-4 h-4 ml-1 stroke-current"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</button>
									</td>
								</tr>
							{/each}
						</tbody>

						<tfoot>
							<tr>
								<th>院系</th>
								<th>操作</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	{/if}

	{#if admin == 1}
		<div class="card shadow-2xl m-8">
			<div class="card-body">
				<div class="card-title">账号管理</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">新建管理员账号</span>
					</p>
					<div class="grid grid-cols-2 gap-4">
						<input
							bind:value={account}
							type="text"
							placeholder="账号"
							class="input input-bordered"
						/>
						<input
							bind:value={password}
							type="password"
							placeholder="密码"
							class="input input-bordered"
						/>
					</div>
				</div>

				<div class="justify-end card-actions">
					<button on:click={insertAdminAccount} class="btn btn-outline" type="button">
						提交
					</button>
				</div>

				<div class="overflow-x-auto">
					<table class="table w-full table-compact">
						<thead>
							<tr>
								<th>账号</th>
								<th>管理员权限</th>
								<th>操作</th>
							</tr>
						</thead>

						<tbody>
							{#each accounts as account}
								<tr>
									<td>{account.account}</td>
									{#if account.admin == 1}
										<td>是</td>
									{:else}
										<td>否</td>
									{/if}
									<td>
										<button
											on:click={() => delAccount(account.account)}
											class="btn btn-xs"
											type="button"
										>
											删除<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												class="inline-block w-4 h-4 ml-1 stroke-current"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</button>
									</td>
								</tr>
							{/each}
						</tbody>

						<tfoot>
							<tr>
								<th>账号</th>
								<th>管理员权限</th>
								<th>操作</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	{/if}

	<div class="card shadow-2xl m-8 h-56">
		<div class="card-body">
			<div class="card-title">账号操作</div>
			<div class="justify-end card-actions">
				<div data-tip="暂停使用" class="tooltip">
					<button disabled="disabled" class="btn btn-outline">注销</button>
				</div>
				<button on:click={logout} class="btn btn-outline" type="button">登出</button>
			</div>
		</div>
	</div>
</div>

<Footer />
