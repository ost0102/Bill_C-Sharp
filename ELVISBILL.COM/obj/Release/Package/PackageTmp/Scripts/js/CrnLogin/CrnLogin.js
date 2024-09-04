////////////////////전역 변수//////////////////////////
//_vContentType = _fnToNull(_fnGetParam("")); // 공급자(S)  /   default : 공급받는자(B)
var _vSearchType = _fnToNull(_fnGetParam("searchtype")); // 번호기준(N) / 담당자(S) / 이메일(E)
var _vN_Value = _fnToNull(_fnGetParam("nvalue")); // 번호기준 : B/L No or Invoice No or 계산서 번호
////////////////////jquery event///////////////////////
$(function () {
    //alert(_vSearchType);      
    //alert(_vN_Value);
});

//Get 형식 데이터 파싱 먼저하기
$(document).on("click", "#Login_CheckCrn", function () {
    //alert("사업자 번호 체크");
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
////////////////////////function///////////////////////
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
                        alert("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                    } else {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {                            
                            fnGetEdocDate(result);
                        }
                        else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                            $("#warning_text").show();
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

//Crn 검색 벨리데이션 체크
function fnCrnValidation() {

    if (_fnToNull($("#Login_InputCrn").val()) == "") {
        alert("사업자 번호를 입력하세요.");
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
                //window.location.href = "http://localhost:60931/Edoc";
            }
        });
    } catch (e) {
        console.log(e.message);
    }

}

/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

