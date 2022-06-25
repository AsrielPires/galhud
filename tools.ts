import { $ as ett$, Action, Bond, DataType, Entity, IWhere } from "entity";
import { div, g, S } from "galho";
import { $, body, C, Icon, icon, w } from "galhui";
import { RecordStyle } from "galhui/list";
import { menuitem, MenuItems } from "galhui/menu";
import { okCancel } from "galhui/hover";
import { distinct, isB, sub } from "inutil";
import { Expression, Val } from "jcalc";
import { addAll as selectAll, clear as selectNone, list as selected, onchange as onSelectChange } from "orray/selector";
import { mdPut } from "./form";

export type Info = {
  /**head */
  h?: str,
  /**body */
  b: str;
} | str;
export interface FieldDictionary {
  t?: str;
  j?: str;
  i?: str;
  o?: Dic<str>;
}
export interface EntityDictionary {
  docs?: Dic<str>;
  groups?: Dic[];
  f?: Dic<str | FieldDictionary>;
  /**singular */
  s?: str;
  /**plural */
  p?: str;
  /**generic singular or plural */
  g?: str;
  /**description */
  d?: Info;
  aggregs?: Dic<str>;
}0
declare global {
  namespace GalhoUI {
    interface Settings {
      sc?: { edit?: str[]; remove?: str[]; },
    }

    interface Words {
      addToGroup?: str;
      all?: str;
      edit?: str;
      remove?: str;
      saveData?: str;
      true?: str;
      false?: str;
      /**entities */
      e?: Dic<EntityDictionary>
      import?: str;
      export?: str;

      empty?: str;
      emptyInfo?: str;

      format?
    }
  }
  namespace entity {
    interface Settings {
      w?(entity: Entity, ...args: str[]): str;
      enum?: (key: string) => any[];
      enumView?: (enumKey: string, value: Key) => any;
    }
    interface Entity {
      style?: RecordStyle;

      i?: Icon;
      /**singular name*/
      s?: str;
      /**plural name */
      p?: str;
    }
  }
}

export function gl(word: str) {
  let t = w;
  for (let part of word.split('.'))
    if (!(t = word[part]))
      break;
  return t;
}

export const selectFile = (accept = '*') => new Promise<File>(rs => {
  let
    t: bool,
    div = g("div")
      .css({ position: "fixed", opacity: 0 })
      .addTo(body)
      .prop("tabIndex", 0)
      .focus()
      .on("blur", (e) => {
        if (t) {
          rs(i.e.files.item(0) || null);
          div.remove();
        } else t = true;
      }),
    i = g("input"/*, C.off*/)
      .props({ accept, type: "file" })
      .addTo(div)
      .on("input", () => div.blur())
      .click();
});


// export function entFormulaRender(bond: Bond, opts: FormulaRender) {
//   let fields: string[] = [];
//   for (let p of opts.parts)
//     if (isS(p) || (p = p.value))
//       fields.push(...parse(p).vars());
//       set(bond.fields,distinct(fields));
//   return formulaRender(opts);
// }
export function all(bond: Bond) {
  let
    list = bond.bind(),
    t = g<HTMLInputElement>('input', {
      type: 'checkbox'
    }).on('input', () => {
      if (t.prop('checked')) {
        selectAll(list, "on");
        t.props({
          checked: true,
          indeterminate: false
        });
        bond.all = true;
      }
      else selectNone(list, "on");
    });
  onSelectChange(list, "on", (active, selected) => {
    bond.all = false;
    t.props({
      checked: !!active,
      indeterminate: !!active && (bond.pags > 1 || (selected ? selected.length < list.length : list.length > 1))
    });
  });
  return t;
}

export interface Total extends IWhere {
  key: str;
  exp: Expression
  fields: str[];
  fmt: str;
  tp?: DataType
}
export const totals = (bond: Bond, totals: Total[]): any =>
  null;
// totals.bind(div(), key =>
//   wait(async () => {
//     let v = await bond.target.select(totals);
//     return output(t.key, isV(v) ? fmt(v, t.fmt, t.tp) : icon('minus', Color.error));
//   }));
export interface ictxMenu {
  edit?(item?: Dic);
}
export const enum ActionFilterType {
  any,
  all,
  /**action will be called for all records at once */
  join
}
export interface ActionFilter {
  exp: Val;
  tp: ActionFilterType;
}
export interface GenericAction extends Action {
  static: bool,
  icon?: Icon;
  text?: str;
  shortcut?: str;
  filter?: ActionFilter;
}
export const ids = (bond: Bond): Task<number[]> => bond.all ? bond.ids() : sub(selected(bond.list, "on"), ett$.id(bond.target));

export const tryRemove = async (ent: Entity, ids: Key[]) =>
  await okCancel('Sera removido ' + ids.length + ' registos, deseja continuar?') &&
  ent.delete(ids);
