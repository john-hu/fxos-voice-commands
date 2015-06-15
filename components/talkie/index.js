/* global AppStore */

(function () {
  var ownerDocument = document.currentScript.ownerDocument;
  var Element = Object.create(HTMLElement.prototype);

  Object.assign(Element, {
    createdCallback: function () {
      console.log('Talkie component created.', arguments);

      var template = ownerDocument.querySelector('#markup');
      var clone = document.importNode(template.content, true);
      // var root = this.createShadowRoot();

      this.appendChild(clone);
      // root.appendChild(clone);
    },
    attachedCallback: function () {
      console.log('Talkie component attached.', arguments);

      this.els = {};
      this.els.mic = this.querySelector('.mic');
      this.els.sending = this.querySelector('.sending');
      this.els.receiving = this.querySelector('.receiving');
      this.els.idlePopup = this.querySelector('.idle-popup');

      this.els.mic.addEventListener('click', this.toggleMic.bind(this));

      AppStore.emitter.addEventListener('change', this.render.bind(this));

      this.isAttached = true;

      this.render();
    },
    detachedCallback: function () {
      console.log('Talkie component detached.', arguments);

      this.els.mic.removeEventListener('click', this.toggleMic.bind(this));

      AppStore.emitter.removeEventListener('change', this.render.bind(this));
    },
    attributeChangedCallback: function (attr, oldValue, newValue) {
      console.log('Talkie component attribute change', arguments);

      if (!this.isAttached) {
        console.log('Talkie not attached');
        return;
      }
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
    }
  });

  document.registerElement('vaani-talkie', {
    prototype: Element
  });
})();
