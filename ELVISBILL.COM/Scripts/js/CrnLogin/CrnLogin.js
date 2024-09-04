////////////////////전역 변수//////////////////////////
//_vContentType = _fnToNull(_fnGetParam("")); // 공급자(S)  /   default : 공급받는자(B)
var _vSearchType = _fnToNull(_fnGetParam("searchtype")); // 번호기준(N) / 담당자(S) / 이메일(E)
var _vN_Value = _fnToNull(_fnGetParam("nvalue")); // 번호기준 : B/L No or Invoice No or 계산서 번호
////////////////////jquery event///////////////////////
$(function () {        
    
    //쿠키 세팅
    fnChkCookieCRN();

    //쿠키 리스트
    if (_fnToNull(_fnGetCookie("Cookie_CRN_List")) != "") {
        $("#Login_InputCrn").val(_fnToNull(_fnGetCookie("RecentCRN")));
    }

    //Cookie_YN Y/N
    if (_fnToNull(_fnGetCookie("Cookie_YN")) == "Y") {
        $("#cookie_save_chkbtn").prop("checked", true);
    }

    //AutoComplete 영역 체크 후 조정
    $(".AutoComplete_Area").css("width", $("#Login_InputCrn").width());
});

//Get 형식 데이터 파싱 먼저하기
$(document).on("click", "#Login_CheckCrn", function () {
    fnCheckCrn();
});

//key 입력 시 warning 지우기
$(document).on("keyup", "#Login_InputCrn", function (e) {    

    //warning
    if ($("#Login_InputCrn").val() == 0) {
        $("#warning_text").hide();
    }

    //엔터
    if ($("#Login_InputCrn").val().length > 0) {
        if (e.keyCode == 13) {//키가 13이면 실행 (엔터는 13)
            fnCheckCrn();
        }
    }    

    //replace
    $("#Login_InputCrn").val($("#Login_InputCrn").val().replace(/[^0-9]/g, ""));

});

//쿠키 레이어 팝업 - 쿠키에 의한 개인정보 수집 CheckBox 클릭 이벤트
$(document).on("click", "#cookie_save_chkbtn", function () {
    //체크 박스 true로 변경
    if ($("#cookie_save_chkbtn").is(":checked")) {
        $(".layerPopup_bg").show();
        $(".layerCookie").show();
        $("#wrap").addClass("noscroll");
    } else {
        //_fnSetCookie("Cookie_YN", "N", 10000); //쿠키
        //쿠키 리스트에 데이터가 있다면!
        if (_fnToNull(_fnGetCookie("Cookie_CRN_List")) != "") {
            $(".layerPopup_bg").show();
            $(".layerCookieDeleteYN").show();
            $("#wrap").addClass("noscroll");
        } else {
            _fnSetCookie("Cookie_YN", "N", 10000); //쿠키
        }
    }
});

//쿠키 레이어 팝업 - Close 이벤트
$(document).on("click", "#layer2_Close_Btn", function () {
    $("#cookie_save_chkbtn").prop("checked", false);
    $(".layerPopup_bg").hide();
    $(".layerCookie").hide();
});

//쿠키 레이어 팝업 - 승인 이벤트
$(document).on("click", "#layer2_Cookie_Approval", function () {
    //쿠키 check 승인 
    _fnSetCookie("Cookie_YN", "Y", 10000); //쿠키

    $("#cookie_save_chkbtn").prop("checked", true);
    $(".layerPopup_bg").hide();
    $(".layerCookie").hide();
});

//쿠키 레이어 팝업 - 거절 이벤트
$(document).on("click", "#layer2_Cookie_Refuse", function () {

    _fnSetCookie("Cookie_YN", "N", 10000); //쿠키
    $("#cookie_save_chkbtn").prop("checked", false);
    $(".layerPopup_bg").hide();
    $(".layerCookie").hide();
});

//쿠키 레이어 삭제 팝업 - 삭제
$(document).on("click", "#layer2_Cookie_DeleteY", function () {

    //모든 쿠키 변수 삭제
    fnInitCookies();

    $("#cookie_save_chkbtn").prop("checked", false);
    $(".layerPopup_bg").hide();
    $(".layerCookieDeleteYN").hide();

});

