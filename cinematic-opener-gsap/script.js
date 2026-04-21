dvEngine.register({
    awake: (ctx) => {
        // [v4.0] Tarea 5.2: Usando ctx.refs oficial en lugar de ctx._els
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
        // ctx.timeline.introProgress va de 0→1 durante los primeros ~0.8s
        const ip = timeline.introProgress;

        // Física de resorte para el título (reemplaza gsap back.out)
        const springT  = utils.spring(ip, 180, 18);
        // Texto kerning: se contrae desde 50px → 20px con el progreso
        const kerning  = utils.lerp(50, 20, utils.easeOutCubic(ip));

        container.style.opacity = ip.toString();
        title.style.letterSpacing = `${kerning}px`;
        title.style.opacity       = ip.toString();
        title.style.transform     = `translateY(${utils.lerp(30, 0, springT)}px)`;

        // Subtítulo con retraso (usa progreso más avanzado)
        const subP = utils.clamp((ip - 0.25) / 0.75, 0, 1);
        subtitle.style.opacity   = subP.toString();
        subtitle.style.transform = `translateY(${utils.lerp(20, 0, utils.easeOutCubic(subP))}px)`;

        // Línea de acento: crece en ancho
        const lineW = utils.lerp(0, 200, utils.easeOutCubic(utils.clamp((ip - 0.3) / 0.7, 0, 1)));
        line.style.width = `${lineW}px`;

        // ─── SALIDA ─────────────────────────────────────────────────
        // ctx.timeline.outroProgress va de 0→1 durante los últimos ~0.5s
        if (timeline.isOutro) {
            const op = timeline.outroProgress;
            container.style.opacity = (1 - op).toString();
            container.style.transform = `translateY(${utils.lerp(0, -30, utils.easeInOutCubic(op))}px)`;
        }
    }
});
