/* global AppStore */

(function () {
  var ownerDocument = document.currentScript.ownerDocument;
  var Element = Object.create(HTMLElement.prototype);

  Object.assign(Element, {
    createdCallback: function () {
      console.log('Toolbar component created.', arguments);

      var template = ownerDocument.querySelector('#markup');
      var clone = document.importNode(template.content, true);
      // var root = this.createShadowRoot();

      this.appendChild(clone);
      // root.appendChild(clone);
    },
    attachedCallback: function () {
      console.log('Toolbar component attached.', arguments);

      this.els = {};
      this.els.community = this.querySelector('.community');
      this.els.communityImg = this.els.community.querySelector('img');
      this.els.help = this.querySelector('.help');
      this.els.helpImg = this.els.help.querySelector('img');

      this.els.community.addEventListener('click', this.toggleCommunity.bind(this));
      this.els.help.addEventListener('click', this.toggleHelp.bind(this));

      AppStore.emitter.addEventListener('change', this.render.bind(this));

      this.isAttached = true;

      this.render();
    },
    detachedCallback: function () {
      console.log('Toolbar component detached.', arguments);

      this.els.community.removeEventListener('click', this.toggleCommunity.bind(this));
      this.els.help.removeEventListener('click', this.toggleHelp.bind(this));

      AppStore.emitter.removeEventListener('change', this.render.bind(this));
    },
    attributeChangedCallback: function (attr, oldValue, newValue) {
      console.log('Toolbar component attribute change', arguments);

      if (!this.isAttached) {
        console.log('Toolbar not attached');
        return;
      }
    },
    render: function () {
      if (AppStore.state.toolbar.activeItem === 'community') {
        this.els.communityImg.src = this.els.communityImg.dataset.srcActive;
        this.els.helpImg.src = this.els.helpImg.dataset.srcInactive;
      }
      else if (AppStore.state.toolbar.activeItem === 'help') {
        this.els.communityImg.src = this.els.communityImg.dataset.srcInactive;
        this.els.helpImg.src = this.els.helpImg.dataset.srcActive;
      }
      else {
        this.els.communityImg.src = this.els.communityImg.dataset.srcInactive;
        this.els.helpImg.src = this.els.helpImg.dataset.srcInactive;
      }
    },
    toggleCommunity: function () {
      if (AppStore.state.firstTimeUse.tour.inFlight) {
        return;
      }

      var isSelected = AppStore.state.toolbar.activeItem === 'community';
      ToolbarActions.setActiveItem(isSelected ? 'none': 'community');
    },
    toggleHelp: function () {
      if (AppStore.state.firstTimeUse.tour.inFlight) {
        return;
      }

      var isSelected = AppStore.state.toolbar.activeItem === 'help';
      ToolbarActions.setActiveItem(isSelected ? 'none': 'help');
    }
  });

  document.registerElement('vaani-toolbar', {
    prototype: Element
  });
})();
