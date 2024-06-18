
let anime_reviews = [];

async function getReviewData(){
    try {
        // 48926 is the id for Komi can't Communicate Season 1 Anime
        const response = await fetch('https://api.jikan.moe/v4/anime/48926/reviews');
        const json_object = await response.json();

        // Going to try to use '...' spread operator which essentially spreads the items of an array into separate items
        anime_reviews.push(...json_object.data);
        
        // need the getReviewData() async function to finish populating data before trying to access elements
            // Can't access elements in global scope b/c element access would run before getReviewData() would be finished
            // I can manipulate/process the fetched data how I want inside the processReviewData()
        processReviewData();
        populateHTMLpage(); // Calling this function inside the async function is the only way I can get the API data first and then add the event listeners to work
        // If I don't do this then my reivews will populate but the if (entire_content_height > min_content).... branches won't run in time
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function strLiteral_to_html(html) {
    const template = document.createElement("template");

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}

const reviews_wrapper = document.querySelector('.review_wrapper');

async function processReviewData(){
    anime_reviews.forEach(malUser => {

        let output_username = malUser.user.username; 
        let processed_review = malUser.review.replace(/\n/g, "<br>");
            // Need to process the review because I need to include the \n characters so user putted in their original review. I don't want just to display one huge block of text.
            // Relpace "  " double spaces with consecutive <br> tags
            // \n = newline character
        let temp_pfp = ``;
    
        // Use svg as default icon if there's no pfp image url or use the image url that's inside the json object as the pfp
        if (malUser.user.images.jpg.image_url.length = 0){
            // console.log('svg');
            temp_pfp = `<svg class="pfp__img" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="white" d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142a.75.75 0 1 1-1.498.07a4.5 4.5 0 0 0-8.99 0a.75.75 0 0 1-1.498-.07a6.004 6.004 0 0 1 3.431-5.142a3.999 3.999 0 1 1 5.123 0M10.5 5a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0 5 0"/></svg>`
        } else {
            // console.log('img tag');
            temp_pfp = `<img class="pfp__img" src="${malUser.user.images.jpg.image_url}" alt=""></img>`;
        }

        const temp_element = strLiteral_to_html(`
        <div class="review">
            <div class="review__header">
                <div class="review__pfp">
                    ${temp_pfp}
                </div>
                <h2 class="review__username ff-accent fw-bold">${output_username}</h2>
            </div>
            <div class="review__content" data-collapsed="false">
                <p>${processed_review}</p>
            </div>
            <button class="review__collapse-btn" data-btn-state="expand" aria-expanded="false">
                <svg class="collapse__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m7 10l5 5m0 0l5-5"/></svg>
                <p class="collapse__text" aria-hidden="true">Read More</p>
                <span class="visually-hidden">Toggle Full Review Text</span>
            </button>
        </div>
        `)

        reviews_wrapper.appendChild(temp_element);
    })
}


function populateHTMLpage() {
    const all_reviews = document.querySelectorAll('.review_wrapper .review');
    
    all_reviews.forEach(review => {
        const review_header = review.querySelector('.review__header');
        const review_content = review.querySelector('.review__content');
        const review__collapse_btn = review.querySelector('.review__collapse-btn');
        const review__collapse_text = review__collapse_btn.querySelector('.collapse__text');
    
        
        const content_pText = review_content.firstElementChild;
        // Wanted to set size of content shown via Javascript b/c I want to account for different content sizes which I can't do easily in CSS
        const content_font_size = Number(window.getComputedStyle(content_pText).getPropertyValue("font-size").replace(/px$/, '')); // Get the font-size without the 'px'
        const min_content = content_font_size * 13;// mimic 13ch which I want as the minimum height of content shown
        const entire_content_height = content_pText.scrollHeight; // Kind of like scrollHeight but without the scrolling. Get the height of the content, including content that overflows.
        
        if (entire_content_height > min_content) { // Only enable collapsible on reviews that have more than 13ch of content
        
            // Set inital state of collpasible content on website load
            review__collapse_btn.dataset.btnState = "collapse";
            review_content.style.setProperty("grid-template-rows", min_content + "px");
        
            review__collapse_btn.addEventListener('click', e => { 
        
                // Could have added transition animations for collapsing and expanding content with simple 0.3fr <-> 1fr with css attributes but wanted to do differently
                    // The only ways I can animate the grid-template-row properties is with ch and fr units which do work but didn't yeild the result I wanted
                    // 0.3fr looks different for different content sizes, but I want all content sizes to collapse at the same point
                    // I get to keep the height: 'auto' / 'fit-content' aspect by expanding the content all the way up to its entire height(scrollHeight)
                    // I get to use mainly just the grid-template-rows property to animate and I hope this yeilds better performance 
                    // At the end I still have to use fixed pixel units, which I made auto-calculations for
                let btn_state = review__collapse_btn.dataset.btnState;
                
                // Simple toggle button that toggles between showing extra content and collapsing it
                if (btn_state == "expand") {
                    review__collapse_btn.dataset.btnState = "collapse";
                    review__collapse_btn.setAttribute("aria-expanded", false);
                    review_content.style.setProperty("grid-template-rows", min_content + "px");
                    review__collapse_text.innerHTML = "Read More";
                } else if(btn_state == "collapse") {
                    review__collapse_btn.dataset.btnState = "expand";
                    review__collapse_btn.setAttribute("aria-expanded", true);
                    review_content.style.setProperty("grid-template-rows", entire_content_height + "px");
                    review__collapse_text.innerHTML = "Read Less";
                }
            })
    
        } else {
            review__collapse_btn.remove();
        }
    
    })
}

getReviewData();
// One function sequentially calls others function until previous function is done
//  getReviewData() -> processReviewData() -> populateHTMLpage();





