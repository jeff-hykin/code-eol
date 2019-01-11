"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")


// 
// init vars
//
let isDisabled = null
// create a mainDecoration with nothing in it because we're not actually decorating any existing text 
// instead we're finding end-of-lines, then adding something after them, and then decorating that "something-after" thing
const mainDecoration = vscode.window.createTextEditorDecorationType({})
let activeEditor
let globalState
// the pattern to find the differnt line endings
const endOfLinePattern = /\r\n|\n|\r/g
let match
let theRenderOption
// each of the 4 render possibilities
let renderNewline
let renderReturn
let renderCrlf
let renderBlank

// 
// this method is called when vs code is initally opened
// 
exports.activate = function activate(context) {
    // 
    // import stuff from settings.json
    // 
    let { style, newlineCharacter, returnCharacter, crlfCharacter, color } = vscode.workspace.getConfiguration('code-eol')
    // make style ediable (by default it is read only when its imported from settings)
    style = {...style}

    // 
    // check if the user is using the old color method
    // 
    if (color) {
        // show a message to the user
        vscode.window.showWarningMessage(`Hey! Take 5 seconds to change your code-eol settings. Change "code-eol.color":"${color}" to "code-eol.style":{ "color": "${color}", "opacity": 1.0 } instead`)
        // put the color in the style object so that the old method still works
        style.color = color
    }

    // convert opacity into a string (not sure why it fails when its a number)
    if (typeof style.opacity == "number") {
        style.opacity = `${style.opacity}`
    }

    // set the style/look/decoration of each line ending
    renderNewline = { after: { contentText: newlineCharacter, ...style } }
    renderReturn  = { after: { contentText: crlfCharacter   , ...style } }
    renderCrlf    = { after: { contentText: returnCharacter , ...style } }
    renderBlank   = { after: { contentText: ''              , ...style } }
    
    // set the active editor
    activeEditor = vscode.window.activeTextEditor
    // set the globalState
    globalState = context.globalState
    // get the isDisabled setting
    isDisabled = context.globalState.get("codeEolIsDisabled")

    // 
    // bind updateDecorations()
    // 
    // updateDecorations on activation
    updateDecorations()
    // updateDecorations whenever the doc changes 
    vscode.workspace.onDidChangeTextDocument(()=>updateDecorations(), null, context.subscriptions)
    // updateDecorations when the editor changes (aka new tab)
    vscode.window.onDidChangeActiveTextEditor(updateDecorations, null, context.subscriptions)
}

// 
// the render function for actually showing newlines
// 
function updateDecorations(editor) {
    // if there is a new editor (aka new tab), then update activeEditor
    if (editor) { activeEditor = editor }
    // if somehow there is no active editor, then just return
    if (!activeEditor) { return }
    
    const document = activeEditor.document
    const text = document.getText()
    const newLines = []
    
    // if disabled, update the page to show nothing (otherwise the old line endings will stick around)
    if (isDisabled) {
        activeEditor.setDecorations(mainDecoration, newLines)
    // if enabled then continue to render everything
    } else {
        // loop through every line ending match
        while (match = endOfLinePattern.exec(text)) {
            // find which ending this particular match is
            switch (match[0]) {
                case '\n'  : theRenderOption = renderNewline; break
                case '\r\n': theRenderOption = renderCrlf   ; break
                case '\r'  : theRenderOption = renderReturn ; break
                default    : theRenderOption = renderBlank  ; break
            }
            let startingPosition = document.positionAt(match.index)
            let lineDecoration = {
                // just use startPos twice since we dont want to decorate any existing text
                range: new vscode.Range(startingPosition, startingPosition),
                renderOptions: theRenderOption
            }
            newLines.push(lineDecoration)
        }
        if (activeEditor.setDecorations) {
            activeEditor.setDecorations(mainDecoration, newLines)
        }
    }
}

// 
// register a command for toggling the line endings
// 
vscode.commands.registerCommand('extension.toggleLineEndings', () => {
    // disable the flag
    isDisabled = !isDisabled
    // then tell the current file to update (either add or remove the line endings)
    updateDecorations()
    // after render, change toggle the storage option too
    // (this makes the setting perisitant even after restarting vs code)
    if (globalState) {
        globalState.update("codeEolIsDisabled", isDisabled)
    }
})

