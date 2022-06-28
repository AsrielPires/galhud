"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInputs = void 0;
const entity_1 = require("entity");
const form_1 = require("form");
const galho_1 = require("galho");
const s_1 = require("galho/s");
const list_1 = require("galhui/list");
const menu_1 = require("galhui/menu");
const io_1 = require("galhui/io");
const dropdown_1 = require("galhui/dropdown");
const wait_1 = require("galhui/wait");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const fields_1 = require("./fields");
const filters_1 = require("./filters");
// interface BSelectOpts {
//   ph?: string;
// }
function setMenu(src, options) {
    let link = new entity_1.Bond((0, entity_1.entity)(src)), e = link.target, main = (0, entity_1.field)(e, f => !e.main || f.key == e.main), items = (0, galho_1.div)(0, (0, orray_1.bind)(options, (0, galho_1.g)("table"), {
        insert: v => (0, menu_1.menuitem)(0, (0, fields_1.output)(main, (0, inutil_1.ex)(ctx, { v: v[main.key] }))),
        tag(s, active, tag) {
            s.cls(tag, active);
            active && (0, s_1.vScroll)(items, s.prop('offsetTop') - items.prop('clientHeight') / 2 + s.prop('clientHeight') / 2);
        }
    })).css('flex', '1 1'), ctx = { p: list_1.defRenderer }, pag = new io_1.Pagging({ pag: link.pag, hideOnSingle: true }).on(() => {
        link.pag = pag.i.pag;
        link.limit = pag.i.limit;
    });
    options.onupdate(function () {
        pag.set({
            total: link.length,
            limit: link.limit,
            pag: link.pag
        });
    });
    return (0, galho_1.div)("_ menu", [
        (0, menu_1.menubar)((0, filters_1.search)(link)).on('click', galho_1.clearEvent),
        // sep(),
        items,
        //ent.canInsert && {
        //  icon: 'plus',
        //  text: 'Adicionar',
        //  action() {
        //    mdPost(ent);
        //    //route.goTo('f/' + ent.key)
        //    //  .then((result: entity.EntityAddResult[]) => {
        //    //    select.setValue.apply(select, result.map(i => i.id));
        //    //  });
        //  }
        //},
        (0, galho_1.g)(pag).on('click', galho_1.clearEvent)
    ]) /*.css({ display: 'flex', flexDirection: 'column' }) */;
}
class SelectInput extends form_1.Input /* implements BindedInput*/ {
    view() {
        let i = this.i, label = (0, galho_1.g)("span"), options = (0, orray_1.orray)(), menu = setMenu(i.src, options), root = (0, dropdown_1.setRoot)(this, label, menu).on("keydown", e => (0, dropdown_1.keydown)(this, e, options, (v) => this.value = v));
        this.on(e => ("value" in e) && (0, dropdown_1.setValue)(this, { root, options, label, menu }));
        return root;
    }
    applyoff() {
    }
    get disabled() { return this.i.off; }
    set disabled(state) { this.set('off', state); }
}
// export function linkedSelect(bond: Bond, { ph }: BSelectOpts = {}/*, callback?: () => void*/) {
//   let
//     mn = div(),
//     items = g("table"),
//     clearBt = close(e => {
//       clearEvent(e);
//       input.setValue(null);
//     }),
//     input = new Select<Rec, number>({
//       key: 'id',
//       menuE: mn, items,
//       menu: (value) => render(value).cls([C.item]),
//       label: async (key: number, label: S) => {
//         let
//           item = get(input.options, key);
//         if (item) {
//           label.set([
//             icon(<Icon>item[ent.icon]),
//             <Primitive>item[ent.main],
//             clearBt
//           ]);
//           setTag(input.options, C.on, key);
//         } else {
//           label.set(wait());
//           let item = <any>await select(ent, {
//             tp: "row",
//             fields: bond.fields,
//             where: [`id=${key}`],
//             query: bond.query,
//             queryBy: bond.queryBy
//           });
//           if (!item)
//             throw "invalid select item";
//           //checa denovo para garanter que durante a busca deste dado ele foi por outro lado
//           if (!get(input.options, key))
//             input.options.push(item);
//           setTag(input.options, C.on, key);
//           label.set([
//             icon(<Icon>item[ent.icon]),
//             <Primitive>item[ent.main],
//             clearBt
//           ]);
//         }
//       },
//       fluid: true,
//       cls: "in",
//       empty: (label) => label.set(div([C.placeholder], ph))
//     }),
//     render = card(bond);
//   menu(input, mn, bond);
//   bond.bind(<L<Rec, any>>input.options);
//   bond.select();
//   return input;
// }
// const multSelectTag = <K extends Key>(dt, value: K, input: Multselect<any, K>) =>
//   label([dt, close((e) => {
//     e.stopPropagation();
//     input.removeValue(value);
//   })]);
// export function linkedMSelect(bond: Bond, opts: BSelectOpts, callback?: () => void) {
//   let
//     mn = g('div'),
//     items = g("table"),
//     input = new Multselect<Rec, number>({
//       key: 'id',
//       menuE: mn, items,
//       setMenu() { },
//       fluid: true,
//       cls: "in",
//       empty: (v, label) => { label.set(v && div([C.placeholder], opts.ph)) }
//     }),
//     ent = bond.target, render = card(bond);
//   menu(input, mn, bond);
//   input.set({
//     menu: (value) => render(value).cls([C.item]),
//     label: (key: number, index: number, label: S) => {
//       var item = get(input.options, key);
//       if (item) {
//         setTag(input.options, C.on, key);
//         return multSelectTag([
//           icon(<Icon>item[ent.icon]),
//           <Primitive>item[ent.main]
//         ], key, input);
//       }
//       return wait(async () => {
//         let w = <str[]>bond.whereV();
//         w.push(`id=${key}`);
//         let item = await select(ent, {
//           tp: "row",
//           fields: bond.fields,
//           where: w,
//           query: bond.query,
//           queryBy: bond.queryBy
//         });
//         if (!item)
//           throw "invalid select item";
//         //checa denovo para garanter que durante a busca deste dado ele foi por outro lado
//         if (!get(input.options, key))
//           input.options.push(item);
//         setTag(input.options, C.on, key);
//         return multSelectTag([
//           icon(<Icon>item[ent.icon]),
//           <Primitive>item[ent.main]
//         ], key, input);
//       })
//     }
//   });
//   callback?.();
//   return input;
// }
function addInputs(types) {
    //------------ SELECT ------------------------
    let output, init = async (f, tp) => {
        if (tp == 1 /* set */ || entity_1.$.linkTp != 0 /* processed */)
            await (0, entity_1.entity)(f.src);
    };
    switch (entity_1.$.linkTp) {
        case 0 /* processed */:
            output = ({ v, p }) => v || p.null;
            break;
        case 2 /* sub */:
            output = ({ v, p }, o) => v ? v[(0, entity_1.entity)(o.src).main] : p.null;
            break;
        case 1 /* raw */:
            output = ({ v, p }, o) => v ? (0, wait_1.wait)(async () => {
                let e = (0, entity_1.entity)(o.src);
                return await (0, entity_1.select)(e, {
                    tp: "one",
                    where: { [entity_1.$.id(e)]: v },
                    fields: [e.main]
                });
            }) : p.null;
            break;
    }
    (0, inutil_1.ex)(types, {
        link: {
            input: (i) => new SelectInput(i),
            output, init,
            size: () => 10
        },
        mlink: {
            input: ({ key, req, link }) => new MSelectInput({ key, req, link }),
            output({ v, p }, o) {
                if (v == null)
                    return p.null;
                switch (entity_1.$.linkTp) {
                    case 0 /* processed */:
                        return v;
                    case 1 /* raw */:
                        return (0, wait_1.wait)(async () => {
                            let e = await (0, entity_1.entity)(o.link);
                            return (await (0, entity_1.select)(e, {
                                tp: "col",
                                where: `in(${[entity_1.$.id(e)]},${v})`,
                                fields: [e.main]
                            })).join('; ');
                        });
                    case 2 /* sub */:
                        return (0, wait_1.wait)(async () => {
                            let m = (await (0, entity_1.entity)(o.link)).main;
                            return v.map(v => v[m]).join('; ');
                        });
                }
            }, init,
            size: () => 10
        }
    });
}
exports.addInputs = addInputs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUE0SDtBQUU1SCwrQkFBcUM7QUFDckMsaUNBQTJDO0FBQzNDLCtCQUFrQztBQUNsQyxzQ0FBcUQ7QUFFckQsc0NBQWdEO0FBQ2hELGtDQUFvQztBQUNwQyw4Q0FBb0U7QUFDcEUsc0NBQW1DO0FBQ25DLG1DQUE0QjtBQUM1QixpQ0FBdUM7QUFDdkMscUNBQWtDO0FBQ2xDLHVDQUFtQztBQUVuQywwQkFBMEI7QUFDMUIsaUJBQWlCO0FBQ2pCLElBQUk7QUFDSixTQUFTLE9BQU8sQ0FBQyxHQUFnQixFQUFFLE9BQWU7SUFDaEQsSUFDRSxJQUFJLEdBQUcsSUFBSSxhQUFJLENBQUMsSUFBQSxlQUFNLEVBQUMsR0FBRyxDQUFXLENBQUMsRUFDdEMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQ2YsSUFBSSxHQUFVLElBQUEsY0FBSyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFDdkQsS0FBSyxHQUFHLElBQUEsV0FBRyxFQUFDLENBQUMsRUFBRSxJQUFBLFlBQUksRUFBQyxPQUFPLEVBQUUsSUFBQSxTQUFDLEVBQUMsT0FBTyxDQUFDLEVBQUU7UUFDdkMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBQSxlQUFRLEVBQUMsQ0FBQyxFQUFFLElBQUEsZUFBTSxFQUFDLElBQUksRUFBRSxJQUFBLFdBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRSxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHO1lBQ2hCLENBQUMsQ0FBQyxHQUFHLENBQUMs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