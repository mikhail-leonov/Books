
// Like button handler (works on any page)
function attachLikeEvents() {
    document.removeEventListener('click', handleLikeClick);
    document.addEventListener('click', handleLikeClick);
}

async function handleLikeClick(event) {
    let target = event.target;
    if (!target.classList || !target.classList.contains('like-btn')) {
        target = target.closest('.like-btn');
        if (!target) return;
    }
    const bookId = target.getAttribute('data-id');
    if (!bookId) return;
    const currentlyLiked = target.getAttribute('data-liked') === '1';
    const newLiked = !currentlyLiked;
    const url = newLiked ? `/api/books/${bookId}/like` : `/api/books/${bookId}/unlike`;

    // Save original state for rollback
    const originalHtml = target.innerHTML;
    const originalClass = target.className;

    // Optimistic UI update
    target.innerHTML = newLiked ? 'liked' : 'like';
    target.classList.toggle('text-primary', newLiked);
    target.classList.toggle('text-secondary', !newLiked);
    target.setAttribute('data-liked', newLiked ? '1' : '0');
    target.style.opacity = '0.7';
    target.style.pointerEvents = 'none';

    try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.success) {
            window.location.reload();
        } else {
            throw new Error(data.error || 'Unknown error');
        }
    } catch (err) {
        console.error('Like toggle failed:', err);
        // Revert optimistic change
        target.innerHTML = originalHtml;
        target.className = originalClass;
        target.setAttribute('data-liked', currentlyLiked ? '1' : '0');
        // Show error message (brief)
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        errorMsg.style.zIndex = '9999';
        errorMsg.innerHTML = `Could not update like status: ${err.message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        document.body.appendChild(errorMsg);
        setTimeout(() => errorMsg.remove(), 3000);
    } finally {
        target.style.opacity = '';
        target.style.pointerEvents = '';
    }
}
// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    attachLikeEvents();
});


document.addEventListener('DOMContentLoaded', function() {
    
    const confirmModal = document.getElementById('confirmDeleteModal');
    const deleteItemName = document.getElementById('deleteItemName');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    let currentDeleteId = null;
    let currentDeleteUrl = null;

    document.querySelectorAll('.delete-genre-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const genreId = this.getAttribute('data-id');
            const genreName = this.getAttribute('data-name');
            currentDeleteId = genreId;
            currentDeleteUrl = `/api/genres/${genreId}/delete`;
            deleteItemName.textContent = genreName;
            const modal = new bootstrap.Modal(confirmModal);
            modal.show();
        });
    });

    document.querySelectorAll('.delete-serie-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const serieId = this.getAttribute('data-id');
            const serieName = this.getAttribute('data-name');
            currentDeleteId = serieId;
            currentDeleteUrl = `/api/series/${serieId}/delete`;
            deleteItemName.textContent = serieName;
            const modal = new bootstrap.Modal(confirmModal);
            modal.show();
        });
    });

    document.querySelectorAll('.delete-group-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const groupId = this.getAttribute('data-id');
            const groupName = this.getAttribute('data-name');
            currentDeleteId = groupId;
            currentDeleteUrl = `/api/groups/${groupId}/delete`;
            deleteItemName.textContent = groupName;
            const modal = new bootstrap.Modal(confirmModal);
            modal.show();
        });
    });

    document.querySelectorAll('.delete-author-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const authorId = this.getAttribute('data-id');
            const authorName = this.getAttribute('data-name');
            currentDeleteId = authorId;
            currentDeleteUrl = `/api/authors/${authorId}/delete`;
            deleteItemName.textContent = authorName;
            const modal = new bootstrap.Modal(confirmModal);
            modal.show();
        });
    });

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function() {
            if (!currentDeleteUrl) return;
            try {
                confirmDeleteBtn.disabled = true;
                confirmDeleteBtn.textContent = 'Deleting...';
                const response = await fetch(currentDeleteUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (data.success) {
                    const modal = bootstrap.Modal.getInstance(confirmModal);
                    modal.hide();
                    window.location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Failed to delete genre'));
                    confirmDeleteBtn.disabled = false;
                    confirmDeleteBtn.textContent = 'Delete';
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('An error occurred while deleting the genre');
                confirmDeleteBtn.disabled = false;
                confirmDeleteBtn.textContent = 'Delete';
            }
        });
    }
    if (confirmModal) {
        confirmModal.addEventListener('hidden.bs.modal', function() {
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.textContent = 'Delete';
            currentDeleteId = null;
            currentDeleteUrl = null;
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {

    // --- Edit Modal logic ---
    const editModalElement = document.getElementById('editModal');
    const editItemId = document.getElementById('editItemId');
    const editItemName = document.getElementById('editItemName');
    const editEntityType = document.getElementById('editEntityType');
    const editBtn = document.getElementById('editBtn');
    
    let currentEditUrl = null;
    let editModal = null;
    
    if (editModalElement) {
        editModal = new bootstrap.Modal(editModalElement);
    }
    
    // Generic function to open edit modal
    function openEditModal(entityType, id, name) {
        editItemId.value = id;
        editItemName.value = name;
        editEntityType.value = entityType;
        currentEditUrl = `/api/${entityType}/${id}/edit`;
        editModal.show();
    }
    
    // Attach click handlers for genre edit buttons
    document.querySelectorAll('.edit-genre-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id'); 
            const name = this.getAttribute('data-name');
            openEditModal('genres', id, name);
        });
    });
    
    // Attach click handlers for group edit buttons
    document.querySelectorAll('.edit-group-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id'); 
            const name = this.getAttribute('data-name');
            openEditModal('groups', id, name);
        });
    });
    
    // Attach click handlers for series edit buttons
    document.querySelectorAll('.edit-serie-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            openEditModal('series', id, name);
        });
    });

    // Attach click handlers for author edit buttons
    document.querySelectorAll('.edit-author-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id'); 
            const name = this.getAttribute('data-name');
            openEditModal('authors', id, name);
        });
    });
    
    // Save changes (PUT request)
    if (editBtn) {
        editBtn.addEventListener('click', async function() {
            const newName = editItemName.value.trim();
            if (!newName) {
                alert('Name cannot be empty');
                return;
            }
            if (!currentEditUrl) return;
            
            editBtn.disabled = true;
            editBtn.textContent = 'Saving...';
            
            try {
                const response = await fetch(currentEditUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                });
                const data = await response.json();
                if (data.success) {
                    editModal.hide();
                    window.location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Update failed'));
                    editBtn.disabled = false;
                    editBtn.textContent = 'Save Changes';
                }
            } catch (error) {
                console.error('Edit error:', error);
                alert('An error occurred while updating');
                editBtn.disabled = false;
                editBtn.textContent = 'Save Changes';
            }
        });
    }
    
    // Reset modal state when closed
    if (editModalElement) {
        editModalElement.addEventListener('hidden.bs.modal', function() {
            editBtn.disabled = false;
            editBtn.textContent = 'Save Changes';
            currentEditUrl = null;
            editItemName.value = '';
            editEntityType.value = '';
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // --- Create Modal logic ---
    const createModalElement = document.getElementById('createModal');
    const createItemId = document.getElementById('createItemId');
    const createItemName = document.getElementById('createItemName');
    const createEntityType = document.getElementById('createEntityType');
    const idFieldGroup = document.getElementById('idFieldGroup');
    const createBtn = document.getElementById('createBtn');
    
    let currentCreateUrl = null;
    let createModal = null;
    
    if (createModalElement) {
        createModal = new bootstrap.Modal(createModalElement);
    }
    
    // Generic function to open create modal
    function openCreateModal(entityType) {
        createEntityType.value = entityType;
        // For authors, hide the ID field because ID is auto-generated
        if (entityType === 'authors') {
            if (idFieldGroup) idFieldGroup.style.display = 'none';
            createItemId.removeAttribute('required');
        } else {
            if (idFieldGroup) idFieldGroup.style.display = 'block';
            createItemId.setAttribute('required', 'required');
        }  // <-- FIXED: missing closing brace added here

        createItemId.value = '';
        createItemName.value = '';
        currentCreateUrl = `/api/${entityType}/create`;
        createModal.show();
    }
    
    // Attach click handlers for genre creation buttons
    document.querySelectorAll('.create-genre-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openCreateModal('genres');
        });
    });
    
    // Attach click handlers for series creation buttons
    document.querySelectorAll('.create-serie-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openCreateModal('series');
        });
    });

    // Attach click handlers for groups creation buttons
    document.querySelectorAll('.create-group-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openCreateModal('groups');
        });
    });
    
    // Attach click handlers for author creation buttons
    document.querySelectorAll('.create-author-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openCreateModal('authors');
        });
    });
    
    // Create action (POST request)
    if (createBtn) {
        createBtn.addEventListener('click', async function() {
            const type = createEntityType.value;
            const name = createItemName.value.trim();
            if (!name) {
                alert('Name cannot be empty');
                return;
            }
            
            let body = { name: name };
            // For genres, series and groups, also include the custom ID
            if (type === 'genres' || type === 'series' || type === 'groups') {
                const id = createItemId.value.trim();
                if (!id) {
                    alert('ID cannot be empty');
                    return;
                }
                body.id = id;
            }
            
            createBtn.disabled = true;
            createBtn.textContent = 'Creating...';
            
            try {
                const response = await fetch(currentCreateUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const data = await response.json();
                if (data.success) {
                    createModal.hide();
                    window.location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Creation failed'));
                    createBtn.disabled = false;
                    createBtn.textContent = 'Create';
                }
            } catch (error) {
                console.error('Create error:', error);
                alert('An error occurred while creating');
                createBtn.disabled = false;
                createBtn.textContent = 'Create';
            }
        });
    }
    
    // Reset modal state when closed
    if (createModalElement) {
        createModalElement.addEventListener('hidden.bs.modal', function() {
            createBtn.disabled = false;
            createBtn.textContent = 'Create';
            currentCreateUrl = null;
            createItemId.value = '';
            createItemName.value = '';
            createEntityType.value = '';
            if (idFieldGroup) idFieldGroup.style.display = 'block';
        });
    }
});

const importBtn = document.getElementById('importBtn');
if (importBtn) {
    importBtn.addEventListener('click', async function() {
        const btn = this;
        const logEl = document.getElementById('importLog');
        btn.disabled = true;
        btn.textContent = 'Importing...';
        logEl.innerHTML = 'Starting import...\n';
    
        try {
            const res = await fetch('/api/import/run', { method: 'POST' });
            const data = await res.json();
            
            if (data.success && data.data.log) {
                logEl.innerHTML = data.data.log.join('\n');
            } else {
                logEl.innerHTML += '\nError: ' + (data.error || 'Unknown error');
            }
        } catch (e) {
            logEl.innerHTML += '\nRequest failed: ' + e.message;
        } finally {
            btn.disabled = false;
            btn.textContent = 'Start Import';
        }
    });
}


document.addEventListener('click', function(e) {
    const btn = e.target.closest('.email-book-btn');
    if (!btn) return;
    e.preventDefault();

    const id = btn.dataset.id;
    const mail = btn.dataset.mail;
    const name = btn.dataset.name;
    if (!id) return;

    btn.textContent = 'sending';

    fetch(`/api/email-book/${id}/${mail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: mail })
    })
    .then(r => r.json())
    .then(data => {
        btn.textContent = data.success ? 'sent' : 'error';
        setTimeout(() => btn.textContent = name, 3000);
    })
    .catch(() => {
        btn.textContent = 'Error';
        setTimeout(() => btn.textContent = name, 3000);
    });
});


