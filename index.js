/* global AppStore */

(function () {
  // first time use stuff

  var launchCount = localStorage.getItem('launchCount') || 0;
  launchCount = parseInt(launchCount);
  launchCount += 1;
  localStorage.setItem('launchCount', launchCount);
  AppStore.state.firstTimeUse.launchCount = launchCount;

  if (launchCount <= 2) {
    AppStore.state.firstTimeUse.tour.inFlight = true;
  }

  // instantiate top level components (lifecycle: created)

  var toolbar, display, ftuPopup, talkie;

  toolbar = document.createElement('vaani-toolbar');
  display = document.createElement('vaani-display');
  talkie = document.createElement('vaani-talkie');

  if (AppStore.state.firstTimeUse.tour.inFlight) {
    ftuPopup = document.createElement('vaani-ftu-popup');

    display.querySelector('.content').appendChild(ftuPopup);
  }

  // kick things off (lifecycle: attached)

  document.body.appendChild(toolbar);
  document.body.appendChild(display);
  document.body.appendChild(talkie);

  // update components when data changes (lifecycle: attributeChanged)

  var handleStateChange = function () {
    if (ftuPopup) {
      if (AppStore.state.firstTimeUse.tour.current === 0) {
        display.querySelector('.content').removeChild(ftuPopup);
        ftuPopup = null;
      }
    }
  };

  AppStore.emitter.addEventListener('change', handleStateChange);
})();
