

/*
Website loading animation. 
*/

website_loader_overlay = document.querySelector(".loader");

// Once all HTML loads blur overlay animates to disappear 
window.addEventListener("load", () => {
    website_loader_overlay.style.setProperty('--loader-opaicty', 0); // Same screen_overlay as in nav_menu
    
    // event listener once the opaicty fade out transition ends inside the .loader div
    website_loader_overlay.addEventListener("transitionend", () => {
        // If I don't put the transitionend eventListener then the loader overlay wouldn't have the smooth opaicty animation I wanted
        website_loader_overlay.remove(); // Need to remove the loader div so I can interact with the rest of the stuff my landing page
    });
});


/*
Content and Image On-scroll animation
- On-scroll animations should work scrolling up and scrolling down
*/

const content_n_img = document.querySelector(".content-and-img");

// setONScrollAnimation code copied from video_card.js
// guess function scope is only scoped to the document
// javascript varaibles can cross over to other js files but functions can't crossover

function setOnScrollAnimation(element, animation) {
    //On-scroll animation goes only one way scroll down. Scroll observer doesn't go both scroll up and down.

    const observer = new IntersectionObserver(entries => {
        
        entries.forEach(entry => {
        
            if (entry.isIntersecting) { 
                
                //console.log("Content + Image Entered");
                
                entry.target.style.opacity = 1;
                
                entry.target.style.animation = animation;
                    
                entry.target.addEventListener("transitionend", () => { 
                    observer.unobserve(entry.target); 
                });
            }
        })
        }, 
    
        {
        threshold: 0.7, 
        }
    )
    
    observer.observe(element);
}

setOnScrollAnimation(content_n_img, "fadeinSlideUp 1.6s ease-out");

/*
Final Call to Action Section On-Scroll Animation
- On-scroll animations should work scrolling up and scrolling down
*/

const final_CTA = document.querySelector(".final_CTA");

function bigElementScrollAnimate(element, animation){
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { 
                //console.log("Final Call to Action visible");

                entry.target.style.opacity = 1;
                    
                entry.target.style.animation = animation;
                    
                entry.target.addEventListener("transitionend", () => { 
                    observer.unobserve(entry.target); 
                });
            }
        })
    }, 
    {
        root: null,
        threshold: 0,
        rootMargin: "-50% 0px -50% 0px", // If top or bottom of element crosses the horizontal middle of the screen
    })

    observer.observe(element);
}
    

bigElementScrollAnimate(final_CTA, "scaleUpReveal 2s ease-out");

    

    


