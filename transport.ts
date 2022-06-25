// import type { CellObject } from "./xlsx";
import { Bond, Entity, IBond } from "entity";
import { Rec } from "entity/core";
import { Form, FormBase } from "form";
import { TextInput } from "form/inputs";
import { ValueType } from "format";
import { g } from "galho";
import { $, icon } from "galhui";
import { FieldPlatform } from "galhui/list";
import { error, fromPanel, modal, okCancel } from "galhui/hover";
import Table from "galhui/table";
import { valid, z } from "inutil";
import { selectFile } from "./tools";

type CellObject = any;
declare var XLSX: any//;typeof import("./xlsx");

export interface Sized {
  key: str;
  size?: number;
  text?/*: m.Child*/;
  tp?: ValueType;
}
export class DataContext {
  constructor(public bond: IBond<"full">, public readonly sizedFields?: Array<Sized>, public totals?: Rec[]) {

  }

  get target() { return null; }

  data(): Promise<Rec[]> {
    let b = <Bond>this.bond, l = null;// b.list;
    if (l && (!b.length || b.length == l.length))
      return Promise.resolve(l);
    return this.target.selectAll(b).then(dt => <Rec[]>dt.d);
  }
  formatedData(platform: FieldPlatform) {
    return this.data()
      .then(dt => {
        return this.target.formatData(dt, platform);
      })
  }
}

export const
  printP = (): FieldPlatform => ({
    null: () => '',
    invalidIcon: () => icon('image-broken'),
    html: true,
    interactive: false,
    format: true
  }),
  xlsxP = (): FieldPlatform => ({
    null: () => '',
    invalidIcon: () => '',
    html: false,
    interactive: false,
    format: false
  }),
  plainP = (): FieldPlatform => ({
    null: () => '',
    invalidIcon: () => '',
    html: false,
    interactive: false,
    format: true
  });
export const enum NullFormat {
  notInclude,
  char
}
export interface TransportOptions {
  nullFormat?: NullFormat;
  nullChar?: str;
  fileName?: str;
  focused?: boolean;
  format?: FieldPlatform;

  /**exporta ou importa o ficheiro por linha */
  single?: boolean;
  /**se deve criar um ficheiro a parte com os hashes */
  hash?: boolean;

  encrypt?: boolean;
}
export interface ExportedData {
  content: Blob;
  name?: str;
  extension: str;
}
export const enum TransportType {
  import = 1,
  export = -1
}
// export interface TransportForm {
//   inputs?: bgc.AcceptField[],
//   tp?: str;
//   //content/*: m.Child*/,
//   //set: (value: TransportOptions) => void,
//   //get: () => TransportOptions,
//   //data?: () => Promise<request.Row[]>
// }
export interface ITransport {
  key: str;
  icon: str;
  text?: str;
  accept?: str;
  /**extensions */
  exts?: str[];

  autoOptions?(ctx: DataContext): TransportOptions,

  exportForm?(ctx: DataContext): FormBase;
  export?(ctx: DataContext, opts: TransportOptions): Promise<ExportedData>;

  importForm?(ctx: DataContext, data: str | ArrayBuffer): FormBase;
  import?(data: str | ArrayBuffer): Task<ImportData>;
}
type ImportCell = Primitive | { v: Primitive, t: ValueType };
export interface ImportData {
  dt: ImportCell[][];
  hd: str[];
}
export const srcs: ITransport[] = [];

export function addTransport(value: ITransport) {
  if (!value.text)
    value.text = value.key;
  srcs.push(value);
}

export interface XmlExportOptions extends TransportOptions {
  rootTag?: str;
  rowTag?: str;
  cellTag?: str;
  fields?: str[];

  cellNamePlace?: 'tagName' | 'attribute';
  cellNameAttr?: str;

  dataPlace?: 'attribute' | 'content';
  dataAttr?: str;

  idPlace?: 'attribute' | 'cell';
  idAttr?: str;
}
export interface CsvExportOptions extends TransportOptions {
  separator?: str;
  surround?: str;
  sepHeader?: boolean;
  fields?: str[];
}
export interface XlsxExportOptions extends TransportOptions {
  sheetName?: str;
  col?: number;
  row?: number;
  //header?: str[];
  //headerRow?: number;
  fields?: Array<Sized>;
}
//, opts: entity.TransportOptions, entity: Entity

