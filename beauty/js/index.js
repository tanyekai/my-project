var sex = "male", 		
	age = "30",			
	city = "上海市", 	 
	stage = "0",		
	income = "45",		
	childNum = "one",       
	security = "Ysecurity",   
	job = "job1",     
	house = "Yhouse",	   
	car = "Ycar",			
	loan = "Yloan"; 		

var infoID = "0",
	recommend = [],
	recommendText1 = ["鸿运随行（经典版）100万", "福寿安康100万", "康寿宝40万", "鸿运英才（安心版）50万", "祥瑞年年30万"],
	recommendText2 = ["多种交通意外双倍赔付", "百种疾病，约定返还", "高龄可保，无需体检", "百种疾病多重保障", "短交长保，长期领取，享保单红利"],
	moneyPart = [],
	withoutPic = 0,
	haveGift = 0,
	facePoint = -1,
	faceCent = -1,
	faceWorth = -1,
	imgSrc,
	img_base64;


/*---------- swiper ----------*/
var mySwiper = new Swiper('.swiper-container', {
	effect: "flip",			
	noSwiping: true,
	noSwipingClass: 'stop-swiping', 
	onlyExternal: true,  
	direction: "vertical", 

});


/*---------- music ----------*/
var bg_audio = document.getElementById('bg_audio');

function _music() {
	if (bg_audio.paused) {
		$('.music_icon').addClass('music_animate');
		$('.music_icon').attr('src', "/common/img/music.png");
		bg_audio.play();
	} else {
		$('.music_icon').removeClass('music_animate');
		$('.music_icon').attr('src', "/common/img/nomusic.png");
		bg_audio.pause();
	}
}

// 弹框警告
function warn(content) {
	var body = document.getElementsByTagName("body")[0];
	var element = document.createElement("div");
	element.classList.add("weui_dialog_alert");
	element.innerHTML = '<div class="weui_mask"></div>' +
		'<div class="weui_dialog">' +
		'<div class="weui_dialog_hd">' + content + '</div>' +
		'<div class="weui_dialog_ft">' +
		'<a class="weui_btn_dialog">OK</a>' +
		'</div>' +
		'</div>';
	body.appendChild(element);
	element.style.display = "block";
	document.getElementsByClassName("weui_btn_dialog")[0].onclick = function () {
		body.removeChild(element);
	}
}
window.onload = function () {
	var bodyH = document.body.clientHeight;
	var body = document.getElementsByTagName("body")[0];
	var html = document.getElementsByTagName("html")[0];
	body.style.minHeight = bodyH + "px";
	html.style.minHeight = bodyH + "px";
}

function lineDown(arr) {
	var stringTime = arr[0] + "-" + arr[1] + "-" + arr[2] + " " + arr[3] + ":" + arr[4] + ":" + arr[5];
	var timestamp = new Date().getTime();
	var end = new Date(stringTime.replace(/-/g, "/")).getTime();
	if (timestamp > end) {
		window.location.href = "http://s.wx.tarh5.cn/common/html/end.html";
	} else {
	}
}

function mask() {
	tar.hitTag("分享遮罩出现");
	$(".mask").show();
}

function maskHide() {
	tar.hitTag("分享遮罩消失");
	$(".mask").hide();
}
$(function () {
	var bodyH = document.body.clientHeight;
	$("html,body").css({
		// height : "auto",
		minHeight: bodyH + "px"
	})
})
function nextPage() {
	setTimeout(function () {
		mySwiper.slideNext();
	}, 300)
}

function startFace() {
	tar.hitTag("开始刷脸");
	setTimeout(function () {
		mySwiper.slideNext();
	}, 300)
}
$('.upload').change(function (e) {
	var file = e.target.files[0];
	preView(file);
})
$('.p2 .pic').change(function (e) {
	var file = e.target.files[0];
	preView(file);

})

// 预览

