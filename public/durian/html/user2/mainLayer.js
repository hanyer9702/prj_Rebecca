var oCacheData = new Array();

var aNewsMenu = {one: 1, two:2, three:3, four:4, five:5, six:6};

var isLoaded = false;
var personalRecommend = {
	memberNickname: '�뚯썝',
	isLoaded: false,
	personalRecommendList : [], // 媛쒖씤�� 異붿쿇 由ъ뒪��
	recentProductList : [], // �닿�蹂� �곹뭹 由ъ뒪��
	pcode: 0, // �곹뭹肄붾뱶
	cate : 0, // �꾩옱 移댄뀒怨좊━ 
	page : 1, // �붾낫湲� 
	total: 0 // �곹뭹 珥� 媛�닔 (AI 異붿쿇留�)	
};

/**
 * �듯빀硫붿씤�� swiper 湲곕낯�ㅼ젙
 * 媛쒕퀎�ㅼ젙�먯꽌 湲곕낯�ㅼ젙�� 諛붽퓭�쇰릺�� �댁슜�� �덈떎硫� �대떦 swiper 媛쒕퀎�ㅼ젙�� 媛믪쓣 �ㅼ젙�섎㈃ ��뼱�뚯썙吏꾨떎. 
 */
var swiperDefaultOption = {
	loop: false,
	lazy: {
		checkInView: true,
		loadPrevNext: true
	},
	preloadImages: false,
	effect: 'fade',
	fadeEffect: {
		crossFade: true
	},
	preventClicks: false,
	speed: 200,
	// allowTouchMove: false
}

var aTop100SectionId = new Array();
var priceCompareTop100VariableList = new Array();

//lazy �곸슜
document.addEventListener("DOMContentLoaded", function() {
	yall({
		observeChanges: true,
		events: {
			load: function (event) {
				const currentElement = event.target;
				if(currentElement.classList.contains('thumb') || currentElement.classList.contains('imgHeightCheck')) {
					//�몃줈媛� 媛�濡쒕낫�� 湲멸굅�� 媛숈� 寃쎌슦 thumb--h �대옒�� 異붽�
					if(currentElement.naturalWidth <= currentElement.naturalHeight) {
						currentElement.classList.add('thumb--h');
					}
				}
			}
		}
	})
});

