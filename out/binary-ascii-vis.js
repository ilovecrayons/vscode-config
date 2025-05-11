"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// ASCII Binary Visualization - Shadow DOM approach with iframe fallback
class BinaryAsciiVisualizer {
    constructor() {
        this.overlay = null;
        this.slitElements = [];
        this.currentChar = 'A';
        this.initialized = false;
        this.iframe = null;
        
        // Wait for DOM to be ready before initializing the UI
        this.initWhenReady();
    }
    
    initWhenReady() {
        // Try to initialize, but if the DOM isn't fully loaded yet, retry
        if (document.body) {
            setTimeout(() => this.init(), 1000);
        } else {
            setTimeout(() => this.initWhenReady(), 100);
        }
    }
    
    init() {
        // Try multiple approaches to ensure visualization works
        this.tryDirectOverlay();
        
        // As a fallback, try an iframe approach
        setTimeout(() => {
            if (!this.initialized) {
                this.tryIframeApproach();
            }
        }, 2000);
        
        // Setup keyboard listeners regardless of visualization method
        this.setupEventListeners();
    }

    tryDirectOverlay() {
        // Create the overlay directly in the main document
        this.createOverlayVisualizer(document.body);
        this.initialized = true;
    }
    
    tryIframeApproach() {
        console.log("Binary visualizer: Trying iframe fallback approach");
        
        // Create an iframe that will contain our visualizer
        this.iframe = document.createElement('iframe');
        this.iframe.style.cssText = `
            position: fixed;
            bottom: 110px;
            left: 45px;
            width: 80px;
            height: 170px;
            border: none;
            background: transparent;
            z-index: 2147483647;
            pointer-events: none;
        `;
        document.body.appendChild(this.iframe);
        
        // Wait for iframe to load then add our visualizer to its document
        this.iframe.onload = () => {
            try {
                // Get iframe document and create visualizer inside it
                const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
                
                // Add base styles to iframe
                const style = iframeDoc.createElement('style');
                style.textContent = `
                    body { 
                        margin: 0;
                        padding: 0;
                        overflow: hidden;
                        background: transparent;
                    }
                `;
                iframeDoc.head.appendChild(style);
                
                // Create visualizer in the iframe
                this.createOverlayVisualizer(iframeDoc.body);
                this.initialized = true;
                
                // Create message bridge for keyboard events
                window.addEventListener('message', (e) => {
                    if (e.data && e.data.type === 'keypress' && e.data.key) {
                        this.updateVisualization(e.data.key);
                    }
                });
            } catch (err) {
                console.error("Failed to initialize in iframe:", err);
            }
        };
    }

    createOverlayVisualizer(parent) {
        // Remove any existing instance
        const existingOverlay = document.getElementById('binary-ascii-overlay');
        if (existingOverlay) {
            existingOverlay.parentNode.removeChild(existingOverlay);
        }
        
        // Create a completely independent overlay container
        this.overlay = document.createElement('div');
        this.overlay.id = 'binary-ascii-overlay';
        
        // Apply styles that ensure it will be visible and on top of everything
        this.overlay.style.cssText = `
            position: fixed;
            left: 45px; 
            bottom: 110px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 6px;
            background-color: rgba(30, 30, 40, 0.95);
            border-radius: 4px;
            border: 1px solid rgba(122, 162, 247, 0.7);
            box-shadow: 0 0 10px rgba(122, 162, 247, 0.9), 0 0 20px rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 10px;
            z-index: 2147483647;
            pointer-events: none;
            overflow: visible;
        `;
        
        // Create the visualizer content
        this.createVisualizerContent();
        
        // Add to the specified parent
        parent.appendChild(this.overlay);
        
        // Add a CSS class for external styling
        if (document.createElement('style').styleSheet) {
            // For IE
            document.getElementsByTagName('head')[0].appendChild(this.createStyleElement());
        } else {
            // For everyone else
            document.head.appendChild(this.createStyleElement());
        }
    }
    
