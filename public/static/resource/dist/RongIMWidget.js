/*
 * jQuery Rebox [http://trentrichardson.com/examples/jQuery-Rebox]
 * By: Trent Richardson [http://trentrichardson.com]
 *
 * Copyright 2014 Trent Richardson
 * Dual licensed under the MIT license.
 * http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 */
(function($){
	if(!$){
		return;
	}
	$.rebox = function($this, options){
		this.settings = $.extend(true, {}, $.rebox.defaults, options);
		this.$el = $this;      // parent container holding items
		this.$box = null;      // the lightbox modal
		this.$items = null;    // recomputed each time its opened
		this.idx = 0;          // of the $items which index are we on
		this.enable();
	};

	$.rebox.defaults = {
		theme: 'rebox',        // class name parent gets (for your css)
		selector: null,        // the selector to delegate to, should be to the <a> which contains an <img>
		prev: '&larr;',        // use an image, text, whatever for the previous button
		next: '&rarr;',        // use an image, text, whatever for the next button
		loading: '%',          // use an image, text, whatever for the loading notification
		close: '&times;',      // use an image, text, whatever for the close button
		speed: 400,            // speed to fade in or out
		zIndex: 1000,          // zIndex to apply to the outer container
		cycle: true,           // whether to cycle through galleries or stop at ends
		captionAttr: 'title',  // name of the attribute to grab the caption from
		template: 'image',     // the default template to be used (see templates below)
		templates: {           // define templates to create the elements you need function($item, settings)
			image: function($item, settings, callback){
				return $('<img src="'+ $item.attr('href') +'" class="'+ settings.theme +'-content" />').load(callback);
			}
		}
	};

	$.rebox.setDefaults = function(options){
		$.rebox.defaults = $.extend(true, {}, $.rebox.defaults, options);
	};

	$.rebox.lookup = { i: 0 };

	$.extend($.rebox.prototype, {
		enable: function(){
				var t = this;

				return t.$el.on('click.rebox', t.settings.selector, function(e){
					e.preventDefault();
					t.open(this);
				});
			},
		open: function(i){
				var t = this;

				// figure out where to start
				t.$items = t.settings.selector === null? t.$el : t.$el.find(t.settings.selector);
				if(isNaN(i)){
					i = t.$items.index(i);
				}

				// build the rebox
				t.$box = $('<div class="'+ t.settings.theme +'" style="display:none;">'+
							'<a href="#" class="'+ t.settings.theme +'-close '+ t.settings.theme +'-button">'+ t.settings.close +'</a>' +
							'<a href="#" class="'+ t.settings.theme +'-prev '+ t.settings.theme +'-button">'+ t.settings.prev +'</a>' +
							'<a href="#" class="'+ t.settings.theme +'-next '+ t.settings.theme +'-button">'+ t.settings.next +'</a>' +
							'<div class="'+ t.settings.theme +'-contents"></div>'+
							'<div class="'+ t.settings.theme +'-caption"><p></p></div>' +
						'</div>').appendTo('body').css('zIndex',t.settings.zIndex).fadeIn(t.settings.speed)
						.on('click.rebox','.'+t.settings.theme +'-close', function(e){ e.preventDefault(); t.close(); })
						.on('click.rebox','.'+t.settings.theme +'-next', function(e){ e.preventDefault(); t.next(); })
						.on('click.rebox','.'+t.settings.theme +'-prev', function(e){ e.preventDefault(); t.prev(); });

				// add some key hooks
				$(document).on('swipeLeft.rebox', function(e){ t.next(); })
					.on('swipeRight.rebox', function(e){ t.prev(); })
					.on('keydown.rebox', function(e){
							e.preventDefault();
							var key = (window.event) ? event.keyCode : e.keyCode;
							switch(key){
								case 27: t.close(); break; // escape key closes
								case 37: t.prev(); break;  // left arrow to prev
								case 39: t.next(); break;  // right arrow to next
							}
						});

				t.$el.trigger('rebox:open',[t]);
				t.goto(i);
				return t.$el;
			},
		close: function(){
				var t = this;

				if(t.$box && t.$box.length){
					t.$box.fadeOut(t.settings.speed, function(e){
						t.$box.remove();
						t.$box = null;
						t.$el.trigger('rebox:close',[t]);
					});
				}
				$(document).off('.rebox');

				return t.$el;
			},
		goto: function(i){
				var t = this,
					$item = $(t.$items[i]),
					captionVal = $item.attr(t.settings.captionAttr),
					$cap = t.$box.children('.'+ t.settings.theme +'-caption')[captionVal?'show':'hide']().children('p').text(captionVal),
					$bi = t.$box.children('.'+ t.settings.theme +'-contents'),
					$img = null;

				if($item.length){
					t.idx = i;
					$bi.html('<div class="'+ t.settings.theme +'-loading '+ t.settings.theme +'-button">'+ t.settings.loading +'</div>');

					$img = t.settings.templates[$item.data('rebox-template') || t.settings.template]($item, t.settings, function(content){
						$bi.empty().append($(this));
					});

					if(t.$items.length == 1 || !t.settings.cycle){
						t.$box.children('.'+ t.settings.theme +'-prev')[i<=0 ? 'hide' : 'show']();
						t.$box.children('.'+ t.settings.theme +'-next')[i>=t.$items.length-1 ? 'hide' : 'show']();
					}
					t.$el.trigger('rebox:goto',[t, i, $item, $img]);
				}
				return t.$el;
			},
		prev: function(){
				var t = this;
				return t.goto(t.idx===0? t.$items.length-1 : t.idx-1);
			},
		next: function(){
				var t = this;
				return t.goto(t.idx===t.$items.length-1? 0 : t.idx+1);
			},
		disable: function(){
				var t = this;
				return t.close().off('.rebox').trigger('rebox:disable',[t]);
			},
		destroy: function(){
				var t = this;
				return t.disable().removeData('rebox').trigger('rebox:destroy');
			},
		option: function(key, val){
				var t = this;
				if(val !== undefined){
					t.settings[key] = val;
					return t.disable().enable();
				}
				return t.settings[key];
			}
	});

	$.fn.rebox = function(o) {
		o = o || {};
		var tmp_args = Array.prototype.slice.call(arguments);

		if (typeof(o) == 'string'){
			if(o == 'option' && typeof(tmp_args[1]) == 'string' && tmp_args.length === 2){
				var inst = $.rebox.lookup[$(this).data('rebox')];
				return inst[o].apply(inst, tmp_args.slice(1));
			}
			else return this.each(function() {
				var inst = $.rebox.lookup[$(this).data('rebox')];
				inst[o].apply(inst, tmp_args.slice(1));
			});
		} else return this.each(function() {
				var $t = $(this);
				$.rebox.lookup[++$.rebox.lookup.i] = new $.rebox($t, o);
				$t.data('rebox', $.rebox.lookup.i);
			});
	};


})(window.jQuery || window.Zepto || window.$);

