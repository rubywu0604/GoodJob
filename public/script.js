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
            const jobDetails = {
                ios_engineer: { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary:[] },
                android_engineer: { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                frontend_engineer: { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                backend_engineer: { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                data_engineer: { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                data_analyst: { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                data_scientist: { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                dba: { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
            };
            
            data.forEach((job) => {
                category = job.category;
                const minMonthlySalary = job.min_monthly_salary;
                const maxMonthlySalary = job.max_monthly_salary;

                category == "dba_engineer" ? jobDetails['dba'].counts++ : jobDetails[category].counts++;

                if (Object.keys(jobDetails).includes(category)) {
                    if (minMonthlySalary > 0) {
                        jobDetails[category].aryMinSalary.push(Number(minMonthlySalary));
                    }
                    if (maxMonthlySalary > 0) {
                        jobDetails[category].aryMaxSalary.push(Number(maxMonthlySalary));
                    };
                }
            });

            const jobDetailsValues = Object.values(jobDetails);
            jobDetailsValues.forEach((value) => {
                value.avgMinSalary = Math.round(value.aryMinSalary.reduce((sum, salary) => sum + salary, 0) / value.aryMinSalary.length);
                value.avgMaxSalary = Math.round(value.aryMaxSalary.reduce((sum, salary) => sum + salary, 0) / value.aryMaxSalary.length);
            });

            drawJobCounts(jobDetails);
            drawAvgSalary(jobDetails);
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

                data.forEach((job) => {
                    const job_title = job.job_title;
                    const region = job.location;
                    const company = job.company;
                    const minMonthlySalary = job.min_monthly_salary;
                    const maxMonthlySalary = job.max_monthly_salary;
                    const skills = job.skills;
                    const job_link = job.job_link;

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