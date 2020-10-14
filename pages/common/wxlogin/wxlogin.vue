<template>
	<view class='box'>
	  <!-- <image src='../../images/pic.png'></image> -->
	  <view class='text1'>此项目需要申请以下权限：</view>
	  <view class='text2'>获得你的公开信息（头像、昵称等）</view>
	  <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">允许</button>
	  <view class="cancel" catchtap='back'>取消</view>
	  <!-- <button wx:else bindtap="getUserInfoFun">允许</button> -->
	</view>
</template>

<script>
	const app=getApp()
	const util = require("@/utils/api.js")
	export default{
		data(){
			return{
				
			}
		},
		methods:{
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
						uni.navigateBack({})
						// this.isLogin = true;
						// this.userInfo = uni.getStorageSync('userInfo').userInfo
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
												// this.userInfo = uni.getStorageSync('userInfo').userInfo
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
		}
	}
</script>

<style lang="scss" scoped>
	.box {
	  position: relative;
	  width: 540rpx;
	  /* height: 540rpx; */
	  height: 590rpx;
	  margin: 180rpx auto 0;
	  background-color: #fff;
	  border-radius: 20rpx;
	  box-shadow: 0 4px 4px #e0e0e0;
	  text-align: center;
	  image {
	    display: block;
	    width: 540rpx;
	    height: 210rpx;
	    margin: 56px auto 0;
	  }
	  .text1 {
	    padding-top: 40rpx;
	    font-size: 32rpx;
	    line-height: 32rpx;
	    font-weight: bold;
	  }
	  
	  .text2 {
	    padding-top: 20rpx;
	    font-size: 24rpx;
	    line-height: 24rpx;
	    color: #808080;
	  }
	  
	  button {
	    /* position: absolute;
	    left: 50%;
	    margin-left: -169rpx;
	    bottom: 40rpx; */
	  
	    width: 338rpx;
	    height: 88rpx;
	    margin-top: 60rpx;
	    font-size: 32rpx;
	    line-height: 88rpx;
	    color: #fff;
	    font-weight: bold;
	    background-color: #ff8022;
	    border-radius: 44rpx;
	    box-shadow: 0 4px 4px #e0e0e0;
	  }
	  
	  .cancel{
	    font-size: 24rpx;
	    line-height: 24rpx;
	    color:#808080;
	    margin-top: 40rpx;
	  }
	}
</style>
