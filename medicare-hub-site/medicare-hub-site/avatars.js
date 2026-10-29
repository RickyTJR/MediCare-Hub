/* Original illustrated doctor avatars. Drawn in code, so there is no copyright or licence issue. */
var BGS=[["#cffafe","#22d3ee"],["#e0f2fe","#38bdf8"],["#dbeafe","#60a5fa"],["#cffafe","#06b6d4"],["#e0f2fe","#0ea5e9"],["#dbeafe","#3b82f6"]];
function avatar(o){
var sk=o.sk,sh=o.sh||"#00000022",hc=o.hc,g=o.g==="f",st=o.st,b=BGS[(o.bg||0)%BGS.length],id="a"+(o.id||0),s="";
s+='<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+(o.label||"Doctor portrait")+'"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+b[0]+'"/><stop offset="1" stop-color="'+b[1]+'"/></linearGradient><clipPath id="c'+id+'"><circle cx="60" cy="60" r="60"/></clipPath></defs>';
s+='<g clip-path="url(#c'+id+')"><rect width="120" height="120" fill="url(#'+id+')"/><circle cx="96" cy="24" r="26" fill="#fff" opacity=".18"/>';
/* hair behind head */
if(st==="long")s+='<path d="M27 58C25 22 95 22 93 58L96 104L24 104Z" fill="'+hc+'"/>';
if(st==="wavy")s+='<path d="M27 56C24 20 96 20 93 56C98 72 94 84 100 100L20 100C26 84 22 72 27 56Z" fill="'+hc+'"/>';
if(st==="bob")s+='<path d="M28 56C26 24 94 24 92 56L94 80C84 86 36 86 26 80Z" fill="'+hc+'"/>';
if(st==="bun")s+='<circle cx="60" cy="21" r="10" fill="'+hc+'"/>';
/* body: white coat, scrub collar, stethoscope */
s+='<path d="M10 122C10 94 34 84 60 84C86 84 110 94 110 122Z" fill="#fff"/><path d="M46 85L60 108L74 85Z" fill="#0891b2"/><path d="M46 85L38 122M74 85L82 122" stroke="#cbd5e1" stroke-width="2" fill="none"/>';
s+='<path d="M44 88C42 106 50 112 56 108M76 88C78 106 70 112 64 108" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="60" cy="108" r="3.4" fill="#475569"/>';
/* neck, ears, face */
s+='<rect x="52" y="68" width="16" height="22" rx="7" fill="'+sk+'"/><path d="M52 80Q60 86 68 80V74H52Z" fill="'+sh+'"/>';
s+='<circle cx="39" cy="56" r="4.2" fill="'+sk+'"/><circle cx="81" cy="56" r="4.2" fill="'+sk+'"/>';
s+='<ellipse cx="60" cy="54" rx="21" ry="25" fill="'+sk+'"/>';
/* hair front */
if(st==="short")s+='<path d="M37 54C33 19 87 19 83 54C80 44 72 38 60 38C48 38 40 44 37 54Z" fill="'+hc+'"/>';
if(st==="side")s+='<path d="M37 54C33 19 87 19 83 54C82 46 72 40 54 40C46 40 40 46 37 54Z" fill="'+hc+'"/><path d="M40 50C44 36 60 30 78 34C64 36 52 42 48 54Z" fill="'+hc+'"/>';
if(st==="crew")s+='<path d="M37 52C34 19 86 19 83 52C80 44 72 40 60 40C48 40 40 44 37 52Z" fill="'+hc+'"/>';
if(g&&(st==="long"||st==="bob"||st==="wavy"||st==="bun"))s+='<path d="M37 57C33 19 87 19 83 57C78 46 68 40 58 35C54 44 46 52 37 57Z" fill="'+hc+'"/>';
/* beard */
if(o.bd)s+='<path d="M40 60C42 80 78 80 80 60C77 71 70 76 60 76C50 76 43 71 40 60Z" fill="'+hc+'" opacity=".8"/>';
/* eyes, brows, nose, mouth */
s+='<ellipse cx="51" cy="55" rx="2.8" ry="3.2" fill="#1e293b"/><ellipse cx="69" cy="55" rx="2.8" ry="3.2" fill="#1e293b"/><circle cx="52" cy="54" r="1" fill="#fff"/><circle cx="70" cy="54" r="1" fill="#fff"/>';
s+='<path d="M45 48Q51 '+(g?45:46)+' 57 48M63 48Q69 '+(g?45:46)+' 75 48" stroke="'+hc+'" stroke-width="'+(g?1.8:2.6)+'" fill="none" stroke-linecap="round"/>';
if(g)s+='<path d="M47 52L45 50M73 52L75 50" stroke="#1e293b" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="45" cy="63" rx="4" ry="2.4" fill="#f472b6" opacity=".22"/><ellipse cx="75" cy="63" rx="4" ry="2.4" fill="#f472b6" opacity=".22"/>';
s+='<path d="M60 56Q57 63 60 65" stroke="'+sh+'" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
s+=g?'<path d="M52 69Q60 76 68 69Q60 72 52 69Z" fill="#be4a5a"/>':'<path d="M52 70Q60 75 68 70" stroke="'+(o.bd?"#e9b8a4":"#9a4a3a")+'" stroke-width="2" fill="none" stroke-linecap="round"/>';
if(o.gl)s+='<g fill="none" stroke="#1e3a5f" stroke-width="1.8"><rect x="43" y="49" width="16" height="12" rx="5"/><rect x="61" y="49" width="16" height="12" rx="5"/><path d="M59 54H61"/></g>';
s+='</g></svg>';return s}
/* 10 fictional doctors: gender matches the name; styles and skin tones vary */
var AV={
1:{g:"f",sk:"#e8b894",hc:"#2b1b14",st:"long",bg:0,label:"Illustrated portrait of Dr. Maria Santos"},
2:{g:"m",sk:"#d9a27c",hc:"#1f1a17",st:"side",bg:2,gl:1,label:"Illustrated portrait of Dr. Jose Reyes"},
3:{g:"f",sk:"#f0c4a2",hc:"#3a2418",st:"bun",bg:1,label:"Illustrated portrait of Dr. Angela Cruz"},
4:{g:"m",sk:"#c88f6a",hc:"#15110f",st:"short",bg:3,bd:1,label:"Illustrated portrait of Dr. Paolo Lim"},
5:{g:"f",sk:"#dca47f",hc:"#4a2b1b",st:"wavy",bg:4,label:"Illustrated portrait of Dr. Kristine Ramos"},
6:{g:"m",sk:"#e3b08a",hc:"#2a1d16",st:"crew",bg:5,label:"Illustrated portrait of Dr. Miguel Tan"},
7:{g:"f",sk:"#c98f68",hc:"#1c1410",st:"bob",bg:2,gl:1,label:"Illustrated portrait of Dr. Lara Mendoza"},
8:{g:"m",sk:"#f0c09b",hc:"#5a3a22",st:"side",bg:0,label:"Illustrated portrait of Dr. Ramon Garcia"},
9:{g:"f",sk:"#e6b38e",hc:"#241713",st:"long",bg:3,gl:1,label:"Illustrated portrait of Dr. Sofia Navarro"},
10:{g:"m",sk:"#d49a74",hc:"#1a1411",st:"short",bg:1,gl:1,label:"Illustrated portrait of Dr. Carlo Bautista"}};
function davatar(id){var a=AV[id];if(!a)return"";var o={};for(var k in a)o[k]=a[k];o.id=id;return avatar(o)}
