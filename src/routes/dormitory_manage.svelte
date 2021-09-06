<script context="module">
	export async function load({ fetch, session }) {
		if (!session.user.isLoggedIn) {
			return {
				status: 301,
				redirect: "/"
			};
		}

		const res = await fetch("/api/dormitory/manage");
		const jsonRes = await res.json();
		return {
			status: 200,
			props: {
				dormitories: jsonRes,
				user_account: session.user.account
			}
		};
	}
</script>

<script>
	import Footer from "$lib/Footer.svelte";
	import Sidebar from "$lib/Sidebar.svelte";

	export let dormitories;
	export let user_account;

	let id;
	let building;
	let room;
	let price;
	let gender;

	let search;
	let selected;

	function checkInsertDormitoryInfo() {
		if (building == undefined || building.length > 3) {
			alert("楼栋格式有误！");
			return false;
		} else if (room == undefined || room.length > 3) {
			alert("房号格式有误！");
			return false;
		} else if (price == undefined || price.length > 4) {
			alert("价格格式有误！");
			return false;
		} else {
			insertDormitoryInfo();
		}
	}

	function checkSearchBox() {
		if (selected == "chosing") {
			alert("请输入你想要搜索的内容。");
			return false;
		} else if (search == undefined) {
			alert("请选择你想要搜索的内容。");
			return false;
		} else {
			searchDormitoryInfo();
		}
	}

	async function insertDormitoryInfo() {
		const data = JSON.stringify({
			building: building,
			room: room,
			price: price,
			gender: gender
		});

		const res = await fetch("/api/dormitory/manage", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.status == "success") {
			updateDormitoryInfo();
			alert("新增宿舍数据成功。");
		} else {
			alert("新增宿舍数据失败：" + jsonRes.msg);
		}
	}

	async function searchDormitoryInfo() {
		const data = JSON.stringify({
			selected: selected,
			search: search
		});

		const res = await fetch("/api/dormitory/search", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();

		dormitories = jsonRes;
	}

	async function updateDormitoryInfo() {
		const res = await fetch("/api/dormitory/manage");
		const jsonRes = await res.json();
		dormitories = jsonRes;

		search = "";
	}
</script>

<svelte:head>
	<title>宿舍管理 | 学生宿舍管理系统</title>
</svelte:head>

<Sidebar>
	<svelte:fragment slot="account">{user_account}</svelte:fragment>
</Sidebar>

<div class="grid grid-cols-3 gap-4">
	<div class="col-span-2 card shadow-2xl m-8">
		<div class="card-body">
			<p class="card-title">新建宿舍信息</p>

			<div class="grid grid-cols-4 gap-3">
				<div class="form-control">
					<p class="label">
						<span class="label-text">楼栋</span>
					</p>
					<input
						bind:value={building}
						type="text"
						placeholder="楼栋"
						class="input input-bordered"
					/>
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">房号</span>
					</p>
					<input bind:value={room} type="text" placeholder="房号" class="input input-bordered" />
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">价格（￥）</span>
					</p>
					<input
						bind:value={price}
						type="text"
						placeholder="价格（￥）"
						class="input input-bordered"
					/>
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">性别</span>
					</p>
					<select bind:value={gender} class="select select-bordered w-full">
						<option value={"男"}>男</option>
						<option value={"女"}>女</option>
						<option value={"非二元性别"}>非二元性别</option>
					</select>
				</div>
			</div>
			<div class="justify-end card-actions">
				<button on:click={checkInsertDormitoryInfo} class="btn btn-outline" type="button">
					提交
				</button>
			</div>
		</div>
	</div>

	<div class="card shadow-2xl m-8">
		<div class="card-body">
			<p class="card-title">检索宿舍信息</p>

			<div class="grid grid-cols-2 gap-2">
				<div class="form-control">
					<p class="label">
						<span class="label-text">项目</span>
					</p>
					<select bind:value={selected} class="select select-bordered w-full">
						<option value={"building"}>楼栋</option>
						<option value={"room"}>房号</option>
					</select>
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">信息</span>
					</p>
					<input bind:value={search} type="text" placeholder="信息" class="input input-bordered" />
				</div>
			</div>
			<div class="justify-end card-actions">
				<button on:click={checkSearchBox} class="btn btn-outline" type="button"> 查找 </button>
				<button on:click={updateDormitoryInfo} class="btn btn-outline" type="button"> 重置 </button>
			</div>
		</div>
	</div>
</div>

<div class="card shadow-2xl m-8">
	<div class="card-body">
		<p class="card-title">宿舍信息表</p>
		<div class="overflow-x-auto">
			<table class="table w-full table-compact">
				<thead>
					<tr>
						<th>楼栋</th>
						<th>房号</th>
						<th>价格（￥）</th>
						<th>性别</th>
						<th>操作</th>
					</tr>
				</thead>

				<tbody>
					{#each dormitories as dormitory}
						<tr class="bg-gray-100 border-b border-gray-200">
							<td>{dormitory.building}</td>
							<td>{dormitory.room}</td>
							<td>{dormitory.price}</td>
							<td>{dormitory.gender}</td>
							<td>
								<a href="/dormitory_detail/{dormitory.id}">
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
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th>楼栋</th>
						<th>房号</th>
						<th>价格（￥）</th>
						<th>性别</th>
						<th>操作</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>

<Footer />
