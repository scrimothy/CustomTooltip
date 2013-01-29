(function ($) {
	'use strict';
	$.fn.customTooltip = function (options) {
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend({
			'container': 'body', // parent of the tooltip (ex: body, .class, #id)
			'focus': false, // allow tooltip to show on :focus, not just :hover
			'follow': 'mouse', // 'mouse' = follow mouse x & y; 'mousex' = just follow mouse x; 'mousey' = just follow mouse y; 'none' = don't follow 
			'halign': 'right', // horizontal alignment compared to cursor.  Values: 'right' = to the right; 'center'; 'left' = to the left
			'offDelay': 0, // delay (ms) between mouseleave and tooltip off
			'offSpeed': 'fast', // fadeOut speed
			'onDelay': 400, // delay (ms) between mouseenter and tooltip on
			'onSpeed': 'fast', // fadeIn speed
			'shadow': '0px 3px 5px rgba(0, 0, 0, .5)', // style box-shadow independently
			'style': 'native', // tooltip css: set to 'native' to mimic Chrome's native tooltip
			'timeout': 6000, // timeout (ms) between mouseenter and tooltip off
			'valign': 'below', // vertical alignment compared to cursor. Values: 'above', 'center', below'
			'whiteSpace': 'normal', // set the css white-space property for word wrapping
			'xOffset': 0, // offset left from cursor
			'yOffset': 16 // offset top from cursor
		}, options),
			container = $(settings.container),
			mouseX = 0,
			mouseY = 0,
			timeout;
		return this.each(function () {
			var target = $(this),
				content = '';
			function hideTooltip(e) {
				clearTimeout(timeout);
				// remove any tooltips that are in the page but hidden
				// this will make it so the tooltip doesn't fade in/out when a user just hovers past the target 
				$('.customTooltip:hidden').remove();
				// after leaving, delay the fade out as specified and then remove from DOM
				$('.customTooltip').delay(settings.offDelay).fadeOut(settings.offSpeed, function () {
					$(this).remove();
				});
			}
			function styleTooltip() {
				// Native styling
				if (settings.style === 'native') {
					$('.customTooltip').css({
						'background': '#ffffc7',
						'border': '1px solid #d9d9d9',
						'color': '#000',
						'font': 'normal 11px Verdana, Arial, Helvetica, sans-serif',
						'opacity': '0.95',
						'padding': '.2em .4em',
						'pointer-events': 'none'
					});
				}
				// Just handle shadow styling
				$('.customTooltip').css({
					'-moz-box-shadow': settings.shadow,
					'-o-box-shadow': settings.shadow,
					'-webkit-box-shadow': settings.shadow,
					'box-shadow': settings.shadow,
					'white-space': settings.whiteSpace
				});
			}
			function placeTooltip(e) {
				// if the container is <body>, then reset offset to 0 otherwise  set to container's offset
				var offsetTop = container[0] === $('body')[0] ? 0 : container.offset().top,
					offsetLeft = container[0] === $('body')[0] ? 0 : container.offset().left,
					edge;
				if (e.type)
				mouseX = e.pageX;
				mouseY = e.pageY;
				
				$('.customTooltip').css({
					position: 'absolute'
				});

				switch (settings.halign) {
					case ('right'):
						$('.customTooltip').css('left', mouseX - offsetLeft + settings.xOffset);
						break;
					case ('center'):
						$('.customTooltip').css('left', mouseX - offsetLeft + settings.xOffset - $('.customTooltip').width() / 2);
						break;
					case ('left'):
						$('.customTooltip').css('left', mouseX - offsetLeft + settings.xOffset - $('.customTooltip').outerWidth());
						break;
					default:
						$('.customTooltip').css('left', mouseX - offsetLeft + settings.xOffset);
				}

				switch (settings.valign) {
					case ('below'):
						$('.customTooltip').css('top', mouseY - offsetTop + settings.yOffset);
						break;
					case ('center'):
						$('.customTooltip').css('top', mouseY - offsetTop + settings.yOffset - $('.customTooltip').height() / 2);
						break;
					case ('above'):
						$('.customTooltip').css('top', mouseY - offsetTop + settings.yOffset - $('.customTooltip').outerHeight());
						break;
					default:
						$('.customTooltip').css('top', mouseY - offsetTop + settings.yOffset);
				}

			}
			function showTooltip(e) {
				// add the current tooltip to the page
				container.append('<div class="customTooltip">' + content + '</div>');
				// style the tooltip after adding
				styleTooltip();
				// first hide tooltip so it can fade in
				$('.customTooltip').css({
					display: 'none'
				});
				// place it relative to the mouse
				placeTooltip(e);
				// then fade it in
				$('.customTooltip').delay(settings.onDelay).fadeIn(settings.onSpeed);
				if (settings.timeout > 0) {
					timeout = setTimeout(function () {
						hideTooltip(e);
					}, settings.timeout);
				}
			}
			function enterElem(e) {
				// if there's a title attribute, change it to a data-title attr to suppress the native tooltip
				if (target.attr('title')) {
					target.attr('data-title', target.attr('title')).attr('title', '');
				} 
				// if no title, but an alt, use the alt for the data-title
				else if (target.attr('alt')) {
					target.attr('data-title', target.attr('alt')).attr('alt', '');
				} 
				// or if there's no data-title, then turn off customTooltip
				else if (!target.attr('data-title')){
					target.off({
						'mouseenter': enterElem,
						'mousemove': placeTooltip,
						'mouseleave': hideTooltip
					});
					return;
				}
				content = target.attr('data-title');
				// remove any tooltips already on the page
				$('.customTooltip').remove();
				showTooltip(e);
			}
			// Start the machine
			$(this).on({
				'mouseenter': enterElem,
				'mousemove': placeTooltip,
				'mouseleave': hideTooltip
			});
			if (settings.focus) {
				$(this).on({
					'focus': enterElem,
					'blur': hideTooltip
				});
			}
		});
	}
}(jQuery));