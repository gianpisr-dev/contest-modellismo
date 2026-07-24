const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let currentUser = null;

// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
  await loadReferenceData();
  if (token) {
    await verifyToken();
  } else {
    showHomeSection();
  }
});

// ==================== AUTENTICAZIONE ====================

async function handleRegister(event) {
  event.preventDefault();

  const formData = {
    nome: document.getElementById('regNome').value,
    cognome: document.getElementById('regCognome').value,
    email: document.getElementById('regEmail').value,
    cellulare: document.getElementById('regCellulare').value,
    id_navetta: parseInt(document.getElementById('regNavetta').value),
    password: document.getElementById('regPassword').value,
    password_confirm: document.getElementById('regPasswordConfirm').value
  };

  try {
    const response = await fetch(`${API_URL}/auth/registrazione`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert('danger', data.error || 'Errore nella registrazione');
      return;
    }

    token = data.token;
    localStorage.setItem('token', token);
    showAlert('success', 'Registrazione completata! Benvenuto ' + data.utente.nome);
    
    // Chiudi modal e ricarica
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    console.error('Errore:', error);
    showAlert('danger', 'Errore di connessione');
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const formData = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value
  };

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert('danger', data.error || 'Errore nel login');
      return;
    }

    token = data.token;
    localStorage.setItem('token', token);
    showAlert('success', 'Login effettuato con successo!');
    
    // Chiudi modal e ricarica
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    console.error('Errore:', error);
    showAlert('danger', 'Errore di connessione');
  }
}

async function verifyToken() {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      logout();
      return;
    }

    const data = await response.json();
    currentUser = data.utente;
    await showDashboard();
  } catch (error) {
    console.error('Errore:', error);
    logout();
  }
}

function logout() {
  localStorage.removeItem('token');
  token = null;
  currentUser = null;
  showHomeSection();
  showAlert('info', 'Logout effettuato');
}

// ==================== GESTIONE MODELLI ====================

async function handleAddModel(event) {
  event.preventDefault();

  const formData = {
    descrizione: document.getElementById('modelDescrizione').value,
    id_categoria: parseInt(document.getElementById('modelCategoria').value),
    id_premio_speciale: document.getElementById('modelPremio').value ? parseInt(document.getElementById('modelPremio').value) : null
  };

  try {
    const response = await fetch(`${API_URL}/modelli`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert('danger', data.error || 'Errore nell\'aggiunta del modello');
      return;
    }

    showAlert('success', data.message);
    bootstrap.Modal.getInstance(document.getElementById('addModelModal')).hide();
    document.getElementById('addModelForm').reset();
    await loadModelli();
  } catch (error) {
    console.error('Errore:', error);
    showAlert('danger', 'Errore di connessione');
  }
}

