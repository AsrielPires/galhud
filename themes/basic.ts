import { Styles } from "galho/css";
import { C, Size, cc } from "galhui";
import { StyleFnAdd } from "galhui/style";
import { button, Context, input, output, Pallete } from "galhui/themes/basic";

export function grid(ctx: Context): Styles {
  return {
    [cc(C.grid)]: {
      ["." + C.item]: {
        display: "inline-block",
        background: "#f45",
        // margin: spc(a.mrg),
        // padding: spc(a.pad),
        textAlign: "center",
        verticalAlign: "top",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ["." + C.icon]: {
          display: "block",
          margin: "auto",
        },
        ["&." + C.on]: {
          // background: on.bg
        },
        // ["&." + C.a]: {
        //   // border: bord({ c: on.bg }),
        //   // borderRadius: a.rad && (a.rad + "px")
        // }
      },
      ["&." + Size.xl]: {

      },
      ["&." + Size.l]: {

      },
      ["&." + Size.n]: {
        ["." + C.item]: {
          // width: hs(grid.sz) + "px",
          // minHeight: vs(grid.sz) + "px",
        }
      },
      ["&." + Size.s]: {

      },
      ["&." + Size.xs]: {

      }
    },
    body: {
      // background: "blue",
    }
  }
}


export function tree(ctx: Context): Styles {

  return {
    [cc(C.tree)]: {
      overflow: "auto",
      [" ." + C.head]: {
        display: "flex",
        flexDirection: "row",
        ["&." + C.on]: {
          // background: on.bg,
          // color: on.fg,
        }
      }
    }
  }
}
export const card = (ctx: Context): Styles => (ctx(input) && {
  "._.card": {
    padding: "3px 5px",
    ".in": {
      display: "flex",
      margin: "2px 0"
    }
  }
});
export function pagging(ctx: Context): Styles {
  ctx(button);
  return {
    [cc(C.pagging)]: {

    }
  }
}
export const all = (fn: StyleFnAdd<Pallete>) => fn(grid)(tree)(pagging)(card);