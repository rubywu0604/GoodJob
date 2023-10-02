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
                "iOS Engineer": { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                "Android Engineer": { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                "Frontend Engineer": { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                "Backend Engineer": { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                "Data Engineer": { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                "Data Analyst": { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                "Data Scientist": { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
                "Dba": { counts: 0, avgMinSalary: 0, avgMaxSalary: 0, aryMinSalary: [], aryMaxSalary: [] },
            };
            const experienceCounts = {};
            
            data.forEach((job) => {
                category = job.category;
                category = category.replace("_", " ");
                if (category === "ios engineer") {
                    category = "iOS Engineer";
                } else {
                    category = category.replace(/\b\w/g, function (char) {
                        return char.toUpperCase();
                    });
                }

                const minMonthlySalary = job.min_monthly_salary;
                const maxMonthlySalary = job.max_monthly_salary;
                let experience = job.experience;

                (category === "Dba Engineer") ? jobDetails['Dba'].counts++ : jobDetails[category].counts++;
                (experience === 0) ? (experience = "不拘") : (experience = `${experience}年`);
                experienceCounts.hasOwnProperty(experience) ? experienceCounts[experience]++ : (experienceCounts[experience] = 1);

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
            drawExperience(experienceCounts)
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
});

document.querySelector("form").addEventListener("submit", function (e) {
    const categorySelect = document.getElementById("categorySelect");
    const jobResults = document.getElementById("jobResults");
    const yearSalary = document.getElementById('yearAvgSalary');
    const listCategory = document.getElementById('listCategory');
    e.preventDefault(); // Prevent the default form submission

    let selectedCategory = categorySelect.value;
    let yearAvgSalary;
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
                const skillCounts = {};
                const educationCounts = {};
                const salaryCounts = [];
                const minSalaryAry = [];
                const maxSalaryAry = [];

                data.forEach((job) => {
                    const job_title = job.job_title;
                    const region = job.location;
                    const company = job.company;
                    const minMonthlySalary = job.min_monthly_salary;
                    const maxMonthlySalary = job.max_monthly_salary;
                    const skills = job.skills;
                    const job_link = job.job_link;
                    const education = job.education;

                    jobList(job_title, job_link, region, company, minMonthlySalary, maxMonthlySalary, skills, ol);

                    if (skills != "Null") {
                        const skillArray = JSON.parse(skills.replace(/'/g, '"'));
                        skillArray.forEach((skill) => {
                            skillCounts.hasOwnProperty(skill) ? skillCounts[skill]++ : (skillCounts[skill] = 1);
                        });
                    };

                    if (minMonthlySalary > 0) {
                        salaryCounts.push(Number(minMonthlySalary));
                        minSalaryAry.push(Number(minMonthlySalary));
                    } 
                    if (maxMonthlySalary > 0) {
                        salaryCounts.push(Number(maxMonthlySalary));
                        maxSalaryAry.push(Number(maxMonthlySalary));
                    };

                    const minAvgSalary = Math.round((minSalaryAry.reduce((sum, salary) => sum + salary, 0)) / minSalaryAry.length) * 13;
                    const maxAvgSalary = Math.round((maxSalaryAry.reduce((sum, salary) => sum + salary, 0)) / maxSalaryAry.length) * 13;
                    yearAvgSalary = Math.round((minAvgSalary + maxAvgSalary) / 2)

                    educationCounts.hasOwnProperty(education) ? educationCounts[education]++ : (educationCounts[education] = 1);
                });

                jobResults.appendChild(ol);
                selectedCategory = selectedCategory.replace("_", " ");
                if (selectedCategory === "ios engineer") {
                    selectedCategory = "iOS Engineer";
                } else {
                    selectedCategory = selectedCategory.replace(/\b\w/g, function (char) {
                        return char.toUpperCase();
                    });
                }
                
                listCategory.innerHTML = `${selectedCategory}`;
                yearSalary.innerHTML = `平均年薪＄${yearAvgSalary.toLocaleString() }`;
                drawSkillsChart(skillCounts);
                drawSalaryChart(salaryCounts);
                drawEducationWordCloud(educationCounts);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    }
});

function jobList(job_title, job_link, region, company, minMonthlySalary, maxMonthlySalary, skills, ol) {
    const a = document.createElement('a');
    const li = document.createElement('li');
    const div = document.createElement('div');

    a.href = job_link;
    a.textContent = job_title;

    div.textContent = `${region}/${company}/${minMonthlySalary}~${maxMonthlySalary}/${skills}`;
    li.appendChild(a);
    li.appendChild(div);
    ol.appendChild(li);
}