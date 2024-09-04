////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vNow = new Date().getFullYear() + _pad(new String(new Date().getMonth() + 1), 2) + _pad(new String(new Date().getDate()), 2);
var UrlLogin = "N";
var urlId;
var urlpw;
////////////////////jquery event///////////////////////
$(function () {

    


    if (window.location.search == "") { // 파라미터 없을 때 
        fnGetNoticeList(); //공지사항 가져오는 로직

        //아이디 기억하기
        var userInputId = _fnGetCookie("YJIT_USR_ID_REMEMBER_ELVISBILL");
        if (_fnToNull(userInputId) != "") {
            $("#Login_ID").val(userInputId);
            $("#login_keep").replaceWith("<input type='checkbox' id='login_keep' name='login_keep' checked/>");
        }

    }
    else { //있을 때
        urlId = atob(_fnGetParam("userid"));
        urlpw = atob(_fnGetParam("busnno"));

        history.replaceState({}, null, location.pathname);

        //$("#Login_ID").val(logId);
        //$("#Login_PW").val(logpw);

        UrlLogin = "Y";


        $("#user_login_btn").click();
    }

    

});


//#region ☆☆☆☆☆☆Login Process☆☆☆☆☆

$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        if ($(e.target).attr('data-index') != undefined) {
            if ($(e.target).attr('data-index').indexOf("") > -1) {
                var vIndex = $(e.target).attr('data-index').replace("login", "");

                if (vIndex != 2) {
                    $('[data-index="login' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else {
                    $("#user_login_btn").click();
                }
            }
        }
        else {
            event.preventDefault();
        }
    }
});


//로그인 버튼
$(document).on("click", "#user_login_btn", function () {
    if (_fnLoginValidation()) {
        fnLogin();
    }
});


//#region 함수 

//로그인 유효성 검사
function _fnLoginValidation() {
    if (UrlLogin != "Y") {
        if (_fnToNull($("#Login_ID").val()) == "") {
            _fnalert("아이디를 입력해주세요.");
            return false;
        }

        if (_fnToNull($("#Login_PW").val()) == "") {
            _fnalert("비밀번호를 입력해주세요.");
            return false;
        }
    }


    return true;
}


function fnLogin() {
    var loginObj = new Object();

    if (UrlLogin == "Y") {
        loginObj.LOGIN_TYPE = "URL";
        UrlLogin = "N";
        loginObj.USER_ID = urlId;
        loginObj.USER_PW = urlpw;
    }
    else {
        loginObj.USER_ID = _fnToNull($("#Login_ID").val());
        loginObj.USER_PW = _fnToNull($("#Login_PW").val());
    }

    
    $.ajax({
        type: "POST",
        url: "/Home/USR_Login",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(loginObj) },
        success: function (result) {
            if (JSON.parse(result)["Result"][0]["trxCode"] == "Y") {
                $("#Login_pop").hide();
                $("#Login_PW").val("");
                if ($("input[name=login_keep]")[0].checked) {
                    _fnSetCookie("YJIT_USR_ID_REMEMBER_ELVISBILL", loginObj.USER_ID, "168");
                    
                }
                else {
                    _fnDelCookie("YJIT_USR_ID_REMEMBER_ELVISBILL");
                    $("#Login_ID").val("");
                }
                //save 처리 해야함
                $.ajax({
                    type: "POST",
                    url: "/Home/saveUsrLgoin",
                    async: false,
                    data: { "vJsondata": _fnMakeJson(JSON.parse(result)) },
                    success: function (result, status, xhr) {
                        if (_fnToNull(result) == "Y") {



                            location.href = '/MyEdoc';
                            //window.location.replace("http://localhost:60931/MyEdoc")
                        }
                        else {
                            console.log("[Fail : fnLogin()]");
                            _fnalert("관리자에게 문의 하세요");
                        }
                    },
                    error: function (xhr) {
                        console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                        console.log(xhr);
                        return;
                    }, beforeSend: function () {
                        $("#ProgressBar_Loading").show();
                    },
                    complete: function () {
                        $("#ProgressBar_Loading").hide();
                    }
                });

            }
            else { // trxCode = N
                _fnalert("로그인 정보가 일치하지 않습니다.");
            }
        }, error(e) {
            console.log(e.message);
        }
    });
}
//#endregion

//#endregion


//#region ☆☆☆☆☆Main Page Function☆☆☆☆☆
//#region ★★★★★Event Area★★★★★
//메인 검색 버튼 클릭 이벤트 (네임으로 한 이유는 id가 벌써 있기 때문)
$(document).on("click", "#search_btn", function ㅁ() {
    fnSearchData();
});

//#region (미사용)리뉴얼 전 - 공지사항 리스트 클릭 이벤트
//$(document).on("click", "#notice_list li", function () {

//    //데이터가 없을 경우를 대비
//    if (_fnToNull($(this).find("input[type=hidden]").val()) == "") {
//        return false;
//    }
//    else {
//        //데이터 가져오기
//        fnGetNoticeData($(this).find("input[type=hidden]").val());
//    }
//});
//#endregion

