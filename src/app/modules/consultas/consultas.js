import View from 'ampersand-view';
import AmpersandState from 'ampersand-state';
import AmpersandRestCollection from 'ampersand-rest-collection';
import $ from 'jquery';

// Services
import Constants from 'app/services/constants';

// Subviews
import TimestampChartView from 'app/modules/timestamp_chart/timestamp-chart';
import DayChartView from 'app/modules/day_chart/day-chart';
import MonthChartView from 'app/modules/month_chart/month-chart';
import YearChartView from 'app/modules/year_chart/year-chart';
import VariableSelectorView from 'app/modules/variables_selector/variables-selector';

import extendRender from 'app/utils/extendRender';
import template from './consultas.html';

const ConsultasView = View.extend({

  template: template,
  variableSelectorView: new VariableSelectorView(),

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

    this.listenTo(this.variableSelectorView.collection, 'sync', this.renderVariableSelectorView);

    //this.collection.fetch();
  },
  events: {
    "submit #variablesSearchForm" : "filterVariables",
    "click #searchNowBtn" : "searchBtnClicked",
    "change #todayCheckBox" : "todayCheckBoxClicked",
    "change #dayCheckBox" : "dayCheckBoxClicked",
    "change #monthCheckBox" : "monthCheckBoxClicked",
    "change #yearCheckBox" : "yearCheckBoxClicked",
  },
  viewWillRender() {
    this.variableSelectorView.collection.fetch();
  },
  viewDidRender() {

    $('ul.tabs').tabs();

    $('select').material_select();

    $('.modal').modal();

    // UI Setup for searchType 1
    this.searchType = 1;

  },
  viewWillDisappear() {
  },
  renderVariableSelectorView(){
    $('#variablesCarouselContainer').empty();
    this.renderSubview(this.variableSelectorView,'#variablesCarouselContainer');
  },
  filterVariables(){
    let textFilter = $('#searchBar').val();
  },
  searchBtnClicked() {

    this.findSelectedVariable();

    /* Validate Params */

    if(this.todayCheckBoxIsChecked){
      this.searchForToday(this.selectedVarID,this.selectedVarName,this.selectedVarZone,this.selectedVarUnit);
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

      this.searchForYear(this.selectedVarID,this.selectedVarName,this.selectedVarZone,this.selectedVarUnit,yearValue);

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
    //this.dayCheckBoxIsChecked = checkBoxIsChecked;

    if(checkBoxIsChecked){
      //$('#daySelectInput').prop('disabled',false);
      //$('#dayCheckBox').prop('checked',true);
      $('#monthSelectInput').prop('disabled',false);
    } else {
      this.dayCheckBoxIsChecked = checkBoxIsChecked;
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
    //this.monthCheckBoxIsChecked = checkBoxIsChecked;

    if(checkBoxIsChecked){
      this.monthCheckBoxIsChecked = checkBoxIsChecked;
      $('#monthCheckBox').prop('checked',true);
      $('#daySelectInput').prop('disabled',false);
      $('#monthSelectInput').prop('disabled',false);
    } else {
      $('#daySelectInput').prop('disabled',true);
    }
    $('#daySelectInput').material_select('update');
    $('#monthSelectInput').material_select('update');

  },
  searchForToday(varID,varName,varZone,varUnit) {
    $('.chart-container').empty();
    $('.serach-results').slideDown('fast');
    $('#loadingIndicator').fadeIn('fast', () => {
      $('html, body').animate({
          scrollTop: $(".results-divider").offset().top-50
      },200);
    });

    let chartView = new TimestampChartView();
    chartView.model.set('id',varID+'-chart');
    chartView.model.set('chartTitle',varName+' - '+varZone+' (Recientes)');
    chartView.model.set('lineColorPrimary','#3F51B5');
    chartView.model.set('lineColorAccent','#2196F3');
    chartView.model.set('yLabel', varUnit);
    chartView.model.url += varID;

    chartView.model.fetch({
      success: (model, response, options) => {
        $('#loadingIndicator').slideUp('fast', _ =>{
          this.showChart(chartView,'chart1-container');
        });
      },
      error: function(model, response, options){
        console.log('ERROR!');
        console.log(response);
      }
    });
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


    let meanChartPromise = $.Deferred();
    let medianChartPromise = $.Deferred();
    let modeChartPromise = $.Deferred();

    meanChartView.model.fetch({
      success: (model, response, options) => {
        meanChartPromise.resolve();
      },
      error: function(model, response, options){
        console.log('ERROR!');
        console.log(response);
      }
    });

    medianChartView.model.fetch({
      success: (model, response, options) => {
        medianChartPromise.resolve();
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });

    modeChartView.model.fetch({
      success: (model, response, options) => {
        modeChartPromise.resolve();
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });

    Promise.all([meanChartPromise, medianChartPromise, modeChartPromise]).then( _ => {

      $('#loadingIndicator').slideUp('fast', _ =>{

        this.showChart(meanChartView,'chart1-container');
        this.showChart(medianChartView,'chart2-container');
        this.showChart(modeChartView,'chart3-container');

        let meanData = {
          title: 'Promedio',
          color: '#3F51B5',
          data: meanChartView.model.get('data')
        };

        let medianData = {
          title: 'Mediana',
          color: '#4CAF50',
          data: medianChartView.model.get('data')
        };

        let modeData = {
          title: 'Moda',
          color: '#673AB7',
          data: modeChartView.model.get('data')
        };

        let multiChartView = new DayChartView();
        multiChartView.model.set('id',varID+'-chart-multi');
        multiChartView.model.set('yLabel', varUnit);
        multiChartView.model.setMultiData([meanData,medianData,modeData]);
        this.showChart(multiChartView,'chart4-container');

        });

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

    let meanChartPromise = $.Deferred();
    let medianChartPromise = $.Deferred();
    let modeChartPromise = $.Deferred();

    meanChartView.model.fetch({
      success: (model, response, options) => {
        meanChartPromise.resolve();
      },
      error: function(model, response, options){
        console.log('ERROR!');
        console.log(response);
      }
    });

    modeChartView.model.fetch({
      success: (model, response, options) => {
        medianChartPromise.resolve();
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });

    medianChartView.model.fetch({
      success: (model, response, options) => {
        modeChartPromise.resolve();
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });

    Promise.all([meanChartPromise, medianChartPromise, modeChartPromise]).then( _ => {

      $('#loadingIndicator').slideUp('fast', _ =>{

        this.showChart(meanChartView,'chart1-container');
        this.showChart(medianChartView,'chart2-container');
        this.showChart(modeChartView,'chart3-container');

        let meanData = {
          title: 'Promedio',
          color: '#3F51B5',
          data: meanChartView.model.get('data')
        };

        let medianData = {
          title: 'Mediana',
          color: '#4CAF50',
          data: medianChartView.model.get('data')
        };

        let modeData = {
          title: 'Moda',
          color: '#673AB7',
          data: modeChartView.model.get('data')
        };

        let multiChartView = new MonthChartView();
        multiChartView.model.set('id',varID+'-chart-multi');
        multiChartView.model.set('yLabel', varUnit);
        multiChartView.model.set('numOfDays', numOfDays);
        multiChartView.model.setMultiData([meanData,medianData,modeData]);
        this.showChart(multiChartView,'chart4-container');

      });
    });

  },
  searchForYear(varID,varName,varZone,varUnit,yearValue){

    $('.chart-container').empty();
    $('.serach-results').slideDown('fast');
    $('#loadingIndicator').fadeIn('fast', () => {
      $('html, body').animate({
          scrollTop: $(".results-divider").offset().top-50
      },200);
    });

    let meanChartView = new YearChartView();
    meanChartView.model.set('id',varID+'-chart-mean');
    meanChartView.model.set('statisticsType', 'mean');
    meanChartView.model.set('chartTitle',varName+' - '+varZone+' (Promedio)');
    meanChartView.model.set('lineColorPrimary','#3F51B5');
    meanChartView.model.set('lineColorAccent','#2196F3');
    meanChartView.model.set('yLabel', varUnit);
    meanChartView.model.url += varID+'?year='+yearValue+'&type=mean';

    let medianChartView = new YearChartView();
    medianChartView.model.set('id',varID+'-chart-median');
    medianChartView.model.set('statisticsType', 'median');
    medianChartView.model.set('chartTitle',varName+' - '+varZone+' (Mediana)');
    medianChartView.model.set('lineColorPrimary','#4CAF50');
    medianChartView.model.set('lineColorAccent','#8BC3A4');
    medianChartView.model.set('yLabel', varUnit);
    medianChartView.model.url += varID+'?year='+yearValue+'&type=median';

    let modeChartView = new YearChartView();
    modeChartView.model.set('id',varID+'-chart-mode');
    modeChartView.model.set('statisticsType', 'mode');
    modeChartView.model.set('chartTitle',varName+' - '+varZone+' (Moda)');
    modeChartView.model.set('lineColorPrimary','#673AB7');
    modeChartView.model.set('lineColorAccent','#9C27B0');
    modeChartView.model.set('yLabel', varUnit);
    modeChartView.model.url += varID+'?year='+yearValue+'&type=mode';

    let meanChartPromise = $.Deferred();
    let medianChartPromise = $.Deferred();
    let modeChartPromise = $.Deferred();

    meanChartView.model.fetch({
      success: (model, response, options) => {
        meanChartPromise.resolve();
      },
      error: function(model, response, options){
        console.log('ERROR!');
        console.log(response);
      }
    });

    medianChartView.model.fetch({
      success: (model, response, options) => {
        medianChartPromise.resolve();
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });

    modeChartView.model.fetch({
      success: (model, response, options) => {
        modeChartPromise.resolve();
      },
      error: (model, response, options) => {
        console.log('ERROR!');
        console.log(response);
      }
    });

    Promise.all([meanChartPromise, medianChartPromise, modeChartPromise]).then( _ => {

      $('#loadingIndicator').slideUp('fast', _ =>{

        this.showChart(meanChartView,'chart1-container');
        this.showChart(medianChartView,'chart2-container');
        this.showChart(modeChartView,'chart3-container');

        let meanData = {
          title: 'Promedio',
          color: '#3F51B5',
          data: meanChartView.model.get('data')
        };

        let medianData = {
          title: 'Mediana',
          color: '#4CAF50',
          data: medianChartView.model.get('data')
        };

        let modeData = {
          title: 'Moda',
          color: '#673AB7',
          data: modeChartView.model.get('data')
        };

        let multiChartView = new YearChartView();
        multiChartView.model.set('id',varID+'-chart-multi');
        multiChartView.model.set('yLabel', varUnit);
        multiChartView.model.setMultiData([meanData,medianData,modeData]);
        this.showChart(multiChartView,'chart4-container');

        });

    });

  },
  showChart(chartView,elementID){
    this.renderSubview(chartView,'#'+elementID);
  }
});

export default ConsultasView;
