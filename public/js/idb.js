let db; // create db connection variable

const request = indexedDB.open("transactions", 1); // establish a connection to the db being created

// triggers on change to databases structure. Ex when it is first created or version changes
// it then creates the object store to house transactions which were entered while offline
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStores("new_transaction", { autoIncrement: true }); // Set auto-increment to true to ensure unique indexes for each object and ease of data retrieval
};

request.onsuccess = function(event) {
    
}
