const PersistenceManager = {
  async save(ctx) {
    if (ctx.profile && typeof ctx.profile.save === 'function') {
      await ctx.profile.save();
    }
    if (ctx.learningMap && typeof ctx.learningMap.save === 'function') {
      await ctx.learningMap.save();
    }
    if (ctx.session && typeof ctx.session.save === 'function') {
      await ctx.session.save();
    }
  }
};

module.exports = PersistenceManager;
