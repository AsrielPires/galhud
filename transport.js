"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAll = exports.addXML = exports.addJSON = exports.addMD = exports.addWEB = exports.addCSV = exports.addXLSX = exports.exportE = exports.importE = exports.addTransport = exports.srcs = exports.plainP = exports.xlsxP = exports.printP = exports.DataContext = void 0;
const form_1 = require("form");
const inputs_1 = require("form/inputs");
const galho_1 = require("galho");
const galhui_1 = require("galhui");
const hover_1 = require("galhui/hover");
const table_1 = require("galhui/table");
const inutil_1 = require("inutil");
const tools_1 = require("./tools");
class DataContext {
    bond;
    sizedFields;
    totals;
    constructor(bond, sizedFields, totals) {
        this.bond = bond;
        this.sizedFields = sizedFields;
        this.totals = totals;
    }
    get target() { return null; }
    data() {
        let b = this.bond, l = null; // b.list;
        if (l && (!b.length || b.length == l.length))
            return Promise.resolve(l);
        return this.target.selectAll(b).then(dt => dt.d);
    }
    formatedData(platform) {
        return this.data()
            .then(dt => {
            return this.target.formatData(dt, platform);
        });
    }
}
exports.DataContext = DataContext;
const printP = () => ({
    null: () => '',
    invalidIcon: () => (0, galhui_1.icon)('image-broken'),
    html: true,
    interactive: false,
    format: true
}), xlsxP = () => ({
    null: () => '',
    invalidIcon: () => '',
    html: false,
    interactive: false,
    format: false
}), plainP = () => ({
    null: () => '',
    invalidIcon: () => '',
    html: false,
    interactive: false,
    format: true
});
exports.printP = printP, exports.xlsxP = xlsxP, exports.plainP = plainP;
exports.srcs = [];
function addTransport(value) {
    if (!value.text)
        value.text = value.key;
    exports.srcs.push(value);
}
exports.addTransport = addTransport;
//, opts: entity.TransportOptions, entity: Entity
const importE = async (ent) => {
    let file = await (0, tools_1.selectFile)((0, inutil_1.valid)(exports.srcs
        .map(s => s.import && (s.accept || s.exts.map(e => '.' + e).join()))).join());
    if (!file)
        return;
    let reader = new FileReader();
    reader.onload = () => {
        let ext = (0, inutil_1.z)(file.name.split('.')), src = exports.srcs.find(s => s.exts.includes(ext)), dt = src?.import(reader.result);
        if (!dt) {
            (0, hover_1.error)("ficheiro invalido");
            return;
        }
        console.log(dt);
        (0, hover_1.okCancel)(new table_1.default({}));
    };
    reader.readAsBinaryString(file);
};
exports.importE = importE;
const exportE = (t, getCtx) => t.export && (async () => {
    let ctx = getCtx(), form = t.exportForm(ctx);
    t.export(ctx, (form ? await (0, hover_1.fromPanel)((0, galho_1.g)(form), { valid: v => !v || form.valid() }) : t.autoOptions(ctx)));
});
exports.exportE = exportE;
const addXLSX = () => addTransport({
    key: 'xlsx',
    text: 'Excel (xlsx)',
    icon: 'file-excel',
    exts: ["xlsx", "xls"],
    autoOptions: (ctx) => {
        let fds = ctx.sizedFields, ent = ctx.target;
        for (let f of fds) {
            let t = ent.field(f.key);
            if (t) {
                f.text = t.text;
                f.tp = t.dt;
            }
        }
        return {
            format: (0, exports.xlsxP)(),
            col: 0,
            row: 1,
            fields: fds,
            nullChar: '',
            fileName: ent.dic.p,
            sheetName: ent.dic.p
        };
    },
    export(ctx, opts) {
        //xlsx.utils.sheet
        let nullChar = opts.nullChar || '', cols = Array /*<xlsx.ColInfo>*/(opts.fields.length), sheet /*: xlsx.WorkSheet*/ = {
            "!cols": cols
            //"!merges": []
        }, book = XLSX.utils.book_new(), row = opts.row;
        XLSX.utils.book_append_sheet(book, sheet, opts.sheetName);
        //cabeçalho
        for (let c = 0; c < opts.fields.length; c++) {
            let f = opts.fields[c];
            cols[c] = { width: f.size / (galhui_1.$.rem / 2) };
            sheet[XLSX.utils.encode_col(opts.col + c) + row] = /*<xlsx.CellObject>*/ {
                t: "s",
                v: f.text
            };
        }
        ////primeira linha da tabela
        //for (let i = 0; i < opts.fields.length; i++) {
        //}
        return ctx.data().then(data => {
            let c;
            for (let i = 0; i < data.length; i++) {
                row++;
                let item = data[i];
                for (c = 0; c < opts.fields.length; c++) {
                    let field = opts.fields[c], value = item[field.key];
                    if (value == null)
                        value = nullChar;
                    sheet[XLSX.utils.encode_col(c + opts.col) + row] = /*<xlsx.CellObject>*/ {
                        t: field.tp,
                        v: value
                    };
                }
            }
            if (ctx.totals)
                for (let item of ctx.totals) {
                    row++;
                    for (c = 0; c < opts.fields.length; c++) {
                        let field = opts.fields[c], value = item[field.key];
                        if (value == null)
                            value = nullChar;
                        sheet[XLSX.utils.encode_col(c + opts.col) + row] = {
                            t: field.tp,
                            v: value
                        };
                    }
                }
            sheet['!ref'] = `A1:${XLSX.utils.encode_col(opts.fields.length)}${opts.col + data.length + 1}`;
            //corpo da tabela
            return {
                content: XLSX.writeFile(book, `${opts.fileName}.xlsx`, {
                    type: 'base64',
                    bookType: 'xlsx'
                }),
                extension: 'xlsx',
                name: opts.fileName
            };
        });
    },
    import(data) {
        let wb = XLSX.read(data, { type: 'binary' }), sheet = wb.Sheets[wb.SheetNames.a], hd = [], dt = [];
        for (let k in sheet)
            if (k[0] != '!') {
                let { c, r } = XLSX.utils.decode_cell(k), v = sheet[k];
                if (v.t == "e" || v.t == "z")
                    v.v = void 0;
                if (r)
                    (dt[r - 1] ||= [])[c] = v;
                else
                    hd[c] = v.v || "";
            }
        return { hd, dt };
    },
    exportForm(ctx) {
        return null;
    },
    importForm(ctx) {
        return null;
    },
});
exports.addXLSX = addXLSX;
const addCSV = () => addTransport({
    key: 'csv',
    icon: 'file-delimited',
    accept: ".csv",
    export(ctx, opts) {
        let result = '', sep = opts.separator || ',', nullValue = opts.nullChar || '', fields = opts.fields || ctx.target.fields.map(f => f.key);
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
            return {
                content: new Blob([result.slice(0, result.length - 1)], {
                    type: "text/csv;charset=utf-8"
                }),
                extension: 'csv',
                name: opts.fileName || 'ola.csv',
            };
        });
    },
    import(data) {
        return null;
    },
    exportForm(ctx) {
        return new form_1.Form({}, [
            // {
            //   tp: 'checklist',
            //   key: 'fields',
            //   //options: bond.target.fields.map(f => f.key)
            // },
            new inputs_1.TextInput({ key: "null_symbol", def: "\\N" }),
            new inputs_1.TextInput({ key: "surround", def: '"' }),
            new inputs_1.TextInput({ key: "delimit_with", def: ";" }),
            new inputs_1.TextInput({ key: "ina", def: ';' })
        ]);
    }
});
exports.addCSV = addCSV;
const addWEB = () => addTransport({
    icon: 'web',
    key: 'html',
    export(ctx, opts) {
        return Promise.resolve({
            content: null,
            extension: 'html',
            name: opts.fileName,
        });
    }
});
exports.addWEB = addWEB;
const addMD = () => addTransport({
    icon: 'markdown',
    key: 'markdown',
    export(ctx, opts) {
        return Promise.resolve({
            content: null,
            extension: 'html',
            name: opts.fileName,
        });
    }
});
exports.addMD = addMD;
const addJSON = () => addTransport({
    key: 'json',
    icon: 'json',
    accept: ".json",
    export(ctx, opts) {
        return ctx.data().then(data => ({
            content: new Blob([JSON.stringify(data)], { type: 'application/json' }),
            extension: 'json',
            name: opts.fileName
        }));
    },
    import(data) {
        return null;
    }
});
exports.addJSON = addJSON;
const addXML = () => addTransport({
    key: 'xml',
    icon: 'xml',
    accept: ".xml",
    export(ctx, opts) {
        let ent = ctx.target, root = (0, galho_1.g)(opts.rootTag || ent.key), nullValue = opts.nullChar || '', fields = opts.fields || ent.fields.map(f => f.key);
        return ctx.data()
            .then(data => {
            root.add(data.map((row) => {
                let cells = [];
                for (let key in row) {
                    let value = row[key];
                    if (value == null) {
                        if (opts.nullFormat == 0 /* notInclude */)
                            continue;
                        value = nullValue;
                    }
                    if (key == 'id' && opts.idPlace != 'cell')
                        continue;
                    if (opts.cellNamePlace == 'tagName')
                        var cell = (0, galho_1.g)(key);
                    else
                        var cell = (0, galho_1.g)(opts.cellTag || 'cell', { [opts.cellNameAttr]: key });
                    if (opts.dataPlace == "attribute")
                        cell.attr(opts.dataAttr, value);
                    else
                        cell.add(value);
                    cells.push(cell);
                }
                return (0, galho_1.g)(opts.rowTag || 'row', { [opts.idAttr || 'id']: opts.idPlace == 'attribute' && row.id });
            }));
            let xs = new XMLSerializer();
            return Promise.resolve({
                content: xs.serializeToString(root.e),
                extension: 'xml',
                name: opts.fileName
            });
        });
    },
    import(data) {
        return null;
    }
});
exports.addXML = addXML;
function addAll() {
    (0, exports.addXLSX)();
    (0, exports.addCSV)();
    (0, exports.addJSON)();
    (0, exports.addXML)();
    (0, exports.addMD)();
    (0, exports.addWEB)();
}
exports.addAll = addAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHJhbnNwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLCtCQUFzQztBQUN0Qyx3Q0FBd0M7QUFFeEMsaUNBQTBCO0FBQzFCLG1DQUFpQztBQUVqQyx3Q0FBaUU7QUFDakUsd0NBQWlDO0FBQ2pDLG1DQUFrQztBQUNsQyxtQ0FBcUM7QUFXckMsTUFBYSxXQUFXO0lBQ0g7SUFBcUM7SUFBbUM7SUFBM0YsWUFBbUIsSUFBbUIsRUFBa0IsV0FBMEIsRUFBUyxNQUFjO1FBQXRGLFNBQUksR0FBSixJQUFJLENBQWU7UUFBa0IsZ0JBQVcsR0FBWCxXQUFXLENBQWU7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBRXpHLENBQUM7SUFFRCxJQUFJLE1BQU0sS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFN0IsSUFBSTtRQUNGLElBQUksQ0FBQyxHQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBLFVBQVU7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQzFDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBQ0QsWUFBWSxDQUFDLFFBQXVCO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRTthQUNmLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNULE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFD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