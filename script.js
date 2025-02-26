// Generate roll numbers dynamically
const students = [];
const rollPrefixes = [
    { start: 3372, end: 3399, prefix: "232U1A33" },
    { start: 340, end: 349, prefix: "232U1A33A" },
    { start: 350, end: 359, prefix: "232U1A33B" },
    { start: 360, end: 369, prefix: "232U1A33C" },
    { start: 370, end: 371, prefix: "232U1A33D" },
    { start: 301, end: 311, prefix: "232U5A33" }
];

rollPrefixes.forEach(range => {
    for (let i = range.start; i <= range.end; i++) {
        students.push({ rollNo: range.prefix + i, status: null });
    }
});

// Generate Attendance Table
function generateAttendanceTable() {
    const tableBody = document.getElementById("attendance-list");
    students.forEach(student => {
        const row = document.createElement("tr");

        // Roll Number Cell
        const rollNoCell = document.createElement("td");
        rollNoCell.textContent = student.rollNo;
        row.appendChild(rollNoCell);

        // Attendance Cell with Buttons
        const attendanceCell = document.createElement("td");

        const presentBtn = document.createElement("button");
        presentBtn.textContent = "Present";
        presentBtn.classList.add("attendance-btn", "present");
        presentBtn.onclick = () => markAttendance(student.rollNo, "Present", attendanceCell);

        const absentBtn = document.createElement("button");
        absentBtn.textContent = "Absent";
        absentBtn.classList.add("attendance-btn", "absent");
        absentBtn.onclick = () => markAttendance(student.rollNo, "Absent", attendanceCell);

        attendanceCell.appendChild(presentBtn);
        attendanceCell.appendChild(absentBtn);
        row.appendChild(attendanceCell);
        tableBody.appendChild(row);
    });
}

// Mark Attendance
function markAttendance(rollNo, status, attendanceCell) {
    const student = students.find(s => s.rollNo === rollNo);
    student.status = status;

    // Update UI
    attendanceCell.innerHTML = `<span>${status}</span>`;

    const undoBtn = document.createElement("button");
    undoBtn.textContent = "Undo";
    undoBtn.classList.add("undo-btn");
    undoBtn.onclick = () => undoAttendance(student.rollNo, attendanceCell);
    attendanceCell.appendChild(undoBtn);
}

// Undo Attendance
function undoAttendance(rollNo, attendanceCell) {
    const student = students.find(s => s.rollNo === rollNo);
    student.status = null;
    attendanceCell.innerHTML = `<button class="attendance-btn present" onclick="markAttendance('${rollNo}', 'Present', this.parentElement)">Present</button>
                                <button class="attendance-btn absent" onclick="markAttendance('${rollNo}', 'Absent', this.parentElement)">Absent</button>`;
}

// Submit Attendance
function submitAttendance() {
    const summaryList = document.getElementById("attendance-summary-list");
    summaryList.innerHTML = "";

    students.forEach(student => {
        if (student.status) {
            submitToGoogleForm(student.rollNo, student.status);

            const row = document.createElement("tr");
            row.innerHTML = `<td>${student.rollNo}</td><td>${student.status}</td>`;
            summaryList.appendChild(row);
        }
    });

    // Hide Table & Button, Show Summary
    document.querySelector(".attendance-table").style.display = 'none';
    document.getElementById("submit-btn").style.display = 'none';
    document.getElementById("summary-title").style.display = 'block';
    document.getElementById("attendance-summary").style.display = 'block';
    document.getElementById("attendance-summary").scrollIntoView({ behavior: "smooth" });

    alert("Attendance Submitted!");
}

// Submit to Google Form
function submitToGoogleForm(rollNo, status) {
    const formData = new FormData();
    formData.append("entry.297050323", rollNo);
    formData.append("entry.945201620", status);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLScD-U0b0vvYNemRcAHWZH2J64OmXZuimsTCSKlvyFLGMXBuDQ/formResponse", {
        method: "POST",
        body: formData,
        mode: "no-cors"
    });
}

// Initialize Table
window.onload = generateAttendanceTable;
