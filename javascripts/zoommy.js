/* zoommy.js @VERSION Yoshimasa Niwa <niw@niw.at> */
(function() {

if((typeof Prototype == 'undefined') || (typeof Element == 'undefined') || (typeof Element.Methods == 'undefined') || !Prototype.Version.match(/^1\.6\./)) {
	throw "Missing prototype.js, please include prototype.js ver.1.6.x before including zoommy.js"
}
if(typeof Effect == 'undefined') {
	throw "Missing script.aculo.us's effect.js, please include effect.js ver.1.8.x before including zoommy.js"
}

var config = {
	baseZIndex: 900
};

function createChild(parent, tagName, func) {
	var element = $(document.createElement(tagName));
	if(func) {
		func(element)
	}
	parent.appendChild(element);
	return element;
}

function setBackgroundImage(element, url) {
	if(Prototype.Browser.IE) {
		element.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', sizingMethod='scale', src='" + url + "')";
	} else {
		element.style.backgroundImage = "url(" + url + ")"
	}
}

Effect.Resize = Class.create(Effect.Base, {
	initialize: function(element, resizeTo, options) {
		this.element = $(element);
		if (!this.element) throw(Effect._elementDoesNotExistError);
		var options = Object.extend({
			resizeFromCenter: false,
			resizeFrom: element.getDimensions(),
			resizeTo: resizeTo
		}, options || {});
		this.start(options);
	},
	setup: function() {
		this.restoreAfterFinish = this.options.restoreAfterFinish || false;
		this.elementPositioning = this.element.getStyle('position');
		this.originalStyle = {};
		['top','left','width','height'].each( function(k) {
			this.originalStyle[k] = this.element.style[k];
		}.bind(this));
		this.originalTop  = this.element.offsetTop;
		this.originalLeft = this.element.offsetLeft;
	},
	update: function(position) {
		var dim = {
			width: (this.options.resizeTo.width - this.options.resizeFrom.width) * position + this.options.resizeFrom.width,
			height: (this.options.resizeTo.height - this.options.resizeFrom.height) * position + this.options.resizeFrom.height
		};
		var d = {};
		d.width = dim.width.round() + 'px';
		d.height = dim.height.round() + 'px';
		if (this.options.resizeFromCenter) {
			var topd  = (dim.height - this.options.resizeTo.height)/2;
			var leftd = (dim.width  - this.options.resizeTo.width)/2;
			if (this.elementPositioning == 'absolute') {
				d.top = this.originalTop-topd + 'px';
				d.left = this.originalLeft-leftd + 'px';
			} else {
				d.top = -topd + 'px';
				d.left = -leftd + 'px';
			}
		}
		this.element.setStyle(d);
	},
	finish: function(position) {
		if (this.restoreAfterFinish) {
			this.element.setStyle(this.originalStyle);
		}
	}
});

var Spinner = Class.create({
	initialize: function() {
		this.tag = createChild(document.body, 'div', function(tag) {
			tag.style.position = 'absolute';
			tag.style.width = tag.style.height = '50px';
			tag.style.zIndex = config.baseZIndex;
			tag.hide();
		});
		for(var i=0; i<12; i++) {
			var img = new Image();
			img.src = config.imagesPath + '/spinner_' + (i+1) + '.png'
		}
	},
	show: function() {
		if(!this.spinning) {
			if(this.effect) {
				this.effect.cancel();
			}

			var i = 0;
			this.spinning = setInterval((function() {
				if(++i > 12) {
					i = 1;
				}
				var url = config.imagesPath + '/spinner_' + i + '.png';
				setBackgroundImage(this.tag, url);
			}).bind(this), 100);

			var tagSize = this.tag.getDimensions();
			var viewportSize = document.viewport.getDimensions();
			var offset = document.viewport.getScrollOffsets();
			this.tag.style.left = (viewportSize.width - tagSize.width)/2 + offset.left + 'px';
			this.tag.style.top = (viewportSize.height - tagSize.height)/2 + offset.top + 'px';

			if(Prototype.Browser.IE) {
				this.tag.show();
			} else {
				this.effect = Effect.Appear(this.tag, {duration: 0.5, afterFinish: (function() {
					delete this.effect;
				}).bind(this)});
			}
		}
	},
	hide: function() {
		if(this.spinning) {
			if(this.effect) {
				this.effect.cancel();
			}

			if(Prototype.Browser.IE) {
				this.tag.hide();
				clearInterval(this.spinning);
				delete this.spinning;
			} else {
				this.effect = Effect.Fade(this.tag, {duration: 0.5, afterFinish: (function() {
					clearInterval(this.spinning);
					delete this.spinning;
					delete this.effect;
				}).bind(this)});
			}
		}
	}
});

var Shadow = Class.create({
	initialize: function() {
		this.tag = createChild(document.body, 'table', (function(tag) {
			// create shadow using table tag{{{
			tag.hide();
			tag.style.position = 'absolute';
			tag.style.borderSpacing = tag.style.padding = tag.style.margin = '0';
			tag.style.borderCollapse = 'collapse';
			tag.style.zIndex = config.baseZIndex + 1;
			createChild(tag, 'tbody', (function(tag) {
				createChild(tag, 'tr', function(tag) {
					createChild(tag, 'td', function(tag) {
						tag.style.height = tag.style.width = '20px';
						tag.style.margin = tag.style.padding = '0';
						setBackgroundImage(tag, config.imagesPath + '/shadow_topleft.png');
					});
					createChild(tag, 'td', function(tag) {
						tag.style.height = '20px';
						tag.style.margin = tag.style.padding = '0';
						setBackgroundImage(tag, config.imagesPath + '/shadow_top.png');
					});
					createChild(tag, 'td', function(tag) {
						tag.style.height = tag.style.width = '20px';
						tag.style.margin = tag.style.padding = '0';
						setBackgroundImage(tag, config.imagesPath + '/shadow_topright.png');
					});
				});
				createChild(tag, 'tr', (function(tag) {
					createChild(tag, 'td', function(tag) {
						tag.style.width = '20px';
						tag.style.margin = tag.style.padding = '0';
						setBackgroundImage(tag, config.imagesPath + '/shadow_left.png');
					});
					this.centerTag = createChild(tag, 'td');
					createChild(tag, 'td', function(tag) {
						tag.style.width = '20px';
						tag.style.margin = tag.style.padding = '0';
						setBackgroundImage(tag, config.imagesPath + '/shadow_right.png');
					});
				}).bind(this));
				createChild(tag, 'tr', function(tag) {
					createChild(tag, 'td', function(tag) {
						tag.style.height = tag.style.width = '20px';
						tag.style.margin = tag.style.padding = '0';
						setBackgroundImage(tag, config.imagesPath + '/shadow_bottomleft.png');
					});
					createChild(tag, 'td', function(tag) {
						tag.style.height = '20px';
						tag.style.margin = tag.style.padding = '0';
						setBackgroundImage(tag, config.imagesPath + '/shadow_bottom.png');
					});
					createChild(tag, 'td', function(tag) {
						tag.style.height = tag.style.width = '20px';
						tag.style.margin = tag.style.padding = '0';
						setBackgroundImage(tag, config.imagesPath + '/shadow_bottomright.png');
					});
				});
			}).bind(this));
			//}}}
		}).bind(this));
	},
	show: function(element) {
		element.style.zIndex = config.baseZIndex + 2;
		this.tag.clonePosition(element, {offsetTop: -10, offsetLeft: -10, setWidth: false, setHeight: false});
		this.tag.style.width = element.getWidth() + 20 + 'px';
		this.tag.style.height = element.getHeight() + 20 + 'px';
		if(Prototype.Browser.IE) {
			this.centerTag.style.width = element.getWidth() - 40 + 'px';
			this.centerTag.style.height = element.getHeight() - 40 + 'px';
			this.tag.show();
		} else {
			Effect.Appear(this.tag, {duration: 0.3});
		}
	},
	hide: function() {
		this.tag.hide();
	}
});

var CloseButton = Class.create({
	initialize: function(options) {
		this.options = options;
		this.tag = createChild(document.body, 'div', function(tag) {
			tag.hide();
			tag.style.position = 'absolute';
			tag.style.width = '30px';
			tag.style.height = '30px';
			tag.style.zIndex = config.baseZIndex + 3;
			tag.style.cursor = Prototype.Browser.IE ? 'hand' : 'pointer';
			setBackgroundImage(tag, config.imagesPath + '/close_button.png');
		});
		Event.observe(this.tag, 'click', (function(event) {
			if(this.options.onClick) {
				this.options.onClick(event);
			}
		}).bind(this));
	},
	show: function(element) {
		this.tag.clonePosition(element, {offsetTop: -14, offsetLeft: -14, setWidth: false, setHeight: false});
		if(Prototype.Browser.IE) {
			this.tag.show();
		} else {
			Effect.Appear(this.tag, {duration: 0.3});
		}
	},
	hide: function() {
		this.tag.hide();
	}
});

var Navigator = Class.create({
	initialize: function(options) {
		this.options = options || {};
		this.tag = createChild(document.body, 'table', (function(tag) {
			// create navigator using table tag{{{
			tag.hide();
			tag.style.position = 'absolute';
			tag.style.borderSpacing = tag.style.padding = tag.style.margin = '0';
			tag.style.borderCollapse = 'collapse';
			tag.style.zIndex = config.baseZIndex + 4;
			tag.style.color = '#fff';
			tag.style.textShadow = '#222 0 -1px 0';
			createChild(tag, 'tbody', (function(tag) {
				createChild(tag, 'tr', (function(tag) {
					createChild(tag, 'td', (function(tag) {
						tag.style.height = tag.style.width = '30px';
						tag.style.margin = tag.style.padding = '0';
						this.prev_tag = createChild(tag, 'div', (function(tag) {
							tag.hide();
							tag.style.height = tag.style.width = '30px';
							tag.style.cursor = Prototype.Browser.IE ? 'hand' : 'pointer';
							setBackgroundImage(tag, config.imagesPath + '/navigator_prev.png');
							Event.observe(tag, 'click', (function(event) {
								if(this.options.onPrev) {
									this.options.onPrev(event);
								}
							}).bind(this));
						}).bind(this));
					}).bind(this));
					createChild(tag, 'td',  (function(tag) {
						tag.style.minWidth = '30px';
						this.caption_tag = createChild(tag, 'table', (function(tag) {
							// create caption tags using table tag{{{
							tag.style.borderSpacing = tag.style.padding = tag.style.margin = '0';
							tag.style.borderCollapse = 'collapse';
							createChild(tag, 'tbody', (function(tag) {
								createChild(tag, 'tr', (function(tag) {
									createChild(tag, 'td', function(tag) {
										tag.style.height = tag.style.width = '30px';
										tag.style.margin = tag.style.padding = '0';
										setBackgroundImage(tag, config.imagesPath + '/caption_left.png');
									});
									this.caption_center_tag = createChild(tag, 'td', function(tag) {
										tag.style.margin = tag.style.padding = '0';
										setBackgroundImage(tag, config.imagesPath + '/caption_center.png');
									});
									createChild(tag, 'td', function(tag) {
										tag.style.height = tag.style.width = '30px';
										tag.style.margin = tag.style.padding = '0';
										setBackgroundImage(tag, config.imagesPath + '/caption_right.png');
									});
								}).bind(this));
							}).bind(this));
							// }}}
						}).bind(this));
					}).bind(this));
					createChild(tag, 'td', (function(tag) {
						tag.style.height = tag.style.width = '30px';
						tag.style.margin = tag.style.padding = '0';
						this.next_tag = createChild(tag, 'div', (function(tag) {
							tag.hide();
							tag.style.height = tag.style.width = '30px';
							tag.style.cursor = Prototype.Browser.IE ? 'hand' : 'pointer';
							setBackgroundImage(tag, config.imagesPath + '/navigator_next.png');
							Event.observe(tag, 'click', (function(event) {
								if(this.options.onNext) {
									this.options.onNext(event);
								}
							}).bind(this));
						}).bind(this));
					}).bind(this));
				}).bind(this));
			}).bind(this));
			// }}}
		}).bind(this));
	},
	enablePrev: function() {
		this.prev_tag.show();
	},
	disablePrev: function() {
		this.prev_tag.hide();
	},
	enableNext: function() {
		this.next_tag.show();
	},
	disableNext: function() {
		this.next_tag.hide();
	},
	show: function(canvas, title) {
		if(title) {
			this.caption_center_tag.innerHTML = title;
			this.caption_tag.show();
		} else {
			this.caption_tag.hide();
		}
		this.tag.clonePosition(canvas, {offsetTop: canvas.getHeight() + 20, offsetLeft: (canvas.getWidth() - this.tag.getWidth()) / 2, setWidth: false, setHeight: false});
		//this.tag.clonePosition(canvas, {offsetTop: canvas.getHeight() - 50, offsetLeft: (canvas.getWidth() - this.tag.getWidth()) / 2, setWidth: false, setHeight: false});
		if(Prototype.Browser.IE) {
			this.tag.show();
		} else {
			Effect.Appear(this.tag, {duration: 0.3});
		}
	},
	hide: function() {
		this.tag.hide();
	}
});

var Zoommy = Class.create({
	initialize: function() {
		this.spinner = new Spinner();
		this.shadow = new Shadow();
		this.closeButton = new CloseButton({
			onClick: (function(event) {
				this.close();
			}).bind(this)
		});
		this.navigator = new Navigator({
			onPrev: (function(event) {
				this.prev();
			}).bind(this),
			onNext: (function(event) {
				this.next();
			}).bind(this)
		});
		Event.observe(document, 'keydown', (function(event) {
			switch(event.keyCode) {
			case 27: // ESC Key
				this.close();
				break;
			case 37: // Left Key
			//case 38: // Up Key
				this.prev();
				break
			case 39: // Right Key
			//case 40: // Down Key
				this.next();
				break
			}
		}).bind(this));
		this.canvas = createChild(document.body, 'img', function(tag) {
			tag.hide();
			tag.style.background = '#fff';
			tag.style.padding = '10px';
			tag.style.position = 'absolute';
		});
		this.register(document);
	},
	register: function(element) {
		var link_tails = {};
		$A(element.getElementsByTagName('a')).each((function(tag) {
			var href = tag.getAttribute('href');
			var rel = tag.getAttribute('rel');
			if(href && href.match(/\.(jpg|jpeg|gif|png)$/i) && rel != 'nozoommy') {
				tag.onclick = (function(event) {
					this.zoom(tag);
					return false;
				}).bind(this);
				if(rel) {
					var match = rel.match(/^zoommy\[([^\]]+)\]/);
					if(match) {
						var last = link_tails[match[1]];
						if(last) {
							last.zoommy_next_tag = tag;
							tag.zoommy_prev_tag = last;
						}
						link_tails[match[1]] = tag;
					}
				}
				var thumbnail_tag = $A(tag.getElementsByTagName('img')).first();
				if(thumbnail_tag && !config.noBadge) {
					createChild(tag, 'div', function(tag) {
						tag.setStyle({
							width: '20px',
							height: '20px',
							position: 'absolute'
						});
						tag.clonePosition(thumbnail_tag, {offsetTop: -10, offsetLeft: -10, setWidth: false, setHeight: false});
						setBackgroundImage(tag, config.imagesPath + '/badge.png');
					});
				}
			}
		}).bind(this));
	},
	/* Sequence of zoom() through close() and Status of Flags {{{
	 *
	 * Flags              visible thumbnail_tag image
	 *                            anchor_tag
	 * ------------------ ------- ------------- ---------------------
     *   ready            -       -             -
	 * zoom()             -       -             set
	 *   loading image    -       -             |
	 * image.onload       -       set           delete if image.abort
	 *   running effect   -       |             |
	 * Effect#afterFinish set     |             :
     *   ready            |       |             delete by gc
	 * close()            |       |
	 *   running effect   |       |
	 * Effect#afterFinish delete  delete
	 * }}} */
	zoom: function(tag, options) {
		var options = options || {};
		if(this.thumbnail_tag) {
			return;
		}
		if(this.image) {
			this.image.abort = true;
		}
		this.spinner.show();

		this.image = new Image();
		var image = this.image;
		image.onload = (function() {
			this.spinner.hide();
			if(image.abort) {
				return false;
			}

			this.anchor_tag = tag;
			this.thumbnail_tag = $A(tag.getElementsByTagName('img')).first() || tag;
			this.canvas.clonePosition(this.thumbnail_tag);
			this.canvas.originalPosition = {top: parseInt(this.canvas.style.top), left: parseInt(this.canvas.style.left)};
			this.canvas.setAttribute('src', tag.getAttribute('href'));

			var d = document.viewport.getDimensions();
			var offset = document.viewport.getScrollOffsets();
			new Effect.Parallel([
				new Effect.Opacity(this.canvas, {
					from: 0.0,
					to: 1.0,
					sync: true, transition: Effect.Transitions.sinoidal
				}),
				new Effect.Resize(this.canvas, image, {
					sync: true, transition: Effect.Transitions.sinoidal
				}),
				new Effect.Move(this.canvas, {
					x: (d.width - image.width)/2 + offset.left,
					y: (d.height - image.height)/2 + offset.top,
					mode: 'absolute',
					sync: true, transition: Effect.Transitions.sinoidal
				})
			], {
				beforeStart: (function() {
					this.canvas.setOpacity(0.0);
					this.canvas.show();
				}).bind(this),
				afterFinish: (function() {
					this.shadow.show(this.canvas);
					this.closeButton.show(this.canvas);
					if(tag.zoommy_prev_tag) {
						this.navigator.enablePrev();
					} else {
						this.navigator.disablePrev();
					}
					if(tag.zoommy_next_tag) {
						this.navigator.enableNext();
					} else {
						this.navigator.disableNext();
					}
					this.navigator.show(this.canvas, tag.getAttribute('title'));
					this.visible = true;
					if(options.afterFinish) {
						options.afterFinish();
					}
				}).bind(this),
				duration: 0.5
			});
		}).bind(this);
		image.src = tag.getAttribute('href');
	},
	close: function(options) {
		var options = options || {};
		if(!this.visible) {
			if(this.image && !this.thumbnail_tag) {
				this.spinner.hide();
				this.image.abort = true;
			}
			return;
		}
		this.navigator.hide();
		this.closeButton.hide();
		this.shadow.hide();
		var afterFinish = (function() {
			this.canvas.hide();
			delete this.thumbnail_tag;
			delete this.anchor_tag;
			this.visible = false;
			if(options.afterFinish) {
				options.afterFinish();
			}
		}).bind(this);
		if(options.immediate) {
			new Effect.Opacity(this.canvas, {
				from: 1.0,
				to: 0.0,
				transition: Effect.Transitions.sinoidal,
				duration: 0.1,
				afterFinish: afterFinish
			});
		} else {
			/* //Alternative animation {{{
			new Effect.Scale(this.canvas, 200 window.opera ? 1 : 0, {
				beforeSetup: function(effect) {
					effect.element.makeClipping();
				},
				afterFinishInternal: (function(effect) {
					effect.element.hide().undoClipping();
					this.canvas.hide();
					delete this.thumbnail_tag;
				}).bind(this),
				afterFinish: afterFinish,
				transition: Effect.Transitions.sinoidal,
				duration: 0.2
			});
			// }}} */
			new Effect.Parallel([
				new Effect.Opacity(this.canvas, {
					from: 1.0,
					to: 0.0,
					sync: true, transition: Effect.Transitions.sinoidal
				}),
				new Effect.Resize(this.canvas, this.thumbnail_tag.getDimensions(), {
					sync: true, transition: Effect.Transitions.sinoidal
				}),
				new Effect.Move(this.canvas, {
					x: this.canvas.originalPosition.left,
					y: this.canvas.originalPosition.top,
					mode: 'absolute',
					sync: true, transition: Effect.Transitions.sinoidal
				})
			], {
				afterFinish: afterFinish,
				duration: 0.3
			});
		}
	},
	prev: function() {
		if(this.visible) {
			this.change(this.anchor_tag.zoommy_prev_tag);
		}
	},
	next: function() {
		if(this.visible) {
			this.change(this.anchor_tag.zoommy_next_tag);
		}
	},
	change: function(tag, options) {
		if(!tag || !this.visible) {
			return;
		}
		this.close({
			immediate: true,
			afterFinish: (function() {
				this.zoom(tag, options);
			}).bind(this)
		});
	}
});

Event.observe(window, 'load', (function() {
	config = $H(config).merge(window.zoommy_config || {}).toObject();
	if(! config.imagesPath) {
		var tag = $A(document.getElementsByTagName("script")).find(function(tag) {
			return (tag.src && tag.src.match(/zoommy\.js(\?.*)?$/));
		});
		if(tag) {
			config.imagesPath = tag.src.replace(/zoommy\.js(\?.*)?$/, '../images/zoommy');
		}
	}
	var zoommy = new Zoommy();
}).bind(this));
})();

// vim:foldmethod=marker
