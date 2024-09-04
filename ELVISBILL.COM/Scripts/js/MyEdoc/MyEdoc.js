//#region ★★★★★★Global var★★★★★★
var _vPage = 0;
var _vTAX_DOC_NO = ""; //tax_code 계속 가지고 다니기.
var _vCRD_DOC_NO = ""; //Crn_code 계속 가지고 다니기.
var _vTotalPage = 0; //Refresh를 위한 Page 변수

var _vBUSN_TYPE = ""; //사업자 구분을 위한 flag 값
var _vDOC_TYPE = ""; //문서종류 값 변수

var _SearchType = ""; //Log를 위한 변수
var _Edoc_Value = ""; //Log를 위한 변수

var NewSearch = true;
var UpdPw = "";
var ParamObj = new Object();
var _objExcelData = new Object(); //엑셀만을 위한 오브젝트인데 추후 더보기로 사용 할 수 있음.
//#endregion

////////////////////jquery event///////////////////////
$(function () {


    

    $("#Edoc_SearchN_Wrap").hide();
    $("#Edoc_SearchW_Wrap").hide();




    //세션있을 시 페이지 초기 셋팅
    if ($("#Session_USR_ID").val() != "") { 
        $("#Down_list").addClass("none");
        //기간 버튼 활성화 
        $(".S_choice_term").removeClass("on");
        $(".S_choice_term").eq(0).addClass("on");

        //오늘 날짜 셋팅
        $("#S_Edoc_LastDate").val(new Date().getFullYear() + "-" + _pad(new String(new Date().getMonth() + 1), 2) + "-" + _pad(new String(new Date().getDate()), 2));
        //선택된 날짜 셋팅
        var setfrom_date = fnSetWeekDate("1week")
        $("#S_Edoc_FristDate").val(setfrom_date);


        //사업자 구분 선택
        $("input[name='entrepreneur']").eq(0).click();

        //문서 종류 선택
        $("input[name='document']").eq(0).click();

        //전송상태 선택 (전체)
        $("#all").prop("checked", true);

        //세금구분 선택
        $("#vat_all").prop("checked", true);

        //리스트 영역 초기화
        $(".bill_box").empty();

        //페이징 버튼 영역 초기화
        $("#Paging_List_Area").empty();

        //합계표 초기화
        fnInitTotalAmt();

        
        /*$("#footer").css('bottom', '0');*/

    }
    else {//없을 시 홈화면
        location.href = location.origin;
    }


    if ($("#hidden_ContentType").val() == "B") {
        // 번호기준(N) / 담당자(S) / 이메일(E)
        if ($("#hidden_SearchType").val() == "N") {

            $("#Edoc_SearchN_Wrap").show();

            _SearchType = "N";
            _Edoc_Value = $("#N_Edoc_Value").val();

            $("#Edoc_select_SerachArea li a").removeClass("on");
            $("#Edoc_select_SerachArea li:eq(0) a").addClass("on");

            $("#Edoc_SearchN_Wrap").show();
            $("#Edoc_SearchW_Wrap").hide();
            fnN_SearchList(); //검색 function 
        }
        else if ($("#hidden_SearchType").val() == "S") {

            $("#Edoc_SearchW_Wrap").show();

            _SearchType = "S";
            _Edoc_Value = $("#S_Edoc_Email").val();

            $("#Edoc_select_SerachArea li a").removeClass("on");
            $("#Edoc_select_SerachArea li:eq(1) a").addClass("on");

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

            _SearchType = "E";
            _Edoc_Value = $("#N_Edoc_Value").val();

            $("#Edoc_select_SerachArea").hide();
            $("#Edoc_SearchN_Wrap").hide();
            $("#Edoc_SearchW_Wrap").hide();
            fnN_SearchList(); //검색 function 
        } else {
            //데이터가 없을 경우
            $("#Edoc_SearchN_Wrap").show();
        }
    }    
    else if ($("#hidden_ContentType").val() == "A")
    {
        //관리자용 페이지
        $("#manager_textarea").show();
        $("#ALLCheckTaxApproval").hide();
        $("#Edoc_select_SerachArea").hide();
        $("#Edoc_SearchN_Wrap").hide();
        $("#Edoc_SearchW_Wrap").hide();
        fnN_SearchList(); //검색 function 
    }
    else if ($("#hidden_ContentType").val() == "S") {
        //공급자 추후 추가 될 내용. 
    }

    //새고로침 되었으면 여기로직 안타게 변경
    //if ($("#hidden_Isinit").val() == "true") {
    //    // 공급자(S)  /   default : 공급받는자(B)
    //    
    //} else {
    //    $("#Edoc_SearchN_Wrap").show();
    //    $("#Edoc_SearchW_Wrap").hide();
    //}   


    //#region 달력 셋팅
    $("#S_Edoc_FristDate_Area").datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        onShow: function (ct) {
            this.setOptions({
                maxDate: $("#S_Edoc_EndDate_Area").find("#S_Edoc_LastDate").val() ? $("#S_Edoc_EndDate_Area").find("#S_Edoc_LastDate").val() : false
            });
        },
        /*startDate: _fnToNull($("#S_Edoc_FristDate").val()).replace(/-/gi,'\.'), */
        onSelectDate: function (dp, $input) {
            var str = $input.val();
            var m = str.substr(0, 10);
            $("#S_Edoc_FristDate_Area").find("#S_Edoc_FristDate").val(m);
        }
    });
    $("#S_Edoc_EndDate_Area").datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        onShow: function (ct) {
            this.setOptions({
                minDate: $("#S_Edoc_FristDate_Area").find("#S_Edoc_FristDate").val() ? $("#S_Edoc_FristDate_Area").find("#S_Edoc_FristDate").val() : false
            });
        },
        /*startDate:'2018.02.01',*/
        onSelectDate: function (dp, $input) {
            var str = $input.val();
            var m = str.substr(0, 10);
            $("#S_Edoc_EndDate_Area").find("#S_Edoc_LastDate").val(m);
        }
    });
    //#endreigon
});




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


//#region 기존 Edoc Page 기능

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


//번호기준 검색 조회
function fnN_SearchList() {
    try {
        //번호기준 벨리데이션 체크
        if (fnN_Validation()) {
            var objJsonData = new Object();

            objJsonData.CRN_NO = $("#N_Edoc_CRN_NO").val(); //사업자번호
            objJsonData.N_VALUE = $("#N_Edoc_Value").val(); //B/L No or Invoice No or 계산서번호
            objJsonData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)

            if (_fnToNull($("#hidden_SearchType").val()) == "") {
                objJsonData.SearchType = "N"
            } else {
                objJsonData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)
            }

            _objExcelData.CRN_NO = $("#N_Edoc_CRN_NO").val(); //사업자번호
            _objExcelData.N_VALUE = $("#N_Edoc_Value").val(); //B/L No or Invoice No or 계산서번호
            _objExcelData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)

            if (_fnToNull($("#hidden_SearchType").val()) == "") {
                _objExcelData.SearchType = "N"
            } else {
                _objExcelData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)
            }

            if (_fnToNull(_SearchType) != "E") {
                _SearchType = "N";
                _Edoc_Value = $("#N_Edoc_Value").val();
            }

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
                        _fnalert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
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
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                    _fnalert("담당자에게 문의 하세요.");
                    console.log(error);
                },
                beforeSend: function () {
                    $("#ProgressBar_Loading").show(); //프로그래스 바
                },
                complete: function () {
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                }
            });
        }

    } catch (e) {
        console.log(e.message);
    }
}

