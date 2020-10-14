<template>
	<view class="container">
		<view class="tui-page-title">注册</view>
		<view class="tui-form">
			<form :report-submit="true" @submit="formLogin" @reset="formReset">
				<view class="tui-view-input">
					<tui-list-cell :hover="false">
						<view class="tui-cell-input">
							<tui-icon name="friendadd" color="#6d7a87" :size="20"></tui-icon>
							<input name="account" class="tui-input" placeholder="请输入账号" @input="inputaccount"
							 placeholder-class="tui-phcolor" />
							<view class="tui-icon-close" v-show="account" @tap="clearInput(0)">
								<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
							</view>
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
						<view class="tui-cell-input">
							<tui-icon name="mobile" color="#6d7a87" :size="20"></tui-icon>
							<input name="mobile" placeholder="请输入手机号" placeholder-class="tui-phcolor" type="number"
							 maxlength="11" @input="inputMobile" />
							<view class="tui-icon-close" v-show="mobile" @tap="clearInput(1)">
								<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
							</view>
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
						<view class="tui-cell-input">
							<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
							<input name="password" placeholder="请输入密码" :password="true" placeholder-class="tui-phcolor"
							 type="text" maxlength="40" @input="inputPwd" />
							<view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
								<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
							</view>
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
						<view class="tui-cell-input">
							<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
							<input name="pwd2" placeholder="再次输入密码" :password="true" placeholder-class="tui-phcolor" type="text"
							 maxlength="40" @input="inputagainPwd" />
							<view class="tui-icon-close" v-show="pwd2" @tap="clearInput(3)">
								<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
							</view>
						</view>
					</tui-list-cell>
				</view>
				<view class="tui-btn-box">
					<tui-button formType="submit" :disabledGray="true" :disabled="disabled" :shadow="true" shape="circle">注册</tui-button>
				</view>
				<view class="tui-cell-text">
					注册代表同意
					<view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="protocol">ThorUI用户服务协议、隐私政策</view>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	import {encrypt} from '@/utils/jsencrypt'
	// #endif
	const form = require("@/components/common/tui-validation/tui-validation.js")
	export default {
		data() {
			return {
				account: '',
				mobile: '',
				password: '',
				pwd2: '', //再次确认密码	
			};
		},
		computed: {
			// 输入完正确信息注册按钮提亮
			disabled: function() {
				let bool = true;
				if (this.mobile && this.account && this.password&&this.pwd2) {
					bool = false;
				}
				return bool;
			}
		},
		methods: {
			// 点击注册
			formLogin: function(e) {
				let rules = [{
						name: 'mobile',
						rule: ['required', 'isMobile'],
						msg: ['请输入手机号码', '请输入正确的手机号码']
					},
					{
						name: 'account',
						rule: ['required',"minLength:2","maxLength:6"],
						msg: ['请输入账号',"姓名必须2个或以上字符","姓名不能超过6个字符" ]
					},
					{
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
				let formData=e.detail.value;
				let checkRes = form.validation(formData, rules);
				if (checkRes) {
					this.tui.toast(checkRes);
					return;
				}
				let params={
					type:'upl',
					username:this.account,
					password:this.password,
					password:encrypt(this.password),
					// phone:this.mobile,
					// aginpwd:this.pwd2
					aginpwd:encrypt(this.pwd2)
				}
				this.$util.handleLogin(params).then((res)=>{
					console.log(res)
					if(res.statusCode===1){
						this.tui.toast('注册成功', 2000, true);
						this.formReset()
						setTimeout(()=>{
							uni.reLaunch({
								url:'../login/login?loginType='+1
							})
						},200)
					}else if(res.statusCode===-1){
						this.$util.toast(res.msg)
					}
				})
			},
			back() {
				uni.navigateBack();
			},
			// 输入账号
			inputaccount: function(e) {
				this.account = e.detail.value;
			},
			// 输入手机号码
			inputMobile: function(e) {
				this.mobile = e.detail.value;
			},
			// 输入密码
			inputPwd: function(e) {
				this.password = e.detail.value;
			},
			// 再次输入密码
			inputagainPwd:function(e){
				this.pwd2=e.detail.value
			},
			// 重置
			formReset: function(e) {
				// console.log("清空数据")
			},
			// 输入后把内容清除
			clearInput(type) {
				if (type == 0) {
					this.account = '';
				}else if (type == 1) {
					this.mobile = '';
				} else if(type==2){
					this.password = '';
				}else if(type==3){
					this.pwd2=''
				}
			},
			protocol() {
				this.tui.href("/pages/doc/protocol/protocol")
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
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
	}
</style>
