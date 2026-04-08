/* ============================================
   MediaKit - Global Market Dashboard
   Main Application Logic
   ============================================ */

// ---- Symbol Mapping ----
// Each country has 5 assets: gold, silver, largecap, midcap, smallcap
// Symbols are TradingView ticker codes that point to real market data

const MARKET_DATA = {
    india: {
        name: "India",
        timezone: "Asia/Kolkata",
        gold:     { symbol: "MCX:GOLD1!",         name: "Gold (MCX)",             description: "MCX Gold Futures - India's primary gold benchmark" },
        silver:   { symbol: "MCX:SILVER1!",        name: "Silver (MCX)",           description: "MCX Silver Futures - India's primary silver benchmark" },
        largecap: { symbol: "NSE:NIFTY",           name: "Nifty 50",              description: "Top 50 companies by market cap on NSE" },
        midcap:   { symbol: "NSE:CNXMIDCAP",       name: "Nifty Midcap 100",      description: "Top 101-200 companies by market cap on NSE" },
        smallcap: { symbol: "NSE:CNXSMALLCAP",     name: "Nifty Smallcap 100",    description: "Top 201-300 companies by market cap on NSE" }
    },
    usa: {
        name: "USA",
        timezone: "America/New_York",
        gold:     { symbol: "COMEX:GC1!",          name: "Gold Futures (COMEX)",   description: "COMEX Gold Futures - Global gold price benchmark" },
        silver:   { symbol: "COMEX:SI1!",          name: "Silver Futures (COMEX)", description: "COMEX Silver Futures - Global silver price benchmark" },
        largecap: { symbol: "SP:SPX",              name: "S&P 500",               description: "500 largest US companies - the main US market benchmark" },
        midcap:   { symbol: "SP:MID",              name: "S&P MidCap 400",        description: "400 medium-sized US companies" },
        smallcap: { symbol: "TVC:RUT",             name: "Russell 2000",           description: "2000 smallest US public companies" }
    },
    uk: {
        name: "UK",
        timezone: "Europe/London",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",          description: "International gold price in US dollars per ounce" },
        silver:   { symbol: "TVC:SILVER",          name: "Silver (USD/oz)",        description: "International silver price in US dollars per ounce" },
        largecap: { symbol: "TVC:UKX",             name: "FTSE 100",              description: "100 largest companies on London Stock Exchange" },
        midcap:   { symbol: "TVC:MCX",             name: "FTSE 250",              description: "Next 250 companies after FTSE 100 by market cap" },
        smallcap: { symbol: "LSIN:FTAI",           name: "FTSE AIM All-Share",    description: "Alternative Investment Market - smaller/growth UK companies" }
    },
    china: {
        name: "China",
        timezone: "Asia/Shanghai",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",          description: "International gold price in US dollars per ounce" },
        silver:   { symbol: "TVC:SILVER",          name: "Silver (USD/oz)",        description: "International silver price in US dollars per ounce" },
        largecap: { symbol: "SSE:000300",          name: "CSI 300",               description: "300 largest A-share stocks on Shanghai & Shenzhen exchanges" },
        midcap:   { symbol: "SSE:000905",          name: "CSI 500",               description: "Next 500 mid-sized stocks after CSI 300" },
        smallcap: { symbol: "SSE:000852",          name: "CSI 1000",              description: "1000 small-cap stocks beyond CSI 300 and CSI 500" }
    },
    japan: {
        name: "Japan",
        timezone: "Asia/Tokyo",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",          description: "International gold price in US dollars per ounce" },
        silver:   { symbol: "TVC:SILVER",          name: "Silver (USD/oz)",        description: "International silver price in US dollars per ounce" },
        largecap: { symbol: "TVC:NI225",           name: "Nikkei 225",            description: "225 largest companies on the Tokyo Stock Exchange" },
        midcap:   { symbol: "TSE:TOPIXMID400",     name: "TOPIX Mid 400",         description: "400 mid-cap Japanese stocks" },
        smallcap: { symbol: "TSE:TOPIXSMALL",      name: "TOPIX Small",           description: "Small-cap Japanese stocks on Tokyo Stock Exchange" }
    }
};

// ---- State ----
let currentCountry = "india";
let currentAsset = "gold";
let mainWidget = null;
let overviewWidgets = {};

// ---- Initialize ----
document.addEventListener("DOMContentLoaded", () => {
    setupCountryButtons();
    setupAssetButtons();
    setupOverviewCards();
    loadMainChart();
    loadOverviewCharts();
});

