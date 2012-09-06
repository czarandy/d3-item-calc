function Skill(name, values) {
  this.name = name;
  _.extend(this, values);
  this.selected = ko.observable(false);
}

var FollowerConfig = [
  {
    name : 'Enchantress',
    skills : [
      new Skill('Powered Armor', { armor : 15 }),
      new Skill('Focused Mind', { ias : 3 })
    ]
  },
  {
    name : 'Scoundrel',
    skills : [
      new Skill('Anatomy', { crit : 3 })
    ]
  },
  {
    name : 'Templar',
    skills : [
    ],
  }
];

var ClassConfig = [
  {
    name : 'Barbarian',
    primary : 'strength',
    skills : [
      new Skill('Ruthless', { crit : 5, critamt : 50 }),
      new Skill('Nerves of Steel', { vitarmor : 1}),
      new Skill('Tough as Nails', { armor : 25}),
      new Skill('War Cry', { armor : 20 }),
      new Skill('War Cry (Hardened Wrath)', { armor : 40 }),
      new Skill('War Cry (Invigorate)', { armor : 20, life : 10 }),
      new Skill('War Cry (Veteran\'s Warning)', { armor : 20, dodge: 15 }),
      new Skill('War Cry (Impunity)', { armor : 20, resist : 50 })
    ]
  },
  {
    name : 'Demon Hunter',
    primary : 'dexterity',
    skills : []
  },
  {
    name : 'Monk',
    primary : 'dexterity',
    skills : []
  },
  {
    name : 'Witch Doctor',
    primary : 'intelligence',
    skills : []
  },
  {
    name : 'Wizard',
    primary : 'intelligence',
    skills : [
      new Skill('Glass Cannon', { damage : 15, resist : -10, armor : -10 }),
      new Skill('Magic Weapon', { damage : 10 }),
      new Skill('Magic Weapon (Force Weapon)', { damage : 15 }),
      new Skill('Familiar (Sparkflint)', { damage : 12 }),
      new Skill('Energy Armor', { armor : 65 }),
      new Skill('Energy Armor (Prismatic Armor)', { armor : 65, resist: 40 })
    ]
  }
];

function loadFromConfig(config, saved_data) {
  if (!saved_data) {
    return _.first(config);
  }
  var entry = _.find(config, function(entry) {
    return entry.name === saved_data.name;
  });
  _.each(saved_data.skills, function(skill, i) {
    if (skill.selected) {
      entry.skills[i].selected(true);
    }
  });
  return entry;
}
