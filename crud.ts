import { $ as ett$, Bond, createBond, entity, field, Field, FieldActionType, fields, fieldTypes, initFields } from "entity";
import { Rec } from "entity/core";
import { div, g, One, S } from "galho";
import { RecordStyle } from "galhui/list";
import { defRenderer, FieldPlatform, list as rawList } from "galhui/list";
import { output } from "galhui/io";
import Table, { Column, Option } from "galhui/table";
import { byKey, isF, isS, l, sub, t } from "inutil";
import { copy } from "orray";
import { card } from "./card";
import { size, input } from "./fields";
import { mdPost, mdPut } from "./form";
import { all, ctxMenu, tryRemove } from "./tools";
import { ibutton, $, C } from "galhui";
import { wait } from "galhui/wait";
import { fromArray } from "dic";
import { is } from "galho/s";

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
  fill?: bool;
}
export async function table(bond: Bond | str, i: itable = {}) {
  isS(bond) && (bond = await createBond(bond));
  let
    ent = bond.target,
    req = [ent.main],
    f = fields(ent, f => f.get),
    allColumns = f.map((f: Field): Column => {
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
  l(bond.fields) || bond.fields.set(sub(fields(ent, (f: Field) => !f.side), "key"));
  if (i.iform) {
    req.push(...sub(f.filter(v => v.req), "key"));
    for (let field of req)
      bond.fields.includes(field) || bond.fields.push(field);
  }

  await initFields(f, FieldActionType.get);
  return new Table<Dic>({
    sort: {
      clear: true,
      call({ key: f, desc: d }, active) { (bond as Bond).sort.set(active && [{ f, d }]); }
    },
    fill: i.fill,
    single: i.single,
    p: i.p || defRenderer,
    corner: output(all(bond)),
    style: i.style || ent.style,
    options: i.options, resize: true,
    allColumns, reqColumns: req, key: "id",
    columns: copy(bond.fields, v => byKey(allColumns, v)),
    remove: (...value) => tryRemove(ent, sub(value, 'id')),
    menu: t(i.menu) && (() => ctxMenu(bond as Bond, { edit: i.edit })),
    open: i.open || i.edit || ((value) => mdPut(ent, value?.id)),
    foot: i.iform && [cols => g("form", 0, [div(C.side, "+"), cols.map(c => input(field(ent, c.key)))])],
  }, bond.bind());
}
// export const itable = async (ent: str, ...fields: str[]) => table(await createBond(ent, fields), { iform: true, fill: true });
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