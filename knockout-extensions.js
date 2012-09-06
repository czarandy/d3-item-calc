function coalesce() {
  for (var i = 0; i < arguments.length; ++i) {
    if (arguments[i] !== null && arguments[i] !== undefined) {
      return arguments[i];
    }
  }
}

ko.observableArray.fn.sum = function(key) {
  return ko.computed(function() {
    return _.chain(this())
            .map(function(x) { return x[key]() | 0; })
            .reduce(function(a, b) { return a + b; }, 0)
            .value();
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