//쿠키 레이어 삭제 팝업 - 삭제 하지 않음
$(document).on("click", "#layer2_Cookie_DeleteN", function () {
    //쿠키 check 승인 
    _fnSetCookie("Cookie_YN", "Y", 10000); //쿠키

    $("#cookie_save_chkbtn").prop("checked", true);
    $(".layerPopup_bg").hide();
    $(".layerCookieDeleteYN").hide();
});


//자동완성 영역 resize
$(window).resize(function () {
    $(".AutoComplete_Area").css("width", $("#Login_InputCrn").width());
});

//사업자번호 input 포커스 in 인 경우
$(document).on("focusin", "#Login_InputCrn", function () {

    //데이터 초기화
    //$(this).val("");
    if (_fnToNull(_fnGetCookie("Cookie_CRN_List")) != "") {
        $(".AutoComplete_Area").show();
        $("#AutoComplete_Area_ul li").show();
    }

    //$("#cookie_save_chkbtn").prop("checked", false);

    //if (_fnToNull(_fnGetCookie("Cookie_CRN_List")) != "") {

    //    if ($(this).val().length < 10) {
    //        $(".AutoComplete_Area").show();
    //    } else {
    //        $(".AutoComplete_Area").hide();
    //    }
    //}
});

//자동완성 사업자 번호 클릭 이벤트
$(document).on("click", ".AutoComplete_Frist_div", function () {        
    $("#Login_InputCrn").val($(this).find("span").text());    
});

//자동완성 사업자 번호 삭제 이벤트
$(document).on("click", "div[name='Cookie_delete_Btn']", function () {
    fnCookieDelete($(this).siblings(".AutoComplete_Frist_div").find("span").text());
    $(this).closest("li").remove();
});

//영역 밖 클릭 시 end
$(document).click(function (e) {
    if (!$(e.target).is('#AutoComplete_Area')) {
        if (!$(e.target).is('#Login_InputCrn')) {
            $(".AutoComplete_Area").hide();
        }
    }
});

//자동완성 filter 만들기
$(document).on("keyup", "#Login_InputCrn", function (e) {

    //if (e.keyCode == 40) {
    //
    //    //현재 on 어디에 있는지 확인
    //    var vIndex = $("#AutoComplete_Area_ul li").parent().find(".on").index();
    //
    //    //현재 있는거 붙히기
    //    $("#AutoComplete_Area_ul li").eq(vIndex + 1).addClass("on");
    //
    //    //기존에 있던거 삭제
    //    $("#AutoComplete_Area_ul li").eq(vIndex).removeClass("on");
    //
    //} else if (e.keyCode == 38) {
    //    //현재 on 어디에 있는지 확인
    //    var vIndex = $("#AutoComplete_Area_ul li").parent().find(".on").index();
    //
    //    //현재 있는거 붙히기
    //    $("#AutoComplete_Area_ul li").eq(vIndex - 1).addClass("on");
    //
    //    //기존에 있던거 삭제
    //    $("#AutoComplete_Area_ul li").eq(vIndex).removeClass("on");
    //}
    //else {
    //    //선택 초기화
    //    $("#AutoComplete_Area_ul li").removeClass("on");
    //}

    var vCookieList = _fnToNull(_fnGetCookie("Cookie_CRN_List"));

    if (vCookieList != "") {

        //자동완성 보여줘야되는지 체크 로직
        if ($(this).val().length < 10) {
            $(".AutoComplete_Area").show();
        } else {
            $(".AutoComplete_Area").hide();
        }

        //필터로 자동완성 만들기
        vValue = $(this).val(); //현재 입력 된 값

        if (vValue.length == 0) {
            //전체 보이게
            $("#AutoComplete_Area_ul li").show();
        } else {
            //전체 안보이게 하이드
            $("#AutoComplete_Area_ul li").hide();

            //필터 적용
            $("#AutoComplete_Area_ul li .AutoComplete_Frist_div span").filter(function (e) {
                if ($(this).text().indexOf(vValue) > -1) {
                    $(this).closest("li").toggle();
                }
            });
        }
    }

    //사업자 번호 체크 후 쿠키에 있는 데이터면 체크박스 On / Off 
    //if ($(this).val().length > 9) {
    //    if (!fnValidation_CRN()) {
    //        //중복이 있을 경우.
    //        $("#cookie_save_chkbtn").prop("checked", true);
    //    } else {
    //        $("#cookie_save_chkbtn").prop("checked", false);
    //    }
    //} else if ($(this).val().length < 10) {
    //    $("#cookie_save_chkbtn").prop("checked", false);
    //}

});

