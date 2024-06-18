
export function set_elements_tabIndex(list_elements, set_value){
    // list_elements is paramter that takes array of NodeList and individual html elements (retrieved from querySelector like buttons, div, etc)
    list_elements.forEach(elements => {
        
        // For some reason isArray doesn't work so alternative way to see if inputed paramter is array
        if (elements.length > 0){ // If user inputed element in list_elements is an array, go through each element in that array and set the tabIndex for each of them
            elements.forEach(item => {
                item.tabIndex = set_value;
            })
        } else { // If user inputed element in list_elements[] is not an array (i.e button, div, etc.)
            elements.tabIndex = set_value;
        }
    })
    // console.log('function called from export');
    // 1 for loop to go through list_elements = [pfp_card_btn_cards,body_focusable_stuff] and another nested for loop for list_element[0], list_element[1] .. etc.
}