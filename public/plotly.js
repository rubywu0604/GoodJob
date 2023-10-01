function drawJobCounts(jobs) {
    const jobCountsPair = {}
    for (const [jobCategory, details] of Object.entries(jobs)) {
        jobCountsPair[jobCategory] = details.counts
    }
    const jobsArray = Object.entries(jobCountsPair);
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
        title: '各類型職缺數量排行',
        showlegend: false,
        titlefont: {
            size: 20
        },
        margin: {
            l: 115
        } 
    }

    Plotly.newPlot('jobCountsBar', data, layout)

}

function drawAvgSalary(avgSalary) {
    var xValue = [];
    var yValue = [];
    var yValue2 = [];
    
    for (const [jobCategory, details] of Object.entries(avgSalary)) {
        xValue.push(jobCategory);
        yValue.push(details.avgMinSalary);
        yValue2.push(details.avgMaxSalary);
    }
    
    var trace1 = {
        x: xValue,
        y: yValue,
        type: 'bar',
        text: yValue.map(String),
        textposition: 'auto',
        hoverinfo: 'none',
        opacity: 0.5,
        marker: {
            color: 'rgb(158,202,225)',
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        },
        name: "平均起薪"
    };

    var trace2 = {
        x: xValue,
        y: yValue2,
        type: 'bar',
        text: yValue2.map(String),
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            color: 'rgba(58,200,225,.5)',
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        },
        name: "平均訖薪"
    };

    var data = [trace1, trace2];

    var layout = {
        title: '平均月收入'
    };

    Plotly.newPlot('avgSalaryBar', data, layout);

}

function drawExperience(experience) {
    const expLabels = [];
    const expValues = [];
    for (const [expLabel, expValue] of Object.entries(experience)) {
        expLabels.push(expLabel);
        expValues.push(expValue)
    }

    var data = [{
        values: expValues,
        labels: expLabels,
        text: '經驗',
        textposition: 'inside',
        domain: { x: [0, 1], y: [0, 1] },
        hoverinfo: 'label+percent',
        hole: .4,
        type: 'pie'
    }];

    var layout = {
        title: '工作經驗佔比',
        annotations: [
            {
                font: {
                    size: 20
                },
                showarrow: false,
                text: '年資',
                x: 0.5,
                y: 0.5
            }
        ],
        height: 400,
        width: 600,
        showlegend: true,
        grid: { rows: 1, columns: 2 }
    };

    Plotly.newPlot('experienceDonut', data, layout);

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
        title: `${category} 技能佔比`,
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
        title: `${category} 技能排行`,
        font: { size: 12 }
    };
    var config = { responsive: true }
    Plotly.newPlot('skillsBar', data, layout, config);
}

function drawSalaryChart(salaryCounts, category) {
    const minSalary = Math.min(...salaryCounts);
    const maxSalary = Math.max(...salaryCounts);
    const salaryValue = Array(9).fill(0);

    salaryCounts.forEach((salary) => {
        if (salary < 30000){
            salaryValue[0] += 1;
        } else if (30000 <= salary && salary < 40000) {
            salaryValue[1] += 1
        } else if (40000 <= salary && salary < 50000) {
            salaryValue[2] += 1
        } else if (50000 <= salary && salary < 60000) {
            salaryValue[3] += 1
        } else if (60000 <= salary && salary < 70000) {
            salaryValue[4] += 1
        } else if (70000 <= salary && salary < 80000) {
            salaryValue[5] += 1
        } else if (80000 <= salary && salary < 90000) {
            salaryValue[6] += 1
        } else if (90000 <= salary && salary < 100000) {
            salaryValue[7] += 1
        } else {
            salaryValue[8] += 1
        }
    })

    console.log(salaryValue)

    var xValue = ['30k以下', '30k~40k', '40k~50k', '50k~60k', '60k~70k', '70k~80k', '80k~90k', '90k~100k', '100k以上'];

    var yValue = salaryValue;

    var trace1 = {
        x: xValue,
        y: yValue,
        type: 'bar',
        text: yValue.map(String),
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            color: 'rgb(158,202,225)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    var data = [trace1];

    var layout = {
        title: `${category} 月薪 （最低：${minSalary}元/ 最高：${maxSalary}元）`,
        barmode: 'stack'
    };

    Plotly.newPlot('salaryBar', data, layout);
}