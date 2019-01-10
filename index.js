"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")


// this method is called when vs code is activated
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
    
    //
    // init vars for the updateDecorations function
    //
    let match
    let theRenderOption
    // create a mainDecoration with nothing in it because we're not actually decorating any existing text 
    // instead we're finding end-of-lines, then adding something after them, and then decorating that "something-after" thing
    const mainDecoration = vscode.window.createTextEditorDecorationType({})
    let activeEditor = vscode.window.activeTextEditor
    // the pattern to find the differnt line endings
    const endOfLinePattern = /(\r(?!\n))|(\r?\n)/g
    // the style/look/decoration of each line ending
    const renderNewline = { after: { contentText: newlineCharacter, ...style } }
    const renderReturn  = { after: { contentText: crlfCharacter   , ...style } }
    const renderCrlf    = { after: { contentText: returnCharacter , ...style } }
    const renderBlank   = { after: { contentText: ''              , ...style } }

    // this gets called every time one of the newlines changes
    function updateDecorations(editor) {
        // if there is a new editor, then update activeEditor
        if (editor) { activeEditor = editor }
        // if somehow there is no active editor, then just return
        if (!activeEditor) { return }
        
        const document = activeEditor.document
        const text = document.getText()
        const newLines = []
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
    
    // if there is an active editor then go ahead an updateDecorations
    if (activeEditor) { updateDecorations() }
    // updateDecorations whenever the doc changes
    vscode.workspace.onDidChangeTextDocument(()=>updateDecorations(), null, context.subscriptions)
    // when the editor changes, updateDecorations
    vscode.window.onDidChangeActiveTextEditor(updateDecorations, null, context.subscriptions)
}