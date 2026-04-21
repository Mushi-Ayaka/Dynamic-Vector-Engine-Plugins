dvEngine.register({
    awake: (ctx) => {
        // [v4.0] Usando ctx.refs oficial
        ctx.refs.board    = ctx.root.getElementById('scoreboard');
        ctx.refs.teamA    = ctx.root.getElementById('team-a-name');
        ctx.refs.scoreA   = ctx.root.getElementById('team-a-score');
        ctx.refs.teamB    = ctx.root.getElementById('team-b-name');
        ctx.refs.scoreB   = ctx.root.getElementById('team-b-score');
        ctx.refs.time     = ctx.root.getElementById('match-time');
    },

    update: (ctx) => {
        const { props, refs, timeline, utils } = ctx;
        const { board, teamA, scoreA, teamB, scoreB, time } = refs;
        if (!board || !teamA) return;

        // 1. Sincronización de Datos Reactivos
        teamA.innerText  = props.teamA   || 'TEAM A';
        scoreA.innerText = props.scoreA  ?? 0;
        teamB.innerText  = props.teamB   || 'TEAM B';
        scoreB.innerText = props.scoreB  ?? 0;
        time.innerText   = props.matchTime || '1ST HALF';

        // ─── ENTRADA ────────────────────────────────────────────────
        // Tarea 5.3: El plugin tiene la responsabilidad total de sus propias transiciones.
        // El preset 'motion' provee los valores, pero el código aplica los transforms.
        const ip = timeline.introProgress;

        // Deslizamiento desde abajo con resorte
        const springVal = utils.spring(ip, 200, 22);
        board.style.opacity   = ip.toString();
        board.style.transform = `translateY(${utils.lerp(40, 0, springVal)}px)`;

        // ─── SALIDA ─────────────────────────────────────────────────
        if (timeline.isOutro) {
            const op = timeline.outroProgress;
            board.style.opacity   = (1 - op).toString();
            board.style.transform = `translateY(${utils.lerp(0, 40, utils.easeInOutCubic(op))}px)`;
        }
    }
});
