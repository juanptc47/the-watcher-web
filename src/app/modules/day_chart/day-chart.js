import View from 'ampersand-view';
import Model from 'ampersand-model';
import $ from 'jquery';
import Chart from 'chart.js';

// Services
import Constants from 'app/services/constants';

import extendRender from 'app/utils/extendRender';
import template from './day-chart.html';

const DayChartView = View.extend({
  template: template,
  initialize() {
    extendRender(this);
    this.model = new DayChartModel();
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
      console.log('DaysChartModel not ready');
    }

  },
  viewWillDisappear() {
  }
});

// Model properties must be defined beforehand, not like in Backbone that can be defined on the fly.
const DayChartModel = Model.extend({
  url: Constants.domain+'/statistics/day/',
  props: {
    id: 'string',
    statisticsType: 'string',
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
      let hour = new Date(object.timestamp).getHours();
      valuesArray[hour] = object[this.get('statisticsType')];
    });

    this.set('data',valuesArray);

    let _this = this;
    var data = {
      labels: [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00",
        "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
        "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
        "21:00", "22:00", "23:00"],
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

    //console.log(this.toJSON());
  },
  setMultiData(dataArray){

    var datasetsArray = [];

    dataArray.forEach( (object) => {
      let dataset = {
        label: object.title,
        fill: false,
        lineTension: 0.1,
        backgroundColor: object.color,
        borderColor: object.color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: object.color,
        pointBackgroundColor: object.color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: object.color,
        pointHoverBorderColor: object.color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: object.data,
        spanGaps: false,
      };
      datasetsArray.push(dataset);
    });

    var data = {
      labels: [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00",
        "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
        "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
        "21:00", "22:00", "23:00"],
      datasets: datasetsArray
    };

    this.set('chartData',data);
    this.set('isReady',true);
  }
});

export default DayChartView;