export function ctxMenu(bond: Bond, ctx: ictxMenu = {}): MenuItems {
  let
    ent = bond.target,
    items = selected(bond.list, "on"),
    // ids = focused.map(i => i.id).sort((a, b) => a - b),
    any = !!items.length,
    valid = (filter: ActionFilter | bool) => {
      if (isB(filter))
        return filter;
      if (!filter)
        return true;
      switch (filter.tp) {
        case ActionFilterType.all:
          return items.every(f => filter.exp.calc({ vars: f }));
        case ActionFilterType.any:
          return items.some(f => filter.exp.calc({ vars: f }));
        case ActionFilterType.join:
          return filter.exp.calc({ vars: { items } });
      }
    },
    edit = any && valid(ent.put),
    remove = any && valid(ent.delete);


  return [
    ent.actions && ent.actions.map((a: GenericAction) => (a.static || any) && menuitem(
      a.icon,
      a.text,
      async () => a.call(await ids(bond)),
      a.shortcut,
    ).cls("disabled", !valid(a.filter))),

    menuitem($.i.edit, w.edit, edit && (() => {
      let t = selected(bond.list, "on")[0];
      ctx.edit ? ctx.edit(t) : mdPut(ent, t.id);
    }), $.sc && $.sc.edit.join('+')
    ).cls(C.disabled, !edit),

    menuitem($.i.remove, w.remove,
      remove && (async () => tryRemove(ent, await ids(bond))),
      $.sc && $.sc.remove.join('+')
    ).cls(C.disabled, !remove),
  ];
  //ent.canCreateGroup && none && [
  //  { tp: MT.divisor },
  //  {
  //    icon: { c: Color.accept, dt: 'plus' },
  //    tp: MT.sub,
  //    text: w.addToGroup,
  //    hover: false,
  //    menu: div([C.menu], menuhelper([
  //      wait(async () => {
  //        let
  //          id = await bond.ids(),
  //          items = await ent.loadSelections({ ex: id });
  //        return <S[]>menuhelper(items.map(s => (<MenuItem>{
  //          icon: s.icon,
  //          text: s.text,
  //          tip: s.info,
  //          action() {
  //            ent.editSelectionRecords(s.id, id, '+');
  //          }
  //        })));
  //      }),
  //      { tp: MT.divisor },
  //      {
  //        icon: 'note',
  //        text: 'Criar sele��o',
  //        async action() {
  //          editSelection(ent, { dt: await bond.ids() });
  //        }
  //      }
  //    ]))
  //  },
  //  {
  //    icon: { c: Color.error, dt: 'minus' },
  //    tp: MT.sub,
  //    text: 'Remover da sele��o',
  //    hover: false,
  //    menu: div([C.menu], wait(async () => {
  //      let
  //        ids = await bond.ids(),
  //        items = await ent.loadSelections({ in: ids });
  //      return menuhelper(items.map(s => (<MenuItem>{
  //        icon: s.icon,
  //        text: s.text,
  //        tip: s.info,
  //        action() { ent.editSelectionRecords(s.id, ids, '-') }
  //      })));
  //    }))
  //  }
  //]
}


export type IEntityFormat = Dic<str>;
export interface EntityFormat extends Dic<Val> {
  strikeOut?: Val;
  gray?: Val;
  error?: Val;
  check?: Val;
  color?: Val;
}
// export const formatter: Dic<(v: Val, div: S) => void> = {
//   //strikeOut(v, div) {
//   //  if (format.strikeOut.calc(options))
//   //    div.css('textDecoration', 'line-through');
//   //},
//   //gray(v, div) {
//   //  let temp = <number | boolean>format.gray.calc(options);
//   //  if (typeof temp === 'boolean')
//   //    temp = temp ? 1 : 0;
//   //  if (temp) {
//   //    bg = mc(mc.GRAY).mix(bg, temp);
//   //    div.css('color', "" + bg.contrast('#ccc', '#333'));
//   //    apply = true;
//   //  }
//   //},
//   //error(v, div) {
//   //  let temp = <number | boolean>format.error.calc(options);
//   //  if (typeof temp === 'boolean')
//   //    temp = temp ? 1 : 0;
//   //  if (temp) {
//   //    bg = mc(mc.RED).lighten(0.7).mix(bg, temp);
//   //    div.css('color', "" + bg.contrast());
//   //    div.cls([Color.error]);
//   //    apply = true;
//   //  }
//   //},
//   //check(v, div) {
//   //  let temp = <number | boolean>format.check.calc(options);
//   //  if (typeof temp === 'boolean') temp = temp ? 1 : 0;
//   //  else if (temp > 1) temp = 1;
//   //  else if (temp < 0) temp = 0;

//   //  if (temp) {
//   //    bg = mc('#11ff88').mix(bg, 1 - temp);
//   //    div.css('color', "" + bg.contrast());
//   //    div.cls([Color.accept]);
//   //    apply = true;
//   //  }
//   //},
//   //color(v, div) {
//   //  let temp = <string>format.color.calc(options);
//   //  if (temp) {
//   //    fg = (bg = mc(temp)).contrast();
//   //    console.log(fg);
//   //    apply = true;
//   //  }
//   //},
// }
export function fmtFields(fmt: EntityFormat) {
  let f: str[] = [];
  // each(fmt, v => f.push(...v.vars()));
  return distinct(f);
}
export function empty() {
  return div(C.heading, [
    icon("empty"),
    w.empty,
    div(C.side, w.emptyInfo),

  ]);
}
// export function style(): css.Styles {
//   return {
//     [c(C.table)]: {
//     }
//   }
// }