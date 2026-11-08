// CoachCo v3 : toujours le réseau d'abord (fichiers et manifeste à jour), le cache seulement hors connexion.
const CACHE='coachco-v5';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin&&!u.hostname.includes('fonts.g'))return;
  if(r.mode==='navigate'){e.respondWith(fetch('./index.html?_='+Date.now(),{cache:'no-store'}).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put('./index.html',c))}return res}).catch(()=>caches.match('./index.html')));return}
  if(u.pathname.endsWith('/version.json'))return;
  e.respondWith(fetch(r,u.origin===location.origin?{cache:'no-cache'}:{}).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(CACHE).then(x=>x.put(r.mode==='navigate'?'./index.html':r,c))}return res})
    .catch(()=>caches.match(r.mode==='navigate'?'./index.html':r).then(h=>h||caches.match('./index.html'))));
});