$(function() {
	/*
	 * �쇳븨�뺣낫
	 */
	//�쇳븨�뺣낫 swiper �ㅼ젙
	const shoppingInfoSwiperOption = {
		initialSlide: ($('#shoppingInfoRandomSeq').val() - 1),
		keyboard: {
			enabled: true
		},
		autoplay: {
			delay: 5000,
			disableOnInteraction: true,
			pauseOnMouseEnter: true
		},
		speed : 0,
		on: {
			beforeTransitionStart: function() {
				$('.shopping-info-swiper .swiper-slide').css('visibility', '');
			},
			transitionEnd: function() {
				$('.shopping-info-swiper .swiper-slide').css('display', '');
				const currentPageElement = $('.shopping-info-swiper .swiper-slide:eq(' + this.realIndex + ')');
				const currentSection = currentPageElement.data('section');
				currentPageElement.siblings().css('visibility', 'hidden');
				$('.shopping-info-swiper ul.sub-menu__list li[id^="newsMenu_'+currentSection+'"]').addClass('sub-menu__item--select').siblings().removeClass('sub-menu__item--select');
				$('#newsRoomNowPage').text(this.realIndex + 1);
			}
		}
	};
	
	//�쇳븨�뺣낫 swiper �좎뼵
	var shoppingInfoSwiper = new Swiper(".shopping-info-swiper #shopping-info-swiper", $.extend({}, swiperDefaultOption, shoppingInfoSwiperOption));
	
	//�쇳븨�뺣낫 �댁쟾�섏씠吏�
	$('#newsRoomPrevPage').click(function(e) {
		e.preventDefault();
		if(shoppingInfoSwiper.realIndex == 0) {
			shoppingInfoSwiper.slideTo(shoppingInfoSwiper.slides.length);
		} else {
			shoppingInfoSwiper.slidePrev();
		}
		// autoplay 硫덉땄 �덉쇅 議곗튂
		if(shoppingInfoSwiper.autoplay.running == false && $('#newsRoomAutoPlayManualYN').val() == 'N') {
			//�뺤�以묒씪��
			$('#newsRoomAutoPlay').removeClass('btn_play').addClass('btn_stop');
			shoppingInfoSwiper.autoplay.start();
		}
	});
	
	//�쇳븨�뺣낫 �ㅼ쓬�섏씠吏�
	$('#newsRoomNextPage').click(function(e) {
		e.preventDefault();
		if(shoppingInfoSwiper.realIndex == (shoppingInfoSwiper.slides.length - 1)) {
			shoppingInfoSwiper.slideTo(0);
		} else {
			shoppingInfoSwiper.slideNext();
		}
		// autoplay 硫덉땄 �덉쇅 議곗튂
		if(shoppingInfoSwiper.autoplay.running == false && $('#newsRoomAutoPlayManualYN').val() == 'N') {
			//�뺤�以묒씪��
			$('#newsRoomAutoPlay').removeClass('btn_play').addClass('btn_stop');
			shoppingInfoSwiper.autoplay.start();
		}
	});
	
	//�쇳븨�뺣낫 移댄뀒怨좊━ �대┃ �대깽��
	$('.shopping-info-swiper ul.sub-menu__list li a').click(function(e) {
		var aNumber = ["one","two","three","four","five","six","seven"];
		var clickMenu = $(this).parent('li');
		
		if(!clickMenu.hasClass('sub-menu__item--select')) {
			e.preventDefault();
			var nClickNum = clickMenu.attr('id').split("_")[1];
			var clickPage = $('#news_room_contents #'+aNumber[nClickNum-1]+'_0');
			var nPageCount = clickPage.index();
			shoppingInfoSwiper.slideTo(nPageCount);
			
			clickMenu.addClass('sub-menu__item--select').siblings().removeClass('sub-menu__item--select');
			
			// autoplay 硫덉땄 �덉쇅 議곗튂
			if(shoppingInfoSwiper.autoplay.running == false && $('#newsRoomAutoPlayManualYN').val() == 'N') {
				//�뺤�以묒씪��
				$('#newsRoomAutoPlay').removeClass('btn_play').addClass('btn_stop');
				shoppingInfoSwiper.autoplay.start();
			}
		} 
	});
	
	//�먮룞�대룞 �쒖옉/�뺤� 踰꾪듉 �대깽��
	$('#newsRoomAutoPlay').on('click', function(e) {
		e.preventDefault();
		if($(this).hasClass('btn_play')) {
			$(this).removeClass('btn_play').addClass('btn_stop');
			shoppingInfoSwiper.autoplay.start();
			$('#newsRoomAutoPlayManualYN').val('N');
		} else {
			$(this).removeClass('btn_stop').addClass('btn_play');
			shoppingInfoSwiper.autoplay.stop();
			$('#newsRoomAutoPlayManualYN').val('Y');
		}
	});
	
	// �쇳븨�뺣낫 留덉슦�� (�ㅻ쾭/�꾩썐)
	$('.shopping-info-swiper .swiper-container').hover(function() {
		if(shoppingInfoSwiper.autoplay.running == true && $('#newsRoomAutoPlayManualYN').val() == 'N') {
			//�먮룞�ㅽ뻾以묒씪��
			$('#newsRoomAutoPlay').removeClass('btn_stop').addClass('btn_play');
			shoppingInfoSwiper.autoplay.stop();
		}
	}, function() {
		if(shoppingInfoSwiper.autoplay.running == false && $('#newsRoomAutoPlayManualYN').val() == 'N') {
			//�뺤�以묒씪��
			$('#newsRoomAutoPlay').removeClass('btn_play').addClass('btn_stop');
			shoppingInfoSwiper.autoplay.start();
		}
	});
	
	//�쇳븨�뺣낫 湲곗궗 留덉슦�ㅼ삤踰� �대깽��
	$('.shopping-info-swiper .main-info__item').hover(function() {
		var productStatus = 1;
		var relateProductLayer = $(this).children('.main-info__relate');

		const relateProductCode = relateProductLayer.find('.btn_relate').data('prod-code');
		

		if (relateProductLayer.find('.layer__info-relate .price').html() == '') {
			productStatus = getProductPrice(relateProductCode, relateProductLayer.find('.btn_relate'));
		}

		if (productStatus == -1) {
			relateProductLayer.remove();
		}
		else if (productStatus == 1) {
			relateProductLayer.show();
		}
		
		if(shoppingInfoSwiper.autoplay.running == true && $('#newsRoomAutoPlayManualYN').val() == 'N') {
			//�먮룞�ㅽ뻾以묒씪��
			$('#newsRoomAutoPlay').removeClass('btn_stop').addClass('btn_play');
			shoppingInfoSwiper.autoplay.stop();
		}
		
	}, function() {
		var relateProductLayer = $(this).children('.main-info__relate');

		relateProductLayer.hide();
	});
	
	//�쇳븨�뺣낫 湲곗궗 �ъ빱�� �대깽��
	$('.shopping-info-swiper .main-info__item .main-info__link').focus(function() {
		var productStatus = 1;
		var relateProductLayer = $(this).parent().children('.main-info__relate');

		const relateProductCode = relateProductLayer.find('.btn_relate').data('prod-code');		

		if (relateProductLayer.find('.layer__info-relate .price').html() == '') {
			productStatus = getProductPrice(relateProductCode, relateProductLayer.find('.btn_relate'));
		}

		if (productStatus == -1) {
			relateProductLayer.remove();
		}
		else if (productStatus == 1) {
			relateProductLayer.show();
		}
	});
	
	//愿��⑥긽�� 留덉슦�ㅼ삤踰� �대깽��
	$('.shopping-info-swiper .main-info__relate .btn_relate').hover(function() {
		var productStatus = 1;
		var relateProductLayer = $(this).parent();

		const relateProductCode = $(this).data('prod-code');
		
		
		if (relateProductLayer.children('.layer__info-relate').find('.price').html() == '') {
			productStatus = getProductPrice(relateProductCode, $(this));
		}

		if (productStatus == -1) {
			relateProductLayer.remove();
		}
		else if (productStatus == 1) {
			relateProductLayer.children('.layer__info-relate').show();
		}
	}, function() {
		var relateProductLayer = $(this).parent();

		relateProductLayer.children('.layer__info-relate').hide();
	});
	
	//愿��⑥긽�� ��쑝濡� �ъ빱�깅릺�덉쓣�� �대깽��
	$('.main-info__relate .btn_relate').focus(function() {
		var productStatus = 1;
		var relateProductLayer = $(this).parent();

		const relateProductCode = $(this).data('prod-code');
		

		if (relateProductLayer.children('.layer__info-relate').find('.price').html() == '') {
			productStatus = getProductPrice(relateProductCode, $(this));
		}

		if (productStatus == -1) {
			relateProductLayer.remove();
		}
		else if (productStatus == 1) {
			relateProductLayer.children('.layer__info-relate').show();
			relateProductLayer.show();
		}
	}).focusout(function() {
		var relateProductLayer = $(this).parent();

		relateProductLayer.hide();
		relateProductLayer.children('.layer__info-relate').hide();
	});

	//愿��⑥긽�� 媛�寃⑹젙蹂� 遺덈윭�ㅺ린
	function getProductPrice(prodCode, element) {
		var returnStatus = 1;

		$.ajax({
			type: 'post',
			dataType: 'json',
			url: '/main/ajax/getProductPrice.ajax.php',
			async: false,
			data: {
				"pcode": prodCode
			},
			success: function(data) {
				if (data.status == 200) {
					var price = 0;
					var addPriceText = '';

					if (data.result != '') {
						price = data.result;

						if (data.productStatus == 'pricecompare') {
							addPriceText = '��';
						}
					}
					else {
						addPriceText = '��';
					}

					element.parent().children('.layer__info-relate').find('.price').html('<span class="num">'+price+'</span>'+addPriceText);

					if (data.showProduct == false) {
						returnStatus = -1;
					}
				}
				else {
					returnStatus = 0;
				}
			},
			error: function (xhr, status, e) {
				returnStatus = 0;
			}
		});

		return returnStatus;
	};
	
	/**
	 * �쇳븨�대┰
	 */
	
	// �대�吏� 泥댄겕 (�덉씠吏� �곸슜 �섎㈃ 遺덊븘��)
	$('.main-clip .main-clip__item .main-clip__pannel img').load(function() {
		if ($(this).hasClass('thumb') || $(this).hasClass('imgHeightCheck')) {
			//�몃줈媛� 媛�濡쒕낫�� 湲멸굅�� 媛숈� 寃쎌슦 thumb--h �대옒�� 異붽�
			if ($(this)[0].naturalWidth <= $(this)[0].naturalHeight) {
				$(this).addClass('thumb--h');
			}
		}
	});

	/*
	 * �쇳븨�대┰ 濡ㅻ쭅�� �ㅼ쓬�섏씠吏� �대룞 
	 */
	$.sClipNextPage = function() {
		const currentPage = Number($("#sClipCurrentPage").val());
		const totalPage = Number($("#sClipTotalPage").val());
		let nextPage = 0;
		if(totalPage == currentPage) {
			nextPage = 1;
		} else {
			nextPage = currentPage + 1;
		}
		$("#sClipCurrentPage").val(nextPage);
		$("#shoppingClipContent_"+nextPage).addClass('main-clip__item--select').children('.main-clip__pannel').show();
		$("#shoppingClipContent_"+nextPage).siblings().removeClass('main-clip__item--select').children('.main-clip__pannel').hide();
	};

	/*
	 * �먮룞 濡ㅻ쭅 �곸뿭
	 */
	$('.main-clip .main-clip__wrap').on({
		mouseenter: function() {
			if ($('#sClipAutoPlayManualYN').val() == 'N') {
				clearInterval($(this).data('timer'));
				$('#sClipAutoPlay').removeClass('btn_stop').addClass('btn_play');
			}
		},
		mouseleave: function() {
			if ($('#sClipAutoPlayManualYN').val() == 'N') {
				$(this).data('timer', setInterval(function() {
					$.sClipNextPage();
				}, 5000));
				$('#sClipAutoPlay').removeClass('btn_play').addClass('btn_stop');
			}
		}
	}).trigger('mouseleave');
	
	//�먮룞�대룞 �쒖옉/�뺤� 踰꾪듉 �대깽��
	$('#sClipAutoPlay').on('click', function(e) {
		e.preventDefault();
		if($(this).hasClass('btn_play')) {
			$(this).removeClass('btn_play').addClass('btn_stop');
			$('#sClipAutoPlayManualYN').val('N');
			$('.main-clip .main-clip__wrap').trigger('mouseleave');
		} else {
			$(this).removeClass('btn_stop').addClass('btn_play');
			$('.main-clip .main-clip__wrap').trigger('mouseenter');
			$('#sClipAutoPlayManualYN').val('Y');
		}
	});

	// �쇳븨�대┰ �붿궡�� �대┃ (�댁쟾)
	$('.main-clip .swipe-control__btn .btn_prev').click(function(e) {
		e.preventDefault();
		const currentPage = Number($("#sClipCurrentPage").val());
		const totalPage = Number($("#sClipTotalPage").val());
		let prePage = 0;
		if (currentPage == 1) {
			prePage = totalPage;
		} else {
			prePage = currentPage-1;
		}
		$("#sClipCurrentPage").val(prePage);
		$("#shoppingClipContent_"+prePage).addClass('main-clip__item--select').children('.main-clip__pannel').show();
		$("#shoppingClipContent_"+prePage).siblings().removeClass('main-clip__item--select').children('.main-clip__pannel').hide();
	});
	
	// �쇳븨�대┰ �붿궡�� �대┃ (�ㅼ쓬)
	$('.main-clip .swipe-control__btn .btn_next').click(function(e) {
		e.preventDefault();
		$.sClipNextPage();
	});
	
	$('.main-clip .shoppingClipTab').click(function(e) {
		e.preventDefault();
		const clickedTab = $(this).parent().parent().attr('id');
		const clickedPage = clickedTab.split('_')[1];
		
		$("#sClipCurrentPage").val(clickedPage);
		$("#shoppingClipContent_"+clickedPage).addClass('main-clip__item--select').children('.main-clip__pannel').show();
		$("#shoppingClipContent_"+clickedPage).siblings().removeClass('main-clip__item--select').children('.main-clip__pannel').hide();
	});

	// �섎━癒쇳듃 酉고룷�� �몄텧 媛먯�
	var detectElementInViewport = function(element, percentVisible) {
		try {
			var rect = element[0].getBoundingClientRect();
			var windowHeight = (window.innerHeight || document.documentElement.clientHeight);

			return !(
				Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-(rect.height / 1)) * 100)) < percentVisible ||
				Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
			);
		} catch(error) {
			return false;
		}
	};

	//Top/Down �ㅽ겕濡� �꾩튂�� �곕Ⅸ 踰꾪듉 �몄텧 泥섎━
	$(".top_down_position").data("block", true);
	
	//醫뚯슦��씠 1260�댄븯�� 寃쎌슦 �듯빀硫붿씤 怨좎젙 GNB 鍮꾨끂異쒖쿂由�
	$(window).resize(function() {
		if($(window).width() < 1260) {
			$('#danawa_header').removeClass('main-header--fixed');
		}
	});
	$(window).scroll(function(){
		if($(document).scrollTop() >= 125){
			if($(".top_down_position").data("block") == true){
				$(".top_down_position").show();
				$(".top_down_position").data("block", false);
			}					
		}else{
			$(".top_down_position").hide();
			$(".top_down_position").data("block", true);
		}
		
		var nPosition = $(window).scrollTop(); // �꾩옱 �ㅽ겕濡ㅻ컮�� �꾩튂 
		var nFixedTabPosition =  $("#gnb-fixed").offset().top; //以묐떒 �ㅻ퉬寃뚯씠��(媛�寃⑸퉬援�, �곹뭹 �곸꽭�뺣낫 ��)

		if($(window).width() >= 1260) {
			if(nPosition > nFixedTabPosition - 10){
				$('#danawa_header').addClass('main-header--fixed');
					// $('#sectionExplodeLayer').hide();
					$('.btn_cate_all.btn_cate').removeClass('btn_cate--active');
					$('#category').removeClass('category--active');
			} else {
				$('#danawa_header').removeClass('main-header--fixed');
			}
		}
		
		//媛�寃⑸퉬援륳OP100 �곸뿭�� 吏꾩엯�덉쓣�� 醫뚯륫 硫붾돱諛� �곕씪�ㅻ땲湲�
		if(
			$(document).scrollTop() >= $('.main-top100').offset().top && 
			$(document).scrollTop() < ($('.main-top100').offset().top + $('.main-top100').outerHeight() - $('.main-top100__nav').outerHeight() - 100)
		) {
			$('.main-top100__nav').stop(false, false).animate({
				top: ($(document).scrollTop() - $('.main-top100').offset().top + 50) + 'px'
			}, 300);
			// $('.main-top100__nav').css('top', ($(document).scrollTop() - $('.main-top100').offset().top - 50) + 'px');
		} else if($(document).scrollTop() < $('.main-top100').offset().top) {
			//�ㅽ겕濡� �꾩튂媛� 媛�寃⑸퉬援륳OP100 �꾩そ�쇰븣
			$('.main-top100__nav').stop(false, false).animate({
				top: 0
			}, 300);
		} else {
			//�ㅽ겕濡� �꾩튂媛� 媛�寃⑸퉬援륳OP100 �꾨옒履쎌씪��
			$('.main-top100__nav').stop(false, false).animate({
				top: ($('.main-top100').outerHeight() - $('.main-top100__nav').outerHeight() - 150) + 'px'
			}, 300);
		}
		//媛�寃⑸퉬援륳OP100 �ㅽ겕濡� �꾩튂�� �곕씪 鍮꾨룞湲� �몄텧 �쒖뼱
		// $.setTop100ActiveEventHandler();
		
		/*********************************************************************************************			
		 * 媛쒖씤�� 異붿쿇�곹뭹 鍮꾨룞湲� �몄텧
		 * - 媛쒖씤�� 異붿쿇�곹뭹 �ㅽ겕濡ㅼ씠 湲몄� �딆쑝誘�濡�, 紐⑤땲�� �댁긽�꾩뿉 �곕씪 鍮꾨룞湲� �몄텧 �ㅽ겕濡� 媛� 遺꾨━ / �꾨옒 痢≪젙 媛믪뿉 �곕Ⅸ 遺꾧린泥섎━
		 * - 24�몄튂 紐⑤땲�� / �댁긽��: 1920 * 1080 / $(window).height() = 977
		 * - 27�몄튂 紐⑤땲�� / �댁긽��: 2560 * 1440 / $(window).height() = 1297
		 *********************************************************************************************/
		// const currentScrollTop = parseInt($(window).scrollTop());
//		var windowHeight = parseInt($(window).height());
//		var currentScrollTop = parseInt($(window).scrollTop());
//		var personalRecommendOffset = parseInt($('#recentCmPickContainer').offset().top);
//		if(windowHeight <= 977) {
//			if(personalRecommendOffset && currentScrollTop >= personalRecommendOffset - 1250) {
//				$.getPersonalProducts();
//			}
//		} else if (windowHeight <= 1297) {
//			if(personalRecommendOffset && currentScrollTop >= personalRecommendOffset - 1550) {
//				$.getPersonalProducts();
//			}
//		} else {
//			$.getPersonalProducts();
//		}
//
//		if(detectElementInViewport($('#personalRecommendArea'), 50)) { // 酉고룷�몄뿉 媛쒖씤�� 異붿쿇�곹뭹�� 50% �댁긽 �몄텧�섎뒗 寃쎌슦 �대깽�� fire
//			$('#personalRecommendArea').trigger('domInViewport');
//		}
	});	

	/*
	$.setTop100ActiveEventHandler = function() {
		if(aTop100SectionId.length) {
			aTop100SectionId.forEach(function(top100Id, section) {
				if(detectElementInViewport($('#'+top100Id), 30)) {
					if(priceCompareTop100VariableList[section].opt.prodListLoaded == false) {
						priceCompareTop100VariableList[section].getTop100ProductList();
					}
				}
				//�ㅽ겕濡ㅼ떆 硫붾돱諛� �쒖꽦�붿꽮�� �쒖떆
				if(detectElementInViewport($('#'+top100Id), 80)) {
					 const nTop100Id = top100Id.split('_')[1];
					 $('#top100Nav_'+nTop100Id).addClass('active').siblings().removeClass('active');
				}
			});
		}
	};
	*/
	
	//CM異붿쿇 �곹뭹 媛��몄삤湲� (HTML)
	$.getCmPickData = function(type) {
		$.ajax({
			type: 'get',
			dataType: 'html',
			url: '/main/ajax/getCmPickProductList.ajax.php',
			data: {
				"type": type
			},
			beforeSend: function() {
				$('#cmPickContainer').html(loadingImgHtml(300));
			},
			success: function(data) {
				if(type == 'large') {
					$('#recentCmPickContainer').html(data);
				} else {
					$('#cmPickContainer').html(data);
				}
				$.cmPickEventHandler();
			}
		});
	};
	
	/**
	 * 媛쒖씤�� �곹뭹 媛��몄삤湲� (HTML)
	 * 媛쒖씤�� �곹뭹�� �녿뒗寃쎌슦 CM異붿쿇 �곸뿭�� �볧� �몄텧
	 */
	$.getPersonalProducts = function() {
		if(!personalRecommend.isLoaded) {
			
			var resourceUrl = '/main/ajax/getPersonalRecommendProduct.ajax.php';
			
			$.ajax({
				type: 'get',
				dataType: 'html',
				url: resourceUrl,
				beforeSend: function() {
					personalRecommend.isLoaded = true;
					$('#recentContainer').html(loadingImgHtml(300));
					$('#cmPickContainer').html(loadingImgHtml(300));
				},
				success: function(data) {
					if(data != '') {
//						personalRecommend.memberNickname = data.result.memberNickname;
						$('#recentContainer').html(data);
						$.getCmPickData('small');
						$.recentEventHandler();
					} else {
						// 異붿쿇 �곗씠�� �녿뒗 寃쎌슦 �ъ씠�� �쇱씤 異붽�
						$('#personalRecommendArea').addClass('none');
						$('#recentContainer').remove();
						$.getCmPickData('large');
					}				
				},
				error: function(e) {
					personalRecommend.isLoaded = false;
					// 異붿쿇 �곗씠�� �녿뒗 寃쎌슦 �ъ씠�� �쇱씤 異붽�
					$('#personalRecommendArea').addClass('none');
					$('#recentContainer').remove();
					$.getCmPickData('large');
				}
			});
		}
	};
	
	$.cmPickEventHandler = function() {
		//CM異붿쿇 swiper �ㅼ젙
		const cmPickSwiperOption = {
			initialSlide: $('#cmPickRandomSeq').val(),
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
				pauseOnMouseEnter: true
			},
			lazy: {
				checkInView: false,
				loadPrevNext: false
			},
			on: {
				transitionEnd: function() {
					const activeSlide = $('.cmPick-swiper #cmPick-pagination .swipe-pagination__btn').eq(this.realIndex);
					const activePage = activeSlide.data('page');
					activeSlide.addClass('active').html('<span class="blind">�좏깮��</span>'+ activePage);
					activeSlide.siblings().each(function() {
						const currentPage = $(this).data('page');
						$(this).removeClass('active').html(currentPage);
					});
				}
			}
		};
		
		//CM異붿쿇 swiper �좎뼵
		var cmPickSwiper = new Swiper(".cmPick-swiper .swiper-container", $.extend({}, swiperDefaultOption, cmPickSwiperOption));

		const cmPickIO = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				// entry�� observer 異쒕젰
				if (entry.isIntersecting) {
					observer.disconnect();
					_trkEventLog('21�듯빀硫붿씤_CM異붿쿇�곹뭹_媛��쒖쟻�몄텧');
				}
			});
		});
		cmPickIO.observe(document.querySelector('.main-pick'));
		
		//CM異붿쿇 �곸뿭 留덉슦�ㅼ삤踰� �대깽��
		$('.cmPick-swiper').on({
			mouseenter: function() {
				$('#cmPick-nextPrev').show();
			},
			mouseleave: function() {
				$('#cmPick-nextPrev').hide();
			}
		});
		
		//CM異붿쿇 �ㅼ쓬 �섏씠吏� �대깽��
		$('#cmPickPageNext').click(function(e) {
			e.preventDefault();
			if(cmPickSwiper.realIndex == (cmPickSwiper.slides.length - 1)) {
				cmPickSwiper.slideTo(0);
			} else {
				cmPickSwiper.slideNext();
			}
		});
		
		//CM異붿쿇 �댁쟾 �섏씠吏� �대깽��
		$('#cmPickPagePrev').click(function(e) {
			e.preventDefault();
			if(cmPickSwiper.realIndex == 0) {
				cmPickSwiper.slideTo(cmPickSwiper.slides.length);
			} else {
				cmPickSwiper.slidePrev();
			}
		});
		
		//CM異붿쿇 �먮룞 �섏씠吏� �대룞/�뺤� �대깽��
		$('#cmPickPageAutoPlay').click(function(e) {
			e.preventDefault();
			if($(this).hasClass('swipe-pagination__play')) {
				//�뺤�以묒씪��
				$(this).removeClass('swipe-pagination__play').addClass('swipe-pagination__stop');
				cmPickSwiper.autoplay.start();
				$('#cmPickAutoPlayManualYN').val('N');
			} else {
				//�먮룞�ㅽ뻾以묒씪��
				$(this).removeClass('swipe-pagination__stop').addClass('swipe-pagination__play');
				cmPickSwiper.autoplay.stop();
				$('#cmPickAutoPlayManualYN').val('Y');
			}
		});
		
		//CM異붿쿇 �꾩껜蹂닿린 踰꾪듉 �대깽��
		$('#cmPickLayerOpen').click(function(e) {
			e.preventDefault();
			$('#cmPickLayer').show();
		});

		//�꾩껜蹂닿린 �リ린踰꾪듉 �대깽��
		$('#cmPickLayerClose').click(function() {
			$('#cmPickLayer').hide();
		});

		//�꾩껜蹂닿린以� 諛붽묑�곸뿭 �대┃ �대깽��
		$('.layer__basic__dimm').click(function() {
			$('#cmPickLayer').hide();
		});
		
		$('.cmPick-swiper .swiper-slide').hover(function() {
			if(cmPickSwiper.autoplay.running == true && $('#cmPickAutoPlayManualYN').val() == 'N') {
				//�먮룞�ㅽ뻾以묒씪��
				$('#cmPickPageAutoPlay').removeClass('swipe-pagination__stop').addClass('swipe-pagination__play');
				cmPickSwiper.autoplay.stop();
			}
		}, function() {
			if(cmPickSwiper.autoplay.running == false && $('#cmPickAutoPlayManualYN').val() == 'N') {
				//�뺤�以묒씪��
				$('#cmPickPageAutoPlay').removeClass('swipe-pagination__play').addClass('swipe-pagination__stop');
				cmPickSwiper.autoplay.start();
			}
		});

		//CM異붿쿇 �섏씠吏�踰꾪듉 �대┃
		$('.cmPick-swiper .swipe-pagination .swipe-pagination__btn').click(function(e) {
			e.preventDefault();
			const clickedPage = $(this).data('page') - 1;
			if(!$(this).hasClass('active')) {
				cmPickSwiper.slideTo(clickedPage);
				if(cmPickSwiper.autoplay.running == false && $('#cmPickAutoPlayManualYN').val() == 'N') {
					//�뺤�以묒씪��
					$('#cmPickPageAutoPlay').removeClass('swipe-pagination__play').addClass('swipe-pagination__stop');
					cmPickSwiper.autoplay.start();
				}
			}
		});
	};
	
	$.recentEventHandler = function() {
		//理쒓렐蹂몄긽�� 媛쒖씤�� swiper �ㅼ젙
		const recentSwiperOption = {
			autoplay: {
				delay: 5000,
				pauseOnMouseEnter: true
			},
			lazy: {
				checkInView: false,
				loadPrevNext: false
			},
			on: {
				transitionEnd: function() {
					const activeSlide = $('#recent-pagination .swipe-pagination__btn').eq(this.realIndex);
					const activePage = activeSlide.data('page');
					activeSlide.addClass('active').html('<span class="blind">�좏깮��</span>'+ activePage);
					activeSlide.siblings().each(function() {
						const currentPage = $(this).data('page');
						$(this).removeClass('active').html(currentPage);
					});
				}
			}
		};
		var recentSwiper = new Swiper(".swiper-recent", $.extend({}, swiperDefaultOption, recentSwiperOption));

		const recentIO = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				// entry�� observer 異쒕젰
				if (entry.isIntersecting) {
					observer.disconnect();
					_trkEventLog('21�듯빀硫붿씤_媛쒖씤�붿텛泥쒖긽��_媛��쒖쟻�몄텧');
				}
			});
		});
		recentIO.observe(document.querySelector('.main-recent'));
		
		//留덉슦�ㅼ삤踰�/�꾩썐 �섏씠吏� �대룞 �대깽��
		$('.swiper-recent').on({
			mouseenter: function() {
				$('#recentPageNextPrev').show();
			},
			mouseleave: function() {
				$('#recentPageNextPrev').hide();
			}
		});
		
		//�ㅼ쓬 �섏씠吏� 踰꾪듉 �대깽��
		$('#recentPageNext').on('click', function(e) {
			e.preventDefault();
			if(recentSwiper.realIndex == (recentSwiper.slides.length - 1)) {
				recentSwiper.slideTo(0);
			} else {
				recentSwiper.slideNext();
			}
		});
		
		//�댁쟾 �섏씠吏� 踰꾪듉 �대깽��
		$('#recentPagePrev').on('click', function(e) {
			e.preventDefault();
			if(recentSwiper.realIndex == 0) {
				recentSwiper.slideTo(recentSwiper.slides.length);
			} else {
				recentSwiper.slidePrev();
			}
		});
		
		//�먮룞�대룞 �쒖옉/�뺤� 踰꾪듉 �대깽��
		$('#recentPageAutoPlay').on('click', function(e) {
			e.preventDefault();
			if($(this).hasClass('swipe-pagination__play')) {
				$(this).removeClass('swipe-pagination__play').addClass('swipe-pagination__stop');
				recentSwiper.autoplay.start();
				$('#recentAutoPlayManualYN').val('N');
			} else {
				$(this).removeClass('swipe-pagination__stop').addClass('swipe-pagination__play');
				recentSwiper.autoplay.stop();
				$('#recentAutoPlayManualYN').val('Y');
			}
		});
		
		$('.swiper-recent .swiper-slide').hover(function() {
			if(recentSwiper.autoplay.running == true && $('#recentAutoPlayManualYN').val() == 'N') {
				$('#recentPageAutoPlay').removeClass('swipe-pagination__stop').addClass('swipe-pagination__play');
				recentSwiper.autoplay.stop();
			}
		}, function() {
			if(recentSwiper.autoplay.running == false && $('#recentAutoPlayManualYN').val() == 'N') {
				$('#recentPageAutoPlay').removeClass('swipe-pagination__play').addClass('swipe-pagination__stop');
				recentSwiper.autoplay.start();
			}
		});

		//理쒓렐蹂몄긽�� �섏씠吏�踰꾪듉 �대┃
		$('.swiper-recent .swipe-pagination .swipe-pagination__btn').click(function(e) {
			e.preventDefault();
			const clickedPage = $(this).data('page') - 1;
			if(!$(this).hasClass('active')) {
				recentSwiper.slideTo(clickedPage);
				if(recentSwiper.autoplay.running == false && $('#recentAutoPlayManualYN').val() == 'N') {
					$('#recentPageAutoPlay').removeClass('swipe-pagination__play').addClass('swipe-pagination__stop');
					recentSwiper.autoplay.start();
				}
			}
		});
	};
	
	/**
	 * DPG �곸뿭
	 */
	//�쇳븨�뺣낫 swiper �ㅼ젙
	const dpgSwiperOption = {
		initialSlide:($('#dpgContentRandomSeq').val() - 1),
		on: {
			beforeTransitionStart: function() {
				$('.swiper-dpg .swiper-slide').css('visibility', '');
			},
			transitionEnd: function() {
				const currentPageElement = $('.swiper-dpg .swiper-slide:eq(' + this.realIndex +')');
				const currentSection = currentPageElement.data('section');
				currentPageElement.siblings().css('visibility', 'hidden');
				$('.swiper-dpg ul.sub-menu__list li[id^="dpgMenu_'+currentSection+'"]').addClass('sub-menu__item--select').siblings().removeClass('sub-menu__item--select');
				$('#dpgNowPage').text(this.realIndex + 1);
				// $.communityLazy();
			}
		}
	};
	
	//dpg swiper �좎뼵
	var dpgSwiper = new Swiper(".swiper-dpg", $.extend({}, swiperDefaultOption, dpgSwiperOption));
	
	$('#dpgPagePrev').click(function(e) {
		e.preventDefault();
		if(dpgSwiper.realIndex == 0) {
			dpgSwiper.slideTo(dpgSwiper.slides.length);
		} else {
			dpgSwiper.slidePrev();
		}
	});
	$('#dpgPageNext').click(function(e) {
		e.preventDefault();
		if(dpgSwiper.realIndex == (dpgSwiper.slides.length - 1)) {
			dpgSwiper.slideTo(0);
		} else {
			dpgSwiper.slideNext();
		}
		
	});
	
	//DPG 移댄뀒怨좊━ �대┃ �대깽��
	$('.swiper-dpg ul.sub-menu__list li a').click(function(e) {
		var aNumber = ["one","two","three","four","five","six"];
		const clickMenu = $(this).parent('li');
		
		if(!clickMenu.hasClass('sub-menu__item--select')) {
			e.preventDefault();
			const sClickSection = clickMenu.attr('id').split("_")[1];
			var clickPage = $('.swiper-dpg .swiper-wrapper div.dpg-'+sClickSection).eq(0);
			var nPageCount = clickPage.index();
			dpgSwiper.slideTo(nPageCount);
			
			clickMenu.addClass('sub-menu__item--select').siblings().removeClass('sub-menu__item--select');
		} 
	});
	
	/**
	 * �대깽��/泥댄뿕�� �곸뿭
	 */
	var eventSwiper = new Swiper(".event-swiper", {
		allowTouchMove: false,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		on: {
			transitionEnd: function() {
				$('#eventNowPage').text(this.realIndex + 1);
			}
		}
	});
	$('#eventPagePrev').click(function(e) {
		e.preventDefault();
		if(eventSwiper.realIndex == 0) {
			eventSwiper.slideTo(eventSwiper.slides.length);
		} else {
			eventSwiper.slidePrev();
		}
	});
	$('#eventPageNext').click(function(e) {
		e.preventDefault();
		if(eventSwiper.realIndex == (eventSwiper.slides.length - 1)) {
			eventSwiper.slideTo(0);
		} else {
			eventSwiper.slideNext();
		}
	});
	
	/*
	 * �ㅻ굹�� �먮룞李�
	 */
	
	//�먮룞李� swiper �좎뼵
	const dnwCarSwiperOption = {
		initialSlide: $('#carRandomSeq').val(),
		on: {
			beforeTransitionStart: function() {
				$('.swiper-dnwcar .swiper-slide').css('visibility', '');
			},
			transitionEnd: function() {
				const currentPageElement = $('.swiper-dnwcar .swiper-wrapper .swiper-slide:eq(' + this.realIndex + ')');
				const currentMenu = currentPageElement.data('menu');
				currentPageElement.siblings().css('visibility', 'hidden');
				$('.swiper-dnwcar ul.sub-menu__list li[id^="carMenu_'+currentMenu+'"]').addClass('sub-menu__item--select').siblings().removeClass('sub-menu__item--select');
				$('#carNowPage').text(this.realIndex + 1);
			}
		}
	};
	var dnwCarSwiper = new Swiper(".swiper-dnwcar", $.extend({}, swiperDefaultOption, dnwCarSwiperOption));
	$('#carPagePrev').click(function(e) {
		e.preventDefault();
		if(dnwCarSwiper.realIndex == 0) {
			dnwCarSwiper.slideTo(dnwCarSwiper.slides.length);
		} else {
			dnwCarSwiper.slidePrev();
		}
	});
	
	$('#carPageNext').click(function(e) {
		e.preventDefault();
		if(dnwCarSwiper.realIndex == (dnwCarSwiper.slides.length - 1)) {
			dnwCarSwiper.slideTo(0);
		} else {
			dnwCarSwiper.slideNext();
		}
	});
	
	//�먮룞李� 硫붾돱 �대┃ �대깽��
	$('.swiper-dnwcar ul.sub-menu__list li a').click(function(e) {
		e.preventDefault();
		var clickMenu = $(this).parent('li');
		
		if(!clickMenu.hasClass('sub-menu__item--select')) {
			var nClickMenu = clickMenu.attr('id').split("_")[1];
			var clickPage = $('.swiper-dnwcar .swiper-slide#'+nClickMenu+'_0');
			var nPageCount = clickPage.index();
			dnwCarSwiper.slideTo(nPageCount);
			
			clickMenu.addClass('sub-menu__item--select').siblings().removeClass('sub-menu__item--select');
		} 
	});
	
	$('.swiper-dnwcar .swiper-lazy').error(function() {
		$(this).attr('src', '//img.danawa.com/new/noData/img/noImg_200_prod.gif');
	});
	
	/*
	 * �듬떎�섏�
	 */
	const shopDnwSwiperOption = {
		initialSlide: $('#shopDnwRandomSeq').val(),
		on: {
			beforeTransitionStart: function() {
				$('.swiper-shopdnw .swiper-slide').css('visibility', '');
			},
			transitionEnd: function() {
				const currentPageElement = $('.swiper-shopdnw .swiper-slide:eq(' + this.realIndex + ')');
				const currentMenu = currentPageElement.data('menu');
				currentPageElement.siblings().css('visibility', 'hidden');
				$('.swiper-shopdnw ul.sub-menu__list li[id^="shopDnwMenu_'+currentMenu+'"]').addClass('sub-menu__item--select').siblings().removeClass('sub-menu__item--select');
				$('#shopDnwCurrentPage').text(this.realIndex + 1);
			}
		}
	};
	var shopdnwSwiper = new Swiper('.swiper-shopdnw', $.extend({}, swiperDefaultOption, shopDnwSwiperOption));
	
	$('#shopDnwPagePrev').click(function(e) {
		e.preventDefault();
		if(shopdnwSwiper.realIndex == 0) {
			shopdnwSwiper.slideTo(shopdnwSwiper.slides.length);
		} else {
			shopdnwSwiper.slidePrev();
		}
	});
	
	$('#shopDnwPageNext').click(function(e) {
		e.preventDefault();
		if(shopdnwSwiper.realIndex == (shopdnwSwiper.slides.length - 1)) {
			shopdnwSwiper.slideTo(0);
		} else {
			shopdnwSwiper.slideNext();
		}
	});

	//�듬떎�섏� 硫붾돱 �대┃�� �대깽��
	$('.swiper-shopdnw ul.sub-menu__list li a').click(function(e) {
		e.preventDefault();
		var clickMenu = $(this).parent('li');
		if(!clickMenu.hasClass('sub-menu__item--select')) {
			var nClickMenu = clickMenu.attr('id').split("_")[1];
			var clickPage = $('.swiper-shopdnw .swiper-slide#'+nClickMenu+'_0');
			var nPageCount = clickPage.index();
			shopdnwSwiper.slideTo(nPageCount);
			
			clickMenu.addClass('sub-menu__item--select').siblings().removeClass('sub-menu__item--select');
		} 
	});
	
	$('.swiper-shopdnw .swiper-lazy').error(function() {
		$(this).attr('src', '//img.danawa.com/new/noData/img/noImg_200_prod.gif');
	});
	
	/**
	 * 媛�寃⑸퉬援� TOP100
	 */
	$('.main-top100 .main__cont .main-top100__cont').each(function(index, item) {
		const top100Id = $(item).attr('id');
		const section = $(item).data('section');
		priceCompareTop100VariableList[section] = new PriceCompareTop100(section, top100Id);
			
		aTop100SectionId[section] = top100Id;
	});

	$('.main-top100__nav__anchor').click(function(e) {
		e.preventDefault();
		if(!$(this).hasClass('active')) {
			const selectedSection = $(this).data('section');

			const element = document.getElementById(selectedSection);
			const headerOffset = 70;
			const elementPosition = $('#'+selectedSection).offset().top;
			const offsetPosition = elementPosition - headerOffset;

			//IE�먯꽌 window.scroll option�� 吏��먮릺吏� �딆븘 吏��먯뿬遺� �뺤씤
			const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
			if (supportsNativeSmoothScroll) {
				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth"
				});
			} else {
				window.scrollTo(0, offsetPosition);
			}
		}
	});

	//媛�寃⑸퉬援� TOP100 �곸뿭 IntersectionObserver
	const top100MenuObserverOption = {
		threshold: 1,
		rootMargin: '0px 20% 0px 20%'	//媛�濡� �댁긽�꾧� ��쓣寃쎌슦 �붾㈃�� �ㅼ뼱�ㅼ� �딄린�뚮Ц�� 醫뚯슦 margin �ㅼ젙
	};
	const top100ProductListObserverOption = {
		threshold: 0,
		rootMargin: '800px'	//top100 �곹뭹�곸뿭�� 誘몃━ 濡쒕뱶�섍린 �꾪빐 �ㅼ젙
	};

	const top100Divs = document.querySelectorAll('.main-top100 .main-top100__cont');
	function top100ProductListLazy(top100Div) {
		const io = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				// entry�� observer 異쒕젰
				if (entry.isIntersecting) {
					const section = entry.target.getAttribute('data-section');
					if(typeof priceCompareTop100VariableList[section] != 'undefined' || priceCompareTop100VariableList[section].opt.prodListLoaded == false) {
						priceCompareTop100VariableList[section].getTop100ProductList();
						observer.disconnect();
						_trkEventLog('21�듯빀硫붿씤_Top100_' + section + '_媛��쒖쟻�몄텧');
					}
				}
			});
		}, top100ProductListObserverOption);

		io.observe(top100Div);
	}

	function top100MenuFollow(top100Div) {
		const io = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				// entry�� observer 異쒕젰
				const nTop100Id = entry.target.id.split('_')[1];
				if (entry.isIntersecting) {
					$('#top100Nav_'+nTop100Id).addClass('active').siblings().removeClass('active');
					// $('#top100Nav_'+nTop100Id).addClass('active');
				} else {
					// $('#top100Nav_'+nTop100Id).removeClass('active');
				}
			});
		}, top100MenuObserverOption);
	
		io.observe(top100Div);
	}
	
	Array.prototype.forEach.call(top100Divs, function (e) {
		top100ProductListLazy(e);
	});
	Array.prototype.forEach.call(top100Divs, function (e) {
		top100MenuFollow(e);
	});

	/**
	 * �ㅻ굹�� �좎씤荑좏룿
	 */	
	const couponSwiperOption = {
		initialSlide: $('#couponRandomSeq').val(),
		on: {
			beforeTransitionStart: function() {
				$('.swiper-coupon .swiper-slide').css('visibility', '');
			},
			transitionEnd: function() {
				const currentPageElement = $('.swiper-coupon .swiper-slide:eq(' + this.realIndex + ')');
				currentPageElement.siblings().css('visibility', 'hidden');
				$('#couponCurrentPage').text(this.realIndex + 1);
			}
		}
	};
	var couponSwiper = new Swiper('.swiper-coupon .swiper-container', $.extend({}, swiperDefaultOption, couponSwiperOption));

	$('.swiper-coupon #couponPagePrev').click(function(e) {
		e.preventDefault();
		if(couponSwiper.realIndex == 0) {
			couponSwiper.slideTo(couponSwiper.slides.length);
		} else {
			couponSwiper.slidePrev();
		}
	});
	$('.swiper-coupon #couponPageNext').click(function(e) {
		e.preventDefault();
		if(couponSwiper.realIndex == (couponSwiper.slides.length - 1)) {
			couponSwiper.slideTo(0);
		} else {
			couponSwiper.slideNext();
		}
	});

	//TOP/DOWN 踰꾪듉 �대┃ �대깽��
	$(".top_down_position .top_down_area .top_down_fixed a").click(function(e){
		e.preventDefault();
		if($(this).hasClass("btn_layer_up") == true){
			$(document).scrollTop(0);
		}else{
			$(document).scrollTop($(document).height()-$(window).height());
		}
	});		
	if (Modernizr.touch == true && window.navigator.userAgent.indexOf("Windows") == -1) {
		$(".btn_layer_prev").css({display:'block'});
		$(".btn_layer_next").css({display:'block'});
	}
	$.getURLParameter = function(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVar = sPageURL.split('&');
		for(var i=0; i<sURLVar.length; i++) {
			var sParameterName = sURLVar[i].split('=');
			if(sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
	};
	
	//媛쒖씤�� �곸뿭  留덉슦�� �ㅻ쾭�쇰븣 �먮룞由щ줈�� 鍮꾪솢�깊솕諛� �� �쒖꽦�� 泥섎━
	$('#personalRecommendArea').mouseover(function() {
		clearTimeout(oMainReloadTimeout);
	}).mouseout(function (){
		oMainReloadTimeout = setTimeout("$.reloadMain();", nReLoadReTime); //寃��됱갹 �ъ빱�ㅼ븘�껊븣 由щ줈�� �� �곸슜
	});
	
	//�듯빀寃��됱갹 �ъ빱�ㅼ씪�� �먮룞由щ줈�� 鍮꾪솢�깊솕諛� �� �쒖꽦�� 泥섎━
	$('#AKCSearch').focusin(function() {
		clearTimeout(oMainReloadTimeout);
	}).focusout(function (){
		oMainReloadTimeout = setTimeout("$.reloadMain();", nReLoadReTime); //寃��됱갹 �ъ빱�ㅼ븘�껊븣 由щ줈�� �� �곸슜
	});

	/**
	 * �먮룞 媛깆떊
	 * @todo 硫붿씤�� �덉씠�� �ㅽ뵂�� �덈줈怨좎묠 �덈릺寃� �섏젙 �꾩슂
	 */
	$.reloadMain = function() {
		//�붾낫湲� 鍮� �쒖꽦�붿떆 && 寃��됱갹 �ъ빱�� �꾨땺�� 由щ줈�� �곸슜
		// if($('div[id^=categoryHoverLayer]:visible').length == 0 && !($('#AKCSearch').is(":focus")) && $(".ti_layer").css("display") == "none") {
		if(!($('#AKCSearch').is(":focus"))) {
			window.location.reload();
		} else if($(".ti_layer").css("display") != "none") {
			clearTimeout(oMainReloadTimeout);
		}
	};
	
	// topBanner close
	$(".btn_banner_close").click(function(){
		$(".ttop_banner").slideUp();
		//$(".ttop_banner").hide();
	});
	
	
	/*
	 * 而ㅻ��덊떚 & �대깽�� 濡ㅻ쭅 �대깽��
	 */
	/*
	$.rollingCommunity = function() {
		$.commEventNextPage();
	};
	
	$('.main_dpg_area .community_event').on({
		mouseenter: function() {
			clearInterval($(this).data('timer'));
		},
		mouseleave: function() {
			$(this).data('timer', setInterval(function() {
				$.rollingCommunity();
			}, 7000))
		}
	}).trigger('mouseleave');
	*/
	/*
	 * 而ㅻ��덊떚 & �대깽�� �ㅻ낫�� 濡ㅻ쭅 �대깽��
	 */
//	$('div.main_dpg_area a').on({
//		focus: function() {
//			$('div.main_dpg_area div.community_event').trigger('mouseenter');
//		},
//		blur: function() {
//			$('div.main_dpg_area div.community_event').trigger('mouseenter');
//		}
//	});
	/*
	$(document).on('focus','div.main_dpg_area a', function () {
//		$('div.main_dpg_area div.community_event').trigger('mouseenter');
		clearInterval($('.main_dpg_area .community_event').data('timer'));
    })
    .on('blur','div.main_dpg_area a', function () {
//    	$('div.main_dpg_area div.community_event').trigger('mouseleave');
    	$('.main_dpg_area .community_event').data('timer', setInterval(function() {
			$.rollingCommunity();
		}, 7000))
    });
	*/
	
	/*
	 * CM's PICK
	 */

	// CM's Pick 酉고룷�� �몄텧�� �몄궗�댄듃 濡쒓퉭 (�� 踰덈쭔)
	$.cmRecommendInViewport = function() {
		if($('.cm_pick_area').length != 0) {
			$('.cm_pick_area').one('domInViewport', function() {
				_trkEventLog('15�듯빀硫붿씤_CM異붿쿇�곹뭹_媛��쒖쟻�몄텧');
			});

			$(window).on('scroll', function() {
				if(detectElementInViewport($('.cm_pick_area'), 50)) { // 酉고룷�몄뿉 CM's Pick�� 50% �댁긽 �몄텧�섎뒗 寃쎌슦 �대깽�� fire
					$('.cm_pick_area').trigger('domInViewport');
				}
			});
		}
	};

	$.cmRecommendInViewport();

	// 硫붿씤 ti�곗륫 諛곕꼫 
	$.rollingTiBanner = function() {
		$.loadingTiBanner();
	};

	$.loadingTiBanner = function() {
		if($("#mouseOn").css("display") != "none") {
			$("#mouseOn").hide();
		} else {
			$("#mouseOn").show();
		}
	};
	
	// 誘몃뱾 諛곕꼫 �숈쁺�� �대깽��
	$("#topTiBanner .progress").click(function(){
		var oTiBanner = $(this).parents('.tiVideo');
		adVideoTypeClick(oTiBanner, 'topTimerId', 'topVideoLayer' ,'x73' , 'x74');
		return false;
	}).mouseenter(function(){
		var oTiBanner = $(this).parents('.tiVideo');
		oTiBanner.addClass('loading');
		var num = 1;
		oTiBanner.data('topTimerId', setInterval(function() {
			if(num == 1) {
				oTiBanner.find(".progress-txt").html('2珥�');
			}
			else if(num == 2) {
				oTiBanner.find(".progress-txt").html('1珥�');
			}
			else if(num == 3){
				adVideoTypeClick(oTiBanner, 'topTimerId', 'topVideoLayer' ,'x73' , 'x74');
			}
			num++;
		}, 333));
	}).mouseleave(function(){
		clearInterval($(this).parents('.tiVideo').data('topTimerId'));
		$(this).parents('.tiVideo').removeClass('loading');
		$(".bg_bar").css("width","50%");
		$(this).parents('.tiVideo').find(".progress-txt").html('3珥�');
	}).trigger('mouseleave');
	
	// �곗륫 諛곕꼫 �숈쁺�� �대깽��
	$("#rightTiBanner").click(function(){
		if ($(this).find(".progress-txt").length > 0 ) {
			adVideoTypeClick($(this) , 'timerId', 'rightVideoLayer' ,'x71' , 'x72');
			return false;
		}
	}).mouseenter(function(){
		var oTiBanner = $(this);
		if (oTiBanner.find(".progress-txt").length > 0 ) {
			oTiBanner.parent('.main-rightbnr').addClass('loading');
			var num = 1;
			oTiBanner.data('timerId', setInterval(function() {	
				if(num == 1) {
					oTiBanner.find(".progress-txt").html('2珥�');
				}
				else if(num == 2) {
					oTiBanner.find(".progress-txt").html('1珥�');
				}
				else if(num == 3){
					adVideoTypeClick(oTiBanner, 'timerId', 'rightVideoLayer' ,'x71' , 'x72');
				}
				num++;
			}, 333));
		}
	}).mouseleave(function(){
		clearInterval($(this).data('timerId'));
		$(this).parent('.main-rightbnr').removeClass('loading');
		$(".bg_bar").css("width","50%");
		$(this).find(".progress-txt").html('3珥�');
	}).trigger('mouseleave');
	
	// ti諛곕꼫 愿묎퀬 �덉씠�� �リ린
	$('.layer__ti__close').click(function() {
		$(".layer__ti").hide();
		$(".layer__ti__video").html('');
		return false;
	});
	
	// ti諛곕꼫 愿묎퀬 �덉씠�� �リ린
	$('.layer__ti__close').click(function() {
		$('#loadingBanner').stop(true);
		$('#loadingBanner').attr('style', "margin-top:0px;");
		$("#loadingBanner").show();
		$(".layer__ti").hide();
		$(".layer__ti__video").html('');
	});

	// UXLOG
	var logMessage = {
		'uxid': 'P13001',
		'parameter': {
			'memberCode': undefined
		}
	};
	if($('#memberSeq').val()) {
		logMessage.parameter.memberCode = parseInt($('#memberSeq').val()) || undefined;
	}
	if(logMessage.parameter.memberCode === undefined) {
		delete logMessage.parameter;
	}
	DANAWA_LOGGING_APPLICATION_CLIENT.execute(JSON.stringify(logMessage));
});

