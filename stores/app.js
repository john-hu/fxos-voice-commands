(function (exports) {
  exports.AppStore = {
    emitter: document.createElement('div'),
    emitChange: function () {
      this.emitter.dispatchEvent(new CustomEvent('change'));
    },
    state: {
      toolbar: {
        activeItem: 'none'
      },
      talkie: {
        mode: 'none',
        activeAnimation: 'none'
      },
      firstTimeUse: {
        launchCount: -1,
        tour: {
          inFlight: false,
          current: 1,
          total: 3
        }
      }
    }
  };
})(window);
