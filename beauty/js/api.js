
var giftChance =0;
var Constant = {
	api_host: 'http://t.h5wxapi.tarsocial.com',
	share_appid: 'wxfa065f3046ad9c21',
	wx_appid: 'wxae443fc803e5af1c',
	tar_tid: '',
	tar_token: 'bc3de6705207544d91af594eaf13ebd0',
	title: '刷颜值测身价',
	desc: '快来上传照片测颜值刷身价！！！',
	imgurl: 'http://tarproject.oss-cn-shanghai.aliyuncs.com/pingan%2Fbeauty%2Fimg%2FsharePic.jpg',
	wx_link: window.location.href.split('?')[0],
	success: function () {
		tar.hitTag("分享成功");
		giftChance++;
		if(giftChance==2){
			$(".mask").hide();
			liRun();
			mySwiper.slideTo(11);
		}

		
		
	},
	cancel: function () { }
}

var host = window.location.host;
var dev_host = ["dev.h5wxfront.weisgj.com", "h5wxfront.weisgj.com", "h5wx.com"];
var dev_host_indexOf = dev_host.indexOf(host);
if (dev_host_indexOf == -1) {
	//正式环境
	Constant.api_host = 'http://h5api.tarsocial.com';
	Constant.share_appid = '';
	Constant.wx_appid = 'wxb0dd47d740a0b327';
	Constant.tar_tid = '111357';
}

var shareControl = {
	tarinit: function (tar_info) {
		tar.init(tar_info);
	},
	//分享
	wxready: function (wx_share) {
		wx.ready(function () {
			wx.onMenuShareAppMessage(tar.shapeShareAppMessage(wx_share));
			wx.onMenuShareTimeline(tar.shapeShareTimeline(wx_share));
		})
	}
}

var wx_userinfo, tar_userinfo;
var tar_info = {
	tar_debug: 　false,
	tar_token: Constant.tar_token,
	tar_tid: Constant.tar_tid,
	tar_userinfo: tar_userinfo
}
var wx_share = {
	title: Constant.title,
	desc: Constant.desc,
	link: Constant.wx_link,
	imgUrl: Constant.imgurl,
	success: Constant.success,
	cancel: Constant.cancel
}
var WeiXincontrol = new WeiXinConfig();
//WeiXincontrol.init(Constant.wx_appid, "snsapi_base", Constant.share_appid);
WeiXincontrol.ready(function () {
	wx_userinfo = WeiXincontrol.getUserinfo();
	tar_info.tar_userinfo = [wx_userinfo];
	shareControl.tarinit(tar_info);
	shareControl.wxready(wx_share);
});
var pv;
function pvNum() {
	var url = Constant.api_host + "/pingan/csj/pvnum";
	WeiXincontrol.ajax(url, {}, function (res) {
		if (res.errcode == 0) {
			if (!res.data) {
				
			} else {
				pv = res.data.pv;
				$(".num span").html(pv);
			}
		}
	});
}
pvNum();