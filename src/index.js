/* global document */
import AppStore from './stores/app';
import DisplayActions from './actions/display';
import './components/community';
import './components/display';
import './components/ftu-popup';
import './components/help';
import './components/talkie';
import './components/toolbar';

/*
 * first time use stuff
 */

var launchCount = localStorage.getItem('launchCount') || 0;
launchCount = parseInt(launchCount, 10);
launchCount += 1;
localStorage.setItem('launchCount', launchCount);
AppStore.state.firstTimeUse.launchCount = launchCount;

if (launchCount <= 2) {
  AppStore.state.firstTimeUse.tour.inFlight = true;
}

/*
 * instantiate top level components
 */

var display = document.createElement('vaani-display');
var talkie = document.createElement('vaani-talkie');
var toolbar = document.createElement('vaani-toolbar');

/*
 * kick things off
 */

document.body.appendChild(toolbar);
document.body.appendChild(talkie);
document.body.appendChild(display);

if (AppStore.state.firstTimeUse.tour.inFlight) {
  DisplayActions.changeViews('vaani-ftu-popup');
}

/*
 * global state change handler
 */

var handleStateChange = function () {
  if (AppStore.state.firstTimeUse.tour.inFlight) {
    if (AppStore.state.firstTimeUse.tour.current === 0) {
      DisplayActions.changeViews('vaani-ftu-popup');
      display.shadowRoot.querySelector('.content').removeChild(ftuPopup);
      ftuPopup = null;
    }
  }
};

AppStore.addChangeListener(handleStateChange);
