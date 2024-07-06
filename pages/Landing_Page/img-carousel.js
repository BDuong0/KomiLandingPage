// "_img_carousel.scss" <- SASS

const img_carousel_track = document.querySelector(".img-carousel .img-carousel__track");
const move_left_btn = document.querySelector(".img-carousel .img-carousel__navigation .img-carousel__btn-wrapper .slide-left-btn");
const move_right_btn = document.querySelector(".img-carousel .img-carousel__navigation .img-carousel__btn-wrapper .slide-right-btn");


// Move track one slide to the left/right until next slide snaps into place
move_right_btn.addEventListener('click', e => {
    // scroll_amount is in proportion to how big the carousel track is as it resizes with the viewport
    // - on bigger and wider screens a scroll_amount of 200px (which made the carousel move) would not make the bigger carousel move b/c the carousel sees 200px as now 0px
    let scroll_amount = img_carousel_track.getBoundingClientRect().width * 0.30;
    img_carousel_track.scrollLeft += scroll_amount;
})

move_left_btn.addEventListener('click', e => {
    let scroll_amount = img_carousel_track.getBoundingClientRect().width * 0.30;
    img_carousel_track.scrollLeft -= scroll_amount;
})
