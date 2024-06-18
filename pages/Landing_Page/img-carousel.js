// "_img_carousel.scss" <- SASS

const img_carousel_track = document.querySelector(".img-carousel .img-carousel__track");
const move_left_btn = document.querySelector(".img-carousel .img-carousel__navigation .img-carousel__btn-wrapper .slide-left-btn");
const move_right_btn = document.querySelector(".img-carousel .img-carousel__navigation .img-carousel__btn-wrapper .slide-right-btn");


// Move track one slide to the left/right until next slide snaps into place
move_right_btn.addEventListener('click', e => {
    
    if (img_carousel_track.getBoundingClientRect().width >= 2266) { // Super wide screens need to move scrollLeft by larger amount because +-200 on a super wide screen becomes super small
        img_carousel_track.scrollLeft += 600;
    } else { // Desktop, Tablet and Mobile
        img_carousel_track.scrollLeft += 200;
    }
    // console.log(img_carousel_track.getBoundingClientRect().width);
})

move_left_btn.addEventListener('click', e => {
    if (img_carousel_track.getBoundingClientRect().width >= 2266) { 
        img_carousel_track.scrollLeft -= 600;
    } else { 
        img_carousel_track.scrollLeft -= 200;
    }
})
