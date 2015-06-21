import AppStore from '../stores/app';


var ToolbarActions = {
  setActiveItem: function (value) {
    AppStore.state.toolbar.activeItem = value;
    AppStore.emitChange();
  }
};


module.exports = ToolbarActions;
