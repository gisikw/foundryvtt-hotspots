const hooks = {};

module.exports = {
  Hooks: {
    on(event, cb) {
      hooks[event] = hooks[event] || [];
      hooks[event].push(cb);
    },
    call(event, payload) {
      (hooks[event]||[]).forEach(cb => cb(payload));
    }
  }
};
