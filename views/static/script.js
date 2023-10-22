// ========== Before select category ==========
document.addEventListener('DOMContentLoaded', () => {
    loadNow(1);

    fetch('/api/jobs', { method: 'GET' })
        .then(handleResponse)
        .then(processData)
        .then((result) => {
            const { jobDetails, experienceCounts } = result;
            drawJobCounts(jobDetails);
            drawAvgSalary(jobDetails);
            drawExperience(experienceCounts);
        }).catch((error) => {
            console.error('Error on fetch.', error);
        });
});

function loadNow(opacity) {
    const loader = document.getElementById('loader');
    if (opacity <= 0) {
        loader.style.display = 'none';
        document.getElementById('container').style.display = 'block';
    } else {
        loader.style.opacity = opacity;
        window.setTimeout(function () {
            loadNow(opacity - 0.02);
        }, 50);
    };
};

function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    } else {
        throw new Error(response.statusText);
    };
};

function processData(data) {
    const jobDetails = initJobDetails();
    const experienceCounts = {};

    data.forEach((job) => {
        const category = formatCategory(job.category);
        jobDetails[category].counts++;

        const experience = formatExperience(job.experience);
        experienceCounts[experience] = (experienceCounts[experience] || 0) + 1;

        const minMonthlySalary = job.min_monthly_salary;
        const maxMonthlySalary = job.max_monthly_salary;

        if (minMonthlySalary > 0) {
            jobDetails[category].aryMinSalary.push(Number(minMonthlySalary));
        };

        if (maxMonthlySalary > 0) {
            jobDetails[category].aryMaxSalary.push(Number(maxMonthlySalary));
        };
    });

    calAvgSalaries(jobDetails);
    return { jobDetails, experienceCounts};
};

function initJobDetails() {
    job_titles = [
        "iOS Engineer",
        "Android Engineer",
        "Frontend Engineer",
        "Backend Engineer",
        "Data Engineer",
        "Data Analyst",
        "Data Scientist",
        "DBA"
    ];
    const jobDetails = {};

    for (const title of job_titles) {
        jobDetails[title] = { "counts": 0, "avgMinSalary": 0, "avgMaxSalary": 0, "aryMinSalary": [], "aryMaxSalary": []};
    };
    return jobDetails;
};

function formatCategory(category) {
    category = category.replace("_", " ");
    if (category === "ios engineer") {
        return category = "iOS Engineer"
    } else if (category === "dba") {
        return category = "DBA"
    } else {
        return category = category.replace(/\b\w/g, (char) => char.toUpperCase());
    };
};

function formatExperience(experience) {
    return experience === 0 ? '不拘' : `${experience}年`;
};

function calAvgSalaries(jobDetails) {
    for (const category in jobDetails) {
        const detail = jobDetails[category];
        const minSum = detail.aryMinSalary.reduce((sum, salary) => sum + salary, 0);
        const maxSum = detail.aryMaxSalary.reduce((sum, salary) => sum + salary, 0);
        detail.avgMinSalary = Math.round(minSum / detail.aryMinSalary.length);
        detail.avgMaxSalary = Math.round(maxSum / detail.aryMaxSalary.length);
    };
};

// ========== After select category ==========
window.addEventListener('scroll', function () {
    const formContainer = document.getElementById('form-container');
    const scrollY = window.scrollY;

    const threshold = 1100;

    if (scrollY > threshold) {
        formContainer.style.position = 'fixed';
        formContainer.style.top = '0';
    } else {
        formContainer.style.position = 'sticky';
        formContainer.style.top = '0';
    };
});

document.querySelector('form').addEventListener('submit', function (e) {
    const selectedCategory = document.getElementById('categorySelect').value;
    e.preventDefault();

    if (selectedCategory !== 'none') {
        fetch(`/api/jobs/${selectedCategory}`, { method: 'GET' })
            .then(handleResponse)
            .then((data) => {
                drawCharts(data, selectedCategory);
                createJobList(data);
            }).catch((error) => {
                console.error('Error on fetch.', error);
            });
    };
});

