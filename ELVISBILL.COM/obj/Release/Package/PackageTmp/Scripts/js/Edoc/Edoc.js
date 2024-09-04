////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vTAX_DOC_NO = ""; //tax_code 계속 가지고 다니기.
var _vCRD_DOC_NO = ""; //Crn_code 계속 가지고 다니기.
var _vTotalPage = 0; //Refresh를 위한 Page 변수

var _objExcelData = new Object(); //엑셀만을 위한 오브젝트인데 추후 더보기로 사용 할 수 있음.
////////////////////jquery event///////////////////////
$(function () {
    //새고로침 되었으면 여기로직 안타게 변경
    if ($("#hidden_Isinit").val() == "true") {
        // 공급자(S)  /   default : 공급받는자(B)
        if ($("#hidden_ContentType").val() == "B") {
            // 번호기준(N) / 담당자(S) / 이메일(E)
            if ($("#hidden_SearchType").val() == "N") {
                $("#Edoc_SearchN_Wrap").show();
                $("#Edoc_SearchW_Wrap").hide();
                fnN_SearchList(); //검색 function 
            }
            else if ($("#hidden_SearchType").val() == "S") {
                $("#Edoc_SearchN_Wrap").hide();
                $("#Edoc_SearchW_Wrap").show();
                $(".search_cate").hide();

                //오늘 날짜 셋팅
                $("#S_Edoc_LastDate").val(new Date().getFullYear() + "-" + _pad(new String(new Date().getMonth() + 1), 2) + "-" + _pad(new String(new Date().getDate()), 2));
                //선택된 날짜 셋팅
                $("#S_Edoc_FristDate").val(fnSetWeekDate("1week"));

                fnS_SearchList(); //검색 함수
            }
            else if ($("#hidden_SearchType").val() == "E") {
                $("#Edoc_select_SerachArea").hide();
                $("#Edoc_SearchN_Wrap").hide();
                $("#Edoc_SearchW_Wrap").hide();
                fnN_SearchList(); //검색 function 
            }
        }
        else if ($("#ContentType").val() == "S") {
            //공급자 추후 추가 될 내용. 
        }
    } else {
        $("#Edoc_SearchN_Wrap").show();
        $("#Edoc_SearchW_Wrap").hide();
    }
});

//탭 : 번호기준 / 담당자 / 조회
$(document).on("click", "#Edoc_select_SerachArea li a", function () {

    $("#Edoc_select_SerachArea li a").removeClass("on");
    $(this).addClass("on");

    var idx = $(this).parent().index();
    //탭 이동할때 기존에 있었던 데이터는 지우기
    if (idx == 0) {
        ////default 세팅
        $("#N_Edoc_CRN_NO").val("");
        $("#N_Edoc_Value").val("");
        $("#hidden_SearchType").val("N");
        $("#Edoc_SearchN_Wrap").show();
        $("#Edoc_SearchW_Wrap").hide();
    }
    else if (idx == 1) {
        ///default 세팅
        $("#S_Edoc_CRN_NO").val("");
        $("#S_Edoc_Email").val("");
        $("#S_Edoc_Chk_Bill").prop("checked", true);
        $("#S_Edoc_Chk_Credit").prop("checked", true);
        $("#S_Edoc_Supplier").val("");
        $("#S_Edoc_BillNo").val("");
        $("#S_Edoc_BLNO").val("");
        $("#S_Edoc_Chk_All").prop("checked", true);
        $("input[name='S_Edoc_Chk_State']").prop("checked", false);
        $("#hidden_SearchType").val("S");

        //오늘 날짜 셋팅
        $("#S_Edoc_LastDate").val(new Date().getFullYear() + "-" + _pad(new String(new Date().getMonth() + 1), 2) + "-" + _pad(new String(new Date().getDate()), 2));
        //선택된 날짜 셋팅
        $("#S_Edoc_FristDate").val(fnSetWeekDate("1week"));

        $("#S_Edoc_ChoiceTerm a").removeClass("on");
        $("#S_Edoc_ChoiceTerm a").eq("0").addClass("on");

        //검색조건 더보기 hide
        $(".search_cate").hide();

        $("#Edoc_SearchN_Wrap").hide();
        $("#Edoc_SearchW_Wrap").show();
    }
});

//1주 , 2주 , 1개월 , 3개월 버튼 색깔 변경하기
$(document).on("click", "#S_Edoc_ChoiceTerm a", function () {

    $("#S_Edoc_ChoiceTerm a").removeClass("on");
    $(this).addClass("on");

});


//1주전 , 2주전 , 한달전 , 3달전 버튼 이벤트
$(document).on("click", "#S_Edoc_ChoiceTerm a", function () {

    //오늘 날짜 셋팅
    $("#S_Edoc_LastDate").val(new Date().getFullYear() + "-" + _pad(new String(new Date().getMonth() + 1), 2) + "-" + _pad(new String(new Date().getDate()), 2));

    //선택된 날짜 셋팅
    $("#S_Edoc_FristDate").val(fnSetWeekDate($(this).attr("name")));

});

//전송상태 - 전체 클릭 이벤트 (전체 외 다른 체크박스 있을 경우 false)
$(document).on("click","#S_Edoc_Chk_All", function () {

    //전체를 선택 했을 때 전체 외 다른 전송상태 checked 다 풀기
    if ($(this).prop("checked") == true) {        
        $("input[name='S_Edoc_Chk_State']").prop("checked", false);
    }
});

//전송상태 - 전체 외 다른 체크박스 이벤트
$(document).on("click", "input[name='S_Edoc_Chk_State']", function () {

    //전체 외 하나라도 체크박스가 true인 경우 전체 체크박스는 false
    if ($(this).prop("checked") == true) { //현재 클릭 된 것이 checked인 경우 전체 체크 삭제
        if ($("#S_Edoc_Chk_All").prop("checked") == true) {
            $("#S_Edoc_Chk_All").prop("checked", false);
        }
    }
});

//체크박스 전체 선택 이벤트
$(document).on("click", "#Result_ChkAll", function () {

    //전체 선택 버튼이 클릭 시 
    if ($(this).prop("checked") == true) {
        $("input[name='Result_Chk']").prop("checked", true);
    } else if ($(this).prop("checked") == false) {
        $("input[name='Result_Chk']").prop("checked", false);
    }

});

//번호기준 Serach 버튼 이벤트
$(document).on("click", "#N_Edoc_Search", function () {
    _vPage = 0;
    _vTotalPage = 0;
    fnN_SearchList();
});

//담당자 Search 버튼 이벤트
$(document).on("click", "#S_Edoc_Search", function () {
    _vPage = 0;
    _vTotalPage = 0;
    fnS_SearchList();
});

//더보기 버튼 클릭
$(document).on("click", "#Edoc_MoreBtn", function () {
    _vPage++;    
    if ($("#hidden_SearchType").val() == "N") {
        fnN_SearchList(); //검색 function 
    }
    else if ($("#hidden_SearchType").val() == "S") {
        fnS_SearchList(); //검색 function 
    }
    else if ($("#hidden_SearchType").val() == "E") {
        fnN_SearchList();
        //이메일로 들어왔을 때
    }
    else {
        $("#hidden_SearchType").val("E");
        fnN_SearchList();
    }
});

//상세내역 - 세금계산서
$(document).on("click", ".bill_popup", function () {        
    fnTaxSearchData($(this).parent().find("input[type=hidden]").val()); //세금계산서 레이어팝업 검색 함수
});

//상세내역 - 입금표
$(document).on("click", ".bill_popup2", function () {
    fnCreditSearchData($(this).parent().find("input[type=hidden]").val());
});

////////////////////////function///////////////////////
//1주전 , 2주전 , 한달전 , 3달전 날짜 가져오는 로직
function fnSetWeekDate(vDate) {
    var vPrevDate;
    var vNowDate = new Date().getFullYear() + "-" + _pad(new Date().getMonth() + 1, 2) + "-"+ + _pad(new Date().getDate(), 2);    

    var d = new Date();
    var dayOfMonth = d.getDate();
    var monthOfYear = d.getMonth();

    if (vDate == "1week") {
        d.setDate(dayOfMonth - 7);
        vPrevDate = d.getFullYear() + "-" + _pad(d.getMonth() + 1, 2) + "-" + _pad(d.getDate(), 2);
    }
    else if (vDate == "2week") {
        d.setDate(dayOfMonth - 14);
        vPrevDate = d.getFullYear() + "-" + _pad(d.getMonth() + 1, 2) + "-" + _pad(d.getDate(), 2);
    }
    else if (vDate == "1month") {
        d.setMonth(monthOfYear - 1);
        vPrevDate = d.getFullYear() + "-" + _pad(d.getMonth() + 1, 2) + "-" + _pad(d.getDate(), 2);
    }
    else if (vDate == "3month") {
        d.setMonth(monthOfYear - 3);
        vPrevDate = d.getFullYear() + "-" + _pad(d.getMonth() + 1, 2) + "-" + _pad(d.getDate(), 2);
    }

    return vPrevDate;
}

