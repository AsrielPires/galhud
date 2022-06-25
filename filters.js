"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagging = exports.selection = exports.searchBy = exports.search = exports.DateFilter = void 0;
const entity_1 = require("entity");
const galho_1 = require("galho");
const galhui_1 = require("galhui");
const menu_1 = require("galhui/menu");
const io_1 = require("galhui/io");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const dropdown_1 = require("galhui/dropdown");
class DateFilter extends galho_1.E {
    view() {
        return (0, galho_1.div)();
    }
}
exports.DateFilter = DateFilter;
// export function dateFilter(def: string, cb: (expression: string, value?: string | [from: string, to: string]) => void, placeholder?: any): Select<[str, str], str>
// export function dateFilter(bond: Bond, field: str, placeholder?: any): Select<[str, str], str>
// export function dateFilter(def: string | Bond, cb: str | ((expression: string, value?: string | [from: string, to: string]) => void), ph: any = 'Filtrar/data') {
//   if (isS(cb)) {
//     let bond = (<Bond>def), field = cb;
//     def = <str>bond.getFilter(field);
//     cb = (v) => bond.addFilter(field, v);
//   }
//   let
//     items: Array<[str, str]> = [
//       ['h0', 'Nesta hora'],
//       ['h1', 'Hora passada'],
//       ['06', 'De manha'],
//       ['12', 'De tarde'],
//       ['18', 'De noite'],
//       ['d0', 'Hoje'],
//       ['d1', 'Ontem'],
//       ['w0', 'Esta semana'],
//       ['w1', 'Semana passada'],
//       ['f0', 'Esta quinzena'],
//       ['f1', 'Quinzena passada'],
//       ['m0', 'Este Mês'],
//       ['m1', 'M�s passado'],
//       ['t0', 'Este Trimestre'],
//       ['t1', 'Trimestre passado'],
//       ['s0', 'Este Simestre'],
//       ['s1', 'Simestre passado'],
//       ['y0', 'Este ano'],
//       ['y1', 'Ano passado']
//     ],
//     input = new Select({
//       fluid: true,
//       value: typeof def == 'string' ? def : null,
//       /*      menu: div([C.menu]),*/
//       menu: (p) => mnItem(null, p[1]),
//       label(key, label) {
//         label.cls(C.placeholder, false).set([
//           byKey(items, key)[1],
//           close((e) => {
//             input.setValue(null);
//             e.stopPropagation();
//           })
//         ]);
//       },
//       empty(label) { label.cls(C.placeholder).set(ph) }
//     }, items).on('input', (value) => {
//       if (value)
//         (<Function>cb)(`date_range(cd,'${value}')`, <string>value);
//       else (<Function>cb)(null);
//     });
//   if (def)
//     input.set('value', input.i.value);
//   return input;
// }
const search = (bond) => (0, galho_1.div)((0, galhui_1.hc)("in" /* input */), [
    (0, galho_1.g)('input', {
        type: 'search',
        value: bond.query || '',
        placeholder: "Pesquisa...",
    }).on('input', function () { bond.query = this.value; }),
    (0, galhui_1.ibutton)(galhui_1.$.i.search, null, () => bond.select())
]);
exports.search = search;
const searchBy = ({ queryBy: q, target: ent }) => {
    let list = (0, entity_1.fields)(ent, (f) => f.query);
    if (!list.length)
        return null;
    // let all: S<HTMLInputElement> = g("input", { type: "checkbox" }).on("input", () => );
    let mn = (0, menu_1.menu)([
        (0, menu_1.menucb)((0, inutil_1.l)(list) == (0, inutil_1.l)(q) ? true : !(0, inutil_1.l)(q) ? false : null, galhui_1.w.all, v => q.set(v && list.map(f => f.key)), "all"),
        (0, menu_1.menusep)(),
        list.map(f => (0, menu_1.menucb)(q.includes(f.key), f.text, ch => ch ? q.push(f.key) : (0, orray_1.remove)(q, f.key), f.key))
    ]);
    q.on(() => {
        mn.query("#all").props({ checked: (0, inutil_1.l)(list) == (0, inutil_1.l)(q), indeterminate: (0, inutil_1.l)(q) && (0, inutil_1.l)(list) != (0, inutil_1.l)(q) });
        for (let f of mn.queryAll("input:not(#all)"))
            f.checked = q.includes(f.id);
    });
    return (0, dropdown_1.dropdown)((0, galhui_1.icon)(galhui_1.$.i.dd), mn);
};
exports.searchBy = searchBy;
const selection = (bond) => (0, dropdown_1.dropdown)((0, galhui_1.icon)('select-group'), () => (0, menu_1.wait)(async () => {
    let items = null; //await bond.target.groups({});
    return items.map(s => {
        let y = (0, galhui_1.icon)({ d: 'tag-plus', c: "_a" /* accept */ }), n = (0, galhui_1.icon)({ d: 'tag-minus', c: "_e" /* error */ }), _ = (0, galhui_1.icon)('tag'), t = (0, galho_1.g)("span");
        return (0, menu_1.menuitem)(s.icon, s.text, () => {
            let t2 = bond.tags.find(i => i.id == s.id);
            if (t2 && t2.signal == '+') {
                (0, orray_1.remove)(bond.tags, t2);
                bond.tags.push({ signal: '-', id: s.id });
                t.set(n);
            }
            else if (t2) {
                (0, orray_1.remove)(bond.tags, t2);
                t.set(_);
            }
            else {
                bond.tags.push({ signal: '+', id: s.id });
                t.set(y);
            }
        }, t);
        //<MenuItem>{
        //  tp: MT.menu,
        //  child: [
        //    {
        //      tp: MT.header,
        //      icon: ,
        //      //inf: s.info,
        //      text: s.text,
        //    },
        //    t
        //  ]
        //}
    });
}));
exports.selection = selection;
function pagging(bond, setlimit, viewtotal, extreme) {
    let p = new io_1.Pagging({
        pag: bond.pag,
        minLimit: bond.limit,
        limit: bond.limit,
        extreme,
        setlimit,
        viewtotal
    }).on((e) => {
        if ('pag' in e) {
            bond.pag = e.pag;
            if (!('limit' in e))
                bond.select();
        }
        if ('limit' in e)
            bond.limit = e.limit;
    });
    bond.on(({ t }) => {
        p.set({
            total: t,
            limit: bond.limit,
            pag: bond.pag
        });
    });
    return p;
}
exports.pagging = pagging;
// /** sort by*/
// export function singleSort(bond: Bond, placeholder: any = g('span', C.placeholder, [icon('sort'), 'Ordenar por'])) {
//   let t: Select<Field, string> = new Select<Field, string>({
//     label: (v, s) => {
//       let t0 = <Field>field(bond.target, v);
//       return s.set([t0 && t0.text, close(() => t.setValue(null))]);
//     },
//     setMenu(key) {
//       if (get(t.options, key))
//         setTag(t.options, C.on, key);
//     },
//     value: bond.sort.length ? bond.sort[0].f : null,
//     menu: (f: Field) => mnItem(null, ett$.w(bond.target, f.key)),
//     fluid: true,
//     empty: s => s.set(placeholder)
//   }, fields(bond.target, (f: Field) => f.sort)).on('input', (v) => bond.sort.set([v]));
//   return t;
// }
// async function rangeFilter(field: Field, bond: Bond) {
//   let
//     reload = () => bond.addFilter(field.key, `${field.key}${op.value}${input.value}`),
//     op = new Select<{ key: str }, string>({
//       //cls: C.itemC,
//       menu: v => div([C.item], v.key)
//     }, [
//       { key: '=' },
//       { key: '>' },
//       { key: '<' },
//       { key: '>=' },
//       { key: '<=' },
//       { key: '<>' },
//     ]).on('input', reload),
//     input = fieldTypes[field.tp].input(field).on((e) => {
//       if ('value' in e)
//         reload();
//     });
//   return output(g(op).css('minWidth', 'unset'), input);
// }
// function searchFilter(field: Field, bond: Bond) {
//   let key = field.key, list = orray();
//   return openSelect(async function (value) {
//     if (value) {
//       list.set(await select(bond.target, {
//       }));
//       bond.addFilter(key, key + '=' + value);
//       this.set('open', true);
//     } else {
//       set(list);
//       bond.removeFilter(key);
//       this.set('open', false);
//     }
//   }, list, { key: key, menu: (item) => item[key] });
// }
const filters = (bond) => (0, galho_1.div)(["menu" /* menu */], (0, entity_1.fields)(bond.target).map((field) => (0, inutil_1.call)((0, entity_1.ftype)(field).filter(field), filter => filter && (0, galho_1.div)(0, [
    (0, io_1.label)(field.text).css('width', '40%'),
    (0, galho_1.wrap)(filter).css('width', "60%")
]))));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQStEO0FBQy9ELGlDQUF3QztBQUN4QyxtQ0FBMkQ7QUFDM0Qsc0NBQThFO0FBQzlFLGtDQUEwQztBQUMxQyxtQ0FBaUM7QUFDakMsaUNBQStCO0FBQy9CLDhDQUEyQztBQUszQyxNQUFhLFVBQVcsU0FBUSxTQUFjO0lBQzVDLElBQUk7UUFDRixPQUFPLElBQUEsV0FBRyxHQUFFLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUFKRCxnQ0FJQztBQUNELHFLQUFxSztBQUNySyxpR0FBaUc7QUFDakcsb0tBQW9LO0FBQ3BLLG1CQUFtQjtBQUNuQiwwQ0FBMEM7QUFDMUMsd0NBQXdDO0FBQ3hDLDRDQUE0QztBQUM1QyxNQUFNO0FBQ04sUUFBUTtBQUNSLG1DQUFtQztBQUNuQyw4QkFBOEI7QUFDOUIsZ0NBQWdDO0FBRWhDLDRCQUE0QjtBQUM1Qiw0QkFBNEI7QUFDNUIsNEJBQTRCO0FBRTVCLHdCQUF3QjtBQUN4Qix5QkFBeUI7QUFFekIsK0JBQStCO0FBQy9CLGtDQUFrQztBQUVsQyxpQ0FBaUM7QUFDakMsb0NBQW9DO0FBRXBDLDRCQUE0QjtBQUM1QiwrQkFBK0I7QUFFL0Isa0NBQWtDO0FBQ2xDLHFDQUFxQztBQUVyQyxpQ0FBaUM7QUFDakMsb0NBQW9DO0FBRXBDLDRCQUE0QjtBQUM1Qiw4QkFBOEI7QUFDOUIsU0FBUztBQUNULDJCQUEyQjtBQUMzQixxQkFBcUI7QUFDckIsb0RBQW9EO0FBQ3BELHVDQUF1QztBQUN2Qyx5Q0FBeUM7QUFDekMsNEJBQTRCO0FBQzVCLGdEQUFnRDtBQUNoRCxrQ0FBa0M7QUFDbEMsMkJBQTJCO0FBQzNCLG9DQUFvQztBQUNwQyxtQ0FBbUM7QUFDbkMsZUFBZTtBQUNmLGNBQWM7QUFDZCxXQUFXO0FBQ1gsMERBQTBEO0FBQzFELHlDQUF5QztBQUN6QyxtQkFBbUI7QUFDbkIsc0VBQXNF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