<template>
	<view class="container">
		<view class="activity-box">
			<input type="text" :name="data.caleworkname" :value="data.caleworkname" placeholder="活动名称" @input="inputName"/>
		</view>
		<!-- 开始时间 -->
		<view class="selecttime-box" @click="selectTime(0)">
			<text class="starttime">开始</text>
			<text class="starttext">{{data.calebedate}}</text>
		</view>
		<view class="selecttime-box" @click="selectTime(1)">
			<text class="starttime">结束</text>
			<text class="starttext">{{data.caleendate}}</text>
		</view>
		<view class="complete-box">
			<text @click="cancelBtn">取消</text>
			<text @click="completeBtn">完成</text>
		</view>
		<!-- 选择日期 -->
		<tui-datetime ref="dateTime" :startYear="startYear" :endYear="endYear" :cancelColor="cancelColor" :color="color"
		 :setDateTime="setDateTime" :unitTop="unitTop" :radius="radius" @confirm="change">
		</tui-datetime>
	</view>
</template>

<script>
	import {data} from '../../api/task.js'
	export default {
		data() {
			return {
				startYear: 1980,
				endYear: 2030,
				cancelColor: '#888',
				color: '#5677fc',
				setDateTime: '',
				unitTop: false,
				radius: false,
				data:{
					caleworkname:'',
					calebedate: '',
					caleendate:'',
					id:''
				}
			}
		},
		onLoad(options){
			console.log(options)
			this.data=JSON.parse(options.data)
			
		
			
		},
		methods: {
			// 选择时间
			selectTime(e) {
				console.log(e)
				this.type=e
				this.$refs.dateTime.show();
			},
			change: function(e) {
				console.log(e);
				let selectType=this.type;
				console.log(selectType)
				if(selectType===0){
					this.data.calebedate = e.result;
				}else if(selectType===1){
					this.data.caleendate=e.result
				}
				
			},
			// 活动名称
			inputName(e){
				this.taskname=e.detail.value
			},
			
			// 取消按钮
			cancelBtn(){
				uni.navigateBack({
					
				})
			},
			
			// 选择完成
			completeBtn(){
				if(this.taskname==''){
					this.$util.toast('活动名称不能为空')
					return;
				}
				let params={
					caleworkname:this.data.caleworkname,
					calebedate:this.data.calebedate,
					caleendate:this.data.caleendate
				}
				// 'application/json'
				// 新增任务
				if(this.id){
					console.log(1111)
					this.$util.request((this.$util.apiLink.calendarUpdate),params,'POST').then((res)=>{
						if(res.code===200){
							wx.navigateBack({})
						}
					})
				}else{
					console.log(2222)
					this.$util.request(this.$util.apiLink.calebdarInsert,params,'POST').then((res)=>{
						if(res.code===200){
							wx.navigateBack({})
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #fff;
	}

	.container {
		width: 100%;
		.activity-box {	
			width: 90%;
			margin: 20rpx auto;
			input {
				width: 100%;
				background: #f8f8f8;
				font-size: 28rpx;
			}
		}
		.selecttime-box{
			width: 90%;
			margin: 10rpx auto;
			border-bottom: 1rpx solid #ccc;
			display: flex;
			justify-content: space-between;
			padding-bottom: 20rpx;
			.starttime{
				
			}
		}
		.complete-box{
			margin: 30rpx;
			display: flex;
			justify-content: space-between;
			text{
				display: block;
				background: #ccc;
				width: 120rpx;
				height: 50rpx;
				text-align: center;
				line-height: 50rpx;
			}
		}
	}
</style>