//담당자 검색 조회
function fnS_SearchList() {
    try {

        //담당자 검색 벨리데이션 체크 
        if (fnS_Validation()) {
            var objJsonData = new Object();

            objJsonData.ContentType = $("#hidden_ContentType").val(); // 공급자(S)  /   default : 공급받는자(B)

            if (_fnToNull($("#hidden_SearchType").val()) == "") {
                objJsonData.SearchType = "S";  // 번호기준(N) / 담당자(S) / 이메일(E)        
            } else {
                objJsonData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)        
            }

            objJsonData.CRN_NO = $("#S_Edoc_CRN_NO").val(); //사업자 번호
            objJsonData.EMAIL = $("#S_Edoc_Email").val(); //담당자 E-mail

            //select 작성일자 / 발행일자
            if ($("#S_Edoc_Select option:selected").val() == "W") {
                objJsonData.SelectDate = "W";
                _objExcelData.SelectDate = "W";
            }
            else if ($("#S_Edoc_Select option:selected").val() == "I") {
                objJsonData.SelectDate = "I";
                _objExcelData.SelectDate = "I";
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

            if (_fnToNull($("#hidden_SearchType").val()) == "") {
                _objExcelData.SearchType = "S";  // 번호기준(N) / 담당자(S) / 이메일(E)        
            } else {
                _objExcelData.SearchType = $("#hidden_SearchType").val();  // 번호기준(N) / 담당자(S) / 이메일(E)        
            }

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

            //Log를 위함
            _SearchType = "S";
            _Edoc_Value = $("#S_Edoc_Email").val();

            $.ajax({
                type: "POST",
                url: "/MyEdoc/fnMySearchList",
                async: true,
                dataType: "json",
                //data: callObj,
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result == null) {
                        _fnalert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
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
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                    _fnalert("담당자에게 문의 하세요.");
                    console.log(error);
                },
                beforeSend: function () {
                    $("#ProgressBar_Loading").show(); //프로그래스 바
                },
                complete: function () {
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
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
        _fnalert("사업자 번호를 입력 해 주세요.");
        $("#N_Edoc_CRN_NO").focus();
        return false;
    }

    //찾을번호
    if (_fnToNull($("#N_Edoc_Value").val()) == "") {
        _fnalert("B/L No or Invoice No or 계산서번호를 입력하세요.");
        $("#N_Edoc_Value").focus();
        return false;
    }

    return true;
}

//담당자 벨리데이션 체크 
function fnS_Validation() {

    //사업자번호
    if (_fnToNull($("#S_Edoc_CRN_NO").val()) == "") {
        _fnalert("사업자 번호를 입력 해 주세요.");
        $("#S_Edoc_CRN_NO").focus();
        return false;
    }

    //담당자 E-mail
    if (_fnToNull($("#S_Edoc_Email").val()) == "") {
        _fnalert("이메일을 입력 해 주세요.");
        $("#S_Edoc_Email").focus();
        return false;
    }

    //이전 날짜
    if (_fnToNull($("#S_Edoc_FristDate").val()) == "") {
        _fnalert("날짜를 입력 해 주세요.");
        $("#S_Edoc_FristDate").focus();
        return false;
    }

    //현재 날짜
    if (_fnToNull($("#S_Edoc_LastDate").val()) == "") {
        _fnalert("날짜를 입력 해 주세요.");
        $("#S_Edoc_LastDate").focus();
        return false;
    }

    //문서종류 - (세금)계산서 , 입금표 체크박스
    if ($("#S_Edoc_Chk_Bill").is(":checked") == false && $("#S_Edoc_Chk_Credit").is(":checked") == false) {
        _fnalert("문서종류 세금계산서 , 입금표 중 1개 이상 체크 해주세요.");
        return false;
    }

    return true;
}



//#region (미사용) 승인 / 거절 기능
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
            async: false, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    _fnalert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        fnConfirm_Cancel();
                        $(".layerPopup_bg").hide();
                        $(".layerPopup_bill").hide();
                        $(".layerPopup_bill2").hide();
                        $("#wrap").removeClass("noscroll");
                        _fnalert("승인이 되었습니다.");
                        fnPageRefresh();
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        fnConfirm_Cancel();
                        $(".layerPopup_bg").hide();
                        $(".layerPopup_bill").hide();
                        $(".layerPopup_bill2").hide();
                        $("#wrap").removeClass("noscroll");
                        _fnalert("문서 상태가 변경되었습니다. 재 조회 합니다.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        fnPageRefresh();
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
            fnConfirm_Cancel();
            _fnalert("문서 접수의 건만 승인 할 수 있습니다.");
            return;
        } else if (_fnToNull(vValue) == "") {
            fnConfirm_Cancel();
            _fnalert("세금계산서를 선택 해 주세요.");
            return;
        }

        objJsonData.TAX_DOC_NO = vValue;

        $.ajax({
            type: "POST",
            url: "/Edoc/fnSetAllTaxApproval",
            async: false, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    _fnalert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        fnConfirm_Cancel();
                        _fnalert("일괄 승인이 완료 되었습니다.");
                        fnPageRefresh();
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        fnConfirm_Cancel();
                        _fnalert("문서 상태가 변경되었습니다. 재 조회 합니다.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        fnPageRefresh();
                    }
                }
            },
            error: function (xhr, status, error) {
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    fnConfirm_Cancel();
                    _fnalert("담당자에게 문의 하세요.");
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

        //국세청 승인 및 거절
        if (_fnToNull($("input[name='EdocLayer_InputReject']").val()) != "") {
            objJsonData.REFUND_REASON = _fnToNull($("input[name='EdocLayer_InputReject']").val().replace(/'/gi, "''"));
        } else if (_fnToNull($("#Edoc_Confirm_textarea").val()) != "") {
            objJsonData.REFUND_REASON = _fnToNull($("#Edoc_Confirm_textarea").val().replace(/'/gi, "''"));
        }
        else {
            objJsonData.REFUND_REASON = "";
        }

        $.ajax({
            type: "POST",
            url: "/Edoc/fnSetTaxRefuse",
            async: false, //동기식 , 비동기식
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    _fnalert("담당자에게 문의 해 주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        fnConfirm_Cancel();
                        $(".layerPopup_bg").hide();
                        $(".layerPopup_bill").hide();
                        $(".layerPopup_bill2").hide();
                        $("#wrap").removeClass("noscroll");
                        _fnalert("거절이 되었습니다.");
                        fnPageRefresh();
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        fnConfirm_Cancel();
                        $(".layerPopup_bg").hide();
                        $(".layerPopup_bill").hide();
                        $(".layerPopup_bill2").hide();
                        $("#wrap").removeClass("noscroll");
                        _fnalert("문서 상태가 변경되었습니다. 재 조회 합니다.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        fnPageRefresh();
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
                    _fnalert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        $("#Edoc_List").empty();
                        fnMakeEdocList(result);
                        fnMakeEdocListTotal(result);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        _fnalert("조회 결과가 없습니다.");
                    }
                }
            },
            error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnalert("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });

    } catch (e) {
        console.log(e.message);
    }

}


//Confrim 확인
function fnConfirm(vValue, vTexNo) {

    //approval 승인 / refuse  거절 / All 일괄승인
    if (vValue == "approval") {
        $("#confirm_true").attr("onclick", "fnSetTaxApproval('" + vTexNo + "')");
        $("#Edoc_Confirm_textarea").hide();
        $("#Edoc_Confirm_Content").text("승인 하시겠습니까?");
    } else if (vValue == "refuse") {
        $("#confirm_true").attr("onclick", "fnSetTaxRefuse('" + vTexNo + "')");
        $("#Edoc_Confirm_textarea").show();
        $("#Edoc_Confirm_Content").text("거절 사유를 입력 해 주세요.");
    } else if (vValue == "All") {
        $("#confirm_true").attr("onclick", "fnSetCheckTaxApproval()");
        $("#Edoc_Confirm_textarea").hide();
        $("#Edoc_Confirm_Content").text("일괄 승인 하시겠습니까?");
    }

    $("#wrap").addClass("noscroll");
    $(".layerPopup_bg").show();
    $(".confirm").show();
}

//Confirm 취소
function fnConfirm_Cancel() {
    $(".layerPopup_bg").hide();
    $(".confirm").hide();
    $("#Edoc_Confirm_textarea").text("");
    $("#wrap").removeClass("noscroll");
}

//#endregion


//파일 전체 다운로드 로직
function fnAllFilesDownload() {
    //없지롱
}



//준비 중 입니다. alert() - 나중에는 지워야 됨
function fnPrePare() {
    _fnalert("준비 중 입니다.");
}
function fnZipDownload() {
    _fnalert("zip 테스트");
}


//#region 미사용

//세금계산서 발행 예정 내역서 인쇄
function fnExampleTaxPrint(vTaxNo) {
    try {

        var projectName = "ELVIS-BILL";
        var formName = "TaxBill_DB";

        //데이터셋
        var dataset_0 = [{ "": "" }];

        //데이터셋 Object
        var datasetList = {};
        datasetList.dataset_0 = JSON.stringify(dataset_0);

        var paramList = {};
        paramList.TAX_NO = "('" + _fnToNull(vTaxNo) + "')";

        _fn_viewer_open(projectName, formName, datasetList, paramList);

        //var objJsonData = new Object();
        //
        //objJsonData.TAX_DOC_NO = _fnToNull(vTaxNo);
        //
        //$.ajax({
        //    type: "POST",
        //    url: "/Edoc/fnTaxPrint",
        //    async: true, //동기식 , 비동기식
        //    dataType: "json",
        //    //data: callObj,
        //    data: { "vJsonData": _fnMakeJson(objJsonData) },
        //    success: function (result) {
        //        if (result == null) {
        //            _fnalert("담당자에게 문의 해 주세요.");
        //        } else {
        //            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
        //                var projectName = "ELVIS-BILL";
        //                var formName = "TaxBill";
        //
        //                var vTax_Info = _fnMakeJson(JSON.parse(result).Data);
        //
        //                //데이터셋 List
        //                var datasetList = {};
        //                //datasetList.ReportDS = JSON.stringify(vTax_Info);
        //                datasetList.ReportDS = vTax_Info;
        //
        //                var paramList = {};
        //
        //                _fn_viewer_open(projectName, formName, datasetList, paramList);
        //            } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
        //                _fnalert("데이터가 없습니다.");
        //                console.log("데이터가 없습니다.");
        //            } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
        //
        //                var projectName = "ELVIS-BILL";
        //                var formName = "TaxBill";
        //
        //                var vTax_Info = _fnMakeJson(JSON.parse(result).Data);
        //
        //                //데이터셋 List
        //                var datasetList = {};
        //                //datasetList.ReportDS = JSON.stringify(vTax_Info);
        //                datasetList.ReportDS = vTax_Info;
        //
        //                var paramList = {};
        //
        //                _fn_viewer_open(projectName, formName, datasetList, paramList);
        //                console.log("[세금계산서 발행 예정 내역서 인쇄 : fnExampleTaxPrint]" + JSON.parse(result).Result[0]["trxMsg"]);
        //            }
        //        }
        //    },
        //    error: function (xhr, status, error) {
        //        $("#ProgressBar_Loading").hide(); //프로그래스 바
        //        _fnalert("담당자에게 문의 하세요.");
        //        console.log(error);
        //    },
        //    beforeSend: function () {
        //        $("#ProgressBar_Loading").show(); //프로그래스 바
        //    },
        //    complete: function () {
        //        $("#ProgressBar_Loading").hide(); //프로그래스 바
        //    }
        //});

    } catch (e) {
        console.log(e.message);
    }
}


//#endregion

//#region (미사용) 기존 그리기 함수
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
                if (_fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "SO" || _fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "NA") {
                    
                    vHTML += "   			<span class=\"block\"><span class=\"partTitle\">전송상태</span> : <span class=\"stateReg\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM1"]) + "</span> ";

                    if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) != "") {
                        if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NA") {                            
                            vHTML += "  <span class=\"stateReg\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</span> ";
                        } else if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NS") {                            
                            vHTML += "  <span class=\"stateOk\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</span> ";                            
                        } else if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NE") {                            
                            vHTML += "  <span class=\"stateCancel\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</span> ";                            
                        }
                    }

                    vHTML += "  </span > ";
                }
                else if (_fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "BS" || _fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "NS") {

                    vHTML += " <span class=\"block\"><span class=\"partTitle\">전송상태</span> : <span class=\"stateOk\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM1"]) + "</span> ";

                    if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) != "") {
                        if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NA") {
                            vHTML += "  <span class=\"stateReg\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</span> ";
                        } else if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NS") {
                            vHTML += "  <span class=\"stateOk\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</span> ";
                        } else if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NE") {
                            vHTML += "  <span class=\"stateCancel\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</span> ";
                        }
                    }

                    vHTML += "  </span > ";
                }
                else if (_fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "BR" || _fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "LF" || _fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "NE") {
                    vHTML += "   			<span class=\"block\"><span class=\"partTitle\">전송상태</span> : <span class=\"stateCancel\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM1"]) + "</span></span> ";
                }
                else {
                    vHTML += "   			<span class=\"block\"><span class=\"partTitle\">전송상태</span> : <span class=\"stateReg\">" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM1"]) + "</span></span> ";
                }

                //계산서 or 입금서 체크
                if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {
                    vHTML += "   			<span class=\"block block01\"><span class=\"partTitle\">계산서번호</span> : " + _fnToNull(vResult[i]["TAX_MGMT_NO"]) + "</span> ";
                }
                else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {
                    vHTML += "   			<span class=\"block block01\"><span class=\"partTitle\">입금표번호</span> : " + _fnToNull(vResult[i]["TAX_MGMT_NO"]) + "</span> ";
                }

                //twkim 20210507 (영수 OR 청구) 추가요청
                if (_fnToNull(vResult[i]["ETAXBIL_TP_NM"]) != "") {
                    vHTML += "   			<span class=\"block block02\"><span class=\"partTitle\">구분</span> : " + _fnToNull(vResult[i]["DOC_DIV"]) + " (" + _fnToNull(vResult[i]["ETAXBIL_TP_NM"])+") </span> ";
                } else {
                    vHTML += "   			<span class=\"block block02\"><span class=\"partTitle\">구분</span> : " + _fnToNull(vResult[i]["DOC_DIV"]) + "  </span> ";
                }
                

                vHTML += "   			<span class=\"block\"><span class=\"partTitle\">공급하는자 :</span><span style=\"width: 65%;font-size: 15px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;line-height: 13px;display: inline-block;\">"+ _fnToNull(vResult[i]["DMDER_TRADE_NM"]) + "</span></span> ";
                vHTML += "   			<span class=\"block\"><span class=\"partTitle\">B/L No</span> : " + _fnToNull(vResult[i]["BL_NO"]) + "  </span> ";
                vHTML += "   			<span class=\"block\"><span class=\"partTitle\">작성일자</span> : " + _fnFormatDate(_fnToNull(vResult[i]["WRITE_DT"])) + " </span> ";
                vHTML += "   			<span class=\"block\"><span class=\"partTitle\">발행일자</span> : " + _fnFormatDate(_fnToNull(vResult[i]["ISU_DATE"])) + " </span> ";

                if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T")
                {
                    //if (Number(vResult[i]["SUP_SM_AMT"]) > 0) {
                    //    vHTML += "   			<span class=\"block  block03\"><span style=\"display: inline-block;color: blue;font-size: 19px;font-weight: 700;\" >공급가액 : " + fnSetComma(_fnToNull(vResult[i]["SUP_SM_AMT"])) + " </span></span> ";
                    //    vHTML += "   			<span class=\"block  block03\"><span style=\"display: inline-block;color: blue;font-size: 19px;font-weight: 700;\" >부가세액 : " + fnSetComma(_fnToNull(vResult[i]["VAT_SM_AMT"])) + "  </span></span> ";
                    //    vHTML += "   			<span class=\"block  block03\"><span style=\"display: inline-block;color: blue;font-size: 19px;font-weight: 700;\" >합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + " </span></span> ";                        
                    //} else if (Number(vResult[i]["SUP_SM_AMT"]) == 0) {
                    //    vHTML += "   			<span class=\"block  block03\">공급가액 : " + fnSetComma(_fnToNull(vResult[i]["SUP_SM_AMT"])) + " </span></span> ";
                    //    vHTML += "   			<span class=\"block  block03\">부가세액 : " + fnSetComma(_fnToNull(vResult[i]["VAT_SM_AMT"])) + "  </span></span> ";
                    //    vHTML += "   			<span class=\"block  block03\">합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + " </span></span> ";
                    //} else if (Number(vResult[i]["SUP_SM_AMT"]) < 0) {
                    //    vHTML += "   			<span class=\"block  block03\"><span style=\"display: inline-block;color: #cc3300;font-size: 19px;font-weight: 700;\" >공급가액 : " + fnSetComma(_fnToNull(vResult[i]["SUP_SM_AMT"])) + " </span></span> ";
                    //    vHTML += "   			<span class=\"block  block03\"><span style=\"display: inline-block;color: #cc3300;font-size: 19px;font-weight: 700;\" >부가세액 : " + fnSetComma(_fnToNull(vResult[i]["VAT_SM_AMT"])) + "  </span></span> ";
                    //    vHTML += "   			<span class=\"block  block03\"><span style=\"display: inline-block;color: #cc3300;font-size: 19px;font-weight: 700;\" >합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + " </span></span> ";
                    //}

                    vHTML += "   			<span class=\"block  block03\">공급가액 : " + fnSetComma(_fnToNull(vResult[i]["SUP_SM_AMT"])) + " </span> ";
                    vHTML += "   			<span class=\"block  block03\">부가세액 : " + fnSetComma(_fnToNull(vResult[i]["VAT_SM_AMT"])) + "  </span> ";
                    vHTML += "   			<span class=\"block  block03\">대납비용 : " + fnSetComma(_fnToNull(vResult[i]["WF_AMT"])) + " </span> ";
                    vHTML += "   			<span class=\"block  block03\">합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + " </span> ";
                }
                else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R")
                {
                    vHTML += "   			<span class=\"block  block03\">입금표 합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) + " </span> ";
                }

                vHTML += "   		</li> ";
                vHTML += "   		<li class=\"li3\"> ";
                vHTML += "   			<ul class=\"bill_list_ul3\"> ";

                //DoC
                if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {
                    //LAST_DOC_STATUS = 'SO'   - 거절,승인,상세내역
                    if (_fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "SO") {
                        //레이어 팝업 분기점 bill_popup : 세금계산서 레이어 팝업 / bill_popup2 : 입금표
                        if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {
                            vHTML += " <li class=\"btn3\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup\"><span>상세내역</span></a>";
                            vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                            vHTML += " </li> ";
                        } else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {
                            vHTML += " <li class=\"btn3\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup2\"><span>상세내역</span></a>";
                            vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                            vHTML += "</li > ";
                        }

                        //twkim 20210622 추가 - 관리자용 페이지 일 경우 보이지 않게
                        if (_fnToNull($("#hidden_ContentType").val()) != "A") {
                            vHTML += " <li class=\"btn3\"><a href=\"javascript:void(0)\" class=\"cancel\" onclick=\"fnConfirm('refuse', '" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "')\"><span>거절</span></a></li> ";
                            vHTML += " <li class=\"btn3\"><a href=\"javascript:void(0)\" class=\"ok\" onclick=\"fnConfirm('approval', '" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "')\" ><span>승인</span></a></li> ";
                        }
                    }
                    // LAST_DOC_STATUS = 'BS'   - 인쇄(발행예정) , 상세내역
                    //else if (_fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "BS") {
                    //    //레이어 팝업 분기점 bill_popup : 세금계산서 레이어 팝업 / bill_popup2 : 입금표
                    //    if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {
                    //        vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup\"><span>상세내역</span></a>";
                    //        vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                    //        vHTML += "</li > ";
                    //    } else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {
                    //        vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup2\"><span>상세내역</span></a> ";
                    //        vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                    //        vHTML += "</li > ";
                    //    }
                    //    vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"print2\" onclick=\"fnTaxPrint('" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "');\"><span>발행예정</span></a></li> ";
                    //}
                    // LAST_DOC_STATUS = 'NS'   - 인쇄 , 상세내역
                    else if (_fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "BS" || _fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "NA" || _fnToNull(vResult[i]["LAST_DOC_STATUS"]) == "NS") {
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
                        vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"print\" onclick=\"fnTaxPrint('" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "');\"><span>인쇄</span></a></li> ";
                    }
                    //ELSE - 상세내역
                    else {
                        vHTML += " <li class=\"btn1\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup\"><span>상세내역</span></a>";
                        vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                        vHTML += "</li > ";
                    }                    
                } else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {
                    vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"detailView bill_popup2\"><span>상세내역</span></a>";
                    vHTML += "<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "\" />";
                    vHTML += "</li > ";

                    if (_fnToNull(vResult[i]["DOC_DIV"]) == "일반입금표") {
                        vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"print\" onclick=\"fnCreateSlip('" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "');\"><span>인쇄</span></a></li> ";
                    } else if (_fnToNull(vResult[i]["DOC_DIV"]) == "대리점입금표"){
                        vHTML += " <li class=\"btn2\"><a href=\"javascript:void(0)\" class=\"print\" onclick=\"fnKeep_CreateSlip('" + _fnToNull(vResult[i]["TAX_DOC_NO"]) + "');\"><span>인쇄</span></a></li> ";
                    }
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
                        vHTML += "   			<li>대납 총합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_WF_AMT"])) + "</li> ";
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
                        vHTML += "   			<li>대납 총합계 : " + fnSetComma(_fnToNull(vResult[i]["TOT_WF_AMT"])) + "</li> ";
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

