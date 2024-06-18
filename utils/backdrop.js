
export const screen_overlay = document.querySelector("body");

export function showBackdrop(z_index = 1, opacity = 0.5) {
    screen_overlay.style.setProperty('--overlay_z-index', z_index);   
    screen_overlay.style.setProperty('--overlay_opacity', opacity);   
}  

export function hideBackdrop(z_index = -1, opacity = 0) {
    screen_overlay.style.setProperty('--overlay_z-index', z_index);   
    screen_overlay.style.setProperty('--overlay_opacity', opacity);
}  