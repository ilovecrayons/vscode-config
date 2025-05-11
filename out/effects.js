"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// For compatibility with different module systems
let BinaryAsciiVisualizer;
try {
    // Try to import using require
    BinaryAsciiVisualizer = require("./binary-ascii-vis").default;
} catch (e) {
    // Fallback: try to access it from global scope
    BinaryAsciiVisualizer = window.BinaryAsciiVisualizer;
}
// Typing and cursor effects handler
class EditorEffects {
    constructor() {
        this.lastCursorPosition = null;
        this.binaryVisualizer = null;
        this.init();
    }
    init() {
        // Initialize the binary ASCII visualizer
        this.binaryVisualizer = new binary_ascii_vis_1.default();
        
        // Wait for Monaco Editor to be fully loaded
        const tryInitialize = () => {
            const editor = window.monaco?.editor?.getEditors()?.[0];
            if (editor) {
                this.setupEffects(editor);
            }
            else {
                setTimeout(tryInitialize, 100);
            }
        };
        tryInitialize();
    }
    setupEffects(editor) {
        // Handle typing effects
        editor.onKeyUp((e) => {
            if (e.keyCode >= 32 && e.keyCode <= 126) {
                // Printable characters
                const position = editor.getPosition();
                const lineContent = editor
                    .getModel()
                    .getLineContent(position.lineNumber);
                
                // Get the character that was just typed
                const typedChar = lineContent[position.column - 2];
                
                // Update the binary ASCII visualizer
                if (typedChar && this.binaryVisualizer) {
                    this.binaryVisualizer.updateVisualization(typedChar);
                }
                
                const viewLine = document.querySelector(`.view-line[lineNumber="${position.lineNumber}"]`);
                if (viewLine) {
                    const spans = viewLine.querySelectorAll("span");
                    spans.forEach((span) => {
                        if (span.textContent?.includes(typedChar)) {
                            span.classList.add("new-text");
                            setTimeout(() => span.classList.remove("new-text"), 400);
                        }
                    });
                }
            }
        });
        // Handle cursor movement effects
        editor.onDidChangeCursorPosition((e) => {
            if (this.lastCursorPosition) {
                const cursor = document.querySelector(".cursor");
                if (cursor) {
                    cursor.classList.add("cursor-move");
                    setTimeout(() => cursor.classList.remove("cursor-move"), 70);
                }
            }
            this.lastCursorPosition = e.position;
        });    }
}

// Export for module systems
exports.default = EditorEffects;

// Also add to global scope for alternative access
if (typeof window !== 'undefined') {
    window.EditorEffects = EditorEffects;
}
//# sourceMappingURL=effects.js.map