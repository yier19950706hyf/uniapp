import {getToken} from '@/utils/auth'
/**
 * 所有api请求地址
 */
const apiLink = {
	// 微信登录
	AuthLoginByWeixin111: {url: '/pl/login ',text: '登录接口'},
	// h5的登录注册
	AuthLoginByWeixin: {url: '/pl/login',text: 'h5登录接口'},
	getCode:{url:'/pl/vaildation',text:'获取手机验证码'},
	reg:{url:'',text:'注册接口'},
	resetpwd:{url:'/pl/phReset',text:"修改密码"},
	// 我的页面的接口地址
	getUserinfo:{url:'/api/tzUserApi/persInformation',text:'获取个人信息接口'},
	AddressList:{url:'/api/userAddr/addrList',text:'收货地址列表'},
	Addressdetail:{url:'/api/userAddr/addrById',text:'点击编辑进去修改页面'},
	AddressSave:{url:'/api/userAddr/addrSave',text:'保存编辑收货地址'},
	AddressDelete:{url:'/api/userAddr/addrDelete',text:'删除收货地址'},
	
	// 日历写法
	calendarList:{url:'/api/calebdarwork/list',text:'日历列表'},
	calebdarInsert:{url:'/api/calebdarwork/calebdarInsert',text:'添加任务'},
	calendarUpdate:{url:'/api/calebdarwork/calebdarUpdate',text:'修改任务'},
}

