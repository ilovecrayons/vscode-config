import * as vscode from "vscode";
import * as path from "path";

const CUSTOM_CSS_EXTENSION_ID = "be5invis.vscode-custom-css";

const ERROR_MESSAGES = {
    NOT_INSTALLED: "Custom CSS and JS Loader extension is not installed",
    ENABLE_FAILED: "Failed to enable Typing Effect",
    DISABLE_FAILED: "Failed to disable Typing Effect",
};

export function activate(context: vscode.ExtensionContext) {
    // CSS imports handler
    const handleCssImports = async (action: string, cssUri?: string) => {
        try {
            const customCssExtension = vscode.extensions.getExtension(CUSTOM_CSS_EXTENSION_ID);
            if (!customCssExtension) {
                throw new Error(ERROR_MESSAGES.NOT_INSTALLED);
            }
            const customCssConfig = vscode.workspace.getConfiguration("vscode_custom_css");
            const currentImports = customCssConfig.get<string[]>("imports") || [];
            const imports = action === "enable" && cssUri ? [...currentImports, cssUri].filter(Boolean) : [];
            
            await customCssConfig.update("imports", imports, vscode.ConfigurationTarget.Global);
            await vscode.commands.executeCommand("extension.updateCustomCSS");
        } catch (error) {
            const errorKey = `${action.toUpperCase()}_FAILED` as keyof typeof ERROR_MESSAGES;
            const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES[errorKey];
            vscode.window.showErrorMessage(errorMessage);
        }
    };

    // Auto-enable function
    const autoEnable = () => {
        // Auto-enable logic would go here
    };

    autoEnable();

    // Command handlers
    const enableCommand = vscode.commands.registerCommand("small-kitten-extension.enableMeowing", async () => {
        const cssPath = path.join(context.extensionPath, "themes", "styles.css");
        const cssUri = `file:///${cssPath.replace(/\\/g, "/")}`;
        await handleCssImports("enable", cssUri);
        
        const action = await vscode.window.showInformationMessage(
            "Typing Effect has been enabled. Please reload VS Code to apply changes.", 
            "Reload"
        );
        if (action === "Reload") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    });
    
    const disableCommand = vscode.commands.registerCommand("small-kitten-extension.disableMeowing", async () => {
        await handleCssImports("disable");
        
        const action = await vscode.window.showInformationMessage(
            "Typing Effect has been disabled. Please reload VS Code to apply changes.", 
            "Reload"
        );
        if (action === "Reload") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    });

    // Configure editor settings
    const config = vscode.workspace.getConfiguration();
    const settingsToUpdate = {
        "workbench.list.smoothScrolling": true,
        "editor.smoothScrolling": true,
        "terminal.integrated.smoothScrolling": true,
        "editor.cursorWidth": 3,
        "editor.cursorBlinking": "expand" as const,
    };
    
    Object.entries(settingsToUpdate).forEach(([key, value]) => {
        config.update(key, value, vscode.ConfigurationTarget.Global);
    });

    context.subscriptions.push(enableCommand, disableCommand);
}

export function deactivate() {}
