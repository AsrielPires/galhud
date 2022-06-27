"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.table = exports.list = void 0;
const entity_1 = require("entity");
const list_1 = require("galhui/list");
const io_1 = require("galhui/io");
const table_1 = require("galhui/table");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const card_1 = require("./card");
const fields_1 = require("./fields");
const form_1 = require("./form");
const tools_1 = require("./tools");
function list(bond, i = {}) {
    (0, inutil_1.isF)(i) && (i = { item: i });
    return (0, list_1.list)({
        single: i.single,
        open: i.open || i.edit || ((value) => (0, form_1.mdPut)(bond.target, value?.id)),
        remove: (...value) => (0, tools_1.tryRemove)(bond.target, (0, inutil_1.sub)(value, "id")),
        menu: () => (0, tools_1.ctxMenu)(bond, { edit: i.edit }),
        // options: i.options,
        item: i.item || (0, card_1.card)(bond)
    }, bond.bind());
}
exports.list = list;
function table(bond, i = {}) {
    let ent = bond.target, req = [ent.main], allColumns = ent.fields.map((f) => {
        let tp = entity_1.fieldTypes[f.tp];
        return {
            opts: f,
            tp: tp.dt,
            key: f.key,
            text: f.text,
            size: (0, fields_1.size)(f),
            align: tp.align,
            fmt: tp.output?.bind(f),
        };
    });
    if (i.iform) {
        req.push(...(0, inutil_1.sub)(ent.fields.filter(v => v.req), "key"));
        for (let field of req)
            bond.fields.includes(field) || bond.fields.push(field);
    }
    (0, inutil_1.l)(bond.fields) || bond.fields.set((0, inutil_1.sub)((0, entity_1.fields)(ent, (f) => !f.side), "key"));
    return new table_1.default({
        sort: {
            clear: true,
            call({ key: f, desc: d }, active) { bond.sort.set(active && [{ f, d }]); }
        },
        single: i.single,
        p: i.p || list_1.defRenderer,
        corner: (0, io_1.output)((0, tools_1.all)(bond)),
        style: i.style || ent.style,
        options: i.options, resize: true,
        allColumns, reqColumns: req, key: "id",
        columns: (0, orray_1.copy)(bond.fields, v => (0, inutil_1.byKey)(allColumns, v)),
        remove: (...value) => (0, tools_1.tryRemove)(ent, (0, inutil_1.sub)(value, 'id')),
        menu: (0, inutil_1.t)(i.menu) && (() => (0, tools_1.ctxMenu)(bond, { edit: i.edit })),
        open: i.open || i.edit || ((value) => (0, form_1.mdPut)(ent, value?.id)),
    }, bond.bind(), [fromArray(allColumns, v => [v.key, v.input()])]);
}
exports.table = table;
// export async function single(key: str) {
//   let ent = await entity(key);
//   return [
//     list(new Bond(ent, ["name", "info"]), {
//       item: v => [
//         g("td", "bd", [v.name, v.info && (`(${v.info})`)]),
//         g("td", 0, ibutton($.i.edit, null, () => mdPut(ent, v.id)).cls(C.extra))
//       ],
//       foot: g("tr", 0, [
//         g("td"),
//         g("td", 0, input("text", "name", "Designação")),
//         g("td", 0, ibutton($.i.plus, null, () => mdPost(ent))),
//       ]),
//     })
//   ];
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J1ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNydWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXdGO0FBSXhGLHNDQUEwRTtBQUMxRSxrQ0FBMEM7QUFDMUMsd0NBQXFEO0FBQ3JELG1DQUErQztBQUMvQyxpQ0FBNkI7QUFDN0IsaUNBQThCO0FBQzlCLHFDQUFnQztBQUNoQyxpQ0FBdUM7QUFDdkMsbUNBQWtEO0FBcUJsRCxTQUFnQixJQUFJLENBQUMsSUFBVSxFQUFFLElBQW1DLEVBQUU7SUFDcEUsSUFBQSxZQUFHLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QixPQUFPLElBQUEsV0FBTyxFQUFNO1FBQ2xCLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTTtRQUNoQixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUEsWUFBSyxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFBLGlCQUFTLEVBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFBLFlBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUEsZUFBTyxFQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRyxDQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEQsc0JBQXNCO1FBQ3RCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQztLQUMzQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2xCLENBQUM7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