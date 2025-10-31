const REPORT_DATA = [
  {
    id_laporan: "LPR-2025-1001",
    periode_awal: "2025-10-01",
    periode_akhir: "2025-10-07",
    tanggal_dibuat: "2025-10-08",
    total_pesanan: 86,
    total_pendapatan: 25800000,
    dibuat_oleh: "Rani Pratama",
  },
  {
    id_laporan: "LPR-2025-1002",
    periode_awal: "2025-10-08",
    periode_akhir: "2025-10-15",
    tanggal_dibuat: "2025-10-16",
    total_pesanan: 134,
    total_pendapatan: 48950000,
    dibuat_oleh: "Rani Pratama",
  },
  {
    id_laporan: "LPR-2025-1003",
    periode_awal: "2025-10-16",
    periode_akhir: "2025-10-23",
    tanggal_dibuat: "2025-10-24",
    total_pesanan: 102,
    total_pendapatan: 31575000,
    dibuat_oleh: "Fajar Nugraha",
  },
  {
    id_laporan: "LPR-2025-1004",
    periode_awal: "2025-10-24",
    periode_akhir: "2025-10-31",
    tanggal_dibuat: "2025-10-31",
    total_pesanan: 118,
    total_pendapatan: 36200000,
    dibuat_oleh: "Fajar Nugraha",
  },
];

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const monthShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const MIN_REPORT_DATE = new Date("2025-09-01T00:00:00");

function startOfDay(date) {
  const cloned = new Date(date);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
}

function parseISODate(value) {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateNumeric(date) {
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateLong(date) {
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatRangeLabel(start, end) {
  const dayStart = `${start.getDate()}`.padStart(2, "0");
  const dayEnd = `${end.getDate()}`.padStart(2, "0");
  const shortStart = monthShort[start.getMonth()];
  const shortEnd = monthShort[end.getMonth()];
  if (shortStart === shortEnd && start.getFullYear() === end.getFullYear()) {
    return `Rentang: ${dayStart} - ${dayEnd} ${shortEnd} ${end.getFullYear()}`;
  }
  return `Rentang: ${dayStart} ${shortStart} ${start.getFullYear()} - ${dayEnd} ${shortEnd} ${end.getFullYear()}`;
}

function formatCurrencyID(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search)) || {};
}

function buildUrl(path, params) {
  const search = new URLSearchParams(params ?? {});
  return `${path}${search.toString() ? `?${search.toString()}` : ""}`;
}

function filterReportData(startDate, endDate) {
  return REPORT_DATA.filter((report) => {
    const periodStart = parseISODate(report.periode_awal);
    const periodEnd = parseISODate(report.periode_akhir);
    if (!periodStart || !periodEnd) return false;
    return periodStart >= startDate && periodEnd <= endDate;
  });
}

function navigateReport(startValue, endValue, opts = {}) {
  const startDate = parseISODate(startValue);
  const endDate = parseISODate(endValue);
  const today = startOfDay(new Date());

  if (!startDate || !endDate || startDate > endDate) {
    window.location.href = buildUrl("report-empty.html", {
      state: "invalid",
      reason: "order",
      start: startValue || "",
      end: endValue || "",
    });
    return;
  }

  if (startDate < MIN_REPORT_DATE || endDate < MIN_REPORT_DATE || startDate > today || endDate > today) {
    window.location.href = buildUrl("report-empty.html", {
      state: "invalid",
      reason: "range",
      start: startValue,
      end: endValue,
    });
    return;
  }

  const filtered = filterReportData(startDate, endDate);
  if (!filtered.length) {
    window.location.href = buildUrl("report-empty.html", {
      state: "empty",
      start: startValue,
      end: endValue,
    });
    return;
  }

  const format = opts.format || "pdf";
  window.location.href = buildUrl("report-preview.html", {
    start: startValue,
    end: endValue,
    format,
  });
}

function handleLoginPage() {
  const loginForm = document.querySelector("body.login-body form.login-form:not(.register-form)");
  const alertBox = document.querySelector('[data-alert="auth"]');
  if (!loginForm) return;

  const params = getQueryParams();
  if (params.registered === "1") {
    showAlert(alertBox, "Registrasi berhasil. Silakan login menggunakan akun baru.", "success");
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showAlert(alertBox, "Login berhasil. Mengarahkan ke dashboard...", "success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });
}

function handleRegisterPage() {
  const registerForm = document.querySelector("form.register-form");
  const alertBox = document.querySelector('[data-alert="register"]');
  if (!registerForm) return;

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (alertBox) {
      showAlert(alertBox, "Akun admin berhasil dibuat. Mengalihkan ke halaman login...", "success");
    }
    setTimeout(() => {
      window.location.href = "login.html?registered=1";
    }, 900);
  });
}

function showAlert(element, message, type = "info") {
  if (!element) return;
  element.textContent = message;
  element.classList.remove("hidden", "is-error", "is-success");
  if (type === "error") {
    element.classList.add("is-error");
  } else if (type === "success") {
    element.classList.add("is-success");
  }
}

function handleDashboardPage() {
  const dashboardBody = document.querySelector("body.dashboard-body");
  if (!dashboardBody) return;

  if (window.location.pathname.endsWith("dashboard.html") && window.location.hash === "#report") {
    window.location.replace("report.html");
    return;
  }

  const form = document.querySelector(".report-card .date-range-form");
  if (!form) return;

  const alertBox = document.querySelector('[data-alert="date"]');

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const startValue = form.elements["start-date"].value;
    const endValue = form.elements["end-date"].value;
    const startDate = parseISODate(startValue);
    const endDate = parseISODate(endValue);
    const today = startOfDay(new Date());

    if (!startDate || !endDate) {
      showAlert(alertBox, "Tanggal tidak valid. Pastikan kedua tanggal terisi.", "error");
      return;
    }

    if (startDate > endDate) {
      showAlert(alertBox, "Tanggal tidak valid. Tanggal mulai melewati tanggal selesai.", "error");
      setTimeout(() => navigateReport(startValue, endValue), 600);
      return;
    }

    if (startDate < MIN_REPORT_DATE || endDate < MIN_REPORT_DATE) {
      showAlert(alertBox, "Tanggal tidak valid. Rentang minimal September 2025.", "error");
      setTimeout(() => navigateReport(startValue, endValue), 600);
      return;
    }

    if (startDate > today || endDate > today) {
      showAlert(alertBox, "Tanggal tidak valid. Rentang tidak boleh melewati hari ini.", "error");
      setTimeout(() => navigateReport(startValue, endValue), 600);
      return;
    }

    alertBox?.classList.add("hidden");
    navigateReport(startValue, endValue);
  });
}

