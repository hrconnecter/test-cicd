// import Quill from 'quill';
// const Delta = Quill.import('delta');
// const Module = Quill.import('core/module');
// const Table = Quill.import('formats/table');
// const TableCell = Quill.import('formats/table-cell');
// const TableRow = Quill.import('formats/table-row');

// // Register table formats if not already registered
// if (!Table) {
//   const Block = Quill.import('blots/block');
  
//   class TableCell extends Block {
//     static create(value) {
//       const node = super.create();
//       if (value) {
//         node.setAttribute('data-row', value.row);
//         node.setAttribute('data-cell', value.cell);
//       }
//       return node;
//     }
    
//     static formats(node) {
//       return {
//         row: node.getAttribute('data-row'),
//         cell: node.getAttribute('data-cell')
//       };
//     }
    
//     format(name, value) {
//       if (name === 'row' || name === 'cell') {
//         this.domNode.setAttribute(`data-${name}`, value);
//       } else {
//         super.format(name, value);
//       }
//     }
//   }
//   TableCell.blotName = 'table-cell';
//   TableCell.tagName = 'TD';
  
//   class TableRow extends Block {
//     static create(value) {
//       const node = super.create();
//       if (value) {
//         node.setAttribute('data-row', value);
//       }
//       return node;
//     }
    
//     static formats(node) {
//       return {
//         row: node.getAttribute('data-row')
//       };
//     }
    
//     format(name, value) {
//       if (name === 'row') {
//         this.domNode.setAttribute('data-row', value);
//       } else {
//         super.format(name, value);
//       }
//     }
//   }
//   TableRow.blotName = 'table-row';
//   TableRow.tagName = 'TR';
  
//   class TableFormat extends Block {
//     static create(value) {
//       const node = super.create();
//       return node;
//     }
//   }
//   TableFormat.blotName = 'table';
//   TableFormat.tagName = 'TABLE';
  
//   Quill.register(TableCell, true);
//   Quill.register(TableRow, true);
//   Quill.register(TableFormat, true);
// }

// class QuillTableModule extends Module {
//   constructor(quill, options) {
//     super(quill, options);
//     this.quill = quill;
//     this.options = options;
    
//     // Bind methods
//     this.insertTable = this.insertTable.bind(this);
    
//     // Add toolbar handler
//     if (this.quill.getModule('toolbar')) {
//       this.quill.getModule('toolbar').addHandler('table', this.insertTable);
//     }
//   }
  
//   insertTable(config) {
//     const range = this.quill.getSelection(true);
//     if (range) {
//       this.quill.deleteText(range.index, range.length);
      
//       const rows = config.rows || 2;
//       const cols = config.columns || 2;
      
//       // Create table HTML
//       let tableHTML = '<table><tbody>';
//       for (let r = 0; r < rows; r++) {
//         tableHTML += '<tr>';
//         for (let c = 0; c < cols; c++) {
//           if (r === 0) {
//             // First row as headers
//             tableHTML += `<th data-row="${r}" data-cell="${c}">Header ${c+1}</th>`;
//           } else {
//             tableHTML += `<td data-row="${r}" data-cell="${c}">Cell ${r},${c}</td>`;
//           }
//         }
//         tableHTML += '</tr>';
//       }
//       tableHTML += '</tbody></table>';
      
//       // Insert the table
//       this.quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
//       this.quill.setSelection(range.index + 1, 0);
//     }
//   }
// }

// export default QuillTableModule;



import Quill from 'quill';
const Delta = Quill.import('delta');
const Module = Quill.import('core/module');

// Register table formats
const Block = Quill.import('blots/block');
const Container = Quill.import('blots/container');

// Define TableCell blot
class TableCell extends Block {
  static create(value) {
    const node = super.create();
    if (value) {
      node.setAttribute('data-row', value.row);
      node.setAttribute('data-cell', value.cell);
    }
    return node;
  }
  
  static formats(node) {
    return {
      row: node.getAttribute('data-row'),
      cell: node.getAttribute('data-cell')
    };
  }
  
  format(name, value) {
    if (name === 'row' || name === 'cell') {
      this.domNode.setAttribute(`data-${name}`, value);
    } else {
      super.format(name, value);
    }
  }
}
TableCell.blotName = 'table-cell';
TableCell.tagName = 'TD';

// Define TableRow blot
class TableRow extends Block {
  static create(value) {
    const node = super.create();
    if (value) {
      node.setAttribute('data-row', value);
    }
    return node;
  }
  
  static formats(node) {
    return {
      row: node.getAttribute('data-row')
    };
  }
  
  format(name, value) {
    if (name === 'row') {
      this.domNode.setAttribute('data-row', value);
    } else {
      super.format(name, value);
    }
  }
}
TableRow.blotName = 'table-row';
TableRow.tagName = 'TR';

// Define Table blot
class TableBlot extends Container {
  static create() {
    const node = super.create();
    const tbody = document.createElement('tbody');
    node.appendChild(tbody);
    return node;
  }
}
TableBlot.blotName = 'table';
TableBlot.tagName = 'TABLE';
TableBlot.allowedChildren = [TableRow];

// Define TableHeader blot
class TableHeader extends TableCell {
  static create(value) {
    const node = super.create(value);
    return node;
  }
}
TableHeader.blotName = 'table-header';
TableHeader.tagName = 'TH';

// Register all blots
Quill.register(TableCell);
Quill.register(TableRow);
Quill.register(TableBlot);
Quill.register(TableHeader);

class QuillTableModule extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill = quill;
    this.options = options || {};
    
    // Bind methods
    this.insertTable = this.insertTable.bind(this);
    
    // Add toolbar handler
    if (this.quill.getModule('toolbar')) {
      this.quill.getModule('toolbar').addHandler('table', this.insertTable);
    }
  }
  
  insertTable(config = {}) {
    const range = this.quill.getSelection(true);
    if (range) {
      this.quill.deleteText(range.index, range.length);
      
      const rows = config.rows || 3;
      const cols = config.columns || 3;
      
      // Create table HTML with inline styles to ensure proper rendering
      let tableHTML = '<table style="width:100%; border-collapse:collapse; margin:10px 0;"><tbody>';
      for (let r = 0; r < rows; r++) {
        tableHTML += '<tr>';
        for (let c = 0; c < cols; c++) {
          if (r === 0) {
            // First row as headers
            tableHTML += `<th style="border:1px solid #ddd; padding:8px; background-color:#f2f2f2; text-align:left;" data-row="${r}" data-cell="${c}">Header ${c+1}</th>`;
          } else {
            tableHTML += `<td style="border:1px solid #ddd; padding:8px;" data-row="${r}" data-cell="${c}">Cell ${r},${c}</td>`;
          }
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table><p><br></p>';
      
      // Insert the table
      this.quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
      
      // Move cursor after the table
      this.quill.setSelection(range.index + 1, 0);
    }
  }
}

export default QuillTableModule;
