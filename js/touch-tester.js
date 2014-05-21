(function() {
  var config = {
    'indicatorDelay': 500
  };
  
  var events = {
    touch: {
      touchstart: 		'Fires when a finger is placed on the touch surface/screen.',
      touchend: 		  'Fires when a finger is removed from the touch surface/screen.',
      touchmove: 		  'Fires when a finger already placed on the screen is moved across the screen.',
      touchenter: 		'Fires when a touch point moves onto the interactive area defined by a DOM element.',
      touchleave: 		'Fires when a touch point moves off the interactive area defined by a DOM element.',
      touchcancel: 		'A user agent must dispatch this event type to indicate when a TouchPoint has been disrupted in an implementation-specific manner, such as by moving outside the bounds of the UA window. A user agent may also dispatch this event type when the user places more touch points (The coordinate point at which a pointer (e.g. finger or stylus) intersects the target surface of an interface) on the touch surface than the device or implementation is configured to store, in which case the earliest TouchPoint object in the TouchList should be removed.'
    },
    mouse: {
      click: 'Fires when the pointing device button is clicked over an element. A click is defined as a mousedown and mouseup over the same screen location. The sequence of these events is:',
      dblclick: 'Fires when the pointing device button is double clicked over an element',
      mousedown: 'Fires when the pointing device button is pressed over an element',
      mouseup: 'Fires when the pointing device button is released over an element',
      mouseover: 'Fires when the pointing device is moved onto an element',
      mousemove: 'Fires when the pointing device is moved while it is over an element',
      mouseout: 'Fires when the pointing device is moved away from an element',
      dragstart: 'Fired on an element when a drag is started.',
      drag: 'This event is fired at the source of the drag, that is, the element where dragstart was fired, during the drag operation.',
      dragenter: 'Fired when the mouse is first moved over an element while a drag is occurring.',
      dragleave: 'This event is fired when the mouse leaves an element while a drag is occurring.',
      dragover: 'This event is fired as the mouse is moved over an element when a drag is occurring.',
      drop: 'The drop event is fired on the element where the drop was occurred at the end of the drag operation.',
      dragend: 'The source of the drag will receive a dragend event when the drag operation is complete, whether it was successful or not.'
    },
    hammer: {
      touch: '',
      release: '',
      gesture: '',
      hold: '',
      tap: '',
      doubletap: '',
      dragstart: '',
      drag: '',
      dragend: '',
      dragleft: '',
      dragright: '',
      dragup: '',
      dragdown: '',
      swipe: '',
      swipeleft: '',
      swiperight: '',
      swipeup: '',
      swipedown: '',
      transformstart: '',
      transform: '',
      transformend: '',
      rotate: '',
      pinch: '',
      pinchin: '',
      pinchout: ''
    }
  };
  var $$ = {};
  var timeOuts = {};
  var watchedEvents = [];
  var eventHandler = function(e) {
    if(hammerEventHandler.preventEvents === true) {
      e.preventDefault();
    }
    $$['event-' + e.type] || ($$['event-' + e.type] = $('.event-' + e.type));
    if(watchedEvents.indexOf(e.type) !== -1) {
      console.log(e.type, e);
    }
    var indicator = $$['event-' + e.type].find('.indicator');
    indicator.addClass('on');
    clearTimeout(timeOuts[e.type]); //clear prevous timeout if exist
    timeOuts[e.type] = setTimeout((function(el) {
      return function() {
        el.removeClass('on');
      }
    })(indicator), config.indicatorDelay);
  };
  
  var hammerEventHandler = function(e) {
    $$['event-hammer-' + e.type] || ($$['event-hammer-' + e.type] = $('.event-hammer-' + e.type));
    if(watchedEvents.indexOf("hammer-" + e.type) !== -1) {
      console.log("hammer-" + e.type, e);
    }
    var indicator = $$['event-hammer-' + e.type].find('.indicator');
    indicator.addClass('on');
    clearTimeout(timeOuts['hammer-' + e.type]); //clear prevous timeout if exist
    timeOuts['hammer-' + e.type] = setTimeout((function(el) {
      return function() {
        el.removeClass('on');
      }
    })(indicator), config.indicatorDelay);
  };
  $('#prevent_hammer').on('change', function() {
    hammerEventHandler.preventEvents = $(this).val() === 'on';
  });
  

  $$.test = $('#touch_test');

  for(var section in events) {
    var outHTML = '<ul>';
    for(var eventName in events[section]) {
      var eventNamePrefix = '';
      if(section === 'hammer') {
        eventNamePrefix = 'hammer-';
        Hammer($$.test[0]).on(eventName, hammerEventHandler);
      } else {
        $$.test.on(eventName, eventHandler);
      }
      outHTML += '<li><a title="' + events[section][eventName] + '" href="#" class="event-name event-' + eventNamePrefix + eventName + '" data-type="'+ eventNamePrefix + eventName +'"><i class="indicator"></i>' + eventName + '</a></li>';
    }
    outHTML += '</ul>';
    $('#' + section + '_events').html(outHTML);
  }
  $('.event-name').click(function(e) {
    e.preventDefault();
    $this = $(this);
    var type = $this.data('type');
    $$['event-' + type] || ($$['event-' + type] = $this);
    
    var indexOfType = watchedEvents.indexOf(type);
    if(indexOfType === -1) {
      watchedEvents.push(type);
      $$['event-' + type].addClass('watched');
    } else {
      watchedEvents.splice(indexOfType, 1);
      $$['event-' + type].removeClass('watched');
    }
    
  });
  
  $('h1.section').on('click', function(){
    $(this).next('h2').toggle()
    .next('.events-container').toggle();
  });
})();