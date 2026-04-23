/**
 * [v5.4.0] Studio Master - Corrected Reactive Bridge
 * Separamos el registro del plugin de la función global del usuario.
 */

dvEngine.register({
    awake: (ctx) => {
        ctx.state.lastHtml = null;
        ctx.state.lastCss = null;
        ctx.state.lastJs = null;
        ctx.state.injectedFn = null;
        ctx.state.childCtx = null;
        
        ctx.refs.canvas = ctx.root.getElementById('dv-master-canvas');
        ctx.refs.styleTag = ctx.root.getElementById('dv-master-styles');
    },

    update: (ctx) => {
        const { props, refs, state, frame } = ctx;
        const { canvas, styleTag } = refs;
        if (!canvas || !styleTag) return;

        // 1. Sincronización HTML
        if (state.lastHtml !== props.htmlCode) {
            canvas.innerHTML = props.htmlCode || '';
            state.lastHtml = props.htmlCode;
            state.injectedFn = null;
            state.lastJs = null;
        }

        // 2. Sincronización CSS
        if (state.lastCss !== props.cssCode) {
            styleTag.textContent = props.cssCode || '';
            state.lastCss = props.cssCode;
        }

        // 3. Inyección de JS (Capturando window.renderDVGE del usuario)
        const currentJs = (props.jsCode || '').trim();
        if (currentJs && state.lastJs !== currentJs) {
            state.lastJs = currentJs;
            try {
                // Creamos un sandbox limpio para buscar la función del usuario
                const sandbox = { renderDVGE: null };
                const sandboxCode = `
                    (function(sandbox, ctx) {
                        "use strict";
                        const window = { renderDVGE: null };
                        const dvEngine = { register: () => {} }; // Mock
                        ${currentJs}
                        sandbox.renderDVGE = window.renderDVGE;
                    })(arguments[0], arguments[1])
                `;
                
                const fn = new Function(sandboxCode);
                fn(sandbox, ctx);
                
                if (sandbox.renderDVGE) {
                    state.injectedFn = sandbox.renderDVGE;
                    state.childCtx = { ...ctx, state: {}, refs: {}, parent: ctx };
                }
            } catch (e) {
                console.error('[Studio Master] JS Error:', e.message);
            }
        }

        // 4. Ejecución del renderizado del usuario
        if (state.injectedFn) {
            try {
                state.childCtx.frame = frame;
                state.childCtx.props = props;
                state.childCtx.timeline = ctx.timeline;
                state.injectedFn(frame, props, state.childCtx);
            } catch (e) {
                // Silenciamos errores de runtime para evitar spam en consola
            }
        }
    }
});