function preView(file) {
	imgSrc = URL.createObjectURL(file);
	$('.photo img').attr('src', imgSrc);
	$('.photo img').css('opacity', '1');
	$('.photo img').load(function () {
		if ($('.photo').height() > $('.photo img').height()) {
		} else {
			$('.photo img').css('margin-top', '0');
			$('.p2 .photo img').attr('style', 'position:absolute;width:100%;');
		}
	});
	tar.hitTag("上传图片成功");
	base64();

	nextPage();
	$(".proLength").addClass("longer");

}

function analysis() {
	var url = Constant.api_host + "/pingan/csj/detect_by_imgbase64";
	WeiXincontrol.ajax(url, { "image_base64": img_base64 }, function (res) {
		if (res.errcode == 0) {
			console.log(res);
			if (!res.data) {
				warn("不能识别");
				mySwiper.slideTo(1);
			} else {
				if (res.data.gender == "Male") {
					$(".male span").addClass("active");
					sex = "male";
				} else {
					$(".female span").addClass("active");
					sex = "female";
				}
				age = res.data.age;
				
				facePoint = res.data.point;
				faceCent = res.data.cent;
				infoID = res.data.id;

				$(".ageNum").html(age);
				$(".cityResult").html(city);
				$(".score span").html(facePoint + "分");
				$(".point").html(facePoint + "分");
				$(".cent").html(faceCent);
			}
			setTimeout(function () {
				$(".p4 .title img").attr("src", "img/p4/title.png");
				nextPage();
				clearInterval(numSS);
			}, 2200);
		} else {
			warn("不能识别");
			mySwiper.slideTo(1);
		}
	});
}



function base64() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	var imgContent = new Image();
	imgContent.src = imgSrc;
	imgContent.onload = function () {
		var imgW = imgContent.width;
		var imgH = imgContent.height;
		ctx.drawImage(imgContent, 0, 0, imgW, imgH, 0, 0, canvas.width, canvas.height);
		ctx.save();
		img_base64 = canvas.toDataURL();
		analysis();

	}
	cityGet();

}

function cityGet() {
	var url = Constant.api_host + "/pingan/csj/checkip";
	WeiXincontrol.ajax(url, {}, function (res) {
		if (res.errcode == 0) {
			if (!res.data) {
			} else {
				$(".cityResult").html(res.city);
			}
		}
	});
}

function noPic() {
	$(".p4 .title img").attr("src", "img/p4/title2.png");
	$(".male span").addClass("active");
	$(".cityResult").html("上海");
	$(".ageNum").html("30");
	$(".score span").html("未知");
	mySwiper.slideTo(3);
	withoutPic = 1;
}



function choose(classname) {
	$("." + classname).children("span").addClass("active");
	$("." + classname).siblings("div").children("span").removeClass("active");
}

$(".choose li").click(function () {
	var index = $(this).index() + 1;
	$(".p6 .person img").attr("src", "img/p6/r" + index + ".png")
	nextPage();
	setTimeout(function () {
		nextPage();
	}, 1000);

	if (index == 1 || index == 2) {
		$(".p7 .moneybox").attr("src", "img/p7/money2.png");
		$(".p7 .children").hide();
		$(".p7 .security img").attr("src", "img/p7/shebao2.png");
		$(".p7 .security").css("top", "57%");
		$(".moneyNum").css("top", "42%");
	} else {
		$(".p7 .moneybox").attr("src", "img/p7/money.png");
		$(".p7 .children").show();
		$(".p7 .security img").attr("src", "img/p7/shebao.png");
		$(".p7 .security").css("top", "66%");
		$(".moneyNum").css("top", "37%");
	}
	stage = index;
})