function drawCharts(data, selectedCategory){
    const yearSalary = document.getElementById('yearAvgSalary');
    const listCategory = document.getElementById('listCategory');

    const monthlyAvgSalary = [];
    const skillCounts = {};
    const educationCounts = {};

    data.forEach((job) => {
        calAvgSalaryByCategory(job.min_monthly_salary, job.max_monthly_salary, monthlyAvgSalary);
        countSkillsByCategory(job.skills, skillCounts);
        countEducationByCategory(job.education, educationCounts);
    });

    const categoryName = formatCategory(selectedCategory);
    listCategory.innerHTML = `${categoryName}`;

    const annualAvgSalary = calAnnualAvgSalary(monthlyAvgSalary);
    yearSalary.innerHTML = `平均年薪＄${annualAvgSalary.toLocaleString()}`;

    drawSalaryChart(monthlyAvgSalary);
    drawWorldCloud(skillCounts);
    drawSkillsBar(skillCounts);
    drawEducationPie(educationCounts);
}

function calAvgSalaryByCategory(min, max, monthlyAvgSalary) {
    if (min > 0 && max > 0) {
        const avg = (Number(min) + Number(max)) / 2;
        monthlyAvgSalary.push(avg);
    };
};

function calAnnualAvgSalary(monthlyAvgSalary) {
    const paymentsPerYear = 13;
    const annualAvgSum = monthlyAvgSalary.reduce((sum, salary) => sum + salary * paymentsPerYear, 0);
    const annualAvg = Math.round(annualAvgSum / monthlyAvgSalary.length);
    return annualAvg;
}

function countSkillsByCategory(skills, skillCounts) {
    if (skills != 'Null') {
        const skillArray = JSON.parse(skills.replace(/'/g, '"'));
        skillArray.forEach((skill) => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
    };
}

function countEducationByCategory(education, educationCounts) {
    educationCounts[education] = (educationCounts[education] || 0 + 1);
}

function createJobList(data) {
    const table = document.createElement('table');
    const thead = createTableHeader();
    const tbody = createTableBody(data);
    const jobResults = document.getElementById('jobResults');

    table.appendChild(thead);
    table.appendChild(tbody);
    
    jobResults.innerHTML = '';
    jobResults.style.height = '450px';
    jobResults.style.width = 'auto';
    jobResults.style.boxShadow = '0px 3px 5px 0px rgba(0, 0, 0, 0.2)';
    jobResults.appendChild(table);
}

function createTableHeader() {
    const headerRow = document.createElement('tr');
    headerRow.classList.add('sticky-header');

    const headers = ['No.', 'Job Title', 'Location', 'Company', 'Monthly Salary'];
    headers.forEach((headerText) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    const thead = document.createElement('thead');
    thead.appendChild(headerRow);

    return thead;
}

function createTableBody(data) {
    const tbody = document.createElement('tbody');

    data.forEach((job, index) => {
        const tr = createTableRow(job, index);
        tbody.appendChild(tr);
    });

    return tbody;
}

function createTableRow(job, index) {
    const truncatedJobTitle = (job.job_title.length > 50) ? job.job_title.slice(0, 50) + '...' : job.job_title;
    const job_link = job.job_link;
    const region = job.location;
    const companyMatch = job.company.match(/[\u4e00-\u9fa5]+公司/);
    const companyName = (companyMatch ? companyMatch : job.company.slice(0, 20));
    const salary = formatSalary(job.min_monthly_salary, job.max_monthly_salary);

    const tr = document.createElement('tr');
    tr.appendChild(createTableCell(index + 1));
    tr.appendChild(createTableCell(truncatedJobTitle, true, job_link));
    tr.appendChild(createTableCell(region));
    tr.appendChild(createTableCell(companyName));
    tr.appendChild(createTableCell(salary));

    if (index % 2 === 0) {
        tr.classList.add('odd-row');
    }

    return tr;
}

function formatSalary(min, max) {
    if (min === 'Null') {
        return '面議($40,000以上)';
    } else if (max === 'Above') {
        return `面議($${parseInt(min).toLocaleString()}以上)`;
    } else {
        return `$${parseInt(min).toLocaleString()} ～ $${parseInt(max).toLocaleString()}`;
    }
};

const createTableCell = (text, isLink = false, href = '') => {
    const cell = isLink ? document.createElement('a') : document.createElement('td');
    if (isLink) {
        cell.href = href;
        cell.target = '_blank';
    }
    cell.textContent = text;
    cell.style.textAlign = 'center';
    return cell;
};