const {MongoDB} = require("./db");
const collectionName = "comments";

const FIELDS = {
  POST_ID: 'post_id',
  USER_ID: 'user_id',
  PARENT_COMMENT_ID: 'parent_comment_id',
  COMMENT: 'comment',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at'
}

class Comments extends MongoDB {
  constructor(){
    super();
  }


  async init() {
    if(!this.collection) {
      const db = await super.getDBInstance();
      this.collection = db.collection(collectionName);
    }
  }

  getCollectionInstance() {
    return this.collection;
  }

  async insertPost(post) {
    return new Promise((resolve, reject) => {
      this.collection.insertOne(post, (err, data) => {
        if(err) return reject(err);
        data.originalData = post;
        resolve(data);
      });
    });
  }
}

module.exports = {
  instance: new Comments(),
  FIELDS
};