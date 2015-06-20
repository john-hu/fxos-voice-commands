/* global ToolbarActions */

(function () {
  var ownerDocument = document.currentScript.ownerDocument;
  var Element = Object.create(HTMLElement.prototype);

  Object.assign(Element, {
    createdCallback: function () {
      console.log('Help component created.', arguments);

      var template = ownerDocument.querySelector('#markup');
      var clone = document.importNode(template.content, true);
      // var root = this.createShadowRoot();

      this.appendChild(clone);
      // root.appendChild(clone);

      this.isAttached = true;
    },
    attachedCallback: function () {
      console.log('Help component attached.', arguments);

      this.dialog = this.querySelector('gaia-dialog-alert');
      this.dialog.open();
      this.dialog.addEventListener('closed', function () {
        ToolbarActions.setActiveItem('none');
      });
    },
    detachedCallback: function () {
      console.log('Help component detached.', arguments);
    },
    attributeChangedCallback: function (attr, oldValue, newValue) {
      console.log('Help component attribute change', arguments);

      if (!this.isAttached) {
        console.log('Help not attached');
        return;
      }
    }
  });

  document.registerElement('vaani-help', {
    prototype: Element
  });
})();
