# What is this?
This shows newline (technically end-of-line) characters, similar to Atom or Notepad++. There's also the option to show some line endings with an error-color if you want to avoid a particular kind of line ending.

# How do I use it?
Just install it, open a file, and make sure you have the `renderWhitespace` setting enabled in VS Code (toggle it with the "Toggle Render Whitespace" command in the command pallet). If you don't want spaces to be displayed, use the "Toggle (Show/Hide) Line Endings" command instead of "Toggle Render Whitespace". (You'll also want to add `"code-eol.toggleWithWhiteSpace": false,` to your settings file encase you later decide to enable `renderWhitespace`)

# Its not working! (Even after toggling)
Some themes have a transparent (or 99% transparent) whitespace color, so the endings might be colored... they're just colored invisble. You can manually override that theme-color by putting this in your settings:
```
"workbench.colorCustomizations": {
    "editorWhitespace.foreground": "#d1d41b" // whatever hex color you want
},
```
You can also manually override this extension by adding this to your settings
```
"code-eol.style": {
    "color" : "#d1d41b", // whatever hex color you want
    "opacity" : 1.0
},
```
If its still not working, then please let me know by creating new issue on GitHub here: https://github.com/jeff-hykin/code-eol

# What can I customize? (Settings)
You can customize the color, opacity, which character is used for each kind of end-of-line, and a few other things.<br>
Settings Example:
```
        "code-eol.style": {
            "color" : "#2a3f47",
            "opacity" : 1.0
            // there are more settings that can go in here
            // see "ThemableDecorationAttachmentRenderOptions" on https://goo.gl/SYzyg8
        },
        "code-eol.toggleWithWhiteSpace": true,
        // "code-eol.validLineEnding": "LF"  , // (optional) this makes "CRLF" endings render as error-color
        // "code-eol.validLineEnding": "CRLF", // (optional) this makes "LF" endings render as error-color
        "code-eol.newlineCharacter":"¬",
        "code-eol.returnCharacter" :"⇠",
        "code-eol.crlfCharacter"   :"↵",
        "code-eol.newlineCharacterStyle" : {
            "color": "#2a3f47",
            "opacity": 0.9
        },
        "code-eol.returnCharacterStyle" : {
            "color": "#2a3f47",
            "opacity": 0.9
        },
        "code-eol.crlfCharacterStyle" : {
            "color": "#2a3f47",
            "opacity": 0.9
        },
        // some other symbols you might want to use:
            // ¤
            // ↓
            // ←
            // ↙
            // ⇣
            // ⇠
            // ⇓
            // ⇐
            // ▼
            // ◀
            // ␤
            // ¶
            // ↲
            // ↩
            // ↴
            // ⬎
            // ⇂
        // see more at https://unicode-table.com/en/sets/arrows-symbols/
```
<!-- <img width="376" src="https://github.com/jeff-hykin/code-eol/blob/master/Screen Shot 2018-05-07 at 11.41.35 PM.png"> -->

# Can I toggle line endings with a keybinding?
Yes! By default the line endings are toggled along with the "show whitespace" setting. There is also a command (with no default keybinding) called "Toggle (Show/Hide) Line Endings" that you can use from the command pallet, and you can add a keybinding that maps to it. That command will manually toggle line endings independently of the show whitespace setting.

# You programmed this yourself?
Nope, the only reason this exists is because its updated/improved fork of https://github.com/sohamkamani/code-eol
The majority of the credit should go to them, I added all the customizations, but I couldn't have done the core myself.

# What does this fork improve?
This fork:
1. Fixes the character bounce issue when typing at the end of a line
2. Lets you customize color and character choice
3. Improves performance
4. Adds more comments/documentation
5. Adds toggle command for turning visible line endings on/off
6. Uses the default colors of your theme

# What if there is a problem with the extension?
Then post a bug/feature request!<br>
(to do that just create an issue on github: https://github.com/jeff-hykin/code-eol)<br>
The opacity setting, character-specific styles, and the toggle command were created because people on GitHub asked.<br>
NOTE: It might take me awhile to repond on GitHub (I only maintain this in my free time), but I will respond.
