import { h } from "preact";
import Counter from "../islands/Counter.tsx";
export default function Home() {
    return (h("div", null,
        h("img", { src: "/logo.svg", height: "100px", alt: "the fresh logo: a sliced lemon dripping with juice" }),
        h("p", null, "Welcome to `fresh`. Try update this message in the ./routes/index.tsx file, and refresh."),
        h(Counter, { start: 3 })));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLE9BQU8sTUFBTSx3QkFBd0IsQ0FBQztBQUU3QyxNQUFNLENBQUMsT0FBTyxVQUFVLElBQUk7SUFDMUIsT0FBTyxDQUNMO1FBQ0UsV0FDRSxHQUFHLEVBQUMsV0FBVyxFQUNmLE1BQU0sRUFBQyxPQUFPLEVBQ2QsR0FBRyxFQUFDLG9EQUFvRCxHQUN4RDtRQUNGLHdHQUdJO1FBQ0osRUFBQyxPQUFPLElBQUMsS0FBSyxFQUFFLENBQUMsR0FBSSxDQUNqQixDQUNQLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggaCAqL1xuaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcbmltcG9ydCBDb3VudGVyIGZyb20gXCIuLi9pc2xhbmRzL0NvdW50ZXIudHN4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhvbWUoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxpbWdcbiAgICAgICAgc3JjPVwiL2xvZ28uc3ZnXCJcbiAgICAgICAgaGVpZ2h0PVwiMTAwcHhcIlxuICAgICAgICBhbHQ9XCJ0aGUgZnJlc2ggbG9nbzogYSBzbGljZWQgbGVtb24gZHJpcHBpbmcgd2l0aCBqdWljZVwiXG4gICAgICAvPlxuICAgICAgPHA+XG4gICAgICAgIFdlbGNvbWUgdG8gYGZyZXNoYC4gVHJ5IHVwZGF0ZSB0aGlzIG1lc3NhZ2UgaW4gdGhlIC4vcm91dGVzL2luZGV4LnRzeFxuICAgICAgICBmaWxlLCBhbmQgcmVmcmVzaC5cbiAgICAgIDwvcD5cbiAgICAgIDxDb3VudGVyIHN0YXJ0PXszfSAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuIl19