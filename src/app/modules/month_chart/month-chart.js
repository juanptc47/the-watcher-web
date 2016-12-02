import View from 'ampersand-view';
import Model from 'ampersand-model';
import $ from 'jquery';
import Chart from 'chart.js';

// Services
import Constants from 'app/services/constants';

import extendRender from 'app/utils/extendRender';
import template from './month-chart.html';

const MonthChartView = View.extend({
  template: template,
  initialize() {
    extendRender(this);
    this.model = new MonthChartModel();
  },
  viewWillRender() {
  },
  viewDidRender() {

    if(this.model.get('isReady')){

      var ctx = $(`#${this.model.get('id')}`);

      var myLineChart = new Chart(ctx, {
        type: 'line',
        data: this.model.get('chartData'),
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      console.log('MonthChartModel not ready');
    }

  },
  viewWillDisappear() {
  }
});

// Model properties must be defined beforehand, not like in Backbone that can be defined on the fly.
const MonthChartModel = Model.extend({
  url: Constants.domain+'/statistics/month/',
  props: {
    id: 'string',
    statisticsType: 'string',
    numOfDays: 'number',
    chartTitle: 'string',
    yLabel: 'string',
    lineColorPrimary: 'string',
    lineColorAccent: 'string',
    chartData: 'object',
    data: 'array',
    isReady: 'boolean'
  },
  parse(response){

    let valuesArray = [];

    response.forEach( (object) => {
      let day = new Date(object.timestamp).getDate();
      valuesArray[day-1] = object[this.get('statisticsType')];
    });

    const numOfDays = this.get('numOfDays');
    let dayLabels = new Array(numOfDays);
    for(let i=0; i<numOfDays; i++){
      dayLabels[i] = (i+1).toString();
    }

    this.set('data',valuesArray);

    let _this = this;
    var data = {
      labels: dayLabels,
      datasets: [
        {
          label: _this.get('chartTitle'),
          fill: false,
          lineTension: 0.1,
          backgroundColor: _this.get('lineColorPrimary'),
          borderColor: _this.get('lineColorPrimary'),
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: _this.get('lineColorAccent'),
          pointBackgroundColor: _this.get('lineColorPrimary'),
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: _this.get('lineColorPrimary'),
          pointHoverBorderColor: _this.get('lineColorAccent'),
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false,
        }
      ]
    };

    data.datasets[0].data = this.get('data');

    this.set('chartData',data);
    this.set('isReady',true);
  }

});

export default MonthChartView;
