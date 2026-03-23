# 🗺️ ČeskýGeo – Multiplayer

GeoGuessr trénink pro Českou republiku s real-time multiplayerem.

## Stack
- **Backend:** Node.js + Express + Socket.io
- **Frontend:** Vanilla JS + Leaflet.js
- **Deploy:** Railway (zdarma)

## Funkce
- ✅ Real-time multiplayer (až 8 hráčů)
- ✅ Kód místnosti — pošleš odkaz kamarádovi
- ✅ Google Street View (interaktivní – lze se otáčet)
- ✅ Konfigurovatelný timer, tolerance, kategorie
- ✅ Live scoreboard
- ✅ Chat během hry
- ✅ Výsledková tabulka po každém kole

## Deploy na Railway (zdarma, 5 minut)

### 1. Nahraj na GitHub
```bash
git init
git add .
git commit -m "init"
gh repo create ceskygeo --public --push --source=.
```
Nebo ručně: github.com → New repository → nahrát soubory

### 2. Deploy na Railway
1. Jdi na [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub repo**
3. Vyber `ceskygeo`
4. Railway automaticky detekuje Node.js a spustí `npm start`
5. Po deployi klikni **Settings → Networking → Generate Domain**
6. Dostaneš URL jako `ceskygeo.up.railway.app`

### 3. Google Maps API klíč
- Každý hráč zadá svůj vlastní klíč při vytváření hry
- Nebo nastav jako environment variable `GOOGLE_MAPS_KEY` a uprav server.js

## Lokální spuštění
```bash
npm install
npm run dev   # s nodemon (auto-restart)
# nebo
npm start
```
Otevři: http://localhost:3000

## Jak hrát
1. Hráč 1 klikne **Vytvořit hru** → nastaví parametry → dostane 5-místný kód
2. Hráč 2 klikne **Připojit se** → zadá kód
3. Oba kliknou **Jsem připraven**
4. Hra začne — oba vidí stejné místo, hádají nezávisle
5. Po odeslání odhadu se zobrazí výsledky všech hráčů
