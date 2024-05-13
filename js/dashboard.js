/**
 * Javascript dashboard.js
 * data 06.05.2024
 * by Gianluca Chiaravalloti
*/

/**
 * Inizializzo le costanti e variabili globali
 * -------------------------------------------
 */

// Inizializzo la variabile url dell'api della lista dei libri presenti nel server
const url = "https://striveschool-api.herokuapp.com/api/product/";
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNGY2ZTBiM2IyNTAwMTUxYjU0NzEiLCJpYXQiOjE3MTU1NDQyOTQsImV4cCI6MTcxNjc1Mzg5NH0.LvfHMjTsGRN4TMQ0aqLaBwmJQ9wrX3G_M4Q6whpiwNo";

// Elementi HTML utilizzati nella pagina
let paramId = new URLSearchParams(window.location.search);
// let id = paramId.get("id");

const form = document.getElementById("createNewProduct");
const totalProducts = document.getElementById("totalProducts");
const tableProducts = document.getElementById("tableProducts");
const buttonNewProduct = document.getElementById("buttonNewProduct");
const buttonCreateProduct = document.getElementById("buttonCreateProduct");
const previewSingleProduct = document.getElementById("previewSingleProduct");
const messageBox = document.getElementById("message-box");
const previewProductLabel = document.getElementById("previewProductLabel");
const deleteSingleProduct = document.getElementById("deleteSingleProduct");

// Caricamento iniziale della pagina
window.onload = async () => {
  // Visualizza lo spinner durante il caricamento
  viewSpinner();
  // Fetch dei prodotti
  await fetchProducts(); 
  // Ottiene i valori dal form
  getValueForm();
};


// Event listener per il pulsante "Nuovo Prodotto"
buttonNewProduct.addEventListener("click", function() {
  // Rimuove la classe "d-none" per mostrare il pulsante "Crea Prodotto"
  document.getElementById("buttonCreateProduct").classList.remove("d-none");
  // Aggiunge la classe "d-none" per nascondere il pulsante "Modifica Prodotto"
  document.getElementById("buttonModifyProduct").classList.add("d-none");
  // Modifica il testo dell'etichetta per indicare l'aggiunta di un nuovo prodotto
  document.getElementById("newProductLabel").innerText = "Insert new product";
});


/**
 * Funzione asincrona per recuperare i prodotti dall'API.
 * Aggiorna la tabella dei prodotti nel documento HTML con i dati ottenuti.
 * Se non ci sono prodotti nel database, mostra un messaggio di avviso.
 */
const fetchProducts = async() => {
  // Effettua una richiesta di tipo GET all'URL specificato, includendo l'Authorization Token nei header
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  });
  
  // Ottiene i dati JSON dalla risposta
  const articles = await response.json();
  
  // Controlla se ci sono prodotti nel database
  if (articles.length > 0) {
    // Aggiorna il conteggio totale dei prodotti nel documento HTML
    totalProducts.textContent = articles.length;
    // Itera su ciascun prodotto ottenuto e aggiorna la tabella dei prodotti nel documento HTML
    articles.forEach((article) => viewTableProducts(article));
    // Nasconde lo spinner dopo aver caricato i dati
    hideSpinner();
  } else {
    // Mostra un messaggio di avviso se non ci sono prodotti nel database
    viewMessage("No articles found in the database. Please insert a new article.", "alert-warning");
  };
};