async function deleteModel(modelId) {
  if (!confirm('Sei sicuro di voler eliminare questo modello?')) return;

  try {
    const response = await fetch(`${API_URL}/modelli/${modelId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert('danger', data.error || 'Errore nell\'eliminazione');
      return;
    }

    showAlert('success', data.message);
    await loadModelli();
  } catch (error) {
    console.error('Errore:', error);
    showAlert('danger', 'Errore di connessione');
  }
}

async function editModel(modelId) {
  alert('Funzione di modifica in sviluppo');
}

// ==================== CARICAMENTO DATI ====================

async function loadReferenceData() {
  try {
    // Carica navette
    const navetteRes = await fetch(`${API_URL}/dati/navette`);
    const navetteData = await navetteRes.json();
    
    const navetteSelect = document.getElementById('regNavetta');
    navetteData.navette.forEach(navetta => {
      const option = document.createElement('option');
      option.value = navetta.id;
      option.textContent = navetta.nome;
      navetteSelect.appendChild(option);
    });

    // Carica categorie
    const categorieRes = await fetch(`${API_URL}/dati/categorie`);
    const categorieData = await categorieRes.json();
    
    const categorieSelect = document.getElementById('modelCategoria');
    categorieData.categorie.forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = `${categoria.codice} - ${categoria.descrizione}`;
      categorieSelect.appendChild(option);
    });

    // Carica premi
    const premiRes = await fetch(`${API_URL}/dati/premi`);
    const premiData = await premiRes.json();
    
    const premiSelect = document.getElementById('modelPremio');
    premiData.premi.forEach(premio => {
      const option = document.createElement('option');
      option.value = premio.id;
      option.textContent = premio.nome;
      premiSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Errore caricamento dati:', error);
  }
}

async function loadModelli() {
  try {
    const response = await fetch(`${API_URL}/modelli/miei-modelli`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    const modelliList = document.getElementById('modelliList');

    if (data.modelli.length === 0) {
      modelliList.innerHTML = '<p class="text-muted">Nessun modello iscritto ancora.</p>';
      return;
    }

    modelliList.innerHTML = data.modelli.map(modello => `
      <div class="card model-card mb-3">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <h6 class="card-subtitle mb-2"><strong>Codice:</strong> ${modello.codice_modello}</h6>
              <p class="card-text"><strong>Descrizione:</strong> ${modello.descrizione}</p>
              <p class="card-text mb-1">
                <span class="badge bg-info">${modello.categoria_descrizione || 'N/A'}</span>
                ${modello.premio_nome ? `<span class="badge bg-warning text-dark">${modello.premio_nome}</span>` : ''}
              </p>
              <small class="text-muted">Iscritto il: ${new Date(modello.data_iscrizione).toLocaleDateString('it-IT')}</small>
            </div>
            <div class="col-md-4">
              <div class="model-actions">
                <button class="btn btn-sm btn-warning" onclick="editModel(${modello.id})">Modifica</button>
                <button class="btn btn-sm btn-danger" onclick="deleteModel(${modello.id})">Elimina</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Errore caricamento modelli:', error);
  }
}

async function loadProfiloUtente() {
  try {
    const response = await fetch(`${API_URL}/utenti/profilo`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    const utente = data.utente;

    document.getElementById('profiloCodice').textContent = utente.codice_modellista;
    document.getElementById('profiloNome').textContent = utente.nome;
    document.getElementById('profiloCognome').textContent = utente.cognome;
    document.getElementById('profiloEmail').textContent = utente.email;
    document.getElementById('profiloCellulare').textContent = utente.cellulare;
    document.getElementById('profiloNavetta').textContent = utente.navetta;
  } catch (error) {
    console.error('Errore caricamento profilo:', error);
  }
}

// ==================== UI HELPERS ====================

function showHomeSection() {
  document.getElementById('homeSection').style.display = 'block';
  document.getElementById('dashboardSection').style.display = 'none';
  document.getElementById('navAuth').style.display = 'block';
  document.getElementById('navUser').style.display = 'none';
  document.getElementById('navLogout').style.display = 'none';
}

async function showDashboard() {
  document.getElementById('homeSection').style.display = 'none';
  document.getElementById('dashboardSection').style.display = 'block';
  document.getElementById('navAuth').style.display = 'none';
  document.getElementById('navUser').style.display = 'block';
  document.getElementById('navLogout').style.display = 'block';

  document.getElementById('userEmail').textContent = currentUser.email + ' (' + currentUser.codice_modellista + ')';

  await loadProfiloUtente();
  await loadModelli();
}

function openLoginModal() {
  const modal = new bootstrap.Modal(document.getElementById('loginModal'));
  modal.show();
}

function openRegisterModal() {
  const modal = new bootstrap.Modal(document.getElementById('registerModal'));
  modal.show();
}

function openAddModelModal() {
  const modal = new bootstrap.Modal(document.getElementById('addModelModal'));
  modal.show();
}

function showAlert(type, message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  // Inserisci all'inizio del container
  const container = document.querySelector('.container');
  container.insertBefore(alertDiv, container.firstChild);

  // Auto-dismiss dopo 5 secondi
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}
