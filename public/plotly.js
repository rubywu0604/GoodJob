TESTER = document.getElementById('tester');

Plotly.plot(TESTER, [{
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 4, 8, 16]
}], {
    margin: { t: 0 }
}, { showSendToCloud: true });


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

Plotly.newPlot('myDiv', data, layout)