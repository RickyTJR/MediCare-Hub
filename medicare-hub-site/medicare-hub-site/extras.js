(function(){
"use strict";
S.w=S.w||{};S.vx=S.vx||[];S.lb=S.lb||[];S.cd=S.cd||[];S.stock=S.stock||{};S.ui=S.ui||{fs:1,hc:0,th:""};
var R=document.documentElement,EM=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function ui(){document.body.style.setProperty("--fs",S.ui.fs);R.dataset.hc=S.ui.hc?"1":"0";if(S.ui.th)R.dataset.theme=S.ui.th}
function toast(m,bad){var t=document.createElement("div");t.className="toast"+(bad?" bad":"");t.textContent=m;$("#tw").appendChild(t);setTimeout(function(){t.remove()},6000)}
function modal(h,keep){var o=document.createElement("div");o.className="mo";o.innerHTML='<div class="md" role="dialog" aria-modal="true">'+h+(keep?"":'<p><button class="btn s" data-x>Close</button></p>')+"</div>";o.addEventListener("click",function(e){if(!keep&&(e.target===o||e.target.hasAttribute("data-x")))o.remove()});document.body.appendChild(o);return o}
function dl(n,t,ty){var u=URL.createObjectURL(new Blob([t],{type:ty}));var a=document.createElement("a");a.href=u;a.download=n;document.body.appendChild(a);a.click();a.remove()}
function sha(s){if(!window.crypto||!crypto.subtle)return Promise.resolve("p"+s);return crypto.subtle.digest("SHA-256",new TextEncoder().encode("mc"+s)).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return("0"+x.toString(16)).slice(-2)}).join("")})}
function doc(id){return DOCS.filter(function(d){return d.id===id})[0]}
function ap(id){return S.ap.filter(function(a){return a.id===id})[0]}

/* ---------- shell: banner, toolbar, SOS, toasts ---------- */
document.body.insertAdjacentHTML("afterbegin",'<a class="skip" href="#m">Skip to content</a>');
document.body.insertAdjacentHTML("beforeend",'<div id="tw" aria-live="polite"></div><button class="sos" id="sos" aria-label="Emergency help">SOS</button><div id="prt"></div>');
$(".bar").insertAdjacentHTML("beforeend",'<div class="tb"><button id="tT" aria-label="Toggle dark mode" title="Dark mode">🌓</button><button id="tM" aria-label="Smaller text">A&minus;</button><button id="tP" aria-label="Larger text">A+</button><button id="tC" aria-label="High contrast" title="High contrast">HC</button></div>');
$("#m").setAttribute("tabindex","-1");
$("#tT").onclick=function(){var dark=R.dataset.theme?R.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;S.ui.th=dark?"light":"dark";save();ui()};
$("#tM").onclick=function(){S.ui.fs=Math.max(.85,+(S.ui.fs-.1).toFixed(2));save();ui()};
$("#tP").onclick=function(){S.ui.fs=Math.min(1.5,+(S.ui.fs+.1).toFixed(2));save();ui()};
$("#tC").onclick=function(){S.ui.hc=S.ui.hc?0:1;save();ui()};
$("#sos").onclick=function(){var p=S.p;modal('<h2>Emergency help</h2><p>For a life-threatening emergency call now:</p><p><a class="btn" href="tel:911">Call 911</a> <a class="btn s" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=emergency+room+near+me">Find nearest ER</a></p><h2>My emergency card</h2><p>Name: '+esc(p.name||"not set")+'<br>Blood type: '+esc(p.blood||"not set")+'<br>Allergies: '+esc(p.allergy||"not set")+'<br>Contact: '+esc((p.ecn||"not set")+" "+(p.ec||""))+'</p>')};

/* ---------- first-visit agreement and PIN lock ---------- */
function consent(){try{if(localStorage.getItem("mc-ack"))return}catch(e){return}
var o=modal('<h2>Please read first</h2><p><b>MediCare Hub is a demonstration website.</b> It is not a real clinic, hospital, or telemedicine service. It is not verified or licensed, and its doctors are fictional. Do not use it for medical decisions. In an emergency call <b>911</b>.</p><label class="chk"><input type="checkbox" id="ak"> I understand this is a demo.</label><p><button class="btn" id="akb" disabled>Continue</button></p>',1);
$("#ak").onchange=function(){$("#akb").disabled=!this.checked};
$("#akb").onclick=function(){try{localStorage.setItem("mc-ack","1")}catch(e){}o.remove()}}
function lock(){if(!S.pin)return;var o=modal('<h2>Enter PIN</h2><input id="lp" type="password" inputmode="numeric" autocomplete="off"><p><button class="btn" id="lb">Unlock</button></p><p class="mu" id="lm"></p>',1);
$("#lb").onclick=function(){sha($("#lp").value).then(function(h){if(h===S.pin)o.remove();else $("#lm").textContent="Wrong PIN."})}}

