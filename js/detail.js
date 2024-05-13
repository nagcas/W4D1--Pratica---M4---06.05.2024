/**
 * Javascript detail.js
 * data 06.05.2024
 * by Gianluca Chiaravalloti
*/


// La funzione viene eseguita nel momento in cui si apre la pagina del document html
document.addEventListener("DOMContentLoaded", function () {
  // Inizializzo la variabile url dell'api della lista dei libri presenti nel server
  //const url = "https://663bb846fee6744a6ea2b604.mockapi.io/articles/";
  const url = "https://striveschool-api.herokuapp.com/api/product/";
  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNGY2ZTBiM2IyNTAwMTUxYjU0NzEiLCJpYXQiOjE3MTU1NDQyOTQsImV4cCI6MTcxNjc1Mzg5NH0.LvfHMjTsGRN4TMQ0aqLaBwmJQ9wrX3G_M4Q6whpiwNo";
  // Recupero la stringa (ID) relativa al book 
  const params = new URLSearchParams(window.location.search);
  // Estraggo il valore del parametro "idBook"
  const idProduct = params.get("idProduct");
  // Richiamo il valore del parametro "titleBook"
  const titleProduct = params.get("titleProduct");
  // console.log(idBook); // Log di verifica

  // Fetch!
  fetch(url + idProduct, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    }
  })
    .then((response) => {
     // Verifico la risposta del server
     if (!response.ok) {
      throw new Error("Risposta networks non andata a buon fine.");
    };
    // Restituisce la risposta in formato json
    return response.json();
    })
    // Convertiamo in json la response
    .then((productDetail) => {
      // Visualizzo nel title del document html il titolo del libro
      document.title = `EPICMarket - ${titleProduct}`;
      // Richiamo la funzione che andrà a visualizzare il libro selezionato con id nel mio document html
      detailProduct(productDetail);
    });
    
    /**
     * Funzione che visualizza il dettaglio del libro selezionato nel document
    */
    function detailProduct(productDetail) {
      // Inizializzo la variabile contentBook per creare al sul interno la card del contenuto del libro selezionato
      let contentProduct = document.getElementById("product-detail");
      // Inserisco all'interno di contentProduct il markup HTML che rappresenta la card del prodotto
      contentProduct.innerHTML = `
        <div class="d-md-flex" id="${productDetail["name"]}">
          <!-- Immagine del prodotto -->
          <img src="${productDetail["imageUrl"]}" class="card-img-top p-4" alt="${productDetail["name"]}">
          <!-- Contenuto della card -->
          <div class="card-body p-4">
            <!-- Nome del prodotto -->
            <h1>${productDetail["name"]}</h1>
            <!-- Descrizione e prezzo del prodotto -->
            <p class="card-text fw-bold fs-5">${productDetail["description"]} €</p>
            <p class="card-text fw-bold fs-5">${productDetail["price"]} €</p>
            <!-- Marca e ID del prodotto -->
            <p class="card-text">Brand: ${productDetail["brand"]}</p>
            <p class="card-text mb-5">Id: ${productDetail["_id"]}</p>
            <!-- Link per tornare alla home -->
            <a class="btn mb-2 w-lg-25 btn-success" href="./index.html">
              Back to Home
            </a>
          </div>
        </div>
      `
    };
});
