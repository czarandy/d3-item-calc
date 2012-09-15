var Formula = {
  stat : function(stat, c, ei, ai) {
    var multiplier = 1;
    if (stat === 'vitality') {
      multiplier = 2;
    } else if (stat === c.clss().primary) {
      multiplier = 3;
    }
    var level = +c.level(),
        paragon = +c.paragon();
    return 7 + (level + paragon) * multiplier + c.getItemStat(stat, ei, ai);
  },
  life : function(c, ei, ai) {
    var level = +c.level(),
        vitality = +this.stat('vitality', c, ei, ai),
        skill = c.getSkillStat('life'),
        life = c.getItemStat('life', ei, ai);
    var base = 36 + (4 * level) + Math.max(10, level - 25) * vitality;
    return base * (1 + (life + skill) / 100);
  },
  criticalChance : function(c, ei, ai) {
    var item_chance = c.getItemStat('critchance', ei, ai),
        skill_chance = c.getSkillStat('crit');
    return (5 + item_chance + skill_chance) / 100;
  },
  criticalAmount : function(c, ei, ai) {
    var item_amount = c.getItemStat('critamt', ei, ai),
        skill_amount = c.getSkillStat('critamt');
    return (50 + item_amount + skill_amount) / 100;
  },
  criticalDamage : function(c, ei, ai) {
    return this.criticalChance(c, ei, ai) * this.criticalAmount(c, ei, ai);
  },
  attacksPerSecond : function(c, ei, ai) {
    var weapon_speed = ei == 11 ? 1 : c.items()[11].wpn().speed,
        ias = c.getItemStat('ias', ei, ai),
        ias_skill = c.getSkillStat('ias');
    if (ei == 11 && ai) {
      weapon_speed = ai.wpn().speed;
    }
    return ((ias + ias_skill) / 100) + weapon_speed;
  },
  damage : function(c, ei, ai) {
    var weapon_damage = Math.max(4, c.getItemStat('mindmg', ei, ai) + c.getItemStat('maxdmg', ei, ai)),
        primary_stat = this.stat(c.clss().primary, c, ei, ai),
        skill_damage = c.getSkillStat('damage');
    return (weapon_damage / 2) * (1 + this.criticalDamage(c, ei, ai)) * (1 + primary_stat / 100) * (1 + skill_damage / 100);
  },
  dps : function(c, ei, ai) {
    return this.damage(c, ei, ai) * this.attacksPerSecond(c, ei, ai);
  },
  armor : function(c, ei, ai) {
    var item = c.getItemStat('armor', ei, ai),
        str = this.stat('strength', c, ei, ai),
        skill = c.getSkillStat('armor');
    if (c.getSkillStat('vitarmor')) {
      str += this.stat('vitality', c, ei, ai);
    }
    return (item + str) * (1 + skill / 100);
  },
  dodge : function(c, ei, ai) {
    var dex = this.stat('dexterity', c, ei, ai),
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
  avgres : function(c, ei, ai) {
    var allres = c.getItemStat('allres', ei, ai),
        int_res = this.stat('intelligence', c, ei, ai) / 10,
        singleres = c.getItemStat('singleres', ei, ai) / 6,
        skill = c.getSkillStat('resist');
    return (allres + singleres + int_res) * (1 + skill / 100);
  },
  resreduct : function(c, ei, ai) {
    var res = this.avgres(c, ei, ai);
    return res / (5 * c.level() + res);
  },
  dr : function(c, ei, ai) {
    var armor = this.armor(c, ei, ai);
    return armor / (50 * c.level() + armor);
  },
  totalreduct : function(c, ei, ai) {
    return (1 - this.resreduct(c, ei, ai)) * (1 - this.dr(c, ei, ai));
  },
  totalreductdodge : function(c, ei, ai) {
    return this.totalreduct(c, ei, ai) * (1 - this.dodge(c, ei, ai));
  },
  ehp : function(c, ei, ai) {
    var life = this.life(c, ei, ai),
        total_reduct = this.totalreduct(c, ei, ai);
    return life / total_reduct;
  },
  ehpdodge : function(c, ei, ai) {
    var life = this.life(c, ei, ai),
        total_reduct = this.totalreductdodge(c, ei, ai);
    return life / total_reduct;
  }
};
