async function calculateBreaks() {
    const btnCalculate = document.getElementById('btnCalculate');
    const btnText = btnCalculate.querySelector('.btn-text');
    const btnIcon = btnCalculate.querySelector('.btn-icon');
    
    const outputSection = document.getElementById('outputSection');
    const outputBody = document.getElementById('outputBody');
    const recordCount = document.getElementById('recordCount');

    const btnClear = document.getElementById('btnClear');

    btnCalculate.classList.add('loading');

    try {
        const response = await fetch('/Home/Calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Hesaplama işlemi sırasında bir hata oluştu.');
        }

        const data = await response.json();

        outputBody.innerHTML = '';

        data.forEach((record, index) => {
            const row = document.createElement('tr');

            if (record.statu === 'Duruş' && record.durusNedeni !== 'Arıza') {
                row.classList.add('row-system');
            } else if (record.statu === 'Duruş' && record.durusNedeni === 'Arıza') {
                row.classList.add('row-fault');
            }

            row.style.animation = `fadeInRow 0.3s ease ${index * 0.04}s both`;

            const statusClass = record.statu === 'Üretim' ? 'status-production' : 'status-fault';
            const statusIcon = record.statu === 'Üretim' ? 'ph-plus' : (record.statu === 'Duruş' ? 'ph-minus' : 'ph-info');
            
            let reasonIcon = '';
            if (record.durusNedeni === 'Çay Molası') reasonIcon = 'ph-coffee';
            else if (record.durusNedeni === 'Yemek Molası') reasonIcon = 'ph-fork-knife';
            else if (record.durusNedeni === 'Arıza') reasonIcon = 'ph-wrench';

            let durusHtml = '—';
            if (record.durusNedeni) {
                durusHtml = `<div style="display:flex; align-items:center; justify-content:center; gap:0.35rem;">
                                <i class="ph-bold ${reasonIcon}"></i>
                                <span>${record.durusNedeni}</span>
                             </div>`;
            }

            row.innerHTML = `
                <td class="col-id">${record.kayitNo}</td>
                <td class="cell-center">${record.baslangicDate}</td>
                <td class="cell-center">${record.baslangicTime}</td>
                <td class="cell-center">${record.bitisDate}</td>
                <td class="cell-center">${record.bitisTime}</td>
                <td class="cell-center">${record.toplamSure}</td>
                <td class="cell-center ${statusClass}">
                    <div style="display:flex; align-items:center; justify-content:center; gap:0.35rem;">
                        <i class="ph-bold ${statusIcon}"></i>
                        <span>${record.statu}</span>
                    </div>
                </td>
                <td>${durusHtml}</td>
            `;

            outputBody.appendChild(row);
        });

        recordCount.textContent = data.length > 0 ? `${data.length} kayıt` : 'Kayıt bulunmuyor';

        setTimeout(() => {
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);

        btnCalculate.disabled = true;
        btnClear.disabled = false;

        btnCalculate.classList.remove('loading');

    } catch (error) {
        console.error('Hata:', error);
        btnCalculate.classList.remove('loading');
    }
}

function clearOutput() {
    const outputBody = document.getElementById('outputBody');
    const recordCount = document.getElementById('recordCount');
    const btnCalculate = document.getElementById('btnCalculate');
    const btnClear = document.getElementById('btnClear');
    
    if (outputBody && recordCount) {
        outputBody.innerHTML = '';
        recordCount.textContent = 'Kayıt bulunmuyor';
    }

    btnCalculate.disabled = false;
    btnClear.disabled = true;
}

function syncHeaderActionsWidth() {
    const headerActions = document.querySelector('.header-actions');
    const table2Wrapper = document.querySelector('.table2-wrapper');

    if (!headerActions || !table2Wrapper) {
        return;
    }

    if (window.matchMedia('(max-width: 900px)').matches) {
        headerActions.style.width = '100%';
        return;
    }

    const tableWidth = Math.round(table2Wrapper.getBoundingClientRect().width);
    if (tableWidth > 0) {
        headerActions.style.width = `${tableWidth}px`;
    }
}

window.addEventListener('load', syncHeaderActionsWidth);
window.addEventListener('resize', syncHeaderActionsWidth);

(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInRow {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
})();
