import { renderToString } from "preact-render-to-string";
import { h, options } from "preact";
import { HEAD_CONTEXT } from "../runtime/head.ts";
import { CSP_CONTEXT, nonce, NONE, UNSAFE_INLINE } from "../runtime/csp.ts";
import { bundleAssetUrl } from "./constants.ts";
import { assetHashingHook } from "../runtime/utils.ts";
export class RenderContext {
    #id;
    #state = new Map();
    #styles = [];
    #url;
    #route;
    #lang;
    constructor(id, url, route, lang) {
        this.#id = id;
        this.#url = url;
        this.#route = route;
        this.#lang = lang;
    }
    get id() {
        return this.#id;
    }
    get state() {
        return this.#state;
    }
    get styles() {
        return this.#styles;
    }
    get url() {
        return this.#url;
    }
    get route() {
        return this.#route;
    }
    get lang() {
        return this.#lang;
    }
    set lang(lang) {
        this.#lang = lang;
    }
}
function defaultCsp() {
    return {
        directives: { defaultSrc: [NONE], styleSrc: [UNSAFE_INLINE] },
        reportOnly: false,
    };
}
export async function render(opts) {
    const props = {
        params: opts.params,
        url: opts.url,
        route: opts.route.pattern,
        data: opts.data,
    };
    if (opts.error) {
        props.error = opts.error;
    }
    const csp = opts.route.csp
        ? defaultCsp()
        : undefined;
    const headComponents = [];
    const vnode = h(CSP_CONTEXT.Provider, {
        value: csp,
        children: h(HEAD_CONTEXT.Provider, {
            value: headComponents,
            children: h(opts.app.default, {
                Component() {
                    return h(opts.route.component, props);
                },
            }),
        }),
    });
    const ctx = new RenderContext(crypto.randomUUID(), opts.url, opts.route.pattern, opts.lang ?? "en");
    if (csp) {
        const newCsp = defaultCsp();
        csp.directives = newCsp.directives;
        csp.reportOnly = newCsp.reportOnly;
    }
    headComponents.splice(0, headComponents.length);
    ISLANDS.splice(0, ISLANDS.length, ...opts.islands);
    ENCOUNTERED_ISLANDS.clear();
    ISLAND_PROPS = [];
    let bodyHtml = null;
    function render() {
        bodyHtml = renderToString(vnode);
        return bodyHtml;
    }
    await opts.renderFn(ctx, render);
    if (bodyHtml === null) {
        throw new Error("The `render` function was not called by the renderer.");
    }
    const imports = opts.imports.map((url) => {
        const randomNonce = crypto.randomUUID().replace(/-/g, "");
        if (csp) {
            csp.directives.scriptSrc = [
                ...csp.directives.scriptSrc ?? [],
                nonce(randomNonce),
            ];
        }
        return [url, randomNonce];
    });
    if (ENCOUNTERED_ISLANDS.size > 0) {
        {
            const randomNonce = crypto.randomUUID().replace(/-/g, "");
            if (csp) {
                csp.directives.scriptSrc = [
                    ...csp.directives.scriptSrc ?? [],
                    nonce(randomNonce),
                ];
            }
            const url = bundleAssetUrl("/main.js");
            imports.push([url, randomNonce]);
        }
        let islandImports = "";
        let islandRegistry = "";
        for (const island of ENCOUNTERED_ISLANDS) {
            const randomNonce = crypto.randomUUID().replace(/-/g, "");
            if (csp) {
                csp.directives.scriptSrc = [
                    ...csp.directives.scriptSrc ?? [],
                    nonce(randomNonce),
                ];
            }
            const url = bundleAssetUrl(`/island-${island.id}.js`);
            imports.push([url, randomNonce]);
            islandImports += `\nimport ${island.name} from "${url}";`;
            islandRegistry += `\n  ${island.id}: ${island.name},`;
        }
        const initCode = `import { revive } from "${bundleAssetUrl("/main.js")}";${islandImports}\nrevive({${islandRegistry}\n});`;
        const randomNonce = crypto.randomUUID().replace(/-/g, "");
        if (csp) {
            csp.directives.scriptSrc = [
                ...csp.directives.scriptSrc ?? [],
                nonce(randomNonce),
            ];
        }
        bodyHtml +=
            `<script id="__FRSH_ISLAND_PROPS" type="application/json">${JSON.stringify(ISLAND_PROPS)}</script><script type="module" nonce="${randomNonce}">${initCode}</script>`;
    }
    const html = template({
        bodyHtml,
        headComponents,
        imports,
        preloads: opts.preloads,
        styles: ctx.styles,
        lang: ctx.lang,
    });
    return [html, csp];
}
export function template(opts) {
    const page = (h("html", { lang: opts.lang },
        h("head", null,
            h("meta", { charSet: "UTF-8" }),
            h("meta", { "http-equiv": "X-UA-Compatible", content: "IE=edge" }),
            h("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
            opts.preloads.map((src) => h("link", { rel: "modulepreload", href: src })),
            opts.imports.map(([src, nonce]) => (h("script", { src: src, nonce: nonce, type: "module" }))),
            h("style", { id: "__FRSH_STYLE", dangerouslySetInnerHTML: { __html: opts.styles.join("\n") } }),
            opts.headComponents),
        h("body", { dangerouslySetInnerHTML: { __html: opts.bodyHtml } })));
    return "<!DOCTYPE html>" + renderToString(page);
}
const ISLANDS = [];
const ENCOUNTERED_ISLANDS = new Set([]);
let ISLAND_PROPS = [];
const originalHook = options.vnode;
let ignoreNext = false;
options.vnode = (vnode) => {
    assetHashingHook(vnode);
    const originalType = vnode.type;
    if (typeof vnode.type === "function") {
        const island = ISLANDS.find((island) => island.component === originalType);
        if (island) {
            if (ignoreNext) {
                ignoreNext = false;
                return;
            }
            ENCOUNTERED_ISLANDS.add(island);
            vnode.type = (props) => {
                ignoreNext = true;
                const child = h(originalType, props);
                ISLAND_PROPS.push(props);
                return h(`!--frsh-${island.id}:${ISLAND_PROPS.length - 1}--`, null, child);
            };
        }
    }
    if (originalHook)
        originalHook(vnode);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVuZGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxFQUFvQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBU3RFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFNUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBa0J2RCxNQUFNLE9BQU8sYUFBYTtJQUN4QixHQUFHLENBQVM7SUFDWixNQUFNLEdBQXlCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDekMsT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUN2QixJQUFJLENBQU07SUFDVixNQUFNLENBQVM7SUFDZixLQUFLLENBQVM7SUFFZCxZQUFZLEVBQVUsRUFBRSxHQUFRLEVBQUUsS0FBYSxFQUFFLElBQVk7UUFDM0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBR0QsSUFBSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFPRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQVFELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0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QUFFLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksRUFDbkQsSUFBSSxFQUNKLEtBQUssQ0FDTixDQUFDO1lBQ0osQ0FBQyxDQUFDO1NBQ0g7S0FDRjtJQUNELElBQUksWUFBWTtRQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBoICovXG5pbXBvcnQgeyByZW5kZXJUb1N0cmluZyB9IGZyb20gXCJwcmVhY3QtcmVuZGVyLXRvLXN0cmluZ1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50Q2hpbGRyZW4sIENvbXBvbmVudFR5cGUsIGgsIG9wdGlvbnMgfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQge1xuICBBcHBNb2R1bGUsXG4gIEVycm9yUGFnZSxcbiAgSXNsYW5kLFxuICBSZW5kZXJGdW5jdGlvbixcbiAgUm91dGUsXG4gIFVua25vd25QYWdlLFxufSBmcm9tIFwiLi90eXBlcy50c1wiO1xuaW1wb3J0IHsgSEVBRF9DT05URVhUIH0gZnJvbSBcIi4uL3J1bnRpbWUvaGVhZC50c1wiO1xuaW1wb3J0IHsgQ1NQX0NPTlRFWFQsIG5vbmNlLCBOT05FLCBVTlNBRkVfSU5MSU5FIH0gZnJvbSBcIi4uL3J1bnRpbWUvY3NwLnRzXCI7XG5pbXBvcnQgeyBDb250ZW50U2VjdXJpdHlQb2xpY3kgfSBmcm9tIFwiLi4vcnVudGltZS9jc3AudHNcIjtcbmltcG9ydCB7IGJ1bmRsZUFzc2V0VXJsIH0gZnJvbSBcIi4vY29uc3RhbnRzLnRzXCI7XG5pbXBvcnQgeyBhc3NldEhhc2hpbmdIb29rIH0gZnJvbSBcIi4uL3J1bnRpbWUvdXRpbHMudHNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJPcHRpb25zPERhdGE+IHtcbiAgcm91dGU6IFJvdXRlPERhdGE+IHwgVW5rbm93blBhZ2UgfCBFcnJvclBhZ2U7XG4gIGlzbGFuZHM6IElzbGFuZFtdO1xuICBhcHA6IEFwcE1vZHVsZTtcbiAgaW1wb3J0czogc3RyaW5nW107XG4gIHByZWxvYWRzOiBzdHJpbmdbXTtcbiAgdXJsOiBVUkw7XG4gIHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgc3RyaW5nW10+O1xuICByZW5kZXJGbjogUmVuZGVyRnVuY3Rpb247XG4gIGRhdGE/OiBEYXRhO1xuICBlcnJvcj86IHVua25vd247XG4gIGxhbmc/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIElubmVyUmVuZGVyRnVuY3Rpb24gPSAoKSA9PiBzdHJpbmc7XG5cbmV4cG9ydCBjbGFzcyBSZW5kZXJDb250ZXh0IHtcbiAgI2lkOiBzdHJpbmc7XG4gICNzdGF0ZTogTWFwPHN0cmluZywgdW5rbm93bj4gPSBuZXcgTWFwKCk7XG4gICNzdHlsZXM6IHN0cmluZ1tdID0gW107XG4gICN1cmw6IFVSTDtcbiAgI3JvdXRlOiBzdHJpbmc7XG4gICNsYW5nOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgdXJsOiBVUkwsIHJvdXRlOiBzdHJpbmcsIGxhbmc6IHN0cmluZykge1xuICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgdGhpcy4jdXJsID0gdXJsO1xuICAgIHRoaXMuI3JvdXRlID0gcm91dGU7XG4gICAgdGhpcy4jbGFuZyA9IGxhbmc7XG4gIH1cblxuICAvKiogQSB1bmlxdWUgSUQgZm9yIHRoaXMgbG9naWNhbCBKSVQgcmVuZGVyLiAqL1xuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU3RhdGUgdGhhdCBpcyBwZXJzaXN0ZWQgYmV0d2VlbiBtdWx0aXBsZSByZW5kZXJzIHdpdGggdGhlIHNhbWUgcmVuZGVyXG4gICAqIGNvbnRleHQuIFRoaXMgaXMgdXNlZnVsIGJlY2F1c2Ugb25lIGxvZ2ljYWwgSklUIHJlbmRlciBjb3VsZCBoYXZlIG11bHRpcGxlXG4gICAqIHByZWFjdCByZW5kZXIgcGFzc2VzIGR1ZSB0byBzdXNwZW5zZS5cbiAgICovXG4gIGdldCBzdGF0ZSgpOiBNYXA8c3RyaW5nLCB1bmtub3duPiB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbCBvZiB0aGUgQ1NTIHN0eWxlIHJ1bGVzIHRoYXQgc2hvdWxkIGJlIGlubGluZWQgaW50byB0aGUgZG9jdW1lbnQuXG4gICAqIEFkZGluZyB0byB0aGlzIGxpc3QgYWNyb3NzIG11bHRpcGxlIHJlbmRlcnMgaXMgc3VwcG9ydGVkIChldmVuIGFjcm9zc1xuICAgKiBzdXNwZW5zZSEpLiBUaGUgQ1NTIHJ1bGVzIHdpbGwgYWx3YXlzIGJlIGluc2VydGVkIG9uIHRoZSBjbGllbnQgaW4gdGhlXG4gICAqIG9yZGVyIHNwZWNpZmllZCBoZXJlLlxuICAgKi9cbiAgZ2V0IHN0eWxlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0eWxlcztcbiAgfVxuXG4gIC8qKiBUaGUgVVJMIG9mIHRoZSBwYWdlIGJlaW5nIHJlbmRlcmVkLiAqL1xuICBnZXQgdXJsKCk6IFVSTCB7XG4gICAgcmV0dXJuIHRoaXMuI3VybDtcbiAgfVxuXG4gIC8qKiBUaGUgcm91dGUgbWF0Y2hlciAoZS5nLiAvYmxvZy86aWQpIHRoYXQgdGhlIHJlcXVlc3QgbWF0Y2hlZCBmb3IgdGhpcyBwYWdlXG4gICAqIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBnZXQgcm91dGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jcm91dGU7XG4gIH1cblxuICAvKiogVGhlIGxhbmd1YWdlIG9mIHRoZSBwYWdlIGJlaW5nIHJlbmRlcmVkLiBEZWZhdWx0cyB0byBcImVuXCIuICovXG4gIGdldCBsYW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI2xhbmc7XG4gIH1cbiAgc2V0IGxhbmcobGFuZzogc3RyaW5nKSB7XG4gICAgdGhpcy4jbGFuZyA9IGxhbmc7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVmYXVsdENzcCgpIHtcbiAgcmV0dXJuIHtcbiAgICBkaXJlY3RpdmVzOiB7IGRlZmF1bHRTcmM6IFtOT05FXSwgc3R5bGVTcmM6IFtVTlNBRkVfSU5MSU5FXSB9LFxuICAgIHJlcG9ydE9ubHk6IGZhbHNlLFxuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gcmVuZGVycyBvdXQgYSBwYWdlLiBSZW5kZXJpbmcgaXMgYXN5bmNocm9ub3VzLCBhbmQgc3RyZWFtaW5nLlxuICogUmVuZGVyaW5nIGhhcHBlbnMgaW4gbXVsdGlwbGUgc3RlcHMsIGJlY2F1c2Ugb2YgdGhlIG5lZWQgdG8gaGFuZGxlIHN1c3BlbnNlLlxuICpcbiAqIDEuIFRoZSBwYWdlJ3Mgdm5vZGUgdHJlZSBpcyBjb25zdHJ1Y3RlZC5cbiAqIDIuIFRoZSBwYWdlJ3Mgdm5vZGUgdHJlZSBpcyBwYXNzZWQgdG8gdGhlIHJlbmRlcmVyLlxuICogICAtIElmIHRoZSByZW5kZXJpbmcgdGhyb3dzIGEgcHJvbWlzZSwgdGhlIHByb21pc2UgaXMgYXdhaXRlZCBiZWZvcmVcbiAqICAgICBjb250aW51aW5nLiBUaGlzIGFsbG93cyB0aGUgcmVuZGVyZXIgdG8gaGFuZGxlIGFzeW5jIGhvb2tzLlxuICogICAtIE9uY2UgdGhlIHJlbmRlcmluZyB0aHJvd3Mgbm8gbW9yZSBwcm9taXNlcywgdGhlIGluaXRpYWwgcmVuZGVyIGlzXG4gKiAgICAgY29tcGxldGUgYW5kIGEgYm9keSBzdHJpbmcgaXMgcmV0dXJuZWQuXG4gKiAgIC0gRHVyaW5nIHJlbmRlcmluZywgZXZlcnkgdGltZSBhIGA8U3VzcGVuc2U+YCBpcyByZW5kZXJlZCwgaXQsIGFuZCBpdCdzXG4gKiAgICAgYXR0YWNoZWQgY2hpbGRyZW4gYXJlIHJlY29yZGVkIGZvciBsYXRlciByZW5kZXJpbmcuXG4gKiAzLiBPbmNlIHRoZSBpbml0YWwgcmVuZGVyIGlzIGNvbXBsZXRlLCB0aGUgYm9keSBzdHJpbmcgaXMgZml0dGVkIGludG8gdGhlXG4gKiAgICBIVE1MIHdyYXBwZXIgdGVtcGxhdGUuXG4gKiA0LiBUaGUgZnVsbCBpbml0YWwgcmVuZGVyIGluIHRoZSB0ZW1wbGF0ZSBpcyB5aWVsZGVkIHRvIGJlIHNlbnQgdG8gdGhlXG4gKiAgICBjbGllbnQuXG4gKiA1LiBOb3cgdGhlIHN1c3BlbmRlZCB2bm9kZXMgYXJlIHJlbmRlcmVkLiBUaGVzZSBhcmUgaW5kaXZpZHVhbGx5IHJlbmRlcmVkXG4gKiAgICBsaWtlIGRlc2NyaWJlZCBpbiBzdGVwIDIgYWJvdmUuIE9uY2UgZWFjaCBub2RlIGlzIGRvbmUgcmVuZGVyaW5nLCBpdFxuICogICAgd3JhcHBlZCBpbiBzb21lIGJvaWxkZXJwbGF0ZSBIVE1MLCBhbmQgc3VmZml4ZWQgd2l0aCBzb21lIEpTLCBhbmQgdGhlblxuICogICAgc2VudCB0byB0aGUgY2xpZW50LiBPbiB0aGUgY2xpZW50IHRoZSBIVE1MIHdpbGwgYmUgc2xvdHRlZCBpbnRvIHRoZSBET01cbiAqICAgIGF0IHRoZSBsb2NhdGlvbiBvZiB0aGUgb3JpZ2luYWwgYDxTdXNwZW5zZT5gIG5vZGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5kZXI8RGF0YT4oXG4gIG9wdHM6IFJlbmRlck9wdGlvbnM8RGF0YT4sXG4pOiBQcm9taXNlPFtzdHJpbmcsIENvbnRlbnRTZWN1cml0eVBvbGljeSB8IHVuZGVmaW5lZF0+IHtcbiAgY29uc3QgcHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge1xuICAgIHBhcmFtczogb3B0cy5wYXJhbXMsXG4gICAgdXJsOiBvcHRzLnVybCxcbiAgICByb3V0ZTogb3B0cy5yb3V0ZS5wYXR0ZXJuLFxuICAgIGRhdGE6IG9wdHMuZGF0YSxcbiAgfTtcbiAgaWYgKG9wdHMuZXJyb3IpIHtcbiAgICBwcm9wcy5lcnJvciA9IG9wdHMuZXJyb3I7XG4gIH1cblxuICBjb25zdCBjc3A6IENvbnRlbnRTZWN1cml0eVBvbGljeSB8IHVuZGVmaW5lZCA9IG9wdHMucm91dGUuY3NwXG4gICAgPyBkZWZhdWx0Q3NwKClcbiAgICA6IHVuZGVmaW5lZDtcbiAgY29uc3QgaGVhZENvbXBvbmVudHM6IENvbXBvbmVudENoaWxkcmVuW10gPSBbXTtcblxuICBjb25zdCB2bm9kZSA9IGgoQ1NQX0NPTlRFWFQuUHJvdmlkZXIsIHtcbiAgICB2YWx1ZTogY3NwLFxuICAgIGNoaWxkcmVuOiBoKEhFQURfQ09OVEVYVC5Qcm92aWRlciwge1xuICAgICAgdmFsdWU6IGhlYWRDb21wb25lbnRzLFxuICAgICAgY2hpbGRyZW46IGgob3B0cy5hcHAuZGVmYXVsdCwge1xuICAgICAgICBDb21wb25lbnQoKSB7XG4gICAgICAgICAgcmV0dXJuIGgob3B0cy5yb3V0ZS5jb21wb25lbnQhIGFzIENvbXBvbmVudFR5cGU8dW5rbm93bj4sIHByb3BzKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pLFxuICB9KTtcblxuICBjb25zdCBjdHggPSBuZXcgUmVuZGVyQ29udGV4dChcbiAgICBjcnlwdG8ucmFuZG9tVVVJRCgpLFxuICAgIG9wdHMudXJsLFxuICAgIG9wdHMucm91dGUucGF0dGVybixcbiAgICBvcHRzLmxhbmcgPz8gXCJlblwiLFxuICApO1xuXG4gIGlmIChjc3ApIHtcbiAgICAvLyBDbGVhciB0aGUgY3NwXG4gICAgY29uc3QgbmV3Q3NwID0gZGVmYXVsdENzcCgpO1xuICAgIGNzcC5kaXJlY3RpdmVzID0gbmV3Q3NwLmRpcmVjdGl2ZXM7XG4gICAgY3NwLnJlcG9ydE9ubHkgPSBuZXdDc3AucmVwb3J0T25seTtcbiAgfVxuICAvLyBDbGVhciB0aGUgaGVhZCBjb21wb25lbnRzXG4gIGhlYWRDb21wb25lbnRzLnNwbGljZSgwLCBoZWFkQ29tcG9uZW50cy5sZW5ndGgpO1xuXG4gIC8vIFNldHVwIHRoZSBpbnRlcmVzdGluZyBWTm9kZSB0eXBlc1xuICBJU0xBTkRTLnNwbGljZSgwLCBJU0xBTkRTLmxlbmd0aCwgLi4ub3B0cy5pc2xhbmRzKTtcblxuICAvLyBDbGVhciB0aGUgZW5jb3VudGVyZWQgdm5vZGVzXG4gIEVOQ09VTlRFUkVEX0lTTEFORFMuY2xlYXIoKTtcblxuICAvLyBDbGVhciB0aGUgaXNsYW5kIHByb3BzXG4gIElTTEFORF9QUk9QUyA9IFtdO1xuXG4gIGxldCBib2R5SHRtbDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGJvZHlIdG1sID0gcmVuZGVyVG9TdHJpbmcodm5vZGUpO1xuICAgIHJldHVybiBib2R5SHRtbDtcbiAgfVxuXG4gIGF3YWl0IG9wdHMucmVuZGVyRm4oY3R4LCByZW5kZXIgYXMgSW5uZXJSZW5kZXJGdW5jdGlvbik7XG5cbiAgaWYgKGJvZHlIdG1sID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGByZW5kZXJgIGZ1bmN0aW9uIHdhcyBub3QgY2FsbGVkIGJ5IHRoZSByZW5kZXJlci5cIik7XG4gIH1cblxuICBjb25zdCBpbXBvcnRzID0gb3B0cy5pbXBvcnRzLm1hcCgodXJsKSA9PiB7XG4gICAgY29uc3QgcmFuZG9tTm9uY2UgPSBjcnlwdG8ucmFuZG9tVVVJRCgpLnJlcGxhY2UoLy0vZywgXCJcIik7XG4gICAgaWYgKGNzcCkge1xuICAgICAgY3NwLmRpcmVjdGl2ZXMuc2NyaXB0U3JjID0gW1xuICAgICAgICAuLi5jc3AuZGlyZWN0aXZlcy5zY3JpcHRTcmMgPz8gW10sXG4gICAgICAgIG5vbmNlKHJhbmRvbU5vbmNlKSxcbiAgICAgIF07XG4gICAgfVxuICAgIHJldHVybiBbdXJsLCByYW5kb21Ob25jZV0gYXMgY29uc3Q7XG4gIH0pO1xuXG4gIGlmIChFTkNPVU5URVJFRF9JU0xBTkRTLnNpemUgPiAwKSB7XG4gICAgLy8gTG9hZCB0aGUgbWFpbi5qcyBzY3JpcHRcbiAgICB7XG4gICAgICBjb25zdCByYW5kb21Ob25jZSA9IGNyeXB0by5yYW5kb21VVUlEKCkucmVwbGFjZSgvLS9nLCBcIlwiKTtcbiAgICAgIGlmIChjc3ApIHtcbiAgICAgICAgY3NwLmRpcmVjdGl2ZXMuc2NyaXB0U3JjID0gW1xuICAgICAgICAgIC4uLmNzcC5kaXJlY3RpdmVzLnNjcmlwdFNyYyA/PyBbXSxcbiAgICAgICAgICBub25jZShyYW5kb21Ob25jZSksXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgICBjb25zdCB1cmwgPSBidW5kbGVBc3NldFVybChcIi9tYWluLmpzXCIpO1xuICAgICAgaW1wb3J0cy5wdXNoKFt1cmwsIHJhbmRvbU5vbmNlXSBhcyBjb25zdCk7XG4gICAgfVxuXG4gICAgLy8gUHJlcGFyZSB0aGUgaW5saW5lIHNjcmlwdCB0aGF0IGxvYWRzIGFuZCByZXZpdmVzIHRoZSBpc2xhbmRzXG4gICAgbGV0IGlzbGFuZEltcG9ydHMgPSBcIlwiO1xuICAgIGxldCBpc2xhbmRSZWdpc3RyeSA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBpc2xhbmQgb2YgRU5DT1VOVEVSRURfSVNMQU5EUykge1xuICAgICAgY29uc3QgcmFuZG9tTm9uY2UgPSBjcnlwdG8ucmFuZG9tVVVJRCgpLnJlcGxhY2UoLy0vZywgXCJcIik7XG4gICAgICBpZiAoY3NwKSB7XG4gICAgICAgIGNzcC5kaXJlY3RpdmVzLnNjcmlwdFNyYyA9IFtcbiAgICAgICAgICAuLi5jc3AuZGlyZWN0aXZlcy5zY3JpcHRTcmMgPz8gW10sXG4gICAgICAgICAgbm9uY2UocmFuZG9tTm9uY2UpLFxuICAgICAgICBdO1xuICAgICAgfVxuICAgICAgY29uc3QgdXJsID0gYnVuZGxlQXNzZXRVcmwoYC9pc2xhbmQtJHtpc2xhbmQuaWR9LmpzYCk7XG4gICAgICBpbXBvcnRzLnB1c2goW3VybCwgcmFuZG9tTm9uY2VdIGFzIGNvbnN0KTtcbiAgICAgIGlzbGFuZEltcG9ydHMgKz0gYFxcbmltcG9ydCAke2lzbGFuZC5uYW1lfSBmcm9tIFwiJHt1cmx9XCI7YDtcbiAgICAgIGlzbGFuZFJlZ2lzdHJ5ICs9IGBcXG4gICR7aXNsYW5kLmlkfTogJHtpc2xhbmQubmFtZX0sYDtcbiAgICB9XG4gICAgY29uc3QgaW5pdENvZGUgPSBgaW1wb3J0IHsgcmV2aXZlIH0gZnJvbSBcIiR7XG4gICAgICBidW5kbGVBc3NldFVybChcIi9tYWluLmpzXCIpXG4gICAgfVwiOyR7aXNsYW5kSW1wb3J0c31cXG5yZXZpdmUoeyR7aXNsYW5kUmVnaXN0cnl9XFxufSk7YDtcblxuICAgIC8vIEFwcGVuZCB0aGUgaW5saW5lIHNjcmlwdCB0byB0aGUgYm9keVxuICAgIGNvbnN0IHJhbmRvbU5vbmNlID0gY3J5cHRvLnJhbmRvbVVVSUQoKS5yZXBsYWNlKC8tL2csIFwiXCIpO1xuICAgIGlmIChjc3ApIHtcbiAgICAgIGNzcC5kaXJlY3RpdmVzLnNjcmlwdFNyYyA9IFtcbiAgICAgICAgLi4uY3NwLmRpcmVjdGl2ZXMuc2NyaXB0U3JjID8/IFtdLFxuICAgICAgICBub25jZShyYW5kb21Ob25jZSksXG4gICAgICBdO1xuICAgIH1cbiAgICAoYm9keUh0bWwgYXMgc3RyaW5nKSArPVxuICAgICAgYDxzY3JpcHQgaWQ9XCJfX0ZSU0hfSVNMQU5EX1BST1BTXCIgdHlwZT1cImFwcGxpY2F0aW9uL2pzb25cIj4ke1xuICAgICAgICBKU09OLnN0cmluZ2lmeShJU0xBTkRfUFJPUFMpXG4gICAgICB9PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwibW9kdWxlXCIgbm9uY2U9XCIke3JhbmRvbU5vbmNlfVwiPiR7aW5pdENvZGV9PC9zY3JpcHQ+YDtcbiAgfVxuXG4gIGNvbnN0IGh0bWwgPSB0ZW1wbGF0ZSh7XG4gICAgYm9keUh0bWwsXG4gICAgaGVhZENvbXBvbmVudHMsXG4gICAgaW1wb3J0cyxcbiAgICBwcmVsb2Fkczogb3B0cy5wcmVsb2FkcyxcbiAgICBzdHlsZXM6IGN0eC5zdHlsZXMsXG4gICAgbGFuZzogY3R4LmxhbmcsXG4gIH0pO1xuXG4gIHJldHVybiBbaHRtbCwgY3NwXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZU9wdGlvbnMge1xuICBib2R5SHRtbDogc3RyaW5nO1xuICBoZWFkQ29tcG9uZW50czogQ29tcG9uZW50Q2hpbGRyZW5bXTtcbiAgaW1wb3J0czogKHJlYWRvbmx5IFtzdHJpbmcsIHN0cmluZ10pW107XG4gIHN0eWxlczogc3RyaW5nW107XG4gIHByZWxvYWRzOiBzdHJpbmdbXTtcbiAgbGFuZzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUob3B0czogVGVtcGxhdGVPcHRpb25zKTogc3RyaW5nIHtcbiAgY29uc3QgcGFnZSA9IChcbiAgICA8aHRtbCBsYW5nPXtvcHRzLmxhbmd9PlxuICAgICAgPGhlYWQ+XG4gICAgICAgIDxtZXRhIGNoYXJTZXQ9XCJVVEYtOFwiIC8+XG4gICAgICAgIDxtZXRhIGh0dHAtZXF1aXY9XCJYLVVBLUNvbXBhdGlibGVcIiBjb250ZW50PVwiSUU9ZWRnZVwiIC8+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCIgLz5cbiAgICAgICAge29wdHMucHJlbG9hZHMubWFwKChzcmMpID0+IDxsaW5rIHJlbD1cIm1vZHVsZXByZWxvYWRcIiBocmVmPXtzcmN9IC8+KX1cbiAgICAgICAge29wdHMuaW1wb3J0cy5tYXAoKFtzcmMsIG5vbmNlXSkgPT4gKFxuICAgICAgICAgIDxzY3JpcHQgc3JjPXtzcmN9IG5vbmNlPXtub25jZX0gdHlwZT1cIm1vZHVsZVwiPjwvc2NyaXB0PlxuICAgICAgICApKX1cbiAgICAgICAgPHN0eWxlXG4gICAgICAgICAgaWQ9XCJfX0ZSU0hfU1RZTEVcIlxuICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogb3B0cy5zdHlsZXMuam9pbihcIlxcblwiKSB9fVxuICAgICAgICAvPlxuICAgICAgICB7b3B0cy5oZWFkQ29tcG9uZW50c31cbiAgICAgIDwvaGVhZD5cbiAgICAgIDxib2R5IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogb3B0cy5ib2R5SHRtbCB9fSAvPlxuICAgIDwvaHRtbD5cbiAgKTtcblxuICByZXR1cm4gXCI8IURPQ1RZUEUgaHRtbD5cIiArIHJlbmRlclRvU3RyaW5nKHBhZ2UpO1xufVxuXG4vLyBTZXQgdXAgYSBwcmVhY3Qgb3B0aW9uIGhvb2sgdG8gdHJhY2sgd2hlbiB2bm9kZSB3aXRoIGN1c3RvbSBmdW5jdGlvbnMgYXJlXG4vLyBjcmVhdGVkLlxuY29uc3QgSVNMQU5EUzogSXNsYW5kW10gPSBbXTtcbmNvbnN0IEVOQ09VTlRFUkVEX0lTTEFORFM6IFNldDxJc2xhbmQ+ID0gbmV3IFNldChbXSk7XG5sZXQgSVNMQU5EX1BST1BTOiB1bmtub3duW10gPSBbXTtcbmNvbnN0IG9yaWdpbmFsSG9vayA9IG9wdGlvbnMudm5vZGU7XG5sZXQgaWdub3JlTmV4dCA9IGZhbHNlO1xub3B0aW9ucy52bm9kZSA9ICh2bm9kZSkgPT4ge1xuICBhc3NldEhhc2hpbmdIb29rKHZub2RlKTtcbiAgY29uc3Qgb3JpZ2luYWxUeXBlID0gdm5vZGUudHlwZSBhcyBDb21wb25lbnRUeXBlPHVua25vd24+O1xuICBpZiAodHlwZW9mIHZub2RlLnR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNvbnN0IGlzbGFuZCA9IElTTEFORFMuZmluZCgoaXNsYW5kKSA9PiBpc2xhbmQuY29tcG9uZW50ID09PSBvcmlnaW5hbFR5cGUpO1xuICAgIGlmIChpc2xhbmQpIHtcbiAgICAgIGlmIChpZ25vcmVOZXh0KSB7XG4gICAgICAgIGlnbm9yZU5leHQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgRU5DT1VOVEVSRURfSVNMQU5EUy5hZGQoaXNsYW5kKTtcbiAgICAgIHZub2RlLnR5cGUgPSAocHJvcHMpID0+IHtcbiAgICAgICAgaWdub3JlTmV4dCA9IHRydWU7XG4gICAgICAgIGNvbnN0IGNoaWxkID0gaChvcmlnaW5hbFR5cGUsIHByb3BzKTtcbiAgICAgICAgSVNMQU5EX1BST1BTLnB1c2gocHJvcHMpO1xuICAgICAgICByZXR1cm4gaChcbiAgICAgICAgICBgIS0tZnJzaC0ke2lzbGFuZC5pZH06JHtJU0xBTkRfUFJPUFMubGVuZ3RoIC0gMX0tLWAsXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBjaGlsZCxcbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChvcmlnaW5hbEhvb2spIG9yaWdpbmFsSG9vayh2bm9kZSk7XG59O1xuIl19