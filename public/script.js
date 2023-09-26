document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("categorySelect");
    const jobResults = document.getElementById("jobResults");

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        const selectedCategory = categorySelect.value;
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

                    data.forEach((job) => {
                        const job_title = job.job_title;
                        const region = job.location;
                        const company = job.company;
                        const min_monthly_salary = job.min_monthly_salary;
                        const max_monthly_salary = job.max_monthly_salary;
                        const skills = job.skills;
                        const job_link = job.job_link;

                        const a = document.createElement('a');
                        const li = document.createElement('li');
                        const div = document.createElement('div');

                        a.href = job_link;
                        a.textContent = job_title;

                        div.textContent = `${region}/${company}/${min_monthly_salary}~${max_monthly_salary}/${skills}`;
                        li.appendChild(a);
                        li.appendChild(div);
                        ol.appendChild(li);
                        
                        Array(skills).forEach((skillStr) => {
                            let skillArray = JSON.parse(skillStr.replace(/'/g, '"'));
                            skillArray.forEach((skill) => {
                                skillCounts.hasOwnProperty(skill) ? skillCounts[skill]++ : skillCounts[skill] = 1;
                            })
                        });
                    });
                    console.log(skillCounts)

                    jobResults.appendChild(ol);
                    drawSkillsChart()
                })
                .catch((error) => {
                    console.error("There was a problem with the fetch operation:", error);
                });
        }
    });
});

function drawSkillsChart(skills) {

    var data = [{
        type: "pie",
        values: [2, 3, 4, 4],
        labels: ["Python", "JavaScript", "C#", "Ruby"],
        textinfo: "label+percent",
        insidetextorientation: "radial"
    }]

    var layout = [{
        height: 700,
        width: 700
    }]

    Plotly.newPlot('skills', data, layout)
}