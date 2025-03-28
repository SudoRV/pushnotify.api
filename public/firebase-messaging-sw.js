self.addEventListener("push", function (event) {
    const data = event.data.json();
    self.registration.showNotification(data.notification.title, {
        body: data.notification.body,
        icon: "/logo512.png",
    });
});
