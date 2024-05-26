
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://vlb.hologutibusinesscentre.com/')
        .then((res) => res.json())
        .then((data) => {
            const message = data.message;
            document.getElementById('message').innerText = message;
        })
        .catch((error) => 
        console.error(error));
});