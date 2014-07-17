/**************************************************************

 @Name: Js验证
 @Author: lancet
 @Date: 2014-07-15
		
 *************************************************************/
 ;(function($,window,undefined){
	var CloudValid = {
		v : "1.0.0",
		Checked : false,
		id : ""
	};
	CloudValid.main = {
		init : function(id){
			$("#"+id+" input[valid]").blur(function(e){
				var text = $(this).attr("valid");
				if($(this).attr("data-type")){
					switch($(this).attr("data-type")){
						case "*" : 
							if(!CloudValid.valid.isVoid($(this).val())){
								text = "正确";
								CloudValid.Checked = true;
							}
							break;
						case "phone" :
							var mcode=$(this).val();
							if(!CloudValid.valid.isVoid(mcode)){
								if(CloudValid.valid.phone(mcode)){
									var url=window.cloudstoreUrl + "/register/checkMobile.do?mobile="+mcode;
									$.ajax({ 
										type:"POST", 
										url:url, 
										dataType:"json",
										async:false,			
										contentType:"application/json",    
										success:function(data){ 
											if(data.success==false){
												text = "手机已存在";
												CloudValid.Checked = false;
											}else{
												text = "正确";
												CloudValid.Checked = true;
											}
										}
									});
								}
								else{
									text = "手机格式不正确";
									CloudValid.Checked = false;
								}
							}
							break;
						case "cpass" :
							if(!CloudValid.valid.isVoid($(this).val())){
								if($(this).val() != $("#" + $(this).attr("confirmid")).val()){
									text = "两次填写的密码不一致";
									CloudValid.Checked = false;
								}else{
									text = "正确";
									CloudValid.Checked = true;
								}
							}
							break;
						case ">=6" :
							if(!CloudValid.valid.isVoid($(this).val())){
								if(!CloudValid.valid.length($(this).val(),5,"null")){
									text = "密码至少为6位";
									CloudValid.Checked = false;
								}else{
									text = "正确";
									CloudValid.Checked = true;
								}
							}
							break;
						case "user" :
							if(!CloudValid.valid.isVoid($(this).val())){
								if(!CloudValid.valid.length($(this).val(),6,32)){
									text = "用户名长度在6-32位";
									CloudValid.Checked = false;
								}else{
									if(CloudValid.valid.username($(this).val())){
										var url=window.cloudstoreUrl + "/register/checkName.do?userName="+encodeURI($(this).val());
										var re = false;
										$.ajax({ 
											type:"POST", 
											url:url, 
											dataType:"json",
											async:false,			
											contentType:"application/json",    
											success:function(data){ 
												if(data.exist){
													text = "该用户名已经被注册";
													re = true;
													CloudValid.Checked = false;
												}
											}
										});
										if(!re){
											text = "正确";
											CloudValid.Checked = true;
										}
									}else
									{
										text = "用户名格式不正确";
										CloudValid.Checked = false;
									}
								}
							}
							break;
						case "mCode" :
							var mcode=$(this).val();
							if(!CloudValid.valid.isVoid(mcode)){
								var url=window.cloudstoreUrl + "/register/checkMobileCode.do?mcode="+mcode;
								$.ajax({ 
									type:"POST", 
									url:url, 
									dataType:"json",
									async:false,			
									contentType:"application/json",    
									success:function(data){ 
										if(data.success){
											text = "手机验证码正确";
											CloudValid.Checked = true;
										}else{
											text = "验证码输入有误";
											CloudValid.Checked = false;
										}
									}
								});
							}
							break;
					}
					CloudValid.mess.mess(this,text);
				}
			});
		},
		checkAll : function(id){
			$("#"+id+" input[valid]").blur();
		}
	};
	CloudValid.valid = {
		isVoid : function(e){
			if(e == "")
				return true;
			else
				return false;
		},
		length : function(e,min,max){
			var r = false;
			if(min != "null"){
				if(e.length>min)
					r = true;
				else
					return false;
			}
			if(max != "null"){
				if(e.length<max)
					r = true;
				else
					return false;
			}
			return r;
		},
		phone : function(e){
			if(!e.match(/^[1][3|5|8]\d{9}$/))
				return false;
			else
				return true;
		},
		username : function(e){
			if(!e.match(/^(?!_)(?!.*?_$)[a-zA-Z\u4e00-\u9fa5][0-9A-Za-z_]{6,32}$/))
				return false;
			else
				return true;
		}
	};
	CloudValid.mess = {
		mess : function(e,text){
			if($($(e).parent()).find(".valid").length == 1)
			{
				$($(e).parent()).find(".valid").text(text);
			}else{	
				$(e).parent().append('<span class="valid">'+text+'</span>');
			}
		}
	};
	window.CloudValid = CloudValid;
})($,window)