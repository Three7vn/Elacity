// Content script for arXiv papers - Elacity Research Copilot
console.log("Elacity extension loaded on arXiv paper page", window.location.href);

// Add Google Fonts links to document head
const addFontLinks = () => {
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect1);

  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect2);

  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
};

// Create a visual indicator that the extension is active
const createStatusBadge = () => {
  const badge = document.createElement('div');
  badge.style.position = 'fixed';
  badge.style.top = '10px';
  badge.style.right = '10px';
  badge.style.backgroundColor = 'rgba(90, 96, 103, 0.9)';
  badge.style.color = 'white';
  badge.style.padding = '5px 10px';
  badge.style.borderRadius = '4px';
  badge.style.zIndex = '9999';
  badge.style.fontSize = '12px';
  badge.style.fontWeight = 'bold';
  badge.textContent = 'Elacity Active';
  document.body.appendChild(badge);
  
  // Remove after 5 seconds
  setTimeout(() => {
    document.body.removeChild(badge);
  }, 5000);
};

// Create results panel
const createResultsPanel = () => {
  let panel = document.getElementById('elacity-results-panel');
  
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'elacity-results-panel';
    panel.style.position = 'fixed';
    panel.style.bottom = '70px';
    panel.style.right = '20px';
    panel.style.width = '380px';
    panel.style.maxHeight = '660px';
    panel.style.overflowY = 'auto';
    panel.style.background = 'rgba(240, 242, 245, 0.7)';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0px 83px 33px rgba(0,0,0,0.01), 0px 47px 28px rgba(0,0,0,0.05), 0px 21px 21px rgba(0,0,0,0.05), 0px 5px 11px rgba(0,0,0,0.05)';
    panel.style.border = '1px solid rgba(210, 215, 225, 0.8)';
    panel.style.backdropFilter = 'blur(10px)';
    panel.style.fontFamily = "'Poppins'";
    panel.style.fontSize = '14px';
    panel.style.display = 'none';
    document.body.appendChild(panel);
  }
  
  return panel;
};

