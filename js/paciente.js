document.addEventListener('DOMContentLoaded', function() {
    // Logout functionality
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('jwtToken');
            window.location.href = 'login.html';
        });
    }

    // Dynamic content loading
    const links = document.querySelectorAll(".menu-item");
    const content = document.querySelector(".content");

    // Function to load scripts dynamically
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.body.appendChild(script);
    }

    // Function to load content
    function loadContent(page) {
        fetch(page)
            .then(res => {
                if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
                return res.text();
            })
            .then(html => {
                content.innerHTML = html;
                
                // Load associated JS file if exists
                const scriptMatch = html.match(/<script src="([^"]+)"><\/script>/);
                if (scriptMatch && scriptMatch[1]) {
                    loadScript(scriptMatch[1]);
                }
                
                history.pushState({ page }, '', `#${page.split('/').pop().replace('.html', '')}`);
            })
            .catch(err => {
                console.error('Erro ao carregar:', err);
                content.innerHTML = `
                    <div class="error-message">
                        <h2>Erro ao carregar o conteúdo</h2>
                        <p>${err.message}</p>
                        <button onclick="location.reload()">Recarregar</button>
                    </div>
                `;
            });
    }

    // Handle menu clicks
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            loadContent(this.getAttribute("data-page"));
        });
    });

});

document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('jwtToken');
  const tabela = document.querySelector('#tabelaPacientes tbody');

  if (!tabela) return;
  fetch('http://localhost:8080/api/pacientes', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar pacientes');
      return res.json();
    })
    .then(pacientes => {
      tabela.innerHTML = ''; // limpa antes de preencher
      pacientes.forEach(p => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${p.nome}</td>
          <td>${p.dataNascimento}</td>
          <td>${p.estadoCivil}</td>
          <td>${p.filhos}</td>
          <td>${p.telefone}</td>
          <td>${p.endereco}</td>
          <td>${p.alergias}</td>
        `;
        tabela.appendChild(linha);
      });
    })
    .catch(err => {
      tabela.innerHTML = `<tr><td colspan="6" style="color:red;">${err.message}</td></tr>`;
    });
});
