import { screen_overlay , showBackdrop, hideBackdrop } from '../../utils/backdrop.js'
import {set_elements_tabIndex} from '../../utils/modify_html.js'


const pfp_card_gallery_wrapper = document.querySelector('.pfp-card-gallery');
const pfp_card_containers = document.querySelectorAll('.pfp-card-gallery .pfp-card-container');
const pfp_card_btn_cards = document.querySelectorAll('.pfp-card-gallery .pfp-card-container .pfp-card');
const other_focusable_stuff = document.querySelectorAll('a:not(div.pfp-card-gallery a)'); // My <a> tag with innerText 'Komi wiki'
// Figure out CSS selector that selects all focusable elements outside of my '.pfp-card-gallery' div container
const info_cards = document.querySelectorAll('.pfp-card-gallery .pfp-card-container .pfp-card__info-card');

pfp_card_containers.forEach(container => {
    
    /*  ===================================
        profile card in gallery interacts with its respective info card
        ===================================
    */
    
    // pfp_card (nesting explained)
    //    - info_card
    //         - picture_slider

    // ====== Profile Card -> Info Card =====
    const pfp_card = container.querySelector('.pfp-card') 
    const info_card = container.querySelector('.pfp-card__info-card');
    const info_card__list_viewbox = info_card.querySelector('.pfp-card__info-card__wrapper .info-card__header .info-card__header_content .info-card__header_list-viewbox'); //I applied a overflow y scroll to this div with content about some trivia facts about a character
    const info_card_list_content = info_card__list_viewbox.querySelector('.info-card__header_list');
    const close_info_card_btns = info_card.querySelectorAll('.pfp-card__info-card__wrapper .info-card__close-btn');
    // I want to prevent nested elements from triggering an event for parent element. This concept is called event bubbling.
    // Solution 1: If you are using nested html elements, use the stopPropagation method to stop the event bubbling and event capturing
    // Solution 2: Use a wrapper/container div and put your 'parent' and 'child' element as adjacent div containers
    let info_card_trigger = "";
    
    function does_listContent_overflow(){
        // compare info_card_list_content and info_card__list_viewbox to see if the content overflows or not
        let list_viewbox_height = info_card__list_viewbox.getBoundingClientRect().height;
        let list_content_height = info_card_list_content.getBoundingClientRect().height;

        if (list_content_height > list_viewbox_height) { // Does content overflow out of the viewbox
            return true;
        } else { // Content is smaller than the viewbox
            return false;
        }
    }
    
    const resizeObserver = new ResizeObserver(entries => { // Watch the for size changes of DOM elements themselves, not the viewport like a media querry.
        if (does_listContent_overflow() === true) {
            // Add event listeners and top and bottom scroll shadows visible
            "scroll touchmove".split(" ").forEach(event_type => { // Declare multiple event listener types on one element 
                info_card__list_viewbox.addEventListener(event_type, watch_scroll);  
            })
            
            watch_scroll(); // Fluid design when you transition from desktop to mobile shadows will appear right, not when you have to scroll first then they appear.

            info_card__list_viewbox.tabIndex = 0; // Not all browsers(e.g.  Edge) consider a div with y-overflow scroll as part of the default focusable elements
        } else {
            // Remove all event listeners and make hide all scroll shadows
            "scroll touchmove".split(" ").forEach(event_type => {
                info_card__list_viewbox.removeEventListener(event_type, watch_scroll);
            })
            info_card__list_viewbox.style.setProperty('--top-scroll-shadow-opacity', 0);
            info_card__list_viewbox.style.setProperty('--bottom-scroll-shadow-opacity', 0);

            info_card__list_viewbox.tabIndex = -1;
        }
    })

    function watch_scroll(){
        let scroll_detect_padding = 10;
        let list_scroll_pos = info_card__list_viewbox.scrollTop; // scrollTop: get the position of where are you on the vertical scroll bar 
        let list_scrollMax = info_card__list_viewbox.scrollHeight - info_card__list_viewbox.clientHeight - scroll_detect_padding; // how far to the bottom can you scroll down 
        // scrollTopMax is not supported on all browsers/devices so have to use scrollHeight and clientHeight which got the code working on my iPhone
        // scrollHeight: Total height of the element including the content that's overflowing outside of it
        // clientHeight: Height of element excluding borders, margins, and scrollbars

        let set_topSadow_opacity = getComputedStyle(info_card__list_viewbox).getPropertyValue('--top-scroll-shadow-opacity');
        let set_bottomSadow_opacity = getComputedStyle(info_card__list_viewbox).getPropertyValue('--bottom-scroll-shadow-opacity');
        // console.log(getComputedStyle(info_card__list_viewbox).getPropertyValue('--top-scroll-shadow-opacity'));

        if (list_scroll_pos <= 0 + scroll_detect_padding){ // Is the scroll at the bottom
            // <= b/c on mobile you can overshoot the scrollbar 
            // console.log('reach the top');
            set_topSadow_opacity = 0;
            set_bottomSadow_opacity = 1;
            info_card__list_viewbox.style.setProperty('--top-scroll-shadow-opacity', set_topSadow_opacity);
            info_card__list_viewbox.style.setProperty('--bottom-scroll-shadow-opacity', set_bottomSadow_opacity);
        } else if(0 < list_scroll_pos && list_scroll_pos < list_scrollMax) { // Scroll in between bottom and top
            // console.log('in the middle');
            set_topSadow_opacity = 0.6;
            set_bottomSadow_opacity = 0.6;
            info_card__list_viewbox.style.setProperty('--top-scroll-shadow-opacity', set_topSadow_opacity);
            info_card__list_viewbox.style.setProperty('--bottom-scroll-shadow-opacity', set_bottomSadow_opacity);
        } else if(list_scroll_pos >= list_scrollMax){ // Scroll is at the very top
            // Tried adding my scroll_detect_padding to my list_scrollMax inside the else if but it didn't work so will have to settle with adding it in the variable declaration
            // console.log('reach the bottom');
            set_topSadow_opacity = 1;
            set_bottomSadow_opacity = 0;
            info_card__list_viewbox.style.setProperty('--top-scroll-shadow-opacity', set_topSadow_opacity);
            info_card__list_viewbox.style.setProperty('--bottom-scroll-shadow-opacity', set_bottomSadow_opacity);
        }       
    }

    pfp_card.addEventListener('click', (e) => {
        showInfoCard();

        const card__index = Array.from(pfp_card_btn_cards).indexOf(pfp_card);
        info_card_trigger = pfp_card_btn_cards[card__index];
    })

    function showInfoCard() {
        showInfoCard__modifyCSS();
        showInfoCard__addEscapeKeyListener();
        showInfoCard__makeAccessible();
    }

    function showInfoCard__modifyCSS(){
        showBackdrop();
        info_card.dataset.visible = "show"; // <<
        setTimeout(() => {info_card.style.opacity = 1;}, 0.0001); // << : Need setTimeout or else opacity animation won't activate
        
        // Set up scroll shadows on our trivia/quick fact list section of the info card
        info_card__list_viewbox.scrollTop = 0; // On webpage refresh make sure scroll position is always 0
            // Check to see if there's always overflowing content to vertically scroll
            // Only enable scroll shadows if there's overflowing content 
        if (info_card_list_content.clientHeight > info_card__list_viewbox.clientHeight){
            info_card__list_viewbox.style.setProperty('--top-scroll-shadow-opacity', 0);
            info_card__list_viewbox.style.setProperty('--bottom-scroll-shadow-opacity', 1);
            // console.log('Property Set')
        } 

        // Watch the size of the list viewbox and content to dynamically enable scroll shadows as the viewbox changes size as the viewport changes size
        // - content that overflow on mobile may not overflow on tablet/desktop so need to dynamically change scroll shadows
        resizeObserver.observe(info_card__list_viewbox);
        resizeObserver.observe(info_card_list_content);
    }

    function showInfoCard__addEscapeKeyListener() {
        window.addEventListener("keyup", (e) => {
            if (e.key === "Escape" && info_card.dataset.visible == "show") {
              closeInfoCard();
            }
        })
    }

    close_info_card_btns.forEach(close_btn => {
        close_btn.addEventListener('click', e => {
            closeInfoCard();
        })
    })
    

    function showInfoCard__makeAccessible(){
        // ==== Modify Accessbility Attributes ====
        
        // ARIA Attributes
        info_card.setAttribute("aria-hidden", false);
        pfp_card.setAttribute("aria-hidden", true);
        pfp_card_containers.forEach(card_container => { // Hide all other pfp cards in the backdrop from screen reader
            if (card_container != container) {
                card_container.setAttribute("aria-hidden", true);
            }
        })

        // --- Tabindex and Focus ---

        // pfp_cards (<- these elements are in the backdrop)
        //    - info_card (<- one info card is opened at a time so I only want to be able to focus on elements in info_card)
        //         - picture_slider

        // Remove focus on elements behind the backdrop: 
        // When user clicks on a character card to open their info card, all of the buttons in the backdrop should not be able to be focusable
        // I don't want to be able to tab through elements behind my backdrop.
        // If I open my info card, I just want to be able to tab through all of the elements inside my info card, not any elements outside of it
        set_elements_tabIndex([pfp_card_btn_cards,other_focusable_stuff,pfp_card],-1);

        close_info_card_btns[0].focus(); // Direct focus right away to first element inside the info card modal       
    }

    function closeInfoCard() {
        closeInfoCard__modifyCSS();
        closeInfoCard__makeAccessible();
    }

    function closeInfoCard__modifyCSS(){
        hideBackdrop();
        
        info_card.style.opacity = 0; // >>
        picture_slider.dataset.visible = "hide"; // close both the picture slider and info, if you click escape from the picture slider

        info_card.addEventListener('transitionend', e => { // >>
            info_card.dataset.visible = "hide"; // <<
            // Remove all picture slider nav items if close_into_btn is clicked from the picture slider view
            // - Do this so the next time you open the picture slider all of the picture slider images will repopulate
            remove_slider_track_images();

            // Remove unnecessary event listeners for website performance
            "scroll touchmove".split(" ").forEach(event_type => { // Declare multiple event listener types on one element 
                info_card__list_viewbox.addEventListener(event_type, watch_scroll);  
            })

        }, {once: true}) // << : Need to include this argument b/c if I don't when I try to open my info_card. The info_card immediately disappears.
                        // This is b/c the transitionend event listener is still alive. We need to kill this event once it has finished running, so it isn't active for the rest of the program. 
        // (<<) Use transitionend, setTimeout and {once: true} event-listner argument to create animation from display: none 
        // display:none animation is done primarly by the css transition property
    }

    function closeInfoCard__makeAccessible() {
        // ==== Modify Accessibility Attributes ====
        info_card.setAttribute("aria-hidden", false);
        pfp_card.setAttribute("aria-hidden", false);
        pfp_card_containers.forEach(card_container => {
            if (card_container != container) {
                card_container.setAttribute("aria-hidden", false);
            }
        })
        
        // = Enable focus on elements that were behind the backdrop(that's now removed on close) =
        // Character Gallery ('home')
        // pfp_card 
        //    - info_card (<- You are here)
        //         - picture_slider (<- or you ou are here)
        
        // ==== Make Sure Focus is Properly Set ====
        set_elements_tabIndex([pfp_card_btn_cards,other_focusable_stuff],0); // If I close the info card from the picture slider window. Restore focus to info_card elements so they can be tabbed through again the next time user opens a card
        set_elements_tabIndex([info_card__list_viewbox, btn_info_card_pictures ,close_info_card_btns],0); // This function will still run if I click the close info button from the info card and that's okay. I'm not going to change this line of code.
        does_listContent_overflow() ? info_card__list_viewbox.tabIndex = 0 : info_card__list_viewbox.tabIndex = -1;

        // Restore focus by returning focus to button the user was on before they opened an info card
        info_card_trigger.focus();
    }

    // ===================================
    // info card pictures interact with picture slider
    // =================================== 

    // Info card content
    const li_info_card_pictures = info_card.querySelectorAll('.pfp-card__info-card__wrapper .info-card__pictures li');
    const btn_info_card_pictures = info_card.querySelectorAll('.pfp-card__info-card__wrapper .info-card__pictures li button');

    // Picture slider content
    const picture_slider = container.querySelector('.info-card__picture-slider'); // Main Parent container 
    const close_slider_btns = picture_slider.querySelectorAll('.picture-slider__close-btn');
    const slider_img_track = picture_slider.querySelector('.picture-slider__container .picture-slider__nav .picture-slider__nav-track-container .picture-slider__nav-track');
    let slider_img_track__images = slider_img_track.querySelectorAll(".picture-slider__nav-item"); // initially this will return null, but will be not null when I querry select again in showPictureSlider()
    const slider_viewbox_image = picture_slider.querySelector('.picture-slider__container .picture-slider__view-box img');
    const slider_left_btn = picture_slider.querySelector('.picture-slider__container .picture-slider__nav-left-btn');
    const slider_right_btn = picture_slider.querySelector('.picture-slider__container .picture-slider__nav-right-btn');
    let picture_slider_trigger = ""; // Which button in 

    // ========== Info Card -> Picture Slider ==============
    li_info_card_pictures.forEach( (picture, index_clicked) => {
        picture.addEventListener('click', e => {
            showPictureSlider(picture, index_clicked);

            picture_slider_trigger = btn_info_card_pictures[index_clicked];
            picture_slider_trigger.setAttribute("aria-expanded", "true");
        })
    })

    function showPictureSlider(picture, index_clicked) {        
        // ------ Show Slider -----
        picture_slider.dataset.visible = "show"; 
        setTimeout(() => {picture_slider.style.opacity = 1;}, 0.0001);   

        slider_img_track.style.scrollBehavior = "auto"; // Don't want to open my picture slider in the middle of a smooth scroll animation. I just want a jump
        
        showPictureSlider__initalizeSliderTrack(index_clicked);

        setTimeout(() => {slider_img_track.style.scrollBehavior = "smooth"}, 0.001);   

        // Initalize slider viewbox the first time the user is shown the picture slider modal
            // Show picture slider window with picture you clicked on from inside the info card pic gallery
            // li -> button -> img
        let clicked_image = picture.firstChild.firstElementChild.src
        slider_viewbox_image.src = clicked_image;
        
        // ------ Runtime Event Listeners -----
        slider_img_track__images.forEach(track_item => {
            track_item.addEventListener('click', e => {
                const track_img__radio_input = track_item.children[0];
                const track_item__image_src = track_item.children[1].firstElementChild.src;

                // On the current image user is viewing, make it unactive and unchecked
                // current_slider_img.classList.toggle("active");
                // current_slider_img.children[1].checked = false;
                
                // current_slider_img = track_img; // Set current_slider_img the next time user clicks on other images on the slider track
                
                // The slider image the user just now clicked on will become active and checked
                // track_img.classList.toggle("active");
                // track_img__radio_input.checked = true;
                slider_viewbox_image.src = track_item__image_src; // get image inside label 
            })
        })

        var scroll_width = slider_img_track.getBoundingClientRect().width;
        slider_right_btn.addEventListener('click', e => {
            // Move slider track
            slider_img_track.scrollLeft += scroll_width;

            // Animate slider track slide. Restart animation onclick when clicking at the end/middle of animation.
            slider_right_btn.style.animation = ""; // Need to 'remove' animation if I want to restart animation clicking during the middle of an onclick animation
            void slider_right_btn.offsetWidth; // "Triggering reflow" This is important for animation to reset on click. Works mid way through animation and after previous animation is complete.
            slider_right_btn.style.animation = "btn_press_animation 400ms ease-out";
        })

        slider_left_btn.addEventListener('click', e => {
            slider_img_track.scrollLeft -= scroll_width;
            
            slider_left_btn.style.animation = "";
            void slider_left_btn.offsetWidth;
            slider_left_btn.style.animation = "btn_press_animation 400ms ease-out";
        })

        close_slider_btns.forEach(close_btn => {
            close_btn.addEventListener('click', e=> {    
                does_listContent_overflow() ? info_card__list_viewbox.tabIndex = 0 : info_card__list_viewbox.tabIndex = -1; // I don't want my list viewbox to be tabbale, because for some info cards the content doesn't overflow
                
                // I need to somehow reset the nav indicators the next time the user opens the same picture slider. When I open the pic slider the 2nd time I don't want two nav items to have my white border indicator style. I just want one nav item to have this indicator.
                // I thought of an efficient solution of just deleting the nav items and insert them back in when the user opens the slider again since I don't need to have the nav items in the background if only 1 picture slider can be opened at a time
                remove_slider_track_images();
        
                // Close picture slider window 
                picture_slider.style.opacity = 0;
                picture_slider.addEventListener('transitionend', e => { 
                    picture_slider.dataset.visible = "hide";
                }, {once: true})
        
                // ==== Modify Accessbility Attributes ====
        
                // ARIA Attributes
                info_card.setAttribute("aria-hidden", false);
                picture_slider_trigger.setAttribute("aria-expanded", "false");
        
                // Tabindex & Focus
                // Restore focus to info_card elements that were in the backdrop (technically they were just covered up by the slider window)
                // pfp_card 
                //    - info_card (<- you return here)
                //         - picture_slider (<- You click the close button here)
                set_elements_tabIndex([btn_info_card_pictures ,close_info_card_btns],0);

                picture_slider_trigger.focus() // Return focus to button user was on before they opened the picture slider
            }, {once: true})
        })

        // ==== Modify Accessbility Attributes ====

        // ARIA Attributes
        info_card.setAttribute("aria-hidden", true);

        // Tabindex & Focus
        // Info_card becomes apart of the backdrop. Remove focus from all focusable-elements in info_card so they can't be tabbed through.
            // not going to make close_info_btn untabble even though it's technically in the backdrop
        set_elements_tabIndex([info_card__list_viewbox, btn_info_card_pictures],-1);    

        close_slider_btns[0].focus();
    }

    function showPictureSlider__initalizeSliderTrack(index_clicked){
        /*  ==== Prepare Slider ==== */
        // Duplicate pictures in picture gallery inside the info card into the picture slider track
        populate_pic_slider(li_info_card_pictures, slider_img_track); // Cycle of on open populate the pic slider, deleting the pic slider on close -> repeat
        // Remember the all slider items are getting removed when the slider is closed and repopulated
        // So no need to figure out how to run this populate_pic_slider() only once

        const number_slides_in_scroll_group = Number(getComputedStyle(picture_slider).getPropertyValue("--each-scroll-group-number-of-items"));
        console.log("number_slides_in_scroll_group: " + number_slides_in_scroll_group);
        // Set the slider_img_track.scrollLeft so the user immediately sees the image they clicked on in the slider nav upon opening
        set_inital_slider_pos(index_clicked, number_slides_in_scroll_group, li_info_card_pictures, slider_img_track);

        // Indicate current active image in the slider nav
        slider_img_track__images = slider_img_track.querySelectorAll(".picture-slider__nav-item");
        const current_slider_img = slider_img_track__images[index_clicked]; // Which slider image is being viewed in the viewbox right now
        const current_slider_img__radio_input = current_slider_img.children[0];
        current_slider_img__radio_input.checked = true;
    }

    function remove_slider_track_images(){
        if (slider_img_track__images.length > 0){
            slider_img_track__images.forEach(img => {
                img.remove();
            })
        }
    }
    
})