/**
 * Funzione per visualizzare i dati dei singoli prodotti nella tabella del documento HTML.
*/
function viewTableProducts(article) {
  // Crea un nuovo elemento <tr> per rappresentare una riga nella tabella
  const content = document.createElement("tr");
  // Aggiunge la classe "listProduct" all'elemento <tr>
  content.className = "listProduct";
  // Inserisce i dati del prodotto all'interno dell'elemento <tr>
  content.innerHTML = `
    <th scope="row">${article["_id"]}</th>
    <td class="text-truncate">${article["name"]}</td>
    <td class="text-truncate">${article["description"]}</td>
    <td>${article["brand"]}</td>
    <td class="text-truncate">${article["imageUrl"]}</td>
    <td>${article["price"]} €</td>
    <td class="d-flex justify-content-center align-content-center gap-3">
      <!-- Pulsante per visualizzare i dettagli del prodotto -->
      <button class="btn btn-primary" onclick="previewProduct('${article["_id"]}')" data-bs-toggle="modal" data-bs-target="#previewProduct">
        <i class="bi bi-eye"></i>
      </button>
      <!-- Pulsante per modificare il prodotto -->
      <button class="btn btn-warning" onclick="getValueForm('${article["_id"]}')" data-bs-toggle="modal" data-bs-target="#newProduct">
        <i class="bi bi-pencil-square"></i>
      </button>
      <!-- Pulsante per eliminare il prodotto -->
      <button class="btn btn-danger" onclick="deleteProduct('${article["_id"]}')" data-bs-toggle="modal" data-bs-target="#deleteProduct">
        <i class="bi bi-trash"></i>
      </button>
    </td>
  `;
  // Aggiunge l'elemento <tr> alla tabella dei prodotti nel documento HTML
  tableProducts.appendChild(content);
}


/**
 * Funzione asincrona per creare un nuovo prodotto utilizzando i dati compilati nel form.
 * Verifica i campi obbligatori e invia la richiesta di creazione del prodotto all'API.
 * Se la richiesta ha successo, aggiorna la tabella dei prodotti e visualizza un messaggio di successo.
*/
const createProduct = async () => {
  
  // Ottiene i valori inseriti nei campi del form
  const nameForm = document.getElementById("name").value;
  const descriptionForm = document.getElementById("description").value;
  const brandForm = document.getElementById("brand").value;
  const imageUrlForm = document.getElementById("imageUrl").value;
  const priceForm = document.getElementById("price").value;

  // Verifica se tutti i campi obbligatori sono stati compilati
  if (!nameForm.trim() || !descriptionForm.trim() || !brandForm.trim() || !imageUrlForm.trim() || !priceForm.trim()) {
    // Visualizza un messaggio di errore se uno o più campi obbligatori sono vuoti
    viewMessage("The fields marked with * are mandatory! Please correctly fill in all the fields.", "alert-danger");
    // Resetto il form di inserimento prodotti
    form.reset();
    return;
  };

  // Crea un nuovo oggetto rappresentante il prodotto da creare
  const newProduct = { 
    name: nameForm, 
    brand: brandForm, 
    description: descriptionForm, 
    imageUrl: imageUrlForm, 
    price: parseFloat(priceForm).toFixed(2)
  };

  // Invia la richiesta POST all'API per creare il nuovo prodotto
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify(newProduct),
  });

  // Verifica se la richiesta ha avuto successo
  if (response.ok) {
    // Visualizza un messaggio di successo
    viewMessage("Product successfully inserted into the database.", "alert-success");
    // Cancella il contenuto della tabella dei prodotti
    tableProducts.innerHTML = "";
    // Resetto il form di inserimento prodotti
    form.reset();
    // Aggiorna la tabella dei prodotti con i dati aggiornati
    await fetchProducts();
  };
};


/**
 * Funzione asincrona per visualizzare un'anteprima di un prodotto in base all'ID fornito.
 * Esegue una richiesta GET all'API per ottenere i dettagli del prodotto.
 * Se la richiesta ha successo, visualizza i dettagli del prodotto in un'anteprima.
 * L'ID del prodotto da visualizzare.
*/
async function previewProduct (id) {
  // Esegue una richiesta GET all'API per ottenere i dettagli del prodotto
  const response = await fetch(url + id, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  });
  
  // Verifica se la risposta è valida
  if (!response) {
    // Se la risposta non è valida, genera un'errore
    throw new Error("Request error!");
  };
  
  // Converte la risposta in formato JSON
  let article = await response.json();
  
  // Ottiene il riferimento all'elemento HTML per visualizzare l'anteprima del prodotto
  const viewSingleProduct = document.getElementById("previewSingleProduct");
  
  // Cancella il contenuto precedente dell'anteprima del prodotto
  viewSingleProduct.innerHTML = "";
  
  // Crea un nuovo elemento HTML per visualizzare i dettagli del prodotto
  const content = document.createElement("div");
  content.classList.add("row", "p-4");
 
  // Inserisce i dettagli del prodotto nell'elemento HTML
  content.innerHTML = `
    <div class="col-4">
      <p>Image:</p>
      <img src="${article["imageUrl"]}" id="imageProduct">
    </div>
    <div class="col-8">
      <p>Id: <span class="fw-bold">${article["_id"]}</span></p>
      <p>Name: <span class="fw-bold">${article["name"]}</span></p>
      <p>Description: <span class="fw-bold">${article["description"]}</span></p>
      <p>Brand: <span class="fw-bold">${article["brand"]}</span></p>
      <p>Price: <span class="fw-bold">${article["price"]} €</span></p>
    </div>
  `;
 
  // Aggiunge l'elemento HTML con i dettagli del prodotto all'anteprima del prodotto
  viewSingleProduct.append(content);
};