// Show loading state
const showLoading = () => {
  const panel = createResultsPanel();
  
  // Set panel styling to match the updated design
  panel.style.boxSizing = 'border-box';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.alignItems = 'center';
  panel.style.padding = '0px';
  panel.style.isolation = 'isolate';
  panel.style.background = 'linear-gradient(180deg, rgba(240, 242, 245, 0.85) 0%, rgba(225, 230, 240, 0.8) 100%)';
  panel.style.border = '1px solid rgba(210, 215, 225, 0.8)';
  panel.style.boxShadow = '0px 83px 33px rgba(0, 0, 0, 0.01), 0px 47px 28px rgba(0, 0, 0, 0.03), 0px 21px 21px rgba(0, 0, 0, 0.05), 0px 5px 11px rgba(0, 0, 0, 0.05)';
  panel.style.backdropFilter = 'blur(10px)';
  panel.style.borderRadius = '8px';
  panel.style.fontFamily = "'Poppins'";
  
  // Create panel content
  panel.innerHTML = `
    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; padding:12px; gap:12px; width:100%; height:100%;">
      <div id="elacity-svg-container" style="position:relative; width:40px; height:40px; animation:pulse 2s infinite ease-in-out;">
        <svg id="elacity-blue-blob" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.99009 15.3603C-0.195881 8.92559 7.68054 0.0433352 16.5397 2.32053C27.1673 5.79496 20.6482 11.4077 28.4576 13.1003C36.2671 14.793 38.073 17.6585 37.9167 22.4048C37.6385 30.8552 27.1823 29.3886 21.0798 35.9769C14.2834 43.3143 3.09987 36.1639 5.23235 29.9145C6.49486 26.2146 3.77053 20.6013 1.99009 15.3603Z" fill="#BEDBFF" fill-opacity="0.25"/>
          <path d="M5.6412 15.0209C4.30708 9.68416 11.3463 3.06718 18.41 5.51229C26.8319 9.04408 21.1267 13.1192 27.3753 15.0209C33.6238 16.9227 34.8966 19.3566 34.4388 23.1713C33.6238 29.9632 25.2018 28.0614 19.7683 32.9516C13.717 38.3977 5.0978 31.8649 7.27124 26.9747C8.558 24.0795 6.72783 19.3677 5.6412 15.0209Z" fill="#8EC5FF"/>
        </svg>
      </div>
      
      <div class="elacity-morph-message" style="display:flex; flex-direction:column; align-items:center; padding:0px; gap:8px; flex-grow:0; text-align:center;">
        <div style="font-family:'Poppins'; font-style:normal; font-weight:600; font-size:16px; line-height:24px; text-align:center; letter-spacing:-0.005em; color:#3B4252;">
          Elacity is thinking...
        </div>
        
        <p id="thinking-status" style="font-family:'Poppins'; font-style:normal; font-weight:500; font-size:14px; line-height:21px; text-align:center; letter-spacing:-0.005em; color:#6B7280; margin:0;">
          Parsing paper content...
        </p>
      </div>
      
      <style>
        @keyframes pulse {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(0.95); }
        }
      </style>
      
      <div style="position:absolute; width:14px; height:14px; right:12px; top:12px; cursor:pointer; z-index:2;" id="elacity-close-thinking">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.25 1.75L1.75 12.25M1.75 1.75L12.25 12.25" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  `;
  
  panel.style.display = 'block';
  
  // Set up the close button
  const closeButton = document.getElementById('elacity-close-thinking');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      panel.style.display = 'none';
    });
  }
  
  // Set up the thinking status cycling
  const thinkingMessages = [
    'Extracting key findings...',
    'Analyzing methodology...',
    'Identifying citations...',
    'Processing conclusions...'
  ];
  
  let messageIndex = 0;
  const statusElement = document.getElementById('thinking-status');
  
  const cycleMessages = () => {
    if (statusElement && panel.style.display !== 'none') {
      messageIndex = (messageIndex + 1) % thinkingMessages.length;
      statusElement.textContent = thinkingMessages[messageIndex];
      
      // Only continue cycling if the panel is still visible
      if (panel.style.display !== 'none') {
        setTimeout(cycleMessages, 3000);
      }
    }
  };
  
  // Start cycling messages after the first message sits for a moment
  setTimeout(cycleMessages, 3000);
};

// Morph animation for loading SVG
function morphElacityBlob(success) {
  const svgContainer = document.getElementById('elacity-svg-container');
  if (!svgContainer) return;
  const oldSvg = svgContainer.querySelector('svg');
  // Get the parent container for the text (the next sibling of svgContainer)
  const textContainer = svgContainer.parentElement.querySelector('.elacity-morph-message');
  if (!oldSvg) {
    // If SVG is missing, just swap immediately and update text
    svgContainer.innerHTML = success
      ? `<svg id="elacity-success-circle" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20.5" r="16" fill="#7BF1A8" fill-opacity="0.35"/><circle cx="20" cy="20.5" r="11.5" fill="#05DF72"/></svg>`
      : `<svg id="elacity-fail-circle" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20.5" r="16" fill="#FF7B7B" fill-opacity="0.35"/><circle cx="20" cy="20.5" r="11.5" fill="#FF2056"/></svg>`;
    if (textContainer) {
      textContainer.innerHTML = success
        ? `<div style='text-align:center;'><div style='font-weight:600; font-size:20px; color:#fff;'>Success!</div><div style='font-size:16px; color:#bdbdbd;'>Paper analyzed successfully.</div></div>`
        : `<div style='text-align:center;'><div style='font-weight:600; font-size:20px; color:#fff;'>Something went wrong...</div><div style='font-size:16px; color:#bdbdbd;'>Try again in a few minutes.</div></div>`;
    }
    return;
  }
  // Fade out old SVG
  oldSvg.style.transition = 'opacity 0.3s, transform 0.3s';
  oldSvg.style.opacity = '0';
  oldSvg.style.transform = 'scale(0.8)';
  setTimeout(() => {
    svgContainer.innerHTML = success
      ? `<svg id="elacity-success-circle" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20.5" r="16" fill="#7BF1A8" fill-opacity="0.35"/><circle cx="20" cy="20.5" r="11.5" fill="#05DF72"/></svg>`
      : `<svg id="elacity-fail-circle" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20.5" r="16" fill="#FF7B7B" fill-opacity="0.35"/><circle cx="20" cy="20.5" r="11.5" fill="#FF2056"/></svg>`;
    if (textContainer) {
      textContainer.innerHTML = success
        ? `<div style='text-align:center;'><div style='font-weight:600; font-size:20px; color:#fff;'>Success!</div><div style='font-size:16px; color:#bdbdbd;'>Paper analyzed successfully.</div></div>`
        : `<div style='text-align:center;'><div style='font-weight:600; font-size:20px; color:#fff;'>Something went wrong...</div><div style='font-size:16px; color:#bdbdbd;'>Try again in a few minutes.</div></div>`;
    }
    const newSvg = svgContainer.firstChild;
    if (newSvg) {
      newSvg.style.opacity = '0';
      newSvg.style.transform = 'scale(1.2)';
      newSvg.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(() => {
        newSvg.style.opacity = '1';
        newSvg.style.transform = 'scale(1)';
      }, 10);
    }
  }, 300);
}

