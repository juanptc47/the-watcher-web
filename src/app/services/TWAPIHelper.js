
const TWAPIHelper = {

  domain: 'http://localhost:3001',

  getAllVariables: function(){
    let dfd = $.Deferred();

    $.ajax({
      type: 'GET',
      url: domain+'/variables',
      success: function(data, textStatus, request){
        dfd.resolve(data);
      },
      error: function (request, textStatus, errorThrown) {
        dfd.reject('Error obteniendo variables');
      },
      completion: function(){

      }
    });
    return dfd.promise();
  },

  getDataFromToday: function(variableID){
    let dfd = $.Deferred();
    let params = {};
    // ajax
    console.log("I should ask for data from today");
    //return dfd.promise();
  },

  getDataFromYear: function(variableID, year) {
    let dfd = $.Deferred();
    let params = {};
    // ajax
    console.log("I should ask for data from year");
    //return dfd.promise();
  },

  getDataFromMonth: function(variableID, year, month){
    let dfd = $.Deferred();

    $.ajax({
      type: 'GET',
      url: domain+'/statistics/month/'+variableID+'?year='+year+'&month='+month+'&type=mean',
      success: function(data, textStatus, request){
        dfd.resolve(data);
      },
      error: function (request, textStatus, errorThrown) {
        dfd.reject('Error cargando los datos...');
      },
      completion: function(){

      }
    });
    return dfd.promise();
  },

  getDataFromDay: function(variableID, year, month, day){
    let dfd = $.Deferred();

    $.ajax({
      type: 'GET',
      url: domain+'/statistics/day/'+variableID+'?year='+year+'&month='+month+'&day='+day+'&type=mean',
      success: function(data, textStatus, request){
        dfd.resolve(data);
      },
      error: function (request, textStatus, errorThrown) {
        dfd.reject('Error cargando los datos...');
      },
      completion: function(){

      }
    });
    return dfd.promise();
  }
};

export default TWAPIHelper;
