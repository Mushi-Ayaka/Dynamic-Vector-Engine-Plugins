// [v4.1.5] Live Info Widget — Reloj determinista via frame, DOM cacheado
const WEATHER_ICONS = { sunny: '☀️', cloudy: '☁️', rain: '🌧️', snow: '❄️' };

dvEngine.register({
    awake: (ctx) => {
        ctx.refs.widget  = ctx.root.getElementById('info-widget');
        ctx.refs.time    = ctx.root.getElementById('current-time');
        ctx.refs.temp    = ctx.root.getElementById('current-temp');
        ctx.refs.loc     = ctx.root.getElementById('current-location');
        ctx.refs.wIcon   = ctx.root.getElementById('weather-icon');
        ctx._lastMinute  = -1;
    },

    update: (ctx) => {
        const { frame, props, refs, timeline, utils } = ctx;
        const { widget, time, temp, loc, wIcon } = refs;
        if (!widget) return;

        // 1. Reloj — actualizar solo cuando cambia el minuto (optimización)
        const now     = new Date();
        const minutes = now.getMinutes();
        if (ctx._lastMinute !== minutes) {
            ctx._lastMinute = minutes;
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(minutes).padStart(2, '0');
            if (time) time.innerText = `${hh}:${mm}`;
        }

        // 2. Datos reactivos
        if (temp)  temp.innerText  = props.temp     || '22°C';
        if (loc)   loc.innerText   = props.location || 'MADRID, ES';
        if (wIcon) wIcon.innerText = WEATHER_ICONS[props.weatherIcon] || '☀️';

        // 3. Entrada suave (fade + desliza desde arriba)
        const ip = utils.clamp(timeline.introProgress, 0, 1);
        widget.style.opacity   = ip.toString();
        widget.style.transform = `translateY(${utils.lerp(-15, 0, utils.easeOutCubic(ip))}px)`;

        // 4. Salida
        if (timeline.isOutro) {
            const op = utils.clamp(timeline.outroProgress, 0, 1);
            widget.style.opacity   = (1 - op).toString();
            widget.style.transform = `translateY(${utils.lerp(0, -15, utils.easeInOutCubic(op))}px)`;
        }
    }
});
