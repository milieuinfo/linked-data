
// polyfill DOM iterators
if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

// polyfill matches
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// polyfill closest()
if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
        let el = this;
        do {
            if (el.matches(selector)) {
                return el;
            } else {
                el = el.parentElement || el.parentNode;
            }
        } while (el !== null && el.nodeType === 1);

        return null;
    };
}
