

// Load JSON file without fetch API 
// https://www.youtube.com/watch?v=Z92PqSyUBSI
import characters_list from './KCC-Char-Gallery.Characters.json' assert {type: 'json'};


const card_gallery_cntnr = document.querySelector(".pfp-card-gallery");

characters_list.forEach(character => {
    
    let trivia_facts_literal = dataArray_to_li_literal(character['trivia-facts']);
    let gallery_pics_literal = dataArray_to_li_btn_literal(character['gallery-pics']);

    const temp_element = strLiteral_to_html(`
    <div class="pfp-card-container ff-accent">
                    
        <button class="pfp-card">
            <div class="pfp-card__pic">
                <img src="${character.pfp}" alt="">
            </div>
            <h2 class="pfp-card__name ff-accent fw-bold">
                <span class="visually-hidden">View </span>    
                ${character.name}
                <span class="visually-hidden">Character Profile</span>
            </h2>
        </button>
        
        <div class="pfp-card__info-card" role="dialog" data-visible="hide">
            <div class="pfp-card__info-card__wrapper">
                <button class="info-card__close-btn">
                    <span class="visually-hidden">Close Character Profile</span>    
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 12 12"><path fill="currentColor" d="M2.22 2.22a.749.749 0 0 1 1.06 0L6 4.939L8.72 2.22a.749.749 0 1 1 1.06 1.06L7.061 6L9.78 8.72a.749.749 0 1 1-1.06 1.06L6 7.061L3.28 9.78a.749.749 0 1 1-1.06-1.06L4.939 6L2.22 3.28a.749.749 0 0 1 0-1.06Z"/></svg>
                </button>
                
                <div class="info-card__header">
                    <div class="info-card__header_pfp">
                        <img src="${character.pfp}" alt="">
                    </div>
                    <div class="info-card__header_content">
                        <h1 class="ff-accent fw-bold">
                            ${character.name}
                            <span class="visually-hidden">Character Information</span>
                        </h1>
                        <div class="info-card__header_list-viewbox">
                            <h2 class="visually-hidden">Fun Facts</h2>    
                            <ul class="info-card__header_list fw-regular ff-body">
                                ${trivia_facts_literal}
                            </ul>
                        </div>
                    </div>
                </div>
    
                <h2 class="visually-hidden">${character.name} Pictures</h2>
                <ul tabindex="-1" class="info-card__pictures">
                    ${gallery_pics_literal}
                </ul>

                <button class="info-card__close-btn visually-hidden">
                    <span class="visually-hidden">Close Character Profile</span>
                </button>
            </div>
        </div>
        <div class="info-card__picture-slider" role="dialog" aria-modal="true" data-visible="hide">
            <h1 class="visually-hidden">${character.name} Picture Carousel</h1>    
            <button class="picture-slider__close-btn">
                <span class="visually-hidden">Close Picture Carousel Dialog</span>    
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 12 12"><path fill="currentColor" d="M2.22 2.22a.749.749 0 0 1 1.06 0L6 4.939L8.72 2.22a.749.749 0 1 1 1.06 1.06L7.061 6L9.78 8.72a.749.749 0 1 1-1.06 1.06L6 7.061L3.28 9.78a.749.749 0 1 1-1.06-1.06L4.939 6L2.22 3.28a.749.749 0 0 1 0-1.06Z"/></svg>
            </button>
            <div class="picture-slider__container">
                <div class="picture-slider__view-box">
                    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fanimenewsandfacts.com%2Fwp-content%2Fuploads%2F2021%2F10%2F20211011_195131_compress59.jpg&f=1&nofb=1&ipt=4684c80106e392cd3339c6831864f9fa6ddb888e314db3e1c7f3c47d74027f9d&ipo=images" alt="">
                </div>
                <div class="picture-slider__nav">
                    <button class="picture-slider__nav-left-btn">
                        <span class="visually-hidden">Move Picture Carousel Left</span>    
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M0 0h24v24H0z"/><path fill="currentColor" d="M12 2a10 10 0 0 1 .324 19.995L12 22l-.324-.005A10 10 0 0 1 12 2zm.707 5.293a1 1 0 0 0-1.414 0l-4 4a1.048 1.048 0 0 0-.083.094l-.064.092l-.052.098l-.044.11l-.03.112l-.017.126L7 12l.004.09l.007.058l.025.118l.035.105l.054.113l.043.07l.071.095l.054.058l4 4l.094.083a1 1 0 0 0 1.32-1.497L10.415 13H16l.117-.007A1 1 0 0 0 16 11h-5.586l2.293-2.293l.083-.094a1 1 0 0 0-.083-1.32z"/></g></svg>
                    </button>
                    <button class="picture-slider__nav-right-btn">
                        <span class="visually-hidden">Move Picture Carousel Right</span>    
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M0 0h24v24H0z"/><path fill="currentColor" d="m12 2l.324.005a10 10 0 1 1-.648 0L12 2zm.613 5.21a1 1 0 0 0-1.32 1.497L13.584 11H8l-.117.007A1 1 0 0 0 8 13h5.584l-2.291 2.293l-.083.094a1 1 0 0 0 1.497 1.32l4-4l.073-.082l.064-.089l.062-.113l.044-.11l.03-.112l.017-.126L17 12l-.007-.118l-.029-.148l-.035-.105l-.054-.113l-.071-.111a1.008 1.008 0 0 0-.097-.112l-4-4z"/></g></svg>
                    </button>
                    <h2 class="visually-hidden">Carousel Images</h2>
                    <div class="picture-slider__nav-track-container">
                        <div tabindex="-1" class="picture-slider__nav-track">
                            <!-- Do not populate this div. This div will be automatically populate from the info-card__pictures ul into this div via javascript -->
                        </div>
                    </div>
                </div>
            </div>
            <button class="picture-slider__close-btn visually-hidden">
                <span class="visually-hidden">Close Picture Carousel Dialog</span>
            </button>
        </div> 
    </div>
    `)

    card_gallery_cntnr.appendChild(temp_element);
})



function strLiteral_to_html(html) {
    const template = document.createElement("template");

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}

// Take array of trivia of a character and convert it into a list of li 
function dataArray_to_li_literal(trivia_facts_array){
    let temp_header_content = ``;

    for (let i = 0; i < trivia_facts_array.length; i ++){
        let fact = trivia_facts_array.at(i)
        
        if (i == 0) {
            temp_header_content = temp_header_content.concat(`<li>${fact}</li>`);
        } else {
            temp_header_content = temp_header_content.concat(`\n<li>${fact}</li>`);
        }
    }

    return temp_header_content;
}

function dataArray_to_li_btn_literal(array_of_image_objects){
    let temp_li_img_content = ``;

    // Go through each image in a charcter['gallery-pics'] object and output HTML for each image
    for (let i = 0; i < array_of_image_objects.length; i ++){
        let img_object = array_of_image_objects.at(i)
        
        if (i == 0) {
            temp_li_img_content = temp_li_img_content.concat(`<li><button aria-expanded="false"><img src="${img_object["image_src"]}" alt="${img_object["image_alt"]}"></button></li>`);
        } else {
            temp_li_img_content = temp_li_img_content.concat(`\n<li><button aria-expanded="false"><img src="${img_object["image_src"]}" alt="${img_object["image_alt"]}"></button></li>`);
        }
    }

    /** Goal is to generate this string literal and put it into the "info-card__pictures" ul. 
        `<li><button aria-expanded="false">
            <img src="" alt="">
        </button></li>

        <li><button aria-expanded="false">
            <img src="" alt="">
        </button></li>
        `
        
        ...
    */

    return temp_li_img_content;
}