/**
 * Funzione asincrona per ottenere i valori di un prodotto dal form in base all'ID fornito.
 * Se viene fornito un ID, esegue una richiesta GET all'API per ottenere i dettagli del prodotto.
 * Se la richiesta ha successo, imposta i valori del form con i dettagli del prodotto ottenuti.
 * L'ID del prodotto da ottenere. Se non specificato, verrà utilizzato l'ID dalla query string.
*/
const getValueForm = async (idInInput) => {
   
  // Ottiene l'ID dal parametro di input o dalla query string
  const id = idInInput || paramId.get("id");
  
  // Verifica se è stato fornito un ID
  if (id) {
    // Nasconde il pulsante per creare un nuovo prodotto e mostra il pulsante per modificare il prodotto esistente
    document.getElementById("buttonCreateProduct").classList.add("d-none");
    document.getElementById("buttonModifyProduct").classList.remove("d-none");
    document.getElementById("newProductLabel").innerText = "Modify product";
    
    // Esegue una richiesta GET all'API per ottenere i dettagli del prodotto
    const res = await fetch(url + id, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });
    
    // Converte la risposta in formato JSON
    const product = await res.json();
    
    // Imposta i valori del form con i dettagli del prodotto ottenuti
    document.getElementById("_id").value = product["_id"];
    document.getElementById("name").value = product["name"];
    document.getElementById("description").value = product["description"];
    document.getElementById("brand").value = product["brand"];
    document.getElementById("imageUrl").value = product["imageUrl"];
    document.getElementById("price").value = product["price"];
  } else {
    // Resetto il form di inserimento prodotti
    form.reset();
  }
};


/** 
 * Funzione asincrona per modificare un prodotto in base all'ID fornito.
 * Ottiene i valori aggiornati del prodotto dal form e esegue una richiesta PUT all'API per aggiornare il prodotto.
 * Se la richiesta ha successo, aggiorna la tabella dei prodotti e visualizza un messaggio di successo.
 */
const modifyProduct = async () => {
  
  // Ottiene l'ID del prodotto dal form
  const id = document.getElementById("_id").value;
  // Ottiene i valori aggiornati del prodotto dal form
  const nameForm = document.getElementById("name").value;
  const descriptionForm = document.getElementById("description").value;
  const brandForm = document.getElementById("brand").value;
  const imageUrlForm = document.getElementById("imageUrl").value;
  const priceForm = document.getElementById("price").value;
  
  // Verifica se i campi obbligatori sono stati compilati
  if (!nameForm.trim() || !descriptionForm.trim() || !brandForm.trim() || !imageUrlForm.trim() || !priceForm.trim()) {
    // Visualizza un messaggio di errore se i campi obbligatori non sono stati compilati correttamente
    viewMessage("The fields marked with * are mandatory! Please correctly fill in all fields.", "alert-danger");
    return;
  };

  // Crea un oggetto con i valori aggiornati del prodotto
  const updatedProduct = { 
    name: nameForm, 
    description: descriptionForm, 
    brand: brandForm, 
    imageUrl: imageUrlForm, 
    price: parseFloat(priceForm).toFixed(2)
  };

  // Esegue una richiesta PUT all'API per aggiornare il prodotto
  const response = await fetch(url + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify(updatedProduct),
  });
  
  // Verifica se la richiesta ha avuto successo
  if (response.ok) {
    // Svuota la tabella dei prodotti
    tableProducts.innerHTML = "";
    // Visualizza un messaggio di successo
    viewMessage("Product successfully updated!", "alert-success");
    // Aggiorna la tabella dei prodotti
    form.reset();
    await fetchProducts(); 
  };
};


