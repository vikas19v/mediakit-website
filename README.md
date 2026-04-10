# MediaKit - Global Market Dashboard

A free, interactive financial dashboard that displays live and historical charts for **Gold, Silver, Large Cap, Mid Cap, Small Cap** indices and **sector-specific** indices (AI, Semiconductors, Space, Photonics, Robotics) across **India, USA, UK, China, and Japan** — plus **Bitcoin** and **Ethereum** crypto charts.

**Live Website:** [https://vikas19v.github.io/mediakit-website/](https://vikas19v.github.io/mediakit-website/)

---

## What Does This Website Do?

MediaKit is like a personal Bloomberg terminal — but free and in your browser. It lets you:

- View **live price charts** for major market indices, commodities, sectors and crypto
- See **full historical data** — zoom into any day, week, month, or year
- **Compare markets** across 5 countries at a glance
- View **constituent company lists** for each index and sector
- Track **Bitcoin and Ethereum** prices alongside traditional markets
- Explore **sector-specific** indices: AI, Semiconductors, Space Tech, Photonics, Robotics
- Works on **desktop, tablet, and mobile**

---

## Markets & Indices Covered

### Commodities & Main Indices

| Country | Large Cap | Mid Cap | Small Cap | Gold | Silver |
|---------|-----------|---------|-----------|------|--------|
| India | INDA ETF (Nifty/Sensex proxy) | SMIN ETF (MidCap proxy) | INDY ETF (SmallCap proxy) | Gold (USD) | Silver (USD) |
| USA | SPY (S&P 500) | MDY (S&P MidCap 400) | IWM (Russell 2000) | Gold (USD) | Silver (USD) |
| UK | FTSE 100 (TVC:UKX) | EWU ETF (FTSE 250 proxy) | EWUS ETF (SmallCap proxy) | Gold (USD) | Silver (USD) |
| China | FXI ETF (CSI 300 proxy) | MCHI ETF (CSI 500 proxy) | CNYA ETF (CSI 1000 proxy) | Gold (USD) | Silver (USD) |
| Japan | Nikkei 225 (TVC:NI225) | EWJ ETF (MidCap proxy) | SCJ ETF (SmallCap proxy) | Gold (USD) | Silver (USD) |

### Sector Indices (where available)

| Sector | USA | India | Japan |
|--------|-----|-------|-------|
| AI | AIQ (Global X AI ETF) | INDA (via IT stocks) | AIQ (Global) |
| Semiconductors | SMH (VanEck Semi ETF) | INDA (via IT stocks) | — |
| Space Tech | UFO (Procure Space ETF) | — | — |
| Photonics | LITE (Lumentum Holdings) | — | — |
| Robotics | ROBT (First Trust Robotics) | — | ROBT (Global) |

### Crypto

| Asset | Symbol |
|-------|--------|
| Bitcoin | BITSTAMP:BTCUSD |
| Ethereum | BITSTAMP:ETHUSD |

### Why ETFs Instead of Direct Indices?

TradingView's embedded widgets only support symbols from [specific exchanges](https://www.tradingview.com/widget-docs/markets/). Many local exchanges are blocked:

- **NSE (India)** — blocked by NSE data sharing policy
- **TSE (Japan)** — not listed for widget embedding
- **LSE (UK)** — not listed for widget embedding
- **SSE/SZSE (China)** — only end-of-day data, unreliable for embeds

So we use **US-listed ETFs** (which trade on NYSE Arca/NASDAQ — fully supported) that track those markets. The price movements closely mirror the local indices.

### What Do These Mean?

- **Large Cap** = The biggest companies in a country (e.g., Reliance, Apple, Toyota)
- **Mid Cap** = Medium-sized companies — more growth potential, more risk
- **Small Cap** = Smaller companies — highest growth potential, highest risk
- **Gold / Silver** = Precious metal commodity prices — often used as a "safe haven" during market downturns
- **ETF** = Exchange-Traded Fund — a basket of stocks that tracks an index, traded like a single stock

---

## How It Works (Non-Technical Explanation)

Think of it like a TV with channels:

1. **You pick a country** (India, USA, UK, etc.) or **crypto** (Bitcoin, Ethereum)
2. **You pick what to watch** (Gold, Silver, Large Cap, AI, Semiconductors, etc.)
3. **The chart loads automatically** with live data and full history
4. **Scroll down** to see the list of companies that make up that index

The charts come from **TradingView**, a trusted platform used by millions of traders worldwide. We don't store any data ourselves.

---

## How It Works (Technical Explanation)

### Architecture

```
User's Browser
├── index.html ──── Page structure (header, buttons, chart, constituents)
├── style.css ───── Dark theme, responsive grid, animations
└── app.js ──────── Brain: symbol mapping + chart loading + constituent rendering
        │
        ▼
  embed-widget-advanced-chart.js (TradingView CDN)
        │
        ▼
  TradingView Servers → Live market data via iframe
```

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Structure | HTML5 | Page layout |
| Styling | CSS3 | Dark theme, responsive |
| Logic | Vanilla JavaScript | Button clicks, chart swaps, constituent lists |
| Charts | TradingView embed-widget-advanced-chart.js | Interactive charts with live data |
| Hosting | GitHub Pages (free) | Serves the website |
| CI/CD | GitHub Actions | Auto-deploys on push |

### Key Design Decisions

- **No backend** — everything runs in the browser
- **No database** — chart data comes from TradingView
- **No API keys** — TradingView widgets are free
- **No build step** — plain HTML/CSS/JS
- **embed-widget-advanced-chart.js** instead of the older tv.js — wider symbol support
- **US-listed ETFs as proxies** for markets where direct symbols are blocked

---

## File Structure

```
mediakit-website/
├── index.html          # Main page layout
├── style.css           # Dark financial theme
├── app.js              # Symbol mapping, chart loading, constituents, error handling
├── README.md           # This file
└── .github/
    └── workflows/
        └── deploy.yml  # Auto-deploys to GitHub Pages
```

---

## Error Handling

The app handles several error scenarios:

| Scenario | What Happens |
|----------|-------------|
| Symbol not available in embed | Shows a friendly error message with an icon |
| Chart fails to load (network) | Script error handler shows connection error message |
| Iframe doesn't appear within 12s | Timeout shows "Chart unavailable" message |
| Sector not available for country | Button is hidden entirely |
| Asset unavailable after country switch | Auto-falls back to Gold |

---

## How to Make Changes

### Edit on GitHub (easiest)

1. Go to https://github.com/vikas19v/mediakit-website
2. Click any file → pencil icon → edit → commit
3. Website auto-updates in 1-2 minutes

### Add a New Country

1. Add entry to `MARKET_DATA` in `app.js` with TradingView-compatible symbols
2. Add a button in `index.html` inside `.country-nav`
3. Add constituent companies to `CONSTITUENTS` in `app.js`

### Finding TradingView Symbols

1. Check [TradingView Widget Markets](https://www.tradingview.com/widget-docs/markets/) for supported exchanges
2. Use `TVC:*` symbols for major indices (always work in embeds)
3. Use US-listed ETFs (`AMEX:*`) as proxies for blocked markets
4. Test on [TradingView](https://www.tradingview.com) to verify the symbol exists

---

## Cost

**$0.** Everything is free: GitHub repo, GitHub Pages hosting, TradingView widgets, Google Fonts.

---

## License

Open source for personal use. TradingView widgets are subject to [TradingView's terms](https://www.tradingview.com/policies/).
