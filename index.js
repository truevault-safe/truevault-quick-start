const authFormEl = document.getElementById('auth-form');
const addNoteButtonEl = document.getElementById("add-note");
const addNoteFormEl = document.getElementById("add-note-form");
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

    tvClient = await TrueVaultClient.login(TV_ACCOUNT_ID, this.username.value, this.password.value);
    const response = await tvClient.readCurrentUser();
    tvUserId = response.id;
    location.hash = '#notes';
});

addNoteButtonEl.addEventListener('click', async e => {
    e.preventDefault();

    location.hash = '#add-note';
});

addNoteFormEl.addEventListener('submit', async e => {
    e.preventDefault();

    const document = {'note': this.note.value};
    await tvClient.createDocument(TV_VAULT_ID, null, document, tvUserId);

    this.note.value = '';
    location.hash = '#notes';
});

window.onpopstate = async () => setState(location.hash);

const refreshState = async () => {
    await setState(location.hash);
};

refreshState();
