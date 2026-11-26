/* ============================================================
   TRẠM 30 — app.js
   ============================================================ */
const DAY_IDS = [...Array(30)].map((_, i) => "d" + (i + 1));
const M2_DAYS = [...Array(30)].map((_, i) => "d" + (i + 31));  // ngày 31–60
const M3_DAYS = [...Array(30)].map((_, i) => "d" + (i + 61));  // ngày 61–90
const LESSONS = ["home", "roadmap", "a01", "a02", "a03", "a04", "a05", "a06", "a07", "a08", "a09", "a10", "a11", "a12", "portfolio", "settings", "start", "rules", "words", "k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14", "d15", "d16", "d17", "d18", "d19", "d20", "d21", "d22", "d23", "d24", "d25", "d26", "d27", "d28", "d29", "d30", "done", "m2", "m2start", "d31", "d32", "d33", "d34", "d35", "d36", "d37", "d38", "d39", "d40", "d41", "d42", "d43", "d44", "d45", "d46", "d47", "d48", "d49", "d50", "d51", "d52", "d53", "d54", "d55", "d56", "d57", "d58", "d59", "d60", "m2done", "m3start", "d61", "d62", "d63", "d64", "d65", "d66", "d67", "d68", "d69", "d70", "d71", "d72", "d73", "d74", "d75", "d76", "d77", "d78", "d79", "d80", "d81", "d82", "d83", "d84", "d85", "d86", "d87", "d88", "d89", "d90", "mapall", "m46", "w13", "w14", "w15", "w16", "w17", "w18", "w19", "w20", "w21", "w22", "w23", "w24", "ph2", "m7", "m8", "m9", "m10", "m11", "m12", "m1314", "ph3", "q15", "q18", "q21", "q24", "ph4", "map", "tcards", "tquiz", "tjournal", "ttimer", "treview", "tskill", "tsurvey", "tscope", "tprice", "thandover", "book", "stuck", "restart", "nguon"];
const TOTAL_DAYS = 30;      // tháng 1 — dùng cho đường ống và thanh tiến độ đầu
const TOTAL_ALL  = 90;      // toàn khoá — dùng cho nhật ký, đồng hồ, thống kê

/* ---------- Lưu trữ ---------- */
let STORAGE_OK = true;
const memoryStore = new Map();
function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
const DB = {
  get(k,d){ if(memoryStore.has(k)) return memoryStore.get(k); try{ const v=localStorage.getItem("t30."+k); return v ? JSON.parse(v) : d; }catch(e){ STORAGE_OK=false; return d;} },
  set(k, v){
    memoryStore.set(k, v);
    try{ localStorage.setItem("t30."+k, JSON.stringify(v)); }
    catch(e){ STORAGE_OK = false; if(typeof showStorageAlarm === "function") showStorageAlarm(); }
  },
  del(k){ memoryStore.delete(k); try{ localStorage.removeItem("t30."+k); }catch(e){} },
};
// Dữ liệu cũ có thể hỏng hoặc sai kiểu (file dự phòng lỗi, người dùng sửa tay,
// bản cũ của app). Ép về đúng kiểu, hỏng thì bỏ — thà mất tiến độ còn hơn app không mở được.
function asArray(v){ return Array.isArray(v) ? v : []; }
function asObject(v){ return (v && typeof v === "object" && !Array.isArray(v)) ? v : {}; }
function asDayIds(v){ return asArray(v).filter(x => typeof x === "string" && /^[a-z0-9]{1,8}$/i.test(x)); }
function asBoolArray(v){ return asArray(v).map(x => !!x); }
function cleanCards(v){const o={}; for(const [k,r] of Object.entries(asObject(v))) if(!["__proto__","constructor","prototype"].includes(k) && r && Number.isInteger(r.b) && r.b>=0 && r.b<=2) o[k]={b:r.b,n:Math.max(0,Number(r.n)||0)};return o;}
function asJournal(v){
  const o = asObject(v), out = {};
  Object.keys(o).forEach(k => {
    const n = parseInt(k, 10);
    if(!(n >= 1 && n <= 90)) return;
    const r = asObject(o[k]);
    const m = parseInt(r.m, 10);
    out[n] = { m: (m > 0 && m <= 1440) ? m : 0, n: typeof r.n === "string" ? r.n.slice(0, 500) : "" };
  });
  return out;
}
let DONE = new Set(asDayIds(DB.get("done", [])));
let JOURNAL = asJournal(DB.get("journal", {}));
let CARDS = cleanCards(DB.get("cards", {}));
let MINE = asArray(DB.get("mine", [])).filter(c => c && typeof c.f === "string" && typeof c.b === "string");
let REVIEW = asBoolArray(DB.get("review", []));

/* ---------- Cảnh báo khi không lưu được ---------- */
function showStorageAlarm(){
  const bar = document.getElementById("stoBar");
  if(!bar || bar.classList.contains("on")) return;
  bar.classList.add("on");
}
(function(){
  const bar = document.getElementById("stoBar");
  if(!bar) return;
  if(!STORAGE_OK) showStorageAlarm();
  bar.querySelector(".sto-x").addEventListener("click", () => bar.classList.remove("on"));
  bar.querySelector(".sto-go").addEventListener("click", () => { bar.classList.remove("on"); showLesson("tjournal"); });
})();

