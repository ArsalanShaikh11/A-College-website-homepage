const departmentDropdown = document.getElementById("departmentDropdown");
const coursesContainer = document.getElementById("coursesContainer");

// Fetch and display courses when department changes
departmentDropdown.addEventListener("change", async () => {
  const department = departmentDropdown.value;
  coursesContainer.innerHTML = "";

  if (!department) return;

  try {
    const res = await fetch(`http://localhost:3000/api/courses/${department}`);
    const courses = await res.json();

    if (!res.ok) return alert("Error fetching courses");

    if (courses.length === 0) {
      coursesContainer.textContent = "No courses found for this department.";
      return;
    }

    courses.forEach(course => {
      const courseDiv = document.createElement("div");
      courseDiv.classList.add("course-card");
      courseDiv.style.border = "1px solid #ccc";
      courseDiv.style.padding = "10px";
      courseDiv.style.margin = "10px 0";

      const title = document.createElement("h3");
      title.textContent = `Year ${course.year}`;
      courseDiv.appendChild(title);

      course.semesters.forEach(sem => {
        const semTitle = document.createElement("h4");
        semTitle.textContent = `Semester ${sem.sem}`;
        courseDiv.appendChild(semTitle);

        const ul = document.createElement("ul");
        sem.subjects.forEach(sub => {
          const li = document.createElement("li");
          li.textContent = sub;
          ul.appendChild(li);
        });
        courseDiv.appendChild(ul);
      });

      // Enroll button
      const enrollBtn = document.createElement("button");
      enrollBtn.textContent = "Enroll";
      enrollBtn.style.marginTop = "10px";
      enrollBtn.addEventListener("click", async () => {
        const studentName = prompt("Enter your name to enroll:");
        if (!studentName) return alert("Enrollment cancelled");

        try {
          const resEnroll = await fetch("http://localhost:3000/api/enrollments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentName,
              department: course.department,
              year: course.year,
              courseId: course._id
            })
          });

          const data = await resEnroll.json();
          if (resEnroll.ok) {
            alert(`✅ Enrolled in Year ${course.year} successfully!`);
          } else {
            alert(data.message || "Error enrolling");
          }
        } catch (err) {
          console.error(err);
          alert("Error connecting to server");
        }
      });

      courseDiv.appendChild(enrollBtn);
      coursesContainer.appendChild(courseDiv);
    });
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});
