<template>
	<view class="container">
		<view class="tui-bg-box">
			<image src="/static/images/login/bg_login.png" class="tui-bg-img"></image>
			<image src="/static/images/my/mine_def_touxiang_3x.png" class="tui-photo"></image>
			<view class="tui-login-name">Open UI</view>
		</view>
		<!-- H5的授权 手机验证码+密码+微信+支付宝+微博 -->
		<!-- #ifdef H5 -->
		<view class="login-type">
			<view v-for="(item,index) in loginTypeList" :key="index" @click="loginType = index" :class="{act: loginType === index}"
			 class="login-type-btn">{{item}}</view>
		</view>
		<!-- 手机验证码登录 loginType === 0-->
		<view class="input-group" v-if="loginType === 0">
			<form :report-submit="true" @submit="formLogin">
				<view class="tui-login-from">
					<view class="tui-line-cell">
						<tui-icon name="mobile" :size="20" color="#6d7a87"></tui-icon>
						<input placeholder-class="tui-phcolor" class="tui-input" name="mobile" placeholder="请输入手机号码" maxlength="11"
						 v-model="mobile" type="number" @input="inputMobile" />
					</view>
					<view class="tui-line-cell tui-top28">
						<tui-icon name="pwd" :size="20" color="#6d7a87"></tui-icon>
						<input placeholder-class="tui-phcolor" class="tui-input" name="code1" placeholder="请输入验证码" maxlength="6" @input="inputCode" />
						<tui-button width="182rpx" height="56rpx" :size="24" :type="type" shape="circle" :plain="true" :disabled="disabled"
						 @click="btnSend">{{ btnText }}</tui-button>
					</view>
				</view>
				<!-- 登录按钮 -->
				<view class="tui-btn-box tui-button-primary">
					<tui-button formType="submit" class="tui-btn-submit" :disabledGray="true" :disabled="codedisabled" :shadow="true"
					 shape="circle">登录</tui-button>
				</view>
			</form>
		</view>
		<!-- 手机密码登录 loginType === 1-->
		<view class="input-group" v-if="loginType === 1">
			<form :report-submit="true" @submit="formpwdLogin" @reset="formReset">
				<view class="tui-form">
					<view class="tui-view-input">
						<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
							<view class="tui-cell-input">
								<tui-icon name="mobile" color="#6d7a87" :size="20"></tui-icon>
								<input name="account" :value="account" placeholder="请输入账号" placeholder-class="tui-phcolor"
								 maxlength="11" @input="inputAccount" />
								<view class="tui-icon-close" v-show="account" @tap="clearInput(1)">
									<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
								</view>
							</view>
						</tui-list-cell>
						<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
							<view class="tui-cell-input">
								<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
								<input name="password" :value="password" placeholder="请输入密码" :password="true"
								 placeholder-class="tui-phcolor" type="text" maxlength="36" @input="inputPwd" />
								<view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
									<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
								</view>
							</view>
						</tui-list-cell>
					</view>
					<view class="tui-cell-text">
						<view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="href(1)">忘记密码？</view>
						<view hover-class="tui-opcity" :hover-stay-time="150">
							没有账号？
							<text class="tui-color-primary" @tap="href(2)">注册</text>
						</view>
					</view>

				</view>

				<!-- <button class="tui-button-primary tui-btn-submit" hover-class="tui-button-hover" form-type="submit">登录</button> -->
				<!-- 登录按钮 -->
				<view class="tui-btn-box tui-button-primary">
					<tui-button formType="submit" class="tui-btn-submit" :disabledGray="true" :disabled="isdisabled" :shadow="true"
					 shape="circle">登录</tui-button>
				</view>
			</form>
		</view>

		<view class="tui-protocol" hover-class="opcity" :hover-stay-time="150">
			点击"登录"即表示已同意
			<text class="tui-protocol-red" @tap="protocol">《用户协议》</text>
		</view>

		<!-- 微信授权 -->
		<view class="tui-login-way" v-if="!popupShow">
			<view hover-class="tui-opcity" :hover-stay-time="150" @tap="showOtherLogin">其他方式登录</view>
		</view>
		<tui-bottom-popup :mask="false" backgroundColor="transparent" :show="popupShow">
			<view class="tui-auth-login">
				<!-- QQ -->
				<!-- #ifndef MP -->
				<view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150">
					<image src="/static/images/share/icon_qq.png" class="tui-login-logo"></image>
				</view>
				<!-- 微信 -->
				<!-- #endif -->
				<!-- 微博 -->
				<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
				<view @tap="authBtn" class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150">
					<image src="/static/images/share/icon_wechat.png" class="tui-login-logo"></image>
				</view>
				<!-- #endif -->
				<!-- #ifndef MP -->
				<view class="tui-icon-platform" hover-class="tui-opcity" hover-stay-time="150">
					<image src="/static/images/share/icon_sina.png" class="tui-login-logo"></image>
				</view>
				<!-- #endif -->
			</view>
		</tui-bottom-popup>
		<!-- #endif -->

		<!-- 微信的授权   -->
		<!-- 微信+h5的 手机验证码-->
		<!--  #ifdef  MP-WEIXIN -->
		<button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">
			<view class="tui-auth-login">
				<view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150">
					<image src="/static/images/share/icon_wechat.png" class="tui-login-logo"></image>
				</view>
			</view>
		</button>
		<!--  #endif -->
	</view>
