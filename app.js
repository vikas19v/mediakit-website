/* ============================================
   MediaKit - Global Market Dashboard
   Main Application Logic
   ============================================

   SYMBOL STRATEGY (why we chose these):
   ──────────────────────────────────────
   TradingView embeds only support symbols from exchanges listed at:
   https://www.tradingview.com/widget-docs/markets/

   Exchanges that DO NOT work in embeds:
     - NSE (India) — blocked by NSE data policy
     - TSE (Japan) — not listed for widgets
     - LSE (UK)   — not listed for widgets
     - SSE/SZSE (China) — EOD only, unreliable

   What DOES work:
     - TVC:*        — TradingView's own calculated indices (GOLD, SILVER, NI225, UKX, SPX, DJI)
     - US ETFs      — AMEX/NYSE Arca listed ETFs (SPY, INDA, EWJ, EWU, FXI, GLD, SLV, etc.)
     - FOREXCOM:*   — Forex/CFD broker feeds (SPXUSD, etc.)
     - BITSTAMP:*   — Crypto exchanges
     - COINBASE:*   — Crypto exchanges

   For countries where direct index symbols are blocked, we use
   US-listed ETFs that track those markets as proxies.
   ============================================ */

const MARKET_DATA = {
    india: {
        name: "India",
        timezone: "Asia/Kolkata",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",                description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",              description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "AMEX:INDA",            name: "iShares MSCI India ETF",       description: "US-listed ETF tracking India's largest companies (Nifty/Sensex proxy)", btnLabel: "Nifty 50 (INDA)" },
        midcap:   { symbol: "AMEX:SMIN",            name: "iShares MSCI India Small-Cap", description: "US-listed ETF tracking India's mid & small cap stocks",                 btnLabel: "India MidCap (SMIN)" },
        smallcap: { symbol: "AMEX:INDY",            name: "iShares India 50 ETF",         description: "US-listed ETF — Nifty 50 tracker (closest small cap proxy)",            btnLabel: "India SmCap (INDY)" },
        ai:           { symbol: "AMEX:INDA",        name: "India Tech (via INDA)",        description: "India large-cap ETF — includes major IT/AI companies like TCS, Infosys" },
        semiconductors:{ symbol: "AMEX:INDA",       name: "India Tech (via INDA)",        description: "India large-cap ETF — India lacks a dedicated semiconductor index" },
        space:        null,
        photonics:    null,
        robotics:     null
    },
    usa: {
        name: "USA",
        timezone: "America/New_York",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",                description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",              description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "AMEX:SPY",             name: "S&P 500 ETF (SPY)",            description: "SPDR ETF tracking the 500 largest US companies",                       btnLabel: "S&P 500" },
        midcap:   { symbol: "AMEX:MDY",             name: "S&P MidCap 400 ETF",           description: "SPDR ETF tracking 400 mid-sized US companies",                         btnLabel: "S&P MidCap 400" },
        smallcap: { symbol: "AMEX:IWM",             name: "Russell 2000 ETF",             description: "iShares ETF tracking 2000 smallest US public companies",                btnLabel: "Russell 2000" },
        ai:           { symbol: "AMEX:AIQ",         name: "Global X AI & Big Data ETF",   description: "ETF tracking companies in artificial intelligence and big data" },
        semiconductors:{ symbol: "AMEX:SMH",        name: "VanEck Semiconductor ETF",     description: "ETF tracking the 25 largest US semiconductor companies" },
        space:        { symbol: "AMEX:UFO",         name: "Procure Space ETF",            description: "ETF tracking companies in the space industry" },
        photonics:    { symbol: "NASDAQ:LITE",      name: "Lumentum Holdings",            description: "Leading photonics company — no dedicated photonics ETF exists" },
        robotics:     { symbol: "AMEX:ROBT",        name: "First Trust Robotics ETF",     description: "ETF tracking robotics, AI and automation companies" }
    },
    uk: {
        name: "UK",
        timezone: "Europe/London",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",                description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",              description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "TVC:UKX",              name: "FTSE 100",                     description: "Index of 100 largest companies on the London Stock Exchange",           btnLabel: "FTSE 100" },
        midcap:   { symbol: "AMEX:EWU",             name: "iShares MSCI UK ETF",          description: "US-listed ETF tracking the broad UK equity market (FTSE 250 proxy)",    btnLabel: "FTSE 250 (EWU)" },
        smallcap: { symbol: "AMEX:EWUS",            name: "iShares MSCI UK Small-Cap",    description: "US-listed ETF tracking UK small-cap stocks",                            btnLabel: "UK SmallCap (EWUS)" },
        ai:           null,
        semiconductors:null,
        space:        null,
        photonics:    null,
        robotics:     null
    },
    china: {
        name: "China",
        timezone: "Asia/Shanghai",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",                description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",              description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "AMEX:FXI",             name: "iShares China Large-Cap ETF",  description: "US-listed ETF tracking 50 largest Chinese companies (CSI 300 proxy)",   btnLabel: "CSI 300 (FXI)" },
        midcap:   { symbol: "AMEX:MCHI",            name: "iShares MSCI China ETF",       description: "US-listed ETF tracking mid & large Chinese stocks (CSI 500 proxy)",     btnLabel: "CSI 500 (MCHI)" },
        smallcap: { symbol: "AMEX:CNYA",            name: "iShares MSCI China A ETF",     description: "US-listed ETF tracking China A-shares (CSI 1000 proxy)",                btnLabel: "CSI 1000 (CNYA)" },
        ai:           null,
        semiconductors:null,
        space:        null,
        photonics:    null,
        robotics:     null
    },
    japan: {
        name: "Japan",
        timezone: "Asia/Tokyo",
        gold:     { symbol: "TVC:GOLD",            name: "Gold (USD/oz)",                description: "International gold price in US dollars per troy ounce" },
        silver:   { symbol: "TVC:SILVER",           name: "Silver (USD/oz)",              description: "International silver price in US dollars per troy ounce" },
        largecap: { symbol: "TVC:NI225",             name: "Nikkei 225",                  description: "Index of 225 largest companies on the Tokyo Stock Exchange",            btnLabel: "Nikkei 225" },
        midcap:   { symbol: "AMEX:EWJ",              name: "iShares MSCI Japan ETF",      description: "US-listed ETF tracking broad Japanese equity market",                   btnLabel: "Japan Mid (EWJ)" },
        smallcap: { symbol: "AMEX:SCJ",              name: "iShares MSCI Japan SC ETF",   description: "US-listed ETF tracking Japanese small-cap stocks",                      btnLabel: "Japan SmCap (SCJ)" },
        ai:           { symbol: "AMEX:AIQ",          name: "Global X AI ETF (Global)",    description: "Global AI ETF — includes major Japanese tech/AI companies" },
        semiconductors:null,
        space:        null,
        photonics:    null,
        robotics:     { symbol: "AMEX:ROBT",         name: "Robotics ETF (Global)",       description: "Global robotics ETF — includes Japanese robotics leaders like Fanuc, Keyence" }
    }
};

