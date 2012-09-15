function coalesce() {
  for (var i = 0; i < arguments.length; ++i) {
    if (arguments[i] !== null && arguments[i] !== undefined) {
      return arguments[i];
    }
  }
}

ko.observableArray.fn.sum = function(key) {
  return ko.computed(function() {
    return _.reduce(
      _.map(this(), function(x) {
        if (x.visible()) {
          return x[key]() | 0;
        }
        return 0;
      }),
      function(a, b) {
        return a + b;
      },
      0
     );
  }, this);
}

ko.bindingHandlers.percent = {
  update : function(el, valueAccessor, allBindingsAccessor) {
    var value = valueAccessor(),
        allBindings = allBindingsAccessor(),
        digits = coalesce(allBindings.digits, 2),
        formatted = (ko.utils.unwrapObservable(value) * 100).toFixed(digits) + '%';
    ko.bindingHandlers.text.update(el, function() { return formatted; });
  }
}

ko.bindingHandlers.floor = {
  update : function(el, valueAccessor) {
    var value = valueAccessor(),
        formatted = Math.floor(ko.utils.unwrapObservable(value));
    ko.bindingHandlers.text.update(el, function() { return formatted; });
  }
}

ko.bindingHandlers.fixed = {
  update : function(el, valueAccessor, allBindingsAccessor) {
    var value = valueAccessor(),
        allBindings = allBindingsAccessor(),
        digits = coalesce(allBindings.digits, 1),
        formatted = ko.utils.unwrapObservable(value).toFixed(digits);
    ko.bindingHandlers.text.update(el, function() { return formatted; });
  }
}