/* ---------- booking: patient details + real email ---------- */
var _bk=bk;
bk=function(){_bk();if(!B.doc)return;B.pt=B.pt||{};var r=$("#rs");if(!r)return;
r.insertAdjacentHTML("beforebegin",'<div class="row"><div><label>Patient name *</label><input value="'+esc(B.pt.n||S.p.name||"")+'" autocomplete="name" oninput="B.pt.n=this.value"></div><div><label>Gmail or email *</label><input type="email" placeholder="you@gmail.com" autocomplete="email" value="'+esc(B.pt.e||"")+'" oninput="B.pt.e=this.value"></div><div><label>Mobile</label><input type="tel" autocomplete="tel" value="'+esc(B.pt.m||"")+'" oninput="B.pt.m=this.value"></div></div>');
r.value=B.pt.r||"";r.oninput=function(){B.pt.r=r.value};
r.insertAdjacentHTML("afterend",'<label class="chk"><input type="checkbox" '+(B.pt.ok?"checked":"")+' onchange="B.pt.ok=this.checked"> I understand this is a demo and agree to the Terms (see Help).</label>')};
function mail(a){var d=doc(a.doc);a.mail="sending";
return fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"booking",to:a.e,ref:a.ref,name:a.n,doctor:d.n,spec:d.s,date:fd(a.date),time:f12(a.t),mode:a.mode,reason:a.why,fee:d.f})})
.then(function(r){return r.json()}).then(function(j){a.mail=j.ok?"sent":"failed";save();toast(j.ok?"Confirmation email sent to "+a.e:"Booked, but the email could not be sent. Use the calendar buttons instead.",!j.ok);if(route()==="appts")draw()})
.catch(function(){a.mail="failed";save();toast("Booked, but the email service is not reachable.",1);if(route()==="appts")draw()})}
confirmBk=function(){var p=B.pt||{};
if(!B.slot)return toast("Please pick a time slot.",1);
if(!p.n||p.n.trim().length<2)return toast("Enter the patient name.",1);
if(!EM.test((p.e||"").trim()))return toast("Enter a valid email address.",1);
if(!p.ok)return toast("Please tick the agreement box.",1);
var a={id:uid(),doc:B.doc,date:B.date,t:B.slot,mode:B.mode,why:p.r||"",st:"Confirmed",ref:"MC-"+Math.floor(1e5+Math.random()*9e5),n:p.n.trim(),e:p.e.trim(),m:p.m||"",mail:"sending"};
S.ap.push(a);save();B.doc=null;B.slot="";B.pt={n:p.n,e:p.e,m:p.m};
modal('<h2>Request received</h2><p>Reference <b>'+a.ref+'</b><br>'+esc(doc(a.doc).n)+'<br>'+fd(a.date)+" at "+f12(a.t)+'</p><p class="mu">Sending a confirmation to '+esc(a.e)+'. This is a demo booking and no real appointment exists.</p>');
mail(a);location.hash="appts"};
function dt(d,t,add){var x=new Date(new Date(d+"T"+t+":00").getTime()+add*6e4),p=function(n){return("0"+n).slice(-2)};return x.getFullYear()+p(x.getMonth()+1)+p(x.getDate())+"T"+p(x.getHours())+p(x.getMinutes())+"00"}
window.xIcs=function(id){var a=ap(id),d=doc(a.doc);dl(a.ref+".ics",["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//MediCare Hub Demo//EN","BEGIN:VEVENT","UID:"+a.ref+"@medicare-hub-demo","DTSTAMP:"+dt(TODAY,"00:00",0),"DTSTART:"+dt(a.date,a.t,0),"DTEND:"+dt(a.date,a.t,30),"SUMMARY:Appointment with "+d.n+" (DEMO)","DESCRIPTION:Reference "+a.ref,"BEGIN:VALARM","TRIGGER:-PT60M","ACTION:DISPLAY","DESCRIPTION:Appointment in 1 hour","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n"),"text/calendar")};
function gcal(a){var d=doc(a.doc);return"https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent("Appointment with "+d.n+" (DEMO)")+"&dates="+dt(a.date,a.t,0)+"/"+dt(a.date,a.t,30)+"&details="+encodeURIComponent("Reference "+a.ref)}
window.xMail=function(id){var a=ap(id);toast("Sending email...");mail(a).then(draw)};
window.xRes=function(id){var a=ap(id);B.doc=a.doc;B.pt={n:a.n,e:a.e,m:a.m,r:a.why};S.ap=S.ap.filter(function(x){return x.id!==id});save();location.hash="book";toast("Pick a new date and time.")};
V.appts=function(){var L=S.ap.slice().sort(function(a,b){return(a.date+a.t)<(b.date+b.t)?-1:1});
return'<h1>My appointments</h1><p class="mu">Demo bookings only. No real appointment is created.</p>'+(L.length?'<div class="g">'+L.map(function(a){var past=a.date<TODAY,ml={sent:"Email sent",failed:"Email failed",sending:"Sending email"}[a.mail]||"";
return'<div class="c"><b>'+esc(dn(a.doc))+'</b><div class="big" style="font-size:18px;margin:6px 0">'+fd(a.date)+" · "+f12(a.t)+'</div><div class="mu">'+esc(a.mode)+" · Ref "+a.ref+'</div>'+(a.n?'<div class="mu">'+esc(a.n)+" · "+esc(a.e||"")+"</div>":"")+(a.why?'<p style="font-size:14px">'+esc(a.why)+"</p>":"")+'<div class="row" style="margin:8px 0"><span class="tag">'+(past?"Completed":"Confirmed")+'</span>'+(ml?'<span class="tag '+(a.mail==="failed"?"bad":"")+'">'+ml+"</span>":"")+'</div><div class="row">'+
'<a class="btn s" target="_blank" rel="noopener" href="'+gcal(a)+'">Google Calendar</a><button class="btn s" onclick="xIcs(\''+a.id+'\')">.ics</button>'+(a.e?'<button class="btn s" onclick="xMail(\''+a.id+'\')">Resend email</button>':"")+'<button class="btn s" onclick="xRes(\''+a.id+'\')">Reschedule</button><button class="btn d" onclick="delAp(\''+a.id+'\')">Cancel</button></div></div>'}).join("")+"</div>":'<div class="c">No appointments yet. <a href="#book" style="color:var(--pr);font-weight:700">Book one</a></div>')};

/* ---------- symptom guide ---------- */
var RED=["Chest pain or pressure","Severe trouble breathing","Face drooping, arm weakness, or speech trouble","Bleeding that will not stop","Seizure or fainting","Thoughts of harming myself"];
var SYM=[["Fever, cough, or colds","General Medicine"],["Headache or tiredness","General Medicine"],["Skin rash or itching","Dermatology"],["Ear pain, sore throat, or blocked nose","ENT"],["Joint, bone, or back pain","Orthopedics"],["Racing heart or high blood pressure","Cardiology"],["My child is unwell","Pediatrics"],["Anxiety, low mood, or poor sleep","Psychiatry"],["Tooth or gum pain","Dentistry"],["Very thirsty or urinating often","Endocrinology"],["Period or pregnancy concern","OB-Gynecology"]];
var SK={};
V.symptom=function(){return'<h1>Symptom guide</h1><p class="mu">A simple guide to choose the right kind of doctor. It does not diagnose.</p><div class="c" style="margin-bottom:12px"><h2>Warning signs</h2>'+RED.map(function(s,i){return'<label class="chk"><input type="checkbox" '+(SK["r"+i]?"checked":"")+' onchange="SK[\'r'+i+'\']=this.checked"> '+s+"</label>"}).join("")+'</div><div class="c"><h2>Other concerns</h2>'+SYM.map(function(s,i){return'<label class="chk"><input type="checkbox" '+(SK["s"+i]?"checked":"")+' onchange="SK[\'s'+i+'\']=this.checked"> '+s[0]+"</label>"}).join("")+'<p><button class="btn" onclick="symGo()">See suggestion</button></p><div id="sr"></div></div>'};
window.SK=SK;
window.symGo=function(){var red=RED.some(function(s,i){return SK["r"+i]}),sp=[];SYM.forEach(function(s,i){if(SK["s"+i]&&sp.indexOf(s[1])<0)sp.push(s[1])});
$("#sr").innerHTML=red?'<div class="alert"><b>Get urgent help now.</b> Call <a href="tel:911">911</a> or go to the nearest emergency room. Do not wait for an online booking.</div>':sp.length?'<p><b>Suggested specialties:</b></p><div class="row">'+sp.map(function(s){return'<button class="btn s" onclick="B.spec=\''+s+'\';location.hash=\'book\'">'+s+"</button>"}).join("")+'</div><p class="mu">If symptoms get worse quickly, seek care in person.</p>':'<p class="mu">Select at least one concern.</p>'};

/* ---------- health tools ---------- */
var LS={vx:["Vaccinations","Vaccine name"],lb:["Lab results","Test and result"],cd:["Conditions and allergies","Condition or allergy"]};
function wt(){return S.w[TODAY]||0}
window.xW=function(n){S.w[TODAY]=Math.max(0,wt()+n);save();draw()};
window.xL=function(k){var t=$("#l_"+k).value.trim();if(!t)return;S[k].push({id:uid(),t:t,d:$("#d_"+k).value||TODAY});save();draw()};
window.xD=function(k,id){S[k]=S[k].filter(function(x){return x.id!==id});save();draw()};
window.xS=function(id,v){S.stock[id]=v===""?"":+v;save()};
V.tools=function(){return'<h1>Health tools</h1><div class="g"><div class="c"><h2>Water today</h2><div class="big">'+wt()+' <span class="mu">of 8 glasses</span></div><div class="pb"><i style="width:'+Math.min(100,wt()/8*100)+'%"></i></div><div class="row" style="margin-top:8px"><button class="btn s" onclick="xW(-1)">&minus; 1</button><button class="btn" onclick="xW(1)">+ 1 glass</button></div></div>'+
'<div class="c"><h2>Pill stock</h2>'+(S.md.length?S.md.map(function(m){var s=S.stock[m.id];return'<label>'+esc(m.n)+'</label><input type="number" min="0" placeholder="Pills left" value="'+(s===undefined?"":s)+'" onchange="xS(\''+m.id+'\',this.value);draw()">'+(s!==undefined&&s!==""&&s<=5?'<div class="warn">Refill soon</div>':"")}).join(""):'<p class="mu">Add a reminder first.</p>')+'</div>'+
Object.keys(LS).map(function(k){return'<div class="c"><h2>'+LS[k][0]+'</h2><div class="row"><input id="l_'+k+'" placeholder="'+LS[k][1]+'"><input id="d_'+k+'" type="date" value="'+TODAY+'"><button class="btn" onclick="xL(\''+k+'\')">Add</button></div>'+S[k].map(function(x){return'<div class="row" style="flex-wrap:nowrap;border-top:1px solid var(--bd);padding-top:6px"><span>'+esc(x.t)+' <span class="mu">'+fd(x.d)+'</span></span><button class="btn d" style="flex:0 0 auto" onclick="xD(\''+k+'\',\''+x.id+'\')">&times;</button></div>'}).join("")+"</div>"}).join("")+
'<div class="c"><h2>Privacy and data</h2><div class="row"><button class="btn s" onclick="xPin()">'+(S.pin?"Remove PIN":"Set PIN lock")+'</button><button class="btn s" onclick="xPrint()">Print summary</button></div><div class="row" style="margin-top:8px"><button class="btn s" onclick="exp()">Export JSON</button><label class="btn s" style="margin:0;cursor:pointer">Import JSON<input type="file" accept=".json" hidden onchange="xImp(this)"></label></div></div></div>'};
window.xPin=function(){if(S.pin){delete S.pin;save();draw();return toast("PIN removed.")}var v=prompt("Choose a PIN of 4 to 8 digits");if(!v)return;if(!/^\d{4,8}$/.test(v))return toast("Use 4 to 8 digits.",1);sha(v).then(function(h){S.pin=h;save();draw();toast("PIN lock set.")})};
window.xImp=function(i){var f=i.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||typeof o!=="object"||!Array.isArray(o.ap))throw 0;delete o.pin;Object.assign(S,o);save();location.reload()}catch(e){toast("That file is not a valid export.",1)}};r.readAsText(f)};
window.xPrint=function(){var p=S.p,last={};S.vt.forEach(function(v){last[v.m]=v});
$("#prt").innerHTML='<h1>Health summary (DEMO)</h1><p>'+esc(p.name||"")+" · Age "+esc(p.age||"-")+" · Blood "+esc(p.blood||"-")+"<br>Allergies: "+esc(p.allergy||"-")+"<br>Emergency: "+esc((p.ecn||"-")+" "+(p.ec||""))+"</p><h2>Medicines</h2><p>"+(S.md.map(function(m){return esc(m.n+" "+m.d+" at "+f12(m.t))}).join("<br>")||"None")+"</p><h2>Latest readings</h2><p>"+(Object.keys(last).map(function(k){var v=last[k];return MET[k][0]+": "+esc(v.a)+(k==="bp"?"/"+esc(v.b):"")+" "+MET[k][1]+" ("+fd(v.date)+")"}).join("<br>")||"None")+"</p><h2>Conditions, vaccines, labs</h2><p>"+["cd","vx","lb"].map(function(k){return S[k].map(function(x){return esc(x.t)+" ("+fd(x.d)+")"}).join("<br>")}).filter(Boolean).join("<br>")+"</p><p><i>Generated by a demo website. Not an official medical record.</i></p>";window.print()};

