const myModal = new bootstrap.Modal(document.getElementById("transaction-modal"));
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = { transactions: [] };

document.getElementById("button-logout").addEventListener("click", logout);




// ADICIONAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const valueInput = document.getElementById("transaction-value");
  const descriptionInput = document.getElementById("transaction-description");
  const dateInput = document.getElementById("transaction-date");
  
  // Padronização do tipo (de 1/2 para entrada/saida)
  const rawType = document.querySelector('input[name="type-input"]:checked').value;
  const type = rawType === "1" ? "entrada" : "saida";
  
  const value = parseFloat(valueInput.value);
  const description = descriptionInput.value;
  const date = dateInput.value;


  if (isNaN(value)) {
    alert("Por favor, insira um valor numérico válido.");
    return;
  }
  
  data.transactions.unshift({
    value: value,
    type: type,
    description: description,
    date: date
  });

  saveData(data);
  e.target.reset();
  myModal.hide();

  getTransactions();


  alert("Lançamento adicionado com sucesso.");
});

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

  getTransactions(); 
  
}

function logout() {
  console.log("Logout clicado!");
  sessionStorage.clear();
  localStorage.removeItem("session");
  window.location.href = "index.html";
}

function getTransactions() {
  const transactions = data.transactions;
  let transactionsHtml = ``;

  if (transactions.length) {
      transactions.forEach((item) => {
          let type = "Entrada";

          if (item.type === "saida") {
              type = "Saída";
          }

          transactionsHtml += `
            <tr>
              <th scope="row">${item.date}</th>
              <td>R$ ${item.value.toFixed(2).replace('.', ',')}</td>
              <td>${type}</td>
              <td>${item.description}</td>
            </tr>
          `
      })
  }

  document.getElementById("transactions-list").innerHTML = transactionsHtml;

}

function saveData(data) {
  localStorage.setItem(logged, JSON.stringify(data));
}

