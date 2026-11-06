/* Country selection is local. No geolocation, tracking, remote catalog or automatic calls. */
(() => {
'use strict';
const catalog = window.ANCHOR_HELP_RESOURCES;
const select = document.getElementById('help-country');
if (!catalog || !select || !Array.isArray(catalog.countries) || !Array.isArray(catalog.resources)) return;
const storageKey = 'anchor-help-country';
const copy = {
 en:{choose:'Choose a country…',other:'Other country / not listed',select:'Select a country to see its emergency numbers and support options.',talk:'Talk to someone',ongoing:'Ongoing support',talkDescription:'Counselling and finding care. These links do not promise an immediate response.',ongoingDescription:'Peer support, groups and community services.',emergency:'Emergency assistance',ambulance:'Ambulance',open:'Open',website:'Open provider website',details:'Hours, access and costs',language:'Linked page language',serviceLanguage:'Spoken languages',hours:'Availability',eligibility:'Who can use it',cost:'Costs',verified:'Details reviewed',source:'Official source',empty:'No resources are listed in this category for this country yet. Ask a local doctor or health service about support.',category:'Choose a category',languageNames:{en:'English',de:'German',fr:'French',it:'Italian'}},
 de:{choose:'Land auswählen…',other:'Anderes Land / nicht aufgeführt',select:'Wählen Sie ein Land, um dessen Notrufnummern und Hilfsangebote zu sehen.',talk:'Mit jemandem sprechen',ongoing:'Weitere Unterstützung',talkDescription:'Beratung und Versorgung finden. Diese Links versprechen keine sofortige Antwort.',ongoingDescription:'Selbsthilfe, Gruppen und gemeindenahe Angebote.',emergency:'Notfallhilfe',ambulance:'Rettungsdienst',open:'Öffnen',website:'Website des Anbieters öffnen',details:'Zeiten, Zugang und Kosten',language:'Sprache der verlinkten Seite',serviceLanguage:'Gesprächssprachen',hours:'Verfügbarkeit',eligibility:'Für wen',cost:'Kosten',verified:'Angaben geprüft',source:'Offizielle Quelle',empty:'In dieser Kategorie sind für dieses Land noch keine Angebote aufgeführt. Fragen Sie eine lokale Arztpraxis oder einen Gesundheitsdienst nach Unterstützung.',category:'Kategorie auswählen',languageNames:{en:'Englisch',de:'Deutsch',fr:'Französisch',it:'Italienisch'}},
 fr:{choose:'Choisir un pays…',other:'Autre pays / non répertorié',select:'Choisissez un pays pour voir ses numéros d’urgence et ses ressources de soutien.',talk:'Parler à quelqu’un',ongoing:'Soutien dans la durée',talkDescription:'Conseils et accès aux soins. Ces liens ne garantissent pas une réponse immédiate.',ongoingDescription:'Entraide, groupes et services de proximité.',emergency:'Services d’urgence',ambulance:'Ambulance',open:'Ouvrir',website:'Ouvrir le site du prestataire',details:'Horaires, accès et tarifs',language:'Langue de la page liée',serviceLanguage:'Langues parlées',hours:'Disponibilité',eligibility:'Public concerné',cost:'Tarifs',verified:'Informations vérifiées',source:'Source officielle',empty:'Aucune ressource de cette catégorie n’est encore répertoriée pour ce pays. Demandez conseil à un médecin ou à un service de santé local.',category:'Choisir une catégorie',languageNames:{en:'anglais',de:'allemand',fr:'français',it:'italien'}}
};
function valid(code) { return code === 'OTHER' || catalog.countries.some(c => c.code === code); }
let selected = '';
const requested = new URLSearchParams(location.search).get('country');
try { const saved = localStorage.getItem(storageKey); if (valid(saved)) selected=saved; } catch (_) {}
if (valid(requested)) selected=requested;
let category='talk';
function node(tag,text,className) {
 const element=document.createElement(tag);
 if(text !== undefined) element.textContent=text;
 if(className) element.className=className;
 return element;
}
function safeLink(url,text,className) {
 const link=node('a',text,className);
 const parsed=new URL(url);
 if (parsed.protocol !== 'https:') throw new Error('Unsupported provider URL');
 link.href=parsed.href;link.rel='noreferrer';return link;
}
function render() {
 const lang=copy[document.documentElement.lang] ? document.documentElement.lang : 'en';
 const words=copy[lang];
 select.replaceChildren(node('option',words.choose));select.firstChild.value='';
 catalog.countries.forEach(c=>{const option=node('option',c.name[lang]);option.value=c.code;select.appendChild(option)});
 const other=node('option',words.other);other.value='OTHER';select.appendChild(other);select.value=selected;
 document.getElementById('help-controls').hidden=false;
 const fallback=document.getElementById('help-fallback');if(fallback)fallback.hidden=true;
 const country=catalog.countries.find(c=>c.code===selected);
 const emergency=document.getElementById('emergency-actions');emergency.replaceChildren();
 const status=document.getElementById('help-country-status');
 status.textContent=selected==='OTHER'?words.other:words.select;status.hidden=Boolean(country);
 document.getElementById('help-other').hidden=selected!=='OTHER';
 document.getElementById('help-categories').hidden=!country;
 document.getElementById('help-categories').setAttribute('aria-label',words.category);
 document.getElementById('resource-section').hidden=!country;
 document.getElementById('category-talk').setAttribute('aria-pressed',String(category==='talk'));
 document.getElementById('category-ongoing').setAttribute('aria-pressed',String(category==='ongoing'));
 document.getElementById('resource-heading').textContent=words[category];
 document.getElementById('category-description').textContent=words[category+'Description'];
 if(country) country.emergency.forEach(entry=>{
  const group=node('div');
  const link=node('a',undefined,'emergency-action');link.href='tel:'+entry.number;
  link.setAttribute('aria-label',words.open+' '+entry.number+' · '+words[entry.kind]+' · '+country.name[lang]);
  link.appendChild(node('strong',entry.number));link.appendChild(node('span',words[entry.kind]));
  group.appendChild(link);
  const source=node('div',undefined,'help-small');source.appendChild(safeLink(entry.sourceUrl,words.source));group.appendChild(source);emergency.appendChild(group);
 });
 const results=document.getElementById('help-results');results.replaceChildren();
 if(!country) return;
 const entries=catalog.resources.filter(resource=>resource.country===selected && resource.category===category);
 if(!entries.length) results.appendChild(node('p',words.empty));
 entries.forEach(resource=>{
  const card=node('article',undefined,'resource-card');
  card.appendChild(node('h3',resource.name));card.appendChild(node('p',resource.summary[lang]));
  card.appendChild(node('p',resource.coverage[lang],'resource-scope'));
  card.appendChild(node('p',words.language+': '+resource.websiteLanguages.map(code=>words.languageNames[code]||code).join(', '),'help-small'));
  if (Array.isArray(resource.serviceLanguages)) card.appendChild(node('p',words.serviceLanguage+': '+resource.serviceLanguages.map(code=>words.languageNames[code]||code).join(', '),'resource-scope'));
  if (Array.isArray(resource.contactActions)) {
   card.appendChild(node('p',resource.availability[lang],'resource-scope'));
   for (const action of resource.contactActions) {
    if (action.type !== 'phone' || !/^[0-9]+$/.test(action.number)) continue;
    const phone=node('a',words.open+' '+action.displayNumber+' · '+action.label[lang],'resource-phone');
    phone.href='tel:'+action.number;
    phone.setAttribute('aria-label',words.open+' '+action.displayNumber+' · '+resource.name+' · '+action.label[lang]);card.appendChild(phone);
   }
   if (resource.contactNotes) card.appendChild(node('p',resource.contactNotes[lang],'help-small'));
  }
  const details=node('details');details.appendChild(node('summary',words.details));
  for(const [label,key] of [['hours','availability'],['eligibility','eligibility'],['cost','cost']]) {
   const paragraph=node('p');paragraph.appendChild(node('strong',words[label]+': '));paragraph.appendChild(node('span',resource[key][lang]));details.appendChild(paragraph);
  }
  const date=new Intl.DateTimeFormat(lang,{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(resource.lastVerified+'T12:00:00Z'));
  details.appendChild(node('p',words.verified+': '+date));card.appendChild(details);
  const link=safeLink(resource.url,words.website,'resource-link');link.setAttribute('aria-label',words.website+' · '+resource.name);card.appendChild(link);
  results.appendChild(card);
 });
}
select.addEventListener('change',()=>{
 selected=valid(select.value)?select.value:'';
 try { if(selected) localStorage.setItem(storageKey,selected);else localStorage.removeItem(storageKey); }catch(_){}
 try { const url=new URL(location.href);if(selected)url.searchParams.set('country',selected);else url.searchParams.delete('country');history.replaceState(null,'',url.href); }catch(_){}
 render();
});
for(const value of ['talk','ongoing']) document.getElementById('category-'+value).addEventListener('click',()=>{category=value;render()});
document.addEventListener('anchor-language-change',render);
render();
})();
