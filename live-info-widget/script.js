dvEngine.register({
    awake: (ctx) => {
        ctx._els = {
            time: ctx.root.getElementById('current-time'),
            temp: ctx.root.getElementById('current-temp'),
            location: ctx.root.getElementById('current-location')
        };
    },

    update: (ctx) => {
        const { props, _els } = ctx;

        // 1. Reloj en tiempo real
        // Nota: En Remotion/Render, el tiempo suele ser estático por frame,
        // pero aquí simulamos un reloj que avanza.
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        
        if (_els.time) _els.time.innerText = `${hours}:${mins}`;
        if (_els.temp) _els.temp.innerText = props.temp;
        if (_els.location) _els.location.innerText = props.location;
    }
});
