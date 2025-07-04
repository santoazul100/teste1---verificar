"use strict";
document.getElementById("botao").addEventListener("click", async  (event)=> {
  event.preventDefault();

  const nomeinput= document.getElementById("nome").value;
  const mensagem = document.getElementById("mensagem");
  const nome = nomeinput.trim(); 
  if(nome.trim() === "" ) {
    mensagem.textContent=("Por favor, preencha o campo nome.");
    mensagem.className = "erro";
  }
  else {
    mensagem.textContent = `Olá, ${nome}! Você é bonito(a)!`;
    document.getElementById("nome").value = "";
    mensagem.className = "sucesso";
    
    if(nome.toLowerCase() === "bernardo") {
      mensagem.textContent = `Olá, ${nome}! Você é O MAIS GATINHO!`;
      alert("O MAIS GATINHO!"); mensagem.className = "especial";
    }
    else if(nome.toLowerCase() === "faria") {
      mensagem.textContent = `Olá, ${nome}! Você é O MAIS QUENTINHO!`;
      alert("O MAIS QUENTINHO!"); mensagem.className = "especial";
    }
   
  }
  console.log(`Nome digitado: ${nome}`);
  console.log(`Verificação: ${mensagem.className}`);
  const nivel = mensagem.className;

  try {
        const response = await fetch('/api/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, nivel })
        });
        if (response.ok) {
            alert('Dados guardados com sucesso');
            atualizarTabela();
        } else {
            alert('Erro ao guardar ');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

document.getElementById("botao_remo").addEventListener("click", async (event) => {
  event.preventDefault(); 
  try{
    const nomeinput = document.getElementById("nome").value;
    const nome = nomeinput.trim();
    if(nome.trim() === "" ) {
      alert("Por favor, preencha o campo nome.");
      return;
    }
    const nivel = "removido";
    const response = await fetch('/api/eliminar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, nivel })
    });
    if (response.ok) {
        alert('Dados eliminados com sucesso');
        atualizarTabela();
    } else {
        alert('Erro ao eliminar dados');
    }
  }catch (error) {
    console.error('Erro:', error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  await atualizarTabela();
});

async function atualizarTabela() {
  try {
    const response = await fetch('/api/consultar');
    if (response.ok) {
      const data = await response.json();
      const lista = document.getElementById("lista-bonitos");
      lista.innerHTML = ""; 
      let n=0;
      data.forEach(item => {
        n++;
        const li = document.createElement("li");
        li.dataset.id = n;
        li.textContent = `${n}º - Nome: ${item.nome}, Nível: ${item.nivel}`;
        lista.appendChild(li);
      });
    } else {
      console.error('Erro ao obter dados da API');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

document.getElementById("nome").addEventListener("keypress", function(e) {
  if(e.key === 'Enter') {
    document.getElementById("botao").click();
  }
});