/* ---------- Toast ---------- */
let toastEl;
function toast(msg){
  if(!toastEl){ toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

/* ============================================================
   ĐIỀU HƯỚNG
   ============================================================ */
const sidebar = document.getElementById("sidebar");
const scrim   = document.getElementById("scrim");
const menuButton=document.getElementById("menuBtn");
function setMenu(open){sidebar.classList.toggle("open",open);scrim.classList.toggle("show",open);menuButton.setAttribute("aria-expanded",String(open));}
menuButton.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
scrim.addEventListener("click", () => {setMenu(false);menuButton.focus();});
document.addEventListener("keydown", e=>{if(e.key==="Escape"&&sidebar.classList.contains("open")){setMenu(false);menuButton.focus();}});

function showLesson(id, push){
  if(!LESSONS.includes(id)) id = "home";
  document.querySelectorAll(".lesson").forEach(s => s.classList.toggle("show", s.id === id));
  document.querySelectorAll(".lesson-link").forEach(b => {const active=b.dataset.goto===id;b.classList.toggle("active",active);if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  const i = LESSONS.indexOf(id);
  document.getElementById("btnPrev").disabled = i <= 0;
  document.getElementById("btnNext").disabled = i >= LESSONS.length - 1;
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  if(push !== false) history.replaceState(null, "", "#" + id);
  setMenu(false);
  const act = document.querySelector(".lesson-link.active");
  if(typeof window.__navSync === "function") window.__navSync(id);
  if(act && act.scrollIntoView) { try{ act.scrollIntoView({ block: "nearest" }); }catch(e){} }
  if(typeof clearHighlight === "function") clearHighlight();
  if(id === "tjournal") renderJournal();
  if(id === "tcards")   renderCards();
  if(id === "treview")  renderReview();
  if(id === "m2")       renderM2();
  if(id === "m2start" && typeof paintPipeM2 === "function") paintPipeM2();
  if(id === "m3start" && typeof paintPipeM3 === "function") paintPipeM3();
  if(id === "tquiz")    rqStats();
  if(id === "done")     renderDone();
  if(id === "m2done")   renderM2Done();
  if(id === "m3start")  renderM3();
  if(id === "mapall")   renderMap();
  if(id === "tprice")   renderPrice();
  if(id === "tskill")   renderSkill();
  if(typeof window.aimRender === "function") window.aimRender(id);
}
document.querySelectorAll(".lesson-link").forEach(b => b.addEventListener("click", () => showLesson(b.dataset.goto)));
document.getElementById("btnPrev").addEventListener("click", () => showLesson(LESSONS[LESSONS.indexOf(current()) - 1]));
document.getElementById("btnNext").addEventListener("click", () => showLesson(LESSONS[LESSONS.indexOf(current()) + 1]));
function current(){ const s = document.querySelector(".lesson.show"); return s ? s.id : "start"; }
document.addEventListener("click", e => {
  const j = e.target.closest("[data-jump]");
  if(j){showLesson(j.dataset.jump);if(j.hasAttribute("data-catalog")) document.getElementById("legacyCatalog")?.scrollIntoView({block:"start"});}
});

/* ============================================================
   TIẾN ĐỘ
   ============================================================ */
function markDone(id){
  if(!id || DONE.has(id)) return;
  DONE.add(id); DB.set("done", [...DONE]); paintProgress();
}
// Tự đánh dấu cho bài kiến thức nền (k1..k4). Với các NGÀY thì không —
// ngày chỉ được đánh dấu khi người học tự bấm nút ở cuối trang.
function markAuto(id){ if(id && !/^d\d+$/.test(id)) markDone(id); }
function unmarkDone(id){ DONE.delete(id); DB.set("done", [...DONE]); paintProgress(); }

function todayDay(){
  // "hôm nay" = ngày đầu tiên chưa hoàn thành
  for(let n = 1; n <= TOTAL_ALL; n++) if(!DONE.has("d" + n)) return n;
  return TOTAL_ALL;
}
function paintProgress(){
  document.querySelectorAll(".lesson-link").forEach(b => {
    b.classList.toggle("done", DONE.has(b.dataset.goto));
    b.classList.remove("today");
  });
  const t = document.querySelector('.lesson-link[data-goto="d' + todayDay() + '"]');
  if(t && !DONE.has(t.dataset.goto)) t.classList.add("today");

  const n = [...Array(TOTAL_ALL)].filter((_, i) => DONE.has("d" + (i + 1))).length;
  document.getElementById("sbVal").textContent = n + " / " + TOTAL_ALL + " ngày";
  document.getElementById("sbBar").style.width = (n / TOTAL_ALL * 100) + "%";
  paintPipe();
  if(typeof paintPipeM2 === "function") paintPipeM2();
  if(typeof paintPipeM3 === "function") paintPipeM3();
  document.querySelectorAll(".daydone").forEach(paintDayBtn);
  if(typeof paintResume === "function") paintResume();
  if(typeof checkBackup === "function") checkBackup();
  if(typeof renderDone === "function" && document.getElementById("done") && document.getElementById("done").classList.contains("show")) renderDone();
}

/* ---------- Đường ống 30 ngày ---------- */
function paintPipe(){
  const rail = document.getElementById("pipeMain");
  if(!rail) return;
  const now = todayDay();
  rail.innerHTML = "";
  for(let n = 1; n <= TOTAL_DAYS; n++){
    const done = DONE.has("d" + n);
    const b = document.createElement("button");
    b.className = "pnode" + (done ? " done" : "") + (!done && n === now ? " now" : "");
    b.textContent = n;
    b.title = "Ngày " + n + (LESSONS.includes("d"+n) ? "" : " — chưa có trong bản này");
    b.addEventListener("click", () => {
      if(LESSONS.includes("d" + n)) showLesson("d" + n);
      else toast("Ngày " + n + " sẽ có ở bản cập nhật tiếp theo");
    });
    rail.appendChild(b);
    if(n < TOTAL_DAYS){
      const w = document.createElement("i");
      w.className = "pwire" + (done ? " on" : "");
      rail.appendChild(w);
    }
  }
}

/* ---------- Đường ống tháng 2 ---------- */
function paintPipeM2(){
  const rail = document.getElementById("pipeM2");
  if(!rail) return;
  let now = 31;
  for(let n = 31; n <= 60; n++){ if(!DONE.has("d" + n)){ now = n; break; } now = 60; }
  rail.innerHTML = "";
  for(let n = 31; n <= 60; n++){
    const done = DONE.has("d" + n);
    const b = document.createElement("button");
    b.className = "pnode" + (done ? " done" : "") + (!done && n === now ? " now" : "");
    b.textContent = n; b.title = "Ngày " + n;
    b.addEventListener("click", () => {
      if(LESSONS.includes("d" + n)) showLesson("d" + n);
      else toast("Ngày " + n + " sẽ có ở bản cập nhật tiếp theo");
    });
    rail.appendChild(b);
    if(n < 60){ const w = document.createElement("i"); w.className = "pwire" + (done ? " on" : ""); rail.appendChild(w); }
  }
  // lời nhắc theo kết quả tự chấm tháng 1
  const gate = document.getElementById("m2sGate");
  if(gate){
    const d1 = [...Array(30)].filter((_, i) => DONE.has("d" + (i + 1))).length;
    const sc = REVIEW.filter(Boolean).length;
    if(d1 < 30){
      gate.innerHTML = '<div class="warn"><b>⚠️ Tháng 1 chưa xong.</b> Anh mới hoàn thành <b>' + d1 +
        '/30</b> ngày. Đọc trước trang này thì được, nhưng đừng bắt đầu Ngày 31 khi tháng 1 còn dở — ' +
        'tuần 5 dựa hoàn toàn vào kỹ năng của tháng 1.</div>';
    }else if(sc && sc < 7){
      gate.innerHTML = '<div class="warn"><b>⚠️ Tự chấm tháng 1 của anh là ' + sc + '/13.</b> ' +
        'Với mức này, <b>đừng làm đủ tháng 2</b>. Chỉ làm Tuần 5 và Tuần 6, bỏ hẳn Python và case study, ' +
        'kéo dài thành hai tháng. Ít mà đều thắng nhiều mà đứt.</div>';
    }else if(sc >= 11){
      gate.innerHTML = '<div class="chk"><b>✅ Tự chấm tháng 1 của anh là ' + sc + '/13 — nền tảng tốt.</b> ' +
        'Làm đủ bốn tuần theo đúng lộ trình. Giữ nguyên số giờ, đừng tăng.</div>';
    }else if(sc){
      gate.innerHTML = '<div class="note">💡 <b>Tự chấm tháng 1 của anh là ' + sc + '/13.</b> ' +
        'Làm đủ bốn tuần, nhưng nếu tuần 7 (Python) thấy quá tải thì hoãn nó sang tháng 3 — ' +
        'ưu tiên giữ nhịp hơn là chạy kịp lộ trình.</div>';
    }
  }
}

/* ---------- Đường ống tháng 3 ---------- */
function paintPipeM3(){
  const rail = document.getElementById("pipeM3");
  if(!rail) return;
  let now = 61;
  for(let n = 61; n <= 90; n++){ if(!DONE.has("d" + n)){ now = n; break; } now = 90; }
  rail.innerHTML = "";
  for(let n = 61; n <= 90; n++){
    const done = DONE.has("d" + n);
    const b = document.createElement("button");
    b.className = "pnode" + (done ? " done" : "") + (!done && n === now ? " now" : "");
    b.textContent = n; b.title = "Ngày " + n;
    b.addEventListener("click", () => showLesson("d" + n));
    rail.appendChild(b);
    if(n < 90){ const w = document.createElement("i"); w.className = "pwire" + (done ? " on" : ""); rail.appendChild(w); }
  }
}

/* ---------- Nút hoàn thành cuối mỗi ngày ---------- */
function paintDayBtn(box){
  const isWeek = !!box.dataset.id;                     // tháng 4 trở đi tính theo tuần
  const id = box.dataset.id || ("d" + box.dataset.day);
  const on = DONE.has(id);
  const unit = isWeek ? "tuần này" : "ngày " + box.dataset.day;
  box.innerHTML =
    '<div style="background:' + (on ? "var(--ok-soft)" : "#fff") + ';border:1px solid ' + (on ? "#C2E4D2" : "var(--line)") +
    ';border-radius:var(--radius);padding:16px 18px;margin:22px 0 0;display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
      '<div style="flex:1;min-width:180px">' +
        '<div style="font-weight:600;font-family:Lexend,sans-serif">' + (on ? "✓ Đã hoàn thành " + unit : "Xong hết việc của " + unit + " rồi?") + '</div>' +
        '<div style="font-size:13.5px;color:var(--muted)">' + (on ? "Bấm lần nữa nếu muốn bỏ đánh dấu." : (isWeek ? "Đánh dấu để theo dõi tiến độ giai đoạn một." : "Đánh dấu để đường ống sáng thêm một đốt.")) + '</div>' +
      '</div>' +
      '<button class="btn ' + (on ? "qz-retry" : "btn-run") + '" style="padding:10px 20px">' + (on ? "↺ Bỏ đánh dấu" : "✓ Đánh dấu hoàn thành") + '</button>' +
    '</div>';
  box.querySelector("button").onclick = () => {
    if(DONE.has(id)){ unmarkDone(id); }
    else{
      markDone(id);
      if(!STORAGE_OK) return;                     // đang không lưu được thì không báo thành công
      if(isWeek){ toast("Đã xong " + unit + " 🎉"); return; }
      const j = JOURNAL[box.dataset.day] || {};
      if(!j.m) toast("Đã xong ngày " + box.dataset.day + " — nhớ ghi số phút vào Nhật ký");
      else toast("Đã xong ngày " + box.dataset.day + " 🎉");
    }
  };
}

/* ============================================================
   QUIZ
   ============================================================ */
document.querySelectorAll(".quiz").forEach(q => {
  const items = [...q.querySelectorAll(".qz-item")];
  items.forEach(it => {
    const labels = [...it.querySelectorAll("label")];
    const name = "q" + Math.random().toString(36).slice(2, 9);
    labels.forEach(l => l.querySelector("input").name = name);
  });
  q.querySelector(".qz-grade").addEventListener("click", () => {
    let ok = 0;
    items.forEach(it => {
      const ans = parseInt(it.dataset.ans, 10);
      const labels = [...it.querySelectorAll("label")];
      labels.forEach(l => l.classList.remove("right", "wrong"));
      const picked = labels.findIndex(l => l.querySelector("input").checked);
      if(picked > -1){
        if(picked + 1 === ans){ labels[picked].classList.add("right"); ok++; }
        else{ labels[picked].classList.add("wrong"); labels[ans - 1].classList.add("right"); }
      }else{ labels[ans - 1].classList.add("right"); }
      it.querySelector(".qz-why").classList.add("show");
    });
    const s = q.querySelector(".qz-score");
    s.textContent = ok + " / " + items.length;
    s.style.color = ok >= Math.ceil(items.length * 0.65) ? "var(--ok)" : "var(--stop)";
    if(ok >= Math.ceil(items.length * 0.65)) markAuto(q.dataset.lesson);
  });
  q.querySelector(".qz-retry").addEventListener("click", () => {
    items.forEach(it => {
      it.querySelectorAll("label").forEach(l => l.classList.remove("right", "wrong"));
      it.querySelectorAll("input").forEach(i => i.checked = false);
      it.querySelector(".qz-why").classList.remove("show");
    });
    q.querySelector(".qz-score").textContent = "";
  });
});

/* ============================================================
   BỘ GIẢ LẬP NODE
   ============================================================ */
const NODE_DEF = {
  trigger:{ ic:"⏰", nm:"Lịch chạy",     trig:true,  run:()=>({items:1, note:"đến giờ rồi", data:[{"time":"07:00"}]}) },
  sheet:  { ic:"📋", nm:"Đọc bảng",      run:()=>({items:5, note:"đọc 5 dòng từ bảng đơn hàng",
             data:[{"mon":"Cà phê sữa","sl":2,"gia":35000},{"mon":"Trà đào","sl":1,"gia":45000},
                   {"mon":"Bánh mì","sl":3,"gia":25000},{"mon":"Trà sữa","sl":2,"gia":50000},
                   {"mon":"Nước suối","sl":5,"gia":15000}] }) },
  filter: { ic:"🔍", nm:"Lọc",           run:(inp)=>{ const d=(inp.data||[]).filter(r=>(r.gia||0)>=30000);
             return {items:d.length, note:"giữ lại dòng có giá ≥ 30.000", data:d}; } },
  calc:   { ic:"🧮", nm:"Tính thêm cột", run:(inp)=>{ const d=(inp.data||[]).map(r=>Object.assign({},r,{thanh_tien:(r.sl||0)*(r.gia||0)}));
             return {items:d.length, note:"thêm cột thanh_tien", data:d}; } },
  mail:   { ic:"✉️", nm:"Gửi email",     run:(inp)=>({items:inp.items, note:"gửi "+inp.items+" email", data:inp.data}) },
};
document.querySelectorAll(".nodesim").forEach(sim => {
  const canvas = sim.querySelector(".ns-canvas");
  const out    = sim.querySelector(".ns-out");
  let chain = [], sel = -1;

  function draw(){
    canvas.innerHTML = "";
    if(!chain.length){ canvas.innerHTML = '<div class="ns-empty">Bảng trống — bấm nút bên dưới để thêm node đầu tiên</div>'; return; }
    chain.forEach((n, i) => {
      const d = NODE_DEF[n.type];
      const el = document.createElement("div");
      el.className = "nsn" + (d.trig ? " trig" : "") + (n.res ? " ran" : "") + (i === sel ? " sel" : "");
      el.innerHTML = '<div class="ic">' + d.ic + '</div><div class="nm">' + d.nm + '</div>' +
                     '<div class="ct">' + (n.res ? n.res.items + " items" : "chưa chạy") + '</div>' +
                     '<button class="x" title="Bỏ node này">×</button>';
      el.addEventListener("click", e => { if(e.target.classList.contains("x")) return; sel = i; draw(); showOut(); });
      el.querySelector(".x").addEventListener("click", e => { e.stopPropagation(); chain.splice(i, 1); sel = -1; reset(); });
      canvas.appendChild(el);
      if(i < chain.length - 1){
        const w = document.createElement("i");
        w.className = "nswire" + (n.res ? " on" : "");
        canvas.appendChild(w);
      }
    });
  }
  function reset(){ chain.forEach(n => n.res = null); draw(); out.innerHTML = ""; }
  function showOut(){
    if(sel < 0 || !chain[sel]) return;
    const n = chain[sel], d = NODE_DEF[n.type];
    if(!n.res){ out.innerHTML = '<span class="dim">Node "' + d.nm + '" chưa chạy. Bấm ▶ Chạy thử trước.</span>'; return; }
    out.innerHTML = '<span class="dim">// đầu ra của node: ' + d.nm + ' — ' + n.res.note + '</span>\n' +
                    '<b>' + n.res.items + ' items</b>\n' +
                    JSON.stringify(n.res.data, null, 2);
  }

  sim.querySelectorAll(".ns-add").forEach(b => b.addEventListener("click", () => {
    const t = b.dataset.node;
    if(NODE_DEF[t].trig && chain.some(n => NODE_DEF[n.type].trig)){ toast("Một quy trình chỉ cần một node khởi động"); return; }
    if(!NODE_DEF[t].trig && !chain.length){ toast("Hãy thêm ⏰ Lịch chạy trước — quy trình cần biết khi nào chạy"); return; }
    chain.push({ type:t, res:null }); sel = chain.length - 1; reset(); draw();
  }));
  sim.querySelector(".ns-clear").addEventListener("click", () => { chain = []; sel = -1; reset(); });

  sim.querySelector(".ns-run").addEventListener("click", () => {
    if(!chain.length){ out.innerHTML = '<span class="warnx">⚠ Bảng đang trống. Thêm node trước đã.</span>'; return; }
    if(!NODE_DEF[chain[0].type].trig){
      out.innerHTML = '<span class="warnx">⚠ Không chạy được: node đầu tiên phải là một trigger (⏰ Lịch chạy).</span>\n' +
                      '<span class="dim">Không có trigger thì quy trình không biết KHI NÀO cần chạy.</span>';
      return;
    }
    let prev = { items:0, data:[] }, log = "";
    chain.forEach((n, i) => {
      const d = NODE_DEF[n.type];
      n.res = d.run(prev);
      log += (i + 1) + ". " + d.ic + " " + d.nm.padEnd(16, " ") + "→ " + String(n.res.items).padStart(2, " ") + " items   " +
             '<span class="dim">(' + n.res.note + ')</span>\n';
      prev = n.res;
    });
    const last = chain[chain.length - 1];
    log += '\n<span class="dim">// Chạy xong. Bấm vào một node bất kỳ để xem dữ liệu bên trong nó.</span>';
    if(last.type === "mail" && last.res.items > 1)
      log += '\n<span class="warnx">⚠ Node cuối gửi ' + last.res.items + ' email. Trên hệ thống thật, đây là ' + last.res.items + ' email thật gửi đi.</span>';
    out.innerHTML = log;
    sel = -1; draw();
    markAuto(sim.dataset.lesson);
  });
  draw();
});

/* ============================================================
   THẺ GHI NHỚ
   ============================================================ */
const DECKS = {
  n8n: [
    ["workflow","Một quy trình tự động hoàn chỉnh","Cả dây chuyền sản xuất"],
    ["node","Một bước trong quy trình","Một cái máy trong dây chuyền"],
    ["trigger","Bước đầu tiên, thứ khởi động quy trình","Nút bấm khởi động"],
    ["connection","Đường nối giữa hai node","Băng chuyền nối hai máy"],
    ["execution","Một lần workflow chạy","Một ca sản xuất"],
    ["credential","Thông tin đăng nhập để n8n vào Gmail, Sheet…","Chìa khoá — không bao giờ chụp màn hình phần này"],
    ["canvas","Màn hình trắng để kéo thả các node","Bàn làm việc"],
    ["item","Một dòng dữ liệu chạy qua node","Một sản phẩm trên băng chuyền"],
    ["expression","Công thức nhỏ lấy dữ liệu từ node trước, viết trong {{ }}","Công thức tham chiếu ô trong Excel"],
    ["webhook","Địa chỉ để hệ thống khác gửi dữ liệu vào","Hòm thư nhận hàng"],
    ["active / inactive","Trạng thái bật hay tắt tự động chạy","Công tắc điện của cả dây chuyền"],
    ["template","Workflow mẫu có sẵn để dùng lại","Bản vẽ có sẵn"],
    ["pin data","Ghim tạm dữ liệu để test mà không gọi lại nguồn thật","Đóng băng mẫu thử"],
    ["sub-workflow","Workflow con được workflow khác gọi vào","Dây chuyền phụ"],
  ],
  auto: [
    ["automation","Bảo máy làm thay chuỗi thao tác lặp lại theo quy tắc cố định",""],
    ["API","Cách hai phần mềm nói chuyện với nhau","Cửa sổ giao dịch giữa hai toà nhà"],
    ["JSON","Định dạng dữ liệu dạng { khoá: giá trị }","Cách viết địa chỉ chuẩn để máy đọc"],
    ["GET","Lệnh xin dữ liệu về","Hỏi mượn"],
    ["POST","Lệnh gửi dữ liệu đi","Nộp đơn"],
    ["API key","Chìa khoá riêng để dùng dịch vụ — tuyệt đối không công khai",""],
    ["endpoint","Địa chỉ cụ thể của một chức năng API","Số phòng trong toà nhà"],
    ["rate limit","Giới hạn số lần gọi API trong một khoảng thời gian","Mỗi ngày chỉ được hỏi 100 câu"],
    ["schedule / cron","Hẹn giờ chạy tự động","Đồng hồ hẹn giờ"],
    ["payload","Phần dữ liệu thật gửi kèm trong một lần gọi","Hàng bên trong kiện hàng"],
    ["parse","Bóc tách dữ liệu thô ra thành phần dùng được","Mở kiện hàng lấy đúng món cần"],
    ["log","Bản ghi lại những gì đã chạy","Sổ nhật ký máy"],
    ["debug","Tìm và sửa lỗi","Soi vào ruột máy xem hỏng chỗ nào"],
    ["deploy","Đưa lên chạy thật","Xuất xưởng"],
  ],
  ai: [
    ["prompt","Câu lệnh mình đưa cho AI",""],
    ["system prompt","Lời dặn nền đặt trước, quy định AI đóng vai gì","Bản mô tả công việc"],
    ["token","Đơn vị nhỏ AI dùng để đếm chữ — tính tiền theo đây",""],
    ["context window","Giới hạn token đầu vào và đầu ra mà mô hình xử lý trong ngữ cảnh, tùy mô hình","Sức chứa của bàn làm việc"],
    ["temperature","Mức ngẫu nhiên trong câu trả lời — thấp thì đều, cao thì bay","Núm chỉnh độ sáng tạo"],
    ["structured output","Bắt AI trả lời theo khuôn cố định, thường là JSON","Bắt điền vào biểu mẫu"],
    ["hallucination","AI bịa ra thông tin nghe rất thuyết phục nhưng sai","Không đồng nghĩa với cố ý nói dối"],
    ["eval","Cách chấm điểm chất lượng đầu ra của AI một cách có hệ thống","Bảng chấm thi — thứ phân biệt người có nghề"],
    ["agent","AI tự chọn công cụ và làm nhiều bước để đạt mục tiêu","Nhân viên tự xoay xở"],
    ["RAG","Cho AI tra tài liệu của mình trước khi trả lời","Cho phép mở sách khi thi"],
    ["fine-tune","Huấn luyện lại mô hình bằng dữ liệu riêng","Đào tạo nội bộ"],
    ["few-shot","Đưa vài ví dụ mẫu trong prompt để AI bắt chước","Làm mẫu cho xem"],
  ],
  mkt: [
    ["funnel","Phễu — hành trình từ người lạ tới khách hàng",""],
    ["lead","Người đã để lại thông tin, có thể thành khách","Khách tiềm năng"],
    ["conversion","Hành động mục tiêu đã định nghĩa (ví dụ đăng ký hoặc mua hàng)",""],
    ["CTA","Call to action — lời kêu gọi hành động","Nút Mua ngay"],
    ["CRM","Phần mềm quản lý quan hệ khách hàng","Sổ khách hàng điện tử"],
    ["inbound","Kéo khách tới bằng nội dung có ích, thay vì đi chào mời",""],
    ["nurturing","Nuôi dưỡng khách tiềm năng bằng chuỗi nội dung theo thời gian",""],
    ["segmentation","Chia khách thành nhóm để gửi nội dung phù hợp",""],
    ["churn","Tỷ lệ khách bỏ đi",""],
    ["CAC","Chi phí để có một khách hàng mới",""],
    ["LTV","Giá trị ước tính của khách trong thời gian quan hệ; nêu rõ dùng doanh thu hay biên đóng góp",""],
    ["attribution","Phân bổ công lao chuyển đổi theo quy tắc hoặc mô hình; không chứng minh nhân quả","Ai là người ghi bàn"],
  ],
};
let curDeck = "n8n", queue = [], curCard = null, flipped = false;

function deckCards(d){
  if(d === "mine") return MINE.map((c, i) => ["mine#" + i, c.f, c.b, ""]);
  return (DECKS[d] || []).map((c, i) => [d + "#" + i, c[0], c[1], c[2] || ""]);
}
function bucket(id){ return (CARDS[id] && CARDS[id].b) || 0; }
function buildQueue(){
  const all = deckCards(curDeck);
  queue = all.slice().sort((a, b) => bucket(a[0]) - bucket(b[0]));
  next();
}
function next(){
  const F = document.getElementById("fcFront"), B = document.getElementById("fcBack");
  const R = document.getElementById("fcRate"), H = document.getElementById("fcHint");
  if(!queue.length){
    curCard = null; F.textContent = "🎉 Xong bộ này";
    H.textContent = curDeck === "mine" && !MINE.length ? "Bộ này chưa có thẻ nào — thêm ở dưới" : "Quay lại buổi sau để ôn tiếp";
    B.classList.remove("show"); R.style.display = "none";
  }else{
    curCard = queue.shift(); flipped = false;
    F.textContent = curCard[1]; H.textContent = "bấm vào thẻ để lật";
    document.getElementById("fcMean").textContent = curCard[2];
    document.getElementById("fcEx").textContent = curCard[3];
    B.classList.remove("show"); R.style.display = "none";
  }
  document.getElementById("fcCount").textContent = "Còn " + queue.length + " thẻ trong lượt này";
  paintCardStats();
}
function paintCardStats(){
  const all = deckCards(curDeck);
  const c = [0, 0, 0];
  all.forEach(x => c[bucket(x[0])]++);
  document.getElementById("fcNew").textContent = c[0];
  document.getElementById("fcLearn").textContent = c[1];
  document.getElementById("fcDone").textContent = c[2];
}
function renderCards(){ buildQueue(); renderMine(); }

document.getElementById("fcStage").addEventListener("click", () => {
  if(!curCard || flipped) return;
  flipped = true;
  document.getElementById("fcBack").classList.add("show");
  document.getElementById("fcHint").textContent = "bạn nhớ tới mức nào?";
  document.getElementById("fcRate").style.display = "flex";
});
document.querySelectorAll("#fcRate .fc-btn").forEach(b => b.addEventListener("click", () => {
  if(!curCard) return;
  const r = parseInt(b.dataset.rate, 10), id = curCard[0];
  CARDS[id] = CARDS[id] || { b:0, n:0 };
  CARDS[id].n++;
  if(r === 0){ CARDS[id].b = 0; queue.splice(Math.min(2, queue.length), 0, curCard); }
  else if(r === 1){ CARDS[id].b = 1; queue.splice(Math.min(6, queue.length), 0, curCard); }
  else{ CARDS[id].b = 2; }
  DB.set("cards", CARDS);
  next();
}));
document.querySelectorAll(".tm-btn.deck").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".tm-btn.deck").forEach(x => x.classList.remove("on"));
  b.classList.add("on"); curDeck = b.dataset.deck; buildQueue();
}));
document.getElementById("fcReset").addEventListener("click", () => {
  deckCards(curDeck).forEach(c => delete CARDS[c[0]]);
  DB.set("cards", CARDS); buildQueue(); toast("Đã đặt lại bộ thẻ này");
});
document.getElementById("ncAdd").addEventListener("click", () => {
  const f = document.getElementById("ncFront").value.trim();
  const b = document.getElementById("ncBack").value.trim();
  if(!f || !b){ toast("Điền cả từ tiếng Anh lẫn nghĩa tiếng Việt"); return; }
  MINE.push({ f, b }); DB.set("mine", MINE);
  document.getElementById("ncFront").value = ""; document.getElementById("ncBack").value = "";
  renderMine(); if(curDeck === "mine") buildQueue();
  toast("Đã thêm thẻ vào bộ Của tôi");
});
function renderMine(){
  const el = document.getElementById("ncList");
  if(!MINE.length){ el.innerHTML = "<i>Chưa có thẻ nào. Gặp từ mới khi đọc tài liệu thì thêm ngay tại đây.</i>"; return; }
  el.innerHTML = "<b>" + MINE.length + " thẻ:</b> " + MINE.map((c, i) =>
    '<span style="display:inline-block;background:#EEF4F8;border-radius:99px;padding:2px 8px 2px 11px;margin:3px 4px 0 0">' +
    escapeHTML(c.f) + ' <button data-del="' + i + '" style="border:none;background:none;cursor:pointer;color:#9AA;font-size:13px">×</button></span>').join("");
  el.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
    const idx=parseInt(b.dataset.del,10); MINE.splice(idx,1);
    const shifted={}; for(const [k,v] of Object.entries(CARDS)){const m=/^mine#(\d+)$/.exec(k);if(!m)shifted[k]=v;else if(+m[1]!==idx)shifted['mine#'+(+m[1]-(+m[1]>idx?1:0))]=v;} CARDS=shifted;DB.set("cards",CARDS); DB.set("mine", MINE); renderMine(); if(curDeck === "mine") buildQueue();
  }));
}

/* ============================================================
   NHẬT KÝ
   ============================================================ */
