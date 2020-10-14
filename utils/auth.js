const TokenKey='token'
// 获取token
function getToken(){
	return uni.getStorageSync(TokenKey)
}
// 设置token
function setToken(token){
	return uni.setStorageSync(TokenKey,token)
}
// 删除token
function removeToken(){
	return uni.clearStorage()
}

export {
	getToken,
	setToken,
	removeToken
}