<template>
	<view class="container">
		<view class="top-container">
			<image class="bg-img" src="/static/images/my/mine_bg_3x.png"></image>
			<view @tap="logout" class="logout" hover-class="opcity" :hover-stay-time="150">
				<image class="logout-img" src="/static/images/my/icon_out_3x.png" v-show="isLogin"></image>
				<text class="logout-txt" v-show="isLogin">退出</text>
			</view>
			<!-- #ifdef APP-PLUS || H5-->
			<view v-show="!isLogin" class="user-wrapper">
				<navigator url="/pages/common/login/login" hover-class="opcity" :hover-stay-time="150" class="user">
					<image class="avatar-img" src="/static/images/my/mine_def_touxiang_3x.png"></image>
					<text class="user-info-mobile">请登录</text>
				</navigator>
			</view>
			<!-- #endif -->

			<!--  #ifdef MP-WEIXIN -->
			<view v-if="isLogin===false" class="user-wrapper">
				<button class="user" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">
					<image class="avatar-img" src="/static/images/my/mine_def_touxiang_3x.png"></image>
					<text class="user-info-mobile">请登录</text>
				</button>
			</view>
			<!--  #endif -->
			<view v-if="isLogin===true&&userInfo" class="user">
				<!-- #ifdef MP-WEIXIN -->
				<image class="avatar-img" :src="userInfo.avatarUrl"></image>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<image class="avatar-img" src="/static/images/my/mine_def_touxiang_3x.png"></image>
				<!-- #endif -->
				<view class="user-info-mobile">
					<!-- #ifdef H5 -->
					<text v-if="userInfo.userName">{{userInfo.userName}}</text>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<text>{{userInfo.nickName}}</text>
					<!-- #endif -->
					<view class="edit-img" hover-class="opcity" :hover-stay-time="150" @tap="edit">
						<image src="/static/images/my/mine_icon_bianji_3x.png"></image>
					</view>
				</view>
			</view>
			<!-- <view v-show="isLogin" class="user">
				<image class="avatar-img" src="/static/images/my/mine_def_touxiang_3x.png"></image>
				<view class="user-info-mobile">
					<text>{{ mobile }}ddddd</text>
					<view class="edit-img" hover-class="opcity" :hover-stay-time="150" @tap="edit">
						<image src="/static/images/my/mine_icon_bianji_3x.png"></image>
					</view>
				</view>
			</view> -->
		</view>
		<!-- grid列表2-3-4-5 -->
		<tui-grid>
			<block v-for="(item,index) in dataList" :key="index">
				<tui-grid-item :cell="4" @click="detail">
					<view class="tui-grid-icon">
						<image class="imageBox" :src="item.src"></image>
						<!-- <tui-icon :name="item.name" :size="item.size" :color="item.color"></tui-icon> -->
					</view>
					<text class="tui-grid-label">{{item.name}}</text>
				</tui-grid-item>
			</block>
		</tui-grid>
		<!-- 菜单列表 tui-list-view中title="菜单列表"-->
		<tui-list-view >
			<tui-list-cell @click="detail" :arrow="true">
				<view class="tui-item-box">
					<tui-icon name="wealth-fill" :size="24" color="#ff7900"></tui-icon>
					<text class="tui-list-cell_name">收获地址</text>
				</view>
			</tui-list-cell>
			<tui-list-cell @click="detail" :arrow="true">
				<view class="tui-item-box">
					<tui-icon name="service-fill" :size="24" color="#5677fc"></tui-icon>
					<view class="tui-list-cell_name">服务窗</view>
				</view>
			</tui-list-cell>
			<tui-list-cell @click="detail" :arrow="true">
				<view class="tui-item-box">
					<tui-icon name="explore-fill" :size="24" color="#19be6b"></tui-icon>
					<view class="tui-list-cell_name">发现</view>
					<view class="tui-ml-auto">
						<tui-tag padding="10rpx 12rpx" margin="0 30rpx 0 0" size="24rpx" type="light-green" shape="circle">探索发现</tui-tag>
					</view>
				</view>
			</tui-list-cell>
			<tui-list-cell @click="detail" :arrow="true">
				<view class="tui-item-box">
					<tui-icon name="shop-fill" :size="23" color="#ed3f14"></tui-icon>
					<view class="tui-list-cell_name">我的店铺</view>
					<view class="tui-right">进入店铺</view>
				</view>
			</tui-list-cell>
			<tui-list-cell @click="detail" :arrow="true" last="true">
				<view class="tui-item-box">
					<image src="/static/images/classify/boutique.png" class="tui-logo" mode="widthFix"></image>
					<text class="tui-list-cell_name">关于</text>
					<view class="tui-right">Thor UI</view>
				</view>
			</tui-list-cell>
		</tui-list-view>
	</view>
</template>

