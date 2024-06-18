//body::before -> sceren_overlay from _nav-menu.scss
import { screen_overlay , showBackdrop, hideBackdrop } from '../../utils/backdrop.js'

const video_cards = document.querySelectorAll('.video-card-wrapper .video-card .video-card__card');
const video_card_containers = document.querySelectorAll('.video-card-wrapper .video-card');

// These 3 are for keyboard accessibility
import {set_elements_tabIndex} from '../../utils/modify_html.js'
const other_focusable_elements = document.querySelectorAll('button:not(button.video_close_btn), a, .img-carousel .img-carousel__track');
const nav_menu_links = document.querySelectorAll('nav.primary-nav .primary-nav__links li a');
    // my actual nav_menu links is already included inside the css selector in other_focusable_elements because I need to somehowget all of the a tags that are in my document
    // but I need this variable to keep my nav menu links untabbale after I close any video card 

// console.log(nav_menu_links);
/*
 Intersection Observer for On-Scroll Animation
 - Intersection Observer instead of scroll event lsitener b/c of performance 
 - On-Scroll Animations look decent on Both MObile and Desktop so going to use one piece of code for both mobile & desktop
 - On-scroll animations should work scrolling up and scrolling down
*/

function setOnScrollAnimation(element, animation) {
    // Put Intersection Observer in function for easier to read syntax and reuseable code for other on-scroll animations

    // On-Scroll Animation
    const observer = new IntersectionObserver(entries => {
        // entries returns an array so have to iterate through it 
        entries.forEach(entry => {
        
            if (entry.isIntersecting) { // Observer only works one way. Only forwards.
                // Not going to use a class ( like '.show') to set style
                //console.log("Entered w/ Function");
                
                // CSS style at start opacity 0 and at end of animation opaicty gets permanently set to 1
                // Opacity starts animating b/c of transition property I've set in corresponding CSS file
                entry.target.style.opacity = 1;
                
                // Video Card 1 & Video Card 2 get different animations
                entry.target.style.animation = animation;
                    
                entry.target.addEventListener("transitionend", () => { 
                    observer.unobserve(entry.target); // Remove Intersection Observer for that element
                });
            }
        })
        }, 
    
        {
        threshold: 0.3, //50% of the element must be visible in viewport before observer gets called
        }
    )
    
    observer.observe(element);
}

setOnScrollAnimation(video_card_containers[0], "right_slide_in 1.6s ease-out");
setOnScrollAnimation(video_card_containers[1], "left_slide_in 1.6s ease-out");


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


// Thank you codepen https://codepen.io/mrminnkhantnaing/pen/RwQjpaK for helping me figure how to play & stop YouTube embed videos with vanilla JS
function stopVideo(iframe) {
    iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}',"*");
}

function playVideo(iframe) {
    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}',"*");
}

// Add click event listener to each video card
// Each video card has their own instance of the click event listener and gets their own attributes & css style set separately
video_cards.forEach((video_card__video) => {
    // video_card__video = the video card button itself

    // If I click on the video card itself, make the video popup visible
    video_card__video.addEventListener('click', c => {
        // No matter the order of HTML elements inside video-card the iframe with popup video class will be selected
        // need to declare variables inside the click event listener for videos to be able to switch with no problems
        const video_popup_container = video_card__video.parentElement.querySelector('.video-card__popup');
        const close_popup_btns = video_popup_container.querySelectorAll('.video_close_btn');
        const iframe_video = video_popup_container.querySelector('iframe'); // This is the actual YouTube embed video
        
        video_card__video.setAttribute('aria-expanded', true);
        video_popup_container.dataset.visible = "show";
        showBackdrop(3);
        
        // Elements that are not apart of video_card (now in the backdrop) become untabbable
        set_elements_tabIndex([other_focusable_elements],-1);
            // my nav menu links are untabble (tabIndex set to -1) in the html document so
            // the only time I will modify the links' tabIndex is through the nav menu button
        
        close_popup_btns[0].focus();

        setTimeout(playVideo(iframe_video), 200); // auto play video with postMessage command 
        
        function close_video_popup() {
            video_popup_container.dataset.visible = "hide";
    
            stopVideo(iframe_video);
            
            // Remove whole screen dark overlay
            hideBackdrop();     

            // Make elements that were in the backdrop tabbale again
            set_elements_tabIndex([other_focusable_elements],0);
            // Remember to keep my nav menu links (nav menu is out of user view) untabbale
            set_elements_tabIndex([nav_menu_links],-1) 

            video_card__video.setAttribute('aria-expanded', false);
            video_card__video.focus(); // Return focus so screen reader users and keyboard users don't get lost in the landing page
        }
        
        iframe_video.contentWindow.postMessage('{"event":"listening","id":1,"channel":"widget"}', '*');
        close_popup_btns.forEach(btn => {
            btn.addEventListener('click', c => { close_video_popup() }, {once: true} ) // Good for website performance. 
            // Event listener will automatically be removed so eventlistener doesn't happen in the background. 
        })

        document.addEventListener('keydown', e => {
            if (e.key === "Escape") {
                close_video_popup();
            }
        }, {once: true})
    })

    
})