////////////////////////function///////////////////////
function fnCookieSave() {
    //Cookie_CRN_List (사업자 번호 쿠키 저장 리스트)
    //RecentCRN

    //만약 데이터가 기존에 있는 CRN인 경우는 저장 되지 않게 수정

    //데이터가 없는경우
    if (_fnToNull(_fnGetCookie("Cookie_CRN_List")) == "") {
        _fnSetCookie("Cookie_CRN_List", $("#Login_InputCrn").val(), 10000); //쿠키 리스트
        _fnSetCookie("RecentCRN", $("#Login_InputCrn").val(), 10000); //제일 최근 CRN 저장 쿠키
    } else {

        if (fnValidation_CRN()) {
            var vValue = _fnToNull(_fnGetCookie("Cookie_CRN_List"));

            //초기화 
            _fnDelCookie("Cookie_CRN_List");

            if (_fnToNull($("#Login_InputCrn").val()) != "") {
                vValue = vValue + "^" + $("#Login_InputCrn").val();
                _fnSetCookie("Cookie_CRN_List", vValue, 10000);
                _fnSetCookie("RecentCRN", $("#Login_InputCrn").val(), 10000); //제일 최근 CRN 저장 쿠키
            } else {
                _fnSetCookie("Cookie_CRN_List", vValue, 10000);
                _fnSetCookie("RecentCRN", $("#Login_InputCrn").val(), 10000); //제일 최근 CRN 저장 쿠키
            }
        }
    }
}

//리스트에서 쿠키 삭제 했을 때 쿠키 삭제 로직
function fnCookieDelete(vValue) {

    var vValue_List = "";

    if (vValue != "") {
        var vCRN_List = _fnToNull(_fnGetCookie("Cookie_CRN_List"));
        var vCRN_Recent = _fnToNull(_fnGetCookie("RecentCRN"));

        //RecentCRN과 현재 클릭한 사업자 번호 맞는지 체크
        if (vValue == vCRN_Recent) {
            _fnDelCookie("RecentCRN");
        }

        //Cookie 초기화 
        _fnDelCookie("Cookie_CRN_List");
                
        vCRN_List = vCRN_List.split("^");

        //Cookie List 체크
        $.each(vCRN_List, function (i) {            
            if (vCRN_List[i] != vValue) {
                //첫 데이터 일 경우 구분자 뺴기
                if (vValue_List == "") {
                    vValue_List += vCRN_List[i];
                } else {
                    vValue_List += "^" + vCRN_List[i];
                }
            } 
        });

        _fnSetCookie("Cookie_CRN_List", vValue_List, 10000);
        
    }
}

//쿠키 사업자 번호 중복 체크 로직
function fnValidation_CRN() {

    var isBoolean = true;

    var vValue = _fnToNull(_fnGetCookie("Cookie_CRN_List"));
    var vCRN = $("#Login_InputCrn").val();

    if (vValue != "") {

        vValue = vValue.split("^");

        //중복 값 체크
        $.each(vValue, function (i) {
            if (vValue[i] == vCRN) {
                console.log("중복된 CRN");
                isBoolean = false;
            }
        });
    }

    return isBoolean;
}

//쿠키 저장 확인 로직 생성
function fnChkCookieCRN() {

    //Cookie_CRN_List (사업자 번호 쿠키 저장 리스트)
    //RecentCRN

    var vValue = _fnToNull(_fnGetCookie("Cookie_CRN_List"));

    //쿠키가 있는지 없는지 확인 후 있는 경우 쿠키 그려주기
    if (vValue != "") {
        fnMakeCookieCRN();
    }
}


