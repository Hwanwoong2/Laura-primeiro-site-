// Variáveis globais
let currentMonth = 10;
let currentYear = 2024;
let selectedDate = null;
let isAuthenticated = false;

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function doLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (username.trim() === '' || password.trim() === '') {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    isAuthenticated = true;
    showPage('home');
}

function doCadastro() {
    const nome = document.getElementById('cadastro-nome').value;
    const email = document.getElementById('cadastro-email').value;
    const password = document.getElementById('cadastro-password').value;
    
    if (nome.trim() === '' || email.trim() === '' || password.trim() === '') {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    isAuthenticated = true;
    showPage('home');
}

function showPage(pageName) {
    const protectedPages = ['home', 'contatos', 'agendamento', 'servicos', 'localizacao'];
    
    if (protectedPages.includes(pageName) && !isAuthenticated) {
        alert('Você precisa fazer login ou cadastro primeiro!');
        showPage('login');
        return;
    }
    
    const pages = ['login', 'cadastrar', 'home', 'contatos', 'agendamento', 'servicos', 'localizacao', 'agendamento-concluido'];
    
    pages.forEach(page => {
        const pageElement = document.getElementById('page-' + page);
        if (pageElement) {
            pageElement.classList.add('hidden');
        }
    });
    
    const selectedPage = document.getElementById('page-' + pageName);
    if (selectedPage) {
        selectedPage.classList.remove('hidden');
    }
    
    if (pageName === 'agendamento') {
        renderCalendar();
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const monthElement = document.getElementById('calendar-month');
    if (monthElement) {
        monthElement.textContent = monthNames[currentMonth];
    }
    
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    
    calendarDays.innerHTML = '';
    
    for (let i = firstDay - 1; i >= 0; i--) {
        const emptyDay = document.createElement('button');
        emptyDay.className = 'calendar-day';
        emptyDay.disabled = true;
        emptyDay.textContent = daysInPrevMonth - i;
        emptyDay.style.color = '#ccc';
        calendarDays.appendChild(emptyDay);
    }
    
// Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
        const dayButton = document.createElement('button');
        dayButton.className = 'calendar-day';
        dayButton.textContent = day;
    
// Verifica o dia da semana (0 = Domingo, 1 = Segunda, etc.)
    const diaSemana = new Date(currentYear, currentMonth, day).getDay();
    
// Bloqueia Domingo (0) e Segunda (1)
    if (diaSemana === 0 || diaSemana === 1) {
        dayButton.disabled = true;
        dayButton.style.color = '#999';
        dayButton.style.cursor = 'not-allowed';
    } else {
        dayButton.disabled = false;
        
// Adiciona evento de clique
        dayButton.addEventListener('click', function() {
            const allDays = document.querySelectorAll('.calendar-day:not(:disabled)');
            allDays.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            this.classList.add('selected');
            selectedDate = day;
            
// Atualiza os horários disponíveis baseado no dia selecionado
        atualizarHorariosDisponiveis(diaSemana);
        });
    }
    
    calendarDays.appendChild(dayButton);
}
    
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const emptyDay = document.createElement('button');
        emptyDay.className = 'calendar-day';
        emptyDay.disabled = true;
        emptyDay.textContent = i;
        emptyDay.style.color = '#ccc';
        calendarDays.appendChild(emptyDay);
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    
    renderCalendar();
}

function mascaraCelular(e) {
    let valor = e.target.value.replace(/\D/g, '');
    valor = valor.substring(0, 11);
    
    if (valor.length === 0) {
        e.target.value = '';
    } else if (valor.length <= 2) {
        e.target.value = '(' + valor;
    } else if (valor.length <= 7) {
        e.target.value = '(' + valor.substring(0, 2) + ') ' + valor.substring(2);
    } else {
        e.target.value = '(' + valor.substring(0, 2) + ') ' + valor.substring(2, 7) + '-' + valor.substring(7, 11);
    }
}

function validarAgendamento() {
    const nome = document.querySelector('.agendamento-inputs input[placeholder="Nome"]');
    const horario = document.querySelectorAll('.agendamento-inputs select')[0]; // Primeiro select (horário)
    const selectProcedimento = document.querySelectorAll('.agendamento-inputs select')[1]; // Segundo select (procedimento)
    const selectTipoContato = document.getElementById('tipo-contato');
    const campoContato = document.getElementById('campo-contato');
    const diaSelecionado = document.querySelector('.calendar-day.selected');
    
    if (!nome || !nome.value || nome.value.trim() === '') {
        alert('Por favor, preencha seu nome!');
        return;
    }
    
    if (!horario || !horario.value) {
        alert('Por favor, selecione o horário!');
        return;
    }
    
    if (!selectProcedimento || !selectProcedimento.value) {
        alert('Por favor, selecione o procedimento!');
        return;
    }
    
    if (!selectTipoContato || !selectTipoContato.value) {
        alert('Por favor, selecione Celular ou Email!');
        return;
    }
    
    if (!campoContato || !campoContato.value || campoContato.value.trim() === '') {
        alert('Por favor, preencha seu contato!');
        return;
    }
    
    if (!diaSelecionado) {
        alert('Por favor, selecione um dia no calendário!');
        return;
    }
    
    console.log('Validação OK! Redirecionando...');
    showPage('agendamento-concluido');
}
// Função para atualizar horários disponíveis baseado no dia da semana
function atualizarHorariosDisponiveis(diaSemana) {
    const selectHorario = document.querySelectorAll('.agendamento-inputs select')[0];
    
    if (!selectHorario) return;
    
// Limpa as opções atuais (exceto a primeira)
    selectHorario.innerHTML = '<option value="" disabled selected>Selecione o horário</option>';
    
// Define horários baseado no dia
    let horarios = [];
    
    if (diaSemana === 6) {
        
// Sábado: 09:00 até 17:00
        horarios = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
                    '15:00', '15:30', '16:00', '16:30', '17:00'];
    } else {

// Terça a Sexta: 09:00 até 19:00
        horarios = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
                    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
                    '18:00', '18:30', '19:00'];
    }
    
// Adiciona os horários ao select
    horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        selectHorario.appendChild(option);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    isAuthenticated = false;
    showPage('login');
    
    const selectTipoContato = document.getElementById('tipo-contato');
    const campoContato = document.getElementById('campo-contato');
    
    if (selectTipoContato && campoContato) {
        selectTipoContato.addEventListener('change', function() {
            const tipo = this.value;
            
            if (tipo === 'celular') {
                campoContato.style.display = 'block';
                campoContato.placeholder = '(11) 00000-0000';
                campoContato.type = 'text';
                campoContato.value = '';
                campoContato.addEventListener('input', mascaraCelular);
            } else if (tipo === 'email') {
                campoContato.style.display = 'block';
                campoContato.placeholder = 'seuemail@exemplo.com';
                campoContato.type = 'email';
                campoContato.value = '';
                campoContato.removeEventListener('input', mascaraCelular);
            } else {
                campoContato.style.display = 'none';
            }
        });
    }
});
