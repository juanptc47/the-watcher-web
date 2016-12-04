import View from 'ampersand-view';
import AmpersandState from 'ampersand-state';
import AmpersandRestCollection from 'ampersand-rest-collection';
import $ from 'jquery';

// Services
import Constants from 'app/services/constants';

import extendRender from 'app/utils/extendRender';
import template from './variables-selector.html';

const VariableSelectorView = View.extend({

  template: template,
  //collection: new Variables(),

  selectedVarID: '',
  selectedVarName: '',
  selectedVarZone: '',
  selectedVarUnit: '',

  initialize() {
    extendRender(this);
    this.collection = new Variables();
  },
  events: {
  },
  viewWillRender() {
  },
  viewDidRender() {

    $('.carousel').carousel({
      time_constant: 100
    });

  },
  viewWillDisappear() {
  }
});

const Variable = AmpersandState.extend({
  isValid: true,
  props: {
    _id: "string",
    nombre: "string",
    lugar: "string",
    unidad: "string",
    descripcion: "string",
    foto_url: "string"
  }
});

const Variables = AmpersandRestCollection.extend({
  url: Constants.domain+'/variables',
  model: Variable
});

export default VariableSelectorView;