// Show error
const showError = (message) => {
  const panel = createResultsPanel();
  panel.style.display = 'block';
  panel.innerHTML = `
    <div style="padding:15px;">
      <h3 style="margin:0 0 10px; color:#d32f2f; font-size:16px;">Error</h3>
      <p style="margin:0; color:#4B5563;">${message}</p>
      <button id="elacity-close-btn" style="margin-top:15px; padding:5px 10px; background:#E5E7EB; 
              border:none; border-radius:4px; cursor:pointer; color:#4B5563;">Close</button>
    </div>
  `;
  
  document.getElementById('elacity-close-btn').addEventListener('click', () => {
    panel.style.display = 'none';
  });
};

// Try to scrape the title from the page
function getArxivTitle() {
  // Try to get title from document title or meta tags
  const title = document.title;
  if (title && title !== 'arXiv.org') {
    return title.replace(/^\[.*?\]\s*/, ''); // Remove arxiv ID prefix
  }
  return '';
}

// Show detailed research breakdown
const showBreakdown = (data, panel, originalShowResults) => {
  const frontendTitle = getArxivTitle();
  if (frontendTitle) {
    data.title = frontendTitle;
  }
  
  // Mock research insights (summarizer approach with positive insights)
  const researchInsights = [
    {
      insight: 'key_findings',
      level: 'Insight',
      description: 'Novel approach to attention mechanisms shows promise',
      color: '#3b82f6', // Blue
      iconType: 'lightbulb'
    },
    {
      insight: 'methodology_strength',
      level: 'Insight',
      description: 'Comprehensive evaluation across multiple benchmarks',
      color: '#22c55e', // Green
      iconType: 'lightbulb'
    },
    {
      insight: 'data_concern',
      level: 'Flaw',
      description: 'Limited dataset diversity may affect real-world applicability',
      color: '#ef4444', // Red
      iconType: 'flag'
    },
    {
      insight: 'innovation_highlight',
      level: 'Insight',
      description: 'Introduces efficient training technique reducing compute by 40%',
      color: '#8b5cf6', // Purple
      iconType: 'lightbulb'
    }
  ];
  
  // Randomly select 1-3 insights
  const numInsights = Math.floor(Math.random() * 3) + 1;
  const selectedInsights = researchInsights.slice(0, numInsights);
  
  // Generate insights HTML
  const insightsHTML = selectedInsights.map(insight => {
    const iconSvg = insight.iconType === 'lightbulb' 
      ? `<svg width="24" height="24" viewBox="0 -960 960 960" fill="${insight.color}">
           <path d="M480-80q-26 0-47-12.5T400-126q-33 0-56.5-23.5T320-206v-142q-59-39-94.5-103T190-590q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 77-35.5 140T640-348v142q0 33-23.5 56.5T560-126q-12 21-33 33.5T480-80Zm-80-126h160v-36H400v36Zm0-76h160v-38H400v38Zm-8-118h58v-108l-88-88 42-42 76 76 76-76 42 42-88 88v108h58q54-26 88-76.5T690-590q0-88-61-149t-149-61q-88 0-149 61t-61 149q0 63 34 113.5t88 76.5Zm88-162Zm0-38Z"/>
         </svg>`
      : `<svg width="24" height="18" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M12.6875 3.5625V10.125C12.6871 10.1873 12.6735 10.2488 12.6475 10.3054C12.6214 10.3619 12.5836 10.4123 12.5366 10.4531C11.7009 11.1766 10.902 11.4375 10.1402 11.4375C9.10602 11.4375 8.14023 10.9595 7.24172 10.516C5.78977 9.79687 4.52758 9.17398 3.0625 10.3312V12.75C3.0625 12.866 3.01641 12.9773 2.93436 13.0594C2.85231 13.1414 2.74103 13.1875 2.625 13.1875C2.50897 13.1875 2.39769 13.1414 2.31564 13.0594C2.23359 12.9773 2.1875 12.866 2.1875 12.75V3.5625C2.18792 3.50017 2.20165 3.43865 2.22778 3.38206C2.2539 3.32547 2.29182 3.27512 2.33898 3.23437C4.30773 1.52922 6.07469 2.40257 7.63219 3.17312C9.13281 3.91578 10.4338 4.55781 11.9634 3.23437C12.0267 3.17957 12.1043 3.14406 12.1871 3.13202C12.2699 3.11998 12.3544 3.13193 12.4306 3.16646C12.5068 3.201 12.5715 3.25666 12.617 3.32686C12.6626 3.39705 12.687 3.47883 12.6875 3.56251Z" fill="${insight.color}"/>
         </svg>`;
    
    return `
      <div style="display:flex; flex-direction:row; align-items:flex-start; padding:0; gap:10px; width:310px;">
        <div style="display:flex; flex-direction:row; align-items:center; padding:0; width:24px; height:24px; margin-top:2px;">
          ${iconSvg}
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-start; padding:0; gap:6px; flex:1;">
          <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; width:100%;">
            <span style="font-weight:600; font-size:13px; line-height:18px; letter-spacing:-0.005em; color:#3B4252; text-transform:capitalize;">
              ${insight.insight.replace('_', ' ')}
            </span>
            <span style="font-weight:600; font-size:11px; line-height:14px; letter-spacing:-0.005em; color:${insight.color};">
              ${insight.level}
            </span>
          </div>
          <span style="font-weight:400; font-size:11px; line-height:14px; letter-spacing:-0.005em; color:#6B7280;">
            ${insight.description}
          </span>
        </div>
      </div>
    `;
  }).join('');
  
  panel.style.width = '350px';
  panel.style.height = 'auto';
  panel.style.minHeight = '300px';
  panel.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:flex-start; padding:20px; gap:16px; width:350px;">
      <!-- Header -->
      <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; width:310px;">
        <div style="font-weight:600; font-size:14px; line-height:20px; letter-spacing:-0.005em; color:#3B4252;">
          Research Insights
        </div>
        <button id="back-btn" style="display:flex; align-items:center; gap:4px; background:none; border:none; cursor:pointer; color:#6B7280; font-size:12px;">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 9L4.5 6L7.5 3" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
      </div>
      
      <!-- Paper Title -->
      <div style="width:310px; font-weight:500; font-size:12px; line-height:16px; letter-spacing:-0.005em; color:#4B5563;">
        ${data.title || 'Current arXiv paper'}
      </div>
      
      <!-- Insights List -->
      <div style="display:flex; flex-direction:column; align-items:flex-start; padding:0; gap:16px; width:310px;">
        ${insightsHTML}
      </div>
      
      <!-- Action Button -->
      <button id="research-action-btn" style="display:flex; flex-direction:row; justify-content:center; align-items:center; padding:14px 12px; gap:4px; width:310px; height:32px; background:#3B82F6; border-radius:8px; border:none; cursor:pointer;">
        <span style="font-weight:500; font-size:13px; line-height:20px; letter-spacing:-0.005em; color:#F4F4F5;">Explore related papers</span>
      </button>
    </div>
    
    <!-- Close button -->
    <div id="elacity-close-btn" style="position:absolute; width:14px; height:14px; right:12px; top:12px; cursor:pointer;">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.625 2.625L11.375 11.375M2.625 11.375L11.375 2.625" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('elacity-close-btn').addEventListener('click', () => {
    panel.style.display = 'none';
  });
  
  document.getElementById('back-btn').addEventListener('click', () => {
    originalShowResults(data);
  });
  
  document.getElementById('research-action-btn').addEventListener('click', () => {
    // Placeholder for future functionality
    console.log('Explore related papers clicked');
  });
};

