/**
 * Javascript index.js
 * data 06.05.2024
 * by Gianluca Chiaravalloti
*/

/**
 * Inizializzo le costanti e variabili globali
 * -------------------------------------------
*/

// Inizializzo la variabile url dell'api della lista dei prodotti presenti nel server
const url = "https://striveschool-api.herokuapp.com/api/product/"

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNGY2ZTBiM2IyNTAwMTUxYjU0NzEiLCJpYXQiOjE3MTU1NDQyOTQsImV4cCI6MTcxNjc1Mzg5NH0.LvfHMjTsGRN4TMQ0aqLaBwmJQ9wrX3G_M4Q6whpiwNo";
// Inizializzo la variabile del button search
const inputSearchBtn = document.getElementById("inputSearchBtn");
// Inzizializzo la variabile della casella input di ricerca
const inputSearch = document.getElementById("inputSearch");
// Inizializzo la variabile reset per eliminare le card presenti nel document html
const inputResetBtn = document.getElementById("inputResetBtn");
// Inzizializzo la variabile della casella input di ricerca
const amount = document.getElementById("amount");
// Inizializzo la variabile invalid per verificare l'inserimento corretto nella ricerca
const invalid = document.getElementById("invalid-feedback");
// Inizializzo la variabile searchSectionProducts per selezionare il puntatore della ricerca
const searchSectionProducts = document.querySelector(".searchSectionProducts");
// Inizializzo la costante per richiamare lo spinner
const spinner = document.getElementById("spinner");


// Inzializzo l'array vuoto della quantità dei prodotti acquistati
let quantityProducts = [];
// Inizializzo la variabile a 0 del valore della quantità dei prodotti
let quantityProductsBuy = 0;
// Inizializzo a 0 il prezzo totale del carrello
let totalPrice = 0;


/**
 * COSTANTI E VARIABILI DELLA FUNZIONE MODAL
 * -----------------------------------------
*/

// Inizializzo la variabile shopping al puntatore del carrello
const shopping = document.getElementById("shopping");
// Inizializzo la variabile modalCart per inserire il contenuto dei prodotti acquistati
let modalCart = document.querySelector(".modal-body");
// Inizializzo la variabile removeAllProducts per rimuovere tutti i prodotti dal carrello
const removeAllProducts = document.getElementById("removeAllProducts");
// Inizializzo la variabile buy del button buy "paga"
const buy = document.getElementById("buy");
// Inizializzo la variabile totalPriceHtml per variare il contenuto del prezzo totale
const totalPriceHtml = document.querySelector(".totalPrice");


/**
 * Si attiva nel momento in cui si apre il document html
 * -----------------------------------------------------
*/
document.addEventListener("DOMContentLoaded", async () => {

  // let productsBuy = localStorage.getItem("memoryProductsBuy");
  //   if (productsBuy) {
  //     amount.innerHTML = productsBuy;  
  // };
  
  //localStorage.removeItem("memoryProducts");
  //localStorage.removeItem("memoryProductsBuy");
  
  // Inserisco nel document il valore della variabile badge del carrello
  amount.innerText = quantityProductsBuy;

  // Eseguo la chiamata fetch dell'url API
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    }
  });

  // Verifico la risposta del server
  if (!response.ok) {
    throw new Error("Risposta networks non andata a buon fine.");
  };

  // Restituisce la risposta in formato json
  const products = await response.json();
  // Richiamo la funzione visualizza tutti i prodotti nel document html
  viewProducts(products);
  // Richiamo la funzione per aggiungere i prodotti al carrello
  addCart(products);  
});

/**
 * Funzione visualizza elenco dei Products in formato card nel document html
 * -------------------------------------------------------------------------
*/
function viewProducts(products) {
  // Visualizza lo spinner durante il caricamento
  viewSpinner();
  // Inizializzo la variabile per inserire il contenuto dei prodotti
  let contentProducts = document.querySelector(".content-products");
  // Eseguo un ciclo su tutto il contenuto del mio array di oggetti
  products.forEach(product => {
    // Inizializzo un div con classe card
    let content = document.createElement("div");
    content.className = `card p-0 g-4 card-home`;
    // Inserisco il contenuto del prodotto in una card
    content.innerHTML = `
      <div id="${product["name"]}">
      <!-- Immagine del prodotto -->
        <img src="${product["imageUrl"]}" class="card-img-top p-1" alt="${product["name"]}">
        <!-- Contenuto della card -->
        <div class="card-body">
          <!-- Nome del prodotto -->
          <h5 class="card-title">${product["name"]}</h5>
          <!-- Prezzo del prodotto -->
          <p class="card-text fw-bold fs-5">${product["price"]} €</p>
          <!-- Categoria del prodotto -->
          <p class="card-text">${product["brand"]}</p>
          <!-- ID del prodotto -->
          <p class="card-text mb-5">${product["_id"]}</p>
          <!-- Bottone per aggiungere il prodotto al carrello -->
          <button class="addProduct btn mb-2 w-100 btn-success" id="${product["_id"]}">
            <i class="bi bi-cart-plus"></i> 
            Add to Cart
          </button>
          <!-- Link per visualizzare i dettagli del prodotto -->
          <a class="detailProduct btn mb-2 w-100 btn-primary" href="./detail.html?idProduct=${product["_id"]}&titleProduct=${product["name"]}">
            Detail product
          </a>
        </div>
      `
    // Aggiungo il contenuto della card del prodotto creata nel document html
    contentProducts.appendChild(content);

    // Aggiungo "hidden" allo spinner
    hideSpinner();
  });
};


