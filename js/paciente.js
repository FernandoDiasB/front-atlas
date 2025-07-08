document.addEventListener('DOMContentLoaded', function() {
    // Logout functionality
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('jwtToken');
            window.location.href = 'login.html';
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
  const excluirBtn = document.getElementById('excluirLista');

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
          <td>${p.endereco}</td>`;
        tabela.appendChild(linha);
      });
    })
    .catch(err => {
      tabela.innerHTML = `<tr><td colspan="6" style="color:red;">${err.message}</td></tr>`;
    });

    if (excluirBtn) {
        excluirBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja excluir TODOS os pacientes permanentemente?')) {
                fetch('http://localhost:8080/api/pacientes', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    if (!res.ok) throw new Error('Erro ao excluir pacientes');
                    carregarPacientes(); // Recarrega a lista vazia
                    alert('Todos os pacientes foram removidos com sucesso!');
                })
                .catch(err => {
                    console.error('Erro:', err);
                    alert('Erro ao excluir pacientes: ' + err.message);
                });
            }
        });
    }

    // Carrega os pacientes inicialmente
    listarPacientes();

});

