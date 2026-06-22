
function initializeThemeToggle(){
  const themeButton = document.getElementById("themeToggle");
  if(!themeButton) return;
  document.body.classList.remove("light-mode"); // default stays dark
  themeButton.textContent = "☀️ Light";
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeButton.textContent = document.body.classList.contains("light-mode") ? "🌙 Dark" : "☀️ Light";
  });
}

document.addEventListener("DOMContentLoaded",()=>{initializeThemeToggle();searchButton.onclick=()=>runSearch(pokemonSearch.value);pokemonSearch.onkeydown=e=>{if(e.key==="Enter")runSearch(pokemonSearch.value)};pokemonSearch.oninput=handleSuggest;shinyToggle.onchange=()=>{shinyStatus.textContent=shinyToggle.checked?"ON":"OFF";if(currentPokemon)officialArtwork.src=shinyToggle.checked&&currentPokemon.shiny?currentPokemon.shiny:currentPokemon.artwork};moveSearch.oninput=applyMoveFilters;typeFilter.onchange=applyMoveFilters;categoryFilter.onchange=applyMoveFilters;addTeamBtn.onclick=addToTeam;clearTeamBtn.onclick=clearTeam;saveTeamBtn.onclick=saveTeam;loadTeamBtn.onclick=loadTeam;csvBtn.onclick=exportCSV;jsonBtn.onclick=exportJSON;showdownBtn.onclick=exportShowdown;runSearch("charizard");renderTeam()});async function runSearch(v){clearError();suggestions.classList.add("hidden");setLoading(true);try{renderPokemon(await fetchPokemonData(v))}catch(e){showError(e.message||"Could not load Pokémon.")}finally{setLoading(false)}}async function handleSuggest(){const q=pokemonSearch.value;if(q.length<2){suggestions.classList.add("hidden");return}const s=await fetchSuggestions(q);suggestions.innerHTML=s.map(x=>`<div class="suggestion" onclick="pickSuggestion('${x.name}')"><span>${titleCase(x.name)}</span><small> ${x.name}</small></div>`).join("");suggestions.classList.toggle("hidden",!s.length)}function pickSuggestion(n){pokemonSearch.value=n;suggestions.classList.add("hidden");runSearch(n)}