// JQuery
import $ from 'jquery';
import noConflicts from 'app/utils/noConflicts'
// Amp View
import View from 'ampersand-view';
// AppRouter
import AppRouter from './routers/AppRouter';
import { history } from 'backbone';
// Venderos
import '/www/vendors/materialize/js/materialize.min';


// Cleans the window object of _ and $ variables.
noConflicts();

// Comment this for PRODUCTION build
import '../stylesheets/main.scss';


// Initialize App
let appView = new View();
appView.template = require('./App.html');
// Render the App
$('#app').html(appView.render().el);

// Initialize Router
let appRouter = new AppRouter();
history.start();
