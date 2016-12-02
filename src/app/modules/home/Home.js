// Ampersand
import View from 'ampersand-view';
import Model from 'ampersand-model';
// JQuery
import $ from 'jquery';

// AfterRender util
import extendRender from 'app/utils/extendRender';
// Template
import template from './Home.html';

const HomeView = View.extend({
    template: template,
    initialize() {
        extendRender(this);
        this.model = new HomeModel();
        this.model.set({
            text: 'Hola Mundo'
        });
    },
    viewWillRender() {
    },
    viewDidRender() {
        $('#foo').append("bar");
    },
    viewWillDisappear() {
    }
});

// Model properties must be defined beforehand, not like in Backbone that can be defined on the fly.
const HomeModel = Model.extend({
    props: {
        text: 'string'
    }
});

export default HomeView;
