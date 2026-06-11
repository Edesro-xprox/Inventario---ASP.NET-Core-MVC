// Provider to perform login via fetch (optional, form posts are supported too)
window.authProvider = {
    login: async function(username, password) {
        const res = await fetch('/Account/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ Username: username, Password: password })
        });
        if (res.redirected) {
            window.location = res.url;
            return { ok: true };
        }
        const text = await res.text();
        return { ok: false, content: text };
    }
};
