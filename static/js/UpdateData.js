
var success_data = []
var death_data = []
var age_data = []
crowding_value = 100

 // Create event listeners for the form elements
 d3.select("#gender").on("change", updateData)
 d3.select("#age").on("change", updateData)
 d3.select("#country").on("change", updateData)
 d3.select("#route").on("change", updateData)
 d3.select("#ascent").on("change", updateData)
 d3.select("#descent").on("change", updateData)
 d3.select("#sleep").on("change", updateData)
 d3.select("#climber").on("change", updateData)
 d3.select("#cook").on("change", updateData)
 d3.select("#doctor").on("change", updateData)
 d3.select("#deputy").on("change", updateData)
 d3.select("#leader").on("change", updateData)
 d3.select("#other").on("change", updateData)
 d3.select("#crowding-state").on("change", updateData)
 d3.select(".slider").on("change", updateData)

// Function to update the date on change
 function updateData() {
   
    // Collect the data from the form 
    gender = d3.select("#gender").property("value")
    age = d3.select("#age").property("value")
    country = d3.select("#country").property("value")
    route = d3.select("#route").property("value")
    ascent = d3.select("#ascent").property("checked")
    descent = d3.select("#descent").property("checked")
    sleep = d3.select("#sleep").property("checked")
    jobs = ['#climber', '#cook', '#doctor', '#deputy', '#leader', '#other']
    jobs.forEach(item => {
        if ((d3.select(item).property("checked")) == true ) {
            job = (d3.select(item).property("value"))
        };
    });
    crowding_state = d3.select("#crowding-state").property("checked")

    if (route == "other") {
        std_route = false
    }
    else {
        std_route = true
    };

    if (ascent == true || descent == true || sleep == true) {
        o2_any = true
    }
    else {
        o2_any = false
    }

    features = [{gender, age, country, route, o2_any, ascent, descent, sleep, std_route, job, crowding_value,crowding_state, }]

    // fetch data for the bar chart 
    fetch(`api/v1.0/bar/`, {
        method: "POST",
        body: JSON.stringify(features),
        cache: "no-cache",
        headers: new Headers({"content-type": "application/json"})
    })
    .then(response => { 
        response.json()
        .then(function(data) {
            success_data = [{'label':'Your Succuss %','score':data[0]['your_success']},
            {'label':'Avg for Gender', 'score': data[0]['gender_success']},
            {'label':'Avg for age','score':data[0]['age_success']},
            {'label':'Overall Average', 'score':data[0]['overall_success']}]

            death_data =   [{'label':'Your Risk %','score':data[0]['your_death']},
            {'label':'Avg for Gender', 'score': data[0]['gender_death']},
            {'label':'Avg for age','score':data[0]['age_death']},
            {'label':'Overall Average', 'score':data[0]['overall_death']}]
            

        }).then(function(data) {
            BarChart(success_data, "#success-bar-vis")
            BarChart(death_data, "#death-bar-vis")
        }).then(function(data) {
            crowdingLine(success_data, death_data)
        })

    })
    
    fetch(`api/v1.0/age/`, {
        method: "POST",
        body: JSON.stringify(features),
        cache: "no-cache",
        headers: new Headers({"content-type": "application/json"})
    })
    .then(response => { 
        response.json()
        .then(function(data) {
            ageLineChart(data)
        }).then(function(data)  {
            
        })
    })




 };
        
        
        






