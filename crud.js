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
const list = (bond, model = {}) => (0, list_1.list)({
    single: model.single,
    open: model.open || model.edit || ((value) => (0, form_1.mdPut)(bond.target, value?.id)),
    remove: (...value) => (0, tools_1.tryRemove)(bond.target, (0, inutil_1.sub)(value, "id")),
    menu: () => (0, tools_1.ctxMenu)(bond, { edit: model.edit }),
    options: model.options,
    item: (0, card_1.card)(bond)
}, bond.bind());
exports.list = list;
function table(bond, i = {}) {
    let ent = bond.target, allColumns = ent.fields.map((f) => {
        let tp = entity_1.fieldTypes[f.tp];
        return {
            key: f.key,
            text: f.text,
            align: tp.align,
            size: (0, fields_1.size)(f),
            tp: tp.dt,
            fmt: tp.output?.bind(f),
            opts: f
        };
    });
    bond.fields.length || bond.fields.set((0, inutil_1.sub)((0, entity_1.fields)(ent, (f) => !f.side), "key"));
    return new table_1.default({
        sort: {
            clear: true,
            call({ key: f, desc: d }, active) { bond.sort.set(active && [{ f, d }]); }
        },
        single: i.single,
        p: i.p || list_1.defRenderer,
        corner: (0, io_1.output)((0, tools_1.all)(bond)),
        open: i.open || i.edit || ((value) => (0, form_1.mdPut)(ent, value?.id)),
        remove: (...value) => (0, tools_1.tryRemove)(ent, (0, inutil_1.sub)(value, 'id')),
        menu: (0, inutil_1.t)(i.menu) && (() => (0, tools_1.ctxMenu)(bond, { edit: i.edit })),
        options: i.options,
        resize: true,
        style: i.style || ent.style,
        allColumns,
        key: "id",
        columns: (0, orray_1.copy)(bond.fields, v => (0, inutil_1.byKey)(allColumns, v))
    }, bond.bind());
}
exports.table = table;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J1ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNydWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW9FO0FBSXBFLHNDQUEwRTtBQUMxRSxrQ0FBbUM7QUFDbkMsd0NBQStEO0FBQy9ELG1DQUF1QztBQUN2QyxpQ0FBa0M7QUFDbEMsaUNBQThCO0FBQzlCLHFDQUFnQztBQUNoQyxpQ0FBK0I7QUFDL0IsbUNBQWtEO0FBa0IzQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQVUsRUFBRSxRQUFlLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBQSxXQUFPLEVBQU07SUFDbEUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO0lBQ3BCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBQSxZQUFLLEVBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUUsTUFBTSxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUEsaUJBQVMsRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUEsWUFBRyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5RCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxlQUFPLEVBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87SUFDdEIsSUFBSSxFQUFFLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQztDQUNqQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBUEgsUUFBQSxJQUFJLFFBT0Q7QUFTaEIsU0FBZ0IsS0FBSyxDQUFDLElBQVUsRUFBRSxJQUFZLEVBQUU7SUFDOUMsSUFDRSxHQUFHLEdBQUcsSUFBSSxDQUFD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