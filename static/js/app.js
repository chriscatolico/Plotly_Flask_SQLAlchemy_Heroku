function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var metadata = "/metadata/" + sample;
  
  // Use d3 to select the panel with id of `#sample-metadata`
  var panel = d3.select("#sample-metadata");
  
  // Use `.html("")` to clear any existing metadata
  panel.html("");
  
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  d3.json(metadata).then(function (data) {
    Object.entries(data).forEach(function ([key, value]) {
      panel.append("h6").text(`${key}: ${value}`);
    })
  
    
    //Bonus Gauge Chart
    var level = data.WFREQ;

    // Trig to calc meter point
    var degrees = 180 - (level*17),
         radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data3 = [{ type: 'scatter',
       x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'wash',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
      rotation: 90,
      text: ['10-11','8-9','6-7','4-5', '2-3', '0-1'],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                             'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                             'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                             'rgba(255, 255, 255, 0)']},
      labels: ['10-11','8-9','6-7','4-5', '2-3', '0-1'],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout2 = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Belly Button Washing Frequency',
      height: 450,
      width: 450,
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data3, layout2);

  })
}
                            
function buildCharts(sample) {

    
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var charts = "/samples/" + sample;
  
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(charts).then(function (data) {
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: 'Blackbody'
      },
      text: data.otu_labels,
    };
      
    var data1 = [trace1];
  
    var layout = {
      showlegend: false,
      height: 650,
      width: 1000
    };

    Plotly.newPlot('bubble', data1, layout);     
  
  //  @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
    var data2 = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];
  
    var layout1 = {
      height: 450,
      width: 450
    };
  
    Plotly.newPlot('pie', data2, layout1);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    })

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  })
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

