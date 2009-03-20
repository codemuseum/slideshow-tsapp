// Requires jquery 1.3.2
var Slideshow = {
  init: function() {
    this.slideshows = new Array();
    $('div.app-slideshow').each(function(i) {
      Slideshow.slideshows.push(Slideshow.slideshowInstance($(this)));
    });
  },
  slideshowInstance: function(slideshowEl) {
    var showObject = {
      init: function(slideshowBox) {
        this.element = slideshowBox;
        
        this.controlToSlideMap = {};
        var delayEl = slideshowBox.find('div.slides:first');
        this.delay = parseInt(delayEl.get(0).className.substring(delayEl.get(0).className.indexOf('delay-') + 'delay-'.length)) * 1000;
        this.screenEl = slideshowBox.find('div.screen:first');
        this.activeControlIndex = -1;
        
        var self = this;
        var slideEls = delayEl.find('div.slide');
        this.controlEls = slideshowBox.find('div.slide-controls:first').find('a');
        this.controlElsCount = this.controlEls.length;
        this.controlEls.each(function(i) { self._observeSlide($(slideEls[i]), $(this)); });
        if (this.controlElsCount > 0) this._restart();
      },
      // Causes a restart, so that the user gets a chance to look at the slide if it is clicked intentionally
      show: function(slide, control) {
        this._showSlide(slide, control, jQuery.inArray(control, this.controlEls));
        this._restart();
      },
      _showSlide: function(slide, control, index) {
        if (this.activeSlideControl) this.activeSlideControl.removeClass('showing');
    	  this.screenEl.scrollTo(slide, 500);
        this.activeSlideControl = control;
        this.activeSlideControl.addClass('showing');
        this.activeControlIndex = index;
      },
      _observeSlide: function(slide, control) {
        var self = this;  
        this.controlToSlideMap[control.get(0).id] = slide;
        control.click(function(ev) { self.show(slide, control); });
        if (control.hasClass('showing')) { 
          self.show(self.controlToSlideMap[control.get(0).id], control)
        }
      },
      _jump: function(addIndex) {
        var f = this.activeControlIndex + addIndex; 
        if (f >= this.controlElsCount) { f = 0; }
        else if (f < 0) { f = this.controlElsCount - 1; }
        var control = $(this.controlEls[f]); 
        this._showSlide(this.controlToSlideMap[control.get(0).id], control, f);
      },
      _next: function() { this._jump(1); },
      _restart: function() { this._stop(); this._start(); },
      _stop: function() { if (this.timer) { window.clearInterval(this.timer); this.timer = null; } },
      _start: function() { var self = this; this.timer = window.setInterval(function() {self._next();}, self.delay); }
    };
    showObject.init(slideshowEl);
    return showObject;
  }
}
Slideshow.init();