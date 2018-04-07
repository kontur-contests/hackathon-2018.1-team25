export function removeSelection() {
    const selection = window.document.getSelection();
    // check range before calling removeAllRanges to prevent cryptic errors in ie
    if (selection.rangeCount > 0 && selection.getRangeAt(0).getClientRects().length > 0) {
        selection.removeAllRanges();
    }
}