//#region 메인메뉴 이미지 탭
$(document).on('click', '.bx-next', function () {
    $(this).siblings('.btn_next').addClass('on');
    $('.btn_pre').removeClass('on');
});
$(document).on('click', '.bx-prev', function () {
    $(this).siblings('.btn_pre').addClass('on');
    $('.btn_next').removeClass('on');
})

//#endregion

//공지사항 리스트 클릭 이벤트
$(document).on("click", "#notice_body_list tr td:nth-child(1)", function () {
    if (_fnToNull($(this).find("input[type=hidden]").val()) == "") {
        return false;
    }
    else {
        fnGetNoticeData($(this).find("input[type=hidden]").val());
    }
});

//#region 공지사항 조회조건 검색
$(document).on("keyup", "#input_Notice", function (e) {
    if (e.keyCode == 13) {
        $("#notice_s_btn").click();
    }
})

$(document).on("click", "#notice_s_btn", function () {
    _vPage = 1;
    fnGetNoticeList();
});

//#endregion

//#endregion

//#region ★★★★★Func★★★★★
//엘비스 빌 검색
function fnSearchData()
{
    try {

        //벨리데이션 체크
        if (fnSearchValidation())
        {            
            var objJsonData = new Object();
            objJsonData.DOMAIN = window.location.origin;

            if ($(".gubun_btn li:eq(0) a").hasClass("on")) {
                //alert("번호기준");
                objJsonData.ContentType = "B";
                objJsonData.SearchType = "N";
                objJsonData.CRN_NO = $("#N_CRN_NO").val();
                objJsonData.N_Value = $("#N_VALUE").val();

            }
            else if ($(".gubun_btn li:eq(1) a").hasClass("on")) {
                //alert("담당자");
                objJsonData.ContentType = "B";
                objJsonData.SearchType = "S";
                objJsonData.CRN_NO = $("#S_CRN_NO").val();
                objJsonData.Email = $("#S_EMAIL").val();
            }

            $.ajax({
                type: "POST",
                url: "/Edoc/EdocView",
                data: objJsonData,
                success: function (result) {
                    window.location.href = window.location.origin + "/Edoc";
                }
            });
        }
        
    } catch (e) {
        console.log(e.message);
    }
}

//검색 시 벨리데이션 체크
function fnSearchValidation() {

    //번호기준 & 담당자 탭 확인
    if ($(".gubun_btn li:eq(0) a").hasClass("on")) {
        if (_fnToNull($("#N_CRN_NO").val()) == "") {
            _fnalert("사업자 번호를 입력 해 주세요.");
            $("#N_CRN_NO").focus();
            return false;
        }
        else if (_fnToNull($("#N_VALUE").val()) == "") {
            _fnalert("B/L No or Invoice No or 계산서번호를 입력하세요.");
            $("#N_VALUE").focus();
            return false;
        }
    }
    else if ($(".gubun_btn li:eq(1) a").hasClass("on")) {
        if (_fnToNull($("#S_CRN_NO").val()) == "") {
            _fnalert("사업자 번호를 입력 해 주세요.");
            $("#S_CRN_NO").focus();
            return false;
        }
        else if (_fnToNull($("#S_EMAIL").val()) == "") {
            _fnalert("이메일 주소를 입력하세요.");
            $("#S_EMAIL").focus();
            return false;
        }
    }

    return true;
}

//공지사항 리스트 가져오기
function fnGetNoticeList()
{
    try {
        var objJsonData = new Object();

        if (_fnToNull($("#input_Notice").val()) != "") { //검색 값이 있을 때 
            objJsonData.SVALID = $("#select_Notice").val();
            objJsonData.SVALUE = _fnToNull($("#input_Notice").val());
        }

        if (_vPage == 0) {
            objJsonData.PAGE = 1;
        }
        else {
            objJsonData.PAGE = _vPage;
        }

        $.ajax({
            type: "POST",
            url: "/Home/fnGetNoticeList",
            async: true,
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnMakeNoticeList(result);
                    fnNoticePaging(JSON.parse(result).Table[0]["TOTCNT"], 10, 5, objJsonData.PAGE);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    //fnMakeNoticeList(result);
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        });
    } catch (e) {
        console.log(e.message);
    }
}

