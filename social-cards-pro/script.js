// [v4.1.5] Social Cards Pro — Frame-Math determinista, sin dependencia de GSAP
const ICONS = {
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
    twitter:   '<path d="M4 4l11.733 16H20L8.267 4zM4 20l6.768-6.768M15.5 4l-6.268 6.768"/>',
    youtube:   '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>',
    twitch:    '<path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-2 13h-4l-3 3v-3H5V4h14v11z"></path><path d="M16 7h-2v4h2V7zm-4 0h-2v4h2V7z"></path>'
};

dvEngine.register({
    awake: (ctx) => {
        ctx.refs.card     = ctx.root.getElementById('social-card');
        ctx.refs.icon     = ctx.root.getElementById('social-icon');
        ctx.refs.platform = ctx.root.getElementById('platform-name');
        ctx.refs.user     = ctx.root.getElementById('user-display');
    },

    update: (ctx) => {
        const { props, refs, timeline, utils } = ctx;
        const { card, icon, platform, user } = refs;
        if (!card) return;

        // 1. Datos Reactivos
        if (user)     user.innerText     = props.username || '@usuario_pro';
        if (platform) platform.innerText = (props.platform || 'instagram').toUpperCase();
        if (icon)     icon.innerHTML     = ICONS[props.platform] || ICONS.instagram;

        // 2. Entrada — Bounce via spring, sin GSAP
        const ip = utils.clamp(timeline.introProgress, 0, 1);
        const bounce = utils.spring(ip, 300, 15);  // stiffness alta = rebote
        card.style.opacity   = ip.toString();
        card.style.transform = `scale(${utils.lerp(0.6, 1, bounce)}) translateY(${utils.lerp(20, 0, utils.easeOutCubic(ip))}px)`;

        // 3. Salida — desliza hacia la derecha
        if (timeline.isOutro) {
            const op = utils.clamp(timeline.outroProgress, 0, 1);
            card.style.opacity   = (1 - op).toString();
            card.style.transform = `translateX(${utils.lerp(0, 60, utils.easeInOutCubic(op))}px)`;
        }
    }
});
