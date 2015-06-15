/* global AppStore */

(function (exports) {
  exports.ToolbarActions = {
    setActiveItem: function (value) {
      AppStore.state.toolbar.activeItem = value;
      AppStore.emitChange();
    }
  };
})(window);
