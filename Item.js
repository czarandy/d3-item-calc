function Item(slot, items, character) {
  var item = {};
  if (items) {
    item = _.find(items, function(x) {
      return x.slot === slot;
    }) || item;
  }
  this.slot = slot;
  this.armor = ko.observable(item.armor);
  this.strength = ko.observable(item.strength);
  this.dexterity = ko.observable(item.dexterity);
  this.intelligence = ko.observable(item.intelligence);
  this.vitality = ko.observable(item.vitality);
  this.life = ko.observable(item.life);
  this.allres = ko.observable(item.allres);
  this.singleres = ko.observable(item.singleres);
  this.mindmg = ko.observable(item.mindmg);
  this.maxdmg = ko.observable(item.maxdmg);
  this.critchance = ko.observable(item.critchance);
  this.critamt = ko.observable(item.critamt);
  this.ias = ko.observable(item.ias);
  this.visible = ko.observable(true);
}

function Offhand(slot, items, character, weapon) {
  Item.call(this, slot, items, character);
  this.visible = ko.computed(function() {
    return weapon.wpn().type === '1h';
  }, this);
}

var WeaponConfig = [
  {
    name : 'Axe (1h)',
    type : '1h',
    speed: 1.3
  },
  {
    name : 'Axe (2h)',
    type : '2h',
    speed : 1
  },
  {
    name : 'Crossbow',
    type : '2h',
    speed : 1.1
  },
  {
    name : 'Sword (1h)',
    type : '1h',
    speed : 1.4
  }
];

function Weapon(slot, items, character) {
  Item.call(this, slot, items, character);

  var wpn = WeaponConfig[0];
  if (items) {
    for (var i = 0; i < items.length; ++i) {
      if (items[i].slot === slot) {
        for (var j = 0; j < WeaponConfig.length; ++j) {
          if (WeaponConfig[j].name === items[i].wpn.name) {
            wpn = WeaponConfig[j];
            break;
          }
        }
        break;
      }
    }
  }
  this.wpn = ko.observable(wpn);
}
