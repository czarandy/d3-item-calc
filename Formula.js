var Formula = {
  stat : function(stat, c, ei) {
    var multiplier = 1;
    if (stat === 'vitality') {
      multiplier = 2;
    } else if (stat === c.clss().primary) {
      multiplier = 3;
    }
    var level = +c.level(),
        paragon = +c.paragon();
    return 7 + (level + paragon) * multiplier + c.getItemStat(stat, ei);
  },
  life : function(c, ei) {
    var level = +c.level(),
        vitality = +this.stat('vitality', c, ei),
        skill = c.getSkillStat('life'),
        life = c.getItemStat('life', ei);
    var base = 36 + (4 * level) + Math.max(10, level - 25) * vitality;
    return base * (1 + (life + skill) / 100);
  },
  criticalChance : function(c, ei) {
    var item_chance = c.getItemStat('critchance', ei),
        skill_chance = c.getSkillStat('crit');
    return (5 + item_chance + skill_chance) / 100;
  },
  criticalAmount : function(c, ei) {
    var item_amount = c.getItemStat('critamt', ei),
        skill_amount = c.getSkillStat('critamt');
    return (50 + item_amount + skill_amount) / 100;
  },
  criticalDamage : function(c, ei) {
    return this.criticalChance(c, ei) * this.criticalAmount(c, ei);
  },
  attacksPerSecond : function(c, ei) {
    var weapon_speed = ei == 11 ? 1 : c.items()[11].wpn().speed,
        ias = c.getItemStat('ias', ei),
        ias_skill = c.getSkillStat('ias');
    return ((ias + ias_skill) / 100) + weapon_speed;
  },
  damage : function(c, ei) {
    var weapon_damage = Math.max(4, c.getItemStat('mindmg', ei) + c.getItemStat('maxdmg', ei)),
        primary_stat = this.stat(c.clss().primary, c, ei),
        skill_damage = c.getSkillStat('damage');
    return (weapon_damage / 2) * (1 + this.criticalDamage(c)) * (1 + primary_stat / 100) * (1 + skill_damage / 100);
  },
  dps : function(c, ei) {
    return this.damage(c, ei) * this.attacksPerSecond(c, ei);
  },
  armor : function(c, ei) {
    var item = c.getItemStat('armor', ei),
        str = this.stat('strength', c, ei),
        skill = c.getSkillStat('armor');
    if (c.getSkillStat('vitarmor')) {
      str += this.stat('vitality', c, ei);
    }
    return (item + str) * (1 + skill / 100);
  },
  dodge : function(c, ei) {
    var dex = this.stat('dexterity', c, ei),
        dodge = 1 - c.getSkillStat('dodge') / 100;
    if (dex <= 100) {
      dodge *= (1 - dex * 0.001);
    } else if (dex <= 500) {
      dodge *= 1 - (0.1 + (dex - 100) * 0.00025);
    } else if (dex <= 1000) {
      dodge *= 1 - ( 0.2 + (dex - 500) * 0.0002);
    } else {
      dodge *= (1 - Math.min(skill + 0.3 + (dex - 1000) * 0.0001, 1));
    }
    return 1 - dodge;
  },
  avgres : function(c, ei) {
    var allres = c.getItemStat('allres'),
        int_res = this.stat('intelligence', c, ei) / 10,
        singleres = c.getItemStat('singleres') / 6,
        skill = c.getSkillStat('resist');
    return (allres + singleres + int_res) * (1 + skill / 100);
  },
  resreduct : function(c, ei) {
    var res = this.avgres(c, ei);
    return res / (5 * c.level() + res);
  },
  dr : function(c, ei) {
    var armor = this.armor(c, ei);
    return armor / (50 * c.level() + armor);
  },
  totalreduct : function(c, ei) {
    return (1 - this.resreduct(c, ei)) * (1 - this.dr(c, ei));
  },
  totalreductdodge : function(c, ei) {
    return this.totalreduct(c, ei) * (1 - this.dodge(c, ei));
  },
  ehp : function(c, ei) {
    var life = this.life(c, ei),
        total_reduct = this.totalreduct(c, ei);
    return life / total_reduct;
  },
  ehpdodge : function(c, ei) {
    var life = this.life(c, ei),
        total_reduct = this.totalreductdodge(c, ei);
    return life / total_reduct;
  }
};
