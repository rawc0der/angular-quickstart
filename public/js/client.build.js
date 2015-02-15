(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MainApplication, app;

require('./index');


/**
  * # Quickstart Application
 */

MainApplication = (function() {
  function MainApplication() {
    console.log('MainApplication bootstrap');
    $(document).ready(function() {
      return angular.bootstrap(document, ['quickstartApp'], {
        strictDi: true
      });
    });
  }

  MainApplication.prototype.run = function() {
    return [
      '$rootScope', '$state', function($rootScope, $state) {
        console.log('MainApplication init');
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeStart', (function(_this) {
          return function(event, toState, toParams, fromState, fromParams) {
            return console.log(event, toState, toParams, fromState, fromParams);
          };
        })(this));
        return $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
          return console.error(event, toState, toParams, fromState, fromParams);
        });
      }
    ];
  };

  MainApplication.prototype.config = function() {
    return [
      '$urlRouterProvider', '$provide', function($urlRouterProvider, $provide) {
        $urlRouterProvider.otherwise('/');
        return $provide.decorator('$exceptionHandler', [
          '$delegate', function($delegate) {
            return function(exception, cause) {
              var errorData;
              $delegate(exception, cause);
              errorData = {
                exception: exception,
                cause: cause
              };
              return console.error('$exceptionHandler::ERROR:', exception.msg, errorData);
            };
          }
        ]);
      }
    ];
  };

  return MainApplication;

})();

app = new MainApplication();

