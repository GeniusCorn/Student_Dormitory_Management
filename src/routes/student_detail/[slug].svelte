<script context="module">
	export async function load({ fetch, session }) {
		if (!session.user.isLoggedIn) {
			return {
				status: 301,
				redirect: "/"
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
	import Sidebar from "$lib/Sidebar.svelte";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import Footer from "$lib/Footer.svelte";

	export let user_account;
	export let items;
	export let admin;

	let account;
	let name;
	let gender;
	let age;
	let faculty;
	let grade;
	let phone;
	let building;
	let room;

	onMount(async () => {
		const data = JSON.stringify({
			account: $page.params.slug
		});

		const res = await fetch("/api/student/detail", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();

		account = jsonRes[0].account;
		name = jsonRes[0].name;
		gender = jsonRes[0].gender;
		age = jsonRes[0].age;
		faculty = jsonRes[0].faculty;
		grade = jsonRes[0].grade;
		phone = jsonRes[0].phone;
		building = jsonRes[0].building;
		room = jsonRes[0].room;
	});

	function checkStudentInfo() {
		if (name == undefined || name.length < 2) {
			alert("姓名格式有误！");
			return false;
		} else if (gender == "chosing") {
			alert("请选择性别！");
			return false;
		} else if (age == undefined || age.length > 2) {
			alert("年龄格式有误！");
			return false;
		} else if (faculty == undefined) {
			alert("院系格式有误！");
			return false;
		} else if (grade == "chosing") {
			alert("请选择年级！");
			return false;
		} else {
			updateStudentInfo();
		}
	}

	async function updateStudentInfo() {
		const data = JSON.stringify({
			account: account,
			name: name,
			gender: gender,
			age: age,
			faculty: faculty,
			grade: grade,
			phone: phone,
			building: building,
			room: room
		});

		const res = await fetch("/api/student/detail", {
			method: "PUT",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.status == "success") {
			alert("更新学生数据成功。");
		} else {
			alert("更新学生数据失败：" + jsonRes.msg);
		}
	}

	async function deleteStudentInfo() {
		const data = JSON.stringify({
			account: account
		});

		const res = await fetch("/api/student/detail", {
			method: "DELETE",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.status == "success") {
			alert("删除学生数据成功。");
			window.location.replace("/student_manage");
		} else {
			alert("删除学生数据失败：" + jsonRes.msg);
		}
	}
</script>

<Sidebar>
	<svelte:fragment slot="account">{user_account}</svelte:fragment>
</Sidebar>

<div class="col-span-2 card shadow-2xl m-8">
	<div class="card-body">
		<p class="card-title">编辑学生信息</p>

		<div class="grid grid-cols-4 gap-3">
			<div class="form-control">
				<p class="label">
					<span class="label-text">学号</span>
				</p>
				<input bind:value={account} type="text" disabled="disabled" class="input input-bordered" />
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">姓名</span>
				</p>
				<input bind:value={name} type="text" disabled="disabled" class="input input-bordered" />
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
			<br />
			<div class="form-control">
				<p class="label">
					<span class="label-text">楼栋</span>
				</p>
				{#if admin == 1}
					<input
						bind:value={building}
						type="text"
						placeholder="楼栋"
						class="input input-bordered"
					/>
				{:else}
					<input
						bind:value={building}
						disabled="disabled"
						type="text"
						placeholder=""
						class="input input-bordered"
					/>
				{/if}
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">房间</span>
				</p>
				{#if admin == 1}
					<input bind:value={room} type="text" placeholder="房间" class="input input-bordered" />
				{:else}
					<input
						bind:value={room}
						disabled="disabled"
						type="text"
						placeholder=""
						class="input input-bordered"
					/>
				{/if}
			</div>
		</div>
		<div class="justify-end card-actions">
			<button on:click={updateStudentInfo} class="btn btn-outline" type="button"> 更新 </button>
			{#if admin == 1}
				<button on:click={deleteStudentInfo} class="btn btn-outline" type="button"> 删除 </button>
			{/if}
		</div>
	</div>
</div>

<Footer />
