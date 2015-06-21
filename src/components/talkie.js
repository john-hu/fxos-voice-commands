import GaiaComponent from 'gaia-component';
import AppStore from '../stores/app';
import TalkieActions from '../actions/talkie';


var Talkie = GaiaComponent.register('vaani-talkie', {
  created: function () {
    this.setupShadowRoot();

    this.els = {};
    this.els.mic = this.shadowRoot.querySelector('.mic');
    this.els.sending = this.shadowRoot.querySelector('.sending');
    this.els.receiving = this.shadowRoot.querySelector('.receiving');
    this.els.idlePopup = this.shadowRoot.querySelector('.idle-popup');
  },
  attached: function () {
    this.els.mic.addEventListener('click', this.toggleMic.bind(this));

    AppStore.addChangeListener(this.render.bind(this));

    this.render();
  },
  detached: function () {
    this.els.mic.removeEventListener('click', this.toggleMic.bind(this));

    AppStore.removeChangeListener(this.render.bind(this));
  },
  render: function () {
    if (AppStore.state.talkie.mode === 'idle') {
      this.els.idlePopup.style.display = 'block';
    }
    else {
      this.els.idlePopup.style.display = 'none';
    }

    if (AppStore.state.talkie.activeAnimation === 'receiving') {
      this.els.sending.style.display = 'none';
      this.els.receiving.style.display = 'block';
    }
    else if (AppStore.state.talkie.activeAnimation === 'sending') {
      this.els.sending.style.display = 'block';
      this.els.receiving.style.display = 'none';
    }
    else {
      this.els.sending.style.display = 'none';
      this.els.receiving.style.display = 'none';
    }
  },
  toggleMic: function () {
    if (AppStore.state.firstTimeUse.tour.inFlight) {
      return;
    }

    var isSending = AppStore.state.talkie.activeAnimation === 'sending';
    TalkieActions.setActiveAnimation(isSending ? 'none': 'sending');
  },
  template: `
    <div id="talkie">
      <div class="content">
        <div class="idle-popup">
          <div class="idle-popup-container">
            <p class="message">Tap or say "Yo Vaani" to get started.</p>
          </div>
          <div class="arrow-down"></div>
        </div>

        <div class="receiving">
          <div class="dot dot-1"></div>
        </div>

        <div class="sending">
          <div class="bubble bubble-1"></div>
          <div class="bubble bubble-2"></div>
          <div class="bubble bubble-3"></div>
        </div>

        <div class="mic">
          <img alt="tap to talk" src="/style/images/mic.png" />
        </div>
      </div>
    </div>

    <style>
      #talkie {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 23.8rem;
      }
      #talkie .content {
        position: relative;
        width: 100%;
        height: 100%;
      }
      #talkie .mic {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 6.8rem;
        width: 6.8rem;
      }
      #talkie .idle-popup {
        display: none;
        position: absolute;
        margin: 0 auto;
        width: 100%;
      }
      #talkie .idle-popup .idle-popup-container {
        text-align: center;
        margin: 0 1.5rem;
        border-radius: 2px;
        background-color: #c9e4fd;
        background-color: rgba(201, 228, 253, 0.75);
      }
      #talkie .idle-popup .message {
        color: #4d4d4d;
        font-size: 1.5rem;
        line-height: 1.9rem;
        padding: 1.5rem;
      }
      #talkie .idle-popup .arrow-down {
        width: 0;
        height: 0;
        margin: -1.5rem auto auto auto;
        border-left: 1.2rem solid transparent;
        border-right: 1.2rem solid transparent;
        border-top: 1.2rem solid rgba(201, 228, 253, 0.75);
      }
      #talkie .sending {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 6.8rem;
        width: 6.8rem;
      }
      #talkie .sending .bubble {
        position: absolute;
        height: 6.8rem;
        width: 6.8rem;
        margin-right: auto;
        margin-left: auto;
        background-color: #6c3fff;
        border-radius: 30rem;
        opacity: 0.3;

        animation-name: sending;
        animation-iteration-count: infinite;
        animation-duration: 1s;
        animation-timing-function: ease-out;
      }
      #talkie .sending .bubble-1 {
        animation-delay: 0ms;
      }
      #talkie .sending .bubble-2 {
        animation-delay: 500ms;
      }
      #talkie .sending .bubble-3 {
        animation-delay: 1500ms;
      }
      #talkie .receiving {
        display: none;
      }
    </style>
  `,
  globalCss: `
    @keyframes sending {
      0% {
        margin-top: 0;
        margin-left: 0;
        background-color: #6c3fff;
      }
      100% {
        margin-top: -13rem;
        margin-left: -13rem;
        width: 32rem;
        height: 32rem;
        opacity: 0;
        background-color: #a33fff;
      }
    }
  `
});


module.exports = Talkie;
