    // Evento de logout
    document.querySelector('.logout-btn').addEventListener('click', function () {
        const logoutButton = document.querySelector('.logout-btn');
        if (logoutButton) {
                            localStorage.removeItem('jwtToken');
                window.location.href = 'login.html';
                console.log('Logout realizado');
        }
    });