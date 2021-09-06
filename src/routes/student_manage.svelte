<script context="module">
	export async function load({ fetch, session }) {
		if (!session.user.isLoggedIn) {
			return {
				status: 301,
				redirect: "/"
			};
		}

		if (session.user.admin == 0) {
			return {
				status: 301,
				redirect: "/student_detail/" + session.user.account
			};
		}

		const res1 = await fetch("/api/student/manage");
		const jsonRes1 = await res1.json();

		const res2 = await fetch("/api/faculty");
		const jsonRes2 = await res2.json();

		return {
			status: 200,
			props: {
				items: jsonRes2,
				students: jsonRes1,
				user_account: session.user.account,
				admin: session.user.admin
			}
		};
	}
</script>

<script>
	import { onMount } from "svelte";
	import Sidebar from "$lib/Sidebar.svelte";
	import Footer from "$lib/Footer.svelte";

	export let students;
	export let items;
	export let user_account;

	let account;
	let name;
	let gender;
	let age;
	let faculty;
	let grade;
	let phone;

	let search;
	let selected;

	function checkInsertStudent() {
		if (account == undefined || account.length != 12) {
			alert("学号格式有误！");
			return false;
		} else if (name == undefined || name.length < 2) {
			alert("姓名格式有误！");
			return false;
		} else if (age == undefined || age.length > 2) {
			alert("年龄格式有误！");
			return false;
		} else if (faculty == undefined) {
			alert("院系格式有误！");
			return false;
		} else {
			insertStudentInfo();
		}
	}

	function checkSearchBox() {
		if (search == undefined) {
			alert("请输入你想要查找的内容。");
			return false;
		} else if (selected == "chosing") {
			alert("请选择你想要查找的项目。");
		} else {
			checkStudentInfo();
		}
	}

	async function insertStudentInfo() {
		const data = JSON.stringify({
			account: account,
			name: name,
			gender: gender,
			age: age,
			faculty: faculty,
			grade: grade,
			phone: phone
		});

		const res = await fetch("/api/student/manage", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.status == "succees") {
			updateStudentInfo();
			alert("新增学生数据成功。");
		} else {
			alert("新增学生数据失败：" + jsonRes.msg);
		}
	}

	async function checkStudentInfo() {
		const data = JSON.stringify({
			selected: selected,
			search: search
		});

		const res = await fetch("/api/student/search", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();

		students = jsonRes;
	}

	async function updateStudentInfo() {
		const res = await fetch("/api/student/manage");
		const jsonRes = await res.json();
		students = jsonRes;

		search = "";
		account = "";
		name = "";
		age = "";
		phone = "";
	}
</script>

<svelte:head>
	<title>学生管理 | 学生宿舍管理系统</title>
</svelte:head>

<Sidebar>
	<svelte:fragment slot="account">{user_account}</svelte:fragment>
</Sidebar>

<div class="grid grid-cols-3 gap-4">
	<div class="col-span-2 card shadow-2xl m-8">
		<div class="card-body">
			<p class="card-title">新建学生信息</p>

			<div class="grid grid-cols-4 gap-3">
				<div class="form-control">
					<p class="label">
						<span class="label-text">学号</span>
					</p>
					<input bind:value={account} type="text" placeholder="学号" class="input input-bordered" />
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">姓名</span>
					</p>
					<input bind:value={name} type="text" placeholder="姓名" class="input input-bordered" />
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">性别</span>
					</p>
					<select bind:value={gender} class="select select-bordered w-full">
						<option value="男">男</option>
						<option value="女">女</option>
						<option value="非二元性别">非二元性别</option>
					</select>
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">年龄</span>
					</p>
					<input bind:value={age} type="text" placeholder="年龄" class="input input-bordered" />
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">院系</span>
					</p>
					<select bind:value={faculty} class="select select-bordered w-full">
						{#each items as item}
							<option value={item.item}>{item.item}</option>
						{/each}
					</select>
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">年级</span>
					</p>
					<select bind:value={grade} class="select select-bordered w-full">
						<option value="大一">大一</option>
						<option value="大二">大二</option>
						<option value="大三">大三</option>
						<option value="大四">大四</option>
					</select>
				</div>
				<div class="form-control">
					<p class="label">
						<span class="label-text">电话</span>
					</p>
					<input bind:value={phone} type="text" placeholder="电话" class="input input-bordered" />
				</div>
			</div>
			<div class="justify-end card-actions">
				<button on:click={checkInsertStudent} class="btn btn-outline" type="button"> 提交 </button>
			</div>
		</div>
	</div>

	<div class="card shadow-2xl m-8 h-3/5">
		<div class="card-body">
			<p class="card-title">检索学生信息</p>

			<div class="grid grid-cols-2 gap-2">
				<div class="form-control">
					<p class="label">
						<span class="label-text">项目</span>
					</p>
					<select bind:value={selected} class="select select-bordered w-full">
						<option value={"name"}>姓名</option>
						<option value={"gender"}>性别</option>
						<option value={"age"}>年龄</option>
						<option value={"faculty"}>院系</option>
						<option value={"grade"}>年级</option>
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
				<button on:click={updateStudentInfo} class="btn btn-outline" type="button"> 重置 </button>
			</div>
		</div>
	</div>
</div>

<div class="card shadow-2xl m-8">
	<div class="card-body">
		<p class="card-title">学生信息表</p>
		<div class="overflow-x-auto">
			<table class="table w-full table-compact">
				<thead>
					<tr>
						<th>学号</th>
						<th>姓名</th>
						<th>性别</th>
						<th>年龄</th>
						<th>院系</th>
						<th>年级</th>
						<th>电话号码</th>
						<th>楼栋</th>
						<th>房号</th>
						<th>操作</th>
					</tr>
				</thead>

				<tbody>
					{#each students as student}
						<tr class="bg-gray-100 border-b border-gray-200">
							<td>{student.account}</td>
							<td>{student.name}</td>
							<td>{student.gender}</td>
							<td>{student.age}</td>
							<td>{student.faculty}</td>
							<td>{student.grade}</td>
							{#if student.phone == undefined}
								<td />
							{:else}
								<td>{student.phone}</td>
							{/if}
							{#if student.building == undefined}
								<td />
							{:else}
								<td>{student.building}</td>
							{/if}
							{#if student.room == undefined}
								<td />
							{:else}
								<td>{student.room}</td>
							{/if}
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
						<th>年龄</th>
						<th>院系</th>
						<th>年级</th>
						<th>电话号码</th>
						<th>楼栋</th>
						<th>房号</th>
						<th>操作</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>

<Footer />
