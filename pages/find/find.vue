<template>
	<view class="pie_box">
		<!-- 饼图 -->
		<view class="qiun-columns">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">饼状图</view>
			</view>
			<view class="qiun-charts qiun-rows">
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts-pie" @touchstart="touchPie"></canvas>
			</view>
		</view>
		<!-- 折线图 -->
		<view class="qiun-columns">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">折线图</view>
			</view>
			<view class="qiun-charts" >
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
			</view>
		</view>
		<!-- 柱状图 -->
		<view class="qiun-columns">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">柱状图</view>
			</view>
			<view class="qiun-charts" >
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
			</view>
		</view>
		<!-- 条状图 -->
		<view class="qiun-columns">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">条状图</view>
			</view>
			<view class="qiun-charts" >
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js';
	var canvaPie = null; //饼图
	var canvaLineA=null;//折线图
	var canvaColumn=null;//柱状图
	var _self
	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1, //像素比例率
			}
		},
		onLoad() {
			_self=this;
			this.cWidth = uni.upx2px(750); //宽度
			this.cHeight = uni.upx2px(500); //高度
			this.getServerData(); //调接口
		},
		methods: {
			/**
			 * 调接口
			 */
			getServerData() {
				uni.request({
					url: 'https://www.ucharts.cn/data.json',
					data: {},
					success: (res) => {
						console.log(res)
						// -----------饼图的代码开始------------
						let Pie = {
							series: []
						};
						Pie.series = res.data.data.Pie.series
						_self.showPie("canvasPie", Pie); //canvasPie这个是canvas-id得到的，Pie是数据
						// -----------饼图的代码结束------------
						// -----------折线图开始----------------
						let LineA={categories:[],series:[]};
						LineA.categories=res.data.data.LineA.categories;
						LineA.series=res.data.data.LineA.series;
						_self.showLineA("canvasLineA",LineA);
						// -----------折线图结束----------------
						// -----------柱状图开始-------------
						let Column={categories:[],series:[]};
						Column.categories=res.data.data.Column.categories;
						Column.series=res.data.data.Column.series;
						_self.showColumn("canvasColumn",Column);
						// -----------柱状图结束-------------
						// -----------条状图开始-------------
						let ColumnColumn={categories:[],series:[]};
						ColumnColumn.categories=res.data.data.ColumnB.categories;
						ColumnColumn.series=res.data.data.ColumnB.series;
						_self.showColumnColumn("canvasColumn",ColumnColumn);
						// -----------条状图结束-------------
					},
					fail: () => {
						_self.$util.toast('网络错误，小程序端请检查合法域名')
					}
				})
			},
			// ----------饼图开始------------------
			showPie(canvasId,chartData) {
				canvaPie = new uCharts({
					$_self: _self, //required==_self实例组件内使用图表，必须传入_self实例
					canvasId: canvasId, //required==页面组件的canvas-id,支付宝中为id
					type: 'pie', //required==图表类型
					fontSize: 11, //全局默认字体大小
					legend: { //图例设计
						show: true, //是否显示各类别的图例标识
						position: 'bottom', //图例相对画布的显示位置，可选值：上top、右right
						float: 'center',
						itemGap: 10, //各个item之间的间隔，单位px，默认10
						padding: 5, //图例内填充边距，单位px，默认5
						lineHeight: 26, //字体的行高
						margin: 5, //图例外侧填充边距
						borderWidth: 1, //图例边框线宽
					},
					background: '#ccc', //canvas北京颜色，默认白色
					pixelRatio: _self.pixelRatio, //像素比，默认1
					series: chartData.series, //数据列表，Array
					animation: true, //是否动画展示
					width: _self.cWidth * _self.pixelRatio, //canvas宽度，单位为px，
					height: _self.cHeight * _self.pixelRatio, //canvas高度，单位为px
					dataLabel: true, //是否在图表中显示数据标签内容值
					extra: {
						pie: {
							labelWidth: 15
						}
					}
				})
			},
			// 触摸的时候
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				})
			},
			// -----------饼图结束---------------
			// -----------折线图开始-------------
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$_self:_self,
					canvasId:canvasId,
					type:'line',//折线图
					fontSize:11,
					legend:{
						show:true
					},
					dataLabel:false,//是否在图表中显示数据标签内容值
					dataPointShape:true,//是否在图表中数据点图形标识
					background:'#fff',
					pixelRatio:_self.pixelRatio,
					categories:chartData.categories,//required===数据类别
					series:chartData.series,//数据列表
					animation:true,
					xAxis:{//X轴
						type:'grid',//网格
						gridColor:'#ccc',//X轴网格颜色
						gridType:'dash',//x轴网格线型 solid为实线、dash为虚线
						dashLength:8,//X轴网格 为虚线时，单段虚线长度					
					},
					yAxis:{//y轴
						gridType:'dash',//y轴的网格线型
						gridColor:'#ccc',//y轴网格颜色
						dashLength:8,
						splitNumber:5,//X轴数据为矢量驱动时有效
						min:10,//Y轴的起始值（默认是你的数据中的最小值）
						max:180,//Y轴终止值（默认是你的数据的最大值）
						format:(val)=>{//自定义Y轴文案显示
							return val.toFixed(0)+'元'
						},
					},
					width:_self.cWidth*_self.pixelRatio,
					height:_self.cHeight*_self.pixelRatio,
					extra:{
						line:{
							type:'straight'
						}
					}
					
				})
			},
			touchLineA(e){
				// canvaLineA.sho
			},
			// -----------折线图结束-------------
			// -----------柱状图开始-------------
			showColumn(canvasId,chartData){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId:canvasId,
					type:'column',
					legend:{
						show:true
					},
					fontSize:11,
					background:'#fff',
					pixelRatio:_self.pixelRatio,
					animation:true,
					categories:chartData.categories,
					series:chartData.series,
					xAxis:{
						disableGrid:true,//不绘制X轴网格
					},
					yAxis:{
						
					},
					dataLabel:true,//是否在图表中显示数据标签内容值
					width:_self.cWidth*_self.pixelRatio,
					height:_self.cHeight*_self.pixelRatio,
					extra:{
						
					}
				})
			},
			touchColumn(e){
				canvaColumn.showToolTip(e,{
					format:function(item,category){
						if(typeof item.data==='object'){
							return category + ' ' +item.name+':'+item.daa.value
						}else{
							return category +' '+item.name+":" +item.data
						}
					}
				})
			},
			// -----------柱状图结束-------------
			// -----------条状图开始-------------
			showColumnColumn(canvasId,chartData){
				canvaColumn=new uCharts({
					$this:_self,
					canvasId:canvasId,
					type:'column',
					legend:{
						show:true
					},
					fontSize:11,
					background:'#fff',
					pixelRatio:_self.pixelRatio,
					animation:true,
					rotation:true,//横屏模式，默认为false
					// #ifdef MP-ALIPAY || MP-BAIDU
					rotationLock:true,//百度及支付宝需要锁定旋转
					// #endif
					categories:chartData.categories,
					series:chartData.series,
					xAxis:{
						disableGrid:true
					},
					yAxis:{
						
					},
					dataLabel:true,
					width:_self.cWidth*_self.pixelRatio,
					height:_self.cHeight*_self.pixelRatio,
					extra:{
						column:{
							type:'group',
							width: _self.cWidth*_self.pixelRatio*0.45/chartData.categories.length,
							
						}
					}
				})
			}
			
			// -----------条状图结束-------------
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F2F2F2;
		width: 750upx;

		.qiun-columns {
			display: flex;
			flex-direction: column !important;

			.qiun-bg-white {
				background: #FFFFFF;

				.qiun-title-dot-light {
					border-left: 10upx solid #0ea391;
					padding-left: 10upx;
					font-size: 32upx;
					color: #000000
				}
			}

			.qiun-common-mt {
				margin-top: 10upx;
				margin-left: 30upx;
			}

			.qiun-title-bar {
				width: 96%;
				padding: 10upx 2%;
				flex-wrap: nowrap;
			}

			.qiun-rows {
				display: flex;
				flex-direction: row !important;

				.charts-pie {
					width: 750upx;
					height: 500upx;
					background-color: #FFFFFF;
				}
			}

			.qiun-charts {
				width: 750upx;
				height: 500upx;
				background-color: #FFFFFF;
				.charts {
					width: 750upx;
					height: 500upx;
					background-color: #FFFFFF;
				}
			}

		}
	}
	
</style>
