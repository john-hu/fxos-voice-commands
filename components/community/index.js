/* global ToolbarActions */

(function () {
  var ownerDocument = document.currentScript.ownerDocument;
  var Element = Object.create(HTMLElement.prototype);

  Object.assign(Element, {
    createdCallback: function () {
      console.log('Community component created.', arguments);

      var template = ownerDocument.querySelector('#markup');
      var clone = document.importNode(template.content, true);
      // var root = this.createShadowRoot();

      this.appendChild(clone);
      // root.appendChild(clone);

      this.isAttached = true;
    },
    attachedCallback: function () {
      console.log('Community component attached.', arguments);

      this.dialog = this.querySelector('gaia-dialog-alert');
      this.dialog.open();
      this.dialog.addEventListener('closed', function () {
        ToolbarActions.setActiveItem('none');
      });
    },
    detachedCallback: function () {
      console.log('Community component detached.', arguments);
    },
    attributeChangedCallback: function (attr, oldValue, newValue) {
      console.log('Community component attribute change', arguments);

      if (!this.isAttached) {
        console.log('Community not attached');
        return;
      }
    }
  });

  document.registerElement('vaani-community', {
    prototype: Element
  });
})();