//공지사항 내용 가져오기
function fnGetNoticeData(vBoder_id)
{
    try {
        var objJsonData = new Object();

        objJsonData.BOARD_ID = vBoder_id;

        $.ajax({
            type: "POST",
            url: "/Home/fnGetNoticeListData",
            async: true,
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {                    
                    fnMakeNoticeData(result);
                    $(".layerPopup_bg").show();
                    //$(".layerPopup_01").show();
                    $("#Notice").show();

                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnalert("공지 내용이 없습니다.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        });

    } catch (e) {
        console.log(e.message);
    }
}

//페이징
function goPage(index)
{
    _vPage = index;
    fnGetNoticeList();
}


//#endregion

//#region ★★★★★메인페이지 그리기 함수★★★★★

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
//pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
//공지사항 페이징
function fnNoticePaging(totalData, dataPerPage, pageCount, currentPage)
{
    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹
    if (pageCount > totalPage) pageCount = totalPage;
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage) last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last + 1;
    var prev = first - 1;

    $("#paging_Area").empty();

    var prevPage;
    var nextPage;
    if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
    if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }

    var html = "";

    html += "<a href='javascript:void(0)' onclick='goPage(1)'><<</a>";
    html += "<a href='javascript:void(0)' onclick='goPage(" + prevPage + ")'><</a>";

    for (var i = first; i <= last; i++) {

        if (i == currentPage) {
            html += "<a href='javascript:void(0)' class=\"on\">"+i+"</a>";
        } else {            
            html += "<a href='javascript:void(0)' onclick='goPage(" + i + ")'>" + i + "</a>";
        }
    }

    html += "<a href='javascript:void(0)' onclick='goPage(" + nextPage + ")'>></a>";
    html += "<a href='javascript:void(0)' onclick='goPage(" + totalPage + ")'>>></a>";

    $("#paging_Area").append(html);    // 페이지 목록 생성		
}


//#region (미사용)리뉴얼 전 리스트
//공지사항 리스트 그리기
//function fnMakeNoticeList(vJsonData)
//{
//    try
//    {
//        var vHTML = "";
//        var vResult = JSON.parse(vJsonData).Table;

//        vHTML += "<li><span class='title'>공지사항</span></li>";
//        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N")
//        {
//            vHTML += " <li>";
//            vHTML += " <a href='javascript:void(0)' class='link_btn'>데이터가 없습니다.</a>";            
//            vHTML += " </li>";
//        }
//        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y")
//        {
//            $.each(vResult, function (i) {
//                vHTML += " <li>";

//                //현재 날짜 기준으로 exp_ymd가 안지났으면 new를 붙혀주는 로직
//                if (_vNow <= _fnToNull(vResult[i]["EXP_YMD"])) {
//                    vHTML += " <a href='javascript:void(0)' class='link_btn'>" + _fnToNull(vResult[i]["TITLE"]) + " <span style='color:red;padding-left:10px'>new</span></a>";
//                }
//                else {
//                    vHTML += " <a href='javascript:void(0)' class='link_btn'>" + _fnToNull(vResult[i]["TITLE"]) + "</a>";
//                }

//                vHTML += " <span class='date'>" + _fnToNull(vResult[i]["INS_YMD"]) + "</span>";
//                vHTML += " <input type='hidden' value='" + _fnToNull(vResult[i]["BOARD_ID"]) +"'/>";
//                vHTML += " </li>";
//            });
//        }
//        $("#notice_list")[0].innerHTML = vHTML;        
//    }
//    catch (e)
//    {
//        console.log(e.message);
//    }
//}
//#endregion

//NEW 공지사항 리스트 그리기
function fnMakeNoticeList(vJsonData) {
    try {
        var vHTML = "";
        var vResult = JSON.parse(vJsonData).Table;
        $("#notice_body_list").empty();
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            
            $.each(vResult, function (i) {
                vHTML += "<tr>";
                vHTML += "  <td>";
                vHTML += "      <a>" + _fnToNull(vResult[i]["TITLE"]) + "</a>";
                vHTML += "      <input type='hidden' value='" + _fnToNull(vResult[i]["BOARD_ID"]) +"'/>";
                vHTML += "  </td>";
                vHTML += "  <td>"+_fnToNull(vResult[i]["LOC_NM"])+"</td>"; //작성자 
                vHTML += "  <td>" + _fnToNull(vResult[i]["INS_YMD"])+"</td>"; //등록일
                vHTML += "</tr>";
            });

            $("#notice_body_list").append(vHTML);
        }

    }
    catch (e) {
        console.log(e.message);
    }
}

//공지사항 내용 그리기
function fnMakeNoticeData(vJsonData)
{
    try {
        var vHTML = "";
        var vResult = JSON.parse(vJsonData).Table;        

        //vHTML += "<li>" + _fnToNull(vResult[0]["TITLE"]) + "</li>";
        vHTML += "<p>" + _fnToNull(vResult[0]["TITLE"]) + "</p>";
        //$("#Layer_Notice_Subject")[0].innerHTML = vHTML;
        $(".notice-title_box")[0].innerHTML = vHTML;

        vHTML = "" + _fnToNull(vResult[0]["BOARD_BODY"]).replace(/<img src="/gi, "<img src=\"http://110.45.209.36:9632/WCF/Notice/Data/") + "";
        //$("#Layer_Notice_Content")[0].innerHTML = vHTML;
        $(".notice_cont")[0].innerHTML = vHTML;
    }
    catch (e) {
        console.log(e.message);
    }
}

//#endregion

//#endregion

