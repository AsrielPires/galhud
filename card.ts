import { Bond, field, Field, fields } from "entity";
import { Rec } from "entity/core";
import { div, wrap } from "galho";
import { defRenderer, OutputCtx } from "galhui/list";
import { keyVal } from "galhui/io";
import { distinct, ex } from "inutil";
import { output } from "./fields";

export function card(link: Bond) {
  let
    e = link.target,
    main = <Field>field(e, f => !e.main || f.key == e.main),
    bf = link.fields,
    tags = fields(e, (f: Field) => (bf.length ? bf.includes(f.key) : !f.side) && f.key != main.key),
    p = defRenderer;

  bf.length || bf.set(distinct([main.key, ...tags.map(t => t.key), /*...fmt ? fmtFields(fmt) : []*/]));

  return (r: Rec) => {
    let
      ctx = { p } as OutputCtx,
      s = div("_ card", [
        wrap(output(main, ex(ctx, { v: r[main.key] })), null, 'p'),
        tags.map((t: Field) =>
          r[t.key] == null ? null : keyVal(t.text, output(t, ex(ctx, { v: r[t.key] }))))
      ]);
    //fmt && format(value, s, fmt)
    return s;
  }
}