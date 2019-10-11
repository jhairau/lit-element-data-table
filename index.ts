import { LitElement, css, html, property, customElement } from "lit-element";
import { ColumnDefinition, RowData } from "./types";

@customElement("data-table-element")
export class DataTableElement extends LitElement {
  @property({ type: Object })
  columnDefinitions: ColumnDefinition[];

  @property({ type: Object })
  data: RowData[];

  static get styles() {
    return css`
      :host {
        display: block;
        overflow: auto;
      }

      table {
        border-spacing: 0;
        width: var(--data-table-element-table-width, auto);
      }
      thead > tr {
        height: 56px;
      }
      tbody > tr,
      tfoot > tr {
        height: 48px;
      }

      th {
        top: 0px;
        position: sticky;
        z-index: 100;
        min-height: 56px;
        background: #ececec;
        text-align: left;
      }
      [dir="rtl"] th.mat-header-cell {
        text-align: right;
      }

      td {
        padding: 0;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #ececec;
      }
      th:first-of-type,
      td:first-of-type {
        padding-left: 24px;
      }
      [dir="rtl"] th:first-of-type,
      [dir="rtl"] td:first-of-type {
        padding-left: 0;
        padding-right: 24px;
      }
      th:last-of-type,
      td:last-of-type {
        padding-right: 24px;
      }
      [dir="rtl"] th:last-of-type,
      [dir="rtl"] td:last-of-type {
        padding-right: 0;
        padding-left: 24px;
      }
    `;
  }

  renderWrapper(header, body) {
    return html`
      <table role="grid">
        ${header} ${body}
      </table>
    `;
  }

  // ---- Header ---- //
  private getTableHeader(columns: ColumnDefinition[]) {
    const columnsHtml = columns.map(this.getTableHeaderColumn);
    return html`
      <thead role="rowgroup">
        <tr role="row">
          ${columnsHtml}
        </tr>
      </thead>
    `;
  }

  private getTableHeaderColumn(column: ColumnDefinition) {
    return html`
      <th>${column.name}</th>
    `;
  }

  // ---- Body ---- //
  private getTableBody(columns: ColumnDefinition[], data: RowData[]) {
    const bodyHtml = data.map(row => this.getTableBodyRow(row, columns));
    return html`
      <tbody>
        ${bodyHtml}
      </tbody>
    `;
  }

  private getTableBodyRow(rowData: RowData, columns: ColumnDefinition[]) {
    const cells = columns.map((column: ColumnDefinition) =>
      this.getTableBodyCell(rowData, column)
    );

    return html`
      <tr>
        ${cells}
      </tr>
    `;
  }

  private getTableBodyCell(rowData: RowData, column: ColumnDefinition) {
    return html`
      <td>${this.getValueForCell(rowData, column)}</td>
    `;
  }

  // ---- Data Retrieval ---- //
  private getValueForCell(rowData: RowData, column: ColumnDefinition) {
    return typeof column.valueGetter === "function"
      ? html`${column.valueGetter(rowData)}`
      : rowData[column.field];
  }

  render() {
    return !this.columnDefinitions
    ? null
    : this.renderWrapper(
      this.getTableHeader(this.columnDefinitions),
      this.getTableBody(this.columnDefinitions, this.data)
    );
  }
}
