/**
 * [v5.4.0] Studio Master - Reactive Engine Bridge
 * Sincronización de alta fidelidad entre el motor core y el código de usuario.
 */

let lastHtml = null;
let lastCss = null;
let lastJs = null;
let injectedFn = null;
let childCtx = null;

window.renderDVGE = (frame, props, ctx) => {
    const canvas = ctx.root.getElementById('dv-master-canvas');
    const styleTag = ctx.root.getElementById('dv-master-styles');
    if (!canvas || !styleTag) return;

    // 1. Sincronización de Estructura (HTML)
    if (lastHtml !== props.htmlCode) {
        canvas.innerHTML = props.htmlCode || '';
        lastHtml = props.htmlCode;
        // Al cambiar el HTML, forzamos la reinyección del JS
        injectedFn = null; 
        lastJs = null;
    }

    // 2. Sincronización de Estilo (CSS)
    if (lastCss !== props.cssCode) {
        styleTag.textContent = props.cssCode || '';
        lastCss = props.cssCode;
    }

    // 3. Sincronización de Lógica (JS)
    const currentJs = (props.jsCode || '').trim();
    if (currentJs && lastJs !== currentJs) {
        lastJs = currentJs;
        try {
            // Limpieza de referencias previas
            delete window._tempRender;
            
            /**
             * [v5.4.0] Smart Sandbox:
             * Envolvemos el código del usuario en un entorno que busca window.renderDVGE
             */
            const sandboxCode = `
                "use strict";
                ${currentJs}
                if (window.renderDVGE) {
                    window._tempRender = window.renderDVGE;
                }
            `;
            
            // Ejecución segura
            const fn = new Function('ctx', sandboxCode);
            fn(ctx);
            
            if (window._tempRender) {
                injectedFn = window._tempRender;
                // Inicializamos el objeto de estado persistente del usuario si no existe
                childCtx = { 
                    ...ctx, 
                    state: {}, 
                    refs: {},
                    parent: ctx
                };
            }
        } catch (e) {
            console.error('[Studio Master] JS Error:', e.message);
            canvas.innerHTML = `<div class="dv-glass" style="padding:20px; color:#ff4444; border:1px solid #ff4444;">
                <strong>JS Compile Error:</strong><br>${e.message}
            </div>`;
        }
    }

    // 4. Loop de Ejecución (Sincronización Atómica)
    if (injectedFn) {
        try {
            /**
             * [DETECTIVE-FIX]: Actualizamos el contexto hijo con los valores 
             * más frescos del motor padre antes de cada llamada.
             */
            childCtx.frame = frame;
            childCtx.props = props;
            childCtx.timeline = ctx.timeline;
            
            injectedFn(frame, props, childCtx);
        } catch (e) {
            if (!ctx._errorLogged) {
                console.warn('[Studio Master] Runtime Error:', e.message);
                ctx._errorLogged = true;
            }
        }
    }
};
