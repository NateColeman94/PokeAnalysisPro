const API_BASE="https://pokeapi.co/api/v2";
async function fetchPokemonData(searchTerm){
  const normalized=normalizePokemonName(searchTerm);
  const response=await fetch(`${API_BASE}/pokemon/${encodeURIComponent(normalized)}`);
  if(!response.ok)throw new Error("Pokémon not found.");
  const pokemon=await response.json();
  const speciesResponse=await fetch(pokemon.species.url);
  const species=speciesResponse.ok?await speciesResponse.json():null;
  const abilities=await Promise.all(pokemon.abilities.map(async entry=>{
    const abilityResponse=await fetch(entry.ability.url);
    let description="No description available.";
    if(abilityResponse.ok){
      const ability=await abilityResponse.json();
      const effect=ability.effect_entries.find(item=>item.language.name==="en");
      if(effect)description=effect.short_effect;
    }
    return{name:entry.ability.name,hidden:entry.is_hidden,description};
  }));
  return formatPokemon(pokemon,species,abilities);
}
function formatPokemon(pokemon,species,abilities){
  const flavor=species?.flavor_text_entries?.find(e=>e.language.name==="en");
  const genus=species?.genera?.find(e=>e.language.name==="en");
  const stats={}; pokemon.stats.forEach(item=>stats[item.stat.name]=item.base_stat);
  return{id:pokemon.id,name:pokemon.name,displayName:titleCase(pokemon.name),artwork:pokemon.sprites.other?.["official-artwork"]?.front_default||pokemon.sprites.front_default||"",types:pokemon.types.map(item=>item.type.name),height:pokemon.height,weight:pokemon.weight,stats:{hp:stats.hp||0,attack:stats.attack||0,defense:stats.defense||0,specialAttack:stats["special-attack"]||0,specialDefense:stats["special-defense"]||0,speed:stats.speed||0},abilities,species:genus?.genus||"Unknown Pokémon",description:cleanFlavorText(flavor?.flavor_text||"No Pokédex description available.")};
}
