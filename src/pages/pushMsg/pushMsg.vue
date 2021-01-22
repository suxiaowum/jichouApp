<template>
	<view>
		<view class="">

		</view>
		<u-tabbar v-model="current" :list="tabList" active-color="skyblue"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo'),
				tabList: [{
						iconPath: "error-circle",
						selectedIconPath: "error-circle-fill",
						text: '记仇本',
					},
					{
						iconPath: "error-circle",
						selectedIconPath: "error-circle-fill",
						text: '开始记仇',
					}
				],
				current: 0
			};
		}
	}
</script>

<style lang="scss">

</style>
