// hide element
const toggleClass = (element, className = '') => element.classList.toggle(className);
const addClass = (element, className = '') => element.classList.add(className);
const removeClass = (element, className = '') => element.classList.remove(className);

// close the content block wjem clicking outside the box
const closeElement = (event, elementWrapper, element) => {
    if (!elementWrapper.contains(event.target)) {
        element.classList.add('hidden')
    }
}

// clear container before displaying results
const clearContainer = container => {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// filter out unneeded array items
const filterArr = (lookupArr, lookupValueArr = [], lookupKey) => {
    return lookupArr.filter(item => {
        return lookupValueArr.includes(item[lookupKey]);
    })
}

// resize the recipe image received from search
const imgResize = (url) => url.replace(/\d{1,3}x\d{1,3}/, '636x393');

// print nutrition lists
const printResults = (arr) => {
    return arr.map((item) => {
        const list = document.createElement('li');
        list.classList.add('card__nutrition-item');
        list.innerHTML = `<b>${item.name}</b>: ${item.amount}${item.unit}`;
        return list;
    })
}