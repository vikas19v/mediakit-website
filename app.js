/* ============================================
   MediaKit - Global Market Dashboard
   Main Application Logic
   ============================================ */

// ---- Symbol Mapping ----
// All symbols use TradingView embed-compatible tickers only.
// Symbols like SP:SPX don't work in embedded widgets — use alternatives.

const MARKET_DATA = {
    india: {
        name: "India",
        timezone: "Asia/Kolkata",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",              description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",            description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "NSE:NIFTY",            name: "Nifty 50",                  description: "Top 50 companies by market cap on NSE",                  btnLabel: "Nifty 50" },
        midcap:   { symbol: "NSE:CNXMIDCAP",        name: "Nifty Midcap 100",          description: "Mid-sized companies ranked 101-200 on NSE",              btnLabel: "Nifty Midcap 100" },
        smallcap: { symbol: "NSE:CNXSMALLCAP",      name: "Nifty Smallcap 100",        description: "Small companies ranked 201-300 on NSE",                  btnLabel: "Nifty Smallcap 100" },
        ai:           { symbol: "NSE:NIFTYIT",      name: "Nifty IT",                  description: "Nifty IT index — closest proxy for AI/tech in India" },
        semiconductors:{ symbol: "NSE:NIFTYIT",     name: "Nifty IT",                  description: "Nifty IT index — India has no dedicated semiconductor index" },
        space:        null,
        photonics:    null,
        robotics:     null
    },
    usa: {
        name: "USA",
        timezone: "America/New_York",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",              description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",            description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "FOREXCOM:SPXUSD",      name: "S&P 500",                   description: "500 largest US companies — the main US market benchmark", btnLabel: "S&P 500" },
        midcap:   { symbol: "AMEX:MDY",             name: "S&P MidCap 400 ETF",        description: "ETF tracking 400 mid-sized US companies",                btnLabel: "S&P MidCap 400" },
        smallcap: { symbol: "AMEX:IWM",             name: "Russell 2000 ETF",           description: "ETF tracking 2000 smallest US public companies",         btnLabel: "Russell 2000" },
        ai:           { symbol: "NASDAQ:BOTZ",      name: "Global X AI & Tech ETF",    description: "ETF tracking companies in AI and robotics" },
        semiconductors:{ symbol: "NASDAQ:SOXX",     name: "iShares Semiconductor ETF", description: "ETF tracking the largest US semiconductor companies" },
        space:        { symbol: "AMEX:UFO",         name: "Procure Space ETF",         description: "ETF tracking companies in the space industry" },
        photonics:    { symbol: "NASDAQ:LITE",      name: "Lumentum Holdings",         description: "Leading photonics company — no dedicated photonics ETF exists" },
        robotics:     { symbol: "AMEX:ROBT",        name: "First Trust Robotics ETF",  description: "ETF tracking robotics and automation companies" }
    },
    uk: {
        name: "UK",
        timezone: "Europe/London",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",              description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",            description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "TVC:UKX",              name: "FTSE 100",                  description: "100 largest companies on the London Stock Exchange",      btnLabel: "FTSE 100" },
        midcap:   { symbol: "TVC:MCX",              name: "FTSE 250",                  description: "Next 250 companies after FTSE 100 by market cap",         btnLabel: "FTSE 250" },
        smallcap: { symbol: "LSE:ISP",              name: "FTSE SmallCap ETF",         description: "iShares UK Small Cap ETF on London Stock Exchange",        btnLabel: "FTSE SmallCap" },
        ai:           null,
        semiconductors:null,
        space:        null,
        photonics:    null,
        robotics:     null
    },
    china: {
        name: "China",
        timezone: "Asia/Shanghai",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",              description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",            description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "SSE:000300",            name: "CSI 300",                   description: "300 largest A-share stocks on Shanghai & Shenzhen",       btnLabel: "CSI 300" },
        midcap:   { symbol: "SSE:000905",            name: "CSI 500",                   description: "500 mid-sized stocks after CSI 300",                     btnLabel: "CSI 500" },
        smallcap: { symbol: "SSE:000852",            name: "CSI 1000",                  description: "1000 small-cap stocks beyond CSI 300 & 500",             btnLabel: "CSI 1000" },
        ai:           null,
        semiconductors:null,
        space:        null,
        photonics:    null,
        robotics:     null
    },
    japan: {
        name: "Japan",
        timezone: "Asia/Tokyo",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",              description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",            description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "TVC:NI225",             name: "Nikkei 225",                description: "225 largest companies on the Tokyo Stock Exchange",       btnLabel: "Nikkei 225" },
        midcap:   { symbol: "TSE:2632",              name: "MAXIS TOPIX Mid400 ETF",   description: "ETF tracking mid-cap Japanese stocks",                    btnLabel: "TOPIX Mid 400" },
        smallcap: { symbol: "TSE:1318",              name: "TOPIX Small ETF",           description: "ETF tracking small-cap Japanese stocks",                  btnLabel: "TOPIX Small" },
        ai:           { symbol: "TSE:2631",          name: "MAXIS Nikkei AI ETF",      description: "Japanese AI-related companies ETF" },
        semiconductors:null,
        space:        null,
        photonics:    null,
        robotics:     { symbol: "TSE:2522",          name: "iShares Robotics ETF JP",  description: "Japanese robotics and automation ETF" }
    }
};

