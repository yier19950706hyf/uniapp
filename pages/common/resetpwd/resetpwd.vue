<template>
	<view class="tui-form">
		<form :report-submit="true" @submit="formLogin" @reset="formReset">
			<view class="tui-view-input">
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
						<input name="password" :value="password" placeholder="请输入密码" :password="true" placeholder-class="tui-phcolor" type="text" maxlength="40"
						 @input="pwdinput" />
						<view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
						<input name="pwd2" :value="pwd2" placeholder="再次输入密码" :password="true" placeholder-class="tui-phcolor" type="text" maxlength="40"
						 @input="pwd2input" />
						<view class="tui-icon-close" v-show="pwd2" @tap="clearInput(3)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
			</view>
			<view class="tui-btn-box">
				<tui-button formType="submit" :disabledGray="true" :disabled="disabled" :shadow="true" shape="circle">修改密码</tui-button>
			</view>
		</form>
	</view>
</template>

<script>
	const form = require("@/components/common/tui-validation/tui-validation.js")
	// #ifdef H5
	import { encrypt } from '@/utils/jsencrypt'
	// #endif
	export default {
		data() {
			return {
				password: '',
				phone: '',
				pwd2: ''
			}
		},
		onLoad(options) {
			console.log(options)
			if(Number(options.phone)){
				this.phone = options.phone
			}
		},
		computed: {
			disabled: function() {
				let bool = true;
				if (this.password && this.pwd2) {
					bool = false;
				}
				return bool;
			}
		},
		methods: {
			// 点击修改密码
			formLogin: function(e) {
				let rules = [{
						name: 'password',
						rule: ["required", "isEnAndNo"],
						msg: ["请输入密码", "密码为8~20位数字和字母组合"]
					},
					{
						name: "pwd2",
						rule: ["required", "isSame:password"],
						msg: ["请输入确认密码", "两次输入的密码不一致"]
					},
				];
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = form.validation(formData, rules);
				if (checkRes) {
					this.tui.toast(checkRes);
					return;
				}
				let data = {
					type: 'phU',
					phone: this.phone,
					password:this.password,
					aginpwd: this.pwd2
				}
				this.$util.handleLogin(data).then((res) => {
					console.log(res)
					if (res.statusCode === 1) {
						this.tui.toast('注册成功', 2000, true);
						setTimeout(() => {
							uni.reLaunch({
								url: '../login/login?loginType='+1
							})
						}, 200)
					}else{
						this.$util.toast(res.msg)
					}
				})
			},
			pwdinput(e) {
				this.password = e.detail.value
			},
			pwd2input(e) {
				this.pwd2 = e.detail.value
			},
			clearInput(type) {
				if(type==2){
					this.password = ''
				}else if(type==3){
					this.pwd2=''
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
	.tui-page-title {
		width: 100%;
		font-size: 48rpx;
		font-weight: bold;
		color: $uni-text-color;
		line-height: 42rpx;
		padding: 110rpx 40rpx 40rpx 40rpx;
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

				.tui-btn-send {
					width: 156rpx;
					text-align: right;
					flex-shrink: 0;
					font-size: $uni-font-size-base;
					color: $uni-color-primary;
				}

				.tui-gray {
					color: $uni-text-color-placeholder;
				}
			}
		}

		.tui-cell-text {
			width: 100%;
			padding: 40rpx $uni-spacing-row-lg;
			box-sizing: border-box;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
			display: flex;
			align-items: center;

			.tui-color-primary {
				color: $uni-color-primary;
				padding-left: $uni-spacing-row-sm;
			}
		}

		.tui-btn-box {
			width: 100%;
			padding: 0 $uni-spacing-row-lg;
			box-sizing: border-box;
			margin-top: 80rpx;
		}
	}
</style>
