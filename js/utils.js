function normalizePokemonName(input){
  if(!input) return "";
  let value = input.trim().toLowerCase();
  const aliases = {
    "mr mime":"mr-mime","mrmime":"mr-mime","mime jr":"mime-jr","mimejr":"mime-jr",
    "farfetchd":"farfetchd","farfetch'd":"farfetchd","sirfetchd":"sirfetchd","sirfetch'd":"sirfetchd",
    "type null":"type-null","type:null":"type-null","ho oh":"ho-oh","hooh":"ho-oh",
    "porygon z":"porygon-z","porygonz":"porygon-z","nidoran f":"nidoran-f","nidoran female":"nidoran-f",
    "nidoran♀":"nidoran-f","nidoran m":"nidoran-m","nidoran male":"nidoran-m","nidoran♂":"nidoran-m",
    "iron valiant":"iron-valiant","great tusk":"great-tusk"
  };
  if(aliases[value]) return aliases[value];
  return value.replace(/\./g,"").replace(/'/g,"").replace(/\s+/g,"-");
}
function titleCase(text){return String(text||"").replace(/-/g," ").split(" ").map(w=>w?w[0].toUpperCase()+w.slice(1):"").join(" ")}
function formatDex(id){return "#" + String(id).padStart(4,"0")}
function meters(v){return (v/10).toFixed(1)+" m"}
function kilograms(v){return (v/10).toFixed(1)+" kg"}
function cleanFlavorText(t){return String(t||"").replace(/\n|\f/g," ")}
