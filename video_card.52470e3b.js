parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"f1rW":[function(require,module,exports) {
var e=document.querySelectorAll(".video-card-wrapper .video-card .video-card__card"),r=document.querySelectorAll(".video-card-wrapper .video-card"),o=document.querySelector("body");function t(e,r){var o=new IntersectionObserver(function(e){e.forEach(function(e){e.isIntersecting&&(e.target.style.opacity=1,e.target.style.animation=r,e.target.addEventListener("transitionend",function(){o.unobserve(e.target)}))})},{threshold:.3});o.observe(e)}t(r[0],"right_slide_in 1.6s ease-out"),t(r[1],"left_slide_in 1.6s ease-out"),e.forEach(function(e){var r="empty";e.addEventListener("click",function(t){o.style.setProperty("--overlay_z-index",3),o.style.setProperty("--overlay_opacity",.5),video_popup_container=e.parentElement.querySelector(".video-card__popup"),video_popup_container.dataset.visible="show",popup_wrapper=video_popup_container.querySelector(".popup_wrapper"),iframe_video=video_popup_container.querySelector("iframe"),iframe_video="empty"===r?video_popup_container.querySelector("iframe"):r,!1===Array.from(popup_wrapper.children).includes(iframe_video)&&popup_wrapper.append(r),close_popup_btn=video_popup_container.querySelector(".video_close_btn"),close_popup_btn.addEventListener("click",function(e){r=iframe_video,iframe_video.remove(),video_popup_container.dataset.visible="hide",o.style.setProperty("--overlay_opacity",0),o.style.setProperty("--overlay_z-index",-1)},{once:!0})})});
},{}]},{},["f1rW"], null)