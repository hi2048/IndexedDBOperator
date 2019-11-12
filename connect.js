import config from './config';

const connect = (options = config) => {
  const promise = new Promise((resolve, reject) => {
    let dbConnection;
    const request = window.indexedDB.open(options.name, options.version);

    request.onerror = e => {
      reject(e);
    }

    request.onsuccess = e => {
      dbConnection = request.result;

      resolve(dbConnection);
    }

    request.onupgradeneeded = e => {
      dbConnection = e.target.result;

      resolve(dbConnection);
    }
  })

  return promise;
}

export default connect;