function populate_pic_slider(info_card_pics, slider_track){
    // TLDR: Transform all image elements in info_card and fill up the picture slider track with the new transformed image elements
    // Every Parent li - Child img gets converted to a Parent div - child img element and append the converted element to the picture slider track div as child elements
    // End product should be all of the pictures in the picture slider track are the same pictures in the info_card pic gallery
    info_card_pics.forEach( (picture,index) => {
        /* picture is an li element:
            <li><button>
                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F71%2Fbc%2Fc2%2F71bcc23efae3c87b49b780c2feb5b851.jpg">
                <span class="visually-hidden">View Image</span>
            </button></li>

            The picture stored in the <li> gets converted into a div the serves as the "picture-slider__nav-item":

            Goal is to produce this html for each of the info card pictures:
            <div class="picture-slider__nav-item">
                <input id="Image_1" type="radio">
                <label for="Image_1">
                    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F71%2Fbc%2Fc2%2F71bcc23efae3c87b49b780c2feb5b851.jpg" alt="Whatever alt text is here">
                </label>
            <div>
        */
       
       // Create label with 'picture-slider__nav-item' class which we will nest all of the other elements in
       const picture__index = String(Array.from(info_card_pics).indexOf(picture));

        var temp_track__item = document.createElement('div');
        temp_track__item.className = "picture-slider__nav-item";

            // Nest radio input inside div
        let radio_name = "Image_" + picture__index;
        
        var temp_track_item__radio_input = document.createElement('input');
        temp_track_item__radio_input.type = "radio";
        temp_track_item__radio_input.name = "Picture Carousel controls";
        temp_track_item__radio_input.id = radio_name;
        temp_track__item.appendChild(temp_track_item__radio_input);

            // Nest label inside div
        var temp_track__radio_label = document.createElement('label');
        temp_track__radio_label.htmlFor = radio_name;
        temp_track__item.appendChild(temp_track__radio_label);

                // Nest img inside the label
                    // picture is: 
                    // <li>
                    //    <button aria-expanded="false">
                    //      <img src="{}" alt="{}">
                    //    </button>
                    // </li>
        const picture__image_src = picture.firstChild.firstElementChild.src;
        const picture__image_label = picture.firstChild.firstElementChild.alt;
        var temp_track_item__pic = document.createElement('img');
        temp_track_item__pic.src = picture__image_src; // li -> button -> img (<- access this)
        temp_track_item__pic.alt = picture__image_label;
        temp_track__radio_label.appendChild(temp_track_item__pic);

        // Add parent and child element to slider_track div
        slider_track.appendChild(temp_track__item);
    })
}

