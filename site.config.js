/* إعدادات النشر — ما بيها أسرار.
   relayUrl: عنوان خادم اللعب عن بعد (WebSocket). اتركه فارغ إذا الموقع ينخدم من نفس الخادم
   (server/relay.mjs يخدم الموقع ويضبط هذا تلقائياً)، أو حطّ مثلاً "wss://khy-relay.example.com/ws".
   إذا ماكو خادم، اللعب عن بعد يستعمل PeerJS (اتصال مباشر بين الجهازين عبر خادم PeerJS العام). */
window.KY_CONFIG = window.KY_CONFIG || { relayUrl: "" };
