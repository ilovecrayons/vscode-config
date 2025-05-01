"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Typing and cursor effects handler
class EditorEffects {
    constructor() {
        this.lastCursorPosition = null;
        this.init();
    }
    init() {
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
                const viewLine = document.querySelector(`.view-line[lineNumber="${position.lineNumber}"]`);
                if (viewLine) {
                    const spans = viewLine.querySelectorAll("span");
                    spans.forEach((span) => {
                        if (span.textContent?.includes(lineContent[position.column - 2])) {
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
        });
    }
}
exports.default = EditorEffects;
//# sourceMappingURL=effects.js.map