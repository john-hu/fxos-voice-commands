/* global AppStore */

(function (exports) {
  exports.DisplayActions = {
    changeViews: function (componentName) {
      var displayContentEl = document.querySelector('vaani-display .content');
      var newView = document.createElement(componentName);

      if (AppStore.state.display.activeView) {
        displayContentEl.removeChild(AppStore.state.display.activeView);
      }

      AppStore.state.display.activeView = newView;

      displayContentEl.appendChild(newView);

      AppStore.emitChange();
    }
  };
})(window);