var adVideoTypeClick = function(oTiBanner, timer_id, layer_id, ad_id, change_ad_id) {
	oTiBanner.addClass('loading');

	clearInterval(oTiBanner.data(timer_id));
	var tiPath = oTiBanner.find(".tiLayout").attr("src");
	if (tiPath.indexOf("?")) {
		tiPath = tiPath.substring(0, tiPath.indexOf("?"));
	}

	tiPath = tiPath.replace(ad_id, change_ad_id);
	tiPath = tiPath.replace(".html", "1.html");
	$.ajax({
		url : tiPath,
		crossDomain: true,
		dataType: "html",
		success: function (data) {
			$("#"+layer_id).find(".layer__ti__video").html(data);
		},
		error: function (error) {}
	});

	$("#"+layer_id).show();
}

var countDownTimer = function (id, date) {
	//IE11�먯꽌 �좎쭨 臾몄옄�� -瑜� �몄떇�섏� 紐삵빐 /濡� 移섑솚
	var _vDate = new Date(date.replace("-", "/")); // �꾨떖 諛쏆� �쇱옄 
	var _second = 1000; 
	var _minute = _second * 60; 
	var _hour = _minute * 60; 
	var _day = _hour * 24; 
	var timer; 
	function showRemaining() { 
		var now = new Date(); 
		var distDt = _vDate - now; 
		if (distDt < 0) { 
			clearInterval(timer); 
			document.getElementById(id).textContent = '�ㅽ뵂'; 
			return; 
		} 
		var days = Math.floor(distDt / _day); 
		var hours = Math.floor((distDt % _day) / _hour); 
		var minutes = Math.floor((distDt % _hour) / _minute); 
		var seconds = Math.floor((distDt % _minute) / _second); 
		if(days > 0) {
			document.getElementById(id).textContent = days + '�� '; 
			document.getElementById(id).textContent += zeroPad(hours, 2) + ':'; 
		} else {
			document.getElementById(id).textContent = zeroPad(hours, 2) + ':'; 
		}
		document.getElementById(id).textContent += zeroPad(minutes, 2) + ':'; 
		document.getElementById(id).textContent += zeroPad(seconds, 2); 
	}
	function zeroPad(num, places) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join("0") + num;
	//   return Array(Math.max(places - String(num).length + 1, 0)).join(0) + num;
	}
	timer = setInterval(showRemaining, 1000);
}

