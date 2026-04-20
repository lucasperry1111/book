(function(){

  // Prevent double loading
  if (window.__UTP_LOADED__) return;
  window.__UTP_LOADED__ = true;

  const html = document.documentElement;

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    .ut-dark * {
      background-color:#111 !important;
      color:#e0e0e0 !important;
      border-color:#333 !important;
    }
    .ut-snap header,
    .ut-snap nav,
    .ut-snap footer,
    .ut-snap aside,
    .ut-snap .sidebar,
    .ut-snap .toolbar,
    .ut-snap .menu {
      display:none !important;
    }
    .ut-img img,
    .ut-img video,
    .ut-img picture {
      opacity:0 !important;
    }
    .ut-text * {
      color:transparent !important;
      text-shadow:none !important;
    }
    .ut-text input,
    .ut-text textarea {
      color:transparent !important;
    }
  `;
  document.head.appendChild(style);

  // Panel
  const p = document.createElement("div");
  p.style.cssText = `
    position:fixed;top:80px;right:20px;width:180px;
    background:#111;color:#0ff;border:2px solid #0ff;
    padding:10px;font-family:monospace;z-index:999999999;
    border-radius:10px;cursor:move;box-shadow:0 0 10px #0ff;
  `;
  p.innerHTML = `<b>⚡ Tools</b><br><small style="color:#888">drag me</small>`;

  function addBtn(label, color, fn){
    const b = document.createElement("button");
    b.innerText = label;
    b.style.cssText = `
      width:100%;margin-top:6px;background:transparent;
      color:${color};border:1px solid ${color};
      padding:5px;border-radius:4px;font-size:11px;cursor:pointer;
    `;
    b.onmouseover = ()=>{ b.style.background=color; b.style.color="#000"; };
    b.onmouseout  = ()=>{ b.style.background="transparent"; b.style.color=color; };
    b.onclick = e => { e.stopPropagation(); fn(); };
    p.appendChild(b);
  }

  // State
  let dark=false, snap=false, img=false, txt=false, hue=0;

  addBtn("🌙 Dark Mode", "#fff", ()=>{
    dark=!dark;
    html.classList.toggle("ut-dark", dark);
  });

  addBtn("📸 Screenshot", "#0ff", ()=>{
    snap=!snap;
    html.classList.toggle("ut-snap", snap);
  });

  addBtn("🌈 Cycle Colors", "#ff0", ()=>{
    hue=(hue+45)%360;
    html.style.filter = `hue-rotate(${hue}deg)`;
  });

  addBtn("♻ Reset Colors", "#0f0", ()=>{
    hue=0;
    html.style.filter = "";
  });

  addBtn("🖼 Toggle Images", "#4af", ()=>{
    img=!img;
    html.classList.toggle("ut-img", img);
  });

  addBtn("🔤 Toggle Text", "#c6f", ()=>{
    txt=!txt;
    html.classList.toggle("ut-text", txt);
  });

  addBtn("🧼 Clean Page", "#fa0", ()=>{
    html.classList.add("ut-snap","ut-img","ut-text");
    snap=img=txt=true;
  });

  addBtn("🔧 Restore All", "#0f9", ()=>{
    html.classList.remove("ut-dark","ut-snap","ut-img","ut-text");
    html.style.filter="";
    dark=snap=img=txt=false;
    hue=0;
  });

  addBtn("❌ Close", "#555", ()=>{
    p.remove();
    window.__UTP_LOADED__ = false;
  });

  // Draggable
  let x=0,y=0,dx=0,dy=0;
  p.onmousedown = e=>{
    dx=e.clientX; dy=e.clientY;
    document.onmouseup = ()=>{ document.onmousemove=null; };
    document.onmousemove = e=>{
      x = dx - e.clientX;
      y = dy - e.clientY;
      dx = e.clientX;
      dy = e.clientY;
      p.style.top = (p.offsetTop - y) + "px";
      p.style.left = (p.offsetLeft - x) + "px";
    };
  };

  document.body.appendChild(p);

})();