// Crypto data — separate from country markets
const CRYPTO_DATA = {
    bitcoin:  { symbol: "BITSTAMP:BTCUSD", name: "Bitcoin",  description: "BTC/USD — The original cryptocurrency" },
    ethereum: { symbol: "BITSTAMP:ETHUSD", name: "Ethereum", description: "ETH/USD — Smart contract platform cryptocurrency" }
};


// ---- Constituent Companies ----
// Major companies for each sector/index per country (indicative lists)

const CONSTITUENTS = {
    india: {
        largecap: [
            { name: "Reliance Industries", ticker: "RELIANCE" },
            { name: "Tata Consultancy Services", ticker: "TCS" },
            { name: "HDFC Bank", ticker: "HDFCBANK" },
            { name: "Infosys", ticker: "INFY" },
            { name: "ICICI Bank", ticker: "ICICIBANK" },
            { name: "Bharti Airtel", ticker: "BHARTIARTL" },
            { name: "State Bank of India", ticker: "SBIN" },
            { name: "Hindustan Unilever", ticker: "HINDUNILVR" },
            { name: "ITC Limited", ticker: "ITC" },
            { name: "Bajaj Finance", ticker: "BAJFINANCE" },
            { name: "Kotak Mahindra Bank", ticker: "KOTAKBANK" },
            { name: "Larsen & Toubro", ticker: "LT" },
            { name: "HCL Technologies", ticker: "HCLTECH" },
            { name: "Axis Bank", ticker: "AXISBANK" },
            { name: "Maruti Suzuki", ticker: "MARUTI" },
            { name: "Sun Pharmaceutical", ticker: "SUNPHARMA" },
            { name: "Tata Motors", ticker: "TATAMOTORS" },
            { name: "Mahindra & Mahindra", ticker: "M&M" },
            { name: "NTPC Limited", ticker: "NTPC" },
            { name: "Wipro", ticker: "WIPRO" }
        ],
        midcap: [
            { name: "AU Small Finance Bank", ticker: "AUBANK" },
            { name: "Voltas", ticker: "VOLTAS" },
            { name: "MRF Limited", ticker: "MRF" },
            { name: "Indian Hotels", ticker: "INDHOTEL" },
            { name: "Tata Communications", ticker: "TATACOMM" },
            { name: "Persistent Systems", ticker: "PERSISTENT" },
            { name: "LTIMindtree", ticker: "LTIM" },
            { name: "Trent Limited", ticker: "TRENT" },
            { name: "Mphasis", ticker: "MPHASIS" },
            { name: "Max Healthcare", ticker: "MAXHEALTH" },
            { name: "Coforge", ticker: "COFORGE" },
            { name: "IDFC First Bank", ticker: "IDFCFIRSTB" },
            { name: "Ashok Leyland", ticker: "ASHOKLEY" },
            { name: "Polycab India", ticker: "POLYCAB" },
            { name: "Suzlon Energy", ticker: "SUZLON" }
        ],
        smallcap: [
            { name: "IRFC", ticker: "IRFC" },
            { name: "Kalyan Jewellers", ticker: "KALYANKJIL" },
            { name: "Central Depository (CDSL)", ticker: "CDSL" },
            { name: "Angel One", ticker: "ANGELONE" },
            { name: "Affle India", ticker: "AFFLE" },
            { name: "Praj Industries", ticker: "PRAJIND" },
            { name: "Laurus Labs", ticker: "LAURUSLABS" },
            { name: "CreditAccess Grameen", ticker: "CREDITACC" },
            { name: "KPIT Technologies", ticker: "KPITTECH" },
            { name: "Narayana Hrudayalaya", ticker: "NH" },
            { name: "Deepak Nitrite", ticker: "DEEPAKNTR" },
            { name: "Zensar Technologies", ticker: "ZENSARTECH" }
        ],
        ai: [
            { name: "Tata Consultancy Services", ticker: "TCS" },
            { name: "Infosys", ticker: "INFY" },
            { name: "HCL Technologies", ticker: "HCLTECH" },
            { name: "Wipro", ticker: "WIPRO" },
            { name: "Tech Mahindra", ticker: "TECHM" },
            { name: "LTIMindtree", ticker: "LTIM" },
            { name: "Persistent Systems", ticker: "PERSISTENT" },
            { name: "KPIT Technologies", ticker: "KPITTECH" },
            { name: "Coforge", ticker: "COFORGE" },
            { name: "Mphasis", ticker: "MPHASIS" }
        ],
        semiconductors: [
            { name: "Tata Elxsi", ticker: "TATAELXSI" },
            { name: "KPIT Technologies", ticker: "KPITTECH" },
            { name: "Cyient", ticker: "CYIENT" },
            { name: "ASM Technologies", ticker: "ASMTEC" },
            { name: "Vedanta (semiconductor fab)", ticker: "VEDL" },
            { name: "Dixon Technologies", ticker: "DIXON" },
            { name: "SPEL Semiconductor", ticker: "SPEL" },
            { name: "Moschip Technologies", ticker: "MOSCHIP" }
        ]
    },
    usa: {
        largecap: [
            { name: "Apple", ticker: "AAPL" },
            { name: "Microsoft", ticker: "MSFT" },
            { name: "NVIDIA", ticker: "NVDA" },
            { name: "Amazon", ticker: "AMZN" },
            { name: "Alphabet (Google)", ticker: "GOOGL" },
            { name: "Meta Platforms", ticker: "META" },
            { name: "Berkshire Hathaway", ticker: "BRK.B" },
            { name: "Tesla", ticker: "TSLA" },
            { name: "UnitedHealth Group", ticker: "UNH" },
            { name: "JPMorgan Chase", ticker: "JPM" },
            { name: "Johnson & Johnson", ticker: "JNJ" },
            { name: "Visa", ticker: "V" },
            { name: "Broadcom", ticker: "AVGO" },
            { name: "Mastercard", ticker: "MA" },
            { name: "Procter & Gamble", ticker: "PG" },
            { name: "Home Depot", ticker: "HD" },
            { name: "Costco", ticker: "COST" },
            { name: "Eli Lilly", ticker: "LLY" },
            { name: "Netflix", ticker: "NFLX" },
            { name: "Adobe", ticker: "ADBE" }
        ],
        midcap: [
            { name: "Deckers Outdoor", ticker: "DECK" },
            { name: "Builders FirstSource", ticker: "BLDR" },
            { name: "Reliance Steel", ticker: "RS" },
            { name: "Carlisle Companies", ticker: "CSL" },
            { name: "Targa Resources", ticker: "TRGP" },
            { name: "Steel Dynamics", ticker: "STLD" },
            { name: "Booz Allen Hamilton", ticker: "BAH" },
            { name: "Leidos Holdings", ticker: "LDOS" },
            { name: "Hubbell", ticker: "HUBB" },
            { name: "Jabil", ticker: "JBL" },
            { name: "Curtiss-Wright", ticker: "CW" },
            { name: "EQT Corporation", ticker: "EQT" }
        ],
        smallcap: [
            { name: "Super Micro Computer", ticker: "SMCI" },
            { name: "Rambus", ticker: "RMBS" },
            { name: "Comfort Systems", ticker: "FIX" },
            { name: "Installed Building Products", ticker: "IBP" },
            { name: "MACOM Technology", ticker: "MTSI" },
            { name: "Chart Industries", ticker: "GTLS" },
            { name: "Clearwater Analytics", ticker: "CWAN" },
            { name: "Axcelis Technologies", ticker: "ACLS" },
            { name: "SPS Commerce", ticker: "SPSC" },
            { name: "Onto Innovation", ticker: "ONTO" }
        ],
        ai: [
            { name: "NVIDIA", ticker: "NVDA" },
            { name: "Microsoft", ticker: "MSFT" },
            { name: "Alphabet (Google)", ticker: "GOOGL" },
            { name: "Meta Platforms", ticker: "META" },
            { name: "Amazon (AWS AI)", ticker: "AMZN" },
            { name: "Palantir Technologies", ticker: "PLTR" },
            { name: "C3.ai", ticker: "AI" },
            { name: "UiPath", ticker: "PATH" },
            { name: "SoundHound AI", ticker: "SOUN" },
            { name: "BigBear.ai", ticker: "BBAI" },
            { name: "Recursion Pharma", ticker: "RXRX" },
            { name: "Veritone", ticker: "VERI" },
            { name: "CrowdStrike (AI Security)", ticker: "CRWD" },
            { name: "Datadog (AI Ops)", ticker: "DDOG" },
            { name: "Snowflake (AI Data)", ticker: "SNOW" }
        ],
        semiconductors: [
            { name: "NVIDIA", ticker: "NVDA" },
            { name: "Broadcom", ticker: "AVGO" },
            { name: "AMD", ticker: "AMD" },
            { name: "Intel", ticker: "INTC" },
            { name: "Qualcomm", ticker: "QCOM" },
            { name: "Texas Instruments", ticker: "TXN" },
            { name: "Applied Materials", ticker: "AMAT" },
            { name: "Lam Research", ticker: "LRCX" },
            { name: "KLA Corporation", ticker: "KLAC" },
            { name: "Marvell Technology", ticker: "MRVL" },
            { name: "Micron Technology", ticker: "MU" },
            { name: "ON Semiconductor", ticker: "ON" },
            { name: "Microchip Technology", ticker: "MCHP" },
            { name: "Analog Devices", ticker: "ADI" },
            { name: "Skyworks Solutions", ticker: "SWKS" }
        ],
        space: [
            { name: "SpaceX (Private)", ticker: "—" },
            { name: "Rocket Lab USA", ticker: "RKLB" },
            { name: "Virgin Galactic", ticker: "SPCE" },
            { name: "Astra Space", ticker: "ASTR" },
            { name: "Planet Labs", ticker: "PL" },
            { name: "Mynaric", ticker: "MYNA" },
            { name: "Terran Orbital", ticker: "LLAP" },
            { name: "Spire Global", ticker: "SPIR" },
            { name: "BlackSky Technology", ticker: "BKSY" },
            { name: "Lockheed Martin (Space)", ticker: "LMT" },
            { name: "Northrop Grumman (Space)", ticker: "NOC" },
            { name: "Boeing (Space)", ticker: "BA" },
            { name: "L3Harris Technologies", ticker: "LHX" }
        ],
        photonics: [
            { name: "Lumentum Holdings", ticker: "LITE" },
            { name: "II-VI / Coherent", ticker: "COHR" },
            { name: "IPG Photonics", ticker: "IPGP" },
            { name: "Viavi Solutions", ticker: "VIAV" },
            { name: "Hamamatsu Photonics (US ADR)", ticker: "HMPCY" },
            { name: "MKS Instruments", ticker: "MKSI" },
            { name: "Photon Control (Acq.)", ticker: "—" },
            { name: "Onto Innovation", ticker: "ONTO" },
            { name: "Ushio (US ADR)", ticker: "USHOY" },
            { name: "EMCORE", ticker: "EMKR" }
        ],
        robotics: [
            { name: "Intuitive Surgical", ticker: "ISRG" },
            { name: "Rockwell Automation", ticker: "ROK" },
            { name: "Cognex Corporation", ticker: "CGNX" },
            { name: "Brooks Automation", ticker: "AZTA" },
            { name: "Teradyne (Universal Robots)", ticker: "TER" },
            { name: "iRobot", ticker: "IRBT" },
            { name: "Symbotic", ticker: "SYM" },
            { name: "Kratos Defense (drones)", ticker: "KTOS" },
            { name: "Sarcos Technology", ticker: "STRC" },
            { name: "UiPath (RPA)", ticker: "PATH" },
            { name: "ABB Ltd (US listed)", ticker: "ABB" },
            { name: "Fanuc (US ADR)", ticker: "FANUY" }
        ]
    },
    uk: {
        largecap: [
            { name: "AstraZeneca", ticker: "AZN" },
            { name: "Shell", ticker: "SHEL" },
            { name: "HSBC Holdings", ticker: "HSBA" },
            { name: "Unilever", ticker: "ULVR" },
            { name: "BP", ticker: "BP" },
            { name: "Rio Tinto", ticker: "RIO" },
            { name: "GlaxoSmithKline", ticker: "GSK" },
            { name: "British American Tobacco", ticker: "BATS" },
            { name: "Diageo", ticker: "DGE" },
            { name: "Glencore", ticker: "GLEN" },
            { name: "Barclays", ticker: "BARC" },
            { name: "Lloyds Banking Group", ticker: "LLOY" },
            { name: "Rolls-Royce Holdings", ticker: "RR" },
            { name: "National Grid", ticker: "NG" },
            { name: "RELX", ticker: "REL" }
        ],
        midcap: [
            { name: "easyJet", ticker: "EZJ" },
            { name: "Aston Martin Lagonda", ticker: "AML" },
            { name: "JD Sports Fashion", ticker: "JD" },
            { name: "Watches of Switzerland", ticker: "WOSG" },
            { name: "Trustpilot Group", ticker: "TRST" },
            { name: "Pets at Home", ticker: "PETS" },
            { name: "Wizz Air", ticker: "WIZZ" },
            { name: "Harbour Energy", ticker: "HBR" },
            { name: "FirstGroup", ticker: "FGP" },
            { name: "Paragon Banking Group", ticker: "PAG" }
        ],
        smallcap: [
            { name: "Ceres Power", ticker: "CWR" },
            { name: "Ithaca Energy", ticker: "ITH" },
            { name: "Treatt", ticker: "TET" },
            { name: "Argentex Group", ticker: "AGFX" },
            { name: "Tribal Group", ticker: "TRB" },
            { name: "Kitwave Group", ticker: "KITW" },
            { name: "Volex", ticker: "VLX" },
            { name: "Boku", ticker: "BOKU" }
        ]
    },
    china: {
        largecap: [
            { name: "Kweichow Moutai", ticker: "600519" },
            { name: "ICBC", ticker: "601398" },
            { name: "China Construction Bank", ticker: "601939" },
            { name: "Ping An Insurance", ticker: "601318" },
            { name: "Agricultural Bank of China", ticker: "601288" },
            { name: "Bank of China", ticker: "601988" },
            { name: "China Merchants Bank", ticker: "600036" },
            { name: "CATL (Battery)", ticker: "300750" },
            { name: "BYD Company", ticker: "002594" },
            { name: "China Mobile", ticker: "600941" },
            { name: "PetroChina", ticker: "601857" },
            { name: "Wuliangye Yibin", ticker: "000858" },
            { name: "Midea Group", ticker: "000333" },
            { name: "LONGi Green Energy", ticker: "601012" },
            { name: "China Yangtze Power", ticker: "600900" }
        ],
        midcap: [
            { name: "Foxconn Industrial", ticker: "601138" },
            { name: "Haier Smart Home", ticker: "600690" },
            { name: "Zhangjiang High-Tech", ticker: "600895" },
            { name: "Gree Electric", ticker: "000651" },
            { name: "East Money Information", ticker: "300059" },
            { name: "Sungrow Power Supply", ticker: "300274" },
            { name: "Goertek", ticker: "002241" },
            { name: "Luxshare Precision", ticker: "002475" },
            { name: "Will Semiconductor", ticker: "603501" },
            { name: "S.F. Holding", ticker: "002352" }
        ],
        smallcap: [
            { name: "Naura Technology", ticker: "002371" },
            { name: "Maxscend Microelectronics", ticker: "300782" },
            { name: "Shanghai Junshi Bio", ticker: "688180" },
            { name: "Kingsoft Cloud", ticker: "688111" },
            { name: "Cambricon Technologies", ticker: "688256" },
            { name: "Hygon Information Tech", ticker: "688041" },
            { name: "Zhejiang Supcon Tech", ticker: "688777" },
            { name: "Beijing Kingsoft Office", ticker: "688111" }
        ]
    },
    japan: {
        largecap: [
            { name: "Toyota Motor", ticker: "7203" },
            { name: "Sony Group", ticker: "6758" },
            { name: "Mitsubishi UFJ Financial", ticker: "8306" },
            { name: "Keyence", ticker: "6861" },
            { name: "Tokyo Electron", ticker: "8035" },
            { name: "SoftBank Group", ticker: "9984" },
            { name: "Shin-Etsu Chemical", ticker: "4063" },
            { name: "Hitachi", ticker: "6501" },
            { name: "Recruit Holdings", ticker: "6098" },
            { name: "Daikin Industries", ticker: "6367" },
            { name: "KDDI", ticker: "9433" },
            { name: "Nintendo", ticker: "7974" },
            { name: "Honda Motor", ticker: "7267" },
            { name: "Fast Retailing (Uniqlo)", ticker: "9983" },
            { name: "Mitsubishi Corporation", ticker: "8058" }
        ],
        midcap: [
            { name: "Omron Corporation", ticker: "6645" },
            { name: "Komatsu", ticker: "6301" },
            { name: "Nidec Corporation", ticker: "6594" },
            { name: "Kubota", ticker: "6326" },
            { name: "Suzuki Motor", ticker: "7269" },
            { name: "Shimano", ticker: "7309" },
            { name: "Olympus Corporation", ticker: "7733" },
            { name: "Sysmex Corporation", ticker: "6869" },
            { name: "Hoya Corporation", ticker: "7741" },
            { name: "Sumitomo Mitsui Trust", ticker: "8309" }
        ],
        smallcap: [
            { name: "Lasertec", ticker: "6920" },
            { name: "Socionext", ticker: "6526" },
            { name: "Renesas Electronics", ticker: "6723" },
            { name: "Disco Corporation", ticker: "6146" },
            { name: "Advantest", ticker: "6857" },
            { name: "MonotaRO", ticker: "3064" },
            { name: "Freee K.K.", ticker: "4478" },
            { name: "GMO Payment Gateway", ticker: "3769" }
        ],
        ai: [
            { name: "SoftBank Group", ticker: "9984" },
            { name: "NEC Corporation", ticker: "6701" },
            { name: "Fujitsu", ticker: "6702" },
            { name: "Preferred Networks (Private)", ticker: "—" },
            { name: "NTT Data", ticker: "9613" },
            { name: "Hitachi (AI division)", ticker: "6501" },
            { name: "CyberAgent", ticker: "4751" },
            { name: "Brain Corporation (JP)", ticker: "—" },
            { name: "PKSHA Technology", ticker: "3993" },
            { name: "Appier Group", ticker: "4180" }
        ],
        robotics: [
            { name: "Fanuc", ticker: "6954" },
            { name: "Keyence", ticker: "6861" },
            { name: "Yaskawa Electric", ticker: "6506" },
            { name: "Kawasaki Heavy Industries", ticker: "7012" },
            { name: "Omron Corporation", ticker: "6645" },
            { name: "Nachi-Fujikoshi", ticker: "6474" },
            { name: "Harmonic Drive Systems", ticker: "6324" },
            { name: "Daifuku", ticker: "6383" },
            { name: "SMC Corporation", ticker: "6273" },
            { name: "THK Co.", ticker: "6481" }
        ]
    }
};


