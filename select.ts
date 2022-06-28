import { $ as ett$, Bond, Entity, entity, field, Field, FieldActionType, FieldType, IBond, LinkType, select } from "entity";
import { Rec } from "entity/core";
import { IInput, Input } from "form";
import { clearEvent, div, g } from "galho";
import { vScroll } from "galho/s";
import { defRenderer, OutputCtx } from "galhui/list";
import { } from "galhui/menu";
import { menubar, menuitem } from "galhui/menu";
import { Pagging } from "galhui/io";
import { IRoot, keydown, setRoot, setValue } from "galhui/dropdown";
import { wait } from "galhui/wait";
import { ex } from "inutil";
import { bind, L, orray } from "orray";
import { output } from "./fields";
import { search } from "./filters";

// interface BSelectOpts {
//   ph?: string;
// }
function setMenu(src: str | IBond, options: L<Rec>) {
  let
    link = new Bond(entity(src) as Entity),
    e = link.target,
    main = <Field>field(e, f => !e.main || f.key == e.main),
    items = div(0, bind(options, g("table"), {
      insert: v => menuitem(0, output(main, ex(ctx, { v: v[main.key] }))),
      tag(s, active, tag) {
        s.cls(tag, active);
        active && vScroll(items, s.prop('offsetTop') - items.prop('clientHeight') / 2 + s.prop('clientHeight') / 2);
      }
    })).css('flex', '1 1'),
    ctx = { p: defRenderer } as OutputCtx,
    pag = new Pagging({ pag: link.pag, hideOnSingle: true }).on(() => {
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
  return div("_ menu", [
    menubar(
      search(link),
      // right(),
      //{
      //  icon: 'launch',
      //  cl: C.itemA,
      //  action() {
      //    route.goTo('e/' + ent.key, { p: 'modal' });
      //  }
      //}
    ).on('click', clearEvent),
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
    g(pag).on('click', clearEvent)
  ])/*.css({ display: 'flex', flexDirection: 'column' }) */;

}
interface ISelectInputBase extends IRoot {
  filters?: str[];
  src?: str | IBond;
}
type ISelectInput = IInput<Key> & ISelectInputBase & {
  auto?: bool;
}
class SelectInput extends Input<Key, ISelectInput>/* implements BindedInput*/ {
  view() {
    let
      i = this.i,
      label = g("span"),
      options = orray<Rec>(),
      menu = setMenu(i.src, options),
      root = setRoot(this, label, menu).on("keydown",
        e => keydown(this, e, options, (v: int) => this.value = v));
    this.on(e => ("value" in e) && setValue(this, { root, options, label, menu }));
    return root;
  }

  applyoff() {
  }
  get disabled() { return this.i.off; }
  set disabled(state: bool) { this.set('off', state); }
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

export function addInputs(types: Dic<FieldType>) {

  //------------ SELECT ------------------------

  // //------------ MULTSELECT ------------------------
  // interface IMSelectInput extends IInput<Key[]> {
  //   //tp: FT.multselect,
  //   selected?: Dic[];
  //   min?: int;
  //   max?: int;
  //   limit?: int;

  //   filters?: str[];
  //   link?;
  // }
  // class MSelectInput extends Input<Key[], IMSelectInput> {
  //   private valueList: L<Key>;

  //   view() {
  //     let i = this.i, input = linkedMSelect(i.link, { ph: i.ph });

  //     i.value = (this.valueList = input.i.value as L<Key>).onupdate(() => {
  //       i.selected = i.value.map(i => get(input.options, i))
  //       this.set(['value', 'selected']);
  //     });

  //     return input;
  //   }
  //   isDef(value = this.value, def = this.def || []) {
  //     if (def.length != value.length)
  //       return false;
  //     return value.every(v => def.includes(v));
  //   }
  //   setValue(value: Key[] | string) {
  //     if (isS(value))
  //       value = value.split(';');
  //     if (this.valueList)
  //       this.valueList.set(value);
  //     else super.setValue(value || []);
  //   }
  //   static defaultValue() { return []; }
  // }

  type SelectField = Field & { src: str | IBond };

  let
    output: (ctx: OutputCtx, o: SelectField) => any,
    init = async (f: SelectField, tp) => {
      if (tp == FieldActionType.set || ett$.linkTp != LinkType.processed)
        await entity(f.src);
    };
  switch (ett$.linkTp) {
    case LinkType.processed:
      output = ({ v, p }) => v || p.null;
      break;
    case LinkType.sub:
      output = ({ v, p }, o) => v ? v[(entity(o.src) as Entity).main] : p.null;
      break;
    case LinkType.raw:
      output = ({ v, p }, o) => v ? wait(async () => {
        let e = entity(o.src) as Entity;
        return await select(e, {
          tp: "one",
          where: { [ett$.id(e)]: v },
          fields: [e.main]
        });
      }) : p.null;
      break;
  }
  ex(types, {
    link: <FieldType>{
      input: (i: SelectField) => new SelectInput(i),
      output, init,
      size: () => 10
    },
    mlink: <FieldType>{
      input: ({ key, req, link }: SelectField) => new MSelectInput({ key, req, link }),
      output({ v, p }, o: SelectField) {
        if (v == null) return p.null;
        switch (ett$.linkTp) {
          case LinkType.processed:
            return v;
          case LinkType.raw:
            return wait(async () => {
              let e = await entity(o.link);
              return (await select(e, {
                tp: "col",
                where: `in(${[ett$.id(e)]},${v})`,
                fields: [e.main]
              })).join('; ');
            });
          case LinkType.sub:
            return wait(async () => {
              let m = (await entity(o.link)).main;
              return (<any[]>v).map(v => v[m]).join('; ');
            });
        }
      }, init,  
      size: () => 10
    }
  });
}