function beauty() {
	setTimeout(function(){
		$(".c1").addClass("c1Animata");
		$(".c2").addClass("c2Animata");
		$(".c3").addClass("c3Animata");
		$(".w1").addClass("w1Animata");
		$(".w2").addClass("w2Animata");
		$(".w3").addClass("w3Animata");
		$(".line1").addClass("l1Animata");
		$(".line2").addClass("l2Animata");
	},500);
	
	mySwiper.slideNext();

	allinfo();
	setTimeout(function () {
		mySwiper.slideNext();
	}, 6000);
}

function face() {
	giftChance = 1;
	nextPage();


}

function allinfo() {
	sex = $(".active").parent().get(0).classList[0];
	age = $(".ageNum").html();
	city = $(".cityResult").html();
	income = $(".income").html();
	childNum = $(".active").parent().get(1).classList[0];
	security = $(".active").parent().get(2).classList[0];
	job = $(".active").parent().get(3).classList[0];
	house = $(".active").parent().get(4).classList[0];
	car = $(".active").parent().get(5).classList[0];
	loan = $(".active").parent().get(6).classList[0];

	if (stage == 3) {
		if (Number(age) > 50) {
			recommend = [3, 4, 1];
			moneyPart = [100, 0, 20, 40, 0];
			faceWorth = 160;
		} else if (Number(age) > 40) {
			recommend = [1, 4, 2, 5];
			moneyPart = [100, 50, 0, 40, 30];
			faceWorth = 220;
		} else if (Number(age) > 30) {
			recommend = [1, 4, 2, 5];
			moneyPart = [100, 40, 0, 20, 20];
			faceWorth = 180;
		} else {
			recommend = [1, 4, 2, 5];
			moneyPart = [100, 30, 0, 10, 10];
			faceWorth = 150;
		}
	} else {
		if (Number(age) > 55) {
			recommend = [3];
			moneyPart = [0, 0, 20, 0, 0];
			faceWorth = 20;
		} else if (Number(age) > 50) {
			recommend = [3, 1];
			moneyPart = [100, 0, 20, 0, 0];
			faceWorth = 120;
		} else if (Number(age) > 40) {
			recommend = [1, 2, 5];
			moneyPart = [100, 50, 0, 0, 30];
			faceWorth = 180;
		} else if (Number(age) > 30) {
			recommend = [1, 2, 5];
			moneyPart = [100, 40, 0, 0, 20];
			faceWorth = 160;
		} else if (Number(age) > 18) {
			recommend = [1, 2, 5];
			moneyPart = [100, 30, 0, 0, 10];
			faceWorth = 140;
		} else if (Number(age) > 8) {
			recommend = [1, 2];
			moneyPart = [50, 20, 0, 0, 0];
			faceWorth = 70;
		} else {
			recommend = [4, 1, 2];
			moneyPart = [20, 3, 0, 40, 0];
			faceWorth = 63;
		}
	}
	$(".worth").html(faceWorth + "万");
	if (facePoint != -1 && faceWorth != -1) {
		wx_share.desc = '我的脸竟然值' + faceWorth + '万，击败了' + faceCent + '%的人！不服来战！还有机会抽取iPhone X!';
		shareControl.wxready(wx_share);
	} else if (facePoint != -1 && faceWorth == -1) {
		wx_share.desc = '我的颜值' + facePoint + '分，击败了' + faceCent + '%的人！';
		shareControl.wxready(wx_share);
	} else if (facePoint == -1 && faceWorth != -1) {
		wx_share.desc = '我的身价竟然值' + faceWorth + '万，打败了多少人。';
		shareControl.wxready(wx_share);
	}
	var link;

	echartPic();
	var insurance = document.getElementsByClassName("insurance")[0];
	for (var i = 0; i < recommend.length; i++) {
		var insurance = document.getElementsByClassName("insurance")[0];
		var element = document.createElement("li");
		link = "'" + linklist[recommend[i] - 1] + "'";
		element.innerHTML = '<img src="img/p11/b' + recommend[i] + '.png" alt="">' +
			'<div class="pic"><img src="img/p11/p' + recommend[i] + '.png" alt=""></div>' +
			'<div class="word1" onclick="runTo(' + link + ')">' + recommendText1[recommend[i] - 1] + '</div>' +
			'<div class="word2" onclick="runTo(' + link + ')">' + recommendText2[recommend[i] - 1] + '</div>' +
			'<div class="right" onclick="runTo(' + link + ')">' + '<img src="img/p11/right.png" alt=""></div>';
		insurance.appendChild(element);
	}

	var data = {
		"insert_sex": sex, 		
		"insert_age": String(age),			
		"insert_city": city, 	 
		"insert_stage": stage,		 
		"insert_income": String(income),		
		"insert_child_num": String(childNum),       
		"insert_security": security,    
		"insert_profession": job,     
		"insert_house": house,	   
		"insert_car": car,			
		"insert_loans": loan,		
		"id": String(infoID),		
	};
	var faceType = [["心型脸", "鹅蛋脸", "瓜子脸", "圆脸"], ["方形脸", "长脸", "圆脸"]];
	if (sex == "male") {
		faceT = Math.round(Math.random() * 2);
		$(".d2 div").html(faceType[1][faceT]);
	} else {
		faceT = Math.round(Math.random() * 3);
		$(".d2 div").html(faceType[0][faceT]);
	}
	if (withoutPic == 1) {
		$(".d2 div").html("未知");
	}
	if (age > 50) {
		$(".d1 div").html("成熟睿智");
	} else if (age > 40) {
		$(".d1 div").html("成熟稳重");
	} else if (age > 30) {
		$(".d1 div").html("事业有成");
	} else if (age > 30) {
		$(".d1 div").html("年轻有为");
	} else {
		$(".d1 div").html("青春活力");
	}
	$(".d3 div").html(city);
	$(".d4 div").html(sex == "male" ? "男" : "女");
	$(".d5 div").html(age + "岁");
	var url = Constant.api_host + "/pingan/csj/commitinf";
	WeiXincontrol.ajax(url, data, function (res) {
		if (res.errcode == 0) {
			if (!res.data) {
				tar.hitTag("信息上传成功");
			} else {
			}
		}
	});
}
var change2 = function ($input) {
}
$('.age input').RangeSlider({ min: 0, max: 70, step: 0.1, callback: change2 }, "ageNum");
$('.money input').RangeSlider({ min: 0, max: 200, step: 5, callback: change2 }, "income");
var pointer = document.getElementsByClassName("click")[0];
var n = 1;
function gift() {
	if (giftChance == 2) {
		iphone();
		giftChance = 0;
	}

}
function iphone() {
	var angle;
	var url = Constant.api_host + "/pingan/csj/get_lucky_man";
	WeiXincontrol.ajax(url, {}, function (res) {
		if (res.errcode == 0) {
			console.log(res);
			switch (res.data.level) {
				case "0":
					$(".ok").hide();
					$(".no").show();
					haveGift = 1;
					angle = 1;
					break;
				case "1":
					$(".winner").html("iphone X");
					angle = 0;
					break;
				case "2":
					$(".winner").html("iphone 8");
					angle = 5;
					break;
				case "3":
					$(".winner").html("拉杆箱");
					angle = 4;
					break;
				case "4":
					$(".winner").html("养生破壁机");
					angle = 3;
					break;
				case "5":
					$(".winner").html("家庭律师咨询卡");
					angle = 2;
					break;

			}


		}
		if (res.errcode == -1) {
			$(".ok").hide();
			$(".no").show();
			angle = 1;
			haveGift = 1;

		}
		rotate("gift", 6, angle);
		setTimeout(function () {
			if (haveGift == 1) {
				mySwiper.slideTo(13);
			} else {
				mySwiper.slideTo(12);
			}
			clearInterval(liss);
		}, 4500);
	});

}
function rotate(classname, partnum, result) {
	var bg = document.getElementsByClassName(classname)[0];
	var part = 360 / partnum;
	var rdm = 0;
	play();
	function play() {
		bg.style.transform = "rotate(0deg)";
		rota();
		n++;
	}
	function rota() {
		var timer = null;
		clearInterval(timer);
		timer = setInterval(function () {
			if (rdm < 360 * 5 * n) {
				rdm = 360 * 5 * n + result * part;
			} else {
				bg.style.transform = "rotate(" + rdm + "deg)";
				clearInterval(timer);
				
			}
		}, 100)
	}
}
function winInfo() {
	var name = $(".info li:nth-child(1) input").val();
	var phone = $(".info li:nth-child(2) input").val();
	var address = $(".info li:nth-child(3) input").val();
	var reg = /^1[3|4|5|7|8][0-9]{9}$/;
	if (!name) {
		warn("请填写姓名");
	} else if (!phone) {
		warn("请填写号码");
	} else if (!reg.test(phone)) {
		warn("请填写有效的手机号码");
	} else if (!address) {
		warn("请填写地址");
	} else {
		$(".p14 .no").hide();
		$(".p14 .ok").show();
		var url = Constant.api_host + "/pingan/csj/commitluckyinf";
		WeiXincontrol.ajax(url, {"name":name,"tel":String(phone),"remark":address}, function (res) {
			if (res.errcode == 0) {
				console.log(res);
				if (!res.data) {
				} else {
				}
			}
		})
		nextPage();
	}
}

