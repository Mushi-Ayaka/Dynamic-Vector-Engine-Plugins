// [v4.1.5] News Ticker Pro — Loop determinista basado en frame, DOM cacheado
dvEngine.register({
    awake: (ctx) => {
        ctx.refs.track  = ctx.root.getElementById('ticker-track');
        ctx.refs.text1  = ctx.root.getElementById('ticker-text');
        ctx.refs.text2  = ctx.root.getElementById('ticker-text-copy');
        ctx.refs.label  = ctx.root.getElementById('ticker-label');
        ctx._state      = { x: 0 };
    },

    update: (ctx) => {
        const { frame, props, refs, _state } = ctx;
        const { track, text1, text2, label } = refs;
        if (!track || !text1 || !text2) return;

        // 1. Datos reactivos
        const text = props.tickerText || '— DVGE Engine —';
        if (text1.innerText !== text) {
            text1.innerText = text;
            text2.innerText = text;
        }

        // Color de acento del preset de branding
        const accent = props.brandPrimaryColor || '#E44C30';
        if (label) label.style.background = accent;

        // 2. Desplazamiento determinista por frame (no depende de Date.now)
        const speed    = props.scrollSpeed || 4;
        const textW    = (text1.offsetWidth || 600) + 50;
        _state.x       = -((frame * speed) % textW);

        track.style.transform = `translateX(${_state.x}px)`;
    }
});
