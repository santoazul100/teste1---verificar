"use strict";
document.getElementById("botao").addEventListener("click", function () {
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
});


document.getElementById("nome").addEventListener("keypress", function(e) {
  if(e.key === 'Enter') {
    document.getElementById("botao").click();
  }
});