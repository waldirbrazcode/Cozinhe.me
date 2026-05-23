/* ════════════════════════════════════════
   STATE
════════════════════════════════════════ */
let state = {
  xp: 340, streak: 5, level: 3, recipes: [], inventory: [], posts: [],
  missions: [], techniques: [], achievements: [], currentPortions: 1,
  editingRecipeId: null, currentRecipeDetail: null,
  miseCompletedTasks: new Set(), currentMiseIdx: 0,
  wheelSpunToday: false, postStar: 5, activeLang: 'pt',
  voiceRecording: false, recognition: null,
  lastTranscribed: null, lastVoiceRecipe: null,
  invFilter: '',
  activeTimer: null
};

/* ════════════════════════════════════════
   INITIAL DATA
════════════════════════════════════════ */
state.recipes = [];
state.inventory = [];
state.posts = [];

state.missions = [
  {id:1,icon:"🔪",name:"Mestre dos Cortes",desc:"Complete uma receita usando brunoise",xp:80,done:false},
  {id:2,icon:"♻️",name:"Zero Desperdício",desc:"Use ingredientes próximos do vencimento",xp:100,done:false},
  {id:3,icon:"⏱️",name:"Velocidade",desc:"Finalize o mise en place em menos de 20min",xp:60,done:false},
  {id:4,icon:"🧪",name:"Experimentador",desc:"Use uma substituição sugerida pela IA",xp:120,done:false},
];

state.techniques = [
  {name:"Brunoise",icon:"🔪",level:5,maxLevel:10,xp:85,status:"mastered"},
  {name:"Emulsificação",icon:"🌊",level:2,maxLevel:10,xp:20,status:"learning"},
  {name:"Mise en Place",icon:"📋",level:7,maxLevel:10,xp:70,status:"mastered"},
  {name:"Caramelização",icon:"🍬",level:3,maxLevel:10,xp:30,status:"learning"},
  {name:"Sous Vide",icon:"🌡️",level:0,maxLevel:10,xp:0,status:"locked"},
  {name:"Confitar",icon:"🫒",level:0,maxLevel:10,xp:0,status:"locked"},
];

state.achievements = [
  {icon:"🔪",label:"Nível 5 em Cortes",color:"gold",unlocked:true},
  {icon:"🌿",label:"Zero Desperdício",color:"green",unlocked:true},
  {icon:"🍅",label:"Rei dos Molhos",color:"red",unlocked:true},
  {icon:"🔥",label:"Fogo Controlado",color:"red",unlocked:false},
  {icon:"🧁",label:"Confeiteiro",color:"gold",unlocked:false},
  {icon:"🌊",label:"Emulsificador",color:"blue",unlocked:false},
  {icon:"⏱️",label:"Speed Chef",color:"gold",unlocked:true},
  {icon:"👥",label:"Comunidade",color:"green",unlocked:true},
  {icon:"🤖",label:"IA Mestre",color:"blue",unlocked:false},
];

const MISE_DATA = [];

const WHEEL_PRIZES = [
  {label:"1 Mês Premium",color:"#B8860B",icon:"⭐",desc:"1 mês de acesso Premium gratuito!",premium:true},
  {label:"3 Meses",color:"#C97B0A",icon:"🌟",desc:"3 meses de Clube Premium!",premium:true},
  {label:"+100 XP",color:"#3B4A2C",icon:"⚡",desc:"100 XP bônus adicionados!",premium:false},
  {label:"Conquista",color:"#6E8F62",icon:"🏅",desc:"Conquista especial desbloqueada!",premium:false},
  {label:"6 Meses",color:"#8B6914",icon:"👑",desc:"6 meses de Clube Premium!",premium:true},
  {label:"+50 XP",color:"#5C3D1A",icon:"⚡",desc:"50 XP bônus! Continue jogando.",premium:false},
  {label:"Receita VIP",color:"#3A4A2A",icon:"📖",desc:"Receita exclusiva de criador desbloqueada!",premium:false},
  {label:"2 Meses",color:"#A07010",icon:"⭐",desc:"2 meses de Premium gratuito!",premium:true},
];

const LANGS = [
  {code:"pt",label:"🇧🇷 Português"},
  {code:"en",label:"🇺🇸 English"},
  {code:"es",label:"🇪🇸 Español"},
  {code:"fr",label:"🇫🇷 Français"},
  {code:"it",label:"🇮🇹 Italiano"},
  {code:"de",label:"🇩🇪 Deutsch"},
];

const SUBSTITUTIONS = {
  "Manteiga":["Azeite de oliva (mesmo peso)","Margarina vegetal","Óleo de coco"],
  "Ovos":["1 col. sopa de linhaça + 3 col. água (por ovo)","Aquafaba (45ml por ovo)","Banana amassada (½ por ovo)"],
  "Leite":["Leite de amêndoas","Leite de aveia","Leite de coco"],
  "Farinha de trigo":["Farinha de amêndoas","Farinha de arroz","Mix sem glúten"],
  "Creme de leite":["Leite de coco integral","Iogurte grego","Creme de castanha"],
};

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
const PAGE_TITLES = {home:"Início",recipes:"Receitas",inventory:"Inventário",["ai-prep"]:"IA Chef",community:"Comunidade",gamification:"Conquistas",premium:"Premium"};
function goTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelector(`.nav-item[onclick="goTo('${page}')"]`)?.classList.add('active');
  document.getElementById('topbarTitle').textContent = PAGE_TITLES[page]||page;
  renderPage(page);
}

function renderPage(page){
  if(page==='home') renderHome();
  if(page==='recipes') renderRecipes();
  if(page==='inventory') renderInventory();
  if(page==='community') renderCommunity();
  if(page==='gamification') renderGamePage();
  if(page==='ai-prep') initAIPrepPage();
}

