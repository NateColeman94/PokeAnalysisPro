let currentPokemon=null;
function setLoading(isLoading){loading.classList.toggle("hidden",!isLoading);searchButton.disabled=isLoading}
function showError(message){errorBox.textContent=message;errorBox.classList.remove("hidden")}
function clearError(){errorBox.textContent="";errorBox.classList.add("hidden")}
function renderPokemon(pokemon){
  currentPokemon=pokemon;
  pokemonName.textContent=pokemon.displayName;officialArtwork.src=pokemon.artwork;officialArtwork.alt=pokemon.displayName;
  dexNumber.textContent=formatDex(pokemon.id);species.textContent=pokemon.species;height.textContent=meters(pokemon.height);weight.textContent=kilograms(pokemon.weight);
  description.textContent=pokemon.description;renderTypes(pokemon.types);renderStats(pokemon.stats);renderAbilities(pokemon.abilities);renderTypeMatchups(pokemon.types);
}
function renderTypes(types){typeBadges.innerHTML=types.map(t=>`<span class="type-badge ${t}">${t}</span>`).join("")}
function renderStats(stats){
  const list=[["HP",stats.hp],["Attack",stats.attack],["Defense",stats.defense],["Sp. Atk",stats.specialAttack],["Sp. Def",stats.specialDefense],["Speed",stats.speed]];
  bst.textContent=list.reduce((s,[,v])=>s+v,0);
  document.getElementById("stats").innerHTML=list.map(([l,v])=>`<div class="stat-row"><div class="stat-label"><span>${l}</span><span>${v}</span></div><div class="stat-bar"><div class="stat-fill" style="width:${Math.min(v/255*100,100)}%"></div></div></div>`).join("");
}
function renderAbilities(abilities){document.getElementById("abilities").innerHTML=abilities.map(a=>`<div class="ability-item"><strong>${titleCase(a.name)}</strong><p>${a.description}</p>${a.hidden?'<span class="hidden-tag">Hidden Ability</span>':''}</div>`).join("")}
function badgeList(types){return types.map(t=>`<span class="type-badge ${t}">${t}</span>`).join("")||"<em>None</em>"}
function renderTypeMatchups(types){
  const m=calculateDefensiveMatchups(types);
  typeMatchups.innerHTML=`<div class="matchup-section"><h3>4× Weak</h3>${badgeList(m["4x"])}</div><div class="matchup-section"><h3>2× Weak</h3>${badgeList(m["2x"])}</div><div class="matchup-section"><h3>Neutral</h3>${badgeList(m["1x"])}</div><div class="matchup-section"><h3>½× Resist</h3>${badgeList(m["0.5x"])}</div><div class="matchup-section"><h3>¼× Resist</h3>${badgeList(m["0.25x"])}</div><div class="matchup-section"><h3>Immune</h3>${badgeList(m["0x"])}</div>`;
}
