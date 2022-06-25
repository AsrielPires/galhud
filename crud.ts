import { $ as ett$, Bond, Field, fields, fieldTypes } from "entity";
import { Rec } from "entity/core";
import { One } from "galho";
import { RecordStyle } from "galhui/list";
import { defRenderer, FieldPlatform, list as rawList } from "galhui/list";
import { output } from "galhui/io";
import Table, { TableColumn, TableOption } from "galhui/table";
import { byKey, sub, t } from "inutil";
import { copy, set } from "orray";
import { card } from "./card";
import { size } from "./fields";
import { mdPut } from "./form";
import { all, ctxMenu, tryRemove } from "./tools";

interface IEttCrud {
  add?(): any;
  edit?(...value: Rec[]): any;
  menu?: bool;
  /**
  * called when user select this element by mouse or arrow key
  */
  focus?(item: Rec, state: bool): any;
  open?(...items: Rec[]): any;
  delete?(...items: Rec[]): any | true;
  single?: boolean;
}

export interface ilist extends IEttCrud {
  options?: ((item: Rec, index: number) => One)[];
}
export const list = (bond: Bond, model: ilist = {}) => rawList<Rec>({
  single: model.single,
  open: model.open || model.edit || ((value) => mdPut(bond.target, value?.id)),
  remove: (...value) => tryRemove(bond.target, sub(value, "id")),
  menu: () => ctxMenu(bond, { edit: model.edit }),
  options: model.options,
  item: card(bond)
}, bond.bind());


export interface itable extends IEttCrud {
  iform?: bool;
  options?: TableOption<Dic>[];
  p?: FieldPlatform;
  style?: RecordStyle;
}
export function table(bond: Bond, i: itable = {}) {
  let
    ent = bond.target,
    allColumns = ent.fields.map((f: Field) => {
      let tp = fieldTypes[f.tp];
      return <TableColumn>{
        key: f.key,
        text: f.text,//ett$.w(ent, "f", f.key),
        align: tp.align,
        size: size(f),
        tp: tp.dt,
        fmt: tp.output?.bind(f),
        opts: f
      }
    });
  bond.fields.length || bond.fields.set(sub(fields(ent, (f: Field) => !f.side), "key"));
  return new Table<Dic>({
    sort: {
      clear: true,
      call({ key: f, desc: d }, active) { bond.sort.set(active && [{ f, d }]); }
    },
    single: i.single,
    p: i.p || defRenderer,
    corner: output(all(bond)),
    open: i.open || i.edit || ((value) => mdPut(ent, value?.id)),
    remove: (...value) => tryRemove(ent, sub(value, 'id')),
    menu: t(i.menu) && (() => ctxMenu(bond, { edit: i.edit })),
    options: i.options,
    resize: true,
    style: i.style || ent.style,
    allColumns,
    key:"id",
    columns: copy(bond.fields, v => byKey(allColumns, v))
  }, bond.bind());
}