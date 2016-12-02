import _ from 'lodash';

const extendRender = (view) => {
    let render = view.render;
    view.render = _.wrap(view.render, (render) => {
        if (view.viewWillRender !== undefined) {
            view.viewWillRender();
        }
        render.call(view);
        if (view.viewDidRender !== undefined) {
            _.defer(() => {
                view.viewDidRender();
            }, view);
        }
        return view;
    });
    if (view.viewWillDisappear !== undefined) {
        view.once('remove',view.viewWillDisappear, view);
    }
}

export default extendRender;
