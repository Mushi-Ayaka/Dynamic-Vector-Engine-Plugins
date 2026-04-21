dvEngine.register({
    awake: (ctx) => {
        ctx._els = {
            track: ctx.root.getElementById('ticker-track'),
            text1: ctx.root.getElementById('ticker-text'),
            text2: ctx.root.getElementById('ticker-text-copy'),
            label: ctx.root.getElementById('ticker-label')
        };
        ctx._state = { x: 0 };
    },

    update: (ctx) => {
        const { frame, props, _els, _state } = ctx;

        // 1. Sincronizar Datos
        if (_els.text1) _els.text1.innerText = props.tickerText;
        if (_els.text2) _els.text2.innerText = props.tickerText;
        
        // Sincronizar color de marca con el badge
        if (_els.label) {
            _els.label.style.background = props.brandPrimaryColor || 'var(--accent)';
        }

        // 2. Lógica de Desplazamiento (Crawl)
        // Medimos el ancho de un bloque de texto para el loop
        const textWidth = _els.text1.offsetWidth + 50; // 50 es el margin-left del copy
        
        const speed = props.scrollSpeed || 4;
        _state.x -= speed;

        // Reset para loop infinito suave
        if (Math.abs(_state.x) >= textWidth) {
            _state.x = 0;
        }

        if (_els.track) {
            _els.track.style.transform = `translateX(${_state.x}px)`;
        }
    }
});