    createVisualizerContent() {
        // Clear any existing content
        this.overlay.innerHTML = '';
        this.slitElements = [];
        
        // Add a header
        const header = document.createElement('div');
        header.textContent = 'ASCII';
        header.style.cssText = `
            margin-bottom: 4px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 9px;
            text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
            font-weight: bold;
        `;
        this.overlay.appendChild(header);
        
        // Create a container for slits
        const slitContainer = document.createElement('div');
        slitContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 3px;
            width: 100%;
        `;
        this.overlay.appendChild(slitContainer);
        
        // Create the 8 binary slits (vertically stacked)
        for (let i = 0; i < 8; i++) {
            const slitWrapper = document.createElement('div');
            slitWrapper.style.cssText = `
                display: flex;
                align-items: center;
                width: 100%;
            `;
            
            // Add bit position indicator
            const bitPosition = document.createElement('span');
            bitPosition.textContent = 7-i;
            bitPosition.style.cssText = `
                font-size: 7px;
                color: rgba(255, 255, 255, 0.7);
                width: 8px;
                margin-right: 4px;
                text-align: center;
            `;
            slitWrapper.appendChild(bitPosition);
            
            const slit = document.createElement('div');
            slit.className = 'binary-slit';
            slit.style.cssText = `
                width: 20px;
                height: 4px;
                background-color: rgba(255, 255, 255, 0.35);
                border-radius: 2px;
                transition: all 0.15s ease-out;
            `;
            slitWrapper.appendChild(slit);
            slitContainer.appendChild(slitWrapper);
            this.slitElements.push(slit);
        }
        
        // Add char display at the bottom
        const charDisplay = document.createElement('div');
        charDisplay.id = 'ascii-char-display';
        charDisplay.style.cssText = `
            margin-top: 5px;
            font-family: monospace;
            font-size: 11px;
            color: white;
            background-color: rgba(0, 0, 0, 0.2);
            padding: 2px 4px;
            border-radius: 3px;
            width: 90%;
            text-align: center;
        `;
        charDisplay.textContent = 'A: 65';
        this.overlay.appendChild(charDisplay);
    }
    
    createStyleElement() {
        // Create a style element for visualization styling
        const style = document.createElement('style');
        style.id = 'binary-ascii-visualizer-styles';
        style.textContent = `
            #binary-ascii-overlay {
                position: fixed !important;
                z-index: 2147483647 !important;
                visibility: visible !important;
                opacity: 1 !important;
                display: flex !important;
            }
            
