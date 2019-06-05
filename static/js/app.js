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
      panelMetadata.append("h6").text(`${key}: ${value}`);
    })
  });
};
                            
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var charts = "/samples/" + sample;
  
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(charts).then(function (data) {
    var trace = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker: {
        size: data.sample_values,
      },
      text: data.otu_labels,
    };
      
    var data = [trace];
  
    var layout = {
      showlegend: false,
      height: 500,
      width: 1000
    };

    Plotly.newPlot('bubble', data, layout);

  //  @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
    var data = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hoverinfo:'label+percent+name',
      type: 'pie',
    }];
  
    var layout = {
      height: 500,
      width: 500
    };
  
    Plotly.newPlot('pie', data, layout);

  })
};

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
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
