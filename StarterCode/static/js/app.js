// Use D3 fetch to read the JSON file

d3.json("../data/samples.json").then(data => {
    
    // Assign data to the variables
    var metadata_data = data.metadata;
    var names_data = data.names;
    var samples_data = data.samples;
    console.log(samples_data);

    // ___________________________________________________________________________ //
    // Creating Horizontal Bar Plot

    function barChart(id) {
        // Slice the first 10 objects for plotting
        var xBar = samples_data[id].sample_values.slice(0,10).reverse();
        var yData = samples_data[id].otu_ids;
        var yBar = yData.map(data => `OTU ${data}`);
    
        // Trace
        var trace = {
            x : xBar,
            y : yBar,
            type : 'bar',
            orientation: 'h'
        };
        
        // Data
        var data = [trace];

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", data);

    }

    // ___________________________________________________________________________ //
    // Creating Demographic Table

    function tabulate(id) {
        var demographicInfo = d3.selectAll('#sample-metadata');
        // Clear the content of table
        demographicInfo.html('');

        // Populating Demographic Info Table
        demographicInfo.append('tr').append("td").text(`id: ${metadata_data[id].id}`);
        demographicInfo.append('tr').append("td").text(`ethnicity: ${metadata_data[id].ethnicity}`);
        demographicInfo.append('tr').append("td").text(`gender: ${metadata_data[id].gender}`);
        demographicInfo.append('tr').append("td").text(`age: ${metadata_data[id].age}`);
        demographicInfo.append('tr').append("td").text(`location: ${metadata_data[id].location}`);
        demographicInfo.append('tr').append("td").text(`bbtype: ${metadata_data[id].bbtype}`);
        demographicInfo.append('tr').append("td").text(`wfreq: ${metadata_data[id].wfreq}`);
    }

    // ___________________________________________________________________________ //
    // Creating Bubble Chart

    function bubbleChart(id) {
        var xBubble = samples_data[id].otu_ids;
        var yBubble = samples_data[id].sample_values;
        var markerSize = samples_data[id].sample_values;
        var markerColour = samples_data[id].otu_ids;
        var markerText = samples_data[id].otu_labels;
    
        var trace = {
            x : xBubble,
            y : yBubble,
            text : markerText,
            mode: 'markers',
            marker: {
                color: markerColour,
                size: markerSize,
                colorscale: 'Earth'
    
            } 
        };
    
        var data = [trace];

        var layout = {
            xaxis: {
              title: {
                text: 'OTU ID',
                font: {
                  size: 18,
                }
              }
            }
        };

        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot('bubble', data, layout);
    }
    
    // ___________________________________________________________________________ //
    // Creating Basic Gauge Chart

    function gaugeChart(id) {
        var gaugeValue = metadata_data[id].wfreq;
        var trace = {
                domain: { x: [0, 1], y: [0, 1] },
                value: gaugeValue,
                title: { text: 'Belly Button Washing Frequency'+'<br>'+'<span style="font-size: 15px;">Scrubs per Week</span>' },
                type: 'indicator',
                mode: 'gauge+number'
        };
        var data = [trace];

        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot('gauge', data);
        console.log(gaugeValue);

    }


    // Initializes the page with a default plot
    function init() {
        var dropdownMenu = d3.selectAll('#selDataset');

        // Populate dropdown Menu with the test subject IDs
        names_data.forEach(name => {
            var dataset = dropdownMenu.append('option');
            dataset.property('value',name);
            dataset.text(name);
        });

        barChart(0);
        tabulate(0);
        bubbleChart(0);
        gaugeChart(0);
    }
    

    // On change to the DOM, call optionChanged()
    d3.selectAll("#selDataset").on("change", optionChanged);

    // Function called by DOM changes

    function optionChanged() {
        var dropdownMenu = d3.selectAll('#selDataset');
        var selectedName = dropdownMenu.property('value');

        names_data.forEach((name,id) => {
            if (name === selectedName) {
                var selectedID = id;
                barChart(parseInt(selectedID));
                tabulate(parseInt(selectedID));
                bubbleChart(parseInt(selectedID));
                gaugeChart(parseInt(selectedID));
            }
        });
    }

    init();

});





