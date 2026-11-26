/* Runs trusted practice code outside the page. No DOM or localStorage access. */
self.onmessage=async({data})=>{try{
 importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
 const py=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'});
 const send=t=>self.postMessage({type:'out',text:String(t).slice(0,10000)});
 py.setStdout({batched:send});py.setStderr({batched:send});py.setStdin({stdin:()=>null});
 self.postMessage({type:'ready'});await py.loadPackagesFromImports(data.code);await py.runPythonAsync(data.code);self.postMessage({type:'done'});
 }catch(e){self.postMessage({type:'error',text:String(e.message||e).slice(0,10000)});}};