// ---- State ----
let currentCountry = "india";
let currentAsset = "gold";
let isCryptoMode = false;       // true when Bitcoin/Ethereum is selected
let currentCrypto = null;       // "bitcoin" or "ethereum"

// ---- Initialize ----
document.addEventListener("DOMContentLoaded", () => {
    setupCountryButtons();
    setupCryptoButtons();
    setupAssetButtons();
    updateAssetLabels();
    updateSectorAvailability();
    loadMainChart();
    renderConstituents();
});

// ---- Country Buttons ----
function setupCountryButtons() {
    document.querySelectorAll(".country-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const country = btn.dataset.country;

            // Exit crypto mode
            isCryptoMode = false;
            currentCrypto = null;
            document.querySelectorAll(".crypto-btn").forEach(b => b.classList.remove("active"));

            // Show asset nav
            document.querySelector(".asset-nav").classList.remove("hidden");

            if (country === currentCountry && !isCryptoMode) return;

            document.querySelectorAll(".country-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentCountry = country;

            // Update button labels for new country
            updateAssetLabels();
            updateSectorAvailability();

            // If current asset not available in new country, fallback to gold
            if (!MARKET_DATA[currentCountry][currentAsset]) {
                currentAsset = "gold";
                document.querySelectorAll(".asset-btn").forEach(b => b.classList.remove("active"));
                document.querySelector('.asset-btn[data-asset="gold"]').classList.add("active");
            }

            updateUI();
            loadMainChart();
            renderConstituents();
        });
    });
}

