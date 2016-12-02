const ViewManager = {
    currentView : null,
    render(view) {
        if (this.currentView !== null && this.currentView.cid != view.cid) {
            this.currentView.remove();
        }
        this.currentView = view;
        return view.render();
    }
}

export default ViewManager;
