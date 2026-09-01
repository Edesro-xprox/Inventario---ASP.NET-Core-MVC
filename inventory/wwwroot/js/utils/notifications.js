const NOTIFICATIONS = {
    toast: (type, message) => {
        Toastify({
            text: message,
            duration: 3000,
            // close: true,
            gravity: "bottom",
            position: "center",
            stopOnFocus: true,
            style: { background: type == 'success' ? "#10B981" : type == 'warning' ? "#F59E0B" : type == 'info' ? "#3B82F6" : "#EF4444" }
        }).showToast();
    }
}

//https://img.icons8.com/ios/50/error--v1.png
// https://iconos8.es/icon/ZiRwjHmdrgtj/info
//https://iconos8.es/icon/11658/check-mark

export default NOTIFICATIONS;