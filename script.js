// ============ FORM DATA ============
var fd={gender:'',age:'',height:'',weight:'',goal:'',activity:'',diet:'',water:'',sleep:'',budget:'',conditions:[],name:'',phone:''};
var curStep=0,total=10;

// ============ STEP DOTS INIT ============
(function(){
  var c=document.getElementById('stepDots');
  for(var i=0;i<total;i++){
    var d=document.createElement('div');
    d.className='sd'+(i===0?' active':'');
    d.id='dot'+i;
    d.textContent=i+1;
    c.appendChild(d);
    if(i<total-1){var l=document.createElement('div');l.className='sl';l.id='line'+i;c.appendChild(l);}
  }
})();

function updateUI(){
  document.getElementById('pFill').style.width=(((curStep+1)/total)*100)+'%';
  document.getElementById('stepLabel').textContent='Step '+(curStep+1)+' of '+total;
  document.getElementById('stepPct').textContent=Math.round(((curStep+1)/total)*100)+'%';
}

function pick(el,step,val){
  el.closest('.mcq-grid').querySelectorAll('.opt').forEach(function(o){o.classList.remove('selected')});
  el.classList.add('selected');
  var keys=['gender','','goal','activity','diet','water','sleep','budget'];
  if(step<keys.length)fd[keys[step]]=val;
}

function toggle(el,step,val){
  if(val==='None'){
    fd.conditions=['None'];
    el.closest('.mcq-grid').querySelectorAll('.opt').forEach(function(o){o.classList.remove('selected')});
    el.classList.add('selected');
  } else {
    el.closest('.mcq-grid').querySelectorAll('.opt').forEach(function(o){if(o.textContent.trim().startsWith('None'))o.classList.remove('selected')});
    fd.conditions=fd.conditions.filter(function(c){return c!=='None'});
    el.classList.toggle('selected');
    var idx=fd.conditions.indexOf(val);
    if(idx>-1)fd.conditions.splice(idx,1);else fd.conditions.push(val);
  }
}

function goNext(){
  if(curStep===1){
    fd.age=document.getElementById('inAge').value;
    fd.height=document.getElementById('inHeight').value;
    fd.weight=document.getElementById('inWeight').value;
  }
  if(curStep<total-1){
    document.getElementById('s'+curStep).classList.remove('active');
    document.getElementById('dot'+curStep).className='sd done';
    if(curStep<total-1){var l=document.getElementById('line'+curStep);if(l)l.className='sl done';}
    curStep++;
    document.getElementById('s'+curStep).classList.add('active');
    document.getElementById('dot'+curStep).className='sd active';
    updateUI();
  }
}

function goPrev(){
  if(curStep>0){
    document.getElementById('s'+curStep).classList.remove('active');
    document.getElementById('dot'+curStep).className='sd';
    curStep--;
    document.getElementById('s'+curStep).classList.add('active');
    document.getElementById('dot'+curStep).className='sd active';
    if(curStep<total-1){var l=document.getElementById('line'+curStep);if(l)l.className='sl';}
    updateUI();
  }
}

