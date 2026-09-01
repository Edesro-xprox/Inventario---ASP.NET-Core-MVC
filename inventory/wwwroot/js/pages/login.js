import NOTIFICATIONS from '../utils/notifications.js';
class Login {
    constructor() {
        console.log('Login initialized');
        this.init();
    }

    async init() {
        this.events();
    }

    events() {
        $('#btnLogin').click((e) => {
                // e.preventDefault();
            if (!Boolean($('#usuario').val()) || Boolean($('#password').val())) {
                NOTIFICATIONS.toast('warning', 'Debe completar todos los campos del formulario');
            }
        });
    }
}

new Login;