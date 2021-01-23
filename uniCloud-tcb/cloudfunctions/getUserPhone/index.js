'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	//event为客户端上传的参数

	const res = await uniCloud.getPhoneNumber({
		appid: '__UNI__E9605C7', // 替换成自己开通一键登录的应用的DCloud appid，使用callFunction方式调用时可以不传（会自动取当前客户端的appid），如果使用云函数URL化的方式访问必须传此参数
		provider: 'univerify',
		apiKey: '7a56bfe24ec10a1b6880d7e696e1d9ac', // 在开发者中心开通服务并获取apiKey
		apiSecret: 'c1b959cf450c18441477392f1977adfc', // 在开发者中心开通服务并获取apiSecret
		access_token: event.access_token,
		openid: event.openid
	})
	console.log(res);
	var data = {}
	var pushVal = {}
	if (res.code == 0) {
		pushVal = await uniID.register({
			username: res.phoneNumber,
			password: event.pass
		})
		if (data.code != 0) {
			data = await uniID.login({
				username: res.phoneNumber,
				password: event.pass
			})
		}else{
			data = pushVal
		}
	}

	//返回数据给客户端
	return data
};
