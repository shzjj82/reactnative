var express = require('express');
var router = express.Router();
var fs=require('fs');
var PATH='./public/data/';
/* GET home page. */
// 读取数据
router.get('/read', function(req, res, next) {
  var type=req.param('type')||'';
  fs.readFile(PATH+type+'.json',function(err,data){
  	if(err){
  		return res.send({
  			status:0,
  			info:'读取文件失败'
  		})
  	}
  	var COUNT=50;
  	 var obj=[];
  	try{
  		obj=JSON.parse(data.toString());
  	}catch(e){
  		obj=[];
  	}
  	if(obj.length>COUNT){
  		obj=obj.slice(0, COUNT);
  	}
  	return res.send({
  		status:1,
  		data:obj
  	})
  })
});

// 存储数据 
router.post('/write',function(req,res,next){
	var type=req.param('type')||'';
	var url=req.param('url')||'';
	var title=req.param('title')||'';
	var img=req.param('img')||'';
	if(!type||!url||!title||!img){
		return res.send({
			status:0,
			info:'提交字段不全'
		})
	}
	var filepath=PATH+type+'.json';
	// 读取文件
	fs.readFile(filepath,function(err,data){
		if(err){
			return res.send({
				status:0,
				info:'文件失败'
			})
		}
		// 写入文件
		var arr=JSON.parse(data.toString());
		var obj={
			img:img,
			url:url,
			id:guidGenerate(),
			title:title,
			time:new Date()
		}
		arr.splice(0,0,obj);
		var newData=JSON.stringify(arr);
		fs.writeFile(filepath,newData,function(err){
			if(err){
				return res.send({
					status:0,
					info:'写入失败'
				})
			}
			return res.send({
				status:1,
				info:obj
			})
		})
	})
	
})
// 阅读模块写入接口
router.post('/write_config',function(req,res,next){
// TODO:进行提交数据的验证
// 防XSS攻击 
	var data=req.body.data;
	var obj=JSON.parse(data);
	var newData=JSON.stringify(obj);
	fs.writeFile(PATH+'config.json',newData,function(err){
		if(err){
			return res.send({
				status:0,
				info:'写入数据失败'
			})
		}
		return res.send({
			status:1,
			info:obj
		})
	})
});

// 登录接口
router.post('/login',function(req,res,next){
	// 用户名
	var username=req.body.username;
	// 密码
	var password=req.body.password;
	// todo:对用户名进行处理
	// xx处理、判空
	// 密码加密 md5（md5（password+随机字符串））
	if(username==='admin'&&password==='123456'){
		req.session.user=({
			username:username
		})
		return res.send({
			status: 1,
		})
	}
	return res.send({
		status: 0,
		info:'登录失败'
	})
})

// guid
function guidGenerate(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
		var r=Math.random()*16|0,
		v=c=='x'?r:(r&0x3|0x8);
		return v.toString(16)
	}).toUpperCase();
}

module.exports = router;