//번호기준 검색 조회
function fnN_SearchList()
{
    try {
        //번호기준 벨리데이션 체크
        if (fnN_Validation()) {
            var objJsonData = new Object();

            objJsonData.CRN_NO = $("#N_Edoc_CRN_NO").val(); //사업자번호
            objJsonData.N_VALUE = $("#N_Edoc_Value").val(); //B/L No or Invoice No or 계산서번호
            objJsonData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)
            objJsonData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)

            _objExcelData.CRN_NO = $("#N_Edoc_CRN_NO").val(); //사업자번호
            _objExcelData.N_VALUE = $("#N_Edoc_Value").val(); //B/L No or Invoice No or 계산서번호
            _objExcelData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)
            _objExcelData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)

            if (_vPage == 0) {
                _vPage = 1;
                objJsonData.PAGE = 1;                                
            }
            else {
                objJsonData.PAGE = _vPage;
            }

            _vTotalPage = 10 * _vPage;

            $.ajax({
                type: "POST",
                url: "/Edoc/fnSearchList",
                async: true,
                dataType: "json",
                //data: callObj,
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result == null) {
                        alert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                    } else {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                            fnMakeEdocList(result);
                            fnMakeEdocListTotal(result);
                        }
                        else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                            fnMakeEdocList(result);
                            fnMakeEdocListTotal(result);
                        }
                    }
                },
                error: function (xhr, status, error) {
                    if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("담당자에게 문의 하세요.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                    }
                }
            });
        }
        
    } catch (e) {
        console.log(e.message);
    }
}

//담당자 검색 조회
function fnS_SearchList()
{
    try {

        //담당자 검색 벨리데이션 체크 
        if (fnS_Validation()) {
            var objJsonData = new Object();

            objJsonData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)
            objJsonData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)        
            objJsonData.CRN_NO = $("#S_Edoc_CRN_NO").val(); //사업자 번호
            objJsonData.EMAIL = $("#S_Edoc_Email").val(); //담당자 E-mail
            
            //select 작성일자 / 발행일자
            if ($("#S_Edoc_Select option:selected").val() == "W") {
                objJsonData.SelectDate = "W";
                _objExcelData.SelectDate = "W"
            }
            else if ($("#S_Edoc_Select option:selected").val() == "I") {
                objJsonData.SelectDate = "I";
                _objExcelData.SelectDate = "I"
            }
            
            objJsonData.S_Date = $("#S_Edoc_FristDate").val().replace(/-/gi, ""); //Start 날짜
            objJsonData.E_Date = $("#S_Edoc_LastDate").val().replace(/-/gi, ""); //End 날짜
            
            //문서종류 DOC_TYPE
            objJsonData.ChkBill = $("#S_Edoc_Chk_Bill").prop("checked") ? "true" : ""; //세금계산서
            objJsonData.ChkCredit = $("#S_Edoc_Chk_Credit").prop("checked") ? "true" : ""; //입금표
            
            //★옵션
            objJsonData.Supplier = _fnToNull($("#S_Edoc_Supplier").val());  //공급하는자 
            objJsonData.BillNo = _fnToNull($("#S_Edoc_BillNo").val());      //계산서 번호
            objJsonData.BLNO = _fnToNull($("#S_Edoc_BLNO").val());          //B/L NO
            
            //전송상태
            if ($("#S_Edoc_Chk_All").prop("checked")) {
                objJsonData.ChkState = "";
                _objExcelData.ChkState = "";
            } else {
                var vChkValue = "";
            
                //체크박스에 체크되어있는 값만 가져온다.
                $("input[name='S_Edoc_Chk_State']:checked").each(function () {
                    if (vChkValue == "") {
                        vChkValue += "'" + $(this).val() + "'";
                    } else {
                        vChkValue += ",'" + $(this).val() + "'";
                    }
                });
            
                objJsonData.ChkState = vChkValue;
                _objExcelData.ChkState = vChkValue;
            }

            //엑셀을 위한 데이터
            _objExcelData.CRN_NO = $("#S_Edoc_CRN_NO").val(); //사업자 번호
            _objExcelData.EMAIL = $("#S_Edoc_Email").val(); //담당자 E-mail
            _objExcelData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)
            _objExcelData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)           
            _objExcelData.S_Date = $("#S_Edoc_FristDate").val().replace(/-/gi, ""); //Start 날짜
            _objExcelData.E_Date = $("#S_Edoc_LastDate").val().replace(/-/gi, ""); //End 날짜
            _objExcelData.ChkBill = $("#S_Edoc_Chk_Bill").prop("checked") ? "true" : ""; //세금계산서
            _objExcelData.ChkCredit = $("#S_Edoc_Chk_Credit").prop("checked") ? "true" : ""; //입금표
            _objExcelData.Supplier = _fnToNull($("#S_Edoc_Supplier").val());  //공급하는자 
            _objExcelData.BillNo = _fnToNull($("#S_Edoc_BillNo").val());      //계산서 번호
            _objExcelData.BLNO = _fnToNull($("#S_Edoc_BLNO").val());          //B/L NO

            //더보기 처리
            if (_vPage == 0) {
                _vPage = 1;
                objJsonData.PAGE = 1;
            }
            else {
                objJsonData.PAGE = _vPage;
            }

            _vTotalPage = 10 * _vPage;

            $.ajax({
                type: "POST",
                url: "/Edoc/fnSearchList",
                async: true,
                dataType: "json",
                //data: callObj,
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result == null) {
                        alert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                    } else {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                            fnMakeEdocList(result);
                            fnMakeEdocListTotal(result);
                        }
                        else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                            alert("조회 결과가 없습니다.");
                        }
                    }
                },
                error: function (xhr, status, error) {
                    if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("담당자에게 문의 하세요.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                    }
                }
            });
        }
        
    } catch (e) {
        console.log(e.message);
    }
}

//번호기준 벨리데이션 체크 
function fnN_Validation() {

    //사업자 번호
    if (_fnToNull($("#N_Edoc_CRN_NO").val()) == "") {
        alert("사업자 번호를 입력 해 주세요.");
        $("#N_Edoc_CRN_NO").focus();
        return false;
    }

    //찾을번호
    if (_fnToNull($("#N_Edoc_Value").val()) == "") {
        alert("B/L No or Invoice No or 계산서번호를 입력하세요.");
        $("#N_Edoc_Value").focus();
        return false;
    }

    return true;
}

//담당자 벨리데이션 체크 
function fnS_Validation() {

    //사업자번호
    if (_fnToNull($("#S_Edoc_CRN_NO").val()) == "") {
        alert("사업자 번호를 입력 해 주세요.");
        $("#S_Edoc_CRN_NO").focus();
        return false;
    }

    //담당자 E-mail
    if (_fnToNull($("#S_Edoc_Email").val()) == "") {
        alert("이메일을 입력 해 주세요.");
        $("#S_Edoc_Email").focus();
        return false;
    }

    //이전 날짜
    if (_fnToNull($("#S_Edoc_FristDate").val()) == "") {
        alert("날짜를 입력 해 주세요.");
        $("#S_Edoc_FristDate").focus();
        return false;
    }

    //현재 날짜
    if (_fnToNull($("#S_Edoc_LastDate").val()) == "") {
        alert("날짜를 입력 해 주세요.");
        $("#S_Edoc_LastDate").focus();
        return false;
    }

    //문서종류 - (세금)계산서 , 입금표 체크박스
    if ($("#S_Edoc_Chk_Bill").prop("chekced") || $("#S_Edoc_Chk_Credit").prop("chekced")) {
        alert("문서종류 세금계산서 , 입금표 중 1개 이상 체크 해주세요.");
        return false;
    }

    return true;
}

