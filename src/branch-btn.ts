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
    console.log('TODO');

  }else{
    var newWrapper = document.createElement('div');
    newWrapper.classList.add('wrapper');
    newWrapper.appendChild(activeCell.node);

    panel.content.node.insertBefore(newWrapper, panel.content.node.children[activeCellIndex])

    console.log('TODO11！！！');


  }


}