//세금계산서 인쇄 Log
function fnMakeTaxPrintLog(vJsonData) {

    var vJson = "";
    var vResult = JSON.parse(vJsonData).Data;

    $.each(vResult, function (i) {
        vJson += "TAX_DOC_NO = " + _fnToNull(vResult[i]["TAX_DOC_NO"]);
        vJson += ",ETAX_APPV_NO = " + _fnToNull(vResult[i]["ETAX_APPV_NO"]);
        vJson += ",TAX_MGMT_NO = " + _fnToNull(vResult[i]["TAX_MGMT_NO"]);
        vJson += ",SUP_BUSN_ID = " + _fnToNull(vResult[i]["SUP_BUSN_ID"]);
        vJson += ",DMD_BUSN_ID = " + _fnToNull(vResult[i]["DMD_BUSN_ID"]);
    });

    vJson = vJson.substring(0, 3999);

    return vJson;
}







//#endregion

//#endregion

//#region ☆☆☆☆☆☆☆사용자 화면 Event☆☆☆☆☆☆☆

//#region 상단 사용자 메뉴

//#region 회원정보 관련 이벤트

// 회원 정보 수정 클릭
$(document).on('click', '#Modify', function () {
    $('#UserModify').show();
});

// 회원 정보 수정 저장
$(document).on('click', "#ModMyPW", function () {


    if (fnUpdPwVali()) {
        fnUpdateUserPw();
    }

    //if (_fnToNull($("#mod_pw").val()) != "" && _fnToNull($("#mod_chk_pw").val()) != "") { // 입력 했을때
    //    if (fnComparePws()) {
    //        fnUpdateUserPw();
    //        //fnPrePare();
            
    //    }
    //    else {
    //        _fnalert("변경할 비밀번호가 일치하지 않습니다.");
    //    }
    //}
    //else {
    //    _fnalert("변경할 비밀번호를 입력해주세요.");
    //}
});