//세금계산서 레이어팝업 데이터 조회
function fnTaxSearchData(vTAX_DOC_NO) {

    try {
        var objJsonData = new Object();

        objJsonData.TAX_DOC_NO = vTAX_DOC_NO;
        if (vTAX_DOC_NO != "") {
            _vTAX_DOC_NO = vTAX_DOC_NO
        }

        $.ajax({
            type: "POST",
            url: "/Edoc/fnGetTaxSearchData",
            async: true, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    alert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                        //레이어 팝업 초기화 함수
                        fnMakeTaxLayerInit();
                        //레이어 팝업 데이터 찍어주는 함수
                        fnMakeTaxLayerData(result);
                        //레이어 팝업 찍어주기.
                        $(".layerPopup_bg").show();
                        $(".layerPopup_bill").show();
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("데이터가 없습니다.");
                    }
                }
            },
            error: function (xhr, status, error) {
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("담당자에게 문의 하세요.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        });
    }
    catch (e) {
        console.log(e.message);
    }
    
}

//입금표 레이어팝업 데이터 조회
function fnCreditSearchData(vCRD_DOC_NO) {
    try {
        var objJsonData = new Object();

        objJsonData.CRD_DOC_NO = vCRD_DOC_NO;
        if (vCRD_DOC_NO != "") {
            _vCRD_DOC_NO = vCRD_DOC_NO
        }

        $.ajax({
            type: "POST",
            url: "/Edoc/fnGetCreditSearchData",
            async: true, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    alert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        //alert("성공");
                        //레이어 팝업 초기화 함수
                        fnMakeCreditLayerInit();
                        //레이어 팝업 데이터 찍어주는 함수
                        fnMakeCreditLayerData(result);
                        //레이어 팝업 찍어주기.
                        $(".layerPopup_bg").show();
                        $(".layerPopup_bill2").show();
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("데이터가 없습니다.");
                    }
                }
            },
            error: function (xhr, status, error) {
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("담당자에게 문의 하세요.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        });
    }
    catch (e) {
        console.log(e.message);
    }
}

//XML 다운로드
function fnXMLDownload(vXMLPath) {
    window.location.href = _HomeUrl+"/File/DownloadXML?FILE_PATH=" + vPath;
}

//파일 다운로드 로직 
function fnFileDownload(vFile, vPath, vREPLACE_FILE_NM) {
    //vFile                 파일 이름
    //vPath                 파일 경로
    //vREPLACE_FILE_NM      변경된 파일 이름    
    window.location.href = _HomeUrl +"/File/DownloadFile?FILE_NM=" + vFile + "&FILE_PATH=" + vPath + "&REPLACE_FILE_NM=" + vREPLACE_FILE_NM;

}

//파일 전체 다운로드 로직
function fnAllFilesDownload() {
    
}

//엑셀 다운로드 로직
function fnExcelDownload() {
    try {

        $.ajax({
            type: "POST",
            url: "/Excel/DownloadExcel",
            async: true, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(_objExcelData) },
            success: function (result) {
                if (result == null) {
                    alert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        //alert("성공");
                        ////파일 다운로드 GET 방식
                        window.location = _HomeUrl + "/Excel/Down_ExcelFile?strEXCEL_FILENM=" + JSON.parse(result).FILE_UPLOAD[0]["EXCEL_FILENM"] + "&strEXCEL_PATH=" + JSON.parse(result).FILE_UPLOAD[0]["EXCEL_PATH"];

                        ////다운로드 받는 딜레이를 주지 않으면 다운 받는 도중에 삭제 되서 오류 남. (추후 엑셀 파일 지우는건 배치파일로 지우는것도 고려 해 봐야 됨.)
                        _fnsleep(5000);

                        ////파일 delete 로직
                        //fnDelExcelFile(result);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("데이터가 없습니다.");
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("[Error]관리자에게 문의 해 주세요.");
                        console.log(result);
                    }
                }
            },
            error: function (xhr, status, error) {
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("담당자에게 문의 하세요.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        });
    }
    catch (e) {
        console.log(e.message);
    }
}

//엑셀파일 지우기
function fnDelExcelFile(result) {

    try {
        var objDeleteFile = new Object();
        objDeleteFile.EXCEL_FILENM = JSON.parse(result).FILE_UPLOAD[0]["EXCEL_FILENM"];
        objDeleteFile.EXCEL_PATH = JSON.parse(result).FILE_UPLOAD[0]["EXCEL_PATH"];

        $.ajax({
            type: "POST",
            url: "/Excel/Del_ExcelFile",
            async: false,
            data: { "vJsonData": _fnMakeJson(objDeleteFile) }
        });
    }
    catch (e) {
        console.log(e.message);
    }
}


//단일 국세청 승인 
function fnSetTaxApproval(vValue) {

    try {
        var objJsonData = new Object();

        if (_fnToNull(vValue) == "") {
            objJsonData.TAX_DOC_NO = _vTAX_DOC_NO;
        } else {
            objJsonData.TAX_DOC_NO = vValue;
        }

        $.ajax({
            type: "POST",
            url: "/Edoc/fnSetTaxApproval",
            async: true, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    alert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        alert("승인이 되었습니다.");
                        fnPageRefresh();
                        $(".layerPopup_bg").hide();
                        $(".layerPopup_bill").hide();
                        $(".layerPopup_bill2").hide();
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("문서 상태가 변경되었습니다. 재 조회 합니다.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        fnPageRefresh();
                        $(".layerPopup_bg").hide();
                        $(".layerPopup_bill").hide();
                        $(".layerPopup_bill2").hide();
                    }
                }
            },
            error: function (xhr, status, error) {
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("담당자에게 문의 하세요.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        });
    } catch (e) {
        console.log(e.message);
    }
}

//일괄 국세청 승인 (체크 된 것만 승인)
function fnSetCheckTaxApproval() {
    try {
        var objJsonData = new Object();

        var vValue = "";
        var isCheckCredit = true;

        $("input[name='Result_Chk']").each(function () {
            if ($(this).is(":checked") == true) {
                if ($(this).parent().find("input[type='hidden']").val() != "SO") {                    
                    $(this).prop("checked", false);
                    isCheckCredit = false;
                } else {
                    if (_fnToNull(vValue) == "") {
                        vValue = $(this).val();
                    } else {
                        vValue += ","+$(this).val();
                    }
                }
            }
        });
        //입금표 체크 확인
        if (isCheckCredit == false) {
            alert("문서 접수의 건만 승인 할 수 있습니다.");
            return;
        } else if (_fnToNull(vValue) == "") {
            alert("세금계산서를 선택 해 주세요.");
            return;
        }

        objJsonData.TAX_DOC_NO = vValue;

        $.ajax({
            type: "POST",
            url: "/Edoc/fnSetAllTaxApproval",
            async: true, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    alert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        fnPageRefresh();
                        alert("일괄 승인이 완료 되었습니다.");
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("문서 상태가 변경되었습니다. 재 조회 합니다.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        fnPageRefresh();
                    }
                }
            },
            error: function (xhr, status, error) {
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("담당자에게 문의 하세요.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        });
    } catch (e) {
        console.log(e.message);
    }
}

//단일 국세청 거절
function fnSetTaxRefuse(vValue) {

    try {
        var objJsonData = new Object();

        if (_fnToNull(vValue) == "") {
            objJsonData.TAX_DOC_NO = _vTAX_DOC_NO;
        } else {
            objJsonData.TAX_DOC_NO = vValue;
        }

        objJsonData.REFUND_REASON = _fnToNull($("input[name='EdocLayer_InputReject']").val());

        $.ajax({
            type: "POST",
            url: "/Edoc/fnSetTaxRefuse",
            async: true, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    alert("담당자에게 문의 해 주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        alert("거절이 되었습니다.");
                        fnPageRefresh();
                        $(".layerPopup_bg").hide();
                        $(".layerPopup_bill").hide();
                        $(".layerPopup_bill2").hide();
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("문서 상태가 변경되었습니다. 재 조회 합니다.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        fnPageRefresh();
                        $(".layerPopup_bg").hide();
                        $(".layerPopup_bill").hide();
                        $(".layerPopup_bill2").hide();
                    }
                }
            },
            error: function (xhr, status, error) {
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("담당자에게 문의 하세요.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        });
    } catch (e) {
        console.log(e.message);
    }
}

//국세청 승인 및 거절 후 refresh
function fnPageRefresh() {

    try {

        var objJsonData = new Object();

        objJsonData.PAGE = 1;
        objJsonData.TOTAL = _vTotalPage;

        // 번호기준(N) / 담당자(S) / 이메일(E)
        if ($("#hidden_SearchType").val() == "N") {
            objJsonData.CRN_NO = $("#N_Edoc_CRN_NO").val(); //사업자번호
            objJsonData.N_VALUE = $("#N_Edoc_Value").val(); //B/L No or Invoice No or 계산서번호
            objJsonData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)
            objJsonData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)
        }
        else if ($("#hidden_SearchType").val() == "S") {
            objJsonData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)
            objJsonData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)        
            objJsonData.CRN_NO = $("#S_Edoc_CRN_NO").val(); //사업자 번호
            objJsonData.EMAIL = $("#S_Edoc_Email").val(); //담당자 E-mail

            //select 작성일자 / 발행일자
            if ($("#S_Edoc_Select option:selected").val() == "W") {
                objJsonData.SelectDate = "W";
            }
            else if ($("#S_Edoc_Select option:selected").val() == "I") {
                objJsonData.SelectDate = "I";
            }

            objJsonData.S_Date = $("#S_Edoc_FristDate").val().replace(/-/gi, ""); //Start 날짜
            objJsonData.E_Date = $("#S_Edoc_LastDate").val().replace(/-/gi, ""); //End 날짜

            //문서종류 DOC_TYPE
            objJsonData.ChkBill = $("#S_Edoc_Chk_Bill").prop("checked") ? "true" : ""; //세금계산서
            objJsonData.ChkCredit = $("#S_Edoc_Chk_Credit").prop("checked") ? "true" : ""; //입금표

            //★옵션
            objJsonData.Supplier = _fnToNull($("#S_Edoc_Supplier").val());  //공급하는자 
            objJsonData.BillNo = _fnToNull($("#S_Edoc_BillNo").val());      //계산서 번호
            objJsonData.BLNO = _fnToNull($("#S_Edoc_BLNO").val());          //B/L NO

            //전송상태
            if ($("#S_Edoc_Chk_All").prop("checked")) {
                objJsonData.ChkState = "";
            } else {
                var vChkValue = "";

                //체크박스에 체크되어있는 값만 가져온다.
                $("input[name='S_Edoc_Chk_State']:checked").each(function () {
                    if (vChkValue == "") {
                        vChkValue += "'" + $(this).val() + "'";
                    } else {
                        vChkValue += ",'" + $(this).val() + "'";
                    }
                });

                objJsonData.ChkState = vChkValue;
            }
        }
        else if ($("#hidden_SearchType").val() == "E") {
            objJsonData.CRN_NO = $("#N_Edoc_CRN_NO").val(); //사업자번호
            objJsonData.N_VALUE = $("#N_Edoc_Value").val(); //B/L No or Invoice No or 계산서번호
            objJsonData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)
            objJsonData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)
        }

        $.ajax({
            type: "POST",
            url: "/Edoc/fnPageRefresh",
            async: true, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    alert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        $("#Edoc_List").empty();
                        fnMakeEdocList(result);
                        fnMakeEdocListTotal(result);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("조회 결과가 없습니다.");
                    }
                }
            },
            error: function (xhr, status, error) {
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("담당자에게 문의 하세요.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                }
            }
        });

    } catch (e) {
        console.log(e.message);
    }

}

//준비 중 입니다. alert9) - 나중에는 지워야 됨
function fnPrePare() {
    alert("준비 중 입니다.");
}

//layerPopup_bill , layerPopup_bill2
function fnLayerClose(vLayerNM) {
    $(".layerPopup_bg").hide();
    $("." + vLayerNM).hide();
}



/////////////////function MakeList/////////////////////
//Edoc 리스트 그려주는 로직
function fnMakeEdocList(vJsonData) {

    try {

        var vHTML = "";
        var vResult = JSON.parse(vJsonData).List;
        var isCheck = true;

        //첫번째 그려지는 경우 list 초기화
        if (_vPage == 1) {
            $("#Edoc_List").empty();
        }

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N")
        {
            vHTML += "<li class=\"noData\">데이터가 없습니다.</li>";

            $("#Edoc_ListCount").text("0");

            isCheck = false;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y")
        {
            $.each(vResult, function (i) {
                vHTML += "   <li> ";
                vHTML += "   	<ul class=\"bill_list_ul2\"> ";
                vHTML += "   		<li class=\"li1\"><input type=\"checkbox\" name=\"Result_Chk\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\"><input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["LAST_DOC_STATUS"]) + "\" /></li> ";
                vHTML += "   		<li class=\"li2\"> ";
                vHTML += "   			<span class=\"block\"><span class=\"partTitle\">문서종류</span> : " + _fnToNull(vResult[i]["DOC_TYPE_NM"]) + "</span> ";

                //전송상태 색깔 변경
                if (_fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "SO" || _fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "NA") {
                    vHTML += "   			<span class=\"block\"><span class=\"partTitle\">전송상태</span> : <span class=\"stateReg\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM"]) + "</span></span> ";
                }
                else if (_fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "BS" || _fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "NS") {
                    vHTML += "   			<span class=\"block\"><span class=\"partTitle\">전송상태</span> : <span class=\"stateOk\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM"]) + "</span></span> ";
                }
                else if (_fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "BR" || _fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "LF" || _fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "NE") {
                    vHTML += "   			<span class=\"block\"><span class=\"partTitle\">전송상태</span> : <span class=\"stateCancel\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM"]) + "</span></span> ";
                }
                else {
                    vHTML += "   			<span class=\"block\"><span class=\"partTitle\">전송상태</span> : <span class=\"stateCancel\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM"]) + "</span></span> ";
                }

                //계산서 or 입금서 체크
                if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {
                    vHTML += "   			<span class=\"block block01\"><span class=\"partTitle\">계산서번호</span> : " + _fnToNull(vResult[i]["TAX_MGMT_NO"]) + "</span> ";
                }
                else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {
                    vHTML += "   			<span class=\"block block01\"><span class=\"partTitle\">입금표번호</span> : " + _fnToNull(vResult[i]["TAX_MGMT_NO"]) + "</span> ";
                }
                                                
                vHTML += "   			<span class=\"block block02\"><span class=\"partTitle\">구분</span> : " + _fnToNull(vResult[i]["DOC_DIV"]) + "  </span> ";

                vHTML += "   			<span class=\"block\"><span class=\"partTitle\">작성일자</span> : " + _fnFormatDate(_fnToNull(vResult[i]["WRITE_DT"])) + " </span> ";
                vHTML += "   			<span class=\"block\"><span class=\"partTitle\">발행일자</span> : " + _fnFormatDate(_fnToNull(vResult[i]["ISU_DATE"])) + " </span> ";
                vHTML += "   			<span class=\"block\"><span class=\"partTitle\">공급하는자</span> : " + _fnToNull(vResult[i]["DMDER_TRADE_NM"]) + " </span> ";
                vHTML += "   			<span class=\"block\"><span class=\"partTitle\">B/L No</span> : " + _fnToNull(vResult[i]["BL_NO"]) + "  </span> ";

                if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T")
                {
                    vHTML += "   			<span class=\"block  block03\">공급가액 : " + fnSetComma(_fnToNull(vResult[i]["SUP_SM_AMT"])) + " </span> ";
                    vHTML += "   			<span class=\"block  block03\">부가세액 : " + fnSetComma(_fnToNull(vResult[i]["VAT_SM_AMT"])) + "  </span> ";
                    vHTML += "   			<span class=\"block  block03\">합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + " </span> ";
                }
                else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R")
                {
                    vHTML += "   			<span class=\"block  block03\">합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + " </span> ";
                }

                vHTML += "   		</li> ";
                vHTML += "   		<li class=\"li3\"> ";
                vHTML += "   			<ul class=\"bill_list_ul3\"> ";

                if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {
                    //LAST_DOC_STATUS = 'SO'   - 거절,승인,상세내역
                    if (_fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "SO") {
                        //레이어 팝업 분기점 bill_popup : 세금계산서 레이어 팝업 / bill_popup2 : 입금표
                        if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {
                            vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup\"><span>상세내역</span></a>";
                            vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                            vHTML += " </li> ";
                        } else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {
                            vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup2\"><span>상세내역</span></a>";
                            vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                            vHTML += "</li > ";
                        }

                        vHTML += " <li><a href=\"javascript:void(0)\" class=\"cancel\" onclick=\"fnSetTaxRefuse('" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "')\"><span>거절</span></a></li> ";
                        vHTML += " <li><a href=\"javascript:void(0)\" class=\"ok\" onclick=\"fnSetTaxApproval('" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "')\" ><span>승인</span></a></li> ";
                    }
                    // LAST_DOC_STATUS = 'NS'   - 인쇄 , 상세내역
                    else if (_fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "NS") {
                        //레이어 팝업 분기점 bill_popup : 세금계산서 레이어 팝업 / bill_popup2 : 입금표
                        if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {
                            vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup\"><span>상세내역</span></a>";
                            vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                            vHTML += "</li > ";
                        } else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {
                            vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup2\"><span>상세내역</span></a> ";
                            vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                            vHTML += "</li > ";
                        }
                        //vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"print\"><span>인쇄</span></a></li> ";
                    }
                    //ELSE - 상세내역
                    else {
                        vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup\"><span>상세내역</span></a>";
                        vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                        vHTML += "</li > ";
                    }                    
                } else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {
                    vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup2\"><span>상세내역</span></a>";
                    vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                    vHTML += "</li > ";
                    //vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"print\"><span>인쇄</span></a></li> ";
                }

                vHTML += "   			</ul> ";
                vHTML += "   		</li> ";
                vHTML += "   	</ul> ";
                vHTML += "   </li> ";


                //페이징 전체 개수일 때 더보기 버튼 사라지게 하기
                if (_fnToNull(vResult[i]["RNUM"]) == _fnToNull(vResult[i]["TOTCNT"])) {
                    isCheck = false;
                }
            });

            //검색 결과 총 카운트
            $("#Edoc_ListCount").text(_fnToNull(vResult[0]["TOTCNT"]));
        }

        $("#Edoc_List").append(vHTML);

        //더보기 버튼 클릭
        if (isCheck) {            
            $(".btn_more_bill").remove(); //초기화
            var vMoreHTML = "<a href=\"javascript:void(0)\" class=\"btn_more_bill\" id=\"Edoc_MoreBtn\">더 보기</a>";
            $("#Edoc_ListArea").after(vMoreHTML);
        } else {
            $(".btn_more_bill").remove();
        }

    }
    catch (e) {        
        console.log(e.message);
    }
}