/** 
 * Funzione asincrona per eliminare un prodotto in base all'ID fornito.
 * Verifica la conferma dell'utente prima di procedere con l'eliminazione.
 * Se l'utente conferma, esegue una richiesta DELETE all'API per eliminare il prodotto.
 * Se la richiesta ha successo, aggiorna la tabella dei prodotti e visualizza un messaggio di successo.
*/
const deleteProduct = async (id) => {
  
  // Verifica la conferma dell'utente prima di procedere con l'eliminazione
  if (await confirmDelete(id)) {
    // Esegue una richiesta DELETE all'API per eliminare il prodotto
    const response = await fetch(url + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });
    // Verifica se la richiesta ha avuto successo
    if (response.ok) {
      // Visualizza un messaggio di successo
      viewMessage("Product successfully deleted!", "alert-success");
      // Svuota la tabella dei prodotti
      tableProducts.innerHTML = "";
      // Aggiorna la tabella dei prodotti
      await fetchProducts();
    };
  };
};


/** 
 * Funzione che visualizza una finestra di conferma per eliminare un prodotto selezionato.
 * Mostra un messaggio di avviso con l'ID del prodotto da eliminare e due pulsanti per confermare o annullare l'azione.
 * Restituisce una promise che si risolve con true se l'utente conferma l'eliminazione, altrimenti false.
*/
function confirmDelete(id) {
  // Ottiene gli elementi della modale di conferma
  const deleteSingleProduct = document.getElementById("deleteSingleProduct");
  const deleteProductLabel = document.getElementById("deleteProductLabel");
  // Imposta l'etichetta della modale con l'ID del prodotto da eliminare
  deleteProductLabel.innerText = `Delete product - id: ${id}`;
  // Crea il contenuto della modale con i pulsanti di conferma e annullamento
  const content = document.createElement("div");
  content.innerHTML = `
    <p>Are you sure you want to delete the selected product?</p>
    <button class="btn btn-primary" id="buttonConfirmYes" data-bs-dismiss="modal">Yes</button>
    <button class="btn btn-danger" id="buttonConfirmNo" data-bs-dismiss="modal">No</button>
  `;
  deleteSingleProduct.appendChild(content);

  // Restituisce una promise che si risolve con true se l'utente conferma, altrimenti false
  return new Promise((resolve) => {
    const buttonConfirmYes = document.getElementById("buttonConfirmYes");
    const buttonConfirmNo = document.getElementById("buttonConfirmNo");

    // Aggiunge event listener per i pulsanti di conferma e annullamento
    buttonConfirmYes.addEventListener("click", () => {
      deleteSingleProduct.innerHTML = "";
      resolve(true); // Risolve la promise con true
    });

    buttonConfirmNo.addEventListener("click", () => {
      deleteSingleProduct.innerHTML = "";
      resolve(false); // Risolve la promise con false
    });
  });
};


/** 
 * Funzione per visualizzare un messaggio nell'interfaccia utente.
 * Mostra il messaggio specificato con lo stile definito dal tipo specificato.
 * Il messaggio viene visualizzato per 3 secondi prima di scomparire.
 * Il messaggio da visualizzare.
 * Il tipo di messaggio (ad esempio "alert-success", "alert-danger").
*/
function viewMessage(message, type) {
  // Imposta il testo del messaggio
  messageBox.textContent = message;
  // Aggiunge la classe per lo stile del messaggio
  messageBox.classList.add(type);
  // Mostra il messaggio
  messageBox.style.display = "block";

  // Imposta un timeout per nascondere il messaggio dopo 3 secondi
  setTimeout(() => {
    // Nasconde il messaggio
    messageBox.style.display = "none"; 
    // Rimuove la classe per lo stile del messaggio
    messageBox.classList.remove(type); 
  }, 3000); // Durata del timeout: 3 secondi
};


/** 
 * Funzione visualizza spinner
 * ---------------------------
*/
function viewSpinner() {
  document.getElementById("spinner").classList.remove("d-none");
};


/** 
 * Funzione nascondi spinner
 * -------------------------
*/
function hideSpinner() {
  document.getElementById("spinner").classList.add("d-none");
};
