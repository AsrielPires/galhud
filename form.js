"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mdPut = exports.put = exports.mdPost = exports.post = exports.entForm = void 0;
const entity_1 = require("entity");
const form_1 = require("form");
const galho_1 = require("galho");
const galhui_1 = require("galhui");
const hover_1 = require("galhui/hover");
const inutil_1 = require("inutil");
const fields_1 = require("./fields");
async function entForm(ent, filter) {
    return new form_1.Form({ intern: true }, (await (0, entity_1.initFields)((0, entity_1.fields)(ent, filter), 1 /* set */)).map((f) => (0, fields_1.input)(f)));
}
exports.entForm = entForm;
function post(ent, form, cancelBt) {
    let def = (0, galho_1.g)(form).d();
    if (def)
        form.def = def;
    return [
        (0, galho_1.div)("hd", [(0, galhui_1.icon)(ent.i), "Novo " + ent.s]),
        (0, galho_1.g)(form, "bd"),
        (0, galho_1.div)("ft", [
            (0, galhui_1.ibutton)(galhui_1.$.i.save, galhui_1.w.saveData, (e) => {
                e.preventDefault();
                return form.valid() ? (0, entity_1.insert)(ent, form.data(true, true)) : (0, galho_1.clearEvent)(e);
            }).prop("type", 'submit'),
            cancelBt && (0, galhui_1.cancel)()
        ])
    ];
}
exports.post = post;
async function mdPost(ent, form) {
    let ctx = (0, hover_1.fromPanel)((0, galho_1.g)("form", 0, post(ent, form ||= await entForm(ent, f => f.set), true)), { valid: v => !v || form.valid() });
    form.focus();
    return ctx;
}
exports.mdPost = mdPost;
async function put(ent, id, form, cancelBt) {
    let dt = await (0, entity_1.select)(ent, {
        tp: "row",
        where: `id=${id}`,
        fill: true
    });
    (0, galho_1.g)(form).d() || (0, galho_1.g)(form).d(form.def);
    form.def = dt;
    form.reset();
    return [
        (0, galho_1.div)("hd", [(0, galhui_1.icon)(ent.i), "Editar " + ent.s]),
        (0, galho_1.g)(form, "bd"),
        (0, galho_1.div)("ft", [
            (0, galhui_1.positive)('content-save', galhui_1.w.saveData, (e) => {
                e.preventDefault();
                form.valid() ? (0, entity_1.update)(ent, (0, inutil_1.ex)(form.data(true), { id })) : (0, galho_1.clearEvent)(e);
            }).d(1).prop("type", "submit"),
            ent.post && (0, galhui_1.ibutton)('content-duplicate', "duplicar", (e) => {
                e.preventDefault();
                form.valid() ? (0, entity_1.insert)(ent, form.data()) : (0, galho_1.clearEvent)(e);
            }).d(1).prop("type", "submit"),
            cancelBt && (0, galhui_1.cancel)((0, inutil_1.isF)(cancelBt) && cancelBt)
        ])
    ];
}
exports.put = put;
;
async function mdPut(ent, id, form) {
    let dt = await put(ent, id, form ||= await entForm(ent, (f) => (0, inutil_1.def)(f.edit, f.set)), true), ctx = (0, hover_1.fromPanel)((0, galho_1.g)("form", 0, dt), { valid: v => !v || form.valid() });
    form.focus();
    return ctx;
}
exports.mdPut = mdPut;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW9HO0FBQ3BHLCtCQUFzQztBQUN0QyxpQ0FBMkM7QUFDM0MsbUNBQStEO0FBQy9ELHdDQUF5QztBQUN6QyxtQ0FBc0M7QUFDdEMscUNBQWlDO0FBRTFCLEtBQUssVUFBVSxPQUFPLENBQUMsR0FBVyxFQUFFLE1BQTZCO0lBQ3RFLE9BQU8sSUFBSSxXQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLElBQUEsbUJBQVUsRUFBQyxJQUFBLGVBQU0sRUFBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLGNBQXNCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFRLEVBQUUsRUFBRSxDQUFDLElBQUEsY0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5SCxDQUFDO0FBRkQsMEJBRUM7QUFFRCxTQUFnQixJQUFJLENBQUMsR0FBVyxFQUFFLElBQWMsRUFBRSxRQUFlO0lBQy9ELElBQUksR0FBRyxHQUFHLElBQUEsU0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3RCLElBQUksR0FBRztRQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLE9BQU87UUFDTCxJQUFBLFdBQUcsRUFBQyxJQUFJLEVBQUUsQ0FBQyxJQUFBLGFBQUksRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFBLFNBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1FBQ2IsSUFBQSxXQUFHLEVBQUMsSUFBSSxFQUFFO1lBQ1IsSUFBQSxnQkFBTyxFQUFDLFVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFB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