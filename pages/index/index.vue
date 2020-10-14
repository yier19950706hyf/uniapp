<template>
	<view class="content">
		<view class="tui-calendar-box">
			<!--isChange 加上则切换年份或月份时回传数据-->
			<!-- <tui-calendar :lunar="lunar" :arrowType="1" isChange :status="status" :minDate="minDate" :maxDate="maxDate"
			 :rangeColor="rangeColor" :startText="startText" :selected="selected" :activeBgColor="activeBgColor" @change="monthChange">
			 </tui-calendar> -->
			 <!-- 日历打点 -->
			 <uni-calendar 
				:selected="selected"
			    :insert="true"
			    :lunar="true" 
			    :start-date="'2019-3-2'"
			    :end-date="'2040-5-20'"
			    @change="change"
			      />
		</view>
		<!-- 底部的添加数据的 -->
		<view class="add-box" @click="taskBtn">
			<image src="../../static/images/icon_add.png" mode=""></image>
		</view>
		<!-- 显示的任务 -->
		<view class="task-box">
			<view class="task" v-for="(item,index) in taskList" :key="index" @click="updateBtn(item)">
				<text>{{item.caleworkname}}</text>
				<text>{{item.calebedate}}</text>
				<text>{{item.caleendate}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {getNowFormatDate,getNowFormatDate1} from '../../utils/handleData.js'
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import {
		data
	} from '../../api/task.js'
	const app=getApp();
	export default {
		data() {
			return {
				status: [],
				lunar: true, //是否显示农历（古历）
				minDate: '1920-01-01',
				maxDate: '2055-12-30',
				showTask: false,
				activeBgColor: '#19be6b',
				result: '',
				taskList: [], //任务
				rangeColor: 'red',
				startText: '开始',
				selected:[]
			}
		},
		onLoad() {
			console.log(getCurrentPages()[0].route)
			let router=getCurrentPages()[0].route;
			uni.setStorageSync('navUrl',router)
		},
		changeData(){
			console.log(111)
		},
		onShow() {
			console.log(app.globalData.isLogin)
			let currentdate=getNowFormatDate()
			console.log(getNowFormatDate1())
			let currentdate1=getNowFormatDate1();
			this.result=currentdate1;
			console.log(currentdate)
			if(currentdate){
				this.getcalendarList(currentdate)
				this.gethasSelectList()
			}else{
				
			}
			
		},
		components: {
		        uniCalendar
		},
		methods: {
			gethasSelectList(currentdate){
				this.$util.request(this.$util.apiLink.calendarList).then((res)=>{
					if(res.code===200){
						let selectList=[];
						let newData=res.data;
						newData.forEach((val,index)=>{
							if(val.calebedate){
								let obj={
									date:val.calebedate,
									info: '任务'
								}
								selectList.push(obj)
							}
						})
						this.selected=selectList
					}
				})
			},
			taskBtn() {
				console.log(this.result)
				let data={
					calebedate:this.result,
					caleendate:this.result
				}
				uni.navigateTo({
					url: './addtask?data=' + JSON.stringify(data)
				})
			},
			
			// 修改，跳转到修改页面
			updateBtn(item){
				let data={
					caleworkname:item.caleworkname,
					calebedate:item.calebedate,
					caleendate:item.caleendate,
					id:item.id
				}
				uni.navigateTo({
					url:'./addtask?data=' + JSON.stringify(data)
				})
			},
			change(e) {
			    console.log(e);
				this.result=e.fulldate;//传日期进行搜索是否有任务
				this.getcalendarList(this.result)
			},
			// 选中查询日历的任务
			getcalendarList(calebedate) {
				this.$util.request(this.$util.apiLink.calendarList, {
					calebedate
				}).then((res) => {
					console.log(res)
					if (res.code === 200) {
						this.taskList = res.data
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.uni-calender__date-current{
		background: green;
		color: green;
	}
	.uni-calendar-item__weeks-box-circle.data-v-09f1e40c {
		background-color: green !important;
	}
	.content {
		.add-box {
			width: 64rpx;
			height: 64rpx;
			position: fixed;
			bottom: 100rpx;
			right: 50rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