<script>
	const util = require("@/utils/api.js")
	const app = getApp();
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		// computed: mapState(['isLogin', 'token']),
		data() {
			return {
				isLogin: false, //登录
				userInfo: null,
				dataList: [{
					name:'待付款' ,
					src: require("../../static/images/basic/badge.png")
				}, {
					name:'待付款' ,
					src: require("../../static/images/basic/badge.png")
				}, {
					name:'待付款' ,
					src: require("../../static/images/basic/badge.png")
				}, {
					name:'待付款' ,
					src: require("../../static/images/basic/badge.png")
				}]
			};
		},
		onShow: function() {
			let token = uni.getStorageSync('token')
			if (!token) {
				return;
			}
			this.isLogin = true
			// #ifdef MP-WEIXIN
			// this.getInfomation()
			this.userInfo = uni.getStorageSync('userInfo').userInfo
			//  #endif
			// #ifdef H5
			this.getInfomation()
			//  #endif
			// this.isLogin=app.globalData.isLogin;
		},
		methods: {
			...mapMutations(['login']),
			// 微信授权
			// #ifdef MP-WEIXIN
			bindGetUserInfo(e) {
				let token = uni.getStorageSync('token');
				if (token) {
					return;
				}
				if (e.detail.userInfo) {
					//用户按了允许授权按钮
					util.loginByWeixin(e.detail).then(res => {
						// this.login(res.content)
						app.globalData.isLogin = true;
						this.isLogin = true;
						this.userInfo = uni.getStorageSync('userInfo').userInfo
						// this.getInfomation()
					}).catch((err) => {
						console.log(err)
					});
				} else {
					//用户按了拒绝按钮
					uni.showModal({
						title: '警告通知',
						content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
						success: (res) => {
							if (res.confirm) {
								uni.openSetting({
									success: (res) => {
										if (res.authSetting["scope.userInfo"]) { ////如果用户重新同意了授权登录
											util.loginByWeixin(e.detail).then(res => {
												this.login(res.content)
												this.userInfo = uni.getStorageSync('userInfo').userInfo
											}).catch((err) => {
												console.log(err)
											});
										}
									}
								})
							}
						}
					});
				}
			},
			// #endif
			changeData() {
				this.getInfomation()
			},

			// 小程序和h5都可以获取
			getInfomation() {
				this.$util.request(this.$util.apiLink.getUserinfo, 'GET').then((res) => {
					if (res.code === 200) {
						this.isLogin = true;
						app.globalData.isLogin = true
						this.userInfo = res.data;
						uni.setStorageSync('userId',res.data.userId)
					}

				}).catch((err)=>{})
			},
			// 退出登录
			logout: function() {
				this.tui.modal("提示", "确定退出登录？", true, (res) => {
					if (res) {
						uni.clearStorage();
						uni.reLaunch({
							url: '/pages/user/user'
						});
					}
				})
			},
			// 修改个人信息
			edit(){
				uni.navigateTo({
					url:'/pages/user/information'
				})
			},
			// 地址管理
			detail(){
				uni.navigateTo({
					url:'/pages/user/address'
				})
			}
		},
		
		
	};
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		padding-bottom: 100rpx;
		button{
			background: none;
		}
		.top-container {
			height: 440rpx;
			position: relative;
			display: flex;
			flex-direction: column;
			.bg-img {
				position: absolute;
				width: 100%;
				height: 440rpx;
			}
			.logout {
				width: 110rpx;
				height: 36rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				margin: 42rpx 0 24rpx 32rpx;
				position: relative;
				z-index: 2;
				.logout-img {
					width: 36rpx;
					height: 36rpx;
					margin-right: 11rpx;
				}
				
				.logout-txt {
					font-size: 28rpx;
					color: #fefefe;
					line-height: 28rpx;
				}
			}
			.user-wrapper {
				display: flex;
				justify-content: center;
				position: relative;
				z-index: 2;
			}
			
			.user {
				display: flex;
				flex-direction: column;
				justify-content: center;
				position: relative;
				z-index: 2;
			}
			
			.avatar-img {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				align-self: center;
			}
			
			.user-info {
				display: flex;
				flex-direction: row;
				margin-top: 30rpx;
				align-items: center;
			}
		}
		// grid样式
		.tui-grid-icon {
			width: 64rpx;
			height: 64rpx;
			margin: 0 auto;
			text-align: center;
			vertical-align: middle;
			.imageBox{
				width: 100%;
				height: 100%;
			}
		}
		.tui-grid-label {
			display: block;
			text-align: center;
			font-weight: 400;
			color: #333;
			font-size: 28rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-top: 10rpx;
		}
		.tui-item-box {
			width: 100%;
			display: flex;
			align-items: center;
			.tui-list-cell_name {
				padding-left: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.tui-logo {
				height: 52rpx;
				width: 52rpx;
				flex-shrink: 0;
			}
			.tui-ml-auto {
				margin-left: auto;
			}
			.tui-right {
				margin-left: auto;
				margin-right: 34rpx;
				font-size: 26rpx;
				color: #999;
			}
		}
	}

	// button {
	// 	background: none;
	// }

	.user-info-mobile {
		margin-top: 30rpx;
		position: relative;
		font-size: 28rpx;
		color: #fefefe;
		line-height: 28rpx;
		align-self: center;
		padding: 0 50rpx;
	}

	.edit-img {
		position: absolute;
		width: 42rpx;
		height: 42rpx;
		right: 0;
		bottom: -4rpx;
	}

	.edit-img>image {
		width: 42rpx;
		height: 42rpx;
		padding-left: 25rpx;
	}

	
</style>