//회원정보 수정 창 닫기
$(document).on('click', ".mod_close_pop", function () {
    initUpdUsrPop();
});



//#endregion

//로그 아웃
$(document).on("click", "#Logout", function () {
    $.ajax({
        type :"POST",
        url: '/Home/LogOut',
        async: false,
        success: function (result, status, xhr) {
            //#region 세션 초기화
            //#endregion
            location.href = window.location.origin;
        }
    });
});

//#endregion

//#region 조회조건 이벤트

// 포커스 아웃시 날짜 셋팅
$(document).on("focusout", "#S_Edoc_FristDate", function () {
    $(this).val( _fnFormatDate($(this).val()));
});
   
$(document).on("focusout", "#S_Edoc_LastDate", function () {
    $(this).val(_fnFormatDate($(this).val()));
});

$(document).keyup(function (e) { 
    if (e.keyCode == 13) {
        if ($(e.target).attr('data-index') != undefined) {
            if ($(e.target).attr('data-index').indexOf("") > -1) {
                var vIndex = $(e.target).attr('data-index').replace("sch", "");

                if (vIndex != 5) {
                    $('[data-index="sch' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else {
                    $("#Search_list").click();
                }
            }
        }
        else {
            event.preventDefault();
        }
    }
});


//사업자구분 
$(document).on("change", "input[name='entrepreneur']", function () {
    _vBUSN_TYPE = $("input[name='entrepreneur']:checked").val(); //구분 값 가져오기

    if (_fnToNull(_vBUSN_TYPE) != "") {

        if (_fnToNull(_vBUSN_TYPE) == "01") { //공급하는자
            $("#busn_txt").text("공급받는자");
        }
        else { //공급받는자
            $("#busn_txt").text("공급하는자");
        }
    }
});


//일자 구간 선택 버튼
$(document).on('click', ".S_choice_term", function () {
    var term = _fnToNull($(this).attr("name"));

    $("#S_Edoc_LastDate").val(new Date().getFullYear() + "-" + _pad(new String(new Date().getMonth() + 1), 2) + "-" + _pad(new String(new Date().getDate()), 2));

    $("#S_Edoc_FristDate").val(fnSetWeekDate(term));
});

//리스트 검색
$(document).on("click", "#Search_list", function () {
    _vPage = 0;
    if (fnAmtListSerchVail()) {
        NewSearch = true;
        fnSearchListData();
    }
    
    
});


//전송상태 전체 클릭
$(document).on("click", "#all", function () {
    if ($(this).prop("checked")) {//전체클릭시 나머지 옵션 체크 해제
        $("input[name='S_Edoc_Status']").prop("checked", false);
    }
});

//전송상태 단일조건 클릭
$(document).on("click", "input[name='S_Edoc_Status']", function () {
    if ($(this).prop("checked")) {
        $("#all").prop("checked", false);
    }
});

//세금 구분 클릭
$(document).on('click', '#vat_all', function () {
    if ($(this).prop("checked")) {
        $("input[name='S_Tax_chk']").prop("checked", false);
    }
});

//세금 구분 단일 조건 클릭

$(document).on('click', "input[name='S_Tax_chk']", function () {
    if ($(this).prop("checked")) {
        $("#vat_all").prop("checked", false);
    }
});

//#endregion

//#region 리스트 메뉴



//엑셀 다운로드
$(document).on("click", "#Down_list", function () {
    if (!$(this).hasClass("none")) {
        fnExcelDownload();
    } 
});



//상세내역 - 세금계산서
$(document).on("click", ".bill_popup", function () {
    fnTaxSearchData($(this).parent().find("input[type=hidden]").val()); //세금계산서 레이어팝업 검색 함수
});

//상세내역 - 입금표
$(document).on("click", ".bill_popup2", function () {
    fnCreditSearchData($(this).parent().find("input[type=hidden]").val());//입금표 레이어팝업 검색 함수
});


//#region 상세보기 팝업 내 메뉴

//#region 인쇄 기능
//세금계산서 레포트 함수
function fnTaxPrint(vTaxNo) {

    try {

        var projectName = "ELVIS-BILL";
        var formName = "TaxBill_DB";

        //데이터셋
        var dataset_0 = [{ "": "" }];

        //데이터셋 Object
        var datasetList = {};
        datasetList.dataset_0 = JSON.stringify(dataset_0);

        var paramList = {};
        paramList.TAX_NO = "('" + _fnToNull(vTaxNo) + "')";

        _fn_viewer_open(projectName, formName, datasetList, paramList);

        //TWKIM - REPORT 인감 세팅
        //var projectName = "ELVIS-BILL";
        //var formName = "TaxBill_DB";
        //
        ////데이터셋
        //var objJsonData = new Object();
        //objJsonData.URL = ""; //URL 데이터만 넣으면 될듯. 인감 데이터 가져올 수 있는 함수를 만들어야될 듯.
        //
        ////데이터셋 Object
        //var datasetList = {};
        //datasetList.dataset_0 = _fnMakeJson(objJsonData);
        //
        //var paramList = {};
        //paramList.TAX_NO = "('" + _fnToNull(vTaxNo) + "')";
        //
        //_fn_viewer_open(projectName, formName, datasetList, paramList);

        //TWKIM - 예전 데이터
        //var objJsonData = new Object();

        //Test 자료
        //objJsonData.TAX_DOC_NO = "20200521101144YJTESTT0001"; //4개
        //objJsonData.TAX_DOC_NO = "20200911180522YJTESTT0001"; //7개
        //objJsonData.TAX_DOC_NO = "20200917191452YJTESTT0002"; //32개

        //objJsonData.TAX_DOC_NO = _fnToNull(vTaxNo);
        //objJsonData.LOGIN_TYPE = _SearchType; //E-MAIL - E / Site - S
        //objJsonData.KEY_NO = _Edoc_Value;

        //$.ajax({
        //    type: "POST",
        //    url: "/Edoc/fnTaxPrint",
        //    async: false, //동기식 , 비동기식
        //    dataType: "json",
        //    //data: callObj,
        //    data: { "vJsonData": _fnMakeJson(objJsonData) },
        //    success: function (result) {
        //        if (result == null) {
        //            _fnalert("담당자에게 문의 해 주세요.");
        //        } else {
        //            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
        //                var projectName = "ELVIS-BILL";
        //                var formName = "TaxBill";
        //
        //                var vTax_Info = _fnMakeJson(JSON.parse(result).Data);                        
        //
        //                var vJson = fnMakeTaxPrintLog(result);
        //                //var vJsonData = JSON.parse(result).Data;
        //                objJsonData.JSON_DATA = vJson;
        //
        //                //데이터셋 List
        //                var datasetList = {};
        //                //datasetList.ReportDS = JSON.stringify(vTax_Info);
        //                datasetList.ReportDS = vTax_Info;
        //
        //                var paramList = {};
        //
        //                //[PRINT]로그 보내기
        //                $.ajax({
        //                    type: "POST",
        //                    url: "/Edoc/fnTaxPrint_PRINT",
        //                    async: false, //동기식 , 비동기식
        //                    //data: callObj,
        //                    data: { "vJsonData": _fnMakeJson(objJsonData) }                            
        //                });
        //
        //                _fn_viewer_open(projectName, formName, datasetList, paramList);
        //
        //                //로그 보내기
        //                $.ajax({
        //                    type: "POST",
        //                    url: "/Edoc/fnTaxPrint_END",
        //                    async: false, //동기식 , 비동기식
        //                    //data: callObj,
        //                    data: { "vJsonData": _fnMakeJson(objJsonData) }
        //                });
        //
        //            } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
        //                _fnalert("데이터가 없습니다.");
        //                console.log("데이터가 없습니다.");
        //            } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
        //
        //                var projectName = "ELVIS-BILL";
        //                var formName = "TaxBill";
        //
        //                var vTax_Info = _fnMakeJson(JSON.parse(result).Data);
        //
        //                //데이터셋 List
        //                var datasetList = {};
        //                //datasetList.ReportDS = JSON.stringify(vTax_Info);
        //                datasetList.ReportDS = vTax_Info;
        //
        //                var paramList = {};
        //
        //                _fn_viewer_open(projectName, formName, datasetList, paramList);
        //                console.log("[세금계산서 레포트 : fnTaxPrint]" + JSON.parse(result).Result[0]["trxMsg"]);
        //            }
        //        }
        //    },
        //    error: function (xhr, status, error) {
        //        if (JSON.parse(result).Result[0]["trxCode"] == "E") {
        //            _fnalert("담당자에게 문의 하세요.");
        //            console.log(JSON.parse(result).Result[0]["trxMsg"]);
        //        }
        //    }
        //});

    } catch (e) {
        console.log(e.message);
    }
}

//일반입금서
function fnCreateSlip(vCrnNo) {
    try {

        var projectName = "ELVIS-BILL";
        var formName = "CreateSlip_DB";

        //데이터셋
        var dataset_0 = [{ "": "" }];

        //데이터셋 Object
        var datasetList = {};
        datasetList.dataset_0 = JSON.stringify(dataset_0);

        var paramList = {};
        paramList.CRD_DOC_NO = "('" + _fnToNull(vCrnNo) + "')";

        _fn_viewer_open(projectName, formName, datasetList, paramList);

        //var objJsonData = new Object();
        //
        ////objJsonData.CRD_DOC_NO = "20200908205229YJTESTR0001"; //Test
        //objJsonData.CRD_DOC_NO = _fnToNull(vCrnNo);
        //
        //$.ajax({
        //    type: "POST",
        //    url: "/Edoc/fnCreateSlip",
        //    async: true, //동기식 , 비동기식
        //    dataType: "json",
        //    //data: callObj,
        //    data: { "vJsonData": _fnMakeJson(objJsonData) },
        //    success: function (result) {
        //        if (result == null) {
        //            _fnalert("담당자에게 문의 해 주세요.");
        //        } else {
        //            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
        //                var projectName = "ELVIS-BILL";
        //                var formName = "CreateSlip";
        //
        //                var vTax_Info = _fnMakeJson(JSON.parse(result).Data);
        //
        //                //데이터셋 List
        //                var datasetList = {};
        //                //datasetList.ReportDS = JSON.stringify(vTax_Info);
        //                datasetList.CreateSlip = vTax_Info;
        //
        //                var paramList = {};
        //
        //                _fn_viewer_open(projectName, formName, datasetList, paramList);
        //            } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
        //                _fnalert("데이터가 없습니다.");
        //                console.log("데이터가 없습니다.");
        //            }
        //        }
        //    },
        //    error: function (xhr, status, error) {
        //        $("#ProgressBar_Loading").hide(); //프로그래스 바
        //        _fnalert("담당자에게 문의 하세요.");
        //        console.log(error);
        //    },
        //    beforeSend: function () {
        //        $("#ProgressBar_Loading").show(); //프로그래스 바
        //    },
        //    complete: function () {
        //        $("#ProgressBar_Loading").hide(); //프로그래스 바
        //    }
        //});

    } catch (e) {
        console.log(e.message);
    }
}

//대리점입금서
function fnKeep_CreateSlip(vCrnNo) {
    try {

        var projectName = "ELVIS-BILL";
        var formName = "Keep_CreateSlip_DB";

        //데이터셋
        var dataset_0 = [{ "": "" }];

        //데이터셋 Object
        var datasetList = {};
        datasetList.dataset_0 = JSON.stringify(dataset_0);

        var paramList = {};
        paramList.CRD_DOC_NO = "('" + _fnToNull(vCrnNo) + "')";

        _fn_viewer_open(projectName, formName, datasetList, paramList);

        //var objJsonData = new Object();
        //
        ////objJsonData.CRD_DOC_NO = "20200908205241YJTESTR0002"; //Test
        //objJsonData.CRD_DOC_NO = _fnToNull(vCrnNo);
        //
        //$.ajax({
        //    type: "POST",
        //    url: "/Edoc/fnKeep_CreateSlip",
        //    async: true, //동기식 , 비동기식
        //    dataType: "json",
        //    //data: callObj,
        //    data: { "vJsonData": _fnMakeJson(objJsonData) },
        //    success: function (result) {
        //        if (result == null) {
        //            _fnalert("담당자에게 문의 해 주세요.");
        //        } else {
        //            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
        //                var projectName = "ELVIS-BILL";
        //                var formName = "Keep_CreateSlip";
        //
        //                var vTax_Info = _fnMakeJson(JSON.parse(result).Data);
        //
        //                //데이터셋 List
        //                var datasetList = {};
        //                //datasetList.ReportDS = JSON.stringify(vTax_Info);
        //                datasetList.Keep_CreateSlip = vTax_Info;
        //
        //                var paramList = {};
        //
        //                _fn_viewer_open(projectName, formName, datasetList, paramList);
        //            } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
        //                _fnalert("데이터가 없습니다.");
        //                console.log("데이터가 없습니다.");
        //            }
        //        }
        //    },
        //    error: function (xhr, status, error) {
        //        $("#ProgressBar_Loading").hide(); //프로그래스 바
        //        _fnalert("담당자에게 문의 하세요.");
        //        console.log(error);
        //    },
        //    beforeSend: function () {
        //        $("#ProgressBar_Loading").show(); //프로그래스 바
        //    },
        //    complete: function () {
        //        $("#ProgressBar_Loading").hide(); //프로그래스 바
        //    }
        //});

    } catch (e) {
        console.log(e.message);
    }
}


//#endregion

//xml 다운로드
function fnXMLDownload(vXMLPath) {

    try {

        var objJsonData = new Object();

        objJsonData.XML_Path = vXMLPath;

        $.ajax({
            type: "POST",
            url: "/FIle/fnXmlFileDownload",
            dataType: "json",
            async: true, //동기식 , 비동기식
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    window.location.href = _HomeUrl + "/File/FileDownload?FILE_PATH=" + JSON.parse(result).Data[0]["File_Path"] + "&FILE_NM=" + JSON.parse(result).Data[0]["File_Name"];
                } else {
                    console.log(result);
                }
            },
            error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnalert("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });

    } catch (e) {
        console.log(e.message);
    }
}

//파일 다운로드 로직 
function fnFileDownload(vFile, vPath, vREPLACE_FILE_NM) {

    try {

        var objJsonData = new Object();

        objJsonData.FILE_NM = vFile;
        objJsonData.FILE_PATH = vPath;
        objJsonData.REPLACE_FILE_NM = vREPLACE_FILE_NM;

        $.ajax({
            type: "POST",
            url: "/FIle/fnFileDownload",
            dataType: "json",
            async: true, //동기식 , 비동기식
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                console.log(result);
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    window.location.href = _HomeUrl + "/File/FileDownload?FILE_PATH=" + JSON.parse(result).Data[0]["File_Path"] + "&FILE_NM=" + JSON.parse(result).Data[0]["File_Name"];
                }
            },
            error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnalert("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });

    } catch (e) {
        console.log(e.message);
    }
}

//#endregion


//#endregion

//#endregion



//#region ☆☆☆☆☆☆☆Func☆☆☆☆☆☆☆


//#region ★★★상단 메뉴얼 함수★★★

//업데이트 비밀번호 일치 확인
function fnComparePws() {
    var pw1 = _fnToNull($("#mod_pw").val());
    var pw2 = _fnToNull($("#mod_chk_pw").val());
    if ((pw1 != pw2)) {
        return false;
    }
    UpdPw = pw1;
    return true;
}


function fnUpdPwVali() {
    if (_fnToNull($("#mod_pw").val()) == "") {
        _fnalert("변경할 비밀번호를 입력해주세요.");
        return false;
    }

    if (_fnToNull($("#mod_chk_pw").val()) == "") {
        _fnalert("비밀번호 확인을 입력해주세요.");
        return false;
    }

    if (_fnToNull($("#mod_pw").val()).length < 8) {
        _fnalert("변경하실 비밀번호는 8자리 이상 입력해주세요.");

        //초기화
        $("#mod_pw").val('');
        $("#mod_chk_pw").val('');
        //$("#mod_pw").focus();

        return false;
    }

    if (_fnToNull($("#mod_pw").val()) != "") {
        if ( _fnToNull($("#mod_pw").val()) != _fnToNull($("#mod_chk_pw").val()) ) {
            _fnalert("변경할 비밀번호가 일치하지 않습니다.");
            return false;
        }
        
    }


    return true;
}


//팝업 초기화
function initUpdUsrPop() {
    $("#mod_pw").val("");
    $("#mod_chk_pw").val("");

    $("#UserModify").hide();
}

//계정 비밀번호 업데이트
function fnUpdateUserPw() {
    var UpdObj = new Object();

    UpdObj.USER_ID = _fnToNull($("#Session_USR_ID").val());
    UpdObj.BUSN_NO = _fnToNull($("#Session_BUSN_NO").val());
    UpdObj.UPD_PW = _fnToNull($('#mod_pw').val());

    $.ajax({
        type: "POST",
        url: "Home/UpdatePW",
        async: false,
        data: { "vJsonData": _fnMakeJson(UpdObj) },
        success: function (result) {
            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                initUpdUsrPop();
                _fnalert("비밀번호 변경이 완료되었습니다.");
            }
        },
        error: function (xhr, status, error) {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
            _fnalert("담당자에게 문의 하세요.");
            console.log(error);
        },
        beforeSend: function () {
            $("#ProgressBar_Loading").show(); //프로그래스 바
        },
        complete: function () {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
        }
    });
}




//#endregion 

//#region ★★★조회조건 함수★★★
//날짜 셋팅 함수
function fnSetWeekDate(vDate) {
    var vPrevDate;
    var vNowDate = new Date().getFullYear() + "-" + _pad(new Date().getMonth() + 1, 2) + "-" + + _pad(new Date().getDate(), 2);

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

//검색 
function fnSearchListData() {
    ParamObj = new Object();

    //#region 파라미터 생성

    //사업자 등록번호(로그인한 업체)
    ParamObj.BUSN_NO = _fnToNull($("#Session_BUSN_NO").val());

    //사업자 구분
    ParamObj.BUSN_TYPE = $("input[name='entrepreneur']:checked").val();

    //일자 타입
    ParamObj.SAECH_DT_TYPE = $("#DT_TYPE").val();
    //날짜
    ParamObj.S_DATE = $("#S_Edoc_FristDate").val().replace(/-/gi, "");
    ParamObj.E_DATE = $("#S_Edoc_LastDate").val().replace(/-/gi, "");

    //문서종류

    ParamObj.ChkBill = $("#S_chk_bill").prop("checked") ? "true" : "";
    ParamObj.ChkCredit = $("#S_chk_credit").prop("checked") ? "true" : "";


    //공급하는자/받는자 사업자명
    if (_fnToNull($("#input_Trade_Nm").val()) != "") {
        ParamObj.TRADE_NM = _fnToNull($("#input_Trade_Nm").val());
    }
    //계산서 번호
    if (_fnToNull($("#input_Tax_No").val()) != "") {
        ParamObj.TAX_MGMT_NO = _fnToNull($("#input_Tax_No").val());
    }

    //BL 번호
    if (_fnToNull($("#input_Bl_No").val()) != "") {
        ParamObj.BL_NO = _fnToNull($("#input_Bl_No").val());
    }

    //전송상태
    if ($("#all").prop("checked")) {
        ParamObj.ChkState = "A";
    }
    else {
        var vChkValue = "";
        $("input[name='S_Edoc_Status']:checked").each(function () {
            if (vChkValue == "") {
                vChkValue += "'" + $(this).val() + "'";
            }
            else {
                vChkValue += ",'" + $(this).val() + "'";
            }
        });
        ParamObj.ChkState = vChkValue;
    }

    //세금구분
    var vChkTax = "";
    if ($("#vat_all").prop("checked")) {
        vChkTax = "A";
    }
    else {
        $("input[name='S_Tax_chk']:checked").each(function () {
            if (vChkTax == "") {
                vChkTax += "'" + $(this).val() + "'";
            }
            else {
                vChkTax += ",'" + $(this).val() + "'";
            }
        });
    }
    

    ParamObj.ChkVat = vChkTax;

    //합계 로직 분개를 위한 Flag 값
    ParamObj.NEW_SEARCH = NewSearch ? "1" : "2";
    


    if (_vPage == 0) {
        _vPage = 1;
        ParamObj.PAGE = 1;
    }
    else {
        ParamObj.PAGE = _vPage;
    }

    _vTotalPage = 10 * _vPage;

    //#endregion

    $.ajax({
        type: "POST",
        url: "/MyEdoc/fnMySearchList",
        async: true,
        data: { "vJsonData": _fnMakeJson(ParamObj) },
        success: function (result) {
            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                fnMakeTaxList(result);
                fnPaging(JSON.parse(result).List[0]["TOTCNT"], 10, 5, ParamObj.PAGE);
                if (NewSearch) {
                    fnMakeTotCount(result);
                }
            }
            else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                if (!$("#Down_list").hasClass('none')) {
                    $("#Down_list").addClass('none');
                }
                _fnalert("자료가 없습니다.");
                $(".bill_box").empty();
                /*$("#footer").css('bottom', '0');*/
                $("#Paging_List_Area").empty();
                fnInitTotalAmt();
            }
            else {
                _fnalert("담당자에게 문의 하세요.");
            }
        },
        error: function (xhr, status, error) {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
            _fnalert("담당자에게 문의 하세요.");
            console.log(error);
        },
        beforeSend: function () {
            $("#ProgressBar_Loading").show(); //프로그래스 바
        },
        complete: function () {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
        }
    });
}

function fnAmtListSerchVail() {
    if (_fnToNull($("#S_Edoc_FristDate")).val() == "") {
        _fnalert("시작일자를 입력해주세요.");
        return false;
    }
    if (_fnToNull($("#S_Edoc_LastDate")).val() == "") {
        _fnalert("종료일자를 입력해주세요.");
        return false;
    }


    return true;
}

//#endregion

//#region ★★★ 리스트 함수 ★★★

//#region 팝업 함수 

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
                    _fnalert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                        //레이어 팝업 초기화 함수
                        fnMakeTaxLayerInit();
                        //레이어 팝업 데이터 찍어주는 함수
                        fnMakeTaxLayerData(result);
                        //레이어 팝업 찍어주기.
                        $(".layerPopup_bg").show();
                        $(".layerPopup_bill").show();
                        $("#wrap").addClass("noscroll");
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        _fnalert("데이터가 없습니다.");
                    }
                }
            },
            error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnalert("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
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
                    _fnalert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
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
                        $("#wrap").addClass("noscroll");
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        _fnalert("데이터가 없습니다.");
                    }
                }
            },
            error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnalert("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });
    }
    catch (e) {
        console.log(e.message);
    }
}

