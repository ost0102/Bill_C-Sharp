////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vNow = new Date().getFullYear() + _pad(new String(new Date().getMonth() + 1), 2) + _pad(new String(new Date().getDate()), 2);
////////////////////jquery event///////////////////////
$(function () {    
    fnGetNoticeList(); //공지사항 가져오는 로직
});

//메인 검색 버튼 클릭 이벤트 (네임으로 한 이유는 id가 벌써 있기 때문)
$(document).on("click", "a[name='search_btn']", function () {
    fnSearchData();
});

//공지사항 리스트 클릭 이벤트
$(document).on("click", "#notice_list li", function () {

    //데이터가 없을 경우를 대비
    if (_fnToNull($(this).find("input[type=hidden]").val()) == "") {
        return false;
    }
    else {
        //데이터 가져오기
        fnGetNoticeData($(this).find("input[type=hidden]").val());
    }
});

////////////////////////function///////////////////////
//엘비스 빌 검색
function fnSearchData()
{
    try {

        //벨리데이션 체크
        if (fnSearchValidation())
        {            
            var objJsonData = new Object();

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
                    //window.location.href = "http://localhost:60931/Edoc";
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
            alert("사업자 번호를 입력 해 주세요.");
            $("#N_CRN_NO").focus();
            return false;
        }
        else if (_fnToNull($("#N_VALUE").val()) == "") {
            alert("B/L No or Invoice No or 계산서번호를 입력하세요.");
            $("#N_VALUE").focus();
            return false;
        }
    }
    else if ($(".gubun_btn li:eq(1) a").hasClass("on")) {
        if (_fnToNull($("#S_CRN_NO").val()) == "") {
            alert("사업자 번호를 입력 해 주세요.");
            $("#S_CRN_NO").focus();
            return false;
        }
        else if (_fnToNull($("#S_EMAIL").val()) == "") {
            alert("이메일 주소를 입력하세요.");
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
                    fnNoticePaging(JSON.parse(result).Table[0]["TOTCNT"], 5, 5, objJsonData.PAGE);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    fnMakeNoticeList(result);
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
                    $(".layerPopup_01").show();
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    alert("공지 내용이 없습니다.");
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
/////////////////function MakeList/////////////////////
//공지사항 리스트 그리기
function fnMakeNoticeList(vJsonData)
{
    try
    {
        var vHTML = "";
        var vResult = JSON.parse(vJsonData).Table;

        vHTML += "<li><span class='title'>공지사항</span></li>";
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N")
        {
            vHTML += " <li>";
            vHTML += " <a href='javascript:void(0)' class='link_btn'>데이터가 없습니다.</a>";            
            vHTML += " </li>";
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y")
        {
            $.each(vResult, function (i) {
                vHTML += " <li>";

                //현재 날짜 기준으로 exp_ymd가 안지났으면 new를 붙혀주는 로직
                if (_vNow <= _fnToNull(vResult[i]["EXP_YMD"])) {
                    vHTML += " <a href='javascript:void(0)' class='link_btn'>" + _fnToNull(vResult[i]["TITLE"]) + " <span style='color:red;padding-left:10px'>new</span></a>";
                }
                else {
                    vHTML += " <a href='javascript:void(0)' class='link_btn'>" + _fnToNull(vResult[i]["TITLE"]) + "</a>";
                }

                vHTML += " <span class='date'>" + _fnToNull(vResult[i]["INS_YMD"]) + "</span>";
                vHTML += " <input type='hidden' value='" + _fnToNull(vResult[i]["BOARD_ID"]) +"'/>";
                vHTML += " </li>";
            });
        }
        $("#notice_list")[0].innerHTML = vHTML;        
    }
    catch (e)
    {
        console.log(e.message);
    }
}

//공지사항 내용 그리기
function fnMakeNoticeData(vJsonData)
{
    try {
        var vHTML = "";
        var vResult = JSON.parse(vJsonData).Table;        

        vHTML += "<li>" + _fnToNull(vResult[0]["TITLE"]) + "</li>";
        $("#Layer_Notice_Subject")[0].innerHTML = vHTML;

        vHTML = "" + _fnToNull(vResult[0]["BOARD_BODY"]).replace(/<img src="/gi, "<img src=\"http://110.45.209.36:9630/Data/") + "";
        $("#Layer_Notice_Content")[0].innerHTML = vHTML;
    }
    catch (e) {
        console.log(e.message);
    }
}


////////////////////////API////////////////////////////

