"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.table = exports.list = void 0;
const entity_1 = require("entity");
const galho_1 = require("galho");
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
async function table(bond, i = {}) {
    (0, inutil_1.isS)(bond) && (bond = await (0, entity_1.createBond)(bond));
    let ent = bond.target, req = [ent.main], f = (0, entity_1.fields)(ent, f => f.get), allColumns = f.map((f) => {
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
    (0, inutil_1.l)(bond.fields) || bond.fields.set((0, inutil_1.sub)((0, entity_1.fields)(ent, (f) => !f.side), "key"));
    if (i.iform) {
        req.push(...(0, inutil_1.sub)(f.filter(v => v.req), "key"));
        for (let field of req)
            bond.fields.includes(field) || bond.fields.push(field);
    }
    await (0, entity_1.initFields)(f, 2 /* get */);
    return new table_1.default({
        sort: {
            clear: true,
            call({ key: f, desc: d }, active) { bond.sort.set(active && [{ f, d }]); }
        },
        fill: i.fill,
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
        foot: i.iform && [cols => (0, galho_1.g)("form", 0, [(0, galho_1.div)("sd" /* side */, "+"), cols.map(c => (0, fields_1.input)((0, entity_1.field)(ent, c.key)))])],
    }, bond.bind());
}
exports.table = table;
// export const itable = async (ent: str, ...fields: str[]) => table(await createBond(ent, fields), { iform: true, fill: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J1ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNydWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQTRIO0FBRTVILGlDQUF1QztBQUV2QyxzQ0FBMEU7QUFDMUUsa0NBQW1DO0FBQ25DLHdDQUFxRDtBQUNyRCxtQ0FBb0Q7QUFDcEQsaUNBQTZCO0FBQzdCLGlDQUE4QjtBQUM5QixxQ0FBdUM7QUFDdkMsaUNBQXVDO0FBQ3ZDLG1DQUFrRDtBQXVCbEQsU0FBZ0IsSUFBSSxDQUFDLElBQVUsRUFBRSxJQUFtQyxFQUFFO0lBQ3BFLElBQUEsWUFBRyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUIsT0FBTyxJQUFBLFdBQU8sRUFBTTtRQUNsQixNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU07UUFDaEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBQSxpQkFBUyxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBQSxZQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLGVBQU8sRUFBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUcsQ0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RELHNCQUFzQjtRQUN0QixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUM7S0FDM0IsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FB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