// ---- Crypto Buttons ----
function setupCryptoButtons() {
    document.querySelectorAll(".crypto-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const crypto = btn.dataset.crypto;

            // Enter crypto mode
            isCryptoMode = true;
            currentCrypto = crypto;

            // Deactivate country and asset buttons
            document.querySelectorAll(".country-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".crypto-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Hide asset nav (not relevant for crypto)
            document.querySelector(".asset-nav").classList.add("hidden");

            updateUI();
            loadMainChart();
            renderConstituents();
        });
    });
}

// ---- Asset Buttons ----
function setupAssetButtons() {
    document.querySelectorAll(".asset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const asset = btn.dataset.asset;
            if (asset === currentAsset) return;

            // Check if this asset is available
            if (!MARKET_DATA[currentCountry][asset]) return;

            document.querySelectorAll(".asset-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentAsset = asset;
            updateUI();
            loadMainChart();
            renderConstituents();
        });
    });
}

// ---- Dynamic Button Labels ----
function updateAssetLabels() {
    const country = MARKET_DATA[currentCountry];

    ["largecap", "midcap", "smallcap"].forEach(asset => {
        const btn = document.getElementById(`btn-${asset}`);
        if (btn && country[asset] && country[asset].btnLabel) {
            btn.textContent = country[asset].btnLabel;
        } else if (btn) {
            // Fallback generic labels
            const fallback = { largecap: "Large Cap", midcap: "Mid Cap", smallcap: "Small Cap" };
            btn.textContent = fallback[asset];
        }
    });
}

