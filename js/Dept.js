// department.js

const departmentsList = document.getElementById("departmentsList");
const coursesContainer = document.getElementById("coursesContainer");

// Step 1: Fetch all unique departments from backend
async function loadDepartments() {
  try {
    const response = await fetch("http://localhost:3000/api/courses");
    const courses = await response.json();

    if (!Array.isArray(courses)) {
      throw new Error("Invalid response format");
    }

    // Extract unique department names
    const uniqueDepartments = [...new Set(courses.map((c) => c.department))];

    // Clear and display them
    departmentsList.innerHTML = "";
    uniqueDepartments.forEach((dept) => {
      const deptDiv = document.createElement("div");
      deptDiv.classList.add("department-card");
      deptDiv.textContent = dept;

      // When clicked, fetch courses of this department
      deptDiv.addEventListener("click", () => fetchCoursesByDepartment(dept));

      departmentsList.appendChild(deptDiv);
    });
  } catch (error) {
    console.error("Error loading departments:", error);
    alert("Error connecting to server. Please ensure backend is running.");
  }
}

// Step 2: Fetch and display courses for a selected department
async function fetchCoursesByDepartment(department) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/courses/${department}`
    );
    const courses = await response.json();

    coursesContainer.innerHTML = `<h2>Courses offered by ${department} Department:</h2>`;

    if (courses.length === 0) {
      coursesContainer.innerHTML += "<p>No courses available.</p>";
      return;
    }

    // Show each course card
    courses.forEach((course) => {
      const courseCard = document.createElement("div");
      courseCard.classList.add("course-card");
      courseCard.innerHTML = `
        <h3>${course.courseName}</h3>
        <p><strong>Code:</strong> ${course.courseCode}</p>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <p><strong>Description:</strong> ${
          course.description || "No description available."
        }</p>
        <button class="enroll-btn" onclick="enrollCourse('${course._id}', '${
        course.courseName
      }')">Enroll</button>
      `;
      coursesContainer.appendChild(courseCard);
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    alert("Error loading courses for this department.");
  }
}

// Step 3: Enroll student in a course
async function enrollCourse(courseId, courseName) {
  const studentName = localStorage.getItem("studentName"); // assuming you store it on login
  if (!studentName) {
    alert("Please log in before enrolling.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, courseId }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(`Successfully enrolled in ${courseName}`);
    } else {
      alert(data.message || "Enrollment failed");
    }
  } catch (error) {
    console.error("Enrollment error:", error);
    alert("Error enrolling in the course");
  }
}

// Step 4: Load all departments when page loads
loadDepartments();
