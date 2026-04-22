// [v4.1.5] Scoreboard Pro — Frame-Math determinista, DOM cacheado en awake
dvEngine.register({
    awake: (ctx) => {
        ctx.refs.board   = ctx.root.getElementById('scoreboard');
        ctx.refs.teamA   = ctx.root.getElementById('team-a-name');
        ctx.refs.scoreA  = ctx.root.getElementById('team-a-score');
        ctx.refs.teamB   = ctx.root.getElementById('team-b-name');
        ctx.refs.scoreB  = ctx.root.getElementById('team-b-score');
        ctx.refs.time    = ctx.root.getElementById('match-time');
        ctx._prevScoreA  = null;
        ctx._prevScoreB  = null;
    },

    update: (ctx) => {
        const { props, refs, timeline, utils } = ctx;
        const { board, teamA, scoreA, teamB, scoreB, time } = refs;
        if (!board || !teamA) return;

        // 1. Datos Reactivos — solo actualizar DOM si cambia el valor
        teamA.innerText  = props.teamA     || 'TEAM A';
        teamB.innerText  = props.teamB     || 'TEAM B';
        time.innerText   = props.matchTime || '1ST HALF';

        // Animación de flash al cambiar puntuación
        const newA = props.scoreA ?? 0;
        const newB = props.scoreB ?? 0;
        if (scoreA.innerText !== String(newA)) {
            scoreA.innerText = newA;
            scoreA.style.transform = 'scale(1.4)';
            setTimeout(() => { if (scoreA) scoreA.style.transform = 'scale(1)'; }, 300);
        }
        if (scoreB.innerText !== String(newB)) {
            scoreB.innerText = newB;
            scoreB.style.transform = 'scale(1.4)';
            setTimeout(() => { if (scoreB) scoreB.style.transform = 'scale(1)'; }, 300);
        }

        // 2. Transición de entrada (desliza desde arriba)
        const ip = utils.clamp(timeline.introProgress, 0, 1);
        const spring = utils.spring(ip, 200, 22);
        board.style.opacity   = ip.toString();
        board.style.transform = `translateY(${utils.lerp(-50, 0, spring)}px)`;

        // 3. Transición de salida (desliza hacia arriba)
        if (timeline.isOutro) {
            const op = utils.clamp(timeline.outroProgress, 0, 1);
            board.style.opacity   = (1 - op).toString();
            board.style.transform = `translateY(${utils.lerp(0, -50, utils.easeInOutCubic(op))}px)`;
        }
    }
});