let jrMonth = 1;   // 1 = ngày 1–30, 2 = ngày 31–60, 0 = tất cả
function renderJournal(){
  const tb = document.querySelector("#jrTable tbody");
  const tabs = document.getElementById("jrTabs");
  if(tabs && !tabs.dataset.on){
    tabs.dataset.on = "1";
    tabs.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      jrMonth = parseInt(b.dataset.m, 10);
      tabs.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
      renderJournal();
    }));
  }
  if(tabs) tabs.querySelectorAll("button").forEach(b => b.classList.toggle("on", parseInt(b.dataset.m,10) === jrMonth));
  const from = jrMonth === 3 ? 61 : jrMonth === 2 ? 31 : 1;
  const to   = jrMonth === 1 ? 30 : jrMonth === 2 ? 60 : 90;
  tb.innerHTML = "";
  for(let n = from; n <= to; n++){
    const j = JOURNAL[n] || {};
    const tr = document.createElement("tr");
    if(j.m) tr.className = "filled";
    tr.innerHTML =
      '<td class="jr-day">' + n + '</td>' +
      '<td><input type="number" min="0" max="600" value="' + (j.m || "") + '" data-d="' + n + '" data-f="m" aria-label="Số phút học ngày ' + n + '"></td>' +
      '<td><input type="text" value="' + escapeHTML(j.n || "") + '" data-d="' + n + '" data-f="n" placeholder="đã làm gì, tắc ở đâu…"></td>' +
      '<td style="text-align:center">' + (DONE.has("d" + n) ? "✓" : "") + '</td>';
    tb.appendChild(tr);
  }
  tb.querySelectorAll("input").forEach(i => i.addEventListener("change", () => {
    const d = i.dataset.d;
    JOURNAL[d] = JOURNAL[d] || {};
    JOURNAL[d][i.dataset.f] = i.dataset.f === "m" ? Math.min(1440, Math.max(0, parseInt(i.value, 10) || 0)) : i.value.slice(0, 500);
    DB.set("journal", JOURNAL); renderJournal();
  }));
  paintJournalStats(); paintChart();
}
function paintJournalStats(){
  let days = 0, mins = 0, streak = 0, best = 0;
  for(let n = 1; n <= TOTAL_ALL; n++){
    const m = (JOURNAL[n] || {}).m || 0;
    if(m > 0){ days++; mins += m; streak++; best = Math.max(best, streak); }
    else if(JOURNAL[n]) streak = 0;
  }
  let cur = 0;
  for(let n = TOTAL_ALL; n >= 1; n--){
    const m = (JOURNAL[n] || {}).m || 0;
    if(m > 0) cur++;
    else if(cur > 0) break;
  }
  document.getElementById("jrDays").textContent = days;
  document.getElementById("jrHours").textContent = (mins / 60).toFixed(1) + "h";
  document.getElementById("jrStreak").textContent = best;
  document.getElementById("jrAvg").textContent = days ? Math.round(mins / days) : 0;
}
function paintChart(){
  const W = TOTAL_ALL, gap = 3, bw = 12, H = 130;
  const max = Math.max(60, ...Object.values(JOURNAL).map(j => j.m || 0));
  let svg = '<svg width="' + (W * (bw + gap)) + '" height="' + (H + 26) + '" role="img" aria-label="Biểu đồ phút học mỗi ngày">';
  svg += '<line x1="0" y1="' + H + '" x2="' + (W * (bw + gap)) + '" y2="' + H + '" stroke="#DBE3E9"/>';
  for(let n = 1; n <= W; n++){
    const m = (JOURNAL[n] || {}).m || 0;
    const h = Math.round(m / max * (H - 8));
    const x = (n - 1) * (bw + gap);
    if(m > 0){
      svg += '<rect x="' + x + '" y="' + (H - h) + '" width="' + bw + '" height="' + h + '" rx="3" fill="' + (m >= 45 ? "#12A594" : "#8ACFC6") + '"><title>Ngày ' + n + ': ' + m + ' phút</title></rect>';
    }else{
      svg += '<rect x="' + x + '" y="' + (H - 3) + '" width="' + bw + '" height="3" rx="1.5" fill="#DBE3E9"><title>Ngày ' + n + ': chưa ghi</title></rect>';
    }
    if(n % 10 === 0 || n === 1)
      svg += '<text x="' + (x + bw / 2) + '" y="' + (H + 18) + '" text-anchor="middle" font-size="10.5" fill="#8899A8" font-family="IBM Plex Mono">' + n + '</text>';
  }
  svg += "</svg>";
  document.getElementById("jrChart").innerHTML = svg;
}
/* ============================================================
   ĐỒNG HỒ
   ============================================================ */
let tmTotal = 45 * 60, tmLeft = tmTotal, tmRun = null, tmDone = 0, tmEnd = 0;
const tmFace = document.getElementById("tmFace");
function tmPaint(){
  const m = Math.floor(tmLeft / 60), s = tmLeft % 60;
  tmFace.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  tmFace.classList.toggle("run", !!tmRun);
  document.getElementById("tmMins").textContent = tmDone || Math.round((tmTotal - tmLeft) / 60);
}
document.querySelectorAll(".tm-btn.preset").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".tm-btn.preset").forEach(x => x.classList.remove("on"));
  b.classList.add("on");
  clearInterval(tmRun); tmRun = null;
  tmTotal = parseInt(b.dataset.min, 10) * 60; tmLeft = tmTotal; tmDone=0;
  document.getElementById("tmGo").textContent = "▶ Bắt đầu"; tmPaint();
}));
document.getElementById("tmGo").addEventListener("click", () => {
  const btn = document.getElementById("tmGo");
  if(tmRun){ tmLeft = Math.max(0, Math.ceil((tmEnd-Date.now())/1000)); clearInterval(tmRun); tmRun = null; btn.textContent = "▶ Tiếp tục"; tmPaint(); return; }
  if(tmLeft<=0){tmLeft=tmTotal;tmDone=0;}
  tmEnd=Date.now()+tmLeft*1000;
  btn.textContent = "⏸ Tạm dừng";
  tmRun = setInterval(() => {
    tmLeft = Math.max(0, Math.ceil((tmEnd - Date.now()) / 1000));
    if(tmLeft <= 0){
      clearInterval(tmRun); tmRun = null; tmLeft = 0;
      tmDone = Math.round(tmTotal / 60);
      btn.textContent = "▶ Bắt đầu";
      toast("Hết giờ. Dừng lại đi — nguyên tắc số 2.");
    }
    tmPaint();
  }, 1000);
  tmPaint();
});
document.getElementById("tmReset").addEventListener("click", () => {
  clearInterval(tmRun); tmRun = null; tmLeft = tmTotal; tmDone = 0;
  document.getElementById("tmGo").textContent = "▶ Bắt đầu"; tmPaint();
});
(() => {
  const sel = document.getElementById("tmDay");
  for(let n = 1; n <= TOTAL_ALL; n++) sel.innerHTML += '<option value="' + n + '">Ngày ' + n + '</option>';
  sel.value = todayDay();
})();
document.getElementById("tmSave").addEventListener("click", () => {
  if(tmRun) tmLeft=Math.max(0,Math.ceil((tmEnd-Date.now())/1000));
  const mins = tmDone || Math.round((tmTotal - tmLeft) / 60);
  if(mins <= 0){ toast("Chưa học phút nào — bấm Bắt đầu trước đã"); return; }
  const d = document.getElementById("tmDay").value;
  JOURNAL[d] = JOURNAL[d] || {};
  JOURNAL[d].m = Math.min(1440,(JOURNAL[d].m || 0) + mins);
  clearInterval(tmRun);tmRun=null;document.getElementById("tmGo").textContent="▶ Bắt đầu";
  DB.set("journal", JOURNAL);
  tmDone = 0; tmLeft = tmTotal; tmPaint();
  toast("Đã cộng " + mins + " phút vào ngày " + d);
});
tmPaint();

/* ============================================================
   TỰ CHẤM CUỐI THÁNG
   ============================================================ */
const SR = [
  ["Số ngày thực học trong tháng", "đạt nếu ≥ 24/30 ngày"],
  ["Tổng số giờ thực tế", "đạt nếu ≥ 22 giờ"],
  ["Đọc một trang tài liệu mới mà không dịch cả trang", "đạt / không đạt"],
  ["Số thẻ ghi nhớ đã chuyển sang mức Thuộc rồi", "đạt nếu ≥ 45 thẻ"],
  ["Số workflow n8n chạy được", "đạt nếu = 3"],
  ["Có workflow tự chạy theo lịch, không cần bấm", "đạt / không đạt"],
  ["Workflow có gọi AI", "đạt / không đạt"],
  ["Bảng chấm 10 kết quả AI, có ghi lý do", "đạt / không đạt"],
  ["Chứng chỉ HubSpot Inbound Marketing", "đạt / không đạt"],
  ["Số bài SQL đã học trên web PyKhởiĐầu", "đạt nếu ≥ 8 bài"],
  ["Trang GitHub công khai có mô tả tiếng Anh", "đạt / không đạt"],
  ["Bài viết tiếng Anh đã đăng LinkedIn", "đạt / không đạt"],
  ["Hứng thú hiện tại vẫn bằng hoặc hơn ngày 1", "tự cảm nhận"],
];
function renderReview(){
  const el = document.getElementById("srList");
  el.innerHTML = SR.map((s, i) =>
    '<label class="sr-item"><input type="checkbox" data-i="' + i + '"' + (REVIEW[i] ? " checked" : "") + '>' +
    '<span class="txt"><b>' + s[0] + '</b><br><span class="std">' + s[1] + '</span></span></label>').join("");
  el.querySelectorAll("input").forEach(c => c.addEventListener("change", () => {
    REVIEW[parseInt(c.dataset.i, 10)] = c.checked; DB.set("review", REVIEW); paintVerdict();
  }));
  paintVerdict();
}
function paintVerdict(){
  const n = REVIEW.filter(Boolean).length;
  document.getElementById("srScore").textContent = n + " / 13";
  let cls = "warn", txt = "";
  if(n >= 11){ cls = "chk"; txt = "<b>Nền tảng tốt hơn mong đợi.</b> Tháng 2 tăng độ khó: bắt đầu học Python cơ bản song song, giữ nguyên nhịp học hiện tại."; }
  else if(n >= 7){ cls = "note"; txt = "<b>Bình thường và hoàn toàn chấp nhận được.</b> Tháng 2 lặp lại mô hình này, dồn thêm vào hai hạng mục yếu nhất. Chưa vội học thêm thứ mới."; }
  else if(n >= 4){ cls = "warn"; txt = "<b>Vấn đề nằm ở hệ thống, không phải năng lực.</b> Kiểm tra lại: giờ học đã cố định trong ngày chưa? Tháng 2 cắt bớt, chỉ giữ n8n và tiếng Anh."; }
  else{ cls = "warn"; txt = "<b>Tín hiệu trung thực cần lắng nghe.</b> Hoặc 5–10 giờ mỗi tuần không khả thi với lịch hiện tại, hoặc hướng này không hợp. Biết bây giờ vẫn tốt hơn biết sau hai năm."; }
  document.getElementById("srVerdict").innerHTML = '<div class="' + cls + '">' + txt + '</div>';
}

/* ============================================================
   PYODIDE (dành cho các bài code ở phần sau)
   ============================================================ */
document.querySelectorAll(".runner").forEach(r=>{
 const ta=r.querySelector("textarea.code"), out=r.querySelector("pre.out"), btn=r.querySelector(".btn-run"), orig=ta.value;
 let worker=null, timer=null;
 function stop(){if(worker)worker.terminate();worker=null;clearTimeout(timer);btn.disabled=false;}
 function run(){if(worker)return; if(!navigator.onLine){out.textContent="Cần kết nối mạng để tải Python.";out.classList.add("has");return;}
 out.classList.add("has");out.textContent="Đang tải Python trong môi trường riêng…";btn.disabled=true;
 try{worker=new Worker("js/python-worker.js?v=2.7.0");}catch(e){out.textContent="Trình duyệt không hỗ trợ worker: "+e.message;stop();return;}
 timer=setTimeout(()=>{out.textContent+="\nĐã dừng vì quá thời gian.";stop();},120000);
 worker.onmessage=e=>{const d=e.data;if(d.type==="ready"){out.textContent="";clearTimeout(timer);timer=setTimeout(()=>{out.textContent+="\nĐã dừng vì quá thời gian.";stop();},30000);}
 else if(d.type==="out"){if(out.textContent.length<30000)out.textContent+=d.text+"\n";}
 else if(d.type==="done"){if(!out.textContent.trim())out.textContent="Chạy xong (không có nội dung in).";stop();markAuto(r.dataset.lesson);}
 else if(d.type==="error"){out.textContent+="\n"+d.text;stop();}};
 worker.onerror=e=>{out.textContent="Không chạy được Python: "+e.message;stop();};
 worker.postMessage({code:ta.value});}
 btn.addEventListener("click",run);r.querySelector(".btn-reset").addEventListener("click",()=>{stop();ta.value=orig;out.classList.remove("has");out.textContent="";});
 ta.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();run();}});
});

/* ============================================================
   GOM NHÓM MỤC LỤC — 118 mục thì phải gập lại được
   ============================================================ */
(function foldNav(){
  const sb = document.getElementById("sidebar");
  if(!sb) return;
  const kids = [...sb.children];
  let cur = null;
  kids.forEach(el => {
    if(el.classList.contains("navtrack")){
      cur = document.createElement("div");
      cur.className = "navbody";
      el.classList.add("navfold");
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.insertAdjacentElement("afterend", cur);
      el.addEventListener("click", () => toggle(el));
      el.addEventListener("keydown", e => {
        if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggle(el); }
      });
      return;
    }
    if(cur && (el.classList.contains("lesson-link") || el.classList.contains("navgroup"))) cur.appendChild(el);
  });
  function toggle(head, force){
    const body = head.nextElementSibling;
    if(!body || !body.classList.contains("navbody")) return;
    const open = force !== undefined ? force : !head.classList.contains("open");
    head.classList.toggle("open", open);
    body.classList.toggle("open", open);
    head.setAttribute("aria-expanded", open ? "true" : "false");
  }
  window.__navSync = function(activeId){
    let found = false;
    sb.querySelectorAll(".navfold").forEach(head => {
      const body = head.nextElementSibling;
      if(!body) return;
      const has = !!body.querySelector('.lesson-link[data-goto="' + activeId + '"]');
      if(has) found = true;
      toggle(head, has);
    });
    // không thuộc nhóm nào (ví dụ trang Toàn cảnh) thì mở nhóm đầu
    if(!found){ const f = sb.querySelector(".navfold"); if(f) toggle(f, true); }
  };
  // đếm số mục để hiện bên cạnh tên nhóm
  sb.querySelectorAll(".navfold").forEach(head => {
    const body = head.nextElementSibling;
    const n = body ? body.querySelectorAll(".lesson-link").length : 0;
    if(n){ const b = document.createElement("i"); b.className = "nav-n"; b.textContent = n; head.appendChild(b); }
  });
})();

/* ============================================================
   TÌM KIẾM TOÀN BỘ APP
   ============================================================ */
function norm(s){
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}
const SEARCH_INDEX = [];
(function buildIndex(){
  const label = {};
  document.querySelectorAll(".lesson-link").forEach(b => {
    label[b.dataset.goto] = b.textContent.replace(/[✓]/g, "").trim();
  });
  const group = {};
  let cur = "";
  [...document.querySelector(".sidebar").children].forEach(el => {
    if(el.classList.contains("navtrack")) cur = el.textContent.trim();
    if(el.classList.contains("lesson-link")) group[el.dataset.goto] = cur;
  });
  document.querySelectorAll(".lesson").forEach(sec => {
    const copy = sec.cloneNode(true); copy.querySelectorAll(".legacy-banner,.legacy-catalog").forEach(x=>x.remove()); const t = copy.textContent || "";
    SEARCH_INDEX.push({
      id: sec.id,
      title: label[sec.id] || sec.id,
      tag: (sec.classList.contains("legacy-page") ? "Kho tham khảo · " + (sec.querySelector(".legacy-banner strong")?.textContent || "Gốc") : "Cốt lõi / công cụ · " ) + (document.querySelector('.lesson-link[data-goto="'+sec.id+'"]')?.closest(".navbody")?.previousElementSibling?.textContent || group[sec.id] || "").replace(/^[^\wÀ-ỹ]+/, ""),
      text: t.replace(/\s+/g, " ").trim(),
      ntext: norm(t.replace(/\s+/g, " ")),
    });
  });
})();

const sq = document.getElementById("sq"), sqRes = document.getElementById("sqRes");
let sqPick = -1, sqHits = [];
function closeSearch(){sqRes.classList.remove("show");sq.setAttribute("aria-expanded","false");}

function snippet(text, ntext, nq){
  const i = ntext.indexOf(nq);
  if(i < 0) return text.slice(0, 90) + "…";
  const a = Math.max(0, i - 34), b = Math.min(text.length, i + nq.length + 56);
  const esc = escapeHTML;
  return (a > 0 ? "…" : "") + esc(text.slice(a, i)) + "<b>" + esc(text.slice(i, i + nq.length)) + "</b>" +
         esc(text.slice(i + nq.length, b)) + (b < text.length ? "…" : "");
}
function runSearch(){
  const q = sq.value.trim();
  if(q.length < 2){ closeSearch(); sqRes.innerHTML = ""; sqHits = []; return; }
  const nq = norm(q);
  sqHits = SEARCH_INDEX
    .map(e => {
      const inTitle = norm(e.title).includes(nq);
      const at = e.ntext.indexOf(nq);
      if(!inTitle && at < 0) return null;
      return { e, score: (e.id.match(/^a\d{2}$/) ? 0 : 100000) + (inTitle ? 0 : 1000) + Math.max(at, 0) };
    })
    .filter(Boolean).sort((a, b) => a.score - b.score).slice(0, 8).map(x => x.e);

  if(!sqHits.length){
    sqRes.innerHTML = '<div class="sq-none">Không tìm thấy “' + escapeHTML(q) + '”</div>';
  }else{
    sqRes.innerHTML = sqHits.map((e, i) =>
      '<button class="sq-item" data-i="' + i + '">' +
      '<span class="sq-tag">' + e.tag + '</span>' +
      '<div class="sq-t">' + e.title + '</div>' +
      '<div class="sq-s">' + snippet(e.text, e.ntext, nq) + '</div></button>').join("");
    sqRes.querySelectorAll(".sq-item").forEach(b =>
      b.addEventListener("click", () => openHit(parseInt(b.dataset.i, 10))));
  }
  sqPick = -1;
  sqRes.classList.add("show");sq.setAttribute("aria-expanded","true");
}
function openHit(i){
  const e = sqHits[i]; if(!e) return;
  const q = sq.value.trim();
  showLesson(e.id);
  closeSearch();
  highlight(document.getElementById(e.id), q);
}
function clearHighlight(){
  document.querySelectorAll("mark.hit").forEach(m => {
    const p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize();
  });
}
function highlight(sec, q){
  clearHighlight();
  if(!sec || q.length < 2) return;

  const nq = norm(q);
  const walk = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT, {
    acceptNode: n => (n.parentNode && /^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName))
      ? NodeFilter.FILTER_REJECT
      : (norm(n.nodeValue).includes(nq) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
  });
  const targets = []; let n;
  while((n = walk.nextNode())) targets.push(n);
  let first = null;
  targets.slice(0, 40).forEach(node => {
    const i = norm(node.nodeValue).indexOf(nq);
    if(i < 0) return;
    const after = node.splitText(i);
    const len=Math.min(after.length,q.length); after.splitText(len);
    const m = document.createElement("mark");
    m.className = "hit"; m.textContent = after.nodeValue;
    after.parentNode.replaceChild(m, after);
    if(!first) first = m;
  });
  if(first){for(let d=first.closest("details");d;d=d.parentElement.closest("details"))d.open=true;}
  if(first && first.scrollIntoView){ try{ first.scrollIntoView({ block: "center" }); }catch(e){} }
}
if(sq){
  sq.addEventListener("input", runSearch);
  sq.addEventListener("keydown", e => {
    if(!sqRes.classList.contains("show")) return;
    const items = [...sqRes.querySelectorAll(".sq-item")];
    if(e.key === "ArrowDown" || e.key === "ArrowUp"){
      e.preventDefault();
      sqPick += (e.key === "ArrowDown" ? 1 : -1);
      if(sqPick < 0) sqPick = items.length - 1;
      if(sqPick >= items.length) sqPick = 0;
      items.forEach((x, i) => x.classList.toggle("pick", i === sqPick));
      if(items[sqPick] && items[sqPick].scrollIntoView){ try{ items[sqPick].scrollIntoView({block:"nearest"}); }catch(e){} }
    }
    if(e.key === "Enter"){ e.preventDefault(); openHit(sqPick < 0 ? 0 : sqPick); }
    if(e.key === "Escape"){ closeSearch(); sq.blur(); }
  });
  document.addEventListener("click", e => {
    if(!e.target.closest(".sb-search")) closeSearch();
  });
  document.addEventListener("keydown", e => {
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
      e.preventDefault();
      setMenu(true);
      sq.focus(); sq.select();
    }
  });
}

