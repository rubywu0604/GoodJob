var loader;

function loadNow(opacity) {
    if (opacity <= 0) {
        displayContent();
    } else {
        loader.style.opacity = opacity;
        window.setTimeout(function () {
            loadNow(opacity - 0.02);
        }, 50);
    }
}

function displayContent() {
    loader.style.display = 'none';
    document.getElementById('container').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function () {
    loader = document.getElementById('loader');
    loadNow(1);
    fetch(`/api/jobs`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const jobCounts = { 
                ios_engineer: 0,
                android_engineer: 0,
                frontend_engineer: 0,
                backend_engineer: 0,
                data_engineer: 0,
                data_analyst: 0,
                data_scientist: 0,
                dba: 0
            }
            data.forEach((job) => {
                const category = job.category;
                category == "dba_engineer" ? jobCounts['dba']++ : jobCounts[category]++;
            })
            drawJobCounts(jobCounts);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
});

document.querySelector("form").addEventListener("submit", function (e) {
    const categorySelect = document.getElementById("categorySelect");
    const jobResults = document.getElementById("jobResults");
    e.preventDefault(); // Prevent the default form submission

    let selectedCategory = categorySelect.value;
    jobResults.innerHTML = "";

    if (selectedCategory !== "none") {
        // AJAX request
        fetch(`/api/jobs/${selectedCategory}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const ol = document.createElement('ol');
                const skillCounts = {}
                const salaryCounts = []
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
                    };

                    if (minMonthlySalary > 0) {
                        salaryCounts.push(Number(minMonthlySalary));
                    } else if (maxMonthlySalary > 0) {
                        salaryCounts.push(Number(maxMonthlySalary));
                    };
                });

                jobResults.appendChild(ol);
                selectedCategory = selectedCategory.replace("_", " ").toLowerCase();
                drawSkillsChart(skillCounts, selectedCategory);
                drawSalaryChart(salaryCounts, selectedCategory);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    }
});