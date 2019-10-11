export interface ColumnDefinition {
  id?: string;
  field: string;
  name: string;
  valueGetter?: <T, R>(rowData: RowData) => R;
}

export interface RowData {
  [key: string]: any;
}