//팝업 닫기 (layerPopup_bill , layerPopup_bill2 )
function fnLayerClose(vLayerNM) {
    $(".layerPopup_bg").hide();
    $("#wrap").removeClass("noscroll");
    $("." + vLayerNM).hide();
}

//#endregion


//#region 초기화 함수

//합계 초기화 함수
function fnInitTotalAmt() {
    //총 건수
    $("#amt_tot_cnt").text('0');
    //공가금액
    $("#sup_tot").text('0');
    //부가세액
    $("#vat_tot").text('0');
    //대납비용
    $("#wf_tot").text('0');
    //합계
    $("#amt_tot").text('0');
}

//세금계산서 레이어팝업 데이터 초기화
function fnMakeTaxLayerInit() {
    //세금계산서 Header init 
    $("span[name='EdocLayer_Title']").text("");
    $("input[name='EdocLayer_ChkNormalBill']").prop("checked", false);
    $("input[name='EdocLayer_ChkModifyBill']").prop("checked", false);
    $("input[name='EdocLayer_ChkAgency']").prop("checked", false);
    $("input[name='EdocLayer_ChkNormalBill']").attr("disabled", true);
    $("input[name='EdocLayer_ChkModifyBill']").attr("disabled", true);
    $("input[name='EdocLayer_ChkAgency']").attr("disabled", true);


    $("input[name='EdocLayer_ChkGwase']").prop("checked", false);
    $("input[name='EdocLayer_ChkYeongse']").prop("checked", false);
    $("input[name='EdocLayer_ChkMyeonse']").prop("checked", false);
    $("input[name='EdocLayer_ChkGwase']").attr("disabled", true);
    $("input[name='EdocLayer_ChkYeongse']").attr("disabled", true);
    $("input[name='EdocLayer_ChkMyeonse']").attr("disabled", true);
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


//엑셀 다운로드 로직
function fnExcelDownload() {
    try {

        $.ajax({
            type: "POST",
            async: true, //동기식 , 비동기식
            url: "/Excel/DownloadAllExcel",
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(ParamObj) },
            success: function (result) {
                if (result == null) {
                    _fnalert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        //alert("성공");
                        ////파일 다운로드 GET 방식
                        window.location = _HomeUrl + "/Excel/Down_ExcelFile?strEXCEL_FILENM=" + JSON.parse(result).FILE_UPLOAD[0]["EXCEL_FILENM"] + "&strEXCEL_PATH=" + JSON.parse(result).FILE_UPLOAD[0]["EXCEL_PATH"];

                        ////다운로드 받는 딜레이를 주지 않으면 다운 받는 도중에 삭제 되서 오류 남. (추후 엑셀 파일 지우는건 배치파일로 지우는것도 고려 해 봐야 됨.)
                        //_fnsleep(5000);

                        ////파일 delete 로직
                        //fnDelExcelFile(result);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        _fnalert("데이터가 없습니다.");
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        _fnalert("[Error]관리자에게 문의 해 주세요.");
                        console.log(result);
                    }
                }
            },
            error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnalert("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });
    }
    catch (e) {
        console.log(e.message);
    }
}

//#endregion


//페이지 이동
function goPage(pageIndex) {
    _vPage = pageIndex
    fnSearchListData();
}

//#endregion


//#endregion


//#region ☆☆☆☆☆☆☆Draw Area☆☆☆☆☆☆☆

//계산서 리스트 그리기
function fnMakeTaxList(vJsonData) {

    var vResult = JSON.parse(vJsonData).List;
    var vHtml = "";
    var totPage = _fnToNull(vResult[0]["TOT_PAGE"]);
    if (vResult.length > 0) {//10건씩
        $("#Down_list").removeClass("none");
        /*$("#footer").css('bottom', 'unset');*/
        //초기화
        $(".bill_box").empty();


        //리스트 그리기
        $.each(vResult, function (i) {
            vHtml += "  <div class='bill_list__box'>";
            vHtml += "      <div class='bill_list'>";

            //#region 관리번호|발행일|전송상태(작업중)|작성일
            vHtml += "          <div class='bill_col'>";
            //#region 관리번호(완)|전송상태(작업중)
            vHtml += "              <div class='bill_col-a'>";
            //#region 관리번호
            vHtml += "                  <div class='bill_bind'>";
            if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "T") {
                vHtml += "                      <div class='bill_tit'><p>계산서번호</p></div>";
                vHtml += "                      <div class='bill_num text-left'><a class='bill_popup'>" + _fnToNull(vResult[i]["TAX_MGMT_NO"]) + "</a><input type='hidden' value='"+_fnToNull(vResult[i]["TAX_DOC_NO"])+"'></div>";
            }
            else if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) == "R") {
                vHtml += "                      <div class='bill_tit'><p>입금표번호</p></div>";
                vHtml += "                      <div class='bill_num text-left'><a class='bill_popup2'>" + _fnToNull(vResult[i]["TAX_MGMT_NO"]) + "</a><input type='hidden' value='" + _fnToNull(vResult[i]["TAX_DOC_NO"]) +"'></div>";
            }
            vHtml += "                  </div>";
            //#endregion
            //#region 전송상태(분개해야함)
            vHtml += "                  <div class='bill_bind'>";
            vHtml += "                      <div class='bill_tit'><p>전송상태</p></div>";
            vHtml += "                      <div class='bill_stat text-left'>";
            //문서접수 or 승인 
            if (_fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "SO" || _fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "NA") { //내용 분기점
                vHtml += "                          <p class='status accept'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM1"]) + "</p>";
                if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) != "") {
                    if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NA") {//국세청접수
                        vHtml += "                  <p class='status accept'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</p>";
                    }
                    else if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NS") { //국세청승인
                        vHtml += "                  <p class='status approval'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</p>";
                    }
                    else if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NE") { //국세청오류
                        vHtml += "                  <p class='status cancel'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</p>";
                    }
                }
            }
            //승인 | 국세청 승인
            else if (_fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "BS" || _fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "NS") {

                vHtml += "                      <p class='status approval'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM1"]) + "</p>";
                if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) != "") {
                    if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NA") {//국세청접수
                        vHtml += "                  <p class='status accept'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</p>";
                    }
                    else if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NS") { //국세청승인
                        vHtml += "                  <p class='status approval'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</p>";
                    }
                    else if (_fnToNull(vResult[i]["LAST_DOC_STATUS2"]) == "NE") { //국세청오류
                        vHtml += "                  <p class='status cancel'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM2"]) + "</p>";
                    }
                }
            }
            //거절 | 발행취소 | 국세청 오류
            else if (_fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "BR" || _fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "LF" || _fnToNull(vResult[i]["LAST_DOC_STATUS1"]) == "NE") {
                vHtml += "                      <p class='status cancel'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM1"]) + "</p>";
            }
            else {
                vHtml += "                      <p class='status accept'>" + _fnToNull(vResult[i]["LAST_DOC_STATUS_NM1"]) + "</p>";
            }
            vHtml += "                      </div>";
            vHtml += "                  </div>";
            //#endregion
            vHtml += "              </div>";
            //#endregion
            //#region 발행일(완)|작성일(완)
            vHtml += "              <div class='bill_col-a'>";
            //#region 발행일자
            vHtml += "                  <div class='bill_bind'>";
            vHtml += "                      <div class='bill_tit'><p>발행일자</p></div>";
            if (_fnToNull(vResult[i]["ISU_DATE"]) != "") {
                vHtml += "                      <div class='bill_cont-common text-center'><p>" + _fnFormatDate(_fnToNull(vResult[i]["ISU_DATE"])) + "</p></div>";
            }
            else {
                vHtml += "                      <div class='bill_cont-common text-center'><p>-</p></div>";
            }
            
            vHtml += "                  </div>";
            //#endregion
            //#region 작성일자
            vHtml += "                  <div class='bill_bind'>";
            vHtml += "                      <div class='bill_tit'><p>작성일자</p></div>";
            if (_fnToNull(vResult[i]["DOC_TYPE_CD"]) != "R"){
                vHtml += "                      <div class='bill_cont-common text-center'><p>" + _fnFormatDate(_fnToNull(vResult[i]["WRITE_DT"])) + "</p></div>";
            }
            else {
                vHtml += "                      <div class='bill_cont-common text-center'><p>-</p></div>";
            }
            vHtml += "                  </div>";
            //#endregion
            vHtml += "              </div>";
            //#endregion
            vHtml += "          </div>";
            //#endregion
            //#region 구분|공급하는자|BL||공급가액|부가세액|대납비용|합계
            vHtml += "          <div class='flex-column'>";
            //#region 구분(완)|공급하는자(완)|BL(완)
            vHtml += "              <div class='bill_col'>";
            vHtml += "                  <div class='bill_col-1'>";
            //#region 구분
            vHtml += "                      <div class='bill_bind'>";
            vHtml += "                          <div class='bill_tit'><p>구분</p></div>";
            if (_fnToNull(vResult[i]["ETAXBIL_TP_NM"]) != "") {
                vHtml += "                      <div class='bill_cont-common text-center'><p>" + _fnToNull(vResult[i]["DOC_DIV"]) + "(" + _fnToNull(vResult[i]["ETAXBIL_TP_NM"])+")</p></div>";
            }
            else {
                vHtml += "                      <div class='bill_cont-common text-center'><p>" + _fnToNull(vResult[i]["DOC_DIV"])+"</p></div>";
            }
            vHtml += "                          ";
            vHtml += "                      </div>";
            //#endregion
            //#region 공급하는자
            vHtml += "                      <div class='bill_bind'>";

            if (_fnToNull(vResult[i]["TRADE_TYPE"]) == "01") { // 공급하는자로 조회시
                vHtml += "                          <div class='bill_tit'><p>공급받는자</p></div>";
            }
            else if (_fnToNull(vResult[i]["TRADE_TYPE"]) == "02") { // 공급받는자로 조회시
                vHtml += "                          <div class='bill_tit'><p>공급하는자</p></div>";
            }
            vHtml += "                          <div class='bill_cont-common text-left'><p>" + _fnToNull(vResult[i]["DMDER_TRADE_NM"]) + "</p><input type='hidden' value='" + _fnToNull(vResult[i]["DMDER_TRADE_ID"])+"'></div>";
            vHtml += "                      </div>";
            //#endregion
            //#region BL
            vHtml += "                      <div class='bill_bind'>";
            vHtml += "                          <div class='bill_tit'><p>B/L NO</p></div>";
            vHtml += "                          <div class='bill_cont-common text-left'><p>" + _fnToNull(vResult[i]["BL_NO"])+"</p></div>";
            vHtml += "                      </div>";
            //#endregion
            vHtml += "                  </div>";
            vHtml += "              </div>";
            //#endregion
            //#region 공급가액(완)|부가세액(완)|대납비용(완)|합계(완)
            vHtml += "              <div class='bill_col'>";
            vHtml += "                  <div class='bill_col-1'>";
            //#region 공급가액
            vHtml += "                      <div class='bill_bind'>";
            vHtml += "                          <div class='bill_tit'><p>공급가액</p></div>";
            vHtml += "                          <div class='bill_cont-common2 text-right'><p>"+fnSetComma(_fnToNull(vResult[i]["SUP_SM_AMT"]))+"</p></div>";
            vHtml += "                      </div>";
            //#endregion
            //#region 부가세액
            vHtml += "                      <div class='bill_bind'>";
            vHtml += "                          <div class='bill_tit'><p>부가세액</p></div>";
            vHtml += "                          <div class='bill_cont-common2 text-right'><p>" + fnSetComma(_fnToNull(vResult[i]["VAT_SM_AMT"]))+"</p></div>";
            vHtml += "                      </div>";
            //#endregion
            //#region 대납비용
            vHtml += "                      <div class='bill_bind'>";
            vHtml += "                          <div class='bill_tit'><p>대납비용</p></div>";
            vHtml += "                          <div class='bill_cont-common2 text-right'><p>" + fnSetComma(_fnToNull(vResult[i]["WF_AMT"]))+"</p></div>";
            vHtml += "                      </div>";
            //#endregion
            //#region 합계
            vHtml += "                      <div class='bill_bind'>";
            vHtml += "                          <div class='bill_tit'><p>합계</p></div>";
            vHtml += "                          <div class='bill_cont-common2 text-right'><p>" + fnSetComma(_fnToNull(vResult[i]["TOT_AMT"])) +"</p></div>";
            vHtml += "                      </div>";
            //#endregion
            vHtml += "                  </div>";
            vHtml += "              </div>";
            //#endregion
            vHtml += "          </div>";
            //#endregion

            vHtml += "      </div>";
            vHtml += "  </div>";

        });

        $(".bill_box").append(vHtml);


    }
}