function loadingImgHtml(height) {
	if(!height) {
		height = '100%';
	} else {
		height = height + 'px';
	}
	const html = '<div style="width:100%;height:'+height+';display:flex;align-items:center;justify-content:center;"><img src="//img.danawa.com/totalMain/ajax-loader.gif" alt="濡쒕뵫以�"><div>';
	return html;
}

function scrollSmoothTo(elementId) {
	var element = document.getElementById(elementId);
	element.scrollIntoView({
	  block: 'start',
	  behavior: 'smooth'
	});
}

$(document).ready(function() {
	$.getPersonalProducts();
	// $.setTop100ActiveEventHandler();
	
	//DPG �밴�紐곕궡 �쒓컙�뺣낫媛� �덈떎硫� 移댁슫�몃떎�� �쒖옉
	$('.swiper-dpg .swiper-wrapper .main-dpg__dasale span.dpgDasaleCounter').each(function() {
		countDownTimer($(this).attr('id'), $(this).data('date'));
	});
	
	$(document).mouseup(function(e) {
		//�숈쁺�� �앹뾽 諛붽묑遺�遺� �대┃�� �덉씠�� �リ린
		if(!$('.layer__ti__wrap').has(e.target).length && !$('.layer__ti__wrap').has(e.target).length) {
			$('.layer__ti').css({display: 'none'});
		}
	});
	
});

var nReLoadReTime = null;
var oMainReloadTimeout = null;
/*
 * �먮룞媛깆떊 �ㅽ뻾
 */
//setTimeout("window.location.href = document.URL;", nReLoadReTime);
nReLoadReTime = 1000 * 4 * 60;
oMainReloadTimeout = setTimeout("$.reloadMain();", nReLoadReTime);