angular.module('quickstartApp', ['application']).config(app.config()).run(app.run());



},{"./index":12}],2:[function(require,module,exports){

/**
  * @ngdoc controller
  * @name StateController
 */
var StateController;

StateController = (function() {
  StateController.$inject = ['$scope'];

  function StateController(_at_$scope) {
    this.$scope = _at_$scope;
    console.log('quickstartApp.state.controllers.StateController');
  }

  return StateController;

})();

angular.module('quickstartApp.state.controllers.StateController', []).controller('StateController', StateController);



},{}],3:[function(require,module,exports){
require('./controllers/state_controller');


/**
  * # quickstartApp / state
 */

angular.module('quickstartApp.state', ['quickstartApp.state.controllers.StateController']).config(["$stateProvider", function($stateProvider) {
  return $stateProvider.state('myState', {
    url: '/',
    templateUrl: 'app/state/templates/layout.html',
    controller: 'StateController'
  });
}]);



},{"./controllers/state_controller":2}],4:[function(require,module,exports){

/**
  *  ComponentController
 */
var ComponentController;

ComponentController = (function() {
  ComponentController.$inject = ['$scope'];

  function ComponentController($scope) {
    console.log('%c quickstartApp.common.component.controllers.ComponentController', 'color:green');
  }

  return ComponentController;

})();

angular.module('quickstartApp.common.component.controllers.ComponentController', []).controller('ComponentController', ComponentController);



},{}],5:[function(require,module,exports){
angular.module('quickstartApp.common.component.directives.componentDirective', []).directive('componentBox', ["$rootScope", function($rootScope) {
  return {
    restrict: 'E',
    controller: 'ComponentController',
    templateUrl: 'common/component/templates/layout.html',
    link: function(scope, elem, attr) {
      return console.log('componentBox init');
    }
  };
}]);



},{}],6:[function(require,module,exports){
require('./controllers/component_controller');

require('./services/component_service');

require('./directives/component_directive');


/**
  * @name component
 */

angular.module('quickstartApp.common.component', ['quickstartApp.common.component.services.ComponentService', 'quickstartApp.common.component.controllers.ComponentController', 'quickstartApp.common.component.directives.componentDirective']);



},{"./controllers/component_controller":4,"./directives/component_directive":5,"./services/component_service":7}],7:[function(require,module,exports){
angular.module('quickstartApp.common.component.services.ComponentService', []).factory('ComponentService', function() {
  return console.log('quickstartApp.common.component.services.ComponentService');
});



},{}],8:[function(require,module,exports){
require('./services/module_extension');

require('./services/observable_mixin');

require('./services/request_aborter_service');

angular.module('quickstartApp.common.utils', ['quickstartApp.common.utils.services.Module', 'quickstartApp.common.utils.services.ObservableMixin', 'quickstartApp.common.utils.services.RequestAborterMixin']);



},{"./services/module_extension":9,"./services/observable_mixin":10,"./services/request_aborter_service":11}],9:[function(require,module,exports){

/*
    An object that adds extra functionality to a basic class
 */
angular.module('quickstartApp.common.utils.services.Module', []).factory('Module', function() {
  var Module;
  return Module = (function() {
    function Module() {}


    /*
        Attaches every property of the obj directly on the function constructor
    
        @param [Object] obj and object representing the extension properties
     */

    Module.extend = function(obj) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (key !== 'extend' && key !== 'include') {
          this[key] = value;
        }
      }
      if ((_ref = obj.extended) != null) {
        _ref.apply(this);
      }
      return this;
    };


    /*
        Attaches every property of the obj to the
        prototype of the function constructor
    
        @param [Object] obj an object representing the included properties
        @param [Function] decorator a decorator function applied
        for every property's value
     */

    Module.include = function(obj, decorator) {
      var key, value, _ref;
      for (key in obj) {
        value = obj[key];
        if (!(key !== 'extend' && key !== 'include')) {
          continue;
        }
        if (decorator && typeof value === 'Function') {
          value = decorator(value);
        }
        this.prototype[key] = value;
      }
      if ((_ref = obj.included) != null) {
        _ref.apply(this);
      }
      return this;
    };

    return Module;

  })();
});



},{}],10:[function(require,module,exports){

/*
    Given a list of callback functions it iterates through it
    and calls each function alongside the passed arguments

    Thanks to Jeremy Ashkenas @see https://github.com/jashkenas/backbone/

    @param [Array] callbacks the list of callback functions to be called
    @param [Array] args the arguments array passed to EventBus::trigger
 */
var ObservableMixin, triggerEventCallbacks,
  __slice = [].slice;

triggerEventCallbacks = function(callbacks, args) {
  var a1, a2, a3, cbLen, i, _ref, _results, _results1, _results2, _results3, _results4;
  _ref = [args[0], args[1], args[2]], a1 = _ref[0], a2 = _ref[1], a3 = _ref[2];
  cbLen = (callbacks != null ? callbacks.length : void 0) || 0;
  i = -1;
  switch (args.length) {
    case 0:
      _results = [];
      while (++i < cbLen) {
        _results.push(callbacks[i].cb.call(callbacks[i].ctx));
      }
      return _results;
      break;
    case 1:
      _results1 = [];
      while (++i < cbLen) {
        _results1.push(callbacks[i].cb.call(callbacks[i].ctx, a1));
      }
      return _results1;
      break;
    case 2:
      _results2 = [];
      while (++i < cbLen) {
        _results2.push(callbacks[i].cb.call(callbacks[i].ctx, a1, a2));
      }
      return _results2;
      break;
    case 3:
      _results3 = [];
      while (++i < cbLen) {
        _results3.push(callbacks[i].cb.call(callbacks[i].ctx, a1, a2, a3));
      }
      return _results3;
      break;
    default:
      _results4 = [];
      while (++i < cbLen) {
        _results4.push(callbacks[i].cb.apply(callbacks[i].ctx, args));
      }
      return _results4;
  }
};


/*
    Dispatching mechanism for centralizing application-wide events

    The internal structure of the event list looks like this:
        events = {
            callbacks: [{cb, ctx}, {cb, ctx}, ...]
        }
    where each object corresponding to the "eventName" array,
    represents a set containing a callback and a context
 */

ObservableMixin = {

  /*
      Attaches an event to a callback
  
      @param [String] event the name of the event it will monitor
      @param [Function] fn the callback function triggered for event
      @param [Object] ctx Context in which the callback function will be called
  
      @return [EventBus]
   */
  on: function(event, cb, ctx) {
    var _base;
    if (typeof cb === 'function' && typeof event === 'string') {
      if (this._events == null) {
        this._events = {};
      }
      if ((_base = this._events)[event] == null) {
        _base[event] = [];
      }
      this._events[event].push({
        cb: cb,
        ctx: ctx
      });
    }
    return this;
  },

  /*
      Removes a callback function for a given event and
      deletes the event if the callback list becomes empty
  
      @param [String] event the name of the event
      @param [Function] fn the callback to be removed from the callback list
   */
  off: function(event, cb) {
    var callback, callbackList, i, retain, _i, _len, _ref;
    callbackList = (_ref = this._events) != null ? _ref[event] : void 0;
    if (event && cb && (callbackList != null ? callbackList.length : void 0)) {
      this._events[event] = retain = [];
      for (i = _i = 0, _len = callbackList.length; _i < _len; i = ++_i) {
        callback = callbackList[i];
        if (callback.cb !== cb) {
          retain.push(callback);
        }
      }
      if (retain.length) {
        this._events[event] = retain;
      } else {
        delete this._events[event];
      }

      /*
          Check made to remove all the callbacks for the event
          if there was no callback specified
       */
    } else if (event && typeof cb === 'undefined' && (callbackList != null ? callbackList.length : void 0)) {
      delete this._events[event];
    }
    return this;
  },

  /*
      Triggers the event specified and calls the
      attached callback functions
  
      @param [String] event the name of the event that will be triggered
   */
  trigger: function() {
    var allCallbacks, args, event, eventCallbacks, tmpArgs, _ref, _ref1;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    eventCallbacks = (_ref = this._events) != null ? _ref[event] : void 0;
    allCallbacks = (_ref1 = this._events) != null ? _ref1.all : void 0;
    if (event && eventCallbacks || allCallbacks) {
      if (eventCallbacks != null ? eventCallbacks.length : void 0) {
        triggerEventCallbacks(eventCallbacks, args);
      }
      if (allCallbacks != null ? allCallbacks.length : void 0) {
        tmpArgs = args;
        tmpArgs.unshift(event);
        triggerEventCallbacks(allCallbacks, tmpArgs);
      }
    }
    return this;
  }
};

angular.module('quickstartApp.common.utils.services.ObservableMixin', []).factory('ObservableMixin', function() {
  return ObservableMixin;
});



},{}],11:[function(require,module,exports){

/*   
  RequestAborterMixin creates a deffered on current instance for delegating request timeouts
  [ how to use ]

  ##  before constructor    (  current class must have Module as superclass  )
  1.  @include RequestAborterMixin  (if extends Module)  ||   angular.extend @, RequestAborterMixin   (if does not extend Module)
  
  ##  inside constructor 
  2. call @registerPendingRequest to create a deffered on current instance
  
  ##  after constructor 
  3. pass @_aborter to resource timeout config properties
  4. call @killRequest when scope "$destroy" event fires
 */
angular.module('quickstartApp.common.utils.services.RequestAborterMixin', []).factory('RequestAborterMixin', [
  '$q', function($q) {
    return {
      registerPendingRequest: function() {
        this._deferred = $q.defer();
        return this._aborter = this._deferred.promise;
      },
      killRequest: function() {
        return this._deferred.resolve();
      }
    };
  }
]);



},{}],12:[function(require,module,exports){

/**
  * Index file 
 ## declare dependency modules
 */
require('./app/state/index');

require('./common/component/index');

require('./common/utils/index');

angular.module('application', ['templates', 'ngAnimate', 'ngResource', 'lodash', 'ui.router', 'quickstartApp.common.utils', 'quickstartApp.common.component', 'quickstartApp.state']);



},{"./app/state/index":3,"./common/component/index":6,"./common/utils/index":8}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxwbGF5LXdpdGgtbWVcXGFuZ3VsYXItcXVpY2tzdGFydFxcbm9kZV9tb2R1bGVzXFxndWxwLWJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZDpcXHBsYXktd2l0aC1tZVxcYW5ndWxhci1xdWlja3N0YXJ0XFxzcmNcXGFwcC5jb2ZmZWUiLCJkOlxccGxheS13aXRoLW1lXFxhbmd1bGFyLXF1aWNrc3RhcnRcXHNyY1xcYXBwXFxzdGF0ZVxcY29udHJvbGxlcnNcXHN0YXRlX2NvbnRyb2xsZXIuY29mZmVlIiwiZDpcXHBsYXktd2l0aC1tZVxcYW5ndWxhci1xdWlja3N0YXJ0XFxzcmNcXGFwcFxcc3RhdGVcXGluZGV4LmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXGFuZ3VsYXItcXVpY2tzdGFydFxcc3JjXFxjb21tb25cXGNvbXBvbmVudFxcY29udHJvbGxlcnNcXGNvbXBvbmVudF9jb250cm9sbGVyLmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXGFuZ3VsYXItcXVpY2tzdGFydFxcc3JjXFxjb21tb25cXGNvbXBvbmVudFxcZGlyZWN0aXZlc1xcY29tcG9uZW50X2RpcmVjdGl2ZS5jb2ZmZWUiLCJkOlxccGxheS13aXRoLW1lXFxhbmd1bGFyLXF1aWNrc3RhcnRcXHNyY1xcY29tbW9uXFxjb21wb25lbnRcXGluZGV4LmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXGFuZ3VsYXItcXVpY2tzdGFydFxcc3JjXFxjb21tb25cXGNvbXBvbmVudFxcc2VydmljZXNcXGNvbXBvbmVudF9zZXJ2aWNlLmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXGFuZ3VsYXItcXVpY2tzdGFydFxcc3JjXFxjb21tb25cXHV0aWxzXFxpbmRleC5jb2ZmZWUiLCJkOlxccGxheS13aXRoLW1lXFxhbmd1bGFyLXF1aWNrc3RhcnRcXHNyY1xcY29tbW9uXFx1dGlsc1xcc2VydmljZXNcXG1vZHVsZV9leHRlbnNpb24uY29mZmVlIiwiZDpcXHBsYXktd2l0aC1tZVxcYW5ndWxhci1xdWlja3N0YXJ0XFxzcmNcXGNvbW1vblxcdXRpbHNcXHNlcnZpY2VzXFxvYnNlcnZhYmxlX21peGluLmNvZmZlZSIsImQ6XFxwbGF5LXdpdGgtbWVcXGFuZ3VsYXItcXVpY2tzdGFydFxcc3JjXFxjb21tb25cXHV0aWxzXFxzZXJ2aWNlc1xccmVxdWVzdF9hYm9ydGVyX3NlcnZpY2UuY29mZmVlIiwiZDpcXHBsYXktd2l0aC1tZVxcYW5ndWxhci1xdWlja3N0YXJ0XFxzcmNcXGluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsb0JBQUE7O0FBQUEsT0FBQSxDQUFTLFNBQVQsQ0FBQSxDQUFBOztBQUVBO0FBQUE7O0dBRkE7O0FBQUE7QUFPZSxFQUFBLHlCQUFBLEdBQUE7QUFDWCxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQWEsMkJBQWIsQ0FBQSxDQUFBO0FBQUEsSUFDQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsS0FBWixDQUFrQixTQUFBLEdBQUE7YUFDaEIsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsUUFBbEIsRUFBNEIsQ0FBRSxlQUFGLENBQTVCLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxJQUFWO09BREYsRUFEZ0I7SUFBQSxDQUFsQixDQURBLENBRFc7RUFBQSxDQUFiOztBQUFBLDRCQU1BLEdBQUEsR0FBSyxTQUFBLEdBQUE7V0FBRztNQUFFLFlBQUYsRUFBZ0IsUUFBaEIsRUFBeUIsU0FBRSxVQUFGLEVBQWMsTUFBZCxHQUFBO0FBQy9CLFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBYSxzQkFBYixDQUFBLENBQUE7QUFBQSxRQUNBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLE1BRHBCLENBQUE7QUFBQSxRQUdBLFVBQVUsQ0FBQyxHQUFYLENBQWdCLG1CQUFoQixFQUFvQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxFQUFRLE9B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O01BRHNDO0VBQUEsQ0FBUjtDQURsQyxDQWhCQSxDQUFBOzs7OztBQ0FBO0FBQUE7OztHQUFBO0FBQUEsT0FJQSxDQUFTLG1CQUFULENBSkEsQ0FBQTs7QUFBQSxPQUtBLENBQVMsMEJBQVQsQ0FMQSxDQUFBOztBQUFBLE9BTUEsQ0FBUyxzQkFBVCxDQU5BLENBQUE7O0FBQUEsT0FTRSxDQUFDLE1BREgsQ0FDVyxhQURYLEVBQ3lCLENBQ3BCLFdBRG9CLEVBRXBCLFdBRm9CLEVBR3BCLFlBSG9CLEVBSXBCLFFBSm9CLEVBS3BCLFdBTG9CLEVBT3BCLDRCQVBvQixFQVFwQixnQ0FSb0IsRUFTcEIscUJBVG9CLENBRHpCLENBUkEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlICcuL2luZGV4J1xyXG5cclxuIyMjKlxyXG4gIyAjIFF1aWNrc3RhcnQgQXBwbGljYXRpb25cclxuIyMjXHJcbmNsYXNzIE1haW5BcHBsaWNhdGlvblxyXG5cclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIGNvbnNvbGUubG9nKCdNYWluQXBwbGljYXRpb24gYm9vdHN0cmFwJyk7XHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeSAtPlxyXG4gICAgICBhbmd1bGFyLmJvb3RzdHJhcCBkb2N1bWVudCwgWydxdWlja3N0YXJ0QXBwJ10sXHJcbiAgICAgICAgc3RyaWN0RGk6IHRydWVcclxuXHJcbiAgcnVuOiAtPiBbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgKCAkcm9vdFNjb3BlLCAkc3RhdGUgKSAtPlxyXG4gICAgY29uc29sZS5sb2coJ01haW5BcHBsaWNhdGlvbiBpbml0Jyk7XHJcbiAgICAkcm9vdFNjb3BlLiRzdGF0ZSA9ICRzdGF0ZVxyXG4gICAgXHJcbiAgICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlU3RhcnQnLCAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpID0+XHJcbiAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSBcclxuICAgICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VFcnJvcicsIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIC0+XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIFxyXG4gIF1cclxuXHJcbiAgY29uZmlnOiAtPiBbICckdXJsUm91dGVyUHJvdmlkZXInLCAnJHByb3ZpZGUnLCAoJHVybFJvdXRlclByb3ZpZGVyLCAkcHJvdmlkZSkgLT5cclxuICAgIFxyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyXHJcbiAgICAgIC5vdGhlcndpc2UgJy8nXHJcbiAgICAkcHJvdmlkZS5kZWNvcmF0b3IgJyRleGNlcHRpb25IYW5kbGVyJywgWyAnJGRlbGVnYXRlJywgKCRkZWxlZ2F0ZSkgLT5cclxuICAgICAgKGV4Y2VwdGlvbiwgY2F1c2UpIC0+XHJcbiAgICAgICAgJGRlbGVnYXRlIGV4Y2VwdGlvbiwgY2F1c2VcclxuICAgICAgICBlcnJvckRhdGEgPVxyXG4gICAgICAgICAgZXhjZXB0aW9uOiBleGNlcHRpb24sXHJcbiAgICAgICAgICBjYXVzZTogY2F1c2VcclxuICAgICAgICAjIyMjIEBUT0RPIFBST1ZJREUgUFJPUFBFUiBIQU5ETElORyBBTkQgTE9HR0lOR1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgJyRleGNlcHRpb25IYW5kbGVyOjpFUlJPUjonLCBleGNlcHRpb24ubXNnLCBlcnJvckRhdGFcclxuICAgIF1cclxuICBdXHJcblxyXG5hcHAgPSBuZXcgTWFpbkFwcGxpY2F0aW9uKClcclxuXHJcbmFuZ3VsYXJcclxuICAubW9kdWxlKCdxdWlja3N0YXJ0QXBwJyxbJ2FwcGxpY2F0aW9uJ10pLmNvbmZpZyggYXBwLmNvbmZpZygpICkucnVuIGFwcC5ydW4oKVxyXG5cclxuIiwiIyMjKlxyXG4gIyBAbmdkb2MgY29udHJvbGxlclxyXG4gIyBAbmFtZSBTdGF0ZUNvbnRyb2xsZXJcclxuIyMjXHJcbmNsYXNzIFN0YXRlQ29udHJvbGxlclxyXG4gIEAkaW5qZWN0OiBbICckc2NvcGUnXVxyXG4gIGNvbnN0cnVjdG9yOiAoQCRzY29wZSkgLT5cclxuICAgIGNvbnNvbGUubG9nKCdxdWlja3N0YXJ0QXBwLnN0YXRlLmNvbnRyb2xsZXJzLlN0YXRlQ29udHJvbGxlcicpXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncXVpY2tzdGFydEFwcC5zdGF0ZS5jb250cm9sbGVycy5TdGF0ZUNvbnRyb2xsZXInLCBbXSlcclxuICAuY29udHJvbGxlciAnU3RhdGVDb250cm9sbGVyJywgU3RhdGVDb250cm9sbGVyXHJcbiIsInJlcXVpcmUgJy4vY29udHJvbGxlcnMvc3RhdGVfY29udHJvbGxlcidcclxuIyMjKlxyXG4gIyAjIHF1aWNrc3RhcnRBcHAgLyBzdGF0ZVxyXG4jIyNcclxuYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuc3RhdGUnLCBbXHJcbiAgJ3F1aWNrc3RhcnRBcHAuc3RhdGUuY29udHJvbGxlcnMuU3RhdGVDb250cm9sbGVyJ1xyXG5dKS5jb25maWcgKCRzdGF0ZVByb3ZpZGVyKSAtPlxyXG4gICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAuc3RhdGUgJ215U3RhdGUnLFxyXG4gICAgICB1cmw6ICcvJ1xyXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zdGF0ZS90ZW1wbGF0ZXMvbGF5b3V0Lmh0bWwnXHJcbiAgICAgIGNvbnRyb2xsZXI6ICdTdGF0ZUNvbnRyb2xsZXInIFxyXG4iLCIjIyMqXHJcbiAjICBDb21wb25lbnRDb250cm9sbGVyXHJcbiMjI1xyXG5cclxuY2xhc3MgQ29tcG9uZW50Q29udHJvbGxlciAgXHJcbiAgQCRpbmplY3Q6IFsgJyRzY29wZScgXVxyXG4gIGNvbnN0cnVjdG9yOiAoICRzY29wZSApIC0+XHJcbiAgICBjb25zb2xlLmxvZygnJWMgcXVpY2tzdGFydEFwcC5jb21tb24uY29tcG9uZW50LmNvbnRyb2xsZXJzLkNvbXBvbmVudENvbnRyb2xsZXInLCAnY29sb3I6Z3JlZW4nKVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNvbXBvbmVudC5jb250cm9sbGVycy5Db21wb25lbnRDb250cm9sbGVyJywgW10pXHJcbiAgLmNvbnRyb2xsZXIgJ0NvbXBvbmVudENvbnRyb2xsZXInLCBDb21wb25lbnRDb250cm9sbGVyIiwiYW5ndWxhci5tb2R1bGUoJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNvbXBvbmVudC5kaXJlY3RpdmVzLmNvbXBvbmVudERpcmVjdGl2ZScsIFtdKVxyXG4gIC5kaXJlY3RpdmUgJ2NvbXBvbmVudEJveCcsICgkcm9vdFNjb3BlKSAtPlxyXG4gICAgcmVzdHJpY3Q6ICdFJ1xyXG4gICAgY29udHJvbGxlcjogJ0NvbXBvbmVudENvbnRyb2xsZXInXHJcbiAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9jb21wb25lbnQvdGVtcGxhdGVzL2xheW91dC5odG1sJ1xyXG4gICAgbGluazogKHNjb3BlLCBlbGVtLCBhdHRyKSAtPlxyXG4gICAgXHRjb25zb2xlLmxvZygnY29tcG9uZW50Qm94IGluaXQnKSIsInJlcXVpcmUgJy4vY29udHJvbGxlcnMvY29tcG9uZW50X2NvbnRyb2xsZXInXHJcbnJlcXVpcmUgJy4vc2VydmljZXMvY29tcG9uZW50X3NlcnZpY2UnXHJcbnJlcXVpcmUgJy4vZGlyZWN0aXZlcy9jb21wb25lbnRfZGlyZWN0aXZlJ1xyXG4jIyMqXHJcbiAjIEBuYW1lIGNvbXBvbmVudFxyXG4jIyNcclxuYW5ndWxhci5tb2R1bGUgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLmNvbXBvbmVudCcsIFtcclxuXHQncXVpY2tzdGFydEFwcC5jb21tb24uY29tcG9uZW50LnNlcnZpY2VzLkNvbXBvbmVudFNlcnZpY2UnXHJcblx0J3F1aWNrc3RhcnRBcHAuY29tbW9uLmNvbXBvbmVudC5jb250cm9sbGVycy5Db21wb25lbnRDb250cm9sbGVyJ1xyXG5cdCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jb21wb25lbnQuZGlyZWN0aXZlcy5jb21wb25lbnREaXJlY3RpdmUnXHJcbl0gXHJcbiIsImFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jb21wb25lbnQuc2VydmljZXMuQ29tcG9uZW50U2VydmljZScsIFtdKVxyXG4gIC5mYWN0b3J5ICdDb21wb25lbnRTZXJ2aWNlJywgLT5cclxuICAgIGNvbnNvbGUubG9nKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi5jb21wb25lbnQuc2VydmljZXMuQ29tcG9uZW50U2VydmljZScpXHJcbiAgICBcclxuXHJcblxyXG4iLCJyZXF1aXJlICcuL3NlcnZpY2VzL21vZHVsZV9leHRlbnNpb24nXHJcbnJlcXVpcmUgJy4vc2VydmljZXMvb2JzZXJ2YWJsZV9taXhpbidcclxucmVxdWlyZSAnLi9zZXJ2aWNlcy9yZXF1ZXN0X2Fib3J0ZXJfc2VydmljZSdcclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZSAncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMnLCBbXHJcbiAgJ3F1aWNrc3RhcnRBcHAuY29tbW9uLnV0aWxzLnNlcnZpY2VzLk1vZHVsZSdcclxuICAncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMuc2VydmljZXMuT2JzZXJ2YWJsZU1peGluJ1xyXG4gICdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5SZXF1ZXN0QWJvcnRlck1peGluJ1xyXG5dXHJcbiIsIiMjI1xyXG4gICAgQW4gb2JqZWN0IHRoYXQgYWRkcyBleHRyYSBmdW5jdGlvbmFsaXR5IHRvIGEgYmFzaWMgY2xhc3NcclxuIyMjXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5Nb2R1bGUnLCBbXSlcclxuICAuZmFjdG9yeSAnTW9kdWxlJywgKCkgLT4gY2xhc3MgTW9kdWxlXHJcbiAgICAjIyNcclxuICAgICAgICBBdHRhY2hlcyBldmVyeSBwcm9wZXJ0eSBvZiB0aGUgb2JqIGRpcmVjdGx5IG9uIHRoZSBmdW5jdGlvbiBjb25zdHJ1Y3RvclxyXG5cclxuICAgICAgICBAcGFyYW0gW09iamVjdF0gb2JqIGFuZCBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBleHRlbnNpb24gcHJvcGVydGllc1xyXG4gICAgIyMjXHJcbiAgICBAZXh0ZW5kOiAob2JqKSAtPlxyXG4gICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBvYmogd2hlbiBrZXkgbm90IGluIFsnZXh0ZW5kJywnaW5jbHVkZSddXHJcbiAgICAgICAgQFtrZXldID0gdmFsdWVcclxuICAgICAgb2JqLmV4dGVuZGVkPy5hcHBseShAKVxyXG4gICAgICB0aGlzXHJcblxyXG4gICAgIyMjXHJcbiAgICAgICAgQXR0YWNoZXMgZXZlcnkgcHJvcGVydHkgb2YgdGhlIG9iaiB0byB0aGVcclxuICAgICAgICBwcm90b3R5cGUgb2YgdGhlIGZ1bmN0aW9uIGNvbnN0cnVjdG9yXHJcblxyXG4gICAgICAgIEBwYXJhbSBbT2JqZWN0XSBvYmogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgaW5jbHVkZWQgcHJvcGVydGllc1xyXG4gICAgICAgIEBwYXJhbSBbRnVuY3Rpb25dIGRlY29yYXRvciBhIGRlY29yYXRvciBmdW5jdGlvbiBhcHBsaWVkXHJcbiAgICAgICAgZm9yIGV2ZXJ5IHByb3BlcnR5J3MgdmFsdWVcclxuICAgICMjI1xyXG4gICAgQGluY2x1ZGU6IChvYmosIGRlY29yYXRvcikgLT5cclxuICAgICAgZm9yIGtleSwgdmFsdWUgb2Ygb2JqIHdoZW4ga2V5ICBub3QgaW4gWydleHRlbmQnLCdpbmNsdWRlJ11cclxuICAgICAgICBpZiBkZWNvcmF0b3IgYW5kIHR5cGVvZiB2YWx1ZSBpcyAnRnVuY3Rpb24nXHJcbiAgICAgICAgICB2YWx1ZSA9IGRlY29yYXRvcih2YWx1ZSlcclxuICAgICAgICBAOjpba2V5XSA9IHZhbHVlXHJcbiAgICAgIG9iai5pbmNsdWRlZD8uYXBwbHkoQClcclxuICAgICAgdGhpc1xyXG5cclxuIiwiXHJcbiMjI1xyXG4gICAgR2l2ZW4gYSBsaXN0IG9mIGNhbGxiYWNrIGZ1bmN0aW9ucyBpdCBpdGVyYXRlcyB0aHJvdWdoIGl0XHJcbiAgICBhbmQgY2FsbHMgZWFjaCBmdW5jdGlvbiBhbG9uZ3NpZGUgdGhlIHBhc3NlZCBhcmd1bWVudHNcclxuXHJcbiAgICBUaGFua3MgdG8gSmVyZW15IEFzaGtlbmFzIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2phc2hrZW5hcy9iYWNrYm9uZS9cclxuXHJcbiAgICBAcGFyYW0gW0FycmF5XSBjYWxsYmFja3MgdGhlIGxpc3Qgb2YgY2FsbGJhY2sgZnVuY3Rpb25zIHRvIGJlIGNhbGxlZFxyXG4gICAgQHBhcmFtIFtBcnJheV0gYXJncyB0aGUgYXJndW1lbnRzIGFycmF5IHBhc3NlZCB0byBFdmVudEJ1czo6dHJpZ2dlclxyXG4jIyNcclxudHJpZ2dlckV2ZW50Q2FsbGJhY2tzID0gKGNhbGxiYWNrcywgYXJncykgLT5cclxuICBbYTEsIGEyLCBhM10gPSBbYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXV1cclxuICBjYkxlbiA9IGNhbGxiYWNrcz8ubGVuZ3RoIHx8IDBcclxuICBpID0gLTFcclxuIFxyXG4gIHN3aXRjaCBhcmdzLmxlbmd0aFxyXG4gICAgd2hlbiAwXHJcbiAgICAgIHdoaWxlICgrK2kgPCBjYkxlbilcclxuICAgICAgICBjYWxsYmFja3NbaV0uY2IuY2FsbChjYWxsYmFja3NbaV0uY3R4KVxyXG4gICAgd2hlbiAxXHJcbiAgICAgIHdoaWxlICgrK2kgPCBjYkxlbilcclxuICAgICAgICBjYWxsYmFja3NbaV0uY2IuY2FsbChjYWxsYmFja3NbaV0uY3R4LCBhMSlcclxuICAgIHdoZW4gMlxyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmNhbGwoY2FsbGJhY2tzW2ldLmN0eCwgYTEsIGEyKVxyXG4gICAgd2hlbiAzXHJcbiAgICAgIHdoaWxlICgrK2kgPCBjYkxlbilcclxuICAgICAgICBjYWxsYmFja3NbaV0uY2IuY2FsbChjYWxsYmFja3NbaV0uY3R4LCBhMSwgYTIsIGEzKVxyXG4gICAgZWxzZVxyXG4gICAgICB3aGlsZSAoKytpIDwgY2JMZW4pXHJcbiAgICAgICAgY2FsbGJhY2tzW2ldLmNiLmFwcGx5KGNhbGxiYWNrc1tpXS5jdHgsIGFyZ3MpXHJcblxyXG4jIyNcclxuICAgIERpc3BhdGNoaW5nIG1lY2hhbmlzbSBmb3IgY2VudHJhbGl6aW5nIGFwcGxpY2F0aW9uLXdpZGUgZXZlbnRzXHJcblxyXG4gICAgVGhlIGludGVybmFsIHN0cnVjdHVyZSBvZiB0aGUgZXZlbnQgbGlzdCBsb29rcyBsaWtlIHRoaXM6XHJcbiAgICAgICAgZXZlbnRzID0ge1xyXG4gICAgICAgICAgICBjYWxsYmFja3M6IFt7Y2IsIGN0eH0sIHtjYiwgY3R4fSwgLi4uXVxyXG4gICAgICAgIH1cclxuICAgIHdoZXJlIGVhY2ggb2JqZWN0IGNvcnJlc3BvbmRpbmcgdG8gdGhlIFwiZXZlbnROYW1lXCIgYXJyYXksXHJcbiAgICByZXByZXNlbnRzIGEgc2V0IGNvbnRhaW5pbmcgYSBjYWxsYmFjayBhbmQgYSBjb250ZXh0XHJcbiMjI1xyXG5PYnNlcnZhYmxlTWl4aW4gPVxyXG4gICMjI1xyXG4gICAgICBBdHRhY2hlcyBhbiBldmVudCB0byBhIGNhbGxiYWNrXHJcblxyXG4gICAgICBAcGFyYW0gW1N0cmluZ10gZXZlbnQgdGhlIG5hbWUgb2YgdGhlIGV2ZW50IGl0IHdpbGwgbW9uaXRvclxyXG4gICAgICBAcGFyYW0gW0Z1bmN0aW9uXSBmbiB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdHJpZ2dlcmVkIGZvciBldmVudFxyXG4gICAgICBAcGFyYW0gW09iamVjdF0gY3R4IENvbnRleHQgaW4gd2hpY2ggdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkXHJcblxyXG4gICAgICBAcmV0dXJuIFtFdmVudEJ1c11cclxuICAjIyNcclxuICBvbjogKGV2ZW50LCBjYiwgY3R4KSAtPlxyXG4gICAgaWYgdHlwZW9mIGNiIGlzICdmdW5jdGlvbicgYW5kIHR5cGVvZiBldmVudCBpcyAnc3RyaW5nJ1xyXG4gICAgICAjIGNvbnN0cnVjdCB0aGUgZXZlbnRzIGxpc3QgYW5kIGFkZCBhbiBlbXB0eSBhcnJheSBhdCBrZXkgJ2V2ZW50J1xyXG4gICAgICBAX2V2ZW50cyA/PSB7fVxyXG4gICAgICBAX2V2ZW50c1tldmVudF0gPz0gW11cclxuICAgICAgIyBjb25zdHJ1Y3QgZXZlbnRzIGlmIG5vdCBhbHJlYWR5IGRlZmluZWQsIHRoZW4gcHVzaCBhIG5ldyBjYWxsYmFja1xyXG4gICAgICBAX2V2ZW50c1tldmVudF0ucHVzaCB7IGNiLCBjdHggfVxyXG4gICAgcmV0dXJuIEBcclxuXHJcbiAgIyMjXHJcbiAgICAgIFJlbW92ZXMgYSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgYSBnaXZlbiBldmVudCBhbmRcclxuICAgICAgZGVsZXRlcyB0aGUgZXZlbnQgaWYgdGhlIGNhbGxiYWNrIGxpc3QgYmVjb21lcyBlbXB0eVxyXG5cclxuICAgICAgQHBhcmFtIFtTdHJpbmddIGV2ZW50IHRoZSBuYW1lIG9mIHRoZSBldmVudFxyXG4gICAgICBAcGFyYW0gW0Z1bmN0aW9uXSBmbiB0aGUgY2FsbGJhY2sgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBjYWxsYmFjayBsaXN0XHJcbiAgIyMjXHJcbiAgb2ZmOiAoZXZlbnQsIGNiKSAtPlxyXG4gICAgY2FsbGJhY2tMaXN0ID0gQF9ldmVudHM/W2V2ZW50XVxyXG4gICAgaWYgZXZlbnQgYW5kIGNiIGFuZCBjYWxsYmFja0xpc3Q/Lmxlbmd0aFxyXG4gICAgICAjIHNtYWxsIHR3ZWFrIGJvcnJvd2VkIGZyb20gQmFja2JvbmUuRXZlbnRcclxuICAgICAgQF9ldmVudHNbZXZlbnRdID0gcmV0YWluID0gW11cclxuICAgICAgZm9yIGNhbGxiYWNrLCBpIGluIGNhbGxiYWNrTGlzdFxyXG4gICAgICAgIHJldGFpbi5wdXNoIGNhbGxiYWNrIHVubGVzcyBjYWxsYmFjay5jYiBpcyBjYlxyXG4gICAgICBpZiByZXRhaW4ubGVuZ3RoXHJcbiAgICAgICAgQF9ldmVudHNbZXZlbnRdID0gcmV0YWluXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkZWxldGUgQF9ldmVudHNbZXZlbnRdXHJcbiAgICAgICMjI1xyXG4gICAgICAgICAgQ2hlY2sgbWFkZSB0byByZW1vdmUgYWxsIHRoZSBjYWxsYmFja3MgZm9yIHRoZSBldmVudFxyXG4gICAgICAgICAgaWYgdGhlcmUgd2FzIG5vIGNhbGxiYWNrIHNwZWNpZmllZFxyXG4gICAgICAjIyNcclxuICAgIGVsc2UgaWYgZXZlbnQgYW5kIHR5cGVvZiBjYiBpcyAndW5kZWZpbmVkJyBhbmQgY2FsbGJhY2tMaXN0Py5sZW5ndGhcclxuICAgICAgZGVsZXRlIEBfZXZlbnRzW2V2ZW50XVxyXG4gICAgcmV0dXJuIEBcclxuXHJcbiAgIyMjXHJcbiAgICAgIFRyaWdnZXJzIHRoZSBldmVudCBzcGVjaWZpZWQgYW5kIGNhbGxzIHRoZVxyXG4gICAgICBhdHRhY2hlZCBjYWxsYmFjayBmdW5jdGlvbnNcclxuXHJcbiAgICAgIEBwYXJhbSBbU3RyaW5nXSBldmVudCB0aGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhhdCB3aWxsIGJlIHRyaWdnZXJlZFxyXG4gICMjI1xyXG4gIHRyaWdnZXI6IChldmVudCwgYXJncy4uLikgLT5cclxuICAgIGV2ZW50Q2FsbGJhY2tzID0gQF9ldmVudHM/W2V2ZW50XVxyXG4gICAgYWxsQ2FsbGJhY2tzID0gQF9ldmVudHM/LmFsbFxyXG5cclxuICAgIGlmIGV2ZW50IGFuZCBldmVudENhbGxiYWNrcyBvciBhbGxDYWxsYmFja3NcclxuICAgICAgaWYgZXZlbnRDYWxsYmFja3M/Lmxlbmd0aFxyXG4gICAgICAgIHRyaWdnZXJFdmVudENhbGxiYWNrcyhldmVudENhbGxiYWNrcywgYXJncylcclxuICAgICAgaWYgYWxsQ2FsbGJhY2tzPy5sZW5ndGhcclxuICAgICAgICB0bXBBcmdzID0gYXJnc1xyXG4gICAgICAgICMgYWRkIHRoZSBldmVudCBuYW1lIHRvIHRoZSBmcm9tIG9mIHRoZSBjYWxsYmFjayBwYXJhbXNcclxuICAgICAgICB0bXBBcmdzLnVuc2hpZnQgZXZlbnRcclxuICAgICAgICB0cmlnZ2VyRXZlbnRDYWxsYmFja3MoYWxsQ2FsbGJhY2tzLCB0bXBBcmdzKVxyXG4gICAgcmV0dXJuIEBcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5PYnNlcnZhYmxlTWl4aW4nLCBbXSlcclxuICAuZmFjdG9yeSAnT2JzZXJ2YWJsZU1peGluJywgKCkgLT4gT2JzZXJ2YWJsZU1peGluIiwiIyMjICAgXHJcbiAgUmVxdWVzdEFib3J0ZXJNaXhpbiBjcmVhdGVzIGEgZGVmZmVyZWQgb24gY3VycmVudCBpbnN0YW5jZSBmb3IgZGVsZWdhdGluZyByZXF1ZXN0IHRpbWVvdXRzXHJcbiAgWyBob3cgdG8gdXNlIF1cclxuXHJcbiAgIyMgIGJlZm9yZSBjb25zdHJ1Y3RvciAgICAoICBjdXJyZW50IGNsYXNzIG11c3QgaGF2ZSBNb2R1bGUgYXMgc3VwZXJjbGFzcyAgKVxyXG4gIDEuICBAaW5jbHVkZSBSZXF1ZXN0QWJvcnRlck1peGluICAoaWYgZXh0ZW5kcyBNb2R1bGUpICB8fCAgIGFuZ3VsYXIuZXh0ZW5kIEAsIFJlcXVlc3RBYm9ydGVyTWl4aW4gICAoaWYgZG9lcyBub3QgZXh0ZW5kIE1vZHVsZSlcclxuICBcclxuICAjIyAgaW5zaWRlIGNvbnN0cnVjdG9yIFxyXG4gIDIuIGNhbGwgQHJlZ2lzdGVyUGVuZGluZ1JlcXVlc3QgdG8gY3JlYXRlIGEgZGVmZmVyZWQgb24gY3VycmVudCBpbnN0YW5jZVxyXG4gIFxyXG4gICMjICBhZnRlciBjb25zdHJ1Y3RvciBcclxuICAzLiBwYXNzIEBfYWJvcnRlciB0byByZXNvdXJjZSB0aW1lb3V0IGNvbmZpZyBwcm9wZXJ0aWVzXHJcbiAgNC4gY2FsbCBAa2lsbFJlcXVlc3Qgd2hlbiBzY29wZSBcIiRkZXN0cm95XCIgZXZlbnQgZmlyZXMgXHJcblxyXG4jIyNcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdxdWlja3N0YXJ0QXBwLmNvbW1vbi51dGlscy5zZXJ2aWNlcy5SZXF1ZXN0QWJvcnRlck1peGluJywgW10pXHJcbiAgLmZhY3RvcnkgJ1JlcXVlc3RBYm9ydGVyTWl4aW4nLCBbICckcScsICgkcSkgLT4gXHJcbiAgICByZWdpc3RlclBlbmRpbmdSZXF1ZXN0OiAtPlxyXG4gICAgICBAX2RlZmVycmVkID0gJHEuZGVmZXIoKVxyXG4gICAgICBAX2Fib3J0ZXIgPSBAX2RlZmVycmVkLnByb21pc2VcclxuICAgIGtpbGxSZXF1ZXN0OiAtPlxyXG4gICAgICBAX2RlZmVycmVkLnJlc29sdmUoKVxyXG4gIF1cclxuICBcclxuIiwiIyMjKlxyXG4gIyBJbmRleCBmaWxlIFxyXG4gIyMgZGVjbGFyZSBkZXBlbmRlbmN5IG1vZHVsZXNcclxuIyMjXHJcbnJlcXVpcmUgJy4vYXBwL3N0YXRlL2luZGV4J1xyXG5yZXF1aXJlICcuL2NvbW1vbi9jb21wb25lbnQvaW5kZXgnXHJcbnJlcXVpcmUgJy4vY29tbW9uL3V0aWxzL2luZGV4J1xyXG5cclxuYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcGxpY2F0aW9uJywgW1xyXG4gICAgJ3RlbXBsYXRlcydcclxuICAgICduZ0FuaW1hdGUnXHJcbiAgICAnbmdSZXNvdXJjZSdcclxuICAgICdsb2Rhc2gnXHJcbiAgICAndWkucm91dGVyJ1xyXG4gICAgXHJcbiAgICAncXVpY2tzdGFydEFwcC5jb21tb24udXRpbHMnXHJcbiAgICAncXVpY2tzdGFydEFwcC5jb21tb24uY29tcG9uZW50J1xyXG4gICAgJ3F1aWNrc3RhcnRBcHAuc3RhdGUnIFxyXG5cclxuICBdKVxyXG4iXX0=