//상단 합계 그리기
function fnMakeTotCount(vJsonData) {
    var vResult = JSON.parse(vJsonData).Total;

    //총 건수
    $("#amt_tot_cnt").text(fnSetComma(_fnToNull(vResult[0]["AMT_CNT"])));
    //공가금액
    $("#sup_tot").text(fnSetComma(_fnToNull(vResult[0]["SUP_TOT"])));
    //부가세액
    $("#vat_tot").text(fnSetComma(_fnToNull(vResult[0]["VAT_TOT"])));
    //대납비용
    $("#wf_tot").text(fnSetComma(_fnToNull(vResult[0]["WF_TOT"])));
    //합계
    $("#amt_tot").text(fnSetComma(_fnToNull(vResult[0]["AMT_TOT"])));

}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
// pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
function fnPaging(totalData, dataPerPage, pageCount, currentPage) {
    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹            
    if (pageCount > totalPage) pageCount = totalPage;
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage) last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
    var next = currentPage + 1;
    var prev = first - 1;

    //$("#paging_list").empty();

    var prevPage;
    var nextPage;
    if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
    if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }

    var vHTML = "";

    vHTML += "   <ul> ";

    vHTML += "   	<li> ";
    vHTML += "   		<a href=\"javascript:;\" class=\"prev-first\" onclick=\"goPage(1)\"><span>맨앞으로</span></a> ";
    vHTML += "   	</li> ";
    vHTML += "   	<li> ";
    vHTML += "   		<a href=\"javascript:;\" class=\"prev\" onclick=\"goPage(" + prevPage + ")\"><span>이전으로</span></a> ";
    vHTML += "   	</li> ";

    for (var i = first; i <= last; i++) {
        if (i == currentPage) {
            vHTML += "   	<li> ";
            vHTML += "   		<a href=\"javascript:;\" class=\"active\">" + i + "<span></span></a> ";
            vHTML += "   	</li> ";
        } else {
            vHTML += "   	<li> ";
            vHTML += "   		<a href=\"javascript:;\" onclick=\"goPage(" + i + ")\">" + i + "<span></span></a> ";
            vHTML += "   	</li> ";
        }
    }

    vHTML += "   	<li> ";
    vHTML += "   		<a href=\"javascript:;\" class=\"next\" onclick=\"goPage(" + nextPage + ")\"><span>다음으로</span></a> ";
    vHTML += "   	</li> ";
    vHTML += "   	<li> ";
    vHTML += "   		<a href=\"javascript:;\" class=\"next-last\" onclick=\"goPage(" + totalPage + ")\"><span>맨뒤로</span></a> ";
    vHTML += "   	</li> ";

    vHTML += "   </ul> ";

    $("#Paging_List_Area")[0].innerHTML = vHTML; // 페이지 목록 생성
}


