# Small Kitten Extension

A Visual Studio Code extension that adds beautiful typing effects to your editor. Adapted from Nam Nguyen's *VSCode Typing Effect* extension.

**Note: Experimental hardware acceleration is recommended for Windows systems to achieve optimal performance.**

## Features

- Animated cursor blinking with effects
- Text sparkle animation when typing
- Smooth typing animations
- Custom styling for better visual feedback
- Complete UI overhaul
- Complete sytax highlighting overhaul

## Requirements

This extension requires the [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css) extension to be installed.

## Installation

1. Install Custom CSS and JS Loader extension
2. Install this extension
3. Run command "meowing: enable" from the Command Palette
4. Reload VS Code when prompted

## Usage

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS)
2. Type " meowing: enable" to enable all effects
3. Reload VS Code when prompted

## Available Commands

- `meowing: enable` - Enable effects
- `meowing: disable` - Disable all effects

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
4. Open Command Palette and run "meowing: enable"
5. Click "Reload Now" when prompted