const utils = {
	// 域名 + 'wechat/'
	// httpUrl: 'http://127.0.0.1:8090/',
	// #ifdef H5
	httpUrl:'',
	// #endif
	// #ifdef MP-WEIXIN
	httpUrl: 'http://192.168.1.61:8090',
	// #endif
	//接口地址
	interfaceUrl: function() {
		return utils.httpUrl
	},
	delayed: null,
	/**
	 * 请求数据处理
	 * @param string url 请求地址
	 * @param {*} postData 请求参数
	 * @param string method 请求方式
	 *  GET or POST
	 * @param string contentType 数据格式
	 *  'application/x-www-form-urlencoded'
	 *  'application/json'
	 * @param bool isDelay 是否延迟显示loading
	 * @param bool hideLoading 是否隐藏loading
	 *  true: 隐藏
	 *  false:显示
	 */
	request: function(httpurl, postData = {}, method , contentType = "application/x-www-form-urlencoded", isDelay,
		hideLoading) {
		//接口请求
		let loadding = false;
		utils.delayed && uni.hideLoading();
		clearTimeout(utils.delayed);
		utils.delayed = null;
		if (!hideLoading) {
			utils.delayed = setTimeout(() => {
				uni.showLoading({
					mask: true,
					title: '请稍候...',
					success(res) {
						loadding = true
					}
				})
			}, isDelay ? 1000 : 0)
		}

		return new Promise((resolve, reject) => {
			
			uni.request({
				url: utils.interfaceUrl() + httpurl.url,
				data: postData,
				header: {
					// 'content-type': contentType,
					'Authorization': getToken()
				},
				method: method, //'GET','POST'
				dataType: 'json',
				success: (res) => {
					console.log(`${httpurl.text}+${utils.interfaceUrl()} ${httpurl.url}+${JSON.stringify(postData)}`)
					console.log(res.data)
					if (loadding && !hideLoading) {
						uni.hideLoading()
					}
					if (res.statusCode === 200) {
						if (res.data.errno === 401) {
							//返回码401说明token过期或者用户未登录
							
						} else if (res.data.errno === 500) {
							utils.toast(res.data.msg)
						} else if (res.data.errno === 404) {
							utils.toast(res.data.msg)
						}else if(res.data.statusCode===-10001){
							reject(res.msg)
							uni.removeStorage({
								key: 'token',
								success:()=>{
									//个人中心页不跳转
									console.log(uni.getStorageSync("navUrl"))
									// if (uni.getStorageSync("navUrl") != "pages/index/index") {
										// #ifdef H5
										utils.modal('温馨提示', '您还没有登录，是否去登录', true, (confirm) => {
											if (confirm) {
												uni.navigateTo({
													url: '/pages/common/login/login',
												})
												
											} else {
												uni.navigateBack({
													delta: 1,
													fail: (res) => {
														uni.switchTab({
															url: '/pages/index/index',
														})
													}
												})
											}
											
										})
										// #endif
										// #ifdef MP-WEIXIN
										uni.navigateTo({
											url:'/pages/common/wxlogin/wxlogin'
										})
										// #endif
									// }
								}
							})
						}
						 else {
							resolve(res.data);
						}
					} else {
						reject(res.data);
					}
				},
				fail: (res) => {
					utils.toast("网络不给力，请稍后再试~")
					reject(res)
				},
				complete: function(res) {
					clearTimeout(utils.delayed)
					utils.delayed = null;
					if (res.statusCode === 200) {
						if (res.data.errno === 0 || res.data.errno === 401) {
							uni.hideLoading()
						} else {
							uni.hideLoading()
							// utils.toast(res.data.msg)
						}
					} else {
						utils.toast('服务器开小差了~')
					}
				}
			})
		})
	},
	toast: function(text, duration, success) {
		uni.showToast({
			title: text || "出错啦~",
			icon: success || 'none',
			duration: duration || 2000
		})
	},
	modal:function(title,content,showCancel=false,callback,confirmColor, confirmText, cancelColor, cancelText){
		uni.showModal({
			title: title || '提示',
			content: content,
			showCancel: showCancel,
			cancelColor: cancelColor || "#555",
			confirmColor: confirmColor || "#e41f19",
			confirmText: confirmText || "确定",
			cancelText: cancelText || "取消",
			success(res) {
				if (res.confirm) {
					callback && callback(true)
				} else {
					callback && callback(false)
				}
			}
		})
	},

	/**
	 * 调用微信登录
	 */
	login: function() {
		return new Promise(function(resolve, reject) {
			uni.login({
				success: function(res) {
					if (res.code) {
						resolve(res);
					} else {
						reject(res);
					}
				},
				fail: function(err) {
					reject(err);
				}
			});
		});
	},

	// 点击登录获取code，然后调登录接口进行登录
	loginByWeixin: function(userInfo) {
		let code = null;
		return new Promise(function(resolve, reject) {
			return utils.login().then((res) => {
				code = res.code;
				return userInfo;
			}).then((userInfo) => {
				//登录远程服务器
				console.log('code:' + code)
				console.log(userInfo)
				uni.setStorageSync('userInfo', userInfo)
				utils.request(apiLink.AuthLoginByWeixin111, {
					type:'wx',
					code: code,
					userInfo: userInfo
				}, 'POST', 'application/json').then(res => {
					console.log(res)
					if (res.statusCode === 1) {
						uni.setStorageSync('token', res.content)
						uni.setStorageSync('userId', res.userId)
						resolve(res)
					} else {
						utils.toast(res.errMsg)
						reject(res)
					}

					// if (res.errno === 0) {
					// 	//存储用户信息
					// 	uni.setStorageSync('userInfo', res.data.userInfo);
					// 	uni.setStorageSync('X-Nideshop-Token', res.data.token);

					// 	resolve(res);
					// } else {
					// 	utils.toast(res.errmsg)
					// 	reject(res);
					// }
				}).catch((err) => {
					reject(err);
				});
			}).catch((err) => {
				reject(err);
			})
		});
	},
	/**
	 * 微信获取验证码封装
	 */
	getCode(seconds,phone){
		return new Promise((resolve,reject)=>{
			utils.request(apiLink.getCode,{
				phone
			},'POST','application/json').then((res)=>{
				if(res.statusCode===1){
					resolve(res)
				}else{
					reject(res.msg)
				}
			})
		})
	},
	/**
	 * 处理各个微信登录
	 */
	handleLogin(params){
		return new Promise((resolve,reject)=>{
			utils.request(apiLink.AuthLoginByWeixin,params,'POST','application/json').then((res)=>{
				resolve(res)
			}).catch((err)=>{
				reject(err.msg)
			})
		})
	},
	/**
	 * 封装修改保存地址
	 */
	handleAdress(newData){
		return new Promise((resolve,reject)=>{
			utils.request(apiLink.AddressSave,newData,'POST','application/json').then((res)=>{
				console.log(res)
				if(res.code===200){
					resolve(res)
				}
			}).catch((err)=>{
				reject(err.msg)
			})
		})
	}
}
module.exports = {
	apiLink: apiLink,
	interfaceUrl: utils.interfaceUrl,
	request: utils.request,
	getToken: utils.getToken,
	toast: utils.toast,
	modal:utils.modal,
	login: utils.login,
	loginByWeixin: utils.loginByWeixin,
	getCode:utils.getCode,
	handleLogin:utils.handleLogin,
	handleAdress:utils.handleAdress
}
