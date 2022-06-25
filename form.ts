import { Entity, Field, FieldActionType, fields, initFields, insert, select, update } from "entity";
import { Form, FormBase } from "form";
import { clearEvent, div, g } from "galho";
import { $, cancel, ibutton, icon, positive, w } from "galhui";
import { fromPanel } from "galhui/hover";
import { def, ex, isF } from "inutil";
import { input } from "./fields";

export async function entForm(ent: Entity, filter: (field: Field) => any) {
  return new Form({ intern: true }, (await initFields(fields(ent, filter), FieldActionType.set)).map((f: Field) => input(f)));
}

export function post(ent: Entity, form: FormBase, cancelBt?: bool) {
  let def = g(form).d();
  if (def) form.def = def;
  return [
    div("hd", [icon(ent.i), "Novo " + ent.s]),
    g(form, "bd"),
    div("ft", [
      ibutton($.i.save, w.saveData, (e) => {
        e.preventDefault();
        return form.valid() ? insert(ent, form.data(true, true)) : clearEvent(e);
      }).prop("type", 'submit'),
      cancelBt && cancel()
    ])
  ];
}
export async function mdPost(ent: Entity, form?: FormBase) {
  let ctx = fromPanel(g("form", 0, post(ent, form ||= await entForm(ent, f => f.set), true)), { valid: v => !v || form.valid() });
  form.focus();
  return ctx;
}

export async function put(ent: Entity, id: Key, form: FormBase, cancelBt?: bool | (() => any)) {
  let dt = await select(ent, {
    tp: "row",
    where: `id=${id}`,
    fill: true
  });

  g(form).d() || g(form).d(form.def);
  form.def = dt;
  form.reset();
  return [
    div("hd", [icon(ent.i), "Editar " + ent.s]),
    g(form, "bd"),
    div("ft", [
      positive('content-save', w.saveData, (e) => {
        e.preventDefault();
        form.valid() ? update(ent, ex(form.data(true), { id })) : clearEvent(e);
      }).d(1).prop("type", "submit"),
      ent.post && ibutton('content-duplicate', "duplicar", (e) => {
        e.preventDefault();
        form.valid() ? insert(ent, form.data()) : clearEvent(e);
      }).d(1).prop("type", "submit"),
      cancelBt && cancel(isF(cancelBt) && cancelBt)
    ])
  ]
};
export async function mdPut(ent: Entity, id: Key, form?: FormBase) {
  let
    dt = await put(ent, id, form ||= await entForm(ent, (f: Field) => def(f.edit, f.set)), true),
    ctx = fromPanel(g("form", 0, dt), { valid: v => !v || form.valid() });
  form.focus();
  return ctx;
}