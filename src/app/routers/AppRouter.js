// JQuery
import $ from 'jquery';
// Amp Router
//import Router from 'ampersand-router';
import { Router } from 'backbone';
// View Manager Util
import ViewManager from 'app/utils/ViewManager';
// Views
import HeaderView from 'app/modules/header/Header';
import FooterView from 'app/modules/footer/Footer';
import HomeView from 'app/modules/home/Home';
import ConsultasView from 'app/modules/consultas/consultas';

const AppRouter = Router.extend({
    routes: {
        "": "root",
        "consultas": "loadConsultas"
    },
    initialize() {
        // Header
        this.headerView = new HeaderView();
        $('#header').html(this.headerView.render().el);
        // Footer
        this.footerView = new FooterView();
        $('#footer').html(this.footerView.render().el);
    },
    root() {
        // Home
        this.homeView = new HomeView();
        ViewManager.render(this.homeView);
        $('#content').html(this.homeView.el);
    },
    loadConsultas() {
      this.consultasView = new ConsultasView();
      ViewManager.render(this.consultasView);
      $('#content').html(this.consultasView.el);
    }

});

export default AppRouter;
