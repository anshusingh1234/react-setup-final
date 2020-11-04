const KEYS = {
  USER_SHORT_DETAIL: (userId) => {
    return `USERS:${userId}`;
  },
  EVENT_MATCH: (eventType, age, gender, topicId) => {
    return `EVENTMATCH:${eventType}:${age}:${gender}:${topicId}`;
  },
  SSO_TOKEN: (token) => {
    return `SSO:${token}`;
  }
};

module.exports = KEYS;