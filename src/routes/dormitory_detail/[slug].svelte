<script context="module">
	export async function load({ fetch, session }) {
		if (!session.user.isLoggedIn) {
			return {
				status: 301,
				redirect: "/"
			};
		}

		return {
			status: 200,
			props: {
				user_account: session.user.account
			}
		};
	}
</script>

<script>
	import Sidebar from "$lib/Sidebar.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import Footer from "$lib/Footer.svelte";

	export let user_account;

	let id;
	let building;
	let room;
	let price;
	let gender;
	let pos1;
	let pos2;
	let pos3;
	let pos4;

	onMount(async () => {
		const data = JSON.stringify({
			id: $page.params.slug
		});

		const res = await fetch("/api/dormitory/detail", {
			method: "POST",
			body: data
		});
		const jsonRes = await res.json();
		id = jsonRes[0].id;
		building = jsonRes[0].building;
		room = jsonRes[0].room;
		price = jsonRes[0].price;
		gender = jsonRes[0].gender;

		pos1 = jsonRes[0].account;
		pos2 = jsonRes[1].account;
		pos3 = jsonRes[2].account;
		pos4 = jsonRes[3].account;
	});

	function checkDormitoryInfo() {
		if (price == undefined || price.length > 4) {
			alert("价格格式有误！");
			return false;
		} else {
			updateDormitoryInfo();
		}
	}

	async function updateDormitoryInfo() {
		const data = JSON.stringify({
			id: $page.params.slug,
			building: building,
			room: room,
			price: price,
			gender: gender
		});

		const res = await fetch("/api/dormitory/detail", {
			method: "PUT",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.status == 400) {
			alert("更新宿舍信息失败：" + jsonRes.msg);
		} else {
			alert("更新宿舍信息成功。");
			location.reload();
		}
	}

	async function deleteDormitoryInfo() {
		const data = JSON.stringify({
			id: $page.params.slug,
			building: building,
			room: room
		});

		const res = await fetch("/api/dormitory/detail", {
			method: "DELETE",
			body: data
		});
		const jsonRes = await res.json();
		if (jsonRes.msg == "error") {
			alert("删除宿舍信息失败：" + jsonRes.msg);
		} else {
			alert("删除宿舍信息成功。");
			window.location.replace("/dormitory_manage");
		}
	}
</script>

<Sidebar>
	<svelte:fragment slot="account">{user_account}</svelte:fragment>
</Sidebar>

<div class="col-span-2 card shadow-2xl m-8">
	<div class="card-body">
		<p class="card-title">编辑宿舍信息</p>

		<div class="grid grid-cols-4 gap-3">
			<div class="form-control">
				<p class="label">
					<span class="label-text">楼栋</span>
				</p>
				<input bind:value={building} type="text" disabled="disabled" class="input input-bordered" />
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">房号</span>
				</p>
				<input bind:value={room} type="text" disabled="disabled" class="input input-bordered" />
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">价格（￥）</span>
				</p>
				<input bind:value={price} type="text" placeholder="年龄" class="input input-bordered" />
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">性别</span>
				</p>
				<select bind:value={gender} disabled="disabled" class="select select-bordered w-full">
					<option value="男">男</option>
					<option value="女">女</option>
					<option value="非二元性别">非二元性别</option>
				</select>
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">床一</span>
				</p>
				{#if pos1 != undefined}
					<a class="btn" href="/student_detail/{pos1}">{pos1}</a>
				{/if}
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">床二</span>
				</p>
				{#if pos2 != undefined}
					<a class="btn" href="/student_detail/{pos2}">{pos2}</a>
				{/if}
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">床三</span>
				</p>
				{#if pos3 != undefined}
					<a class="btn" href="/student_detail/{pos3}">{pos3}</a>
				{/if}
			</div>
			<div class="form-control">
				<p class="label">
					<span class="label-text">床四</span>
				</p>
				{#if pos4 != undefined}
					<a class="btn" href="/student_detail/{pos4}">{pos4}</a>
				{/if}
			</div>
		</div>
		<div class="justify-end card-actions">
			<button on:click={checkDormitoryInfo} class="btn btn-outline" type="button"> 更新 </button>
			<button on:click={updateDormitoryInfo} class="btn btn-outline" type="button"> 删除 </button>
		</div>
	</div>
</div>

<Footer />
