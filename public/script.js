document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("categorySelect");
    const searchBtn = document.getElementById("searchBtn");
    const jobResults = document.getElementById("jobResults");

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        const selectedCategory = categorySelect.value;

        if (selectedCategory !== "none") {
            // AJAX request
            fetch(`/api/jobs/${selectedCategory}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    // Process the data and display it on the page
                    let html = "<ul>";
                    data.forEach((job) => {
                        html += `<li>${job.job_title}/${job.location}/${job.company}/${job.min_monthly_salary}~${job.max_monthly_salary}/${job.skills}</li>`;
                    });
                    html += "</ul>";
                    jobResults.innerHTML = html;
                })
                .catch((error) => {
                    console.error("There was a problem with the fetch operation:", error);
                });
        }
    });
});
