import { resolveImportMap, resolveModuleSpecifier, toFileUrl, } from "./deps.ts";
import { load as nativeLoad } from "./src/native_loader.ts";
import { load as portableLoad } from "./src/portable_loader.ts";
export const DEFAULT_LOADER = typeof Deno.run === "function" ? "native" : "portable";
export function denoPlugin(options = {}) {
    const loader = options.loader ?? DEFAULT_LOADER;
    return {
        name: "deno",
        setup(build) {
            const infoCache = new Map();
            let importMap = null;
            build.onStart(async function onStart() {
                if (options.importMapURL !== undefined) {
                    const resp = await fetch(options.importMapURL.href);
                    const txt = await resp.text();
                    importMap = resolveImportMap(JSON.parse(txt), options.importMapURL);
                }
                else {
                    importMap = null;
                }
            });
            build.onResolve({ filter: /.*/ }, function onResolve(args) {
                const resolveDir = args.resolveDir
                    ? `${toFileUrl(args.resolveDir).href}/`
                    : "";
                const referrer = args.importer || resolveDir;
                let resolved;
                if (importMap !== null) {
                    const res = resolveModuleSpecifier(args.path, importMap, new URL(referrer) || undefined);
                    resolved = new URL(res);
                }
                else {
                    resolved = new URL(args.path, referrer);
                }
                return { path: resolved.href, namespace: "deno" };
            });
            build.onLoad({ filter: /.*/ }, function onLoad(args) {
                const url = new URL(args.path);
                switch (loader) {
                    case "native":
                        return nativeLoad(infoCache, url, options);
                    case "portable":
                        return portableLoad(url, options);
                }
            });
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFHTCxnQkFBZ0IsRUFDaEIsc0JBQXNCLEVBQ3RCLFNBQVMsR0FDVixNQUFNLFdBQVcsQ0FBQztBQUNuQixPQUFPLEVBQUUsSUFBSSxJQUFJLFVBQVUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxJQUFJLElBQUksWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFzQmhFLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FDekIsT0FBTyxJQUFJLENBQUMsR0FBRyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFFekQsTUFBTSxVQUFVLFVBQVUsQ0FBQyxVQUE2QixFQUFFO0lBQ3hELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksY0FBYyxDQUFDO0lBQ2hELE9BQU87UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLEtBQUssQ0FBQyxLQUFLO1lBQ1QsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7WUFDakQsSUFBSSxTQUFTLEdBQXFCLElBQUksQ0FBQztZQUV2QyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssVUFBVSxPQUFPO2dCQUNsQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEtBQUssU0FBUyxFQUFFO29CQUN0QyxNQUFNLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDOUIsU0FBUyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUNyRTtxQkFBTTtvQkFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDO2lCQUNsQjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxTQUFTLFNBQVMsQ0FDbEQsSUFBMkI7Z0JBRTNCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVO29CQUNoQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRztvQkFDdkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDUCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLFVBQVUsQ0FBQztnQkFDN0MsSUFBSSxRQUFhLENBQUM7Z0JBQ2xCLElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtvQkFDdEIsTUFBTSxHQUFHLEdBQUcsc0JBQXNCLENBQ2hDLElBQUksQ0FBQyxJQUFJLEVBQ1QsU0FBUyxFQUNULElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFNBQVMsQ0FDL0IsQ0FBQztvQkFDRixRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3pCO3FCQUFNO29CQUNMLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUN6QztnQkFDRCxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxTQUFTLE1BQU0sQ0FDNUMsSUFBd0I7Z0JBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0IsUUFBUSxNQUFNLEVBQUU7b0JBQ2QsS0FBSyxRQUFRO3dCQUNYLE9BQU8sVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzdDLEtBQUssVUFBVTt3QkFDYixPQUFPLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQ3JDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBlc2J1aWxkLFxuICBJbXBvcnRNYXAsXG4gIHJlc29sdmVJbXBvcnRNYXAsXG4gIHJlc29sdmVNb2R1bGVTcGVjaWZpZXIsXG4gIHRvRmlsZVVybCxcbn0gZnJvbSBcIi4vZGVwcy50c1wiO1xuaW1wb3J0IHsgbG9hZCBhcyBuYXRpdmVMb2FkIH0gZnJvbSBcIi4vc3JjL25hdGl2ZV9sb2FkZXIudHNcIjtcbmltcG9ydCB7IGxvYWQgYXMgcG9ydGFibGVMb2FkIH0gZnJvbSBcIi4vc3JjL3BvcnRhYmxlX2xvYWRlci50c1wiO1xuaW1wb3J0IHsgTW9kdWxlRW50cnkgfSBmcm9tIFwiLi9zcmMvZGVuby50c1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERlbm9QbHVnaW5PcHRpb25zIHtcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIFVSTCB0byBhbiBpbXBvcnQgbWFwIHRvIHVzZSB3aGVuIHJlc29sdmluZyBpbXBvcnQgc3BlY2lmaWVycy5cbiAgICogVGhlIFVSTCBtdXN0IGJlIGZldGNoYWJsZSB3aXRoIGBmZXRjaGAuXG4gICAqL1xuICBpbXBvcnRNYXBVUkw/OiBVUkw7XG4gIC8qKlxuICAgKiBTcGVjaWZ5IHdoaWNoIGxvYWRlciB0byB1c2UuIEJ5IGRlZmF1bHQgdGhpcyB3aWxsIHVzZSB0aGUgYG5hdGl2ZWAgbG9hZGVyLFxuICAgKiB1bmxlc3MgYERlbm8ucnVuYCBpcyBub3QgYXZhaWxhYmxlLlxuICAgKlxuICAgKiAtIGBuYXRpdmVgOiAgICAgU2hlbGxzIG91dCB0byB0aGUgRGVubyBleGVjdWF0YmxlIHVuZGVyIHRoZSBob29kIHRvIGxvYWRcbiAgICogICAgICAgICAgICAgICAgIGZpbGVzLiBSZXF1aXJlcyAtLWFsbG93LXJlYWQgYW5kIC0tYWxsb3ctcnVuLlxuICAgKiAtIGBwb3J0YWJsZWA6ICAgRG8gbW9kdWxlIGRvd25sb2FkaW5nIGFuZCBjYWNoaW5nIHdpdGggb25seSBXZWIgQVBJcy5cbiAgICogICAgICAgICAgICAgICAgIFJlcXVpcmVzIC0tYWxsb3ctbmV0LlxuICAgKi9cbiAgbG9hZGVyPzogXCJuYXRpdmVcIiB8IFwicG9ydGFibGVcIjtcbn1cblxuLyoqIFRoZSBkZWZhdWx0IGxvYWRlciB0byB1c2UuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9MT0FERVI6IFwibmF0aXZlXCIgfCBcInBvcnRhYmxlXCIgPVxuICB0eXBlb2YgRGVuby5ydW4gPT09IFwiZnVuY3Rpb25cIiA/IFwibmF0aXZlXCIgOiBcInBvcnRhYmxlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZW5vUGx1Z2luKG9wdGlvbnM6IERlbm9QbHVnaW5PcHRpb25zID0ge30pOiBlc2J1aWxkLlBsdWdpbiB7XG4gIGNvbnN0IGxvYWRlciA9IG9wdGlvbnMubG9hZGVyID8/IERFRkFVTFRfTE9BREVSO1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwiZGVub1wiLFxuICAgIHNldHVwKGJ1aWxkKSB7XG4gICAgICBjb25zdCBpbmZvQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgTW9kdWxlRW50cnk+KCk7XG4gICAgICBsZXQgaW1wb3J0TWFwOiBJbXBvcnRNYXAgfCBudWxsID0gbnVsbDtcblxuICAgICAgYnVpbGQub25TdGFydChhc3luYyBmdW5jdGlvbiBvblN0YXJ0KCkge1xuICAgICAgICBpZiAob3B0aW9ucy5pbXBvcnRNYXBVUkwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBmZXRjaChvcHRpb25zLmltcG9ydE1hcFVSTC5ocmVmKTtcbiAgICAgICAgICBjb25zdCB0eHQgPSBhd2FpdCByZXNwLnRleHQoKTtcbiAgICAgICAgICBpbXBvcnRNYXAgPSByZXNvbHZlSW1wb3J0TWFwKEpTT04ucGFyc2UodHh0KSwgb3B0aW9ucy5pbXBvcnRNYXBVUkwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGltcG9ydE1hcCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBidWlsZC5vblJlc29sdmUoeyBmaWx0ZXI6IC8uKi8gfSwgZnVuY3Rpb24gb25SZXNvbHZlKFxuICAgICAgICBhcmdzOiBlc2J1aWxkLk9uUmVzb2x2ZUFyZ3MsXG4gICAgICApOiBlc2J1aWxkLk9uUmVzb2x2ZVJlc3VsdCB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCByZXNvbHZlRGlyID0gYXJncy5yZXNvbHZlRGlyXG4gICAgICAgICAgPyBgJHt0b0ZpbGVVcmwoYXJncy5yZXNvbHZlRGlyKS5ocmVmfS9gXG4gICAgICAgICAgOiBcIlwiO1xuICAgICAgICBjb25zdCByZWZlcnJlciA9IGFyZ3MuaW1wb3J0ZXIgfHwgcmVzb2x2ZURpcjtcbiAgICAgICAgbGV0IHJlc29sdmVkOiBVUkw7XG4gICAgICAgIGlmIChpbXBvcnRNYXAgIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCByZXMgPSByZXNvbHZlTW9kdWxlU3BlY2lmaWVyKFxuICAgICAgICAgICAgYXJncy5wYXRoLFxuICAgICAgICAgICAgaW1wb3J0TWFwLFxuICAgICAgICAgICAgbmV3IFVSTChyZWZlcnJlcikgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmVzb2x2ZWQgPSBuZXcgVVJMKHJlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZWQgPSBuZXcgVVJMKGFyZ3MucGF0aCwgcmVmZXJyZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHBhdGg6IHJlc29sdmVkLmhyZWYsIG5hbWVzcGFjZTogXCJkZW5vXCIgfTtcbiAgICAgIH0pO1xuXG4gICAgICBidWlsZC5vbkxvYWQoeyBmaWx0ZXI6IC8uKi8gfSwgZnVuY3Rpb24gb25Mb2FkKFxuICAgICAgICBhcmdzOiBlc2J1aWxkLk9uTG9hZEFyZ3MsXG4gICAgICApOiBQcm9taXNlPGVzYnVpbGQuT25Mb2FkUmVzdWx0IHwgbnVsbD4ge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGFyZ3MucGF0aCk7XG4gICAgICAgIHN3aXRjaCAobG9hZGVyKSB7XG4gICAgICAgICAgY2FzZSBcIm5hdGl2ZVwiOlxuICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxvYWQoaW5mb0NhY2hlLCB1cmwsIG9wdGlvbnMpO1xuICAgICAgICAgIGNhc2UgXCJwb3J0YWJsZVwiOlxuICAgICAgICAgICAgcmV0dXJuIHBvcnRhYmxlTG9hZCh1cmwsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuIl19