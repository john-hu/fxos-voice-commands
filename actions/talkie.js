/* global AppStore */

(function (exports) {
  exports.TalkieActions = {
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
})(window);
