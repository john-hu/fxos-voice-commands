(function () {
  var ownerDocument = document.currentScript.ownerDocument;
  var Element = Object.create(HTMLElement.prototype);

  Object.assign(Element, {
    createdCallback: function () {
      console.log('Display component created.', arguments);

      var template = ownerDocument.querySelector('#markup');
      var clone = document.importNode(template.content, true);
      // var root = this.createShadowRoot();

      this.appendChild(clone);
      // root.appendChild(clone);

      this.isAttached = true;
    },
    attachedCallback: function () {
      console.log('Display component attached.', arguments);
    },
    detachedCallback: function () {
      console.log('Display component detached.', arguments);
    },
    attributeChangedCallback: function (attr, oldValue, newValue) {
      console.log('Display component attribute change', arguments);

      if (!this.isAttached) {
        console.log('Display not attached');
        return;
      }
    }
  });

  document.registerElement('vaani-display', {
    prototype: Element
  });
})();
