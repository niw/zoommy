(function() {
var config = $H({
	imagesPath: "images/zoommy",
	baseZIndex: 900,
}).merge(window.zoommy_config || {}).toObject();

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
		d.height = dim.height.round() + 'px'
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
			tag.hide();
			tag.style.position = 'absolute';
			tag.style.borderSpacing = tag.style.padding = tag.style.margin = '0';
			tag.style.borderCollapse = 'collapse';
			tag.style.zIndex = config.baseZIndex + 1;
			createChild(tag, 'tbody', (function(tag) {
				// create shadow using table tag{{{
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
				//}}}
			}).bind(this));
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

var Zoommy = Class.create({
	initialize: function() {
		this.spinner = new Spinner();
		this.shadow = new Shadow();
		this.closeButton = new CloseButton({
			onClick: (function(event) {
				this.close();
			}).bind(this)
		});
		Event.observe(document, 'keydown', (function(event) {
			if(event.keyCode == 27) {
				this.close();
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
		$A(element.getElementsByTagName('a')).each((function(tag) {
			var href = tag.getAttribute('href');
			if(href && href.match(/\.(jpg|jpeg|gif|png)$/i) && tag.getAttribute('rel') != 'nozoommy') {
				tag.onclick = (function(event) {
					this.zoom(tag);
					return false;
				}).bind(this);
			}
		}).bind(this));
	},
	zoom: function(tag) {
		if(this.target) {
			return;
		}
		if(this.image) {
			this.image.abort = true;
		}
		this.spinner.show();

		this.image = new Image();
		var image = this.image;
		image.onload = (function() {
			if(image.abort) {
				return false;
			}
			this.spinner.hide();

			this.target = $($A(tag.getElementsByTagName('img')).first()) || tag;
			this.canvas.clonePosition(this.target);
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
					this.visible = true;
				}).bind(this),
				duration: 0.5
			});
		}).bind(this);
		image.src = tag.getAttribute('href');
	},
	close: function() {
		if(!this.target || !this.visible) {
			return;
		}
		this.closeButton.hide();
		this.shadow.hide();
/*Alternative animation {{{
		new Effect.Scale(this.canvas, window.opera ? 1 : 0, { 
			beforeSetup: function(effect) {
				effect.element.makeClipping(); 
			},  
			afterFinishInternal: (function(effect) {
				effect.element.hide().undoClipping(); 
				this.canvas.hide();
				delete this.target;
			}).bind(this),
			transition: Effect.Transitions.sinoidal,
			duration: 0.3
		});
}}}*/
		new Effect.Parallel([
			new Effect.Opacity(this.canvas, {
				from: 1.0,
				to: 0.0,
				sync: true, transition: Effect.Transitions.sinoidal
			}),
			new Effect.Resize(this.canvas, this.target.getDimensions(), {
				sync: true, transition: Effect.Transitions.sinoidal
			}),
			new Effect.Move(this.canvas, {
				x: this.canvas.originalPosition.left,
				y: this.canvas.originalPosition.top,
				mode: 'absolute',
				sync: true, transition: Effect.Transitions.sinoidal
			})
		], {
			afterFinish: (function() {
				this.canvas.hide();
				delete this.target;
				this.visible = false;
			}).bind(this),
			duration: 0.3
		});
	}
});

Event.observe(window, 'load', (function() {
	var zoommy = new Zoommy();
}).bind(this));
})();

// vim:foldmethod=marker