// Show results
const showResults = (data) => {
  const frontendTitle = getArxivTitle();
  if (frontendTitle) {
    data.title = frontendTitle;
  }
  const panel = createResultsPanel();
  
  // Set panel styling to match design specs
  panel.style.position = 'fixed';
  panel.style.boxSizing = 'border-box';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.justifyContent = 'center';
  panel.style.alignItems = 'center';
  panel.style.padding = '0';
  panel.style.isolation = 'isolate';
  panel.style.width = '240px';
  panel.style.height = '200px';
  panel.style.background = 'linear-gradient(180deg, rgba(240, 242, 245, 0.85) 0%, rgba(225, 230, 240, 0.8) 100%)';
  panel.style.border = '1px solid rgba(210, 215, 225, 0.8)';
  panel.style.boxShadow = '0px 83px 33px rgba(0, 0, 0, 0.01), 0px 47px 28px rgba(0, 0, 0, 0.03), 0px 21px 21px rgba(0, 0, 0, 0.05), 0px 5px 11px rgba(0, 0, 0, 0.05)';
  panel.style.backdropFilter = 'blur(10px)';
  panel.style.borderRadius = '8px';
  panel.style.fontFamily = "'Poppins'";
  panel.style.zIndex = '9998';
  panel.style.overflow = 'hidden';
  panel.style.overflowY = 'hidden';
  panel.style.overflowX = 'hidden';
  
  // Mock research analysis scores for different aspects
  const methodologicalRigor = Math.floor(Math.random() * 3) + 7; // 7-9 out of 10
  const dataQuality = Math.floor(Math.random() * 2) + 9; // 9-10 out of 10  
  const innovationLevel = Math.floor(Math.random() * 4) + 6; // 6-9 out of 10

  // Mock research considerations (like the old risk factors but for research)
  const numConsiderations = Math.floor(Math.random() * 3) + 1; // 1-3 considerations
  
  panel.style.display = 'block';
  panel.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:flex-start; padding:12px; gap:8px; width:240px; height:200px;">
      <!-- Research Score Title -->
      <div style="width:216px; height:18px; font-weight:600; font-size:12px; line-height:18px; letter-spacing:-0.005em; color:#3B4252;">
        Research Analysis
      </div>
      
      <!-- Container -->
      <div style="display:flex; flex-direction:column; align-items:flex-start; padding:0; gap:14px; width:216px;">
        <!-- Methodological Rigor -->
        <div style="display:flex; flex-direction:column; align-items:flex-start; padding:0; gap:6px; width:216px;">
          <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; width:216px;">
            <span style="font-weight:600; font-size:11px; line-height:14px; letter-spacing:-0.005em; color:#3B4252;">Methodological Rigor</span>
            <span style="font-weight:500; font-size:11px; line-height:14px; letter-spacing:-0.005em; color:#6B7280;">${methodologicalRigor}/10</span>
          </div>
          <div style="display:flex; flex-direction:row; align-items:flex-start; padding:0; width:216px; height:8px; background:#E5E7EB; border-radius:6px;">
            <div style="width:${(methodologicalRigor / 10) * 216}px; height:8px; background:linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); box-shadow:8px 0px 24px rgba(37, 99, 235, 0.28); border-radius:6px;"></div>
          </div>
        </div>
        
        <!-- Data Quality -->
        <div style="display:flex; flex-direction:column; align-items:flex-start; padding:0; gap:6px; width:216px;">
          <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; width:216px;">
            <span style="font-weight:600; font-size:11px; line-height:14px; letter-spacing:-0.005em; color:#3B4252;">Data Quality</span>
            <span style="font-weight:500; font-size:11px; line-height:14px; letter-spacing:-0.005em; color:#6B7280;">${dataQuality}/10</span>
          </div>
          <div style="display:flex; flex-direction:row; align-items:flex-start; padding:0; width:216px; height:8px; background:#E5E7EB; border-radius:6px;">
            <div style="width:${(dataQuality / 10) * 216}px; height:8px; background:linear-gradient(90deg, #22c55e 0%, #16a34a 100%); box-shadow:8px 0px 24px rgba(22, 163, 74, 0.28); border-radius:6px;"></div>
          </div>
        </div>
        
        <!-- Innovation Level -->
        <div style="display:flex; flex-direction:column; align-items:flex-start; padding:0; gap:6px; width:216px;">
          <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; width:216px;">
            <span style="font-weight:600; font-size:11px; line-height:14px; letter-spacing:-0.005em; color:#3B4252;">Innovation Level</span>
            <span style="font-weight:500; font-size:11px; line-height:14px; letter-spacing:-0.005em; color:#6B7280;">${innovationLevel}/10</span>
          </div>
          <div style="display:flex; flex-direction:row; align-items:flex-start; padding:0; width:216px; height:8px; background:#E5E7EB; border-radius:6px;">
            <div style="width:${(innovationLevel / 10) * 216}px; height:8px; background:linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%); box-shadow:8px 0px 24px rgba(139, 92, 246, 0.28); border-radius:6px;"></div>
          </div>
        </div>
        
                 <!-- Research insights -->
         <div style="display:flex; flex-direction:row; align-items:center; padding:0; gap:6px; width:216px; height:18px;">
           <div style="display:flex; flex-direction:row; align-items:center; padding:0; width:20px; height:20px;">
             <svg width="20" height="20" viewBox="0 -960 960 960" fill="#3b82f6">
               <path d="M480-80q-26 0-47-12.5T400-126q-33 0-56.5-23.5T320-206v-142q-59-39-94.5-103T190-590q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 77-35.5 140T640-348v142q0 33-23.5 56.5T560-126q-12 21-33 33.5T480-80Zm-80-126h160v-36H400v36Zm0-76h160v-38H400v38Zm-8-118h58v-108l-88-88 42-42 76 76 76-76 42 42-88 88v108h58q54-26 88-76.5T690-590q0-88-61-149t-149-61q-88 0-149 61t-61 149q0 63 34 113.5t88 76.5Zm88-162Zm0-38Z"/>
             </svg>
           </div>
           <span style="font-weight:600; font-size:12px; line-height:18px; letter-spacing:-0.005em; color:#3B4252;">
             ${numConsiderations > 0 ? `${numConsiderations} research insight${numConsiderations > 1 ? 's' : ''} identified` : 'Analysis complete'}
           </span>
         </div>
        
        <!-- Button -->
        <button id="breakdown-btn" style="display:flex; flex-direction:row; justify-content:center; align-items:center; padding:12px 8px; gap:4px; width:216px; height:28px; background:#E5E7EB; box-shadow:0px 2px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.04); border-radius:8px; border:none; cursor:pointer;">
          <span style="font-weight:500; font-size:12px; line-height:18px; letter-spacing:-0.005em; color:#4B5563;">See detailed analysis</span>
        </button>
      </div>
    </div>
    
    <!-- Close button -->
    <div id="elacity-close-btn" style="position:absolute; width:14px; height:14px; right:12px; top:12px; cursor:pointer;">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.625 2.625L11.375 11.375M2.625 11.375L11.375 2.625" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
  
  // Add event listeners to close button
  document.getElementById('elacity-close-btn').addEventListener('click', () => {
    panel.style.display = 'none';
  });
  
  // Add event listener to breakdown button
  document.getElementById('breakdown-btn').addEventListener('click', () => {
    showBreakdown(data, panel, showResults);
  });
};

