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
})({"pages/Landing_Page/nav-menu.js":[function(require,module,exports) {
/*
_nav-btn.scss <- CSS
_nav-menu.scss <- CSS
📜 ✅
^ Prototype Javascript -> _nav-btn.scss & _nav-menu.scss

Javascripting done on Nov 3, 2023
*/

var nav_btn = document.querySelector(".nav-btn-icon");
var komi_face = document.querySelector(".komi-face");
var menu_close_icon = document.querySelector(".nav-btn-icon svg");
var nav_menu = document.querySelector(".primary-nav");
var nav_menu_links = document.querySelectorAll(".primary-nav__links li a");
var screen_overlay = document.querySelector("body");
mobile_imgs = ["wp7501723-2144181952.jpg", "7600fe9fc49fab1a42b.jpg", "wp7501703.jpg", "IZ6faD.jpg"];
desktop_imgs = ["komi_camera_wallpaper.jpg", "Komi-535967116.jpg", "wp7501663.jpg", "452d6a95f.jpg"];
// You can modify ::before ::after elements with javascript with CSS variables
// https://www.youtube.com/watch?v=LszEboGO_zw

/* ========================
    Nav menu links animation
    ======================= */
// Each nav menu link toggle mouse hover event that changes the link's underline element
//Child element modifies parent::after element
nav_menu_links.forEach(function (nav_link) {
  // Add multiple event listeners
  // On hover underline shows while expanding from center
  nav_link.addEventListener('mouseover', function (e) {
    nav_link.parentElement.style.setProperty('--underline-width', 1);
  });
  // On mouse leave underline width collapses towards center
  nav_link.addEventListener('mouseout', function (e) {
    nav_link.parentElement.style.setProperty('--underline-width', 0);
  });
});

/* ========================
    Nav Btn <-> Nav menu Animations
    ======================= */

function randDesktopBgImg() {
  var rand_index = Math.floor(Math.random() * desktop_imgs.length);
  nav_menu.style.backgroundImage = "url(" + desktop_imgs[rand_index] + ")";
}
function randMobileBgImg() {
  var rand_index = Math.floor(Math.random() * mobile_imgs.length);
  nav_menu.style.backgroundImage = "url(" + mobile_imgs[rand_index] + ")";
}
// Toggle Button on CSS Opacity Property to show & hide side nav menu
// 3 main actions of toggle button 
// Show entire screen overlay
// Slide side menu from the left into view
// Genreate random nav menu bg image
// Change nav btn icon to corresponding status (open/close)
nav_btn.addEventListener('click', function (e) {
  var overlay_opacity = window.getComputedStyle(screen_overlay, '::before').opacity;

  // If overlay hidden -> show overlay & content links cannot be clicked
  if (overlay_opacity == 0) {
    //Menu Change: Make menu visible
    screen_overlay.style.setProperty('--overlay_z-index', 2); //Activate entire screen overlay
    screen_overlay.style.setProperty('--overlay_opacity', 0.5); //Activate entire screen overlay

    nav_menu.style.setProperty('right', 0); // Slide Menu into view from the right

    // Generate random background image on every nav btn click
    // CSS variable in media querry = Javascript automatic detect media querry
    var menu_mode = getComputedStyle(nav_menu).getPropertyValue("--menu_mode");
    if (menu_mode == "\"desktop\"") {
      randDesktopBgImg();
    } else if (menu_mode == "\"mobile\"") {
      randMobileBgImg();
    }

    //Nav btn change:Komi face icon -> Menu Close Icon            
    // Hide purple bg color and komi face
    nav_btn.style.setProperty('background-color', 'rgba(0,0,0,0.0)'); //Remove bg color
    komi_face.style.setProperty('opacity', 0);
    menu_close_icon.style.setProperty('opacity', 1); // Make menu_close_icon visible

    // If desktop overlay visible -> hide overlay & make content links clickable again
  } else if (overlay_opacity == 0.5) {
    // Menu Change: Remove whole screen overlay
    screen_overlay.style.setProperty('--overlay_opacity', 0);
    screen_overlay.style.setProperty('--overlay_z-index', -1);
    nav_menu.style.setProperty('right', '-70%'); // Slide Menu to the right out of viewport 

    //Nav Icon Change: Menu Close Icon -> Komi Face Icon
    nav_btn.style.setProperty('background-color', '#5636D8'); // nav-btn bg color purple again
    komi_face.style.setProperty('opacity', 1); // Make komi face visible 

    menu_close_icon.style.setProperty('opacity', 0); // Make menu_close_icon hidden
  }

  // Print to show opacity values being toggled back and forth
  //console.log(overlay_opacity);
});

/* If the user resizes the window for some reason the background image 
   will dynamically change whether it's desktop or mobile
   via Media Qerries in Javascript
*/

var breakpoint = window.matchMedia("(min-width: 50em)"); //Make sure this is the same as the media querry set in the corresponding scss files

function switch_bgImg() {
  if (breakpoint.matches) {
    // If media query matches
    randDesktopBgImg();
    //console.log("switch to desktop");
  } else {
    randMobileBgImg();
    //console.log("switch to mobile");
  }
}
breakpoint.addListener(switch_bgImg); //Weird way to addEventListener
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54629" + '/');
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","pages/Landing_Page/nav-menu.js"], null)
//# sourceMappingURL=/nav-menu.01b896e5.js.map