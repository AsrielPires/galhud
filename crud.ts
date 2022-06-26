import { $ as ett$, Bond, createBond, entity, Field, fields, fieldTypes } from "entity";
import { Rec } from "entity/core";
import { div, g, One, S } from "galho";
import { RecordStyle } from "galhui/list";
import { defRenderer, FieldPlatform, list as rawList } from "galhui/list";
import { input, output } from "galhui/io";
import Table, { TableColumn, TableOption } from "galhui/table";
import { byKey, isF, sub, t } from "inutil";
import { copy, set } from "orray";
import { card } from "./card";
import { size } from "./fields";
import { mdPost, mdPut } from "./form";
import { all, ctxMenu, tryRemove } from "./tools";
import { ibutton, $, C } from "galhui";

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
  item?: (value: Rec) => any;
  head?: S<HTMLTableSectionElement>;
  foot?: S<HTMLTableSectionElement>;
  // options?: ((item: Rec, index: number) => One)[];
}
export function list(bond: Bond, i: ilist | ((value: Rec) => any) = {}) {
  isF(i) && (i = { item: i });
  return rawList<Rec>({
    single: i.single,
    open: i.open || i.edit || ((value) => mdPut(bond.target, value?.id)),
    remove: (...value) => tryRemove(bond.target, sub(value, "id")),
    menu: () => ctxMenu(bond, { edit: (i as ilist).edit }),
    head: i.head,
    foot: i.foot,
    // options: i.options,
    item: i.item || card(bond)
  }, bond.bind());
}


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
    key: "id",
    columns: copy(bond.fields, v => byKey(allColumns, v))
  }, bond.bind());
}

export async function single(key: str) {
  let ent = await entity(key);
  return [
    list(new Bond(ent, ["name", "info"]), {
      item: v => [
        g("td", "bd", [v.name, v.info && (`(${v.info})`)]),
        g("td", 0, ibutton($.i.edit, null, () => mdPut(ent, v.id)).cls(C.extra))
      ],
      foot: g("tr", 0, [
        g("td"),
        g("td", 0, input("text", "name", "Designação")),
        g("td", 0, ibutton($.i.plus, null, () => mdPost(ent))),
      ]),
    })
  ];
}