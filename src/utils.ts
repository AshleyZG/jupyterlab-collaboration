import {
    NotebookPanel//, INotebookModel //NotebookActions,
 } from '@jupyterlab/notebook';


export function numToString(number:number){
    let char = "";
    let array: number[] = [];
    // Switch ASCII
    let numToStringAction = function(nnum:number) {
      let num = nnum - 1;
      let a = parseInt((num / 26).toString());
      let b = num % 26;
      array.push(b);
      if (a > 0) {
        numToStringAction(a);
      }
    }
    numToStringAction(number);
    array = array.reverse();
    // Return excel letter: such => C / AA / BBA
    for (let i = 0; i < array.length; i++) {
      char += String.fromCharCode(64 + parseInt((array[i] + 1).toString()));
    }
    return char;
  }
  

export  function getActiveCellIndex(panel: NotebookPanel, isInWrapper: boolean){
    if (isInWrapper){
      return Array.prototype.indexOf.call(panel.content.node.children, panel.content.activeCell.node.parentElement);
    }else{
      return Array.prototype.indexOf.call(panel.content.node.children, panel.content.activeCell.node);
    }
  }