function generate(){
  fd.name=document.getElementById('inName').value||'Friend';
  fd.phone=document.getElementById('inPhone').value;
  var h=parseFloat(fd.height)||165,w=parseFloat(fd.weight)||70,a=parseInt(fd.age)||28;
  var bmi=w/((h/100)*(h/100));
  var bmr=fd.gender==='Female'?(447.6+(9.2*w)+(3.1*h)-(4.3*a)):(88.4+(13.4*w)+(4.8*h)-(5.7*a));
  var mult={Sedentary:1.2,Light:1.375,Moderate:1.55,'Very Active':1.725};
  var tdee=Math.round(bmr*(mult[fd.activity]||1.55));
  var goalCal=fd.goal==='Weight Loss'?tdee-500:fd.goal==='Weight Gain'?tdee+400:tdee;
  var cat=bmi<18.5?'Underweight 📉':bmi<25?'Normal ✅':bmi<30?'Overweight ⚠️':'Obese 🔴';
  var water=Math.round(w*0.033*10)/10;

  // Hide steps, show result
  document.getElementById('s9').classList.remove('active');
  document.getElementById('stepDots').style.display='none';
  document.getElementById('pFill').closest('.progress-wrap').style.display='none';

  var ra=document.getElementById('resultArea');
  ra.classList.add('show');
  document.getElementById('rTitle').textContent='🎉 '+fd.name+"'s Personalized Wellness Plan";
  document.getElementById('rSub').textContent='AI-generated for your '+fd.goal+' journey • Herbalife-powered nutrition';

  document.getElementById('rMetrics').innerHTML=
    '<div class="metric-box"><div class="m-val">'+bmi.toFixed(1)+'</div><div class="m-label">Your BMI</div><div class="m-sub">'+cat+'</div></div>'+
    '<div class="metric-box"><div class="m-val">'+goalCal+'<span class="m-unit"> kcal</span></div><div class="m-label">Daily Target</div><div class="m-sub">For '+fd.goal+'</div></div>'+
    '<div class="metric-box"><div class="m-val">'+water+'<span class="m-unit">L</span></div><div class="m-label">Water Daily</div><div class="m-sub">Minimum intake</div></div>'+
    '<div class="metric-box"><div class="m-val">'+(fd.goal==='Weight Loss'?Math.max(0,Math.round((bmi-22)*w/bmi))+' kg':'4 kg')+'</div><div class="m-label">Target Range</div><div class="m-sub">'+(fd.goal==='Weight Loss'?'To lose safely':'Healthy gain')+'</div></div>';

  var products=getProducts();
  var meals=getMeals(goalCal);

  document.getElementById('rPlan').innerHTML=
    '<div class="plan-block"><h4>🌿 Recommended Herbalife Products</h4><div>'+products.map(function(p){return'<span class="product-chip">'+p+'</span>'}).join('')+'</div></div>'+
    '<div class="plan-block"><h4>🌅 Your Morning Routine</h4>'+
    '<div class="plan-item"><span class="pi-check">✓</span>Wake up 6:00–6:30 AM. Drink 1 glass warm water with lemon immediately.</div>'+
    '<div class="plan-item"><span class="pi-check">✓</span>Mix 2 tsp Herbalife Herbal Aloe Concentrate in water — activates gut health and absorption.</div>'+
    '<div class="plan-item"><span class="pi-check">✓</span>10–15 minutes of light stretching, yoga, or a short walk before breakfast.</div>'+
    '<div class="plan-item"><span class="pi-check">✓</span>Herbalife Formula 1 Shake as breakfast between 7:30–8:00 AM for sustained energy.</div></div>'+
    '<div class="plan-block"><h4>🥗 Your Daily Meal Plan</h4>'+meals.map(function(m){return'<div class="plan-item"><span class="pi-check">✓</span>'+m+'</div>'}).join('')+'</div>'+
    '<div class="plan-block"><h4>💧 Hydration & Lifestyle</h4>'+
    '<div class="plan-item"><span class="pi-check">✓</span>Drink minimum '+water+'L water spread across the day in regular intervals.</div>'+
    '<div class="plan-item"><span class="pi-check">✓</span>2 cups Herbalife Herbal Tea daily — clinically shown to boost metabolism by 80+ calories/day.</div>'+
    '<div class="plan-item"><span class="pi-check">✓</span>Target 7–8 hours sleep for optimal hormone regulation, fat loss, and muscle recovery.</div>'+
    '<div class="plan-item"><span class="pi-check">✓</span>'+getExercise()+' — tailored to your '+fd.activity+' activity level.</div></div>';
}

function getProducts(){
  var p=['🌿 Formula 1 Nutritional Shake Mix','🍵 Herbal Tea Concentrate','🌱 Herbal Aloe Concentrate'];
  if(fd.goal==='Weight Gain')p.push('💪 Herbalife Protein Drink Mix','🥛 Personalized Protein Powder');
  if(fd.goal==='Weight Loss')p.push('🔥 Total Control Tablets','💊 Cell-U-Loss Tablets');
  if(fd.budget!=='Under 2000')p.push('💊 Formula 2 Multivitamin Complex');
  if(fd.conditions.includes('Thyroid'))p.push('🦋 Xtra-Cal Supplement');
  return p;
}

