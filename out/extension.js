"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const CUSTOM_CSS_EXTENSION_ID = "be5invis.vscode-custom-css";
const ERROR_MESSAGES = {
    NOT_INSTALLED: "Custom CSS and JS Loader extension is not installed",
    ENABLE_FAILED: "Failed to enable Typing Effect",
    DISABLE_FAILED: "Failed to disable Typing Effect",
};
function activate(context) {
    // Add constants for JS injection
    const ELECTRON_BASE = process.versions.electron < "13.0.0" ? "electron-browser" : "electron-sandbox";
    const WORKBENCH_FILENAME = "workbench.html";

    // Hàm utility để xử lý CSS imports
    const handleCssImports = async (action, cssUri) => {
        try {
            // Kiểm tra Custom CSS Loader
            const customCssExtension = vscode.extensions.getExtension(CUSTOM_CSS_EXTENSION_ID);
            if (!customCssExtension) {
                throw new Error(ERROR_MESSAGES.NOT_INSTALLED);
            }
            const customCssConfig = vscode.workspace.getConfiguration("vscode_custom_css");
            // Xử lý imports dựa trên action
            const currentImports = customCssConfig.get("imports") || [];
            const imports = action === "enable" ? [...currentImports, cssUri].filter(Boolean) : [];
            // Cập nhật imports
            await customCssConfig.update("imports", imports, vscode.ConfigurationTarget.Global);
            // Reload CSS
            await vscode.commands.executeCommand("extension.updateCustomCSS");
        }
        catch (error) {
            const errorKey = `${action.toUpperCase()}_FAILED`;
            const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES[errorKey];
            vscode.window.showErrorMessage(errorMessage);
        }
    };
    
    // Function to handle JavaScript glow injection
    const handleGlowInjection = async (action) => {
        try {
            const appDir = path.dirname(vscode.env.appRoot);
            const base = path.join(appDir, 'app', 'out', 'vs', 'code');
            const htmlFile = path.join(base, ELECTRON_BASE, "workbench", WORKBENCH_FILENAME);
            const jsFile = path.join(base, ELECTRON_BASE, "workbench", "typing-effect-glow.js");
            
            if (action === "enable") {
                // Read our glow script
                const glowScript = fs.readFileSync(path.join(context.extensionPath, "out", "glow.js"), "utf-8");
                
                // Write the script to VS Code's directory
                fs.writeFileSync(jsFile, glowScript, "utf-8");
                
                // Check if script tag already exists
                const html = fs.readFileSync(htmlFile, "utf-8");
                const isEnabled = html.includes("typing-effect-glow.js");
                
                if (!isEnabled) {
                    // Add script tag to the workbench HTML
                    let output = html.replace(/\<\/html\>/g, `\t<!-- TYPING EFFECT GLOW --><script src="typing-effect-glow.js"></script><!-- TYPING EFFECT GLOW END -->\n</html>`);
                    fs.writeFileSync(htmlFile, output, "utf-8");
                }
            } else if (action === "disable") {
                // Remove the script tag if it exists
                const html = fs.readFileSync(htmlFile, "utf-8");
                const output = html.replace(/<!-- TYPING EFFECT GLOW --><script src="typing-effect-glow.js"><\/script><!-- TYPING EFFECT GLOW END -->\n/g, '');
                fs.writeFileSync(htmlFile, output, "utf-8");
                
                // Delete the JS file if it exists
                if (fs.existsSync(jsFile)) {
                    fs.unlinkSync(jsFile);
                }
            }
        } catch (error) {
            if (/ENOENT|EACCES|EPERM/.test(error.code)) {
                vscode.window.showInformationMessage("Syntax Glow was unable to modify the VS Code files. You may need to run VS Code with admin privileges to enable this feature.");
                return;
            } else {
                vscode.window.showErrorMessage('An error occurred with Syntax Glow: ' + error.message);
                console.error("Error handling glow injection:", error);
                return;
            }
        }
    };
    // Tự động enable khi extension được cài đặt
    const autoEnable = async () => {
        const cssPath = path.join(context.extensionPath, "themes", "styles.css");
        const cssUri = `file:///${cssPath.replace(/\\/g, "/")}`;
        await handleCssImports("enable", cssUri);
        
        // Enable glow effect
        await handleGlowInjection("enable");
        
        // Hiển thị thông báo yêu cầu reload
        const action = await vscode.window.showInformationMessage("Typing Effect và Syntax Glow đã được bật. Vui lòng reload VS Code để áp dụng thay đổi.", "Reload");
        if (action === "Reload") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    };
    // Gọi autoEnable khi extension được kích hoạt
    autoEnable();
    // Command handlers
    const enableCommand = vscode.commands.registerCommand("vscode-typing-effect.enable", async () => {
        const cssPath = path.join(context.extensionPath, "themes", "styles.css");
        const cssUri = `file:///${cssPath.replace(/\\/g, "/")}`;
        await handleCssImports("enable", cssUri);
        
        // Enable glow effect
        await handleGlowInjection("enable");
        
        // Hiển thị thông báo yêu cầu reload sau khi enable
        const action = await vscode.window.showInformationMessage("Typing Effect và Syntax Glow đã được bật. Vui lòng reload VS Code để áp dụng thay đổi.", "Reload");
        if (action === "Reload") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    });
    
    const disableCommand = vscode.commands.registerCommand("vscode-typing-effect.disable", async () => {
        await handleCssImports("disable");
        
        // Disable glow effect
        await handleGlowInjection("disable");
        
        // Hiển thị thông báo yêu cầu reload sau khi disable
        const action = await vscode.window.showInformationMessage("Typing Effect và Syntax Glow đã được tắt. Vui lòng reload VS Code để áp dụng thay đổi.", "Reload");
        if (action === "Reload") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    });
    
    // Command to enable just the glow effect
    const enableGlowCommand = vscode.commands.registerCommand("vscode-typing-effect.enableGlow", async () => {
        // Enable glow effect
        await handleGlowInjection("enable");
        
        // Hiển thị thông báo yêu cầu reload 
        const action = await vscode.window.showInformationMessage("Syntax Glow đã được bật. Vui lòng reload VS Code để áp dụng thay đổi.", "Reload");
        if (action === "Reload") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    });
    
    // Command to disable just the glow effect
    const disableGlowCommand = vscode.commands.registerCommand("vscode-typing-effect.disableGlow", async () => {
        // Disable glow effect
        await handleGlowInjection("disable");
        
        // Hiển thị thông báo yêu cầu reload
        const action = await vscode.window.showInformationMessage("Syntax Glow đã được tắt. Vui lòng reload VS Code để áp dụng thay đổi.", "Reload");
        if (action === "Reload") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    });
    // Thêm cấu hình smooth scrolling và cursor
    const config = vscode.workspace.getConfiguration();
    const settingsToUpdate = {
        "workbench.list.smoothScrolling": true,
        "editor.smoothScrolling": true,
        "terminal.integrated.smoothScrolling": true,
        "editor.cursorWidth": 3,
        "editor.cursorBlinking": "expand",
    };
    // Cập nhật từng setting
    Object.entries(settingsToUpdate).forEach(([key, value]) => {
        config.update(key, value, vscode.ConfigurationTarget.Global);
    });
    context.subscriptions.push(enableCommand, disableCommand, enableGlowCommand, disableGlowCommand);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map