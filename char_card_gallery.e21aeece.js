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
},{}],"char_card_gallery.js":[function(require,module,exports) {
"use strict";

var _backdrop = require("../../utils/backdrop.js");
var pfp_card_containers = document.querySelectorAll('.pfp-card-gallery .pfp-card-container');
var info_cards = document.querySelectorAll('.pfp-card-gallery .pfp-card-container .pfp-card__info-card');
pfp_card_containers.forEach(function (container) {
  /*  ===================================
      profile card in gallery interacts with its respective info card
      ===================================
  */

  // pfp_card (nesting explained)
  //    - info_card
  //         - picture_slider

  var pfp_card = container.querySelector('.pfp-card');
  var info_card = container.querySelector('.pfp-card__info-card');
  var picture_slider = info_card.querySelector('.info-card__picture-slider');

  // I want to prevent nested elements from triggering an event for parent element. This concept is called event bubbling.
  // Solution 1: If you are using nested html elements, use the stopPropagation method to stop the event bubbling and event capturing
  // Solution 2: Use a wrapper/container div and put your 'parent' and 'child' element as adjacent div containers
  pfp_card.addEventListener('click', function (e) {
    (0, _backdrop.showBackdrop)();

    // Show info card
    info_card.dataset.visible = "show"; // <<
    setTimeout(function () {
      info_card.style.opacity = 1;
    }, 0.0001); // << : Need setTimeout or else opacity animation won't activate
  });
  var close_info_btn = info_card.querySelector('.info-card__close-btn');
  close_info_btn.addEventListener('click', function (e) {
    (0, _backdrop.hideBackdrop)();

    // Close info card
    info_card.style.opacity = 0; // >>
    info_card.addEventListener('transitionend', function (e) {
      // >>
      info_card.dataset.visible = "hide"; // <<

      picture_slider.dataset.visible = "hide";
      // If close_info_btn is clicked from the picture slider remove all picture slider nav items
      var slider_img_track__images = slider_img_track.querySelectorAll('.picture-slider__nav-item');
      if (slider_img_track__images.length > 0) {
        slider_img_track__images.forEach(function (img) {
          img.remove();
        });
      }
    }, {
      once: true
    }); // << : Need to include this argument b/c if I don't when I try to open my info_card. The info_card immediately disappears.
    // This is b/c the transitionend event listener is still alive. We need to kill this event once it has finished running, so it isn't active for the rest of the program. 
  });
  // (<<) Use transitionend, setTimeout and {once: true} event-listner argument to create animation from display: none 
  // display:none animation is done primarly by the css transition property

  /*  ===================================
      info card pictures interact with picture slider
      ===================================
  */

  var info_card_pictures = info_card.querySelectorAll('.pfp-card__info-card__wrapper .info-card__pictures li');
  // uses const variable picture_slider here 
  var close_slider_btn = picture_slider.querySelector('.picture-slider__close-btn');
  var slider_img_track = picture_slider.querySelector('.picture-slider__container .picture-slider__nav .picture-slider__nav-track-container .picture-slider__nav-track');
  // Use var instead of const because I want to hoist this varaible so my close_info_card event listener can access it
  // I want to keep my close_info_card event listener above my variables related to my picture slider but I don't want to move my event listener below b/c I want to keep my info_card code in one place
  var slider_viewbox_image = picture_slider.querySelector('.picture-slider__container .picture-slider__view-box img');
  var slider_left_btn = picture_slider.querySelector('.picture-slider__container .picture-slider__nav-left-btn');
  var slider_right_btn = picture_slider.querySelector('.picture-slider__container .picture-slider__nav-right-btn');
  info_card_pictures.forEach(function (picture, index_clicked) {
    picture.addEventListener('click', function (e) {
      // Duplicate pictures in picture gallery inside the info card into the picture slider track
      populate_pic_slider(info_card_pictures, slider_img_track); // Cycle of populate the pic slider, deleting the pic slider on close -> repeat

      /*  ==== Prepare Slider ==== */

      picture_slider.dataset.visible = "show"; // Part of show animation later finished in later code
      // Needed to host b/c can't modify elements with display none.
      slider_img_track.style.scrollBehavior = "auto"; // Don't want to open my picture slider in the middle of a smooth scroll animation. I just want a jump

      calc_inital_slider_pos(index_clicked, 5, info_card_pictures, slider_img_track);

      // Click any image in slider nav and show same iamge in viewbox
      var slider_img_track__images = slider_img_track.querySelectorAll('.picture-slider__nav-item');
      var current_slider_img = slider_img_track__images[index_clicked]; // Which slider image is being viewed in the viewbox right now
      current_slider_img.classList.toggle("active");

      // ------ Show Slider -----

      // Show picture slider window with picture you clicked on inside the info card pic gallery
      // console.log(index_clicked); //This returns the index of the picture I clicked on inside the info_card. No need for indexOf or any array methods.
      slider_viewbox_image.src = picture.firstChild.src;
      // picture_slider.dataset.visible = "show"; // Part of show animation. Have to host this up so I can set up slider position before the picture slider shows
      setTimeout(function () {
        picture_slider.style.opacity = 1;
      }, 0.0001);
      slider_img_track.style.scrollBehavior = "smooth";

      // ------ Runtime Event Listeners -----

      slider_img_track__images.forEach(function (track_img) {
        track_img.addEventListener('click', function (e) {
          // toggle class style showing the current picture user is viewing
          current_slider_img.classList.toggle("active"); // Remove current picture from viewbox and corresponding slider nav indicator class

          track_img.classList.toggle("active"); // Add active class to the image you clicked on inside the slider track
          current_slider_img = track_img;
          slider_viewbox_image.src = track_img.firstChild.src; // Show clicked slider track image in viewbox
          // Theres only 1 image tag nested inside ethier a div or a li
        });
      });
      var scroll_width = slider_img_track.getBoundingClientRect().width;
      slider_right_btn.addEventListener('click', function (e) {
        // Move slider track
        slider_img_track.scrollLeft += scroll_width;

        // Animate slider track slide. Restart animation onclick when clicking at the end/middle of animation.
        slider_right_btn.style.animation = ""; // Need to 'remove' animation if I want to restart animation clicking during the middle of an onclick animation
        void slider_right_btn.offsetWidth; // "Triggering reflow" This is important for animation to reset on click. Works mid way through animation and after previous animation is complete.
        slider_right_btn.style.animation = "btn_press_animation 400ms ease-out";
      });
      slider_left_btn.addEventListener('click', function (e) {
        slider_img_track.scrollLeft -= scroll_width;
        slider_left_btn.style.animation = "";
        void slider_left_btn.offsetWidth;
        slider_left_btn.style.animation = "btn_press_animation 400ms ease-out";
      });
    });
  });
  close_slider_btn.addEventListener('click', function (e) {
    // I need to somehow reset the nav indicators the next time the user opens the same picture slider. When I open the pic slider the 2nd time I don't want two nav items to have my white border indicator style. I just want one nav item to have this indicator.
    // I thought of an efficient solution of just deleting the nav items and insert them back in when the user opens the slider again since I don't need to have the nav items in the background if only 1 picture slider can be opened at a time
    var slider_img_track__images = slider_img_track.querySelectorAll('.picture-slider__nav-item'); // var is only function scoped so have to redefine the same variable in different functiosn and b/c I want this variable to be able to change
    slider_img_track__images.forEach(function (img) {
      img.remove();
    });

    // Close picture slider window 
    picture_slider.style.opacity = 0;
    picture_slider.addEventListener('transitionend', function (e) {
      picture_slider.dataset.visible = "hide";
    }, {
      once: true
    });
  });
});
function populate_pic_slider(info_card_pics, slider_track) {
  // TLDR: Add all images in info_card to the picture slider tarck
  // Every Parent li - Child img gets converted to a Parent div - child img element and append the converted element to the picture slider track div as child elements
  // End product should be all of the pictures in the picture slider track are the same pictures in the info_card pic gallery
  info_card_pics.forEach(function (picture, index) {
    // Create div with 'picture-slider__nav-item' class
    var temp_track_item = document.createElement('div');
    temp_track_item.className = "picture-slider__nav-item";

    // Nest img inside div just created 
    var temp_track_item__pic = document.createElement('img');
    temp_track_item__pic.src = picture.firstChild.src;
    temp_track_item.appendChild(temp_track_item__pic);

    // Add parent and child element to slider_track div
    slider_track.appendChild(temp_track_item);
  });
}
function calc_inital_slider_pos(index_clicked, cards_in_group, info_card_pictures, slider_img_track) {
  // 1: Calculate number of scroll groups based on width of scroller track visible
  var num_of_scroll_groups = Math.round(info_card_pictures.length / cards_in_group);
  // Adjust slider track placement so if you click on 1st or 14th image from the info_card the slider will be positioned so the image you clicked on it visible
  // We don't want user to click on 14th image and then having to scroll over all the way to the right to see the image with the indicator shown. The image should already be visible so the user doesn't have to scroll.
  // console.log(scroll_width);

  // 2️: Find out what num scroll group the info card picture you clicked on
  var group_index_start = 0;
  var group_index_end = cards_in_group - 1; // 5 cards in one scroll group so idnexes are 0,1,2,3,4
  var located_card_group;
  for (var i = 1; i <= num_of_scroll_groups; i++) {
    if (group_index_start <= index_clicked && index_clicked <= group_index_end) {
      // console.log(index_clicked + " inside " + group_index_start + " --- " + group_index_end);
      located_card_group = i;
    }
    group_index_start += cards_in_group;
    group_index_end += cards_in_group;

    // Go through each scroll group: Group 1 [0.4] -> Group 2 [5,9] -> Group 3 [10, 14] -> X amount of groups
  }

  // 3: Set slider inital position
  var scroll_width = slider_img_track.getBoundingClientRect().width; // Width of one scroll group of 5 cards (cards_in_group)
  slider_img_track.scrollLeft = scroll_width * (located_card_group - 1); // Set slider position so located_card_group is visible upon opening
  // Group 1's scroll_width should be 0 not ~270 so have to offset located_card_group by -1 if I want the corrent scrollLeft value
}
},{"../../utils/backdrop.js":"utils/backdrop.js"}],"../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61202" + '/');
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
},{}]},{},["../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","char_card_gallery.js"], null)
//# sourceMappingURL=/char_card_gallery.e21aeece.js.map