/**
 * Funzione aggiungi prodotto nel carrello in funzione del codice id
 * -----------------------------------------------------------------
*/
function addCart(products) {
  // Eseguo un ciclo su tutto il contenuto dell'oggetto
  products.forEach(product => {
    // Inizializzo la variabile con il codice id del singolo prodotto
    let codeId = document.getElementById(`${product["_id"]}`);
    // Se si clicca sul pulsante aggiungi il prodotto viene aggiunto al carrello
    codeId.addEventListener("click", () => {
      // Se si verifica la condizione in cui il button è verde
      if (codeId.classList[codeId.classList.length - 1] === "btn-success") {
        // Aggiungo una quantità +1 al conteggio dei prodotti acquistati
        quantityProductsBuy += 1;
        // Aggiungo al totale del prezzo la somma del prezzo del singolo prodotto acquistato
        totalPrice += parseFloat(product["price"]);
        // Aggiungo al catalogo i miei acquisti il codice del prodotto acquistato
        quantityProducts.push(product["_id"]);        
        // Modifico il testo del pulsante "aggiungi al carrello" con "rimuovi dal carrello"
        codeId.innerHTML = `<i class="bi bi-cart-dash"></i> Remove to Cart`;
        // Rimuovo al button il colore verde
        codeId.classList.remove("btn-success");
        // Aggiungo al button il colore rosso
        codeId.classList.add("btn-danger");
      } else {
        // Trova l'indice dell'elemento da rimuovere
        let indexToRemove = quantityProducts.indexOf(product["_id"]);
        if (indexToRemove !== -1) {
          // Rimuovi l'elemento dall'array
          quantityProducts.splice(indexToRemove, 1);
        } 
        // Rimuovi prodotto dall'array prodotti acquistati
        quantityProductsBuy -= 1;
        // Riduce dal prezzo totale il prezzo del singolo prodotto rimosso
        totalPrice -= parseFloat(product["price"]);
        // Modifico il testo del pulsante "rimuovi dal carrello" con "aggiungi al carrello" 
        codeId.innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart`;
        // Rimuovo al button il colore rosso
        codeId.classList.remove("btn-danger");
        // Aggiungo al button il colore verde
        codeId.classList.add("btn-success");  
      };
      // Aggiorno il contenuto al badge dei prodotti acquistati
      amount.innerHTML = quantityProductsBuy;
      // Implemento la funzione per aggiornare il contenuto della local storage deiprodotti
      // localStorage.setItem("memoryProductsBuy", quantityProductsBuy);
      // localStorage.setItem("memoryProducts", quantityProducts);
      

    });
  });

  // Visualizzo nel modal il contenuto del mio carrello degli acquisti al click dell'icona cart nel menù
  shopping.addEventListener("click", () => {

    // let memoryProducts = localStorage.getItem("memoryProducts");
    // if (memoryProducts) {
    //   memoryTutto = memoryProducts.split();
    //   console.log(memoryTutto);
    // }
    
    
    
    
    // Eseguo una pulizia del suo contenuto
    modalCart.innerHTML = "";
    // Verifico se la quantità dei prodotti acquistati è maggiore di 0
    if (quantityProducts.length > 0) {
      // Eseguo un ciclo sul contenuto dell'arrey che contiene i codici dei prodotti inseriti con l'acquisto
      quantityProducts.forEach(product => {
        // eseguo un ciclo su tutti i prodotti dell'oggetto 
        products.forEach(product_ => {
          // Creo il contenuto da visualizzare all'interno del modal in modo da visualizzare i prodotti acquistati
          let productSection = document.createElement("div");
          if (product_["_id"] === product) {
            productSection.className = "card mt-4 card-cart";
            productSection.innerHTML = `
              <!-- Contenuto della card -->
              <div class="border-line" id="${product_["name"]}+${product_["_id"]}">
                <div class="row g-1 d-flex align-items-center">
                  <div class="col-4 col-md-4">
                    <!-- Immagine del prodotto -->
                    <img src="${product_["imageUrl"]}" class="img-fluid" alt="${product_["name"]}">
                  </div>
                  <div class="col-8 col-md-8">
                    <div class="card-body">
                      <!-- Nome del prodotto -->
                      <h5 class="card-title card-shopping">${product_["name"]}</h5>
                      <!-- ID del prodotto -->
                      <p class="card-text fw-bold">Id: ${product_["_id"]}</p>
                      <!-- Prezzo del prodotto -->
                      <p class="card-text fw-bold">${product_["price"]} €</p>
                      <!-- Bottone per rimuove il prodotto al carrello -->
                      <button class="btn btn-danger btn-sm remove" id="${product_["_id"]}"><i class="bi bi-cart-dash"></i> Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            `
            // Aggiungo il contenuto della card del prodotto creata nel modal
            modalCart.append(productSection);
          };
          // Inserisco il valore del prezzo totale da visualizzare nel modal del carrello
          totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
          // Verifico se il prezzo totale è maggiore di 0 visualizzo nel modal il pulsante elimina tutti i prodotti e il pulsante acquista
          if (totalPrice > 0) {
            removeAllProducts.classList.remove("d-none");
            removeAllProducts.classList.add("d-block");
            buy.classList.remove("d-none");
            buy.classList.add("d-block");
          };
        });
      });
    } else {
      // Visualizza il testo nel modal di articoli non presenti.
      totalPrice = 0;
      modalCart.innerHTML = `<p id="empty">Empty cart...</p>`;
      totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
      // Se il carrello non contiene prodotti selezionati per essere acquistati i pulsanti di elimina tutti i prodotti e di acquista non vengono visualizzati
      removeAllProducts.classList.remove("d-block");
      removeAllProducts.classList.add("d-none");
      buy.classList.remove("d-block");
      buy.classList.add("d-none");
    };
    
    // Al click del button "rimuovi tutti i prodotti" dal modal viene eseguito un reset del contenuto
    removeAllProducts.addEventListener("click", () => {
      modalCart.innerHTML = "";
      totalPriceHtml.innerHTML = "";
      let content = document.querySelectorAll(".card-cart");
      content.forEach(card => {
        card.remove();
      });
      // Vengono inizializzate a 0 tutte le variabili principali quando vengono rimossi tutti i prodotti
      amount.innerText = 0;
      quantityProductsBuy = 0;
      totalPrice = 0;
      quantityProducts = [];
      products.forEach(product => {
        document.getElementById(`${product["_id"]}`).innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart`;
        document.getElementById(`${product["_id"]}`).classList.remove("btn-danger");
        document.getElementById(`${product["_id"]}`).classList.add("btn-success");
      });
      totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
      removeAllProducts.classList.remove("d-block");
      removeAllProducts.classList.add("d-none");
      buy.classList.remove("d-block");
      buy.classList.add("d-none");
    });

    // Inzizializzo la variabile remove to cart per rimuovere il singolo prodotto dal carrello
    let remove = document.querySelectorAll(".remove");
    // Rimuove singolo prodotto dal carrello degli acquisti e aggiorna il contenuto
    remove.forEach((elimina) => {
      // Al click eseguo la funzione di rimozione del prodotto
      elimina.addEventListener("click", () => {
        products.forEach(product => {
          // Eseguo una verifica se il codice asin corrisponde al codice da eliminare
          if (product["_id"] === elimina.id) {
            document.getElementById(`${product["name"]}+${product["_id"]}`).remove();
            // Trova l'indice dell'elemento da rimuovere
            let indexToRemove = quantityProducts.indexOf(elimina.id);
            if (indexToRemove !== -1) {
              // Rimuovi l'elemento dall'array
              quantityProducts.splice(indexToRemove, 1);
            }
            // La quantità dei prodotti viene diminuita
            quantityProductsBuy -= 1;
            // Il prezzo totale viene diminuito del valore corrispondente al prodotto
            totalPrice -= product["price"];
            if (totalPrice.toFixed(0) > 0) {
              totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
              removeAllProducts.classList.remove("d-none");
              removeAllProducts.classList.add("d-block");
              buy.classList.remove("d-none");
              buy.classList.add("d-block");
            } else {
              totalPrice = 0;
              modalCart.innerHTML = `<p id="empty">Empty cart...</p>`;
              totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
              removeAllProducts.classList.remove("d-block");
              removeAllProducts.classList.add("d-none");
              buy.classList.remove("d-block");
              buy.classList.add("d-none");
            };
            document.getElementById(`${product["_id"]}`).innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart`;
            document.getElementById(`${product["_id"]}`).classList.remove("btn-danger");
            document.getElementById(`${product["_id"]}`).classList.add("btn-success");
          };
        });
        amount.innerText = quantityProductsBuy;
      });
    });
    
    // Rimuove tutti i prodotti dal carrello
    removeAllProducts.addEventListener("click", () => {
      modalCart.innerHTML = "";
      totalPriceHtml.innerHTML = "";
      let content = document.querySelectorAll(".card-cart");
      content.forEach(card => {
        card.remove();
      });
    });
  });
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