</template>

<script>
	const util = require('@/utils/util.js');
	const form = require('@/components/common/tui-validation/tui-validation.js');
	import {
		mapMutations
	} from 'vuex';
	// #ifdef H5
	import { encrypt } from '@/utils/jsencrypt'
	// #endif
	export default {
		data() {
			return {
				loginTypeList: ['免密登录', '密码登录'], //选项卡
				loginType: 0,
				popupShow: false, //显示多种登录
				disabled: false,
				btnText: '获取验证码',
				mobile: '',//手机号码
				code1: '', //输入的手机验证码
				code: '',//调接口返回来的手机验证码
				type: 'primary',
				account: '', //账号
				password: '',//密码
			};
		},
		onLoad(options) {
			if (Number(options.loginType)) {
				this.loginType = Number(options.loginType)
			}
		},
		
		computed: {
			// 验证码登录判断
			codedisabled: function() {
				let isCode = true;
				if (this.mobile && this.code) {
					isCode = false
				}
				return isCode;
			},
			// 密码登录判断
			isdisabled: function() {
				let bool = true;
				if (this.account && this.password) {
					bool = false;
				}
				return bool;
			}
		},
		methods: {
			// ...mapMutations(['login']),
			// 微信授权
			authBtn() {

				window.location.href =
					"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx953eafae15c44d44&redirect_uri=http://tianci.natapp1.cc/sell/weixin/auth&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"

			},

			// 点击获取手机验证码
			btnSend: function() {
				let rules = [{
					name: 'mobile',
					rule: ['required', 'isMobile'],
					msg: ['请输入手机号码', '请输入正确的手机号码']
				}];
				//进行表单检查
				let formData = {
					mobile: this.mobile
				};
				// 使用form，需要引入form中的js
				let checkRes = form.validation(formData, rules);
				// 校验成功
				if (!checkRes) {
					this.disabled = true;
					this.btnText = '请稍候...';
					this.type = 'gray';
					setTimeout(() => {
						this.doLoop(60);
					}, 500);
				} else {
					// 校验失败提示
					this.tui.toast(checkRes);
				}
			},
			// 获取手机验证码
			doLoop: function(seconds) {
				let code = '';
				// 获取验证码
				this.$util.getCode(seconds,this.mobile).then((res)=>{
					console.log(res)
					if(res.statusCode==1){
						this.tui.toast('您本次的验证码是：' + res.content, 5000);
						code=res.content;//手机验证码
						seconds = seconds ? seconds : 60;
						this.btnText = seconds + 's后获取';
						this.code = code;
						let countdown = setInterval(() => {
							if (seconds > 0) {
								this.btnText = seconds + 's后获取';
								--seconds;
							} else {
								this.btnText = '获取验证码';
								this.disabled = false;
								this.type = 'primary';
								clearInterval(countdown);
							}
						}, 1000);
					}else if(res.statusCode===-1){
						this.$util.toast(res.msg)
					}
				})
			},
			// 手机验证码登录
			formLogin: function(e) {
				let code = this.code;
				let rules = [{
						name: 'mobile',
						rule: ['required', 'isMobile'],
						msg: ['请输入手机号码', '请输入正确的手机号码']
					},
					{
						name: 'code1',
						rule: ['required'],
						msg: ['请输入验证码']
					}
				];
				//进行表单检查
				let formData = e.detail.value
				let checkRes = form.validation(formData, rules);
				if (checkRes) {
					this.tui.toast(checkRes);
					return;
				}
				let params={
					type:'ph',
					phone:this.mobile,
					authCode:this.code1
				}
				this.$util.handleLogin(params).then((res)=>{
					if (res.statusCode === 1) {
						uni.setStorageSync('token', res.content)
						this.tui.toast('登录成功', 2000, true);
						let pages = getCurrentPages(); //当前页面
						let beforePage = pages[pages.length - 2]; //前一个页面
						setTimeout(() => {
							uni.navigateBack({
								success: function() {
									beforePage.changeData(); //执行前一个页面的onLoad方法
								}
							})
						}, 200)
					} else if (res.statusCode === -1) {
						this.$util.toast(res.msg)
					}
				})
				
			},
			// 手机密码登录
			formpwdLogin: function(e) {
				let rules = [{
					name: 'account',
					rule: ['required'],
					msg: ['请输入账号', ]
				}, {
					name: 'password',
					rule: ["required", "isEnAndNo"],
					msg: ["请输入密码", "密码为8~20位数字和字母组合"]
				}, ]
				// // 进行表单检查
				let formData = e.detail.value;
				let checkRes = form.validation(formData, rules);
				if (checkRes) {
					this.tui.toast(checkRes);
					return;
				}
				let params={
					type:'up',
					username: this.account,
					password:this.password
					// password: encrypt(this.password)
				}
				this.$util.handleLogin(params).then((resData)=>{
					if (resData.statusCode === 1) {
						uni.setStorageSync('token', resData.content)
						this.tui.toast('登录成功', 2000, true);
						this.formReset()
						
						let pages = getCurrentPages(); //当前页面
						let beforePage = pages[pages.length - 2]; //前一个页面
						setTimeout(() => {
							uni.navigateBack({
								success: function() {
									beforePage.changeData(); //执行前一个页面的onLoad方法
								}
							})
						}, 200)
					} else if (resData.statusCode == -1) {
						this.$util.toast(resData.msg)
					}
				})
			},

			// 清除
			formReset(e) {

			},
			protocol: function() {
				uni.navigateTo({
					url: '/pages/doc/protocol/protocol'
				});
			},
			// 弹出多种登录
			showOtherLogin() {
				//打开后 不再关闭
				this.popupShow = true;
			},
			// 跳转到登录或是忘记代码
			href(type) {
				let url = '../forgetPwd/forgetPwd';
				if (type == 2) {
					url = '../reg/reg';
				}
				this.tui.href(url);
			},
			// 手机验证码
			inputMobile: function(e) {
				this.mobile = e.detail.value;
			},
			// 手机code
			inputCode(e) {
				this.code1 = e.detail.value
			},
			// 账号
			inputAccount: function(e) {
				this.account = e.detail.value;
			},
			// 输入密码
			inputPwd: function(e) {
				this.password =e.detail.value;
			},

			// 密码登录删除
			clearInput(type) {
				if (type == 1) {
					this.account = '';
				} else {
					this.password = '';
				}
			},
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.container {
		.tui-button-primary {
			width: 400rpx;
			margin: 60rpx auto;
		}
	}

	.login-type {
		display: flex;
		justify-content: center;

		.login-type-btn {
			line-height: 30px;
			margin: 0px 15px;
		}

		.login-type-btn.act {
			color: #0FAEFF;
			border-bottom: solid 1px #0FAEFF;
		}

	}

	.tui-bg-box {
		width: 100%;
		box-sizing: border-box;
		position: relative;
		padding-top: 44rpx;
	}

	.tui-photo {
		height: 138rpx;
		width: 138rpx;
		display: block;
		margin: 10rpx auto 0 auto;
		border-radius: 50%;
		position: relative;
		z-index: 2;
	}

	.tui-login-name {
		width: 128rpx;
		height: 40rpx;
		font-size: 30rpx;
		color: #fff;
		margin: 36rpx auto 0 auto;
		text-align: center;
		position: relative;
		z-index: 2;
	}

	.tui-bg-img {
		width: 100%;
		height: 224rpx;
		display: block;
		position: absolute;
		top: 0;
	}

	.tui-login-from {
		width: 100%;
		padding: 128rpx 104rpx 0 104rpx;
		box-sizing: border-box;
	}

	.tui-input {
		font-size: 32rpx;
		flex: 1;
		display: inline-block;
		padding-left: 32rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tui-line-cell {
		padding: 27rpx 0;
		display: -webkit-flex;
		display: flex;
		-webkiit-align-items: center;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tui-line-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #e0e0e0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.tui-top28 {
		margin-top: 28rpx;
	}

	.tui-btn-class {
		width: 196rpx !important;
		height: 54rpx !important;
		border-radius: 27rpx !important;
		font-size: 28rpx !important;
		padding: 0 !important;
		line-height: 54rpx !important;
	}

	.tui-btn-submit {
		margin-top: 100rpx;
	}

	.tui-protocol {
		color: #333;
		font-size: 24rpx;
		text-align: center;
		width: 100%;
		margin-top: 29rpx;
	}

	.tui-protocol-red {
		color: #f54f46;
	}

	.container {
		.tui-status-bar {
			width: 100%;
			height: var(--status-bar-height);
		}

		.tui-header {
			width: 100%;
			padding: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
		}

		.tui-page-title {
			width: 100%;
			font-size: 48rpx;
			font-weight: bold;
			color: $uni-text-color;
			line-height: 42rpx;
			padding: 40rpx;
			box-sizing: border-box;
		}

		.tui-form {
			padding-top: 50rpx;

			.tui-view-input {
				width: 100%;
				box-sizing: border-box;
				padding: 0 40rpx;

				.tui-cell-input {
					width: 100%;
					display: flex;
					align-items: center;
					padding-top: 48rpx;
					padding-bottom: $uni-spacing-col-base;

					input {
						flex: 1;
						padding-left: $uni-spacing-row-base;
					}

					.tui-icon-close {
						margin-left: auto;
					}
				}
			}

			.tui-cell-text {
				width: 100%;
				padding: $uni-spacing-col-lg $uni-spacing-row-lg;
				box-sizing: border-box;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.tui-color-primary {
					color: $uni-color-primary;
				}
			}

			.tui-btn-box {
				width: 100%;
				padding: 0 $uni-spacing-row-lg;
				box-sizing: border-box;
				margin-top: 80rpx;
			}
		}

		.tui-login-way {
			width: 100%;
			font-size: 26rpx;
			color: $uni-color-primary;
			display: flex;
			justify-content: center;
			position: fixed;
			left: 0;
			bottom: 80rpx;

			view {
				padding: 12rpx 0;
			}
		}

		.tui-auth-login {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-bottom: 80rpx;
			padding-top: 20rpx;

			.tui-icon-platform {
				width: 90rpx;
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				margin-left: 40rpx;

				&::after {
					content: '';
					position: absolute;
					width: 200%;
					height: 200%;
					transform-origin: 0 0;
					transform: scale(0.5, 0.5) translateZ(0);
					box-sizing: border-box;
					left: 0;
					top: 0;
					border-radius: 180rpx;
					border: 1rpx solid $uni-text-color-placeholder;
				}
			}

			.tui-login-logo {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
</style>
