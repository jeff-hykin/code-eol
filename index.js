"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")

// 
// init vars
//
let isDisabled = null
let whitespaceWasActive = null
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
// Update colors
//
function updateSettings() {
    //
    // import stuff from settings.json
    //
    let {
        style,
        newlineCharacter,
        newlineCharacterStyle,
        returnCharacter,
        returnCharacterStyle,
        crlfCharacter,
        crlfCharacterStyle,
        validLineEnding,
        toggleWithWhiteSpace,
    } = vscode.workspace.getConfiguration('code-eol')
    let whitespaceIsBeingRendered = vscode.workspace.getConfiguration('editor', null).get('renderWhitespace', false) != 'none'
    // make style editable (by default it is read only when its imported from settings)
    style = {
        // set default color to be the color of whitespace
        color: new vscode.ThemeColor('editorWhitespace.foreground'),
        ...style
    }

    // 
    // Check for non-default line endings
    // 
    if (validLineEnding != null) {
        const themeErrorColor = new vscode.ThemeColor('errorForeground')
        if (validLineEnding == 'LF') {
            crlfCharacterStyle   = { color: themeErrorColor, ...crlfCharacterStyle  }
            returnCharacterStyle = { color: themeErrorColor, ...returnCharacterStyle}
        } else if (validLineEnding == 'CRLF') {
            newlineCharacterStyle = { color: themeErrorColor, ...newlineCharacterStyle}
            returnCharacterStyle  = { color: themeErrorColor, ...returnCharacterStyle }
        }
    }

    // convert opacity into a string (not sure why it fails when its a number)
    if (typeof style.opacity == "number") { style.opacity = `${style.opacity}` }
    newlineCharacterStyle = {...newlineCharacterStyle}; if (typeof newlineCharacterStyle.opacity == "number") { newlineCharacterStyle.opacity = `${newlineCharacterStyle .opacity}` }
    returnCharacterStyle  = {...returnCharacterStyle }; if (typeof returnCharacterStyle .opacity == "number") { returnCharacterStyle .opacity = `${returnCharacterStyle  .opacity}` }
    crlfCharacterStyle    = {...crlfCharacterStyle   }; if (typeof crlfCharacterStyle   .opacity == "number") { crlfCharacterStyle   .opacity = `${crlfCharacterStyle    .opacity}` }
    
    // set the style/look/decoration of each line ending
    renderNewline = { after: { contentText: newlineCharacter, ...style, ...newlineCharacterStyle } }
    renderReturn  = { after: { contentText: returnCharacter , ...style, ...returnCharacterStyle  } }
    renderCrlf    = { after: { contentText: crlfCharacter   , ...style, ...crlfCharacterStyle    } }
    renderBlank   = { after: { contentText: ''              , ...style,                 } }
    
    // 
    // Check for change in showing whitespace (check for if it should be toggled)
    // 
    if (whitespaceWasActive != whitespaceIsBeingRendered) {
        // save change to perisitant storage
        whitespaceWasActive = !whitespaceWasActive
        if (globalState) {
            globalState.update("whitespaceWasActive", whitespaceWasActive)
        }
        // if user has setting enabled
        if (toggleWithWhiteSpace) {
            if (whitespaceIsBeingRendered) {
                isDisabled = false
            } else {
                isDisabled = true
            }
            if (globalState) {
                globalState.update("codeEolIsDisabled", isDisabled)
            }
        }
    }
} 


// 
// this method is called when vs code is initally opened
// 
exports.activate = function activate(context) {
    // set the active editor
    activeEditor = vscode.window.activeTextEditor
    // set the globalState
    globalState = context.globalState
    // get the isDisabled setting
    isDisabled          = context.globalState.get("codeEolIsDisabled")
    whitespaceWasActive = context.globalState.get("whitespaceWasActive")
    let isRunningV1     = context.globalState.get("isRunningV1")


    updateSettings()
    
    // update message for v1
    if (isRunningV1 != true) {
        vscode.window.showInformationMessage('Hey! The big update to code-eol might break the look of your line-endings. Check the extension homepage for more details')
        if (globalState) {
            globalState.update("isRunningV1", true)
        }
    }

    // 
    // bind updateDecorations()
    // 
    // updateDecorations on activation
    updateDecorations()
    // updateDecorations whenever the doc changes 
    vscode.workspace.onDidChangeTextDocument(()=>updateDecorations(), null, context.subscriptions)
    // updateDecorations when the editor changes (aka new tab)
    vscode.window.onDidChangeActiveTextEditor(updateDecorations, null, context.subscriptions)

    // 
    // when the user changes settings, update the color varaibles
    // 
    vscode.workspace.onDidChangeConfiguration(() => {
        updateSettings()
        updateDecorations()
    }, null, context.subscriptions)
}

// 
// the render function for actually showing newlines
// 
function updateDecorations(editor) {
    // if there is a new editor (aka new tab), then update activeEditor
    if (editor) { activeEditor = editor }
    // if somehow there is no active editor, then just return
    if (!activeEditor) { return }
    
    // if this called by onDidChangeTextDocument(), 
    // then the text string will only be the text that changed
    // (it wont be the text of the entire file)
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