//Edoc 리스트 아래 Total 합계금액 그려주는 로직
function fnMakeEdocListTotal(vJsonData) {
    try {

        var vHTML = "";
        var vResult = JSON.parse(vJsonData).Total;

        //데이터가 없을 경우
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            $.each(vResult, function (i) {
                if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {                    
                        vHTML += "   <tr> ";                        
                        vHTML += "   	<td rowspan=\"2\">합계</td> ";
                        vHTML += "   	<td>세금계산서</td> ";
                        vHTML += "   	<td> ";
                        vHTML += "   		<ul> ";
                        vHTML += "   			<li>총합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + "</li> ";
                        vHTML += "   			<li>부가세액 : " + fnSetComma(_fnToNull(vResult[i]["VAT_SM_AMT"])) + "</li> ";
                        vHTML += "   			<li>공급가액 : " + fnSetComma(_fnToNull(vResult[i]["SUP_SM_AMT"])) + "</li> ";
                        vHTML += "   		</ul> ";
                        vHTML += "   	</td> ";
                        vHTML += "   </tr> ";                    
                }
                else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {                    
                    vHTML += "   <tr> ";
                    vHTML += "   	<td>입금표</td> ";
                    vHTML += "   	<td class=\"tar\"> ";
                    vHTML += "   		<ul> ";
                    vHTML += "   			<li>총합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + "</li> ";
                    vHTML += "   		</ul> ";
                    vHTML += "   	</td> ";
                    vHTML += "   </tr> ";                    
                }
            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            $.each(vResult, function (i) {

                if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T")
                {
                    //Total 데이터가 없을 경우에는 찍어주지 않는다.
                    if (_fnToNull(vResult[i]["TOT_AMT"]) != "") {
                        vHTML += "   <tr> ";
                        if (_fnToNull(vResult[0]["TOT_AMT"]) != "0" && _fnToNull(vResult[1]["TOT_AMT"]) != "0") {
                            vHTML += "   	<td rowspan=\"2\">합계</td> ";
                        } else if (_fnToNull(vResult[0]["TOT_AMT"]) != "0" || _fnToNull(vResult[1]["TOT_AMT"]) != "0"){
                            vHTML += "   	<td>합계</td> ";
                        }                        

                        vHTML += "   	<td>세금계산서</td> ";
                        vHTML += "   	<td> ";
                        vHTML += "   		<ul> ";
                        vHTML += "   			<li>총합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + "</li> ";
                        vHTML += "   			<li>부가세액 : " + fnSetComma(_fnToNull(vResult[i]["VAT_SM_AMT"])) + "</li> ";
                        vHTML += "   			<li>공급가액 : " + fnSetComma(_fnToNull(vResult[i]["SUP_SM_AMT"])) + "</li> ";
                        vHTML += "   		</ul> ";
                        vHTML += "   	</td> ";
                        vHTML += "   </tr> ";
                    }
                }
                else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R")
                {
                    //데이터가 없을 경우도 있다.
                    if (_fnToNull(vResult[i]["TOT_AMT"]) != "") {
                        vHTML += "   <tr> ";
                        vHTML += "   	<td>입금표</td> ";
                        vHTML += "   	<td class=\"tar\"> ";
                        vHTML += "   		<ul> ";
                        vHTML += "   			<li>총합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + "</li> ";
                        vHTML += "   		</ul> ";
                        vHTML += "   	</td> ";
                        vHTML += "   </tr> ";
                    }
                }
            });
        }

        //innerHTML
        $("#Edoc_TotatArea")[0].innerHTML = vHTML;

    }
    catch (e) {
        console.log(e.message);
    }
}

//세금계산서 레이어팝업 데이터 초기화
function fnMakeTaxLayerInit() {
    //세금계산서 Header init 
    $("span[name='EdocLayer_Title']").text("");
    $("input[name='EdocLayer_ChkNormalBill']").prop("checked",false);
    $("input[name='EdocLayer_ChkModifyBill']").prop("checked",false);
    $("input[name='EdocLayer_ChkAgency']").prop("checked", false);
    $("input[name='EdocLayer_ChkGwase']").prop("checked", false);
    $("input[name='EdocLayer_ChkYeongse']").prop("checked", false);
    $("input[name='EdocLayer_ChkMyeonse']").prop("checked", false);
    $("td[name='EdocLayer_EdocNo']").text("");
    $("td[name='EdocLayer_BillNo']").text("");

    //공급하는자 init
    $("td[name='EdocLayer_Supplier_RegNo']").text("");
    $("td[name='EdocLayer_Supplier_Name']").text("");
    $("td[name='EdocLayer_Supplier_Compeny']").text("");
    $("td[name='EdocLayer_Supplier_Address']").text("");
    $("td[name='EdocLayer_Supplier_Eobtae']").text("");
    $("td[name='EdocLayer_Supplier_Eobjong']").text("");
    $("td[name='EdocLayer_Supplier_Manager']").text("");
    $("td[name='EdocLayer_Supplier_Part']").text("");
    $("td[name='EdocLayer_Supplier_Tel']").text("");
    $("td[name='EdocLayer_Supplier_Phone']").text("");
    $("td[name='EdocLayer_Supplier_Email']").text("");
    $("td[name='EdocLayer_Supplier_Workplace']").text("");

    //공급받는자 init
    $("td[name='EdocLayer_Consumer_RegNo']").text("");
    $("td[name='EdocLayer_Consumer_Name']").text("");
    $("td[name='EdocLayer_Consumer_Compeny']").text("");
    $("td[name='EdocLayer_Consumer_Address']").text("");
    $("td[name='EdocLayer_Consumer_Eobtae']").text("");
    $("td[name='EdocLayer_Consumer_Eobjong']").text("");
    $("td[name='EdocLayer_Consumer_Manager']").text("");
    $("td[name='EdocLayer_Consumer_Part']").text("");
    $("td[name='EdocLayer_Consumer_Tel']").text("");
    $("td[name='EdocLayer_Consumer_Phone']").text("");
    $("td[name='EdocLayer_Consumer_Email']").text("");
    $("td[name='EdocLayer_Consumer_Workplace']").text("");

    //내역 리스트 초기화 추가 해야됨

    //세금계산서 내용 / 문서상태 , 거절사유 
    $("td[name='EdocLayer_WriteDate']").text("");
    $("td[name='EdocLayer_SUP_AMT']").text("");
    $("td[name='EdocLayer_VAT_AMT']").text("");
    $("td[name='EdocLayer_BLNO']").text("");
    $("td[name='EdocLayer_WF_AMT']").text("");
    $("td[name='EdocLayer_TOT_AMT']").text("");
    $("td[name='EdocLayer_ETC']").text("");
    $("td[name='EdocLayer_Doc']").text("");
    $("ul[name='EdocLayer_Attach']").empty();
    //("td[name='EdocLayer_AllAttach']").text("");
    $("td[name='EdocLayer_DocType']").text("");
    $("td[name='EdocLayer_Rejection']").text(""); 
}

//입금표 레이어 팝업 데이터 초기화
function fnMakeCreditLayerInit() {

    $("td[name='EdocLayer2_CreditNo']").text("");               //입금표번호
    $("td[name='EdocLayer2_DocType']").text("");                //문서구분
                                                                
    $("td[name='EdocLayer2_Supplier_RegNo']").text("");         //등록번호
    $("td[name='EdocLayer2_Supplier_Name']").text("");          //성명
    $("td[name='EdocLayer2_Supplier_Compeny']").text("");       //상호
                                                                
    $("td[name='EdocLayer2_Consumer_RegNo']").text("");         //등록번호
    $("td[name='EdocLayer2_Consumer_Name']").text("");          //성명
    $("td[name='EdocLayer2_Consumer_Compeny']").text("");       //상호
                                                                
    $("td[name='EdocLayer2_DaeRiJum_RegNo']").text("");         //등록번호
    $("td[name='EdocLayer2_DaeRiJum_Name']").text("");          //성명
    $("td[name='EdocLayer2_DaeRiJum_Compeny']").text("");       //상호
    $("td[name='EdocLayer2_DaeRiJum_Address']").text("");       //주소
    $("td[name='EdocLayer2_DaeRiJum_WriteDate']").text("");     //작성일자
    $("td[name='EdocLayer2_DaeRiJum_Total']").text("");         //합계
    $("td[name='EdocLayer2_DaeRiJum_SunMung_BL']").text("");    //선명 & BL
}

//세금계산서 레이어 팝업 데이터 그려주는 로직
function fnMakeTaxLayerData(vJsonData) {

    try {

        var vHTML = "";
        var vResult = JSON.parse(vJsonData).Data; 

        //데이터를 먼저 뿌리기. //Data
        //List 만들어서 뿌리기  //List
        //Doc문서 확인          //Doc
        //첨부파일 그리기       //Attach
        ///////////////////////////////////////////////////////////////////Data/////////////////////////////////////////////////////////////////////////////////////

        //세금계산서 계산서 이름 
        if (_fnToNull(vResult[0]["TAX_DOC_DIV"]) == "01" && (_fnToNull(vResult[0]["TAX_CLASS"]) == "01" || _fnToNull(vResult[0]["TAX_CLASS"]) == "02")) {
            $("span[name='EdocLayer_Title']").text("전자세금계산서");
        } else if (_fnToNull(vResult[0]["TAX_DOC_DIV"]) == "02" && (_fnToNull(vResult[0]["TAX_CLASS"]) == "01" || _fnToNull(vResult[0]["TAX_CLASS"]) == "02")) {
            $("span[name='EdocLayer_Title']").text("(수정)전자세금계산서");
        } else if (_fnToNull(vResult[0]["TAX_DOC_DIV"]) == "01" && _fnToNull(vResult[0]["TAX_CLASS"]) == "03") {
            $("span[name='EdocLayer_Title']").text("전자계산서");
        } else if (_fnToNull(vResult[0]["TAX_DOC_DIV"]) == "02" && _fnToNull(vResult[0]["TAX_CLASS"]) == "03") {
            $("span[name='EdocLayer_Title']").text("(수정)전자계산서");
        } else {
            $("span[name='EdocLayer_Title']").text("ELSE");
        }

        //레이어 팝업 체크박스 체크
        if (_fnToNull(vResult[0]["TAX_DOC_DIV"]) == "01") {
            $("input[name='EdocLayer_ChkNormalBill']").prop("checked", true).removeAttr("disabled");      
        } else if (_fnToNull(vResult[0]["TAX_DOC_DIV"]) == "02") {
            $("input[name='EdocLayer_ChkModifyBill']").prop("checked", true).removeAttr("disabled");      
        } else if (_fnToNull(vResult[0]["TAX_DOC_DIV"]) == "03") {
            $("input[name='EdocLayer_ChkAgency']").prop("checked", true).removeAttr("disabled");            
        }

        //레이어 팝업 체크박스 체크
        if (_fnToNull(vResult[0]["TAX_CLASS"]) == "01") {
            $("input[name='EdocLayer_ChkGwase']").prop("checked", true).removeAttr("disabled");
        } else if (_fnToNull(vResult[0]["TAX_CLASS"]) == "02") {
            $("input[name='EdocLayer_ChkYeongse']").prop("checked", true).removeAttr("disabled");
        } else if (_fnToNull(vResult[0]["TAX_CLASS"]) == "03") {
            $("input[name='EdocLayer_ChkMyeonse']").prop("checked", true).removeAttr("disabled");
        }
        
        $("td[name='EdocLayer_EdocNo']").text(_fnToNull(vResult[0]["ETAX_APPV_NO"])); //승인번호
        $("td[name='EdocLayer_BillNo']").text(_fnToNull(vResult[0]["TAX_MGMT_NO"]));  //계산서번호

        //공급하는자
        $("td[name='EdocLayer_Supplier_RegNo']").text(_fnFormatCRN(_fnToNull(vResult[0]["SUP_BUSN_ID"])));  //등록번호
        $("td[name='EdocLayer_Supplier_Name']").text(_fnToNull(vResult[0]["SUP_CHIEF_NM"]));                //성명
        $("td[name='EdocLayer_Supplier_Compeny']").text(_fnToNull(vResult[0]["SUP_TRADE_NM"]));             //상호
        $("td[name='EdocLayer_Supplier_Address']").text(_fnToNull(vResult[0]["SUP_ADDR"]));                 //사업장주소
        $("td[name='EdocLayer_Supplier_Eobtae']").text(_fnToNull(vResult[0]["SUP_BUSNSECT_NM"]));           //업태
        $("td[name='EdocLayer_Supplier_Eobjong']").text(_fnToNull(vResult[0]["SUP_DETAIL_NM"]));            //업종
        $("td[name='EdocLayer_Supplier_Manager']").text(_fnToNull(vResult[0]["SUP_MAIN_OFFC_NM"]));         //담당자
        $("td[name='EdocLayer_Supplier_Part']").text(_fnToNull(vResult[0]["SUP_MAIN_OFFC_DEPT_NM"]));       //부서
        $("td[name='EdocLayer_Supplier_Tel']").text(_fnToNull(vResult[0]["SUP_MAIN_OFFC_TEL_NO"]));         //전화
        $("td[name='EdocLayer_Supplier_Phone']").text(_fnToNull(vResult[0]["SUP_MAIN_OFFC_MTEL_NO"]));      //핸드폰
        $("td[name='EdocLayer_Supplier_Email']").text(_fnToNull(vResult[0]["SUP_MAIN_OFFC_EMAIL_ADDR"]));   //이메일
        $("td[name='EdocLayer_Supplier_Workplace']").text(_fnToNull(vResult[0]["SUP_SUB_BD_NO"]));          //종사업장

        //공급받는자
        $("td[name='EdocLayer_Consumer_RegNo']").text(_fnFormatCRN(_fnToNull(vResult[0]["DMD_BUSN_ID"])));  //등록번호
        $("td[name='EdocLayer_Consumer_Name']").text(_fnToNull(vResult[0]["DMD_CHIEF_NM"]));                //성명
        $("td[name='EdocLayer_Consumer_Compeny']").text(_fnToNull(vResult[0]["DMD_TRADE_NM"]));             //상호
        $("td[name='EdocLayer_Consumer_Address']").text(_fnToNull(vResult[0]["DMD_ADDR"]));                 //사업장주소
        $("td[name='EdocLayer_Consumer_Eobtae']").text(_fnToNull(vResult[0]["DMD_BUSNSECT_NM"]));           //업태
        $("td[name='EdocLayer_Consumer_Eobjong']").text(_fnToNull(vResult[0]["DMD_DETAIL_NM"]));            //업종
        $("td[name='EdocLayer_Consumer_Manager']").text(_fnToNull(vResult[0]["DMD_MAIN_OFFC_NM"]));         //담당자
        $("td[name='EdocLayer_Consumer_Part']").text(_fnToNull(vResult[0]["DMD_MAIN_OFFC_DEPT_NM"]));       //부서
        $("td[name='EdocLayer_Consumer_Tel']").text(_fnToNull(vResult[0]["DMD_MAIN_OFFC_TEL_NO"]));         //전화
        $("td[name='EdocLayer_Consumer_Phone']").text(_fnToNull(vResult[0]["DMD_MAIN_OFFC_MTEL_NO"]));      //핸드폰
        $("td[name='EdocLayer_Consumer_Email']").text(_fnToNull(vResult[0]["DMD_MAIN_OFFC_EMAIL_ADDR"]));   //이메일
        $("td[name='EdocLayer_Consumer_Workplace']").text(_fnToNull(vResult[0]["DMD_SUB_BD_NO"]));          //종사업장

        //세금계산서 내용 / 문서상태 , 거절사유 
        $("td[name='EdocLayer_WriteDate']").text(_fnFormatDate(_fnToNull(vResult[0]["WRITE_DT"])));         //작성일자
        $("td[name='EdocLayer_SUP_AMT']").text(fnSetComma(_fnToNull(vResult[0]["SUP_SM_AMT"])));            //공급가액
        $("td[name='EdocLayer_VAT_AMT']").text(_fnToNull(vResult[0]["VAT_SM_AMT"]));                        //세액
        $("td[name='EdocLayer_BLNO']").text(_fnToNull(vResult[0]["BL_NO"]));                                //B/L NO
        $("td[name='EdocLayer_WF_AMT']").text(fnSetComma(_fnToNull(vResult[0]["WF_AMT"])));                 //대납비용
        $("td[name='EdocLayer_TOT_AMT']").text(fnSetComma(_fnToNull(vResult[0]["TOT_AMT"])));               //대납비용포함
        $("td[name='EdocLayer_ETC']").text(_fnToNull(vResult[0]["ETAXBIL_NOTE"]));                          //비고
        $("td[name='EdocLayer_DocType']").text(_fnToNull(vResult[0]["LAST_DOC_STATUS_NM"]));                   //문서상태

        $("span[name='EdocLayer_ListTotal']").text(_fnToNull(vResult[0]["DETAIL_CNT"]));                    //내역 총 개수

        //거절사유 - SO인 경우는 input / 그외는 텍스트만 찍어주기.
        vHTML = "";

        if (_fnToNull(vResult[0]["LAST_DOC_STATUS"]) == "SO") {
            vHTML += " <input type=\"text\" style=\"width:100%\" name=\"EdocLayer_InputReject\"/> ";

            $("td[name='EdocLayer_Rejection']")[0].innerHTML = vHTML;
            $("td[name='EdocLayer_Rejection']")[1].innerHTML = vHTML;
        } else {
            $("td[name='EdocLayer_Rejection']").text(_fnToNull(vResult[0]["REFUND_REASON"]));                   
        }

        //XML 링크가 없으면 버튼 숨기기 
        vHTML = "";

        if (_fnToNull(vResult[0]["XML_PATH"]) != "") {
            //vHTML += "검색결과 총 <span>" + _fnToNull(vResult[0]["DETAIL_CNT"]) + "</span>건<a href=\"javascript:void(0)\" class=\"btm_xml\" onclick=\"fnXMLDownload('" + _fnToNull(vResult[0]["XML_PATH"])+"')\">xml 다운로드</a>";
            vHTML += " <span style=\"display:inline-block;vertical-align:top;margin-top:15px\">검색결과 총 <span class=\"red\">" + _fnToNull(vResult[0]["DETAIL_CNT"]) + "</span>건	</span> ";
            //vHTML += " <a href=\"javascript:void(0)\" class=\"btm_xml\" onclick=\"fnXMLDownload('" + _fnToNull(vResult[0]["XML_PATH"]) + "'><ins class=\"icon_down\"></ins>xml 다운로드</a> ";
            vHTML += " <a href=\"javascript:void(0)\" class=\"btm_xml\" onclick=\"fnPrePare()\"'><ins class=\"icon_down\"></ins>xml 다운로드</a> ";
            
        } else {
            //vHTML += "검색결과 총 <span>" + _fnToNull(vResult[0]["DETAIL_CNT"]) +"</span>건";
            vHTML += " <span style=\"display:inline-block;vertical-align:top;margin-top:15px\">검색결과 총 <span class=\"red\">" + _fnToNull(vResult[0]["DETAIL_CNT"]) + "</span>건	</span> ";            
        }

        $("p[name='EdocLayer_ListTotal_XMLPath']")[0].innerHTML = vHTML;
        $("p[name='EdocLayer_ListTotal_XMLPath']")[1].innerHTML = vHTML;
        
        //승인 , 거절 , 닫기 등 버튼 분기점 LAST_DOC_STATUS
        vHTML = "";

        if (_fnToNull(vResult[0]["LAST_DOC_STATUS"]) == "SO") {
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnSetTaxApproval('" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "')\"><ins class=\"icon_ok\"></ins>승인</a></li> "; 
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnSetTaxRefuse('" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "')\"><ins class=\"icon_no\"></ins>거절</a></li> "; 
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";
        } else if (_fnToNull(vResult[0]["LAST_DOC_STATUS"]) == "NO") {            
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";
        }else{
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";
        }

        $("#EdocLayer_StatusBtn_Area")[0].innerHTML = vHTML;

        ///////////////////////////////////////////////////////////////////Data/////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////List/////////////////////////////////////////////////////////////////////////////////////        
        vResult = JSON.parse(vJsonData).List;

        vHTML = "";

        //pc그리기
        vHTML += "   <tr> ";
        vHTML += "   	<th>순번</th> ";
        vHTML += "   	<th>구입일자</th> ";
        vHTML += "   	<th>품목</th> ";
        vHTML += "   	<th>규격</th> ";
        vHTML += "   	<th>수량</th> ";
        vHTML += "   	<th>단가</th> ";
        vHTML += "   	<th>공급가</th> ";
        vHTML += "   	<th>세액</th> ";
        vHTML += "   	<th>비고</th> ";
        vHTML += "   </tr> ";

        $.each(vResult, function (i) {
            vHTML += " <tr> ";
            vHTML += " 	<td>" + _fnToNull(vResult[i]["SEQ_NO"]) +"</td> ";
            vHTML += " 	<td>" + _fnFormatDate(_fnToNull(vResult[i]["PURCHS_DT"])) +"</td> ";
            vHTML += " 	<td>" + _fnToNull(vResult[i]["THNG_NM"]) +"</td> ";
            vHTML += " 	<td>" + _fnToNull(vResult[i]["STNDRD_NM"]) +"</td> ";
            vHTML += " 	<td>" + fnSetComma(_fnToNull(vResult[i]["QTY"])) +"</td> ";
            vHTML += " 	<td>" + _fnToNull(vResult[i]["UNT_PRC"]) +"</td> ";
            vHTML += " 	<td>" + fnSetComma(_fnToNull(vResult[i]["SUP_AMT"])) +"</td> ";
            vHTML += " 	<td>" + fnSetComma(_fnToNull(vResult[i]["VAT_AMT"])) +"</td> ";
            vHTML += " 	<td>" + _fnToNull(vResult[i]["NOTE"]) +"</td> ";
            vHTML += " </tr> ";
        });

        $("tbody[name='EdocLayer_ListArea_pc']")[0].innerHTML = vHTML;

        vHTML = "";

        $.each(vResult, function (i) {
            vHTML += "   <li> ";
            vHTML += "   	<span class=\"partTitle\"><span>순번</span> : <span>" + _fnToNull(vResult[i]["SEQ_NO"]) + "</span></span> ";
            vHTML += "   	<span class=\"partTitle\"><span>구입일자</span> : <span>" + _fnFormatDate(_fnToNull(vResult[i]["PURCHS_DT"])) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>품목</span> : <span>" + _fnToNull(vResult[i]["THNG_NM"]) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>규격</span> : <span>" + _fnToNull(vResult[i]["STNDRD_NM"]) + "</span></span> ";
            vHTML += "   	<span class=\"partTitle\"><span>수량</span> : <span>" + fnSetComma(_fnToNull(vResult[i]["QTY"])) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>단가</span> : <span>" + _fnToNull(vResult[i]["UNT_PRC"]) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>공급가액</span> : <span>" + fnSetComma(_fnToNull(vResult[i]["SUP_AMT"])) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>세액</span> : <span>" + fnSetComma(_fnToNull(vResult[i]["VAT_AMT"])) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>비고</span> : <span>" + _fnToNull(vResult[i]["NOTE"]) + "</span> </span> ";
            vHTML += "   </li> ";
        });

        $("ul[name='EdocLayer_ListArea_mo']")[0].innerHTML = vHTML;
        ///////////////////////////////////////////////////////////////////List/////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////Doc//////////////////////////////////////////////////////////////////////////////////////
        vResult = JSON.parse(vJsonData).Doc;
        
        if (vResult.length > 0) {
            //CRD - 입금표
            if (_fnToNull(vResult[0]["DOC_TYPE"]) == "CRD") {
                //연계문서
                $("td[name='EdocLayer_Doc']").text("입금표");
            }
        }

        ///////////////////////////////////////////////////////////////////Doc//////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////Attach///////////////////////////////////////////////////////////////////////////////////
        vResult = JSON.parse(vJsonData).Attach;

        vHTML = "";

        $.each(vResult, function (i) {
            if (vResult.length > 0) {
                //vHTML += "<li onclick=\"fnFileDownload('" + _fnToNull(vResult[i]["FILE_NM"]) + "','" + _fnToNull(vResult[i]["FILE_PATH"]) + "','" + _fnToNull(vResult[i]["PRT_FILE_NM"]) + "')\">" + _fnToNull(vResult[i]["FILE_NM"]) + "</li>";
                vHTML += "<li onclick=\"fnPrePare()\">" + _fnToNull(vResult[i]["FILE_NM"]) + "</li>";
                

            }
        });

        $("ul[name='EdocLayer_Attach']")[0].innerHTML = vHTML;
        $("ul[name='EdocLayer_Attach']")[1].innerHTML = vHTML;

        //전체 다운로드는 추후 나중에 추가하는걸로 
        //if (vResult.length > 1) {
        //    $("td[name='EdocLayer_AllAttach']").text("전체다운로드");
        //}
        ///////////////////////////////////////////////////////////////////Attach///////////////////////////////////////////////////////////////////////////////////        
    }
    catch (e) {
        console.log(e.message);
    }

}

//입금표 레이어 팝업 데이터 그려주는 로직
function fnMakeCreditLayerData(vJsonData) {
    try {

        var vHTML = "";
        var vResult = JSON.parse(vJsonData).Data;

        //데이터를 먼저 뿌리기. //Data
        //List 만들어서 뿌리기  //List        
        $("td[name='EdocLayer2_CreditNo']").text(_fnToNull(vResult[0]["CRD_NO"]));
        $("td[name='EdocLayer2_DocType']").text(_fnToNull(vResult[0]["DOC_DIV_NM"]));

        //문서 타입이 C1인 경우
        if (_fnToNull(vResult[0]["DOC_DIV"]) == "C1") {            
            $("table[name='EdocLayer2_DaeRiJum_Area']").hide();
        } else {
            $("td[name='EdocLayer2_DaeRiJum_RegNo']").text(_fnFormatCRN(_fnToNull(vResult[0]["AGENT_BUSN_ID"])));
            $("td[name='EdocLayer2_DaeRiJum_Name']").text(_fnToNull(vResult[0]["AGENT_CHIEF_NM"]));
            $("td[name='EdocLayer2_DaeRiJum_Compeny']").text(_fnToNull(vResult[0]["AGENT_TRADE_NM"]));
            $("td[name='EdocLayer2_DaeRiJum_Address']").text(_fnToNull(vResult[0]["AGENT_ADDR"]));
        }
        //공급자
        $("td[name='EdocLayer2_Supplier_RegNo']").text(_fnFormatCRN(_fnToNull(vResult[0]["SUPLER_BUSN_ID"])));
        $("td[name='EdocLayer2_Supplier_Name']").text(_fnToNull(vResult[0]["SUPLER_CHIEF_NM"]));
        $("td[name='EdocLayer2_Supplier_Compeny']").text(_fnToNull(vResult[0]["SUPLER_TRADE_NM"]));

        //공급받는자
        $("td[name='EdocLayer2_Consumer_RegNo']").text(_fnFormatCRN(_fnToNull(vResult[0]["DMDER_BUSN_ID"])));
        $("td[name='EdocLayer2_Consumer_Name']").text(_fnToNull(vResult[0]["DMDER_CHIEF_NM"]));
        $("td[name='EdocLayer2_Consumer_Compeny']").text(_fnToNull(vResult[0]["DMDER_TRADE_NM"]));

        //대리점
        $("td[name='EdocLayer2_DaeRiJum_WriteDate']").text(_fnFormatDate(_fnToNull(vResult[0]["WRITE_DT"])));
        $("td[name='EdocLayer2_DaeRiJum_Total']").text(fnSetComma(_fnToNull(vResult[0]["TOT_AMT"])));
        $("td[name='EdocLayer2_DaeRiJum_SunMung_BL']").text(_fnToNull(vResult[0]["VESSEL_BL_NO"]));

        $("span[name='EdocLayer2_ListTotal'").text(_fnToNull(vResult[0]["DETAIL_CNT"]));


        //내역 리스트 찍기
        vResult = JSON.parse(vJsonData).List;

        vHTML = "";

        vHTML += "   <tr> ";
        vHTML += "   	<th>순번</th> ";
        vHTML += "   	<th>품명</th> ";
        vHTML += "   	<th>Curr</th> ";
        vHTML += "   	<th>환율</th> ";
        vHTML += "   	<th>외화금액</th> ";
        vHTML += "   	<th>원화금액</th> ";
        vHTML += "   </tr> ";

        $.each(vResult, function (i) {
            vHTML += "   <tr> ";
            vHTML += "   	<td>" + _fnToNull(vResult[i]["SEQ_NO"]) + "</td> ";
            vHTML += "   	<td>" + _fnToNull(vResult[i]["FRT_NM"]) + "</td> ";
            vHTML += "   	<td>" + _fnToNull(vResult[i]["CURR_CD"]) + "</td> ";
            vHTML += "   	<td>" + _fnToNull(vResult[i]["EX_RATE"]) + "</td> ";
            vHTML += "   	<td>" + _fnToNull(vResult[i]["FREGN_AMT"]) + "</td> ";
            vHTML += "   	<td>" + _fnToNull(vResult[i]["LOCAL_AMT"]) + "</td> ";
            vHTML += "   </tr> ";
        });

        $("tbody[name='EdocLayer2_ListArea_pc']")[0].innerHTML = vHTML;

        vHTML = "";

        $.each(vResult, function (i) {
            vHTML += "   <li> ";
            vHTML += "   	<span class=\"partTitle\"><span>순번</span> : <span>" + _fnToNull(vResult[i]["SEQ_NO"]) + "</span></span> ";
            vHTML += "   	<span class=\"partTitle\"><span>품명</span> : <span>" + _fnToNull(vResult[i]["FRT_NM"]) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>Curr</span> : <span>" + _fnToNull(vResult[i]["CURR_CD"]) + "</span></span> ";
            vHTML += "   	<span class=\"partTitle\"><span>환율</span> : <span>" + _fnToNull(vResult[i]["EX_RATE"]) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>외화금액</span> : <span>" + _fnToNull(vResult[i]["FREGN_AMT"]) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>원화금액</span> : <span>" + _fnToNull(vResult[i]["LOCAL_AMT"]) + "</span> </span> ";
            vHTML += "   </li> ";
        });

        $("ul[name='EdocLayer2_ListArea_mo']")[0].innerHTML = vHTML;

        //인쇄 및 닫기 그려주기
        vHTML = "";

        //vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnPrePare()\"><ins class=\"icon_print\"></ins>인쇄</a></li> ";
        vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill2')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";

        $("#EdocLayer2_StatusBtn_Area")[0].innerHTML = vHTML;

    }
    catch (e) {
        console.log(e.message);
    }
}
////////////////////////API////////////////////////////

