;(function($,window,document,undefined){
	"use_strict";
	
	// Defaults
	var pluginName = 'asfAnimation', 
		defaults = {
			onProgress: function(event, percent){},                     // onProgress Callback
			onComplete: function(event){}                               // onComplete Callback
		},
		base = null, eventName = 'asf-animation-';
	
	// Plugin constructor
	function Plugin(element, options) {
		base = this;
		base.$element = $(element);
		
		// Merge customs options and defaults options
		base.options = $.extend({}, defaults, options);
		
		base._defaults = defaults;
		base._name = pluginName;
		base._eventName = eventName;
		
		base.init(base);
	}
	
	// Plugin Prototype
	Plugin.prototype = {
		init: function() {
			
			// Initialize events
			this.setEvents();
			
			// onResize
			base.onResize();
		},
		
		onResize: function() {
			$(window).resize(function(){
				var nWidth = $(window).width(), nHeight = $(window).height();
				
			});
		},
		
		setEvents: function() {
			base.$element.bind(base._eventName + 'onInit');
			
			base.$element.bind(base._eventName + 'onProgress', base.options.onProgress);
			
			base.$element.bind(base._eventName + 'onComplete', base.options.onComplete);
			
			base.$element.bind(base._eventName + 'start', function(event){
				base.command.start();
			});
			
			base.$element.bind(base._eventName + 'stop', function(event){
				base.command.stop();
			});
			
			base.$element.bind(base._eventName + 'reset', function(event){
				base.command.reset();
			});
			
			base.$element.bind(base._eventName + 'destroy', function(event){
				base.command.destroy();
			});
			
			base.$element.bind(base._eventName + 'options', function(event, options){
				base.command.options(options);
			});
		},
		
		command: {
			start: function() {
				
			},
			stop: function() {
				
			},
			reset: function() {
				
			},
			destroy : function(){
				
			},
			options: function(options){
				base.options = $.extend({}, base.options, options);
				if(options.preloadEmptyImg || options.preloadFullImg){
					base.reloadImages();
					base.coreDraw();
				}
				base.draw();
				return base.options;
			}
		}		
	};
	
	// If no element is supplied, we'll attach to body
  $.asfAnimation = function (options) {
    // Return the instance
    return $('body')
            .asfAnimation(options)
            .data('plugin_asfAnimation');
  };
	  
	$.fn[pluginName] = function(options) {
		return this.each(function(){
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	};
	
	$.fn[pluginName].getStartEventName = function() {
		return eventName + 'start';
	}
	
	$.fn[pluginName].getStopEventName = function() {
		return eventName + 'stop';
	}
	
	$.fn[pluginName].getResetEventName = function() {
		return eventName + 'reset';
	}
	
	$.fn[pluginName].getDestroyEventName = function() {
		return eventName + 'destroy';
	}
	
	$.fn[pluginName].getOptionsEventName = function() {
		return eventName + 'options';
	}
	
})(jQuery,window,document);
