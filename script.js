(function(){

  if (window.__UTP_LOADED__) return;
  window.__UTP_LOADED__ = true;

  const html = document.documentElement;

  /* -------------------------
     SAFE TEXT BACKUP STORAGE
  ------------------------- */
  let __UTP_TEXT_BACKUP__ = new WeakMap();

  /* -------------------------
     CSS (SAFE DARK MODE + OTHERS)
  ------------------------- */
  const style = document.createElement("style");
  style.textContent = `
    /* SAFE DARK MODE (does NOT blend borders or backgrounds) */
    .ut-dark body {
      background:#111 !important;
      color:#e0e0e0 !important;
    }
    .ut-dark body * {
      background-color:transparent !important;
      color:#e0e0e0 !important;
      border-color:#555 !important;
    }

    /* Screenshot mode */
    .ut-snap header,
    .ut-snap nav,
    .ut-snap footer,
    .ut-snap aside,
    .ut-snap .sidebar,
    .ut-snap .toolbar,
    .ut-snap .menu {
      display:none !important;
    }

    /* Hide images */
    .ut-img img,
    .ut-img video,
    .ut-img picture {
      opacity:0 !important;
    }
  `;
  document.head.appendChild(style);

  /* -------------------------
     PANEL (placed OUTSIDE body)
  ------------------------- */
  const p = document.createElement("div");
  p.style.cssText = `
    position:fixed;top:80px;right:20px;width:180px;
    background:#111;color:#0ff;border:2px solid #0ff;
    padding:10px;font-family:monospace;z-index:2147483647;
    border-radius:10px;cursor:move;box-shadow:0 0 10px #0ff;
  `;
  p.innerHTML = `<b>⚡ Tools</b><br><small style="color:#888">drag me</small>`;

  // APPEND TO <html>, NOT <body>
  html.appendChild(p);

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

  /* -------------------------
     STATE
  ------------------------- */
  let dark=false, snap=false, img=false, txt=false, hue=0;

  /* -------------------------
     BUTTONS
  ------------------------- */

  // SAFE DARK MODE
  addBtn("🌙 Dark Mode", "#fff", ()=>{
    dark=!dark;
    html.classList.toggle("ut-dark", dark);
  });

  // Screenshot mode
  addBtn("📸 Screenshot", "#0ff", ()=>{
    snap=!snap;
    html.classList.toggle("ut-snap", snap);
  });

  // Color cycle
  addBtn("🌈 Cycle Colors", "#ff0", ()=>{
    hue=(hue+45)%360;
    html.style.filter = `hue-rotate(${hue}deg)`;
  });

  // Reset colors
  addBtn("♻ Reset Colors", "#0f0", ()=>{
    hue=0;
    html.style.filter = "";
  });

  // Hide images
  addBtn("🖼 Toggle Images", "#4af", ()=>{
    img=!img;
    html.classList.toggle("ut-img", img);
  });

  /* -------------------------
     SAFE TOGGLE TEXT (panel immune)
  ------------------------- */
  addBtn("🔤 Toggle Text", "#c6f", ()=>{
    txt = !txt;

    if (txt) {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node){
            // SKIP PANEL TEXT
            if (p.contains(node.parentNode)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        if (!__UTP_TEXT_BACKUP__.has(node)) {
          __UTP_TEXT_BACKUP__.set(node, node.textContent);
          node.textContent = node.textContent.replace(/\S/g, "•");
        }
      }

    } else {
      __UTP_TEXT_BACKUP__.forEach((value, node)=>{
        node.textContent = value;
      });
      __UTP_TEXT_BACKUP__ = new WeakMap();
    }
  });

  // Clean page
  addBtn("🧼 Clean Page", "#fa0", ()=>{
    html.classList.add("ut-snap","ut-img");
    snap=img=true;

    // Hide text safely
    txt = true;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node){
          if (p.contains(node.parentNode)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      if (!__UTP_TEXT_BACKUP__.has(node)) {
        __UTP_TEXT_BACKUP__.set(node, node.textContent);
        node.textContent = node.textContent.replace(/\S/g, "•");
      }
    }
  });

  // Restore everything
  addBtn("🔧 Restore All", "#0f9", ()=>{
    html.classList.remove("ut-dark","ut-snap","ut-img");
    html.style.filter="";
    dark=snap=img=false;
    hue=0;

    __UTP_TEXT_BACKUP__.forEach((value, node)=>{
      node.textContent = value;
    });
    __UTP_TEXT_BACKUP__ = new WeakMap();
    txt=false;
  });

  // Close panel
  addBtn("❌ Close", "#555", ()=>{
    p.remove();
    window.__UTP_LOADED__ = false;
  });

  /* -------------------------
     DRAGGABLE PANEL
  ------------------------- */
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

})();
