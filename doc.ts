import { Book as BookBase, Boxes, cpu, Media, medias, normalize, Ori, print, sheets } from "book";
import { cs, p, s, symb, tbh, th, tr } from "book/fn";
import { Bond, Field, fields, fieldTypes, IBond } from "entity";
import fmt from "format";
import { g } from "galho";
import { $, C, ibutton, w, w as words } from "galhui";
import { modal, openBody } from "galhui/hover";
import { ex } from "inutil";
import { size } from "./fields";

declare global {
  namespace GalhoUI {
    interface Settings {
      sc?: { edit?: str[]; remove?: str[]; },

      doc?(key: str): Task<Book>;
      /**get img path */
      img?(key: str, args?: Dic): str;
      /**fetch data from server or localy */
      api?(path: str, body?: BodyInit): Task<any>;
      /**resource */
      rsc?(key: str): Task<any>;
    }

    interface Words {
      print?: str;
      original?: str;
      double?: str;
      triple?: str;
    }
  }
}
export interface Book extends BookBase {
  /**extra data to fetch on render doc */
  q?: Array<IBond | str>;
  /**path of currency */
  curr?: string;
}
interface DocView {
  dt: any[];
  extra?: Dic;
  media: Media;
  o?: Ori,
  double?: bool,
  triple?: bool
}
export async function docView(obj: Book, { dt, extra = {}, o, media, double, triple }: DocView) {
  normalize(obj);

  let
    bd = g("div", C.body),
    [w, h] = medias[media],
    calc = cpu(),
    // img = (path: str, args?: Dic) => $.img()`${$.host}\\${path}?${args ? dta(args, (v, k) => `${k}=${v}`).join('&') : ''}`,
    symbs: Dic<Boxes> = {},
    view = (dt) => sheets({
      dt: ex(dt, extra),
      fmt, calc,
      img: $.img, symb: (key) => symbs[key]
    }, bd, obj, w, h);

  openBody(modal(), bd, [ibutton("printer", words.print, () => print(bd, o, media, window.print))], { cls: C.full });

  if (obj.symbs)
    for (let symb of obj.symbs)
      symbs[symb] = await $.rsc(symb);
  if (obj.q)
    for (let k in obj.q)
      extra[k] = await $.api(`/${obj.q[k]}`);

  for (let t of dt) {
    t.copy = words.original;
    await view(t);

    if (double) {
      t.copy = words.double;
      await view(t);
      if (triple) {
        t.copy = words.triple;
        await view(t);
      }
    }
  }
}

async function printList(bond: Bond) {
  let
    ent = bond.target,
    fs = fields(ent, f => bond.fields.includes(f.key)) as Field[];
  docView({
    hd: symb("doc-hd"),
    dt: ex(tbh(
      fs.map(f => size(f)),
      th(cs(p(w.e[ent.key].p), { al: "center" }),
        ...fs.map(f => cs(p(f.text), { al: fieldTypes[f.tp].align }))
      ),
      tr(...fs.map(f => cs(s(f.text), { al: fieldTypes[f.tp].align })))
    ), { map: true }),
    ft: symb("doc-ft")
  }, { dt: [await bond.getAll()], media: "A4" });
}
export async function printDoc(key: str, dt: any) {
  await docView(await $.doc(key), { dt, o: "v", media: "A4" });
}
