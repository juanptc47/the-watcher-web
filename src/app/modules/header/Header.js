// Ampersand
import View from 'ampersand-view';

// JQuery
import $ from 'jquery';

// AfterRender util
import extendRender from 'app/utils/extendRender';

window.jQuery = window.$ = require('jquery');

const HeaderView = View.extend({
    template: require('./Header.html'),
    initialize() {
        extendRender(this);
    },
    viewWillRender() {
    },
    viewDidRender() {
      $(".button-collapse").sideNav({
        menuWidth: 240, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
      });
    },
    viewWillDisappear() {
    }
});

export default HeaderView;
