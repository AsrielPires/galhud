import { $ as ett$, field, fields } from "entity";
import { div, g } from "galho";
import { $, dropdown, hc, icon } from "galhui";
import { cb as mnCb, hr as mnHr, i as mnItem, wait as mnWait } from "galhui/menu";
import { Select } from "galhui/select";
import { byKey, isS } from "inutil";
import orray, { bind, get, push, remove, set, setTag } from "orray";
import { Pagging } from "galhui/Pagging";
export function dateFilter(def, cb, ph = 'Filtrar/data') {
    if (isS(cb)) {
        let bond = def, field = cb;
        def = bond.getFilter(field);
        cb = (v) => bond.addFilter(field, v);
    }
    let items = [
        ['h0', 'Nesta hora'],
        ['h1', 'Hora passada'],
        ['06', 'De manha'],
        ['12', 'De tarde'],
        ['18', 'De noite'],
        ['d0', 'Hoje'],
        ['d1', 'Ontem'],
        ['w0', 'Esta semana'],
        ['w1', 'Semana passada'],
        ['f0', 'Esta quinzena'],
        ['f1', 'Quinzena passada'],
        ['m0', 'Este Mês'],
        ['m1', 'M�s passado'],
        ['t0', 'Este Trimestre'],
        ['t1', 'Trimestre passado'],
        ['s0', 'Este Simestre'],
        ['s1', 'Simestre passado'],
        ['y0', 'Este ano'],
        ['y1', 'Ano passado']
    ], input = new Select({
        fluid: true,
        value: typeof def == 'string' ? def : null,
        menu: (p) => mnItem(null, p[1]),
        label(key, label) {
            label.cls("ph", false).set([
                byKey(items, key)[1],
                close((e) => {
                    input.setValue(null);
                    e.stopPropagation();
                })
            ]);
        },
        empty(label) { label.cls("ph").set(ph); }
    }, items).on('input', (value) => {
        if (value)
            cb(`date_range(cd,'${value}')`, value);
        else
            cb(null);
    });
    if (def)
        input.set('value', input.i.value);
    return input;
}
export const search = (bond) => div(hc("in"), [
    g('input', {
        type: 'search',
        value: bond.query || '',
        placeholder: "Pesquisa...",
    }).on('input', function () { bond.query = this.value; }),
    ibutton($.i.search, null, () => bond.selectNow())
]);
export const searchBy = (bond) => {
    let list = orray(fields(bond.target, (f) => f.query));
    let mn = g("table", 0, [
        mnCb(null, $.w.all, (v) => {
        }),
        mnHr()
    ]);
    return dropdown(icon("dd"), bind(list, mn, (by, i, c) => {
        c.place(i + 2, mnCb(bond.queryBy.indexOf(by.key) >= 0, by.text, (ch) => {
            if (ch)
                push(bond.queryBy, by.key);
            else
                remove(bond.queryBy, by.key);
            bond.select();
        }));
    }));
};
export const selection = (bond) => dropdown(icon('select-group'), () => mnWait(async () => {
    let items = null;
    return items.map(s => {
        let y = icon('tag-plus', "_a"), n = icon('tag-minus', "_e"), _ = icon('tag'), t = g("span");
        return mnItem(s.icon, s.text, () => {
            let t2 = bond.tags.find(i => i.id == s.id);
            if (t2 && t2.signal == '+') {
                remove(bond.tags, t2);
                push(bond.tags, { signal: '-', id: s.id });
                t.set(n);
            }
            else if (t2) {
                remove(bond.tags, t2);
                t.set(_);
            }
            else {
                push(bond.tags, { signal: '+', id: s.id });
                t.set(y);
            }
        }, t);
    });
}));
export function pagging(bond, setlimit, viewtotal, extreme) {
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
                bond.selectNow();
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
export function singleSort(bond, placeholder = g('span', "ph", [icon('sort'), 'Ordenar por'])) {
    let t = new Select({
        labelRender: (v, s) => {
            let t0 = field(bond.target, v);
            return s.set([t0 && t0.text, close(() => t.setValue(null))]);
        },
        setMenu(key) {
            if (get(t.options, key))
                setTag(t.options, "o", key);
        },
        value: bond.sort.length ? bond.sort[0].f : null,
        menuRender: (f) => mnItem(null, ett$.w(bond.target, f.key)),
        fluid: true,
        empty: s => s.set(placeholder)
    }, fields(bond.target, (f) => f.sort)).on('input', (v) => set(bond.sort, [v]));
    return t;
}
//# sourceMappingURL=filter.js.map