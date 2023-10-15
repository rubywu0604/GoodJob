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
        labels.push(`${jobsArray[i][0]} `);
        values.push(jobsArray[i][1]);
    }

    var data = [{
        y: labels,
        x: values,
        type: 'bar',
        orientation: 'h'
    }]

    var layout = {
        title: '職缺數量排行',
        showlegend: false,
        titlefont: {
            size: 20
        },
        font: {
            size: 12
        },
        margin: {
            l: 120
        },
        width: 600
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
        textfont: {
            color: 'rgba(0, 0, 0, 1)'
        },
        marker: {
            color: 'rgba(89, 172, 227, 0.5)',
            line: {
                color: '#0a4015',
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
            color: 'rgba(113, 212, 245, 0.5)',
            line: {
                color: '#0078d4',
                width: 1.5
            }
        },
        name: "平均訖薪"
    };

    var data = [trace1, trace2];

    var layout = {
        title: '平均月收入 (低標/高標)',
        titlefont: {
            size: 20
        }, 
        font: {
            size: 15
        },
        height: 450,
        width: 600
    };

    Plotly.newPlot('avgSalaryBar', data, layout);

}

function drawExperience(experience) {
    const expLabels = [];
    const expValues = [];
    const expColors = [
        'rgba(0, 128, 255, 0.8)',
        'rgba(255, 99, 71, 0.8)',
        'rgba(50, 205, 50, 0.8)',
        'rgba(255, 165, 0, 0.8)',
        'rgba(70, 130, 180, 0.8)',
        'rgba(255, 192, 203, 0.8)',
        'rgba(0, 128, 0, 0.8)'
    ];
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
        type: 'pie',
        marker: {
            colors: expColors,
        }
    }];

    var layout = {
        title: '工作經驗佔比',
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
        height: 450,
        width: 400,
        showlegend: true,
        grid: { rows: 1, columns: 2 }
    };

    Plotly.newPlot('experienceDonut', data, layout);

}

function drawSkillsChart(skills) {
    // Skill World Cloud
    const chartContainer = document.getElementById('skillWordCloud');

    if (chartContainer) {
        chartContainer.parentNode.removeChild(chartContainer);
    }

    const skillsArray = Object.entries(skills);  // ['ios', 900], ['python', 800]
    skillsArray.sort((a, b) => b[1] - a[1]);
    const allSkills = []
    skillsArray.forEach((skillCount) => {
        let skillObj = {};
        skillObj['x'] = skillCount[0];
        skillObj['value'] = `${skillCount[1]}`;
        allSkills.push(skillObj);
    })
    const chart = anychart.tagCloud(allSkills);
    const newChartContainer = document.createElement('div');
    newChartContainer.id = 'skillWordCloud';
    newChartContainer.style.width = '550px';
    newChartContainer.style.height = '400px';

    const container = document.getElementById('wordCloud');
    container.appendChild(newChartContainer);

    chart.colorScale(anychart.scales.linearColor().colors(["#45b6fe", "#DE73FF", "#FFC300", "#FF5733"]));
    chart.title('相關技術').title().fontColor("#000000").fontSize(20);
    chart.angles([0, 20, 45, -20, -45]);
    chart.colorRange(true);
    chart.colorRange().length('90%');
    chart.container('skillWordCloud');
    chart.draw();

    // Skill Bar Chart
    const labels = []
    const values = []
    for (var i = 0; i < 7; i++) {
        labels.push(skillsArray[i][0]);
        values.push(skillsArray[i][1]);
    }

    var trace1 = {
        type: 'bar',
        x: labels,
        y: values,
        marker: {
            color: 'rgba(21, 127, 213 , 0.5)'
        }
    }

    var data = [trace1];
    var layout = {
        title: '技術排行',
        titlefont: {
            size: 20
        },
        height: 400,
        width: 550,
        padding: {
            r: '50px'
        },
        font: {
            size: 12
        },
        bargap: 0.2,
        bargroupgap: 0.2
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
        height: 400,
        width: 650
    };

    Plotly.newPlot('salaryBar', data, layout);
}

function drawEducationPie(education) {
    var data = [{
        type: "pie",
        values: Object.values(education),
        labels: Object.keys(education),
        textinfo: "label+percent",
        insidetextorientation: "radial"
    }]
    const expColors = [
        'rgba(0, 128, 255, 0.8)',
        'rgba(255, 99, 71, 0.8)',
        'rgba(50, 205, 50, 0.8)',
        'rgba(255, 165, 0, 0.8)',
        'rgba(70, 130, 180, 0.8)'
    ];
    var layout = {
        title: '學歷佔比',
        titlefont: {
            size: 20
        },
        font: {
            size: 15
        },
        height: 400,
        width: 400,
        showlegend: true,
        colorway: expColors
    }

    Plotly.newPlot('educationPie', data, layout)
}