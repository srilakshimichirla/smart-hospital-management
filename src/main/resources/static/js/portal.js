(() => {
    const endpoints = {
        patients: '/api/patients',
        doctors: '/api/doctors',
        appointments: '/api/appointments',
        records: '/api/medical-records'
    };

    const definitions = {
        patients: {
            title: 'Patients', singular: 'patient', subtitle: 'Patient details and contact information.',
            fields: [
                { name: 'name', label: 'Full name', required: true },
                { name: 'age', label: 'Age', type: 'number', required: true, min: 0 },
                { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Female', 'Male', 'Other'] },
                { name: 'phone', label: 'Phone', type: 'tel', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'address', label: 'Address', full: true, required: true }
            ],
            columns: [
                { label: 'Patient', value: row => `<span class="primary-cell">${escapeHtml(row.name)}</span><span class="secondary-cell">Patient #${escapeHtml(row.id)}</span>` },
                { label: 'Age / Gender', value: row => `${escapeHtml(row.age)} / ${escapeHtml(row.gender)}` },
                { label: 'Phone', value: row => escapeHtml(row.phone) },
                { label: 'Email', value: row => escapeHtml(row.email) },
                { label: 'Address', value: row => escapeHtml(row.address) }
            ]
        },
        doctors: {
            title: 'Doctors', singular: 'doctor', subtitle: 'Care team directory and availability.',
            fields: [
                { name: 'name', label: 'Full name', required: true },
                { name: 'specialization', label: 'Specialization', required: true },
                { name: 'phone', label: 'Phone', type: 'tel', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'availableTime', label: 'Available hours', full: true, required: true, placeholder: 'e.g. Mon-Fri, 09:00-17:00' }
            ],
            columns: [
                { label: 'Doctor', value: row => `<span class="primary-cell">${escapeHtml(row.name)}</span><span class="secondary-cell">Doctor #${escapeHtml(row.id)}</span>` },
                { label: 'Specialization', value: row => escapeHtml(row.specialization) },
                { label: 'Phone', value: row => escapeHtml(row.phone) },
                { label: 'Email', value: row => escapeHtml(row.email) },
                { label: 'Availability', value: row => escapeHtml(row.availableTime) }
            ]
        },
        appointments: {
            title: 'Appointments', singular: 'appointment', subtitle: 'Schedule and track patient visits.',
            fields: [
                { name: 'patientId', label: 'Patient', type: 'relation', relation: 'patients', required: true },
                { name: 'doctorId', label: 'Doctor', type: 'relation', relation: 'doctors', required: true },
                { name: 'appointmentDate', label: 'Date', type: 'date', required: true },
                { name: 'appointmentTime', label: 'Time', type: 'time', required: true },
                { name: 'reason', label: 'Reason for visit', full: true, required: true },
                { name: 'status', label: 'Status', type: 'select', options: ['BOOKED', 'COMPLETED', 'CANCELLED'], editOnly: true }
            ],
            columns: [
                { label: 'Patient', value: row => `<span class="primary-cell">${escapeHtml(nameFor('patients', row.patientId))}</span><span class="secondary-cell">${escapeHtml(row.appointmentDate || '')} at ${escapeHtml(row.appointmentTime || '')}</span>` },
                { label: 'Doctor', value: row => escapeHtml(nameFor('doctors', row.doctorId)) },
                { label: 'Reason', value: row => escapeHtml(row.reason) },
                { label: 'Status', value: row => statusMarkup(row.status) }
            ]
        },
        records: {
            title: 'Medical records', singular: 'medical record', subtitle: 'Clinical notes, diagnoses, and prescriptions.',
            fields: [
                { name: 'patientId', label: 'Patient', type: 'relation', relation: 'patients', required: true },
                { name: 'doctorId', label: 'Doctor', type: 'relation', relation: 'doctors', required: true },
                { name: 'recordDate', label: 'Record date', type: 'date', required: true },
                { name: 'diagnosis', label: 'Diagnosis', required: true },
                { name: 'prescription', label: 'Prescription', full: true, required: true },
                { name: 'notes', label: 'Notes', type: 'textarea', full: true }
            ],
            columns: [
                { label: 'Patient', value: row => `<span class="primary-cell">${escapeHtml(nameFor('patients', row.patientId))}</span><span class="secondary-cell">${escapeHtml(row.recordDate || '')}</span>` },
                { label: 'Doctor', value: row => escapeHtml(nameFor('doctors', row.doctorId)) },
                { label: 'Diagnosis', value: row => escapeHtml(row.diagnosis) },
                { label: 'Prescription', value: row => escapeHtml(row.prescription) },
                { label: 'Notes', value: row => escapeHtml(row.notes) }
            ]
        }
    };

    const data = { patients: [], doctors: [], appointments: [], records: [] };
    const content = document.querySelector('#page-content');
    const dialog = document.querySelector('#entity-dialog');
    const form = document.querySelector('#entity-form');
    const fieldsContainer = document.querySelector('#dialog-fields');
    const toast = document.querySelector('#toast');
    let currentView = 'overview';
    let toastTimeout;

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[character]);
    }

    function nameFor(type, id) {
        const item = data[type].find(entry => String(entry.id) === String(id));
        return item ? item.name : `#${id ?? ''}`;
    }

    function statusMarkup(status) {
        const normalized = String(status || 'BOOKED').toLowerCase();
        const style = normalized === 'cancelled' ? 'status-cancelled' : normalized === 'completed' ? 'status-completed' : '';
        return `<span class="status ${style}">${escapeHtml(status || 'BOOKED')}</span>`;
    }

    async function request(url, options = {}) {
        const response = await fetch(url, {
            credentials: 'same-origin',
            ...options,
            headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
        });
        const contentType = response.headers.get('content-type') || '';
        if (response.redirected && new URL(response.url).pathname === '/login') {
            window.location.assign('/login');
            throw new Error('Your session has expired. Please sign in again.');
        }
        const body = contentType.includes('application/json') ? await response.json() : await response.text();
        if (!response.ok) throw new Error(typeof body === 'string' ? body : body.message || `Request failed (${response.status})`);
        if (typeof body === 'string' && body.trimStart().startsWith('<')) {
            window.location.assign('/login');
            throw new Error('Please sign in to continue.');
        }
        return body;
    }

    async function loadData() {
        const results = await Promise.allSettled(Object.entries(endpoints).map(async ([key, url]) => {
            data[key] = await request(url);
        }));
        const failed = results.find(result => result.status === 'rejected');
        if (failed) throw failed.reason;
    }

    function dateLabel(date) {
        return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
    }

    function renderOverview() {
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const todaysAppointments = data.appointments.filter(item => item.appointmentDate === todayKey)
            .sort((left, right) => (left.appointmentTime || '').localeCompare(right.appointmentTime || ''));
        const booked = data.appointments.filter(item => String(item.status).toUpperCase() === 'BOOKED').length;
        document.querySelector('#breadcrumb-current').textContent = 'Overview';
        document.querySelector('#today-label').textContent = dateLabel(today);
        content.innerHTML = `
            <div class="page-heading">
                <div><span class="eyebrow">CLINIC OVERVIEW</span><h1>Good care starts here.</h1><p>Your hospital at a glance for ${escapeHtml(dateLabel(today))}.</p></div>
                <button class="button button-primary" type="button" data-action="create" data-type="appointments"><span aria-hidden="true">+</span> New appointment</button>
            </div>
            <section class="stats" aria-label="Hospital totals">
                ${statCard('Registered patients', data.patients.length, 'Patient directory', '#70a97d')}
                ${statCard('Care team', data.doctors.length, 'Active doctors', '#d96853')}
                ${statCard('Appointments', data.appointments.length, `${booked} booked`, '#c39b54')}
                ${statCard('Medical records', data.records.length, 'Clinical history', '#638fa0')}
            </section>
            <section class="dashboard-grid">
                <div class="panel">
                    <div class="panel-header"><div><h2>Today's appointments</h2><p>${todaysAppointments.length} scheduled visits</p></div><button class="text-button" type="button" data-view="appointments">View schedule &#8594;</button></div>
                    ${todaysAppointments.length ? renderTable('appointments', todaysAppointments.slice(0, 6), false) : `<div class="empty-state"><strong>A little room in today's schedule</strong><span>No appointments are booked for today.</span><button class="button button-quiet" type="button" data-action="create" data-type="appointments">Schedule a visit</button></div>`}
                </div>
                <div class="panel">
                    <div class="panel-header"><div><h2>Recently added patients</h2><p>Latest additions to your directory</p></div><button class="text-button" type="button" data-view="patients">View all &#8594;</button></div>
                    ${data.patients.length ? `<div class="activity-list">${data.patients.slice(-4).reverse().map(patient => `<div class="activity-item"><span class="activity-date">${escapeHtml(String(patient.name || '?').trim().split(/\\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase())}<small>NEW</small></span><div class="activity-copy"><strong>${escapeHtml(patient.name)}</strong><span>${escapeHtml(patient.phone || patient.email || 'Contact details not provided')}</span></div></div>`).join('')}</div>` : `<div class="empty-state"><strong>No patients yet</strong><span>Add a patient to start building the directory.</span><button class="button button-quiet" type="button" data-action="create" data-type="patients">Add patient</button></div>`}
                </div>
            </section>`;
    }

    function statCard(label, value, foot, accent) {
        return `<article class="stat-card" style="--stat-accent:${accent}"><div class="stat-label">${escapeHtml(label)}</div><div class="stat-value">${escapeHtml(value)}</div><div class="stat-foot">${escapeHtml(foot)}</div></article>`;
    }

    function renderTable(type, rows, includeActions = true) {
        const definition = definitions[type];
        const columns = definition.columns;
        const headers = columns.map(column => `<th scope="col">${escapeHtml(column.label)}</th>`).join('');
        const actionHeader = includeActions ? '<th scope="col">Actions</th>' : '';
        const body = rows.map(row => `<tr>${columns.map(column => `<td>${column.value(row)}</td>`).join('')}${includeActions ? `<td><div class="row-actions"><button class="button button-quiet button-small" type="button" data-action="edit" data-type="${type}" data-id="${escapeHtml(row.id)}">Edit</button><button class="button button-danger button-small" type="button" data-action="delete" data-type="${type}" data-id="${escapeHtml(row.id)}">Delete</button></div></td>` : ''}</tr>`).join('');
        if (!rows.length) return `<div class="empty-state"><strong>No ${escapeHtml(definition.title.toLowerCase())} found</strong><span>Add a ${escapeHtml(definition.singular)} to get started.</span><button class="button button-quiet" type="button" data-action="create" data-type="${type}">Add ${escapeHtml(definition.singular)}</button></div>`;
        return `<div class="table-wrap"><table><thead><tr>${headers}${actionHeader}</tr></thead><tbody>${body}</tbody></table></div>`;
    }

    function renderList(type, query = '') {
        const definition = definitions[type];
        const lowered = query.trim().toLowerCase();
        const rows = data[type].filter(row => {
            if (!lowered) return true;
            const searchable = Object.values(row).join(' ').toLowerCase();
            return searchable.includes(lowered) ||
                (type === 'appointments' && `${nameFor('patients', row.patientId)} ${nameFor('doctors', row.doctorId)}`.toLowerCase().includes(lowered)) ||
                (type === 'records' && `${nameFor('patients', row.patientId)} ${nameFor('doctors', row.doctorId)}`.toLowerCase().includes(lowered));
        });
        document.querySelector('#breadcrumb-current').textContent = definition.title;
        content.innerHTML = `
            <div class="page-heading"><div><span class="eyebrow">PATIENT CARE</span><h1>${escapeHtml(definition.title)}</h1><p>${escapeHtml(definition.subtitle)}</p></div>
                <div class="toolbar"><label class="search-wrap"><span class="search-symbol" aria-hidden="true">&#9906;</span><input class="search-input" id="table-search" type="search" placeholder="Search ${escapeHtml(definition.title.toLowerCase())}" value="${escapeHtml(query)}" aria-label="Search ${escapeHtml(definition.title.toLowerCase())}"></label>
                <button class="button button-primary" type="button" data-action="create" data-type="${type}"><span aria-hidden="true">+</span> Add ${escapeHtml(definition.singular)}</button></div>
            </div>
            <section class="panel table-panel"><div class="panel-header"><div><h2>${escapeHtml(definition.title)} directory</h2><p>${rows.length} ${rows.length === 1 ? 'result' : 'results'}</p></div></div>
                ${renderTable(type, rows)}
                <div class="table-footer"><span>Showing ${rows.length} of ${data[type].length} records</span><span>Updated just now</span></div>
            </section>`;
        const search = document.querySelector('#table-search');
        search.addEventListener('input', event => renderList(type, event.target.value));
        search.focus({ preventScroll: true });
        search.setSelectionRange(query.length, query.length);
    }

    function setView(view) {
        currentView = view;
        document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view));
        if (view === 'overview') renderOverview();
        else renderList(view);
        document.querySelector('#sidebar').classList.remove('open');
        document.querySelector('#mobile-menu').setAttribute('aria-expanded', 'false');
    }

    function renderField(field, value, isEditing) {
        if (field.editOnly && !isEditing) return '';
        const id = `field-${field.name}`;
        const required = field.required ? 'required' : '';
        const common = `id="${id}" name="${field.name}" class="form-control" ${required}`;
        let control;
        if (field.type === 'select') {
            const options = field.options.map(option => `<option value="${escapeHtml(option)}" ${String(value || '').toUpperCase() === option ? 'selected' : ''}>${escapeHtml(option.charAt(0) + option.slice(1).toLowerCase())}</option>`).join('');
            control = `<select ${common}><option value="">Choose ${escapeHtml(field.label.toLowerCase())}</option>${options}</select>`;
        } else if (field.type === 'relation') {
            const options = data[field.relation].map(item => `<option value="${escapeHtml(item.id)}" ${String(value ?? '') === String(item.id) ? 'selected' : ''}>${escapeHtml(item.name)} (#${escapeHtml(item.id)})</option>`).join('');
            control = `<select ${common}><option value="">Choose ${escapeHtml(field.label.toLowerCase())}</option>${options}</select>`;
        } else if (field.type === 'textarea') {
            control = `<textarea ${common} placeholder="${escapeHtml(field.placeholder || '')}">${escapeHtml(value)}</textarea>`;
        } else {
            control = `<input ${common} type="${field.type || 'text'}" value="${escapeHtml(value)}" ${field.min != null ? `min="${field.min}"` : ''} placeholder="${escapeHtml(field.placeholder || '')}">`;
        }
        return `<div class="form-group ${field.full ? 'full' : ''}"><label for="${id}">${escapeHtml(field.label)}${field.required ? ' *' : ''}</label>${control}</div>`;
    }

    function openForm(type, row = null) {
        const definition = definitions[type];
        if (['appointments', 'records'].includes(type) && (!data.patients.length || !data.doctors.length)) {
            showToast('Add at least one patient and one doctor first.', true);
            return;
        }
        form.dataset.type = type;
        form.dataset.id = row?.id || '';
        document.querySelector('#dialog-eyebrow').textContent = definition.title.toUpperCase();
        document.querySelector('#dialog-title').textContent = `${row ? 'Edit' : 'Add'} ${definition.singular}`;
        document.querySelector('#save-record').textContent = row ? 'Save changes' : `Add ${definition.singular}`;
        fieldsContainer.innerHTML = definition.fields.map(field => renderField(field, row?.[field.name] ?? '', Boolean(row))).join('');
        dialog.showModal();
        fieldsContainer.querySelector('input, select, textarea')?.focus();
    }

    async function saveForm(event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const type = form.dataset.type;
        const id = form.dataset.id;
        const definition = definitions[type];
        const formData = new FormData(form);
        const payload = {};
        definition.fields.forEach(field => {
            if (field.editOnly && !id) return;
            const value = formData.get(field.name);
            if (value === null) return;
            payload[field.name] = field.type === 'number' || field.type === 'relation' ? Number(value) : String(value);
        });
        const saveButton = document.querySelector('#save-record');
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';
        try {
            await request(id ? `${endpoints[type]}/${id}` : endpoints[type], {
                method: id ? 'PUT' : 'POST', body: JSON.stringify(payload)
            });
            dialog.close();
            await loadData();
            showToast(`${definition.singular.charAt(0).toUpperCase() + definition.singular.slice(1)} ${id ? 'updated' : 'added'} successfully.`);
            setView(currentView);
        } catch (error) {
            showToast(error.message || 'Could not save this record.', true);
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = id ? 'Save changes' : `Add ${definition.singular}`;
        }
    }

    async function deleteRecord(type, id) {
        const item = data[type].find(entry => String(entry.id) === String(id));
        if (!window.confirm(`Delete ${definitions[type].singular}${item?.name ? ` ${item.name}` : ''}? This cannot be undone.`)) return;
        try {
            await request(`${endpoints[type]}/${id}`, { method: 'DELETE' });
            await loadData();
            showToast(`${definitions[type].singular.charAt(0).toUpperCase() + definitions[type].singular.slice(1)} deleted.`);
            setView(currentView);
        } catch (error) {
            showToast(error.message || 'Could not delete this record.', true);
        }
    }

    function showToast(message, isError = false) {
        toast.textContent = message;
        toast.classList.toggle('error', isError);
        toast.classList.add('visible');
        window.clearTimeout(toastTimeout);
        toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 3400);
    }

    document.addEventListener('click', event => {
        const viewButton = event.target.closest('[data-view]');
        if (viewButton) {
            setView(viewButton.dataset.view);
            return;
        }
        const actionButton = event.target.closest('[data-action]');
        if (!actionButton) return;
        if (actionButton.dataset.action === 'create') openForm(actionButton.dataset.type);
        if (actionButton.dataset.action === 'edit') {
            const row = data[actionButton.dataset.type].find(item => String(item.id) === actionButton.dataset.id);
            if (row) openForm(actionButton.dataset.type, row);
        }
        if (actionButton.dataset.action === 'delete') deleteRecord(actionButton.dataset.type, actionButton.dataset.id);
    });

    document.querySelector('#mobile-menu').addEventListener('click', event => {
        const sidebar = document.querySelector('#sidebar');
        const isOpen = sidebar.classList.toggle('open');
        event.currentTarget.setAttribute('aria-expanded', String(isOpen));
    });
    document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
    document.querySelector('#cancel-dialog').addEventListener('click', () => dialog.close());
    form.addEventListener('submit', saveForm);
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });

    loadData().then(() => setView('overview')).catch(error => {
        content.innerHTML = `<div class="error-state"><strong>Hospital data could not be loaded</strong><span>${escapeHtml(error.message || 'Please sign in and try again.')}</span><button class="button button-quiet" type="button" id="retry-load">Try again</button></div>`;
        document.querySelector('#retry-load').addEventListener('click', () => {
            content.innerHTML = '<div class="loading-state"><span class="loader"></span>Loading hospital data</div>';
            loadData().then(() => setView('overview')).catch(() => showToast('Still unable to load hospital data.', true));
        });
    });
})();