// ---- Sector Availability ----
function updateSectorAvailability() {
    const country = MARKET_DATA[currentCountry];
    const sectorAssets = ["ai", "semiconductors", "space", "photonics", "robotics"];

    sectorAssets.forEach(asset => {
        const btn = document.querySelector(`.asset-btn[data-asset="${asset}"]`);
        if (!btn) return;

        if (country[asset]) {
            btn.style.display = "";
            btn.disabled = false;
            btn.style.opacity = "1";
        } else {
            btn.style.display = "none";
            btn.disabled = true;
            // If this was the active asset, switch to gold
            if (currentAsset === asset) {
                currentAsset = "gold";
                document.querySelectorAll(".asset-btn").forEach(b => b.classList.remove("active"));
                document.querySelector('.asset-btn[data-asset="gold"]').classList.add("active");
            }
        }
    });
}

// ---- Update UI Text ----
function updateUI() {
    if (isCryptoMode && currentCrypto) {
        const data = CRYPTO_DATA[currentCrypto];
        document.getElementById("chart-title").textContent = data.name;
        document.getElementById("chart-description").textContent = data.description;
    } else {
        const data = MARKET_DATA[currentCountry][currentAsset];
        const countryName = MARKET_DATA[currentCountry].name;
        document.getElementById("chart-title").textContent = `${data.name} — ${countryName}`;
        document.getElementById("chart-description").textContent = data.description;
    }
}

