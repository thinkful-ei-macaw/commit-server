const StreakService = { 

  getStreak(knex, id) {
    return knex
      .from('commit_users')
      .select('streak')
      .where({ id })
      .first();
  },
  updateStreaks(knex, streak, id) {
    return knex('commit_users')
      .where({ id })
      .update({streak});
  }
};

module.exports = StreakService;