function getMeals(cal){
  var veg=fd.diet!=='Non-Vegetarian';
  return [
    '🌅 6:30 AM — Warm lemon water + Herbal Aloe Concentrate',
    '🥤 8:00 AM — Formula 1 Shake ('+Math.round(cal*0.22)+' kcal) + '+(veg?'low-fat milk':'soy milk'),
    '🍎 10:30 AM — Seasonal fruit + 10–12 almonds ('+Math.round(cal*0.10)+' kcal)',
    '🍛 1:00 PM — 2 chapati + '+(veg?'dal + paneer sabzi':'chicken curry / grilled fish')+' + salad ('+Math.round(cal*0.30)+' kcal)',
    '☕ 4:00 PM — Herbal Tea + '+(veg?'roasted chana / makhana':'boiled eggs / tuna')+' ('+Math.round(cal*0.10)+' kcal)',
    '🌙 7:30 PM — Formula 1 Shake (Chocolate) + light '+(veg?'vegetable soup':'grilled fish / soup')+' ('+Math.round(cal*0.25)+' kcal)'
  ];
}

function getExercise(){
  var ex={Sedentary:'Start with 20–30 min brisk walking daily',Light:'30 min walk + 15 min strength training 3x/week',Moderate:'45 min cardio + strength training 4–5x/week','Very Active':'Maintain current routine + add 1 active recovery day'};
  return ex[fd.activity]||'30 min daily exercise';
}

// ============ DASHBOARD ============
function showDash(btn,id){
  document.querySelectorAll('.dash-tab').forEach(function(t){t.classList.remove('active')});
  document.querySelectorAll('.dash-panel').forEach(function(p){p.classList.remove('active')});
  btn.classList.add('active');
  document.getElementById('dp-'+id).classList.add('active');
  if(id==='weight')buildWeightBars();
  if(id==='water')buildWaterUI();
}

function buildWeightBars(){
  var data=[80,79.2,78.5,77.8,77.1,76.3,75.5,74.8];
  var max=Math.max.apply(null,data);
  var el=document.getElementById('weightBars');
  if(!el)return;
  el.innerHTML=data.map(function(w,i){
    var h=Math.round((w/max)*100);
    return '<div class="bar-col"><div class="bar-fill" style="height:'+h+'px" title="W'+(i+1)+': '+w+'kg"></div><div class="bar-lbl">'+w+'</div></div>';
  }).join('');
}

var glassCount=6;
function buildWaterUI(){
  var el=document.getElementById('glassGrid');
  if(!el)return;
  el.innerHTML='';
  for(var i=0;i<10;i++){
    var g=document.createElement('div');
    g.className='glass'+(i<glassCount?' filled':'');
    g.title='Glass '+(i+1);
    el.appendChild(g);
  }
  document.getElementById('waterCount').textContent=glassCount;
  var pct=Math.round((glassCount/10)*100);
  document.getElementById('waterBar').style.width=pct+'%';
}
function addGlass(){glassCount=Math.min(10,glassCount+1);buildWaterUI();}
function removeGlass(){glassCount=Math.max(0,glassCount-1);buildWaterUI();}

// ============ FAQ ============
function faqToggle(btn){
  var a=btn.nextElementSibling;
  btn.classList.toggle('open');
  a.classList.toggle('open');
}

// ============ MODAL ============
function openModal(type){
  var m=document.getElementById('authModal');
  m.classList.add('open');
  if(type==='login'){
    document.getElementById('mTitle').textContent='Welcome Back! 👋';
    document.getElementById('mSub').textContent='Sign in to your wellness dashboard';
    document.getElementById('regForm').style.display='none';
    document.getElementById('loginForm').style.display='block';
    document.querySelectorAll('.m-tab').forEach(function(t,i){t.classList.toggle('active',i===1)});
  } else {
    document.getElementById('mTitle').textContent='Join Ansh Wellness Club 🌿';
    document.getElementById('mSub').textContent='Start your wellness journey for ₹99/month';
    document.getElementById('regForm').style.display='block';
    document.getElementById('loginForm').style.display='none';
    document.querySelectorAll('.m-tab').forEach(function(t,i){t.classList.toggle('active',i===0)});
  }
}
function closeModal(){document.getElementById('authModal').classList.remove('open')}
function outsideClose(e){if(e.target===document.getElementById('authModal'))closeModal()}
function mSwitch(btn,type){
  document.querySelectorAll('.m-tab').forEach(function(t){t.classList.remove('active')});
  btn.classList.add('active');
  document.getElementById('regForm').style.display=type==='reg'?'block':'none';
  document.getElementById('loginForm').style.display=type==='login'?'block':'none';
}

// ============ NAV ============
function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open')}
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open')}

// ============ INIT ============
window.addEventListener('load',function(){buildWeightBars();});