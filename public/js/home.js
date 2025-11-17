const myModal = new bootstrap.Modal(document.getElementById("transaction-modal"));
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = { transactions: [] };

document.getElementById("button-logout").addEventListener("click", logout);

document.getElementById("transactions-button").addEventListener("click", function() {
  window.location.href = "transactions.html";
});

// ADICIONAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", function(e) {
  e.preventDefault();

  // Corrigido: IDs iguais aos do modal
  const value = parseFloat(document.getElementById("transaction-value").value);
  const description = document.getElementById("transaction-description").value;
  const date = document.getElementById("transaction-date").value;
  const type = document.getElementById("transaction-type").value;

  data.transactions.unshift({
    value: value,
    type: type,
    description: description,
    date: date
  });

  saveData(data);

  e.target.reset();
  myModal.hide();

  getCashIn();
  getCashOut();
  getTotal();


  alert("Lançamento adicionado com sucesso.");
});

// Valida login antes de permitir uso
checkLogged();

function checkLogged() {
  if (session && !sessionStorage.getItem("logged")) {
    sessionStorage.setItem("logged", session);
    logged = session;
  }
    

  if (!logged) {
    window.location.href = "index.html";
    return;
  }

  const dataUser = localStorage.getItem(logged);
  
    if (dataUser) {
    data = JSON.parse(dataUser); 
  }

  getCashIn();
  getCashOut();
  getTotal();

}


function logout() {
  console.log("Logout clicado!");
  sessionStorage.clear();
  localStorage.removeItem("session");
  window.location.href = "index.html";
}

// Função que calcula e exibe o total
function getTotal() {
  const transactions = data.transactions;
  let total = 0;

  transactions.forEach((item) => {
    // ⚠️ Importante: Verifica o formato de texto padronizado
    if (item.type === "entrada") { 
      total += item.value;
    } else if (item.type === "saida") {
      total -= item.value;
    }
  });

  // Exibe o total formatado no elemento com id="total"
  document.getElementById("total").innerHTML = `R$ ${total.toFixed(2).replace('.', ',')}`;
}


function getCashIn() {
  const transactions = data.transactions;
  // Filtra pelo tipo "entrada"
  const cashIn = transactions.filter((item) => item.type === "entrada"); 

  let cashInHtml = ``;     
  let limit = 0;           

  if (cashIn.length) {
    limit = cashIn.length > 5 ? 5 : cashIn.length; // Limita a 5 itens
    
    for (let index = 0; index < limit; index++) {
      // Formatação para exibição na lista de entradas
      cashInHtml += `
      <div class="row mb-4">
          <div class="col-12">
              <h3 class="fs-12">R$ ${cashIn[index].value.toFixed(2).replace('.', ',')}</h3>
              <div class="container p-0">
                  <div class="row">
                      <div class="col-12 col-md-8">
                          <p>${cashIn[index].description}</p>
                      </div>
                      <div class="col-12 col-md-3 d-flex justify-content-end">
                          ${cashIn[index].date}
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `
    }
  }

  document.getElementById("cash-in-list").innerHTML = cashInHtml;
}


function getCashOut() {
  const transactions = data.transactions;
  // Filtra pelo tipo "saida"
  const cashOut = transactions.filter((item) => item.type === "saida"); 

  let cashOutHtml = ``;     
  let limit = 0;           

  if (cashOut.length) {
    limit = cashOut.length > 5 ? 5 : cashOut.length; // Limita a 5 itens

    for (let index = 0; index < limit; index++) {
      // Formatação para exibição na lista de saídas
      cashOutHtml += `
      <div class="row mb-4">
          <div class="col-12">
              <h3 class="fs-12">R$ ${cashOut[index].value.toFixed(2).replace('.', ',')}</h3>
              <div class="container p-0">
                  <div class="row">
                      <div class="col-12 col-md-8">
                          <p>${cashOut[index].description}</p>
                      </div>
                      <div class="col-12 col-md-3 d-flex justify-content-end">
                          ${cashOut[index].date}
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `
    }
  }

  document.getElementById("cash-out-list").innerHTML = cashOutHtml;
}  

function saveData(data) {
  localStorage.setItem(logged, JSON.stringify(data));
}

