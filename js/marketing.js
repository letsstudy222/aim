/* Marketing cohort analysis. Static teaching data; no network or CRM. */
const AIMMarketing=(()=>{
 const validMoney=n=>Number.isSafeInteger(n)&&n>=0;
 const div=(a,b)=>b?a/b:null;
 function summarize(data){
  const leads=new Map(), orders=new Set(), groups=new Map();
  const row=(source)=>({source,leads:0,qualified:0,buyers:0,orders:0,revenue:0,adSpend:0,otherCost:0});
  for(const c of data.costs){if(typeof c.source!=='string'||!c.source.trim()||groups.has(c.source)||!validMoney(c.ad_spend_vnd)||!validMoney(c.other_acquisition_vnd))throw Error('Chi phí nguồn không hợp lệ hoặc trùng');groups.set(c.source,{...row(c.source),adSpend:c.ad_spend_vnd,otherCost:c.other_acquisition_vnd});}
  for(const l of data.leads){if(typeof l.lead_id!=='string'||!l.lead_id.trim()||leads.has(l.lead_id)||!groups.has(l.source)||!['qualified','new','lost'].includes(l.status))throw Error('Lead trùng, nguồn hoặc trạng thái sai');leads.set(l.lead_id,l);const g=groups.get(l.source);g.leads++;if(l.status==='qualified')g.qualified++;}
  const buyers=new Set();
  for(const o of data.orders){if(typeof o.order_id!=='string'||!o.order_id.trim()||orders.has(o.order_id)||!leads.has(o.lead_id)||!validMoney(o.revenue_vnd))throw Error('Đơn trùng, thiếu lead hoặc doanh thu sai');orders.add(o.order_id);const g=groups.get(leads.get(o.lead_id).source);g.orders++;g.revenue+=o.revenue_vnd;if(!buyers.has(o.lead_id)){buyers.add(o.lead_id);g.buyers++;}}
  const total=row('total');for(const g of groups.values())for(const k of Object.keys(total))if(k!=='source')total[k]+=g[k];
  function metrics(g){let cost=g.adSpend+g.otherCost;if(!Object.values(g).slice(1).every(validMoney)||!validMoney(cost))throw Error('Tổng vượt giới hạn số nguyên an toàn');return {...g,cost,qualifiedRate:div(g.qualified,g.leads),conversion:div(g.buyers,g.leads),cac:div(cost,g.buyers),roas:div(g.revenue,g.adSpend)};}
  return {channels:[...groups.values()].map(metrics),total:metrics(total)};
 }
 function contribution(g,margin){if(!Number.isFinite(margin)||margin<0||margin>100)throw Error('Biên đóng góp phải từ 0–100%');return g.revenue*margin/100-g.cost;}
 return {summarize,contribution};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=AIMMarketing;
if(typeof document!=='undefined')(()=>{
 const form=document.getElementById('aimMarketingForm');if(!form)return;
 const out=document.getElementById('aimMarketingOut'), exp=document.getElementById('aimMarketingExport');let report=null;
 const f=n=>n===null?'N/A':new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(n);
 form.addEventListener('input',()=>{report=null;exp.disabled=true;out.textContent='Dữ liệu đã thay đổi. Chạy lại để xem kết quả.';});
 form.addEventListener('submit',e=>{e.preventDefault();report=null;exp.disabled=true;try{
 const input=form.querySelector('input[name=margin]');if(input.value.trim()==='')throw Error('Nhập biên đóng góp.');const margin=Number(input.value), result=AIMMarketing.summarize(AIM_MARKETING_DATA);
 const rows=[...result.channels,result.total].map(g=>({...g,contribution:AIMMarketing.contribution(g,margin)}));
 out.textContent=rows.map(g=>`${g.source.toUpperCase()} · ${g.leads} lead / ${g.qualified} qualified / ${g.buyers} người mua / ${g.orders} đơn\nDoanh thu: ${f(g.revenue)} đ · Chi phí thu hút: ${f(g.cost)} đ\nLead → người mua: ${g.conversion===null?'N/A':f(g.conversion*100)+'%'} · CAC giả định: ${f(g.cac)} đ\n${g.source==='total'?'Doanh thu toàn cohort / chi quảng cáo (không phải ROAS quảng cáo)': 'Doanh thu theo nguồn / chi quảng cáo'}: ${f(g.roas)}${g.roas===null?'':'×'}\nĐóng góp sau chi phí thu hút: ${f(g.contribution)} đ`).join('\n\n')+'\n\nGiả định mọi người mua là khách mới; attribution theo nguồn lead. Không phải lợi nhuận ròng, không suy ra tác động nhân quả.';
 report={synthetic:true,assumptions:'All buyers are new; lead source attribution; cohort revenue; margin before acquisition costs; total revenue/ad spend is not paid-ad ROAS.',margin_percent:margin,rows};exp.disabled=false;
 }catch(err){out.textContent='Chưa tính được: '+err.message;}});
 exp.addEventListener('click',()=>{if(!report)return;const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='may-marketing-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();
