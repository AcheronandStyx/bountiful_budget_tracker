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
  console.log("onsuccess triggered");
  if (navigator.online) {
    uploadTransaction();
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

function uploadTransaction() {
  // open a db transaction
  const transaction = db.transaction(["offline_transaction"], "readwrite");
  // access the object store
  const transactionObjectStore = transaction.objectStore("offline_transaction");
  // get all the records and set to a variable
  const getAll = transactionObjectStore.getAll();

  getAll.onsuccess = function () {
    // if objects are in store upload them
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open another db transaction
          const transaction = db.transaction(
            ["offline_transaction"],
            "readwrite"
          );
          // access the object store
          const transactionObjectStore = transaction.objectStore(
            "offline_transaction"
          );
          // clear the object store after upload so dups can't be uploaded later
          transactionObjectStore.clear();

          alert("Saved transactions have been uploaded.");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// when app goes online call uploadTransaction
window.addEventListener("online", uploadTransaction);
