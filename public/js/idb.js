let db; // create db connection variable

const request = indexedDB.open("offlineTransactions", 1); // establish a connection to the db being created

// triggers on change to databases structure. Ex when it is first created or version changes
// it then creates the object store to house transactions which were entered while offline
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("offline_transaction", { autoIncrement: true }); // Set auto-increment to true to ensure unique indexes for each object and ease of data retrieval
};

request.onsuccess = function (event) {
  db = event.target.result;
  // if app is online upload the new transaction
  if (navigator.online) {
    // uploadTransaction();
  }
};

request.onerror = function (event) {
  // show me the error if one occurs
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  console.log("entered saveRecord", record);
  // open a new transaction with the db and grant read/write permission
  const transaction = db.transaction(["offline_transaction"], "readwrite");
  console.log("transaction created", transaction);
  // access the objectStore
  const transactionObjectStore = transaction.objectStore("offline_transaction");

  console.log(transactionObjectStore);
  // add the offline transaction to the store
  transactionObjectStore.add(record);
}
