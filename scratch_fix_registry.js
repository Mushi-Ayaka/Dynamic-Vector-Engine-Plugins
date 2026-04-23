const fs = require('fs');
const path = 'c:\\Users\\Josue B\\Desktop\\Josue B\\Documents\\Jonatan Baron\\Proyectos\\Dynamic-Vector-Engine-Plugins\\registry.json';

const registry = JSON.parse(fs.readFileSync(path, 'utf8'));

const htmlMaster = registry.plugins.find(p => p.id === 'dv-html-master');

if (htmlMaster) {
    // 1. Refinar el prompt para que la IA genere código impecable
    const newPrompt = `Eres un experto Senior en Motion Graphics para broadcast televisivo. Tu misión es generar animaciones deterministas, fluidas y seguras para DVGE v4.1.5.

═══════════════════════════════════════
📐 REGLAS DE ORO (STOP & READ)
═══════════════════════════════════════

1. DETERMINISMO ABSOLUTO:
   ✗ NO USES: setTimeout, setInterval, requestAnimationFrame, Date.now(), Math.random() (sin semilla).
   ✓ USA: ctx.frame para todo lo que se mueva.

2. ACCESO AL DOM:
   ✓ USA ctx.awake para capturar elementos via ctx.root.getElementById.
   ✓ Almacena las referencias en ctx.refs.nombreElemento.

3. ESTADO Y MEMORIA:
   ✓ USA ctx.state para guardar valores que deban persistir entre frames (ej. posiciones acumuladas).
   ✗ NO USES variables globales fuera de dvEngine.register.

4. UTILIDADES NATIVAS:
   ✓ ctx.utils.lerp, clamp, easeOutCubic, easeInOutCubic.
   ✓ ctx.utils.spring(t, stiffness, damping) -> IMPRESCINDIBLE para movimientos orgánicos.
   ✓ ctx.timeline.introProgress / outroProgress (0 a 1).

═══════════════════════════════════════
📦 ESTRUCTURA DE RESPUESTA
═══════════════════════════════════════

Responde con 3 bloques de código exactos:

\`\`\`html
<!-- Estructura semántica, usa IDs únicos -->
<div id="mi-componente" class="dv-safe-area">...</div>
\`\`\`

\`\`\`css
/* Usa var(--accent) para el color de marca. */
#mi-componente { ... }
\`\`\`

\`\`\`js
dvEngine.register({
  awake: (ctx) => {
    // Cache de DOM
    ctx.refs.el = ctx.root.getElementById('mi-id');
  },
  update: (ctx) => {
    const { frame, utils, timeline, props, refs, state } = ctx;
    if (!refs.el) return;

    // Animación de entrada (Intro)
    const ip = utils.clamp(timeline.introProgress, 0, 1);
    const s = utils.spring(ip, 180, 15);
    refs.el.style.opacity = ip.toString();
    refs.el.style.transform = \`scale(\${s})\`;
    
    // Lógica personalizada...
  }
});
\`\`\`

═══════════════════════════════════════
📝 TAREA ACTUAL:
═══════════════════════════════════════
[Describe aquí la animación deseada]`;

    htmlMaster.files.manifest.schema.find(s => s.id === 'aiPrompt_full').defaultValue = newPrompt;

    // 2. Refinar el Motor de Inyección (JS Principal)
    const newJs = [
        "// [v4.1.5] HTML Master Renderer — Motor Profesional con Aislamiento de Contexto",
        "const CANVAS_SIZES = { '1920x1080': [1920, 1080], '1280x720': [1280, 720], '3840x2160': [3840, 2160] };",
        "const BASE_ANIMS = {",
        "    fade: (el, ip, op, isOutro) => el.style.opacity = isOutro ? (1-op) : ip,",
        "    slide: (el, ip, op, isOutro, utils) => {",
        "        el.style.opacity = isOutro ? (1-op) : ip;",
        "        el.style.transform = isOutro ? `translateX(${utils.lerp(0, -80, utils.easeInOutCubic(op))}px)` : `translateX(${utils.lerp(80, 0, utils.easeOutCubic(ip))}px)`;",
        "    },",
        "    zoom: (el, ip, op, isOutro, utils) => {",
        "        el.style.opacity = isOutro ? (1-op) : ip;",
        "        el.style.transform = isOutro ? `scale(${utils.lerp(1, 0.9, utils.easeInOutCubic(op))})` : `scale(${utils.lerp(0.9, 1, utils.easeOutCubic(ip))})`;",
        "    }",
        "};",
        "",
        "dvEngine.register({",
        "    awake: (ctx) => {",
        "        ctx.refs.root = ctx.root.getElementById('master-root');",
        "        ctx.refs.style = ctx.root.getElementById('master-dynamic-style');",
        "        ctx.refs.pane = ctx.root.getElementById('master-render-pane');",
        "        ctx._lastJs = null; ctx._injectedFn = null; ctx._childCtx = null;",
        "    },",
        "    update: (ctx) => {",
        "        const { props, refs, timeline, utils } = ctx;",
        "        if (!refs.pane || !refs.style || !refs.root) return;",
        "",
        "        // 1. Setup Entorno",
        "        const [w, h] = CANVAS_SIZES[props.canvasPreset] || [1920, 1080];",
        "        refs.root.style.width = `${w}px`; refs.root.style.height = `${h}px`;",
        "        refs.root.style.setProperty('--accent', props.brandPrimaryColor || '#E44C30');",
        "",
        "        // 2. Sincronización Assets",
        "        if (ctx._lastHtml !== props.htmlCode) {",
        "            refs.pane.innerHTML = props.htmlCode || '';",
        "            ctx._lastHtml = props.htmlCode; ctx._injectedFn = null; ctx._lastJs = null;",
        "        }",
        "        if (ctx._lastCss !== props.cssCode) {",
        "            refs.style.textContent = props.cssCode || '';",
        "            ctx._lastCss = props.cssCode;",
        "        }",
        "",
        "        // 3. Gestión de JS Dinámico",
        "        const currentJs = (props.jsCode || '').trim();",
        "        if (currentJs && ctx._lastJs !== currentJs) {",
        "            ctx._lastJs = currentJs;",
        "            try {",
        "                // Cleanup anterior si existe",
        "                if (ctx._injectedFn && ctx._injectedFn.destroy) ctx._injectedFn.destroy(ctx._childCtx);",
        "",
        "                const fn = new Function('__dvEngine__', '__dvCtx__', ",
        "                    '\"use strict\";' + ",
        "                    'const dvEngine = __dvEngine__; const ctx = __dvCtx__;' + ",
        "                    'const window = undefined; const document = undefined; const process = undefined; ' + ",
        "                    'const setTimeout = undefined; const setInterval = undefined; ' + ",
        "                    currentJs",
        "                );",
        "                const miniEngine = { _reg: null, register(d) { this._reg = d; } };",
        "                const childCtx = { ...ctx, refs: {}, state: {}, parent: ctx };",
        "                fn(miniEngine, childCtx);",
        "                if (miniEngine._reg) {",
        "                    ctx._injectedFn = miniEngine._reg;",
        "                    if (ctx._injectedFn.awake) ctx._injectedFn.awake(childCtx);",
        "                    ctx._childCtx = childCtx;",
        "                }",
        "            } catch(e) { console.warn('[HTML Master] Error JS:', e.message); }",
        "        }",
        "",
        "        // 4. Ejecución",
        "        if (ctx._injectedFn && ctx._injectedFn.update) {",
        "            try { ctx._injectedFn.update(ctx._childCtx || ctx); }",
        "            catch(e) { console.warn('[HTML Master] Runtime Error:', e.message); }",
        "        } else {",
        "            const style_ = props.animStyle || 'none';",
        "            const ip = utils.clamp(timeline.introProgress, 0, 1);",
        "            const op = utils.clamp(timeline.outroProgress, 0, 1);",
        "            if (BASE_ANIMS[style_]) BASE_ANIMS[style_](refs.pane, ip, op, timeline.isOutro, utils);",
        "        }",
        "    }",
        "});"
    ].join('\n');

    htmlMaster.files.js = newJs;
    fs.writeFileSync(path, JSON.stringify(registry, null, 2), 'utf8');
    console.log('✅ Base robustecida con éxito.');
}
