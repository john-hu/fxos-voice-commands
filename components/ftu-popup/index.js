/* global AppStore, FirstTimeUserActions */

(function () {
  var ownerDocument = document.currentScript.ownerDocument;
  var Element = Object.create(HTMLElement.prototype);

  Object.assign(Element, {
    createdCallback: function () {
      console.log('FtuPopup component created.', arguments);

      var template = ownerDocument.querySelector('#markup');
      var clone = document.importNode(template.content, true);
      // var root = this.createShadowRoot();

      this.appendChild(clone);
      // root.appendChild(clone);
    },
    attachedCallback: function () {
      console.log('FtuPopup component attached.', arguments);

      this.els = {};
      this.els.arrowUp = this.querySelector('.arrow-up');
      this.els.arrowDown = this.querySelector('.arrow-down');
      this.els.step1 = this.querySelector('.step-1');
      this.els.step2 = this.querySelector('.step-2');
      this.els.step3 = this.querySelector('.step-3');
      this.els.btns = this.querySelectorAll('.btn');

      for (var i = 0; i < this.els.btns.length; ++i) {
          var btn = this.els.btns[i];
          btn.addEventListener('click', this.nextStep.bind(this));
      }

      AppStore.emitter.addEventListener('change', this.render.bind(this));

      this.isAttached = true;

      this.render();
    },
    detachedCallback: function () {
      console.log('FtuPopup component detached.', arguments);

      for (var i = 0; i < this.els.btns.length; ++i) {
          var btn = this.els.btns[i];
          btn.removeEventListener('click', this.nextStep.bind(this));
      }

      AppStore.emitter.removeEventListener('change', this.render.bind(this));
    },
    attributeChangedCallback: function (attr, oldValue, newValue) {
      console.log('FtuPopup component attribute change', arguments);

      if (!this.isAttached) {
        console.log('FtuPopup not attached');
        return;
      }
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
    }
  });

  document.registerElement('vaani-ftu-popup', {
    prototype: Element
  });
})();
