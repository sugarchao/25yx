$(function() {
	$("#toTop").on("click", function() {
		$("html, body").stop().animate({
			scrollTop : 0
		}, 500);
	});
	$(".siteNavMenu li").hover(function() {
		$(this).addClass("hover");
		$(this).children(".menuHide").show();
	}, function() {
		$(this).removeClass("hover");
		$(this).children(".menuHide").hide();
	});
});

/**
 * 
 * @param {}
 *            sURL 收藏链接地址
 * @param {}
 *            sTitle 收藏标题
 */
function AddFavorite(sURL, sTitle) {
	try {
		window.external.addFavorite(sURL, sTitle);
	} catch (e) {
		try {
			window.sidebar.addPanel(sTitle, sURL, "");
		} catch (e) {
			alert("加入收藏失败，请使用Ctrl+D进行添加");
		}
		;
	}
	;
};
/**
 * 
 * @param {}
 *            obj 当前对象，一般是使用this引用。
 * @param {}
 *            vrl 主页URL
 */
function SetHome(obj, vrl) {
	try {
		obj.style.behavior = 'url(#default#homepage)';
		obj.setHomePage(vrl);
	} catch (e) {
		if (window.netscape) {
			try {
				netscape.security.PrivilegeManager
						.enablePrivilege("UniversalXPConnect");
			} catch (e) {
				alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1']
					.getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage', vrl);
		}
		;
	}
	;
};
/*二维码相关控制*/
function qrcodeCtl() {
    var supportCanvas = 0;
    try {
        document.createElement('canvas').getContext('2d');
        supportCanvas = 1;
    } catch (e) {
        $('body').addClass('no-canvas');
    };

    function toQrUrl(url) {
        return url;//.split('#')[0].replace('&subfrom=web', '') + '&df=qrc';
    };

    /*滑过生成二维码*/
    var t = null,
        doc = document,
        dlnk = '.g_r_down',
        showCls = 'qr-show';

    function genQrByHover(a, li) {
        var codeBox = $('<div class="qr-div ml5"></div>').appendTo(li);
        var codeCfg = {
            size: 100,
            fill: '#000',
            background: '#fff',
            text: toQrUrl(a.attr('href'))
        };
        if (supportCanvas) {
            var cfgPlus = {
            		render: 'canvas',
      				ecLevel: 'H',
      				minVersion: parseInt(8, 10),
      				size: parseInt(103, 10),
      				radius: parseInt(30, 10) * 0.01,
      				quiet: parseInt(3, 10),
      				mode: parseInt(4, 10),
      				image: li.find('img').get(0),
      				imagesize: parseInt(40, 10) * 0.01
            };
            $.extend(codeCfg, cfgPlus);
        } else {
            codeCfg.render = 'div';
        }
        codeBox.qrcode(codeCfg);
        li.addClass(showCls);
    };

    $(doc).on('mouseenter', dlnk, function(e) {
        t && clearTimeout(t);
        var lnk = $(this),
            li = lnk.parents('li'),
            div = li.find('div.qr-div');

        if (div.length) {
            t = setTimeout(function() {
                li.addClass(showCls);
            }, 2e2);
        } else {
            t = setTimeout(function() {
                genQrByHover(lnk, li);
            }, 2e2);
        }
    }).on('mouseleave', dlnk, function(e) {
            t && clearTimeout(t);
            var lnk = $(this),
                li = lnk.parents('li');
            li.removeClass(showCls);
        });
};
$.getScript('http://s5.qhimg.com/!fe4319cf/jquery.qrcode-0.7.0.js', function() {
    qrcodeCtl();
});