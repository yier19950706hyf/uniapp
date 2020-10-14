<template>
	<div class="add-address">
		<!-- 收货布局 -->
		<view class="add-form">
			<view class="form-item">
				<text class="username">收货人:</text>
				<input class="ff" placeholder="姓名" v-model="address.username" auto-focus />
			</view>
		</view>
		<view class="add-form">
			<view class="form-item">
				<text class="username">手机号码:</text>
				<input class="ff" type="number" @focus="focusBtn" @blur="blurBtn" placeholder="请输入手机号码" maxlength="15" v-model="address.userphone" auto-focus />
			</view>
		</view>
		<!-- 地址引入 -->
		<view class="add-form">
			<view class="form-item">
				<text class="username">地址:</text>
				<input class="ff" v-model="address.addressLabel" disabled="true" @tap="openAddres3" placeholder="省份、城市、区县" />
				<!-- <text>地图</text> -->
				<image class="locationImage" @tap="selectLocation" src="/static/images/address.png"></image>
			</view>
		</view>
		
		<!-- 详细地址 -->
		<view class="add-formm">
			<view class="form-itemm">
				<text class="detailadress">详细地址:</text>
				<textarea placeholder-class="tex" class="textarea" v-model="address.addressdetailed" placeholder-style="background:#f8f8f8;padding:10rpx" placeholder="请输入详细地址"/>
			</view>
		</view>
		
		<view class="form-default">
			<text @tap="bindIsDefault" :class="'default-input '+(address.defaultaddress === '1' ? 'selected' : '')">设为默认地址</text>
		</view>
		
		<!-- 添加 取消 -->
		<view class="btns">
			<text class="common cannel" @tap="cancelAddress">取消</text>
			<text class="common save" @tap="saveAddress">{{addressId?'修改':'保存'}}</text>
			<!-- <text class="common save" @tap="updateAddress" v-if="addressId">修改</text> -->
		</view>
		
		
		<!-- 地址引入 -->
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
	</div>
