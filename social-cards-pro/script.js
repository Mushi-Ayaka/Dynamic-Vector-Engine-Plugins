const ICONS = {
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
    twitter: '<path d="M22 4s-2 1-3.3 1.2c-1.3-1.1-3.1-1.8-5-1.8-3.8 0-7 3.2-7 7 0 .5.1 1 .2 1.5-5.7-.3-10.7-3-14.1-7.2 0 0-1.5 2.5-.5 5.5 0 1.5 1 2.8 2.3 3.6-1 0-2-.3-2.8-.8 0 2.1 1.5 3.9 3.5 4.3-.4.1-.8.1-1.2.1-.3 0-.6 0-.9-.1.5 1.7 2.1 3 4 3-1.5 1.2-3.4 1.9-5.5 1.9-.4 0-.7 0-1.1-.1 2.1 1.3 4.5 2.1 7.2 2.1 8.6 0 13.3-7.1 13.3-13.3 0-.2 0-.4 0-.6C21 6.5 22 5 22 4z"></path>',
    youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>',
    twitch: '<path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-2 13h-4l-3 3v-3H5V4h14v11z"></path><path d="M16 7h-2v4h2V7zm-4 0h-2v4h2V7z"></path>'
};

dvEngine.register({
    awake: (ctx) => {
        ctx._els = {
            card: ctx.root.getElementById('social-card'),
            icon: ctx.root.getElementById('social-icon'),
            platform: ctx.root.getElementById('platform-name'),
            user: ctx.root.getElementById('user-display')
        };
        ctx._state = { animStarted: false };
    },

    update: (ctx) => {
        const { frame, props, _els, _state } = ctx;
        
        // Sincronizar Datos
        if (_els.user) _els.user.innerText = props.username;
        if (_els.platform) _els.platform.innerText = props.platform.toUpperCase();
        if (_els.icon) _els.icon.innerHTML = ICONS[props.platform] || ICONS.instagram;

        // Lógica de Animación con GSAP
        // 1. Entrada (Bounce)
        if (frame === 1 && !_state.animStarted) {
            _state.animStarted = true;
            gsap.to(_els.card, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            });
        }

        // 2. Salida (Cálculo basado en duración total)
        // Convertimos FPS a frames para saber cuándo faltan 30 frames para terminar
        const endFrame = ctx.settings.fps * ctx.settings.duration;
        const exitStart = endFrame - 20;

        if (frame === exitStart) {
            gsap.to(_els.card, {
                opacity: 0,
                x: -50,
                duration: 0.5,
                ease: "power2.in"
            });
        }
    }
});
