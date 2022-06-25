"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = exports.fmtFields = exports.ctxMenu = exports.tryRemove = exports.ids = exports.totals = exports.all = exports.selectFile = exports.gl = void 0;
const entity_1 = require("entity");
const galho_1 = require("galho");
const galhui_1 = require("galhui");
const menu_1 = require("galhui/menu");
const hover_1 = require("galhui/hover");
const inutil_1 = require("inutil");
const selector_1 = require("orray/selector");
const form_1 = require("./form");
0;
function gl(word) {
    let t = galhui_1.w;
    for (let part of word.split('.'))
        if (!(t = word[part]))
            break;
    return t;
}
exports.gl = gl;
const selectFile = (accept = '*') => new Promise(rs => {
    let t, div = (0, galho_1.g)("div")
        .css({ position: "fixed", opacity: 0 })
        .addTo(galhui_1.body)
        .prop("tabIndex", 0)
        .focus()
        .on("blur", (e) => {
        if (t) {
            rs(i.e.files.item(0) || null);
            div.remove();
        }
        else
            t = true;
    }), i = (0, galho_1.g)("input" /*, C.off*/)
        .props({ accept, type: "file" })
        .addTo(div)
        .on("input", () => div.blur())
        .click();
});
exports.selectFile = selectFile;
// export function entFormulaRender(bond: Bond, opts: FormulaRender) {
//   let fields: string[] = [];
//   for (let p of opts.parts)
//     if (isS(p) || (p = p.value))
//       fields.push(...parse(p).vars());
//       set(bond.fields,distinct(fields));
//   return formulaRender(opts);
// }
function all(bond) {
    let list = bond.bind(), t = (0, galho_1.g)('input', {
        type: 'checkbox'
    }).on('input', () => {
        if (t.prop('checked')) {
            (0, selector_1.addAll)(list, "on");
            t.props({
                checked: true,
                indeterminate: false
            });
            bond.all = true;
        }
        else
            (0, selector_1.clear)(list, "on");
    });
    (0, selector_1.onchange)(list, "on", (active, selected) => {
        bond.all = false;
        t.props({
            checked: !!active,
            indeterminate: !!active && (bond.pags > 1 || (selected ? selected.length < list.length : list.length > 1))
        });
    });
    return t;
}
exports.all = all;
const totals = (bond, totals) => null;
exports.totals = totals;
const ids = (bond) => bond.all ? bond.ids() : (0, inutil_1.sub)((0, selector_1.list)(bond.list, "on"), entity_1.$.id(bond.target));
exports.ids = ids;
const tryRemove = async (ent, ids) => await (0, hover_1.okCancel)('Sera removido ' + ids.length + ' registos, deseja continuar?') &&
    ent.delete(ids);
exports.tryRemove = tryRemove;
function ctxMenu(bond, ctx = {}) {
    let ent = bond.target, items = (0, selector_1.list)(bond.list, "on"), 
    // ids = focused.map(i => i.id).sort((a, b) => a - b),
    any = !!items.length, valid = (filter) => {
        if ((0, inutil_1.isB)(filter))
            return filter;
        if (!filter)
            return true;
        switch (filter.tp) {
            case 1 /* all */:
                return items.every(f => filter.exp.calc({ vars: f }));
            case 0 /* any */:
                return items.some(f => filter.exp.calc({ vars: f }));
            case 2 /* join */:
                return filter.exp.calc({ vars: { items } });
        }
    }, edit = any && valid(ent.put), remove = any && valid(ent.delete);
    return [
        ent.actions && ent.actions.map((a) => (a.static || any) && (0, menu_1.menuitem)(a.icon, a.text, async () => a.call(await (0, exports.ids)(bond)), a.shortcut).cls("disabled", !valid(a.filter))),
        (0, menu_1.menuitem)(galhui_1.$.i.edit, galhui_1.w.edit, edit && (() => {
            let t = (0, selector_1.list)(bond.list, "on")[0];
            ctx.edit ? ctx.edit(t) : (0, form_1.mdPut)(ent, t.id);
        }), galhui_1.$.sc && galhui_1.$.sc.edit.join('+')).cls("ds" /* disabled */, !edit),
        (0, menu_1.menuitem)(galhui_1.$.i.remove, galhui_1.w.remove, remove && (async () => (0, exports.tryRemove)(ent, await (0, exports.ids)(bond))), galhui_1.$.sc && galhui_1.$.sc.remove.join('+')).cls("ds" /* disabled */, !remove),
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
exports.ctxMenu = ctxMenu;
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
function fmtFields(fmt) {
    let f = [];
    // each(fmt, v => f.push(...v.vars()));
    return (0, inutil_1.distinct)(f);
}
exports.fmtFields = fmtFields;
function empty() {
    return (0, galho_1.div)("heading" /* heading */, [
        (0, galhui_1.icon)("empty"),
        galhui_1.w.empty,
        (0, galho_1.div)("sd" /* side */, galhui_1.w.emptyInfo),
    ]);
}
exports.empty = empty;
// export function style(): css.Styles {
//   return {
//     [c(C.table)]: {
//     }
//   }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBMkU7QUFDM0UsaUNBQWtDO0FBQ2xDLG1DQUFtRDtBQUVuRCxzQ0FBa0Q7QUFDbEQsd0NBQXdDO0FBQ3hDLG1DQUE0QztBQUU1Qyw2Q0FBd0g7QUFDeEgsaUNBQStCO0FBMkI5QixDQUFDLENBQUE7QUE0Q0YsU0FBZ0IsRUFBRSxDQUFDLElBQVM7SUFDMUIsSUFBSSxDQUFDLEdBQUcsVUFBQyxDQUFDO0lBQ1YsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUM5QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25CLE1BQU07SUFDVixPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFORCxnQkFNQztBQUVNLE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQU8sRUFBRSxDQUFDLEVBQUU7SUFDakUsSUFDRSxDQUFPLEVBQ1AsR0FBRyxHQUFHLElBQUEsU0FBQyxFQUFDLEtBQUssQ0FBQztTQUNYLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ3RDLEtBQUssQ0FBQyxhQUFJLENBQUM7U0FDWCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUNuQixLQUFLLEVBQUU7U0FDUCxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDaEIsSUFBSSxDQUFDLEVBQUU7WUFDTCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FB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