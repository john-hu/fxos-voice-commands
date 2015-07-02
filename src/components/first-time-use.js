import GaiaComponent from 'gaia-component';
import AppStore from '../stores/app';
import FirstTimeUseActions from '../actions/first-time-use';


var FirstTimeUse = GaiaComponent.register('vaani-first-time-use', {
  created: function () {
    this.setupShadowRoot();

    this.els = {};
    this.els.arrowUp = this.shadowRoot.querySelector('.arrow-up');
    this.els.arrowDown = this.shadowRoot.querySelector('.arrow-down');
    this.els.step1 = this.shadowRoot.querySelector('.step-1');
    this.els.step2 = this.shadowRoot.querySelector('.step-2');
    this.els.step3 = this.shadowRoot.querySelector('.step-3');
    this.els.btns = this.shadowRoot.querySelectorAll('.btn');
  },
  attached: function () {
    for (var i = 0; i < this.els.btns.length; ++i) {
        var btn = this.els.btns[i];
        btn.addEventListener('click', this.nextStep.bind(this));
    }

    AppStore.addChangeListener(this.render.bind(this));

    this.isAttached = true;

    this.render();
  },
  detached: function () {
    for (var i = 0; i < this.els.btns.length; ++i) {
        var btn = this.els.btns[i];
        btn.removeEventListener('click', this.nextStep.bind(this));
    }

    AppStore.removeChangeListener(this.render.bind(this));
  },
  render: function () {
    var currentStep = AppStore.state.firstTimeUse.tour.current;

    this.els.step1.style.display = currentStep === 1 ? 'block' : 'none';
    this.els.step2.style.display = currentStep === 2 ? 'block' : 'none';
    this.els.step3.style.display = currentStep === 3 ? 'block' : 'none';

    this.els.arrowUp.classList.remove('arrow-up-left');
    this.els.arrowUp.classList.remove('arrow-up-right');
    this.els.arrowDown.classList.remove('arrow-down-center');

    if (currentStep === 2) {
      this.els.arrowUp.classList.remove('arrow-up-right');
      this.els.arrowUp.classList.add('arrow-up-left');
    }

    if (currentStep === 3) {
      this.els.arrowUp.classList.remove('arrow-up-left');
      this.els.arrowUp.classList.add('arrow-up-right');
    }
  },
  nextStep: function () {
    FirstTimeUseActions.advanceTour();
  },
  template: `
    <div id="first-time-use">
      <div class="arrow-up"></div>
      <div class="container">
        <div class="step-1">
          <h3 class="title">What is Vaani?</h3>
          <p class="message">Vaani is the voice recognition system that can do things for you.</p>
          <hr />
          <button class="btn">Ok</button>
        </div>
        <div class="step-2">
          <h3 class="title">Help the Community!</h3>
          <p class="message">You can help us improve Vaani's speech recognition by reading sentences.</p>
          <hr />
          <button class="btn">Ok</button>
        </div>
        <div class="step-3">
          <h3 class="title">Not sure what to ask Vaani?</h3>
          <p class="message">Find a list of everythign you can say to Vaani here.</p>
          <hr />
          <button class="btn">Ok</button>
        </div>
      </div>
      <div class="arrow-down"></div>
    </div>

    <style>
      #first-time-use {
        position: relative;
        margin: 0 1.5rem;
      }
      #first-time-use .arrow-up {
        display: none;
        position: absolute;
        top: -1.2rem;
        width: 0;
        height: 0;
        border-left: 1.2rem solid transparent;
        border-right: 1.2rem solid transparent;
        border-bottom: 1.2rem solid rgba(201, 228, 253, 0.75);
      }
      #first-time-use .arrow-up-left {
        display: block;
        left: 0;
      }
      #first-time-use .arrow-up-right {
        display: block;
        right: 0;
      }
      #first-time-use .container {
        padding: 0 1.5rem;
        border-radius: 2px;
        background-color: #c9e4fd;
        background-color: rgba(201, 228, 253, 0.75);
      }
      #first-time-use .title {
        color: #4d4d4d;
        font-size: 1.7rem;
        font-weight: 600;
        text-align: center;
        margin: 0;
        padding: 1.5rem 0 0 0;
      }
      #first-time-use .message {
        color: #4d4d4d;
        font-size: 1.5rem;
        line-height: 1.9rem;
      }
      #first-time-use .message-only {
        padding: 1.5rem 0;
      }
      #first-time-use hr {
        border: 0;
        height: 0.1rem;
        background-color: #000;
        opacity: 0.2;
        margin: 0;
      }
      #first-time-use .btn {
        color: #00aacc;
        font-weight: normal;
        font-style: italic;
        font-size: 1.7rem;
        display: block;
        height: 4rem;
        width: 100%;
        text-align: center;
        background: none;
        border: none;
      }
      #first-time-use .step-1,
      #first-time-use .step-2,
      #first-time-use .step-3 {
        display: none;
      }
    </style>
  `
});


export default FirstTimeUse;
