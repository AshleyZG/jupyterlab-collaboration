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
     NotebookPanel, INotebookModel//NotebookActions,
  } from '@jupyterlab/notebook';

import {
    addIcon
} from '@jupyterlab/ui-components';


import {
  getActiveCellIndex
} from './utils';

// import {
//   ICellModel
// } from '@jupyterlab/cells';



/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export
class LockButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let callback = () => {
      console.log('TODO');
      lockCell(panel);
    //   NotebookActions.runAll(panel.content, context.sessionContext);
    };

    let button = new ToolbarButton({
      className: 'myLockButton',
      icon: addIcon,
    //   iconClass: 'fa fa-fast-forward',
      onClick: callback,
      tooltip: 'Lock cell'
    });

    panel.toolbar.addItem('lockCell', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

function lockCell(panel: NotebookPanel){
    console.log('TODO');
    const isInWrapper: boolean = panel.content.activeCell.node.parentElement.classList.contains("wrapper");
    var newCell = panel.model.contentFactory.createCell('code', {});
    panel.model.insertCell(getActiveCellIndex(panel, isInWrapper), newCell);
    newCell.setValue('%who_ls');
    panel.content.activeCellIndex = getActiveCellIndex(panel, isInWrapper);
}