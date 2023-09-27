document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("categorySelect");
    const jobResults = document.getElementById("jobResults");

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        let selectedCategory = categorySelect.value;
        jobResults.innerHTML = "";

        if (selectedCategory !== "none") {
            // Make an AJAX request
            fetch(`/api/jobs/${selectedCategory}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    const ol = document.createElement('ol');
                    const skillCounts = {}
                    const minSalaryCounts = []
                    const maxSalaryCounts = []
                    let minMonthlySalary
                    let maxMonthlySalary

                    data.forEach((job) => {
                        let job_title = job.job_title;
                        let region = job.location;
                        let company = job.company;
                        minMonthlySalary = job.min_monthly_salary;
                        maxMonthlySalary = job.max_monthly_salary;
                        let skills = job.skills;
                        let job_link = job.job_link;

                        const a = document.createElement('a');
                        const li = document.createElement('li');
                        const div = document.createElement('div');

                        a.href = job_link;
                        a.textContent = job_title;

                        div.textContent = `${region}/${company}/${minMonthlySalary}~${maxMonthlySalary}/${skills}`;
                        li.appendChild(a);
                        li.appendChild(div);
                        ol.appendChild(li);
                        
                        if (skills != "Null") {
                            const skillArray = JSON.parse(skills.replace(/'/g, '"'));
                            skillArray.forEach((skill) => {
                                skillCounts.hasOwnProperty(skill) ? skillCounts[skill]++ : (skillCounts[skill] = 1);
                            });
                        }
                        
                        if (minMonthlySalary != "Null") {
                            minSalaryCounts.push(minMonthlySalary)
                        }

                        if (maxMonthlySalary != "Null" && maxMonthlySalary != "Above") {
                            maxSalaryCounts.push(maxMonthlySalary)
                        }
                    });

                    jobResults.appendChild(ol);
                    selectedCategory = selectedCategory.replace("_", " ").toUpperCase();
                    drawSkillsChart(skillCounts, selectedCategory);
                    drawSalaryChart(minSalaryCounts, maxSalaryCounts, selectedCategory);
                })
                .catch((error) => {
                    console.error("There was a problem with the fetch operation:", error);
                });
        }
    });
});