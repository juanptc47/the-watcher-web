import View from 'ampersand-view';
import AmpersandState from 'ampersand-state';
import AmpersandRestCollection from 'ampersand-rest-collection';
import $ from 'jquery';

// Services
import TWAPIHelper from 'app/services/TWAPIHelper';
import Constants from 'app/services/constants';

import DayChartView from 'app/modules/day_chart/day-chart';
import MonthChartView from 'app/modules/month_chart/month-chart';

import extendRender from 'app/utils/extendRender';
import template from './consultas.html';

const ConsultasView = View.extend({
  template: template,
  selectedVarID: '',
  selectedVarName: '',
  selectedVarZone: '',
  selectedVarUnit: '',
  todayCheckBoxIsChecked: false,
  dayCheckBoxIsChecked: true,
  monthCheckBoxIsChecked: true,
  yearCheckBoxIsChecked: true,
  initialize() {
    extendRender(this);
    this.collection = new Variables();
    this.listenTo(this.collection, 'sync', this.render);

    this.collection.fetch();
  },
  events: {
    "click #searchNowBtn" : "searchBtnClicked",
    "change #todayCheckBox" : "todayCheckBoxClicked",
    "change #dayCheckBox" : "dayCheckBoxClicked",
    "change #monthCheckBox" : "monthCheckBoxClicked",
    "change #yearCheckBox" : "yearCheckBoxClicked",
  },
  viewWillRender() {
  },
  viewDidRender() {

    $('.carousel').carousel({
      time_constant: 100
    });

    $('ul.tabs').tabs();

    $('select').material_select();

    // UI Setup for searchType 1
    this.searchType = 1;

  },
  viewWillDisappear() {
  },
  searchBtnClicked() {

    this.findSelectedVariable();

    /* Validate Params */

    if(this.todayCheckBoxIsChecked){
      console.log("Search Today");
      //TWAPIHelper.getDataFromToday();
      return;
    }

    if(this.yearCheckBoxIsChecked && this.monthCheckBoxIsChecked && this.dayCheckBoxIsChecked){

      let yearValue = $('#yearSelectInput').val();
      let monthValue = $('#monthSelectInput').val();
      let dayValue = $('#daySelectInput').val();

      if(yearValue==null || monthValue==null || dayValue==null){
        Materialize.toast('¡Parametros de busqueda incorrectos!', 10000, 'rounded');
        Materialize.toast('Revisa que hayas elegido un valor para año, mes o día', 10000, 'rounded');
        return;
      }

      this.searchForDay(this.selectedVarID,this.selectedVarName,this.selectedVarZone,this.selectedVarUnit,yearValue,(monthValue-1),dayValue);

    } else if(this.yearCheckBoxIsChecked && this.monthCheckBoxIsChecked && !this.dayCheckBoxIsChecked) {

      let yearValue = $('#yearSelectInput').val();
      let monthValue = $('#monthSelectInput').val();

      if(yearValue==null || monthValue==null){
        Materialize.toast('¡Parametros de busqueda incorrectos!', 10000, 'rounded');
        Materialize.toast('Revisa que hayas elegido un valor para año o mes', 10000, 'rounded');
        return;
      }

      this.searchForMonth(this.selectedVarID,this.selectedVarName,this.selectedVarZone,this.selectedVarUnit,yearValue,(monthValue-1));

    } else if(this.yearCheckBoxIsChecked && !this.monthCheckBoxIsChecked && !this.dayCheckBoxIsChecked) {

      let yearValue = $('#yearSelectInput').val();

      if(yearValue==null){
        Materialize.toast('¡Parametros de busqueda incorrectos!', 10000, 'rounded');
        Materialize.toast('Revisa que hayas elegido un valor para año', 10000, 'rounded');
        return;
      }
      console.log("Search Year: "+yearValue);
      TWAPIHelper.getDataFromYear(0,yearValue);

    } else {
      Materialize.toast('¡Parametros de busqueda incorrectos!', 10000, 'rounded');
      Materialize.toast('Revisa que hayas elegido una opción valida', 10000, 'rounded');
      return;
    }


  },
  findSelectedVariable(){
    let selectedVarCTX = $('#variablesCarousel .carousel-item').filter(
      function () {
        return $(this).css('z-index') == '0';
      });
    this.selectedVarID = selectedVarCTX.attr('id');
    this.selectedVarName = selectedVarCTX.data('name');
    this.selectedVarZone = selectedVarCTX.data('zone');
    this.selectedVarUnit = selectedVarCTX.data('unit');
  },
  todayCheckBoxClicked() {

    let checkBoxIsChecked = $('#todayCheckBox').prop('checked');
    this.todayCheckBoxIsChecked = checkBoxIsChecked;

    if(checkBoxIsChecked){
      $('#yearSelectInput').prop('disabled',true);
      $('#monthSelectInput').prop('disabled',true);
      $('#daySelectInput').prop('disabled',true);

      $('#yearCheckBox').prop('disabled',true);
      $('#monthCheckBox').prop('disabled',true);
      $('#dayCheckBox').prop('disabled',true);
    } else {
      $('#yearSelectInput').prop('disabled',false);
      $('#monthSelectInput').prop('disabled',false);
      $('#daySelectInput').prop('disabled',false);

      $('#yearCheckBox').prop('disabled',false);
      $('#monthCheckBox').prop('disabled',false);
      $('#dayCheckBox').prop('disabled',false);
    }

    $('#yearSelectInput').material_select('update');
    $('#monthSelectInput').material_select('update');
    $('#daySelectInput').material_select('update');

  },
  yearCheckBoxClicked(){
    let checkBoxIsChecked = $('#yearCheckBox').prop('checked');
    if(!checkBoxIsChecked){
      $('#yearCheckBox').prop('checked',true);
    }
  },
  monthCheckBoxClicked(){

    let checkBoxIsChecked = $('#monthCheckBox').prop('checked');

    this.monthCheckBoxIsChecked = checkBoxIsChecked;
    this.dayCheckBoxIsChecked = checkBoxIsChecked;

    if(checkBoxIsChecked){
      $('#daySelectInput').prop('disabled',false);
      $('#dayCheckBox').prop('checked',true);
      $('#monthSelectInput').prop('disabled',false);
    } else {
      $('#daySelectInput').prop('disabled',true);
      $('#dayCheckBox').prop('checked',false);
      $('#monthSelectInput').prop('disabled',true);
    }
    $('#daySelectInput').material_select('update');
    $('#monthSelectInput').material_select('update');

  },
  dayCheckBoxClicked(){

    let checkBoxIsChecked = $('#dayCheckBox').prop('checked');

    this.dayCheckBoxIsChecked = checkBoxIsChecked;

    if(checkBoxIsChecked){
      $('#daySelectInput').prop('disabled',false);
    } else {
      $('#daySelectInput').prop('disabled',true);
    }
    $('#daySelectInput').material_select('update');

  },
  searchForDay(varID,varName,varZone,varUnit,yearValue,monthValue,dayValue){

    $('.chart-container').empty();
    $('.serach-results').slideDown('fast');
    $('#loadingIndicator').fadeIn('fast', () => {
      $('html, body').animate({
          scrollTop: $(".results-divider").offset().top-50
      },200);
    });

    let meanChartView = new DayChartView();
    meanChartView.model.set('id',varID+'-chart-mean');
    meanChartView.model.set('statisticsType', 'mean');
    meanChartView.model.set('chartTitle',varName+' - '+varZone+' (Promedio)');
    meanChartView.model.set('lineColorPrimary','#3F51B5');
    meanChartView.model.set('lineColorAccent','#2196F3');
    meanChartView.model.set('yLabel', varUnit);
    meanChartView.model.url += varID+'?year='+yearValue+'&month='+monthValue+'&day='+dayValue+'&type=mean';

    let medianChartView = new DayChartView();
    medianChartView.model.set('id',varID+'-chart-median');
    medianChartView.model.set('statisticsType', 'median');
    medianChartView.model.set('chartTitle',varName+' - '+varZone+' (Mediana)');
    medianChartView.model.set('lineColorPrimary','#4CAF50');
    medianChartView.model.set('lineColorAccent','#8BC3A4');
    medianChartView.model.set('yLabel', varUnit);
    medianChartView.model.url += varID+'?year='+yearValue+'&month='+monthValue+'&day='+dayValue+'&type=median';

    let modeChartView = new DayChartView();
    modeChartView.model.set('id',varID+'-chart-mode');
    modeChartView.model.set('statisticsType', 'mode');
    modeChartView.model.set('chartTitle',varName+' - '+varZone+' (Moda)');
    modeChartView.model.set('lineColorPrimary','#673AB7');
    modeChartView.model.set('lineColorAccent','#9C27B0');
    modeChartView.model.set('yLabel', varUnit);
    modeChartView.model.url += varID+'?year='+yearValue+'&month='+monthValue+'&day='+dayValue+'&type=mode';

    meanChartView.model.fetch({
      success: (model, response, options) => {
        this.showChart(meanChartView,'chart1-container');
      },
      error: function(model, response, options){
        console.log('ERROR!');
        console.log(response);
      }
    });

    modeChartView.model.fetch({
      success: (model, response, options) => {
        this.showChart(modeChartView,'chart3-container');
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });

    medianChartView.model.fetch({
      success: (model, response, options) => {
        this.showChart(medianChartView,'chart2-container');
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });

  },
  searchForMonth(varID,varName,varZone,varUnit,yearValue,monthValue){

    $('.chart-container').empty();
    $('.serach-results').slideDown('fast');
    $('#loadingIndicator').fadeIn('fast', () => {
      $('html, body').animate({
          scrollTop: $(".results-divider").offset().top-50
      },200);
    });

    let numOfDays = new Date(yearValue,(monthValue+1),0).getDate();

    let meanChartView = new MonthChartView();
    meanChartView.model.set('id',varID+'-chart-mean');
    meanChartView.model.set('statisticsType', 'mean');
    meanChartView.model.set('chartTitle',varName+' - '+varZone+' (Promedio)');
    meanChartView.model.set('lineColorPrimary','#3F51B5');
    meanChartView.model.set('lineColorAccent','#2196F3');
    meanChartView.model.set('yLabel', varUnit);
    meanChartView.model.set('numOfDays', numOfDays);
    meanChartView.model.url += varID+'?year='+yearValue+'&month='+monthValue+'&type=mean';

    let medianChartView = new MonthChartView();
    medianChartView.model.set('id',varID+'-chart-median');
    medianChartView.model.set('statisticsType', 'median');
    medianChartView.model.set('chartTitle',varName+' - '+varZone+' (Mediana)');
    medianChartView.model.set('lineColorPrimary','#4CAF50');
    medianChartView.model.set('lineColorAccent','#8BC3A4');
    medianChartView.model.set('yLabel', varUnit);
    medianChartView.model.set('numOfDays', numOfDays);
    medianChartView.model.url += varID+'?year='+yearValue+'&month='+monthValue+'&type=median';

    let modeChartView = new MonthChartView();
    modeChartView.model.set('id',varID+'-chart-mode');
    modeChartView.model.set('statisticsType', 'mode');
    modeChartView.model.set('chartTitle',varName+' - '+varZone+' (Moda)');
    modeChartView.model.set('lineColorPrimary','#673AB7');
    modeChartView.model.set('lineColorAccent','#9C27B0');
    modeChartView.model.set('yLabel', varUnit);
    modeChartView.model.set('numOfDays', numOfDays);
    modeChartView.model.url += varID+'?year='+yearValue+'&month='+monthValue+'&type=mode';

    meanChartView.model.fetch({
      success: (model, response, options) => {
        this.showChart(meanChartView,'chart1-container');
      },
      error: function(model, response, options){
        console.log('ERROR!');
        console.log(response);
      }
    });

    modeChartView.model.fetch({
      success: (model, response, options) => {
        this.showChart(modeChartView,'chart3-container');
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });

    medianChartView.model.fetch({
      success: (model, response, options) => {
        this.showChart(medianChartView,'chart2-container');
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });
  },
  showChart(chartView,elementID){
    $('#loadingIndicator').slideUp('fast');
    this.renderSubview(chartView,'#'+elementID);
  }
});

const Variable = AmpersandState.extend({
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
  model: Variable,
});

export default ConsultasView;
