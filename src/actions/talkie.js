import AppStore from '../stores/app';


var TalkieActions = {
  setActiveAnimation: function (value) {
    AppStore.state.talkie.mode = 'none';
    AppStore.state.talkie.activeAnimation = value;
    AppStore.emitChange();
  },
  setMode: function (value) {
    AppStore.state.talkie.mode = value;
    AppStore.emitChange();
  }
};


module.exports = TalkieActions;
