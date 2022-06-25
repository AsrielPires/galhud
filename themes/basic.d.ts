import { Styles } from "galho/css";
import { StyleFnAdd } from "galhui/style";
import { Context, Pallete } from "galhui/themes/basic";
export declare function grid(ctx: Context): Styles;
export declare function tree(ctx: Context): Styles;
export declare const card: (ctx: Context) => Styles;
export declare function pagging(ctx: Context): Styles;
export declare const all: (fn: StyleFnAdd<Pallete>) => StyleFnAdd<Pallete>;