/* ============================================================
   NÚT TIẾP TỤC
   ============================================================ */
function paintResume(){
  const n = todayDay(), done = DONE.has("d" + n);
  const box = document.getElementById("resumeBox");
  if(box){
    const all = [...Array(TOTAL_ALL)].filter((_, i) => DONE.has("d" + (i + 1))).length;
    box.innerHTML = all >= TOTAL_ALL
      ? '<div class="rt"><div class="rl">Đã xong cả 90 ngày</div><div class="rd">🎉 Mở trang Tự chấm cuối tháng để xem nên làm gì tiếp</div></div><button data-go="treview">Mở bảng tự chấm</button>'
      : '<div class="rt"><div class="rl">' + (all ? "Tiếp tục từ chỗ đang dở" : "Bắt đầu từ đây") + '</div>' +
        '<div class="rd">Ngày ' + n + ' — ' + (document.querySelector('.lesson-link[data-goto="d' + n + '"]')?.textContent.replace(/[✓]/g,"").replace(/^\s*\d+\s*/,"").trim() || "") + '</div></div>' +
        '<button data-go="d' + n + '">Vào ngày ' + n + ' →</button>';
    const b = box.querySelector("button");
    if(b) b.onclick = () => showLesson(b.dataset.go);
  }
  const sb = document.getElementById("sbResume");
  if(sb){
    const all = [...Array(TOTAL_ALL)].filter((_, i) => DONE.has("d" + (i + 1))).length;
    sb.style.display = all >= TOTAL_ALL ? "none" : "block";
    sb.textContent = "▶ Tiếp tục — Ngày " + n;
    sb.onclick = () => showLesson("d" + n);
  }
}

/* ============================================================
   CÂY JSON TƯƠNG TÁC
   ============================================================ */
const JX_DATA = {
  latitude: 21.03,
  longitude: 105.85,
  timezone: "Asia/Bangkok",
  elevation: 16,
  current_weather: {
    time: "2026-07-28T09:00",
    temperature: 32.4,
    windspeed: 8.1,
    winddirection: 150,
    is_day: 1
  },
  daily: {
    time: ["2026-07-28", "2026-07-29"],
    temperature_2m_max: [34.1, 33.6],
    temperature_2m_min: [26.2, 26.8]
  }
};
document.querySelectorAll(".jsonx").forEach(jx => {
  const tree = jx.querySelector(".jx-tree");
  const pathEl = jx.querySelector(".jx-path");
  const valEl = jx.querySelector(".jx-val");
  const copyBtn = jx.querySelector(".jx-copy");
  let picked = null;

  function esc(s){ return String(s).replace(/</g, "&lt;"); }
  function render(obj, path, depth){
    let html = "";
    const pad = "  ".repeat(depth);
    Object.keys(obj).forEach(k => {
      const v = obj[k];
      const p = path + "." + k;
      if(v !== null && typeof v === "object" && !Array.isArray(v)){
        html += '<div class="jx-row">' + pad + '<span class="jx-k">' + k + '</span><span class="jx-b">: {</span></div>';
        html += render(v, p, depth + 1);
        html += '<div class="jx-row">' + pad + '<span class="jx-b">}</span></div>';
      }else if(Array.isArray(v)){
        html += '<div class="jx-row">' + pad + '<span class="jx-k">' + k + '</span><span class="jx-b">: [</span></div>';
        v.forEach((item, i) => {
          html += '<div class="jx-row leaf" data-p="' + esc(p + "[" + i + "]") + '" data-v="' + esc(JSON.stringify(item)) + '">' +
                  pad + "  " + '<span class="jx-b">[' + i + ']</span> ' +
                  '<span class="' + (typeof item === "string" ? "jx-vs" : "jx-v") + '">' + esc(JSON.stringify(item)) + '</span></div>';
        });
        html += '<div class="jx-row">' + pad + '<span class="jx-b">]</span></div>';
      }else{
        html += '<div class="jx-row leaf" data-p="' + esc(p) + '" data-v="' + esc(JSON.stringify(v)) + '">' +
                pad + '<span class="jx-k">' + k + '</span><span class="jx-b">: </span>' +
                '<span class="' + (typeof v === "string" ? "jx-vs" : "jx-v") + '">' + esc(JSON.stringify(v)) + '</span></div>';
      }
    });
    return html;
  }
  tree.innerHTML = '<div class="jx-row"><span class="jx-b">{</span></div>' +
                   render(JX_DATA, "", 1) +
                   '<div class="jx-row"><span class="jx-b">}</span></div>';

  tree.querySelectorAll(".jx-row.leaf").forEach(row => row.addEventListener("click", () => {
    tree.querySelectorAll(".jx-row.leaf").forEach(r => r.classList.remove("sel"));
    row.classList.add("sel");
    picked = "{{ $json" + row.dataset.p + " }}";
    pathEl.textContent = picked;
    valEl.textContent = "giá trị hiện tại: " + row.dataset.v;
    copyBtn.disabled = false;
    markAuto(jx.dataset.lesson);
  }));

  copyBtn.addEventListener("click", () => {
    if(!picked) return;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(picked).then(() => toast("Đã sao chép expression"), () => toast("Trình duyệt chặn sao chép — hãy bôi đen và copy tay"));
    }else{ toast("Trình duyệt không cho sao chép tự động — bôi đen dòng trên và copy tay"); }
  });
});

/* ============================================================
   BỘ GIẢ LẬP PROMPT & EVAL (K4)
   ============================================================ */
const EV_CASES = [
  { t:"Cà phê ngon lắm, sẽ quay lại",              k:"ro",   d:"KHEN" },
  { t:"View đẹp, nhạc hay, rất đáng tiền",         k:"ro",   d:"KHEN" },
  { t:"Đợi 30 phút mới có nước, quá lâu",          k:"ro",   d:"CHE" },
  { t:"Không bao giờ quay lại nữa",                k:"ro",   d:"CHE" },
  { t:"Nhân viên dễ thương nhưng bánh khô",        k:"mo",   d:"TRUNG_TINH" },
  { t:"Đồ uống ngon, tiếc là chỗ ngồi hơi chật",   k:"mo",   d:"TRUNG_TINH" },
  { t:"Tuyệt vời, đợi 40 phút cho một ly nước",    k:"mia",  d:"CHE" },
  { t:"Cho hỏi quán mấy giờ đóng cửa ạ?",          k:"hoi",  d:"KHAC" },
];
const EV_OPT = [
  { id:"khuon", n:"Ép khuôn đầu ra",
    d:"“CHỈ trả về đúng một từ. Không giải thích.”",
    line:"CHỈ trả về đúng MỘT từ trong: KHEN, CHE, TRUNG_TINH. Không giải thích." },
  { id:"vidu",  n:"Thêm ví dụ mẫu",
    d:"Cho AI xem cách xử lý câu vừa khen vừa chê",
    line:'Ví dụ: "Cà phê ngon nhưng đắt" → TRUNG_TINH' },
  { id:"mia",   n:"Dặn về câu mỉa mai",
    d:"Nhắc AI rằng lời khen có thể là mỉa mai",
    line:"Chú ý: câu nghe như khen nhưng kèm chi tiết tiêu cực thì là CHE." },
  { id:"khac",  n:"Thêm nhóm KHÁC",
    d:"Cho phép AI trả lời KHAC khi câu không phải đánh giá",
    line:"Nếu câu không phải đánh giá (ví dụ câu hỏi), trả về KHAC." },
];
document.querySelectorAll(".evalsim").forEach(ev => {
  const tgWrap  = ev.querySelector(".ev-toggles");
  const promptEl= ev.querySelector(".ev-prompt pre");
  const bigEl   = ev.querySelector(".ev-big");
  const deltaEl = ev.querySelector(".ev-delta");
  const rowsEl  = ev.querySelector(".ev-rows");
  const noteEl  = ev.querySelector(".ev-note");
  const on = { khuon:false, vidu:false, mia:false, khac:false };
  let last = null;

  tgWrap.innerHTML = '<div class="ev-lab">Bật/tắt từng phần của prompt rồi xem điểm đổi</div>' +
    EV_OPT.map(o => '<label class="ev-tg"><input type="checkbox" data-o="' + o.id + '">' +
      '<span><span class="tt">' + o.n + '</span><br><span class="td">' + o.d + '</span></span></label>').join("");

  function aiTraLoi(c){
    if(!on.khuon) return { v:"Đây là một đánh giá…(cả đoạn văn)", fmt:false };
    if(c.k === "ro")  return { v:c.d, fmt:true };
    if(c.k === "mo")  return { v:on.vidu ? "TRUNG_TINH" : "KHEN", fmt:true };
    if(c.k === "mia") return { v:on.mia  ? "CHE" : "KHEN", fmt:true };
    if(c.k === "hoi") return { v:on.khac ? "KHAC" : "TRUNG_TINH", fmt:true };
    return { v:"?", fmt:true };
  }
  function ve(){
    // prompt đang dựng
    let p = "Bạn là trợ lý phân loại đánh giá khách hàng của một quán cà phê.\n";
    p += "Phân loại câu đánh giá dưới đây.\n";
    EV_OPT.forEach(o => {
      p += on[o.id] ? o.line + "\n" : '<span class="off">' + o.line + "</span>\n";
    });
    p += "\nCâu: {{ $json.cau_danh_gia }}";
    promptEl.innerHTML = p;

    // chấm điểm
    let dung = 0, rows = "";
    EV_CASES.forEach(c => {
      const r = aiTraLoi(c);
      const ok = r.fmt && r.v === c.d;
      if(ok) dung++;
      rows += '<div class="ev-row"><span class="ev-m ' + (ok ? "y" : "n") + '">' + (ok ? "✓" : "✗") + '</span>' +
              '<span class="ev-q">' + c.t + '</span>' +
              '<span class="ev-a">đúng: <b>' + c.d + '</b><br>AI: ' + (r.fmt ? r.v : "sai định dạng") + '</span></div>';
    });
    rowsEl.innerHTML = rows;

    const pct = Math.round(dung / EV_CASES.length * 100);
    bigEl.textContent = dung + "/" + EV_CASES.length + "  (" + pct + "%)";
    bigEl.classList.toggle("bad", pct < 60);

    if(last === null){ deltaEl.textContent = ""; }
    else if(pct === last){ deltaEl.textContent = "không đổi"; deltaEl.className = "ev-delta"; }
    else{
      const d = pct - last;
      deltaEl.textContent = (d > 0 ? "▲ +" : "▼ ") + d + " điểm phần trăm so với lần trước";
      deltaEl.className = "ev-delta " + (d > 0 ? "up" : "down");
    }
    last = pct;

    if(!on.khuon) noteEl.innerHTML = "⚠ Không ép khuôn đầu ra thì AI trả lời cả đoạn văn. Nghe hay nhưng workflow <b>không dùng được</b>, vì bước sau cần đúng một từ để phân nhánh. Đây là lỗi số một của người mới.";
    else if(pct === 100) noteEl.innerHTML = "✓ Đủ bốn thành phần. Đây chính là quy trình anh làm ở <b>Ngày 25</b> — chỉ khác là với dữ liệu thật của mình.";
    else noteEl.innerHTML = "Còn " + (EV_CASES.length - dung) + " câu sai. Nhìn cột bên phải xem sai ở <b>loại câu nào</b>, rồi bật đúng phần prompt xử lý loại đó.";

    if(touched) markAuto(ev.dataset.lesson);
  }
  let touched = false;
  tgWrap.querySelectorAll("input").forEach(i => i.addEventListener("change", () => {
    touched = true; on[i.dataset.o] = i.checked; ve();
  }));
  ve();   // lần vẽ đầu tiên đặt mốc so sánh, nhờ đó cú nhảy 0→50% hiện được mức tăng
});

/* ============================================================
   BỘ GIẢ LẬP GỠ LỖI (K5)
   ============================================================ */
const DS_CASES = [
  {
    brief: 'Quy trình báo cáo doanh thu hằng ngày. Sáng nay <b>không nhận được email</b>, nhưng bảng thực thi báo thành công, không có dòng đỏ nào.',
    nodes: [
      { ic:"⏰", nm:"Lịch chạy", st:"ok", it:"1 item" },
      { ic:"📋", nm:"Đọc bảng",  st:"ok", it:"52 items" },
      { ic:"🔍", nm:"Lọc",       st:"warn", it:"0 items" },
      { ic:"✉️", nm:"Gửi email", st:"ok", it:"0 items" },
    ],
    log: '<span class="g">07:00:01  Lịch chạy      → 1 item</span>\n' +
         '<span class="g">07:00:02  Đọc bảng       → 52 items</span>\n' +
         '<span class="w">07:00:02  Lọc            → 0 items   (điều kiện: doanh_thu > "100000")</span>\n' +
         '<span class="g">07:00:03  Gửi email      → 0 items, không có gì để gửi</span>\n' +
         '<span class="g">07:00:03  Kết thúc: thành công</span>',
    ans: 2,
    why: {
      2: '<b>Đúng.</b> Node Lọc nhận 52 items nhưng trả về 0. Nhìn điều kiện trong log: <code>doanh_thu > "100000"</code> — số bị bọc trong nháy kép nên đang <b>so sánh chuỗi với chuỗi</b>, không phải so số. Sửa: bỏ nháy kép, hoặc chèn node Edit Fields đổi cột đó sang kiểu số trước khi lọc.',
      0: 'Chưa đúng. Lịch chạy trả về 1 item đúng như thiết kế — nó chỉ báo "đến giờ rồi", không mang dữ liệu.',
      1: 'Chưa đúng. Đọc bảng trả về 52 items, tức là lấy dữ liệu thành công. Vấn đề xảy ra <b>sau</b> nó.',
      3: 'Chưa đúng — và đây là bẫy phổ biến nhất. Email không gửi vì <b>không có gì để gửi</b>. Node báo lỗi (hoặc im lặng) thường không phải node gây lỗi. Đi ngược lên tìm chỗ số items tụt xuống 0.',
    }
  },
  {
    brief: 'Quy trình lấy dữ liệu thời tiết. Hôm nay <b>dừng giữa chừng</b>, có dòng đỏ. Hôm qua vẫn chạy bình thường.',
    nodes: [
      { ic:"⏰", nm:"Lịch chạy",   st:"ok",  it:"1 item" },
      { ic:"🌐", nm:"Gọi API",     st:"err", it:"lỗi 401" },
      { ic:"✂️", nm:"Trích trường", st:"ok", it:"—" },
      { ic:"📋", nm:"Ghi bảng",    st:"ok",  it:"—" },
    ],
    log: '<span class="g">07:00:01  Lịch chạy      → 1 item</span>\n' +
         '<span class="e">07:00:02  Gọi API        → LỖI 401 Unauthorized</span>\n' +
         '<span class="e">          phản hồi: {"error":"invalid or expired credentials"}</span>\n' +
         '<span class="w">07:00:02  Dừng workflow, các node sau không chạy</span>',
    ans: 1,
    why: {
      1: '<b>Đúng.</b> Mã <b>401</b> nghĩa là không có quyền — sai chìa khoá hoặc chìa khoá hết hạn. Vì hôm qua còn chạy được nên khả năng cao là credential vừa hết hạn hoặc bị thu hồi. Sửa: vào mục credential, tạo lại kết nối. Đừng dán chìa khoá thẳng vào ô URL.',
      0: 'Chưa đúng. Lịch chạy đã chạy thành công, trả về 1 item.',
      2: 'Chưa đúng. Node này còn chưa được chạy — workflow đã dừng ở node trước.',
      3: 'Chưa đúng. Node này còn chưa được chạy. Khi có dòng đỏ, hãy đọc node đỏ đầu tiên tính từ trên xuống.',
    }
  },
  {
    brief: 'Quy trình chạy trót lọt, bảng có dòng mới mỗi ngày. Nhưng <b>cột nhiệt độ luôn trống</b>.',
    nodes: [
      { ic:"⏰", nm:"Lịch chạy",   st:"ok", it:"1 item" },
      { ic:"🌐", nm:"Gọi API",     st:"ok", it:"1 item" },
      { ic:"✂️", nm:"Trích trường", st:"ok", it:"1 item" },
      { ic:"📋", nm:"Ghi bảng",    st:"ok", it:"1 item" },
    ],
    log: '<span class="g">07:00:01  Lịch chạy      → 1 item</span>\n' +
         '<span class="g">07:00:02  Gọi API        → 1 item</span>\n' +
         '<span class="g">          {"latitude":21.03,"current_weather":{"temperature":32.4,"windspeed":8.1}}</span>\n' +
         '<span class="g">07:00:02  Trích trường   → 1 item</span>\n' +
         '<span class="w">          {"ngay":"2026-07-28","nhiet_do":null}   ← công thức: {{ $json.temperature }}</span>\n' +
         '<span class="g">07:00:03  Ghi bảng       → 1 item, ghi thành công</span>',
    ans: 2,
    why: {
      2: '<b>Đúng.</b> Công thức viết <code>{{ $json.temperature }}</code> nhưng trong dữ liệu API, <code>temperature</code> nằm <b>bên trong</b> <code>current_weather</code>. Thiếu một tầng nên ra <code>null</code>. Sửa thành <code>{{ $json.current_weather.temperature }}</code>. Dùng <b>cây JSON ở bài K3</b> để khỏi đếm tầng bằng mắt.',
      0: 'Chưa đúng. Lịch chạy không liên quan tới nội dung dữ liệu.',
      1: 'Chưa đúng. Nhìn log: API trả về đầy đủ, có cả <code>temperature: 32.4</code>. Dữ liệu vào đúng, vậy lỗi nằm ở bước xử lý sau.',
      3: 'Chưa đúng. Node ghi bảng đã ghi <b>đúng thứ nó nhận được</b> — mà thứ nó nhận được đã là <code>null</code> rồi. Đi ngược lên một node.',
    }
  },
  {
    brief: 'Quy trình gửi báo cáo tổng hợp cuối ngày. Thiết kế là <b>gửi một email tóm tắt</b>, nhưng sáng nay anh nhận được <b>52 email</b>.',
    nodes: [
      { ic:"⏰", nm:"Lịch chạy", st:"ok", it:"1 item" },
      { ic:"📋", nm:"Đọc bảng",  st:"ok", it:"52 items" },
      { ic:"✉️", nm:"Gửi email", st:"ok", it:"52 items" },
    ],
    log: '<span class="g">18:00:01  Lịch chạy      → 1 item</span>\n' +
         '<span class="w">18:00:02  Đọc bảng       → 52 items   ← một item nở thành 52</span>\n' +
         '<span class="e">18:00:03  Gửi email      → 52 items, đã gửi 52 email</span>\n' +
         '<span class="g">18:00:09  Kết thúc: thành công</span>',
    ans: 1,
    why: {
      1: '<b>Đúng.</b> Đây là chỗ 1 item nở thành 52. Mọi node phía sau sẽ <b>tự động lặp lại 52 lần</b> — kể cả node gửi email. Sửa: chèn node gộp (Summarize hoặc Aggregate) ngay sau node đọc bảng, để 52 dòng thành 1 bản tóm tắt trước khi gửi.',
      0: 'Chưa đúng. Lịch chạy chỉ trả về 1 item báo hiệu đến giờ.',
      2: 'Gần đúng nhưng chưa phải gốc. Node gửi email làm đúng việc của nó: nhận 52 items thì gửi 52 lần. Nguyên nhân gốc là <b>không có bước gộp</b> sau khi số items nở ra.',
    }
  },
];
document.querySelectorAll(".debugsim").forEach(ds => {
  const nEl = ds.querySelector(".ds-n");
  const brief = ds.querySelector(".ds-brief");
  const chain = ds.querySelector(".ds-chain");
  const log = ds.querySelector(".ds-log");
  const ask = ds.querySelector(".ds-ask");
  const vd = ds.querySelector(".ds-verdict");
  let idx = 0, solved = false;

  function draw(){
    const c = DS_CASES[idx];
    solved = false;
    nEl.textContent = idx + 1;
    brief.innerHTML = c.brief;
    log.innerHTML = c.log;
    vd.innerHTML = "";
    ask.textContent = "Bấm vào node mà bạn cho là nguyên nhân gốc";
    chain.innerHTML = "";
    c.nodes.forEach((n, i) => {
      const el = document.createElement("div");
      el.className = "dsn";
      el.innerHTML = '<div class="ic">' + n.ic + '</div><div class="nm">' + n.nm + '</div>' +
                     '<div class="st ' + n.st + '">' + n.it + '</div>';
      el.addEventListener("click", () => pick(i));
      chain.appendChild(el);
      if(i < c.nodes.length - 1){ const w = document.createElement("i"); w.className = "dswire"; chain.appendChild(w); }
    });
  }
  function pick(i){
    if(solved) return;
    const c = DS_CASES[idx];
    const cards = [...chain.querySelectorAll(".dsn")];
    cards.forEach(x => x.classList.remove("picked", "right"));
    const ok = i === c.ans;
    cards[i].classList.add(ok ? "right" : "picked");
    if(ok){ cards[c.ans].classList.add("right"); solved = true; ask.textContent = "Bấm “Ca tiếp theo” để làm ca khác"; }
    vd.innerHTML = '<div class="ds-v ' + (ok ? "y" : "n") + '">' + (c.why[i] || "") + '</div>';
    if(ok && idx === DS_CASES.length - 1) markAuto(ds.dataset.lesson);
  }
  ds.querySelector(".ds-next").addEventListener("click", () => { idx = (idx + 1) % DS_CASES.length; draw(); });
  draw();
});