/* jquery.nicescroll 3.6.8 InuYaksa*2015 MIT http://nicescroll.areaaperta.com */(function(f){"function"===typeof define&&define.amd?define(["jquery"],f):"object"===typeof exports?module.exports=f(require("jquery")):f(jQuery)})(function(f){var B=!1,F=!1,O=0,P=2E3,A=0,J=["webkit","ms","moz","o"],v=window.requestAnimationFrame||!1,w=window.cancelAnimationFrame||!1;if(!v)for(var Q in J){var G=J[Q];if(v=window[G+"RequestAnimationFrame"]){w=window[G+"CancelAnimationFrame"]||window[G+"CancelRequestAnimationFrame"];break}}var x=window.MutationObserver||window.WebKitMutationObserver||
!1,K={zindex:"auto",cursoropacitymin:0,cursoropacitymax:1,cursorcolor:"#424242",cursorwidth:"6px",cursorborder:"1px solid #fff",cursorborderradius:"5px",scrollspeed:60,mousescrollstep:24,touchbehavior:!1,hwacceleration:!0,usetransition:!0,boxzoom:!1,dblclickzoom:!0,gesturezoom:!0,grabcursorenabled:!0,autohidemode:!0,background:"",iframeautoresize:!0,cursorminheight:32,preservenativescrolling:!0,railoffset:!1,railhoffset:!1,bouncescroll:!0,spacebarenabled:!0,railpadding:{top:0,right:0,left:0,bottom:0},
disableoutline:!0,horizrailenabled:!0,railalign:"right",railvalign:"bottom",enabletranslate3d:!0,enablemousewheel:!0,enablekeyboard:!0,smoothscroll:!0,sensitiverail:!0,enablemouselockapi:!0,cursorfixedheight:!1,directionlockdeadzone:6,hidecursordelay:400,nativeparentscrolling:!0,enablescrollonselection:!0,overflowx:!0,overflowy:!0,cursordragspeed:.3,rtlmode:"auto",cursordragontouch:!1,oneaxismousemode:"auto",scriptpath:function(){var f=document.getElementsByTagName("script"),f=f.length?f[f.length-
1].src.split("?")[0]:"";return 0<f.split("/").length?f.split("/").slice(0,-1).join("/")+"/":""}(),preventmultitouchscrolling:!0,disablemutationobserver:!1},H=!1,R=function(){if(H)return H;var f=document.createElement("DIV"),c=f.style,k=navigator.userAgent,l=navigator.platform,d={haspointerlock:"pointerLockElement"in document||"webkitPointerLockElement"in document||"mozPointerLockElement"in document};d.isopera="opera"in window;d.isopera12=d.isopera&&"getUserMedia"in navigator;d.isoperamini="[object OperaMini]"===
Object.prototype.toString.call(window.operamini);d.isie="all"in document&&"attachEvent"in f&&!d.isopera;d.isieold=d.isie&&!("msInterpolationMode"in c);d.isie7=d.isie&&!d.isieold&&(!("documentMode"in document)||7==document.documentMode);d.isie8=d.isie&&"documentMode"in document&&8==document.documentMode;d.isie9=d.isie&&"performance"in window&&9==document.documentMode;d.isie10=d.isie&&"performance"in window&&10==document.documentMode;d.isie11="msRequestFullscreen"in f&&11<=document.documentMode;d.isieedge12=
navigator.userAgent.match(/Edge\/12\./);d.isieedge="msOverflowStyle"in f;d.ismodernie=d.isie11||d.isieedge;d.isie9mobile=/iemobile.9/i.test(k);d.isie9mobile&&(d.isie9=!1);d.isie7mobile=!d.isie9mobile&&d.isie7&&/iemobile/i.test(k);d.ismozilla="MozAppearance"in c;d.iswebkit="WebkitAppearance"in c;d.ischrome="chrome"in window;d.ischrome38=d.ischrome&&"touchAction"in c;d.ischrome22=!d.ischrome38&&d.ischrome&&d.haspointerlock;d.ischrome26=!d.ischrome38&&d.ischrome&&"transition"in c;d.cantouch="ontouchstart"in
document.documentElement||"ontouchstart"in window;d.hasw3ctouch=(window.PointerEvent||!1)&&(0<navigator.MaxTouchPoints||0<navigator.msMaxTouchPoints);d.hasmstouch=!d.hasw3ctouch&&(window.MSPointerEvent||!1);d.ismac=/^mac$/i.test(l);d.isios=d.cantouch&&/iphone|ipad|ipod/i.test(l);d.isios4=d.isios&&!("seal"in Object);d.isios7=d.isios&&"webkitHidden"in document;d.isios8=d.isios&&"hidden"in document;d.isandroid=/android/i.test(k);d.haseventlistener="addEventListener"in f;d.trstyle=!1;d.hastransform=!1;
d.hastranslate3d=!1;d.transitionstyle=!1;d.hastransition=!1;d.transitionend=!1;l=["transform","msTransform","webkitTransform","MozTransform","OTransform"];for(k=0;k<l.length;k++)if(void 0!==c[l[k]]){d.trstyle=l[k];break}d.hastransform=!!d.trstyle;d.hastransform&&(c[d.trstyle]="translate3d(1px,2px,3px)",d.hastranslate3d=/translate3d/.test(c[d.trstyle]));d.transitionstyle=!1;d.prefixstyle="";d.transitionend=!1;for(var l="transition webkitTransition msTransition MozTransition OTransition OTransition KhtmlTransition".split(" "),
q=" -webkit- -ms- -moz- -o- -o -khtml-".split(" "),t="transitionend webkitTransitionEnd msTransitionEnd transitionend otransitionend oTransitionEnd KhtmlTransitionEnd".split(" "),k=0;k<l.length;k++)if(l[k]in c){d.transitionstyle=l[k];d.prefixstyle=q[k];d.transitionend=t[k];break}d.ischrome26&&(d.prefixstyle=q[1]);d.hastransition=d.transitionstyle;a:{k=["grab","-webkit-grab","-moz-grab"];if(d.ischrome&&!d.ischrome38||d.isie)k=[];for(l=0;l<k.length;l++)if(q=k[l],c.cursor=q,c.cursor==q){c=q;break a}c=
"default"}d.cursorgrabvalue=c;d.hasmousecapture="setCapture"in f;d.hasMutationObserver=!1!==x;return H=d},S=function(h,c){function k(){var b=a.doc.css(e.trstyle);return b&&"matrix"==b.substr(0,6)?b.replace(/^.*\((.*)\)$/g,"$1").replace(/px/g,"").split(/, +/):!1}function l(){var b=a.win;if("zIndex"in b)return b.zIndex();for(;0<b.length&&9!=b[0].nodeType;){var g=b.css("zIndex");if(!isNaN(g)&&0!=g)return parseInt(g);b=b.parent()}return!1}function d(b,
g,u){g=b.css(g);b=parseFloat(g);return isNaN(b)?(b=z[g]||0,u=3==b?u?a.win.outerHeight()-a.win.innerHeight():a.win.outerWidth()-a.win.innerWidth():1,a.isie8&&b&&(b+=1),u?b:0):b}function q(b,g,u,c){a._bind(b,g,function(a){a=a?a:window.event;var c={original:a,target:a.target||a.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"==a.type?0:1,deltaX:0,deltaZ:0,preventDefault:function(){a.preventDefault?a.preventDefault():a.returnValue=!1;return!1},stopImmediatePropagation:function(){a.stopImmediatePropagation?
a.stopImmediatePropagation():a.cancelBubble=!0}};"mousewheel"==g?(a.wheelDeltaX&&(c.deltaX=-.025*a.wheelDeltaX),a.wheelDeltaY&&(c.deltaY=-.025*a.wheelDeltaY),c.deltaY||c.deltaX||(c.deltaY=-.025*a.wheelDelta)):c.deltaY=a.detail;return u.call(b,c)},c)}function t(b,g,c){var d,e;0==b.deltaMode?(d=-Math.floor(a.opt.mousescrollstep/54*b.deltaX),e=-Math.floor(a.opt.mousescrollstep/54*b.deltaY)):1==b.deltaMode&&(d=-Math.floor(b.deltaX*a.opt.mousescrollstep),e=-Math.floor(b.deltaY*a.opt.mousescrollstep));
g&&a.opt.oneaxismousemode&&0==d&&e&&(d=e,e=0,c&&(0>d?a.getScrollLeft()>=a.page.maxw:0>=a.getScrollLeft())&&(e=d,d=0));a.isrtlmode&&(d=-d);d&&(a.scrollmom&&a.scrollmom.stop(),a.lastdeltax+=d,a.debounced("mousewheelx",function(){var b=a.lastdeltax;a.lastdeltax=0;a.rail.drag||a.doScrollLeftBy(b)},15));if(e){if(a.opt.nativeparentscrolling&&c&&!a.ispage&&!a.zoomactive)if(0>e){if(a.getScrollTop()>=a.page.maxh)return!0}else if(0>=a.getScrollTop())return!0;a.scrollmom&&a.scrollmom.stop();a.lastdeltay+=e;
a.synched("mousewheely",function(){var b=a.lastdeltay;a.lastdeltay=0;a.rail.drag||a.doScrollBy(b)},15)}b.stopImmediatePropagation();return b.preventDefault()}var a=this;this.version="3.6.8";this.name="nicescroll";this.me=c;this.opt={doc:f("body"),win:!1};f.extend(this.opt,K);this.opt.snapbackspeed=80;if(h)for(var r in a.opt)void 0!==h[r]&&(a.opt[r]=h[r]);a.opt.disablemutationobserver&&(x=!1);this.iddoc=(this.doc=a.opt.doc)&&this.doc[0]?this.doc[0].id||"":"";this.ispage=/^BODY|HTML/.test(a.opt.win?
a.opt.win[0].nodeName:this.doc[0].nodeName);this.haswrapper=!1!==a.opt.win;this.win=a.opt.win||(this.ispage?f(window):this.doc);this.docscroll=this.ispage&&!this.haswrapper?f(window):this.win;this.body=f("body");this.iframe=this.isfixed=this.viewport=!1;this.isiframe="IFRAME"==this.doc[0].nodeName&&"IFRAME"==this.win[0].nodeName;this.istextarea="TEXTAREA"==this.win[0].nodeName;this.forcescreen=!1;this.canshowonmouseevent="scroll"!=a.opt.autohidemode;this.page=this.view=this.onzoomout=this.onzoomin=
this.onscrollcancel=this.onscrollend=this.onscrollstart=this.onclick=this.ongesturezoom=this.onkeypress=this.onmousewheel=this.onmousemove=this.onmouseup=this.onmousedown=!1;this.scroll={x:0,y:0};this.scrollratio={x:0,y:0};this.cursorheight=20;this.scrollvaluemax=0;if("auto"==this.opt.rtlmode){r=this.win[0]==window?this.body:this.win;var p=r.css("writing-mode")||r.css("-webkit-writing-mode")||r.css("-ms-writing-mode")||r.css("-moz-writing-mode");"horizontal-tb"==p||"lr-tb"==p||""==p?(this.isrtlmode=
"rtl"==r.css("direction"),this.isvertical=!1):(this.isrtlmode="vertical-rl"==p||"tb"==p||"tb-rl"==p||"rl-tb"==p,this.isvertical="vertical-rl"==p||"tb"==p||"tb-rl"==p)}else this.isrtlmode=!0===this.opt.rtlmode,this.isvertical=!1;this.observerbody=this.observerremover=this.observer=this.scrollmom=this.scrollrunning=!1;do this.id="ascrail"+P++;while(document.getElementById(this.id));this.hasmousefocus=this.hasfocus=this.zoomactive=this.zoom=this.selectiondrag=this.cursorfreezed=this.cursor=this.rail=
!1;this.visibility=!0;this.hidden=this.locked=this.railslocked=!1;this.cursoractive=!0;this.wheelprevented=!1;this.overflowx=a.opt.overflowx;this.overflowy=a.opt.overflowy;this.nativescrollingarea=!1;this.checkarea=0;this.events=[];this.saved={};this.delaylist={};this.synclist={};this.lastdeltay=this.lastdeltax=0;this.detected=R();var e=f.extend({},this.detected);this.ishwscroll=(this.canhwscroll=e.hastransform&&a.opt.hwacceleration)&&a.haswrapper;this.hasreversehr=this.isrtlmode?this.isvertical?
!(e.iswebkit||e.isie||e.isie11):!(e.iswebkit||e.isie&&!e.isie10&&!e.isie11):!1;this.istouchcapable=!1;e.cantouch||!e.hasw3ctouch&&!e.hasmstouch?!e.cantouch||e.isios||e.isandroid||!e.iswebkit&&!e.ismozilla||(this.istouchcapable=!0):this.istouchcapable=!0;a.opt.enablemouselockapi||(e.hasmousecapture=!1,e.haspointerlock=!1);this.debounced=function(b,g,c){a&&(a.delaylist[b]||(g.call(a),a.delaylist[b]={h:v(function(){a.delaylist[b].fn.call(a);a.delaylist[b]=!1},c)}),a.delaylist[b].fn=g)};var I=!1;this.synched=
function(b,g){a.synclist[b]=g;(function(){I||(v(function(){if(a){I=!1;for(var b in a.synclist){var g=a.synclist[b];g&&g.call(a);a.synclist[b]=!1}}}),I=!0)})();return b};this.unsynched=function(b){a.synclist[b]&&(a.synclist[b]=!1)};this.css=function(b,g){for(var c in g)a.saved.css.push([b,c,b.css(c)]),b.css(c,g[c])};this.scrollTop=function(b){return void 0===b?a.getScrollTop():a.setScrollTop(b)};this.scrollLeft=function(b){return void 0===b?a.getScrollLeft():a.setScrollLeft(b)};var D=function(a,g,
c,d,e,f,k){this.st=a;this.ed=g;this.spd=c;this.p1=d||0;this.p2=e||1;this.p3=f||0;this.p4=k||1;this.ts=(new Date).getTime();this.df=this.ed-this.st};D.prototype={B2:function(a){return 3*a*a*(1-a)},B3:function(a){return 3*a*(1-a)*(1-a)},B4:function(a){return(1-a)*(1-a)*(1-a)},getNow:function(){var a=1-((new Date).getTime()-this.ts)/this.spd,g=this.B2(a)+this.B3(a)+this.B4(a);return 0>a?this.ed:this.st+Math.round(this.df*g)},update:function(a,g){this.st=this.getNow();this.ed=a;this.spd=g;this.ts=(new Date).getTime();
this.df=this.ed-this.st;return this}};if(this.ishwscroll){this.doc.translate={x:0,y:0,tx:"0px",ty:"0px"};e.hastranslate3d&&e.isios&&this.doc.css("-webkit-backface-visibility","hidden");this.getScrollTop=function(b){if(!b){if(b=k())return 16==b.length?-b[13]:-b[5];if(a.timerscroll&&a.timerscroll.bz)return a.timerscroll.bz.getNow()}return a.doc.translate.y};this.getScrollLeft=function(b){if(!b){if(b=k())return 16==b.length?-b[12]:-b[4];if(a.timerscroll&&a.timerscroll.bh)return a.timerscroll.bh.getNow()}return a.doc.translate.x};
this.notifyScrollEvent=function(a){var g=document.createEvent("UIEvents");g.initUIEvent("scroll",!1,!0,window,1);g.niceevent=!0;a.dispatchEvent(g)};var y=this.isrtlmode?1:-1;e.hastranslate3d&&a.opt.enabletranslate3d?(this.setScrollTop=function(b,g){a.doc.translate.y=b;a.doc.translate.ty=-1*b+"px";a.doc.css(e.trstyle,"translate3d("+a.doc.translate.tx+","+a.doc.translate.ty+",0px)");g||a.notifyScrollEvent(a.win[0])},this.setScrollLeft=function(b,g){a.doc.translate.x=b;a.doc.translate.tx=b*y+"px";a.doc.css(e.trstyle,
"translate3d("+a.doc.translate.tx+","+a.doc.translate.ty+",0px)");g||a.notifyScrollEvent(a.win[0])}):(this.setScrollTop=function(b,g){a.doc.translate.y=b;a.doc.translate.ty=-1*b+"px";a.doc.css(e.trstyle,"translate("+a.doc.translate.tx+","+a.doc.translate.ty+")");g||a.notifyScrollEvent(a.win[0])},this.setScrollLeft=function(b,g){a.doc.translate.x=b;a.doc.translate.tx=b*y+"px";a.doc.css(e.trstyle,"translate("+a.doc.translate.tx+","+a.doc.translate.ty+")");g||a.notifyScrollEvent(a.win[0])})}else this.getScrollTop=
function(){return a.docscroll.scrollTop()},this.setScrollTop=function(b){return setTimeout(function(){a&&a.docscroll.scrollTop(b)},1)},this.getScrollLeft=function(){return a.hasreversehr?a.detected.ismozilla?a.page.maxw-Math.abs(a.docscroll.scrollLeft()):a.page.maxw-a.docscroll.scrollLeft():a.docscroll.scrollLeft()},this.setScrollLeft=function(b){return setTimeout(function(){if(a)return a.hasreversehr&&(b=a.detected.ismozilla?-(a.page.maxw-b):a.page.maxw-b),a.docscroll.scrollLeft(b)},1)};this.getTarget=
function(a){return a?a.target?a.target:a.srcElement?a.srcElement:!1:!1};this.hasParent=function(a,g){if(!a)return!1;for(var c=a.target||a.srcElement||a||!1;c&&c.id!=g;)c=c.parentNode||!1;return!1!==c};var z={thin:1,medium:3,thick:5};this.getDocumentScrollOffset=function(){return{top:window.pageYOffset||document.documentElement.scrollTop,left:window.pageXOffset||document.documentElement.scrollLeft}};this.getOffset=function(){if(a.isfixed){var b=a.win.offset(),g=a.getDocumentScrollOffset();b.top-=g.top;
b.left-=g.left;return b}b=a.win.offset();if(!a.viewport)return b;g=a.viewport.offset();return{top:b.top-g.top,left:b.left-g.left}};this.updateScrollBar=function(b){var g,c,e;if(a.ishwscroll)a.rail.css({height:a.win.innerHeight()-(a.opt.railpadding.top+a.opt.railpadding.bottom)}),a.railh&&a.railh.css({width:a.win.innerWidth()-(a.opt.railpadding.left+a.opt.railpadding.right)});else{var f=a.getOffset();g=f.top;c=f.left-(a.opt.railpadding.left+a.opt.railpadding.right);g+=d(a.win,"border-top-width",!0);
c+=a.rail.align?a.win.outerWidth()-d(a.win,"border-right-width")-a.rail.width:d(a.win,"border-left-width");if(e=a.opt.railoffset)e.top&&(g+=e.top),e.left&&(c+=e.left);a.railslocked||a.rail.css({top:g,left:c,height:(b?b.h:a.win.innerHeight())-(a.opt.railpadding.top+a.opt.railpadding.bottom)});a.zoom&&a.zoom.css({top:g+1,left:1==a.rail.align?c-20:c+a.rail.width+4});if(a.railh&&!a.railslocked){g=f.top;c=f.left;if(e=a.opt.railhoffset)e.top&&(g+=e.top),e.left&&(c+=e.left);b=a.railh.align?g+d(a.win,"border-top-width",
!0)+a.win.innerHeight()-a.railh.height:g+d(a.win,"border-top-width",!0);c+=d(a.win,"border-left-width");a.railh.css({top:b-(a.opt.railpadding.top+a.opt.railpadding.bottom),left:c,width:a.railh.width})}}};this.doRailClick=function(b,g,c){var d;a.railslocked||(a.cancelEvent(b),g?(g=c?a.doScrollLeft:a.doScrollTop,d=c?(b.pageX-a.railh.offset().left-a.cursorwidth/2)*a.scrollratio.x:(b.pageY-a.rail.offset().top-a.cursorheight/2)*a.scrollratio.y,g(d)):(g=c?a.doScrollLeftBy:a.doScrollBy,d=c?a.scroll.x:a.scroll.y,
b=c?b.pageX-a.railh.offset().left:b.pageY-a.rail.offset().top,c=c?a.view.w:a.view.h,g(d>=b?c:-c)))};a.hasanimationframe=v;a.hascancelanimationframe=w;a.hasanimationframe?a.hascancelanimationframe||(w=function(){a.cancelAnimationFrame=!0}):(v=function(a){return setTimeout(a,15-Math.floor(+new Date/1E3)%16)},w=clearTimeout);this.init=function(){a.saved.css=[];if(e.isie7mobile||e.isoperamini)return!0;e.hasmstouch&&a.css(a.ispage?f("html"):a.win,{_touchaction:"none"});var b=e.ismodernie||e.isie10?{"-ms-overflow-style":"none"}:
{"overflow-y":"hidden"};a.zindex="auto";a.zindex=a.ispage||"auto"!=a.opt.zindex?a.opt.zindex:l()||"auto";!a.ispage&&"auto"!=a.zindex&&a.zindex>A&&(A=a.zindex);a.isie&&0==a.zindex&&"auto"==a.opt.zindex&&(a.zindex="auto");if(!a.ispage||!e.cantouch&&!e.isieold&&!e.isie9mobile){var c=a.docscroll;a.ispage&&(c=a.haswrapper?a.win:a.doc);e.isie9mobile||a.css(c,b);a.ispage&&e.isie7&&("BODY"==a.doc[0].nodeName?a.css(f("html"),{"overflow-y":"hidden"}):"HTML"==a.doc[0].nodeName&&a.css(f("body"),b));!e.isios||
a.ispage||a.haswrapper||a.css(f("body"),{"-webkit-overflow-scrolling":"touch"});var d=f(document.createElement("div"));d.css({position:"relative",top:0,"float":"right",width:a.opt.cursorwidth,height:0,"background-color":a.opt.cursorcolor,border:a.opt.cursorborder,"background-clip":"padding-box","-webkit-border-radius":a.opt.cursorborderradius,"-moz-border-radius":a.opt.cursorborderradius,"border-radius":a.opt.cursorborderradius});d.hborder=parseFloat(d.outerHeight()-d.innerHeight());d.addClass("nicescroll-cursors");
a.cursor=d;var m=f(document.createElement("div"));m.attr("id",a.id);m.addClass("nicescroll-rails nicescroll-rails-vr");var k,h,p=["left","right","top","bottom"],L;for(L in p)h=p[L],(k=a.opt.railpadding[h])?m.css("padding-"+h,k+"px"):a.opt.railpadding[h]=0;m.append(d);m.width=Math.max(parseFloat(a.opt.cursorwidth),d.outerWidth());m.css({width:m.width+"px",zIndex:a.zindex,background:a.opt.background,cursor:"default"});m.visibility=!0;m.scrollable=!0;m.align="left"==a.opt.railalign?0:1;a.rail=m;d=a.rail.drag=
!1;!a.opt.boxzoom||a.ispage||e.isieold||(d=document.createElement("div"),a.bind(d,"click",a.doZoom),a.bind(d,"mouseenter",function(){a.zoom.css("opacity",a.opt.cursoropacitymax)}),a.bind(d,"mouseleave",function(){a.zoom.css("opacity",a.opt.cursoropacitymin)}),a.zoom=f(d),a.zoom.css({cursor:"pointer",zIndex:a.zindex,backgroundImage:"url("+a.opt.scriptpath+"zoomico.png)",height:18,width:18,backgroundPosition:"0px 0px"}),a.opt.dblclickzoom&&a.bind(a.win,"dblclick",a.doZoom),e.cantouch&&a.opt.gesturezoom&&
(a.ongesturezoom=function(b){1.5<b.scale&&a.doZoomIn(b);.8>b.scale&&a.doZoomOut(b);return a.cancelEvent(b)},a.bind(a.win,"gestureend",a.ongesturezoom)));a.railh=!1;var n;a.opt.horizrailenabled&&(a.css(c,{overflowX:"hidden"}),d=f(document.createElement("div")),d.css({position:"absolute",top:0,height:a.opt.cursorwidth,width:0,backgroundColor:a.opt.cursorcolor,border:a.opt.cursorborder,backgroundClip:"padding-box","-webkit-border-radius":a.opt.cursorborderradius,"-moz-border-radius":a.opt.cursorborderradius,
"border-radius":a.opt.cursorborderradius}),e.isieold&&d.css("overflow","hidden"),d.wborder=parseFloat(d.outerWidth()-d.innerWidth()),d.addClass("nicescroll-cursors"),a.cursorh=d,n=f(document.createElement("div")),n.attr("id",a.id+"-hr"),n.addClass("nicescroll-rails nicescroll-rails-hr"),n.height=Math.max(parseFloat(a.opt.cursorwidth),d.outerHeight()),n.css({height:n.height+"px",zIndex:a.zindex,background:a.opt.background}),n.append(d),n.visibility=!0,n.scrollable=!0,n.align="top"==a.opt.railvalign?
0:1,a.railh=n,a.railh.drag=!1);a.ispage?(m.css({position:"fixed",top:0,height:"100%"}),m.align?m.css({right:0}):m.css({left:0}),a.body.append(m),a.railh&&(n.css({position:"fixed",left:0,width:"100%"}),n.align?n.css({bottom:0}):n.css({top:0}),a.body.append(n))):(a.ishwscroll?("static"==a.win.css("position")&&a.css(a.win,{position:"relative"}),c="HTML"==a.win[0].nodeName?a.body:a.win,f(c).scrollTop(0).scrollLeft(0),a.zoom&&(a.zoom.css({position:"absolute",top:1,right:0,"margin-right":m.width+4}),c.append(a.zoom)),
m.css({position:"absolute",top:0}),m.align?m.css({right:0}):m.css({left:0}),c.append(m),n&&(n.css({position:"absolute",left:0,bottom:0}),n.align?n.css({bottom:0}):n.css({top:0}),c.append(n))):(a.isfixed="fixed"==a.win.css("position"),c=a.isfixed?"fixed":"absolute",a.isfixed||(a.viewport=a.getViewport(a.win[0])),a.viewport&&(a.body=a.viewport,0==/fixed|absolute/.test(a.viewport.css("position"))&&a.css(a.viewport,{position:"relative"})),m.css({position:c}),a.zoom&&a.zoom.css({position:c}),a.updateScrollBar(),
a.body.append(m),a.zoom&&a.body.append(a.zoom),a.railh&&(n.css({position:c}),a.body.append(n))),e.isios&&a.css(a.win,{"-webkit-tap-highlight-color":"rgba(0,0,0,0)","-webkit-touch-callout":"none"}),e.isie&&a.opt.disableoutline&&a.win.attr("hideFocus","true"),e.iswebkit&&a.opt.disableoutline&&a.win.css("outline","none"));!1===a.opt.autohidemode?(a.autohidedom=!1,a.rail.css({opacity:a.opt.cursoropacitymax}),a.railh&&a.railh.css({opacity:a.opt.cursoropacitymax})):!0===a.opt.autohidemode||"leave"===a.opt.autohidemode?
(a.autohidedom=f().add(a.rail),e.isie8&&(a.autohidedom=a.autohidedom.add(a.cursor)),a.railh&&(a.autohidedom=a.autohidedom.add(a.railh)),a.railh&&e.isie8&&(a.autohidedom=a.autohidedom.add(a.cursorh))):"scroll"==a.opt.autohidemode?(a.autohidedom=f().add(a.rail),a.railh&&(a.autohidedom=a.autohidedom.add(a.railh))):"cursor"==a.opt.autohidemode?(a.autohidedom=f().add(a.cursor),a.railh&&(a.autohidedom=a.autohidedom.add(a.cursorh))):"hidden"==a.opt.autohidemode&&(a.autohidedom=!1,a.hide(),a.railslocked=
!1);if(e.isie9mobile)a.scrollmom=new M(a),a.onmangotouch=function(){var b=a.getScrollTop(),c=a.getScrollLeft();if(b==a.scrollmom.lastscrolly&&c==a.scrollmom.lastscrollx)return!0;var g=b-a.mangotouch.sy,d=c-a.mangotouch.sx;if(0!=Math.round(Math.sqrt(Math.pow(d,2)+Math.pow(g,2)))){var e=0>g?-1:1,f=0>d?-1:1,u=+new Date;a.mangotouch.lazy&&clearTimeout(a.mangotouch.lazy);80<u-a.mangotouch.tm||a.mangotouch.dry!=e||a.mangotouch.drx!=f?(a.scrollmom.stop(),a.scrollmom.reset(c,b),a.mangotouch.sy=b,a.mangotouch.ly=
b,a.mangotouch.sx=c,a.mangotouch.lx=c,a.mangotouch.dry=e,a.mangotouch.drx=f,a.mangotouch.tm=u):(a.scrollmom.stop(),a.scrollmom.update(a.mangotouch.sx-d,a.mangotouch.sy-g),a.mangotouch.tm=u,g=Math.max(Math.abs(a.mangotouch.ly-b),Math.abs(a.mangotouch.lx-c)),a.mangotouch.ly=b,a.mangotouch.lx=c,2<g&&(a.mangotouch.lazy=setTimeout(function(){a.mangotouch.lazy=!1;a.mangotouch.dry=0;a.mangotouch.drx=0;a.mangotouch.tm=0;a.scrollmom.doMomentum(30)},100)))}},m=a.getScrollTop(),n=a.getScrollLeft(),a.mangotouch=
{sy:m,ly:m,dry:0,sx:n,lx:n,drx:0,lazy:!1,tm:0},a.bind(a.docscroll,"scroll",a.onmangotouch);else{if(e.cantouch||a.istouchcapable||a.opt.touchbehavior||e.hasmstouch){a.scrollmom=new M(a);a.ontouchstart=function(b){if(b.pointerType&&2!=b.pointerType&&"touch"!=b.pointerType)return!1;a.hasmoving=!1;if(!a.railslocked){var c;if(e.hasmstouch)for(c=b.target?b.target:!1;c;){var g=f(c).getNiceScroll();if(0<g.length&&g[0].me==a.me)break;if(0<g.length)return!1;if("DIV"==c.nodeName&&c.id==a.id)break;c=c.parentNode?
c.parentNode:!1}a.cancelScroll();if((c=a.getTarget(b))&&/INPUT/i.test(c.nodeName)&&/range/i.test(c.type))return a.stopPropagation(b);!("clientX"in b)&&"changedTouches"in b&&(b.clientX=b.changedTouches[0].clientX,b.clientY=b.changedTouches[0].clientY);a.forcescreen&&(g=b,b={original:b.original?b.original:b},b.clientX=g.screenX,b.clientY=g.screenY);a.rail.drag={x:b.clientX,y:b.clientY,sx:a.scroll.x,sy:a.scroll.y,st:a.getScrollTop(),sl:a.getScrollLeft(),pt:2,dl:!1};if(a.ispage||!a.opt.directionlockdeadzone)a.rail.drag.dl=
"f";else{var g=f(window).width(),d=f(window).height(),d=Math.max(0,Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)-d),g=Math.max(0,Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-g);a.rail.drag.ck=!a.rail.scrollable&&a.railh.scrollable?0<d?"v":!1:a.rail.scrollable&&!a.railh.scrollable?0<g?"h":!1:!1;a.rail.drag.ck||(a.rail.drag.dl="f")}a.opt.touchbehavior&&a.isiframe&&e.isie&&(g=a.win.position(),a.rail.drag.x+=g.left,a.rail.drag.y+=g.top);a.hasmoving=
!1;a.lastmouseup=!1;a.scrollmom.reset(b.clientX,b.clientY);if(!e.cantouch&&!this.istouchcapable&&!b.pointerType){if(!c||!/INPUT|SELECT|TEXTAREA/i.test(c.nodeName))return!a.ispage&&e.hasmousecapture&&c.setCapture(),a.opt.touchbehavior?(c.onclick&&!c._onclick&&(c._onclick=c.onclick,c.onclick=function(b){if(a.hasmoving)return!1;c._onclick.call(this,b)}),a.cancelEvent(b)):a.stopPropagation(b);/SUBMIT|CANCEL|BUTTON/i.test(f(c).attr("type"))&&(pc={tg:c,click:!1},a.preventclick=pc)}}};a.ontouchend=function(b){if(!a.rail.drag)return!0;
if(2==a.rail.drag.pt){if(b.pointerType&&2!=b.pointerType&&"touch"!=b.pointerType)return!1;a.scrollmom.doMomentum();a.rail.drag=!1;if(a.hasmoving&&(a.lastmouseup=!0,a.hideCursor(),e.hasmousecapture&&document.releaseCapture(),!e.cantouch))return a.cancelEvent(b)}else if(1==a.rail.drag.pt)return a.onmouseup(b)};var q=a.opt.touchbehavior&&a.isiframe&&!e.hasmousecapture;a.ontouchmove=function(b,c){if(!a.rail.drag||b.targetTouches&&a.opt.preventmultitouchscrolling&&1<b.targetTouches.length||b.pointerType&&
2!=b.pointerType&&"touch"!=b.pointerType)return!1;if(2==a.rail.drag.pt){if(e.cantouch&&e.isios&&void 0===b.original)return!0;a.hasmoving=!0;a.preventclick&&!a.preventclick.click&&(a.preventclick.click=a.preventclick.tg.onclick||!1,a.preventclick.tg.onclick=a.onpreventclick);b=f.extend({original:b},b);"changedTouches"in b&&(b.clientX=b.changedTouches[0].clientX,b.clientY=b.changedTouches[0].clientY);if(a.forcescreen){var g=b;b={original:b.original?b.original:b};b.clientX=g.screenX;b.clientY=g.screenY}var d,
g=d=0;q&&!c&&(d=a.win.position(),g=-d.left,d=-d.top);var u=b.clientY+d;d=u-a.rail.drag.y;var m=b.clientX+g,k=m-a.rail.drag.x,h=a.rail.drag.st-d;a.ishwscroll&&a.opt.bouncescroll?0>h?h=Math.round(h/2):h>a.page.maxh&&(h=a.page.maxh+Math.round((h-a.page.maxh)/2)):(0>h&&(u=h=0),h>a.page.maxh&&(h=a.page.maxh,u=0));var l;a.railh&&a.railh.scrollable&&(l=a.isrtlmode?k-a.rail.drag.sl:a.rail.drag.sl-k,a.ishwscroll&&a.opt.bouncescroll?0>l?l=Math.round(l/2):l>a.page.maxw&&(l=a.page.maxw+Math.round((l-a.page.maxw)/
2)):(0>l&&(m=l=0),l>a.page.maxw&&(l=a.page.maxw,m=0)));g=!1;if(a.rail.drag.dl)g=!0,"v"==a.rail.drag.dl?l=a.rail.drag.sl:"h"==a.rail.drag.dl&&(h=a.rail.drag.st);else{d=Math.abs(d);var k=Math.abs(k),C=a.opt.directionlockdeadzone;if("v"==a.rail.drag.ck){if(d>C&&k<=.3*d)return a.rail.drag=!1,!0;k>C&&(a.rail.drag.dl="f",f("body").scrollTop(f("body").scrollTop()))}else if("h"==a.rail.drag.ck){if(k>C&&d<=.3*k)return a.rail.drag=!1,!0;d>C&&(a.rail.drag.dl="f",f("body").scrollLeft(f("body").scrollLeft()))}}a.synched("touchmove",
function(){a.rail.drag&&2==a.rail.drag.pt&&(a.prepareTransition&&a.prepareTransition(0),a.rail.scrollable&&a.setScrollTop(h),a.scrollmom.update(m,u),a.railh&&a.railh.scrollable?(a.setScrollLeft(l),a.showCursor(h,l)):a.showCursor(h),e.isie10&&document.selection.clear())});e.ischrome&&a.istouchcapable&&(g=!1);if(g)return a.cancelEvent(b)}else if(1==a.rail.drag.pt)return a.onmousemove(b)}}a.onmousedown=function(b,c){if(!a.rail.drag||1==a.rail.drag.pt){if(a.railslocked)return a.cancelEvent(b);a.cancelScroll();
a.rail.drag={x:b.clientX,y:b.clientY,sx:a.scroll.x,sy:a.scroll.y,pt:1,hr:!!c};var g=a.getTarget(b);!a.ispage&&e.hasmousecapture&&g.setCapture();a.isiframe&&!e.hasmousecapture&&(a.saved.csspointerevents=a.doc.css("pointer-events"),a.css(a.doc,{"pointer-events":"none"}));a.hasmoving=!1;return a.cancelEvent(b)}};a.onmouseup=function(b){if(a.rail.drag){if(1!=a.rail.drag.pt)return!0;e.hasmousecapture&&document.releaseCapture();a.isiframe&&!e.hasmousecapture&&a.doc.css("pointer-events",a.saved.csspointerevents);
a.rail.drag=!1;a.hasmoving&&a.triggerScrollEnd();return a.cancelEvent(b)}};a.onmousemove=function(b){if(a.rail.drag){if(1==a.rail.drag.pt){if(e.ischrome&&0==b.which)return a.onmouseup(b);a.cursorfreezed=!0;a.hasmoving=!0;if(a.rail.drag.hr){a.scroll.x=a.rail.drag.sx+(b.clientX-a.rail.drag.x);0>a.scroll.x&&(a.scroll.x=0);var c=a.scrollvaluemaxw;a.scroll.x>c&&(a.scroll.x=c)}else a.scroll.y=a.rail.drag.sy+(b.clientY-a.rail.drag.y),0>a.scroll.y&&(a.scroll.y=0),c=a.scrollvaluemax,a.scroll.y>c&&(a.scroll.y=
c);a.synched("mousemove",function(){a.rail.drag&&1==a.rail.drag.pt&&(a.showCursor(),a.rail.drag.hr?a.hasreversehr?a.doScrollLeft(a.scrollvaluemaxw-Math.round(a.scroll.x*a.scrollratio.x),a.opt.cursordragspeed):a.doScrollLeft(Math.round(a.scroll.x*a.scrollratio.x),a.opt.cursordragspeed):a.doScrollTop(Math.round(a.scroll.y*a.scrollratio.y),a.opt.cursordragspeed))});return a.cancelEvent(b)}}else a.checkarea=0};if(e.cantouch||a.opt.touchbehavior)a.onpreventclick=function(b){if(a.preventclick)return a.preventclick.tg.onclick=
a.preventclick.click,a.preventclick=!1,a.cancelEvent(b)},a.bind(a.win,"mousedown",a.ontouchstart),a.onclick=e.isios?!1:function(b){return a.lastmouseup?(a.lastmouseup=!1,a.cancelEvent(b)):!0},a.opt.grabcursorenabled&&e.cursorgrabvalue&&(a.css(a.ispage?a.doc:a.win,{cursor:e.cursorgrabvalue}),a.css(a.rail,{cursor:e.cursorgrabvalue}));else{var r=function(b){if(a.selectiondrag){if(b){var c=a.win.outerHeight();b=b.pageY-a.selectiondrag.top;0<b&&b<c&&(b=0);b>=c&&(b-=c);a.selectiondrag.df=b}0!=a.selectiondrag.df&&
(a.doScrollBy(2*-Math.floor(a.selectiondrag.df/6)),a.debounced("doselectionscroll",function(){r()},50))}};a.hasTextSelected="getSelection"in document?function(){return 0<document.getSelection().rangeCount}:"selection"in document?function(){return"None"!=document.selection.type}:function(){return!1};a.onselectionstart=function(b){a.ispage||(a.selectiondrag=a.win.offset())};a.onselectionend=function(b){a.selectiondrag=!1};a.onselectiondrag=function(b){a.selectiondrag&&a.hasTextSelected()&&a.debounced("selectionscroll",
function(){r(b)},250)}}e.hasw3ctouch?(a.css(a.rail,{"touch-action":"none"}),a.css(a.cursor,{"touch-action":"none"}),a.bind(a.win,"pointerdown",a.ontouchstart),a.bind(document,"pointerup",a.ontouchend),a.bind(document,"pointermove",a.ontouchmove)):e.hasmstouch?(a.css(a.rail,{"-ms-touch-action":"none"}),a.css(a.cursor,{"-ms-touch-action":"none"}),a.bind(a.win,"MSPointerDown",a.ontouchstart),a.bind(document,"MSPointerUp",a.ontouchend),a.bind(document,"MSPointerMove",a.ontouchmove),a.bind(a.cursor,"MSGestureHold",
function(a){a.preventDefault()}),a.bind(a.cursor,"contextmenu",function(a){a.preventDefault()})):this.istouchcapable&&(a.bind(a.win,"touchstart",a.ontouchstart),a.bind(document,"touchend",a.ontouchend),a.bind(document,"touchcancel",a.ontouchend),a.bind(document,"touchmove",a.ontouchmove));if(a.opt.cursordragontouch||!e.cantouch&&!a.opt.touchbehavior)a.rail.css({cursor:"default"}),a.railh&&a.railh.css({cursor:"default"}),a.jqbind(a.rail,"mouseenter",function(){if(!a.ispage&&!a.win.is(":visible"))return!1;
a.canshowonmouseevent&&a.showCursor();a.rail.active=!0}),a.jqbind(a.rail,"mouseleave",function(){a.rail.active=!1;a.rail.drag||a.hideCursor()}),a.opt.sensitiverail&&(a.bind(a.rail,"click",function(b){a.doRailClick(b,!1,!1)}),a.bind(a.rail,"dblclick",function(b){a.doRailClick(b,!0,!1)}),a.bind(a.cursor,"click",function(b){a.cancelEvent(b)}),a.bind(a.cursor,"dblclick",function(b){a.cancelEvent(b)})),a.railh&&(a.jqbind(a.railh,"mouseenter",function(){if(!a.ispage&&!a.win.is(":visible"))return!1;a.canshowonmouseevent&&
a.showCursor();a.rail.active=!0}),a.jqbind(a.railh,"mouseleave",function(){a.rail.active=!1;a.rail.drag||a.hideCursor()}),a.opt.sensitiverail&&(a.bind(a.railh,"click",function(b){a.doRailClick(b,!1,!0)}),a.bind(a.railh,"dblclick",function(b){a.doRailClick(b,!0,!0)}),a.bind(a.cursorh,"click",function(b){a.cancelEvent(b)}),a.bind(a.cursorh,"dblclick",function(b){a.cancelEvent(b)})));e.cantouch||a.opt.touchbehavior?(a.bind(e.hasmousecapture?a.win:document,"mouseup",a.ontouchend),a.bind(document,"mousemove",
a.ontouchmove),a.onclick&&a.bind(document,"click",a.onclick),a.opt.cursordragontouch?(a.bind(a.cursor,"mousedown",a.onmousedown),a.bind(a.cursor,"mouseup",a.onmouseup),a.cursorh&&a.bind(a.cursorh,"mousedown",function(b){a.onmousedown(b,!0)}),a.cursorh&&a.bind(a.cursorh,"mouseup",a.onmouseup)):(a.bind(a.rail,"mousedown",function(a){a.preventDefault()}),a.railh&&a.bind(a.railh,"mousedown",function(a){a.preventDefault()}))):(a.bind(e.hasmousecapture?a.win:document,"mouseup",a.onmouseup),a.bind(document,
"mousemove",a.onmousemove),a.onclick&&a.bind(document,"click",a.onclick),a.bind(a.cursor,"mousedown",a.onmousedown),a.bind(a.cursor,"mouseup",a.onmouseup),a.railh&&(a.bind(a.cursorh,"mousedown",function(b){a.onmousedown(b,!0)}),a.bind(a.cursorh,"mouseup",a.onmouseup)),!a.ispage&&a.opt.enablescrollonselection&&(a.bind(a.win[0],"mousedown",a.onselectionstart),a.bind(document,"mouseup",a.onselectionend),a.bind(a.cursor,"mouseup",a.onselectionend),a.cursorh&&a.bind(a.cursorh,"mouseup",a.onselectionend),
a.bind(document,"mousemove",a.onselectiondrag)),a.zoom&&(a.jqbind(a.zoom,"mouseenter",function(){a.canshowonmouseevent&&a.showCursor();a.rail.active=!0}),a.jqbind(a.zoom,"mouseleave",function(){a.rail.active=!1;a.rail.drag||a.hideCursor()})));a.opt.enablemousewheel&&(a.isiframe||a.mousewheel(e.isie&&a.ispage?document:a.win,a.onmousewheel),a.mousewheel(a.rail,a.onmousewheel),a.railh&&a.mousewheel(a.railh,a.onmousewheelhr));a.ispage||e.cantouch||/HTML|^BODY/.test(a.win[0].nodeName)||(a.win.attr("tabindex")||
a.win.attr({tabindex:O++}),a.jqbind(a.win,"focus",function(b){B=a.getTarget(b).id||!0;a.hasfocus=!0;a.canshowonmouseevent&&a.noticeCursor()}),a.jqbind(a.win,"blur",function(b){B=!1;a.hasfocus=!1}),a.jqbind(a.win,"mouseenter",function(b){F=a.getTarget(b).id||!0;a.hasmousefocus=!0;a.canshowonmouseevent&&a.noticeCursor()}),a.jqbind(a.win,"mouseleave",function(){F=!1;a.hasmousefocus=!1;a.rail.drag||a.hideCursor()}))}a.onkeypress=function(b){if(a.railslocked&&0==a.page.maxh)return!0;b=b?b:window.e;var c=
a.getTarget(b);if(c&&/INPUT|TEXTAREA|SELECT|OPTION/.test(c.nodeName)&&(!c.getAttribute("type")&&!c.type||!/submit|button|cancel/i.tp)||f(c).attr("contenteditable"))return!0;if(a.hasfocus||a.hasmousefocus&&!B||a.ispage&&!B&&!F){c=b.keyCode;if(a.railslocked&&27!=c)return a.cancelEvent(b);var g=b.ctrlKey||!1,d=b.shiftKey||!1,e=!1;switch(c){case 38:case 63233:a.doScrollBy(72);e=!0;break;case 40:case 63235:a.doScrollBy(-72);e=!0;break;case 37:case 63232:a.railh&&(g?a.doScrollLeft(0):a.doScrollLeftBy(72),
e=!0);break;case 39:case 63234:a.railh&&(g?a.doScrollLeft(a.page.maxw):a.doScrollLeftBy(-72),e=!0);break;case 33:case 63276:a.doScrollBy(a.view.h);e=!0;break;case 34:case 63277:a.doScrollBy(-a.view.h);e=!0;break;case 36:case 63273:a.railh&&g?a.doScrollPos(0,0):a.doScrollTo(0);e=!0;break;case 35:case 63275:a.railh&&g?a.doScrollPos(a.page.maxw,a.page.maxh):a.doScrollTo(a.page.maxh);e=!0;break;case 32:a.opt.spacebarenabled&&(d?a.doScrollBy(a.view.h):a.doScrollBy(-a.view.h),e=!0);break;case 27:a.zoomactive&&
(a.doZoom(),e=!0)}if(e)return a.cancelEvent(b)}};a.opt.enablekeyboard&&a.bind(document,e.isopera&&!e.isopera12?"keypress":"keydown",a.onkeypress);a.bind(document,"keydown",function(b){b.ctrlKey&&(a.wheelprevented=!0)});a.bind(document,"keyup",function(b){b.ctrlKey||(a.wheelprevented=!1)});a.bind(window,"blur",function(b){a.wheelprevented=!1});a.bind(window,"resize",a.lazyResize);a.bind(window,"orientationchange",a.lazyResize);a.bind(window,"load",a.lazyResize);if(e.ischrome&&!a.ispage&&!a.haswrapper){var t=
a.win.attr("style"),m=parseFloat(a.win.css("width"))+1;a.win.css("width",m);a.synched("chromefix",function(){a.win.attr("style",t)})}a.onAttributeChange=function(b){a.lazyResize(a.isieold?250:30)};a.isie11||!1===x||(a.observerbody=new x(function(b){b.forEach(function(b){if("attributes"==b.type)return f("body").hasClass("modal-open")&&f("body").hasClass("modal-dialog")&&!f.contains(f(".modal-dialog")[0],a.doc[0])?a.hide():a.show()});if(document.body.scrollHeight!=a.page.maxh)return a.lazyResize(30)}),
a.observerbody.observe(document.body,{childList:!0,subtree:!0,characterData:!1,attributes:!0,attributeFilter:["class"]}));a.ispage||a.haswrapper||(!1!==x?(a.observer=new x(function(b){b.forEach(a.onAttributeChange)}),a.observer.observe(a.win[0],{childList:!0,characterData:!1,attributes:!0,subtree:!1}),a.observerremover=new x(function(b){b.forEach(function(b){if(0<b.removedNodes.length)for(var c in b.removedNodes)if(a&&b.removedNodes[c]==a.win[0])return a.remove()})}),a.observerremover.observe(a.win[0].parentNode,
{childList:!0,characterData:!1,attributes:!1,subtree:!1})):(a.bind(a.win,e.isie&&!e.isie9?"propertychange":"DOMAttrModified",a.onAttributeChange),e.isie9&&a.win[0].attachEvent("onpropertychange",a.onAttributeChange),a.bind(a.win,"DOMNodeRemoved",function(b){b.target==a.win[0]&&a.remove()})));!a.ispage&&a.opt.boxzoom&&a.bind(window,"resize",a.resizeZoom);a.istextarea&&(a.bind(a.win,"keydown",a.lazyResize),a.bind(a.win,"mouseup",a.lazyResize));a.lazyResize(30)}if("IFRAME"==this.doc[0].nodeName){var N=
function(){a.iframexd=!1;var c;try{c="contentDocument"in this?this.contentDocument:this.contentWindow.document}catch(g){a.iframexd=!0,c=!1}if(a.iframexd)return"console"in window&&console.log("NiceScroll error: policy restriced iframe"),!0;a.forcescreen=!0;a.isiframe&&(a.iframe={doc:f(c),html:a.doc.contents().find("html")[0],body:a.doc.contents().find("body")[0]},a.getContentSize=function(){return{w:Math.max(a.iframe.html.scrollWidth,a.iframe.body.scrollWidth),h:Math.max(a.iframe.html.scrollHeight,
a.iframe.body.scrollHeight)}},a.docscroll=f(a.iframe.body));if(!e.isios&&a.opt.iframeautoresize&&!a.isiframe){a.win.scrollTop(0);a.doc.height("");var d=Math.max(c.getElementsByTagName("html")[0].scrollHeight,c.body.scrollHeight);a.doc.height(d)}a.lazyResize(30);e.isie7&&a.css(f(a.iframe.html),b);a.css(f(a.iframe.body),b);e.isios&&a.haswrapper&&a.css(f(c.body),{"-webkit-transform":"translate3d(0,0,0)"});"contentWindow"in this?a.bind(this.contentWindow,"scroll",a.onscroll):a.bind(c,"scroll",a.onscroll);
a.opt.enablemousewheel&&a.mousewheel(c,a.onmousewheel);a.opt.enablekeyboard&&a.bind(c,e.isopera?"keypress":"keydown",a.onkeypress);if(e.cantouch||a.opt.touchbehavior)a.bind(c,"mousedown",a.ontouchstart),a.bind(c,"mousemove",function(b){return a.ontouchmove(b,!0)}),a.opt.grabcursorenabled&&e.cursorgrabvalue&&a.css(f(c.body),{cursor:e.cursorgrabvalue});a.bind(c,"mouseup",a.ontouchend);a.zoom&&(a.opt.dblclickzoom&&a.bind(c,"dblclick",a.doZoom),a.ongesturezoom&&a.bind(c,"gestureend",a.ongesturezoom))};
this.doc[0].readyState&&"complete"==this.doc[0].readyState&&setTimeout(function(){N.call(a.doc[0],!1)},500);a.bind(this.doc,"load",N)}};this.showCursor=function(b,c){a.cursortimeout&&(clearTimeout(a.cursortimeout),a.cursortimeout=0);if(a.rail){a.autohidedom&&(a.autohidedom.stop().css({opacity:a.opt.cursoropacitymax}),a.cursoractive=!0);a.rail.drag&&1==a.rail.drag.pt||(void 0!==b&&!1!==b&&(a.scroll.y=Math.round(1*b/a.scrollratio.y)),void 0!==c&&(a.scroll.x=Math.round(1*c/a.scrollratio.x)));a.cursor.css({height:a.cursorheight,
top:a.scroll.y});if(a.cursorh){var d=a.hasreversehr?a.scrollvaluemaxw-a.scroll.x:a.scroll.x;!a.rail.align&&a.rail.visibility?a.cursorh.css({width:a.cursorwidth,left:d+a.rail.width}):a.cursorh.css({width:a.cursorwidth,left:d});a.cursoractive=!0}a.zoom&&a.zoom.stop().css({opacity:a.opt.cursoropacitymax})}};this.hideCursor=function(b){a.cursortimeout||!a.rail||!a.autohidedom||a.hasmousefocus&&"leave"==a.opt.autohidemode||(a.cursortimeout=setTimeout(function(){a.rail.active&&a.showonmouseevent||(a.autohidedom.stop().animate({opacity:a.opt.cursoropacitymin}),
a.zoom&&a.zoom.stop().animate({opacity:a.opt.cursoropacitymin}),a.cursoractive=!1);a.cursortimeout=0},b||a.opt.hidecursordelay))};this.noticeCursor=function(b,c,d){a.showCursor(c,d);a.rail.active||a.hideCursor(b)};this.getContentSize=a.ispage?function(){return{w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)}}:a.haswrapper?function(){return{w:a.doc.outerWidth()+parseInt(a.win.css("paddingLeft"))+
parseInt(a.win.css("paddingRight")),h:a.doc.outerHeight()+parseInt(a.win.css("paddingTop"))+parseInt(a.win.css("paddingBottom"))}}:function(){return{w:a.docscroll[0].scrollWidth,h:a.docscroll[0].scrollHeight}};this.onResize=function(b,c){if(!a||!a.win)return!1;if(!a.haswrapper&&!a.ispage){if("none"==a.win.css("display"))return a.visibility&&a.hideRail().hideRailHr(),!1;a.hidden||a.visibility||a.showRail().showRailHr()}var d=a.page.maxh,e=a.page.maxw,f=a.view.h,k=a.view.w;a.view={w:a.ispage?a.win.width():
parseInt(a.win[0].clientWidth),h:a.ispage?a.win.height():parseInt(a.win[0].clientHeight)};a.page=c?c:a.getContentSize();a.page.maxh=Math.max(0,a.page.h-a.view.h);a.page.maxw=Math.max(0,a.page.w-a.view.w);if(a.page.maxh==d&&a.page.maxw==e&&a.view.w==k&&a.view.h==f){if(a.ispage)return a;d=a.win.offset();if(a.lastposition&&(e=a.lastposition,e.top==d.top&&e.left==d.left))return a;a.lastposition=d}0==a.page.maxh?(a.hideRail(),a.scrollvaluemax=0,a.scroll.y=0,a.scrollratio.y=0,a.cursorheight=0,a.setScrollTop(0),
a.rail&&(a.rail.scrollable=!1)):(a.page.maxh-=a.opt.railpadding.top+a.opt.railpadding.bottom,a.rail.scrollable=!0);0==a.page.maxw?(a.hideRailHr(),a.scrollvaluemaxw=0,a.scroll.x=0,a.scrollratio.x=0,a.cursorwidth=0,a.setScrollLeft(0),a.railh&&(a.railh.scrollable=!1)):(a.page.maxw-=a.opt.railpadding.left+a.opt.railpadding.right,a.railh&&(a.railh.scrollable=a.opt.horizrailenabled));a.railslocked=a.locked||0==a.page.maxh&&0==a.page.maxw;if(a.railslocked)return a.ispage||a.updateScrollBar(a.view),!1;a.hidden||
a.visibility?!a.railh||a.hidden||a.railh.visibility||a.showRailHr():a.showRail().showRailHr();a.istextarea&&a.win.css("resize")&&"none"!=a.win.css("resize")&&(a.view.h-=20);a.cursorheight=Math.min(a.view.h,Math.round(a.view.h/a.page.h*a.view.h));a.cursorheight=a.opt.cursorfixedheight?a.opt.cursorfixedheight:Math.max(a.opt.cursorminheight,a.cursorheight);a.cursorwidth=Math.min(a.view.w,Math.round(a.view.w/a.page.w*a.view.w));a.cursorwidth=a.opt.cursorfixedheight?a.opt.cursorfixedheight:Math.max(a.opt.cursorminheight,
a.cursorwidth);a.scrollvaluemax=a.view.h-a.cursorheight-a.cursor.hborder-(a.opt.railpadding.top+a.opt.railpadding.bottom);a.railh&&(a.railh.width=0<a.page.maxh?a.view.w-a.rail.width:a.view.w,a.scrollvaluemaxw=a.railh.width-a.cursorwidth-a.cursorh.wborder-(a.opt.railpadding.left+a.opt.railpadding.right));a.ispage||a.updateScrollBar(a.view);a.scrollratio={x:a.page.maxw/a.scrollvaluemaxw,y:a.page.maxh/a.scrollvaluemax};a.getScrollTop()>a.page.maxh?a.doScrollTop(a.page.maxh):(a.scroll.y=Math.round(a.getScrollTop()*
(1/a.scrollratio.y)),a.scroll.x=Math.round(a.getScrollLeft()*(1/a.scrollratio.x)),a.cursoractive&&a.noticeCursor());a.scroll.y&&0==a.getScrollTop()&&a.doScrollTo(Math.floor(a.scroll.y*a.scrollratio.y));return a};this.resize=a.onResize;this.hlazyresize=0;this.lazyResize=function(b){a.haswrapper||a.hide();a.hlazyresize&&clearTimeout(a.hlazyresize);a.hlazyresize=setTimeout(function(){a&&a.show().resize()},240);return a};this.jqbind=function(b,c,d){a.events.push({e:b,n:c,f:d,q:!0});f(b).bind(c,d)};this.mousewheel=
function(b,c,d){b="jquery"in b?b[0]:b;if("onwheel"in document.createElement("div"))a._bind(b,"wheel",c,d||!1);else{var e=void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";q(b,e,c,d||!1);"DOMMouseScroll"==e&&q(b,"MozMousePixelScroll",c,d||!1)}};e.haseventlistener?(this.bind=function(b,c,d,e){a._bind("jquery"in b?b[0]:b,c,d,e||!1)},this._bind=function(b,c,d,e){a.events.push({e:b,n:c,f:d,b:e,q:!1});b.addEventListener(c,d,e||!1)},this.cancelEvent=function(a){if(!a)return!1;a=a.original?a.original:
a;a.cancelable&&a.preventDefault();a.stopPropagation();a.preventManipulation&&a.preventManipulation();return!1},this.stopPropagation=function(a){if(!a)return!1;a=a.original?a.original:a;a.stopPropagation();return!1},this._unbind=function(a,c,d,e){a.removeEventListener(c,d,e)}):(this.bind=function(b,c,d,e){var f="jquery"in b?b[0]:b;a._bind(f,c,function(b){(b=b||window.event||!1)&&b.srcElement&&(b.target=b.srcElement);"pageY"in b||(b.pageX=b.clientX+document.documentElement.scrollLeft,b.pageY=b.clientY+
document.documentElement.scrollTop);return!1===d.call(f,b)||!1===e?a.cancelEvent(b):!0})},this._bind=function(b,c,d,e){a.events.push({e:b,n:c,f:d,b:e,q:!1});b.attachEvent?b.attachEvent("on"+c,d):b["on"+c]=d},this.cancelEvent=function(a){a=window.event||!1;if(!a)return!1;a.cancelBubble=!0;a.cancel=!0;return a.returnValue=!1},this.stopPropagation=function(a){a=window.event||!1;if(!a)return!1;a.cancelBubble=!0;return!1},this._unbind=function(a,c,d,e){a.detachEvent?a.detachEvent("on"+c,d):a["on"+c]=!1});
this.unbindAll=function(){for(var b=0;b<a.events.length;b++){var c=a.events[b];c.q?c.e.unbind(c.n,c.f):a._unbind(c.e,c.n,c.f,c.b)}};this.showRail=function(){0==a.page.maxh||!a.ispage&&"none"==a.win.css("display")||(a.visibility=!0,a.rail.visibility=!0,a.rail.css("display","block"));return a};this.showRailHr=function(){if(!a.railh)return a;0==a.page.maxw||!a.ispage&&"none"==a.win.css("display")||(a.railh.visibility=!0,a.railh.css("display","block"));return a};this.hideRail=function(){a.visibility=
!1;a.rail.visibility=!1;a.rail.css("display","none");return a};this.hideRailHr=function(){if(!a.railh)return a;a.railh.visibility=!1;a.railh.css("display","none");return a};this.show=function(){a.hidden=!1;a.railslocked=!1;return a.showRail().showRailHr()};this.hide=function(){a.hidden=!0;a.railslocked=!0;return a.hideRail().hideRailHr()};this.toggle=function(){return a.hidden?a.show():a.hide()};this.remove=function(){a.stop();a.cursortimeout&&clearTimeout(a.cursortimeout);for(var b in a.delaylist)a.delaylist[b]&&
w(a.delaylist[b].h);a.doZoomOut();a.unbindAll();e.isie9&&a.win[0].detachEvent("onpropertychange",a.onAttributeChange);!1!==a.observer&&a.observer.disconnect();!1!==a.observerremover&&a.observerremover.disconnect();!1!==a.observerbody&&a.observerbody.disconnect();a.events=null;a.cursor&&a.cursor.remove();a.cursorh&&a.cursorh.remove();a.rail&&a.rail.remove();a.railh&&a.railh.remove();a.zoom&&a.zoom.remove();for(b=0;b<a.saved.css.length;b++){var c=a.saved.css[b];c[0].css(c[1],void 0===c[2]?"":c[2])}a.saved=
!1;a.me.data("__nicescroll","");var d=f.nicescroll;d.each(function(b){if(this&&this.id===a.id){delete d[b];for(var c=++b;c<d.length;c++,b++)d[b]=d[c];d.length--;d.length&&delete d[d.length]}});for(var k in a)a[k]=null,delete a[k];a=null};this.scrollstart=function(b){this.onscrollstart=b;return a};this.scrollend=function(b){this.onscrollend=b;return a};this.scrollcancel=function(b){this.onscrollcancel=b;return a};this.zoomin=function(b){this.onzoomin=b;return a};this.zoomout=function(b){this.onzoomout=
b;return a};this.isScrollable=function(a){a=a.target?a.target:a;if("OPTION"==a.nodeName)return!0;for(;a&&1==a.nodeType&&!/^BODY|HTML/.test(a.nodeName);){var c=f(a),c=c.css("overflowY")||c.css("overflowX")||c.css("overflow")||"";if(/scroll|auto/.test(c))return a.clientHeight!=a.scrollHeight;a=a.parentNode?a.parentNode:!1}return!1};this.getViewport=function(a){for(a=a&&a.parentNode?a.parentNode:!1;a&&1==a.nodeType&&!/^BODY|HTML/.test(a.nodeName);){var c=f(a);if(/fixed|absolute/.test(c.css("position")))return c;
var d=c.css("overflowY")||c.css("overflowX")||c.css("overflow")||"";if(/scroll|auto/.test(d)&&a.clientHeight!=a.scrollHeight||0<c.getNiceScroll().length)return c;a=a.parentNode?a.parentNode:!1}return!1};this.triggerScrollEnd=function(){if(a.onscrollend){var b=a.getScrollLeft(),c=a.getScrollTop();a.onscrollend.call(a,{type:"scrollend",current:{x:b,y:c},end:{x:b,y:c}})}};this.onmousewheel=function(b){if(!a.wheelprevented){if(a.railslocked)return a.debounced("checkunlock",a.resize,250),!0;if(a.rail.drag)return a.cancelEvent(b);
"auto"==a.opt.oneaxismousemode&&0!=b.deltaX&&(a.opt.oneaxismousemode=!1);if(a.opt.oneaxismousemode&&0==b.deltaX&&!a.rail.scrollable)return a.railh&&a.railh.scrollable?a.onmousewheelhr(b):!0;var c=+new Date,d=!1;a.opt.preservenativescrolling&&a.checkarea+600<c&&(a.nativescrollingarea=a.isScrollable(b),d=!0);a.checkarea=c;if(a.nativescrollingarea)return!0;if(b=t(b,!1,d))a.checkarea=0;return b}};this.onmousewheelhr=function(b){if(!a.wheelprevented){if(a.railslocked||!a.railh.scrollable)return!0;if(a.rail.drag)return a.cancelEvent(b);
var c=+new Date,d=!1;a.opt.preservenativescrolling&&a.checkarea+600<c&&(a.nativescrollingarea=a.isScrollable(b),d=!0);a.checkarea=c;return a.nativescrollingarea?!0:a.railslocked?a.cancelEvent(b):t(b,!0,d)}};this.stop=function(){a.cancelScroll();a.scrollmon&&a.scrollmon.stop();a.cursorfreezed=!1;a.scroll.y=Math.round(a.getScrollTop()*(1/a.scrollratio.y));a.noticeCursor();return a};this.getTransitionSpeed=function(b){b=Math.min(Math.round(10*a.opt.scrollspeed),Math.round(b/20*a.opt.scrollspeed));return 20<
b?b:0};a.opt.smoothscroll?a.ishwscroll&&e.hastransition&&a.opt.usetransition&&a.opt.smoothscroll?(this.prepareTransition=function(b,c){var d=c?20<b?b:0:a.getTransitionSpeed(b),f=d?e.prefixstyle+"transform "+d+"ms ease-out":"";a.lasttransitionstyle&&a.lasttransitionstyle==f||(a.lasttransitionstyle=f,a.doc.css(e.transitionstyle,f));return d},this.doScrollLeft=function(b,c){var d=a.scrollrunning?a.newscrolly:a.getScrollTop();a.doScrollPos(b,d,c)},this.doScrollTop=function(b,c){var d=a.scrollrunning?
a.newscrollx:a.getScrollLeft();a.doScrollPos(d,b,c)},this.doScrollPos=function(b,c,d){var f=a.getScrollTop(),k=a.getScrollLeft();(0>(a.newscrolly-f)*(c-f)||0>(a.newscrollx-k)*(b-k))&&a.cancelScroll();0==a.opt.bouncescroll&&(0>c?c=0:c>a.page.maxh&&(c=a.page.maxh),0>b?b=0:b>a.page.maxw&&(b=a.page.maxw));if(a.scrollrunning&&b==a.newscrollx&&c==a.newscrolly)return!1;a.newscrolly=c;a.newscrollx=b;a.newscrollspeed=d||!1;if(a.timer)return!1;a.timer=setTimeout(function(){var d=a.getScrollTop(),f=a.getScrollLeft(),
k=Math.round(Math.sqrt(Math.pow(b-f,2)+Math.pow(c-d,2))),k=a.newscrollspeed&&1<a.newscrollspeed?a.newscrollspeed:a.getTransitionSpeed(k);a.newscrollspeed&&1>=a.newscrollspeed&&(k*=a.newscrollspeed);a.prepareTransition(k,!0);a.timerscroll&&a.timerscroll.tm&&clearInterval(a.timerscroll.tm);0<k&&(!a.scrollrunning&&a.onscrollstart&&a.onscrollstart.call(a,{type:"scrollstart",current:{x:f,y:d},request:{x:b,y:c},end:{x:a.newscrollx,y:a.newscrolly},speed:k}),e.transitionend?a.scrollendtrapped||(a.scrollendtrapped=
!0,a.bind(a.doc,e.transitionend,a.onScrollTransitionEnd,!1)):(a.scrollendtrapped&&clearTimeout(a.scrollendtrapped),a.scrollendtrapped=setTimeout(a.onScrollTransitionEnd,k)),a.timerscroll={bz:new D(d,a.newscrolly,k,0,0,.58,1),bh:new D(f,a.newscrollx,k,0,0,.58,1)},a.cursorfreezed||(a.timerscroll.tm=setInterval(function(){a.showCursor(a.getScrollTop(),a.getScrollLeft())},60)));a.synched("doScroll-set",function(){a.timer=0;a.scrollendtrapped&&(a.scrollrunning=!0);a.setScrollTop(a.newscrolly);a.setScrollLeft(a.newscrollx);
if(!a.scrollendtrapped)a.onScrollTransitionEnd()})},50)},this.cancelScroll=function(){if(!a.scrollendtrapped)return!0;var b=a.getScrollTop(),c=a.getScrollLeft();a.scrollrunning=!1;e.transitionend||clearTimeout(e.transitionend);a.scrollendtrapped=!1;a._unbind(a.doc[0],e.transitionend,a.onScrollTransitionEnd);a.prepareTransition(0);a.setScrollTop(b);a.railh&&a.setScrollLeft(c);a.timerscroll&&a.timerscroll.tm&&clearInterval(a.timerscroll.tm);a.timerscroll=!1;a.cursorfreezed=!1;a.showCursor(b,c);return a},
this.onScrollTransitionEnd=function(){a.scrollendtrapped&&a._unbind(a.doc[0],e.transitionend,a.onScrollTransitionEnd);a.scrollendtrapped=!1;a.prepareTransition(0);a.timerscroll&&a.timerscroll.tm&&clearInterval(a.timerscroll.tm);a.timerscroll=!1;var b=a.getScrollTop(),c=a.getScrollLeft();a.setScrollTop(b);a.railh&&a.setScrollLeft(c);a.noticeCursor(!1,b,c);a.cursorfreezed=!1;0>b?b=0:b>a.page.maxh&&(b=a.page.maxh);0>c?c=0:c>a.page.maxw&&(c=a.page.maxw);if(b!=a.newscrolly||c!=a.newscrollx)return a.doScrollPos(c,
b,a.opt.snapbackspeed);a.onscrollend&&a.scrollrunning&&a.triggerScrollEnd();a.scrollrunning=!1}):(this.doScrollLeft=function(b,c){var d=a.scrollrunning?a.newscrolly:a.getScrollTop();a.doScrollPos(b,d,c)},this.doScrollTop=function(b,c){var d=a.scrollrunning?a.newscrollx:a.getScrollLeft();a.doScrollPos(d,b,c)},this.doScrollPos=function(b,c,d){function e(){if(a.cancelAnimationFrame)return!0;a.scrollrunning=!0;if(p=1-p)return a.timer=v(e)||1;var b=0,c,d,f=d=a.getScrollTop();if(a.dst.ay){f=a.bzscroll?
a.dst.py+a.bzscroll.getNow()*a.dst.ay:a.newscrolly;c=f-d;if(0>c&&f<a.newscrolly||0<c&&f>a.newscrolly)f=a.newscrolly;a.setScrollTop(f);f==a.newscrolly&&(b=1)}else b=1;d=c=a.getScrollLeft();if(a.dst.ax){d=a.bzscroll?a.dst.px+a.bzscroll.getNow()*a.dst.ax:a.newscrollx;c=d-c;if(0>c&&d<a.newscrollx||0<c&&d>a.newscrollx)d=a.newscrollx;a.setScrollLeft(d);d==a.newscrollx&&(b+=1)}else b+=1;2==b?(a.timer=0,a.cursorfreezed=!1,a.bzscroll=!1,a.scrollrunning=!1,0>f?f=0:f>a.page.maxh&&(f=Math.max(0,a.page.maxh)),
0>d?d=0:d>a.page.maxw&&(d=a.page.maxw),d!=a.newscrollx||f!=a.newscrolly?a.doScrollPos(d,f):a.onscrollend&&a.triggerScrollEnd()):a.timer=v(e)||1}c=void 0===c||!1===c?a.getScrollTop(!0):c;if(a.timer&&a.newscrolly==c&&a.newscrollx==b)return!0;a.timer&&w(a.timer);a.timer=0;var f=a.getScrollTop(),k=a.getScrollLeft();(0>(a.newscrolly-f)*(c-f)||0>(a.newscrollx-k)*(b-k))&&a.cancelScroll();a.newscrolly=c;a.newscrollx=b;a.bouncescroll&&a.rail.visibility||(0>a.newscrolly?a.newscrolly=0:a.newscrolly>a.page.maxh&&
(a.newscrolly=a.page.maxh));a.bouncescroll&&a.railh.visibility||(0>a.newscrollx?a.newscrollx=0:a.newscrollx>a.page.maxw&&(a.newscrollx=a.page.maxw));a.dst={};a.dst.x=b-k;a.dst.y=c-f;a.dst.px=k;a.dst.py=f;var h=Math.round(Math.sqrt(Math.pow(a.dst.x,2)+Math.pow(a.dst.y,2)));a.dst.ax=a.dst.x/h;a.dst.ay=a.dst.y/h;var l=0,n=h;0==a.dst.x?(l=f,n=c,a.dst.ay=1,a.dst.py=0):0==a.dst.y&&(l=k,n=b,a.dst.ax=1,a.dst.px=0);h=a.getTransitionSpeed(h);d&&1>=d&&(h*=d);a.bzscroll=0<h?a.bzscroll?a.bzscroll.update(n,h):
new D(l,n,h,0,1,0,1):!1;if(!a.timer){(f==a.page.maxh&&c>=a.page.maxh||k==a.page.maxw&&b>=a.page.maxw)&&a.checkContentSize();var p=1;a.cancelAnimationFrame=!1;a.timer=1;a.onscrollstart&&!a.scrollrunning&&a.onscrollstart.call(a,{type:"scrollstart",current:{x:k,y:f},request:{x:b,y:c},end:{x:a.newscrollx,y:a.newscrolly},speed:h});e();(f==a.page.maxh&&c>=f||k==a.page.maxw&&b>=k)&&a.checkContentSize();a.noticeCursor()}},this.cancelScroll=function(){a.timer&&w(a.timer);a.timer=0;a.bzscroll=!1;a.scrollrunning=
!1;return a}):(this.doScrollLeft=function(b,c){var d=a.getScrollTop();a.doScrollPos(b,d,c)},this.doScrollTop=function(b,c){var d=a.getScrollLeft();a.doScrollPos(d,b,c)},this.doScrollPos=function(b,c,d){var e=b>a.page.maxw?a.page.maxw:b;0>e&&(e=0);var f=c>a.page.maxh?a.page.maxh:c;0>f&&(f=0);a.synched("scroll",function(){a.setScrollTop(f);a.setScrollLeft(e)})},this.cancelScroll=function(){});this.doScrollBy=function(b,c){var d=0,d=c?Math.floor((a.scroll.y-b)*a.scrollratio.y):(a.timer?a.newscrolly:
a.getScrollTop(!0))-b;if(a.bouncescroll){var e=Math.round(a.view.h/2);d<-e?d=-e:d>a.page.maxh+e&&(d=a.page.maxh+e)}a.cursorfreezed=!1;e=a.getScrollTop(!0);if(0>d&&0>=e)return a.noticeCursor();if(d>a.page.maxh&&e>=a.page.maxh)return a.checkContentSize(),a.noticeCursor();a.doScrollTop(d)};this.doScrollLeftBy=function(b,c){var d=0,d=c?Math.floor((a.scroll.x-b)*a.scrollratio.x):(a.timer?a.newscrollx:a.getScrollLeft(!0))-b;if(a.bouncescroll){var e=Math.round(a.view.w/2);d<-e?d=-e:d>a.page.maxw+e&&(d=a.page.maxw+
e)}a.cursorfreezed=!1;e=a.getScrollLeft(!0);if(0>d&&0>=e||d>a.page.maxw&&e>=a.page.maxw)return a.noticeCursor();a.doScrollLeft(d)};this.doScrollTo=function(b,c){a.cursorfreezed=!1;a.doScrollTop(b)};this.checkContentSize=function(){var b=a.getContentSize();b.h==a.page.h&&b.w==a.page.w||a.resize(!1,b)};a.onscroll=function(b){a.rail.drag||a.cursorfreezed||a.synched("scroll",function(){a.scroll.y=Math.round(a.getScrollTop()*(1/a.scrollratio.y));a.railh&&(a.scroll.x=Math.round(a.getScrollLeft()*(1/a.scrollratio.x)));
a.noticeCursor()})};a.bind(a.docscroll,"scroll",a.onscroll);this.doZoomIn=function(b){if(!a.zoomactive){a.zoomactive=!0;a.zoomrestore={style:{}};var c="position top left zIndex backgroundColor marginTop marginBottom marginLeft marginRight".split(" "),d=a.win[0].style,k;for(k in c){var h=c[k];a.zoomrestore.style[h]=void 0!==d[h]?d[h]:""}a.zoomrestore.style.width=a.win.css("width");a.zoomrestore.style.height=a.win.css("height");a.zoomrestore.padding={w:a.win.outerWidth()-a.win.width(),h:a.win.outerHeight()-
a.win.height()};e.isios4&&(a.zoomrestore.scrollTop=f(window).scrollTop(),f(window).scrollTop(0));a.win.css({position:e.isios4?"absolute":"fixed",top:0,left:0,zIndex:A+100,margin:0});c=a.win.css("backgroundColor");(""==c||/transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(c))&&a.win.css("backgroundColor","#fff");a.rail.css({zIndex:A+101});a.zoom.css({zIndex:A+102});a.zoom.css("backgroundPosition","0px -18px");a.resizeZoom();a.onzoomin&&a.onzoomin.call(a);return a.cancelEvent(b)}};this.doZoomOut=
function(b){if(a.zoomactive)return a.zoomactive=!1,a.win.css("margin",""),a.win.css(a.zoomrestore.style),e.isios4&&f(window).scrollTop(a.zoomrestore.scrollTop),a.rail.css({"z-index":a.zindex}),a.zoom.css({"z-index":a.zindex}),a.zoomrestore=!1,a.zoom.css("backgroundPosition","0px 0px"),a.onResize(),a.onzoomout&&a.onzoomout.call(a),a.cancelEvent(b)};this.doZoom=function(b){return a.zoomactive?a.doZoomOut(b):a.doZoomIn(b)};this.resizeZoom=function(){if(a.zoomactive){var b=a.getScrollTop();a.win.css({width:f(window).width()-
a.zoomrestore.padding.w+"px",height:f(window).height()-a.zoomrestore.padding.h+"px"});a.onResize();a.setScrollTop(Math.min(a.page.maxh,b))}};this.init();f.nicescroll.push(this)},M=function(f){var c=this;this.nc=f;this.steptime=this.lasttime=this.speedy=this.speedx=this.lasty=this.lastx=0;this.snapy=this.snapx=!1;this.demuly=this.demulx=0;this.lastscrolly=this.lastscrollx=-1;this.timer=this.chky=this.chkx=0;this.time=function(){return+new Date};this.reset=function(f,h){c.stop();var d=c.time();c.steptime=
0;c.lasttime=d;c.speedx=0;c.speedy=0;c.lastx=f;c.lasty=h;c.lastscrollx=-1;c.lastscrolly=-1};this.update=function(f,h){var d=c.time();c.steptime=d-c.lasttime;c.lasttime=d;var d=h-c.lasty,q=f-c.lastx,t=c.nc.getScrollTop(),a=c.nc.getScrollLeft(),t=t+d,a=a+q;c.snapx=0>a||a>c.nc.page.maxw;c.snapy=0>t||t>c.nc.page.maxh;c.speedx=q;c.speedy=d;c.lastx=f;c.lasty=h};this.stop=function(){c.nc.unsynched("domomentum2d");c.timer&&clearTimeout(c.timer);c.timer=0;c.lastscrollx=-1;c.lastscrolly=-1};this.doSnapy=function(f,
h){var d=!1;0>h?(h=0,d=!0):h>c.nc.page.maxh&&(h=c.nc.page.maxh,d=!0);0>f?(f=0,d=!0):f>c.nc.page.maxw&&(f=c.nc.page.maxw,d=!0);d?c.nc.doScrollPos(f,h,c.nc.opt.snapbackspeed):c.nc.triggerScrollEnd()};this.doMomentum=function(f){var h=c.time(),d=f?h+f:c.lasttime;f=c.nc.getScrollLeft();var q=c.nc.getScrollTop(),t=c.nc.page.maxh,a=c.nc.page.maxw;c.speedx=0<a?Math.min(60,c.speedx):0;c.speedy=0<t?Math.min(60,c.speedy):0;d=d&&60>=h-d;if(0>q||q>t||0>f||f>a)d=!1;f=c.speedx&&d?c.speedx:!1;if(c.speedy&&d&&c.speedy||
f){var r=Math.max(16,c.steptime);50<r&&(f=r/50,c.speedx*=f,c.speedy*=f,r=50);c.demulxy=0;c.lastscrollx=c.nc.getScrollLeft();c.chkx=c.lastscrollx;c.lastscrolly=c.nc.getScrollTop();c.chky=c.lastscrolly;var p=c.lastscrollx,e=c.lastscrolly,v=function(){var d=600<c.time()-h?.04:.02;c.speedx&&(p=Math.floor(c.lastscrollx-c.speedx*(1-c.demulxy)),c.lastscrollx=p,0>p||p>a)&&(d=.1);c.speedy&&(e=Math.floor(c.lastscrolly-c.speedy*(1-c.demulxy)),c.lastscrolly=e,0>e||e>t)&&(d=.1);c.demulxy=Math.min(1,c.demulxy+
d);c.nc.synched("domomentum2d",function(){c.speedx&&(c.nc.getScrollLeft(),c.chkx=p,c.nc.setScrollLeft(p));c.speedy&&(c.nc.getScrollTop(),c.chky=e,c.nc.setScrollTop(e));c.timer||(c.nc.hideCursor(),c.doSnapy(p,e))});1>c.demulxy?c.timer=setTimeout(v,r):(c.stop(),c.nc.hideCursor(),c.doSnapy(p,e))};v()}else c.doSnapy(c.nc.getScrollLeft(),c.nc.getScrollTop())}},y=f.fn.scrollTop;f.cssHooks.pageYOffset={get:function(h,c,k){return(c=f.data(h,"__nicescroll")||!1)&&c.ishwscroll?c.getScrollTop():y.call(h)},set:function(h,
c){var k=f.data(h,"__nicescroll")||!1;k&&k.ishwscroll?k.setScrollTop(parseInt(c)):y.call(h,c);return this}};f.fn.scrollTop=function(h){if(void 0===h){var c=this[0]?f.data(this[0],"__nicescroll")||!1:!1;return c&&c.ishwscroll?c.getScrollTop():y.call(this)}return this.each(function(){var c=f.data(this,"__nicescroll")||!1;c&&c.ishwscroll?c.setScrollTop(parseInt(h)):y.call(f(this),h)})};var z=f.fn.scrollLeft;f.cssHooks.pageXOffset={get:function(h,c,k){return(c=f.data(h,"__nicescroll")||!1)&&c.ishwscroll?
c.getScrollLeft():z.call(h)},set:function(h,c){var k=f.data(h,"__nicescroll")||!1;k&&k.ishwscroll?k.setScrollLeft(parseInt(c)):z.call(h,c);return this}};f.fn.scrollLeft=function(h){if(void 0===h){var c=this[0]?f.data(this[0],"__nicescroll")||!1:!1;return c&&c.ishwscroll?c.getScrollLeft():z.call(this)}return this.each(function(){var c=f.data(this,"__nicescroll")||!1;c&&c.ishwscroll?c.setScrollLeft(parseInt(h)):z.call(f(this),h)})};var E=function(h){var c=this;this.length=0;this.name="nicescrollarray";
this.each=function(d){f.each(c,d);return c};this.push=function(d){c[c.length]=d;c.length++};this.eq=function(d){return c[d]};if(h)for(var k=0;k<h.length;k++){var l=f.data(h[k],"__nicescroll")||!1;l&&(this[this.length]=l,this.length++)}return this};(function(f,c,k){for(var l=0;l<c.length;l++)k(f,c[l])})(E.prototype,"show hide toggle onResize resize remove stop doScrollPos".split(" "),function(f,c){f[c]=function(){var f=arguments;return this.each(function(){this[c].apply(this,f)})}});f.fn.getNiceScroll=
function(h){return void 0===h?new E(this):this[h]&&f.data(this[h],"__nicescroll")||!1};f.expr[":"].nicescroll=function(h){return void 0!==f.data(h,"__nicescroll")};f.fn.niceScroll=function(h,c){void 0!==c||"object"!=typeof h||"jquery"in h||(c=h,h=!1);c=f.extend({},c);var k=new E;void 0===c&&(c={});h&&(c.doc=f(h),c.win=f(this));var l=!("doc"in c);l||"win"in c||(c.win=f(this));this.each(function(){var d=f(this).data("__nicescroll")||!1;d||(c.doc=l?f(this):c.doc,d=new S(c,f(this)),f(this).data("__nicescroll",
d));k.push(d)});return 1==k.length?k[0]:k};window.NiceScroll={getjQuery:function(){return f}};f.nicescroll||(f.nicescroll=new E,f.nicescroll.options=K)});

