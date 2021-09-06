<script context="module">
	export async function load({ fetch, session }) {
		if (!session.user.isLoggedIn) {
			return {
				status: 301,
				redirect: "/"
			};
		}

		const res = await fetch("/api/checkin/manage");
		const jsonRes = await res.json();

		return {
			status: 200,
			props: {
				checkin: jsonRes,
				user_account: session.user.account
			}
		};
	}
</script>

<script>
	import Footer from "$lib/Footer.svelte";
	import Sidebar from "$lib/Sidebar.svelte";

	export let user_account;
	export let checkin;

	let id;
	let account;
	let action;
	let time;

	let search;
	let selected;

	function checkInsertCheckinInfo() {
		if (account == undefined || account.length != 12) {
			alert("学号格式有误。");
			return false;
		} else {
			insertCheckinInfo();
		}
	}

	async function insertCheckinInfo() {
		const data = JSON.stringify({
			account: account,
			action: action
		});

		const res = await fetch("/api/checkin/manage", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.status == "success") {
			updateCheckinInfo();
			alert("新增考勤数据成功。");
		} else {
			alert("新增考勤数据失败：" + jsonRes.msg);
			return false;
		}
	}

	function checkSearchBox() {
		if (search == undefined) {
			alert("请输入你想要查找的信息！");
			return false;
		} else {
			checkCheckinInfo();
		}
	}

	async function updateCheckinInfo() {
		const res = await fetch("/api/checkin/manage");
		const jsonRes = await res.json();
		checkin = jsonRes;

		search = "";
	}

	async function delCheckinInfo(id) {
		const data = JSON.stringify({
			id: id
		});

		const res = await fetch("/api/checkin/manage", {
			method: "DELETE",
			body: data
		});
		const jsonRes = await res.json();

		updateCheckinInfo();
	}

	async function checkCheckinInfo() {
		const data = JSON.stringify({
			search: search,
			selected: selected
		});

		const res = await fetch("/api/checkin/search", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();

		checkin = jsonRes;
	}
</script>

<svelte:head>
	<title>出入登记 | 学生宿舍管理系统</title>
</svelte:head>

<Sidebar>
	<svelte:fragment slot="account">{user_account}</svelte:fragment>
</Sidebar>

<div class="grid grid-cols-4 gap-4">
	<div class="col-span-2 card shadow-2xl m-8">
		<div class="card-body">
			<p class="card-title">插入考勤信息</p>

			<div class="grid grid-cols-4 gap-3">
				<div class="col-span-2 form-control">
					<p class="label">
						<span class="label-text">学号</span>
					</p>
					<input bind:value={account} type="text" placeholder="学号" class="input input-bordered" />
				</div>
				<div class="col-span-2 form-control">
					<p class="label">
						<span class="label-text">行为</span>
					</p>
					<select bind:value={action} class="select select-bordered">
						<option value={"出寝"}>出寝</option>
						<option value={"归寝"}>归寝</option>
					</select>
				</div>
			</div>
			<div class="justify-end card-actions">
				<button on:click={checkInsertCheckinInfo} class="btn btn-outline" type="button">
					提交
				</button>
			</div>
		</div>
	</div>

	<div class="col-span-2 card shadow-2xl m-8">
		<div class="card-body">
			<p class="card-title">检索考勤信息</p>

			<div class="grid grid-cols-4 gap-3">
				<div class="col-span-2 form-control">
					<p class="label">
						<span class="label-text">项目</span>
					</p>
					<select bind:value={selected} class="select select-bordered">
						<option value={"account"}>学号</option>
						<option value={"action"}>行为</option>
						<option value={"time"}>时间</option>
					</select>
				</div>

				<div class="col-span-2 form-control">
					<p class="label">
						<span class="label-text">信息</span>
					</p>
					{#if selected == "action"}
						<select bind:value={search} class="select select-bordered">
							<option value={"出寝"}>出寝</option>
							<option value={"归寝"}>归寝</option>
						</select>
					{:else}
						<input
							bind:value={search}
							type="text"
							placeholder="信息"
							class="input input-bordered"
						/>
					{/if}
				</div>
			</div>
			<div class="justify-end card-actions">
				<button on:click={checkSearchBox} class="btn btn-outline" type="button"> 查找 </button>
				<button on:click={updateCheckinInfo} class="btn btn-outline" type="button"> 重置 </button>
			</div>
		</div>
	</div>
</div>

<div class="card shadow-2xl m-8">
	<div class="card-body">
		<p class="card-title">考勤信息表</p>
		<div class="overflow-x-auto">
			<table class="table w-full table-compact">
				<thead>
					<tr>
						<th>学号</th>
						<th>姓名</th>
						<th>行为</th>
						<th>时间</th>
						<th>操作</th>
					</tr>
				</thead>

				<tbody>
					{#each checkin as checkin}
						<tr class="bg-gray-100 border-b border-gray-200">
							<td>{checkin.account}</td>
							<td>{checkin.name}</td>
							{#if checkin.action == "出寝"}
								<td class="text-red-500">{checkin.action}</td>
							{:else}
								<td class="text-green-500">{checkin.action}</td>
							{/if}
							<td>{checkin.time}</td>
							<td>
								<a href="/student_detail/{checkin.account}">
									<button class="btn btn-xs" type="button">
										查看 <svg
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
										</svg></button
									>
								</a>

								<button
									on:click={() => delCheckinInfo(checkin.id)}
									class="btn btn-xs"
									type="button"
								>
									删除 <svg
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
									</svg></button
								>
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th>学号</th>
						<th>姓名</th>
						<th>行为</th>
						<th>时间</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>

<Footer />
