async function configurarFormularioPaciente() {
  const form = document.getElementById('pacienteForm');
  if (!form) {
    console.error('Formulário não encontrado');
    return;
  }

  // Configuração inicial
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  let isLoading = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    isLoading = true;
    
    try {
      // Estado de carregamento
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';

      // Validação do token
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Sessão expirada. Redirecionando para login...');
      }

      // Coleta e validação dos dados
      const paciente = coletarDadosPaciente(form);
      validarDadosPaciente(paciente);

      // Envio dos dados
      const response = await enviarDadosPaciente(paciente, token);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no servidor');
      }

      // Feedback de sucesso
      mostrarFeedback('success', 'Paciente cadastrado com sucesso!');
      form.reset();

    } catch (error) {
      console.error('Erro no formulário:', error);
      mostrarFeedback('error', error.message);
      
      // Redirecionar se token inválido
      if (error.message.includes('Sessão expirada')) {
        localStorage.removeItem('jwtToken');
        setTimeout(() => window.location.href = 'login.html', 2000);
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      isLoading = false;
    }
  });
}

// Funções auxiliares
function coletarDadosPaciente(form) {
  return {
    nome: form.nome.value.trim(),
    dataNascimento: form.dataNascimento.value || null,
    estadoCivil: form.estadoCivil.value,
    nomeConjuge: form.estadoCivil.value === 'Casado' ? form.nomeConjuge.value.trim() : null,
    tempoCasado: form.estadoCivil.value === 'Casado' ? parseInt(form.tempoCasado.value) || 0 : null,
    filhos: parseInt(form.filhos.value) || 0,
    endereco: form.endereco.value.trim(),
    telefone: form.telefone.value.trim(),
    telefoneEmergencia: form.telefoneEmergencia.value.trim(),
    medicacoes: form.medicacoes.value.trim(),
    alergias: form.alergias.value.trim(),
    fatosRelevantes: form.fatosRelevantes.value.trim()
  };
}

function validarDadosPaciente(paciente) {
  const erros = [];
  
  if (!paciente.nome || paciente.nome.length < 3) {
    erros.push('Nome deve ter pelo menos 3 caracteres');
  }
  
  if (!paciente.dataNascimento) {
    erros.push('Data de nascimento é obrigatória');
  }
  
  if (paciente.estadoCivil === 'Casado' && !paciente.nomeConjuge) {
    erros.push('Nome do cônjuge é obrigatório para casados');
  }
  
  if (erros.length > 0) {
    throw new Error(erros.join('\n'));
  }
}
// Modifique a função enviarDadosPaciente para debug:
async function enviarDadosPaciente(paciente, token) {
  try {
    console.log("Dados sendo enviados:", paciente); // Verifique no console
    console.log("Token JWT:", token); // Verifique se o token está correto
    
    const response = await fetch('http://localhost:8080/api/pacientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paciente)
    });

    console.log("Status da resposta:", response.status); // Verifique o status HTTP
    const responseData = await response.json();
    console.log("Resposta completa:", responseData); // Verifique a resposta completa
    
    return response;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}

function mostrarFeedback(tipo, mensagem) {
  const box = document.createElement('div');
  box.className = `feedback ${tipo}`; // tipo = 'success' ou 'error'
  box.textContent = mensagem;

  Object.assign(box.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: tipo === 'success' ? '#4caf50' : '#f44336',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    zIndex: 9999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    transition: 'opacity 0.3s ease'
  });

  document.body.appendChild(box);

  setTimeout(() => {
    box.style.opacity = '0';
    setTimeout(() => document.body.removeChild(box), 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  configurarFormularioPaciente();
});

