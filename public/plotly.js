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
        title: '軟體工程師 職缺數量排行',
        showlegend: false,
        titlefont: {
            size: 20
        },
        font: {
            size: 15
        },
        margin: {
            l: 150
        },
        width: 650
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
        title: '軟體工程師 平均月收入',
        titlefont: {
            size: 20
        }, 
        font: {
            size: 15
        },
        height: 450,
        width: 700
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
        title: '軟體工程師 工作經驗佔比',
        titlefont: {
            size: 20
        },
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
        height: 500,
        width: 500,
        showlegend: true,
        grid: { rows: 1, columns: 2 }
    };

    Plotly.newPlot('experienceDonut', data, layout);

}

function drawSkillsChart(skills) {
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
        title: '技術佔比',
        titlefont: {
            size: 20
        },
        font: {
            size: 15
        },
        height: 500,
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
        title: '技術排行',
        titlefont: {
            size: 20
        },
        height: 500,
        width: 600
    };
    var config = { responsive: true }
    Plotly.newPlot('skillsBar', data, layout, config);
}

function drawSalaryChart(salaryCounts) {
    const minSalary = Math.min(...salaryCounts);
    const maxSalary = Math.max(...salaryCounts);
    const salaryValue = Array(11).fill(0);

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
        } else if (100000 <= salary && salary < 110000) {
            salaryValue[8] += 1
        } else if (110000 <= salary && salary < 120000) {
            salaryValue[9] += 1
        } else {
            salaryValue[10] += 1
        }
    })

    var xValue = ['30k以下', '30k~40k', '40k~50k', '50k~60k', '60k~70k', '70k~80k', '80k~90k', '90k~100k', '100k~110k', '110k~120k', '120k以上'];

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
        title: `每月薪資收入 <br><br>（最低：$${minSalary.toLocaleString()}元 / 最高：$${maxSalary.toLocaleString()}元）<br>`,
        titlefont: {
            size: 20
        },
        barmode: 'stack',
        font: {
            size: 15
        },
        height: 500,
        width: 600
    };

    Plotly.newPlot('salaryBar', data, layout);
}

function drawEducationWordCloud(education) {
    const chartContainer = document.getElementById('educationWordCloud');

    if (chartContainer) {
        chartContainer.parentNode.removeChild(chartContainer);
    }

    const newChartContainer = document.createElement('div');
    newChartContainer.id = 'educationWordCloud';
    newChartContainer.style.width = '400px';
    newChartContainer.style.height = '400px';

    const container = document.getElementById('worldCloud');
    container.appendChild(newChartContainer);

    const chart = anychart.tagCloud([
        { "x": "不拘", "value": `${education['不拘']}` },
        { "x": "高中", "value": `${education['高中']}` },
        { "x": "大學", "value": `${education['大學']}` },
        { "x": "專科", "value": `${education['專科']}` },
        { "x": "碩士", "value": `${education['碩士']}` }
    ]);

    chart.colorScale(anychart.scales.linearColor().colors(["#45b6fe", '#f94449', "#DE73FF"]));
    chart.title('學歷要求').title().fontColor("#000000").fontSize(20);
    chart.angles([0, 45, -45]);
    chart.colorRange(true);
    chart.colorRange().length('90%');
    chart.container('educationWordCloud');
    chart.draw();
}