import connect from './connect';

class IndexedDBOperator {
  constructor(version) {
    if(!IndexedDBOperator.instance || version) {
      this.dbConnection = connect({ version });
      IndexedDBOperator.instance = this;
    }

    return IndexedDBOperator.instance;
  }

  static getInstance(version) {
    return new IndexedDBOperator(version);
  }

  getVersion() {
    return new Promise((resolve, reject) => {
      this.dbConnection.then(db => resolve(db.version)).catch(err => reject(err));
    });
  }

  containsObjectStore(name) {
    return new Promise((resolve, reject) => {
      this.dbConnection.then(db => {
        try {
          resolve(db.objectStoreNames.contains(name));
        } catch(err) {
          reject(err);
        }
      })
    });
  }

  createObjectStore(name, keyPath) {
    return new Promise((resolve, reject) => {
      this.dbConnection.then(db => {
        if(!db.objectStoreNames.contains(name)) {
          try {
            const objectStore = db.createObjectStore(name, { keyPath: keyPath, autoIncrement: true });

            resolve(objectStore);
          } catch(err) {
            reject(err);
          }
        }
      });
    });
  }

  create(objectStore, data) {
    return new Promise((resolve, reject) => {
      this.dbConnection.then(db => {
        const request = db.transaction([objectStore], 'readwrite').objectStore(objectStore).add(data);

        request.onsuccess = e => {
          resolve(e);
        }

        request.onerror = e => {
          reject(e);
        }
      });
    });
  }

  read(objectStore, searchIndex) {
    return new Promise((resolve, reject) => {
      this.dbConnection.then(db => {
        const request = db.transaction([objectStore]).objectStore(objectStore).get(searchIndex);

        request.onerror = e => {
          reject(e);
        };

        request.onsuccess = e => {
          resolve(request.result);
        };
      });
    });
  }

  readAll(objectStore) {
    return new Promise((resolve, reject) => {
      this.dbConnection.then(db => {
        const request = db.transaction([objectStore], 'readonly').objectStore(objectStore).openCursor();
        const list = new Array();  // objectStore list

        request.onsuccess = e => {
          const cursor = event.target.result;

          if(cursor) {
            const { key, value } = cursor;

            list.push({
              key,
              value
            });

            cursor.continue();
          } else {
            resolve(list);
          }
        };

        request.onerror = e => {
          reject(e);
        };
      });
    });
  }

  update(objectStore, data) {
    return new Promise((resolve, reject) => {
      this.dbConnection.then(db => {
        const request = db.transaction([objectStore], 'readwrite').objectStore(objectStore).put(data);

        request.onsuccess = e => {
          resolve(e);
        };

        request.onerror = e => {
          reject(e);
        };
      });
    });
  }

  delete(objectStore, searchIndex) {
    return new Promise((resolve, reject) => {
      this.dbConnection.then(db => {
        const request = db.transaction([objectStore], 'readwrite').objectStore(objectStore).delete(searchIndex);

        request.onsuccess = e => {
          resolve(e);
        };

        request.onerror = e => {
          reject(e);
        };
      });
    });
  }
}

export default IndexedDBOperator;