function handleEmptyReportPage() {
  const emptyTitle = document.querySelector("[data-empty-title]");
  if (!emptyTitle) return;
  const params = getQueryParams();
  const startValue = params.start;
  const endValue = params.end;
  const state = params.state || "empty";

  const startDate = parseISODate(startValue) || MIN_REPORT_DATE;
  const endDate = parseISODate(endValue) || startOfDay(new Date());
  const rangeLabel = document.querySelector("[data-range-label]");
  if (rangeLabel) {
    rangeLabel.textContent = formatRangeLabel(startDate, endDate);
  }

  const description = document.querySelector("[data-empty-desc]");

  if (state === "invalid") {
    emptyTitle.textContent = "Tanggal tidak valid";
    if (description) {
      description.textContent = "Tidak Ada Data Ditemukan. Silakan pilih rentang tanggal yang berada antara September 2025 hingga hari ini.";
    }
  } else {
    emptyTitle.textContent = "Tidak Ada Data Ditemukan";
    if (description) {
      description.textContent = "Tidak ada transaksi yang ditemukan untuk rentang tanggal yang Anda pilih. Silakan coba rentang tanggal yang lain.";
    }
  }

  const form = document.querySelector("[data-form-empty]");
  if (form) {
    if (startValue) form.elements["start-date"].value = startValue;
    if (endValue) form.elements["end-date"].value = endValue;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const startVal = form.elements["start-date"].value;
      const endVal = form.elements["end-date"].value;
      navigateReport(startVal, endVal);
    });
  }
}

