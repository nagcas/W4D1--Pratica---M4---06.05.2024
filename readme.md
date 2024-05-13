# W4D4- Pratica

## Marketplace

### Compito di fine modulo

Sito di e-commerce con funzionalità di gestione dei prodotti.
La pagina è strutturata con Bootstrap 5.3.

E' composto da:
* Una frontpage, dove si vedono tutti i prodotti
* Una back office (dashboard) da cui aggiungere nuovi prodotti e modificare quelli esistenti
* Una pagina prodotto di dettaglio

Nel backoffice, è presente una tabella con elenco di tutti i prodotti inseriti nel database.
Il singolo prodotto può essere modificato, eliminato e visualizzato in anteprima.
Il form viene gestito con modal di bootstrap.

Nella index.html, viene elencato con delle card tutti i prodotti presenti nel database.
Ho implementato la funzione aggiunfi al carrello con il conteggio dei prodotti, la somma del prezzo totale, l'eliminazione del singolo prodotto e di tutti i prodotti nel carrello.
Il carrello viene gestito con il modal di bootstrap.

In ogni card sono presenti due button, inserisci nel carrello e visualizza i dettagli del prodotto passando il suo ID come query string nell'URL.

### Struttura dell'API:

```
"_id": "00000000001",                     // GENERATO DAL SERVER
"name": "3310 cellphone",                 // OBBLIGATORIO
"description": "An unforgettable icon.",  // OBBLIGATORIO
"brand": "Nokia",                         // OBBLIGATORIO
"imageUrl": "https://bit.1y/3CExjRa",     // OBBLIGATORIO
"price": 100,                             // OBBLIGATORIO
"userId": "admin",                        // OBBLIGATORIO
"createdAt": "2021-09-19T09:32:10.535Z",  // GENERATO DAL SERVER
"updateddAt": "2021-09-19T09:32:10.535Z", // GENERATO DAL SERVER
"__v": 0                                  // GENERATO DAL SERVER

```


