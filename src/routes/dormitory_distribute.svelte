<script context="module">
	export async function load({ fetch, session }) {
		if (!session.user.isLoggedIn) {
			return {
				status: 301,
				redirect: "/"
			};
		}

		const res = await fetch("/api/dormitory/distribute/manage");
		const jsonRes = await res.json();

		const res1 = await fetch("/api/faculty");
		const jsonRes1 = await res1.json();

		return {
			status: 200,
			props: {
				students: jsonRes,
				items: jsonRes1,
				user_account: session.user.account
			}
		};
	}
</script>

<script>
	import Sidebar from "$lib/Sidebar.svelte";
	import Footer from "$lib/Footer.svelte";

	export let user_account;
	export let students;
	export let items;

	let dSelected = "faculty";
	let faculty;
	let grade;

	let search;
	let selected;

	function checkSearchBox() {
		if (search == undefined) {
			alert("请输入你想要搜索的内容。");
			return false;
		} else {
			searchDormitoryInfo();
		}
	}

	async function searchDormitoryInfo() {
		const data = JSON.stringify({
			selected: selected,
			search: search
		});

		const res = await fetch("/api/dormitory/distribute/search", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();

		students = jsonRes;
	}

	async function submitDistribution() {
		const data = JSON.stringify({
			faculty: faculty,
			grade: grade
		});

		const res = await fetch("/api/dormitory/distribute/manage", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();

		if (jsonRes.status == "error") {
			alert("自动分配宿舍失败：" + jsonRes.msg);
			return false;
		} else {
			alert("自动分配宿舍成功。");
			updateDistribution();
		}
	}

	async function updateDistribution() {
		const res = await fetch("/api/dormitory/distribute/manage");
		const jsonRes = await res.json();

		students = jsonRes;
		search = "";
	}
</script>

<svelte:head>
	<title>宿舍分配 | 学生宿舍管理系统</title>
</svelte:head>

<Sidebar>
	<svelte:fragment slot="account">{user_account}</svelte:fragment>
</Sidebar>

<div class="grid grid-cols-4 gap-4">
	<div class="col-span-2 card shadow-2xl m-8">
		<div class="card-body">
			<p class="card-title">自动分配宿舍</p>

			<div class="grid grid-cols-4 gap-3">
				<div class="col-span-2 form-control">
					<p class="label">
						<span class="label-text">项目</span>
					</p>
					<select bind:value={dSelected} class="select select-bordered">
						<option value={"faculty"}>院系</option>
						<option value={"grade"}>年级</option>
					</select>
				</div>

				<div class="col-span-2 form-control">
					{#if dSelected == "faculty"}
						<div class="label">
							<div class="label-text">院系</div>
						</div>
						<select bind:value={faculty} class="select select-bordered">
							{#each items as item}
								<option value={item.item}>{item.item}</option>
							{/each}
						</select>
					{:else}
						<div class="label">
							<div class="label-text">年级</div>
						</div>
						<select bind:value={grade} class="select select-bordered">
							<option value="大一">大一</option>
							<option value="大二">大二</option>
							<option value="大三">大三</option>
							<option value="大四">大四</option>
						</select>
					{/if}
				</div>
			</div>
			<div class="justify-end card-actions">
				<button on:click={submitDistribution} class="btn btn-outline" type="button"> 提交 </button>
			</div>
		</div>
	</div>

	<div class="col-span-2 card shadow-2xl m-8">
		<div class="card-body">
			<p class="card-title">检索未分配宿舍学生信息</p>

			<div class="grid grid-cols-4 gap-3">
				<div class="col-span-2 form-control">
					<p class="label">
						<span class="label-text">项目</span>
					</p>
					<select bind:value={selected} class="select select-bordered">
						<option value={"account"}>学号</option>
						<option value={"name"}>姓名</option>
						<option value={"gender"}>性别</option>
						<option value={"faculty"}>院系</option>
					</select>
				</div>
				<div class="col-span-2 form-control">
					<p class="label">
						<span class="label-text">信息</span>
					</p>
					<input bind:value={search} type="text" placeholder="信息" class="input input-bordered" />
				</div>
			</div>
			<div class="justify-end card-actions">
				<button on:click={checkSearchBox} class="btn btn-outline" type="button"> 查找 </button>
				<button on:click={updateDistribution} class="btn btn-outline" type="button"> 重置 </button>
			</div>
		</div>
	</div>
</div>

<div class="card shadow-2xl m-8">
	<div class="card-body">
		<p class="card-title">未分配宿舍学生信息表</p>
		<div class="overflow-x-auto">
			<table class="table w-full table-compact">
				<thead>
					<tr>
						<th>学号</th>
						<th>姓名</th>
						<th>性别</th>
						<th>院系</th>
						<th>年级</th>
						<th>操作</th>
					</tr>
				</thead>

				<tbody>
					{#each students as student}
						<tr class="bg-gray-100 border-b border-gray-200">
							<td>{student.account}</td>
							<td>{student.name}</td>
							<td>{student.gender}</td>
							<td>{student.faculty}</td>
							<td>{student.grade}</td>
							<td>
								<a href="/student_detail/{student.account}">
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
						<th>学号</th>
						<th>姓名</th>
						<th>性别</th>
						<th>院系</th>
						<th>年级</th>
						<th>操作</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>

<Footer />