/* ════════════════════════════════════════
   HOME
════════════════════════════════════════ */
function renderHome(){
  document.getElementById('heroIngCount').textContent = state.inventory.length+' ingredientes';
  document.getElementById('statStreak').textContent = state.streak;
  document.getElementById('statXP').textContent = state.xp;
  document.getElementById('streakCount').textContent = state.streak;
  document.getElementById('topXP').textContent = state.xp;
  // Quick recipe cards
  const wrap = document.getElementById('homeRecipeList');
  wrap.innerHTML = state.recipes.slice(0,3).map(r=>`
    <div class="card-sm" style="margin-bottom:.7rem;cursor:pointer;display:flex;align-items:center;gap:.9rem" onclick="openRecipeDetail(${r.id})">
      <div style="font-size:2rem;width:44px;text-align:center">${r.emoji}</div>
      <div>
        <div style="font-weight:700;font-size:.88rem">${r.name}</div>
        <div style="display:flex;gap:.4rem;margin-top:.25rem">
          <span class="tag tag-sage" style="font-size:.68rem">⏱ ${r.time}min</span>
          <span class="tag" style="font-size:.68rem">${r.diff}</span>
        </div>
      </div>
    </div>
  `).join('');
  // Community feed preview
  const feed = document.getElementById('homeCommunityFeed');
  feed.innerHTML = state.posts.slice(0,2).map(p=>`
    <div class="card-sm" style="margin-bottom:.7rem">
      <div style="display:flex;gap:.6rem;align-items:center;margin-bottom:.4rem">
        <div style="font-size:1.2rem">${p.avatar}</div>
        <div>
          <div style="font-weight:600;font-size:.82rem">${p.user}</div>
          <div style="font-size:.72rem;color:var(--muted)">${p.recipe}</div>
        </div>
      </div>
      <div style="font-size:.8rem;color:var(--muted);line-height:1.5">${p.text.substring(0,80)}...</div>
    </div>
  `).join('');
}

/* ════════════════════════════════════════
   RECEITAS
════════════════════════════════════════ */
const CATS = ["Todos","Almoço","Jantar","Café da manhã","Lanche","Sobremesa"];
let activeFilter = "Todos", inventoryFilter = false;

function renderRecipes(){
  // Filters
  document.getElementById('recipeFilters').innerHTML = CATS.map(c=>`
    <div class="filter-chip ${activeFilter===c?'active':''}" onclick="setRecipeFilter('${c}')">${c}</div>
  `).join('');
  
  const q = (document.getElementById('recipeSearch')?.value||'').toLowerCase();
  const invNames = inventoryFilter ? state.inventory.map(i=>i.name.toLowerCase()) : [];

  // Otimização: Filtragem em um único passo O(n)
  const list = state.recipes.filter(r => {
    const matchCat = activeFilter === "Todos" || r.cat === activeFilter;
    const matchSearch = !q || r.name.toLowerCase().includes(q);
    let matchInv = true;
    if (inventoryFilter) {
      matchInv = r.ings.some(ing => invNames.some(n => ing.toLowerCase().includes(n)));
    }
    return matchCat && matchSearch && matchInv;
  });

  document.getElementById('recipeGrid').innerHTML = list.map(r=>`
    <div class="recipe-card" onclick="openRecipeDetail(${r.id})">
      <div class="recipe-card-thumb">
        ${r.emoji||'🍽️'}
        ${r.creator?`<div class="creator-badge">👑 ${r.creatorName||'Criador'}</div>`:''}
      </div>
      <div class="recipe-card-body">
        <div class="recipe-card-name">${r.name}</div>
        <div class="recipe-card-meta">
          <span class="tag tag-sage" style="font-size:.68rem">⏱ ${r.time}min</span>
          <span class="tag ${r.diff==='Fácil'?'tag-sage':r.diff==='Médio'?'tag-amber':'tag-rust'}" style="font-size:.68rem">${r.diff}</span>
          <span class="tag" style="font-size:.68rem">${r.cat}</span>
        </div>
        <div style="display:flex;gap:.5rem;margin-top:.6rem">
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openRecipeModal(${r.id})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteRecipe(${r.id})">🗑</button>
        </div>
      </div>
    </div>
  `).join('')||'<p style="color:var(--muted);font-size:.88rem;grid-column:1/-1">Nenhuma receita encontrada.</p>';
}

function setRecipeFilter(cat){ activeFilter=cat; renderRecipes(); }

let recipeTimeout;
function filterRecipes(){ 
  clearTimeout(recipeTimeout);
  recipeTimeout = setTimeout(() => renderRecipes(), 250); 
}
function filterByInventory(){ inventoryFilter=!inventoryFilter; renderRecipes(); }

function openRecipeDetail(id){
  const r = state.recipes.find(x=>x.id===id);
  if(!r) return;
  state.currentRecipeDetail = r;
  state.currentPortions = r.portions||1;
  document.getElementById('recipes-list-view').style.display='none';
  document.getElementById('recipes-detail-view').classList.add('open');
  renderRecipeDetail(r);
}

function closeRecipeDetail(){
  document.getElementById('recipes-list-view').style.display='';
  document.getElementById('recipes-detail-view').classList.remove('open');
}

