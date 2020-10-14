//校验邮箱格式
function checkEmail(email){
	return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(email);
}
//校验手机格式
function checkMobile(mobile){
	return RegExp(/^1[34578]\d{9}$/).test(mobile);
}

function toast(text, duration, success) {
		uni.showToast({
			title: text || "出错啦~",
			icon: success || 'none',
			duration: duration || 2000
		})
}

function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

/**
 * 处理日期2020-12-30 12:23  
 * + seperator2 + date.getSeconds()这个是秒的处理
 */
function getNowFormatDate1() {//获取当前时间
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
	var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
	var currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
			+ " "  + date.getHours()  + seperator2  + date.getMinutes();
	return currentdate;
	}


export {
	checkEmail,//校验邮箱
	checkMobile,//校验手机
	toast,
	getNowFormatDate,
	getNowFormatDate1
}
// module.exports={
// 	checkEmail,//校验邮箱
// 	checkMobile,//校验手机
// 	toast,
// 	getNowFormatDate
// }