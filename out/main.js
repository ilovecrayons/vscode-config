"use strict";

// Main entry point for VS Code typing effect features
(function() {
    // Function to initialize our effects
    const initializeEffects = () => {
        // Make sure our imports are accessible in different execution contexts
        try {
            // Check if we can require the effects module directly
            const EditorEffects = window.require && window.require('./typing-effect-effects').default;
            if (EditorEffects) {
                new EditorEffects();
                console.log('VS Code Typing Effect: Editor effects initialized via require');
                return;
            }
        } catch (e) {
            // If require fails, try alternate approach
        }
        
        // Alternative initialization using global scope
        if (window.EditorEffects) {
            new window.EditorEffects();
            console.log('VS Code Typing Effect: Editor effects initialized via global scope');
        } else {
            // Retry after a short delay
            console.log('VS Code Typing Effect: Effects module not ready, retrying...');
            setTimeout(initializeEffects, 500);
        }
    };

    // Try to initialize when the document is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initializeEffects, 1000);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeEffects, 1000);
        });
    }
})();
