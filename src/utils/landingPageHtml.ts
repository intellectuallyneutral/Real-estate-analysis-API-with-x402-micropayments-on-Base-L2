export const landingPageHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sparks RE API — Intelligent Real Estate Analysis & Compliance</title>
  <meta name="description" content="AI-powered real estate tools for property normalization, FHA compliance scanning, and investor metrics calculation. Powered by x402 micropayments.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0b0f19;
      --bg-card: rgba(17, 24, 39, 0.7);
      --bg-input: rgba(31, 41, 55, 0.5);
      --border-color: rgba(255, 255, 255, 0.08);
      --border-focus: #3b82f6;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --accent-blue: #3b82f6;
      --accent-teal: #10b981;
      --accent-purple: #8b5cf6;
      --accent-orange: #f59e0b;
      --accent-red: #ef4444;
      --font-outfit: 'Outfit', sans-serif;
      --font-inter: 'Inter', sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-inter);
      min-height: 100vh;
      overflow-x: hidden;
      line-height: 1.5;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%);
    }

    /* Container */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Header */
    header {
      padding: 32px 0;
      border-bottom: 1px solid var(--border-color);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 15, 25, 0.8);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-outfit);
      font-weight: 800;
      font-size: 20px;
      color: white;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
    }

    .logo-text {
      font-family: var(--font-outfit);
      font-weight: 700;
      font-size: 22px;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #ffffff, #9ca3af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .nav-link {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: var(--text-main);
    }

    .btn-wallet {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      color: var(--accent-blue);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-wallet:hover {
      background: rgba(59, 130, 246, 0.2);
      border-color: var(--accent-blue);
      transform: translateY(-1px);
    }

    /* Hero Section */
    .hero {
      padding: 80px 0 48px 0;
      text-align: center;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.2);
      color: #a78bfa;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 24px;
      font-family: var(--font-outfit);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .badge-base {
      background: rgba(59, 130, 246, 0.1);
      border-color: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }

    .hero-title {
      font-family: var(--font-outfit);
      font-size: 54px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 20px;
      letter-spacing: -1px;
      background: linear-gradient(to right, #ffffff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 18px;
      color: var(--text-muted);
      max-width: 680px;
      margin: 0 auto 40px auto;
      font-weight: 400;
    }

    .hero-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      color: white;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--text-main);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    /* Counter Alert */
    .trial-counter-alert {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.15);
      border-radius: 12px;
      padding: 16px;
      max-width: 600px;
      margin: 32px auto 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 14px;
      color: #a7f3d0;
    }

    .trial-count-number {
      font-weight: 700;
      color: var(--accent-teal);
      background: rgba(16, 185, 129, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* Interactive Section */
    .playground-section {
      padding: 60px 0;
    }

    .section-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .section-title {
      font-family: var(--font-outfit);
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .section-desc {
      color: var(--text-muted);
      max-width: 500px;
      margin: 0 auto;
      font-size: 15px;
    }

    /* Playground Tabs */
    .playground-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .playground-tabs {
      display: flex;
      border-bottom: 1px solid var(--border-color);
      background: rgba(17, 24, 39, 0.4);
    }

    .tab-btn {
      flex: 1;
      padding: 18px 12px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-family: var(--font-outfit);
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .tab-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.02);
    }

    .tab-btn.active {
      color: var(--accent-blue);
      background: rgba(59, 130, 246, 0.05);
      box-shadow: inset 0 -2px 0 var(--accent-blue);
    }

    .tab-panel {
      padding: 32px;
      display: none;
    }

    .tab-panel.active {
      display: block;
    }

    /* Playground Layout */
    .panel-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    @media (max-width: 768px) {
      .panel-grid {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 40px;
      }
    }

    .panel-input, .panel-output {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .panel-title {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-tag {
      background: rgba(59, 130, 246, 0.1);
      color: #93c5fd;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-family: var(--font-outfit);
      letter-spacing: 0;
    }

    .input-wrapper {
      position: relative;
    }

    textarea.input-field {
      width: 100%;
      height: 200px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      color: var(--text-main);
      padding: 16px;
      font-family: var(--font-inter);
      font-size: 14px;
      resize: none;
      outline: none;
      transition: all 0.2s;
    }

    textarea.input-field:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    .number-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .input-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
    }

    input.input-field {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-main);
      padding: 10px 12px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
    }

    input.input-field:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    /* Warning/Failure Box */
    .warning-box {
      background: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.15);
      border-radius: 8px;
      padding: 16px;
      color: #fca5a5;
      font-size: 13px;
      display: none;
      flex-direction: column;
      gap: 8px;
    }

    .warning-box-title {
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Image Drop Zone */
    .drop-zone {
      border: 2px dashed rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      background: var(--bg-input);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .drop-zone:hover {
      border-color: var(--accent-blue);
      background: rgba(59, 130, 246, 0.02);
    }

    .drop-zone-icon {
      font-size: 32px;
    }

    .drop-zone-text {
      font-size: 14px;
      color: var(--text-muted);
    }

    .drop-zone-subtext {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.3);
    }

    .image-preview-container {
      width: 100%;
      height: 200px;
      border-radius: 8px;
      overflow: hidden;
      display: none;
      position: relative;
      border: 1px solid var(--border-color);
    }

    .image-preview {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
    }

    .remove-image-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .remove-image-btn:hover {
      background: var(--accent-red);
    }

    /* Output Area */
    .output-container {
      background: rgba(10, 15, 25, 0.8);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      height: 100%;
      min-height: 250px;
      padding: 16px;
      font-family: monospace;
      font-size: 13px;
      overflow-y: auto;
      position: relative;
    }

    .output-placeholder {
      color: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      padding: 40px;
      font-family: var(--font-inter);
    }

    .json-key { color: #f472b6; }
    .json-string { color: #a7f3d0; }
    .json-number { color: #93c5fd; }
    .json-boolean { color: #fcd34d; }
    .json-null { color: rgba(255, 255, 255, 0.4); }

    .loader {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      flex-direction: column;
      align-items: center;
      gap: 12px;
      font-family: var(--font-inter);
      color: var(--text-muted);
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(59, 130, 246, 0.2);
      border-radius: 50%;
      border-top-color: var(--accent-blue);
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Feature Grid */
    .features {
      padding: 80px 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    @media (max-width: 900px) {
      .features-grid {
        grid-template-columns: 1fr;
      }
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      transition: all 0.2s;
    }

    .feature-card:hover {
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }

    .feature-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 20px;
    }

    .icon-blue { background: rgba(59, 130, 246, 0.1); color: var(--accent-blue); }
    .icon-teal { background: rgba(16, 185, 129, 0.1); color: var(--accent-teal); }
    .icon-orange { background: rgba(245, 158, 11, 0.1); color: var(--accent-orange); }

    .feature-title {
      font-family: var(--font-outfit);
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .feature-desc {
      color: var(--text-muted);
      font-size: 14px;
    }

    /* Developers Section */
    .dev-section {
      padding: 60px 0 80px 0;
      border-top: 1px solid var(--border-color);
    }

    .code-tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .code-tab-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: monospace;
      cursor: pointer;
    }

    .code-tab-btn.active {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
      border-color: rgba(59, 130, 246, 0.3);
    }

    .code-block {
      background: rgba(10, 15, 25, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      font-family: monospace;
      font-size: 13px;
      color: #93c5fd;
      overflow-x: auto;
      white-space: pre;
    }

    .code-comment { color: rgba(255,255,255,0.3); }

    /* Footer */
    footer {
      padding: 40px 0;
      border-top: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 14px;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    @media (max-width: 600px) {
      .footer-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }
    }
  </style>
</head>
<body>

  <header>
    <div class="container header-content">
      <div class="logo-area">
        <div class="logo-icon">S</div>
        <div class="logo-text">Sparks Digital</div>
      </div>
      <div class="nav-links">
        <a href="#playground" class="nav-link">Playground</a>
        <a href="#features" class="nav-link">Features</a>
        <a href="#developer" class="nav-link">API Docs</a>
        <button class="btn-wallet" id="wallet-connect">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7h-8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M5 11V7a2 2 0 0 1 2-2h12"/><circle cx="16" cy="12" r="1"/></svg>
          <span id="wallet-status">Connect Wallet</span>
        </button>
      </div>
    </div>
  </header>

  <main class="container">
    
    <!-- Hero -->
    <section class="hero">
      <div class="badge badge-base">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        x402 Micropayments • Base L2
      </div>
      <h1 class="hero-title">Intelligent Real Estate Analysis<br>On-Demand</h1>
      <p class="hero-subtitle">
        Access lightning-fast AI property parsing, FHA compliance scanning, and investment metrics calculations with zero subscriptions. Pay strictly per API request using USDC on Base.
      </p>
      <div class="hero-buttons">
        <a href="#playground" class="btn btn-primary">Try the Sandbox</a>
        <a href="#developer" class="btn btn-secondary">Read Developer Docs</a>
      </div>

      <div class="trial-counter-alert" id="trial-alert">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        <span>Your free preview is active! Remaining free trial queries:</span>
        <span class="trial-count-number" id="trial-count">5</span>
      </div>
    </section>

    <!-- Interactive Sandbox -->
    <section id="playground" class="playground-section">
      <div class="section-header">
        <h2 class="section-title">API Playground</h2>
        <p class="section-desc">Try out all entry methods interactively. Watch the consolidated AI reports load in real time.</p>
      </div>

      <div class="playground-card">
        <div class="playground-tabs">
          <button class="tab-btn active" id="tab-url-analyzer" onclick="switchTab('url-analyzer')">
            🔍 URL Analyzer
          </button>
          <button class="tab-btn" id="tab-image-upload" onclick="switchTab('image-upload')">
            📷 Image Uploader
          </button>
          <button class="tab-btn" id="tab-text-analyzer" onclick="switchTab('text-analyzer')">
            ✍️ Text Analyzer
          </button>
          <button class="tab-btn" id="tab-investor-metrics" onclick="switchTab('investor-metrics')">
            📊 Quick Calculator
          </button>
        </div>

        <!-- Tab Panel: URL Analyzer -->
        <div id="panel-url-analyzer" class="tab-panel active">
          <div class="panel-grid">
            <div class="panel-input">
              <div class="panel-title">
                <span>Enter Listing Webpage URL</span>
                <span class="price-tag">Extracts URL + full report</span>
              </div>
              <div class="input-group">
                <label class="input-label">Listing URL</label>
                <input type="url" id="url-input" class="input-field" placeholder="https://www.zillow.com/homedetails/...">
              </div>
              <div style="font-size: 11px; color: var(--text-muted); display: flex; gap: 8px;">
                <span style="cursor: pointer; color: var(--accent-blue);" onclick="fillUrlSample(1)">Sample 1 (Scrubbable Blog)</span> | 
                <span style="cursor: pointer; color: var(--accent-blue);" onclick="fillUrlSample(2)">Sample 2 (Protected Zillow)</span>
              </div>
              
              <!-- Warning/Fallback Alert -->
              <div class="warning-box" id="url-warning">
                <div class="warning-box-title">
                  ⚠️ Scrubbing Blocked
                </div>
                <div id="url-warning-text">
                  This website does not support URL scrubbing due to anti-bot protection. Please take a screenshot of the listing and upload it using the <strong>Image Uploader</strong> tab instead!
                </div>
              </div>

              <button class="btn btn-primary" style="justify-content: center;" onclick="runUrlAnalysis()" id="btn-run-url">Scrape & Analyze URL</button>
            </div>
            <div class="panel-output">
              <div class="panel-title">API Response JSON</div>
              <div class="output-container" id="output-url">
                <div class="output-placeholder">Enter a webpage URL and run analysis to view output.</div>
                <div class="loader"><div class="spinner"></div><span>Scrubbing listing page and generating report...</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Panel: Image Uploader -->
        <div id="panel-image-upload" class="tab-panel">
          <div class="panel-grid">
            <div class="panel-input">
              <div class="panel-title">
                <span>Upload Screenshot</span>
                <span class="price-tag">Extracts image + full report</span>
              </div>
              <div class="drop-zone" id="drop-zone">
                <div class="drop-zone-icon">📥</div>
                <div class="drop-zone-text">Drag & drop listing screenshot here or click to browse</div>
                <div class="drop-zone-subtext">Supports PNG, JPG, WebP. Recommended: screenshot of listing specs, price, and description.</div>
                <input type="file" id="file-input" accept="image/*" style="display: none;">
              </div>
              <div class="image-preview-container" id="preview-container">
                <button class="remove-image-btn" onclick="removeImage()">✕</button>
                <img id="image-element" class="image-preview" src="" alt="Preview">
              </div>
              <button class="btn btn-primary" style="justify-content: center; width: 100%;" onclick="runImageAnalysis()" id="btn-run-image">
                Analyze Property Screenshot
              </button>
            </div>
            <div class="panel-output">
              <div class="panel-title">API Response JSON</div>
              <div class="output-container" id="output-image">
                <div class="output-placeholder">Upload an image and run analysis to view the API response.</div>
                <div class="loader"><div class="spinner"></div><span>Extracting property details and running metrics...</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Panel: Text Analyzer -->
        <div id="panel-text-analyzer" class="tab-panel">
          <div class="panel-grid">
            <div class="panel-input">
              <div class="panel-title">
                <span>Copy-Paste Listing Remarks</span>
                <span class="price-tag">Extracts text + full report</span>
              </div>
              <textarea id="text-analyzer-input" class="input-field" placeholder="Enter listing description remarks to analyze..."></textarea>
              <div style="font-size: 11px; color: var(--text-muted); display: flex; gap: 8px;">
                <span style="cursor: pointer; color: var(--accent-blue);" onclick="fillTextSample(1)">Sample 1 (Violations)</span> | 
                <span style="cursor: pointer; color: var(--accent-blue);" onclick="fillTextSample(2)">Sample 2 (Compliant)</span>
              </div>
              <button class="btn btn-primary" style="justify-content: center;" onclick="runTextAnalysis()" id="btn-run-text">Analyze Raw Copy</button>
            </div>
            <div class="panel-output">
              <div class="panel-title">API Response JSON</div>
              <div class="output-container" id="output-text">
                <div class="output-placeholder">Submit listing copy to see consolidated FHA and investment report.</div>
                <div class="loader"><div class="spinner"></div><span>Extracting listing parameters and analyzing compliance...</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Panel: Investor Metrics (Quick Calculator) -->
        <div id="panel-investor-metrics" class="tab-panel">
          <div class="panel-grid">
            <div class="panel-input">
              <div class="panel-title">
                <span>Financial Variables</span>
                <span class="price-tag">$0.10</span>
              </div>
              <div class="number-grid">
                <div class="input-group">
                  <label class="input-label">Purchase Price ($)</label>
                  <input type="number" id="calc-price" class="input-field" value="325000">
                </div>
                <div class="input-group">
                  <label class="input-label">Monthly Rent ($)</label>
                  <input type="number" id="calc-rent" class="input-field" value="2400">
                </div>
              </div>
              <div class="number-grid">
                <div class="input-group">
                  <label class="input-label">Down Payment (%)</label>
                  <input type="number" id="calc-down" class="input-field" value="20">
                </div>
                <div class="input-group">
                  <label class="input-label">Interest Rate (%)</label>
                  <input type="number" id="calc-rate" class="input-field" value="6.85">
                </div>
              </div>
              <button class="btn btn-primary" style="justify-content: center;" onclick="runCalculator()" id="btn-run-calc">Calculate Investment Metrics</button>
            </div>
            <div class="panel-output">
              <div class="panel-title">API Response JSON</div>
              <div class="output-container" id="output-investor">
                <div class="output-placeholder">Calculate to view cashflow, cap rate, and mortgage details.</div>
                <div class="loader"><div class="spinner"></div><span>Calculating financial returns...</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="section-header">
        <h2 class="section-title">Designed for the Next Era of Real Estate</h2>
        <p class="section-desc">Fast, affordable, and fully open-source utilities built for agents, buyers, and developers.</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon icon-blue">📇</div>
          <h3 class="feature-title">Property Spec Parser</h3>
          <p class="feature-desc">Convert chaotic, unorganized descriptions and agent remarks into clean, normalized JSON parameters automatically. Built-in regex matches addresses, sizes, prices, and room structures.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon icon-teal">⚖️</div>
          <h3 class="feature-title">FHA Compliance Shield</h3>
          <p class="feature-desc">Protect listings from costly Fair Housing Act violations. Our scanner scans copy for 50+ discriminatory phrase patterns, flags protected classes, and generates a compliant rewrite.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon icon-orange">📊</div>
          <h3 class="feature-title">Investor Financials</h3>
          <p class="feature-desc">Generate detailed, rounded analysis metrics. Instantly calculate cap rate, cash-on-cash return, DSCR (Debt Service Coverage Ratio), GRM (Gross Rent Multiplier), and mortgage cashflow with default estimates.</p>
        </div>
      </div>
    </section>

    <!-- Developers / x402 Section -->
    <section id="developer" class="dev-section">
      <div class="section-header">
        <h2 class="section-title">Developer Integration</h2>
        <p class="section-desc">Sparks RE API works seamlessly with standard AI agents and HTTP requests utilizing x402 headers.</p>
      </div>

      <div class="code-tabs">
        <button class="code-tab-btn active" onclick="switchCode('mcp')">MCP Config</button>
        <button class="code-tab-btn" onclick="switchCode('curl')">cURL Request</button>
        <button class="code-tab-btn" onclick="switchCode('x402')">x402 Headers</button>
      </div>

      <div id="code-content" class="code-block">Loading...</div>
    </section>

  </main>

  <footer>
    <div class="container footer-content">
      <div>&copy; 2026 Sparks Digital LLC. Registered in Indiana. All rights reserved.</div>
      <div style="display: flex; gap: 20px;">
        <a href="https://github.com/intellectuallyneutral/Real-estate-analysis-API-with-x402-micropayments-on-Base-L2" class="nav-link" target="_blank">GitHub Repository</a>
        <a href="https://smithery.ai/servers/sparks-digital/sparks-re-api" class="nav-link" target="_blank">Smithery</a>
      </div>
    </div>
  </footer>

  <script>
    // --- STATE & INITIALIZATION ---
    let remainingTrials = 5;
    const maxTrials = 5;

    // Load trial state from localStorage
    if (localStorage.getItem("sparks_re_api_trials") !== null) {
      remainingTrials = parseInt(localStorage.getItem("sparks_re_api_trials"), 10);
    } else {
      localStorage.setItem("sparks_re_api_trials", remainingTrials);
    }

    updateTrialAlert();

    // Fill samples initially
    fillUrlSample(1);
    fillTextSample(1);

    // Setup drag and drop for image upload
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const previewContainer = document.getElementById("preview-container");
    const imageElement = document.getElementById("image-element");
    let base64Image = "";

    dropZone.addEventListener("click", () => fileInput.click());

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--accent-blue)";
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.style.borderColor = "rgba(255, 255, 255, 0.15)";
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "rgba(255, 255, 255, 0.15)";
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });

    function handleFile(file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        base64Image = e.target.result;
        imageElement.src = base64Image;
        dropZone.style.display = "none";
        previewContainer.style.display = "block";
      };
      reader.readAsDataURL(file);
    }

    function removeImage() {
      base64Image = "";
      imageElement.src = "";
      previewContainer.style.display = "none";
      dropZone.style.display = "flex";
      fileInput.value = "";
    }

    // --- TAB SWITCHER ---
    function switchTab(tabId) {
      document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));

      // Set active button
      document.getElementById("tab-" + tabId).classList.add("active");
      document.getElementById("panel-" + tabId).classList.add("active");
    }

    // --- TRLAL ALERT & LOCKOUT ---
    function updateTrialAlert() {
      document.getElementById("trial-count").textContent = remainingTrials;
      const alertDiv = document.getElementById("trial-alert");
      
      if (remainingTrials <= 0) {
        alertDiv.style.background = "rgba(239, 68, 68, 0.05)";
        alertDiv.style.borderColor = "rgba(239, 68, 68, 0.15)";
        alertDiv.style.color = "#fca5a5";
        alertDiv.innerHTML = \`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg><span>All free trial queries used. Please connect wallet for x402 payments.</span>\`;
        
        // Disable playground buttons
        document.getElementById("btn-run-url").disabled = true;
        document.getElementById("btn-run-image").disabled = true;
        document.getElementById("btn-run-text").disabled = true;
        document.getElementById("btn-run-calc").disabled = true;
      }
    }

    function consumeTrial() {
      if (remainingTrials <= 0) {
        alert("You have exhausted your free trials. Connect your wallet to make paid queries.");
        return false;
      }
      remainingTrials--;
      localStorage.setItem("sparks_re_api_trials", remainingTrials);
      updateTrialAlert();
      return true;
    }

    // --- MOCK WALLET SIMULATION ---
    const walletBtn = document.getElementById("wallet-connect");
    const walletStatus = document.getElementById("wallet-status");
    let walletConnected = false;

    walletBtn.addEventListener("click", () => {
      if (!walletConnected) {
        walletConnected = true;
        walletStatus.textContent = "0x8966...0fb7 (Base)";
        walletBtn.style.borderColor = "var(--accent-teal)";
        walletBtn.style.color = "var(--accent-teal)";
        walletBtn.style.background = "rgba(16, 185, 129, 0.1)";
        remainingTrials = 999;
        updateTrialAlert();
        
        // Re-enable buttons if disabled
        document.getElementById("btn-run-url").disabled = false;
        document.getElementById("btn-run-image").disabled = false;
        document.getElementById("btn-run-text").disabled = false;
        document.getElementById("btn-run-calc").disabled = false;
      } else {
        walletConnected = false;
        walletStatus.textContent = "Connect Wallet";
        walletBtn.style.borderColor = "rgba(59, 130, 246, 0.2)";
        walletBtn.style.color = "var(--accent-blue)";
        walletBtn.style.background = "rgba(59, 130, 246, 0.1)";
        remainingTrials = 0;
        localStorage.setItem("sparks_re_api_trials", 0);
        updateTrialAlert();
      }
    });

    // --- SAMPLES POPULATORS ---
    function fillUrlSample(num) {
      const field = document.getElementById("url-input");
      if (num === 1) {
        field.value = "https://raw.githubusercontent.com/intellectuallyneutral/Real-estate-analysis-API-with-x402-micropayments-on-Base-L2/main/README.md";
      } else {
        field.value = "https://www.zillow.com/homedetails/789-Maple-Ave-Indianapolis-IN-46220/2039485_zpid/";
      }
    }

    function fillTextSample(num) {
      const field = document.getElementById("text-analyzer-input");
      if (num === 1) {
        field.value = "Stunning 3-bed family starter house located in a quiet, exclusively Christian neighbourhood. Perfect for a mature couple with no kids, or someone looking to retire without family baggage. Purchase price is $295,000. Rent estimate is $2,200. Call today!";
      } else {
        field.value = "Beautiful 3-bedroom craftsman home featuring a spacious backyard, brand new updates, and high ceilings. Convenient location near public parks and local community centres. Open to all prospective buyers. Listed for $295,000.";
      }
    }

    // --- JSON FORMATTER ---
    function formatJsonHtml(obj) {
      let json = JSON.stringify(obj, null, 2);
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    }

    // --- API CALL EXECUTIONERS ---
    async function callApiEndpoint(endpoint, payload, outputEl, errorBoxEl = null) {
      const container = document.getElementById(outputEl);
      const placeholder = container.querySelector(".output-placeholder");
      const loader = container.querySelector(".loader");
      const errorBox = errorBoxEl ? document.getElementById(errorBoxEl) : null;
      
      if (placeholder) placeholder.style.display = "none";
      if (loader) loader.style.display = "flex";
      if (errorBox) errorBox.style.display = "none";
      
      // Clean previous logs
      const logs = container.querySelectorAll("pre");
      logs.forEach(l => l.remove());

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (loader) loader.style.display = "none";

        const resData = await response.json();
        
        if (!response.ok) {
          throw new Error(resData.error || \`HTTP error! status: \${response.status}\`);
        }

        const pre = document.createElement("pre");
        pre.innerHTML = formatJsonHtml(resData);
        container.appendChild(pre);
      } catch (err) {
        if (loader) loader.style.display = "none";
        
        // Show in API output
        const pre = document.createElement("pre");
        pre.style.color = "var(--accent-red)";
        pre.textContent = "Error: " + err.message;
        container.appendChild(pre);

        // Display user-friendly warning box for URL failures
        if (errorBox) {
          errorBox.style.display = "flex";
        }
      }
    }

    function runUrlAnalysis() {
      const urlText = document.getElementById("url-input").value.trim();
      if (!urlText) {
        alert("Please enter a webpage URL!");
        return;
      }
      if (!consumeTrial()) return;

      callApiEndpoint("/property/free-trial-url", {
        url: urlText
      }, "output-url", "url-warning");
    }

    function runImageAnalysis() {
      if (!base64Image) {
        alert("Please upload a screenshot first!");
        return;
      }
      if (!consumeTrial()) return;
      
      callApiEndpoint("/property/free-trial-image", {
        image: base64Image,
        mime_type: "image/png"
      }, "output-image");
    }

    function runTextAnalysis() {
      const text = document.getElementById("text-analyzer-input").value.trim();
      if (!text) {
        alert("Please enter listing description copy!");
        return;
      }
      if (!consumeTrial()) return;

      callApiEndpoint("/property/free-trial-text", {
        text: text
      }, "output-text");
    }

    function runCalculator() {
      const price = parseFloat(document.getElementById("calc-price").value);
      const rent = parseFloat(document.getElementById("calc-rent").value);
      const down = parseFloat(document.getElementById("calc-down").value);
      const rate = parseFloat(document.getElementById("calc-rate").value);

      if (isNaN(price) || isNaN(rent) || isNaN(down)) {
        alert("Please enter all required numeric parameters!");
        return;
      }
      if (!consumeTrial()) return;

      callApiEndpoint("/property/free-trial", {
        action: "calculator",
        purchase_price: price,
        monthly_rent: rent,
        down_payment_percent: down,
        interest_rate: rate
      }, "output-investor");
    }

    // --- CODE SAMPLES IN DEV PANEL ---
    const mcpCode = \`{
  "mcpServers": {
    "sparks-re-api": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-http"],
      "env": {
        "SERVER_URL": "https://sparks-re-api.sparksdigital-re.workers.dev/mcp"
      }
    }
  }
}\`;

    const curlCode = \`curl -X POST https://sparks-re-api.sparksdigital-re.workers.dev/property/fha-compliance \\\\
  -H "Content-Type: application/json" \\\\
  -H "X-Payment: eip155:84532:exact:0x8966...0fb7:0.05:0x..." \\\\
  -d '{"listing_text": "Christian family neighbourhood..."}'\`;

    const x402Code = \`<span class="code-comment">// Send a payment transaction hash as headers</span>
X-Payment: eip155:84532:exact:0x8966A2aAe40e008f1f52962683Cb5D22aa700fb7:&lt;PRICE&gt;:&lt;TX_HASH&gt;

<span class="code-comment">// Price endpoints table</span>
/property/factual         $0.03 USDC
/property/fha-compliance  $0.05 USDC
/property/investor-metrics $0.10 USDC
/property/analyze-text    $0.05 USDC
/property/analyze-url     $0.05 USDC
/property/analyze-image   $0.15 USDC\`;

    function switchCode(type) {
      document.querySelectorAll(".code-tab-btn").forEach(btn => btn.classList.remove("active"));
      event.target.classList.add("active");
      
      const content = document.getElementById("code-content");
      if (type === "mcp") {
        content.textContent = mcpCode;
      } else if (type === "curl") {
        content.textContent = curlCode;
      } else {
        content.innerHTML = x402Code;
      }
    }

    // Init first code sample
    document.getElementById("code-content").textContent = mcpCode;
  </script>
</body>
</html>
`;
