# What is this?
This shows newline (technically end-of-line) characters, similar to Atom or Notepad++. There's also the option to show display some line endings as an error-color if you want to avoid a particular kind of line ending.

# How do I use it?
Just install it, open a file, and make sure you have the `renderWhitespace` setting enabled in VS Code (toggle it with the "Toggle Render Whitespace" command in the command pallet).

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


# I only want to see line endings, not spaces!
Cool! You can totally do that. First disable the `renderWhitespace` in settings, then call the "Toggle (Show/Hide) Line Endings" command in the command pallet. You'll also want to add `"code-eol.toggleWithWhiteSpace": false,` to your settings file encase you later decide to enable `renderWhitespace`.

# Even after toggling, I don't see any line endings??
If you've toggled "Toggle Render Whitespace" and "Toggle (Show/Hide) Line Endings" and still nothing shows up, it could be an issue with your theme. But! you can avoid this problem by manually setting the color. Add the following to your settings and then try the "Toggle (Show/Hide) Line Endings" again.
```
"code-eol.style": {
    "color" : "#f55742",
    "opacity" : 1.0
},
```
The line endings should now be displayed as a bright red (just to indicat that it is working). If its not bright red for you, then please create a new issue on the GitHub repo here: https://github.com/jeff-hykin/code-eol

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