function echartPic() {
	var myChart = echarts.init(document.getElementById("radar"));
	var option = {
		radar: {
			indicator: [
				{ text: '年金：' + moneyPart[4] + '万', max: 30 },
				{ text: '养老：' + moneyPart[2] + '万', max: 40 },
				{ text: '健康：' + moneyPart[1] + '万', max: 100 },
				{ text: '意外：' + moneyPart[0] + '万', max: 100 },
				{ text: '少儿：' + moneyPart[3] + '万', max: 50 }
			],
			center: ['50%', '50%'],
			radius: '80%',
			startAngle: 90,
			splitNumber: 5,
			shape: 'polygon',
			name: {
				textStyle: {
					color: "white"
				}
			},
			nameGap: 6,
			splitArea: {
				areaStyle: {
					color: 'transparent'
				}
			},

			axisLine: {
				lineStyle: {
					color: "white"
				}
			},
			splitLine: {
				lineStyle: {
					color: "white"
				}
			}
		},
		series: [
			{
				type: 'radar',
				data: [{
					value: [moneyPart[4], moneyPart[2], moneyPart[1], moneyPart[0], moneyPart[3]],
					areaStyle: {
						normal: {

							color: "#00ffff"
						}
					},
					lineStyle: {
						normal: {
							color: "#00ffff"
						}
					},
					
					itemStyle: {
						normal: {
							color: "#00ffff"
						}
					}


				}],
				animationDuration: 5000,


			}
		]

	};
	myChart.setOption(option);
}

