function drawJobCounts(jobs) {
    const jobsArray = Object.entries(jobs);
    jobsArray.sort((a, b) => a[1] - b[1]);
    const labels = []
    const values = []
    for (var i = 0; i < jobsArray.length; i++) {
        labels.push(jobsArray[i][0]);
        values.push(jobsArray[i][1]);
    }

    var data = [{
        y: labels,
        x: values,
        type: 'bar',
        orientation: 'h'
    }]

    var layout = {
        title: '各類型職缺數量',
        showlegend: false,
        titlefont: {
            size: 20
        },
        margin: {
            l: 115
        } 
    }

    Plotly.newPlot('jobCounts', data, layout)

}

function drawSkillsChart(skills, category) {
    const skillsArray = Object.entries(skills);  // ['ios', 900], ['python', 800]
    skillsArray.sort((a, b) => b[1] - a[1]);
    const labels = []
    const values = []
    for (var i = 0; i < 7; i++) {
        labels.push(skillsArray[i][0]);
        values.push(skillsArray[i][1]);
    }

    // Skill Pie Chart
    var data = [{
        type: "pie",
        values: values,
        labels: labels,
        textinfo: "label+percent",
        insidetextorientation: "radial"
    }]
    var layout = {
        title: `Top 7 High-Value Skills for ${category}`,
        height: 400,
        width: 600
    }

    Plotly.newPlot('skillsPie', data, layout)

    // Skill Bar Chart
    var trace1 = {
        type: 'bar',
        x: labels,
        y: values,
        marker: {
            color: '#C8A2C8',
            line: {
                width: 2.5
            }
        }
    };
    var data = [trace1];
    var layout = {
        title: `Top 7 High-Value Skills for ${category}`,
        font: { size: 12 }
    };
    var config = { responsive: true }
    Plotly.newPlot('skillsBar', data, layout, config);
}

function drawSalaryChart(min, max, category) {
    var trace1 = {
        x: min,
        y: max,
        mode: 'markers',
        marker: {
            size: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        }
    };

    var data = [trace1];

    var layout = {
        title: `Salary Range for ${category}`,
        showlegend: false,
        height: 600,
        width: 600
    };

    Plotly.newPlot('salaryBubble', data, layout);
}

function drawLocatioinChart(category) {
    
}