<script>
	import { session } from "$app/stores";

	export let admin;
	export let user_account;

	session.subscribe((value) => {
		user_account = value.user.account;
		admin = value.user.admin;
	});
</script>

<div class="navbar shadow-lg bg-neutral text-neutral-content rounded-box mx-8 my-2">
	<div class="px-2 mx-2 navbar-start">
		<span class="text-lg font-bold"> 学生宿舍管理系统 </span>
	</div>
	<div class="hidden px-2 mx-2 navbar-center lg:flex">
		<div class="flex items-stretch">
			{#if admin == 1}
				<a class="btn btn-ghost btn-sm rounded-btn" href="/student_manage"> 学生管理 </a>
				<a class="btn btn-ghost btn-sm rounded-btn" href="/dormitory_manage"> 寝室管理 </a>
				<a class="btn btn-ghost btn-sm rounded-btn" href="/dormitory_distribute"> 寝室分配 </a>
				<a class="btn btn-ghost btn-sm rounded-btn" href="/checkin"> 出入登记 </a>
			{/if}
			<a class="btn btn-ghost btn-sm rounded-btn" href="/settings"> 系统设置 </a>
		</div>
	</div>

	<div class="navbar-end">
		{#if admin == 0}
			<a href="/student_detail/{user_account}" class="btn btn-ghost btn-sm rounded-btn"
				><slot name="account">学号</slot></a
			>
		{/if}
	</div>
</div>
