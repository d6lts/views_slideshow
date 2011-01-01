// $Id$

/**
 *  @file
 *  A simple jQuery Cycle Div Slideshow Rotator.
 */

(function ($) {
  
  /**
   * This will set our initial behavior, by starting up each individual slideshow.
   */
  Drupal.behaviors.viewsSlideshowCycle = function (context) {
    $('.views_slideshow_cycle_main:not(.viewsSlideshowCycle-processed)', context).addClass('viewsSlideshowCycle-processed').each(function() {
      var fullId = '#' + $(this).attr('id');
      var settings = Drupal.settings.viewsSlideshowCycle[fullId];
      settings.targetId = '#' + $(fullId + " :first").attr('id');
      settings.slideshowId = settings.targetId.replace('#views_slideshow_cycle_teaser_section_', '');
      settings.paused = false;
  
      settings.opts = {
        speed:settings.speed,
        timeout:settings.timeout,
        delay:settings.delay,
        sync:settings.sync,
        random:settings.random,
        nowrap:settings.nowrap,
        after:function(curr, next, opts) {
          // Need to do some special handling on first load.
          var slideNum = opts.currSlide;
          if (typeof settings.processedAfter == 'undefined' || !settings.processedAfter) {
            settings.processedAfter = 1;
            slideNum = (typeof settings.opts.startingSlide == 'undefined') ? 0 : settings.opts.startingSlide;
          }
          
          Drupal.viewsSlideshow.transitionEnd(settings.slideshowId, '', slideNum);
        },
        before:function(curr, next, opts) {
          // Remember last slide.
          if (settings.remember_slide) {
            createCookie(settings.vss_id, opts.currSlide + 1, settings.remember_slide_days);
          }
  
          // Make variable height.
          if (!settings.fixed_height) {
            //get the height of the current slide
            var $ht = $(this).height();
            //set the container's height to that of the current slide
            $(this).parent().animate({height: $ht});
          }
          
          // Need to do some special handling on first load.
          var slideNum = opts.nextSlide;
          if (typeof settings.processedBefore == 'undefined' || !settings.processedBefore) {
            settings.processedBefore = 1;
            slideNum = (typeof settings.opts.startingSlide == 'undefined') ? 0 : settings.opts.startingSlide;
          }
          
          Drupal.viewsSlideshow.transitionBegin(settings.slideshowId, '', slideNum);
        },
        cleartype:(settings.cleartype)? true : false,
        cleartypeNoBg:(settings.cleartypenobg)? true : false
      }
      
      // Set the starting slide if we are supposed to remember the slide
      if (settings.remember_slide) {
        var startSlide = readCookie(settings.vss_id);
        if (startSlide == null) {
          startSlide = 0;
        }
        settings.opts.startingSlide =  startSlide;
      }
  
      if (settings.effect == 'none') {
        settings.opts.speed = 1;
      }
      else {
        settings.opts.fx = settings.effect;
      }
  
      // Pause on hover.
      if (settings.pause) {
        $('#views_slideshow_cycle_teaser_section_' + settings.vss_id).hover(function() {
          Drupal.viewsSlideshow.pause(settings.slideshowId, '');
        }, function() {
          if (!settings.paused) {
            Drupal.viewsSlideshow.play(settings.slideshowId, '');
          }
        });
      }
  
      // Pause on clicking of the slide.
      if (settings.pause_on_click) {
        $('#views_slideshow_cycle_teaser_section_' + settings.vss_id).click(function() {
          Drupal.viewsSlideshow.pause(settings.slideshowId, '');
        });
      }
  
      var advancedOptions = JSON.parse(settings.advanced_options);
      for (var option in advancedOptions) {
        advancedOptions[option] = $.trim(advancedOptions[option]);
        advancedOptions[option] = advancedOptions[option].replace(/\n/g, '');
        if (!isNaN(parseInt(advancedOptions[option]))) {
          advancedOptions[option] = parseInt(advancedOptions[option]);
        }
        else if (advancedOptions[option].toLowerCase() == 'true') {
          advancedOptions[option] = true;
        }
        else if (advancedOptions[option].toLowerCase() == 'false') {
          advancedOptions[option] = false;
        }
        
        switch(option) {
          
          // Standard Options
          case "activePagerClass":
          case "allowPagerClickBubble":
          case "autostop":
          case "autostopCount":
          case "backwards":
          case "bounce":
          case "cleartype":
          case "cleartypeNoBg":
          case "containerResize":
          case "continuous":
          case "delay":
          case "easeIn":
          case "easeOut":
          case "easing":
          case "fastOnEvent":
          case "fit":
          case "fx":
          case "height":
          case "manualTrump":
          case "next":
          case "nowrap":
          case "pager":
          case "pagerEvent":
          case "pause":
          case "pauseOnPagerHover":
          case "prev":
          case "prevNextEvent":
          case "random":
          case "randomizeEffects":
          case "requeueOnImageNotLoaded":
          case "requeueTimeout":
          case "rev":
          case "slideExpr":
          case "slideResize":
          case "speed":
          case "speedIn":
          case "speedOut":
          case "startingSlide":
          case "sync":
          case "timeout":
            settings.opts[option] = advancedOptions[option];
            break;
          
          // These process options that look like {top:50, bottom:20}
          case "animIn":
          case "animOut":
          case "cssBefore":
          case "cssAfter":
          case "shuffle":
            settings.opts[option] = eval('(' + advancedOptions[option] + ')');
            break;
          
          // These options have their own functions.
          case "after":
            // transition callback (scope set to element that was shown): function(currSlideElement, nextSlideElement, options, forwardFlag) 
            settings.opts[option] = function(currSlideElement, nextSlideElement, options, forwardFlag) {
              eval(advancedOptions[option]);
            }
            break;
          
          case "before":
            // transition callback (scope set to element to be shown):     function(currSlideElement, nextSlideElement, options, forwardFlag) 
            settings.opts[option] = function(currSlideElement, nextSlideElement, options, forwardFlag) {
              eval(advancedOptions[option]);
            }
            break;
          
          case "end":
            // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
            settings.opts[option] = function(options) {
              eval(advancedOptions[option]);
            }
            break;
          
          case "fxFn":
            // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
            settings.opts[option] = function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag) {
              eval(advancedOptions[option]);
            }
            break;
          
          case "onPagerEvent":
            settings.opts[option] = function(zeroBasedSlideIndex, slideElement) {
              eval(advancedOptions[option]);
            }
            break;
          
          case "onPrevNextEvent":
            settings.opts[option] = function(isNext, zeroBasedSlideIndex, slideElement) {
              eval(advancedOptions[option]);
            }
            break;
          
          case "pagerAnchorBuilder":
            // callback fn for building anchor links:  function(index, DOMelement)
            settings.opts[option] = function(index, DOMelement) {
              eval(advancedOptions[option]);
            }
            break;
          
          case "pagerClick":
            // callback fn for pager clicks:    function(zeroBasedSlideIndex, slideElement)
            settings.opts[option] = function(zeroBasedSlideIndex, slideElement) {
              eval(advancedOptions[option]);
            }
            break;
          
          case "timeoutFn":
            settings.opts[option] = function(currSlideElement, nextSlideElement, options, forwardFlag) {
              eval(advancedOptions[option]);
            }
            break;
      
          case "updateActivePagerLink":
            // callback fn invoked to update the active pager link (adds/removes activePagerClass style)
            settings.opts[option] = function(pager, currSlideIndex) {
              eval(advancedOptions[option]);
            }
            break;
        }
      }
      
      
      $(settings.targetId).cycle(settings.opts);
  
      // Start Paused
      if (settings.start_paused) {
        Drupal.viewsSlideshow.pause(settings.slideshowId, '');
      }
      
      // Pause if hidden.
      if (settings.pause_when_hidden) {
        var checkPause = function(settings) {
          // If the slideshow is visible and it is paused then resume.
          // otherwise if the slideshow is not visible and it is not paused then
          // pause it.
          var visible = viewsSlideshowCycleIsVisible(settings.targetId, settings.pause_when_hidden_type, settings.amount_allowed_visible);
          if (visible && settings.paused) {
            Drupal.viewsSlideshow.play(settings.slideshowId, '');
          }
          else if (!visible && !settings.paused) {
            Drupal.viewsSlideshow.pause(settings.slideshowId, '');
          }
        }
       
        // Check when scrolled.
        $(window).scroll(function() {
         checkPause(settings);
        });
        
        // Check when the window is resized.
        $(window).resize(function() {
          checkPause(settings);
        });
      }Drupal.viewsSlideshowCycle = Drupal.viewsSlideshowCycle || {};
    });
  }
  
  Drupal.viewsSlideshowCycle = Drupal.viewsSlideshowCycle || {};
  
  Drupal.viewsSlideshowCycle.pause = function (slideshowID) {
    $('#views_slideshow_cycle_teaser_section_' + slideshowID).cycle('pause');
  }
  
  Drupal.viewsSlideshowCycle.play = function (slideshowID) {
    $('#views_slideshow_cycle_teaser_section_' + slideshowID).cycle('resume');
  }
  
  Drupal.viewsSlideshowCycle.previousSlide = function (slideshowID) {
    $('#views_slideshow_cycle_teaser_section_' + slideshowID).cycle('prev');
  }
  
  Drupal.viewsSlideshowCycle.nextSlide = function (slideshowID) {
    $('#views_slideshow_cycle_teaser_section_' + slideshowID).cycle('next');
  }
  
  Drupal.viewsSlideshowCycle.goToSlide = function (slideshowID, slideNum) {
    $('#views_slideshow_cycle_teaser_section_' + slideshowID).cycle(slideNum);
  }
  
  // Verify that the value is a number.
  function IsNumeric(sText) {
    var ValidChars = "0123456789";
    var IsNumber=true;
    var Char;
  
    for (var i=0; i < sText.length && IsNumber == true; i++) { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) {
        IsNumber = false;
      }
    }
    return IsNumber;
  }
  
  /**
   * Cookie Handling Functions
   */
  function createCookie(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else {
      var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
  }
  
  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length,c.length);
      }
    }
    return null;
  }
  
  function eraseCookie(name) {
    createCookie(name,"",-1);
  }
  
  /**
   * Checks to see if the slide is visible enough.
   * elem = element to check.
   * type = The way to calculate how much is visible.
   * amountVisible = amount that should be visible. Either in percent or px. If
   *                it's not defined then all of the slide must be visible.
   *
   * Returns true or false
   */
  function viewsSlideshowCycleIsVisible(elem, type, amountVisible) {
    // Get the top and bottom of the window;
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var docViewLeft = $(window).scrollLeft();
    var docViewRight = docViewLeft + $(window).width();
  
    // Get the top, bottom, and height of the slide;
    var elemTop = $(elem).offset().top;
    var elemHeight = $(elem).height();
    var elemBottom = elemTop + elemHeight;
    var elemLeft = $(elem).offset().left;
    var elemWidth = $(elem).width();
    var elemRight = elemLeft + elemWidth;
    var elemArea = elemHeight * elemWidth;
    
    // Calculate what's hiding in the slide.
    var missingLeft = 0;
    var missingRight = 0;
    var missingTop = 0;
    var missingBottom = 0;
    
    // Find out how much of the slide is missing from the left.
    if (elemLeft < docViewLeft) {
      missingLeft = docViewLeft - elemLeft;
    }
  
    // Find out how much of the slide is missing from the right.
    if (elemRight > docViewRight) {
      missingRight = elemRight - docViewRight;
    }
    
    // Find out how much of the slide is missing from the top.
    if (elemTop < docViewTop) {
      missingTop = docViewTop - elemTop;
    }
  
    // Find out how much of the slide is missing from the bottom.
    if (elemBottom > docViewBottom) {
      missingBottom = elemBottom - docViewBottom;
    }
    
    // If there is no amountVisible defined then check to see if the whole slide
    // is visible.
    if (type == 'full') {
      return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
      && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop)
      && (elemLeft >= docViewLeft) && (elemRight <= docViewRight)
      && (elemLeft <= docViewRight) && (elemRight >= docViewLeft));
    }
    else if(type == 'vertical') {
      var verticalShowing = elemHeight - missingTop - missingBottom;
      
      // If user specified a percentage then find out if the current shown percent
      // is larger than the allowed percent.
      // Otherwise check to see if the amount of px shown is larger than the
      // allotted amount.
      if (amountVisible.indexOf('%')) {
        return (((verticalShowing/elemHeight)*100) >= parseInt(amountVisible));
      }
      else {
        return (verticalShowing >= parseInt(amountVisible));
      }
    }
    else if(type == 'horizontal') {
      var horizontalShowing = elemWidth - missingLeft - missingRight;
      
      // If user specified a percentage then find out if the current shown percent
      // is larger than the allowed percent.
      // Otherwise check to see if the amount of px shown is larger than the
      // allotted amount.
      if (amountVisible.indexOf('%')) {
        return (((horizontalShowing/elemWidth)*100) >= parseInt(amountVisible));
      }
      else {
        return (horizontalShowing >= parseInt(amountVisible));
      }
    }
    else if(type == 'area') {
      var areaShowing = (elemWidth - missingLeft - missingRight) * (elemHeight - missingTop - missingBottom);
      
      // If user specified a percentage then find out if the current shown percent
      // is larger than the allowed percent.
      // Otherwise check to see if the amount of px shown is larger than the
      // allotted amount.
      if (amountVisible.indexOf('%')) {
        return (((areaShowing/elemArea)*100) >= parseInt(amountVisible));
      }
      else {
        return (areaShowing >= parseInt(amountVisible));
      }
    }
  }
})(jQuery);
