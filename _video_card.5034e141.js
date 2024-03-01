// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils/backdrop.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideBackdrop = hideBackdrop;
exports.screen_overlay = void 0;
exports.showBackdrop = showBackdrop;
var screen_overlay = exports.screen_overlay = document.querySelector("body");
function showBackdrop() {
  var z_index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
  screen_overlay.style.setProperty('--overlay_z-index', z_index);
  screen_overlay.style.setProperty('--overlay_opacity', opacity);
}
function hideBackdrop() {
  var z_index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  screen_overlay.style.setProperty('--overlay_z-index', z_index);
  screen_overlay.style.setProperty('--overlay_opacity', opacity);
}
},{}],"pages/Landing_Page/_video_card.js":[function(require,module,exports) {
"use strict";

var _backdrop = require("../../utils/backdrop.js");
//body::before -> sceren_overlay from _nav-menu.scss

var video_cards = document.querySelectorAll('.video-card-wrapper .video-card .video-card__card');
var video_card_container = document.querySelectorAll('.video-card-wrapper .video-card');

/*
 Intersection Observer for On-Scroll Animation
 - Intersection Observer instead of scroll event lsitener b/c of performance 
 - On-Scroll Animations look decent on Both MObile and Desktop so going to use one piece of code for both mobile & desktop
 - On-scroll animations should work scrolling up and scrolling down
*/

function setOnScrollAnimation(element, animation) {
  // Put Intersection Observer in function for easier to read syntax and reuseable code for other on-scroll animations

  // On-Scroll Animation
  var observer = new IntersectionObserver(function (entries) {
    // entries returns an array so have to iterate through it 
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Observer only works one way. Only forwards.
        // Not going to use a class ( like '.show') to set style
        //console.log("Entered w/ Function");

        // CSS style at start opacity 0 and at end of animation opaicty gets permanently set to 1
        // Opacity starts animating b/c of transition property I've set in corresponding CSS file
        entry.target.style.opacity = 1;

        // Video Card 1 & Video Card 2 get different animations
        entry.target.style.animation = animation;
        entry.target.addEventListener("transitionend", function () {
          observer.unobserve(entry.target); // Remove Intersection Observer for that element
        });
      }
    });
  }, {
    threshold: 0.3 //50% of the element must be visible in viewport before observer gets called
  });
  observer.observe(element);
}
setOnScrollAnimation(video_card_container[0], "right_slide_in 1.6s ease-out");
setOnScrollAnimation(video_card_container[1], "left_slide_in 1.6s ease-out");

/* 
Relaod VIdeo Process terribly explained
1. First time open website the iframe video exist in the DOM
2. First time the video pop up is opened and closed the iframe video gets stored into 
another variable called store_video so the video can be accessed throughout the rest of the time the user is on teh website
3. Each time (after the 1 time) the video card is clicked the store_video gets reloaded on popup
- iframe_video gets set to reload_video so I'm able to remove an element and restore the same element later in the program 
*/

/*
   Click Event Listener
*/
// Add click event listener to each video card
// Each video card has their own instance of the click event listener and gets their own attributes & css style set separately
video_cards.forEach(function (video_card__video) {
  var store_video = "empty"; // Each video card has their own reload_variable scope that runs throughout the entire program
  // ^ Reload video each time video card is clicked
  // ^ Create temporary variable to store iframe in to reload later

  // If I click on the video card itself, make the video popup visible
  video_card__video.addEventListener('click', function (c) {
    (0, _backdrop.showBackdrop)(3);

    //No matter the order of HTML elements inside video-card the iframe with popup video class will be selected
    // need to declare variables inside the click event listener for videos to be able to switch with no problems
    var video_popup_container = video_card__video.parentElement.querySelector('.video-card__popup');
    video_popup_container.dataset.visible = "show";
    var popup_wrapper = video_popup_container.querySelector('.popup_wrapper'); //Going to need this to add the iframe back in to reload the embeded video
    var iframe_video = video_popup_container.querySelector('iframe'); // This is the actual YouTube embed video

    if (store_video === "empty") {
      // First time opening the video popup
      iframe_video = video_popup_container.querySelector('iframe'); // This is the actual YouTube embed video
      // First-time I want to select the actual iframe_video that's in the DOM
    } else {
      // X-times after the first time opening video popup
      iframe_video = store_video;
    }

    // Reload and Restore Emebed Video that was removed on close
    if (Array.from(popup_wrapper.children).includes(iframe_video) === false) {
      popup_wrapper.append(store_video);
    }

    // Btn that closes the video pop up. Event listener will only be active during the time that the popup is open
    var close_popup_btn = video_popup_container.querySelector('.video_close_btn');
    close_popup_btn.addEventListener('click', function (c) {
      store_video = iframe_video;
      iframe_video.remove();
      //console.log(iframe_video);
      video_popup_container.dataset.visible = "hide";

      // Remove whole screen dark overlay
      (0, _backdrop.hideBackdrop)();
    }, {
      once: true
    }); // Good for website performance. 
    // Event listener will automatically be removed so eventlistener doesn't happen in the background. 
  });
});
},{"../../utils/backdrop.js":"utils/backdrop.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64749" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","pages/Landing_Page/_video_card.js"], null)
//# sourceMappingURL=/_video_card.5034e141.js.map