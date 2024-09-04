////////////////////전역 변수//////////////////////////
var vContentType = "";
var vSearchType = "";
var vCRN_NO = "";
var vN_Value = "";
////////////////////jquery event///////////////////////
$(function () {    

    //get 방식

    vContentType = _fnToNull(_fnGetParam("ContentType"));
    vSearchType = _fnToNull(_fnGetParam("SearchType"));
    vCRN_NO = _fnToNull(_fnGetParam("CRN_NO"));
    vN_Value = _fnToNull(_fnGetParam("N_Value"));

    console.log("vContentType : "+vContentType);
    console.log("vSearchType : "+vSearchType);
    console.log("vCRN_NO : "+vCRN_NO);
    console.log("vN_Value : "+vN_Value);

    fnSearchData();
});

////////////////////////function///////////////////////
//엘비스 빌 검색
function fnSearchData() {
    try {

        var objJsonData = new Object();
        objJsonData.DOMAIN = window.location.origin;

        //alert("번호기준");
        objJsonData.ContentType = vContentType;
        objJsonData.SearchType = vSearchType;
        objJsonData.CRN_NO = vCRN_NO;
        objJsonData.N_Value = vN_Value;

        $.ajax({
            type: "POST",
            url: "/Edoc/EdocView",
            data: objJsonData,
            success: function (result) {
                window.location.href = window.location.origin + "/Edoc";
            }
        });

    } catch (e) {
        console.log(e.message);
    }
}
/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