const searchInputs = [
    'searchAuthorInput',
    'searchGenreInput',
    'searchGroupInput',
    'searchSeriesInput'
];
searchInputs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', function() { this.value = this.value.trim(); });
    el.addEventListener('paste', function() { setTimeout(() => this.value = this.value.trim(), 10); });
});



document.addEventListener('DOMContentLoaded', function () {

    const mergeBtn = document.getElementById('mergeBtn');
    if (!mergeBtn) return;

        mergeBtn.addEventListener('click', async function () {
            const rows = document.querySelectorAll('[data-merge]');
            if (rows.length === 2) { 
                const [a, b] = rows;
                const entity  = a.dataset.entity;
                const keepId  = a.dataset.id;
                const mergeId = b.dataset.id;
                const keepName  = a.dataset.name;
                const mergeName = b.dataset.name;
                if (!confirm(`Merge "${mergeName}" into "${keepName}"?\n\nAll books from "${mergeName}" will be reassigned and it will be deleted.`)) return;
                mergeBtn.disabled = true;
                mergeBtn.textContent = 'Merging...';
                try {
                    const url = `/api/${entity}/merge`;
                    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keep_id: keepId, merge_id: mergeId }) });
                    const data = await res.json();
                    if (data.success) { window.location.href = `/${entity}`; } else {
                        alert('Error: ' + (data.error || 'Merge failed'));
                        mergeBtn.disabled = false; mergeBtn.textContent = '⇶ Merge';
                    }
                } catch (e) {
                    alert('Request failed: ' + e.message);
                    mergeBtn.disabled = false;
                    mergeBtn.textContent = '⇶ Merge';
                }
            }
       })
});

function setInputFromQueryParam(inputId) {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('q');
    if (value !== null) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = decodeURIComponent(value);
        }
    }
}