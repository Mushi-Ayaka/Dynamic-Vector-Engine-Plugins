// [v4.1.5] HTML Master Renderer — Motor de inyección dinámica de HTML/CSS/JS
// Soporta: canvas preset, estilo base de animación, y código manual completo.

const CANVAS_SIZES = {
    '1920x1080': [1920, 1080],
    '1280x720':  [1280, 720],
    '3840x2160': [3840, 2160]
};

// Animaciones base aplicadas sobre master-render-pane si el usuario no escribe JS propio
const BASE_ANIMS = {
    fade:   (el, ip, op, isOutro, utils) => {
        el.style.opacity = isOutro ? (1 - op).toString() : ip.toString();
    },
    slide:  (el, ip, op, isOutro, utils) => {
        el.style.opacity   = isOutro ? (1 - op).toString() : ip.toString();
        el.style.transform = isOutro
            ? `translateX(${utils.lerp(0, -80, utils.easeInOutCubic(op))}px)`
            : `translateX(${utils.lerp(80, 0, utils.easeOutCubic(ip))}px)`;
    },
    zoom:   (el, ip, op, isOutro, utils) => {
        el.style.opacity   = isOutro ? (1 - op).toString() : ip.toString();
        el.style.transform = isOutro
            ? `scale(${utils.lerp(1, 0.92, utils.easeInOutCubic(op))})`
            : `scale(${utils.lerp(0.88, 1, utils.easeOutCubic(ip))})`;
    },
    bounce: (el, ip, op, isOutro, utils) => {
        const s = utils.spring(ip, 280, 14);
        el.style.opacity   = isOutro ? (1 - op).toString() : ip.toString();
        el.style.transform = isOutro
            ? `scale(${utils.lerp(1, 0.8, utils.easeInOutCubic(op))})`
            : `scale(${utils.lerp(0.5, 1, s)})`;
    }
};

dvEngine.register({
    awake: (ctx) => {
        ctx.refs.root  = ctx.root.getElementById('master-root');
        ctx.refs.style = ctx.root.getElementById('master-dynamic-style');
        ctx.refs.pane  = ctx.root.getElementById('master-render-pane');

        ctx._lastHtml = null;
        ctx._lastCss  = null;
        ctx._lastJs   = null;
        ctx._injectedFn = null;

        // Estilos base del pane
        if (ctx.refs.pane) {
            ctx.refs.pane.style.width    = '100%';
            ctx.refs.pane.style.height   = '100%';
            ctx.refs.pane.style.position = 'relative';
        }
    },

    update: (ctx) => {
        const { props, refs, timeline, utils } = ctx;
        const { root, style, pane } = refs;
        if (!pane || !style || !root) return;

        // 1. Tamaño de canvas según preset
        const [w, h] = CANVAS_SIZES[props.canvasPreset] || [1920, 1080];
        root.style.width    = `${w}px`;
        root.style.height   = `${h}px`;
        root.style.position = 'absolute';
        root.style.overflow = 'hidden';

        // 2. Color de marca desde Preset
        root.style.setProperty('--accent', props.brandPrimaryColor || '#E44C30');

        // 3. Inyectar CSS dinámico (solo si cambió)
        const currentCss = props.cssCode || '';
        if (ctx._lastCss !== currentCss) {
            style.textContent = currentCss;
            ctx._lastCss = currentCss;
        }

        // 4. Inyectar HTML dinámico (solo si cambió, resetea el JS inyectado)
        const currentHtml = props.htmlCode || '';
        if (ctx._lastHtml !== currentHtml) {
            pane.innerHTML      = currentHtml;
            ctx._lastHtml       = currentHtml;
            ctx._injectedFn     = null; // Forzar re-evaluación del JS
            ctx._lastJs         = null;
        }

        // 5. Inyectar y ejecutar JS personalizado del usuario (solo una vez si cambia)
        const currentJs = (props.jsCode || '').trim();
        if (currentJs && ctx._lastJs !== currentJs) {
            ctx._lastJs = currentJs;
            try {
                // Creamos una función segura en el scope del pane
                const fn = new Function('dvEngine', 'ctx', currentJs);
                // Mini dvEngine local para capturar el register del usuario
                const miniEngine = {
                    _registered: null,
                    register(def) { this._registered = def; }
                };
                fn(miniEngine, ctx);
                if (miniEngine._registered) {
                    ctx._injectedFn = miniEngine._registered;
                    if (ctx._injectedFn.awake) ctx._injectedFn.awake(ctx);
                }
            } catch(e) {
                console.warn('[HTML Master] Error en JS del usuario:', e.message);
            }
        }

        // 6. Ejecutar update del JS inyectado por el usuario si existe
        if (ctx._injectedFn && ctx._injectedFn.update) {
            try {
                ctx._injectedFn.update(ctx);
            } catch(e) {
                console.warn('[HTML Master] Error en update del usuario:', e.message);
            }
            return; // El usuario controla la animación, no aplicar base
        }

        // 7. Aplicar animación base si el usuario no escribió JS
        const style_ = props.animStyle || 'none';
        const ip = utils.clamp(timeline.introProgress, 0, 1);
        const op = utils.clamp(timeline.outroProgress, 0, 1);
        if (BASE_ANIMS[style_]) {
            BASE_ANIMS[style_](pane, ip, op, timeline.isOutro, utils);
        }
    }
});
