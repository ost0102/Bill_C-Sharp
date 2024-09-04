////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
//$(function () {
//          
//});

//Enter key 입력 했을 때 이동 및 검색을 위한 이벤트
$(document).keyup(function (e) {

    if (e.keyCode == 13) {//키가 13이면 실행 (엔터는 13)

        if ($(e.target).attr('data-index') != undefined) {
            if ($(e.target).attr('data-index').indexOf("N_Search") > -1) {
                var vIndex = $(e.target).attr('data-index').replace("N_Search", "");

                if (vIndex == "1") {
                    $('[data-index="N_Search' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == "2") {
                    fnSearchData();
                }
            }

            if ($(e.target).attr('data-index').indexOf("S_Search") > -1) {
                var vIndex = $(e.target).attr('data-index').replace("S_Search", "");

                if (vIndex == "1") {
                    $('[data-index="S_Search' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == "2") {
                    fnSearchData();
                }
            }
        }
    }

});


////////////////////////function///////////////////////

/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

