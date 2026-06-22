const API_BASE="https://pokeapi.co/api/v2";
const TYPES=["normal","fire","water","electric","grass","ice","fighting","poison","ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"];
const CHART={normal:{rock:.5,ghost:0,steel:.5},fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},water:{fire:2,water:.5,grass:.5,ground:2,rock:2,dragon:.5},electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},ice:{fire:.5,water:.5,grass:2,ice:.5,ground:2,flying:2,dragon:2,steel:.5},fighting:{normal:2,ice:2,poison:.5,flying:.5,psychic:.5,bug:.5,rock:2,ghost:0,dark:2,steel:2,fairy:.5},poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5,steel:.5},psychic:{fighting:2,poison:2,psychic:.5,dark:0,steel:.5},bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},ghost:{normal:0,psychic:2,ghost:2,dark:.5},dragon:{dragon:2,steel:.5,fairy:0},dark:{fighting:.5,psychic:2,ghost:2,dark:.5,fairy:.5},steel:{fire:.5,water:.5,electric:.5,ice:2,rock:2,steel:.5,fairy:2},fairy:{fire:.5,fighting:2,poison:.5,dragon:2,dark:2,steel:.5}};
const MEGA={
venusaur:[["Mega Venusaur",["grass","poison"],"Thick Fat"]],
charizard:[["Mega Charizard X",["fire","dragon"],"Tough Claws"],["Mega Charizard Y",["fire","flying"],"Drought"]],
blastoise:[["Mega Blastoise",["water"],"Mega Launcher"]],
alakazam:[["Mega Alakazam",["psychic"],"Trace"]],
gengar:[["Mega Gengar",["ghost","poison"],"Shadow Tag"]],
kangaskhan:[["Mega Kangaskhan",["normal"],"Parental Bond"]],
pinsir:[["Mega Pinsir",["bug","flying"],"Aerilate"]],
gyarados:[["Mega Gyarados",["water","dark"],"Mold Breaker"]],
aerodactyl:[["Mega Aerodactyl",["rock","flying"],"Tough Claws"]],
mewtwo:[["Mega Mewtwo X",["psychic","fighting"],"Steadfast"],["Mega Mewtwo Y",["psychic"],"Insomnia"]],
ampharos:[["Mega Ampharos",["electric","dragon"],"Mold Breaker"]],
steelix:[["Mega Steelix",["steel","ground"],"Sand Force"]],
scizor:[["Mega Scizor",["bug","steel"],"Technician"]],
heracross:[["Mega Heracross",["bug","fighting"],"Skill Link"]],
houndoom:[["Mega Houndoom",["dark","fire"],"Solar Power"]],
tyranitar:[["Mega Tyranitar",["rock","dark"],"Sand Stream"]],
sceptile:[["Mega Sceptile",["grass","dragon"],"Lightning Rod"]],
blaziken:[["Mega Blaziken",["fire","fighting"],"Speed Boost"]],
swampert:[["Mega Swampert",["water","ground"],"Swift Swim"]],
gardevoir:[["Mega Gardevoir",["psychic","fairy"],"Pixilate"]],
sableye:[["Mega Sableye",["dark","ghost"],"Magic Bounce"]],
mawile:[["Mega Mawile",["steel","fairy"],"Huge Power"]],
aggron:[["Mega Aggron",["steel"],"Filter"]],
medicham:[["Mega Medicham",["fighting","psychic"],"Pure Power"]],
manectric:[["Mega Manectric",["electric"],"Intimidate"]],
sharpedo:[["Mega Sharpedo",["water","dark"],"Strong Jaw"]],
camerupt:[["Mega Camerupt",["fire","ground"],"Sheer Force"]],
altaria:[["Mega Altaria",["dragon","fairy"],"Pixilate"]],
banette:[["Mega Banette",["ghost"],"Prankster"]],
absol:[["Mega Absol",["dark"],"Magic Bounce"]],
glalie:[["Mega Glalie",["ice"],"Refrigerate"]],
salamence:[["Mega Salamence",["dragon","flying"],"Aerilate"]],
metagross:[["Mega Metagross",["steel","psychic"],"Tough Claws"]],
latias:[["Mega Latias",["dragon","psychic"],"Levitate"]],
latios:[["Mega Latios",["dragon","psychic"],"Levitate"]],
lopunny:[["Mega Lopunny",["normal","fighting"],"Scrappy"]],
garchomp:[["Mega Garchomp",["dragon","ground"],"Sand Force"]],
lucario:[["Mega Lucario",["fighting","steel"],"Adaptability"]],
abomasnow:[["Mega Abomasnow",["grass","ice"],"Snow Warning"]],
gallade:[["Mega Gallade",["psychic","fighting"],"Inner Focus"]],
audino:[["Mega Audino",["normal","fairy"],"Healer"]],
diancie:[["Mega Diancie",["rock","fairy"],"Magic Bounce"]],
beedrill:[["Mega Beedrill",["bug","poison"],"Adaptability"]],
pidgeot:[["Mega Pidgeot",["normal","flying"],"No Guard"]],
slowbro:[["Mega Slowbro",["water","psychic"],"Shell Armor"]],
rayquaza:[["Mega Rayquaza",["dragon","flying"],"Delta Stream"]]
};
let currentPokemon=null,currentMoves=[],filteredMoves=[],team=[];
function id(x){return document.getElementById(x)}
function title(t){return String(t||"").replace(/-/g," ").split(" ").map(w=>w?w[0].toUpperCase()+w.slice(1):"").join(" ")}
function norm(v){const a={"mr mime":"mr-mime","mrmime":"mr-mime","type null":"type-null","ho oh":"ho-oh","hooh":"ho-oh","porygon z":"porygon-z"};let n=(v||"").trim().toLowerCase();return a[n]||n.replace(/\./g,"").replace(/'/g,"").replace(/\s+/g,"-")}
function badge(t){return `<span class="type-badge ${t}">${t}</span>`}
function clean(t){return String(t||"").replace(/\n|\f/g," ")}

function formatGeneration(genName){
  const map={
    "generation-i":"Gen I",
    "generation-ii":"Gen II",
    "generation-iii":"Gen III",
    "generation-iv":"Gen IV",
    "generation-v":"Gen V",
    "generation-vi":"Gen VI",
    "generation-vii":"Gen VII",
    "generation-viii":"Gen VIII",
    "generation-ix":"Gen IX"
  };
  return map[genName] || title(String(genName||"").replace("generation-","Gen "));
}
function formatEvolutionRequirement(details){
  if(!details || !details.length) return "Base form";
  const d=details[0];
  const parts=[];
  if(d.min_level) parts.push("Level "+d.min_level);
  if(d.item) parts.push(title(d.item.name));
  if(d.trigger?.name==="trade") parts.push("Trade");
  if(d.held_item) parts.push("Hold "+title(d.held_item.name));
  if(d.known_move) parts.push("Knows "+title(d.known_move.name));
  if(d.known_move_type) parts.push("Knows "+title(d.known_move_type.name)+" move");
  if(d.min_happiness) parts.push("Friendship "+d.min_happiness+"+");
  if(d.min_beauty) parts.push("Beauty "+d.min_beauty+"+");
  if(d.time_of_day) parts.push(title(d.time_of_day));
  if(d.location) parts.push("At "+title(d.location.name));
  if(!parts.length && d.trigger?.name) parts.push(title(d.trigger.name));
  return parts.join(" + ") || "Special condition";
}
function flattenEvolutionChain(node, stage=1, requirement="Base form", out=[]){
  if(!node) return out;
  out.push({name:node.species.name, stage, requirement});
  if(node.evolves_to && node.evolves_to.length){
    node.evolves_to.forEach(child=>{
      flattenEvolutionChain(child, stage+1, formatEvolutionRequirement(child.evolution_details), out);
    });
  }
  return out;
}
async function fetchEvolutionChain(speciesData){
  if(!speciesData?.evolution_chain?.url) return [];
  const res=await fetch(speciesData.evolution_chain.url);
  if(!res.ok) return [];
  const data=await res.json();
  return flattenEvolutionChain(data.chain);
}

function roleOf(p){let s=p.stats;if(s.attack>=115&&s.speed>=95)return"Physical Sweeper";if(s.specialAttack>=115&&s.speed>=95)return"Special Sweeper";if(s.attack>=105&&s.specialAttack>=105)return"Mixed Attacker";if(s.hp>=90&&s.defense>=100&&s.specialDefense>=90)return"Defensive Tank";if(s.defense>=115||s.specialDefense>=115)return"Wall";if(s.speed>=110)return"Fast Utility";if(s.hp>=90)return"Bulky Support";return"Balanced"}
function natureOf(p){let r=roleOf(p),s=p.stats;if(r==="Physical Sweeper")return s.speed>=100?"Jolly / Adamant":"Adamant";if(r==="Special Sweeper")return s.speed>=100?"Timid / Modest":"Modest";if(r==="Mixed Attacker")return"Naive / Hasty";if(r==="Defensive Tank")return"Impish / Careful";if(r==="Wall")return s.defense>=s.specialDefense?"Bold / Impish":"Calm / Careful";if(r==="Fast Utility")return"Jolly / Timid";return"Flexible"}
function itemOf(p){let r=roleOf(p);if(p.types.includes("fire")&&p.types.includes("flying"))return"Heavy-Duty Boots";if(r==="Physical Sweeper")return"Choice Band / Life Orb";if(r==="Special Sweeper")return"Choice Specs / Life Orb";if(r==="Mixed Attacker")return"Life Orb / Expert Belt";if(["Defensive Tank","Wall","Bulky Support"].includes(r))return"Leftovers";return"Leftovers / Life Orb"}
function matchup(types){let g={"4x":[],"2x":[],"1x":[],"0.5x":[],"0.25x":[],"0x":[]};TYPES.forEach(a=>{let m=types.reduce((x,d)=>x*((CHART[a]&&CHART[a][d]!==undefined)?CHART[a][d]:1),1);if(m===4)g["4x"].push(a);else if(m===2)g["2x"].push(a);else if(m===1)g["1x"].push(a);else if(m===.5)g["0.5x"].push(a);else if(m===.25)g["0.25x"].push(a);else if(m===0)g["0x"].push(a)});return g}
async function fetchPokemon(term){let r=await fetch(`${API_BASE}/pokemon/${norm(term)}`);if(!r.ok)throw new Error("Pokémon not found.");let p=await r.json();let sr=await fetch(p.species.url);let sp=sr.ok?await sr.json():{};let abilities=await Promise.all(p.abilities.map(async e=>{let d="No description available.";let ar=await fetch(e.ability.url);if(ar.ok){let a=await ar.json();let eff=a.effect_entries.find(x=>x.language.name==="en");if(eff)d=eff.short_effect}return{name:e.ability.name,hidden:e.is_hidden,description:d}}));let moves=await Promise.all(p.moves.slice(0,80).map(async e=>{let mr=await fetch(e.move.url);if(!mr.ok)return null;let m=await mr.json();let eff=m.effect_entries.find(x=>x.language.name==="en");return{name:m.name,type:m.type.name,category:m.damage_class.name,power:m.power,accuracy:m.accuracy,pp:m.pp,description:eff?eff.short_effect:""}}));let stats={};p.stats.forEach(x=>stats[x.stat.name]=x.base_stat);let flavor=sp.flavor_text_entries?.find(x=>x.language.name==="en"),genus=sp.genera?.find(x=>x.language.name==="en");let gr=sp.gender_rate,gender="Unknown";if(gr===-1)gender="Genderless";else if(gr!==undefined){let f=gr*12.5;gender=`Male ${(100-f).toFixed(1)}% / Female ${f.toFixed(1)}%`}const evolutionChain=await fetchEvolutionChain(sp);let obj={id:p.id,name:p.name,displayName:title(p.name),artwork:p.sprites.other?.["official-artwork"]?.front_default||p.sprites.front_default,shiny:p.sprites.other?.["official-artwork"]?.front_shiny||p.sprites.front_shiny,types:p.types.map(x=>x.type.name),height:p.height,weight:p.weight,species:genus?.genus||"Unknown Pokémon",description:clean(flavor?.flavor_text||""),generation:sp.generation?formatGeneration(sp.generation.name):"Unknown",habitat:sp.habitat?title(sp.habitat.name):"Unknown",captureRate:sp.capture_rate??"Unknown",baseFriendship:sp.base_happiness??"Unknown",hatchSteps:sp.hatch_counter!==undefined?sp.hatch_counter*255:"Unknown",legendary:sp.is_legendary?"Yes":"No",mythical:sp.is_mythical?"Yes":"No",stats:{hp:stats.hp||0,attack:stats.attack||0,defense:stats.defense||0,specialAttack:stats["special-attack"]||0,specialDefense:stats["special-defense"]||0,speed:stats.speed||0},abilities,moves:moves.filter(Boolean),genderText:gender,hasGenderDifferences:sp.has_gender_differences||false,evolutionChain};obj.role=roleOf(obj);return obj}
async function runSearch(v){id("errorBox").classList.add("hidden");id("loading").classList.remove("hidden");try{render(await fetchPokemon(v))}catch(e){id("errorBox").textContent=e.message;id("errorBox").classList.remove("hidden")}finally{id("loading").classList.add("hidden")}}
function render(p){currentPokemon=p;currentMoves=p.moves;id("officialArtwork").src=id("shinyToggle").checked&&p.shiny?p.shiny:p.artwork;id("pokemonName").textContent=p.displayName;id("dexNumber").textContent="#"+String(p.id).padStart(4,"0");id("typeBadges").innerHTML=p.types.map(badge).join("");id("species").textContent=p.species;id("height").textContent="Height: "+(p.height/10).toFixed(1)+" m";id("weight").textContent="Weight: "+(p.weight/10).toFixed(1)+" kg";renderDex(p);renderEvolution(p);renderStats(p);renderAbilities(p);renderTypes(p);renderForms(p);renderGender(p);renderComp(p);renderCustomInputs(p);renderEvIvBuilder(p);populateDamageMoves();populateDamageMoves();renderMoveFilters(p.moves);renderMoves(p.moves)}

function renderEvolution(p){
  const container=id("evolutionChain");
  if(!container) return;
  const chain=p.evolutionChain||[];
  if(!chain.length){
    container.innerHTML="<p class='muted'>No evolution chain data available.</p>";
    return;
  }
  container.innerHTML=chain.map((e,i)=>{
    const arrow=i===0?"":`<div class="evo-arrow">↓<br><span class="evo-requirement">${e.requirement}</span></div>`;
    return `${arrow}<div class="evo-card"><h3>${title(e.name)}</h3><p>Stage ${e.stage}</p></div>`;
  }).join("");
}
function renderDex(p){id("pokedexEntry").textContent=p.description||"No Pokédex entry available.";id("pokedexInfo").innerHTML=`<div class="mini-card"><strong>Generation</strong><p>${p.generation}</p></div><div class="mini-card"><strong>Habitat</strong><p>${p.habitat}</p></div><div class="mini-card"><strong>Capture Rate</strong><p>${p.captureRate}</p></div><div class="mini-card"><strong>Base Friendship</strong><p>${p.baseFriendship}</p></div><div class="mini-card"><strong>Hatch Steps</strong><p>${p.hatchSteps}</p></div><div class="mini-card"><strong>Legendary / Mythical</strong><p>${p.legendary} / ${p.mythical}</p></div>`}
function renderStats(p){let list=[["HP",p.stats.hp],["Attack",p.stats.attack],["Defense",p.stats.defense],["Sp. Atk",p.stats.specialAttack],["Sp. Def",p.stats.specialDefense],["Speed",p.stats.speed]];id("bst").textContent=list.reduce((a,[,v])=>a+v,0);id("stats").innerHTML=list.map(([l,v])=>`<div class="stat-row"><div class="stat-label"><span>${l}</span><span>${v}</span></div><div class="bar"><div class="fill" style="width:${Math.min(v/255*100,100)}%"></div></div></div>`).join("")}
function renderAbilities(p){id("abilities").innerHTML=p.abilities.map(a=>`<div class="ability"><strong>${title(a.name)}</strong><p>${a.description}</p>${a.hidden?'<span class="pill">Hidden Ability</span>':''}</div>`).join("")}
function list(a){return a.map(badge).join("")||"<em>None</em>"}
function renderTypes(p){let m=matchup(p.types);id("typeMatchups").innerHTML=`<div class="matchup-box"><h3>4× Weak</h3>${list(m["4x"])}</div><div class="matchup-box"><h3>2× Weak</h3>${list(m["2x"])}</div><div class="matchup-box"><h3>Neutral</h3>${list(m["1x"])}</div><div class="matchup-box"><h3>½× Resist</h3>${list(m["0.5x"])}</div><div class="matchup-box"><h3>¼× Resist</h3>${list(m["0.25x"])}</div><div class="matchup-box"><h3>0× Immune</h3>${list(m["0x"])}</div>`}
function renderForms(p){
  id("formsPanel").innerHTML=`<div class="mini-card"><strong>${p.displayName}</strong>${p.types.map(badge).join("")}</div>`;
  let megas=MEGA[p.name]||[];
  const megaHtml=megas.length
    ? megas.map(m=>`<div class="mini-card"><strong>${m[0]}</strong><p>Ability: ${m[2]}</p>${m[1].map(badge).join("")}</div>`).join("")
    : "<p>No official Mega Evolution.</p>";
  id("megaPanel").innerHTML="<h3>Mega Evolutions</h3>"+megaHtml;
}
function renderGender(p){id("genderPanel").innerHTML=`<h3>Gender Differences</h3><div class="mini-card"><strong>${p.genderText}</strong></div><p>${p.hasGenderDifferences?"This species has visual gender differences.":"No known visual gender differences listed by the data source."}</p>`}
function renderComp(p){let hidden=p.abilities.find(a=>a.hidden),moves=recommendedMoves(p),m=matchup(p.types);let concerns=[];if(m["4x"].length)concerns.push("4× weakness: "+m["4x"].map(title).join(", "));if(p.types.includes("fire")&&p.types.includes("flying"))concerns.push("Heavy-Duty Boots recommended because of Rock/Stealth Rock pressure.");if(!concerns.length)concerns.push("No major red-flag concern from base typing alone.");id("competitivePanel").innerHTML=`<div class="recommend-grid"><div class="mini-card"><strong>Suggested Role</strong><p>${p.role}</p></div><div class="mini-card"><strong>Recommended Nature</strong><p>${natureOf(p)}</p></div><div class="mini-card"><strong>Recommended Ability</strong><p>${hidden?title(hidden.name)+" (Hidden option)":title(p.abilities[0]?.name||"Unknown")}</p></div><div class="mini-card"><strong>Recommended Item</strong><p>${itemOf(p)}</p></div></div><h3>Recommended Moveset</h3><div class="mini-card">${moves.map(x=>`<p class="good">✓ ${x}</p>`).join("")}</div><h3>Why this recommendation?</h3><p class="good">✓ Role is based primarily on base stats.</p><p class="good">✓ Typing, abilities, and move data adjust the recommendation.</p><h3>Concerns</h3>${concerns.map(x=>`<p class="bad">× ${x}</p>`).join("")}`}
function recommendedMoves(p){let stab=p.moves.filter(m=>p.types.includes(m.type)&&m.power).sort((a,b)=>(b.power||0)-(a.power||0)).slice(0,2);let cov=p.moves.filter(m=>!p.types.includes(m.type)&&m.power).sort((a,b)=>(b.power||0)-(a.power||0)).slice(0,2);let util=p.moves.filter(m=>m.category==="status").slice(0,2);return [...stab,...cov,...util].slice(0,4).map(m=>title(m.name))}
function renderMoveFilters(m){id("typeFilter").innerHTML='<option value="">All Types</option>'+[...new Set(m.map(x=>x.type))].sort().map(t=>`<option>${t}</option>`).join("");id("categoryFilter").innerHTML='<option value="">All Categories</option>'+[...new Set(m.map(x=>x.category))].sort().map(c=>`<option>${c}</option>`).join("")}
function renderMoves(m){filteredMoves=m;id("movesBody").innerHTML=m.map((x,i)=>`<tr class="move-row" onclick="showMove(${i})"><td>${title(x.name)}</td><td>${badge(x.type)}</td><td>${x.category}</td><td>${x.power??"—"}</td><td>${x.accuracy??"—"}</td><td>${x.pp??"—"}</td></tr>`).join("");showMove(0)}
function showMove(i){let m=filteredMoves[i];if(!m)return;id("moveDetails").innerHTML=`<h2>${title(m.name)}</h2>${badge(m.type)}<p>Category: ${m.category}</p><p>Power: ${m.power??"—"}</p><p>Accuracy: ${m.accuracy??"—"}</p><p>PP: ${m.pp??"—"}</p><p>${m.description}</p>`}
function applyMoveFilters(){let q=id("moveSearch").value.toLowerCase(),t=id("typeFilter").value,c=id("categoryFilter").value;renderMoves(currentMoves.filter(m=>(!q||m.name.includes(q))&&(!t||m.type===t)&&(!c||m.category===c)))}

function renderCustomInputs(p){
  const abilitySelect=id("customAbility");
  if(!abilitySelect) return;
  abilitySelect.innerHTML=(p.abilities||[]).map(a=>`<option value="${a.name}">${title(a.name)}${a.hidden?" (Hidden)":""}</option>`).join("");
  const preferred=p.abilities.find(a=>a.hidden)?.name || p.abilities[0]?.name || "";
  abilitySelect.value=preferred;
  if(id("customItem")) id("customItem").value=itemOf(p);
}
function resetCustomInputs(){
  if(currentPokemon) renderCustomInputs(currentPokemon);
}
function teamReadyPokemon(){
  if(!currentPokemon) return null;
  const p=JSON.parse(JSON.stringify(currentPokemon));
  p.customAbility=id("customAbility")?.value || p.abilities[0]?.name || "Unknown";
  p.heldItem=id("customItem")?.value || itemOf(p);
  p.role=roleOf(p);
  p.evIvNature=calculateFinalStats();
  return p;
}
function offensiveCoverageScore(){
  if(!team.length) return 0;
  const covered=new Set();
  team.forEach(p=>{
    (p.moves||[]).filter(m=>m.power).slice(0,30).forEach(m=>{
      TYPES.forEach(def=>{
        const mult=(CHART[m.type]&&CHART[m.type][def]!==undefined)?CHART[m.type][def]:1;
        if(mult>1) covered.add(def);
      });
    });
  });
  return Math.round((covered.size/TYPES.length)*100);
}
function defensiveCoverageScore(){
  if(!team.length) return 0;
  let sharedWeak=0, resistCount=0;
  const weakCounts={};
  team.forEach(p=>{
    const m=matchup(p.types);
    [...m["4x"],...m["2x"]].forEach(t=>weakCounts[t]=(weakCounts[t]||0)+1);
    resistCount += [...m["0.5x"],...m["0.25x"],...m["0x"]].length;
  });
  sharedWeak=Object.values(weakCounts).filter(v=>v>=3).length;
  return Math.max(30, Math.min(100, Math.round(70 + resistCount - sharedWeak*15)));
}
function roleBalanceScore(){
  if(!team.length) return 0;
  const roles=new Set(team.map(p=>p.role));
  return Math.min(100, Math.round((roles.size/5)*100));
}
function speedControlScore(){
  if(!team.length) return 0;
  const fast=team.filter(p=>p.stats.speed>=100).length;
  const mid=team.filter(p=>p.stats.speed>=80 && p.stats.speed<100).length;
  return Math.min(100, Math.round(fast*28 + mid*12));
}
function teamSuggestions(scores, weakCounts, roles){
  const suggestions=[];
  if(scores.type<65) suggestions.push("Add broader move coverage so the team can hit more types effectively.");
  if(scores.defense<70) suggestions.push("Reduce stacked weaknesses or add Pokémon that resist common threats.");
  if(scores.role<70) suggestions.push("Add more role variety, such as a tank, wall, or utility Pokémon.");
  if(scores.speed<65) suggestions.push("Add a faster Pokémon, Choice Scarf user, or priority attacker.");
  Object.entries(weakCounts).filter(([,c])=>c>=3).forEach(([t,c])=>suggestions.push(`${c} team members are weak to ${title(t)}.`));
  if(!roles["Defensive Tank"] && !roles["Wall"]) suggestions.push("Consider adding a defensive backbone.");
  return suggestions.length?suggestions:["Team has a solid basic structure for this demo scoring model."];
}

function addToTeam(){const p=teamReadyPokemon();if(!p)return;if(team.length>=6){alert("Team is full.");return}team.push(p);renderTeam()}
function removeTeam(i){team.splice(i,1);renderTeam()}
function clearTeam(){team=[];renderTeam()}
function saveTeam(){localStorage.setItem("pokeTeam",JSON.stringify(team.map(p=>p.name)));alert("Team saved.")}
async function loadTeam(){let names=JSON.parse(localStorage.getItem("pokeTeam")||"[]");team=[];for(let n of names){try{team.push(await fetchPokemon(n))}catch(e){}}renderTeam()}
function renderTeam(){
  id("teamCount").textContent=`${team.length} / 6`;
  id("teamSlots").innerHTML=team.map((p,i)=>{
    const ev=p.evIvNature;
    const evSpread=ev?`EVs: ${ev.evs.hp} HP / ${ev.evs.attack} Atk / ${ev.evs.defense} Def / ${ev.evs.specialAttack} SpA / ${ev.evs.specialDefense} SpD / ${ev.evs.speed} Spe`:"";
    const finalSpeed=ev?.finalStats?.speed?`Final Speed: ${ev.finalStats.speed}`:"";
    return `<div class="team-slot">
      <img src="${p.artwork}">
      <h3>${p.displayName}</h3>
      <div>${p.types.map(badge).join("")}</div>
      <p>${p.role}</p>
      <small><strong>Ability:</strong> ${title(p.customAbility||p.abilities[0]?.name||"Unknown")}</small>
      <small><strong>Item:</strong> ${p.heldItem||"None"}</small>
      <small><strong>Nature:</strong> ${ev?.nature||"Not set"}</small>
      <small>${evSpread}</small>
      <small>${finalSpeed}</small>
      <button class="remove-btn" onclick="removeTeam(${i})">Remove</button>
    </div>`;
  }).join("")||"<p class='muted'>No Pokémon on the team yet.</p>";
  renderTeamAnalysis();
  renderBattleTeams();
}
function renderTeamAnalysis(){
  if(!team.length){
    id("teamScore").textContent="—";
    id("teamSummary").innerHTML="<p class='muted'>Add Pokémon to score the team.</p>";
    id("teamWeaknesses").innerHTML="";
    id("teamStats").innerHTML="";
    id("teamRoles").innerHTML="";
    return;
  }

  let weak={}, roles={}, speed=0, bst=0;
  team.forEach(p=>{
    let m=matchup(p.types);
    [...m["4x"],...m["2x"]].forEach(t=>weak[t]=(weak[t]||0)+1);
    roles[p.role]=(roles[p.role]||0)+1;
    speed+=(p.evIvNature?.finalStats?.speed||p.stats.speed);
    bst+=Object.values(p.stats).reduce((a,b)=>a+b,0);
  });

  const scores={
    type:offensiveCoverageScore(),
    defense:defensiveCoverageScore(),
    role:roleBalanceScore(),
    speed:speedControlScore()
  };
  const finalScore=Math.round((scores.type*.25)+(scores.defense*.35)+(scores.role*.2)+(scores.speed*.2));

  id("teamScore").textContent=finalScore+"/100";
  id("teamSummary").innerHTML=`
    <div class="analysis-metric"><strong>Type Coverage</strong><div class="metric-score">${scores.type}/100</div></div>
    <div class="analysis-metric"><strong>Defensive Coverage</strong><div class="metric-score">${scores.defense}/100</div></div>
    <div class="analysis-metric"><strong>Role Balance</strong><div class="metric-score">${scores.role}/100</div></div>
    <div class="analysis-metric"><strong>Speed Control</strong><div class="metric-score">${scores.speed}/100</div></div>
  `;

  id("teamWeaknesses").innerHTML=Object.entries(weak)
    .sort((a,b)=>b[1]-a[1])
    .map(([t,c])=>`<div class="matchup-box">${badge(t)}<p>${c} member(s) weak</p></div>`)
    .join("")||"<p class='muted'>No major shared weaknesses.</p>";

  id("teamStats").innerHTML=`
    <div class="mini-card"><strong>Average Speed</strong><p>${Math.round(speed/team.length)}</p></div>
    <div class="mini-card"><strong>Average BST / Custom Total</strong><p>${Math.round(bst/team.length)}</p></div>
    <div class="mini-card"><strong>Fast Pokémon</strong><p>${team.filter(p=>(p.evIvNature?.finalStats?.speed||p.stats.speed)>=100).length}</p></div>
  `;

  const suggestions=teamSuggestions(scores, weak, roles);
  id("teamRoles").innerHTML=Object.entries(roles).map(([r,c])=>`<div class="mini-card"><strong>${r}</strong><p>${c} Pokémon</p></div>`).join("")+
    `<div class="mini-card suggestion-list"><strong>Suggestions</strong>${suggestions.map(s=>`<p>• ${s}</p>`).join("")}</div>`;
}
function exportCSV(){id("exportOutput").value=["Name,Types,Role,Ability,Held Item"].concat(team.map(p=>`${p.displayName},"${p.types.join("/")}",${p.role},${p.customAbility||p.abilities[0]?.name||""},${p.heldItem||""}`)).join("\n")}
function exportJSON(){id("exportOutput").value=JSON.stringify(team.map(p=>({name:p.displayName,types:p.types,role:p.role,ability:p.customAbility||p.abilities[0]?.name, item:p.heldItem})),null,2)}
function exportShowdown(){id("exportOutput").value=team.map(p=>`${p.displayName} @ ${p.heldItem||itemOf(p)}\nAbility: ${p.customAbility||p.abilities[0]?.name||"Unknown"}\n${recommendedMoves(p).map(m=>"- "+m).join("\n")}`).join("\n\n")}
async function suggest(){let q=id("pokemonSearch").value;if(q.length<2){id("suggestions").classList.add("hidden");return}let r=await fetch(`${API_BASE}/pokemon?limit=1300`),d=await r.json();let s=d.results.filter(x=>x.name.includes(norm(q))).slice(0,6);id("suggestions").innerHTML=s.map(x=>`<div class="suggestion" onclick="pick('${x.name}')">${title(x.name)} <small>${x.name}</small></div>`).join("");id("suggestions").classList.toggle("hidden",!s.length)}
function pick(n){id("pokemonSearch").value=n;id("suggestions").classList.add("hidden");runSearch(n)}

const NATURES={
  Hardy:["",""],Lonely:["attack","defense"],Brave:["attack","speed"],Adamant:["attack","specialAttack"],Naughty:["attack","specialDefense"],
  Bold:["defense","attack"],Docile:["",""],Relaxed:["defense","speed"],Impish:["defense","specialAttack"],Lax:["defense","specialDefense"],
  Timid:["speed","attack"],Hasty:["speed","defense"],Serious:["",""],Jolly:["speed","specialAttack"],Naive:["speed","specialDefense"],
  Modest:["specialAttack","attack"],Mild:["specialAttack","defense"],Quiet:["specialAttack","speed"],Bashful:["",""],Rash:["specialAttack","specialDefense"],
  Calm:["specialDefense","attack"],Gentle:["specialDefense","defense"],Sassy:["specialDefense","speed"],Careful:["specialDefense","specialAttack"],Quirky:["",""]
};
function setupNatureOptions(){
  const sel=id("natureSelect");
  if(!sel) return;
  if(!sel.innerHTML.trim()) sel.innerHTML=Object.keys(NATURES).map(n=>`<option value="${n}">${n}</option>`).join("");
  if(currentPokemon) sel.value=suggestNatureFor(currentPokemon);
}
function suggestNatureFor(p){
  if(!p) return "Serious";
  const r=roleOf(p);
  if(r==="Physical Sweeper") return p.stats.speed>=100?"Jolly":"Adamant";
  if(r==="Special Sweeper") return p.stats.speed>=100?"Timid":"Modest";
  if(r==="Mixed Attacker") return "Naive";
  if(r==="Defensive Tank" || r==="Wall") return p.stats.defense>=p.stats.specialDefense?"Bold":"Calm";
  if(r==="Fast Utility") return "Timid";
  return "Serious";
}
function getNum(field, fallback=0){
  const el=id(field);
  if(!el) return fallback;
  const v=parseInt(el.value,10);
  return Number.isNaN(v)?fallback:v;
}
function natureMod(stat){
  const sel=id("natureSelect");
  if(!sel) return 1;
  const [up,down]=NATURES[sel.value]||["",""];
  if(stat===up) return 1.1;
  if(stat===down) return .9;
  return 1;
}
function calcHP(base,iv,ev,level){
  return Math.floor(((2*base+iv+Math.floor(ev/4))*level)/100)+level+10;
}
function calcOther(base,iv,ev,level,stat){
  return Math.floor((Math.floor(((2*base+iv+Math.floor(ev/4))*level)/100)+5)*natureMod(stat));
}
function collectEvIvNature(){
  return {
    level:getNum("calcLevel",50),
    nature:id("natureSelect")?.value||"Serious",
    evs:{
      hp:getNum("evHP"),attack:getNum("evAttack"),defense:getNum("evDefense"),
      specialAttack:getNum("evSpA"),specialDefense:getNum("evSpD"),speed:getNum("evSpeed")
    },
    ivs:{
      hp:getNum("ivHP",31),attack:getNum("ivAttack",31),defense:getNum("ivDefense",31),
      specialAttack:getNum("ivSpA",31),specialDefense:getNum("ivSpD",31),speed:getNum("ivSpeed",31)
    }
  };
}
function calculateFinalStats(){
  if(!currentPokemon || !id("finalStatsPanel")) return null;
  const data=collectEvIvNature();
  const level=Math.max(1,Math.min(100,data.level));
  const evs=data.evs, ivs=data.ivs;
  const totalEV=Object.values(evs).reduce((a,b)=>a+b,0);
  const warn=id("evWarning");
  if(warn){
    warn.classList.toggle("hidden", totalEV<=510);
    warn.textContent=totalEV>510?`EV total is ${totalEV}/510. Reduce EVs to 510 or less.`:"";
  }
  const b=currentPokemon.stats;
  const finalStats={
    hp:calcHP(b.hp,ivs.hp,evs.hp,level),
    attack:calcOther(b.attack,ivs.attack,evs.attack,level,"attack"),
    defense:calcOther(b.defense,ivs.defense,evs.defense,level,"defense"),
    specialAttack:calcOther(b.specialAttack,ivs.specialAttack,evs.specialAttack,level,"specialAttack"),
    specialDefense:calcOther(b.specialDefense,ivs.specialDefense,evs.specialDefense,level,"specialDefense"),
    speed:calcOther(b.speed,ivs.speed,evs.speed,level,"speed")
  };
  const labels=[["HP","hp"],["Attack","attack"],["Defense","defense"],["Sp. Attack","specialAttack"],["Sp. Defense","specialDefense"],["Speed","speed"]];
  id("finalStatsPanel").innerHTML=
    `<div class="final-stat-card"><strong>EV Total</strong><span class="${totalEV<=510?'ev-total-good':'ev-total-bad'}">${totalEV}/510</span></div>`+
    labels.map(([label,key])=>`<div class="final-stat-card"><strong>${label}</strong><span>${finalStats[key]}</span></div>`).join("");
  return {finalStats,totalEV,...data};
}
function renderEvIvBuilder(p=currentPokemon){
  if(!p || !id("finalStatsPanel")) return;
  setupNatureOptions();
  calculateFinalStats();
}
function resetEvIvBuilder(){
  ["evHP","evAttack","evDefense","evSpA","evSpD","evSpeed"].forEach(x=>{if(id(x))id(x).value=0});
  if(id("calcLevel")) id("calcLevel").value=50;
  if(id("natureSelect") && currentPokemon) id("natureSelect").value=suggestNatureFor(currentPokemon);
  calculateFinalStats();
}


let currentDefender=null;

function populateDamageMoves(){
  const sel=id("damageMoveSelect");
  if(!sel || !currentPokemon) return;
  const moves=(currentPokemon.moves||[]).filter(m=>m.power).sort((a,b)=>(b.power||0)-(a.power||0)).slice(0,60);
  sel.innerHTML=moves.map(m=>`<option value="${m.name}">${title(m.name)} (${title(m.type)}, ${m.power || "—"} BP)</option>`).join("");
}

async function loadDamageDefender(){
  const name=id("defenderSearch")?.value || "";
  if(!name.trim()){
    alert("Enter a defender Pokémon.");
    return;
  }
  try{
    currentDefender=await fetchPokemon(name);
    id("defenderPanel").innerHTML=`
      <strong>${currentDefender.displayName}</strong>
      <div>${currentDefender.types.map(badge).join("")}</div>
      <p>HP: ${currentDefender.stats.hp} · Def: ${currentDefender.stats.defense} · SpD: ${currentDefender.stats.specialDefense}</p>
    `;
  }catch(e){
    id("defenderPanel").innerHTML="<span class='bad'>Could not load defender.</span>";
  }
}

function selectedDamageMove(){
  const name=id("damageMoveSelect")?.value;
  return (currentPokemon?.moves||[]).find(m=>m.name===name);
}

function typeEffectiveness(moveType, defenderTypes){
  return defenderTypes.reduce((mult,type)=>mult*((CHART[moveType]&&CHART[moveType][type]!==undefined)?CHART[moveType][type]:1),1);
}

function calculateSimplifiedDamage(){
  if(!currentPokemon || !currentDefender){
    id("damageResult").innerHTML="Load an attacker and defender first.";
    return;
  }
  const move=selectedDamageMove();
  if(!move || !move.power){
    id("damageResult").innerHTML="Choose a damaging move.";
    return;
  }

  const attackerBuild=calculateFinalStats?.() || null;
  const level=getNum("calcLevel",50);
  const defenderLevel=Math.max(1,Math.min(100,getNum("defenderLevel",50)));
  const attackStat=move.category==="physical"
    ? (attackerBuild?.finalStats?.attack || currentPokemon.stats.attack)
    : (attackerBuild?.finalStats?.specialAttack || currentPokemon.stats.specialAttack);
  const defenseStat=move.category==="physical"
    ? estimateDefenderStat(currentDefender.stats.defense, defenderLevel)
    : estimateDefenderStat(currentDefender.stats.specialDefense, defenderLevel);

  let modifier=1;
  const stab=currentPokemon.types.includes(move.type)?1.5:1;
  const effectiveness=typeEffectiveness(move.type,currentDefender.types);
  modifier*=stab*effectiveness;

  const weather=id("weatherSelect")?.value || "";
  if(weather==="sun" && move.type==="fire") modifier*=1.5;
  if(weather==="sun" && move.type==="water") modifier*=0.5;
  if(weather==="rain" && move.type==="water") modifier*=1.5;
  if(weather==="rain" && move.type==="fire") modifier*=0.5;

  const screen=id("screenSelect")?.value || "";
  if(screen==="reflect" && move.category==="physical") modifier*=0.5;
  if(screen==="light-screen" && move.category==="special") modifier*=0.5;

  if(id("critSelect")?.value==="crit") modifier*=1.5;

  const baseDamage=((((2*level/5+2)*move.power*attackStat/defenseStat)/50)+2)*modifier;
  const minDamage=Math.floor(baseDamage*0.85);
  const maxDamage=Math.floor(baseDamage);
  const defenderHP=estimateDefenderHP(currentDefender.stats.hp, defenderLevel);
  const minPct=Math.round((minDamage/defenderHP)*100);
  const maxPct=Math.round((maxDamage/defenderHP)*100);

  let note="Neutral hit.";
  if(effectiveness===0) note="No effect.";
  else if(effectiveness>=4) note="Extremely effective: 4× weakness.";
  else if(effectiveness>1) note="Super effective.";
  else if(effectiveness<1) note="Not very effective.";

  const koText=maxPct>=100 ? "Possible OHKO" : minPct>=50 ? "Likely 2HKO" : maxPct>=50 ? "Possible 2HKO" : "Likely 3HKO or more";

  id("damageResult").innerHTML=`
    <div class="damage-big">${minPct}% - ${maxPct}%</div>
    <p class="damage-line"><strong>${currentPokemon.displayName}</strong> using <strong>${title(move.name)}</strong> vs <strong>${currentDefender.displayName}</strong></p>
    <p class="damage-line">Estimated damage: ${minDamage} - ${maxDamage} HP out of ${defenderHP} HP</p>
    <p class="damage-line">STAB: ${stab>1?"Yes":"No"} · Type multiplier: ${effectiveness}×</p>
    <p class="damage-line">${note}</p>
    <p class="damage-line"><strong>${koText}</strong></p>
  `;
}

function estimateDefenderHP(base,level){
  return Math.floor(((2*base+31+Math.floor(0/4))*level)/100)+level+10;
}
function estimateDefenderStat(base,level){
  return Math.floor(((2*base+31+Math.floor(0/4))*level)/100)+5;
}


let opponentTeam=[];

function renderBattleTeams(){
  const your=id("battleYourTeam");
  const opp=id("opponentTeamSlots");
  if(your){
    your.innerHTML=team.length?team.map(p=>battleCard(p)).join(""):"Add Pokémon to your team first.";
  }
  if(opp){
    opp.innerHTML=opponentTeam.length?opponentTeam.map((p,i)=>battleCard(p,`<button class="remove-btn" onclick="removeOpponent(${i})">Remove</button>`)).join(""):"No opponent Pokémon added yet.";
  }
}


async function suggestOpponent(){
  const input=id("opponentInput");
  const box=id("opponentSuggestions");
  if(!input || !box) return;
  const q=input.value;
  if(q.length<2){
    box.classList.add("hidden");
    return;
  }
  const r=await fetch(`${API_BASE}/pokemon?limit=1300`);
  const d=await r.json();
  const s=d.results.filter(x=>x.name.includes(norm(q))).slice(0,6);
  box.innerHTML=s.map(x=>`<div class="suggestion" onclick="pickOpponent('${x.name}')">${title(x.name)} <small>${x.name}</small></div>`).join("");
  box.classList.toggle("hidden",!s.length);
}
function pickOpponent(n){
  id("opponentInput").value=n;
  id("opponentSuggestions").classList.add("hidden");
}

function battleCard(p,extra=""){
  return `<div class="battle-team-card">
    <div class="battle-team-head">
      <img src="${p.artwork}">
      <div>
        <strong>${p.displayName}</strong>
        <div>${p.types.map(badge).join("")}</div>
        <small>${p.role || roleOf(p)} · Speed ${p.evIvNature?.finalStats?.speed || p.stats.speed}</small>
      </div>
    </div>
    ${extra}
  </div>`;
}

async function addOpponent(){
  const input=id("opponentInput");
  const name=input?.value || "";
  if(!name.trim()){
    alert("Enter an opponent Pokémon.");
    return;
  }
  if(opponentTeam.length>=6){
    alert("Opponent team is full.");
    return;
  }
  try{
    const p=await fetchPokemon(name);
    opponentTeam.push(p);
    input.value="";
    renderBattleTeams();
  }catch(e){
    alert("Could not load opponent Pokémon.");
  }
}

function removeOpponent(i){
  opponentTeam.splice(i,1);
  renderBattleTeams();
}

function clearOpponentTeam(){
  opponentTeam=[];
  renderBattleTeams();
}

function battleTypeScore(attacker, defender){
  let best=1;
  (attacker.moves||[]).filter(m=>m.power).slice(0,40).forEach(m=>{
    const eff=typeEffectiveness(m.type,defender.types);
    if(eff>best) best=eff;
  });
  return best;
}

function defensiveThreatScore(opponent){
  let score=0;
  team.forEach(ally=>{
    const m=matchup(ally.types);
    opponent.types.forEach(t=>{
      if(m["4x"].includes(t)) score+=3;
      else if(m["2x"].includes(t)) score+=2;
      else if(m["0.5x"].includes(t) || m["0.25x"].includes(t) || m["0x"].includes(t)) score-=1;
    });
  });
  return score;
}

function analyzeBattle(){
  renderBattleTeams();
  const out=id("battlePlanResult");
  if(!team.length || !opponentTeam.length){
    out.innerHTML="Add at least one Pokémon to your team and one opponent Pokémon.";
    return;
  }

  const opponentThreats=opponentTeam.map(o=>{
    const speed=o.stats.speed;
    const fasterThan=team.filter(p=>(p.evIvNature?.finalStats?.speed || p.stats.speed) < speed).length;
    const defensiveScore=defensiveThreatScore(o);
    const coverageAgainstUs=team.reduce((sum,p)=>sum+battleTypeScore(o,p),0);
    const total=Math.round(defensiveScore + coverageAgainstUs + fasterThan);
    return {pokemon:o,total,fasterThan,coverageAgainstUs,defensiveScore};
  }).sort((a,b)=>b.total-a.total);

  const leadCandidates=team.map(p=>{
    const speed=p.evIvNature?.finalStats?.speed || p.stats.speed;
    const hits=opponentTeam.reduce((sum,o)=>sum+battleTypeScore(p,o),0);
    const weakToOpp=opponentTeam.reduce((sum,o)=>{
      const m=matchup(p.types);
      return sum+o.types.reduce((s,t)=>s+(m["4x"].includes(t)?2:m["2x"].includes(t)?1:0),0);
    },0);
    return {pokemon:p,score:Math.round(speed/20 + hits*4 - weakToOpp*2)};
  }).sort((a,b)=>b.score-a.score).slice(0,3);

  const speedIssues=opponentTeam.filter(o=>{
    const oppSpeed=o.stats.speed;
    return !team.some(p=>(p.evIvNature?.finalStats?.speed || p.stats.speed) >= oppSpeed);
  });

  const matchupNotes=[];
  opponentThreats.slice(0,3).forEach(t=>{
    const label=t.total>=18?"High":t.total>=11?"Medium":"Low";
    matchupNotes.push(`<p><span class="${label==="High"?"threat-high":label==="Medium"?"threat-medium":"threat-low"}">${label} Threat:</span> ${t.pokemon.displayName}</p>`);
  });
  if(speedIssues.length){
    matchupNotes.push(`<p class="bad">Speed issue: Your team may be slower than ${speedIssues.map(x=>x.displayName).join(", ")}.</p>`);
  }else{
    matchupNotes.push(`<p class="good">Speed control looks acceptable against this opponent team.</p>`);
  }

  out.innerHTML=`
    <h3>Top Opponent Threats</h3>
    ${opponentThreats.slice(0,6).map(t=>`<div class="mini-card"><strong>${t.pokemon.displayName}</strong><p>Threat Score: ${t.total}</p><div>${t.pokemon.types.map(badge).join("")}</div></div>`).join("")}

    <h3>Recommended Leads</h3>
    ${leadCandidates.map(l=>`<div class="mini-card"><strong>${l.pokemon.displayName}</strong><p>Lead Score: ${l.score}</p><div>${l.pokemon.types.map(badge).join("")}</div></div>`).join("")}

    <h3>Battle Notes</h3>
    ${matchupNotes.join("")}

    <h3>Win Condition Ideas</h3>
    <p>Look for setup or pressure from your strongest offensive role Pokémon: ${team.filter(p=>["Physical Sweeper","Special Sweeper","Mixed Attacker"].includes(p.role)).map(p=>p.displayName).join(", ") || "No clear sweeper identified"}.</p>
  `;
}


function analyzeTeamCores(){
  const out=id("teamCoreResult");
  if(!out) return;
  if(!team.length){
    out.innerHTML="Add Pokémon to your team first.";
    return;
  }
  const allTypes=new Set(team.flatMap(p=>p.types));
  const names=team.map(p=>p.displayName);
  const cores=[];
  if(allTypes.has("fire") && allTypes.has("water") && allTypes.has("grass")) cores.push("Fire / Water / Grass Core");
  if(allTypes.has("dragon") && allTypes.has("fairy") && allTypes.has("steel")) cores.push("Dragon / Fairy / Steel Core");
  if(allTypes.has("ground") && allTypes.has("flying")) cores.push("Ground / Flying Immunity Core");
  if(allTypes.has("dark") && allTypes.has("ghost")) cores.push("Dark / Ghost Pressure Core");

  const suggestions=[];
  if(!(allTypes.has("fire") && allTypes.has("water") && allTypes.has("grass"))) suggestions.push("Consider building toward a Fire / Water / Grass defensive core.");
  if(!(allTypes.has("dragon") && allTypes.has("fairy") && allTypes.has("steel"))) suggestions.push("Consider a Dragon / Fairy / Steel core for balanced resistances.");
  if(!team.some(p=>(p.evIvNature?.finalStats?.speed||p.stats.speed)>=100)) suggestions.push("Add a faster Pokémon or speed-control option.");
  if(!team.some(p=>["Defensive Tank","Wall","Bulky Support"].includes(p.role))) suggestions.push("Add a defensive backbone such as a tank, wall, or bulky support Pokémon.");

  out.innerHTML=`
    <h3>Detected Cores</h3>
    ${cores.length?cores.map(c=>`<span class="core-badge">${c}</span>`).join(""):"<p class='muted'>No major classic core detected yet.</p>"}
    <h3>Team Members</h3>
    <p>${names.join(", ")}</p>
    <h3>Suggestions</h3>
    ${suggestions.length?suggestions.map(s=>`<p>• ${s}</p>`).join(""):"<p class='good'>Team has solid basic core structure.</p>"}
  `;
}

document.addEventListener("DOMContentLoaded",()=>{id("searchButton").onclick=()=>runSearch(id("pokemonSearch").value);id("pokemonSearch").onkeydown=e=>{if(e.key==="Enter")runSearch(id("pokemonSearch").value)};id("pokemonSearch").oninput=suggest;id("addTeamBtn").onclick=addToTeam;id("clearTeamBtn").onclick=clearTeam;id("saveTeamBtn").onclick=saveTeam;id("loadTeamBtn").onclick=loadTeam;id("csvBtn").onclick=exportCSV;id("jsonBtn").onclick=exportJSON;id("showdownBtn").onclick=exportShowdown;if(id("resetCustomBtn"))id("resetCustomBtn").onclick=resetCustomInputs;id("moveSearch").oninput=applyMoveFilters;id("typeFilter").onchange=applyMoveFilters;id("categoryFilter").onchange=applyMoveFilters;id("shinyToggle").onchange=()=>{id("shinyStatus").textContent=id("shinyToggle").checked?"ON":"OFF";if(currentPokemon)id("officialArtwork").src=id("shinyToggle").checked&&currentPokemon.shiny?currentPokemon.shiny:currentPokemon.artwork};id("themeToggle").onclick=()=>{document.body.classList.toggle("light");id("themeToggle").textContent=document.body.classList.contains("light")?"🌙 Dark":"☀️ Light"};
["calcLevel","natureSelect","evHP","evAttack","evDefense","evSpA","evSpD","evSpeed"].forEach(x=>{if(id(x)){id(x).oninput=calculateFinalStats;id(x).onchange=calculateFinalStats;}});
if(id("resetEvIvBtn"))id("resetEvIvBtn").onclick=resetEvIvBuilder;
if(id("loadDefenderBtn"))id("loadDefenderBtn").onclick=loadDamageDefender;if(id("calculateDamageBtn"))id("calculateDamageBtn").onclick=calculateSimplifiedDamage;if(id("addOpponentBtn"))id("addOpponentBtn").onclick=addOpponent;if(id("clearOpponentBtn"))id("clearOpponentBtn").onclick=clearOpponentTeam;if(id("analyzeBattleBtn"))id("analyzeBattleBtn").onclick=analyzeBattle;if(id("opponentInput"))id("opponentInput").oninput=suggestOpponent;if(id("analyzeCoreBtn"))id("analyzeCoreBtn").onclick=analyzeTeamCores;runSearch("charizard");renderBattleTeams();renderTeam()});