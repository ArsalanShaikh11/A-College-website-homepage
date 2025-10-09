const departmentSelect = document.getElementById("department");
const yearSelect = document.getElementById("year");
const subjectsContainer = document.getElementById("subjectsContainer");
const addCourseForm = document.getElementById("addCourseForm");

// Example subjects for each year
const subjectsByYear = {
  1: [
    ["Math 1", "Physics", "Chemistry", "Programming 1", "English", "Lab 1"],  // Sem 1
    ["Math 2", "Programming 2", "Electronics", "English 2", "Lab 2", "Environmental"]  // Sem 2
  ],
  2: [
    ["Data Structures", "DBMS", "OOP", "Operating Systems", "Discrete Math", "Lab 1"],
    ["Computer Networks", "Software Engg", "Microprocessors", "Lab 2", "AI Basics", "Elective"]
  ],
  3: [
    ["Algorithms", "Web Dev", "DB Admin", "Compiler Design", "Lab 1", "Elective"],
    ["Mobile Dev", "Cloud Computing", "Security", "Lab 2", "Elective", "Project"]
  ],
  4: [
    ["Machine Learning", "Big Data", "IoT", "Lab 1", "Elective", "Project"],
    ["Advanced AI", "Blockchain", "Cybersecurity", "Lab 2", "Elective", "Project"]
  ]
};

// Show semester subjects when year changes
yearSelect.addEventListener("change", () => {
  const year = yearSelect.value;
  if (!year || !subjectsByYear[year]) {
    subjectsContainer.innerHTML = "";
    return;
  }

  const semesters = subjectsByYear[year];
  let html = "";

  semesters.forEach((subjects, index) => {
    html += `<h3>Semester ${index + 1}</h3><ul>`;
    subjects.forEach(sub => {
      html += `<li>${sub}</li>`;
    });
    html += `</ul>`;
  });

  subjectsContainer.innerHTML = html;
});

// Handle Add Course form submission
addCourseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const department = departmentSelect.value;
  const year = parseInt(yearSelect.value);

  if (!department || !year) return alert("Select department and year");

  const semesters = subjectsByYear[year].map((subjects, index) => ({
    sem: index + 1,
    subjects
  }));

  try {
    const res = await fetch("http://localhost:3000/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department, year, semesters })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Course added successfully!");
      window.location.href = "index.html"; // Redirect to home page
    } else {
      alert(data.message || "Error adding course");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});