            #binary-ascii-overlay .binary-slit {
                transition: all 0.15s ease-out;
                background-color: rgba(255, 255, 255, 0.35);
            }
            
            @keyframes binaryPulse {
                0% { opacity: 0.95; }
                50% { opacity: 0.5; }
                100% { opacity: 0.95; }
            }
            
            #binary-ascii-overlay {
                animation: binaryPulse 2s ease-in-out 1;
            }
        `;
        return style;
    }
    
    setupEventListeners() {
        // Listen for keydown events to update the visualization
        document.addEventListener('keydown', (event) => {
            // Only capture printable characters (letters, numbers, etc)
            const char = event.key;
            if (char.length === 1) {
                this.currentChar = char;
                this.updateVisualization(char);
                
                // If we're using an iframe, send a message to it
                if (this.iframe && this.iframe.contentWindow) {
                    try {
                        this.iframe.contentWindow.postMessage({ 
                            type: 'keypress', 
                            key: char 
                        }, '*');
                    } catch (e) {
                        // Ignore message errors
                    }
                }
            }
        });
        
        // Set up a periodic check to ensure visualization exists
        setInterval(() => {
            // If overlay disappeared from main document, try to recreate it
            if ((!this.overlay || !this.overlay.parentElement) && 
                (!document.getElementById('binary-ascii-overlay'))) {
                console.log("Binary visualizer: Overlay disappeared, recreating");
                this.tryDirectOverlay();
                this.updateVisualization(this.currentChar);
            }
            
            // Periodically update to ensure it keeps working
            this.updateVisualization(this.currentChar);
        }, 3000);
    }
    
    updateVisualization(char) {
        if (!this.slitElements.length) return;
        
        // Get the ASCII value of the character
        const asciiValue = char.charCodeAt(0);
        
        // Convert to binary (8 bits)
        const binaryString = asciiValue.toString(2).padStart(8, '0');
        
        // Update each slit based on the binary representation
        for (let i = 0; i < 8; i++) {
            const bit = binaryString[i] === '1';
            const slit = this.slitElements[i];
            
            if (bit) {
                // Bit is ON - make it very visible
                slit.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                slit.style.boxShadow = '0 0 5px #fff, 0 0 10px rgba(122, 162, 247, 0.8)';
                slit.style.width = '24px';
            } else {
                // Bit is OFF
                slit.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                slit.style.boxShadow = 'none';
                slit.style.width = '16px';
            }
        }
        
        // Update the character display
        const charDisplay = document.getElementById('ascii-char-display');
        if (charDisplay) {
            charDisplay.textContent = `${char}: ${asciiValue}`;
        }
        
        // Store the current character
        this.currentChar = char;
    }
    
    forceVisibility() {
        if (this.overlay) {
            // Make it more prominent with higher contrast
            this.overlay.style.backgroundColor = 'rgba(40, 40, 50, 0.95)';
            this.overlay.style.border = '2px solid rgba(122, 162, 247, 0.9)';
            this.overlay.style.boxShadow = '0 0 15px rgba(122, 162, 247, 0.9), 0 0 30px rgba(0, 0, 0, 0.5)';
            
            // Ensure maximum visibility
            this.overlay.style.zIndex = '2147483647';
            this.overlay.style.display = 'flex';
            this.overlay.style.visibility = 'visible';
            this.overlay.style.opacity = '1';
            
            // If it's not attached, reattach it
            if (!this.overlay.parentElement) {
                document.body.appendChild(this.overlay);
            }
        }
    }
}

// Export for module systems
exports.default = BinaryAsciiVisualizer;

// Global initialization with smarter approach and fallbacks
(function() {
    // Self-executing wrapper function
    
    // Create global reference
    window.BinaryAsciiVisualizer = BinaryAsciiVisualizer;
    
    // Track initialization attempts
    let initAttempts = 0;
    const maxAttempts = 5;
    
    const initVisualizer = () => {
        try {
            // Don't create multiple instances
            if (window.binaryAsciiVisualizer && initAttempts > 0) {
                window.binaryAsciiVisualizer.forceVisibility();
                return;
            }
            
            console.log(`Binary ASCII Visualizer: Initialization attempt ${++initAttempts}`);
            const visualizer = new BinaryAsciiVisualizer();
            window.binaryAsciiVisualizer = visualizer;
            
            // Force visibility after a short delay
            setTimeout(() => visualizer.forceVisibility(), 200);
        } catch (err) {
            console.error("Failed to initialize Binary ASCII Visualizer:", err);
            if (initAttempts < maxAttempts) {
                // Try again with exponential backoff
                setTimeout(initVisualizer, 1000 * Math.pow(2, initAttempts));
            }
        }
    };
    
    // Initial attempt
    initVisualizer();
    
    // Try progressively longer intervals - exponential backoff
    [500, 2000, 5000, 10000].forEach((delay, index) => {
        setTimeout(() => {
            if (!window.binaryAsciiVisualizer || !document.getElementById('binary-ascii-overlay')) {
                initVisualizer();
            }
        }, delay);
    });
    
    // Add initialization to both load events for redundancy
    window.addEventListener('load', () => setTimeout(initVisualizer, 1000));
    window.addEventListener('DOMContentLoaded', () => setTimeout(initVisualizer, 500));
    
    // Inject mandatory styles directly into document head
    const injectGlobalStyles = () => {
        const existingStyles = document.getElementById('binary-ascii-vis-global-styles');
        if (!existingStyles) {
            const style = document.createElement('style');
            style.id = 'binary-ascii-vis-global-styles';
            style.textContent = `
                #binary-ascii-overlay {
                    position: fixed !important;
                    z-index: 2147483647 !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    display: flex !important;
                }
                
                #binary-ascii-overlay * {
                    visibility: visible !important;
                    opacity: 1 !important;
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    injectGlobalStyles();
    setTimeout(injectGlobalStyles, 2000); // Re-inject later in case it gets removed
})();