</template>

 <script>
	import simpleAddress from '@/components/simple-address/simple-address.vue';//地址引入
	import utils from '@/utils/handleData.js'
    export default{
		data(){
			return{
				cityPickerValueDefault: [0, 0, 1],
				address:{
					username:null,//用户名称
					userphone:null,//手机号码
					full_region:null,//地址
					addressLabel:null,//地址
					addressdetailed:null,//详细地址
					defaultaddress:'0',//是否为默认地址
				},
				addressId:null,//地址Id
				pickerText:null,
				
			}
		},
		onLoad(options){
			this.addressId=Number(options.id)
			if(Number(this.addressId)){
				this.getSingleAdress();//获取单个地址
			}
		},
		components:{
			simpleAddress,
		},
		onShow(){
			
		},
		methods:{		
			// 选择地址
			selectLocation(){
				uni.chooseLocation({
				    success: function (res) {
						console.log(res)
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
				    }
				});
			},
			openAddres3() {
				// 根据value 获取
				var index = this.$refs.simpleAddress.queryIndex([13, 1302, 130203], 'value');
				console.log(index);
				this.cityPickerValueDefault = index.index;
				this.$refs.simpleAddress.open();
			},
			// 选择地址
			onConfirm(e) {
				console.log(e)
				this.address.addressLabel=e.label;		
				let adress=e;
				let data={
					// labelArr:adress.labelArr,
					provincename:adress.labelArr[0],
					cityname:adress.labelArr[1],
					areacodename:adress.labelArr[2],
					provincecode:adress.provinceCode,//省
					citycode:adress.cityCode,//市
					areacode:adress.areaCode,//区
				}
				
				this.pickerText =data;
				
			},
			// 是否是默认地址
			bindIsDefault() {
				console.log(typeof this.address.defaultaddress)
				console.log(this.address.defaultaddress)
				if(this.address.defaultaddress==='0'){
					this.address.defaultaddress='1'
				}else if(this.address.defaultaddress==='1'){
					this.address.defaultaddress='0'
				}
				// address.defaultaddress = !address.defaultaddress;
				// this.address = address;
			},
			// 手机号码失去焦点校验
			blurBtn(e){
				console.log(e.target.value)
				let phone=e.target.value;
				if(!utils.checkMobile(phone)){
					utils.toast('手机号码格式错误')
				}
			},
			// 手机号码获取焦点
			focusBtn(e) {
				console.log(e)
			},
			// 点击修改的时候调的接口,'application/json'
			getSingleAdress(){
				console.log(Number(this.addressId))
				this.$util.request(this.$util.apiLink.Addressdetail,{
					id:Number(this.addressId)
				},'GET').then((res)=>{
					console.log(res)
					this.address=res.data
					this.address.addressLabel=res.data.provincename+res.data.cityname+res.data.areacodename
				})
			},
			
			// 点击保存
			saveAddress(){
				console.log(this.addressId)
				let addressId=this.addressId;//判断是否有ID
				let addressList=this.address;
				let data={
					id:addressId?addressId:'',
					username:addressList.username,
					userphone:addressList.userphone,
					addressdetailed:addressList.addressdetailed,
					defaultaddress:addressList.defaultaddress
				}
				let newData={...data,...this.pickerText}
				console.log(addressId)
				if(!addressId){
					if(addressList.username===''){
						utils.toast('收货人名称为空')
						return;
					}
					if(addressList.userphone===""){
						utils.toast('手机号码为空')
						return;
					}
					if(addressList.addressLabel===""){
						utils.toast('收货人地址为空')
						return;
					}
					if(addressList.addressdetailed===""){
						utils.toast('详细地址为空')
						return;
					}
					this.$util.handleAdress(newData).then((res)=>{
						wx.navigateBack({
							
						})
					})
					
				}else{
				this.$util.handleAdress(newData).then((res)=>{
					uni.navigateBack({
						
					})
				})
				console.log(11111)
					
				}
				
				

			},
			
			// 取消修改或保存功能
			cancelAddress(){
				uni.navigateBack({})
			}
		}
    }
 </script>

<style lang="scss" scoped>
	.add-address{
		width: 100%;
		height: 100%;
		.add-form{
			margin-bottom: 4rpx;	
			.form-item{
				display: flex;
				height: 80rpx;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx;
				font-size: 34rpx;
				& text{
					margin-right: 20rpx;
				}
				.ff{
					flex: 1;
				}
				.locationImage{
					width: 40rpx;
					height: 40rpx;
				}
			}
			
		}
		.form-default {
			height: 96rpx;
			background: #fafafa;
			padding-top: 28rpx;
			font-size: 28rpx;
			.default-input {
				margin: 0 auto;
				display: block;
				width: 240rpx;
				height: 40rpx;
				padding-left: 50rpx;
				line-height: 40rpx;
				background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 1rpx -448rpx no-repeat;
				background-size: 38rpx 486rpx;
				font-size: 28rpx;
			}
			
			.default-input.selected {
				background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 0 -192rpx no-repeat;
				background-size: 38rpx 486rpx;
			}
			
		}
		.btns{
			font-size: 26rpx;
			display: flex;
			margin: 0 60rpx;
			.common{
				height: 80rpx;
				justify-content: center;
				display: flex;
				align-items: center;
			}
			.cannel{
				flex:1;
				background: #ccc;
				margin-right: 30rpx;
			}
			.save{
				flex: 1;
				background: #19BE6B;
			}
		}
			
	}
	.add-formm{
		padding: 30rpx;
		.form-itemm{
			display: flex;
			&textarea{
				padding: 20rpx;
			}
			.textarea{
				flex: 1;
				background: #f8f8f8;
				padding: 20rpx;
			}
			.tex{
				padding: 20rpx;
				font-size: 30rpx;
			}
		}
		
	}
	
</style>