//#region 상세팝업 그리기
//세금계산서 레이어 팝업 데이터 그려주는 로직
function fnMakeTaxLayerData(vJsonData) {

    try {

        var vHTML = "";
        var vResult = JSON.parse(vJsonData).Data;

        //데이터를 먼저 뿌리기. //Data
        //List 만들어서 뿌리기  //List
        //Doc문서 확인          //Doc
        //첨부파일 그리기       //Attach

        //#region Data Setting

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
            $("input[name='EdocLayer_ChkNormalBill']").prop("checked", true)//.removeAttr("disabled");      
        } else if (_fnToNull(vResult[0]["TAX_DOC_DIV"]) == "02") {
            $("input[name='EdocLayer_ChkModifyBill']").prop("checked", true)//.removeAttr("disabled");      
        } else if (_fnToNull(vResult[0]["TAX_DOC_DIV"]) == "03") {
            $("input[name='EdocLayer_ChkAgency']").prop("checked", true)//.removeAttr("disabled");            
        }

        //레이어 팝업 체크박스 체크
        if (_fnToNull(vResult[0]["TAX_CLASS"]) == "01") {
            $("input[name='EdocLayer_ChkGwase']").prop("checked", true)//.removeAttr("disabled");
        } else if (_fnToNull(vResult[0]["TAX_CLASS"]) == "02") {
            $("input[name='EdocLayer_ChkYeongse']").prop("checked", true)//.removeAttr("disabled");
        } else if (_fnToNull(vResult[0]["TAX_CLASS"]) == "03") {
            $("input[name='EdocLayer_ChkMyeonse']").prop("checked", true)//.removeAttr("disabled");
        }

        if (_fnToNull(vResult[0]["LAST_DOC_STATUS"]) == "NS") {
            $("td[name='EdocLayer_EdocNo']").text(_fnToNull(vResult[0]["ETAX_APPV_NO"])); //승인번호
        }
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
        $("td[name='EdocLayer_VAT_AMT']").text(fnSetComma(_fnToNull(vResult[0]["VAT_SM_AMT"])));            //세액
        $("td[name='EdocLayer_BLNO']").text(_fnToNull(vResult[0]["BL_NO"]));                                //B/L NO
        $("td[name='EdocLayer_WF_AMT']").text(fnSetComma(_fnToNull(vResult[0]["WF_AMT"])));                 //대납비용
        $("td[name='EdocLayer_TOT_AMT']").text(fnSetComma(_fnToNull(vResult[0]["TOT_AMT"])));               //대납비용포함
        $("td[name='EdocLayer_ETC']").text(_fnToNull(vResult[0]["ETAXBIL_NOTE"]));                          //비고
        $("td[name='EdocLayer_DocType']").text(_fnToNull(vResult[0]["LAST_DOC_STATUS_NM"]));                   //문서상태

        $("span[name='EdocLayer_ListTotal']").text(_fnToNull(vResult[0]["DETAIL_CNT"]));                    //내역 총 개수


        //거절사유 - SO인 경우는 input / 그외는 텍스트만 찍어주기.
        vHTML = "";

        if (_fnToNull(vResult[0]["LAST_DOC_STATUS"]) == "SO") {
            vHTML += " <input type=\"text\" style=\"width:100%\" name=\"EdocLayer_InputReject\" maxlength=\"150\" disabled='disabled'/> ";

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
            vHTML += " <a href=\"javascript:void(0)\" class=\"btm_xml\" onclick=\"fnXMLDownload('" + _fnToNull(vResult[0]["XML_PATH"]) + "')\"><ins class=\"icon_down\"></ins>xml 다운로드</a> ";
            //vHTML += " <a href=\"javascript:void(0)\" class=\"btm_xml\" onclick=\"fnPrePare()\"'><ins class=\"icon_down\"></ins>xml 다운로드</a> ";

        } else {
            //vHTML += "검색결과 총 <span>" + _fnToNull(vResult[0]["DETAIL_CNT"]) +"</span>건";
            vHTML += " <span style=\"display:inline-block;vertical-align:top;margin-top:15px\">검색결과 총 <span class=\"red\">" + _fnToNull(vResult[0]["DETAIL_CNT"]) + "</span>건	</span> ";
        }

        $("p[name='EdocLayer_ListTotal_XMLPath']")[0].innerHTML = vHTML;
        $("p[name='EdocLayer_ListTotal_XMLPath']")[1].innerHTML = vHTML;

        //승인 , 거절 , 닫기 등 버튼 분기점 LAST_DOC_STATUS
        vHTML = "";

        if (_fnToNull(vResult[0]["LAST_DOC_STATUS"]) == "SO") {
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnTaxPrint('" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "');\"><ins class=\"icon_print\"></ins>발행 예정 내역서 인쇄</a></li> ";

            //twkim 20210622 추가 - 관리자용 페이지 일 경우 보이지 않게
            //현재페이지에선 사용불가기능으로 처리
            //if (_fnToNull($("#hidden_ContentType").val()) != "A") {
            //    vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnConfirm('approval', '" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "')\"><ins class=\"icon_ok\"></ins>승인</a></li> ";
            //    vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnConfirm('refuse', '" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "')\"><ins class=\"icon_no\"></ins>거절</a></li> "; 
            //}

            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";
        } else if (_fnToNull(vResult[0]["LAST_DOC_STATUS"]) == "NS") {
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnTaxPrint('" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "');\"><ins class=\"icon_print\"></ins>인쇄</a></li> ";
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";
        }
        else if (_fnToNull(vResult[0]["LAST_DOC_STATUS"]) == "BS") {
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnTaxPrint('" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "');\"><ins class=\"icon_print\"></ins>인쇄</a></li> ";
            //vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnTaxPrint('" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "');\"><ins class=\"icon_print\"></ins>발행 예정 내역서 인쇄</a></li> ";
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";
        }
        else if (_fnToNull(vResult[0]["LAST_DOC_STATUS"]) == "NA") {
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnTaxPrint('" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "');\"><ins class=\"icon_print\"></ins>인쇄</a></li> ";
            //vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnTaxPrint('" + _fnToNull(vResult[0]["TAX_DOC_NO"]) + "');\"><ins class=\"icon_print\"></ins>발행 예정 내역서 인쇄</a></li> ";
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";
        }
        else {
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";
        }

        $("#EdocLayer_StatusBtn_Area")[0].innerHTML = vHTML;
        //#endregion

        //#region 금액상세 리스트
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
            vHTML += " 	<td>" + _fnToNull(vResult[i]["SEQ_NO"]) + "</td> ";
            vHTML += " 	<td>" + _fnFormatDate(_fnToNull(vResult[i]["PURCHS_DT"])) + "</td> ";
            vHTML += " 	<td style=\"text-align:left\">" + _fnToNull(vResult[i]["THNG_NM"]) + "</td> ";
            vHTML += " 	<td>" + _fnToNull(vResult[i]["STNDRD_NM"]) + "</td> ";
            vHTML += " 	<td style=\"text-align:right\">" + fnSetComma(_fnToNull(vResult[i]["QTY"])) + "</td> ";
            vHTML += " 	<td style=\"text-align:right\">" + fnSetComma(_fnToNull(vResult[i]["UNT_PRC"])) + "</td> ";
            vHTML += " 	<td style=\"text-align:right\">" + fnSetComma(_fnToNull(vResult[i]["SUP_AMT"])) + "</td> ";
            vHTML += " 	<td style=\"text-align:right\">" + fnSetComma(_fnToNull(vResult[i]["VAT_AMT"])) + "</td> ";
            vHTML += " 	<td>" + _fnToNull(vResult[i]["NOTE"]) + "</td> ";
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
            vHTML += "   	<span class=\"partTitle\"><span>단가</span> : <span>" + fnSetComma(_fnToNull(vResult[i]["UNT_PRC"])) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>공급가액</span> : <span>" + fnSetComma(_fnToNull(vResult[i]["SUP_AMT"])) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>세액</span> : <span>" + fnSetComma(_fnToNull(vResult[i]["VAT_AMT"])) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>비고</span> : <span>" + _fnToNull(vResult[i]["NOTE"]) + "</span> </span> ";
            vHTML += "   </li> ";
        });

        $("ul[name='EdocLayer_ListArea_mo']")[0].innerHTML = vHTML;
        //#endregion

        //#region 문서
        vResult = JSON.parse(vJsonData).Doc;

        if (vResult.length > 0) {
            //CRD - 입금표
            if (_fnToNull(vResult[0]["DOC_TYPE"]) == "CRD") {
                //연계문서
                $("td[name='EdocLayer_Doc']").text("입금표");
            }
        }

        //#endregion

        //#region 첨부자료
        vResult = JSON.parse(vJsonData).Attach;

        vHTML = "";

        $.each(vResult, function (i) {
            if (vResult.length > 0) {
                vHTML += "<li onclick=\"fnFileDownload('" + _fnToNull(vResult[i]["FILE_NM"]) + "','" + _fnToNull(vResult[i]["FILE_PATH"]) + "','" + _fnToNull(vResult[i]["PRT_FILE_NM"]) + "')\" style=\"cursor: pointer; color: #1263CE;\">" + _fnToNull(vResult[i]["PRT_FILE_NM"]) + "</li>";
                //vHTML += "<li onclick=\"fnPrePare()\">" + _fnToNull(vResult[i]["FILE_NM"]) + "</li>";
            }
        });

        $("ul[name='EdocLayer_Attach']")[0].innerHTML = vHTML;
        $("td[name='EdocLayer_Attach']")[0].innerHTML = vHTML;

        //전체 다운로드는 추후 나중에 추가하는걸로 
        //if (vResult.length > 1) {
        //    $("td[name='EdocLayer_AllAttach']").text("전체다운로드");
        //}
        //#endregion
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
            $("table[name='EdocLayer2_DaeRiJum_Area']").show();
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
            vHTML += "   	<td style=\"text-align:left\">" + _fnToNull(vResult[i]["FRT_NM"]) + "</td> ";
            vHTML += "   	<td>" + _fnToNull(vResult[i]["CURR_CD"]) + "</td> ";
            vHTML += "   	<td style=\"text-align:right\">" + fnSetComma(_fnToNull(vResult[i]["EX_RATE"])) + "</td> ";
            vHTML += "   	<td style=\"text-align:right\">" + fnSetComma(_fnToNull(vResult[i]["FREGN_AMT"])) + "</td> ";
            vHTML += "   	<td style=\"text-align:right\">" + fnSetComma(_fnToNull(vResult[i]["LOCAL_AMT"])) + "</td> ";
            vHTML += "   </tr> ";
        });

        $("tbody[name='EdocLayer2_ListArea_pc']")[0].innerHTML = vHTML;

        vHTML = "";

        $.each(vResult, function (i) {
            vHTML += "   <li> ";
            vHTML += "   	<span class=\"partTitle\"><span>순번</span> : <span>" + _fnToNull(vResult[i]["SEQ_NO"]) + "</span></span> ";
            vHTML += "   	<span class=\"partTitle\"><span>품명</span> : <span>" + _fnToNull(vResult[i]["FRT_NM"]) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>Curr</span> : <span>" + _fnToNull(vResult[i]["CURR_CD"]) + "</span></span> ";
            vHTML += "   	<span class=\"partTitle\"><span>환율</span> : <span>" + fnSetComma(_fnToNull(vResult[i]["EX_RATE"])) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>외화금액</span> : <span>" + fnSetComma(_fnToNull(vResult[i]["FREGN_AMT"])) + "</span> </span> ";
            vHTML += "   	<span class=\"partTitle\"><span>원화금액</span> : <span>" + fnSetComma(_fnToNull(vResult[i]["LOCAL_AMT"])) + "</span> </span> ";
            vHTML += "   </li> ";
        });

        $("ul[name='EdocLayer2_ListArea_mo']")[0].innerHTML = vHTML;

        vResult = JSON.parse(vJsonData).Data;

        //인쇄 및 닫기 그려주기
        vHTML = "";

        if (_fnToNull(vResult[0]["DOC_DIV"]) == "C1") {
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnCreateSlip('" + _fnToNull(vResult[0]["CRD_DOC_NO"]) + "');\"><ins class=\"icon_print\"></ins>인쇄</a></li> ";
        } else if (_fnToNull(vResult[0]["DOC_DIV"]) == "C2") {
            vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnKeep_CreateSlip('" + _fnToNull(vResult[0]["CRD_DOC_NO"]) + "');\"><ins class=\"icon_print\"></ins>인쇄</a></li> ";
        }
        vHTML += " <li><a href=\"javascript:void(0)\" onclick=\"fnLayerClose('layerPopup_bill2')\"><ins class=\"icon_close\"></ins>닫기</a></li> ";

        $("#EdocLayer2_StatusBtn_Area")[0].innerHTML = vHTML;

    }
    catch (e) {
        console.log(e.message);
    }
}

//#endregion


//#endregion
