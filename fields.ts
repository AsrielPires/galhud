import { $ as ett$, Field, FieldActionType, FieldType, fieldTypes as types, IBond } from "entity";
import { Input } from "form";
import {
  checkbox as checkboxIn, date as dateIn, DateInputType, NumberInput, RadioInput, text as textIn, TextInput, time as timeIn
} from "form/inputs";
import { time } from "format";
import scalar from "format/scalar";
import { formatTime } from "format/time";
import { $, Color, icon, w } from "galhui";
import { OutputCtx } from "galhui/list";
import { TAlign } from "galhui/table";
import { def, ex, extend, isV } from "inutil";
import { L } from "orray";

declare global {
  namespace entity {
    interface FieldType {
      sort?: boolean;
      block?: boolean;
      query?: boolean;
      align?: TAlign;
      set?: bool;


      output?(ctx: OutputCtx, options: Field);
      input?(f: Field): Input;
      filter?(field: Field): any;
      size?(): float;
    }
    interface Entity {
      /**can select data */
      get?: boolean;
      /**can insert data*/
      post?: any;
      /**can update data*/
      put?: any;
      /**can delete data */
      delete?: any;
    }
    interface Field {
      text?: str;
      edit?: bool;
      side?: bool;

      query?: bool;
      sort?: bool;
      set?: bool;
      /**required */
      req?: bool;
    }
  }
}
/**FormatedFieldOptions */
export interface FmtField extends Field {
  fmt?: str;
}
// export class Field<T extends FieldOpts = FieldOpts> implements IField {
//   constructor(public key: str, public tp: Key, public o: T = <T>{}) {
//     this.req = t(o.req);
//     this.edit = def(o.edit, set(this));
//     this.side = o.side;
//   }
// }
const field = <T extends Field = Field>(key: str, tp: Key, opts?: Partial<T>): Field => ex<T>({ key, tp } as T, opts);
export const query = ({ query, tp }: Field) => def(query, types[tp].query);
export const sort = ({ sort, tp }: Field) => def(sort, types[tp].sort);
export const set = ({ set, tp }: Field) => def(set, types[tp].set);
export const size = ({ tp }: Field) => types[tp].size() * $.rem;
export const input = (f: Field): Input => types[f.tp].input(f);
export const output = (f: Field, ctx: OutputCtx) => types[f.tp].output(ctx, f);

// export const extendField = (base: Key, key: Key, type: FieldType) =>
//   types[key] = extend(type, types[base]);

const defFT: Partial<FieldType> = {
  sort: true,
  block: false,
  query: true,
  align: "left",
  set: true,
  output: ({ v, p }) => v == null ? p.null : v,
  size: () => 10
}
/**checkbox format */
export const cbFormats: Dic<(value: bool) => any> = {}
export const addcbFmts = (list: Dic<(value: bool) => any>) => ex(list, {
  icon: (value) =>
    icon(isV(value) ? value ? $.i.check : $.i.close : $.null()),
  /**yes | no */
  yn: (value) => isV(value) ? value ? w.yes : w.no : "",
  /**true | false */
  tf: (value) => isV(value) ? value ? w.true : w.false : "",
});

export function addBaseTypes(types: Dic<FieldType>) {
  const addType = (key: Key, type: FieldType) =>
    types[key] = extend(type, defFT);
  addType("text", {
    input: (i) => new TextInput(i),
    size: () => 12
  });

  addType("number", {
    output: ({ v, p }, o: FmtField) => v == null ? p.null : scalar(v).fmt(o.fmt || p.numberFmt),
    input: (i) => new NumberInput(i),
    size: () => 7,
    align: "right"
  });
  addType("date", {
    output: ({ v, p }, o: DateField) => v == null ? p.null : formatTime(time(v), o.fmt || p.dateFmt),
    input: ({ key, req, input }: DateField) => dateIn(key, input, req)
  });
  addType("time", {
    output: ({ v, p }, o: FmtField) => v == null ? p.null : formatTime(time(v), o.fmt || p.timeFmt),
    input: ({ key, req }) => timeIn(key, req)
  });
  addType("dt", {
    output: ({ v, p }, o: FmtField) => v == null ? p.null : formatTime(time(v), o.fmt),
    input: () => null
  });
  addType("check", {
    output: ({ v, p }, o: FmtField) => cbFormats[o.fmt || p.checkboxFmt](v),
    input: ({ key, req }) => checkboxIn(key, req)
  });

  addType("radio", {
    output: ({ v, p }, o: RadioField) => v == null ? p.null : ett$.enumView(o.src, v),
    input: ({ key, req, src }: RadioField) => new RadioInput({ key, options: <L>ett$.enum(src), req }),
    init(o: RadioField) { ett$.enum(o.src) },
    size: () => 4
  });

}
type RadioField = Field & { src?: str; };
type DateField = FmtField & { input: DateInputType };
export const text = (key: str, opts: Partial<Field> = {}) =>
  field(key, "text", opts);
export const radio = (key: str, list: str, opts?: Partial<Field>) =>
  field<RadioField>(key, "radio", ex({}, { enum: list }, opts));
export const number = (key: str, opts: Partial<FmtField> = {}) =>
  field(key, "number", opts);
export const select = (key: str, link: str | IBond, opts?: Partial<FmtField>) =>
  field<Field & { link }>(key, "link", ex({}, opts, { link }));
