<template>
	<view>
		<view class="listBox">
			<view class="item" v-for="(item,index) in list " :key="index" @longpress="logoTime(item)">
				<view class="title">
					{{item.title}}
				</view>
				<view class="conter">
					{{item.content}}
				</view>
			</view>
			<u-modal v-model="del" :content="content" :async-close="true" @confirm="delItemFun" show-cancel-button confirm-text='放弃了' cancel-text="揍TA!"  confirm-color="red" title="放弃复仇了吗？"></u-modal>
		</view>
		<u-tabbar v-model="current" :list="tabList" active-color="skyblue" @change="gopage"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				del: false,
				userInfo: uni.getStorageSync('userInfo'),
				list: [],
				tabList: [{
						iconPath: "file-text",
						selectedIconPath: "file-text-fill",
						text: '记仇本',
					},
					{
						iconPath: "edit-pen",
						selectedIconPath: "edit-pen-fill",
						text: '开始记仇',
					}
				],
				current: 0,
				content: "",
				delItem: "",
				index:0,
			}
		},
		onLoad() {
			console.log(this.userInfo._id);
			if (this.userInfo !== '') {
				this.getList()
			} else {
				this.userLogin()
			}
		},
		onShow() {
			if (this.userInfo !== '') {
				this.getList()
			}
		},
		methods: {
			delItemFun() {
				uniCloud.callFunction({
					name: 'deleteZhang',
					data: {
						id: this.delItem._id
					},
					success: (res) => {
						console.log(res);
						if (res.result.deleted) {
							this.list.splice(this.index, 1)
							this.$u.toast('你居然放弃复仇！')
							this.del = false;
						}
					}
				})
			},
			
			logoTime(item,index) {
				console.log(2222);
				this.delItem = item
				this.index = index
				this.content = item.content + '这事就算了吗！'
				this.del = true;
			},
			gopage(index) {
				if (index == 1) {
					uni.reLaunch({
						url: '../pushMsg/pushMsg'
					})
				}
			},
			getList() {
				console.log('getlist');
				console.log(this.userInfo);
				uniCloud.callFunction({
					name: 'getList',
					data: {
						user_id: this.userInfo._id
					},
					success: (res) => {
						console.log(res);
						this.list = res.result.data.reverse()
					},
					fail: (err) => {
						console.log(err);
					}

				})
			},
			userLogin() {
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
										openid: msg.authResult.openid,
										pass:'1a2b3c4d'
									}

								}).then(res => {
									console.log(res);
									uni.closeAuthView()
									this.$u.toast('登录成功')
									uni.setStorage({
										key: "userInfo",
										data: res.result.userInfo,
										success: () => {
											this.userInfo = res.result.userInfo
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
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}

	.listBox {
		padding: 20rpx;
	}

	.item {
		min-height: 300rpx;
		border-radius: 20rpx;
		background-color: skyblue;
		padding: 40rpx;
		margin-bottom: 40rpx;
	}

	.title {
		text-align: center;

	}

	.conter {
		margin-top: 20rpx;
	}
</style>
