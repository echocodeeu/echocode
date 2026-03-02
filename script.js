function showToast(message, type){
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.classList.add("toast");

    if(type === "success"){
        toast.classList.add("success");
    } else {
        toast.classList.add("error");
    }

    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "slideOut 0.4s forwards";
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}
