const {MongoDB} = require("./db");
const collectionName = "comments";
const async = require("async");

const FIELDS = {
  ID: '_id',
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

  async insert(comment) {
    return new Promise((resolve, reject) => {
      this.collection.insertOne(comment, (err, data) => {
        if(err) return reject(err);
        data.originalData = comment;
        resolve(data);
      });
    });
  }

  async list(params) {
    return new Promise((resolve, reject) => {
      const skip = (params.page-1) * params.limit;
      const where = {
        [FIELDS.POST_ID]: params.feedId,
        [FIELDS.PARENT_COMMENT_ID]:0
      };

      this.collection.find(where).sort({ _id: -1 }).skip(skip).limit(params.limit).toArray((err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async delete(params) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.ID]: params.commentId
      };

      this.collection.findOneAndDelete(where, (err, data)=> {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async update(id, comment) {
    return new Promise((resolve, reject) => {
      this.collection.findOneAndUpdate({[FIELDS.ID]: id}, {$set: comment}, (err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async getOwner(commentId){
    return new Promise((resolve, reject) => {
      const where = {
        _id: commentId
      }

      const selectField = { 
        projection: 
        { 
          [FIELDS.USER_ID]:1
        } 
      }

      this.collection.findOne(where, selectField, (err, data)=> {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async replies(commentIds) {
    return new Promise ((resolve, reject) => {
      let map = new Map();
      let scripts = commentIds.map(el => cb => {
        const where = {
          [FIELDS.PARENT_COMMENT_ID]:el.toString()
        };
        this.collection.find(where).toArray((err, data) => {
          map.set(el, data);
          cb()
        });
      })
      async.parallel(scripts, () => {
        resolve(map)
      })
    })
  }

}

module.exports = {
  instance: new Comments(),
  FIELDS
};