// Create a research button that stays visible on the page
const createResearchButton = () => {
  const researchButton = document.createElement('div');
  researchButton.style.position = 'fixed';
  // Load position from localStorage if available
  const savedPosition = JSON.parse(localStorage.getItem('elacityResearchButtonPosition') || '{}');
  researchButton.style.bottom = savedPosition.bottom || '20px';
  researchButton.style.right = savedPosition.right || '20px';
  researchButton.style.left = savedPosition.left || '';
  researchButton.style.top = savedPosition.top || '';
  
  // Button styling
  researchButton.style.boxSizing = 'border-box';
  researchButton.style.display = 'flex';
  researchButton.style.flexDirection = 'row';
  researchButton.style.alignItems = 'center';
  researchButton.style.padding = '8px';
  researchButton.style.gap = '4px';
  researchButton.style.width = '157px';
  researchButton.style.height = '37px';
  researchButton.style.backgroundColor = 'rgba(240, 242, 245, 0.7)';
  researchButton.style.border = '1px solid rgba(210, 215, 225, 0.8)';
  researchButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.05)';
  researchButton.style.borderRadius = '8px';
  researchButton.style.cursor = 'pointer';
  researchButton.style.zIndex = '9999';
  researchButton.style.fontFamily = "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  
  // Create "Start" text element
  const textSpan = document.createElement('span');
  textSpan.textContent = 'Start';
  textSpan.style.fontSize = '13px';
  textSpan.style.fontWeight = '500';
  textSpan.style.lineHeight = '21px';
  textSpan.style.letterSpacing = '-0.005em';
  textSpan.style.color = '#6B7280';
  textSpan.style.textAlign = 'center';
  textSpan.style.width = '69px';
  textSpan.style.height = '21px';
  
  // Create Elacity container
  const elacityContainer = document.createElement('div');
  elacityContainer.style.display = 'flex';
  elacityContainer.style.flexDirection = 'row';
  elacityContainer.style.alignItems = 'center';
  elacityContainer.style.padding = '0px';
  elacityContainer.style.gap = '6px';
  elacityContainer.style.width = '68px';
  elacityContainer.style.height = '18px';
  
  // Create image element for logo - using elacity.png
  const logoImg = document.createElement('img');
  logoImg.src = chrome.runtime.getURL('elacity.png');
  logoImg.alt = 'Elacity';
  logoImg.style.width = '19.8px';
  logoImg.style.height = '19.8px';
  logoImg.style.borderRadius = '4px';
  logoImg.style.objectFit = 'cover';
  
  // Create Elacity text
  const elacitySpan = document.createElement('span');
  elacitySpan.textContent = 'Research';
  elacitySpan.style.fontSize = '13px';
  elacitySpan.style.fontWeight = '500';
  elacitySpan.style.lineHeight = '10px';
  elacitySpan.style.letterSpacing = '-0.005em';
  elacitySpan.style.color = '#3B82F6';
  elacitySpan.style.width = '44px';
  elacitySpan.style.height = '10px';
  
  // Create tooltip for rate limiting
  const tooltip = document.createElement('div');
  tooltip.id = 'elacity-rate-limit-tooltip';
  tooltip.style.position = 'absolute';
  tooltip.style.bottom = '45px';
  tooltip.style.left = '50%';
  tooltip.style.transform = 'translateX(-50%)';
  tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  tooltip.style.color = '#F4F4F5';
  tooltip.style.padding = '8px 12px';
  tooltip.style.borderRadius = '6px';
  tooltip.style.fontSize = '12px';
  tooltip.style.fontWeight = '500';
  tooltip.style.whiteSpace = 'nowrap';
  tooltip.style.zIndex = '10000';
  tooltip.style.display = 'none';
  tooltip.style.fontFamily = "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  tooltip.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.3)';
  
  // Add arrow to tooltip
  const tooltipArrow = document.createElement('div');
  tooltipArrow.style.position = 'absolute';
  tooltipArrow.style.top = '100%';
  tooltipArrow.style.left = '50%';
  tooltipArrow.style.transform = 'translateX(-50%)';
  tooltipArrow.style.width = '0';
  tooltipArrow.style.height = '0';
  tooltipArrow.style.borderLeft = '6px solid transparent';
  tooltipArrow.style.borderRight = '6px solid transparent';
  tooltipArrow.style.borderTop = '6px solid rgba(0, 0, 0, 0.9)';
  tooltip.appendChild(tooltipArrow);
  
  // Assemble the button
  elacityContainer.appendChild(logoImg);
  elacityContainer.appendChild(elacitySpan);
  researchButton.appendChild(textSpan);
  researchButton.appendChild(elacityContainer);
  researchButton.appendChild(tooltip);
  
  // Track rate limit state
  let isRateLimited = false;
  let rateLimitResetTime = null;
  let requestsRemaining = 5;
  
  // Function to perform research analysis - PLACEHOLDER FOR NOW
  const performResearch = async (url) => {
    try {
      console.log('Starting research analysis for URL:', url);
      
      // PLACEHOLDER: Replace with actual research API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      
      // Mock data for now
      return {
        title: getArxivTitle(),
        status: 'success',
        analysis: 'Research analysis complete'
      };
      
    } catch (error) {
      console.error('Error performing research:', error);
      return { error: error.message };
    }
  };
  
  // Draggable logic
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let dragMoved = false;

  researchButton.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragMoved = false;
    researchButton.style.transition = 'none';
    const rect = researchButton.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    researchButton.style.left = (e.clientX - dragOffsetX) + 'px';
    researchButton.style.top = (e.clientY - dragOffsetY) + 'px';
    researchButton.style.right = '';
    researchButton.style.bottom = '';
    dragMoved = true;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      researchButton.style.transition = '';
      localStorage.setItem('elacityResearchButtonPosition', JSON.stringify({
        left: researchButton.style.left,
        top: researchButton.style.top,
        right: researchButton.style.right,
        bottom: researchButton.style.bottom
      }));
      document.body.style.userSelect = '';
    }
  });

  researchButton.addEventListener('click', async (e) => {
    if (dragMoved) return; // Prevent research if it was a drag
    
    const currentUrl = window.location.href;
    // Show loading state
    showLoading();
    
    // Perform the research analysis
    const result = await performResearch(currentUrl);
    
    if (result.error) {
      morphElacityBlob(false);
      setTimeout(() => showError(`Failed to analyze paper: ${result.error}`), 2300);
    } else {
      morphElacityBlob(true);
      setTimeout(() => showResults(result), 2300);
    }
  });
  
  document.body.appendChild(researchButton);
};

// Run after page is fully loaded
window.addEventListener('load', () => {
  console.log("Page fully loaded, Elacity extension is active");
  // checkForAuthReturn(); // COMMENTED OUT
  addFontLinks();
  createStatusBadge();
  createResearchButton();
});

// Store the current URL so popup can access it
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "getArxivUrl") {
    sendResponse({ url: window.location.href });
  }
  return true;
}); 