window.notifications = {
    toast: function(message, type = 'info'){
        // simple alert wrapper - replace with a nicer UI in production
        if(type === 'error'){
            alert('Error: ' + message);
        } else {
            alert(message);
        }
    }
};
