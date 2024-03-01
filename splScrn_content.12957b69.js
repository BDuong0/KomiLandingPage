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
})({"splScrn_content.js":[function(require,module,exports) {
var splScrn_container = document.querySelector('.splScrn-container');
var left_side_imgs = document.querySelectorAll('.splScrn-container .splScrn-group .splScrn-group__img');
var right_side_text = document.querySelectorAll('.splScrn-container .splScrn-group .splScrn-group__content-wrap');
var Img_Content_Groups = document.querySelectorAll('.splScrn-container .splScrn-group');
var breakpoint = window.matchMedia("(min-width: 39.5em)"); //Make sure this is the same as the media querry set in the corresponding scss files

var mobile_Observer = new IntersectionObserver(function (entries) {
  // entries returns an array of one but this is the only way we can access the element in the IntersectionObserver in order to change the element style
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      // IF branch detected on scroll down                
      entry.target.style.opacity = "1";
    } else {
      // ELSE branch deteced on scroll up
      // Need to have the if else for isIntersecting so my observer can work scrolling both up an down
      entry.target.style.opacity = "0.1";
    }
  });
}, {
  threshold: [0],
  // Have threshold 0 and rootMargin so no matter how big the img_content_group is the observer will detect at the same point on the viewport
  rootMargin: '-230px 0px -230px 0px' // If I said treshold 0.3 then 0.3 of a bigger img_content_group will ahve a different detecting point than a smaller one which isn't what I want
});
var tablet_desktop_Observer = new IntersectionObserver(function (entries) {
  // Similar code structure as mobile_Observer
  entries.forEach(function (entry) {
    var image = entry.target.querySelector('.splScrn-group__img');
    if (entry.isIntersecting) {
      // console.log(image);
      entry.target.style.opacity = "1";
      image.style.opacity = "1"; // Need to have this or else my images will pernamently disappear on scroll
      // also make sure to have transition property set on the images, not just the parent container so there's no jarring transition between the left side images
    } else {
      entry.target.style.opacity = "0.1";
      image.style.opacity = "0";
    }
  });
}, {
  threshold: [0],
  // Have threshold 0 and rootMargin so no matter how big the img_content_group is the observer will detect at the same point on the viewport
  rootMargin: '-230px 0px -230px 0px' // If I said treshold 0.3 then 0.3 of a bigger img_content_group will ahve a different detecting point than a smaller one which isn't what I want
});
function watchViewportChange() {
  if (breakpoint.matches) {
    console.log('Tablet/Desktop View');

    // Turn off mobile observer for all img_content_group
    Img_Content_Groups.forEach(function (img_content_group) {
      mobile_Observer.unobserve(img_content_group);
    });

    // All img_content_groups now observed by tablet_desktop_Observer
    Img_Content_Groups.forEach(function (img_content_group) {
      tablet_desktop_Observer.observe(img_content_group);
      console.log('watching');
    });
  } else {
    console.log('Mobile View');

    // Remove tablet_desktop_Observer for all img_content_groups
    Img_Content_Groups.forEach(function (img_content_group) {
      tablet_desktop_Observer.unobserve(img_content_group);
    });

    // Switch to the mobile_Observer for all img_cotnent_groups
    Img_Content_Groups.forEach(function (img_content_group) {
      // Make sure to reset image opacity if fluid change from tablet to mobile 
      var image = img_content_group.querySelector('.splScrn-group__img');
      image.style.opacity = "1";
      mobile_Observer.observe(img_content_group);
    });
  }
}

// Switch between mobile_Observer and tablet_desktop_Observer based on media querry set in CSS
// Different observers have different variations of a scroll animation
watchViewportChange();
breakpoint.addListener(watchViewportChange);

// Not perfect
// When I try to zoom in on tablet/desktop there's a point like at 140% where the opacity of all of my images and content goes to 0
// I think it's because I'm hitting the tablet_desktop_observer isIntersecting property when I zoom in on the screen.
// Images and content don't transition in between each other at the same time by a cm or two but 99% of the image and content transitions works.
// It works on scroll down but there's a slight gap in timing when slowly scrolling up
},{}],"../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57224" + '/');
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
},{}]},{},["../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","splScrn_content.js"], null)
//# sourceMappingURL=/splScrn_content.12957b69.js.map