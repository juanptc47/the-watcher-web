const noConflicts = () => {
    if (window._) {
        window._.noConflict();
    }
    if (window.$) {
        window.$.noConflict();
    }
};

export default noConflicts;
