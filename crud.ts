import { $ as ett$, Bond, createBond, entity, Field, fields, fieldTypes } from "entity";
import { Rec } from "entity/core";
import { div, g, One, S } from "galho";
import { RecordStyle } from "galhui/list";
import { defRenderer, FieldPlatform, list as rawList } from "galhui/list";
import { input, output } from "galhui/io";
import Table, { Column, Option } from "galhui/table";
import { byKey, isF, l, sub, t } from "inutil";
import { copy } from "orray";
import { card } from "./card";
import { size } from "./fields";
import { mdPost, mdPut } from "./form";
import { all, ctxMenu, tryRemove } from "./tools";
import { ibutton, $, C } from "galhui";
import { wait } from "galhui/wait";

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
  // options?: ((item: Rec, index: number) => One)[];
}
export function list(bond: Bond, i: ilist | ((value: Rec) => any) = {}) {
  isF(i) && (i = { item: i });
  return rawList<Rec>({
    single: i.single,
    open: i.open || i.edit || ((value) => mdPut(bond.target, value?.id)),
    remove: (...value) => tryRemove(bond.target, sub(value, "id")),
    menu: () => ctxMenu(bond, { edit: (i as ilist).edit }),
    // options: i.options,
    item: i.item || card(bond)
  }, bond.bind());
}


export interface itable extends IEttCrud {
  iform?: bool;
  options?: Option<Dic>[];
  p?: FieldPlatform;
  style?: RecordStyle;
}
export function table(bond: Bond, i: itable = {}) {
  let
    ent = bond.target,
    req = [ent.main],
    allColumns = ent.fields.map((f: Field): Column => {
      let tp = fieldTypes[f.tp];
      return {
        opts: f,
        tp: tp.dt,
        key: f.key,
        text: f.text,
        size: size(f),
        align: tp.align,
        fmt: tp.output?.bind(f),
      }
    });
  if (i.iform) {
    req.push(...sub(ent.fields.filter(v => v.req), "key"));
    for (let field of req)
      bond.fields.includes(field) || bond.fields.push(field);
  }
  l(bond.fields) || bond.fields.set(sub(fields(ent, (f: Field) => !f.side), "key"));
  return new Table<Dic>({
    sort: {
      clear: true,
      call({ key: f, desc: d }, active) { bond.sort.set(active && [{ f, d }]); }
    },
    single: i.single,
    p: i.p || defRenderer,
    corner: output(all(bond)),
    style: i.style || ent.style,
    options: i.options, resize: true,
    allColumns, reqColumns: req, key: "id",
    columns: copy(bond.fields, v => byKey(allColumns, v)),
    remove: (...value) => tryRemove(ent, sub(value, 'id')),
    menu: t(i.menu) && (() => ctxMenu(bond, { edit: i.edit })),
    open: i.open || i.edit || ((value) => mdPut(ent, value?.id)),
  }, bond.bind(), [fromArray(allColumns, v => [v.key, v.input()])]);
}

// export async function single(key: str) {
//   let ent = await entity(key);
//   return [
//     list(new Bond(ent, ["name", "info"]), {
//       item: v => [
//         g("td", "bd", [v.name, v.info && (`(${v.info})`)]),
//         g("td", 0, ibutton($.i.edit, null, () => mdPut(ent, v.id)).cls(C.extra))
//       ],
//       foot: g("tr", 0, [
//         g("td"),
//         g("td", 0, input("text", "name", "Designação")),
//         g("td", 0, ibutton($.i.plus, null, () => mdPost(ent))),
//       ]),
//     })
//   ];
// }