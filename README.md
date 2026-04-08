# MediaKit - Global Market Dashboard

A free, interactive financial dashboard that displays live and historical charts for **Gold, Silver, Large Cap, Mid Cap, and Small Cap** indices across **India, USA, UK, China, and Japan**.

**Live Website:** [https://vikas19v.github.io/mediakit-website/](https://vikas19v.github.io/mediakit-website/)

---

## What Does This Website Do?

MediaKit is like a personal Bloomberg terminal — but free and in your browser. It lets you:

- View **live price charts** for major market indices and commodities
- See **full historical data** — zoom into any day, week, month, or year
- **Compare markets** across 5 countries at a glance
- Use **professional tools** like candlestick charts, moving averages, and drawing tools
- Works on **desktop, tablet, and mobile**

---

## Markets & Indices Covered

| Country | Large Cap | Mid Cap | Small Cap | Gold | Silver |
|---------|-----------|---------|-----------|------|--------|
| 🇮🇳 India | Nifty 50 | Nifty Midcap 100 | Nifty Smallcap 100 | MCX Gold | MCX Silver |
| 🇺🇸 USA | S&P 500 | S&P MidCap 400 | Russell 2000 | COMEX Gold | COMEX Silver |
| 🇬🇧 UK | FTSE 100 | FTSE 250 | FTSE AIM All-Share | Gold (USD) | Silver (USD) |
| 🇨🇳 China | CSI 300 | CSI 500 | CSI 1000 | Gold (USD) | Silver (USD) |
| 🇯🇵 Japan | Nikkei 225 | TOPIX Mid 400 | TOPIX Small | Gold (USD) | Silver (USD) |

### What Do These Mean?

- **Large Cap** = The biggest companies in a country (e.g., Reliance, Apple, Toyota)
- **Mid Cap** = Medium-sized companies — more growth potential, more risk
- **Small Cap** = Smaller companies — highest growth potential, highest risk
- **Gold / Silver** = Precious metal commodity prices — often used as a "safe haven" during market downturns

---

## How It Works (Non-Technical Explanation)

Think of it like a TV with channels:

1. **You pick a country** (like picking a TV channel — India, USA, UK, etc.)
2. **You pick what to watch** (Gold, Silver, Large Cap, Mid Cap, or Small Cap)
3. **The chart loads automatically** with live data and full history

The charts come from **TradingView**, a trusted platform used by millions of traders worldwide. We don't store any data ourselves — the charts pull live data directly from stock exchanges and commodity markets.

---

## How It Works (Technical Explanation)

### Architecture

```
┌─────────────────────────────────────────────┐
│              User's Browser                 │
│                                             │
│  index.html ─── style.css ─── app.js        │
│       │                          │          │
│       │    ┌─────────────────────┤          │
│       ▼    ▼                     ▼          │
│  ┌──────────────┐    ┌───────────────────┐  │
│  │  Page Layout  │    │  Symbol Mapping   │  │
│  │  (HTML/CSS)   │    │  (JS Object)      │  │
│  └──────┬───────┘    └────────┬──────────┘  │
│         │                     │             │
│         ▼                     ▼             │
│  ┌──────────────────────────────────────┐   │
│  │     TradingView Widget (Embedded)     │   │
│  │  - Loads chart for selected symbol    │   │
│  │  - Fetches data from TradingView CDN  │   │
│  │  - Renders interactive chart          │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────┐
        │  TradingView CDN   │
        │  (External Server)  │
        │  - Chart library    │
        │  - Market data      │
        │  - Historical data  │
        └───────────────────┘
```

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Structure | HTML5 | Page layout — header, buttons, chart containers |
| Styling | CSS3 | Dark theme, responsive grid, animations |
| Logic | Vanilla JavaScript | Handles button clicks, swaps chart symbols |
| Charts | TradingView Widgets (free) | Renders interactive charts with live data |
| Hosting | GitHub Pages (free) | Serves the website to the internet |
| Fonts | Google Fonts (Inter) | Clean, modern typography |

### Key Design Decisions

- **No backend / server** — everything runs in the browser, so there's nothing to maintain or pay for
- **No database** — chart data comes directly from TradingView's servers
- **No API keys** — TradingView widgets are free and don't require authentication
- **No build step** — plain HTML/CSS/JS, no npm, no webpack, no frameworks
- **No dependencies** — only external resources are TradingView's widget script and Google Fonts

---

## File Structure

```
mediakit-website/
├── index.html          # Main page — layout and structure
├── style.css           # All styling — dark theme, responsive design
├── app.js              # Application logic — symbol mapping and chart loading
├── README.md           # This file
└── .github/
    └── workflows/
        └── deploy.yml  # Auto-deploys to GitHub Pages on every push
```

### What Each File Does

#### `index.html`
- Defines the page structure: header, country buttons, asset buttons, chart container, overview grid
- Loads the TradingView chart library from their CDN (content delivery network)
- Links to the CSS for styling and JS for interactivity

#### `style.css`
- Dark financial theme (similar to Bloomberg or TradingView's own dark mode)
- CSS Grid for the overview cards layout
- Flexbox for navigation alignment
- CSS custom properties (variables) for consistent colors
- Media queries for responsive design (adapts to phone/tablet/desktop)
- Animations (pulsing green "Live" dot, hover effects)

#### `app.js`
- **MARKET_DATA object** — A lookup table mapping each country + asset to a TradingView symbol code (e.g., India + Large Cap = `NSE:NIFTY`)
- **Event listeners** — Detects when you click a country or asset button
- **loadMainChart()** — Destroys the old chart widget and creates a new one with the selected symbol
- **loadOverviewCharts()** — Loads 5 mini charts at the bottom showing all assets for the selected country

#### `.github/workflows/deploy.yml`
- GitHub Actions workflow that automatically deploys the site whenever you push changes
- Uses GitHub's official Pages deployment actions
- No configuration needed — it just works

---

## How to Make Changes

### If You Want to Edit the Website

1. Go to your repo: https://github.com/vikas19v/mediakit-website
2. Click on any file (e.g., `index.html`)
3. Click the pencil icon (Edit) in the top right
4. Make your changes
5. Click "Commit changes" at the bottom
6. The website will automatically update in 1-2 minutes

### If You Want to Add a New Country

Open `app.js` and add a new entry to the `MARKET_DATA` object following the same pattern:

```javascript
newcountry: {
    name: "Country Name",
    timezone: "Continent/City",
    gold:     { symbol: "EXCHANGE:SYMBOL", name: "Display Name", description: "..." },
    silver:   { symbol: "EXCHANGE:SYMBOL", name: "Display Name", description: "..." },
    largecap: { symbol: "EXCHANGE:SYMBOL", name: "Display Name", description: "..." },
    midcap:   { symbol: "EXCHANGE:SYMBOL", name: "Display Name", description: "..." },
    smallcap: { symbol: "EXCHANGE:SYMBOL", name: "Display Name", description: "..." }
}
```

Then add a matching button in `index.html` inside the `country-nav` section.

### Finding TradingView Symbols

1. Go to [TradingView.com](https://www.tradingview.com)
2. Use the search bar to find any stock, index, or commodity
3. The symbol appears in the URL (e.g., `NSE:NIFTY`, `SP:SPX`)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Charts not loading | Refresh the page. TradingView widgets need a stable internet connection |
| "Chart loading..." message stuck | Your browser might be blocking third-party scripts. Disable ad-blockers for the site |
| Charts show "Invalid symbol" | The TradingView symbol may have changed. Search for the correct one on TradingView.com |
| Website not updating after changes | GitHub Pages can take 1-5 minutes to deploy. Check the Actions tab for build status |
| 404 error on the website | Make sure GitHub Pages is enabled in Settings → Pages → Source: master branch |

---

## Cost

**$0.** Everything used in this project is completely free:
- GitHub repository: free
- GitHub Pages hosting: free
- TradingView chart widgets: free
- Google Fonts: free
- No backend servers, no databases, no API subscriptions

---

## License

This project is open source and free to use for personal purposes. TradingView widgets are subject to [TradingView's terms of use](https://www.tradingview.com/policies/).