var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation) {
        angular.module("RongWebIMWidget.conversation", []);
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        angular.module("RongWebIMWidget.conversationlist", []);
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    angular.module("RongWebIMWidget", [
        "RongWebIMWidget.conversation",
        "RongWebIMWidget.conversationlist",
        "Evaluate"
    ]);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var userAgent = window.navigator.userAgent.toLowerCase();
    var Helper = (function () {
        function Helper() {
        }
        Helper.timeCompare = function (first, second) {
            var pre = first.toString();
            var cur = second.toString();
            return pre.substring(0, pre.lastIndexOf(":")) == cur.substring(0, cur.lastIndexOf(":"));
        };
        Helper.cloneObject = function (obj) {
            if (!obj)
                return null;
            var ret;
            if (Object.prototype.toString.call(obj) == "[object Array]") {
                ret = [];
                var i = obj.length;
                while (i--) {
                    ret[i] = Helper.cloneObject(obj[i]);
                }
                return ret;
            }
            else if (typeof obj === "object") {
                ret = {};
                for (var item in obj) {
                    ret[item] = obj[item];
                }
                return ret;
            }
            else {
                return obj;
            }
        };
        Helper.discernUrlEmailInStr = function (str) {
            var html;
            var EMailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gi;
            var EMailArr = [];
            html = str.replace(EMailReg, function (str) {
                EMailArr.push(str);
                return '[email`' + (EMailArr.length - 1) + ']';
            });
            var URLReg = /(((ht|f)tp(s?))\:\/\/)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|cn|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk|me|im))(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*/gi;
            html = html.replace(URLReg, function (str, $1) {
                if ($1) {
                    return '<a target="_blank" href="' + str + '">' + str + '</a>';
                }
                else {
                    return '<a target="_blank" href="//' + str + '">' + str + '</a>';
                }
            });
            for (var i = 0, len = EMailArr.length; i < len; i++) {
                html = html.replace('[email`' + i + ']', '<a href="mailto:' + EMailArr[i] + '">' + EMailArr[i] + '<a>');
            }
            return html;
        };
        Helper.checkType = function (obj) {
            var type = Object.prototype.toString.call(obj);
            return type.substring(8, type.length - 1).toLowerCase();
        };
        Helper.browser = {
            version: (userAgent.match(/.+(?:rv|it|ra|chrome|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
            safari: /webkit/.test(userAgent),
            opera: /opera|opr/.test(userAgent),
            msie: /msie|trident/.test(userAgent) && !/opera/.test(userAgent),
            chrome: /chrome/.test(userAgent),
            mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit|like gecko)/.test(userAgent)
        };
        Helper.escapeSymbol = {
            encodeHtmlsymbol: function (str) {
                if (!str)
                    return '';
                str = str.replace(/&/g, '&amp;');
                str = str.replace(/</g, '&lt;');
                str = str.replace(/>/g, '&gt;');
                str = str.replace(/"/g, '&quot;');
                str = str.replace(/'/g, '&#039;');
                return str;
            },
            decodeHtmlsymbol: function (str) {
                if (!str)
                    return '';
                str = str.replace(/&amp;/g, '&');
                str = str.replace(/&lt;/g, '<');
                str = str.replace(/&gt;/g, '>');
                str = str.replace(/&quot;/g, '"');
                str = str.replace(/&#039;/g, '\'');
                return str;
            }
        };
        Helper.getFocus = function (obj) {
            obj.focus();
            if (obj.createTextRange) {
                var rtextRange = obj.createTextRange();
                rtextRange.moveStart('character', obj.value.length);
                rtextRange.collapse(true);
                rtextRange.select();
            }
            else if (obj.selectionStart) {
                obj.selectionStart = obj.value.length;
            }
            else if (window.getSelection && obj.lastChild) {
                var sel = window.getSelection();
                var tempRange = document.createRange();
                if (Helper.browser.msie) {
                    tempRange.setStart(obj.lastChild, obj.lastChild.length);
                }
                else {
                    tempRange.setStart(obj.firstChild, obj.firstChild.length);
                }
                sel.removeAllRanges();
                sel.addRange(tempRange);
            }
        };
        Helper.ImageHelper = {
            getThumbnail: function (obj, area, callback) {
                var canvas = document.createElement("canvas"), context = canvas.getContext('2d');
                var img = new Image();
                img.onload = function () {
                    var target_w;
                    var target_h;
                    var imgarea = img.width * img.height;
                    if (imgarea > area) {
                        var scale = Math.sqrt(imgarea / area);
                        scale = Math.ceil(scale * 100) / 100;
                        target_w = img.width / scale;
                        target_h = img.height / scale;
                    }
                    else {
                        target_w = img.width;
                        target_h = img.height;
                    }
                    canvas.width = target_w;
                    canvas.height = target_h;
                    context.drawImage(img, 0, 0, target_w, target_h);
                    try {
                        var _canvas = canvas.toDataURL("image/jpeg", 0.5);
                        _canvas = _canvas.substr(23);
                        callback(obj, _canvas);
                    }
                    catch (e) {
                        callback(obj, null);
                    }
                };
                img.src = Helper.ImageHelper.getFullPath(obj);
            },
            getFullPath: function (file) {
                window.URL = window.URL || window.webkitURL;
                if (window.URL && window.URL.createObjectURL) {
                    return window.URL.createObjectURL(file);
                }
                else {
                    return null;
                }
            }
        };
        Helper.CookieHelper = {
            setCookie: function (name, value, exires) {
                if (exires) {
                    var date = new Date();
                    date.setDate(date.getDate() + exires);
                    document.cookie = name + "=" + encodeURI(value) + ";expires=" + date.toUTCString();
                }
                else {
                    document.cookie = name + "=" + encodeURI(value) + ";";
                }
            },
            getCookie: function (name) {
                var start = document.cookie.indexOf(name + "=");
                if (start != -1) {
                    var end = document.cookie.indexOf(";", start);
                    if (end == -1) {
                        end = document.cookie.length;
                    }
                    return decodeURI(document.cookie.substring(start + name.length + 1, end));
                }
                else {
                    return "";
                }
            },
            removeCookie: function (name) {
                var con = this.getCookie(name);
                if (con) {
                    this.setCookie(name, "con", -1);
                }
            }
        };
        return Helper;
    })();
    RongWebIMWidget.Helper = Helper;
    var NotificationHelper = (function () {
        function NotificationHelper() {
        }
        NotificationHelper.isNotificationSupported = function () {
            return (typeof Notification === "function" || typeof Notification === "object");
        };
        NotificationHelper.requestPermission = function () {
            if (!NotificationHelper.isNotificationSupported()) {
                return;
            }
            Notification.requestPermission(function (status) {
            });
        };
        NotificationHelper.onclick = function (n) { };
        NotificationHelper.showNotification = function (config) {
            if (!NotificationHelper.isNotificationSupported()) {
                console.log('the current browser does not support Notification API');
                return;
            }
            if (Notification.permission !== "granted") {
                console.log('the current page has not been granted for notification');
                return;
            }
            if (!NotificationHelper.desktopNotification) {
                return;
            }
            var title = config.title;
            delete config.title;
            var n = new Notification(title, config);
            n.onshow = function () {
                setTimeout(function () {
                    n.close();
                }, 5000);
            };
            n.onclick = function () {
                window.focus();
                NotificationHelper.onclick && NotificationHelper.onclick(n);
                n.close();
            };
            n.onerror = function () {
            };
            n.onclose = function () {
            };
        };
        NotificationHelper.desktopNotification = true;
        return NotificationHelper;
    })();
    RongWebIMWidget.NotificationHelper = NotificationHelper;
    var DirectiveFactory = (function () {
        function DirectiveFactory() {
        }
        DirectiveFactory.GetFactoryFor = function (classType) {
            var factory = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var newInstance = Object.create(classType.prototype);
                newInstance.constructor.apply(newInstance, args);
                return newInstance;
            };
            factory.$inject = classType.$inject;
            return factory;
        };
        return DirectiveFactory;
    })();
    RongWebIMWidget.DirectiveFactory = DirectiveFactory;
    var errSrc = (function () {
        function errSrc() {
        }
        errSrc.instance = function () {
            return new errSrc();
        };
        errSrc.prototype.link = function (scope, element, attrs) {
            if (!attrs["ngSrc"]) {
                attrs.$set('src', attrs["errSrc"]);
            }
            element.bind('error', function () {
                if (attrs["src"] != attrs["errSrc"]) {
                    attrs.$set('src', attrs["errSrc"]);
                }
            });
        };
        return errSrc;
    })();
    var contenteditableDire = (function () {
        function contenteditableDire() {
            this.restrict = 'A';
            this.require = '?ngModel';
        }
        contenteditableDire.prototype.link = function (scope, element, attrs, ngModel) {
            function replacemy(e) {
                return e.replace(new RegExp("<[\\s\\S.]*?>", "ig"), "");
            }
            var domElement = element[0];
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newVal) {
                if (document.activeElement === domElement) {
                    return;
                }
                if (newVal === '' || newVal === attrs["placeholder"]) {
                    domElement.innerHTML = attrs["placeholder"];
                    domElement.style.color = "#a9a9a9";
                    ngModel.$setViewValue("");
                }
            });
            element.bind('focus', function () {
                if (domElement.innerHTML == attrs["placeholder"]) {
                    domElement.innerHTML = '';
                }
                domElement.style.color = '';
            });
            element.bind('blur', function () {
                if (domElement.innerHTML === '') {
                    domElement.innerHTML = attrs["placeholder"];
                    domElement.style.color = "#a9a9a9";
                }
            });
            if (!ngModel)
                return;
            element.bind("paste", function (e) {
                var that = this;
                var content;
                e.preventDefault();
                if (e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)) {
                    // originalEvent jQuery中的
                    content = (e.originalEvent || e).clipboardData.getData('text/plain');
                    content = replacemy(content || '');
                    content && document.execCommand('insertText', false, content);
                }
                else if (window['clipboardData']) {
                    content = window['clipboardData'].getData('Text');
                    content = replacemy(content || '');
                    if (document['selection']) {
                        content && document['selection'].createRange().pasteHTML(content);
                    }
                    else if (document.getSelection) {
                        document.getSelection().getRangeAt(0).insertNode(document.createTextNode(content));
                    }
                }
                console.log(that.innerHTML);
                ngModel.$setViewValue(that.innerHTML);
            });
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            element.bind("keyup paste", read);
            element.bind("input", read);
            function read() {
                var html = element.html();
                var html = Helper.escapeSymbol.decodeHtmlsymbol(html);
                html = html.replace(/^<br>$/i, "");
                html = html.replace(/<br>/gi, "\n");
                if (attrs["stripBr"] && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        };
        return contenteditableDire;
    })();
    var ctrlEnterKeys = (function () {
        function ctrlEnterKeys() {
            this.restrict = "A";
            this.require = '?ngModel';
            this.scope = {
                fun: "&",
                ctrlenter: "=",
                content: "="
            };
        }
        ctrlEnterKeys.prototype.link = function (scope, element, attrs, ngModel) {
            scope.ctrlenter = scope.ctrlenter || false;
            element.bind("keypress", function (e) {
                if (scope.ctrlenter) {
                    if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    }
                }
                else {
                    if (e.ctrlKey === false && e.shiftKey === false && (e.keyCode === 13 || e.keyCode === 10)) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    }
                    else if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                    }
                }
            });
        };
        return ctrlEnterKeys;
    })();
    angular.module("RongWebIMWidget")
        .directive('errSrc', errSrc.instance)
        .directive("contenteditableDire", DirectiveFactory.GetFactoryFor(contenteditableDire))
        .directive("ctrlEnterKeys", DirectiveFactory.GetFactoryFor(ctrlEnterKeys))
        .filter('trustHtml', ["$sce", function ($sce) {
            return function (str) {
                var trustAsHtml = $sce.trustAsHtml(str);
                return trustAsHtml;
            };
        }]).filter("historyTime", ["$filter", function ($filter) {
            return function (time) {
                var today = new Date();
                if (time.toDateString() === today.toDateString()) {
                    return $filter("date")(time, "HH:mm");
                }
                else if (time.toDateString() === new Date(today.setTime(today.getTime() - 1)).toDateString()) {
                    return "昨天" + $filter("date")(time, "HH:mm");
                }
                else {
                    return $filter("date")(time, "yyyy-MM-dd HH:mm");
                }
            };
        }]);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation) {
        var UploadImageDomain = "http://7xogjk.com1.z0.glb.clouddn.com/";
        var ConversationController = (function () {
            function ConversationController($scope, conversationServer, WebIMWidget, conversationListServer, widgetConfig, providerdata, RongIMSDKServer) {
                this.$scope = $scope;
                this.conversationServer = conversationServer;
                this.WebIMWidget = WebIMWidget;
                this.conversationListServer = conversationListServer;
                this.widgetConfig = widgetConfig;
                this.providerdata = providerdata;
                this.RongIMSDKServer = RongIMSDKServer;
                var _this = this;
                conversationServer.changeConversation = function (obj) {
                    _this.changeConversation(obj);
                };
                conversationServer.handleMessage = function (msg) {
                    _this.handleMessage(msg);
                };
                conversationServer._handleConnectSuccess = function () {
                    updateUploadToken();
                };
                function updateUploadToken() {
                    RongIMSDKServer.getFileToken().then(function (token) {
                        conversationServer._uploadToken = token;
                        uploadFileRefresh();
                    });
                }
                $scope.evaluate = {
                    type: 1,
                    showevaluate: false,
                    valid: false,
                    onConfirm: function (data) {
                        //发评价
                        if (data) {
                            if ($scope.evaluate.type == RongWebIMWidget.EnumCustomerStatus.person) {
                                RongIMSDKServer.evaluateHumanCustomService(conversationServer.current.targetId, data.stars, data.describe).then(function () {
                                }, function () {
                                });
                            }
                            else {
                                RongIMSDKServer.evaluateRebotCustomService(conversationServer.current.targetId, data.value, data.describe).then(function () {
                                }, function () {
                                });
                            }
                        }
                        _this.conversationServer._customService.connected = false;
                        RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                            onSuccess: function () {
                            },
                            onError: function () {
                            }
                        });
                        _this.closeState();
                    },
                    onCancle: function () {
                        $scope.evaluate.showSelf = false;
                    }
                };
                $scope._inputPanelState = RongWebIMWidget.EnumInputPanelType.person;
                $scope.$watch("showemoji", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if (!$scope.emojiList || $scope.emojiList.length == 0) {
                        $scope.emojiList = RongIMLib.RongIMEmoji.emojis.slice(0, 70);
                    }
                });
                document.addEventListener("click", function (e) {
                    if ($scope.showemoji && e.target.className.indexOf("iconfont-smile") == -1) {
                        $scope.$apply(function () {
                            $scope.showemoji = false;
                        });
                    }
                });
                $scope.$watch("showSelf", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if (newVal && conversationServer._uploadToken) {
                        uploadFileRefresh();
                    }
                    else {
                        qiniuuploader && qiniuuploader.destroy();
                    }
                });
                $scope.$watch("_inputPanelState", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if (newVal == RongWebIMWidget.EnumInputPanelType.person && conversationServer._uploadToken) {
                        uploadFileRefresh();
                    }
                    else {
                        qiniuuploader && qiniuuploader.destroy();
                    }
                });
                $scope.$watch("conversation.messageContent", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if ($scope.conversation) {
                        RongIMLib.RongIMClient.getInstance().saveTextMessageDraft(+$scope.conversation.targetType, $scope.conversation.targetId, newVal);
                    }
                });
                $scope.getHistory = function () {
                    var key = $scope.conversation.targetType + "_" + $scope.conversation.targetId;
                    var arr = conversationServer._cacheHistory[key];
                    arr.splice(0, arr.length);
                    conversationServer._getHistoryMessages(+$scope.conversation.targetType, $scope.conversation.targetId, 20).then(function (data) {
                        if (data.has) {
                            conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.GetMoreMessagePanel());
                        }
                    });
                };
                $scope.getMoreMessage = function () {
                    var key = $scope.conversation.targetType + "_" + $scope.conversation.targetId;
                    conversationServer._cacheHistory[key].shift();
                    conversationServer._cacheHistory[key].shift();
                    conversationServer._getHistoryMessages(+$scope.conversation.targetType, $scope.conversation.targetId, 20).then(function (data) {
                        if (data.has) {
                            conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.GetMoreMessagePanel());
                        }
                    });
                };
                $scope.switchPerson = function () {
                    RongIMLib.RongIMClient.getInstance().switchToHumanMode(conversationServer.current.targetId, {
                        onSuccess: function () {
                        },
                        onError: function () {
                        }
                    });
                };
                $scope.send = function () {
                    if (!$scope.conversation.targetId || !$scope.conversation.targetType) {
                        alert("请先选择一个会话目标。");
                        return;
                    }
                    if ($scope.conversation.messageContent == "") {
                        return;
                    }
                    var con = RongIMLib.RongIMEmoji.symbolToEmoji($scope.conversation.messageContent);
                    var msg = RongIMLib.TextMessage.obtain(con);
                    var userinfo = new RongIMLib.UserInfo(providerdata.currentUserInfo.userId, providerdata.currentUserInfo.name, providerdata.currentUserInfo.portraitUri);
                    msg.user = userinfo;
                    try {
                        RongIMLib.RongIMClient.getInstance().sendMessage(+$scope.conversation.targetType, $scope.conversation.targetId, msg, {
                            onSuccess: function (retMessage) {
                                conversationListServer.updateConversations().then(function () {
                                });
                            },
                            onError: function (error) {
                            }
                        });
                    }
                    catch (e) {
                    }
                    var content = _this.packDisplaySendMessage(msg, RongWebIMWidget.MessageType.TextMessage);
                    var cmsg = RongWebIMWidget.Message.convert(content);
                    conversationServer._addHistoryMessages(cmsg);
                    $scope.scrollBar();
                    $scope.conversation.messageContent = "";
                    var obj = document.getElementById("inputMsg");
                    RongWebIMWidget.Helper.getFocus(obj);
                };
                var qiniuuploader;
                function uploadFileRefresh() {
                    qiniuuploader && qiniuuploader.destroy();
                    qiniuuploader = Qiniu.uploader({
                        runtimes: 'html5,html4',
                        browse_button: 'upload-file',
                        container: 'funcPanel',
                        drop_element: 'inputMsg',
                        max_file_size: '100mb',
                        dragdrop: true,
                        chunk_size: '4mb',
                        unique_names: true,
                        uptoken: conversationServer._uploadToken,
                        domain: UploadImageDomain,
                        get_new_uptoken: false,
                        filters: {
                            mime_types: [{ title: "Image files", extensions: "jpg,gif,png,jpeg,bmp" }],
                            prevent_duplicates: false
                        },
                        multi_selection: false,
                        auto_start: true,
                        init: {
                            'FilesAdded': function (up, files) {
                            },
                            'BeforeUpload': function (up, file) {
                            },
                            'UploadProgress': function (up, file) {
                            },
                            'UploadComplete': function () {
                            },
                            'FileUploaded': function (up, file, info) {
                                if (!$scope.conversation.targetId || !$scope.conversation.targetType) {
                                    alert("请先选择一个会话目标。");
                                    return;
                                }
                                info = info.replace(/'/g, "\"");
                                info = JSON.parse(info);
                                RongIMLib.RongIMClient.getInstance()
                                    .getFileUrl(RongIMLib.FileType.IMAGE, file.target_name, {
                                    onSuccess: function (url) {
                                        RongWebIMWidget.Helper.ImageHelper.getThumbnail(file.getNative(), 60000, function (obj, data) {
                                            var im = RongIMLib.ImageMessage.obtain(data, url.downloadUrl);
                                            var content = _this.packDisplaySendMessage(im, RongWebIMWidget.MessageType.ImageMessage);
                                            RongIMLib.RongIMClient.getInstance()
                                                .sendMessage($scope.conversation.targetType, $scope.conversation.targetId, im, {
                                                onSuccess: function () {
                                                    conversationListServer.updateConversations().then(function () {
                                                    });
                                                },
                                                onError: function () {
                                                }
                                            });
                                            conversationServer._addHistoryMessages(RongWebIMWidget.Message.convert(content));
                                            $scope.$apply(function () {
                                                $scope.scrollBar();
                                            });
                                            updateUploadToken();
                                        });
                                    },
                                    onError: function () {
                                    }
                                });
                            },
                            'Error': function (up, err, errTip) {
                                console.log(err);
                                updateUploadToken();
                            }
                        }
                    });
                }
                $scope.close = function () {
                    if (WebIMWidget.onCloseBefore && typeof WebIMWidget.onCloseBefore === "function") {
                        var isClose = WebIMWidget.onCloseBefore({
                            close: function (data) {
                                if (conversationServer.current.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                                    if ($scope.evaluate.valid) {
                                        $scope.evaluate.showSelf = true;
                                    }
                                    else {
                                        RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                                            onSuccess: function () {
                                            },
                                            onError: function () {
                                            }
                                        });
                                        conversationServer._customService.connected = false;
                                        _this.closeState();
                                    }
                                }
                                else {
                                    _this.closeState();
                                }
                            }
                        });
                    }
                    else {
                        if (conversationServer.current.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                            if ($scope.evaluate.valid) {
                                $scope.evaluate.showSelf = true;
                            }
                            else {
                                RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                                    onSuccess: function () {
                                    },
                                    onError: function () {
                                    }
                                });
                                conversationServer._customService.connected = false;
                                _this.closeState();
                            }
                        }
                        else {
                            _this.closeState();
                        }
                    }
                };
                $scope.minimize = function () {
                    WebIMWidget.display = false;
                };
            }
            ConversationController.prototype.closeState = function () {
                var _this = this;
                if (this.WebIMWidget.onClose && typeof this.WebIMWidget.onClose === "function") {
                    setTimeout(function () { _this.WebIMWidget.onClose(_this.$scope.conversation); }, 1);
                }
                if (this.widgetConfig.displayConversationList) {
                    this.$scope.showSelf = false;
                }
                else {
                    this.WebIMWidget.display = false;
                }
                this.$scope.messageList = [];
                this.$scope.conversation = null;
                this.conversationServer.current = null;
                _this.$scope.evaluate.showSelf = false;
            };
            ConversationController.prototype.changeConversation = function (obj) {
                var _this = this;
                if (_this.widgetConfig.displayConversationList) {
                    _this.$scope.showSelf = true;
                }
                else {
                    _this.$scope.showSelf = true;
                    _this.WebIMWidget.display = true;
                }
                if (!obj || !obj.targetId) {
                    _this.$scope.conversation = {};
                    _this.$scope.messageList = [];
                    _this.conversationServer.current = null;
                    setTimeout(function () {
                        _this.$scope.$apply();
                    });
                    return;
                }
                var key = obj.targetType + "_" + obj.targetId;
                if (obj.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE
                    && (!_this.conversationServer.current || _this.conversationServer.current.targetId != obj.targetId) && !_this.conversationServer._customService.connected) {
                    _this.conversationServer._customService.connected = false;
                    _this.RongIMSDKServer.startCustomService(obj.targetId);
                }
                _this.conversationServer.current = obj;
                _this.$scope.conversation = obj;
                _this.$scope.conversation.messageContent = RongIMLib.RongIMClient.getInstance().getTextMessageDraft(obj.targetType, obj.targetId) || "";
                _this.$scope.messageList = _this.conversationServer._cacheHistory[key] = _this.conversationServer._cacheHistory[key] || [];
                if (_this.$scope.messageList.length == 0 && _this.conversationServer.current.targetType !== RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                    _this.conversationServer._getHistoryMessages(obj.targetType, obj.targetId, 3)
                        .then(function (data) {
                        if (_this.$scope.messageList.length > 0) {
                            _this.$scope.messageList.unshift(new RongWebIMWidget.TimePanl(_this.$scope.messageList[0].sentTime));
                            if (data.has) {
                                _this.$scope.messageList.unshift(new RongWebIMWidget.GetMoreMessagePanel());
                            }
                            setTimeout(function () {
                                _this.$scope.$apply();
                            });
                            _this.$scope.scrollBar();
                        }
                    });
                }
                else {
                    setTimeout(function () {
                        _this.$scope.$apply();
                    });
                    _this.$scope.scrollBar();
                }
            };
            ConversationController.prototype.handleMessage = function (msg) {
                var _this = this;
                if (_this.$scope.conversation
                    && msg.targetId == _this.$scope.conversation.targetId
                    && msg.conversationType == _this.$scope.conversation.targetType) {
                    _this.$scope.$apply();
                    var systemMsg = null;
                    switch (msg.messageType) {
                        case RongWebIMWidget.MessageType.HandShakeResponseMessage:
                            _this.conversationServer._customService.type = msg.content.data.serviceType;
                            _this.conversationServer._customService.connected = true;
                            _this.conversationServer._customService.companyName = msg.content.data.companyName;
                            _this.conversationServer._customService.robotName = msg.content.data.robotName;
                            _this.conversationServer._customService.robotIcon = msg.content.data.robotIcon;
                            _this.conversationServer._customService.robotWelcome = msg.content.data.robotWelcome;
                            _this.conversationServer._customService.humanWelcome = msg.content.data.humanWelcome;
                            _this.conversationServer._customService.noOneOnlineTip = msg.content.data.noOneOnlineTip;
                            if (msg.content.data.serviceType == "1") {
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                msg.content.data.robotWelcome
                                    && (systemMsg = this.packReceiveMessage(RongIMLib.TextMessage.obtain(msg.content.data.robotWelcome), RongWebIMWidget.MessageType.TextMessage));
                            }
                            else if (msg.content.data.serviceType == "3") {
                                msg.content.data.robotWelcome
                                    && (systemMsg = this.packReceiveMessage(RongIMLib.TextMessage.obtain(msg.content.data.robotWelcome), RongWebIMWidget.MessageType.TextMessage));
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                            }
                            else {
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                            }
                            //会话一分钟评价有效，显示评价
                            _this.$scope.evaluate.valid = false;
                            _this.$scope.evaluate.showSelf = false;
                            setTimeout(function () {
                                _this.$scope.evaluate.valid = true;
                            }, 60 * 1000);
                            _this.providerdata._productInfo && _this.RongIMSDKServer.sendProductInfo(_this.conversationServer.current.targetId, _this.providerdata._productInfo);
                            break;
                        case RongWebIMWidget.MessageType.ChangeModeResponseMessage:
                            switch (msg.content.data.status) {
                                case 1:
                                    _this.conversationServer._customService.human.name = msg.content.data.name || "客服人员";
                                    _this.conversationServer._customService.human.headimgurl = msg.content.data.headimgurl;
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                    break;
                                case 2:
                                    if (_this.conversationServer._customService.type == "2") {
                                        _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                    }
                                    else if (_this.conversationServer._customService.type == "1" || _this.conversationServer._customService.type == "3") {
                                        _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                                    }
                                    break;
                                case 3:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                    systemMsg = this.packReceiveMessage(RongIMLib.InformationNotificationMessage.obtain("你被拉黑了"), RongWebIMWidget.MessageType.InformationNotificationMessage);
                                    break;
                                case 4:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                    systemMsg = _this.packReceiveMessage(RongIMLib.InformationNotificationMessage.obtain("已经是人工了"), RongWebIMWidget.MessageType.InformationNotificationMessage);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case RongWebIMWidget.MessageType.TerminateMessage:
                            //关闭客服
                            _this.conversationServer._customService.connected = false;
                            if (msg.content.code == 0) {
                                _this.$scope.evaluate.valid = true;
                                _this.$scope.close();
                            }
                            else {
                                if (_this.conversationServer._customService.type == "1") {
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                }
                                else {
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                                }
                            }
                            break;
                        case RongWebIMWidget.MessageType.SuspendMessage:
                            if (msg.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                                _this.conversationServer._customService.connected = false;
                                _this.closeState();
                            }
                            break;
                        case RongWebIMWidget.MessageType.CustomerStatusUpdateMessage:
                            switch (Number(msg.content.serviceStatus)) {
                                case 1:
                                    if (_this.conversationServer._customService.type == "1") {
                                        _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                    }
                                    else {
                                        _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                                    }
                                    break;
                                case 2:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                    break;
                                case 3:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.notService);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                    if (systemMsg) {
                        var wmsg = RongWebIMWidget.Message.convert(systemMsg);
                        _this.conversationServer.addCustomServiceInfo(wmsg);
                        _this.conversationServer._addHistoryMessages(wmsg);
                    }
                    _this.conversationServer.addCustomServiceInfo(msg);
                    setTimeout(function () {
                        _this.$scope.$apply();
                        _this.$scope.scrollBar();
                    }, 200);
                }
                if (msg.messageType === RongWebIMWidget.MessageType.ImageMessage) {
                    setTimeout(function () {
                        _this.$scope.$apply();
                        _this.$scope.scrollBar();
                    }, 800);
                }
            };
            ConversationController.prototype.changeCustomerState = function (type) {
                this.$scope._inputPanelState = type;
                if (type == RongWebIMWidget.EnumInputPanelType.person) {
                    this.$scope.evaluate.type = RongWebIMWidget.EnumCustomerStatus.person;
                    this.conversationServer._customService.currentType = RongWebIMWidget.EnumCustomerStatus.person;
                    this.conversationServer.current.title = this.conversationServer._customService.human.name || "客服人员";
                }
                else {
                    this.$scope.evaluate.type = RongWebIMWidget.EnumCustomerStatus.robot;
                    this.conversationServer._customService.currentType = RongWebIMWidget.EnumCustomerStatus.robot;
                    this.conversationServer.current.title = this.conversationServer._customService.robotName;
                }
            };
            ConversationController.prototype.packDisplaySendMessage = function (msg, messageType) {
                var ret = new RongIMLib.Message();
                var userinfo = new RongIMLib.UserInfo(this.providerdata.currentUserInfo.userId, this.providerdata.currentUserInfo.name || "我", this.providerdata.currentUserInfo.portraitUri);
                msg.user = userinfo;
                ret.content = msg;
                ret.conversationType = this.$scope.conversation.targetType;
                ret.targetId = this.$scope.conversation.targetId;
                ret.senderUserId = this.providerdata.currentUserInfo.userId;
                ret.messageDirection = RongIMLib.MessageDirection.SEND;
                ret.sentTime = (new Date()).getTime() - (RongIMLib.RongIMClient.getInstance().getDeltaTime() || 0);
                ret.messageType = messageType;
                return ret;
            };
            ConversationController.prototype.packReceiveMessage = function (msg, messageType) {
                var ret = new RongIMLib.Message();
                var userinfo = null;
                msg.userInfo = userinfo;
                ret.content = msg;
                ret.conversationType = this.$scope.conversation.targetType;
                ret.targetId = this.$scope.conversation.targetId;
                ret.senderUserId = this.$scope.conversation.targetId;
                ret.messageDirection = RongIMLib.MessageDirection.RECEIVE;
                ret.sentTime = (new Date()).getTime() - (RongIMLib.RongIMClient.getInstance().getDeltaTime() || 0);
                ret.messageType = messageType;
                return ret;
            };
            ConversationController.$inject = ["$scope",
                "ConversationServer",
                "WebIMWidget",
                "ConversationListServer",
                "WidgetConfig",
                "ProviderData",
                "RongIMSDKServer"];
            return ConversationController;
        })();
        angular.module("RongWebIMWidget.conversation")
            .controller("conversationController", ConversationController);
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation) {
        var factory = RongWebIMWidget.DirectiveFactory.GetFactoryFor;
        var rongConversation = (function () {
            function rongConversation(conversationServer) {
                this.conversationServer = conversationServer;
                this.restrict = "E";
                this.templateUrl = "./src/ts/conversation/conversation.tpl.html";
                this.controller = "conversationController";
            }
            rongConversation.prototype.link = function (scope, ele) {
                if (window["jQuery"] && window["jQuery"].nicescroll) {
                    $("#Messages").niceScroll({
                        'cursorcolor': "#0099ff",
                        'cursoropacitymax': 1,
                        'touchbehavior': true,
                        'cursorwidth': "8px",
                        'cursorborder': "0",
                        'cursorborderradius': "5px"
                    });
                }
                scope.scrollBar = function () {
                    setTimeout(function () {
                        var ele = document.getElementById("Messages");
                        if (!ele)
                            return;
                        ele.scrollTop = ele.scrollHeight;
                    }, 200);
                };
            };
            rongConversation.$inject = ["ConversationServer"];
            return rongConversation;
        })();
        var emoji = (function () {
            function emoji() {
                this.restrict = "E";
                this.scope = {
                    item: "=",
                    content: "="
                };
                this.template = '<div style="display:inline-block"></div>';
            }
            emoji.prototype.link = function (scope, ele, attr) {
                ele.find("div").append(scope.item);
                ele.on("click", function () {
                    scope.content.messageContent = scope.content.messageContent || "";
                    scope.content.messageContent = scope.content.messageContent.replace(/\n$/, "");
                    scope.content.messageContent = scope.content.messageContent + scope.item.children[0].getAttribute("name");
                    scope.$parent.$apply();
                    var obj = document.getElementById("inputMsg");
                    RongWebIMWidget.Helper.getFocus(obj);
                });
            };
            return emoji;
        })();
        var textmessage = (function () {
            function textmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-text"><pre class="rongcloud-Message-entry" ng-bind-html="msg.content|trustHtml"><br></pre></div>' +
                    '</div>';
            }
            textmessage.prototype.link = function (scope, ele, attr) {
            };
            return textmessage;
        })();
        var includinglinkmessage = (function () {
            function includinglinkmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-text">' +
                    '<pre class="rongcloud-Message-entry" style="">' +
                    '维护中 由于我们的服务商出现故障，融云官网及相关服务也受到影响，给各位用户带来的不便，还请谅解。  您可以通过 <a href="#">【官方微博】</a>了解</pre>' +
                    '</div>' +
                    '</div>';
            }
            return includinglinkmessage;
        })();
        var imagemessage = (function () {
            function imagemessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-img">' +
                    '<span id="{{\'rebox_\'+$id}}"  class="rongcloud-Message-entry" style="">' +
                    // '<p>发给您一张示意图</p>' +
                    // '<img ng-src="{{msg.content}}" alt="">' +
                    '<a href="{{msg.imageUri}}" target="_black"><img ng-src="{{msg.content}}"  data-image="{{msg.imageUri}}" alt=""/></a>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            imagemessage.prototype.link = function (scope, ele, attr) {
                var img = new Image();
                img.src = scope.msg.imageUri;
                setTimeout(function () {
                    if (window["jQuery"] && window["jQuery"].rebox) {
                        $('#rebox_' + scope.$id).rebox({ selector: 'a', zIndex: 999999, theme: "rongcloud-rebox" }).bind("rebox:open", function () {
                            //jQuery rebox 点击空白关闭
                            var rebox = document.getElementsByClassName("rongcloud-rebox")[0];
                            rebox.onclick = function (e) {
                                if (e.target.tagName.toLowerCase() != "img") {
                                    var rebox_close = document.getElementsByClassName("rongcloud-rebox-close")[0];
                                    rebox_close.click();
                                    rebox = null;
                                    rebox_close = null;
                                }
                            };
                        });
                    }
                });
                img.onload = function () {
                    scope.$apply(function () {
                        scope.msg.content = scope.msg.imageUri;
                    });
                };
                scope.showBigImage = function () {
                };
            };
            return imagemessage;
        })();
        var voicemessage = (function () {
            function voicemessage($timeout) {
                this.$timeout = $timeout;
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-audio">' +
                    '<span class="rongcloud-Message-entry" style="">' +
                    '<span class="rongcloud-audioBox rongcloud-clearfix " ng-click="play()" ng-class="{\'rongcloud-animate\':isplaying}" ><i></i><i></i><i></i></span>' +
                    '<div style="display: inline-block;" ><span class="rongcloud-audioTimer">{{msg.duration}}”</span><span class="rongcloud-audioState" ng-show="msg.isUnReade"></span></div>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
                voicemessage.prototype["link"] = function (scope, ele, attr) {
                    scope.msg.duration = parseInt(scope.msg.duration || scope.msg.content.length / 1024);
                    RongIMLib.RongIMVoice.preLoaded(scope.msg.content);
                    scope.play = function () {
                        RongIMLib.RongIMVoice.stop(scope.msg.content);
                        if (!scope.isplaying) {
                            scope.msg.isUnReade = false;
                            RongIMLib.RongIMVoice.play(scope.msg.content, scope.msg.duration);
                            scope.isplaying = true;
                            if (scope.timeoutid) {
                                $timeout.cancel(scope.timeoutid);
                            }
                            scope.timeoutid = $timeout(function () {
                                scope.isplaying = false;
                            }, scope.msg.duration * 1000);
                        }
                        else {
                            scope.isplaying = false;
                            $timeout.cancel(scope.timeoutid);
                        }
                    };
                };
            }
            voicemessage.$inject = ["$timeout"];
            return voicemessage;
        })();
        var locationmessage = (function () {
            function locationmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-map">' +
                    '<span class="rongcloud-Message-entry" style="">' +
                    '<div class="rongcloud-mapBox">' +
                    '<img ng-src="{{msg.content}}" alt="">' +
                    '<span>{{msg.poi}}</span>' +
                    '</div>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            return locationmessage;
        })();
        var richcontentmessage = (function () {
            function richcontentmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-image-text">' +
                    '<span class="rongcloud-Message-entry" style="">' +
                    '<div class="rongcloud-image-textBox">' +
                    '<h4>{{msg.title}}</h4>' +
                    '<div class="rongcloud-cont rongcloud-clearfix">' +
                    '<img ng-src="{{msg.imageUri}}" alt="">' +
                    '<div>{{msg.content}}</div>' +
                    '</div>' +
                    '</div>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            return richcontentmessage;
        })();
        angular.module("RongWebIMWidget.conversation")
            .directive("rongConversation", factory(rongConversation))
            .directive("emoji", factory(emoji))
            .directive("textmessage", factory(textmessage))
            .directive("includinglinkmessage", factory(includinglinkmessage))
            .directive("imagemessage", factory(imagemessage))
            .directive("voicemessage", factory(voicemessage))
            .directive("locationmessage", factory(locationmessage))
            .directive("richcontentmessage", factory(richcontentmessage));
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
/// <reference path="../../../typings/tsd.d.ts"/>
/// <reference path="../../lib/RongIMLib.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation_1) {
        var CustomerService = (function () {
            function CustomerService() {
                this.human = {};
            }
            return CustomerService;
        })();
        var conversationServer = (function () {
            function conversationServer($q, providerdata) {
                this.$q = $q;
                this.providerdata = providerdata;
                this.current = new RongWebIMWidget.Conversation;
                this._cacheHistory = {};
                this._customService = new CustomerService();
            }
            conversationServer.prototype.unshiftHistoryMessages = function (id, type, item) {
                var key = type + "_" + id;
                var arr = this._cacheHistory[key] = this._cacheHistory[key] || [];
                if (arr[0] && arr[0].sentTime && arr[0].panelType != RongWebIMWidget.PanelType.Time && item.sentTime) {
                    if (!RongWebIMWidget.Helper.timeCompare(arr[0].sentTime, item.sentTime)) {
                        arr.unshift(new RongWebIMWidget.TimePanl(arr[0].sentTime));
                    }
                }
                arr.unshift(item);
            };
            conversationServer.prototype._getHistoryMessages = function (targetType, targetId, number, reset) {
                var defer = this.$q.defer();
                var _this = this;
                RongIMLib.RongIMClient.getInstance().getHistoryMessages(targetType, targetId, reset ? 0 : null, number, {
                    onSuccess: function (data, has) {
                        var msglen = data.length;
                        while (msglen--) {
                            var msg = RongWebIMWidget.Message.convert(data[msglen]);
                            switch (msg.messageType) {
                                case RongWebIMWidget.MessageType.TextMessage:
                                case RongWebIMWidget.MessageType.ImageMessage:
                                case RongWebIMWidget.MessageType.VoiceMessage:
                                case RongWebIMWidget.MessageType.RichContentMessage:
                                case RongWebIMWidget.MessageType.LocationMessage:
                                case RongWebIMWidget.MessageType.InformationNotificationMessage:
                                    _this.unshiftHistoryMessages(targetId, targetType, msg);
                                    _this.addCustomServiceInfo(msg);
                                    if (msg.content && _this.providerdata.getUserInfo) {
                                        (function (msg) {
                                            _this.providerdata.getUserInfo(msg.senderUserId, {
                                                onSuccess: function (obj) {
                                                    msg.content.userInfo = new RongWebIMWidget.UserInfo(obj.userId, obj.name, obj.portraitUri);
                                                }
                                            });
                                        })(msg);
                                    }
                                    break;
                                case RongWebIMWidget.MessageType.UnknownMessage:
                                    break;
                                default:
                                    break;
                            }
                        }
                        defer.resolve({ data: data, has: has });
                    },
                    onError: function (error) {
                        defer.reject(error);
                    }
                });
                return defer.promise;
            };
            conversationServer.prototype._addHistoryMessages = function (item) {
                var key = item.conversationType + "_" + item.targetId;
                var arr = this._cacheHistory[key];
                if (arr.length == 0) {
                    arr.push(new RongWebIMWidget.GetHistoryPanel());
                }
                if (arr[arr.length - 1]
                    && arr[arr.length - 1].panelType != RongWebIMWidget.PanelType.Time
                    && arr[arr.length - 1].sentTime
                    && item.sentTime) {
                    if (!RongWebIMWidget.Helper.timeCompare(arr[arr.length - 1].sentTime, item.sentTime)) {
                        arr.push(new RongWebIMWidget.TimePanl(item.sentTime));
                    }
                }
                arr.push(item);
            };
            conversationServer.prototype.updateUploadToken = function () {
                var _this = this;
                RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                    onSuccess: function (data) {
                        _this._uploadToken = data.token;
                    }, onError: function () {
                    }
                });
            };
            conversationServer.prototype.addCustomServiceInfo = function (msg) {
                if (!msg.content || (msg.content.userInfo && msg.content.userInfo.name)) {
                    return;
                }
                if (msg.conversationType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && msg.content && msg.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE) {
                    if (this._customService.currentType == 1) {
                        msg.content.userInfo = {
                            name: this._customService.human.name || "客服人员",
                            portraitUri: this._customService.human.headimgurl || this._customService.robotIcon
                        };
                    }
                    else {
                        msg.content.userInfo = {
                            name: this._customService.robotName,
                            portraitUri: this._customService.robotIcon
                        };
                    }
                }
                else if (msg.conversationType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && msg.content && msg.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                    msg.content.userInfo = {
                        name: "我",
                        portraitUri: this.providerdata.currentUserInfo.portraitUri
                    };
                }
                return msg;
            };
            conversationServer.$inject = ["$q", "ProviderData"];
            return conversationServer;
        })();
        angular.module("RongWebIMWidget.conversation")
            .service("ConversationServer", conversationServer);
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        var conversationListController = (function () {
            function conversationListController($scope, conversationListServer, WebIMWidget) {
                this.$scope = $scope;
                this.conversationListServer = conversationListServer;
                this.WebIMWidget = WebIMWidget;
                $scope.minbtn = function () {
                    WebIMWidget.display = false;
                };
                $scope.conversationListServer = conversationListServer;
            }
            conversationListController.$inject = [
                "$scope",
                "ConversationListServer",
                "WebIMWidget"
            ];
            return conversationListController;
        })();
        angular.module("RongWebIMWidget.conversationlist")
            .controller("conversationListController", conversationListController);
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
/// <reference path="../../lib/window.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        var factory = RongWebIMWidget.DirectiveFactory.GetFactoryFor;
        var rongConversationList = (function () {
            function rongConversationList() {
                this.restrict = "E";
                this.templateUrl = "./src/ts/conversationlist/conversationList.tpl.html";
                this.controller = "conversationListController";
            }
            rongConversationList.prototype.link = function (scope, ele) {
                if (window["jQuery"] && window["jQuery"].nicescroll) {
                    $(ele).find(".rongcloud-content").niceScroll({
                        'cursorcolor': "#0099ff",
                        'cursoropacitymax': 1,
                        'touchbehavior': false,
                        'cursorwidth': "8px",
                        'cursorborder': "0",
                        'cursorborderradius': "5px"
                    });
                }
            };
            return rongConversationList;
        })();
        var conversationItem = (function () {
            function conversationItem(conversationServer, conversationListServer, RongIMSDKServer) {
                this.conversationServer = conversationServer;
                this.conversationListServer = conversationListServer;
                this.RongIMSDKServer = RongIMSDKServer;
                this.restrict = "E";
                this.scope = { item: "=" };
                this.template = '<div class="rongcloud-chatList">' +
                    '<div class="rongcloud-chat_item " ng-class="{\'rongcloud-online\':item.onLine}">' +
                    '<div class="rongcloud-ext">' +
                    '<p class="rongcloud-attr clearfix">' +
                    '<span class="rongcloud-badge" ng-show="item.unreadMessageCount>0">{{item.unreadMessageCount>99?"99+":item.unreadMessageCount}}</span>' +
                    '<i class="rongcloud-sprite rongcloud-no-remind" ng-click="remove($event)"></i>' +
                    '</p>' +
                    '</div>' +
                    '<div class="rongcloud-photo">' +
                    '<img class="rongcloud-img" ng-src="{{item.portraitUri}}" err-src="http://7xo1cb.com1.z0.glb.clouddn.com/rongcloudkefu2.png" alt="">' +
                    '<i ng-show="!!$parent.data.getOnlineStatus&&item.targetType==1" class="rongcloud-Presence rongcloud-Presence--stacked rongcloud-Presence--mainBox"></i>' +
                    '</div>' +
                    '<div class="rongcloud-info">' +
                    '<h3 class="rongcloud-nickname">' +
                    '<span class="rongcloud-nickname_text" title="{{item.title}}">{{item.title}}</span>' +
                    '</h3>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                conversationItem.prototype["link"] = function (scope, ele, attr) {
                    ele.on("click", function () {
                        conversationServer
                            .changeConversation(new RongWebIMWidget.Conversation(scope.item.targetType, scope.item.targetId, scope.item.title));
                        if (scope.item.unreadMessageCount > 0) {
                            RongIMSDKServer.clearUnreadCount(scope.item.targetType, scope.item.targetId);
                            RongIMSDKServer.sendReadReceiptMessage(scope.item.targetId, Number(scope.item.targetType));
                            conversationListServer.updateConversations();
                        }
                    });
                    scope.remove = function (e) {
                        e.stopPropagation();
                        RongIMSDKServer.removeConversation(scope.item.targetType, scope.item.targetId).then(function () {
                            if (conversationServer.current.targetType == scope.item.targetType
                                && conversationServer.current.targetId == scope.item.targetId) {
                            }
                            conversationListServer.updateConversations();
                        }, function (error) {
                        });
                    };
                };
            }
            conversationItem.$inject = ["ConversationServer",
                "ConversationListServer",
                "RongIMSDKServer"];
            return conversationItem;
        })();
        angular.module("RongWebIMWidget.conversationlist")
            .directive("rongConversationList", factory(rongConversationList))
            .directive("conversationItem", factory(conversationItem));
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        var ConversationListServer = (function () {
            function ConversationListServer($q, providerdata, widgetConfig, RongIMSDKServer, conversationServer) {
                this.$q = $q;
                this.providerdata = providerdata;
                this.widgetConfig = widgetConfig;
                this.RongIMSDKServer = RongIMSDKServer;
                this.conversationServer = conversationServer;
                this._conversationList = [];
                this._onlineStatus = [];
                this.hiddenConversations = [];
                this._hiddenConversationObject = {};
            }
            ConversationListServer.prototype.setHiddenConversations = function (list) {
                if (angular.isArray(list)) {
                    for (var i = 0, length = list.length; i < length; i++) {
                        this._hiddenConversationObject[list[i].type + "_" + list[i].id] = true;
                    }
                }
            };
            ConversationListServer.prototype.updateConversations = function () {
                var defer = this.$q.defer();
                var _this = this;
                RongIMLib.RongIMClient.getInstance().getConversationList({
                    onSuccess: function (data) {
                        var totalUnreadCount = 0;
                        _this._conversationList.splice(0, _this._conversationList.length);
                        for (var i = 0, len = data.length; i < len; i++) {
                            var con = RongWebIMWidget.Conversation.onvert(data[i]);
                            if (_this._hiddenConversationObject[con.targetType + "_" + con.targetId]) {
                                continue;
                            }
                            switch (con.targetType) {
                                case RongIMLib.ConversationType.PRIVATE:
                                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function") {
                                        (function (a, b) {
                                            _this.providerdata.getUserInfo(a.targetId, {
                                                onSuccess: function (data) {
                                                    a.title = data.name;
                                                    a.portraitUri = data.portraitUri;
                                                    b.conversationTitle = data.name;
                                                    b.portraitUri = data.portraitUri;
                                                }
                                            });
                                        }(con, data[i]));
                                    }
                                    break;
                                case RongIMLib.ConversationType.GROUP:
                                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getGroupInfo) == "function") {
                                        (function (a, b) {
                                            _this.providerdata.getGroupInfo(a.targetId, {
                                                onSuccess: function (data) {
                                                    a.title = data.name;
                                                    a.portraitUri = data.portraitUri;
                                                    b.conversationTitle = data.name;
                                                    b.portraitUri = data.portraitUri;
                                                }
                                            });
                                        }(con, data[i]));
                                    }
                                    break;
                                case RongIMLib.ConversationType.CHATROOM:
                                    con.title = "聊天室：" + con.targetId;
                                    break;
                            }
                            totalUnreadCount += Number(con.unreadMessageCount) || 0;
                            _this._conversationList.push(con);
                        }
                        _this._onlineStatus.forEach(function (item) {
                            var conv = _this._getConversation(RongWebIMWidget.EnumConversationType.PRIVATE, item.id);
                            conv && (conv.onLine = item.status);
                        });
                        if (_this.widgetConfig.displayConversationList) {
                            _this.providerdata.totalUnreadCount = totalUnreadCount;
                            defer.resolve();
                        }
                        else {
                            var cu = _this.conversationServer.current;
                            cu && cu.targetId && _this.RongIMSDKServer.getConversation(cu.targetType, cu.targetId).then(function (conv) {
                                if (conv && conv.unreadMessageCount) {
                                    _this.providerdata.totalUnreadCount = conv.unreadMessageCount || 0;
                                    defer.resolve();
                                }
                                else {
                                    _this.providerdata.totalUnreadCount = 0;
                                    defer.resolve();
                                }
                            });
                        }
                    },
                    onError: function (error) {
                        defer.reject(error);
                    }
                }, null);
                return defer.promise;
            };
            ConversationListServer.prototype._getConversation = function (type, id) {
                for (var i = 0, len = this._conversationList.length; i < len; i++) {
                    if (this._conversationList[i].targetType == type && this._conversationList[i].targetId == id) {
                        return this._conversationList[i];
                    }
                }
                return null;
            };
            ConversationListServer.prototype.startRefreshOnlineStatus = function () {
                var _this = this;
                if (_this.widgetConfig.displayConversationList && _this.providerdata.getOnlineStatus) {
                    _this._getOnlineStatus();
                    _this.__intervale && clearInterval(this.__intervale);
                    _this.__intervale = setInterval(function () {
                        _this._getOnlineStatus();
                    }, 30 * 1000);
                }
            };
            ConversationListServer.prototype._getOnlineStatus = function () {
                var _this = this;
                var arr = _this._conversationList.map(function (item) { return item.targetId; });
                _this.providerdata.getOnlineStatus(arr, {
                    onSuccess: function (data) {
                        _this._onlineStatus = data;
                        _this.updateConversations();
                    }
                });
            };
            ConversationListServer.prototype.stopRefreshOnlineStatus = function () {
                clearInterval(this.__intervale);
                this.__intervale = null;
            };
            ConversationListServer.$inject = ["$q",
                "ProviderData",
                "WidgetConfig",
                "RongIMSDKServer",
                "ConversationServer"];
            return ConversationListServer;
        })();
        angular.module("RongWebIMWidget.conversationlist")
            .service("ConversationListServer", ConversationListServer);
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var ProductInfo = (function () {
        function ProductInfo() {
        }
        return ProductInfo;
    })();
    var eleConversationListWidth = 195, eleminbtnHeight = 50, eleminbtnWidth = 195, spacing = 3;
    var WebIMWidget = (function () {
        function WebIMWidget($q, conversationServer, conversationListServer, providerdata, widgetConfig, RongIMSDKServer, $log) {
            this.$q = $q;
            this.conversationServer = conversationServer;
            this.conversationListServer = conversationListServer;
            this.providerdata = providerdata;
            this.widgetConfig = widgetConfig;
            this.RongIMSDKServer = RongIMSDKServer;
            this.$log = $log;
            this.display = false;
            this.connected = false;
            this.EnumConversationType = RongWebIMWidget.EnumConversationType;
            this.EnumConversationListPosition = RongWebIMWidget.EnumConversationListPosition;
        }
        WebIMWidget.prototype.init = function (config) {
            var _this = this;
            config.reminder && (_this.widgetConfig.reminder = config.reminder);
            if (!window.RongIMLib || !window.RongIMLib.RongIMClient) {
                _this.widgetConfig._config = config;
                return;
            }
            var defaultStyle = _this.widgetConfig.style;
            angular.extend(_this.widgetConfig, config);
            angular.extend(defaultStyle, config.style);
            if (config.desktopNotification) {
                RongWebIMWidget.NotificationHelper.requestPermission();
            }
            var eleplaysound = document.getElementById("rongcloud-playsound");
            if (eleplaysound && typeof _this.widgetConfig.voiceUrl === "string") {
                eleplaysound["src"] = _this.widgetConfig.voiceUrl;
                _this.widgetConfig.voiceNotification = true;
            }
            else {
                _this.widgetConfig.voiceNotification = false;
            }
            var eleconversation = document.getElementById("rong-conversation");
            var eleconversationlist = document.getElementById("rong-conversation-list");
            var eleminbtn = document.getElementById("rong-widget-minbtn");
            if (_this.widgetConfig.__isKefu) {
                eleminbtn = document.getElementById("rong-widget-minbtn-kefu");
            }
            if (defaultStyle) {
                eleconversation.style["height"] = defaultStyle.height + "px";
                eleconversation.style["width"] = defaultStyle.width + "px";
                eleconversationlist.style["height"] = defaultStyle.height + "px";
                if (defaultStyle.positionFixed) {
                    eleconversationlist.style['position'] = "fixed";
                    eleminbtn.style['position'] = "fixed";
                    eleconversation.style['position'] = "fixed";
                }
                else {
                    eleconversationlist.style['position'] = "absolute";
                    eleminbtn.style['position'] = "absolute";
                    eleconversation.style['position'] = "absolute";
                }
                if (_this.widgetConfig.displayConversationList) {
                    eleminbtn.style["display"] = "inline-block";
                    eleconversationlist.style["display"] = "inline-block";
                    if (_this.widgetConfig.conversationListPosition == RongWebIMWidget.EnumConversationListPosition.left) {
                        if (!isNaN(defaultStyle.left)) {
                            eleconversationlist.style["left"] = defaultStyle.left + "px";
                            eleminbtn.style["left"] = defaultStyle.left + "px";
                            eleconversation.style["left"] = defaultStyle.left + eleConversationListWidth + spacing + "px";
                        }
                        if (!isNaN(defaultStyle.right)) {
                            eleconversationlist.style["right"] = defaultStyle.right + defaultStyle.width + spacing + "px";
                            eleminbtn.style["right"] = defaultStyle.right + defaultStyle.width + spacing + "px";
                            eleconversation.style["right"] = defaultStyle.right + "px";
                        }
                    }
                    else if (_this.widgetConfig.conversationListPosition == RongWebIMWidget.EnumConversationListPosition.right) {
                        if (!isNaN(defaultStyle.left)) {
                            eleconversationlist.style["left"] = defaultStyle.left + defaultStyle.width + spacing + "px";
                            eleminbtn.style["left"] = defaultStyle.left + defaultStyle.width + spacing + "px";
                            eleconversation.style["left"] = defaultStyle.left + "px";
                        }
                        if (!isNaN(defaultStyle.right)) {
                            eleconversationlist.style["right"] = defaultStyle.right + "px";
                            eleminbtn.style["right"] = defaultStyle.right + "px";
                            eleconversation.style["right"] = defaultStyle.right + eleConversationListWidth + spacing + "px";
                        }
                    }
                    else {
                        throw new Error("config conversationListPosition value is invalid");
                    }
                    if (!isNaN(defaultStyle["top"])) {
                        eleconversationlist.style["top"] = defaultStyle.top + "px";
                        eleminbtn.style["top"] = defaultStyle.top + defaultStyle.height - eleminbtnHeight + "px";
                        eleconversation.style["top"] = defaultStyle.top + "px";
                    }
                    if (!isNaN(defaultStyle["bottom"])) {
                        eleconversationlist.style["bottom"] = defaultStyle.bottom + "px";
                        eleminbtn.style["bottom"] = defaultStyle.bottom + "px";
                        eleconversation.style["bottom"] = defaultStyle.bottom + "px";
                    }
                }
                else {
                    eleminbtn.style["display"] = "inline-block";
                    eleconversationlist.style["display"] = "none";
                    eleconversation.style["left"] = defaultStyle["left"] + "px";
                    eleconversation.style["right"] = defaultStyle["right"] + "px";
                    eleconversation.style["top"] = defaultStyle["top"] + "px";
                    eleconversation.style["bottom"] = defaultStyle["bottom"] + "px";
                    eleminbtn.style["top"] = defaultStyle.top + defaultStyle.height - eleminbtnHeight + "px";
                    eleminbtn.style["bottom"] = defaultStyle.bottom + "px";
                    eleminbtn.style["left"] = defaultStyle.left + defaultStyle.width / 2 - eleminbtnWidth / 2 + "px";
                    eleminbtn.style["right"] = defaultStyle.right + defaultStyle.width / 2 - eleminbtnWidth / 2 + "px";
                }
            }
            if (_this.widgetConfig.displayMinButton == false) {
                eleminbtn.style["display"] = "none";
            }
            _this.conversationListServer.setHiddenConversations(_this.widgetConfig.hiddenConversations);
            _this.RongIMSDKServer.init(_this.widgetConfig.appkey);
            _this.RongIMSDKServer.registerMessage();
            _this.RongIMSDKServer.connect(_this.widgetConfig.token).then(function (userId) {
                _this.conversationListServer.updateConversations();
                _this.conversationListServer.startRefreshOnlineStatus();
                _this.conversationServer._handleConnectSuccess && _this.conversationServer._handleConnectSuccess();
                if (RongWebIMWidget.Helper.checkType(_this.widgetConfig.onSuccess) == "function") {
                    _this.widgetConfig.onSuccess(userId);
                }
                if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function") {
                    _this.providerdata.getUserInfo(userId, {
                        onSuccess: function (data) {
                            _this.providerdata.currentUserInfo =
                                new RongWebIMWidget.UserInfo(data.userId, data.name, data.portraitUri);
                        }
                    });
                }
                //_this.conversationServer._onConnectSuccess();
            }, function (err) {
                if (err.tokenError) {
                    if (_this.widgetConfig.onError && typeof _this.widgetConfig.onError == "function") {
                        _this.widgetConfig.onError({ code: 0, info: "token 无效" });
                    }
                }
                else {
                    if (_this.widgetConfig.onError && typeof _this.widgetConfig.onError == "function") {
                        _this.widgetConfig.onError({ code: err.errorCode });
                    }
                }
            });
            _this.RongIMSDKServer.setConnectionStatusListener({
                onChanged: function (status) {
                    _this.providerdata.connectionState = false;
                    switch (status) {
                        //链接成功
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            _this.$log.debug('链接成功');
                            _this.providerdata.connectionState = true;
                            break;
                        //正在链接
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            _this.$log.debug('正在链接');
                            break;
                        //其他设备登陆
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            _this.$log.debug('其他设备登录');
                            break;
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            _this.$log.debug("网络不可用");
                            break;
                        default:
                            _this.$log.debug(status);
                    }
                }
            });
            _this.RongIMSDKServer.setOnReceiveMessageListener({
                onReceived: function (data) {
                    _this.$log.debug(data);
                    var msg = RongWebIMWidget.Message.convert(data);
                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function" && msg.content) {
                        _this.providerdata.getUserInfo(msg.senderUserId, {
                            onSuccess: function (data) {
                                if (data) {
                                    msg.content.userInfo = new RongWebIMWidget.UserInfo(data.userId, data.name, data.portraitUri);
                                }
                            }
                        });
                    }
                    switch (data.messageType) {
                        case RongWebIMWidget.MessageType.VoiceMessage:
                            msg.content.isUnReade = true;
                        case RongWebIMWidget.MessageType.TextMessage:
                        case RongWebIMWidget.MessageType.LocationMessage:
                        case RongWebIMWidget.MessageType.ImageMessage:
                        case RongWebIMWidget.MessageType.RichContentMessage:
                            _this.addMessageAndOperation(msg);
                            var voiceBase = _this.providerdata.voiceSound == true
                                && eleplaysound
                                && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                                && _this.widgetConfig.voiceNotification;
                            var currentConvversationBase = _this.conversationServer.current
                                && _this.conversationServer.current.targetType == msg.conversationType
                                && _this.conversationServer.current.targetId == msg.targetId;
                            var notificationBase = (document.hidden || !_this.display)
                                && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                                && _this.widgetConfig.desktopNotification;
                            if ((_this.widgetConfig.displayConversationList && voiceBase) || (!_this.widgetConfig.displayConversationList && voiceBase && currentConvversationBase)) {
                                eleplaysound["play"]();
                            }
                            if ((notificationBase && _this.widgetConfig.displayConversationList) || (!_this.widgetConfig.displayConversationList && notificationBase && currentConvversationBase)) {
                                RongWebIMWidget.NotificationHelper.showNotification({
                                    title: msg.content.userInfo.name,
                                    icon: "",
                                    body: RongWebIMWidget.Message.messageToNotification(data), data: { targetId: msg.targetId, targetType: msg.conversationType }
                                });
                            }
                            break;
                        case RongWebIMWidget.MessageType.ContactNotificationMessage:
                            //好友通知自行处理
                            break;
                        case RongWebIMWidget.MessageType.InformationNotificationMessage:
                            _this.addMessageAndOperation(msg);
                            break;
                        case RongWebIMWidget.MessageType.UnknownMessage:
                            //未知消息自行处理
                            break;
                        case RongWebIMWidget.MessageType.ReadReceiptMessage:
                            if (data.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                                _this.RongIMSDKServer.clearUnreadCount(data.conversationType, data.targetId);
                            }
                            break;
                        default:
                            //未捕获的消息类型
                            break;
                    }
                    if (_this.onReceivedMessage) {
                        _this.onReceivedMessage(data);
                    }
                    _this.conversationServer.handleMessage(msg);
                    if (!document.hidden && _this.display
                        && _this.conversationServer.current
                        && _this.conversationServer.current.targetType == msg.conversationType
                        && _this.conversationServer.current.targetId == msg.targetId
                        && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                        && data.messageType != RongWebIMWidget.MessageType.ReadReceiptMessage) {
                        _this.RongIMSDKServer.clearUnreadCount(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId);
                        _this.RongIMSDKServer.sendReadReceiptMessage(_this.conversationServer.current.targetId, _this.conversationServer.current.targetType);
                    }
                    _this.conversationListServer.updateConversations().then(function () { });
                }
            });
            window.onfocus = function () {
                if (_this.conversationServer.current && _this.conversationServer.current.targetId && _this.display) {
                    _this.RongIMSDKServer.getConversation(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId).then(function (conv) {
                        if (conv && conv.unreadMessageCount > 0) {
                            _this.RongIMSDKServer.clearUnreadCount(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId);
                            _this.RongIMSDKServer.sendReadReceiptMessage(_this.conversationServer.current.targetId, _this.conversationServer.current.targetType);
                            _this.conversationListServer.updateConversations().then(function () { });
                        }
                    });
                }
            };
        };
        WebIMWidget.prototype.addMessageAndOperation = function (msg) {
            if (msg.conversationType === RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && !this.conversationServer._customService.connected) {
                //客服没有连接直接返回不追加显示消息
                return;
            }
            var key = msg.conversationType + "_" + msg.targetId;
            var hislist = this.conversationServer._cacheHistory[key] = this.conversationServer._cacheHistory[key] || [];
            if (hislist.length == 0) {
                hislist.push(new RongWebIMWidget.GetHistoryPanel());
                hislist.push(new RongWebIMWidget.TimePanl(msg.sentTime));
            }
            this.conversationServer._addHistoryMessages(msg);
        };
        WebIMWidget.prototype.setConversation = function (targetType, targetId, title) {
            this.conversationServer.changeConversation(new RongWebIMWidget.Conversation(targetType, targetId, title));
        };
        WebIMWidget.prototype.setUserInfoProvider = function (fun) {
            this.providerdata.getUserInfo = fun;
        };
        WebIMWidget.prototype.setGroupInfoProvider = function (fun) {
            this.providerdata.getGroupInfo = fun;
        };
        WebIMWidget.prototype.setOnlineStatusProvider = function (fun) {
            this.providerdata.getOnlineStatus = fun;
        };
        WebIMWidget.prototype.setProductInfo = function (obj) {
            if (this.conversationServer._customService.connected) {
                this.RongIMSDKServer.sendProductInfo(this.conversationServer.current.targetId, obj);
            }
            else {
                this.providerdata._productInfo = obj;
            }
        };
        WebIMWidget.prototype.show = function () {
            this.display = true;
        };
        WebIMWidget.prototype.hidden = function () {
            this.display = false;
        };
        WebIMWidget.prototype.getCurrentConversation = function () {
            return this.conversationServer.current;
        };
        WebIMWidget.$inject = ["$q",
            "ConversationServer",
            "ConversationListServer",
            "ProviderData",
            "WidgetConfig",
            "RongIMSDKServer",
            "$log"];
        return WebIMWidget;
    })();
    RongWebIMWidget.WebIMWidget = WebIMWidget;
    angular.module("RongWebIMWidget")
        .service("WebIMWidget", WebIMWidget);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var Position;
    (function (Position) {
        Position[Position["left"] = 1] = "left";
        Position[Position["right"] = 2] = "right";
    })(Position || (Position = {}));
    var RongCustomerService = (function () {
        function RongCustomerService(WebIMWidget) {
            this.WebIMWidget = WebIMWidget;
            this.defaultconfig = {
                __isCustomerService: true
            };
            this.Position = Position;
        }
        RongCustomerService.prototype.init = function (config) {
            var _this = this;
            angular.extend(this.defaultconfig, config);
            var style = {
                right: 20
            };
            if (config.position) {
                if (config.position == Position.left) {
                    style = {
                        left: 20,
                        bottom: 0,
                        width: 325,
                        positionFixed: true
                    };
                }
                else {
                    style = {
                        right: 20,
                        bottom: 0,
                        width: 325,
                        positionFixed: true
                    };
                }
            }
            if (config.style) {
                config.style.width && (style.width = config.style.width);
                config.style.height && (style.height = config.style.height);
            }
            this.defaultconfig.style = style;
            _this.WebIMWidget.init(this.defaultconfig);
            _this.WebIMWidget.onShow = function () {
                _this.WebIMWidget.setConversation(RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE, config.customerServiceId, "客服");
            };
        };
        RongCustomerService.prototype.show = function () {
            this.WebIMWidget.show();
        };
        RongCustomerService.prototype.setProductInfo = function (obj) {
            this.WebIMWidget.setProductInfo(obj);
        };
        RongCustomerService.prototype.hidden = function () {
            this.WebIMWidget.hidden();
        };
        RongCustomerService.$inject = ["WebIMWidget"];
        return RongCustomerService;
    })();
    RongWebIMWidget.RongCustomerService = RongCustomerService;
    angular.module("RongWebIMWidget")
        .service("RongCustomerService", RongCustomerService);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var Evaluate;
