const container = document.querySelector(".pokemon-container");
const input = document.querySelector("#input-pokemon");
const searchButton = document.querySelector("#search-button");

let pokedex = [];

const listPokemons = () => {
  loadPokedexFromLocalStorage();

  if (pokedex.length > 0) {
    pokedex.forEach((pokemon) => {
      listPokemon(pokemon);
    });
  } else {
    container.innerHTML = `<h2>Lista de Pokémons vazia!</h2>`;
  }
};

const validateInput = () => {
  return input.value.trim() === ""
    ? (alert("O campo de busca não pode ser vazio!"), location.reload())
    : (searchPokemon(input.value.toLowerCase().trim()),
      (container.innerHTML = ""));
};

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    validateInput();
  }
};

const searchPokemon = async (pokemonName) => {
  try {
    const result = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    if (!result.ok) {
      handlePokemonNotFound(result.status);
      return;
    }
    const data = await result.json();
    const { name, sprites, types } = data;
    const { front_default } = sprites.other["official-artwork"];
    const type = types[0].type.name;
    const pokemon = { name, front_default, type };

    listPokemon(pokemon);
    emptyInput();
  } catch (error) {
    console.error(error.message);
    emptyInput();
  }
};

const handlePokemonNotFound = (statusCode) => {
  switch (statusCode) {
    case 404:
      container.innerHTML = `
            <h2 class='not-found'>Pokémon não encontrado!</h2>
        `;
      throw new Error("Pokémon não encontrado.");
    case 500:
      throw new Error("Erro interno do servidor.");
    default:
      throw new Error(`Erro ao buscar Pokémon: ${result.status}`);
  }
};

const emptyInput = () => {
  input.value = "";
};

const addPokemonToList = (name, front_default, type) => {
  const existingPokemon = validateExistingPokemon(name);

  if (!existingPokemon) {
    pokedex.push({ name, front_default, type });
    savePokedexToLocalStorage();
    updateAddButton();
  }
};

const updateAddButton = () => {
  const addButton = document.querySelector(".add-button");
  addButton.textContent = "Adicionado";
  addButton.removeAttribute("onclick");
  addButton.setAttribute("disabled", "");
};

const validateExistingPokemon = (pokemonName) => {
  return pokedex.some((pokemon) => pokemon.name === pokemonName);
};

const listPokemon = (pokemon) => {
  const { name, front_default, type } = pokemon;
  const type_colors = {
    bug: "--bug-label",
    dark: "--dark-label",
    dragon: "--dragon-label",
    electric: "--electric-label",
    fairy: "--fairy-label",
    fire: "--fire-label",
    fighting: "--fighting-label",
    flying: "--flying-label",
    ghost: "--ghost-label",
    grass: "--grass-label",
    ground: "--ground-label",
    ice: "--ice-label",
    normal: "--normal-label",
    poison: "--poison-label",
    psychic: "--psychic-label",
    rock: "--rock-label",
    steel: "--steel-label",
    water: "--water-label",
  };

  const backgroundColor = `var(${type_colors[type]})`;

  const existingPokemon = validateExistingPokemon(name);
  const addButtonDisabled = existingPokemon ? "disabled" : "";

  container.innerHTML += `
    <div class="pokemon-content" style="border: 2px solid ${backgroundColor}"}>
        <img src="${front_default}" />
        <div class="pokemon-information">
            <h2>${name}</h2>
            <span style="background-color: ${backgroundColor}">${type}</span>
        </div>
    </div>
    <button class="add-button" onclick="addPokemonToList('${name}', '${front_default}', '${type}') ${addButtonDisabled}">Adicionar</button>
  `;
};

const savePokedexToLocalStorage = () => {
  localStorage.setItem("pokedex", JSON.stringify(pokedex));
};

const loadPokedexFromLocalStorage = () => {
  const storedPokedex = localStorage.getItem("pokedex");

  pokedex = JSON.parse(storedPokedex) ?? [];
};

searchButton.addEventListener("click", validateInput);
input.addEventListener("keypress", handleKeyPress);

listPokemons();