export const importE = async (ent: Entity) => {
  let file = await selectFile(valid(srcs
    .map(s => s.import && (s.accept || s.exts.map(e => '.' + e).join()))).join());
  if (!file)
    return;

  let reader = new FileReader();
  reader.onload = () => {
    let
      ext = z(file.name.split('.')),
      src = srcs.find(s => s.exts.includes(ext)),
      dt = src?.import(reader.result);
    if (!dt) {
      error("ficheiro invalido");
      return;
    }
    console.log(dt);
    okCancel(new Table({

    }))
  }
  reader.readAsBinaryString(file);

}
export const exportE = (t: ITransport, getCtx: () => DataContext) => t.export && (async () => {
  let
    ctx = getCtx(),
    form = t.exportForm(ctx);
  t.export(ctx, (form ? await fromPanel(g(form), { valid: v => !v || form.valid() }) : t.autoOptions(ctx)) as TransportOptions);

});

export const addXLSX = () => addTransport({
  key: 'xlsx',
  text: 'Excel (xlsx)',
  icon: 'file-excel',
  exts: ["xlsx", "xls"],
  autoOptions: (ctx: DataContext) => {
    let fds = ctx.sizedFields, ent = ctx.target;
    for (let f of fds) {
      let t = ent.field(f.key);
      if (t) {
        f.text = t.text;
        f.tp = t.dt;
      }
    }
    return <XlsxExportOptions>{
      format: xlsxP(),
      col: 0,
      row: 1,
      fields: fds,
      nullChar: '',
      fileName: ent.dic.p,
      sheetName: ent.dic.p
    }
  },
  export(ctx: DataContext, opts: XlsxExportOptions) {

    //xlsx.utils.sheet
    let
      nullChar = opts.nullChar || '',
      cols = Array/*<xlsx.ColInfo>*/(opts.fields.length),
      sheet/*: xlsx.WorkSheet*/ = {
        "!cols": cols
        //"!merges": []
      },
      book = XLSX.utils.book_new(),
      row = opts.row;
    XLSX.utils.book_append_sheet(book, sheet, opts.sheetName);
    //cabeçalho
    for (let c = 0; c < opts.fields.length; c++) {
      let f = opts.fields[c];
      cols[c] = { width: f.size / ($.rem / 2) };
      sheet[XLSX.utils.encode_col(opts.col + c) + row] = /*<xlsx.CellObject>*/{
        t: "s",
        v: f.text
      }
    }
    ////primeira linha da tabela
    //for (let i = 0; i < opts.fields.length; i++) {

    //}
    return ctx.data().then(data => {
      let c: number;
      for (let i = 0; i < data.length; i++) {
        row++;
        let item = data[i];
        for (c = 0; c < opts.fields.length; c++) {
          let
            field = opts.fields[c],
            value = item[field.key];

          if (value == null)
            value = nullChar;

          sheet[XLSX.utils.encode_col(c + opts.col) + row] = /*<xlsx.CellObject>*/{
            t: field.tp,
            v: value
          }
        }
      }
      if (ctx.totals)
        for (let item of ctx.totals) {
          row++;
          for (c = 0; c < opts.fields.length; c++) {
            let
              field = opts.fields[c],
              value = item[field.key];

            if (value == null)
              value = nullChar;

            sheet[XLSX.utils.encode_col(c + opts.col) + row] = {
              t: field.tp,
              v: value
            }
          }
        }
      sheet['!ref'] = `A1:${XLSX.utils.encode_col(opts.fields.length)}${opts.col + data.length + 1}`;

      //corpo da tabela
      return <ExportedData>{
        content: XLSX.writeFile(book, `${opts.fileName}.xlsx`, {
          type: 'base64',
          bookType: 'xlsx'
        }),
        extension: 'xlsx',
        name: opts.fileName
      }
    })
  },
  import(data: ArrayBuffer) {
    let
      wb = XLSX.read(data, { type: 'binary' }),
      sheet = wb.Sheets[wb.SheetNames.a],
      hd: str[] = [],
      dt: ImportCell[][] = [];
    for (let k in sheet)
      if (k[0] != '!') {
        let { c, r } = XLSX.utils.decode_cell(k), v = <CellObject>sheet[k];
        if (v.t == "e" || v.t == "z")
          v.v = void 0;

        if (r) (dt[r - 1] ||= [])[c] = <ImportCell>v;
        else hd[c] = <str>v.v || "";
      }
    return { hd, dt };
  },
  exportForm(ctx: DataContext) {
    return null;
  },
  importForm(ctx: DataContext) {

    return null;
  },

});
export const addCSV = () => addTransport({
  key: 'csv',
  icon: 'file-delimited',
  accept: ".csv",
  export(ctx: DataContext, opts: CsvExportOptions) {
    let
      result = '',
      sep = opts.separator || ',',
      nullValue = opts.nullChar || '',
      fields = opts.fields || ctx.target.fields.map(f => f.key);

    if (opts.sepHeader)
      result += 'sep=' + sep + '\n';
    return ctx.data().then(data => {
      for (let row of data) {
        for (let i = 0; i < fields.length;) {
          let value = row[fields[i]];
          if (value == null)
            value = nullValue;
          if (opts.surround)
            value = opts.surround + value + opts.surround;

          result += value + (++i == fields.length ? '\n' : sep);
        }
      }

      return <ExportedData>{
        content: new Blob([result.slice(0, result.length - 1)], {
          type: "text/csv;charset=utf-8"
        }),
        extension: 'csv',
        name: opts.fileName || 'ola.csv',

      }
    })
  },
  import(data) {
    return null;
  },
  exportForm(ctx: DataContext) {
    return new Form({}, [
      // {
      //   tp: 'checklist',
      //   key: 'fields',
      //   //options: bond.target.fields.map(f => f.key)
      // },
      new TextInput({ key: "null_symbol", def: "\\N" }),
      new TextInput({ key: "surround", def: '"' }),
      new TextInput({ key: "delimit_with", def: ";" }),
      new TextInput({ key: "ina", def: ';' })
    ]);
  }
});
export const addWEB = () => addTransport({
  icon: 'web',
  key: 'html',
  export(ctx: DataContext, opts: TransportOptions) {
    return Promise.resolve(<ExportedData>{
      content: null,
      extension: 'html',
      name: opts.fileName,
    })
  }
});
export const addMD = () => addTransport({
  icon: 'markdown',
  key: 'markdown',
  export(ctx: DataContext, opts: TransportOptions) {
    return Promise.resolve(<ExportedData>{
      content: null,
      extension: 'html',
      name: opts.fileName,
    })
  }
});
export const addJSON = () => addTransport({
  key: 'json',
  icon: 'json',
  accept: ".json",
  export(ctx: DataContext, opts: TransportOptions) {
    return ctx.data().then(data => (<ExportedData>{
      content: new Blob([JSON.stringify(data)], { type: 'application/json' }),
      extension: 'json',
      name: opts.fileName
    }))
  },
  import(data: str) {
    return null;
  }
});
export const addXML = () => addTransport({
  key: 'xml',
  icon: 'xml',
  accept: ".xml",
  export(ctx: DataContext, opts: XmlExportOptions): any {
    let
      ent = ctx.target,
      root = g(<any>opts.rootTag || ent.key),
      nullValue = opts.nullChar || '',
      fields = opts.fields || ent.fields.map(f => f.key);

    return ctx.data()
      .then(data => {
        root.add(data.map((row) => {
          let cells = [];
          for (let key in row) {
            let value = row[key];
            if (value == null) {
              if (opts.nullFormat == NullFormat.notInclude)
                continue;
              value = nullValue;
            }
            if (key == 'id' && opts.idPlace != 'cell')
              continue;

            if (opts.cellNamePlace == 'tagName')
              var cell = g(<any>key);
            else
              var cell = g(<any>opts.cellTag || 'cell', { [opts.cellNameAttr]: key });

            if (opts.dataPlace == "attribute")
              cell.attr(opts.dataAttr, <any>value);
            else cell.add(<any>value);

            cells.push(cell);
          }
          return g(<any>opts.rowTag || 'row', { [opts.idAttr || 'id']: opts.idPlace == 'attribute' && row.id });
        }))
        let xs = new XMLSerializer();

        return Promise.resolve({
          content: xs.serializeToString(root.e),
          extension: 'xml',
          name: opts.fileName
        });
      })
  },
  import(data) {
    return null;
  }
});

export function addAll() {
  addXLSX();
  addCSV();
  addJSON();
  addXML();
  addMD();
  addWEB();
}