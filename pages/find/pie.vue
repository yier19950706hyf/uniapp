<template>
	<view class="pie_box">
		<view class="qiun-charts qiun-rows">
			<canvas canvas-id="canvasPie" id="canvasPie" class="charts-pie" @touchstart="touchPie"></canvas>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.pie_box {
		.qiun-rows {
			display: flex;
			flex-direction: row !important;
			.charts-pie{width: 750upx; height:500upx;background-color: #FFFFFF;}
		}

		.qiun-charts {
			width: 750upx;
			height: 500upx;
			background-color: #FFFFFF;
		}
	}
</style>