function renderRecipeDetail(r){
  const p = state.currentPortions;
  const ingRows = r.ings.map(ing=>{
    const parts = ing.split('·');
    const origQty = parts[0]?.trim()||'';
    const name = parts[1]?.trim()||ing;
    const scaledQty = scaleQty(origQty, p);
    const hasSub = Object.keys(SUBSTITUTIONS).some(k=>name.includes(k));
    return `<tr>
      <td>${name}</td>
      <td><span class="ing-amount ${p!==1?'changed':''}" style="${p!==1?'color:var(--amber);font-weight:700':''}">${scaledQty}</span></td>
      <td>${hasSub?`<button class="sub-btn" onclick="openSubModal('${name}')">Substituir</button>`:''}</td>
    </tr>`;
  }).join('');

  const stepsHtml = r.steps.map((s,i)=>{
    const timeMatch = s.match(/\[(\d+)\s*min\]/i);
    const timerHtml = timeMatch?`<span class="step-timer" onclick="startTimer(${timeMatch[1]})">⏱ ${timeMatch[1]}min</span>`:'';
    return `<div class="step-item">
      <div class="step-num">${i+1}</div>
      <div class="step-text">${s.replace(/\[\d+\s*min\]/gi,'')} ${timerHtml}</div>
    </div>`;
  }).join('');

  document.getElementById('recipeDetailContent').innerHTML = `
    <div class="recipe-detail-hero">
      <div class="recipe-detail-emoji">${r.emoji||'🍽️'}</div>
      <div>
        <div class="recipe-detail-title">${r.name}</div>
        ${r.creator?`<div style="color:rgba(255,255,255,.7);font-size:.82rem;margin-bottom:.4rem">👑 Receita de ${r.creatorName} — Complete para ganhar conquista!</div>`:''}
        <div class="recipe-detail-meta">
          <span class="recipe-meta-chip">⏱ ${r.time} min</span>
          <span class="recipe-meta-chip">${r.diff}</span>
          <span class="recipe-meta-chip">${r.cat}</span>
        </div>
      </div>
    </div>
    ${r.diff==='Difícil'||r.diff==='Médio'?`<div style="background:rgba(201,123,10,.08);border:1px solid rgba(201,123,10,.25);border-radius:12px;padding:.9rem 1.1rem;margin-bottom:1rem;font-size:.84rem;color:var(--amber)">⚠️ <strong>Dificuldade ${r.diff}</strong> — ${r.diff==='Difícil'?'Requer técnicas avançadas. Veja os alertas em cada passo.':'Requer atenção especial em alguns passos.'}</div>`:''}
    <div class="grid-2" style="align-items:start">
      <div>
        <div class="section-label">Ingredientes</div>
        <div class="portion-control">
          <span class="portion-label">Porções:</span>
          <button class="portion-btn" onclick="changePortion(-1)">−</button>
          <span class="portion-num" id="portionDisplay">${p}</span>
          <button class="portion-btn" onclick="changePortion(1)">+</button>
        </div>
        <table class="ing-table">
          <thead><tr><th>Ingrediente</th><th>Qtd.</th><th></th></tr></thead>
          <tbody id="ingTableBody">${ingRows}</tbody>
        </table>
      </div>
      <div>
        <div class="section-label">Modo de Preparo</div>
        <div class="steps-list">${stepsHtml}</div>
        ${r.notes?`<div style="margin-top:1rem;background:rgba(110,143,98,.07);border:1px solid rgba(110,143,98,.2);border-radius:10px;padding:.8rem 1rem;font-size:.82rem;color:var(--olive);line-height:1.5">💡 ${r.notes}</div>`:''}
      </div>
    </div>
    <div style="margin-top:1.5rem;display:flex;gap:.8rem;flex-wrap:wrap">
      <button class="btn btn-outline" onclick="openRecipeModal(${r.id})">✏️ Editar</button>
      <button class="btn btn-danger" onclick="deleteRecipe(${r.id});closeRecipeDetail()">🗑 Excluir</button>
      ${r.creator?`<button class="btn" style="background:linear-gradient(135deg,var(--gold),var(--amber))" onclick="completeCreatorRecipe(${r.id})">👑 Completei! Ganhar conquista</button>`:''}
    </div>
  `;
}

function scaleQty(qtyStr, portions){
  const num = parseFloat(qtyStr);
  if(isNaN(num)) return qtyStr||'a gosto';
  const scaled = num*portions;
  const unit = qtyStr.replace(/[\d.]+/,'').trim();
  return (scaled%1===0?scaled:+scaled.toFixed(1))+' '+unit;
}

function changePortion(delta){
  state.currentPortions = Math.max(1, Math.min(12, state.currentPortions+delta));
  document.getElementById('portionDisplay').textContent = state.currentPortions;
  const r = state.currentRecipeDetail;
  const rows = r.ings.map(ing=>{
    const parts = ing.split('·');
    const origQty = parts[0]?.trim()||'';
    const name = parts[1]?.trim()||ing;
    const scaledQty = scaleQty(origQty, state.currentPortions);
    const hasSub = Object.keys(SUBSTITUTIONS).some(k=>name.includes(k));
    return `<tr><td>${name}</td><td><span style="${state.currentPortions!==1?'color:var(--amber);font-weight:700':''}">${scaledQty}</span></td><td>${hasSub?`<button class="sub-btn" onclick="openSubModal('${name}')">Substituir</button>`:''}</td></tr>`;
  }).join('');
  document.getElementById('ingTableBody').innerHTML = rows;
}

function openSubModal(ingName){
  document.getElementById('subIngName').textContent = ingName;
  const key = Object.keys(SUBSTITUTIONS).find(k=>ingName.includes(k));
  const subs = key?SUBSTITUTIONS[key]:["Sem substituições cadastradas para este ingrediente."];
  document.getElementById('subList').innerHTML = subs.map(s=>`
    <div class="card-sm" style="display:flex;align-items:center;gap:.7rem">
      <span style="font-size:1.3rem">✅</span>
      <span style="font-size:.88rem">${s}</span>
    </div>
  `).join('');
  openModal('subModal');
}