/* ============================================================
   IN TRANG
   ============================================================ */
(function(){
  const b = document.getElementById("btnPrint");
  if(b) b.addEventListener("click", () => window.print());
})();

/* ============================================================
   LUYỆN BIỂU THỨC (K3)
   ============================================================ */
const EX_DATA = {
  ma_don: "NN-1042",
  khach_hang: { ten: "Lan", thanh_pho: "Ha Noi", vip: false },
  cac_mon: [
    { ten: "Ca phe sua", sl: 2, gia: 35000 },
    { ten: "Tra dao",    sl: 1, gia: 45000 },
    { ten: "Banh mi",    sl: 3, gia: 25000 }
  ]
};
const EX_TASKS = [
  { q:'Lấy <b>tên khách hàng</b>.', exp:"Lan", hint:"Đi hai tầng: khach_hang rồi tới ten.", sol:"$json.khach_hang.ten" },
  { q:'Lấy <b>tên món đầu tiên</b> trong danh sách.', exp:"Ca phe sua", hint:"Mảng đếm từ 0. Dùng cac_mon[0] rồi tới ten.", sol:"$json.cac_mon[0].ten" },
  { q:'Đếm xem đơn này có <b>bao nhiêu loại món</b>.', exp:3, hint:"Mảng có sẵn thuộc tính .length", sol:"$json.cac_mon.length" },
  { q:'Tính <b>thành tiền của món đầu tiên</b> (số lượng × đơn giá).', exp:70000, hint:"Nhân hai trường của cùng một phần tử.", sol:"$json.cac_mon[0].sl * $json.cac_mon[0].gia" },
  { q:'Viết <b>tên khách in hoa toàn bộ</b>.', exp:"LAN", hint:"Chuỗi có sẵn hàm .toUpperCase()", sol:"$json.khach_hang.ten.toUpperCase()" },
  { q:'Ghép câu chào: <b>Chào Lan tại Ha Noi</b>.', exp:"Chào Lan tại Ha Noi", hint:'Nối chuỗi bằng dấu +, nhớ khoảng trắng trong dấu nháy.', sol:'"Chào " + $json.khach_hang.ten + " tại " + $json.khach_hang.thanh_pho' },
  { q:'Tính <b>tổng tiền cả đơn</b> (cộng thành tiền của cả ba món).', exp:190000, hint:"Dùng .reduce() hoặc cộng tay ba phần tử. Cách nào ra đúng số cũng được.", sol:"$json.cac_mon.reduce((t, m) => t + m.sl * m.gia, 0)" },
  { q:'Nếu tổng tiền trên 150.000 thì trả về <b>VIP</b>, ngược lại trả về <b>Thuong</b>.', exp:"VIP", hint:'Dùng toán tử ba ngôi:  điều_kiện ? "A" : "B"', sol:'$json.cac_mon.reduce((t, m) => t + m.sl * m.gia, 0) > 150000 ? "VIP" : "Thuong"' },
];
document.querySelectorAll(".exprsim").forEach(ex => {
  const dataEl = ex.querySelector(".ex-data");
  const qEl    = ex.querySelector(".ex-q");
  const progEl = ex.querySelector(".ex-prog");
  const input  = ex.querySelector(".ex-in input");
  const resEl  = ex.querySelector(".ex-res");
  const doneEl = ex.querySelector(".ex-done");
  let i = 0;
  const solved = new Array(EX_TASKS.length).fill(false);

  // in dữ liệu mẫu có màu
  dataEl.innerHTML = JSON.stringify(EX_DATA, null, 2)
    .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
    .replace(/: (-?\d+\.?\d*)/g, ': <span class="n">$1</span>');

  function drawTask(){
    qEl.innerHTML = EX_TASKS[i].q;
    progEl.textContent = "Câu " + (i + 1) + "/" + EX_TASKS.length +
      "   •   đã đúng: " + solved.filter(Boolean).length;
    input.value = ""; resEl.innerHTML = "";
    doneEl.classList.toggle("show", solved.every(Boolean));
  }
  function evalExpr(src){
    // chạy đúng như n8n: biểu thức JS với biến $json
    return safeExpression(src, EX_DATA);
  }
  function check(){
    const src = input.value.trim();
    if(!src){ resEl.innerHTML = '<span class="d">Gõ biểu thức vào ô trên rồi bấm Chạy thử.</span>'; return; }
    let val;
    try{ val = evalExpr(src); }
    catch(err){
      resEl.innerHTML = '<span class="n2">✗ Biểu thức không chạy được</span>\n<span class="d">' +
        String(err.message).replace(/</g, "&lt;") + '</span>\n<span class="d">Thường do: thiếu ngoặc, sai tên trường, hoặc quên $json ở đầu.</span>';
      return;
    }
    const want = EX_TASKS[i].exp;
    const ok = (typeof want === "number") ? Math.abs(val - want) < 1e-9 : String(val) === String(want);
    if(ok){
      solved[i] = true;
      resEl.innerHTML = '<span class="y">✓ Đúng. Kết quả: ' + escapeHTML(JSON.stringify(val)) + '</span>\n' +
        '<span class="d">Trong n8n anh sẽ viết:  {{ ' + src.replace(/</g, "&lt;") + ' }}</span>';
      if(solved.every(Boolean)) markAuto(ex.dataset.lesson);
    }else{
      resEl.innerHTML = '<span class="n2">✗ Chạy được nhưng ra sai.</span>\n' +
        '<span class="d">Biểu thức trả về: ' + escapeHTML(JSON.stringify(val)) + '</span>\n' +
        '<span class="d">Cần phải ra:      ' + escapeHTML(JSON.stringify(want)) + '</span>';
    }
    drawProg();
  }
  function drawProg(){
    progEl.textContent = "Câu " + (i + 1) + "/" + EX_TASKS.length +
      "   •   đã đúng: " + solved.filter(Boolean).length;
    doneEl.classList.toggle("show", solved.every(Boolean));
  }
  ex.querySelector(".ex-run").addEventListener("click", check);
  input.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); check(); } });
  ex.querySelector(".ex-hint").addEventListener("click", () => {
    resEl.innerHTML = '<span class="d">Gợi ý: ' + EX_TASKS[i].hint + '</span>';
  });
  ex.querySelector(".ex-sol").addEventListener("click", () => {
    input.value = EX_TASKS[i].sol;
    resEl.innerHTML = '<span class="d">Đáp án đã điền sẵn. Bấm ▶ Chạy thử để xem nó ra gì — rồi tự gõ lại một lần nữa cho nhớ.</span>';
  });
  ex.querySelector(".ex-next").addEventListener("click", () => { i = (i + 1) % EX_TASKS.length; drawTask(); });
  ex.querySelector(".ex-prev").addEventListener("click", () => { i = (i - 1 + EX_TASKS.length) % EX_TASKS.length; drawTask(); });
  drawTask();
});

/* nút cứu hộ ở cột trái */
(function(){ var b=document.getElementById("sbStuck"); if(b) b.onclick=function(){ showLesson("stuck"); }; })();

/* ============================================================
   ÔN NHANH — trộn câu hỏi từ mọi bài kiểm tra
   ============================================================ */
const RQ_POOL = [];
(function buildPool(){
  document.querySelectorAll(".quiz").forEach(q => {
    const from = q.dataset.lesson || "";
    q.querySelectorAll(".qz-item").forEach((it, i) => {
      const labels = [...it.querySelectorAll("label")];
      RQ_POOL.push({
        id: from + "#" + i,
        from,
        q: (it.querySelector(".qz-q") || {}).innerHTML || "",
        opts: labels.map(l => l.innerHTML.replace(/<input[^>]*>/g, "").trim()),
        ans: parseInt(it.dataset.ans, 10) - 1,
        why: (it.querySelector(".qz-why") || {}).innerHTML || "",
      });
    });
  });
})();
const CORE_RQ=[...document.querySelectorAll('.aim-page .aim-quiz')].map(q=>({id:q.closest('.lesson').id+'#core',from:q.closest('.lesson').id,q:escapeHTML(q.querySelector('p').textContent),opts:[...q.querySelectorAll('.aim-option')].map(b=>escapeHTML(b.textContent)),ans:+q.dataset.answer,why:escapeHTML(q.dataset.feedback)}));
function cleanRQ(v){return Object.fromEntries(Object.entries(asObject(v)).filter(([k,r])=>!['__proto__','constructor','prototype'].includes(k)&&r&&['n','w','streak'].every(x=>Number.isInteger(r[x])&&r[x]>=0)&&r.w<=r.n&&r.streak<=r.n));}
let RQ = cleanRQ(DB.get("rq", {}));          // {id: {n: số lần hỏi, w: số lần sai, streak: đúng liên tiếp}}
let rqQueue = [], rqCur = null, rqRight = 0, rqAnswered=false;

function rqStats(){
  const ids = Object.keys(RQ);
  const tot = ids.reduce((s, k) => s + RQ[k].n, 0);
  const wrong = ids.reduce((s, k) => s + RQ[k].w, 0);
  const weak = ids.filter(k => RQ[k].w > 0 && RQ[k].streak < 2).length;
  document.getElementById("rqTotal").textContent = tot;
  document.getElementById("rqRate").textContent = tot ? Math.round((tot - wrong) / tot * 100) + "%" : "—";
  document.getElementById("rqWeak").textContent = weak;
}
function rqPick(n){
  // ưu tiên câu từng sai và chưa đúng 2 lần liên tiếp
  const scored = (document.getElementById("rqSource").value==="legacy"?RQ_POOL:CORE_RQ).map(p => {
    const r = RQ[p.id] || { n:0, w:0, streak:0 };
    let s = Math.random();
    if(r.n === 0) s += 1.0;                 // chưa hỏi bao giờ
    if(r.w > 0 && r.streak < 2) s += 2.0;   // từng sai, chưa vững
    if(r.streak >= 2) s -= 1.5;             // đã vững
    return { p, s };
  });
  return scored.sort((a, b) => b.s - a.s).slice(0, n).map(x => x.p);
}
function rqRender(){
  const box = document.getElementById("rqBox");
  if(!rqCur){
    if(!rqQueue.length){
      box.innerHTML = '<p style="margin:0;color:var(--muted)">Bấm <b>▶ Bắt đầu lượt mới</b> để nhận năm câu.</p>';
      return;
    }
    rqCur = rqQueue.shift(); rqAnswered=false;
  }
  const p = rqCur;
  box.innerHTML =
    '<div class="lb-lab">Còn ' + (rqQueue.length + 1) + ' câu • ' + (p.id.endsWith('#core')?'Cốt lõi cập nhật':'Kho cũ – tham khảo') + ' · bài ' + (p.from || "?") + '</div>' +
    '<div class="qz-q" style="margin-bottom:10px">' + p.q + '</div>' +
    p.opts.map((o, i) => '<button type="button" class="rq-opt" data-i="' + i + '">' + o + '</button>').join("") +
    '<div class="qz-why" id="rqWhy">' + p.why + '</div>';
  box.querySelectorAll(".rq-opt").forEach(l => l.addEventListener("click", () => rqAnswer(parseInt(l.dataset.i, 10))));
}
function rqAnswer(i){
  if(!rqCur||rqAnswered)return;rqAnswered=true;
  const p = rqCur, box = document.getElementById("rqBox");
  const labels = [...box.querySelectorAll(".rq-opt")];
  labels.forEach(l => {l.disabled=true;l.style.pointerEvents="none";});
  const ok = i === p.ans;
  labels[i].classList.add(ok ? "right" : "wrong");
  if(!ok) labels[p.ans].classList.add("right");
  document.getElementById("rqWhy").classList.add("show");
  const r = RQ[p.id] || { n:0, w:0, streak:0 };
  r.n++; if(ok){ r.streak++; rqRight++; } else { r.w++; r.streak = 0; }
  RQ[p.id] = r; DB.set("rq", RQ); rqStats();

  const next = document.createElement("button");
  next.className = "btn btn-run"; next.style.cssText = "margin-top:12px;padding:9px 18px";
  next.textContent = rqQueue.length ? "Câu tiếp theo →" : "Xem kết quả lượt này";
  next.onclick = () => {
    if(!rqQueue.length){
      const n = 5;
      box.innerHTML = '<div style="text-align:center;padding:8px 0">' +
        '<div class="stat-num" style="font-size:34px">' + rqRight + ' / ' + n + '</div>' +
        '<p style="color:var(--muted);margin:6px 0 0">' +
        (rqRight === n ? "Đúng hết. Câu sai cũ đang mờ dần." :
         rqRight >= 3 ? "Ổn. Những câu vừa sai sẽ quay lại sớm." :
                        "Hơi thấp. Mở lại bài gốc của những câu vừa sai, đừng chỉ đoán tiếp.") +
        "</p></div>";
      rqCur = null;
      return;
    }
    rqCur = null; rqRender();
  };
  box.appendChild(next);next.focus();
}
(function(){
  const s = document.getElementById("rqStart");
  if(!s) return;
  document.getElementById("rqSource").addEventListener("change",()=>{rqQueue=[];rqCur=null;rqRender();});
  s.addEventListener("click", () => { rqQueue = rqPick(5); rqCur = null; rqRight = 0; rqRender(); });
  document.getElementById("rqWipe").addEventListener("click", () => {
    if(!confirm("Xoá toàn bộ lịch sử ôn nhanh?")) return;
    RQ = {}; DB.set("rq", RQ); rqStats(); rqQueue = []; rqCur = null; rqRender();
  });
  rqStats(); rqRender();
})();

/* ============================================================
   KHUNG KẾ HOẠCH THÁNG 2
   ============================================================ */
let M2 = asObject(DB.get("m2", {}));
function renderM2(){
  const gate = document.getElementById("m2Gate"), form = document.getElementById("m2Form");
  if(!gate) return;
  const doneDays = [...Array(TOTAL_DAYS)].filter((_, i) => DONE.has("d" + (i + 1))).length;
  const mins = Object.values(JOURNAL).reduce((s, j) => s + (j.m || 0), 0);
  const learned = Object.values(JOURNAL).filter(j => (j.m || 0) > 0).length;
  const score = REVIEW.filter(Boolean).length;

  if(doneDays < 25){
    gate.innerHTML = '<div class="note"><b>Chưa tới lúc.</b> Anh mới hoàn thành <b>' + doneDays + '/30</b> ngày. ' +
      'Trang này mở khi đạt <b>25 ngày</b> trở lên — vì trước đó chưa đủ số liệu để lập kế hoạch tử tế.' +
      '<p style="margin:10px 0 0">Cứ đi tiếp. Còn ' + (25 - doneDays) + ' ngày nữa.</p></div>';
    form.style.display = "none";
    return;
  }
  gate.innerHTML = "";
  form.style.display = "block";
  document.getElementById("m2Days").textContent = learned;
  document.getElementById("m2Hours").textContent = (mins / 60).toFixed(1) + "h";
  document.getElementById("m2PerWeek").textContent = (mins / 60 / 4.3).toFixed(1) + "h";
  document.getElementById("m2Score").textContent = score + "/13";

  let cls = "note", txt = "";
  if(score >= 11) txt = "<b>Nền tảng tốt hơn mong đợi.</b> Tháng 2 tăng độ khó: bắt đầu Python cơ bản song song, và làm khoá n8n Level One. Giữ nguyên số giờ.";
  else if(score >= 7) txt = "<b>Bình thường và hoàn toàn chấp nhận được.</b> Tháng 2 lặp lại mô hình tháng 1, dồn vào hai hạng mục yếu nhất. Chưa thêm môn mới. Mục tiêu: nâng số ngày học lên 26/30.";
  else if(score >= 4){ cls = "warn"; txt = "<b>Vấn đề nằm ở hệ thống, không phải năng lực.</b> Tháng 2 cắt bớt: chỉ giữ tiếng Anh và n8n, bỏ SQL và marketing. Đặt lại giờ học vào khung giờ khác trong ngày."; }
  else { cls = "warn"; txt = "<b>Cần nghĩ thật.</b> Hoặc quỹ thời gian không khả thi — thì hạ xuống 30 phút mỗi ngày và kéo dài lộ trình. Hoặc hướng đi không hợp — thì biết bây giờ vẫn tốt hơn biết sau hai năm."; }
  const gioThat = (mins / 60 / 4.3).toFixed(1);
  document.getElementById("m2Advice").innerHTML =
    '<div class="' + cls + '">' + txt +
    '<p style="margin:10px 0 0">Thực tế tháng 1 anh học <b>' + gioThat + ' giờ/tuần</b>. ' +
    'Đề xuất cho tháng 2: <b>' + Math.max(3, Math.round(gioThat * 10) / 10) + ' giờ/tuần</b> — bằng hoặc thấp hơn một chút so với thực tế, để đạt được thay vì lại trượt.</p></div>';

  form.querySelectorAll(".m2i").forEach(i => {
    i.value = M2[i.dataset.k] || "";
    i.oninput = () => { M2[i.dataset.k] = i.value; DB.set("m2", M2); };
  });
}

