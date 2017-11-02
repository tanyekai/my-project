var WeiXinConfig = function(){

    var wx_scope,wx_oauth_appid,wx_share_appid,wx_callback_url,wx_debug;
    var C_APPID;
    //授权appid在APPID_ARR中C_APPID=wxd8ca4f9b12c1f306，才能完成内部公众号授权
    var APPID_ARR = ['wx522612908ac74c9c','wx2146e80f40ccb9a2','wx2b6316e75157fd10','wx4ee881be25cc499b','wx6e40c992d0e1789c','wx8464e248296848a6','wxabc64e199ab51ddd','wxae443fc803e5af1c','wxb0dd47d740a0b327','wxe512506924dfd7b6','wxfa065f3046ad9c21','wx03d4e22cfa146659','wx8c40f76a9c5355e7']
    var ev = this;
    ev.cbready = function(){};

    /**
     * ajax
     */
    var tar_wx_ajax_methodtype;
    var tar_wx_ajax_con;
    ev.getajaxHttp = function(){
        var xmlHttp;
        try {
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    alert("您的浏览器不支持AJAX�?");
                    return false;
                }
            }
        }
        return xmlHttp;
    }
    ev.ajaxrequest = function(url,methodtype,con,parameter,callback,type){
        var xmlhttp=ev.getajaxHttp();
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4){
                callback(xmlhttp);
            }
        };
        xmlhttp.open(methodtype,url,con);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        var indent = '';
        for(var key in parameter){
            if(key){
                indent += key+"="+parameter[key]+"&"
            }
        }
        indent = indent.substring(0,indent.length-1);
        xmlhttp.send(indent);
    }
    /**
     * 使用场景
     * ajax提交数据格式是多维数�?
     */
    ev.ajax2 = function(url,parameter,callback,tar_wx_ajax_methodtype,tar_wx_ajax_con){
        var xmlhttp=ev.getajaxHttp();
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4){
                //HTTP响应已经完全接收才调�?
                var xml = eval('(' + xmlhttp.response + ')');
                if(xml.errcode == 40001){
                    localStorage.clear();
                    window.location.reload();
                }else{
                    callback(xml);
                }
            }
        };

        tar_wx_ajax_methodtype = tar_wx_ajax_methodtype || "post";
        tar_wx_ajax_con = tar_wx_ajax_con || true;
        xmlhttp.open(tar_wx_ajax_methodtype,url,tar_wx_ajax_con);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var indent = serialize(parameter);
        var appid = localStorage.getItem("appid");
        var token = localStorage.getItem(appid+"_token");
        var openid = localStorage.getItem(appid+"_openid");
        if(indent!=''){
            indent += "&token="+token+"&appid="+appid+"&openid="+openid;
        }else{
            indent = "token="+token+"&appid="+appid+"&openid="+openid;
        }
        xmlhttp.send(indent);
    }
    function serialize(obj){
        var str = "";
        function seria(obj,key1){
            for(var key in obj){
                if((typeof obj[key]) == 'object'){
                    key1?seria(obj[key],(key1+'['+key+']')):seria(obj[key],key)
                }else{
                    console.log(obj[key]);
                    str += key1 ? '&' + (key1 + '[' + key + ']') + '=' + obj[key] : '&' + key + '=' + obj[key];
                }
            }
        }
        seria(obj);
        str = str.slice(1);
        return encodeURI(str);
    }

    /**
     * 使用场景
     * ajax提交数据格式非多维数�?
     * 上传图片（base64�?
     */
    ev.ajax = function(url,parameter,callback,tar_wx_ajax_methodtype,tar_wx_ajax_con){
        var xmlhttp=ev.getajaxHttp();
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4){
                //HTTP响应已经完全接收才调�?
                var xml = eval('(' + xmlhttp.response + ')');
                if(xml.errcode == 40001){
                    localStorage.clear();
                    window.location.reload();
                }else{
                    callback(xml);
                }
            }
        };

        tar_wx_ajax_methodtype = tar_wx_ajax_methodtype || "post";
        tar_wx_ajax_con = tar_wx_ajax_con || true;
        xmlhttp.open(tar_wx_ajax_methodtype,url,tar_wx_ajax_con);
        var form = new FormData();
        var appid = localStorage.getItem("appid");
        var token = localStorage.getItem(appid+"_token");
        var openid = localStorage.getItem(appid+"_openid");
        form.append("appid",appid);
        form.append("token",token);
        form.append("openid",openid);
        for(var key in parameter){
            if(key){
                form.append(key,parameter[key]);
            }
        }
        xmlhttp.send(form);
    }


    /*
     * getUrlParam:获取URL参数
     * delQueStr  :删除URL参数
     */
    ev.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    ev.getUrlParam2 = function(key) {
        var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result?decodeURIComponent(result[2]):null;
    }
    function delQueStr(url, ref){
        var str = "";
        if (url.indexOf('?') != -1){
            str = url.substr(url.indexOf('?') + 1);
        }else{
            return url;
        }
        var arr = "";
        var returnurl = "";
        var setparam = "";
        if (str.indexOf('&') != -1) {
            arr = str.split('&');
            for (i in arr) {
                if (arr[i].split('=')[0] != ref) {
                    returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
                }
            }
            return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
        }else {
            arr = str.split('=');
            if (arr[0] == ref){
                return url.substr(0, url.indexOf('?'));
            }else{
                return url;
            }
        }
    }

    /*
     * SetVal:设置localStorage
     * GetVal:获取localStorage
     * RemoveKey:删除localStorage
     */
    ev.SetVal = function(key, val){
        var v = localStorage.getItem(key);
        if(v == null){
            localStorage.setItem(key, val);
        }
    }
    ev.GetVal = function(key){
        return localStorage.getItem(key);
    }
    ev.RemoveKey = function(key){
        localStorage.removeItem(key);
    }

    /*
     * 以下是微信授权分享机制代�?
     */
    ev.TokenCallback = function(xmlhttp){
        var response = xmlhttp.response;
        var response = eval('(' + response + ')');
        var token = response.token;
        var data = response.data;
        var appid = ev.GetVal("appid");
        if(token){
            //获取用户信息
            wx_userinfo = response.data;
            ev.SetVal(appid+"_token", token);
            ev.SetVal(appid+"_openid", data.openid);
            ev.WeiXinShare(wx_share_appid);
        }else{
            ev.WeiXinOauth(wx_scope,wx_oauth_appid);
        }
    }
    ev.WeiXinToken = function(code,appid){
        var apiurl = "https://api.h5mo.com/v1/wxopen/auth_fansinfo";
        var data = {code:code,appid:appid,c_appid:C_APPID};
        ev.ajaxrequest(apiurl,"post",true,data,ev.TokenCallback,"token");
    }
    ev.TokenInfoCallback = function(xmlhttp){
        var response = eval('(' + xmlhttp.response + ')');
        if(response.data){
            wx_userinfo = response.data;
            ev.WeiXinShare(wx_share_appid);
        }else if(response.errcode == 40001){
            localStorage.clear();
            ev.WeiXinOauth(wx_scope,wx_oauth_appid);
        }
    }
    ev.get_token_info = function (token){
        var apiurl = "http://h5api.tarsocial.com/token/get_token_info";
        var data = {token:token};
        ev.ajaxrequest(apiurl,"post",true,data,ev.TokenInfoCallback,"token_info");
    }
    ev.init = function(oauth_appid,scope,share_appid,wxdebug){
        var index = APPID_ARR.indexOf(oauth_appid);
        if(index >= 0){
            C_APPID = "wxd8ca4f9b12c1f306";
        }else{
            C_APPID = "wx15522600325215c1";
        }

        wx_scope = scope;
        wx_oauth_appid = oauth_appid;
        wx_share_appid = share_appid;
        wx_debug = wxdebug;
        wx_callback_url = location.href;
        ev.SetVal("appid", wx_oauth_appid);
        var token = ev.GetVal(wx_oauth_appid+"_token");
        if(token == null){
            var CODE = ev.getUrlParam('code');
            //console.log('CODE:'+CODE);
            if(CODE == null){
                ev.WeiXinOauth(wx_scope,wx_oauth_appid);
                return false;
            }else{
                ev.WeiXinToken(CODE,wx_oauth_appid);
            }
        }else{
            ev.get_token_info(token);
        }
    }
    ev.WeiXinOauth = function(scope,appid){
        var data = {c_appid:C_APPID};
        var APIBASE = 'http://api.h5mo.com/v1';
        $.ajax({
            url: APIBASE + '/wxopen/get_auth_cfg',
            dataType: 'json',
            data: data,
            success: function (res) {
                if (res.errcode == 0) {
                    var origin = res.hostname;
                    var apiurl = "http://"+appid+"."+origin+"/v1/wxopen/auth";
                    var url = delQueStr(location.href,'code');
                    window.location.href = apiurl+"?scope="+scope+"&appid="+appid+"&callback_url="+encodeURIComponent(url)+"&c_appid="+C_APPID;
                }
            }
        });
    }
    ev.WeiXinReady = function(wxconfig){
        var wxconfig = eval('(' + wxconfig + ')');
        wx.config({
            debug: wx_debug || false,
            appId: wxconfig.appid,
            timestamp: wxconfig.timestamp,
            nonceStr: wxconfig.noncestr,
            signature: wxconfig.signature,
            jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","startRecord","stopRecord","onVoiceRecordEnd","playVoice","pauseVoice","stopVoice","onVoicePlayEnd","uploadVoice","downloadVoice","chooseImage","previewImage","uploadImage","downloadImage","translateVoice","getNetworkType","openLocation","getLocation","hideOptionMenu","showOptionMenu","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","closeWindow","scanQRCode","chooseWXPay","openProductSpecificView","addCard","chooseCard","openCard"]
        });
        console.log('cbready');
        ev.cbready();
    }
    ev.ShareCallback = function(xmlhttp){
        if(xmlhttp.response !=""){
            console.log('WeiXinReady');
            ev.WeiXinReady(xmlhttp.response);
        }
    }
    ev.WeiXinShare = function(share_appid){
        var apiurl = "http://api.h5mo.com/v1/wxopen/wxshare";
        //var version  = "brand";
        var host = location.host;
        var data = {version:"plantearth",shareurl:encodeURIComponent(location.href),share_appid:share_appid};
        ev.ajaxrequest(apiurl,"post",true,data,ev.ShareCallback,"share");
    }
    ev.getUserinfo = function(){
        return wx_userinfo;
    }
    ev.ready = function(func){
        ev.cbready = func;
    }
}