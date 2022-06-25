import { Bond, Field, fields, FieldType, ftype } from "entity";
import { div, E, g, wrap } from "galho";
import { $, C, Color, hc, ibutton, icon, w } from "galhui";
import { menucb, menusep, menuitem, menu, wait as mnWait } from "galhui/menu";
import { label,Pagging } from "galhui/io";
import { call, l } from "inutil";
import { remove } from "orray";
import { dropdown } from "galhui/dropdown";

interface IDateFilter {

}
export class DateFilter extends E<IDateFilter>{
  view() {
    return div();
  }
}
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


export const search = (bond: Bond) => div(hc(C.input), [
  g('input', {
    type: 'search',
    value: bond.query || '',
    placeholder: "Pesquisa...",
  }).on('input', function () { bond.query = this.value; }),
  ibutton($.i.search, null, () => bond.select())
]);
export const searchBy = ({ queryBy: q, target: ent }: Bond) => {
  let list = fields(ent, (f: Field) => f.query);
  if (!list.length) return null;
  // let all: S<HTMLInputElement> = g("input", { type: "checkbox" }).on("input", () => );
  let mn = menu([
    menucb(l(list) == l(q) ? true : !l(q) ? false : null, w.all, v => q.set(v && list.map(f => f.key)), "all"),
    menusep(),
    list.map(f => menucb(q.includes(f.key), f.text,
      ch => ch ? q.push(f.key) : remove(q, f.key), f.key))
  ]);
  q.on(() => {
    mn.query("#all").props({ checked: l(list) == l(q), indeterminate: l(q) && l(list) != l(q) });
    for (let f of mn.queryAll<HTMLInputElement>("input:not(#all)"))
      f.checked = q.includes(f.id);
  });
  return dropdown(icon($.i.dd), mn);
};
export const selection = (bond: Bond) => dropdown(icon('select-group'), () => mnWait(async () => {
  let items = null;//await bond.target.groups({});
  return items.map(s => {
    let
      y = icon({ d: 'tag-plus', c: Color.accept }),
      n = icon({ d: 'tag-minus', c: Color.error }),
      _ = icon('tag'),
      t = g("span");

    return menuitem(s.icon, s.text, () => {
      let t2 = bond.tags.find(i => i.id == s.id);
      if (t2 && t2.signal == '+') {
        remove(bond.tags, t2);
        bond.tags.push({ signal: '-', id: s.id });
        t.set(n);

      } else if (t2) {
        remove(bond.tags, t2);
        t.set(_);
      } else {
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
  })
}));
export function pagging(bond: Bond, setlimit?: bool, viewtotal?: bool, extreme?: bool) {
  let p = new Pagging({
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
    })
  });
  return p;
}
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
const filters = (bond: Bond) => div([C.menu], fields(bond.target).map((field: Field) =>
  call((<FieldType>ftype(field)).filter(field), filter => filter && div(0, [
    label(field.text).css('width', '40%'),
    wrap(filter).css('width', "60%")
  ]))));
