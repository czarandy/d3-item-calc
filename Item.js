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
    name : 'Bow',
    type : '2h',
    speed : 1.4
  },
  {
    name : 'Ceremonial Knife',
    type : '1h',
    speed : 1.4
  },
  {
    name : 'Crossbow',
    type : '2h',
    speed : 1.1
  },
  {
    name : 'Dagger',
    type : '1h',
    speed : 1.5
  },
  {
    name : 'Daibo',
    type : '2h',
    speed : 1.1
  },
  {
    name : 'Fist Weapon',
    type : '1h',
    speed : 1.4
  },
  {
    name : 'Hand Crossbow',
    type : '1h',
    speed : 1.6
  },
  {
    name : 'Mace (1h)',
    type : '1h',
    speed : 1.2
  },
  {
    name : 'Mace (2h)',
    type : '2h',
    speed : 0.9
  },
  {
    name : 'Mighty Weapon (1h)',
    type : '1h',
    speed : 1.3
  },
  {
    name : 'Mighty Weapon (2h)',
    type : '2h',
    speed : 1
  },
  {
    name : 'Polearm',
    type : '2h',
    speed : 0.95
  },
  {
    name : 'Spear',
    type : '1h',
    speed : 1.2
  },
  {
    name : 'Staff',
    type : '2h',
    speed : 1
  },
  {
    name : 'Sword (1h)',
    type : '1h',
    speed : 1.4
  },
  {
    name : 'Wand',
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
