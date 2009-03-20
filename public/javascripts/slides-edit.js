// Parses the slides form correctly for a slideshow editor.  
// Also requires PictureSelect to be included; and register each slide with picture select
// Requires jquery 1.3.2 and Jquery UI
var SlideshowEdit = {
  init: function() {
    TSEditor.registerOnEdit('slideshow', SlideshowEdit.slideshowInstance);
  },
  
  slideshowInstance: function(slideshowEl) {
    var showObject = {
      init: function(slideshowBox) {
        // Kill the existing timer for the show
        try { 
         for (var i = 0; i < Slideshow.slideshows.length; ++i) { if (Slideshow.slideshows[i].element.id == slideshowBox.id) { Slideshow.slideshows[i]._stop(); }}
        } catch(ignored) {}
        
        var slideshowBox = $(slideshowBox);
        this.controlToSlideMap = {};
        this.slidesEl = slideshowBox.find('div.slides:first');
        this.slideControlsEl = slideshowBox.find('div.slide-controls:first');
        this.screenEl = slideshowBox.find('div.screen:first');
        var creationCode = this._extractCreationCode(slideshowBox.find('div.new-slide-code'));
        var controlCreationCode = this._extractCreationCode(slideshowBox.find('div.new-slide-control-code'));
        this.newSlideControl = slideshowBox.find('.add-slide');
      
        var self = this;
        this.slideEls = this.slidesEl.find('div.slide');
        var controlEls = this.slideControlsEl.find('a.control');
        this.slideCount = this.slideEls.size();
        this.slideEls.each(function(i) { self._observeSlide($(this), $(controlEls.get(i))); });
        this.newSlideControl.click(function(ev) { self._addSlide(creationCode, controlCreationCode); self._makeSortable(); });
        this._makeSortable();
        slideshowBox.parents('form').bind('submit', function(ev) { self._saveOrder(); });
        
        // Go to marked slide to show
        controlEls.each(function(i) { if ($(this).hasClass('showing')) { self._showSlide(self.controlToSlideMap[this.id], $(this)); }});
      },
      // Returns creation code from element and removes element from DOM tree
      _extractCreationCode: function(el) {
        var creationCode = el.get(0).innerHTML;
        el.remove();
        return creationCode;
      },
      _addSlide: function(html, controlHtml) {
        var newEl=$(document.createElement('div'));
        newEl.html(html.replace(/_INDEX_/, this.slideCount));
        newEl = newEl.find('*:first').remove().get(0);
        this.slidesEl.get(0).appendChild(newEl);
        var controlEl = $(document.createElement('div'));
        controlEl.html(controlHtml.replace(/_INDEX_/, this.slideCount));
        controlEl = controlEl.find('*:first').remove().get(0);
        this.slideControlsEl.get(0).insertBefore(controlEl, this.newSlideControl.get(0));
        
        this._observeSlide($(newEl), $(controlEl));
        this.slideCount++;
        this._showSlide($(newEl), $(controlEl));
        $(newEl).find('textarea:first').focus();
        
        TS.Assets.Selector.selectAsset(newEl, ['pictures']);
      },
      _showSlide: function(slide, control) {
        this.screenEl.scrollTo(slide, 0);
        if (this.activeSlideControl) this.activeSlideControl.removeClass('showing');
        this.activeSlideControl = control;
        this.activeSlideControl.addClass('showing');
      },
      _observeSlide: function(slide, control) {
        var self = this;
        this.controlToSlideMap[control.get(0).id] = slide;
        control.click(function(ev) { self._showSlide(slide, control); });
        var remove = slide.find('.remove');
        remove.click(function(ev) { 
          slide.remove(); 
          control.remove(); 
          self.slideCount--; 
          self.controlToSlideMap[control.get(0).id] = null; 
          self._showSlide(self.slidesEl.find('div.slide:first'), self.slideControlsEl.find('a.control:first'));
        });
        var changeAsset = slide.find('.change-asset a');
        changeAsset.click(function(ev) { TS.Assets.Selector.selectAsset(slide, ['pictures']);})
        
        var titleSelect = slide.find('.title-placement select');
        titleSelect.bind('change', function(ev) { self._changeTitlePlacementClass(slide, titleSelect);});
        
        TS.Assets.Selector.register(slide.find('.preview'));
        TS.Assets.Selector.register(slide.find('.link'));
      },
      _changeTitlePlacementClass: function(slide, titleSelect) {
        try { slide.removeClass(slide.get(0).className.match(new RegExp('(\\s|^)(title-placement-[^\\s]*)(\\s|$)'))[2]); } catch(ignore) {}
        slide.addClass('title-placement-'+titleSelect.get(0).options[titleSelect.get(0).selectedIndex].value);
      },
      _makeSortable: function() {  
        this.slideControlsEl.sortable({ items:'a.control', axis:'x' });
        this.slideControlsEl.disableSelection();
      },
      _saveOrder: function() {
        var self = this;
        this.slideControlsEl.find('a.control').each(function(i) {
          self.controlToSlideMap[this.id].find('input.position-value').get(0).value = i;
        });
      }
    };
    showObject.init(slideshowEl);
    return showObject;
  }
}
SlideshowEdit.init();