async function getData(url) {
    const response = await fetch(url);
    const data = await response.text();
    //console.log(data);

    const xConcentrations = [];   // x-axis label = concentrations
    const yAvgZones = [];   // y-axis = raw data for ZOI values
    
    // \n - new line character
    // split('\n') - will separate the table into an array of individual rows
    // slice(start, end) - return a new array starting at index "start" and ending at index "end - 1
    
    const table = data.split('\n').slice(1); // Split by line and remove first row
    //console.log(table);

    table.forEach(row => {
        const columns = row.split(',');
        const concentration = columns[0];     // Assign concentration value
        xConcentrations.push(concentration);                       // Push each concentration into array for concentrations
        const rawZones = [];
        for (let i = 1; i < columns.length; i++) {
            if (columns[i] === '') continue;  // Skip empty values
            rawZones.push(parseFloat(columns[i]));  // Parse ZOI values as floats and push into rawZones array
        }
        const avg = rawZones.reduce((accumulator, currentValue) => accumulator + currentValue, 0)/ rawZones.length; // Calculate average ZOI
        yAvgZones.push(avg); // Push average ZOI into array for average zones
    });

    return {xConcentrations, yAvgZones}; // Use {} to return multiple values as a single object
}

async function createChart(url, id, r, g, b) {
    const ctx = document.getElementById(id).getContext('2d');
    const axes = await getData(url);
    const labels = axes.xConcentrations; // x-axis labels
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Zone of Inhibition Size (mm²)',
                data: axes.yAvgZones,
                backgroundColor: [
                `rgba(${r}, ${g}, ${b}, 0.3)`,
                `rgba(${r}, ${g}, ${b}, 0.4)`,
                `rgba(${r}, ${g}, ${b}, 0.5)`,
                `rgba(${r}, ${g}, ${b}, 0.6)`,
                `rgba(${r}, ${g}, ${b}, 0.7)`,
                `rgba(${r}, ${g}, ${b}, 0.8)`,
                `rgba(${r}, ${g}, ${b}, 0.9)`
                ],
                borderColor: [
                `rgb(${r}, ${g}, ${b})`,
                `rgb(${r}, ${g}, ${b})`,
                `rgb(${r}, ${g}, ${b})`,
                `rgb(${r}, ${g}, ${b})`,
                `rgb(${r}, ${g}, ${b})`,
                `rgb(${r}, ${g}, ${b})`,
                `rgb(${r}, ${g}, ${b})`
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Concentration (%)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Zone of Inhibition Size (mm²)'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    align: 'center',
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: `Average Zone of Inhibition vs. Concentration for ${id}`,
                    font: {
                        size: 32,
                        fontFamily: 'Alan Sans',
                        color: 'blue',
                    }
                }
            }
        },
    });
}

createChart('data/limonene.csv', 'Limonene', 255, 255, 0);
createChart('data/linalool.csv', 'Linalool', 255, 0, 255);
createChart('data/geraniol.csv', 'Geraniol', 0, 255, 0);
