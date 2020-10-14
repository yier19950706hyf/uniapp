<template>
	<view class="container">
		<view class="uchart_box" @click="uchartBtn">
			<text>饼图</text>
		</view>
		<view class="uchart_box">
			<text>圆环图</text>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			uchartBtn(){
				uni.navigateTo({
					url:'/pages/find/pie'
				})
			}
		}
	
	}
</script>

<style lang="scss" scoped>
	
</style>
