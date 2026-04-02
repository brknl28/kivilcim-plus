function normalizeText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

function formatDuration(ms) {
    const totalMinutes = Math.round(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours}s ${minutes}dk`;
    }
    if (hours > 0) {
        return `${hours}s`;
    }
    return `${minutes}dk`;
}

function parseDateTime(dateText, timeText) {
    const [day, month, year] = dateText.split(".").map(Number);
    const [hours, minutes] = timeText.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function parseMinutes(text) {
    const match = text.match(/(\d{2}:\d{2})/);
    if (!match) {
        return null;
    }
    const [hours, minutes] = match[1].split(":").map(Number);
    return hours * 60 + minutes;
}

function normalizeStatus(text) {
    const value = normalizeText(text).toLowerCase();
    if (value.includes("durus") || value.includes("duru")) {
        return "Durus";
    }
    return "Uretim";
}

function normalizeReason(text) {
    const value = normalizeText(text);
    if (!value || value === "-" || value === "—") {
        return null;
    }
    return value;
}

function extractOperatorRecords() {
    const rows = document.querySelectorAll(".tables-input .table-card--red tbody tr");
    const records = [];

    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 8) {
            return;
        }

        const baslangicDate = normalizeText(cells[1].textContent);
        const baslangicTime = normalizeText(cells[2].textContent);
        const bitisDate = normalizeText(cells[3].textContent);
        const bitisTime = normalizeText(cells[4].textContent);

        if (!baslangicDate || !baslangicTime || !bitisDate || !bitisTime) {
            return;
        }

        records.push({
            kayitNo: Number(normalizeText(cells[0].textContent)) || records.length + 1,
            baslangic: parseDateTime(baslangicDate, baslangicTime),
            bitis: parseDateTime(bitisDate, bitisTime),
            statu: normalizeStatus(cells[6].textContent),
            durusNedeni: normalizeReason(cells[7].textContent)
        });
    });

    return records.sort((a, b) => a.baslangic - b.baslangic);
}

function extractStandardBreaks() {
    const rows = document.querySelectorAll(".table-card--danger tbody tr");
    const breaks = [];

    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) {
            return;
        }

        const startMinutes = parseMinutes(normalizeText(cells[0].textContent));
        const endMinutes = parseMinutes(normalizeText(cells[1].textContent));
        if (startMinutes === null || endMinutes === null) {
            return;
        }

        const reason = normalizeReason(cells[3].textContent);
        breaks.push({
            baslangicMinutes: startMinutes,
            bitisMinutes: endMinutes,
            durusNedeni: reason || "Durus"
        });
    });

    return breaks.sort((a, b) => a.baslangicMinutes - b.baslangicMinutes);
}

function addMinutes(date, minutes) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    result.setMinutes(minutes);
    return result;
}

function splitProductionRecord(record, breaks, result) {
    let currentStart = new Date(record.baslangic);
    const recordEnd = new Date(record.bitis);
    const recordDate = new Date(record.baslangic.getFullYear(), record.baslangic.getMonth(), record.baslangic.getDate());

    const relevantBreaks = breaks
        .map((item) => {
            const breakStart = addMinutes(recordDate, item.baslangicMinutes);
            const breakEnd = addMinutes(recordDate, item.bitisMinutes);
            return { ...item, breakStart, breakEnd };
        })
        .filter((item) => item.breakStart >= currentStart && item.breakStart < recordEnd)
        .sort((a, b) => a.breakStart - b.breakStart);

    relevantBreaks.forEach((breakItem) => {
        if (currentStart < breakItem.breakStart) {
            result.push({
                kayitNo: record.kayitNo,
                baslangic: new Date(currentStart),
                bitis: new Date(breakItem.breakStart),
                statu: "Uretim",
                durusNedeni: null
            });
        }

        result.push({
            kayitNo: record.kayitNo,
            baslangic: new Date(breakItem.breakStart),
            bitis: new Date(breakItem.breakEnd),
            statu: "Durus",
            durusNedeni: breakItem.durusNedeni
        });

        currentStart = new Date(breakItem.breakEnd);
    });

    if (currentStart < recordEnd) {
        result.push({
            kayitNo: record.kayitNo,
            baslangic: new Date(currentStart),
            bitis: new Date(recordEnd),
            statu: "Uretim",
            durusNedeni: null
        });
    }
}

function calculateOutputRecords(operatorRecords, standardBreaks) {
    const result = [];

    operatorRecords.forEach((record) => {
        if (record.statu === "Durus") {
            result.push({
                kayitNo: record.kayitNo,
                baslangic: new Date(record.baslangic),
                bitis: new Date(record.bitis),
                statu: record.statu,
                durusNedeni: record.durusNedeni
            });
            return;
        }

        splitProductionRecord(record, standardBreaks, result);
    });

    return result;
}

function getStatusIcon(statu) {
    if (statu === "Uretim") {
        return "ph-plus";
    }
    if (statu === "Durus") {
        return "ph-minus";
    }
    return "ph-info";
}

function getReasonIcon(reason) {
    if (reason === "Cay Molasi") {
        return "ph-coffee";
    }
    if (reason === "Yemek Molasi") {
        return "ph-fork-knife";
    }
    if (reason === "Ariza") {
        return "ph-wrench";
    }
    return "ph-circle";
}

function renderOutputRows(data) {
    const outputSection = document.getElementById("outputSection");
    const outputBody = document.getElementById("outputBody");
    const recordCount = document.getElementById("recordCount");

    outputBody.innerHTML = "";

    data.forEach((record, index) => {
        const row = document.createElement("tr");

        if (record.statu === "Durus" && record.durusNedeni !== "Ariza") {
            row.classList.add("row-system");
        } else if (record.statu === "Durus" && record.durusNedeni === "Ariza") {
            row.classList.add("row-fault");
        }

        row.style.animation = `fadeInRow 0.3s ease ${index * 0.04}s both`;

        const statusClass = record.statu === "Uretim" ? "status-production" : "status-fault";
        const statusIcon = getStatusIcon(record.statu);

        let reasonHtml = "—";
        if (record.durusNedeni) {
            reasonHtml = `<div style="display:flex; align-items:center; justify-content:center; gap:0.35rem;">
                                <i class="ph-bold ${getReasonIcon(record.durusNedeni)}"></i>
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
            <td>${reasonHtml}</td>
        `;

        outputBody.appendChild(row);
    });

    recordCount.textContent = data.length > 0 ? `${data.length} kayit` : "Kayit bulunmuyor";

    setTimeout(() => {
        outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
}

function calculateBreaks() {
    const btnCalculate = document.getElementById("btnCalculate");
    const btnClear = document.getElementById("btnClear");

    btnCalculate.classList.add("loading");

    try {
        const operatorRecords = extractOperatorRecords();
        const standardBreaks = extractStandardBreaks();
        const outputRecords = calculateOutputRecords(operatorRecords, standardBreaks)
            .map((item, index) => ({
                kayitNo: index + 1,
                baslangicDate: formatDate(item.baslangic),
                baslangicTime: formatTime(item.baslangic),
                bitisDate: formatDate(item.bitis),
                bitisTime: formatTime(item.bitis),
                toplamSure: formatDuration(item.bitis - item.baslangic),
                statu: item.statu,
                durusNedeni: item.durusNedeni || ""
            }));

        renderOutputRows(outputRecords);

        btnCalculate.disabled = true;
        btnClear.disabled = false;
        btnCalculate.classList.remove("loading");
    } catch (error) {
        console.error("Hata:", error);
        btnCalculate.classList.remove("loading");
    }
}

function clearOutput() {
    const outputBody = document.getElementById("outputBody");
    const recordCount = document.getElementById("recordCount");
    const btnCalculate = document.getElementById("btnCalculate");
    const btnClear = document.getElementById("btnClear");

    if (outputBody && recordCount) {
        outputBody.innerHTML = "";
        recordCount.textContent = "Kayit bulunmuyor";
    }

    btnCalculate.disabled = false;
    btnClear.disabled = true;
}

function syncHeaderActionsWidth() {
    const headerActions = document.querySelector(".header-actions");
    const table2Wrapper = document.querySelector(".table2-wrapper");

    if (!headerActions || !table2Wrapper) {
        return;
    }

    if (window.matchMedia("(max-width: 900px)").matches) {
        headerActions.style.width = "100%";
        return;
    }

    const tableWidth = Math.round(table2Wrapper.getBoundingClientRect().width);
    if (tableWidth > 0) {
        headerActions.style.width = `${tableWidth}px`;
    }
}

window.addEventListener("load", syncHeaderActionsWidth);
window.addEventListener("resize", syncHeaderActionsWidth);

(function () {
    const style = document.createElement("style");
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