// ---- Load Main Chart ----
function loadMainChart() {
    const container = document.getElementById("tradingview-chart");
    let symbol, tz;

    if (isCryptoMode && currentCrypto) {
        symbol = CRYPTO_DATA[currentCrypto].symbol;
        tz = "Etc/UTC";
    } else {
        symbol = MARKET_DATA[currentCountry][currentAsset].symbol;
        tz = MARKET_DATA[currentCountry].timezone;
    }

    container.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.id = "tv_main_chart";
    widgetDiv.style.width = "100%";
    widgetDiv.style.height = "100%";
    container.appendChild(widgetDiv);

    try {
        new TradingView.widget({
            container_id: "tv_main_chart",
            autosize: true,
            symbol: symbol,
            interval: "D",
            timezone: tz,
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#1a2332",
            enable_publishing: false,
            allow_symbol_change: false,
            hide_top_toolbar: false,
            hide_side_toolbar: false,
            withdateranges: true,
            save_image: true,
            studies: ["MASimple@tv-basicstudies"],
            show_popup_button: true,
            popup_width: "1000",
            popup_height: "650",
            backgroundColor: "#1a2332",
            gridColor: "#1e2d3d",
        });
    } catch (e) {
        container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:14px;">Chart loading... If it doesn\'t appear, please refresh the page.</div>';
    }
}