//사업자 번호 확인
function fnCheckCrn() {
    try {
        //번호기준 벨리데이션 체크
        if (fnCrnValidation()) {
            var objJsonData = new Object();
                        
            objJsonData.SearchType  = _vSearchType;
            objJsonData.CRN_NO = $("#Login_InputCrn").val().replace(/-/gi, "");
            objJsonData.N_VALUE = _vN_Value;

            $.ajax({
                type: "POST",
                url: "/CrnLogin/fnCheckCrn",
                async: true,
                dataType: "json",
                //data: callObj,
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result == null) {
                        _fnalert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                    } else {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {      

                            //쿠키에 의한 개인정보 수집 체크인 경우 
                            if ($("#cookie_save_chkbtn").is(":checked")) {
                                fnCookieSave();
                            }

                            fnGetEdocDate(result);
                        }
                        else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                            $("#warning_text").show();
                            //쿠키에 의한 개인정보 수집 체크박스 해제
                            /*$("#cookie_save_chkbtn").prop("checked", false);*/
                        }
                    }
                },
                error: function (xhr, status, error) {
                    if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        _fnalert("담당자에게 문의 하세요.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                    }
                }
            });
        }
    } catch (e) {
        console.log(e.message);
    }

}

//Crn 검색 벨리데이션 체크
function fnCrnValidation() {

    if (_fnToNull($("#Login_InputCrn").val()) == "") {
        _fnalert("사업자 번호를 입력하세요.");
        $("#Login_InputCrn").focus();
        return false;
    }
    return true;
}

//데이터를 가지고 Edoc으로 페이지 이동
function fnGetEdocDate(vJsonData) {

    try {
        //번호기준 벨리데이션 체크
        var objJsonData = new Object();

        //S인지 B인지 같이 보내야됨
        var vResult = JSON.parse(vJsonData).Data;

        //if (vResult.length > 0) {
        //    objJsonData.ContentType = _fnToNull(vResult[0]["BUSN_TYPE"]); //이걸 받아서 
        //} else {
        //    objJsonData.ContentType = "B"; //이걸 받아서 
        //}
        objJsonData.ContentType = "B"; 
        objJsonData.SearchType = _vSearchType;
        objJsonData.CRN_NO = $("#Login_InputCrn").val();
        objJsonData.N_Value = _vN_Value;

        $.ajax({
            type: "POST",
            url: "/Edoc/EdocView",
            data: objJsonData,
            success: function (result) {
                //window.location.href = window.location.origin+"/Edoc";
                window.location.href = _HomeUrl + "/Edoc";
            }
        });
    } catch (e) {
        console.log(e.message);
    }
}

//쿠키 변수 초기화
function fnInitCookies() {
    _fnDelCookie("RecentCRN");
    _fnDelCookie("Cookie_CRN_List");
    _fnDelCookie("Cookie_YN");
}

/////////////////function MakeList/////////////////////
function fnMakeCookieCRN() {
    var vCRN_List = _fnToNull(_fnGetCookie("Cookie_CRN_List"));
    var vCRN_Recent = _fnToNull(_fnGetCookie("RecentCRN"));

    var vHTML = "";

    //리스트를 그려준다. 단 처음에 Recent를 그려주고 그 뒤로 체크 후 하나씩 그려준다.
    if (vCRN_Recent != "") {
        /*vHTML += "<li><span>" + vCRN_Recent+"</span><i class=\"xi-close3\" name=\"Cookie_delete_Btn\"></i></li>";*/
        vHTML += "<li>";
        vHTML += " <div class=\"AutoComplete_Frist_div\"> ";
        vHTML += " 	<span>" + vCRN_Recent + "</span> ";
        vHTML += " </div> ";
        vHTML += " <div class=\"AutoComplete_Second_div\" name=\"Cookie_delete_Btn\"><i class=\"xi-close3\" ></i></div> ";
        vHTML += "</li>";
    }

    //쿠키 리스트 그려주기
    if (vCRN_List != "") {

        var vCRN_List = vCRN_List.split("^");

        $.each(vCRN_List, function (i) {
            if (vCRN_List[i] != vCRN_Recent) {
                //vHTML += "<li><span>" + vCRN_List[i] + "</span><i class=\"xi-close3\" name=\"Cookie_delete_Btn\"></i></li>";
                vHTML += "<li>";
                vHTML += " <div class=\"AutoComplete_Frist_div\"> ";
                vHTML += " 	<span>" + vCRN_List[i] + "</span> ";
                vHTML += " </div> ";
                vHTML += " <div class=\"AutoComplete_Second_div\" name=\"Cookie_delete_Btn\"><i class=\"xi-close3\" ></i></div> ";
                vHTML += "</li>";
            }
        });
    }

    $("#AutoComplete_Area_ul")[0].innerHTML = vHTML;

}


////////////////////////API////////////////////////////

