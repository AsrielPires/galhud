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
        let i = this.i, label = (0, galho_1.g)("span"), opts = (0, orray_1.orray)(), menu = setMenu(i.src, opts), root = (0, dropdown_1.setRoot)(this, label, menu).on("keydown", e => (0, dropdown_1.keydown)(this, e, opts, (v) => this.value = v));
        this.on(e => ("value" in e) && (0, dropdown_1.setValue)(this, { root, options: opts, label, menu }));
        return root;
    }
    applyoff() {
    }
    get disabled() { return this.i.off; }
    set disabled(state) { this.set('off', state); }
}
// type IMSelectInput = IInput<Key[]> & ISelectInputBase & {}
// class MSelectInput extends Input<Key[], IMSelectInput>/* implements BindedInput*/ {
//   view() {
//     let
//       i = this.i,
//       label = g("span"),
//       opts = orray<Rec>(),
//       menu = setMenu(i.src, opts),
//       root = setRoot(this, label, menu).on("keydown",
//         e => keydown(this, e, opts, (v: int) => this.value = v));
//     this.on(e => ("value" in e) && setValue(this, { root, options: opts, label, menu }));
//     return root;
//   }
//   applyoff() {
//   }
//   get disabled() { return this.i.off; }
//   set disabled(state: bool) { this.set('off', state); }
// }
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
    let output, mOutput, init = async (f, tp) => {
        if (tp == 1 /* set */ || entity_1.$.linkTp != 0 /* processed */)
            await (0, entity_1.entity)(f.src);
    };
    switch (entity_1.$.linkTp) {
        case 0 /* processed */:
            mOutput = output = ({ v, p }) => v || p.null;
            break;
        case 2 /* sub */:
            output = ({ v, p }, o) => v ? v[(0, entity_1.entity)(o.src).main] : p.null;
            mOutput = ({ v, p }, o) => v ? v.map(v => v[(0, entity_1.entity)(o.src).main]).join(', ') : p.null;
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
            mOutput = () => ({ v, p }, o) => v ? (0, wait_1.wait)(async () => {
                let e = await (0, entity_1.entity)(o.link);
                return (await (0, entity_1.select)(e, {
                    tp: "col",
                    where: `in(${[entity_1.$.id(e)]},${v})`,
                    fields: [e.main]
                })).join('; ');
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
            output: mOutput, init,
            size: () => 10
        }
    });
}
exports.addInputs = addInputs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUE0SDtBQUU1SCwrQkFBcUM7QUFDckMsaUNBQTJDO0FBQzNDLCtCQUFrQztBQUNsQyxzQ0FBcUQ7QUFFckQsc0NBQWdEO0FBQ2hELGtDQUFvQztBQUNwQyw4Q0FBb0U7QUFDcEUsc0NBQW1DO0FBQ25DLG1DQUE0QjtBQUM1QixpQ0FBdUM7QUFDdkMscUNBQWtDO0FBQ2xDLHVDQUFtQztBQUVuQywwQkFBMEI7QUFDMUIsaUJBQWlCO0FBQ2pCLElBQUk7QUFDSixTQUFTLE9BQU8sQ0FBQyxHQUFnQixFQUFFLE9BQWU7SUFDaEQsSUFDRSxJQUFJLEdBQUcsSUFBSSxhQUFJLENBQUMsSUFBQSxlQUFNLEVBQUMsR0FBRyxDQUFXLENBQUMsRUFDdEMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQ2YsSUFBSSxHQUFVLElBQUEsY0FBSyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFDdkQsS0FBSyxHQUFHLElBQUEsV0FBRyxFQUFDLENBQUMsRUFBRSxJQUFBLFlBQUksRUFBQyxPQUFPLEVBQUUsSUFBQSxTQUFDLEVBQUMsT0FBTyxDQUFDLEVBQUU7UUFDdkMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBQSxlQUFRLEVBQUMsQ0FBQyxFQUFFLElBQUEsZUFBTSxFQUFDLElBQUksRUFBRSxJQUFBLFdBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRSxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHO1lBQ2hCLENBQUMsQ0FBQyxHQUFHLENBQUMs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