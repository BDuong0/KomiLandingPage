/*
_nav-btn.scss <- CSS
_nav-menu.scss <- CSS
📜 ✅
^ Prototype Javascript -> _nav-btn.scss & _nav-menu.scss

Javascripting done on Nov 3, 2023
*/

import { screen_overlay, showBackdrop, hideBackdrop } from '../../utils/backdrop.js'

// 2 imports and other_buttons variable for dynamically setting tabIndex
import {set_elements_tabIndex} from '../../utils/modify_html.js'
const other_focusable_elements = document.querySelectorAll('button:not(button.nav-btn-icon):not(button.second_close_btn), a:not(ul.primary-nav__links li a), .img-carousel .img-carousel__track');
// other_focusable_elements: get focusable elements that aren't either my nav menu button or my nav menu links.


const nav_btn = document.querySelector(".nav-btn-icon");
const komi_face = document.querySelector(".komi-face");
const menu_close_icon = document.querySelector(".nav-btn-icon svg");

const nav_menu = document.querySelector(".primary-nav");
const second_close_btn = nav_menu.querySelector(".second_close_btn")
const nav_menu_links_wrapper = document.querySelector(".primary-nav__links");
const nav_menu_links = document.querySelectorAll(".primary-nav__links li a");


var mobile_imgs = ["wp7501723-2144181952.jpg","7600fe9fc49fab1a42b.jpg","wp7501703.jpg", "IZ6faD.jpg"];

var desktop_imgs = ["komi_camera_wallpaper.jpg", "Komi-535967116.jpg", "wp7501663.jpg", "452d6a95f.jpg"];
    // You can modify ::before ::after elements with javascript with CSS variables
// https://www.youtube.com/watch?v=LszEboGO_zw

var breakpoint = window.matchMedia("(min-width: 50em)"); //Make sure this is the same as the media querry set in the corresponding scss files
/* ========================
    Nav menu links animation (Desktop Only)
    ======================= */
// Each nav menu link toggle mouse hover event that changes the link's underline element
// Child element modifies parent::after element

function showUnderline(nav_link){nav_link.parentElement.style.setProperty('--underline-width', 1);}
function removeUnderline(nav_link){nav_link.parentElement.style.setProperty('--underline-width', 0);}

nav_menu_links.forEach(nav_link => { // Add multiple event listeners
    // On hover & focus underline shows while expanding from center
    "mouseover focus".split(" ").forEach(event_type => { // Declare multiple event listener types on one element 
        nav_link.addEventListener(event_type, e=>{
            showUnderline(nav_link);
        })
    })
    
    // On mouse leave & loss focus underline width collapses towards center
    "mouseout blur".split(" ").forEach(event_type => { // Declare multiple event listener types on one element 
        nav_link.addEventListener(event_type, e=>{
            removeUnderline(nav_link);
        })
    })
})



/* ========================
    Nav Btn <-> Nav menu Animations
    ======================= */

function randDesktopBgImg() {
    var rand_index = Math.floor(Math.random() * desktop_imgs.length);    
    nav_menu.style.backgroundImage = "url(" + desktop_imgs[rand_index] + ")" ;
}

function randMobileBgImg() {
    var rand_index = Math.floor(Math.random() * mobile_imgs.length);    
    nav_menu.style.backgroundImage = "url(" + mobile_imgs[rand_index] + ")" ;
}

function switch_bgImg() {
    if (breakpoint.matches) { // If media query matches
        randDesktopBgImg();
        //console.log("switch to desktop");
    } else {
        randMobileBgImg();
        //console.log("switch to mobile");
    }
}

breakpoint.addListener(switch_bgImg); //Weird way to addEventListener

    // Toggle Button on CSS Opacity Property to show & hide side nav menu
// 3 main actions of toggle button 
    // Show entire screen overlay
    // Slide side menu from the left into view
    // Genreate random nav menu bg image
    // Change nav btn icon to corresponding status (open/close)

let isNavMenuVisible = false;

function show_nav_menu() {
    // console.log("show_nav_menu called");

    //Menu Change: Make menu visible
    showBackdrop();
        
    nav_btn.setAttribute("aria-expanded", true);
    
    // nav_menu_links.forEach(nav_link => {
    //     nav_link.setAttribute("aria-hidden", false)
    // })

    nav_menu_links_wrapper.setAttribute("aria-hidden", false);

    second_close_btn.setAttribute("aria-hidden", false);

    nav_menu.style.setProperty('right', 0); // Slide Menu into view from the right

    // Make each nav link tabbable 
    set_elements_tabIndex([nav_menu_links, second_close_btn], 0);
    // Make elements in backdrop not tabbable
    set_elements_tabIndex([other_focusable_elements], -1);
    
    // Generate random background image on every nav btn click
        // CSS variable in media querry = Javascript automatic detect media querry
    const menu_mode = getComputedStyle(nav_menu).getPropertyValue("--menu_mode");
    if (menu_mode == "\"desktop\""){
        randDesktopBgImg();
    } else if ((menu_mode == "\"mobile\"")) {
        randMobileBgImg();
    }

    //Nav btn change:Komi face icon -> Menu Close Icon            
        // Hide purple bg color and komi face
    nav_btn.style.setProperty('background-color', 'rgba(0,0,0,0.0)'); //Remove bg color
    komi_face.style.setProperty('opacity', 0);
    
    menu_close_icon.style.setProperty('opacity', 1); // Make menu_close_icon visible
    // If desktop overlay visible -> hide overlay & make content links clickable again
    isNavMenuVisible = true;
}

function hide_nav_menu(){
    // console.log("hide_nav_menu called");   

    // Menu Change: Remove whole screen overlay
    hideBackdrop();

    nav_btn.setAttribute("aria-expanded", false);
    
    // nav_menu_links.forEach(nav_link => {
    //     nav_link.setAttribute("aria-hidden", true)
    // })

    nav_menu_links_wrapper.setAttribute("aria-hidden", true);

    second_close_btn.setAttribute("aria-hidden", true);

    nav_menu.style.setProperty('right', '-70%'); // Slide Menu to the right out of viewport 

    // Make all nav links not tabbable 
    set_elements_tabIndex([nav_menu_links, second_close_btn], -1);
    // Make elements that were in the backdrop, now tabbable
    set_elements_tabIndex([other_focusable_elements], 0);
    
    //Nav Icon Change: Menu Close Icon -> Komi Face Icon
    nav_btn.style.setProperty('background-color', '#5636D8'); // nav-btn bg color purple again
    komi_face.style.setProperty('opacity', 1); // Make komi face visible 
    
    menu_close_icon.style.setProperty('opacity', 0); // Make menu_close_icon hidden
    isNavMenuVisible = false;
}

nav_btn.addEventListener('click', e =>{
    // let overlay_opacity = window.getComputedStyle(screen_overlay, '::before').opacity;
        // tried to create toggle if else branch by reading the opacity property of my body::before element but it seems like on mobile, the opacity property isn't getting read
        // Instead I'm using a temporary variable to set the toggle state of my nav menu
    
    // If overlay hidden -> show overlay & content links cannot be clicked
    if (isNavMenuVisible == false) {
        show_nav_menu();

        second_close_btn.addEventListener("click", e => {
            hide_nav_menu();
            nav_btn.focus();
        }, {once: true} )
    } else if (isNavMenuVisible == true) {
        hide_nav_menu();
    }
        
})

/* If the user resizes the window for some reason the background image 
   will dynamically change whether it's desktop or mobile
   via Media Qerries in Javascript
*/



