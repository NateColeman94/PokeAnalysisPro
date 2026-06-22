document.addEventListener("DOMContentLoaded",()=>{
  searchButton.addEventListener("click",()=>runSearch(pokemonSearch.value));
  pokemonSearch.addEventListener("keydown",e=>{if(e.key==="Enter")runSearch(pokemonSearch.value)});
  themeToggle.addEventListener("click",toggleTheme);
  
  runSearch("charizard");
  
});
async function runSearch(value){
  clearError();
  if(!value||!value.trim()){showError("Please enter a Pokémon name.");return}
  setLoading(true);
  try{renderPokemon(await fetchPokemonData(value))}
  catch(error){showError(error.message||"Unable to load Pokémon.")}
  finally{setLoading(false)}
}
function toggleTheme(){
  document.body.classList.toggle("light");
  themeToggle.textContent=document.body.classList.contains("light")?"🌙 Dark":"☀️ Light";
}
