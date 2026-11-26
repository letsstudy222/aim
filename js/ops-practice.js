/* Offline teaching simulation. No network, authentication, LLM or actual writes. */
(function(){'use strict';
const data=typeof module!=='undefined'&&module.exports?require('./ops-fixtures.js'):AIM_OPS_DATA;
const orders=Object.freeze({O01:{owner:'L01',revenue_vnd:300000},O02:{owner:'L01',revenue_vnd:200000},O03:{owner:'L05',revenue_vnd:400000},O04:{owner:'L07',revenue_vnd:250000}});
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function exact(x,keys){return object(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));}
function simulate(c){let calls=0,spent=0,stopped=false,used=false,drafts=0;const budget=c.budget??3;const trace=[];
 for(const step of c.steps){let status,detail='';const a=step.args;
  if(stopped){status='stopped';}
  else if(calls>=3){status='limit';stopped=true;}
  else if(spent+1>budget){status='budget';stopped=true;}
  else{calls++;spent++; // One abstract credit for each proposed attempt, not actual token billing.
   if(!['get_order','draft_review'].includes(step.tool)){status='denied';}
   else if(!exact(a,step.tool==='get_order'?['order_id']:['order_id','reason'])||typeof a.order_id!=='string'||!/^O\d{2}$/.test(a.order_id)||(step.tool==='draft_review'&&(typeof a.reason!=='string'||!a.reason.trim()||a.reason.length>200))){status='invalid';}
   else if(!Object.hasOwn(orders,a.order_id)){status='not_found';}
   else if(orders[a.order_id].owner!=='L01'){status='denied';}
   else if(c.fault==='timeout'){status='timeout';stopped=true;}
   else if(step.tool==='get_order'){status='read';detail=`${a.order_id} · doanh thu ${orders[a.order_id].revenue_vnd} VND (giả lập)`;}
   else if(used||!c.approval||c.approval.order_id!==a.order_id||c.approval.reason!==a.reason){status='needs_approval';}
   else{used=true;drafts++;status='drafted';detail='Chỉ tạo bản nháp trong RAM; không hoàn tiền.';}
  }
  trace.push({tool:step.tool,status,detail,calls,credits:spent});
 }
 return {id:c.id,trace,drafts,calls,spent,pass:JSON.stringify(trace.map(x=>x.status))===JSON.stringify(c.expected)};
}
const allowed=new Set(['answer','abstain','review','deny']);
function evaluate(rows,version,{overall=90,sliceMin=80,budget=10}={}){
 if(!Array.isArray(rows)||!rows.length||!['A','B'].includes(version)||![overall,sliceMin,budget].every(Number.isFinite)||overall<0||overall>100||sliceMin<0||sliceMin>100||budget<0)throw Error('Thiếu tập đánh giá hoặc ngưỡng không hợp lệ.');
 let pass=0,critical=0,cost=0;const times=[],groups=Object.create(null),ids=new Set(),details=[];
 for(const r of rows){const x=r[version];if(typeof r.id!=='string'||ids.has(r.id)||typeof r.slice!=='string'||!allowed.has(r.expected)||!x||!allowed.has(x.actual)||typeof x.critical!=='boolean'||![x.input_tokens,x.output_tokens,x.latency_ms].every(n=>Number.isSafeInteger(n)&&n>=0))throw Error('Dòng eval sai hoặc trùng ID.');ids.add(r.id);const ok=x.actual===r.expected&&!x.critical;const g=groups[r.slice]??={n:0,pass:0,critical:0};g.n++;g.pass+=Number(ok);g.critical+=Number(x.critical);pass+=Number(ok);critical+=Number(x.critical);cost+=x.input_tokens+3*x.output_tokens;times.push(x.latency_ms);details.push({id:r.id,slice:r.slice,expected:r.expected,actual:x.actual,critical:x.critical,pass:ok});}
 const total=rows.length,accuracy=100*pass/total;times.sort((a,b)=>a-b);const p95=times[Math.ceil(.95*total)-1];const slices=Object.entries(groups).map(([slice,g])=>({slice,...g,accuracy:100*g.pass/g.n}));const costUSD=cost/1e6,projectedUSD=costUSD/total*10000;const blockers=[];if(critical)blockers.push('Lỗi nghiêm trọng');if(accuracy<overall)blockers.push('Chưa đạt ngưỡng tổng');if(slices.some(s=>s.accuracy<sliceMin))blockers.push('Có nhóm chưa đạt ngưỡng');if(projectedUSD>budget)blockers.push('Vượt ngân sách giả định');return {version,total,pass,critical,accuracy,p95,slices,costUSD,projectedUSD,costPerPass:pass?costUSD/pass:null,blockers,eligible:blockers.length===0,details};
}
if(typeof module!=='undefined'&&module.exports){module.exports={simulate,evaluate};return;}
const $=id=>document.getElementById(id),out=(id,t)=>$(id).textContent=t;
function download(name,obj){const u=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);}
if($('aimAgentLab')){const sel=$('aimAgentCase');let report=null;data.agent.forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.id+' · '+c.title;sel.append(o)});const current=()=>data.agent.find(c=>c.id===sel.value);function show(){const c=current();out('aimAgentInput',JSON.stringify({session:'L01 (giả lập)',trusted_approval:c.approval??null,limit:3,budget:c.budget??3,fault:c.fault??null,proposals:c.steps},null,2));out('aimAgentOut','Chạy để xem quyết định và nhật ký.');report=null;$('aimAgentExport').disabled=true;}sel.onchange=show;$('aimAgentRun').onclick=()=>{const r=simulate(current());report=[r];out('aimAgentOut',r.trace.map((x,i)=>`${i+1}. ${x.tool} → ${x.status} ${x.detail}`).join('\n')+`\nBản nháp: ${r.drafts}; lượt: ${r.calls}; credit: ${r.spent}\n${r.pass?'ĐẠT':'SAI'} so với kỳ vọng`);$('aimAgentExport').disabled=false;};$('aimAgentSuite').onclick=()=>{report=data.agent.map(simulate);out('aimAgentOut',`Đạt ${report.filter(r=>r.pass).length}/${report.length} ca policy.\n`+report.map(r=>`${r.id}: ${r.trace.map(x=>x.status).join(' → ')} | ${r.pass?'ĐẠT':'SAI'}`).join('\n'));$('aimAgentExport').disabled=false;};$('aimAgentExport').onclick=()=>report&&download('may-agent-policy-results.json',{simulation:true,results:report});show();}
if($('aimOpsLab')){let report=null;const form=$('aimOpsForm');form.addEventListener('input',()=>{report=null;$('aimOpsExport').disabled=true;out('aimOpsOut','Nhấn so sánh để tính lại.');});form.onsubmit=e=>{e.preventDefault();const params={overall:Number($('aimOpsOverall').value),sliceMin:Number($('aimOpsSlice').value),budget:Number($('aimOpsBudget').value)};try{const results=['A','B'].map(v=>evaluate(data.evals,v,params));const [a,b]=results;const improved=b.details.filter((x,i)=>x.pass&&!a.details[i].pass).map(x=>x.id);const regressed=b.details.filter((x,i)=>!x.pass&&a.details[i].pass).map(x=>x.id);report={simulation:true,params,rates:'Giả định 1 USD/1M input, 3 USD/1M output',results,improved,regressed};out('aimOpsOut',results.map(r=>`Phiên bản ${r.version}: ${r.pass}/${r.total} (${r.accuracy.toFixed(1)}%), lỗi nghiêm trọng ${r.critical}\n${r.slices.map(s=>`  ${s.slice}: ${s.pass}/${s.n}`).join('\n')}\np95: ${r.p95} ms · 10.000 yêu cầu: ${r.projectedUSD.toFixed(2)} USD\nChi phí/ca đạt: ${r.costPerPass===null?'N/A':r.costPerPass.toFixed(6)+' USD'}\n${r.eligible?'ĐỦ ĐIỀU KIỆN LAB (chưa phải production)':'CHẶN: '+r.blockers.join('; ')}`).join('\n\n')+`\n\nB cải thiện: ${improved.join(', ')||'∅'}; B thoái lui: ${regressed.join(', ')||'∅'}`);$('aimOpsExport').disabled=false;}catch(err){report=null;$('aimOpsExport').disabled=true;out('aimOpsOut',err.message);}};$('aimOpsExport').onclick=()=>report&&download('may-eval-comparison-results.json',report);}
})();
