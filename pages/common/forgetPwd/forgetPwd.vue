<template>
	<view class="container">
		<view class="tui-page-title">找回密码</view>
		<view class="tui-form">
			<form :report-submit="true" @submit="formLogin">
			<view class="tui-view-input">
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="mobile" color="#6d7a87" :size="20"></tui-icon>
						<input name="mobile" :value="mobile" placeholder="请输入手机号" placeholder-class="tui-phcolor" type="number" maxlength="11" @input="inputMobile" />
						<view class="tui-icon-close" v-show="mobile" @tap="clearInput(1)"><tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon></view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="shield" color="#6d7a87" :size="20"></tui-icon>
						<input name="code1" placeholder="请输入验证码" placeholder-class="tui-phcolor" type="text" maxlength="6" @input="inputCode" />
						<tui-button width="182rpx" height="56rpx" :size="24" :type="type" shape="circle" :plain="true" :disabled="disabled"
						 @click="btnSend">{{ btnText }}</tui-button>
					
					</view>
				</tui-list-cell>
			</view>
			<view class="tui-btn-box"><tui-button formType="submit" :disabledGray="true" :disabled="logindisabled" :shadow="true" shape="circle">确认修改</tui-button></view>
		 </form>
		</view>
	</view>
</template>

<script>
	const form = require('@/components/common/tui-validation/tui-validation.js');
export default {
	computed: {
		logindisabled: function() {
			let bool = true;
			if (this.mobile && this.code) {
				bool = false;
			}
			return bool;
		}
	},
	data() {
		return {
			disabled: false,
			mobile: '',
			code: '',
			isSend: false,
			btnText: '获取验证码',
			type: 'primary',
			code1:''
		};
	},
	methods: {
		// 点击获取验证码
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
			let checkRes = form.validation(formData, rules);
			if (!checkRes) {
				this.disabled = true;
				this.btnText = '请稍候...';
				this.type = 'gray';
		
				setTimeout(() => {
					this.doLoop(60);
				}, 500);
			} else {
				this.tui.toast(checkRes);
			}
		},
		doLoop: function(seconds) {
			let code=null;
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
		
		// 手机验证码找回密码
		formLogin: function(e) {
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
			let formData=e.detail.value;
			let checkRes = form.validation(formData, rules);
			if (checkRes) {
				this.tui.toast(checkRes);
				return;
			}
			let data={
				phone:this.mobile,		
				authCode:this.code1
			}
			this.$util.request(this.$util.apiLink.resetpwd,data,'POST','application/json').then((res)=>{
				if(res.statusCode===1){
					this.tui.toast('验证成功',2000);
					setTimeout(()=>{
						uni.reLaunch({
							url: '/pages/common/resetpwd/resetpwd?phone='+this.mobile
						});
					},200)
				}
			})
			
		},
		inputCode(e) {
			this.code1 = e.detail.value;
		},
		inputMobile: function(e) {
			this.mobile = e.detail.value;
		},
		clearInput(type) {
			if (type == 1) {
				this.mobile = '';
			} else {
				this.password = '';
			}
		}
	}
};
</script>

<style lang="scss">
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
		.tui-btn-box {
			width: 100%;
			padding: 0 $uni-spacing-row-lg;
			box-sizing: border-box;
			margin-top: 80rpx;
		}
	}
}
</style>
