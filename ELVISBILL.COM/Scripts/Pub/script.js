$(document).ready(function () {
	/*
	$(".mainslider_wrap .mainslider li .box").css({ height: $(window).height() + "px" })
	$(window).resize(function(){
		$(".mainslider_wrap .mainslider li .box").css({height:$(window).height()+"px"})
	}) */

	//var clickslider = $(".mainslider_wrap .mainslider").bxSlider({
	//	mode: "fade",     
	//	slideWidth: 0,
	//	slideMargin: 0,
	//	minSlides: 1,
	//	maxSlides: 1,
	//	moveSlides: 0,
	//	startSlide: 0,        
	//	infiniteLoop: true,   
	//	//captions: true,     
	//	pager: false,          
	//	pagerType: "full",    		
	//	adaptiveHeight: true,   
	//	auto: true,            
	//	autoControls: false,    
	//	autoHover: false,      
	//	pause: 8000,           
	//	speed: 800,           
	//	//easing: "easeInOutCirc",			
	//	touchEnabled:true,  			
	//	controls: true,       
	//	prevSelector: '#visual_btn_L',     
	//	nextSelector: '#visual_btn_R',     
	//	prevText: '',
	//	nextText: '',			
	//	//video: true,
	//	useCSS: false,
		
	
	//	onSliderLoad: function(){
	//		$(".mainslider_wrap .mainslider li .box").addClass("on")
	//	},
	
	//	onSlideBefore: function(){
	//		$(".mainslider_wrap .mainslider li .box").removeClass("on")
	//	},
		
	//	onSlideAfter: function(){
	//		$(".mainslider_wrap .mainslider li .box").addClass("on")
	//	}

		
		
	//});

	$(document).on('click','#visual_btn_L, #visual_btn_R, .mainslider_wrap .bx-wrapper .bx-pager .bx-pager-item a',function(){
		clickslider.stopAuto()
		clickslider.startAuto()
	});

	$(document).on("click", ".link_btn", function () {
		$(".layerPopup_bg").show();
		$(".layerPopup_01").show();
		$("#wrap").addClass("noscroll");
	});

	$(document).on("click", ".custom_btn", function () {
		$(".layerPopup_bg").show();
		$(".layerPopup_02").show();
		$("#wrap").addClass("noscroll");
	});

	$(document).on("click", ".xi-close", function () {
		$(".layerPopup_bg").hide();
		$(".layerPopup_01").hide();
		$(".layerPopup_02").hide();
		$(".layerPopup_bill2").hide();
		$(".layerPopup_bill").hide();
		$("#wrap").removeClass("noscroll");
		
	});




	$(document).on("click", ".more_btn_cate", function () {
		$(".search_cate").toggle();
	});

	$(document).on("click", ".open_bill_detail", function () {
		$(".billPopup2-2").toggle();
	});

	$(document).on("click", ".alertPop", function () {
		$(".layerPopup_bg").show();
		$(".alert").show();
		$("#wrap").addClass("noscroll");
	});

	$(document).on("click", ".confirmPop", function () {
		$(".layerPopup_bg").show();
		$(".confirm").show();
		$("#wrap").addClass("noscroll");
	});

	$(window).scroll(function () {
		if ($(this).scrollTop() > 200) {
			$('.top').fadeIn();
		} else {
			$('.top').fadeOut();
		}
	});

	$('.top').click(function (e) {
		e.preventDefault();
		$('html').animate({ scrollTop: 0 }, 800);
		return false;
	});

	//$(".link_btn").click(function(e){
	//	e.preventDefault();
	//	$(".layerPopup_bg").show();
	//	$(".layerPopup_01").show();
	//});

	//$(".custom_btn").click(function(e){
	//	e.preventDefault();
	//	$(".layerPopup_bg").show();
	//	$(".layerPopup_02").show();
	//});

	//$(".xi-close").click(function(e){
	//	e.preventDefault();
	//	$(".layerPopup_bg").hide();
	//	$(".layerPopup_01").hide();
	//	$(".layerPopup_02").hide();
	//	$(".layerPopup_bill2").hide();
	//	$(".layerPopup_bill").hide();
	//});

	//$(".more_btn_cate").click(function(e){
	//	e.preventDefault();
	//	$(".search_cate").toggle();
	//});

	//$(".open_bill_detail").click(function(e){
	//	e.preventDefault();
	//	$(".billPopup2-2").toggle();
	//});

	//$(".bill_popup").click(function(e){
	//	e.preventDefault();
	//	$(".layerPopup_bg").show();
	//	$(".layerPopup_bill").show();
	//});

	//$(".bill_popup2").click(function(e){
	//	e.preventDefault();
	//	$(".layerPopup_bg").show();
	//	$(".layerPopup_bill2").show();
	//});

	//번호기준 / 담당자 변경 및 UI 변경
	$(document).on("click", ".gubun_btn li a", function () {
		$(".gubun_btn li a").removeClass("on");
		$(this).addClass("on");

		$('.gubun_btn li').removeClass('on');
		$(this).parents('li').addClass('on');

		var idx = $(this).parent().index();

		//탭 이동할때 기존에 있었던 데이터는 지우기
		if (idx == 0) {
			$("#S_CRN_NO").val("");
			$("#S_EMAIL").val("");
		}
		else if (idx == 1) {
			$("#N_CRN_NO").val("");
			$("#N_VALUE").val("");
		}

		$(".input_form li").hide();
		$(".input_form li").eq(idx).show();
		$("#search_btn").parent().show();
	}); 
});
	
$(document).on('click', '#Login', function () {
	var userInputId = _fnGetCookie("YJIT_USR_ID_REMEMBER_ELVISBILL");
	if (_fnToNull(userInputId) != "") {
		$("#Login_ID").val(userInputId);
		$("#login_keep").replaceWith("<input type='checkbox' id='login_keep' name='login_keep' checked/>");
		$("#Login_PW").val('');
	}
	else {
		$("#Login_ID").val("");
		$("#login_keep").replaceWith("<input type='checkbox' id='login_keep' name='login_keep'/>");
		$("#Login_PW").val('');
    }
	$('#Login_pop').show();
	$('body').css('overflow', 'hidden');
})
$(document).on('click', '.layer_close', function () {
	$(".notice_cont").scrollTop(0);
	$(this).parents('.layer_zone').hide();
	$(".layerPopup_bg").hide();
	$('body').css('overflow', 'unset');
})

$(document).on('click', '.con_select.select_year button', function () {
	$('.con_select.select_year button').removeClass('on');
	$(this).addClass('on');
});
