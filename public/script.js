document.addEventListener("DOMContentLoaded", function () {
    var loader;
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
            drawExperience(experienceCounts);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
});

document.querySelector("form").addEventListener("submit", function (e) {
    const selectedCategory = document.getElementById("categorySelect").value;
    const jobResults = document.getElementById("jobResults");
    e.preventDefault();

    jobResults.innerHTML = "";

    if (selectedCategory !== "none") {
        fetch(`/api/jobs/${selectedCategory}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                drawCharts(data, selectedCategory);
                createJobList(data);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    }
});

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

function drawCharts(data, selectedCategory){
    let yearSalary = document.getElementById('yearAvgSalary');
    let listCategory = document.getElementById('listCategory');
    let yearAvgSalary;

    const skillCounts = {};
    const educationCounts = {};
    const salaryCounts = [];
    const minSalaryAry = [];
    const maxSalaryAry = [];

    data.forEach((job) => {
        const minMonthlySalary = job.min_monthly_salary;
        const maxMonthlySalary = job.max_monthly_salary;
        const skills = job.skills;
        const education = job.education;

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

    selectedCategory = selectedCategory.replace("_", " ");
    if (selectedCategory === "ios engineer") {
        selectedCategory = "iOS Engineer";
    } else {
        selectedCategory = selectedCategory.replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
    }

    listCategory.innerHTML = `${selectedCategory}`;
    yearSalary.innerHTML = `平均年薪＄${yearAvgSalary.toLocaleString()}`;

    drawSkillsChart(skillCounts);
    drawSalaryChart(salaryCounts);
    drawEducationWordCloud(educationCounts);
}

function createJobList(data) {
    let table = document.createElement('table');

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    let th0 = document.createElement('th');
    th0.textContent = 'No.';
    let th1 = document.createElement('th');
    th1.textContent = 'Job Title';
    let th2 = document.createElement('th');
    th2.textContent = 'Location';
    let th3 = document.createElement('th');
    th3.textContent = 'Company';
    let th4 = document.createElement('th');
    th4.textContent = 'Salary Range';
    headerRow.appendChild(th0);
    headerRow.appendChild(th1);
    headerRow.appendChild(th2);
    headerRow.appendChild(th3);
    headerRow.appendChild(th4);
    headerRow.classList.add('sticky-header');
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement('tbody');
    data.forEach((job, index) => {
        let job_title = (job.job_title.includes("工程師") ? job.job_title.slice(0, job.job_title.indexOf("工程師") + 3) : job.job_title.slice(0, 20));
        job_title = (job_title.length > 40) ? job_title.slice(0, 40) : job_title;
        let job_link = job.job_link;
        let region = job.location;
        let companyRegex = /[\u4e00-\u9fa5]+公司/;
        let companyMatch = job.company.match(companyRegex);
        let company = (companyMatch ? companyMatch : job.company.slice(0, 20));
        let minMonthlySalary = job.min_monthly_salary;
        let maxMonthlySalary = job.max_monthly_salary;

        let tr = document.createElement('tr');

        let td0 = document.createElement('td');
        td0.textContent = index + 1;
        tr.appendChild(td0);

        let td1 = document.createElement('td');
        let a = document.createElement('a');
        a.href = job_link;
        a.textContent = job_title;
        td1.appendChild(a);

        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        td2.textContent = region;
        td3.textContent = company;
        td3.style.textAlign = 'center';
        td4.textContent = (minMonthlySalary === "Null" || maxMonthlySalary === "Above") ? "面議" : `${minMonthlySalary} ～ ${maxMonthlySalary}`

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        tbody.appendChild(tr);

        if (index % 2 === 0) {
            tr.classList.add('odd-row');
        }
    });

    table.appendChild(tbody);

    jobResults.innerHTML = '';
    jobResults.style.height = '450px';
    jobResults.style.width = '1200px';
    jobResults.style.boxShadow = '0px 3px 5px 0px rgba(0, 0, 0, 0.2)';
    jobResults.appendChild(table);
}

window.addEventListener('scroll', function () {
    const formContainer = document.getElementById('form-container');
    const scrollY = window.scrollY;

    const threshold = 100;

    if (scrollY > threshold) {
        formContainer.style.position = 'fixed';
        formContainer.style.top = '0';
    } else {
        formContainer.style.position = 'sticky';
        formContainer.style.top = '0';
    }
});