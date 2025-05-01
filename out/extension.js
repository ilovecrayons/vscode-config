"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const path = require("path");
const CUSTOM_CSS_EXTENSION_ID = "be5invis.vscode-custom-css";
const ERROR_MESSAGES = {
    NOT_INSTALLED: "Custom CSS and JS Loader extension is not installed",
    ENABLE_FAILED: "Failed to enable Typing Effect",
    DISABLE_FAILED: "Failed to disable Typing Effect",
};
function activate(context) {
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
    // Tự động enable khi extension được cài đặt
    const autoEnable = async () => {
        const cssPath = path.join(context.extensionPath, "themes", "styles.css");
        const cssUri = `file:///${cssPath.replace(/\\/g, "/")}`;
        await handleCssImports("enable", cssUri);
        // Hiển thị thông báo yêu cầu reload
        const action = await vscode.window.showInformationMessage("Typing Effect đã được bật. Vui lòng reload VS Code để áp dụng thay đổi.", "Reload");
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
        // Hiển thị thông báo yêu cầu reload sau khi enable
        const action = await vscode.window.showInformationMessage("Typing Effect đã được bật. Vui lòng reload VS Code để áp dụng thay đổi.", "Reload");
        if (action === "Reload") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    });
    const disableCommand = vscode.commands.registerCommand("vscode-typing-effect.disable", async () => {
        await handleCssImports("disable");
        // Hiển thị thông báo yêu cầu reload sau khi disable
        const action = await vscode.window.showInformationMessage("Typing Effect đã được tắt. Vui lòng reload VS Code để áp dụng thay đổi.", "Reload");
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
    context.subscriptions.push(enableCommand, disableCommand);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map