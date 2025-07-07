document
  .getElementById("poke_btn")
  .addEventListener("click", async function () {
    try {
      const pokeInput = document
        .getElementById("pokemon-input")
        .value.toLowerCase()
        .trim();
      const pokeImg = document.getElementById("poke_img");
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokeInput}`
      );
      if (!response.ok) {
        throw new Error("Pokémon não encontrado");
      }
      const data = await response.json();
      pokeImg.src = data.sprites.front_default;
      pokeImg.style.display = "block";
      const poke_name = document.getElementById("poke_name");
      poke_name.textContent = data.name.toUpperCase();
      const poke_height = document.getElementById("poke_height");
      poke_height.textContent = `Altura: ${data.height / 10} m`;
      const poke_weight = document.getElementById("poke_weight");
      poke_weight.textContent = `Peso: ${data.weight / 10} kg`;

      const poke_type = document.getElementById("poke_type");
      const types = data.types.map((typeInfo) => typeInfo.type.name);
      if (types.length === 1) {
        poke_type.textContent = `Tipo: ${types.join(", ")}`;
      } else poke_type.textContent = `Tipos: ${types.join(", ")}`;

      const poke_info = document.getElementById("pokemon-info");
      poke_info.style.display = "block";

      const pokejson = JSON.stringify({
        name: data.name,
        height: data.height,
        weight: data.weight,
        front_default: data.sprites.front_default,
        types: types,
      });

      const response2 = await fetch("/api/pokemon/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ json: pokejson }),
      });

      if (!response2.ok) {
        throw new Error("Falha ao salvar Pokémon");
      }

      const result = await response2.text();
      console.log("Resposta do servidor:", result);
      alert("Pokémon salvo com sucesso!");

    } catch (error) {
      console.error("Erro ao buscar Pokémon:", error);
      alert("Pokémon não encontrado. Por favor, tente novamente.");
      document.getElementById("poke_img").style.display = "none";
      document.getElementById("pokemon-info").style.display = "none";
    }
  });
