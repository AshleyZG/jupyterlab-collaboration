import {
    IDisposable, DisposableDelegate
  } from '@lumino/disposable';

import {
    ToolbarButton
  } from '@jupyterlab/apputils';
  
import {
    DocumentRegistry
  } from '@jupyterlab/docregistry';
  
import {
    NotebookActions, NotebookPanel, INotebookModel
  } from '@jupyterlab/notebook';

import {
  numToString
} from './utils';

import {
  ICellModel
} from '@jupyterlab/cells';
  
const WRAPPER_WIDTH: number = 95;
const SIDE_WIDTH:number = 5;

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export
class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let callback = () => {
      // console.log('TODO');
      subdivideCell(panel);
      NotebookActions.runAll(panel.content, context.sessionContext);
    };

    let button = new ToolbarButton({
      className: 'myButton',
      iconClass: 'fa fa-fast-forward',
      onClick: callback,
      tooltip: 'Run All'
    });

    panel.toolbar.addItem('runAll', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

function getActiveCellIndex(panel: NotebookPanel, isInWrapper: boolean){
  if (isInWrapper){
    return Array.prototype.indexOf.call(panel.content.node.children, panel.content.activeCell.node.parentElement);
  }else{
    return Array.prototype.indexOf.call(panel.content.node.children, panel.content.activeCell.node);
  }
}

function subdivideCell(panel: NotebookPanel){

  var activeCell = panel.content.activeCell;
  const isInWrapper: boolean = activeCell.node.parentElement.classList.contains("wrapper");
  var activeCellIndex: number = getActiveCellIndex(panel, isInWrapper);

  if (isInWrapper){
    console.log('active cell is in a wrapper');

  }else{
    console.log('set tag for initial cell');
    activeCell.model.setValue('#'+activeCellIndex.toString()+'A\n'+activeCell.model.getValue())
    activeCell.node.id = activeCell.model.getValue().split('\n')[0];

    console.log('active cell not in wrapper. Create a new wrapper for it');
    var newWrapper = document.createElement('div');
    newWrapper.classList.add('wrapper');
    newWrapper.appendChild(activeCell.node);
    panel.content.node.insertBefore(newWrapper, panel.content.node.children[activeCellIndex])

  }

  console.log('create a new cell and insert it to the wrapper');
  var wrapper = panel.content.node.children[activeCellIndex];
  var newCell = panel.model.contentFactory.createCell('code', {});
  // newCell. = newCell.getValue().split('n')[0];
  panel.model.insertCell(activeCellIndex+1, newCell);
  newCell.setValue('#'+activeCellIndex.toString()+numToString(wrapper.children.length)+'\n');
  wrapper.appendChild(panel.content.node.children[activeCellIndex+1]);


  console.log('add hidebar and move it to last');
  if (isInWrapper){
    wrapper.appendChild(wrapper.children[wrapper.children.length-2]);
  }else{
    // console.log('add hide box to the right')
    var hideBox = document.createElement('div');
    hideBox.classList.add('hide-box');
    hideBox.setAttribute("style",  "width:"+SIDE_WIDTH.toString()+"%")

    wrapper.appendChild(hideBox);

  }

  console.log('adjust width of cells in wrapper');
  adjustWidthForWrapper(wrapper);

  document.addEventListener("keydown", event => {
    if (event.key==="i"){
      panel.content.activeCell.node.remove();
      adjustWidthForWrapper(wrapper);
    }else if (event.key==="h"){
      hideCell(panel, wrapper);
    }
  });
}

function hideCell(panel:NotebookPanel, wrapper:Element){
  if (panel.content.activeCell.node.classList.contains('hidden-cell')){
    return;
  }
  const cellID:string = panel.content.activeCell.model.id;
  console.log('hide cell ', cellID);
  var tab = document.createElement('div');
  tab.id = cellID;
  var tag:string = getTagOfCell(panel.content.activeCell.model);
  tab.setAttribute("tag", tag);
  tab.innerHTML = tag;
  tab.classList.add('hide-tab');

  tab.onclick = function(event){
    var tag = (event.target as HTMLElement).getAttribute('tag');
    for (var i=0; i<wrapper.children.length-1; i++){
      var cellTag:string = (wrapper.children[i].getElementsByClassName('CodeMirror-line')[0] as HTMLElement).innerText.slice(1);

      // if id ===cell id: remove class "hidden-cell" for this cell 
      // adjust width
      // break;
      if (tag===cellTag){
        wrapper.children[i].classList.remove("hidden-cell");
        adjustWidthForWrapper(wrapper);
      }
    }
    (event.target as HTMLElement).remove();
  };

  wrapper.lastChild.appendChild(tab);
  panel.content.activeCell.node.classList.add('hidden-cell');
  adjustWidthForWrapper(wrapper);
}

function adjustWidthForWrapper(wrapper: Element){
  var nHiddenCells = wrapper.getElementsByClassName('hidden-cell').length;
  var nActiveCells = wrapper.children.length-nHiddenCells-1; 
  var newWidth = WRAPPER_WIDTH/nActiveCells;
  for (var i=0; i<wrapper.children.length-1; i++){
    wrapper.children[i].setAttribute("style", "width:"+newWidth.toString()+"%");
  }
}

function getTagOfCell(cellModel: ICellModel){
  return cellModel.getValue().split('\n')[0].slice(1);
}