function openRecipeModal(id=null){
  state.editingRecipeId = id;
  document.getElementById('recipeModalTitle').textContent = id?'Editar Receita':'Nova Receita';
  document.getElementById('recipeModalSaveBtn').textContent = id?'Salvar Alterações':'Salvar Receita';
  if(id){
    const r = state.recipes.find(x=>x.id===id);
    if(r){
      document.getElementById('rm-name').value = r.name;
      document.getElementById('rm-emoji').value = r.emoji||'';
      document.getElementById('rm-time').value = r.time;
      document.getElementById('rm-diff').value = r.diff;
      document.getElementById('rm-cat').value = r.cat;
      document.getElementById('rm-ings').value = r.ings.join('\n');
      document.getElementById('rm-steps').value = r.steps.join('\n');
      document.getElementById('rm-notes').value = r.notes||'';
    }
  } else {
    ['rm-name','rm-emoji','rm-time','rm-ings','rm-steps','rm-notes'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('rm-diff').value = 'Fácil';
    document.getElementById('rm-cat').value = 'Almoço';
  }
  openModal('recipeModal');
}

function saveRecipe(){
  const name = document.getElementById('rm-name').value.trim();
  if(!name){ showToast('⚠️','Informe o nome da receita'); return; }
  const recipe = {
    id: state.editingRecipeId || Date.now(),
    name, emoji: document.getElementById('rm-emoji').value||'🍽️',
    time: parseInt(document.getElementById('rm-time').value)||30,
    diff: document.getElementById('rm-diff').value,
    cat: document.getElementById('rm-cat').value,
    ings: document.getElementById('rm-ings').value.split('\n').filter(Boolean),
    steps: document.getElementById('rm-steps').value.split('\n').filter(Boolean),
    notes: document.getElementById('rm-notes').value,
    creator: false, creatorName: null, portions:1,
  };
  if(state.editingRecipeId){
    const idx = state.recipes.findIndex(r=>r.id===state.editingRecipeId);
    if(idx>=0) state.recipes[idx] = recipe;
    showToast('✅','Receita atualizada!');
  } else {
    state.recipes.unshift(recipe);
    addXP(50); showToast('🍳',`Receita "${name}" criada! +50 XP`);
  }
  closeModal('recipeModal'); renderRecipes();
  document.getElementById('statRecipes').textContent = state.recipes.length;
}

function deleteRecipe(id){
  if(!confirm('Excluir esta receita?')) return;
  state.recipes = state.recipes.filter(r=>r.id!==id);
  renderRecipes(); showToast('🗑','Receita excluída.');
}

function completeCreatorRecipe(id){
  addXP(150);
  unlockAchievement('🏅','Seguidor de Mestre','gold');
  showToast('👑','+150 XP! Conquista de criador desbloqueada!');
}

/* ════════════════════════════════════════
   INVENTÁRIO
════════════════════════════════════════ */
const TODAY_CACHE = new Date(); // Cache da data para evitar múltiplas instanciações

function renderInventory(){
  const q = (state.invFilter||'').toLowerCase();
  const banner = document.getElementById('expirySoonBanner');
  
  // Otimização de busca e categorização
  const expiring = state.inventory.filter(i=>{
    if(!i.expiry) return false;
    const diff = (new Date(i.expiry) - TODAY_CACHE) / 86400000;
    return diff<=3 && diff>=0;
  });

  if(expiring.length>0){
    banner.style.display='block';
    banner.innerHTML = `<div style="font-weight:600;color:var(--amber);margin-bottom:.4rem">⚠️ ${expiring.length} item(s) vencem em breve:</div>${expiring.map(i=>`<span class="tag tag-amber" style="margin-right:.4rem">${i.emoji} ${i.name} (${i.expiry})</span>`).join('')}<br><button class="btn btn-outline btn-sm" style="margin-top:.6rem" onclick="findRecipesFromInventory()">Usar agora com IA</button>`;
  } else banner.style.display='none';

  let list = state.inventory;
  if(q) list = list.filter(i=>i.name.toLowerCase().includes(q));
  document.getElementById('inventoryGrid').innerHTML = list.map(i=>{
    const expStatus = getExpiryStatus(i.expiry, TODAY_CACHE);
    return `<div class="inv-item">
      <button class="inv-del" onclick="deleteInvItem(${i.id})">✕</button>
      <div class="inv-emoji">${i.emoji||'📦'}</div>
      <div class="inv-name">${i.name}</div>
      <div class="inv-qty">${i.qty}</div>
      ${i.expiry?`<div class="inv-expiry ${expStatus.cls}">${expStatus.label}</div>`:''}
    </div>`;
  }).join('');
  document.getElementById('invCountAI').textContent = state.inventory.length;
}

function getExpiryStatus(expiry, today){
  if(!expiry) return {cls:'',label:''};
  const d = (new Date(expiry)-today)/(1000*60*60*24);
  if(d<0) return {cls:'expiry-bad',label:`Vencido`};
  if(d<=3) return {cls:'expiry-soon',label:`Vence em ${Math.ceil(d)}d`};
  return {cls:'expiry-ok',label:`OK (${expiry})`};
}

let invTimeout;
function filterInventory(){ 
  clearTimeout(invTimeout);
  invTimeout = setTimeout(() => { state.invFilter=document.getElementById('invSearch').value; renderInventory(); }, 250);
}

function openInvModal(){
  ['inv-name','inv-qty','inv-emoji','inv-expiry'].forEach(id=>document.getElementById(id).value='');
  openModal('invModal');
}
async function saveInventoryItem(){
  const name = document.getElementById('inv-name').value.trim();
  const qty = document.getElementById('inv-qty').value || '1 unid';
  const exp = document.getElementById('inv-expiry').value || '';
  const emoji = document.getElementById('inv-emoji').value || '📦';

  if(!name){ showToast('⚠️','Informe o ingrediente'); return; }

  try {
    const response = await fetch('index.php?acao=adicionar_ingrediente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome_ingrediente: name,
        quantidade: qty,
        data_vencimento: exp
      })
    });
    const res = await response.json();

    if (res.sucesso) {
      state.inventory.push({id:Date.now(), name, qty, emoji, expiry: exp});
      closeModal('invModal'); renderInventory();
      document.getElementById('heroIngCount').textContent = state.inventory.length+' ingredientes';
      showToast('🧺', res.mensagem || 'Item adicionado ao inventário!');
    } else {
      showToast("❌", res.mensagem);
    }
  } catch (error) {
    showToast("❌", "Erro ao conectar com o servidor.");
  }
}
function deleteInvItem(id){ state.inventory=state.inventory.filter(i=>i.id!==id); renderInventory(); }

async function findRecipesFromInventory(){
  const names = state.inventory.map(i=>i.name).join(', ');
  showToast('🤖','IA buscando receitas do seu inventário...');
  goTo('ai-prep'); switchAITab('suggest');
  document.getElementById('suggestResult').style.display='none';
  await suggestFromInventory();
}

