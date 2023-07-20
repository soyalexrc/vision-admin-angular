import {ITableHeader} from "../../core/interfaces/table";

export function setHeaders(content: any[]) {
  return content.map((x, i) => ({
    key: x.key,
    displayName: x.displayName,
    index: i,
    isSelected: true
  } as ITableHeader))
}
