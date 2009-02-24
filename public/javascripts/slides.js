var Slideshow = {
  init: function() {
    this.slideshows = new Array();
    $$('div.app-slideshow').each(function(show) {
      Slideshow.slideshows.push(Slideshow.slideshowInstance(show));
    });
  },
  slideshowInstance: function(slideshowEl) {
    var showObject = {
      init: function(slideshowBox) {
        this.element = slideshowBox;
        
        this.controlToSlideMap = new Hash();
        var delayEl = slideshowBox.getElements('.slides')[0]
        this.delay = parseInt(delayEl.className.substring(delayEl.className.indexOf('delay-') + 'delay-'.length)) * 1000;
        this.screenEl = slideshowBox.getElements('div.screen')[0];
        this.activeControlIndex = -1;
        
        var thisRef = this;
        var slideEls = slideshowBox.getElements('div.slides')[0].getElements('div.slide');
        this.controlEls = slideshowBox.getElements('div.slide-controls')[0].getElements('a');
        this.controlElsCount = this.controlEls.length;
        this.controlEls.each(function(control, index) { thisRef._observeSlide(slideEls[index], control); });
        this._restart();
      },
      // Causes a restart, so that the user gets a chance to look at the slide if it is clicked intentionally
      show: function(slide, control) {
        this._showSlide(slide, control, this.controlEls.indexOf(control));
        this._restart();
      },
      _showSlide: function(slide, control, index) {
        if (this.activeSlideControl) this.activeSlideControl.removeClass('showing');
    	  new Fx.Scroll(this.screenEl, {wheelStops: false}).toElement(slide);
        this.activeSlideControl = control;
        this.activeSlideControl.addClass('showing');
        this.activeControlIndex = index;
      },
      _observeSlide: function(slide, control) {
        var thisRef = this;  
        this.controlToSlideMap.set(control.id, slide);
        control.addEvent('click', function() { thisRef.show(slide, control); });
        if (control.hasClass('showing')) { 
          thisRef.show(thisRef.controlToSlideMap.get(control.id), control)
        }
      },
      _jump: function(addIndex) {
        var f = this.activeControlIndex + addIndex; 
        if (f >= this.controlElsCount) { f = 0; }
        else if (f < 0) { f = this.controlElsCount - 1; }
        var control = this.controlEls[f];
        this._showSlide(this.controlToSlideMap.get(control.id), control, f);
      },
      _next: function() { this._jump(1); },
      _restart: function() { this._stop(); this._start(); },
      _stop: function() { if (this.timer) { $clear(this.timer); this.timer = null; } },
      _start: function() { var thisRef = this; this.timer = (function(){thisRef._next();}).periodical(thisRef.delay); }
    };
    showObject.init(slideshowEl);
    return showObject;
  }
}
Slideshow.init();