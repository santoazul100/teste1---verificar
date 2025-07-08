const MAX_POKEMON = 6;
document.addEventListener("DOMContentLoaded", function () {
  atualizarListaPokemons();
});
document.getElementById("clear_btn").addEventListener("click", function () {
  if (confirm("Tem certeza que deseja eliminar todos os Pokémon?")) {
    eliminarTodosPokemons();
    pokeImg.style.display = "none";
    pokeInfo.style.display = "none";
  }
});

document
  .getElementById("poke_btn")
  .addEventListener("click", async function () {
    const pokeInput = document.getElementById("pokemon-input");
    const pokeImg = document.getElementById("poke_img");
    const pokeInfo = document.getElementById("pokemon-info");

    try {
      let pokeName;
      try {
        pokeName = pokeInput.value.toLowerCase().trim();
        if (!pokeName) throw new Error("Digite o nome de um Pokémon");
      } catch (error) {
        console.error("Erro no input:", error);
        alert(error.message);
        return;
      }

      let data;
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokeName}`
        );
        if (!response.ok) {
          throw new Error(`Pokémon não encontrado (${response.status})`);
        }
        data = await response.json();
      } catch (error) {
        console.error("Erro na API:", error);
        throw new Error(
          "Pokémon não encontrado. Verifique o nome e tente novamente"
        );
      }

      try {
        try {
          pokeImg.src = data.sprites.front_default;
          pokeImg.style.display = "block";
        } catch (imgError) {
          console.error("Erro na imagem:", imgError);
          throw new Error("Formato inválido de imagem do Pokémon");
        }

        try {
          document.getElementById("poke_name").textContent =
            data.name.toUpperCase();
        } catch (nameError) {
          console.error("Erro no nome:", nameError);
        }

        try {
          document.getElementById("poke_height").textContent = `Altura: ${
            data.height / 10
          } m`;
        } catch (heightError) {
          console.error("Erro na altura:", heightError);
        }

        try {
          document.getElementById("poke_weight").textContent = `Peso: ${
            data.weight / 10
          } kg`;
        } catch (weightError) {
          console.error("Erro no peso:", weightError);
        }

        try {
          const types = data.types.map((t) => t.type.name);
          const typeElement = document.getElementById("poke_type");
          typeElement.textContent =
            types.length === 1
              ? `Tipo: ${types.join(", ")}`
              : `Tipos: ${types.join(", ")}`;
        } catch (typeError) {
          console.error("Erro nos tipos:", typeError);
        }

        pokeInfo.style.display = "block";
      } catch (uiError) {
        console.error("Erro na UI:", uiError);
        throw new Error("Erro ao exibir informações do Pokémon");
      }

      try {
        const pokejson = {
          name: data.name,
          height: data.height,
          weight: data.weight,
          front_default: data.sprites.front_default,
          types: data.types.map((t) => t.type.name),
        };

        const listaAtual = await fetch("/api/pokemon/consultar").then((r) =>
          r.json()
        );
        if (listaAtual.length >= MAX_POKEMON) {
          throw new Error(`Limite máximo de ${MAX_POKEMON} Pokémon atingido!`);
        }

        const response = await fetch("/api/pokemon/guardar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ json: JSON.stringify(pokejson) }),
        });

        if (!response.ok) {
          throw new Error(`Falha no servidor (${response.status})`);
        }

        const result = await response.text();
        console.log("Sucesso no servidor:", result);
        alert("Pokémon salvo com sucesso!");
        atualizarListaPokemons();
      } catch (serverError) {
        console.error("Erro no servidor:", serverError);
        alert(
          "Pokémon encontrado, mas falha ao salvar. Tente novamente mais tarde"
        );
      }
    } catch (mainError) {
      console.error("Erro principal:", mainError);
      alert(mainError.message);
      pokeImg.style.display = "none";
      pokeInfo.style.display = "none";
    }
  });

async function atualizarListaPokemons() {
  const pocketContainer = document.getElementById("pocket-container");
  const pocketList = document.getElementById("pokemon-pocket");
  const clearBtn = document.getElementById("clear_btn");
  const pocketCount = document.querySelector(".pocket-count");

  pocketList.innerHTML = "";

  try {
    const response = await fetch("/api/pokemon/consultar");
    if (!response.ok) return;

    const data = await response.json();

    pocketCount.textContent = `${data.length}/${MAX_POKEMON}`;

    if (data.length === 0) {
      pocketContainer.style.display = "none";
      clearBtn.style.display = "none";
      return;
    }

    pocketContainer.style.display = "block";
    clearBtn.style.display = "block";

    data.forEach((item) => {
      item.json = JSON.parse(item.json);
      addToPocket(item, pocketList);
    });
  } catch (error) {
    console.error("Erro ao atualizar lista:", error);
  }
}

function addToPocket(item, pocketList) {
  const pocketItem = document.createElement("div");
  pocketItem.className = "pocket-item";

  const img = document.createElement("img");
  img.src = item.json.front_default;
  img.alt = item.json.name;
  img.className = "pokemon-img";

  const infoDiv = document.createElement("div");
  infoDiv.className = "pocket-info";

  const nameElement = document.createElement("h4");
  nameElement.textContent = item.json.name.toUpperCase();

  const typeElement = document.createElement("p");
  typeElement.textContent = item.json.types.join("/");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "btn-eliminar";
  deleteBtn.title = "Eliminar Pokémon";
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (confirm(`Eliminar ${item.json.name}?`)) {
      await eliminarPokemon(item.json);
      pocketItem.remove();
      atualizarListaPokemons();
    }
  });

  infoDiv.appendChild(nameElement);
  infoDiv.appendChild(typeElement);

  pocketItem.appendChild(img);
  pocketItem.appendChild(infoDiv);
  pocketItem.appendChild(deleteBtn);

  pocketList.appendChild(pocketItem);
}

async function eliminarPokemon(pokemon) {
  try {
    const response = await fetch("/api/pokemon/eliminar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: JSON.stringify(pokemon) }),
    });

    if (!response.ok) {
      throw new Error("Falha ao eliminar Pokémon");
    }

    console.log("Pokémon eliminado:", pokemon.name);
  } catch (error) {
    console.error("Erro ao eliminar:", error);
    alert("Erro ao eliminar Pokémon");
  }
}

async function eliminarTodosPokemons() {
  try {
    const response = await fetch("/api/pokemon/eliminar-todos", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Falha ao eliminar todos");
    }

    atualizarListaPokemons();
    alert("Todos Pokémon foram eliminados!");
  } catch (error) {
    console.error("Erro ao eliminar todos:", error);
    alert("Erro ao eliminar todos Pokémon");
    pokeImg.style.display = "none";
    pokeInfo.style.display = "none";
  }
}