var s = ["s1", "s2", "s3"];
var opt0 = ["省份", "城市", "市、县级市、县"];
function setup() {
	for (i = 0; i < s.length - 1; i++)
		document.getElementById(s[i]).onchange = new Function("change(" + (i + 1) + ")");
	change(0);
}
setup();
$(".s2").change(function () {
	var cityValue = $("#s2").find("option:selected").text();
	$(".cityResult").html(cityValue);
})
$(".s1").change(function () {
	var cityValue = $("#s2").find("option:selected").text();
	$(".cityResult").html(cityValue);
})

function more() {
	$(".insurance li").show();
	$(".p11").css("overflow", "auto");
	$(".p11 .Bg").css("height", "")
	$(".p11 .share").css("bottom", "-5%");
	$(".p11 .Bg").css("height", $(".p11").get(0).scrollHeight + "px");
	$(".more").hide();
	$(".p11 .roll").hide();
}

function winners() {
	var url = Constant.api_host + "/pingan/csj/win_inf";
	WeiXincontrol.ajax(url, {}, function (res) {
		if (res.errcode == 0) {
			console.log(res);
			if (!res.data) {
			} else {
				
				// 
				newLi(res.data);
			}
		}
	})

}
winners();
function newLi(data){
	var winners = document.getElementsByClassName("winners")[0];
	for (var i = 0; i < data.length; i++) {
		
		var li = document.createElement("li");
		if(data[i].id_card=="养生破壁机"){
			data[i].id_card="破壁机";
		}else if(data[i].id_card=="家庭律师咨询卡"){
			data[i].id_card="咨询卡";
		}
		
		li.innerHTML = "<div>恭喜<span>"+data[i].tel+"</span>获得<span>"+data[i].id_card+"</span></div>";
		winners.appendChild(li);
	}
	
	
}
var liss;
function liRun(){
	var height=-($(".winners").get(0).scrollHeight);
	var n=0;
	var str=$(".winners").html();
	liss=setInterval(function(){
		
			$(".winners li").css("transform","translateY("+n--+"px)");
			if(n<(height+30)){
				$(".winners li:last-child").after(str);
				height=-($(".winners").get(0).scrollHeight);
			}	
	},100);
}

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
	var r = window.location.search.substr(1).match(reg);  
	if (r != null) return unescape(r[2]); return null; 
}