// Crypto data — separate from country markets
const CRYPTO_DATA = {
    bitcoin:  { symbol: "BITSTAMP:BTCUSD", name: "Bitcoin (BTC/USD)",  description: "BTC/USD — The original cryptocurrency, traded on Bitstamp" },
    ethereum: { symbol: "BITSTAMP:ETHUSD", name: "Ethereum (ETH/USD)", description: "ETH/USD — Smart contract platform cryptocurrency, traded on Bitstamp" }
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
            { name: "Coherent Corp (II-VI)", ticker: "COHR" },
            { name: "IPG Photonics", ticker: "IPGP" },
            { name: "Viavi Solutions", ticker: "VIAV" },
            { name: "MKS Instruments", ticker: "MKSI" },
            { name: "Onto Innovation", ticker: "ONTO" },
            { name: "EMCORE", ticker: "EMKR" },
            { name: "Photon Control (Acquired)", ticker: "—" }
        ],
        robotics: [
            { name: "Intuitive Surgical", ticker: "ISRG" },
            { name: "Rockwell Automation", ticker: "ROK" },
            { name: "Cognex Corporation", ticker: "CGNX" },
            { name: "Azenta (Brooks Automation)", ticker: "AZTA" },
            { name: "Teradyne (Universal Robots)", ticker: "TER" },
            { name: "iRobot", ticker: "IRBT" },
            { name: "Symbotic", ticker: "SYM" },
            { name: "Kratos Defense (drones)", ticker: "KTOS" },
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
            { name: "NTT Data", ticker: "9613" },
            { name: "Hitachi (AI division)", ticker: "6501" },
            { name: "CyberAgent", ticker: "4751" },
            { name: "PKSHA Technology", ticker: "3993" },
            { name: "Appier Group", ticker: "4180" },
            { name: "Preferred Networks", ticker: "Private" }
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
let isCryptoMode = false;
let currentCrypto = null;

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

            if (country === currentCountry) return;

            document.querySelectorAll(".country-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentCountry = country;
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

            isCryptoMode = true;
            currentCrypto = crypto;

            document.querySelectorAll(".country-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".crypto-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

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
            btn.title = "";
        } else {
            btn.style.display = "none";
            btn.disabled = true;
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
// Uses the TradingView Advanced Chart widget via an iframe embed approach.
// This is more reliable than the old tv.js constructor for symbol compatibility.
function loadMainChart() {
    const container = document.getElementById("tradingview-chart");
    let symbol, tz;

    if (isCryptoMode && currentCrypto) {
        symbol = CRYPTO_DATA[currentCrypto].symbol;
        tz = "Etc/UTC";
    } else {
        const data = MARKET_DATA[currentCountry][currentAsset];
        if (!data) {
            container.innerHTML = renderErrorMessage("No data available", "This index is not available for the selected country. Please choose a different asset or country.");
            return;
        }
        symbol = data.symbol;
        tz = MARKET_DATA[currentCountry].timezone;
    }

    container.innerHTML = "";

    // Build the TradingView Advanced Chart Widget using their embed script
    // This method is more reliable for symbol support than the old tv.js constructor
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const widgetInner = document.createElement("div");
    widgetInner.className = "tradingview-widget-container__widget";
    widgetInner.style.height = "calc(100% - 32px)";
    widgetInner.style.width = "100%";
    widgetContainer.appendChild(widgetInner);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.textContent = JSON.stringify({
        autosize: true,
        symbol: symbol,
        interval: "D",
        timezone: tz,
        theme: "dark",
        style: "1",
        locale: "en",
        backgroundColor: "rgba(26, 35, 50, 1)",
        gridColor: "rgba(30, 45, 61, 1)",
        allow_symbol_change: false,
        calendar: false,
        hide_volume: false,
        support_host: "https://www.tradingview.com"
    });

    // Error handling: if the script fails to load
    script.onerror = function() {
        container.innerHTML = renderErrorMessage(
            "Chart failed to load",
            "Could not connect to TradingView. Please check your internet connection and try refreshing the page."
        );
    };

    widgetContainer.appendChild(script);
    container.appendChild(widgetContainer);

    // Set a timeout to check if chart loaded (the iframe should appear within 10 seconds)
    setTimeout(() => {
        const iframe = container.querySelector("iframe");
        if (!iframe) {
            // Only show error if the container still has no iframe and hasn't been replaced
            const currentContainer = document.getElementById("tradingview-chart");
            if (currentContainer && !currentContainer.querySelector("iframe")) {
                currentContainer.innerHTML = renderErrorMessage(
                    "Chart unavailable",
                    `The symbol "${symbol}" may not be available for embedding. Try selecting a different asset or country.`
                );
            }
        }
    }, 12000);
}

// ---- Error Message UI ----
function renderErrorMessage(title, message) {
    return `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#94a3b8;text-align:center;padding:40px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div style="font-size:16px;font-weight:600;color:#e2e8f0;margin-bottom:8px;">${title}</div>
            <div style="font-size:13px;color:#64748b;max-width:400px;line-height:1.5;">${message}</div>
        </div>
    `;
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

    const assetLabels = {
        largecap: "Large Cap", midcap: "Mid Cap", smallcap: "Small Cap",
        ai: "Artificial Intelligence", semiconductors: "Semiconductors",
        space: "Space Technology", photonics: "Photonics", robotics: "Robotics"
    };

    title.textContent = `${assetLabels[currentAsset] || currentAsset} — Constituent Companies`;
    subtitle.textContent = `${assetData ? assetData.name : currentAsset} • ${countryName} • ${companies.length} companies listed`;

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
