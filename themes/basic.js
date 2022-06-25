"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = exports.pagging = exports.card = exports.tree = exports.grid = void 0;
const galhui_1 = require("galhui");
const basic_1 = require("galhui/themes/basic");
function grid(ctx) {
    return {
        [(0, galhui_1.cc)("grd" /* grid */)]: {
            ["." + "i" /* item */]: {
                display: "inline-block",
                background: "#f45",
                // margin: spc(a.mrg),
                // padding: spc(a.pad),
                textAlign: "center",
                verticalAlign: "top",
                overflow: "hidden",
                textOverflow: "ellipsis",
                ["." + "c" /* icon */]: {
                    display: "block",
                    margin: "auto",
                },
                ["&." + "on" /* on */]: {
                // background: on.bg
                },
                // ["&." + C.a]: {
                //   // border: bord({ c: on.bg }),
                //   // borderRadius: a.rad && (a.rad + "px")
                // }
            },
            ["&." + "xl" /* xl */]: {},
            ["&." + "l" /* l */]: {},
            ["&." + "n" /* n */]: {
                ["." + "i" /* item */]: {
                // width: hs(grid.sz) + "px",
                // minHeight: vs(grid.sz) + "px",
                }
            },
            ["&." + "s" /* s */]: {},
            ["&." + "xs" /* xs */]: {}
        },
        body: {
        // background: "blue",
        }
    };
}
exports.grid = grid;
function tree(ctx) {
    return {
        [(0, galhui_1.cc)("tree" /* tree */)]: {
            overflow: "auto",
            [" ." + "hd" /* head */]: {
                display: "flex",
                flexDirection: "row",
                ["&." + "on" /* on */]: {
                // background: on.bg,
                // color: on.fg,
                }
            }
        }
    };
}
exports.tree = tree;
const card = (ctx) => (ctx(basic_1.input) && {
    "._.card": {
        padding: "3px 5px",
        ".in": {
            display: "flex",
            margin: "2px 0"
        }
    }
});
exports.card = card;
function pagging(ctx) {
    ctx(basic_1.button);
    return {
        [(0, galhui_1.cc)("pag" /* pagging */)]: {}
    };
}
exports.pagging = pagging;
const all = (fn) => fn(grid)(tree)(pagging)(exports.card);
exports.all = all;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBcUM7QUFFckMsK0NBQThFO0FBRTlFLFNBQWdCLElBQUksQ0FBQyxHQUFZO0lBQy9CLE9BQU87UUFDTCxDQUFDLElBQUEsV0FBRSxtQkFBUSxDQUFDLEVBQUU7WUFDWixDQUFDLEdBQUcsaUJBQVMsQ0FBQyxFQUFFO2dCQUNkLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixVQUFVLEVBQUUsTUFBTTtnQkFDbEIsc0JBQXNCO2dCQUN0Qix1QkFBdUI7Z0JBQ3ZCLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixhQUFhLEVBQUUsS0FBSztnQkFDcEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFlBQVksRUFBRSxVQUFVO2dCQUN4QixDQUFDLEdBQUcsaUJBQVMsQ0FBQyxFQUFFO29CQUNkLE9BQU8sRUFBRSxPQUFPO29CQUNoQixNQUFNLEVBQUUsTUFBTTtpQkFDZjtnQkFDRCxDQUFDLElBQUksZ0JBQU8sQ0FBQyxFQUFFO2dCQUNiLG9CQUFvQjtpQkFDckI7Z0JBQ0Qsa0JBQWtCO2dCQUNsQixtQ0FBbUM7Z0JBQ25DLDZDQUE2QztnQkFDN0MsSUFBSTthQUNMO1lBQ0QsQ0FBQyxJQUFJLGdCQUFVLENBQUMsRUFBRSxFQUVqQjtZQUNELENBQUMsSUFBSSxjQUFTLENBQUMsRUFBRSxFQUVoQjtZQUNELENBQUMsSUFBSSxjQUFTLENBQUMsRUFBRTtnQkFDZixDQUFDLEdBQUcsaUJBQVMsQ0FBQyxFQUFFO2dCQUNkLDZCQUE2QjtnQkFDN0IsaUNBQWlDO2lCQUNsQzthQUNGO1lBQ0QsQ0FBQyxJQUFJLGNBQVMsQ0FBQyxFQUFFLEVBRWhCO1lBQ0QsQ0FBQyxJQUFJLGdCQUFVLENBQUMsRUFBRSxFQUVqQjtTQUNGO1FBQ0QsSUFBSSxFQUFFO1FBQ0osc0JBQXNCO1NBQ3ZCO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUEvQ0Qsb0JBK0NDO0FBR0QsU0FBZ0IsSUFBSSxDQUFDLEdBQVk7SUFFL0IsT0FBTztRQUNMLENBQUMsSUFBQSxXQUFFLG9CQUFRLENBQUMsRUFBRTtZQUNaLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLENBQUMsSUFBSSxrQkFBUyxDQUFDLEVBQUU7Z0JBQ2YsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLENBQUMsSUFBSSxnQkFBTyxDQUFDLEVBQUU7Z0JBQ2IscUJBQXFCO2dCQUNyQixnQkFBZ0I7aUJBQ2pCO2FBQ0Y7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBZkQsb0JBZUM7QUFDTSxNQUFNLElBQUksR0FBRyxDQUFDLEdBQVksRUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBSyxDQUFDLElBQUk7SUFDM0QsU0FBUyxFQUFFO1FBQ1QsT0FBTyxFQUFFLFNBQVM7UUFDbEIsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLE1BQU07WUFDZixNQUFNLEVBQUUsT0FBTztTQUNoQjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBUlUsUUFBQSxJQUFJLFFBUWQ7QUFDSCxTQUFnQixPQUFPLENBQUMsR0FBWTtJQUNsQyxHQUFHLENBQUMsY0FBTSxDQUFDLENBQUM7SUFDWixPQUFPO1FBQ0wsQ0FBQyxJQUFBLFdBQUUsc0JBQVcsQ0FBQyxFQUFFLEVBRWhCO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFQRCwwQkFPQztBQUNNLE1BQU0sR0FBRyxHQUFHLENBQUMsRUFBdUIsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQUksQ0FBQyxDQUFDO0FBQWpFLFFBQUEsR0FBRyxPQUE4RCJ9