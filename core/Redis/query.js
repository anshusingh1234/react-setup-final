const RedisConnection = require("./connection");
const {reject} = require("async");

module.exports = {
  set: (key, value, callback) => {
    const client = RedisConnection.getInstance();

    if (client) {
      client.set(key, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  get: (key, callback) => {
    const client = RedisConnection.getInstance();

    if (client) {
      client.get(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  del: (key, callback) => {
    const client = RedisConnection.getInstance();

    if (client) {
      client.del(key, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  keys: (pattern, callback) => {
    const client = RedisConnection.getInstance();
    console.log('APAPAPAP', pattern);
    if (client) {
      client.keys(pattern, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  scan: (cursor, pattern, count, callback) => {
    const client = RedisConnection.getInstance();
    console.log('ALL DATAT', cursor, pattern, count);
    if (client) {
      client.scan(cursor, 'MATCH',pattern,'COUNT', count, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  hset: (hash, callback) => {
    const client = RedisConnection.getInstance();
    if (client && hash.key && hash.field) {
      client.hset(hash.key, hash.field, JSON.stringify(hash.value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  hget: (hash, callback) => {
    const client = RedisConnection.getInstance();
    if (client && hash.key && hash.field) {
      client.hget(hash.key, hash.field, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  mget: (keys, callback) => {
    const client = RedisConnection.getInstance();
    if (client) {
      client.mget(keys, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },
  asyncMget: async (keys) => {
    const client = RedisConnection.getInstance();
    return await new Promise((resolve, reject) => {
      if (client) {
        client.mget(keys, (error, result) => {
          if (error || !result) {
            reject('not found')
          }
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  },
  hmset: (key, values, callback) => {
    const client = RedisConnection.getInstance();

    if (client && key && values && Object.keys(values).length > 0) {
      client.hmset(key, values, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },

  asyncHmset: (key, values, callback) => {
    const client = RedisConnection.getInstance();
    return new Promise((resolve, reject) => {
      if (client && key && values && Array.isArray(values) && values.length > 0) {
        client.hmset(key, values, (error, result) => {
          if (error) return reject(err);
          resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid", null);
      }
    })
  },

  hmget: (key, fields, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key && fields && Array.isArray(fields) && fields.length > 0) {
      client.hmget(key, fields, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },

  hdel: (hash, callback) => {
    const client = RedisConnection.getInstance();
    if (client && hash.key && hash.field) {
      client.hdel(hash.key, hash.field, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  zadd: (sortedSet, callback) => {
    const { key, value, score } = sortedSet;
    const client = RedisConnection.getInstance();
    if (client && key && value && score) {
      client.zadd(key, score, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },

  zrange: (sortedSet, callback) => {
    const { key, start, stop } = sortedSet;
    const client = RedisConnection.getInstance();
    if (client && key && !isNaN(start) && !isNaN(stop)) {
      client.zrange(key, start, stop, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },

  zrevrange: (sortedSet, callback) => {
    const { key, start, stop } = sortedSet;
    const client = RedisConnection.getInstance();
    if (client && key && !isNaN(start) && !isNaN(stop)) {
      client.zrevrange(key, start, stop, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },

  hkeys: (key, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.hkeys(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client or key/values is invalid", null);
    }
  },
  asyncHkeys: (key) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.hkeys(key, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client or key/values is invalid")
      }
    })
  },
  asyncHget: (hash) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && hash.key && hash.field) {
        client.hget(hash.key, hash.field, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  asyncLpush: ({ key, value }) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key && value) {
        client.LPUSH(key, value, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  asyncLRANGE: ({ key, i, j }) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client) {
        client.LRANGE(key, i, j, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  asyncPOP: ({ key }) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client) {
        client.LPOP(key, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },
  asyncLTRIM: ({ key, i, j }) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client) {
        client.LTRIM(key, i, j, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },

  hgetall: (key, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.hgetall(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  incr: (key, callback) => {
    const client = RedisConnection.getInstance();

    if (client) {
      client.incr(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  lpush: (key, value, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.LPUSH(key, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  lrange: (key, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.LRANGE(key, 0, -1, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  hincrby: (key, field, incrementBy, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key && field && typeof incrementBy === 'number') {
      client.hincrby(key, field, incrementBy, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback();
    }
  },

  sadd: (key, value, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.sadd(key, value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  srem: (key, value, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.srem(key, value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  sismember: (key, value, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.sismember(key, value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  smembers: (key, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.smembers(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  asyncSetex: (key, TTL, value) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key && TTL && value) {
        client.SETEX(key, TTL, value, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    });
  },

  setex: (key, expiry, value, callback) => {
    const client = RedisConnection.getInstance();
    if (client) {
      client.setex(key, expiry, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  //total members count
  scard: (key, callback) => {
    const client = RedisConnection.getInstance();
    if (client && key) {
      client.scard(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  },

  expire: (key, TTL) => {
    return new Promise((resolve, reject) => {
      const client = RedisConnection.getInstance();
      if (client && key) {
        client.expire(key, TTL, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis client");
      }
    })
  }
};