function set_inital_slider_pos(index_clicked, cards_in_group, info_card_pictures, slider_img_track){
    // 1: Calculate number of scroll groups based on width of scroller track visible
    let num_of_scroll_groups = Math.ceil(info_card_pictures.length / cards_in_group);
        // Need to round up the num of scroll groups b/c if I have 12 cards / 5 cards in one group = 2.4 -> 2 groups(5 cards each) but the 2 extra cards left wouldn't get detected by the for loop before and the scroll position would be set to 0 even though 2nd last or very last photo on nav was selected
        // Always round up to account for numbers that don't evenly divide by cards_in_group (like 12 / 5 would get us two groups of five and two extra cards that are part of the third group)
    // Adjust slider track placement so if you click on 1st or 14th image from the info_card the slider will be positioned so the image you clicked on it visible
    // We don't want user to click on 14th image and then having to scroll over all the way to the right to see the image with the indicator shown. The image should already be visible so the user doesn't have to scroll.

    // 2️: Find out what num scroll group the info card picture you clicked on
    
    let group_index_start = 0;
    let group_index_end = cards_in_group - 1; // 5 cards in one scroll group so indexs are 0,1,2,3,4
    let located_card_group;
    
    for (let i = 1; i <= num_of_scroll_groups; i++){
        
        if (group_index_start <= index_clicked && index_clicked <= group_index_end){
            located_card_group = i;
        }
        group_index_start += cards_in_group;
        group_index_end += cards_in_group;

        // Go through each scroll group: Group 1 [0.4] -> Group 2 [5,9] -> Group 3 [10, 14] -> X amount of groups
    }
        
    // 3: Set slider inital position
    let scroll_width = slider_img_track.getBoundingClientRect().width; // Width of one scroll group of 5 cards (cards_in_group)
    // console.log(slider_img_track.scrollLeft);
    slider_img_track.scrollLeft = scroll_width * (located_card_group - 1); // Set slider position so located_card_group is visible upon opening
    // Group 1's scroll_width should be 0 not ~270 so have to offset located_card_group by -1 if I want the corrent scrollLeft value
}