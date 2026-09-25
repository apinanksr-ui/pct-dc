/* ตัวช่วยให้ติดตั้งเป็นแอปได้ และให้เปลือกแอปเปิดเร็ว
   แคชเฉพาะไฟล์ของเปลือกกับไอคอนเท่านั้น
   ข้อมูลเอกสารอยู่คนละต้นทาง (script.google.com) และไม่เคยถูกแคชที่นี่
   ตั้งใจให้เป็นแบบนี้ — ผู้บริหารต้องเห็นตัวเลขสดเสมอ ไม่มีทางเห็นของเก่าโดยไม่รู้ตัว */
const ถัง = 'pctdc-shell-v2';
const ของ = ['./','./index.html','./manifest.webmanifest',
             './icon-192.png','./icon-512.png','./icon-maskable-512.png',
             './apple-touch-icon.png','./favicon-32.png','./favicon.ico'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(ถัง).then(c => c.addAll(ของ)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== ถัง).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET' || u.origin !== self.location.origin) return;  /* ข้อมูลไม่แตะ */
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(ถัง).then(c => c.put(e.request, copy)).catch(()=>{});
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
