import AppStore from '../stores/app';


var DisplayActions = {
  changeViews: function (componentName) {
    var display = document.querySelector('vaani-display');

    if (componentName) {
      var newView = document.createElement(componentName);

      display.changeViews(newView);

      AppStore.state.display.activeView = newView;
    }

    AppStore.emitChange();
  }
};


module.exports = DisplayActions;
