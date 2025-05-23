(function () {
  // Get glow brightness factor from VS Code configuration
  const getGlowBrightness = () => {
    try {
      // Try to get the configuration (if exists)
      const configElement = document.getElementById('vscode-typing-effect-config');
      if (configElement) {
        const config = JSON.parse(configElement.getAttribute('data-config') || '{}');
        return config.glowBrightness || 0.5;
      }
      return 0.5; // Default brightness
    } catch (e) {
      return 0.5; // Default if something goes wrong
    }
  };
  // Apply brightness to hex color
  const applyBrightness = (hexColor, opacity, brightnessAdjustment) => {
    if (typeof hexColor !== 'string' || !hexColor.startsWith('#')) {
      return hexColor + opacity;
    }

    // Parse hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
  
    // Enhanced brightness adjustment with boosted intensity
    // Uses a more dynamic approach to increase glow while maintaining color character
    const adjust = (val) => {
      // Increase intensity while preserving color balance
      const adjusted = val * brightnessAdjustment * 1.2;
      return Math.min(255, Math.max(0, Math.floor(adjusted)));
    };
    
    return `rgba(${adjust(r)}, ${adjust(g)}, ${adjust(b)}, ${opacity})`;
  };  // Function to create glow styles with dynamic brightness
  const createGlowStyles = (brightness) => {
    const b = brightness * 1.5 + 0.5; // normalize to 0.5-2.0 range for increased glow intensity
    
    return {
      // Variable - #00ff95 (green) - NO GLOW FOR VARIABLES
      '00ff95': `color: #00ff95; backface-visibility: hidden;`,
  
      // Language variable - #fe4450 (red) - KEEP GLOW FOR LANGUAGE KEYWORDS
      'fe4450': `color: #fe4450; text-shadow: 0 0 2px #000, 0 0 5px ${applyBrightness('#fe4450', 0.7 * b, b)}, 0 0 15px ${applyBrightness('#fe4450', 0.5 * b, b)}, 0 0 25px ${applyBrightness('#fe4450', 0.35 * b, b)}; backface-visibility: hidden;`,
      
      // Storage / Storage modifier - #fede5d (yellow) - KEEP GLOW FOR KEYWORDS
      'fede5d': `color: #fede5d; text-shadow: 0 0 2px #100c0f, 0 0 5px ${applyBrightness('#fede5d', 0.7 * b, b)}, 0 0 10px ${applyBrightness('#fede5d', 0.5 * b, b)}, 0 0 20px ${applyBrightness('#fede5d', 0.3 * b, b)}; backface-visibility: hidden;`,
      
      // Constant / Numbers - #f97e72 (orange/coral) - NO GLOW FOR LITERALS
      'f97e72': `color: #f97e72; backface-visibility: hidden;`,
      
      // Character escape - #36f9f6 (cyan) - KEEP GLOW FOR SYNTAX ELEMENTS
      '36f9f6': `color: #36f9f6; text-shadow: 0 0 2px #001716, 0 0 5px ${applyBrightness('#36f9f6', 0.7 * b, b)}, 0 0 10px ${applyBrightness('#36f9f6', 0.5 * b, b)}, 0 0 20px ${applyBrightness('#36f9f6', 0.3 * b, b)}; backface-visibility: hidden;`,
      
      // HTML/XML tag - #72f1b8 (light green) - KEEP GLOW FOR TAGS
      '72f1b8': `color: #72f1b8; text-shadow: 0 0 2px #100c0f, 0 0 5px ${applyBrightness('#72f1b8', 0.7 * b, b)}, 0 0 10px ${applyBrightness('#72f1b8', 0.5 * b, b)}, 0 0 20px ${applyBrightness('#72f1b8', 0.3 * b, b)}; backface-visibility: hidden;`,
      
      // Support variable / Object property - #ff7edb (pink) - NO GLOW FOR OBJECT PROPERTIES
      'ff7edb': `color: #ff7edb; backface-visibility: hidden;`,
      
      // String - #ff8b39 (orange) - NO GLOW FOR STRING LITERALS
      'ff8b39': `color: #ff8b39; backface-visibility: hidden;`,
    };
  };

  // Get brightness and create token styles
  const brightness = getGlowBrightness();
  const tokenGlowStyles = createGlowStyles(brightness);

  /**
   * Check if the style element exists and contains the target color tokens
   */
  const themeStylesExist = (tokensEl) => {
    return tokensEl.innerText !== '' && 
      Object.keys(tokenGlowStyles).some(color => {
        return tokensEl.innerText.toLowerCase().includes(`#${color}`);
      });
  };

  /**
   * Replace color definitions with glow styles
   */
  const applyGlowStyles = (styles) => Object.keys(tokenGlowStyles).reduce((acc, color) => {
    const re = new RegExp(`color: #${color};`, 'gi');
    return acc.replace(re, tokenGlowStyles[color]);
  }, styles);

  /**
   * Initialize the glow effect
   */
  const initGlowEffect = () => {
    const tokensEl = document.querySelector('.vscode-tokens-styles');
    
    if (!tokensEl || !themeStylesExist(tokensEl)) {
      // Try again later if styles aren't loaded yet
      setTimeout(initGlowEffect, 300);
      return;
    }

    // Add the theme styles if they don't already exist
    if (!document.querySelector('#typing-effect-glow-styles')) {
      const initialThemeStyles = tokensEl.innerText;
      
      // Replace tokens with glow styles
      const updatedThemeStyles = applyGlowStyles(initialThemeStyles);
      
      // Create new style element
      const newStyleTag = document.createElement('style');
      newStyleTag.setAttribute("id", "typing-effect-glow-styles");
      newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');
      document.body.appendChild(newStyleTag);
      
      console.log('Typing Effect: Syntax Glow initialized!');
    }

    // Add a mutation observer to handle theme changes or editor reloads
    const observer = new MutationObserver((mutations) => {
      const tokensEl = document.querySelector('.vscode-tokens-styles');
      const glowStylesEl = document.querySelector('#typing-effect-glow-styles');
      
      if (tokensEl && !glowStylesEl && themeStylesExist(tokensEl)) {
        // Reapply glow if our styles are gone but the token styles exist
        initGlowEffect();
      }
    });

    // Watch for changes to the body element
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  };

  // Start the initialization process
  setTimeout(initGlowEffect, 500);
})();
