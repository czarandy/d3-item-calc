function Character(saved_data) {

  this.clss = ko.observable(loadFromConfig(ClassConfig, saved_data.clss));
  this.follower = ko.observable(loadFromConfig(FollowerConfig, saved_data.follower));

  this.level = ko.observable(saved_data.level || 60);
  this.paragon = ko.observable(saved_data.paragon || 0);

  var weapon = new Weapon('Weapon', saved_data.items, this);
  this.items = ko.observableArray([
    new Item('Helm', saved_data.items, this),
    new Item('Shoulders', saved_data.items, this),
    new Item('Amulet', saved_data.items, this),
    new Item('Chest', saved_data.items, this),
    new Item('Gloves', saved_data.items, this),
    new Item('Bracers', saved_data.items, this),
    new Item('Belt', saved_data.items, this),
    new Item('Ring (L)', saved_data.items, this),
    new Item('Ring (R)', saved_data.items, this),
    new Item('Pants', saved_data.items, this),
    new Item('Boots', saved_data.items, this),
    weapon,
    new Offhand('Offhand', saved_data.items, this, weapon)
  ]);

  // Comparison item
  this.comparisonslots = [];
  for (var i = 0; i < this.items().length; ++i) {
    var item = this.items()[i];
    this.comparisonslots.push({ name : item.slot, index : i });
  }
  this.cmpslot = ko.observable(this.comparisonslots[0]);
  this.cmpitem = ko.observable(new Weapon('Comparison', {}, this));

  this.getSkillStat = function(stat) {
    function helper(skills) {
      return _.reduce(skills, function(memo, skill) {
        if (skill.selected()) {
          memo += skill[stat] || 0;
        }
        return memo;
      }, 0);
    }
    return helper(this.clss().skills) + helper(this.follower().skills);
  }.bind(this);

  this.getItemStat = function(stat, exclude_item, additional_item) {
    var val = this.items.sum(stat)();
    if (exclude_item !== undefined) {
      val -= this.items()[exclude_item][stat]() || 0;
    }
    if (additional_item) {
      val += (additional_item[stat]() | 0);
    }
    return val;
  }.bind(this);

  this.excludedps = function(i) {
    var dps = Formula.dps(this),
        excluded_dps = Formula.dps(this, i);
    return Math.max(0, (dps - excluded_dps) / dps);
  }.bind(this);

  this.excludeehp = function(i) {
    var ehp = Formula.ehpdodge(this),
        excluded_ehp = Formula.ehpdodge(this, i);
    return Math.max(0, (ehp - excluded_ehp) / ehp);
  }.bind(this);

  this.cmpdps = ko.computed(function() {
    var dps = Formula.dps(this),
        cmpdps = Formula.dps(this, this.cmpslot().index, this.cmpitem());
    return (cmpdps - dps) / dps;
  }, this);

  this.cmpehp = ko.computed(function() {
    var ehp = Formula.ehpdodge(this),
        cmpehp = Formula.ehpdodge(this, this.cmpslot().index, this.cmpitem());
    return (cmpehp - ehp) / ehp;
  }, this);

  // Save data to local storage when anything changes. This is somewhat
  // roundabout because we have to:
  // a) avoid serializing this property along with the rest
  // b) only call the save function once for each change
  var current_data;
  ko.computed(function() {
    return ko.toJSON(this);
  }, this).subscribe(function() {
    _.defer(function() {
      var json_data = ko.toJSON(this);
      if (json_data !== current_data) {
        localStorage.setItem('d3_data', json_data);
        current_data = json_data;
      }
    }.bind(this));
  }.bind(this));
};
