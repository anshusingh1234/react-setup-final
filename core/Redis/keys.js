const KEYS = {
  USER_SHORT_DETAIL: (userId) => { return `USERS:${userId}`; },
  EVENT_MATCH: (eventType, age, gender) => { return `EVENTMATCH:${eventType}:${age}:${gender}`; }
};

module.exports = KEYS;