/* ════════════════════════════════════════
   COMUNIDADE
════════════════════════════════════════ */
function renderCommunity(){
  // Feed
  document.getElementById('communityFeed').innerHTML = state.posts.map(p=>`
    <div class="community-post">
      <div class="post-header">
        <div class="post-avatar">${p.avatar}</div>
        <div>
          <div class="post-user-name">${p.user} ${p.isCreator?'<span class="tag tag-gold" style="font-size:.66rem">👑 Criador</span>':''}</div>
          <div class="post-user-info">${p.recipe} · ${'⭐'.repeat(p.stars)} · ${p.time}</div>
        </div>
      </div>
      <div class="post-image">${p.avatar}</div>
      <div class="post-text">${p.text}</div>
      <div class="post-actions">
        <button class="post-action-btn ${p.liked?'liked':''}" onclick="likePost(${p.id})">❤️ ${p.likes}</button>
        <button class="post-action-btn" onclick="showToast('💬','Comentários em breve!')">💬 Comentar</button>
        <button class="post-action-btn" onclick="showToast('↗️','Link copiado!')">↗️ Compartilhar</button>
      </div>
    </div>
  `).join('');
  // Creators
  document.getElementById('creatorsList').innerHTML = `
    <div class="creator-card" style="margin-bottom:.8rem">
      <div class="creator-crown">👑</div>
      <div>
        <div class="creator-name">Chef Marco</div>
        <div class="creator-desc">Especialista em cucina italiana. Suas receitas desbloqueiam conquistas exclusivas para quem cozinha e recebe bom feedback.</div>
        <div class="creator-achievement">🏅 Conquista: "Discípulo do Marco"</div>
      </div>
    </div>
    <div class="creator-card">
      <div class="creator-crown">🌟</div>
      <div>
        <div class="creator-name">Chef Lívia</div>
        <div class="creator-desc">Especialista em culinária vegana e plant-based. Mais de 50 receitas publicadas.</div>
        <div class="creator-achievement">🌿 Conquista: "Caminho Verde"</div>
      </div>
    </div>
  `;
  // Prefs
  document.getElementById('communityPrefs').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:.5rem">
      ${[['Italiano 🇮🇹','42%'],['Brasileiro 🇧🇷','31%'],['Vegano 🌿','18%'],['Japonês 🇯🇵','9%']].map(([l,p])=>`
        <div style="display:flex;align-items:center;gap:.8rem">
          <span style="font-size:.82rem;min-width:100px">${l}</span>
          <div style="flex:1;height:6px;background:rgba(59,74,44,.1);border-radius:100px;overflow:hidden"><div style="height:100%;width:${p};background:linear-gradient(90deg,var(--sage),var(--amber));border-radius:100px"></div></div>
          <span style="font-size:.76rem;color:var(--muted)">${p}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function likePost(id){
  const p = state.posts.find(x=>x.id===id);
  if(!p) return;
  p.liked=!p.liked; p.likes+=(p.liked?1:-1);
  renderCommunity();
}

function setPostStar(n){ state.postStar=n; showToast('⭐',`${n} estrelas!`); }

function openPostModal(){
  document.getElementById('post-recipe').innerHTML = state.recipes.map(r=>`<option value="${r.id}">${r.name}</option>`).join('');
  document.getElementById('post-text').value = '';
  openModal('postModal');
}

function publishPost(){
  const recipeId = parseInt(document.getElementById('post-recipe').value);
  const r = state.recipes.find(x=>x.id===recipeId);
  const text = document.getElementById('post-text').value.trim();
  if(!text){ showToast('⚠️','Adicione um comentário'); return; }
  state.posts.unshift({id:Date.now(),user:'Lucas',avatar:'👨',recipe:r?.name||'Receita',text,likes:0,liked:false,stars:state.postStar,time:'agora'});
  addXP(30); closeModal('postModal'); renderCommunity();
  showToast('📸','Post publicado! +30 XP');
}

/* ════════════════════════════════════════
   GAMIFICAÇÃO
════════════════════════════════════════ */
function renderGamePage(){
  // Missions
  document.getElementById('weekMissions').innerHTML = state.missions.map(m=>`
    <div style="display:flex;align-items:center;gap:.8rem;padding:.7rem 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="completeMission(${m.id})">
      <div style="font-size:1.4rem">${m.icon}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.85rem ${m.done?';color:var(--muted);text-decoration:line-through':''}">${m.name}</div>
        <div style="font-size:.74rem;color:var(--muted)">${m.desc}</div>
      </div>
      <div style="font-family:'Playfair Display',serif;font-weight:700;font-size:.9rem;color:${m.done?'var(--sage)':'var(--amber)'}">+${m.xp}XP</div>
      <div style="width:20px;height:20px;border-radius:50%;border:2px solid ${m.done?'var(--sage)':'var(--border)'};background:${m.done?'var(--sage)':'transparent'};display:flex;align-items:center;justify-content:center;font-size:.65rem;color:#fff">${m.done?'✓':''}</div>
    </div>
  `).join('');
  // Techniques
  document.getElementById('techniqueGrid').innerHTML = state.techniques.map(t=>`
    <div class="technique-card ${t.status}">
      <div class="technique-icon">${t.icon}</div>
      <div class="technique-name">${t.name}</div>
      <div class="technique-lvl">${t.status==='locked'?'Bloqueado':`Nível ${t.level}/10`}</div>
      <div class="xp-bar"><div class="xp-fill" style="width:${t.status==='locked'?0:t.xp}%"></div></div>
    </div>
  `).join('');
  // Achievements
  document.getElementById('achievementWall').innerHTML = state.achievements.map((a,i)=>`
    <div class="achievement-item" onclick="clickAchievement(${i})">
      <div class="achievement-hex ${a.unlocked?'unlocked':'locked'} ${a.color}">${a.icon}</div>
      <div class="achievement-hex ${a.unlocked?'unlocked':'locked'} ${a.color}">${a.icon}</div>
      <div class="achievement-label ${a.unlocked?'':'locked'}">${a.label}</div>
    </div>
  `).join('');
  updateLevelUI();
}

function completeMission(id){
  const m = state.missions.find(x=>x.id===id);
  if(!m||m.done) return;
  m.done=true; addXP(m.xp);
  showToast('🎯',`+${m.xp} XP — "${m.name}" concluída!`);
  renderGamePage();
  if(Math.random()>.6) unlockAchievement('🏅','Missão Épica','gold');
}

function clickAchievement(i){
  const a = state.achievements[i];
  showToast(a.icon, a.unlocked?`Conquista: "${a.label}"`:'Complete mais missões para desbloquear!');
}

function unlockAchievement(icon, label, color){
  const existing = state.achievements.find(a=>a.label===label);
  if(existing){ if(!existing.unlocked){ existing.unlocked=true; showToast(icon,`Conquista desbloqueada: "${label}"!`); renderGamePage(); } return; }
  const locked = state.achievements.find(a=>!a.unlocked);
  if(locked){ locked.icon=icon; locked.label=label; locked.color=color; locked.unlocked=true; renderGamePage(); }
}

function addXP(amount){
  state.xp+=amount;
  document.getElementById('topXP').textContent=state.xp;
  document.getElementById('statXP').textContent=state.xp;
  document.getElementById('g-xp').textContent=state.xp;
  updateLevelUI();
}

function updateLevelUI(){
  const lvls=[{min:0,name:"Iniciante",next:"150 XP para Cozinheiro Curioso"},{min:150,name:"Cozinheiro Curioso",next:"150 XP para Chef Amador"},{min:300,name:"Chef Amador",next:"200 XP para Sous Chef"},{min:500,name:"Sous Chef",next:"🏆 Topo!"}];
  const lv = [...lvls].reverse().find(l=>state.xp>=l.min)||lvls[0];
  const num = lvls.indexOf(lv)+1;
  state.level = num;
  ['levelCircle'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent=num; });
  const nameEl=document.getElementById('levelNameEl'); if(nameEl) nameEl.textContent=lv.name;
  const nextEl=document.getElementById('levelNextEl'); if(nextEl) nextEl.textContent=lv.next;
  document.getElementById('sideUserLevel').textContent=`Nível ${num} · ${state.xp} XP`;
  const bar=document.getElementById('globalXPBar'); if(bar) bar.style.width=Math.min(state.xp/500*100,100)+'%';
}

/* ════════════════════════════════════════
   RODA DA SORTE
════════════════════════════════════════ */
let wheelAngle = 0, wheelSpinning = false;

function openWheelModal(){
  openModal('wheelModal');
  document.getElementById('wheelStreakDisplay').textContent = state.streak+' dias';
  const chance = Math.min(5+state.streak*6, 80);
  document.getElementById('wheelChance').textContent = chance+'%';
  document.getElementById('wheelResult').classList.remove('show');
  drawWheel();
}

function drawWheel(){
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const cx=150, cy=150, r=145;
  const sliceAngle = (2*Math.PI)/WHEEL_PRIZES.length;
  ctx.clearRect(0,0,300,300);
  WHEEL_PRIZES.forEach((p,i)=>{
    const start = wheelAngle + i*sliceAngle;
    const end = start + sliceAngle;
    // Slice
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,start,end);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.25)';
    ctx.lineWidth=1.5;
    ctx.stroke();
    // Icon + text
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(start+sliceAngle/2);
    ctx.textAlign='right';
    ctx.fillStyle='#fff';
    ctx.font='bold 13px Sora,sans-serif';
    ctx.fillText(p.label, r-10, 5);
    ctx.font='16px serif';
    ctx.fillText(p.icon, r-90, 6);
    ctx.restore();
  });
  // Center circle
  ctx.beginPath();
  ctx.arc(cx,cy,22,0,2*Math.PI);
  ctx.fillStyle='#FAF8F5';
  ctx.fill();
  ctx.strokeStyle='rgba(184,134,11,.4)';
  ctx.lineWidth=2;
  ctx.stroke();
  // Center star
  ctx.font='22px serif';
  ctx.textAlign='center';
  ctx.fillText('⭐',cx,cy+8);
}

function spinWheel(){
  if(wheelSpinning||state.wheelSpunToday) return;
  wheelSpinning=true;
  document.getElementById('wheelSpinBtn').disabled=true;
  document.getElementById('wheelResult').classList.remove('show');
  const extraSpins = 5+Math.random()*5;
  const prize = Math.floor(Math.random()*WHEEL_PRIZES.length);
  const sliceAngle = (2*Math.PI)/WHEEL_PRIZES.length;
  const targetAngle = extraSpins*2*Math.PI + (2*Math.PI - prize*sliceAngle - sliceAngle/2);
  const startAngle = wheelAngle;
  const startTime = performance.now();
  const duration = 4000+Math.random()*1500;

  function animate(now){
    const elapsed = now-startTime;
    const progress = Math.min(elapsed/duration,1);
    const ease = 1-Math.pow(1-progress,4);
    wheelAngle = startAngle + targetAngle*ease;
    drawWheel();
    if(progress<1){ requestAnimationFrame(animate); }
    else{
      wheelSpinning=false;
      state.wheelSpunToday=true;
      showWheelResult(WHEEL_PRIZES[prize]);
    }
  }
  requestAnimationFrame(animate);
}

function showWheelResult(prize){
  document.getElementById('wheelResultIcon').textContent=prize.icon;
  document.getElementById('wheelResultPrize').textContent=prize.label;
  document.getElementById('wheelResultDesc').textContent=prize.desc;
  document.getElementById('wheelResult').classList.add('show');
  if(prize.label.includes('XP')){ const xpMatch=prize.label.match(/\d+/); if(xpMatch) addXP(parseInt(xpMatch[0])); }
  if(prize.premium){ showToast(prize.icon,'🎉 '+prize.desc); }
  else { showToast(prize.icon, prize.desc); }
  if(prize.label==='Conquista') unlockAchievement('🎰','Sortudo!','gold');
}

/* ════════════════════════════════════════
   IA CHEF
════════════════════════════════════════ */
function initAIPrepPage(){
  // Populate recipe selects
  const opts = state.recipes.map(r=>`<option value="${r.id}">${r.name}</option>`).join('');
  document.getElementById('miseRecipeSelect').innerHTML = opts;
  document.getElementById('translateRecipeSelect').innerHTML = '<option value="">-- Selecione --</option>'+opts;
  // Lang selector
  document.getElementById('langSelector').innerHTML = LANGS.map(l=>`
    <div class="lang-chip ${l.code===state.activeLang?'active':''}" onclick="setLang('${l.code}')">${l.label}</div>
  `).join('');
  document.getElementById('invCountAI').textContent = state.inventory.length;
  loadMiseRecipe();
}

function setLang(code){ state.activeLang=code; initAIPrepPage(); }

function switchAITab(tab){
  document.querySelectorAll('.ai-tab').forEach(t=>t.classList.remove('active'));
  ['url','voice','mise','translate','suggest'].forEach(id=>{ const el=document.getElementById('ai-tab-'+id); if(el) el.style.display='none'; });
  document.getElementById('ai-tab-'+tab).style.display='block';
  event?.target?.classList.add('active');
}

async function transcribeVideo(){
  const url = document.getElementById('videoUrl').value.trim();
  if(!url){ showToast('⚠️','Cole uma URL de vídeo'); return; }
  const box = document.getElementById('urlResult');
  const saveBtn = document.getElementById('urlSaveBtn');
  box.style.display='block';
  box.textContent='';
  saveBtn.style.display='none';
  const prompt = `Você é o assistente culinário do cozinhe.me. O usuário colou esta URL de vídeo: ${url}

Como não tenho acesso direto ao vídeo, vou simular a extração da receita. Com base na URL, crie uma receita detalhada e instrutiva no formato:

🍳 NOME DA RECEITA
⏱️ Tempo: X min | 👤 Porções: Y | 📊 Dificuldade: Z

INGREDIENTES:
• Quantidade · Ingrediente

MODO DE PREPARO:
1. Passo detalhado
2. Passo com dica técnica quando necessário

💡 DICA DO CHEF: ...

Escreva em Português do Brasil. Seja detalhado e didático.`;
  await streamAIResponse(prompt, box, ()=>{ saveBtn.style.display='block'; state.lastTranscribed=box.textContent; });
}

async function suggestFromInventory(){
  const invNames = state.inventory.map(i=>i.name).join(', ');
  const pref = document.getElementById('preferenceSelect')?.value||'qualquer';
  const time = document.getElementById('timeSelect')?.value||'30';
  const box = document.getElementById('suggestResult');
  box.style.display='block'; box.textContent='';
  const prompt = `Você é o motor IA do cozinhe.me. Sugira 3 receitas criativas e deliciosas para 1 pessoa usando principalmente estes ingredientes:

Inventário: ${invNames}
Restrição: ${pref}
Tempo máximo: ${time} minutos
Clima: quente (Brasil)

Para cada receita forneça:
🍳 Nome
⏱️ Tempo estimado
📊 Dificuldade
🥘 Ingredientes necessários (destacando os do inventário com ✓)
👨‍🍳 Passos rápidos (3-4 passos)
💡 Por que funciona com esse inventário

Seja criativo, prático e motivador. Português do Brasil.`;
  await streamAIResponse(prompt, box);
}

async function translateRecipe(){
  const id = parseInt(document.getElementById('translateRecipeSelect').value);
  const r = state.recipes.find(x=>x.id===id);
  if(!r){ showToast('⚠️','Selecione uma receita'); return; }
  const langName = LANGS.find(l=>l.code===state.activeLang)?.label||state.activeLang;
  const box = document.getElementById('translateResult');
  box.style.display='block'; box.textContent='';
  const prompt = `Traduza esta receita para ${langName} mantendo o formato original e adaptando medidas e termos culinários para o idioma/cultura de destino:

RECEITA: ${r.name}
INGREDIENTES: ${r.ings.join(', ')}
PASSOS: ${r.steps.join(' | ')}
NOTAS: ${r.notes||''}

Mantenha o estilo didático e adicione dicas culturais relevantes quando aplicável.`;
  await streamAIResponse(prompt, box);
}

async function generateMiseAI(){
  const id = parseInt(document.getElementById('miseRecipeSelect').value);
  const r = state.recipes.find(x=>x.id===id);
  if(!r){ showToast('⚠️','Selecione uma receita'); return; }
  showToast('🤖','IA gerando mise en place...');
  // Use built-in data for now
  loadMiseRecipe();
}

function saveTranscribedRecipe(){
  if(!state.lastTranscribed) return;
  const nameMatch = state.lastTranscribed.match(/🍳\s*([^\n]+)/);
  const name = nameMatch?nameMatch[1].trim():'Receita do Vídeo';
  state.recipes.unshift({id:Date.now(),name,emoji:'📹',time:30,diff:'Médio',cat:'Almoço',ings:['Ver receita transcrita'],steps:[state.lastTranscribed],notes:'Receita transcrita de vídeo pela IA',creator:false,portions:1});
  showToast('💾','Receita salva! +50 XP'); addXP(50);
}

function saveVoiceRecipe(){
  const transcript = document.getElementById('voiceTranscript').textContent;
  if(!transcript||transcript.includes('O que você disser')) return;
  state.recipes.unshift({id:Date.now(),name:'Receita por Voz',emoji:'🎤',time:20,diff:'Fácil',cat:'Almoço',ings:[transcript],steps:['Receita ditada por voz — organize os passos'],notes:'',creator:false,portions:1});
  showToast('💾','Receita de voz salva! +30 XP'); addXP(30);
}

// Voice Recognition
function toggleVoice(){
  if(state.voiceRecording){ stopVoice(); return; }
  startVoice();
}

function startVoice(){
  const SpeechRecognition = window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){ showToast('⚠️','Seu navegador não suporta reconhecimento de voz'); processVoiceText("tomate, frango, alho, arroz e azeite de oliva. Quero fazer um frango refogado simples."); return; }
  state.recognition = new SpeechRecognition();
  state.recognition.lang = 'pt-BR';
  state.recognition.continuous = true;
  state.recognition.interimResults = true;
  state.recognition.onresult = e=>{
    let final='', interim='';
    for(let i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal) final+=e.results[i][0].transcript;
      else interim+=e.results[i][0].transcript;
    }
    document.getElementById('voiceTranscript').textContent = final||interim;
    if(final) processVoiceText(final);
  };
  state.recognition.onerror = ()=>stopVoice();
  state.recognition.start();
  state.voiceRecording=true;
  const btn=document.getElementById('voiceBtn');
  btn.textContent='⏹ Parar Gravação';
  btn.classList.add('recording');
  document.getElementById('voiceStatus').textContent='🔴 Gravando...';
}

function stopVoice(){
  if(state.recognition) state.recognition.stop();
  state.voiceRecording=false;
  const btn=document.getElementById('voiceBtn');
  btn.textContent='🎤 Iniciar Gravação';
  btn.classList.remove('recording');
  document.getElementById('voiceStatus').textContent='Aguardando...';
}

async function processVoiceText(text){
  const box = document.getElementById('voiceResult');
  box.style.display='block'; box.textContent='';
  document.getElementById('voiceSaveBtn').style.display='none';
  const prompt = `O usuário ditou por voz os seguintes ingredientes/receita: "${text}"

Organize isso em uma receita completa e instrutiva para 1 pessoa:

🍳 NOME SUGERIDO
⏱️ Tempo estimado | 📊 Dificuldade

INGREDIENTES:
• Lista organizada

MODO DE PREPARO:
1. Passos claros e didáticos

💡 DICA: ...

Português do Brasil. Seja criativo e prático.`;
  await streamAIResponse(prompt, box, ()=>document.getElementById('voiceSaveBtn').style.display='block');
}

// Streaming AI response
async function streamAIResponse(prompt, box, onDone=null){
  box.textContent='';
  const cursor = document.createElement('span');
  cursor.className='typing-cursor';
  box.appendChild(cursor);
  try{
    const resp = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:prompt}]})
    });
    const data = await resp.json();
    const text = data.content?.find(b=>b.type==='text')?.text||'Não foi possível obter resposta. Tente novamente.';
    cursor.remove();
    // Typewriter effect
    let i=0;
    const interval = setInterval(()=>{
      box.textContent+=text[i]||'';
      i++;
      if(i>=text.length){ clearInterval(interval); if(onDone) onDone(); }
    },8);
  }catch(e){
    cursor.remove();
    box.textContent='Erro ao conectar com a IA. Verifique sua conexão.';
  }
}

/* ════════════════════════════════════════
   MISE EN PLACE
════════════════════════════════════════ */
let miseCompleted = new Set();

function loadMiseRecipe(){
  const id = parseInt(document.getElementById('miseRecipeSelect')?.value);
  const r = state.recipes.find(x=>x.id===id);
  const miseData = MISE_DATA.find(m=>m.name===r?.name)||MISE_DATA[0];
  miseCompleted = new Set();
  renderMiseBoard(miseData);
}

function renderMiseBoard(data){
  if(!data) return;
  document.getElementById('miseTitle').textContent = data.name;
  document.getElementById('miseTimeLabel').textContent = `⏱ ${data.totalMin} min total`;
  const track = document.getElementById('miseTrack');
  track.innerHTML = data.stations.map(st=>`
    <div class="mise-row">
      <div class="mise-station-lbl">${st.label}</div>
      <div class="mise-bar-wrap">
        ${st.tasks.map((t,ti)=>{
          const id=`${st.label}-${ti}`;
          const left=(t.start/data.totalMin*100).toFixed(1);
          const width=(t.dur/data.totalMin*100).toFixed(1);
          const done=miseCompleted.has(id);
          return `<div class="mise-block ${st.color} ${done?'done':''}" style="left:${left}%;width:calc(${width}% - 3px)" onclick="toggleMiseTask('${id}',this,'${data.name}')" title="${t.text}">
            ${done?'✓ ':''}<span style="overflow:hidden;text-overflow:ellipsis">${t.text}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');
  // Ruler
  const marks = Math.ceil(data.totalMin/5)+1;
  track.innerHTML += `<div class="mise-ruler">${Array.from({length:marks},(_,i)=>`<div class="mise-mark">${i*5}m</div>`).join('')}</div>`;
  updateMiseProgress(data);
}

function toggleMiseTask(id, el, recipeName){
  if(miseCompleted.has(id)){ miseCompleted.delete(id); el.classList.remove('done'); el.innerHTML=el.innerHTML.replace('✓ ',''); }
  else{ miseCompleted.add(id); el.classList.add('done'); el.innerHTML='✓ '+el.innerHTML; }
  const data = MISE_DATA.find(m=>m.name===recipeName)||MISE_DATA[0];
  updateMiseProgress(data);
}

function miseNextTask(){
  const data = MISE_DATA[0];
  const all=[];
  data.stations.forEach(st=>st.tasks.forEach((t,ti)=>all.push({id:`${st.label}-${ti}`,text:t.text,station:st.label})));
  const pending=all.filter(t=>!miseCompleted.has(t.id));
  const b=document.getElementById('miseActiveBubble');
  if(!pending.length){ b.style.display='block'; b.innerHTML='🎉 Todas as etapas concluídas! Bom apetite!'; return; }
  b.style.display='block'; b.innerHTML=`▶ <strong>${pending[0].station}:</strong> ${pending[0].text}`;
}

function updateMiseProgress(data){
  let total=0;
  data.stations.forEach(st=>total+=st.tasks.length);
  const pct=total?miseCompleted.size/total*100:0;
  document.getElementById('miseProgressFill').style.width=pct+'%';
  if(pct===100){ showToast('🎉','Mise en place completo! +60 XP'); addXP(60); }
}

function resetMise(){
  miseCompleted=new Set();
  document.getElementById('miseActiveBubble').style.display='none';
  loadMiseRecipe();
}

/* ════════════════════════════════════════
   TIMER
════════════════════════════════════════ */
function startTimer(minutes){
  if(state.activeTimer) clearInterval(state.activeTimer);
  let secs = minutes*60;
  showToast('⏱️',`Timer de ${minutes}min iniciado!`);
  state.activeTimer = setInterval(()=>{
    secs--;
    if(secs<=0){ clearInterval(state.activeTimer); state.activeTimer = null; showToast('🔔',`Timer de ${minutes}min finalizado!`); }
  },1000);
}

/* ════════════════════════════════════════
   MODAIS & TOAST
════════════════════════════════════════ */
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click', e=>{ if(e.target===m) m.classList.remove('open'); });
});

let toastCount=0;
function showToast(icon, msg){
  const stack=document.getElementById('toastStack');
  const t=document.createElement('div');
  t.className='toast';
  t.innerHTML=`<span class="toast-icon">${icon}</span><div>${msg}</div>`;
  stack.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),400); },3500);
}

function realizarCadastroNoPHP() {
  const nome = document.getElementById('reg-nome').value;
  const email = document.getElementById('reg-email').value;
  const senha = document.getElementById('reg-senha').value;
  const dados = { nome, email, senha, avatar: '🧑' };

  fetch('index.php?acao=registar_utilizador', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(res => res.json())
  .then(resposta => {
    if (resposta.sucesso) {
      showToast('🎉', resposta.mensagem);
      ['reg-nome', 'reg-email', 'reg-senha'].forEach(id => {
        document.getElementById(id).value = '';
      });
      closeModal('cadastroModal');
    } else {
      showToast('❌', resposta.mensagem);
    }
  })
  .catch(error => showToast('❌', 'Erro de conexão com o servidor.'));
}

function carregarInventarioDoBanco() {
  fetch('index.php?acao=listar_inventario')
    .then(res => res.json())
    .then(dados => {
      if (Array.isArray(dados)) {
        state.inventory = dados.map(item => ({
          id: item.id || Date.now() + Math.random(),
          name: item.nome_ingrediente,
          qty: item.quantidade,
          expiry: item.data_vencimento,
          emoji: '📦'
        }));
        renderInventory();
      }
    })
    .catch(err => console.error("Erro ao carregar inventário:", err));
}

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
renderHome();
renderRecipes();
carregarInventarioDoBanco();
renderCommunity();
renderGamePage();
updateLevelUI();

// Draw wheel on load
setTimeout(()=>{ const c=document.getElementById('wheelCanvas'); if(c) drawWheel(); },100);
controller.txt