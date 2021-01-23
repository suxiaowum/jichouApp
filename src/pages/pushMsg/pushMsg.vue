<template>
	<view>
		<view class="">
			<view class="date">
				<u-button type="default" size="medium" @click="show = true">{{date}}</u-button>
			</view>
			<view class="userNsme" style="padding: 10rpx 0; margin-top: 20rpx;">
				<u-field v-model="name" label="是谁!" border-top placeholder="把他的名字写下来">
				</u-field>
			</view>
			<view class="dateTxt">
				<u-input v-model="value" type="textarea" :border="true" :auto-height="true" :height="200" />
			</view>
			<view class="saveBox">
				<u-button type="success" :plain="true" shape="circle" @click="saveValue">保存</u-button>
			</view>
			<u-picker mode="time" v-model="show" :params="params" start-year="2020" @confirm="getTime"></u-picker>
		</view>
		<u-tabbar v-model="current" :list="tabList" active-color="skyblue" @change="gopage"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [{
						iconPath: "file-text",
						selectedIconPath: "file-text-fill",
						text: '记仇本',
						pagePath: "/pages/index/index"
					},
					{
						iconPath: "edit-pen",
						selectedIconPath: "edit-pen-fill",
						text: '开始记仇',
					}
				],
				name: "",
				current: 1,
				value: "",
				show: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				userInfo: {
					// _id:"0a4429175fcd7e5c00e1c4e5430a1bf6"
				},
				date: '选择时间'
			};
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.userInfo = res.data
					this.date = this.$u.timeFormat(new Date().getTime(), 'yyyy.mm.dd hh:MM');
					uni.hideLoading()
				},
				fail: () => {

					uni.getProvider({
						service: 'oauth',
						success: (val) => {
							console.log(val);
							uni.login({
								provider: 'univerify',
								univerifyStyle: {
									"otherLoginButton": {
										"visible": "false", // 是否显示其他登录按钮，默认值：true  
										"normalColor": "#f8f8f8", // 其他登录按钮正常状态背景颜色 默认值：#f8f8f8  
										"highlightColor": "#dedede", // 其他登录按钮按下状态背景颜色 默认值：#dedede  
										"textColor": "#000000", // 其他登录按钮文字颜色 默认值：#000000  
										"title": "其他登录方式", // 其他登录方式按钮文字 默认值：“其他登录方式”  
										"borderWidth": "1px", // 边框宽度 默认值：1px（仅ios支持）  
										"borderColor": "#c5c5c5" //边框颜色 默认值： #c5c5c5（仅ios支持）  
									}
								},
								success: (msg) => {
									console.log(msg);
									uniCloud.callFunction({
										name: 'getUserPhone',
										data: {
											access_token: msg.authResult.access_token,
											openid: msg.authResult.openid
										}

									}).then(res => {
										uni.closeAuthView()
										this.$u.toast('登录成功')
										uni.setStorage({
											key: "userInfo",
											data: res.result.userInfo,
											success: () => {
												this.getList()
											}
										})
									}).catch(err => {
										uni.closeAuthView()
										this.$u.toast('登录失败')
										console.log(err);
									})
								},
								fail: (err) => {
									console.log(err);
									this.$u.toast('登录失败')
								}
							})
						}
					})
				}

			})
		},
		methods: {
			saveValue() {
				console.log(this.value);
				if (this.value !== '') {
					uniCloud.callFunction({
						name: 'saveVal',
						data: {
							user_id: this.userInfo._id,
							content: this.name + this.value,
							title: this.date
						},
						success: (res) => {
							console.log(res);
							this.$u.toast('保存成功')
							this.value = ''
						},
						complete: (err) => {
							console.log(err);
						}
					})
				} else {
					this.$u.toast('还没记住啊~')
				}

			},
			getTime(val) {
				console.log(val);
				this.date = `${val.year}.${val.month}.${val.day} ${val.hour}:${val.minute}`
			},
			gopage(index) {
				if (index == 0) {
					uni.reLaunch({
						url: '../index/index'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.date {
		text-align: center;
		margin-top: 20rpx;

	}

	.dateTxt {
		margin-top: 20rpx;
		padding: 20rpx;
	}

	.saveBox {
		position: fixed;
		text-align: center;
		width: 100%;
		bottom: 140rpx;
		padding: 0 40rpx;
	}
</style>