/* ============================================================
   XUẤT NHẬT KÝ RA BẢN XEM ĐƯỢC
   ============================================================ */
function exportReadable(){
  const rows = [];
  let mins = 0, days = 0;
  for(let n = 1; n <= TOTAL_ALL; n++){
    const j = JOURNAL[n] || {};
    if(j.m) { mins += j.m; days++; }
    rows.push({ n, m: j.m || 0, note: j.n || "", done: DONE.has("d" + n) });
  }
  const max = Math.max(60, ...rows.map(r => r.m));
  const bars = rows.map(r => {
    const h = Math.round(r.m / max * 110);
    return '<rect x="' + ((r.n - 1) * 22) + '" y="' + (118 - h) + '" width="16" height="' + Math.max(h, 2) +
           '" rx="3" fill="' + (r.m >= 45 ? "#12A594" : r.m > 0 ? "#8ACFC6" : "#DBE3E9") + '"></rect>' +
           (r.n % 5 === 0 || r.n === 1 ? '<text x="' + ((r.n - 1) * 22 + 8) + '" y="134" text-anchor="middle" font-size="10" fill="#8899A8">' + r.n + '</text>' : "");
  }).join("");
  const esc = s => String(s).replace(/[<>&]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;" }[c]));
  const score = REVIEW.filter(Boolean).length;
  const html = '<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Nhật ký 90 ngày — Trạm 30</title><style>' +
    'body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;max-width:820px;margin:32px auto;padding:0 18px;color:#16202B;line-height:1.65}' +
    'h1{font-size:26px;margin:0 0 4px}.sub{color:#5B7186;margin:0 0 22px;font-size:14px}' +
    '.st{display:flex;gap:12px;flex-wrap:wrap;margin:0 0 24px}' +
    '.st div{flex:1;min-width:120px;border:1px solid #DBE3E9;border-radius:10px;padding:12px 14px}' +
    '.st b{display:block;font-size:24px;color:#0C1F2A}.st span{font-size:11.5px;text-transform:uppercase;letter-spacing:1px;color:#8899A8}' +
    'table{width:100%;border-collapse:collapse;font-size:14px}' +
    'th{background:#0C1F2A;color:#fff;text-align:left;padding:8px 10px;font-size:12.5px}' +
    'td{padding:7px 10px;border-top:1px solid #EAF0F4;vertical-align:top}' +
    'tr.no td{color:#A6B4C0}.d{font-family:ui-monospace,monospace;font-weight:600;width:40px}' +
    '.chart{border:1px solid #DBE3E9;border-radius:10px;padding:16px;margin:0 0 24px;overflow-x:auto}' +
    '@media print{body{margin:0}.chart,table{page-break-inside:avoid}}' +
    '</style></head><body>' +
    '<h1>Nhật ký 90 ngày</h1><p class="sub">Trạm 30 — Lộ trình AI Marketing Engineer · xuất ngày ' +
    new Date().toLocaleDateString("vi-VN") + '</p>' +
    '<div class="st"><div><span>Ngày đã học</span><b>' + days + ' / 90</b></div>' +
    '<div><span>Tổng thời gian</span><b>' + (mins / 60).toFixed(1) + ' giờ</b></div>' +
    '<div><span>Trung bình</span><b>' + (days ? Math.round(mins / days) : 0) + ' phút</b></div>' +
    '<div><span>Tự chấm</span><b>' + score + ' / 13</b></div></div>' +
    '<div class="chart"><svg width="' + (TOTAL_ALL * 22) + '" height="142">' + bars + '</svg></div>' +
    '<table><thead><tr><th>Ngày</th><th>Phút</th><th>Đã làm gì / tắc ở đâu</th><th>Xong</th></tr></thead><tbody>' +
    rows.map(r => '<tr class="' + (r.m ? "" : "no") + '"><td class="d">' + r.n + '</td><td>' +
      (r.m || "—") + '</td><td>' + esc(r.note) + '</td><td>' + (r.done ? "✓" : "") + '</td></tr>').join("") +
    '</tbody></table></body></html>';

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([html], { type:"text/html;charset=utf-8" }));
  a.download = "nhat-ky-90-ngay-" + new Date().toISOString().slice(0, 10) + ".html";
  a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast("Đã tạo bản xem được — mở bằng trình duyệt hoặc gửi cho người khác");
}
(function(){
  const b = document.getElementById("jrExport2");
  if(b) b.addEventListener("click", exportReadable);
})();

/* ============================================================
   DÙNG ĐƯỢC BẰNG BÀN PHÍM
   Các phần bấm được đang là thẻ div thường. Gán vai trò nút, cho tab tới,
   và nhận phím Enter / Space giống nút thật.
   ============================================================ */
function makeKeyboardReady(root){
  const SEL = ".pnode, .nsn, .dsn, .jx-row.leaf, .fc-stage";
  (root || document).querySelectorAll(SEL).forEach(el => {
    if(el.dataset.kb) return;
    el.dataset.kb = "1";
    el.setAttribute("tabindex", "0");
    if(!el.getAttribute("role")) el.setAttribute("role", "button");
    el.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " " || e.key === "Spacebar"){
        e.preventDefault(); el.click();
      }
    });
  });
}
makeKeyboardReady();
// các phần vẽ lại động thì gán lại sau mỗi lần vẽ
(function(){
  const mo = new MutationObserver(muts => {
    for(const m of muts) if(m.addedNodes.length){ makeKeyboardReady(); break; }
  });
  mo.observe(document.body, { childList:true, subtree:true });
})();

/* ============================================================
   HƯỚNG DẪN 60 GIÂY
   ============================================================ */
const TOUR = [
  { el:"#sq",        t:"Tìm bất cứ thứ gì",
    d:"Gõ vào đây để tìm trong toàn bộ giáo trình. Gõ không dấu vẫn ra — “chung chi” tìm được “chứng chỉ”. Bấm Ctrl+K ở bất kỳ đâu để nhảy vào ô này." },
  { el:"#sbResume",  t:"Mỗi ngày bấm một nút này",
    d:"Nút cam luôn nằm ở đây, tự tính ngày anh đang dở tới đâu. Mở app buổi sáng, bấm, vào đúng bài. Không phải nhớ hôm nay tới đâu." },
  { el:"#sbVal",  t:"Tiến độ giáo trình gốc",
    d:"Thanh này theo dõi 90 ngày của giáo trình cũ. Tiến độ học cốt lõi mới nằm trên trang Tổng quan." },
  { el:"#sbStuck",   t:"Tắc quá 20 phút thì bấm đây",
    d:"Đừng ngồi mò ba tiếng. Trang này phân loại năm kiểu tắc — kỹ thuật, tiếng Anh, không biết hỏi ai, mất động lực, muốn bỏ cuộc — và chỉ lối thoát cho từng kiểu." },
];
(function(){
  const wrap = document.getElementById("tour");
  if(!wrap) return;
  const hole = wrap.querySelector(".tour-hole");
  const card = wrap.querySelector(".tour-card");
  const stepEl = wrap.querySelector(".tour-step");
  const h4 = wrap.querySelector("h4");
  const p = wrap.querySelector("p");
  const bNext = wrap.querySelector(".tour-next");
  const bPrev = wrap.querySelector(".tour-prev");
  let i = 0;

  function place(){
    const s = TOUR[i];
    const el = document.querySelector(s.el);
    stepEl.textContent = "Bước " + (i + 1) + " / " + TOUR.length;
    h4.textContent = s.t; p.textContent = s.d;
    bPrev.style.visibility = i ? "visible" : "hidden";
    bNext.textContent = i === TOUR.length - 1 ? "Bắt đầu thôi ✓" : "Tiếp →";

    let r = { top:0, left:0, width:0, height:0 };
    if(el && el.getBoundingClientRect) r = el.getBoundingClientRect();
    const has = r.width > 0 && r.height > 0;
    if(has){
      hole.style.display = "block";
      hole.style.top = (r.top - 6) + "px"; hole.style.left = (r.left - 6) + "px";
      hole.style.width = (r.width + 12) + "px"; hole.style.height = (r.height + 12) + "px";
      const below = r.bottom + 16;
      const fits = below + 190 < window.innerHeight;
      card.style.top = (fits ? below : Math.max(16, r.top - 200)) + "px";
      card.style.left = Math.min(Math.max(12, r.left), Math.max(12, window.innerWidth - 360)) + "px";
    }else{
      hole.style.display = "none";
      card.style.top = "50%"; card.style.left = "50%";
      card.style.transform = "translate(-50%,-50%)";
    }
  }
  function open(){
    i = 0; wrap.classList.add("on");
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("scrim").classList.add("show");
    showLesson("start"); place();
    setTimeout(() => { bNext.focus(); }, 30);
  }
  function close(){
    wrap.classList.remove("on");
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("scrim").classList.remove("show");
    DB.set("tour", 1);
  }
  bNext.addEventListener("click", () => { if(i === TOUR.length - 1) return close(); i++; place(); });
  bPrev.addEventListener("click", () => { if(i > 0){ i--; place(); } });
  wrap.querySelector(".tour-skip").addEventListener("click", close);
  wrap.addEventListener("keydown", e => {
    if(e.key === "Escape") close();
    if(e.key === "ArrowRight") bNext.click();
    if(e.key === "ArrowLeft") bPrev.click();
  });
  window.addEventListener("resize", () => { if(wrap.classList.contains("on")) place(); });
  const start = document.getElementById("tourStart");
  if(start) start.addEventListener("click", open);
  window.__openTour = open;
  // lần đầu mở app thì tự chạy
  // AIM dashboard provides onboarding; legacy tour no longer auto-opens.
})();

/* ============================================================
   TRANG TỔNG KẾT 30 NGÀY
   ============================================================ */
function renderDone(){
  const gate = document.getElementById("doneGate"), body = document.getElementById("doneBody");
  if(!gate) return;
  const n = [...Array(TOTAL_DAYS)].filter((_, i) => DONE.has("d" + (i + 1))).length;
  if(n < TOTAL_DAYS){
    gate.innerHTML = '<div class="note"><b>Chưa tới lúc.</b> Trang này mở khi anh hoàn thành đủ <b>30/30</b> ngày. ' +
      'Hiện tại: <b>' + n + '/30</b> — còn ' + (TOTAL_DAYS - n) + ' ngày nữa.' +
      '<p style="margin:10px 0 0">Đừng đánh dấu bừa cho đủ. Trang này chỉ có ý nghĩa nếu ba mươi ngày kia là thật.</p></div>';
    body.style.display = "none";
    return;
  }
  gate.innerHTML = "";
  body.style.display = "block";
  const rail = document.getElementById("pipeDone");
  rail.innerHTML = "";
  for(let i = 1; i <= TOTAL_DAYS; i++){
    const b = document.createElement("button");
    b.className = "pnode done"; b.textContent = i; b.title = "Ngày " + i;
    b.addEventListener("click", () => showLesson("d" + i));
    rail.appendChild(b);
    if(i < TOTAL_DAYS){ const w = document.createElement("i"); w.className = "pwire on"; rail.appendChild(w); }
  }
  const mins = Object.values(JOURNAL).reduce((s, j) => s + (j.m || 0), 0);
  const learned = Object.values(JOURNAL).filter(j => (j.m || 0) > 0).length;
  const known = Object.keys(CARDS).filter(k => CARDS[k].b === 2).length;
  document.getElementById("dnDays").textContent = learned;
  document.getElementById("dnHours").textContent = (mins / 60).toFixed(1) + "h";
  document.getElementById("dnCards").textContent = known;
  document.getElementById("dnScore").textContent = REVIEW.filter(Boolean).length + "/13";
}

/* ============================================================
   NHẮC SAO LƯU SAU MỖI 7 NGÀY
   ============================================================ */
function checkBackup(){
  const n = [...Array(TOTAL_ALL)].filter((_, i) => DONE.has("d" + (i + 1))).length;
  const milestone = Math.floor(n / 7) * 7;
  if(milestone < 7) return;
  if((DB.get("backupAt", 0)) >= milestone) return;
  const bar = document.getElementById("backupBar");
  if(!bar) return;
  bar.querySelector(".bk-t").textContent =
    "Anh đã xong " + n + " ngày. Dữ liệu chỉ nằm trong trình duyệt máy này — xoá lịch sử duyệt web là mất sạch.";
  bar.classList.add("on");
}
(function(){
  const bar = document.getElementById("backupBar");
  if(!bar) return;
  bar.querySelector(".bk-go").addEventListener("click", () => {
    bar.classList.remove("on");
    showLesson("tjournal");
    setTimeout(() => { const b = document.getElementById("jrExport"); if(b) b.click(); }, 350);
  });
  bar.querySelector(".bk-later").addEventListener("click", () => {
    const n = [...Array(TOTAL_ALL)].filter((_, i) => DONE.has("d" + (i + 1))).length;
    DB.set("backupAt", Math.floor(n / 7) * 7);
    bar.classList.remove("on");
  });
})();

/* ============================================================
   BÁO KHI MẤT MẠNG
   ============================================================ */
(function(){
  const bar = document.getElementById("offBar");
  if(!bar) return;
  function paint(){
    const off = (typeof navigator !== "undefined") && navigator.onLine === false;
    bar.classList.toggle("on", off);
  }
  window.addEventListener("online", paint);
  window.addEventListener("offline", paint);
  bar.querySelector(".off-x").addEventListener("click", () => bar.classList.remove("on"));
  paint();
})();

/* ============================================================
   TỔNG KẾT THÁNG 2 · KẾ HOẠCH THÁNG 3
   ============================================================ */
function renderM2Done(){
  const gate = document.getElementById("m2dGate"), bd = document.getElementById("m2dBody");
  if(!gate) return;
  const n = [...Array(60)].filter((_, i) => DONE.has("d" + (i + 1))).length;
  if(n < 60){
    gate.innerHTML = '<div class="note"><b>Chưa tới lúc.</b> Trang này mở khi anh hoàn thành đủ <b>60/60</b> ngày. ' +
      'Hiện tại: <b>' + n + '/60</b> — còn ' + (60 - n) + ' ngày nữa.</div>';
    bd.style.display = "none"; return;
  }
  gate.innerHTML = ""; bd.style.display = "block";
  const rail = document.getElementById("pipeAll");
  rail.innerHTML = "";
  for(let i = 1; i <= 60; i++){
    const b = document.createElement("button");
    b.className = "pnode done"; b.textContent = i; b.title = "Ngày " + i;
    b.addEventListener("click", () => showLesson("d" + i));
    rail.appendChild(b);
    if(i < 60){ const w = document.createElement("i"); w.className = "pwire on"; rail.appendChild(w); }
  }
  const mins = Object.values(JOURNAL).reduce((s, j) => s + (j.m || 0), 0);
  let best = 0, cur = 0;
  for(let i = 1; i <= 60; i++){ if((JOURNAL[i] || {}).m > 0){ cur++; best = Math.max(best, cur); } else cur = 0; }
  document.getElementById("adDays").textContent = Object.values(JOURNAL).filter(j => (j.m || 0) > 0).length;
  document.getElementById("adHours").textContent = (mins / 60).toFixed(1) + "h";
  document.getElementById("adCards").textContent = Object.keys(CARDS).filter(k => CARDS[k].b === 2).length;
  document.getElementById("adStreak").textContent = best;
}

const M3_WEEKS = [
  ["w9",  "Tuần 9 · ngày 61–67",  "Quy trình thứ hai — tự dựng"],
  ["w10", "Tuần 10 · ngày 68–74", "Python sâu hơn — đọc ghi file"],
  ["w11", "Tuần 11 · ngày 75–81", "Làm cho người khác"],
  ["w12", "Tuần 12 · ngày 82–88", "Nói được, không chỉ viết được"],
];
let M3 = asObject(DB.get("m3", {}));
function renderM3(){
  const gate = document.getElementById("m3Gate"), box = document.getElementById("m3Planner");
  if(!gate) return;
  const n = [...Array(60)].filter((_, i) => DONE.has("d" + (i + 1))).length;
  gate.innerHTML = n < 55
    ? '<div class="warn"><b>⚠️ Đọc trước thì được, nhưng chưa nên bắt đầu.</b> Anh mới hoàn thành <b>' + n +
      '/60</b> ngày. Tháng 3 giả định anh đã có quy trình thật đang chạy và nền Python cơ bản.</div>'
    : "";
  if(!box) return;
  box.innerHTML = M3_WEEKS.map(w =>
    '<div style="margin-bottom:18px">' +
    '<div class="lb-lab">' + w[1] + ' — ' + w[2] + '</div>' +
    '<textarea class="m3i" data-k="' + w[0] + '" rows="3" placeholder="Anh định chia bảy ngày này thế nào? Ví dụ: T2 khảo sát · T3–T4 dựng · T5 test · T6 gia cố · T7 viết lại · CN nghỉ" ' +
    'style="width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:15px;line-height:1.6;resize:vertical"></textarea>' +
    '</div>').join("") +
    '<div style="font-size:14px;color:var(--muted)"><i>Tự lưu khi anh gõ xong. Cuối tháng 3, đọc lại xem kế hoạch và thực tế lệch nhau bao nhiêu — đó là cách năng lực ước lượng hình thành.</i></div>';
  box.querySelectorAll(".m3i").forEach(t => {
    t.value = M3[t.dataset.k] || "";
    t.oninput = () => { M3[t.dataset.k] = t.value; DB.set("m3", M3); };
  });
}

/* ============================================================
   TRANG TOÀN CẢNH
   ============================================================ */
