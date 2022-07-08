export { deflate, inflate, gzip, gunzip, zlib, unzlib, } from "./pkg/denoflate.js";
import init from "./pkg/denoflate.js";
import { wasm } from "./pkg/denoflate_bg.wasm.js";
await init(wasm);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxPQUFPLEVBQ1AsT0FBTyxFQUNQLElBQUksRUFDSixNQUFNLEVBQ04sSUFBSSxFQUNKLE1BQU0sR0FDUCxNQUFNLG9CQUFvQixDQUFDO0FBRTVCLE9BQU8sSUFBSSxNQUFNLG9CQUFvQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVsRCxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7XG4gIGRlZmxhdGUsXG4gIGluZmxhdGUsXG4gIGd6aXAsXG4gIGd1bnppcCxcbiAgemxpYixcbiAgdW56bGliLFxufSBmcm9tIFwiLi9wa2cvZGVub2ZsYXRlLmpzXCI7XG5cbmltcG9ydCBpbml0IGZyb20gXCIuL3BrZy9kZW5vZmxhdGUuanNcIjtcbmltcG9ydCB7IHdhc20gfSBmcm9tIFwiLi9wa2cvZGVub2ZsYXRlX2JnLndhc20uanNcIjtcblxuYXdhaXQgaW5pdCh3YXNtKTtcbiJdfQ==