# What is this?
This shows newline (technically end-of-line) characters, similar to how Atom or Notepad++ do.

# What can I customize? (Settings)
You can customize the color and character of each kind of end-of-line character by adding the following to your settings:
(NOTE: Make sure to reload VS Code after changing settings for them to take effect)
```
        "code-eol.color"  :"#2a3f47",
        "code-eol.newlineCharacter":"¬",
        "code-eol.returnCharacter" :"⇠",
        "code-eol.crlfCharacter"   :"↵",
        // some other symbols you might want to use:
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

# You programmed this yourself?
Nope, the only reason this exists is because its updated/improved fork of https://github.com/sohamkamani/code-eol
All credit should go to them, my changes were relatively minor.

# Whats improved?
This fork:
1. Fixes the character bounce issue when typing at the end of a line
2. Lets you customize color and character choice
3. Improves performance
4. Adds more comments/documentation

# What if there is a problem with the extension?
If there are bugs/complaints create an issue on github: https://github.com/jeff-hykin/code-eol<br>
I plan to actively maintain this extension, and I'll continue accepting push requests for improvements. (Although it may take me a few days to see the push request)<br>
If anyone thinks they know how to improve the speed/efficiency, there is a lot of room for improvement! I'd be especially happy to merge push requests for efficiency.

