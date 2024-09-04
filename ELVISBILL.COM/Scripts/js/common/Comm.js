////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
//$(function () {
        
//});

////////////////////////function///////////////////////
function _fnMakeJson(data) {
    if (data != undefined) {
        var str = JSON.stringify(data);
        if (str.indexOf("[") == -1) {
            str = "[" + str + "]";
        }
        return str;
    }
}

//Null 값 ""
function _fnToNull(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null') {
        return ''
    } else {
        return data
    }
}

//Null 값 0으로
function _fnToZero(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null' || String(data) == '' || String(data) == 'NaN') {
        return '0'
    } else {
        return data
    }
}

//숫자 width만큼 앞에 0 붙혀주는 함수 EX) widht = 2일떄 1은 01로 찍힘
function _pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

//콤마 찍기
function fnSetComma(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환         
    while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2');
    }
    return n;
}

//날짜 유효성 체크
function _fnCheckDate(vDate) {

}


//날짜 yyyy-mm-dd 만들어 주는 포멧
function _fnFormatDate(vDate) {

    if (_fnToNull(vDate) == "") {
        return "";
    }

    var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/; //Declare Regex                  
    var vValue = vDate.replace(/-/gi, "");

    var dtArray = vValue.match(rxDatePattern); // is format OK?

    dtYear = dtArray[1];
    dtMonth = dtArray[2];
    dtDay = dtArray[3];

    return dtYear + "-" + _pad(dtMonth, 2) + "-" + _pad(dtDay, 2);
}

//사업자 번호 123-45-67890 만들어 주는 포멧
function _fnFormatCRN(vCRN) {
       
    if (_fnToNull(vCRN) == "") {
        return "";
    }

    if (vCRN.length == 13) {
        var rxDatePattern = /^(\d{6})(\d{1,7})$/; //Declare Regex    
        var vValue = vCRN.replace(/-/gi, "");

        var dtArray = vValue.match(rxDatePattern); // is format OK?

        dtCrn1 = dtArray[1];
        dtCrn2 = dtArray[2];

        return dtCrn1 + "-" + dtCrn2;
    }
    if (vCRN.length == 10) {
        var rxDatePattern = /^(\d{3})(\d{1,2})(\d{1,5})$/; //Declare Regex    
        var vValue = vCRN.replace(/-/gi, "");

        var dtArray = vValue.match(rxDatePattern); // is format OK?

        dtCrn1 = dtArray[1];
        dtCrn2 = dtArray[2];
        dtCrn3 = dtArray[3];

        return dtCrn1 + "-" + dtCrn2 + "-" + dtCrn3;
    }
}

/* 지연 함수 - ms 시간만큼 지연하여 실행. */
function _fnsleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// url 에서 parameter 추출
function _fnGetParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    params = params.split("&");
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if ([temp[0]] == sname) { sval = temp[1]; }
    }
    return sval;
}

//유비폼 인쇄 데이터 보여주기
function _fn_viewer_open(projectName, formName, datasetList, paramList) {

    var _params = {
        "projectName": projectName      //fn_setViewParam 함수에서 가져와 프로젝트명 셋팅
        , "formName": formName            //fn_setViewParam 함수에서 가져와 서식명 셋팅
    };

    for (var datasetValue in datasetList) {
        _params[datasetValue] = encodeURIComponent(datasetList[datasetValue]);
    }

    for (var paramValue in paramList) {
        _params[paramValue] = paramList[paramValue];
    }

    console.log(_params);

    //var _url = window.location.origin + contextPath + "/UView5/index.jsp"; //UBIFORM Viewer URL
    //var _url = "http://110.45.209.81:8572/UBIFORM/UView5/index.jsp"; //양재 IT 개발 서버에 설치한 UBIFORM Viewer URL
    //var _url = "http://110.45.218.43:8072/UBIFORM/UView5/index.jsp"; //양재 IT 개발 서버에 설치한 UBIFORM Viewer URL =====================운영운영운영============== 
    var _url = _ReportUrl;
    var d = new Date();
    var n = d.getTime();

    var name = "UBF_" + n;

    //팝업 오픈 Option 해당 설정은 window.open 설정을 참조0,status=0,toolbar=0,menubar=0, width=1280px,height=650px,left=0, top=0,scrollbars=0';  //팝업사이즈 window.open참고
    var windowoption = '/';  //팝업사이즈 window.open참고
    //var windowoption = 'location=0, directories=0,resizable=
    var form = document.createElement("form");

    form.setAttribute("method", "post");
    form.setAttribute("action", _url);

    for (var i in _params) {
        if (_params.hasOwnProperty(i)) {
            var param = document.createElement('input');[]
            param.type = 'hidden';
            param.name = i;
            param.value = encodeURI(_params[i]);
            form.appendChild(param);
        }
    }

    document.body.appendChild(form);
    form.setAttribute("target", name);
    //window.open("", name, windowoption);
    //window.open("/");
    form.submit();
    document.body.removeChild(form);
}

//Alert창
function _fnalert(vValue) {
    $(".layerPopup_bg").show();
    $(".alert").show();
    $("#Edoc_Alert_Content").text(vValue); //alert 내용 넣기
    $("#wrap").addClass("noscroll");
}

//Alert 창 끄기
function _fnalert_Close() {
    $(".layerPopup_bg").hide();
    $(".alert").hide();
    $("#Edoc_Alert_Content").text(""); //alert 내용 넣기
    $("#wrap").removeClass("noscroll");
}

//이름 / 값 / 저장 시킬 시간
function _fnSetCookie(cookie_name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = cookie_name + "=" + value + expires + "; path=/";
}

//쿠키 값 가져오기
function _fnGetCookie(cookie_name) {
    var x, y;
    var val = document.cookie.split(';');

    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
        if (x == cookie_name) {
            return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
}

//쿠키 삭제하기
function _fnDelCookie(cookie_name) {
    _fnSetCookie(cookie_name, "", "-1");
}

/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

