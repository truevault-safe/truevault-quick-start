const TrueVaultClient = require('truevault');

// const tvClient = new TrueVaultClient({apiKey: 'your api key'});

// async readTrueVaultDocument() {
//     try {
//         const response = await tvClient.readDocument(vaultId, documentId);
//         console.log(response);
//     } catch (err) {
//         console.error(err);
//     }
// }

const authFormEl = document.getElementById('auth-form');
const addNoteButtonEl = document.getElementById('add-note');
const addNoteFormEl = document.getElementById('add-note-form');
const notesListEl = document.getElementById('notes-list');

let tvClient = null;
let tvUserId = null;

const setState = async (newState) => {
    authFormEl.style.display = 'none';
    addNoteButtonEl.style.display = 'none';
    addNoteFormEl.style.display = 'none';
    notesListEl.style.display = 'none';

    switch (newState) {
        case '#notes':
             const response = await tvClient.listDocuments(TV_VAULT_ID, true);
             if (response.items.length > 0) {
                 notesListEl.innerHTML = response.items.map(
                     item => `<div class="note">${item.document.note}</div>`
                 ).join('');
             }
             notesListEl.style.display = '';
             addNoteButtonEl.style.display = '';
            break;
        case '#add-note':
            addNoteFormEl.style.display = '';
            break;
        case '#login':
        default:
            authFormEl.style.display = '';
            break;
    }
};

authFormEl.addEventListener('submit', async e => {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    tvClient = await TrueVaultClient.login(TV_ACCOUNT_ID, username, password);
    const response = await tvClient.readCurrentUser();
    tvUserId = response.id;
    location.hash = '#notes';
});

addNoteFormEl.addEventListener('submit', async e => {
    e.preventDefault();
    let note = document.getElementById('note').value;
    let doc = {'note': note};

     await tvClient.createDocument(TV_VAULT_ID, null, doc, tvUserId);

    document.getElementById('note').value = '';
    location.hash = '#notes';
});

addNoteButtonEl.addEventListener('click', async e => {
    e.preventDefault();

    location.hash = '#add-note';
});


window.onpopstate = async () => setState(location.hash);

const refreshState = async () => {
    await setState(location.hash);
};

refreshState();