// ---- Render Constituent Companies ----
function renderConstituents() {
    const section = document.getElementById("constituents-section");
    const grid = document.getElementById("constituents-grid");
    const title = document.getElementById("constituents-title");
    const subtitle = document.getElementById("constituents-subtitle");

    // Hide for crypto or commodities (gold/silver) — no constituent companies
    if (isCryptoMode || currentAsset === "gold" || currentAsset === "silver") {
        section.classList.remove("visible");
        return;
    }

    const countryConstituents = CONSTITUENTS[currentCountry];
    if (!countryConstituents) {
        section.classList.remove("visible");
        return;
    }

    const companies = countryConstituents[currentAsset];
    if (!companies || companies.length === 0) {
        section.classList.remove("visible");
        return;
    }

    const assetData = MARKET_DATA[currentCountry][currentAsset];
    const countryName = MARKET_DATA[currentCountry].name;

    // Friendly asset label
    const assetLabels = {
        largecap: "Large Cap", midcap: "Mid Cap", smallcap: "Small Cap",
        ai: "Artificial Intelligence", semiconductors: "Semiconductors",
        space: "Space Technology", photonics: "Photonics", robotics: "Robotics"
    };

    title.textContent = `${assetLabels[currentAsset] || currentAsset} — Constituent Companies`;
    subtitle.textContent = `${assetData.name} • ${countryName} • ${companies.length} companies listed`;

    grid.innerHTML = "";

    companies.forEach((company, index) => {
        const card = document.createElement("div");
        card.className = "constituent-card";
        card.innerHTML = `
            <span class="constituent-rank">${index + 1}</span>
            <div class="constituent-info">
                <div class="constituent-name" title="${company.name}">${company.name}</div>
                <div class="constituent-ticker">${company.ticker}</div>
            </div>
            <span class="constituent-country-tag">${countryName}</span>
        `;
        grid.appendChild(card);
    });

    section.classList.add("visible");
}
