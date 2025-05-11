# VS Code Typing Effect

A Visual Studio Code extension that adds beautiful typing effects to your editor with optional syntax highlighting glow.

## Features

- Animated cursor blinking with a glowing effect
- Text sparkle animation when typing
- Smooth typing animations
- Custom styling for better visual feedback
- Neon syntax highlighting glow similar to Synthwave '84
- Configurable glow brightness

## Requirements

This extension requires the [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css) extension to be installed.

## Installation

1. Install Custom CSS and JS Loader extension
2. Install this extension
3. Run command "Enable Typing Effect"
4. Reload VS Code when prompted

## Usage

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS)
2. Type "Enable Typing Effect" to activate both typing effects and syntax glow
3. Alternatively, use "Enable Syntax Glow" to activate only the neon syntax highlighting

## Configuration

The extension comes with default settings optimized for a pleasant typing experience.

You can customize the following settings:

- `typingEffect.glowBrightness`: Control the intensity of the syntax highlighting glow (value between 0 and 1)

## Available Commands

- `Typing Effect: Enable` - Enable both typing effects and syntax glow
- `Typing Effect: Disable` - Disable all effects
- `Typing Effect: Enable Syntax Glow` - Enable only the syntax glow effect
- `Typing Effect: Disable Syntax Glow` - Disable only the syntax glow effect

## License

MIT

## Note

Due to VS Code's security model, the Custom CSS and JS Loader extension requires you to start VS Code with the `--enable-proposed-api` flag. Please refer to the Custom CSS and JS Loader documentation for detailed setup instructions.

## Setup Instructions

1. Install the "Custom CSS and JS Loader" extension
2. Start VS Code with the `--enable-proposed-api be5invis.vscode-custom-css` flag:
   - Windows: Add `--enable-proposed-api be5invis.vscode-custom-css` to your VS Code shortcut target
   - macOS: `code --enable-proposed-api be5invis.vscode-custom-css`
   - Linux: `code --enable-proposed-api be5invis.vscode-custom-css`
3. Install this extension
4. Open Command Palette and run "Enable Typing Effect"
5. Click "Reload Now" when prompted

## Troubleshooting

If you don't see the effects after enabling:

1. Make sure VS Code is running with the proper flags
2. Try running "Disable Typing Effect" and then "Enable Typing Effect" again
3. Check if Custom CSS Loader shows any errors in the Output panel
4. Try manually reloading VS Code window (Ctrl/Cmd + R)