(function (Evaluate) {
    var evaluatedir = (function () {
        function evaluatedir($timeout) {
            this.$timeout = $timeout;
            this.restrict = "E";
            this.scope = {
                type: "=",
                display: "=",
                enter: "&confirm",
                dcancle: "&cancle"
            };
            this.templateUrl = './src/ts/evaluate/evaluate.tpl.html';
            evaluatedir.prototype["link"] = function (scope, ele) {
                var stars = [false, false, false, false, false];
                var labels = [{ display: "答非所问" }, { display: "理解能力差" }, { display: "一问三不知" }, { display: "不礼貌" }];
                var enterStars = false; //鼠标悬浮样式
                scope.stars = stars;
                scope.labels = RongWebIMWidget.Helper.cloneObject(labels);
                scope.end = false;
                scope.displayDescribe = false;
                scope.data = {
                    stars: 0,
                    value: 0,
                    describe: "",
                    label: ""
                };
                scope.$watch("display", function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    else {
                        enterStars = false;
                        scope.displayDescribe = false;
                        scope.labels = RongWebIMWidget.Helper.cloneObject(labels);
                        scope.data = {
                            stars: 0,
                            value: 0,
                            describe: "",
                            label: ""
                        };
                    }
                });
                scope.mousehover = function (data) {
                    !enterStars && (scope.data.stars = data);
                };
                scope.confirm = function (data) {
                    if (data != undefined) {
                        enterStars = true;
                        if (scope.type == 1) {
                            scope.data.stars = data;
                            if (scope.data.stars != 5) {
                                scope.displayDescribe = true;
                            }
                            else {
                                callbackConfirm(scope.data);
                            }
                        }
                        else {
                            scope.data.value = data;
                            if (scope.data.value === false) {
                                scope.displayDescribe = true;
                            }
                            else {
                                callbackConfirm(scope.data);
                            }
                        }
                    }
                    else {
                        callbackConfirm(null);
                    }
                };
                scope.commit = function () {
                    var value = [];
                    for (var i = 0, len = scope.labels.length; i < len; i++) {
                        if (scope.labels[i].selected) {
                            value.push(scope.labels[i].display);
                        }
                    }
                    scope.data.label = value;
                    callbackConfirm(scope.data);
                };
                scope.cancle = function () {
                    scope.display = false;
                    scope.dcancle();
                };
                function callbackConfirm(data) {
                    scope.end = true;
                    if (data) {
                        $timeout(function () {
                            scope.display = false;
                            scope.end = false;
                            scope.enter({ data: data });
                        }, 800);
                    }
                    else {
                        scope.display = false;
                        scope.end = false;
                        scope.enter({ data: data });
                    }
                }
            };
        }
        evaluatedir.$inject = ["$timeout"];
        return evaluatedir;
    })();
    angular.module("Evaluate", [])
        .directive("evaluatedir", RongWebIMWidget.DirectiveFactory.GetFactoryFor(evaluatedir));
})(Evaluate || (Evaluate = {}));
/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../lib/window.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    runApp.$inject = ["$http", "WebIMWidget", "WidgetConfig", "RongCustomerService"];
    function runApp($http, WebIMWidget, WidgetConfig, RongCustomerService) {
        var protocol = location.protocol === "https:" ? "https:" : "http:";
        $script.get(protocol + "//cdn.ronghub.com/RongIMLib-2.2.0.min.js", function () {
            $script.get(protocol + "//cdn.ronghub.com/RongEmoji-2.2.0.min.js", function () {
                RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.init();
            });
            $script.get(protocol + "//cdn.ronghub.com/RongIMVoice-2.2.0.min.js", function () {
                RongIMLib.RongIMVoice && RongIMLib.RongIMVoice.init();
            });
            if (WidgetConfig._config) {
                if (WidgetConfig._config.__isKefu) {
                    RongCustomerService.init(WidgetConfig._config);
                }
                else {
                    WebIMWidget.init(WidgetConfig._config);
                }
            }
        });
        $script.get(protocol + "//cdn.bootcss.com/plupload/2.1.8/plupload.full.min.js", function () { });
    }
    var rongWidget = (function () {
        function rongWidget() {
            this.restrict = "E";
            this.templateUrl = "./src/ts/main.tpl.html";
            this.controller = "rongWidgetController";
        }
        return rongWidget;
    })();
    var rongWidgetController = (function () {
        function rongWidgetController($scope, $interval, WebIMWidget, WidgetConfig, providerdata, conversationServer, conversationListServer, RongIMSDKServer) {
            this.$scope = $scope;
            this.$interval = $interval;
            this.WebIMWidget = WebIMWidget;
            this.WidgetConfig = WidgetConfig;
            this.providerdata = providerdata;
            this.conversationServer = conversationServer;
            this.conversationListServer = conversationListServer;
            this.RongIMSDKServer = RongIMSDKServer;
            $scope.main = WebIMWidget;
            $scope.config = WidgetConfig;
            $scope.data = providerdata;
            var voicecookie = RongWebIMWidget.Helper.CookieHelper.getCookie("rongcloud.voiceSound");
            providerdata.voiceSound = voicecookie ? (voicecookie == "true") : true;
            $scope.$watch("data.voiceSound", function (newVal, oldVal) {
                if (newVal === oldVal)
                    return;
                RongWebIMWidget.Helper.CookieHelper.setCookie("rongcloud.voiceSound", newVal);
            });
            var interval = null;
            $scope.$watch("data.totalUnreadCount", function (newVal, oldVal) {
                if (newVal > 0) {
                    interval && $interval.cancel(interval);
                    interval = $interval(function () {
                        $scope.twinkle = !$scope.twinkle;
                    }, 1000);
                }
                else {
                    $interval.cancel(interval);
                }
            });
            $scope.$watch("main.display", function () {
                if (conversationServer.current && conversationServer.current.targetId && WebIMWidget.display) {
                    RongIMSDKServer.getConversation(conversationServer.current.targetType, conversationServer.current.targetId).then(function (conv) {
                        if (conv && conv.unreadMessageCount > 0) {
                            RongIMSDKServer.clearUnreadCount(conversationServer.current.targetType, conversationServer.current.targetId);
                            RongIMSDKServer.sendReadReceiptMessage(conversationServer.current.targetId, conversationServer.current.targetType);
                            conversationListServer.updateConversations().then(function () { });
                        }
                    });
                }
            });
            WebIMWidget.show = function () {
                WebIMWidget.display = true;
                WebIMWidget.fullScreen = false;
                WebIMWidget.onShow && WebIMWidget.onShow();
                setTimeout(function () {
                    $scope.$apply();
                });
            };
            WebIMWidget.hidden = function () {
                WebIMWidget.display = false;
                setTimeout(function () {
                    $scope.$apply();
                });
            };
            $scope.showbtn = function () {
                WebIMWidget.display = true;
                WebIMWidget.onShow && WebIMWidget.onShow();
            };
        }
        rongWidgetController.$inject = ["$scope",
            "$interval",
            "WebIMWidget",
            "WidgetConfig",
            "ProviderData",
            "ConversationServer",
            "ConversationListServer",
            "RongIMSDKServer"
        ];
        return rongWidgetController;
    })();
    angular.module("RongWebIMWidget").run(runApp)
        .directive("rongWidget", RongWebIMWidget.DirectiveFactory.GetFactoryFor(rongWidget))
        .controller("rongWidgetController", rongWidgetController);
    ;
})(RongWebIMWidget || (RongWebIMWidget = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../typings/tsd.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    (function (EnumConversationListPosition) {
        EnumConversationListPosition[EnumConversationListPosition["left"] = 0] = "left";
        EnumConversationListPosition[EnumConversationListPosition["right"] = 1] = "right";
    })(RongWebIMWidget.EnumConversationListPosition || (RongWebIMWidget.EnumConversationListPosition = {}));
    var EnumConversationListPosition = RongWebIMWidget.EnumConversationListPosition;
    (function (EnumConversationType) {
        EnumConversationType[EnumConversationType["PRIVATE"] = 1] = "PRIVATE";
        EnumConversationType[EnumConversationType["DISCUSSION"] = 2] = "DISCUSSION";
        EnumConversationType[EnumConversationType["GROUP"] = 3] = "GROUP";
        EnumConversationType[EnumConversationType["CHATROOM"] = 4] = "CHATROOM";
        EnumConversationType[EnumConversationType["CUSTOMER_SERVICE"] = 5] = "CUSTOMER_SERVICE";
        EnumConversationType[EnumConversationType["SYSTEM"] = 6] = "SYSTEM";
        EnumConversationType[EnumConversationType["APP_PUBLIC_SERVICE"] = 7] = "APP_PUBLIC_SERVICE";
        EnumConversationType[EnumConversationType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";
    })(RongWebIMWidget.EnumConversationType || (RongWebIMWidget.EnumConversationType = {}));
    var EnumConversationType = RongWebIMWidget.EnumConversationType;
    (function (MessageDirection) {
        MessageDirection[MessageDirection["SEND"] = 1] = "SEND";
        MessageDirection[MessageDirection["RECEIVE"] = 2] = "RECEIVE";
    })(RongWebIMWidget.MessageDirection || (RongWebIMWidget.MessageDirection = {}));
    var MessageDirection = RongWebIMWidget.MessageDirection;
    (function (ReceivedStatus) {
        ReceivedStatus[ReceivedStatus["READ"] = 1] = "READ";
        ReceivedStatus[ReceivedStatus["LISTENED"] = 2] = "LISTENED";
        ReceivedStatus[ReceivedStatus["DOWNLOADED"] = 4] = "DOWNLOADED";
    })(RongWebIMWidget.ReceivedStatus || (RongWebIMWidget.ReceivedStatus = {}));
    var ReceivedStatus = RongWebIMWidget.ReceivedStatus;
    (function (SentStatus) {
        /**
         * 发送中。
         */
        SentStatus[SentStatus["SENDING"] = 10] = "SENDING";
        /**
         * 发送失败。
         */
        SentStatus[SentStatus["FAILED"] = 20] = "FAILED";
        /**
         * 已发送。
         */
        SentStatus[SentStatus["SENT"] = 30] = "SENT";
        /**
         * 对方已接收。
         */
        SentStatus[SentStatus["RECEIVED"] = 40] = "RECEIVED";
        /**
         * 对方已读。
         */
        SentStatus[SentStatus["READ"] = 50] = "READ";
        /**
         * 对方已销毁。
         */
        SentStatus[SentStatus["DESTROYED"] = 60] = "DESTROYED";
    })(RongWebIMWidget.SentStatus || (RongWebIMWidget.SentStatus = {}));
    var SentStatus = RongWebIMWidget.SentStatus;
    var AnimationType;
    (function (AnimationType) {
        AnimationType[AnimationType["left"] = 1] = "left";
        AnimationType[AnimationType["right"] = 2] = "right";
        AnimationType[AnimationType["top"] = 3] = "top";
        AnimationType[AnimationType["bottom"] = 4] = "bottom";
    })(AnimationType || (AnimationType = {}));
    (function (EnumInputPanelType) {
        EnumInputPanelType[EnumInputPanelType["person"] = 0] = "person";
        EnumInputPanelType[EnumInputPanelType["robot"] = 1] = "robot";
        EnumInputPanelType[EnumInputPanelType["robotSwitchPerson"] = 2] = "robotSwitchPerson";
        EnumInputPanelType[EnumInputPanelType["notService"] = 4] = "notService";
    })(RongWebIMWidget.EnumInputPanelType || (RongWebIMWidget.EnumInputPanelType = {}));
    var EnumInputPanelType = RongWebIMWidget.EnumInputPanelType;
    (function (EnumCustomerStatus) {
        EnumCustomerStatus[EnumCustomerStatus["person"] = 1] = "person";
        EnumCustomerStatus[EnumCustomerStatus["robot"] = 2] = "robot";
    })(RongWebIMWidget.EnumCustomerStatus || (RongWebIMWidget.EnumCustomerStatus = {}));
    var EnumCustomerStatus = RongWebIMWidget.EnumCustomerStatus;
    RongWebIMWidget.MessageType = {
        DiscussionNotificationMessage: "DiscussionNotificationMessage ",
        TextMessage: "TextMessage",
        ImageMessage: "ImageMessage",
        VoiceMessage: "VoiceMessage",
        RichContentMessage: "RichContentMessage",
        HandshakeMessage: "HandshakeMessage",
        UnknownMessage: "UnknownMessage",
        SuspendMessage: "SuspendMessage",
        LocationMessage: "LocationMessage",
        InformationNotificationMessage: "InformationNotificationMessage",
        ContactNotificationMessage: "ContactNotificationMessage",
        ProfileNotificationMessage: "ProfileNotificationMessage",
        CommandNotificationMessage: "CommandNotificationMessage",
        HandShakeResponseMessage: "HandShakeResponseMessage",
        ChangeModeResponseMessage: "ChangeModeResponseMessage",
        TerminateMessage: "TerminateMessage",
        CustomerStatusUpdateMessage: "CustomerStatusUpdateMessage",
        ReadReceiptMessage: "ReadReceiptMessage"
    };
    (function (PanelType) {
        PanelType[PanelType["Message"] = 1] = "Message";
        PanelType[PanelType["InformationNotification"] = 2] = "InformationNotification";
        PanelType[PanelType["System"] = 103] = "System";
        PanelType[PanelType["Time"] = 104] = "Time";
        PanelType[PanelType["getHistory"] = 105] = "getHistory";
        PanelType[PanelType["getMore"] = 106] = "getMore";
        PanelType[PanelType["Other"] = 0] = "Other";
    })(RongWebIMWidget.PanelType || (RongWebIMWidget.PanelType = {}));
    var PanelType = RongWebIMWidget.PanelType;
    var ChatPanel = (function () {
        function ChatPanel(type) {
            this.panelType = type;
        }
        return ChatPanel;
    })();
    RongWebIMWidget.ChatPanel = ChatPanel;
    var TimePanl = (function (_super) {
        __extends(TimePanl, _super);
        function TimePanl(date) {
            _super.call(this, PanelType.Time);
            this.sentTime = date;
        }
        return TimePanl;
    })(ChatPanel);
    RongWebIMWidget.TimePanl = TimePanl;
    var GetHistoryPanel = (function (_super) {
        __extends(GetHistoryPanel, _super);
        function GetHistoryPanel() {
            _super.call(this, PanelType.getHistory);
        }
        return GetHistoryPanel;
    })(ChatPanel);
    RongWebIMWidget.GetHistoryPanel = GetHistoryPanel;
    var GetMoreMessagePanel = (function (_super) {
        __extends(GetMoreMessagePanel, _super);
        function GetMoreMessagePanel() {
            _super.call(this, PanelType.getMore);
        }
        return GetMoreMessagePanel;
    })(ChatPanel);
    RongWebIMWidget.GetMoreMessagePanel = GetMoreMessagePanel;
    var TimePanel = (function (_super) {
        __extends(TimePanel, _super);
        function TimePanel(time) {
            _super.call(this, PanelType.Time);
            this.sentTime = time;
        }
        return TimePanel;
    })(ChatPanel);
    RongWebIMWidget.TimePanel = TimePanel;
    var Message = (function (_super) {
        __extends(Message, _super);
        function Message(content, conversationType, extra, objectName, messageDirection, messageId, receivedStatus, receivedTime, senderUserId, sentStatus, sentTime, targetId, messageType) {
            _super.call(this, PanelType.Message);
        }
        Message.convert = function (SDKmsg) {
            var msg = new Message();
            msg.conversationType = SDKmsg.conversationType;
            msg.extra = SDKmsg.extra;
            msg.objectName = SDKmsg.objectName;
            msg.messageDirection = SDKmsg.messageDirection;
            msg.messageId = SDKmsg.messageId;
            msg.receivedStatus = SDKmsg.receivedStatus;
            msg.receivedTime = new Date(SDKmsg.receivedTime);
            msg.senderUserId = SDKmsg.senderUserId;
            msg.sentStatus = SDKmsg.sendStatusMessage;
            msg.sentTime = new Date(SDKmsg.sentTime);
            msg.targetId = SDKmsg.targetId;
            msg.messageType = SDKmsg.messageType;
            switch (msg.messageType) {
                case RongWebIMWidget.MessageType.TextMessage:
                    var texmsg = new TextMessage();
                    var content = SDKmsg.content.content;
                    content = RongWebIMWidget.Helper.escapeSymbol.encodeHtmlsymbol(content);
                    content = RongWebIMWidget.Helper.discernUrlEmailInStr(content);
                    if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
                        content = RongIMLib.RongIMEmoji.emojiToHTML(content);
                    }
                    texmsg.content = content;
                    texmsg.extra = SDKmsg.content.extra;
                    msg.content = texmsg;
                    break;
                case RongWebIMWidget.MessageType.ImageMessage:
                    var image = new ImageMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    image.content = content;
                    image.imageUri = SDKmsg.content.imageUri;
                    image.extra = SDKmsg.content.extra;
                    msg.content = image;
                    break;
                case RongWebIMWidget.MessageType.VoiceMessage:
                    var voice = new VoiceMessage();
                    voice.content = SDKmsg.content.content;
                    voice.duration = SDKmsg.content.duration;
                    voice.extra = SDKmsg.content.extra;
                    msg.content = voice;
                    break;
                case RongWebIMWidget.MessageType.RichContentMessage:
                    var rich = new RichContentMessage();
                    rich.content = SDKmsg.content.content;
                    rich.title = SDKmsg.content.title;
                    rich.imageUri = SDKmsg.content.imageUri;
                    rich.extra = SDKmsg.content.extra;
                    msg.content = rich;
                    break;
                case RongWebIMWidget.MessageType.LocationMessage:
                    var location = new LocationMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    location.content = content;
                    location.latiude = SDKmsg.content.latiude;
                    location.longitude = SDKmsg.content.longitude;
                    location.poi = SDKmsg.content.poi;
                    location.extra = SDKmsg.content.extra;
                    msg.content = location;
                    break;
                case RongWebIMWidget.MessageType.InformationNotificationMessage:
                    var info = new InformationNotificationMessage();
                    msg.panelType = 2; //灰条消息
                    info.content = SDKmsg.content.message;
                    msg.content = info;
                    break;
                case RongWebIMWidget.MessageType.DiscussionNotificationMessage:
                    var discussion = new DiscussionNotificationMessage();
                    discussion.extension = SDKmsg.content.extension;
                    discussion.operation = SDKmsg.content.operation;
                    discussion.type = SDKmsg.content.type;
                    discussion.isHasReceived = SDKmsg.content.isHasReceived;
                    msg.content = discussion;
                case RongWebIMWidget.MessageType.HandShakeResponseMessage:
                    var handshak = new HandShakeResponseMessage();
                    handshak.status = SDKmsg.content.status;
                    handshak.msg = SDKmsg.content.msg;
                    handshak.data = SDKmsg.content.data;
                    msg.content = handshak;
                    break;
                case RongWebIMWidget.MessageType.ChangeModeResponseMessage:
                    var change = new ChangeModeResponseMessage();
                    change.code = SDKmsg.content.code;
                    change.data = SDKmsg.content.data;
                    change.status = SDKmsg.content.status;
                    msg.content = change;
                    break;
                case RongWebIMWidget.MessageType.CustomerStatusUpdateMessage:
                    var up = new CustomerStatusUpdateMessage();
                    up.serviceStatus = SDKmsg.content.serviceStatus;
                    msg.content = up;
                    break;
                case RongWebIMWidget.MessageType.TerminateMessage:
                    var ter = new TerminateMessage();
                    ter.code = SDKmsg.content.code;
                    msg.content = ter;
                    break;
                default:
                    break;
            }
            if (msg.content) {
                msg.content.userInfo = SDKmsg.content.user;
            }
            return msg;
        };
        Message.messageToNotification = function (msg) {
            if (!msg)
                return null;
            var msgtype = msg.messageType, msgContent;
            if (msgtype == RongWebIMWidget.MessageType.ImageMessage) {
                msgContent = "[图片]";
            }
            else if (msgtype == RongWebIMWidget.MessageType.LocationMessage) {
                msgContent = "[位置]";
            }
            else if (msgtype == RongWebIMWidget.MessageType.VoiceMessage) {
                msgContent = "[语音]";
            }
            else if (msgtype == RongWebIMWidget.MessageType.ContactNotificationMessage || msgtype == RongWebIMWidget.MessageType.CommandNotificationMessage) {
                msgContent = "[通知消息]";
            }
            else if (msg.objectName == "RC:GrpNtf") {
                var data = msg.content.message.content.data.data;
                switch (msg.content.message.content.operation) {
                    case "Add":
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 加入了群组") : "加入群组";
                        break;
                    case "Quit":
                        msgContent = data.operatorNickname + " 退出了群组";
                        break;
                    case "Kicked":
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 被剔出群组") : "移除群组";
                        break;
                    case "Rename":
                        msgContent = data.operatorNickname + " 修改了群名称";
                        break;
                    case "Create":
                        msgContent = data.operatorNickname + " 创建了群组";
                        break;
                    case "Dismiss":
                        msgContent = data.operatorNickname + " 解散了群组 " + data.targetGroupName;
                        break;
                    default:
                        break;
                }
            }
            else {
                msgContent = msg.content ? msg.content.content : "";
                msgContent = RongIMLib.RongIMEmoji.emojiToSymbol(msgContent);
                msgContent = msgContent.replace(/\n/g, " ");
                msgContent = msgContent.replace(/([\w]{49,50})/g, "$1 ");
            }
            return msgContent;
        };
        return Message;
    })(ChatPanel);
    RongWebIMWidget.Message = Message;
    var UserInfo = (function () {
        function UserInfo(userId, name, portraitUri) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return UserInfo;
    })();
    RongWebIMWidget.UserInfo = UserInfo;
    var GroupInfo = (function () {
        function GroupInfo(userId, name, portraitUri) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return GroupInfo;
    })();
    RongWebIMWidget.GroupInfo = GroupInfo;
    var TextMessage = (function () {
        function TextMessage(msg) {
            msg = msg || {};
            this.content = msg.content;
            this.userInfo = msg.userInfo;
        }
        return TextMessage;
    })();
    RongWebIMWidget.TextMessage = TextMessage;
    var HandShakeResponseMessage = (function () {
        function HandShakeResponseMessage() {
        }
        return HandShakeResponseMessage;
    })();
    RongWebIMWidget.HandShakeResponseMessage = HandShakeResponseMessage;
    var ChangeModeResponseMessage = (function () {
        function ChangeModeResponseMessage() {
        }
        return ChangeModeResponseMessage;
    })();
    RongWebIMWidget.ChangeModeResponseMessage = ChangeModeResponseMessage;
    var TerminateMessage = (function () {
        function TerminateMessage() {
        }
        return TerminateMessage;
    })();
    RongWebIMWidget.TerminateMessage = TerminateMessage;
    var CustomerStatusUpdateMessage = (function () {
        function CustomerStatusUpdateMessage() {
        }
        return CustomerStatusUpdateMessage;
    })();
    RongWebIMWidget.CustomerStatusUpdateMessage = CustomerStatusUpdateMessage;
    var InformationNotificationMessage = (function () {
        function InformationNotificationMessage() {
        }
        return InformationNotificationMessage;
    })();
    RongWebIMWidget.InformationNotificationMessage = InformationNotificationMessage;
    var ImageMessage = (function () {
        function ImageMessage() {
        }
        return ImageMessage;
    })();
    RongWebIMWidget.ImageMessage = ImageMessage;
    var VoiceMessage = (function () {
        function VoiceMessage() {
        }
        return VoiceMessage;
    })();
    RongWebIMWidget.VoiceMessage = VoiceMessage;
    var LocationMessage = (function () {
        function LocationMessage() {
        }
        return LocationMessage;
    })();
    RongWebIMWidget.LocationMessage = LocationMessage;
    var RichContentMessage = (function () {
        function RichContentMessage() {
        }
        return RichContentMessage;
    })();
    RongWebIMWidget.RichContentMessage = RichContentMessage;
    var DiscussionNotificationMessage = (function () {
        function DiscussionNotificationMessage() {
        }
        return DiscussionNotificationMessage;
    })();
    RongWebIMWidget.DiscussionNotificationMessage = DiscussionNotificationMessage;
    var Conversation = (function () {
        function Conversation(targetType, targetId, title) {
            this.targetType = targetType;
            this.targetId = targetId;
            this.title = title || "";
        }
        Conversation.onvert = function (item) {
            var conver = new Conversation();
            conver.targetId = item.targetId;
            conver.targetType = item.conversationType;
            conver.title = item.conversationTitle;
            conver.portraitUri = item.senderPortraitUri;
            conver.unreadMessageCount = item.unreadMessageCount;
            return conver;
        };
        return Conversation;
    })();
    RongWebIMWidget.Conversation = Conversation;
})(RongWebIMWidget || (RongWebIMWidget = {}));
/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../lib/RongIMLib.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var RongIMSDKServer = (function () {
        function RongIMSDKServer($q) {
            var _this = this;
            this.$q = $q;
            this.connect = function (token) {
                var defer = _this.$q.defer();
                RongIMLib.RongIMClient.connect(token, {
                    onSuccess: function (data) {
                        defer.resolve(data);
                    },
                    onTokenIncorrect: function () {
                        defer.reject({ tokenError: true });
                    },
                    onError: function (errorCode) {
                        defer.reject({ errorCode: errorCode });
                        var info = '';
                        switch (errorCode) {
                            case RongIMLib.ErrorCode.TIMEOUT:
                                info = '连接超时';
                                break;
                            case RongIMLib.ErrorCode.UNKNOWN:
                                info = '未知错误';
                                break;
                            case RongIMLib.ConnectionState.UNACCEPTABLE_PROTOCOL_VERSION:
                                info = '不可接受的协议版本';
                                break;
                            case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                                info = 'appkey不正确';
                                break;
                            case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                                info = '服务器不可用';
                                break;
                            case RongIMLib.ConnectionState.NOT_AUTHORIZED:
                                info = '未认证';
                                break;
                            case RongIMLib.ConnectionState.REDIRECT:
                                info = '重新获取导航';
                                break;
                            case RongIMLib.ConnectionState.APP_BLOCK_OR_DELETE:
                                info = '应用已被封禁或已被删除';
                                break;
                            case RongIMLib.ConnectionState.BLOCK:
                                info = '用户被封禁';
                                break;
                        }
                        console.log("失败:" + info + errorCode);
                    }
                });
                return defer.promise;
            };
            this.getConversation = function (type, targetId) {
                var defer = _this.$q.defer();
                RongIMLib.RongIMClient.getInstance().getConversation(Number(type), targetId, {
                    onSuccess: function (data) {
                        defer.resolve(data);
                    },
                    onError: function () {
                        defer.reject();
                    }
                });
                return defer.promise;
            };
            this.getFileToken = function () {
                var defer = _this.$q.defer();
                RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                    onSuccess: function (data) {
                        if (data) {
                            defer.resolve(data.token);
                        }
                        else {
                            defer.reject();
                        }
                    }, onError: function () {
                        defer.reject();
                    }
                });
                return defer.promise;
            };
        }
        RongIMSDKServer.prototype.init = function (appkey) {
            RongIMLib.RongIMClient.init(appkey);
        };
        RongIMSDKServer.prototype.setOnReceiveMessageListener = function (option) {
            RongIMLib.RongIMClient.setOnReceiveMessageListener(option);
        };
        RongIMSDKServer.prototype.setConnectionStatusListener = function (option) {
            RongIMLib.RongIMClient.setConnectionStatusListener(option);
        };
        RongIMSDKServer.prototype.startCustomService = function (targetId) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().startCustomService(targetId, {
                onSuccess: function () {
                    defer.resolve();
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.sendReadReceiptMessage = function (targetId, type) {
            var that = this;
            RongIMLib.RongIMClient.getInstance()
                .getConversation(Number(type), targetId, {
                onSuccess: function (data) {
                    if (data) {
                        var read = RongIMLib.ReadReceiptMessage
                            .obtain(data.latestMessage.messageUId, data.latestMessage.sentTime, "1");
                        that.sendMessage(type, targetId, read);
                    }
                },
                onError: function () {
                }
            });
        };
        RongIMSDKServer.prototype.sendMessage = function (conver, targetId, content) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().sendMessage(+conver, targetId, content, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (errorCode, message) {
                    defer.reject({ errorCode: errorCode, message: message });
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default:
                            info = "";
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.evaluateHumanCustomService = function (targetId, value, describe) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().evaluateHumanCustomService(targetId, value, describe, {
                onSuccess: function () {
                    defer.resolve();
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.evaluateRebotCustomService = function (targetId, value, describe) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().evaluateRebotCustomService(targetId, value, describe, {
                onSuccess: function () {
                    defer.resolve();
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.reconnect = function (callback) {
            RongIMLib.RongIMClient.reconnect(callback);
        };
        RongIMSDKServer.prototype.disconnect = function () {
            RongIMLib.RongIMClient.getInstance().disconnect();
        };
        RongIMSDKServer.prototype.logout = function () {
            if (RongIMLib && RongIMLib.RongIMClient) {
                RongIMLib.RongIMClient.getInstance().logout();
            }
        };
        RongIMSDKServer.prototype.clearUnreadCount = function (type, targetid) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .clearUnreadCount(type, targetid, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getTotalUnreadCount = function () {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getTotalUnreadCount({
                onSuccess: function (num) {
                    defer.resolve(num);
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getConversationList = function () {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getConversationList({
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            }, null);
            return defer.promise;
        };
        RongIMSDKServer.prototype.removeConversation = function (type, targetId) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .removeConversation(type, targetId, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getHistoryMessages = function (type, targetId, num) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getHistoryMessages(type, targetId, null, num, {
                onSuccess: function (data, has) {
                    defer.resolve({
                        data: data,
                        has: has
                    });
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getDraft = function (type, targetId) {
            return RongIMLib.RongIMClient.getInstance()
                .getTextMessageDraft(type, targetId) || "";
        };
        RongIMSDKServer.prototype.setDraft = function (type, targetId, value) {
            return RongIMLib.RongIMClient.getInstance()
                .saveTextMessageDraft(type, targetId, value);
        };
        RongIMSDKServer.prototype.clearDraft = function (type, targetId) {
            return RongIMLib.RongIMClient.getInstance()
                .clearTextMessageDraft(type, targetId);
        };
        RongIMSDKServer.prototype.sendProductInfo = function (targetId, msgContent) {
            var msg = new RongIMLib.RongIMClient.RegisterMessage["ProductMessage"](msgContent);
            this.sendMessage(RongIMLib.ConversationType.CUSTOMER_SERVICE, targetId, msg);
        };
        RongIMSDKServer.prototype.registerMessage = function () {
            var messageName = "ProductMessage"; // 消息名称。
            var objectName = "cs:product"; // 消息内置名称，请按照此格式命名。
            var mesasgeTag = new RongIMLib.MessageTag(true, true); // 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
            var propertys = ["title", "url", "content", "imageUrl", "extra"]; // 消息类中的属性名。
            RongIMLib.RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, propertys);
        };
        RongIMSDKServer.$inject = ["$q"];
        return RongIMSDKServer;
    })();
    RongWebIMWidget.RongIMSDKServer = RongIMSDKServer;
    angular.module("RongWebIMWidget")
        .service("RongIMSDKServer", RongIMSDKServer);
})(RongWebIMWidget || (RongWebIMWidget = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var ProviderData = (function () {
        function ProviderData() {
            this._cacheUserInfo = [];
            this._cacheGroupInfo = [];
            this.totalUnreadCount = 0;
            this.connectionState = false;
            this.voiceSound = false;
            this.currentUserInfo = {};
        }
        ProviderData.prototype._getCacheUserInfo = function (id) {
            for (var i = 0, len = this._cacheUserInfo.length; i < len; i++) {
                if (this._cacheUserInfo[i].userId == id) {
                    return this._cacheUserInfo[i];
                }
            }
            return null;
        };
        ProviderData.prototype._addUserInfo = function (user) {
            var olduser = this._getCacheUserInfo(user.userId);
            if (olduser) {
                angular.extend(olduser, user);
            }
            else {
                this._cacheUserInfo.push(user);
            }
        };
        return ProviderData;
    })();
    RongWebIMWidget.ProviderData = ProviderData;
    var ElementStyle = (function () {
        function ElementStyle() {
        }
        return ElementStyle;
    })();
    var WidgetConfig = (function () {
        function WidgetConfig() {
            this.displayConversationList = false;
            this.conversationListPosition = RongWebIMWidget.EnumConversationListPosition.left;
            this.displayMinButton = true;
            this.desktopNotification = false;
            this.reminder = "";
            this.voiceNotification = false;
            this.style = {
                positionFixed: false,
                width: 450,
                height: 470,
                bottom: 0,
                right: 0
            };
            this.refershOnlineStateIntercycle = 1000 * 20;
            this.hiddenConversations = [];
            this.__isKefu = false;
        }
        return WidgetConfig;
    })();
    RongWebIMWidget.WidgetConfig = WidgetConfig;
    angular.module("RongWebIMWidget")
        .service("ProviderData", ProviderData)
        .service("WidgetConfig", WidgetConfig);
})(RongWebIMWidget || (RongWebIMWidget = {}));

angular.module('RongWebIMWidget').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('./src/ts/conversation/conversation.tpl.html',
    "<div id=rong-conversation class=\"rongcloud-kefuChatBox rongcloud-both rongcloud-am-fade-and-slide-top\" ng-show=showSelf ng-class=\"{'rongcloud-fullScreen':resoures.fullScreen}\"><evaluatedir type=evaluate.type display=evaluate.showSelf confirm=evaluate.onConfirm(data) cancle=evaluate.onCancle()></evaluatedir><div class=rongcloud-kefuChat><div id=header class=\"rongcloud-rong-header rongcloud-blueBg rongcloud-online\"><div class=\"rongcloud-infoBar rongcloud-pull-left\"><div class=rongcloud-infoBarTit><span class=rongcloud-kefuName ng-bind=conversation.title></span></div></div><div class=\"rongcloud-toolBar rongcloud-headBtn rongcloud-pull-right\"><div ng-show=!config.displayConversationList&&config.voiceNotification class=rongcloud-voice ng-class=\"{'rongcloud-voice-mute':!data.voiceSound,'rongcloud-voice-sound':data.voiceSound}\" ng-click=\"data.voiceSound=!data.voiceSound\"></div><a href=javascript:; class=\"rongcloud-kefuChatBoxHide rongcloud-sprite\" style=margin-right:6px ng-show=!config.displayConversationList ng-click=minimize() title=隐藏></a> <a href=javascript:; class=\"rongcloud-kefuChatBoxClose rongcloud-sprite\" ng-click=close() title=结束对话></a></div></div><div class=rongcloud-outlineBox ng-hide=data.connectionState><div class=rongcloud-sprite></div><span>连接断开,请刷新重连</span></div><div id=Messages><div class=rongcloud-emptyBox>暂时没有新消息</div><div class=rongcloud-MessagesInner><div ng-repeat=\"item in messageList\" ng-switch=item.panelType><div class=rongcloud-Messages-date ng-switch-when=104><b>{{item.sentTime|historyTime}}</b></div><div class=rongcloud-Messages-history ng-switch-when=105><b ng-click=getHistory()>查看历史消息</b></div><div class=rongcloud-Messages-history ng-switch-when=106><b ng-click=getMoreMessage()>获取更多消息</b></div><div class=rongcloud-sys-tips ng-switch-when=2><span ng-bind-html=item.content.content|trustHtml></span></div><div class=rongcloud-Message ng-switch-when=1><div class=rongcloud-Messages-unreadLine></div><div><div class=rongcloud-Message-header><img class=\"rongcloud-img rongcloud-u-isActionable rongcloud-Message-avatar rongcloud-avatar\" ng-src={{item.content.userInfo.portraitUri||item.content.userInfo.icon}} err-src=http://7xo1cb.com1.z0.glb.clouddn.com/rongcloudkefu2.png errsrcserasdfasdfasdfa alt=\"\"><div class=\"rongcloud-Message-author rongcloud-clearfix\"><a class=\"rongcloud-author rongcloud-u-isActionable\">{{item.content.userInfo.name}}</a></div></div></div><div class=rongcloud-Message-body ng-switch=item.messageType><textmessage ng-switch-when=TextMessage msg=item.content></textmessage><imagemessage ng-switch-when=ImageMessage msg=item.content></imagemessage><voicemessage ng-switch-when=VoiceMessage msg=item.content></voicemessage><locationmessage ng-switch-when=LocationMessage msg=item.content></locationmessage><richcontentmessage ng-switch-when=RichContentMessage msg=item.content></richcontentmessage></div></div></div></div></div><div id=footer class=rongcloud-rong-footer style=\"display: block\"><div class=rongcloud-footer-con><div class=rongcloud-text-layout><div id=funcPanel class=\"rongcloud-funcPanel rongcloud-robotMode\"><div class=rongcloud-mode1 ng-show=\"_inputPanelState==0\"><div class=rongcloud-MessageForm-tool id=expressionWrap><i class=\"rongcloud-sprite rongcloud-iconfont-smile\" ng-click=\"showemoji=!showemoji\"></i><div class=rongcloud-expressionWrap ng-show=showemoji><i class=rongcloud-arrow></i><emoji ng-repeat=\"item in emojiList\" item=item content=conversation></emoji></div></div><div class=rongcloud-MessageForm-tool><i class=\"rongcloud-sprite rongcloud-iconfont-upload\" id=upload-file style=\"position: relative; z-index: 1\"></i></div></div><div class=rongcloud-mode2 ng-show=\"_inputPanelState==2\"><a ng-click=switchPerson() id=chatSwitch class=rongcloud-chatSwitch>转人工服务</a></div></div><pre id=inputMsg class=\"rongcloud-text rongcloud-grey\" contenteditable contenteditable-dire ng-focus=\"showemoji=fase\" style=\"background-color: rgba(0,0,0,0);color:black\" ctrl-enter-keys fun=send() ctrlenter=false placeholder=请输入文字... ondrop=\"return false\" ng-model=conversation.messageContent></pre></div><div class=rongcloud-powBox><button type=button style=\"background-color: #0099ff\" class=\"rongcloud-rong-btn rongcloud-rong-send-btn\" id=rong-sendBtn ng-click=send()>发送</button></div></div></div></div></div>"
  );


  $templateCache.put('./src/ts/conversationlist/conversationList.tpl.html',
    "<div id=rong-conversation-list class=\"rongcloud-kefuListBox rongcloud-both\"><div class=rongcloud-kefuList><div class=\"rongcloud-rong-header rongcloud-blueBg\"><div class=\"rongcloud-toolBar rongcloud-headBtn\"><div ng-show=config.voiceNotification class=rongcloud-voice ng-class=\"{'rongcloud-voice-mute':!data.voiceSound,'rongcloud-voice-sound':data.voiceSound}\" ng-click=\"data.voiceSound=!data.voiceSound\"></div><div class=\"rongcloud-sprite rongcloud-people\"></div><span class=rongcloud-recent>最近联系人</span><div class=\"rongcloud-sprite rongcloud-arrow-down\" style=\"cursor: pointer\" ng-click=minbtn()></div></div></div><div class=rongcloud-content><div class=rongcloud-netStatus ng-hide=data.connectionState><div class=rongcloud-sprite></div><span>连接断开,请刷新重连</span></div><div><conversation-item ng-repeat=\"item in conversationListServer._conversationList\" item=item></conversation-item></div></div></div></div>"
  );


  $templateCache.put('./src/ts/evaluate/evaluate.tpl.html',
    "<div class=rongcloud-layermbox ng-show=display><div class=rongcloud-laymshade></div><div class=rongcloud-layermmain><div class=rongcloud-section><div class=rongcloud-layermchild ng-show=!end><div class=rongcloud-layermcont><div class=rongcloud-type1 ng-show=\"type==1\"><h4>&nbsp;评价客服</h4><div class=rongcloud-layerPanel1><div class=rongcloud-star><span ng-repeat=\"item in stars track by $index\"><span ng-class=\"{'rongcloud-star-on':$index<data.stars,'rongcloud-star-off':$index>=data.stars}\" ng-click=confirm($index+1) ng-mouseenter=mousehover($index+1) ng-mouseleave=mousehover(0)></span></span></div></div></div><div class=rongcloud-type2 ng-show=\"type==2\"><h4>&nbsp;&nbsp;机器人是否解决了您的问题 ？</h4><div class=rongcloud-layerPanel1><a class=\"rongcloud-rong-btn rongcloud-btnY\" ng-class=\"{'rongcloud-cur':data.value===true}\" href=javascript:void(0); ng-click=confirm(true)>是</a> <a class=\"rongcloud-rong-btn rongcloud-btnN\" ng-class=\"{'rongcloud-cur':data.value===false}\" href=javascript:void(0); ng-click=confirm(false)>否</a></div></div><div class=rongcloud-layerPanel2 ng-show=displayDescribe><p>是否有以下情况 ？</p><div class=rongcloud-labels><span ng-repeat=\"item in labels\"><a class=rongcloud-rong-btn ng-class=\"{'rongcloud-cur':item.selected}\" ng-click=\"item.selected=!item.selected\" href=\"\">{{item.display}}</a></span></div><div class=rongcloud-suggestBox><textarea name=\"\" placeholder=欢迎给我们的服务提建议~ ng-model=data.describe></textarea></div><div class=rongcloud-subBox><a class=rongcloud-rong-btn href=\"\" ng-click=commit()>提交评价</a></div></div></div><div class=rongcloud-layermbtn><span ng-click=confirm()>跳过</span><span ng-click=cancle()>取消</span></div></div><div class=\"rongcloud-layermchild rongcloud-feedback\" ng-show=end><div class=rongcloud-layermcont>感谢您的反馈 ^ - ^ ！</div></div></div></div></div>"
  );


  $templateCache.put('./src/ts/main.tpl.html',
    "<div id=rong-widget-box class=rongcloud-container><div ng-show=main.display><rong-conversation></rong-conversation><rong-conversation-list></rong-conversation-list></div><div id=rong-widget-minbtn class=\"rongcloud-kefuBtnBox rongcloud-blueBg\" ng-show=!main.display&&config.displayMinButton ng-click=showbtn()><a class=rongcloud-kefuBtn href=\"javascript: void(0);\"><div class=\"rongcloud-sprite rongcloud-people\"></div><span class=rongcloud-recent ng-show=\"!data.totalUnreadCount||data.totalUnreadCount==0\">{{config.reminder||\"最近联系人\"}}</span> <span class=rongcloud-recent ng-show=\"data.totalUnreadCount>0\"><span ng-show=twinkle>(有未读消息)</span></span></a></div><div id=rong-widget-minbtn-kefu class=\"rongcloud-kefuBtnBox rongcloud-blueBg\" ng-show=!main.display&&config.displayMinButton ng-click=showbtn()><a class=rongcloud-kefuBtn href=\"javascript: void(0);\"><div class=\"rongcloud-sprite rongcloud-people rongcloud-sprite-kefu\"></div><span class=rongcloud-recent>{{config.reminder||\"联系客服\"}}</span></a></div><audio id=rongcloud-playsound style=\"width: 0px;height: 0px;display: none\" src=\"\" controls></audio></div>"
  );

}]);

/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */
(function(e,t){typeof module!="undefined"&&module.exports?module.exports=t():typeof define=="function"&&define.amd?define(t):this[e]=t()})("$script",function(){function p(e,t){for(var n=0,i=e.length;n<i;++n)if(!t(e[n]))return r;return 1}function d(e,t){p(e,function(e){return!t(e)})}function v(e,t,n){function g(e){return e.call?e():u[e]}function y(){if(!--h){u[o]=1,s&&s();for(var e in f)p(e.split("|"),g)&&!d(f[e],g)&&(f[e]=[])}}e=e[i]?e:[e];var r=t&&t.call,s=r?t:n,o=r?e.join(""):t,h=e.length;return setTimeout(function(){d(e,function t(e,n){if(e===null)return y();!n&&!/^https?:\/\//.test(e)&&c&&(e=e.indexOf(".js")===-1?c+e+".js":c+e);if(l[e])return o&&(a[o]=1),l[e]==2?y():setTimeout(function(){t(e,!0)},0);l[e]=1,o&&(a[o]=1),m(e,y)})},0),v}function m(n,r){var i=e.createElement("script"),u;i.onload=i.onerror=i[o]=function(){if(i[s]&&!/^c|loade/.test(i[s])||u)return;i.onload=i[o]=null,u=1,l[n]=2,r()},i.async=1,i.src=h?n+(n.indexOf("?")===-1?"?":"&")+h:n,t.insertBefore(i,t.lastChild)}var e=document,t=e.getElementsByTagName("head")[0],n="string",r=!1,i="push",s="readyState",o="onreadystatechange",u={},a={},f={},l={},c,h;return v.get=m,v.order=function(e,t,n){(function r(i){i=e.shift(),e.length?v(i,r):v(i,t,n)})()},v.path=function(e){c=e},v.urlArgs=function(e){h=e},v.ready=function(e,t,n){e=e[i]?e:[e];var r=[];return!d(e,function(e){u[e]||r[i](e)})&&p(e,function(e){return u[e]})?t():!function(e){f[e]=f[e]||[],f[e][i](t),n&&n(r)}(e.join("|")),v},v.done=function(e){v([null],e)},v})

/*global plupload ,mOxie*/
/*global ActiveXObject */
/*exported Qiniu */
/*exported QiniuJsSDK */

function QiniuJsSDK() {
  var qiniuUploadUrl;
  if (window.location.protocol === 'https:') {
    qiniuUploadUrl = 'https://up.qbox.me';
  } else {
    qiniuUploadUrl = 'http://upload.qiniu.com';
  }

  this.detectIEVersion = function() {
    var v = 4,
      div = document.createElement('div'),
      all = div.getElementsByTagName('i');
    while (
      div.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->',
      all[0]
    ) {
      v++;
    }
    return v > 4 ? v : false;
  };

  this.isImage = function(url) {
    var res, suffix = "";
    var imageSuffixes = ["png", "jpg", "jpeg", "gif", "bmp"];
    var suffixMatch = /\.([a-zA-Z0-9]+)(\?|\@|$)/;

    if (!url || !suffixMatch.test(url)) {
      return false;
    }
    res = suffixMatch.exec(url);
    suffix = res[1].toLowerCase();
    for (var i = 0, l = imageSuffixes.length; i < l; i++) {
      if (suffix === imageSuffixes[i]) {
        return true;
      }
    }
    return false;
  };

  this.getFileExtension = function(filename) {
    var tempArr = filename.split(".");
    var ext;
    if (tempArr.length === 1 || (tempArr[0] === "" && tempArr.length === 2)) {
      ext = "";
    } else {
      ext = tempArr.pop().toLowerCase(); //get the extension and make it lower-case
    }
    return ext;
  };

  this.utf8_encode = function(argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // +   improved by: kirilloid
    // +   bugfixed by: kirilloid
    // *     example 1: this.utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
      return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var utftext = '',
      start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
      var c1 = string.charCodeAt(n);
      var enc = null;

      if (c1 < 128) {
        end++;
      } else if (c1 > 127 && c1 < 2048) {
        enc = String.fromCharCode(
          (c1 >> 6) | 192, (c1 & 63) | 128
        );
      } else if (c1 & 0xF800 ^ 0xD800 > 0) {
        enc = String.fromCharCode(
          (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
        );
      } else { // surrogate pairs
        if (c1 & 0xFC00 ^ 0xD800 > 0) {
          throw new RangeError('Unmatched trail surrogate at ' + n);
        }
        var c2 = string.charCodeAt(++n);
        if (c2 & 0xFC00 ^ 0xDC00 > 0) {
          throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
        }
        c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
        enc = String.fromCharCode(
          (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (
            c1 & 63) | 128
        );
      }
      if (enc !== null) {
        if (end > start) {
          utftext += string.slice(start, end);
        }
        utftext += enc;
        start = end = n + 1;
      }
    }

    if (end > start) {
      utftext += string.slice(start, stringl);
    }

    return utftext;
  };

  this.base64_encode = function(data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: this.utf8_encode
    // *     example 1: this.base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
      ac = 0,
      enc = '',
      tmp_arr = [];

    if (!data) {
      return data;
    }

    data = this.utf8_encode(data + '');

    do { // pack three octets into four hexets
      o1 = data.charCodeAt(i++);
      o2 = data.charCodeAt(i++);
      o3 = data.charCodeAt(i++);

      bits = o1 << 16 | o2 << 8 | o3;

      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;

      // use hexets to index into b64, and append result to encoded string
      tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(
        h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
      case 1:
        enc = enc.slice(0, -2) + '==';
        break;
      case 2:
        enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
  };

  this.URLSafeBase64Encode = function(v) {
    v = this.base64_encode(v);
    return v.replace(/\//g, '_').replace(/\+/g, '-');
  };

  this.createAjax = function(argument) {
    var xmlhttp = {};
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
  };

  this.parseJSON = function(data) {
    // Attempt to parse using the native JSON parser first
    if (window.JSON && window.JSON.parse) {
      return window.JSON.parse(data);
    }

    if (data === null) {
      return data;
    }
    if (typeof data === "string") {

      // Make sure leading/trailing whitespace is removed (IE can't handle it)
      data = this.trim(data);

      if (data) {
        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        if (/^[\],:{}\s]*$/.test(data.replace(
            /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, "@").replace(
            /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
            "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {

          return (function() {
            return data;
          })();
        }
      }
    }
  };

  this.trim = function(text) {
    return text === null ? "" : text.replace(/^\s+|\s+$/g, '');
  };

  //Todo ie7 handler / this.parseJSON bug;

  var that = this;

  this.uploader = function(op) {
    if (!op.domain) {
      throw 'uptoken_url or domain is required!';
    }

    if (!op.browse_button) {
      throw 'browse_button is required!';
    }

    var option = {};

    var _Error_Handler = op.init && op.init.Error;
    var _FileUploaded_Handler = op.init && op.init.FileUploaded;

    op.init.Error = function() {};
    op.init.FileUploaded = function() {};

    that.uptoken_url = op.uptoken_url;
    that.token = '';
    that.key_handler = typeof op.init.Key === 'function' ? op.init.Key : '';
    this.domain = op.domain;
    var ctx = '';
    var speedCalInfo = {
      isResumeUpload: false,
      resumeFilesize: 0,
      startTime: '',
      currentTime: ''
    };

    var reset_chunk_size = function() {
      var ie = that.detectIEVersion();
      var BLOCK_BITS, MAX_CHUNK_SIZE, chunk_size;
      var isSpecialSafari = (mOxie.Env.browser === "Safari" && mOxie.Env.version <=
          5 && mOxie.Env.os === "Windows" && mOxie.Env.osVersion === "7") ||
        (mOxie.Env.browser === "Safari" && mOxie.Env.os === "iOS" && mOxie.Env
          .osVersion === "7");
      if (ie && ie <= 9 && op.chunk_size && op.runtimes.indexOf('flash') >=
        0) {
        //  link: http://www.plupload.com/docs/Frequently-Asked-Questions#when-to-use-chunking-and-when-not
        //  when plupload chunk_size setting is't null ,it cause bug in ie8/9  which runs  flash runtimes (not support html5) .
        op.chunk_size = 0;

      } else if (isSpecialSafari) {
        // win7 safari / iOS7 safari have bug when in chunk upload mode
        // reset chunk_size to 0
        // disable chunk in special version safari
        op.chunk_size = 0;
      } else {
        BLOCK_BITS = 20;
        MAX_CHUNK_SIZE = 4 << BLOCK_BITS; //4M

        chunk_size = plupload.parseSize(op.chunk_size);
        if (chunk_size > MAX_CHUNK_SIZE) {
          op.chunk_size = MAX_CHUNK_SIZE;
        }
        // qiniu service  max_chunk_size is 4m
        // reset chunk_size to max_chunk_size(4m) when chunk_size > 4m
      }
    };
    reset_chunk_size();

    var getUpToken = function() {
      if (!op.uptoken) {
        var ajax = that.createAjax();
        ajax.open('GET', that.uptoken_url, true);
        // ajax.setRequestHeader("If-Modified-Since", "0");
        ajax.onreadystatechange = function() {
          if (ajax.readyState === 4 && ajax.status === 200) {
            var res = that.parseJSON(ajax.responseText);
            that.token = res.uptoken;
          }
        };
        ajax.send();
      } else {
        that.token = op.uptoken;
      }
    };

    var getFileKey = function(up, file, func) {
      var key = '',
        unique_names = false;
      if (!op.save_key) {
        unique_names = up.getOption && up.getOption('unique_names');
        unique_names = unique_names || (up.settings && up.settings.unique_names);
        if (unique_names) {
          var ext = that.getFileExtension(file.name);
          key = ext ? file.id + '.' + ext : file.id;
        } else if (typeof func === 'function') {
          key = func(up, file);
        } else {
          key = file.name;
        }
      }
      return key;
    };

    plupload.extend(option, op, {
      url: qiniuUploadUrl,
      multipart_params: {
        token: ''
      }
    });

    var uploader = new plupload.Uploader(option);

    uploader.bind('Init', function(up, params) {
      getUpToken();
    });
    uploader.init();

    uploader.bind('FilesAdded', function(up, files) {
      var auto_start = up.getOption && up.getOption('auto_start');
      auto_start = auto_start || (up.settings && up.settings.auto_start);
      if (auto_start) {
        plupload.each(files, function(i, file) {
          up.start();
        });
      }
      up.refresh(); // Reposition Flash/Silverlight
    });

    uploader.bind('BeforeUpload', function(up, file) {
      file.speed = file.speed || 0; // add a key named speed for file obj
      ctx = '';

      if (op.get_new_uptoken) {
        getUpToken();
      }

      var directUpload = function(up, file, func) {
        speedCalInfo.startTime = new Date().getTime();
        var multipart_params_obj;
        if (op.save_key) {
          multipart_params_obj = {
            'token': that.token
          };
        } else {
          multipart_params_obj = {
            'key': getFileKey(up, file, func),
            'token': that.token
          };
        }

        var x_vars = op.x_vars;
        if (x_vars !== undefined && typeof x_vars === 'object') {
          for (var x_key in x_vars) {
            if (x_vars.hasOwnProperty(x_key)) {
              if (typeof x_vars[x_key] === 'function') {
                multipart_params_obj['x:' + x_key] = x_vars[x_key](up,
                  file);
              } else if (typeof x_vars[x_key] !== 'object') {
                multipart_params_obj['x:' + x_key] = x_vars[x_key];
              }
            }
          }
        }


        up.setOption({
          'url': qiniuUploadUrl,
          'multipart': true,
          'chunk_size': undefined,
          'multipart_params': multipart_params_obj
        });
      };


      var chunk_size = up.getOption && up.getOption('chunk_size');
      chunk_size = chunk_size || (up.settings && up.settings.chunk_size);
      if (uploader.runtime === 'html5' && chunk_size) {
        if (file.size < chunk_size) {
          directUpload(up, file, that.key_handler);
        } else {
          var localFileInfo = localStorage.getItem(file.name);
          var blockSize = chunk_size;
          if (localFileInfo) {
            localFileInfo = JSON.parse(localFileInfo);
            var now = (new Date()).getTime();
            var before = localFileInfo.time || 0;
            var aDay = 24 * 60 * 60 * 1000; //  milliseconds
            if (now - before < aDay) {
              if (localFileInfo.percent !== 100) {
                if (file.size === localFileInfo.total) {
                  // 通过文件名和文件大小匹配，找到对应的 localstorage 信息，恢复进度
                  file.percent = localFileInfo.percent;
                  file.loaded = localFileInfo.offset;
                  ctx = localFileInfo.ctx;

                  //  计算速度时，会用到
                  speedCalInfo.isResumeUpload = true;
                  speedCalInfo.resumeFilesize = localFileInfo.offset;
                  if (localFileInfo.offset + blockSize > file.size) {
                    blockSize = file.size - localFileInfo.offset;
                  }
                } else {
                  localStorage.removeItem(file.name);
                }

              } else {
                // 进度100%时，删除对应的localStorage，避免 499 bug
                localStorage.removeItem(file.name);
              }
            } else {
              localStorage.removeItem(file.name);
            }
          }
          speedCalInfo.startTime = new Date().getTime();
          up.setOption({
            'url': qiniuUploadUrl + '/mkblk/' + blockSize,
            'multipart': false,
            'chunk_size': chunk_size,
            'required_features': "chunks",
            'headers': {
              'Authorization': 'UpToken ' + that.token
            },
            'multipart_params': {}
          });
        }
      } else {
        directUpload(up, file, that.key_handler);
      }
    });

    uploader.bind('UploadProgress', function(up, file) {
      // 计算速度

      speedCalInfo.currentTime = new Date().getTime();
      var timeUsed = speedCalInfo.currentTime - speedCalInfo.startTime; // ms
      var fileUploaded = file.loaded || 0;
      if (speedCalInfo.isResumeUpload) {
        fileUploaded = file.loaded - speedCalInfo.resumeFilesize;
      }
      file.speed = (fileUploaded / timeUsed * 1000).toFixed(0) || 0; // unit: byte/s
    });

    uploader.bind('ChunkUploaded', function(up, file, info) {
      var res = that.parseJSON(info.response);

      ctx = ctx ? ctx + ',' + res.ctx : res.ctx;
      var leftSize = info.total - info.offset;
      var chunk_size = up.getOption && up.getOption('chunk_size');
      chunk_size = chunk_size || (up.settings && up.settings.chunk_size);
      if (leftSize < chunk_size) {
        up.setOption({
          'url': qiniuUploadUrl + '/mkblk/' + leftSize
        });
      }
      localStorage.setItem(file.name, JSON.stringify({
        ctx: ctx,
        percent: file.percent,
        total: info.total,
        offset: info.offset,
        time: (new Date()).getTime()
      }));
    });

    uploader.bind('Error', (function(_Error_Handler) {
      return function(up, err) {
        var errTip = '';
        var file = err.file;
        if (file) {
          switch (err.code) {
            case plupload.FAILED:
              errTip = '上传失败。请稍后再试。';
              break;
            case plupload.FILE_SIZE_ERROR:
              var max_file_size = up.getOption && up.getOption(
                'max_file_size');
              max_file_size = max_file_size || (up.settings && up.settings
                .max_file_size);
              errTip = '浏览器最大可上传' + max_file_size + '。更大文件请使用命令行工具。';
              break;
            case plupload.FILE_EXTENSION_ERROR:
              errTip = '文件验证失败。请稍后重试。';
              break;
            case plupload.HTTP_ERROR:
              if (err.response === '') {
                // Fix parseJSON error ,when http error is like net::ERR_ADDRESS_UNREACHABLE
                errTip = err.message || '未知网络错误。';
                break;
              }
              var errorObj = that.parseJSON(err.response);
              var errorText = errorObj.error;
              switch (err.status) {
                case 400:
                  errTip = "请求报文格式错误。";
                  break;
                case 401:
                  errTip = "客户端认证授权失败。请重试或提交反馈。";
                  break;
                case 405:
                  errTip = "客户端请求错误。请重试或提交反馈。";
                  break;
                case 579:
                  errTip = "资源上传成功，但回调失败。";
                  break;
                case 599:
                  errTip = "网络连接异常。请重试或提交反馈。";
                  break;
                case 614:
                  errTip = "文件已存在。";
                  try {
                    errorObj = that.parseJSON(errorObj.error);
                    errorText = errorObj.error || 'file exists';
                  } catch (e) {
                    errorText = errorObj.error || 'file exists';
                  }
                  break;
                case 631:
                  errTip = "指定空间不存在。";
                  break;
                case 701:
                  errTip = "上传数据块校验出错。请重试或提交反馈。";
                  break;
                default:
                  errTip = "未知错误。";
                  break;
              }
              errTip = errTip + '(' + err.status + '：' + errorText +
                ')';
              break;
            case plupload.SECURITY_ERROR:
              errTip = '安全配置错误。请联系网站管理员。';
              break;
            case plupload.GENERIC_ERROR:
              errTip = '上传失败。请稍后再试。';
              break;
            case plupload.IO_ERROR:
              errTip = '上传失败。请稍后再试。';
              break;
            case plupload.INIT_ERROR:
              errTip = '网站配置错误。请联系网站管理员。';
              uploader.destroy();
              break;
            default:
              errTip = err.message + err.details;
              break;
          }
          if (_Error_Handler) {
            _Error_Handler(up, err, errTip);
          }
        }
        up.refresh(); // Reposition Flash/Silverlight
      };
    })(_Error_Handler));

    uploader.bind('FileUploaded', (function(_FileUploaded_Handler) {
      return function(up, file, info) {

        var last_step = function(up, file, info) {
          if (op.downtoken_url) {
            var ajax_downtoken = that.createAjax();
            ajax_downtoken.open('POST', op.downtoken_url, true);
            ajax_downtoken.setRequestHeader('Content-type',
              'application/x-www-form-urlencoded');
            ajax_downtoken.onreadystatechange = function() {
              if (ajax_downtoken.readyState === 4) {
                if (ajax_downtoken.status === 200) {
                  var res_downtoken;
                  try {
                    res_downtoken = that.parseJSON(ajax_downtoken
                      .responseText);
                  } catch (e) {
                    throw ('invalid json format');
                  }
                  var info_extended = {};
                  plupload.extend(info_extended, that.parseJSON(
                    info), res_downtoken);
                  if (_FileUploaded_Handler) {
                    _FileUploaded_Handler(up, file, JSON.stringify(
                      info_extended));
                  }
                } else {
                  uploader.trigger('Error', {
                    status: ajax_downtoken.status,
                    response: ajax_downtoken.responseText,
                    file: file,
                    code: plupload.HTTP_ERROR
                  });
                }
              }
            };
            ajax_downtoken.send('key=' + that.parseJSON(info).key +
              '&domain=' + op.domain);
          } else if (_FileUploaded_Handler) {
            _FileUploaded_Handler(up, file, info);
          }
        };
        info.response=info.response.replace(/'/g,"\"");
        var res = that.parseJSON(info.response);
        ctx = ctx ? ctx : res.ctx;
        if (ctx) {
          var key = '';
          if (!op.save_key) {
            key = getFileKey(up, file, that.key_handler);
            key = key ? '/key/' + that.URLSafeBase64Encode(key) : '';
          }

          var fname = '/fname/' + that.URLSafeBase64Encode(file.name);

          var x_vars = op.x_vars,
            x_val = '',
            x_vars_url = '';
          if (x_vars !== undefined && typeof x_vars === 'object') {
            for (var x_key in x_vars) {
              if (x_vars.hasOwnProperty(x_key)) {
                if (typeof x_vars[x_key] === 'function') {
                  x_val = that.URLSafeBase64Encode(x_vars[x_key](up,
                    file));
                } else if (typeof x_vars[x_key] !== 'object') {
                  x_val = that.URLSafeBase64Encode(x_vars[x_key]);
                }
                x_vars_url += '/x:' + x_key + '/' + x_val;
              }
            }
          }

          var url = qiniuUploadUrl + '/mkfile/' + file.size + key +
            fname + x_vars_url;
          var ajax = that.createAjax();
          ajax.open('POST', url, true);
          ajax.setRequestHeader('Content-Type',
            'text/plain;charset=UTF-8');
          ajax.setRequestHeader('Authorization', 'UpToken ' + that.token);
          ajax.onreadystatechange = function() {
            if (ajax.readyState === 4) {
              localStorage.removeItem(file.name);
              if (ajax.status === 200) {
                var info = ajax.responseText;
                last_step(up, file, info);
              } else {
                uploader.trigger('Error', {
                  status: ajax.status,
                  response: ajax.responseText,
                  file: file,
                  code: -200
                });
              }
            }
          };
          ajax.send(ctx);
        } else {
          last_step(up, file, info.response);
        }

      };
    })(_FileUploaded_Handler));

    return uploader;
  };

  this.getUrl = function(key) {
    if (!key) {
      return false;
    }
    key = encodeURI(key);
    var domain = this.domain;
    if (domain.slice(domain.length - 1) !== '/') {
      domain = domain + '/';
    }
    return domain + key;
  };

  this.imageView2 = function(op, key) {
    var mode = op.mode || '',
      w = op.w || '',
      h = op.h || '',
      q = op.q || '',
      format = op.format || '';
    if (!mode) {
      return false;
    }
    if (!w && !h) {
      return false;
    }

    var imageUrl = 'imageView2/' + mode;
    imageUrl += w ? '/w/' + w : '';
    imageUrl += h ? '/h/' + h : '';
    imageUrl += q ? '/q/' + q : '';
    imageUrl += format ? '/format/' + format : '';
    if (key) {
      imageUrl = this.getUrl(key) + '?' + imageUrl;
    }
    return imageUrl;
  };


  this.imageMogr2 = function(op, key) {
    var auto_orient = op['auto-orient'] || '',
      thumbnail = op.thumbnail || '',
      strip = op.strip || '',
      gravity = op.gravity || '',
      crop = op.crop || '',
      quality = op.quality || '',
      rotate = op.rotate || '',
      format = op.format || '',
      blur = op.blur || '';
    //Todo check option

    var imageUrl = 'imageMogr2';

    imageUrl += auto_orient ? '/auto-orient' : '';
    imageUrl += thumbnail ? '/thumbnail/' + thumbnail : '';
    imageUrl += strip ? '/strip' : '';
    imageUrl += gravity ? '/gravity/' + gravity : '';
    imageUrl += quality ? '/quality/' + quality : '';
    imageUrl += crop ? '/crop/' + crop : '';
    imageUrl += rotate ? '/rotate/' + rotate : '';
    imageUrl += format ? '/format/' + format : '';
    imageUrl += blur ? '/blur/' + blur : '';

    if (key) {
      imageUrl = this.getUrl(key) + '?' + imageUrl;
    }
    return imageUrl;
  };

  this.watermark = function(op, key) {

    var mode = op.mode;
    if (!mode) {
      return false;
    }

    var imageUrl = 'watermark/' + mode;

    if (mode === 1) {
      var image = op.image || '';
      if (!image) {
        return false;
      }
      imageUrl += image ? '/image/' + this.URLSafeBase64Encode(image) : '';
    } else if (mode === 2) {
      var text = op.text ? op.text : '',
        font = op.font ? op.font : '',
        fontsize = op.fontsize ? op.fontsize : '',
        fill = op.fill ? op.fill : '';
      if (!text) {
        return false;
      }
      imageUrl += text ? '/text/' + this.URLSafeBase64Encode(text) : '';
      imageUrl += font ? '/font/' + this.URLSafeBase64Encode(font) : '';
      imageUrl += fontsize ? '/fontsize/' + fontsize : '';
      imageUrl += fill ? '/fill/' + this.URLSafeBase64Encode(fill) : '';
    } else {
      // Todo mode3
      return false;
    }

    var dissolve = op.dissolve || '',
      gravity = op.gravity || '',
      dx = op.dx || '',
      dy = op.dy || '';

    imageUrl += dissolve ? '/dissolve/' + dissolve : '';
    imageUrl += gravity ? '/gravity/' + gravity : '';
    imageUrl += dx ? '/dx/' + dx : '';
    imageUrl += dy ? '/dy/' + dy : '';

    if (key) {
      imageUrl = this.getUrl(key) + '?' + imageUrl;
    }
    return imageUrl;

  };

  this.imageInfo = function(key) {
    if (!key) {
      return false;
    }
    var url = this.getUrl(key) + '?imageInfo';
    var xhr = this.createAjax();
    var info;
    var that = this;
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        info = that.parseJSON(xhr.responseText);
      }
    };
    xhr.send();
    return info;
  };


  this.exif = function(key) {
    if (!key) {
      return false;
    }
    var url = this.getUrl(key) + '?exif';
    var xhr = this.createAjax();
    var info;
    var that = this;
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        info = that.parseJSON(xhr.responseText);
      }
    };
    xhr.send();
    return info;
  };

  this.get = function(type, key) {
    if (!key || !type) {
      return false;
    }
    if (type === 'exif') {
      return this.exif(key);
    } else if (type === 'imageInfo') {
      return this.imageInfo(key);
    }
    return false;
  };


  this.pipeline = function(arr, key) {

    var isArray = Object.prototype.toString.call(arr) === '[object Array]';
    var option, errOp, imageUrl = '';
    if (isArray) {
      for (var i = 0, len = arr.length; i < len; i++) {
        option = arr[i];
        if (!option.fop) {
          return false;
        }
        switch (option.fop) {
          case 'watermark':
            imageUrl += this.watermark(option) + '|';
            break;
          case 'imageView2':
            imageUrl += this.imageView2(option) + '|';
            break;
          case 'imageMogr2':
            imageUrl += this.imageMogr2(option) + '|';
            break;
          default:
            errOp = true;
            break;
        }
        if (errOp) {
          return false;
        }
      }
      if (key) {
        imageUrl = this.getUrl(key) + '?' + imageUrl;
        var length = imageUrl.length;
        if (imageUrl.slice(length - 1) === '|') {
          imageUrl = imageUrl.slice(0, length - 1);
        }
      }
      return imageUrl;
    }
    return false;
  };

}

var Qiniu = new QiniuJsSDK();
