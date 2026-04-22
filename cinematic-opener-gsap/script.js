// [v4.1.5] Cinematic Opener — Vanilla JS, Frame-Math determinista
dvEngine.register({
    awake: (ctx) => {
        ctx.refs.container = ctx.root.getElementById('opener-container');
        ctx.refs.title     = ctx.root.getElementById('main-title');
        ctx.refs.subtitle  = ctx.root.getElementById('sub-title');
        ctx.refs.line      = ctx.root.getElementById('accent-line');
    },

    update: (ctx) => {
        const { props, refs, timeline, utils } = ctx;
        const { container, title, subtitle, line } = refs;
        if (!container || !title || !subtitle || !line) return;

        // 1. Datos Reactivos
        title.innerText    = props.title    || 'DISEÑO MODULAR';
        subtitle.innerText = props.subtitle || 'DV-ENGINE SERIES';

        // ─── ENTRADA ────────────────────────────────────────────────
        const ip = utils.clamp(timeline.introProgress, 0, 1);

        // Kerning: contrae desde 50px → 20px
        const kerning = utils.lerp(50, 20, utils.easeOutCubic(ip));
        const spring  = utils.spring(ip, 180, 18);

        container.style.opacity        = ip.toString();
        title.style.opacity            = ip.toString();
        title.style.letterSpacing      = `${kerning}px`;
        title.style.transform          = `translateY(${utils.lerp(40, 0, spring)}px)`;

        // Subtítulo retrasado
        const subP = utils.clamp((ip - 0.3) / 0.7, 0, 1);
        subtitle.style.opacity         = subP.toString();
        subtitle.style.transform       = `translateX(${utils.lerp(-20, 0, utils.easeOutCubic(subP))}px)`;

        // Línea de acento: crece desde el centro
        const lineP = utils.clamp((ip - 0.4) / 0.6, 0, 1);
        const lineW = utils.lerp(0, 280, utils.easeOutCubic(lineP));
        line.style.width = `${lineW}px`;

        // ─── SALIDA ─────────────────────────────────────────────────
        if (timeline.isOutro) {
            const op = utils.clamp(timeline.outroProgress, 0, 1);
            container.style.opacity   = (1 - op).toString();
            container.style.transform = `scale(${utils.lerp(1, 0.95, utils.easeInOutCubic(op))})`;
        }
    }
});