var linklist = ["http://e.pingan.com/pa18shoplife/mobile/bank/order/goodLuckTravel/quote.jsp?WT.mc_id=mobi07-pab-s224-wxhy",
	"https://e.pingan.com/pa18shoplife/mobile/bank/order/blissLifeAnKang/quote.jsp?WT.mc_id=mobi07-pab-s233",
	"http://e.pingan.com/pa18shoplife/mobile/product/cancerInsurance/ksb.jsp?pass_interval=0&a=2016&WT.mc_id=mobi07-pab-s109",
	"https://e.pingan.com/pa18shoplife/mobile/bank/order/hyycEase/quote.jsp?WT.mc_id=mobi07-pab-s227",
	"http://e.pingan.com/pa18shoplife/mobile/product/kindlyInsurance/xrnn.jsp?pass_interval=0&a=2016&WT.mc_id=mobi07-pab-s207-wxhy"
];

function runTo(link) {
	tar.hitTag("跳转链接");
	setTimeout(function () {
		link = link + "&" + getUrlParam("appColumn")
			+ "&" + getUrlParam("eid")
			+ "&" + getUrlParam("staffNo")
			+ "&" + getUrlParam("source")
			+ "&" + getUrlParam("pabIssuanceFlag");
		window.location.href = link;
		console.log(link);
	}, 300);
}

function showP1(){
	setTimeout(function(){
		$(".r1").css("opacity","1");
		setTimeout(function(){
			$(".r2").css("opacity","1");
			setTimeout(function(){
				$(".r3").css("opacity","1");
				$(".r4").css("opacity","1");
				setTimeout(function(){
					$(".t1").css("opacity","1");
					setTimeout(function(){
						$(".t2").css("opacity","1");
						setTimeout(function(){
							$(".t3").css("opacity","1");
							setTimeout(function(){
								$(".t4").css("opacity","1");
								setTimeout(function(){
									$(".start").show();
								},500)
							},500)
						},500)
					},500)
				},300)
			},300)
		},300)
	},300)

}
showP1();

var numSS;
function numRound(){
	var n1=2568947310,
	n2=5869412375915,
	n3=5689412378915263;
	numSS=setInterval(function(){
		n1+=1111111111;
		n2+=1111111111111;
		n3+=1111111111111111
		$(".dec span:nth-child(1)").html(n1);
		$(".dec span:nth-child(2)").html(n2);
		$(".dec span:nth-child(3)").html(n3);
	},100)
}
numRound();