function handlePreviewPage() {
  const tableBody = document.querySelector("[data-report-rows]");
  if (!tableBody) return;
  const params = getQueryParams();
  const startValue = params.start || "2025-10-01";
  const endValue = params.end || "2025-10-31";
  const startDate = parseISODate(startValue) || MIN_REPORT_DATE;
  const endDate = parseISODate(endValue) || startOfDay(new Date());
  const selectedFormat = ["pdf", "excel"].includes((params.format || "").toLowerCase())
    ? params.format.toLowerCase()
    : "pdf";

  const rangeTitle = document.querySelector("[data-range-title]");
  if (rangeTitle) {
    rangeTitle.textContent = `Pratinjau Laporan: ${formatDateLong(startDate)} - ${formatDateLong(endDate)}`;
  }

  const rangeLabel = document.querySelector("[data-range-label]");
  if (rangeLabel) {
    rangeLabel.textContent = formatRangeLabel(startDate, endDate);
  }

  const filtered = filterReportData(startDate, endDate);
  const reportCount = document.querySelector("[data-report-count]");
  if (reportCount) {
    reportCount.textContent = filtered.length.toString();
  }
  renderReportTable(tableBody, filtered);

  const formatButtons = document.querySelectorAll(".format-switch .chip");
  let activeFormat = selectedFormat;
  formatButtons.forEach((button) => {
    const value = button.textContent.trim().toLowerCase();
    if (value === activeFormat) {
      button.classList.add("is-active");
    } else {
      button.classList.remove("is-active");
    }
    button.addEventListener("click", () => {
      activeFormat = value;
      formatButtons.forEach((btn) => btn.classList.toggle("is-active", btn === button));
    });
  });

  const generateButton = document.querySelector("[data-generate-report]");
  generateButton?.addEventListener("click", () => {
    downloadReport(filtered, activeFormat, startDate, endDate);
  });
}

function renderReportTable(tbody, data) {
  tbody.innerHTML = "";
  if (!data.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.className = "table-empty";
    cell.textContent = "Tidak ada data untuk rentang tanggal ini.";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  data.forEach((report) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${report.id_laporan}</td>
      <td>${formatDateNumeric(parseISODate(report.periode_awal))}</td>
      <td>${formatDateNumeric(parseISODate(report.periode_akhir))}</td>
      <td>${formatDateNumeric(parseISODate(report.tanggal_dibuat))}</td>
      <td>${report.total_pesanan.toLocaleString("id-ID")}</td>
      <td>${formatCurrencyID(report.total_pendapatan)}</td>
      <td>${report.dibuat_oleh}</td>
    `;
    tbody.appendChild(row);
  });
}

function downloadReport(data, format, startDate, endDate) {
  if (!data.length) {
    alert("Tidak ada data untuk diunduh.");
    return;
  }
  const filenameBase = `laporan-pesanan-${startDate.toISOString().split("T")[0]}-to-${endDate.toISOString().split("T")[0]}`;

  const header = [
    "ID Laporan",
    "Periode Awal",
    "Periode Akhir",
    "Tanggal Dibuat",
    "Total Pesanan",
    "Total Pendapatan",
    "Dibuat Oleh",
  ];
  const rows = data.map((report) => [
    report.id_laporan,
    formatDateNumeric(parseISODate(report.periode_awal)),
    formatDateNumeric(parseISODate(report.periode_akhir)),
    formatDateNumeric(parseISODate(report.tanggal_dibuat)),
    report.total_pesanan.toLocaleString("id-ID"),
    formatCurrencyID(report.total_pendapatan),
    report.dibuat_oleh,
  ]);

  if (format === "excel") {
    const csvLines = [header.join(",")].concat(rows.map((cols) => cols.join(",")));
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv" });
    triggerDownload(blob, `${filenameBase}.csv`);
  } else {
    const lines = [
      "QateringGo - Laporan Pesanan",
      `Rentang: ${formatDateLong(startDate)} - ${formatDateLong(endDate)}`,
      "",
      header.join(" | "),
      "-".repeat(112),
      ...rows.map((cols) => cols.join(" | ")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "application/pdf" });
    triggerDownload(blob, `${filenameBase}.pdf`);
  }
}

function triggerDownload(blob, filename) {
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}

function init() {
  handleLoginPage();
  handleRegisterPage();
  handleDashboardPage();
  handleEmptyReportPage();
  handlePreviewPage();
}

document.addEventListener("DOMContentLoaded", init);