const MAP_GROUPS = [
  { t:"🧭 Bắt đầu",              ids:["start","rules","words"] },
  { t:"🧠 Kiến thức nền",        ids:["k1","k2","k3","k4","k5","k6","k7","k8"] },
  { t:"📅 Tháng 1 · Tuần 1",     ids:["d1","d2","d3","d4","d5","d6","d7"] },
  { t:"Tuần 2",                  ids:["d8","d9","d10","d11","d12","d13","d14"] },
  { t:"Tuần 3",                  ids:["d15","d16","d17","d18","d19","d20","d21"] },
  { t:"Tuần 4",                  ids:["d22","d23","d24","d25","d26","d27","d28","d29","d30"] },
  { t:"🏁 Chốt tháng 1",         ids:["done","m2"] },
  { t:"📅 Tháng 2 · Tuần 5",     ids:["m2start","d31","d32","d33","d34","d35","d36","d37"] },
  { t:"Tuần 6",                  ids:["d38","d39","d40","d41","d42","d43","d44"] },
  { t:"Tuần 7",                  ids:["d45","d46","d47","d48","d49","d50","d51"] },
  { t:"Tuần 8",                  ids:["d52","d53","d54","d55","d56","d57","d58","d59","d60"] },
  { t:"🏁 Chốt tháng 2",         ids:["m2done"] },
  { t:"📅 Tháng 3 · Tuần 9",     ids:["m3start","d61","d62","d63","d64","d65","d66","d67"] },
  { t:"Tuần 10",                 ids:["d68","d69","d70","d71","d72","d73","d74"] },
  { t:"Tuần 11",                 ids:["d75","d76","d77","d78","d79","d80","d81"] },
  { t:"Tuần 12",                 ids:["d82","d83","d84","d85","d86","d87","d88","d89","d90"] },
  { t:"📅 Tháng 4 · theo tuần",  ids:["w13","w14","w15","w16"] },
  { t:"📅 Tháng 5",              ids:["w17","w18","w19","w20"] },
  { t:"📅 Tháng 6",              ids:["w21","w22","w23","w24"] },
  { t:"💼 Giai đoạn 2 · tháng 7–14", ids:["ph2","m7","m8","m9","m10","m11","m12","m1314"] },
  { t:"💼 Công cụ thực chiến",   ids:["tsurvey","tscope","tprice","thandover"] },
  { t:"🔓 Giai đoạn 3 · tháng 15–26", ids:["ph3","q15","q18","q21","q24","tskill"] },
  { t:"🌏 Giai đoạn 4 · tháng 27–36", ids:["ph4"] },
  { t:"🗺️ Đường dài",            ids:["m46","map"] },
  { t:"📕 Tra cứu",              ids:["book","stuck","restart","nguon"] },
  { t:"🛠️ Công cụ",              ids:["tcards","tquiz","tjournal","ttimer","treview"] },
];
function renderMap(){
  const box = document.getElementById("mapBody");
  if(!box) return;
  const label = {};
  document.querySelectorAll(".lesson-link").forEach(b => {
    label[b.dataset.goto] = b.textContent.replace(/[✓]/g, "").trim().replace(/^\S+\s/, "");
  });
  const now = todayDay();
  box.innerHTML = MAP_GROUPS.map(g => {
    const cells = g.ids.filter(id => document.getElementById(id)).map(id => {
      const done = DONE.has(id);
      const isDay = /^d\d+$/.test(id);
      const isNow = isDay && parseInt(id.slice(1), 10) === now && !done;
      const num = isDay ? id.slice(1) : (label[id] || id).slice(0, 2);
      return '<button class="mp-cell' + (done ? " done" : "") + (isNow ? " now" : "") + '" data-go="' + id + '" ' +
             'title="' + (label[id] || id).replace(/"/g, "") + '">' +
             '<b>' + num + '</b><span>' + (label[id] || id) + '</span></button>';
    }).join("");
    return '<div class="mp-group"><div class="mp-t">' + g.t + '</div><div class="mp-row">' + cells + '</div></div>';
  }).join("");
  box.querySelectorAll(".mp-cell").forEach(b => b.addEventListener("click", () => showLesson(b.dataset.go)));

  const n = [...Array(TOTAL_ALL)].filter((_, i) => DONE.has("d" + (i + 1))).length;
  const kn = ["k1","k2","k3","k4","k5","k6"].filter(k => DONE.has(k)).length;
  const mins = Object.values(JOURNAL).reduce((s, j) => s + (j.m || 0), 0);
  document.getElementById("mpAll").textContent = n;
  document.getElementById("mpNow").textContent = n >= TOTAL_ALL ? "✓" : "Ngày " + now;
  document.getElementById("mpK").textContent = kn;
  document.getElementById("mpH").textContent = (mins / 60).toFixed(1) + "h";
}

/* ============================================================
   IN CẢ KHOÁ
   ============================================================ */
(function(){
  const b = document.getElementById("btnPrintAll");
  if(!b) return;
  b.addEventListener("click", () => {
    if(!confirm("In toàn bộ khoá học ra giấy hoặc lưu thành PDF?\n\nHơn 80 trang — trong hộp thoại in, chọn “Save as PDF” để lưu file thay vì in thật.")) return;
    document.body.classList.add("print-all");
    const shown = document.querySelector(".lesson.show");
    document.querySelectorAll(".lesson").forEach(s => s.classList.add("show"));
    const cleanup = () => {
      document.body.classList.remove("print-all");
      document.querySelectorAll(".lesson").forEach(s => s.classList.remove("show"));
      if(shown) shown.classList.add("show");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    setTimeout(() => { window.print(); setTimeout(cleanup, 1500); }, 120);
  });
})();

(function(){ var b=document.getElementById("sbMap"); if(b) b.onclick=function(){ showLesson("roadmap"); document.getElementById("legacyCatalog")?.scrollIntoView({block:"start"}); }; })();

/* ============================================================
   CÔNG CỤ BÁO GIÁ (giai đoạn 2)
   ============================================================ */
let PC = {gio:8,muc:150000,kho:"vua",bt:false,...asObject(DB.get("pc", {}))};
function renderPrice(){
  const box = document.getElementById("pcBox");
  if(!box) return;
  if(!box.dataset.on){
    box.dataset.on = "1";
    box.innerHTML =
      '<div class="lb-lab">1. Ước lượng số giờ dựng (chỉ tính lúc ngồi làm)</div>' +
      '<input class="pci" data-k="gio" type="number" min="1" max="200" step="1">' +
      '<div class="lb-lab" style="margin-top:16px">2. Mức anh muốn nhận mỗi giờ (VNĐ)</div>' +
      '<input class="pci" data-k="muc" type="number" min="10000" max="5000000" step="10000">' +
      '<div class="pc-hint">Người mới ở Việt Nam thường bắt đầu quanh 100.000–250.000đ/giờ. Ca đầu cứ để thấp.</div>' +
      '<div class="lb-lab" style="margin-top:16px">3. Độ phức tạp</div>' +
      '<div class="pc-row">' +
        '<button class="tm-btn pck" data-v="de">Dễ — đã làm việc tương tự</button>' +
        '<button class="tm-btn pck" data-v="vua">Vừa — quen công cụ, mới bài toán</button>' +
        '<button class="tm-btn pck" data-v="kho">Khó — dữ liệu bẩn hoặc hệ thống lạ</button>' +
      '</div>' +
      '<label class="ev-tg" style="background:none;padding:12px 0 0;color:var(--ink)">' +
        '<input type="checkbox" class="pcb"><span><span class="tt" style="color:var(--ink)">Có kèm gói bảo trì hằng tháng</span>' +
        '<br><span class="td" style="color:var(--muted)">Trông coi và sửa khi hỏng — nguồn thu đều, khác thu nhập theo dự án</span></span></label>' +
      '<div class="pc-out" id="pcOut"></div>';
    box.querySelectorAll(".pci").forEach(i => i.addEventListener("input", () => {
      PC[i.dataset.k] = parseInt(i.value, 10) || 0; DB.set("pc", PC); calcPrice();
    }));
    box.querySelectorAll(".pck").forEach(b => b.addEventListener("click", () => {
      PC.kho = b.dataset.v; DB.set("pc", PC); calcPrice();
    }));
    box.querySelector(".pcb").addEventListener("change", e => {
      PC.bt = e.target.checked; DB.set("pc", PC); calcPrice();
    });
  }
  box.querySelectorAll(".pci").forEach(i => i.value = PC[i.dataset.k]);
  box.querySelector(".pcb").checked = !!PC.bt;
  calcPrice();
}
function calcPrice(){
  const out = document.getElementById("pcOut");
  if(!out) return;
  const box = document.getElementById("pcBox");
  box.querySelectorAll(".pck").forEach(b => b.classList.toggle("on", b.dataset.v === PC.kho));
  const gio = Math.max(1, PC.gio || 0), muc = Math.max(0, PC.muc || 0);
  const heSo = { de:1, vua:1.25, kho:1.6 }[PC.kho] || 1.25;
  const gioThat = Math.round(gio * 2);                 // nhân đôi vì ai cũng ước thiếu
  const nen = Math.round(gioThat * muc * heSo / 100000) * 100000;
  const thap = Math.round(nen * 0.8 / 100000) * 100000;
  const cao  = Math.round(nen * 1.3 / 100000) * 100000;
  const bt   = Math.round(nen * 0.08 / 50000) * 50000;
  const vnd = n => n.toLocaleString("vi-VN") + "đ";
  out.innerHTML =
    '<div class="pc-big">' + vnd(nen) + '</div>' +
    '<div class="pc-range">Khoảng hợp lý: <b>' + vnd(thap) + '</b> — <b>' + vnd(cao) + '</b></div>' +
    (PC.bt ? '<div class="pc-bt">Gói bảo trì đề xuất: <b>' + vnd(Math.max(bt, 200000)) + '</b>/tháng</div>' : "") +
    '<div class="pc-why">' +
      '<b>Tính thế nào:</b> ' + gio + ' giờ ước lượng → <b>' + gioThat + ' giờ</b> sau khi nhân đôi ' +
      '→ × ' + vnd(muc) + '/giờ → × ' + heSo + ' (độ phức tạp) → làm tròn.' +
      '<br><b>Nói với khách:</b> một con số trọn gói, không kể chi tiết cách tính. ' +
      'Báo theo giờ thì anh bị phạt vì làm nhanh.' +
    '</div>' +
    (nen < 500000
      ? '<div class="pc-warn">⚠️ Dưới 500.000đ thì phần lớn công sức nằm ở khảo sát và bàn giao chứ không phải dựng. Cân nhắc gộp thêm việc, hoặc nhận như một ca xây quan hệ chứ đừng coi là nguồn thu.</div>'
      : "");
}

/* ============================================================
   THANG ĐO NĂNG LỰC (giai đoạn 3+)
   ============================================================ */
const SK_ROWS = [
  ["auto", "Tự động hoá", [
    "Làm theo hướng dẫn được",
    "Tự dựng quy trình đơn giản",
    "Dựng quy trình có xử lý lỗi và giám sát, không cần tra cứu liên tục",
    "Thiết kế hệ thống nhiều thành phần, chịu được hỏng cục bộ",
    "Người khác hỏi ý kiến mình về kiến trúc"]],
  ["py", "Python", [
    "Chưa viết được",
    "Sửa được code có sẵn, viết được script ngắn",
    "Viết được chương trình nhiều file có cấu trúc",
    "Viết kiểm thử, đọc hiểu code người khác, đóng góp nguồn mở",
    "Thiết kế được thư viện cho người khác dùng"]],
  ["debug", "Tìm và sửa lỗi", [
    "Tắc là bí",
    "Đọc được thông báo lỗi, biết tìm ở đâu",
    "Đi ngược từ triệu chứng tới nguyên nhân gốc một cách có hệ thống",
    "Sửa được lỗi trong hệ thống mình không viết",
    "Đoán được nguyên nhân trước khi mở log"]],
  ["data", "Dữ liệu", [
    "Đọc được bảng tính",
    "Viết được SQL cơ bản, biết dữ liệu bẩn là gì",
    "Thiết kế bảng, viết truy vấn phức tạp, xử lý dữ liệu lớn",
    "Thiết kế được cơ sở dữ liệu cho hệ thống nhiều thành phần",
    "Tối ưu được hệ thống dữ liệu đang chậm"]],
  ["ai", "AI trong hệ thống", [
    "Dùng chat bằng tay",
    "Gọi được AI trong quy trình, ép khuôn đầu ra",
    "Có bộ eval, đo được chất lượng, biết khi nào KHÔNG nên dùng AI",
    "Thiết kế được hệ thống AI có kiểm soát chi phí và chất lượng",
    "Xây được quy trình đánh giá cho người khác dùng"]],
  ["eng", "Tiếng Anh", [
    "Phải dịch mới hiểu",
    "Đọc tài liệu chậm nhưng không cần dịch",
    "Đọc trôi chảy, viết được mô tả kỹ thuật",
    "Trao đổi công việc qua văn bản thoải mái, nói được về dự án",
    "Họp và phản biện bằng tiếng Anh không chuẩn bị trước"]],
  ["biz", "Làm việc với khách", [
    "Chưa làm cho ai",
    "Làm miễn phí cho người quen",
    "Khảo sát, chốt phạm vi, báo giá, giao đúng hạn",
    "Chọn được khách, từ chối được việc, có nguồn thu bảo trì",
    "Khách tìm tới mình thay vì mình đi tìm"]],
];
let SK = asObject(DB.get("sk", {}));
function renderSkill(){
  const box = document.getElementById("skBox");
  if(!box) return;
  if(!box.dataset.on){
    box.dataset.on = "1";
    box.innerHTML = SK_ROWS.map(r =>
      '<div class="sk-row" data-k="' + r[0] + '">' +
        '<div class="sk-name">' + r[1] + '</div>' +
        '<div class="sk-lv">' + r[2].map((t, i) =>
          '<button class="sk-b" data-v="' + (i + 1) + '" title="' + t.replace(/"/g, "") + '">' +
          '<b>' + (i + 1) + '</b><span>' + t + '</span></button>').join("") + '</div>' +
      '</div>').join("") +
      '<div class="sk-sum" id="skSum"></div>';
    box.querySelectorAll(".sk-b").forEach(b => b.addEventListener("click", () => {
      const k = b.closest(".sk-row").dataset.k, v = parseInt(b.dataset.v, 10);
      SK[k] = (SK[k] === v) ? 0 : v;      // bấm lại để bỏ chọn
      DB.set("sk", SK); paintSkill();
    }));
  }
  paintSkill();
}
function paintSkill(){
  const box = document.getElementById("skBox");
  if(!box) return;
  box.querySelectorAll(".sk-row").forEach(row => {
    const v = SK[row.dataset.k] || 0;
    row.querySelectorAll(".sk-b").forEach(b => {
      const n = parseInt(b.dataset.v, 10);
      b.classList.toggle("on", n === v);
      b.classList.toggle("under", n < v);
    });
  });
  const vals = SK_ROWS.map(r => SK[r[0]] || 0);
  const done = vals.filter(v => v > 0);
  const sum = document.getElementById("skSum");
  if(!done.length){ sum.innerHTML = '<span class="sk-hint">Bấm vào mức tương ứng ở mỗi hàng.</span>'; return; }
  const tb = done.reduce((a, b) => a + b, 0) / done.length;   // chỉ tính trên mảng đã chấm
  const weak = SK_ROWS.filter(r => (SK[r[0]] || 0) > 0)
    .sort((a, b) => (SK[a[0]] || 0) - (SK[b[0]] || 0)).slice(0, 2).map(r => r[1]);
  let nx = "";
  if(tb < 2)      nx = "Nền đang hình thành. Đừng dàn đều — dồn vào <b>một</b> mảng yếu nhất cho tới khi lên mức 2.";
  else if(tb < 3) nx = "Đúng chỗ của giai đoạn 1–2. Mảng yếu nhất thường kéo lùi cả nhóm — ưu tiên nó.";
  else if(tb < 4) nx = "Đã qua trần no-code ở phần lớn mảng. Giờ giá trị nằm ở việc kéo mảng yếu nhất lên, không phải đẩy mảng mạnh nhất cao thêm.";
  else            nx = "Mức này đủ để nhắm thị trường quốc tế. Kiểm tra lại mảng <b>Tiếng Anh</b> và <b>Làm việc với khách</b> — kỹ thuật hiếm khi là thứ chặn ở đây.";
  sum.innerHTML =
    '<div class="sk-avg">Trung bình <b>' + tb.toFixed(1) + '</b> / 5' +
    '<span class="sk-n"> · trên ' + done.length + '/' + SK_ROWS.length + ' mảng đã chấm</span></div>' +
    (done.length < SK_ROWS.length
      ? '<div class="sk-weak" style="color:var(--pulse)">Còn ' + (SK_ROWS.length - done.length) +
        ' mảng chưa chấm — con số trên chỉ phản ánh phần đã chấm.</div>' : "") +
    '<div class="sk-weak">Hai mảng yếu nhất: <b>' + weak.join("</b>, <b>") + '</b></div>' +
    '<div class="sk-next">' + nx + '</div>';
}

/* ============================================================
   LUYỆN GIỮ PHẠM VI CÔNG VIỆC (K7)
   ============================================================ */
const SS_CASES = [
  { msg:"Em ơi, tiện thể làm luôn cho anh cái báo cáo theo tuần nữa nhé. Chắc cũng nhanh thôi mà.",
    note:"Đang giữa dự án làm báo cáo ngày. Yêu cầu mới sẽ tốn thêm khoảng 6 giờ.",
    opts:[
      { t:'"Dạ được ạ, em làm luôn."', ok:false,
        w:"<b>Hỏng.</b> Sáu giờ là gần một tuần làm việc của anh. \"Chắc cũng nhanh thôi\" là câu khách nói khi họ <b>không biết</b> nó tốn bao lâu — không phải khi họ đã cân nhắc." },
      { t:'"Cái đó ngoài phạm vi rồi ạ, em không làm được."', ok:false,
        w:"<b>Giữ được phạm vi nhưng mất điểm.</b> Không có ghi nhận, không có lối mở. Khách nghe thành \"không\" và sẽ ngại nhờ lần sau — kể cả việc trong phạm vi." },
      { t:'"Hay đấy ạ. Nằm ngoài phạm vi mình chốt nên em làm xong báo cáo ngày trước đã, rồi em báo giá riêng phần tuần nhé."', ok:true,
        w:"<b>Đúng.</b> Ghi nhận · đối chiếu văn bản · giữ hạn · mở đường cho việc tiếp. Khách thấy được lắng nghe mà anh không mất một tuần." },
    ]},
  { msg:"Chỗ tên cột em đặt là 'doanh_thu', anh muốn đổi thành 'Doanh thu' cho dễ đọc.",
    note:"Việc này tốn khoảng 10 phút và không đẩy lùi hạn.",
    opts:[
      { t:'"Dạ, em đổi ngay ạ."', ok:true,
        w:"<b>Đúng.</b> Ranh giới không nằm ở \"có trong phạm vi hay không\" mà ở <b>có đẩy lùi hạn hay không</b>. Cứng nhắc với việc mười phút chỉ làm mình trông khó tính." },
      { t:'"Cái này ngoài phạm vi, em báo giá riêng nhé."', ok:false,
        w:"<b>Sai hướng.</b> Áp dụng quy tắc máy móc. Mười phút mà bắt khách trả thêm thì anh tiết kiệm được chút thời gian và mất rất nhiều thiện chí." },
      { t:'"Để em ghi nhận, xong dự án mình bàn."', ok:false,
        w:"<b>Quá cứng cho việc nhỏ.</b> Hoãn một việc mười phút làm khách cảm thấy mọi yêu cầu đều bị đẩy đi. Dành cách nói này cho việc thật sự lớn." },
    ]},
  { msg:"Hệ thống chạy ra sai số rồi em. Đơn hôm qua 12 cái mà báo cáo ghi 9.",
    note:"Kiểm tra lại: đúng là lỗi của anh — bộ lọc loại nhầm ba đơn hợp lệ.",
    opts:[
      { t:'"Dạ em kiểm tra và sửa ngay, không tính thêm phí ạ."', ok:true,
        w:"<b>Đúng.</b> Đây là <b>lỗi của anh so với phạm vi đã hứa</b>, không phải việc mới. Sửa miễn phí, sửa nhanh, và nói rõ nguyên nhân. Nhầm hai thứ này là cách mất uy tín nhanh nhất." },
      { t:'"Cái này do dữ liệu bên anh bẩn ạ, em xử lý thêm thì tính phí."', ok:false,
        w:"<b>Sai.</b> Dữ liệu bẩn là thứ anh phải lường trước — bài K6 nói rõ. Đổ lỗi cho dữ liệu khi bộ lọc mình viết sai là mất uy tín ngay lập tức." },
      { t:'"Em ghi nhận, sẽ sửa ở lần cập nhật sau."', ok:false,
        w:"<b>Sai mức độ khẩn.</b> Báo cáo đang cho ra số sai — khách có thể đang ra quyết định dựa trên đó. Lỗi ảnh hưởng tới tính đúng đắn phải sửa ngay." },
    ]},
  { msg:"Bên anh vừa đổi sang phần mềm bán hàng khác. Em chỉnh lại hệ thống cho khớp nhé.",
    note:"Nguồn dữ liệu đổi hoàn toàn. Gần như phải làm lại từ đầu.",
    opts:[
      { t:'"Dạ em chỉnh lại ạ."', ok:false,
        w:"<b>Hỏng nặng.</b> \"Chỉnh lại\" nghe nhỏ nhưng đổi nguồn dữ liệu nghĩa là làm lại toàn bộ phần lấy và làm sạch. Gật ở đây là nhận một dự án mới với giá bằng không." },
      { t:'"Đổi nguồn dữ liệu là làm lại phần lớn hệ thống ạ. Em khảo sát nguồn mới rồi báo giá cho anh nhé — phần đang chạy em vẫn giữ nguyên cho tới khi bên anh chuyển hẳn."', ok:true,
        w:"<b>Đúng.</b> Nói rõ quy mô thật · đề xuất bước tiếp theo hợp lý · trấn an rằng thứ đang chạy không bị bỏ. Đây cũng là một cơ hội bán hàng, không phải rắc rối." },
      { t:'"Vậy mình huỷ dự án cũ nhé anh."', ok:false,
        w:"<b>Phản ứng thái quá.</b> Hệ thống cũ vẫn có giá trị cho tới khi họ chuyển xong. Huỷ là tự bỏ cả tiền lẫn quan hệ." },
    ]},
  { msg:"Em ơi cho anh xin mật khẩu tài khoản em dùng để chạy hệ thống nhé, để anh tự vào xem.",
    note:"Đó là tài khoản n8n của anh, có credential của nhiều khách khác.",
    opts:[
      { t:'"Dạ em gửi anh ạ."', ok:false,
        w:"<b>Rất nguy hiểm.</b> Tài khoản đó chứa khoá của nhiều khách khác. Chia sẻ là vi phạm bảo mật với những khách kia — và nếu lộ, anh chịu trách nhiệm." },
      { t:'"Cái đó em không đưa được ạ."', ok:false,
        w:"<b>Đúng về nguyên tắc nhưng thiếu.</b> Khách hỏi vì họ muốn <b>nhìn thấy hệ thống của mình</b> — nhu cầu chính đáng. Từ chối mà không đưa giải pháp thì họ thấy bị giấu giếm." },
      { t:'"Tài khoản đó em dùng chung cho nhiều khách nên không chia sẻ được ạ. Nhưng em sẽ tạo cho anh một tài khoản riêng chỉ xem được phần của mình, hoặc dựng hệ thống trên tài khoản của bên anh luôn — anh chọn cách nào?"', ok:true,
        w:"<b>Đúng.</b> Giải thích lý do thật · đưa hai lối thoát · để khách chọn. Đây cũng là dịp bàn chuyện sở hữu hệ thống — nên bàn sớm chứ đừng đợi tới lúc chia tay." },
    ]},
  { msg:"Hệ thống chạy tốt lắm em. Mà tháng sau bên anh làm chương trình khuyến mãi, đơn sẽ tăng gấp 10 lần đấy.",
    note:"Khách không hỏi gì cả — chỉ thông báo. Hiện hệ thống xử lý khoảng 200 đơn mỗi ngày.",
    opts:[
      { t:'"Dạ vâng anh, chúc chương trình thành công ạ."', ok:false,
        w:"<b>Bỏ lỡ tín hiệu.</b> Gấp 10 lần nghĩa là 2.000 đơn mỗi ngày — có thể vượt giới hạn API, tốn tiền gấp 10, hoặc chạy quá lâu. Im lặng ở đây là để hệ thống chết đúng lúc khách cần nhất." },
      { t:'"Anh ơi, gấp 10 lần là khoảng 2.000 đơn/ngày. Em cần kiểm tra xem hệ thống chịu được không — có thể phải chỉnh phần xử lý theo lô. Em test trước trong tuần này rồi báo anh nhé."', ok:true,
        w:"<b>Đúng.</b> Chuyển thông tin thành hành động · nêu con số cụ thể · chủ động trước khi hỏng. Đây chính là thứ khách trả tiền bảo trì để có." },
      { t:'"Vậy chắc phải nâng cấp hệ thống, em báo giá nhé anh."', ok:false,
        w:"<b>Vội bán khi chưa biết có cần không.</b> Có thể hệ thống chịu được. Kiểm tra trước rồi mới nói chuyện tiền — nếu không, khách sẽ nghĩ anh chỉ chờ dịp để tính thêm." },
    ]},
];
document.querySelectorAll(".scopesim").forEach(ss => {
  const nEl = ss.querySelector(".ss-n"), scEl = ss.querySelector(".ss-score");
  const msg = ss.querySelector(".ss-msg"), opts = ss.querySelector(".ss-opts"), out = ss.querySelector(".ss-out");
  let i = 0, score = 0, answered = false;

  function draw(){
    const c = SS_CASES[i];
    answered = false;
    nEl.textContent = i + 1; scEl.textContent = score;
    msg.innerHTML = '<div class="ss-bubble">' + c.msg + '</div>' +
                    '<div class="ss-note">' + c.note + '</div>';
    // xáo thứ tự để không đoán được đáp án theo vị trí
    const order = c.opts.map((o, k) => k).sort(() => Math.random() - 0.5);
    opts.innerHTML = order.map(k =>
      '<button class="ss-opt" data-k="' + k + '">' + c.opts[k].t + '</button>').join("");
    out.innerHTML = "";
    opts.querySelectorAll(".ss-opt").forEach(b => b.addEventListener("click", () => pick(parseInt(b.dataset.k, 10), b)));
  }
  function pick(k, btn){
    if(answered) return;
    answered = true;
    const c = SS_CASES[i], o = c.opts[k];
    opts.querySelectorAll(".ss-opt").forEach(b => b.classList.add("dim"));
    btn.classList.remove("dim");
    btn.classList.add(o.ok ? "good" : "bad");
    if(o.ok) score++;
    scEl.textContent = score;
    const last = i === SS_CASES.length - 1;
    out.innerHTML = '<div class="ss-v ' + (o.ok ? "y" : "n") + '">' + o.w + '</div>' +
      '<button class="btn btn-run ss-next">' + (last ? "Xem kết quả" : "Tình huống tiếp →") + '</button>';
    out.querySelector(".ss-next").addEventListener("click", () => {
      if(last){
        out.innerHTML = '<div class="ss-final"><b>' + score + ' / ' + SS_CASES.length + '</b><p>' +
          (score >= 5 ? "Tốt. Anh đã nắm được ranh giới giữa giữ phạm vi và giữ quan hệ."
           : score >= 3 ? "Tạm được. Đọc lại phần “Quy tắc chung rút ra” bên dưới rồi làm lại."
           : "Còn thấp. Đây là kỹ năng làm hỏng nhiều dự án hơn bất kỳ lỗi kỹ thuật nào — đáng làm lại vài lượt.") +
          '</p></div>';
        if(score >= 5) markAuto(ss.dataset.lesson);
        return;
      }
      i++; draw();
    });
  }
  ss.querySelector(".ss-reset").addEventListener("click", () => { i = 0; score = 0; draw(); });
  draw();
});

/* ============================================================
   CHỌN CÔNG CỤ CHO ĐÚNG (K8)
   ============================================================ */
const PK_NAMES = ["🧩 Kéo thả", "⌨️ Node Code", "🐍 Script riêng", "✋ Không tự động hoá"];
const PK_CASES = [
  { req:"Mỗi sáng lấy số liệu bán hàng hôm qua từ Google Sheet, tính tổng theo từng cửa hàng, gửi email cho quản lý.",
    ctx:"Khoảng 200 dòng mỗi ngày · luồng thẳng · các dịch vụ đều có node sẵn.",
    ans:0,
    w:{0:"<b>Đúng.</b> Luồng thẳng, ít điều kiện, mọi dịch vụ đều có node sẵn. Viết code ở đây chỉ làm người sau khó bảo trì hơn.",
       1:"Chưa cần. Node Summarize làm được việc tính tổng theo nhóm — dùng code là thêm thứ phải bảo trì mà không được gì.",
       2:"Quá tay. Hai trăm dòng và luồng thẳng thì kéo thả nhanh hơn nhiều, và người khác nhìn vào hiểu ngay.",
       3:"Việc này lặp mỗi ngày, quy tắc rõ, tốn thời gian nếu làm tay — đủ cả ba tiêu chí ở bài K1."} },

  { req:"Chuẩn hoá cột địa chỉ: bỏ khoảng trắng thừa, viết hoa chữ đầu mỗi từ, đổi 'tp' thành 'Thành phố', gộp các cách viết khác nhau của cùng một quận.",
    ctx:"Một bước duy nhất trong quy trình đang chạy · logic khoảng 25 dòng.",
    ans:1,
    w:{0:"Không nổi. Ghép chuỗi node Set và IF để làm việc này sẽ ra một mê cung mười mấy node cho một việc code làm trong 25 dòng.",
       1:"<b>Đúng.</b> Một bước xử lý, node sẵn không làm được, độ dài vừa phải. Đây chính là chỗ node Code sinh ra để giải quyết.",
       2:"Quá tay. Tách ra script riêng nghĩa là thêm một chỗ phải triển khai và giám sát, cho một việc 25 dòng nằm gọn trong luồng.",
       3:"Đây là việc lặp lại và quy tắc rõ ràng — đúng loại nên tự động hoá."} },

  { req:"Xử lý file 300.000 dòng: đối chiếu với cơ sở dữ liệu, phát hiện trùng lặp, xuất báo cáo sai lệch. Chạy mỗi tháng một lần, mất khoảng 20 phút.",
    ctx:"Dữ liệu lớn · nhiều bước · cần kiểm thử vì kết quả dùng cho quyết toán.",
    ans:2,
    w:{0:"Không nổi. Ba trăm nghìn dòng qua công cụ kéo thả sẽ rất chậm, tốn tiền, và dễ hết thời gian chờ giữa chừng.",
       1:"Không đủ. Node Code chạy trong luồng nên vẫn gánh giới hạn của nền tảng, lại khó viết kiểm thử cho thứ dùng vào quyết toán.",
       2:"<b>Đúng.</b> Dữ liệu lớn, logic nhiều bước, kết quả quan trọng nên cần kiểm thử. Script riêng chạy trên máy chủ là lựa chọn hợp lý.",
       3:"Hai mươi phút mỗi tháng nghe ít, nhưng đây là việc quyết toán — rủi ro sai sót khi làm tay mới là lý do chính để tự động hoá."} },

  { req:"Duyệt hồ sơ ứng viên: đọc CV, đánh giá kinh nghiệm có phù hợp không, quyết định gọi phỏng vấn hay từ chối.",
    ctx:"Khoảng 15 hồ sơ mỗi tuần · tiêu chí thay đổi theo từng vị trí · quyết định ảnh hưởng tới người thật.",
    ans:3,
    w:{0:"Không nên. Việc này không có quy tắc cố định — tiêu chí đổi theo vị trí và người tuyển.",
       1:"Không nên. Vấn đề không nằm ở công cụ mà ở chỗ <b>bản chất việc này cần con người quyết định</b>.",
       2:"Không nên, vì lý do như trên. Dù code có mạnh tới đâu cũng không giải quyết được việc thiếu quy tắc rõ ràng.",
       3:"<b>Đúng.</b> Thiếu tiêu chí thứ hai ở bài K1 — quy tắc không rõ ràng. Có thể tự động hoá phần <i>chuẩn bị</i> (gom hồ sơ, trích thông tin), nhưng phần <b>quyết định</b> thì để người làm. Việc ảnh hưởng tới người thật càng phải cẩn thận."} },

  { req:"Khi có đơn hàng mới trên website, tạo bản ghi trong CRM, gửi email xác nhận cho khách, và nhắn vào nhóm chat của đội giao hàng.",
    ctx:"Ba dịch vụ đều có node sẵn · không có tính toán gì phức tạp · vài chục đơn mỗi ngày.",
    ans:0,
    w:{0:"<b>Đúng.</b> Đây là dạng workflow kinh điển của công cụ kéo thả: một sự kiện kích hoạt, ba hành động song song. Code ở đây chỉ làm chậm việc.",
       1:"Không cần. Không có bước xử lý nào mà node sẵn không làm được.",
       2:"Quá tay, và còn tệ hơn: script riêng phải tự lo phần nhận sự kiện từ website, thứ mà node webhook làm sẵn.",
       3:"Việc này lặp lại nhiều lần mỗi ngày và quy tắc hoàn toàn rõ ràng — nên tự động hoá."} },

  { req:"Mỗi quý, gom số liệu từ bốn hệ thống khác nhau, đối chiếu, phát hiện chênh lệch, rồi làm báo cáo cho ban giám đốc.",
    ctx:"Mỗi quý một lần · làm tay mất khoảng 3 giờ · quy tắc đối chiếu thay đổi gần như mỗi quý vì cơ cấu công ty đổi.",
    ans:3,
    w:{0:"Cẩn thận. Quy tắc đổi mỗi quý nghĩa là workflow phải sửa lại mỗi quý — chi phí bảo trì có thể vượt 3 giờ tiết kiệm được.",
       1:"Cùng vấn đề. Công cụ không phải điều đang chặn ở đây.",
       2:"Cùng vấn đề. Viết script cho quy tắc đổi liên tục là cách chắc chắn nhất để có một thứ luôn lỗi thời.",
       3:"<b>Đúng — và đây là ca khó nhất.</b> Bốn lần một năm × 3 giờ = 12 giờ. Dựng hệ thống nối bốn nguồn mất nhiều hơn thế, và còn phải sửa mỗi quý. <br><br>Nhưng đừng bỏ hoàn toàn: tự động hoá <b>phần ổn định</b> (gom dữ liệu từ bốn nguồn về một chỗ) và để <b>phần hay đổi</b> (quy tắc đối chiếu) làm tay. Chia đôi như vậy thường là câu trả lời đúng cho những việc kiểu này."} },
];
document.querySelectorAll(".picksim").forEach(pk => {
  const nEl = pk.querySelector(".pk-n"), scEl = pk.querySelector(".pk-score");
  const cs = pk.querySelector(".pk-case"), out = pk.querySelector(".pk-out");
  const btns = [...pk.querySelectorAll(".pk-opt")];
  let i = 0, score = 0, answered = false;

  function draw(){
    const c = PK_CASES[i];
    answered = false;
    nEl.textContent = i + 1; scEl.textContent = score;
    cs.innerHTML = '<div class="pk-req">' + c.req + '</div><div class="pk-ctx">' + c.ctx + '</div>';
    btns.forEach(b => { b.className = "pk-opt"; b.disabled = false; });
    out.innerHTML = "";
  }
  function pick(v, btn){
    if(answered) return;
    answered = true;
    const c = PK_CASES[i], ok = v === c.ans;
    btns.forEach(b => { b.classList.add("dim"); b.disabled = true; });
    btn.classList.remove("dim");
    btn.classList.add(ok ? "good" : "bad");
    if(!ok) btns[c.ans].classList.remove("dim"), btns[c.ans].classList.add("good");
    if(ok) score++;
    scEl.textContent = score;
    const last = i === PK_CASES.length - 1;
    out.innerHTML = '<div class="pk-v ' + (ok ? "y" : "n") + '">' +
      (ok ? "" : '<div class="pk-you">Anh chọn <b>' + PK_NAMES[v] + '</b> — ' + c.w[v] + '</div>') +
      '<div class="pk-right"><b>' + PK_NAMES[c.ans] + ':</b> ' + c.w[c.ans] + '</div></div>' +
      '<button class="btn btn-run pk-next">' + (last ? "Xem kết quả" : "Yêu cầu tiếp →") + '</button>';
    out.querySelector(".pk-next").addEventListener("click", () => {
      if(last){
        out.innerHTML = '<div class="ss-final"><b>' + score + ' / ' + PK_CASES.length + '</b><p>' +
          (score >= 5 ? "Tốt. Anh phân biệt được ranh giới giữa bốn lựa chọn."
           : score >= 3 ? "Tạm được. Đọc lại bảng bốn lựa chọn ở trên rồi làm lại — chú ý hai ca “không tự động hoá”."
           : "Còn thấp. Chọn sai công cụ tốn nhiều thời gian hơn viết code dở — đáng làm lại vài lượt.") +
          '</p></div>';
        if(score >= 5) markAuto(pk.dataset.lesson);
        return;
      }
      i++; draw();
    });
  }
  btns.forEach(b => b.addEventListener("click", () => pick(parseInt(b.dataset.v, 10), b)));
  pk.querySelector(".pk-reset").addEventListener("click", () => { i = 0; score = 0; draw(); });
  draw();
});

/* ============================================================
   KHỞI ĐỘNG
   ============================================================ */
paintProgress();
showLesson((location.hash || "").replace("#", "") || "home", false);
window.addEventListener("hashchange",()=>showLesson(location.hash.slice(1)||"home",false));