// ---- Country Buttons ----
function setupCountryButtons() {
    document.querySelectorAll(".country-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const country = btn.dataset.country;
            if (country === currentCountry) return;

            document.querySelectorAll(".country-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentCountry = country;
            updateUI();
            loadMainChart();
            loadOverviewCharts();
        });
    });
}

// ---- Asset Buttons ----
function setupAssetButtons() {
    document.querySelectorAll(".asset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const asset = btn.dataset.asset;
            if (asset === currentAsset) return;

            document.querySelectorAll(".asset-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentAsset = asset;
            updateUI();
            loadMainChart();
            highlightOverviewCard();
        });
    });
}

// ---- Overview Card Click ----
function setupOverviewCards() {
    document.querySelectorAll(".overview-card").forEach(card => {
        card.addEventListener("click", () => {
            const asset = card.dataset.asset;
            currentAsset = asset;

            // Update asset buttons
            document.querySelectorAll(".asset-btn").forEach(b => b.classList.remove("active"));
            document.querySelector(`.asset-btn[data-asset="${asset}"]`).classList.add("active");

            updateUI();
            loadMainChart();
            highlightOverviewCard();
        });
    });
}

// ---- Update Text & Highlights ----
function updateUI() {
    const data = MARKET_DATA[currentCountry][currentAsset];
    const countryName = MARKET_DATA[currentCountry].name;

    document.getElementById("chart-title").textContent = `${data.name} - ${countryName}`;
    document.getElementById("chart-description").textContent = data.description;
    document.getElementById("overview-country").textContent = countryName;
    highlightOverviewCard();
}

function highlightOverviewCard() {
    document.querySelectorAll(".overview-card").forEach(card => {
        card.classList.toggle("active", card.dataset.asset === currentAsset);
    });
}

// ---- Load Main Chart (TradingView Advanced Chart) ----
function loadMainChart() {
    const container = document.getElementById("tradingview-chart");
    const data = MARKET_DATA[currentCountry][currentAsset];

    // Clear previous widget
    container.innerHTML = "";

    // Create a fresh div for the widget (TradingView needs a clean container)
    const widgetDiv = document.createElement("div");
    widgetDiv.id = "tv_main_chart";
    widgetDiv.style.width = "100%";
    widgetDiv.style.height = "100%";
    container.appendChild(widgetDiv);

    try {
        mainWidget = new TradingView.widget({
            container_id: "tv_main_chart",
            autosize: true,
            symbol: data.symbol,
            interval: "D",              // Daily candles by default
            timezone: MARKET_DATA[currentCountry].timezone,
            theme: "dark",
            style: "1",                 // Candlestick chart
            locale: "en",
            toolbar_bg: "#1a2332",
            enable_publishing: false,
            allow_symbol_change: false,
            hide_top_toolbar: false,
            hide_side_toolbar: false,
            withdateranges: true,       // Show date range selector (1D, 1W, 1M, etc.)
            save_image: true,
            studies: ["MASimple@tv-basicstudies"],  // 50-day moving average
            show_popup_button: true,
            popup_width: "1000",
            popup_height: "650",
            backgroundColor: "#1a2332",
            gridColor: "#1e2d3d",
        });
    } catch (e) {
        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:14px;">
            Chart loading... If it doesn't appear, please refresh the page.
        </div>`;
    }
}

// ---- Load Overview Mini Charts (TradingView Mini Chart Widgets) ----
function loadOverviewCharts() {
    const assets = ["gold", "silver", "largecap", "midcap", "smallcap"];

    assets.forEach(asset => {
        const container = document.getElementById(`overview-${asset}`);
        const data = MARKET_DATA[currentCountry][asset];

        container.innerHTML = "";

        const widgetDiv = document.createElement("div");
        widgetDiv.className = "tradingview-widget-container";
        container.appendChild(widgetDiv);

        const innerDiv = document.createElement("div");
        innerDiv.className = "tradingview-widget-container__widget";
        widgetDiv.appendChild(innerDiv);

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.async = true;
        script.textContent = JSON.stringify({
            symbol: data.symbol,
            width: "100%",
            height: "100%",
            locale: "en",
            dateRange: "12M",
            colorTheme: "dark",
            isTransparent: true,
            autosize: true,
            largeChartUrl: "",
            noTimeScale: false,
            chartOnly: false
        });

        widgetDiv.appendChild(script);
    });

    highlightOverviewCard();
}
