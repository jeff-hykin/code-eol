### What is this?
This is an extension to display EOL (new line) characters in your code, like Atom or Notepad++

### Settings
In vs code settings you can add:
```
        "code-eol.color":"#2a3f47",
        "code-eol.newlineCharacter":"¬",
        "code-eol.returnCharacter":"↵",
        "code-eol.crlfCharacter"  :"←",
```
[[https://github.com/jeff-hykin/code-eol/blob/master/Screen Shot 2018-05-07 at 11.41.35 PM.png]]
This will (obviously) set the color, along with the characters for each of the return types.

### Credit
This is an updated/improved fork of https://github.com/sohamkamani/code-eol

### Whats improved?
This fork:
1. Fixes the character bounce issue when typing at the end of a line 
2. Adds the ability to pick the characters that represent the newline/return character
3. Improves performance
4. adds more comments/documentation