/* ---------- find care + help ---------- */
window.xMap=function(q){var a=($("#ar")||{}).value||"near me";window.open("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q+" "+(a.trim()?(/near/i.test(a)?a:"near "+a):"near me")),"_blank","noopener")};
V.find=function(){return'<h1>Find care nearby</h1><p class="mu">Opens Google Maps. Always confirm that a facility is licensed before visiting.</p><div class="c" style="margin-bottom:12px"><label>Area (optional)</label><input id="ar" placeholder="e.g. Quezon City"><div class="row">'+["Hospital","Emergency room","24 hour pharmacy","Medical clinic","Dental clinic","Laboratory","Urgent care"].map(function(q){return'<button class="chip" onclick="xMap(\''+q+'\')">'+q+"</button>"}).join("")+'</div></div><div class="c"><h2>Emergency number</h2><p>Philippines national emergency hotline: <b><a href="tel:911">911</a></b>. Check local numbers for your area.</p></div>'};
var FAQ=[["Is this a real clinic?","No. MediCare Hub is a demonstration project. It is not a real or verified medical facility, and all doctors are fictional."],["Will I really get an email?","Yes, if the site owner has set up the email service, a confirmation is sent to the address you enter. The appointment itself is not real."],["Where is my data stored?","In this browser only (local storage). Clearing site data removes it. Use Export to keep a copy."],["How do alarms work?","Medicine alarms ring while the page is open. Allow notifications for banner alerts. They are not a substitute for a medical device."],["Does the watch really sync?","The watch section uses sample data for demonstration."],["Can I use this for medical decisions?","No. Talk to a licensed professional. In an emergency call 911."]];
V.help=function(){return'<h1>Help and policies</h1><div class="c" style="margin-bottom:12px"><h2>FAQ</h2>'+FAQ.map(function(f){return'<details><summary>'+f[0]+"</summary><p>"+f[1]+"</p></details>"}).join("")+'</div><div class="g"><div class="c"><h2>Terms</h2><p class="mu" style="font-size:13px">This demo is provided as is for education. It offers no medical advice, diagnosis, or treatment, and no real appointments. Do not enter information you are not comfortable storing in your own browser.</p><h2>Privacy</h2><p class="mu" style="font-size:13px">Records stay in your browser. The only data sent to a server is the details of a booking or message, used to send one email.</p></div><div class="c"><h2>Contact the owner</h2><label>Name</label><input id="cn"><label>Email</label><input id="ce" type="email"><label>Message</label><textarea id="cm" rows="3"></textarea><button class="btn" onclick="xCt()">Send</button></div></div>'};
window.xCt=function(){var n=$("#cn").value.trim(),e=$("#ce").value.trim(),m=$("#cm").value.trim();if(!n||!EM.test(e)||m.length<5)return toast("Fill in name, a valid email, and a message.",1);
fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"contact",name:n,email:e,message:m})}).then(function(r){return r.json()}).then(function(j){toast(j.ok?"Message sent.":"Could not send the message.",!j.ok);if(j.ok){$("#cm").value=""}}).catch(function(){toast("Email service not reachable.",1)})};

/* ---------- start ---------- */
TABS.splice(2,0,["symptom","Symptom guide"]);TABS.splice(8,0,["tools","Health tools"],["find","Find care"],["help","Help"]);
ui();draw();consent();lock();
var tm=iso(new Date(Date.now()+864e5));
S.ap.forEach(function(a){if(a.date===TODAY)toast("Appointment today at "+f12(a.t)+" with "+doc(a.doc).n);else if(a.date===tm)toast("Appointment tomorrow at "+f12(a.t))});
if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(function(){});
})();
