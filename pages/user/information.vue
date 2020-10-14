<template>
	<view class="tui-userinfo-box">
		<tui-list-cell padding="0" :arrow="true" @click="changeAvatar">
			<view class="tui-list-cell">
				<view>头像</view>
				<image src="/static/images/my/mine_def_touxiang_3x.png" class="tui-avatar"></image>
			</view>
		</tui-list-cell>
		<tui-list-cell padding="0" :hover="false">
			<view class="tui-list-cell tui-pr30">
				<view>用户名</view>
				<view class="tui-content">黄意芳</view>
			</view>
		</tui-list-cell>
		<tui-list-cell padding="0" :arrow="true" @click="nickname">
			<view class="tui-list-cell">
				<view>昵称</view>
				<view class="tui-content">echo.</view>
			</view>
		</tui-list-cell>
		<tui-list-cell padding="0" :arrow="true">
			<view class="tui-list-cell">
				<view>性别</view>
				<view class="tui-content">女</view>
			</view>
		</tui-list-cell>
		<tui-list-cell padding="0" :arrow="true" unlined @click="show(1)">
			<view class="tui-list-cell">
				<view>出生日期</view>
				<view class="tui-content">{{result}}</view>
			</view>
		</tui-list-cell>
		<!-- 日历的学习 -->
		<tui-list-cell padding="0" :arrow="true" unlined @click="selectDate()">
			<view class="tui-list-cell">
				<view>选择日期</view>
				<view class="tui-content">{{result}}</view>
			</view>
		</tui-list-cell>
		<!-- 时间picker -->
		<tui-datetime ref="dateTime" :type="type" :startYear="startYear" :endYear="endYear" :cancelColor="cancelColor" :color="color"
		 :setDateTime="setDateTime" :unitTop="unitTop" :radius="radius" @confirm="change"></tui-datetime>

		<!-- 选择日历的展示 底部弹出选择 -->
		<tui-calendar 
			isFixed 
			:activeBgColor="activeBgColor"
			:arrowType="arrowType"
			>
		</tui-calendar>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				type: 1,
				startYear: 1980,
				endYear: 2030,
				cancelColor: '#888',
				color: '#5677fc',
				setDateTime: '',
				result: '',
				unitTop: false,
				radius: false,
				activeBgColor:'#5677fc',//日历
				arrowType: 1,
			}
		},
		methods: {
			// 点击修改头像
			changeAvatar() {
				uni.chooseImage({
					count: 1, //选择图片的张数
					sizeType: ['original', 'compressed'], //原图 压缩图
					sourceType: ['album', 'camera'], //album 从相册选图,camera 使用相机
					success: res => {
						const tempFilePaths = res.tempFilePaths[0];

					}
				})
			},
			// 点击t跳转修改昵称
			nickname() {
				this.tui.href("/pages/user/nickname")
			},
			// 选择日期
			show(type) {
				this.cancelColor = '#888';
				this.color = '#5677fc';
				this.setDateTime = '';
				this.startYear = 1980;
				this.endYear = 2030;
				this.unitTop = false;
				this.radius = false;
				switch (type) {
					case 1:
						//this.setDateTime = "2019-10-12";
						this.type = 2;
						break;
					default:
						break;
				}
				this.$refs.dateTime.show();
			},
			change: function(e) {
				console.log(e);
				this.result = e.result;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tui-userinfo-box {
		margin: 20rpx 0;
		color: #333;

		.tui-list-cell {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 60rpx 24rpx 30rpx;
			box-sizing: border-box;
			font-size: 30rpx;

			.tui-avatar {
				width: 100rpx;
				height: 100rpx;
				display: block;
			}

			.tui-content {
				font-size: 26rpx;
				color: #666;
			}
		}

		.tui-pr30 {
			padding-right: 30rpx;
		}

	}
</style>
