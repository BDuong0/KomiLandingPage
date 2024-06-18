

const splScrn_container = document.querySelector('.splScrn-container');
const left_side_imgs = document.querySelectorAll('.splScrn-container .splScrn-group .splScrn-group__img');
const right_side_text = document.querySelectorAll('.splScrn-container .splScrn-group .splScrn-group__content-wrap');

const Img_Content_Groups = document.querySelectorAll('.splScrn-container .splScrn-group');

let breakpoint = window.matchMedia("(min-width: 39.5em)"); //Make sure this is the same as the media querry set in the corresponding scss files

const mobile_Observer = new IntersectionObserver(entries => {
    // entries returns an array of one but this is the only way we can access the element in the IntersectionObserver in order to change the element style
    entries.forEach(entry => {
        if (entry.isIntersecting) { // IF branch detected on scroll down                
            entry.target.style.opacity = "1";
            
        } else { // ELSE branch deteced on scroll up
            // Need to have the if else for isIntersecting so my observer can work scrolling both up an down
            entry.target.style.opacity = "0.1";
        }
    })

}, 
{
    threshold: [0], // Have threshold 0 and rootMargin so no matter how big the img_content_group is the observer will detect at the same point on the viewport
    rootMargin: '-230px 0px -230px 0px' // If I said treshold 0.3 then 0.3 of a bigger img_content_group will ahve a different detecting point than a smaller one which isn't what I want
    
})

const tablet_desktop_Observer = new IntersectionObserver(entries => {
    // Similar code structure as mobile_Observer
    entries.forEach(entry => {
        let image = entry.target.querySelector('.splScrn-group__img');
        if (entry.isIntersecting) { 
            // console.log(image);
            entry.target.style.opacity = "1";
            image.style.opacity = "1"; // Need to have this or else my images will pernamently disappear on scroll
                                        // also make sure to have transition property set on the images, not just the parent container so there's no jarring transition between the left side images
        } else { 
            entry.target.style.opacity = "0.1";
            image.style.opacity = "0";
        }
    })

}, 
{
    threshold: [0], // Have threshold 0 and rootMargin so no matter how big the img_content_group is the observer will detect at the same point on the viewport
    rootMargin: '-230px 0px -230px 0px' // If I said treshold 0.3 then 0.3 of a bigger img_content_group will ahve a different detecting point than a smaller one which isn't what I want
    
})


function watchViewportChange(){
    if (breakpoint.matches) {
        // console.log('Tablet/Desktop View');
        
        // Turn off mobile observer for all img_content_group
        Img_Content_Groups.forEach(img_content_group => {
            mobile_Observer.unobserve(img_content_group);
        })

        // All img_content_groups now observed by tablet_desktop_Observer
        Img_Content_Groups.forEach(img_content_group => {
            tablet_desktop_Observer.observe(img_content_group);
            console.log('watching');
        })
    } else {
        // console.log('Mobile View');

        // Remove tablet_desktop_Observer for all img_content_groups
        Img_Content_Groups.forEach(img_content_group => {
            tablet_desktop_Observer.unobserve(img_content_group);
        })

        // Switch to the mobile_Observer for all img_cotnent_groups
        Img_Content_Groups.forEach(img_content_group => {
            // Make sure to reset image opacity if fluid change from tablet to mobile 
            let image = img_content_group.querySelector('.splScrn-group__img');
            image.style.opacity = "1";

            mobile_Observer.observe(img_content_group);
        })
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

