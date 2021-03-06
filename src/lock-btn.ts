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
     NotebookPanel, INotebookModel,//NotebookActions,
     NotebookActions
  } from '@jupyterlab/notebook';

import {
    addIcon
} from '@jupyterlab/ui-components';


import {
  getActiveCellIndex
} from './utils';



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
    };

    let button = new ToolbarButton({
      className: 'myLockButton',
      icon: addIcon,
      onClick: callback,
      tooltip: 'Lock cell'
    });

    panel.toolbar.addItem('lockCell', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

async function lockCell(panel: NotebookPanel){
    var activeCell = panel.content.activeCell;
    const isInWrapper: boolean = panel.content.activeCell.node.parentElement.classList.contains("wrapper");
    var newCell = panel.model.contentFactory.createCell('code', {});
    panel.model.insertCell(getActiveCellIndex(panel, isInWrapper), newCell);
    newCell.setValue('%who_ls');
    panel.content.activeCellIndex = getActiveCellIndex(panel, isInWrapper)-1;
    await NotebookActions.run(panel.content, panel.sessionContext);
    const output:any = (panel.content.activeCell.node.getElementsByClassName("jp-OutputArea-output")[0] as HTMLElement).innerText;

    var outputVars = JSON.parse(output.replaceAll("'", '"'));

    const storeCodeLines:string[] = outputVars.map((i:string)=>{return "    %store "+i});
    const storeCode ="if True:#store var value\n"+storeCodeLines.join("\n");
    const storeRCodeLines:string[] = outputVars.map((i:string)=>{return "    %store -r "+i});
    const storeRCode = "if True:#reset var value\n"+storeRCodeLines.join("\n");

    activeCell.model.setValue(storeCode+"\n"+activeCell.model.getValue()+"\n"+storeRCode);

    panel.model.deleteCell(getActiveCellIndex(panel, false),1);
}
