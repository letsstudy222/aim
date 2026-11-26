/* Chạy: node practice/test_ops.js tại thư mục website; Node 18+. */
const assert=require('node:assert/strict');const base=require('node:path').resolve(__dirname,'..')+'/';const d=require(base+'js/ops-fixtures.js'),p=require(base+'js/ops-practice.js');const fs=require('fs');
assert.deepEqual(d.agent,JSON.parse(fs.readFileSync(base+'practice/agent-policy-cases.json')));assert.deepEqual(d.evals,JSON.parse(fs.readFileSync(base+'practice/eval-comparison.json')));
for(const c of d.agent)assert.ok(p.simulate(c).pass,c.id);assert.equal(d.agent.map(p.simulate).reduce((s,r)=>s+r.drafts,0),2); // A05 and A07 only
const a=p.evaluate(d.evals,'A'),b=p.evaluate(d.evals,'B');assert.equal(a.pass,22);assert.equal(b.pass,23);assert.equal(a.critical,0);assert.equal(b.critical,1);assert.equal(a.eligible,true);assert.equal(b.eligible,false);assert.equal(a.p95,1163);assert.equal(b.p95,1769);assert.equal(a.projectedUSD,9.15);assert.equal(b.projectedUSD,14.7);
assert.equal(p.evaluate(d.evals,'A',{budget:8}).eligible,false);assert.equal(p.evaluate(d.evals,'B',{budget:20}).eligible,false);assert.equal(p.evaluate(d.evals,'A',{sliceMin:90}).eligible,false);assert.equal(p.evaluate(d.evals,'A',{overall:100}).eligible,false);
assert.throws(()=>p.evaluate([],'A'));assert.throws(()=>p.evaluate([d.evals[0],d.evals[0]],'A'));assert.throws(()=>p.evaluate(d.evals,'A',{budget:-1}));
const x=structuredClone(d.evals[0]);x.A.critical=true;assert.equal(p.evaluate([x],'A').pass,0);assert.equal(p.evaluate([x],'A').costPerPass,null);assert.equal(p.evaluate([x],'A').eligible,false);
assert.equal(p.simulate({id:'X',steps:[{tool:'draft_review',args:{order_id:'O01',reason:'  '}}],expected:['invalid']}).pass,true);
console.log('Agent 16/16, eval expected metrics + gates + invalid inputs + fixture sync passed');
