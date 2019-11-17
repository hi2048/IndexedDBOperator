import config from './config';

const connect = ({ name = config.name, version  }) => {
  const promise = new Promise((resolve, reject) => {
    let dbConnection;
    const request = window.indexedDB.open(name, version);

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