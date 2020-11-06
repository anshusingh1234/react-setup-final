const KEYS = {
  USER_SHORT_DETAIL: (userId) => {
    return `USERS:${userId}`;
  },
  EVENT_MATCH: (eventType, age, gender, topicId) => {
    const keyMatch = `${eventType}:${age}:${gender}:${topicId}`.toLowerCase();
    return `EVENTMATCH:${keyMatch}`;
  },
  SSO_TOKEN: (token) => {
    return `SSO:${token}`;
  }
};

module.exports = KEYS;