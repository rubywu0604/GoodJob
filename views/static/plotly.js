function drawJobCounts(jobs) {
    const jobCountsArray = Object.entries(jobs)
        .map(([jobCategory, details]) => ({ label: `${jobCategory}`, value: details.counts }))
        .sort((category, count) => category['value'] - count['value']);
    const labels = jobCountsArray.map(entry => entry.label);
    const values = jobCountsArray.map(entry => entry.value);

    var data = [{
        y: labels,
        x: values,
        type: 'bar',
        orientation: 'h'
    }];

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
    };

    Plotly.newPlot('jobCountsBar', data, layout);

};

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
        name: '平均起薪'
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
        name: '平均訖薪'
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
        width: 1500
    };

    Plotly.newPlot('avgSalaryBar', data, layout);

};

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
        expValues.push(expValue);
    };

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

};

function drawWorldCloud(skills) {
    const chartContainer = document.getElementById('skillWordCloud');

    if (chartContainer) {
        chartContainer.remove();
    };

    const skillsArray = Object.entries(skills);  // ['ios', 900], ['python', 800]
    skillsArray.sort((skill, value) => value[1] - skill[1]);

    const tagCloudData = skillsArray.map(([skill, value]) => ({ x: skill, value: `${value}` }));
    const container = document.getElementById('wordCloud');
    const newChartContainer = document.createElement('div');
    newChartContainer.id = 'skillWordCloud';
    newChartContainer.style.width = '550px';
    newChartContainer.style.height = '400px';
    container.appendChild(newChartContainer);

    const chart = anychart.tagCloud(tagCloudData);
    chart.colorScale(anychart.scales.linearColor().colors(['#45b6fe', '#DE73FF', '#FFC300', '#FF5733']));
    chart.title('相關技術').title().fontColor('#000000').fontSize(20);
    chart.angles([0, 20, 45, -20, -45]);
    chart.colorRange(true);
    chart.colorRange().length('90%');
    chart.container('skillWordCloud');
    chart.draw();
};

function drawSkillsBar(skills) {
    const skillsArray = Object.entries(skills)
        .sort((skill, value) => value[1] - skill[1])
        .slice(0, 7);
    const barChartLabels = skillsArray.map(([skill]) => skill);
    const barChartValues = skillsArray.map(([_, value]) => value);

    var trace1 = {
        type: 'bar',
        x: barChartLabels,
        y: barChartValues,
        marker: {
            color: 'rgba(21, 127, 213 , 0.5)'
        }
    };

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
    var config = { responsive: true };
    Plotly.newPlot('skillsBar', data, layout, config);
};

function drawSalaryChart(salaryCounts) {
    const salaryRange = ['30k以下', '30k~40k', '40k~50k', '50k~60k', '60k~70k', '70k~80k', '80k~90k', '90k~100k', '100k~110k', '110k~120k', '120k以上'];
    const minSalary = Math.round(Math.min(...salaryCounts));
    const maxSalary = Math.round(Math.max(...salaryCounts));
    const salaryValue = Array(salaryRange.length).fill(0);

    salaryCounts.forEach((salary) => {
        for (let i = 0; i < salaryRange.length - 1; i++) {
            const lowerBound = i * 10000 + 30000;
            const upperBound = lowerBound + 10000;
            if (lowerBound <= salary && salary < upperBound) {
                salaryValue[i + 1] += 1;
                break;
            }else if (salary < 30000) {
                salaryValue[0] += 1;
                break;
            } else if (salary >= 120000) {
                salaryValue[salaryRange.length - 1] += 1;
                break;
            }
        };
    });

    var xValue = salaryRange;

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
};

function drawEducationPie(education) {
    var data = [{
        type: 'pie',
        values: Object.values(education),
        labels: Object.keys(education),
        textinfo: 'label+percent',
        insidetextorientation: 'radial'
    }];
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
    };

    Plotly.newPlot('educationPie', data, layout);
};