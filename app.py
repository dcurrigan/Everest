import pandas as pd
import numpy as np
import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, request
from flask import render_template, redirect
from config import password, country_label_map, route_label_map, status_label_map

from tensorflow.keras.models import load_model
import joblib



#################################################
# Database Setup
#################################################
# create database connection
engine = create_engine(f'postgresql://postgres:{password}@localhost:5432/Everest_db', echo=False)
conn = engine.connect()

# reflect database
Base = automap_base()
Base.prepare(engine, reflect=True)

# Save reference to the table
Everest = Base.classes.everest
Averages = Base.classes.averages


#################################################
# Flask Setup
#################################################
app = Flask(__name__)





#################################################
# Flask Routes
#################################################

@app.route("/")
@app.route("/home")
def home():

    # Return template and data
    return render_template("index22.html")









@app.route("/about")
def about():

    # Return template and data
    return render_template("about.html")





@app.route("/api/v1.0/dropdown")
def dropdown():
    # THIS RETURN THE COUNTRY LIST TO THE DROPDOWN MENU #
    # Connect to databse
    session = Session(engine)

    # Retrieve the country data
    data = pd.read_sql("""
                       SELECT citizen
                       FROM everest
                       """, conn)

    session.close()
    
    # Perform some data cleaning 
    clean_list = [ item for item in data.citizen if "/" not in item ]
    clean_list = np.array(clean_list)
    clean_list = np.unique(clean_list)
    clean_list = clean_list.tolist()
    remove_list = ['USSR', 'Czechoslovakia', 'Kyrgyz Republic', 'W Germany']

    for ele in remove_list:
        clean_list.remove(ele)
    clean_data = pd.DataFrame(clean_list)
    
    # Return the data
    return clean_data.to_json(orient = "records")


@app.route("/api/v1.0/model", methods=['GET','POST'])
def model():
    # THIS RETURNS THE PREDICTED OUTCOMES BASED ON THE USERS DATA

    # Load the models and scaler
    success_model = load_model("models and scalers/success_model.h5")
    death_model = load_model("models and scalers/death_model.h5")
    crowding_model_success = load_model("models and scalers/crowding_model_success.h5")
    crowding_model_death = load_model("models and scalers/crowding_model_death.h5")

    scaler = joblib.load("models and scalers/data_scaler.pkl")

    # if request.method == "POST":
    
    # Retrieve the form contents
    gender = int(request.form['gender'])
    age = int(request.form['age'])
    solo = request.form['solo']
    country = request.form['country']
    route = request.form['route']
    job = request.form['job']
    ascent = request.form.getlist('ascent')
    descent = request.form.getlist('descent')
    sleep = request.form.getlist('sleep')
    crowding_state = request.form.getlist('crowding-state')

    # Set the query string for the bar graph data request
    if age <20:  
        query1 = "under 20"
    elif (age >= 20) and (age < 30):
        query1 = "20 - 30"
    elif (age >= 30) and (age < 40):
        query1 = "30 - 40"
    elif (age >= 40) and (age < 50):
        query1 = "40 - 50"
    elif (age >= 50) and (age < 60):
        query1 = "50 - 60"
    elif age > 60:
        query1 = "over 60"
    
    # convert strings to booleans
    def str_to_binary(string):
        # checkbox returns a list
        if isinstance(string, list):
            if len(string) > 0:
                string = string[0]
            else:
                string = "False"
        # the rest are strings
        if string == "True":
            return 1
        elif string == "False":
            return  0
    
    solo = str_to_binary(solo)
    ascent = str_to_binary(ascent)
    descent = str_to_binary(descent)
    sleep = str_to_binary(sleep)
    
    if (ascent == True) or (descent == True) or (sleep == True): 
        any_o2 = 1
    else: 
        any_o2 = 0
    
    if route == "Other":
        std_route = 0
    else:
        std_route = 1

    # Map the country and routes to their corresponding codes
    country = country_label_map[country]
    route = route_label_map[route]
    job = status_label_map[job]

    # Assemble into a list 
    feature_list = [gender, age, country, solo, route, any_o2, ascent, descent, sleep, std_route, job]
    
    # Scale the list with the scaler 
    scaled_list = scaler.transform([feature_list])


    # Run the model on the input data
    np.array(scaled_list)
    result1 = success_model.predict(scaled_list)
    result2 = death_model.predict(scaled_list)
    # result3 = crowding_model_success()

    predicted_success = round(result1[0][0]*100,2)
    predicted_death = result2[0][0]*100

    if gender == 0:
        query2 = "males"
    else:
        query2 = "females"

    # Retrieve the comaprison data
    session = Session(engine)
    data = pd.read_sql("SELECT * FROM averages", conn).reset_index()
    session.close()
    
    age_data = data[data['group'] == query1 ]
    gender_data = data[data['group'] == query2 ]
    overall_data = data[data['group'] == 'overall' ]

    # Fill the bar chart data based on whether crowding model is activated or not
    if len(crowding_state) > 0: 
        bar_data = [{'your_success':predicted_success,
                    'your_death': predicted_death,
                    'gender_success': gender_data.iloc[0,3],
                    'gender_death': gender_data.iloc[0,4],
                    'age_success': age_data.iloc[0,3],
                    'age_death': gender_data.iloc[0,4],
                    'overall_success': overall_data.iloc[0,3],
                    'overall_death': gender_data.iloc[0,4]
                    }]
    else: 
        bar_data = [{ 'your_success':predicted_success,
                    'your_death': predicted_death,
                    'gender_success': gender_data.iloc[0,3],
                    'gender_death': gender_data.iloc[0,4],
                    'age_success': age_data.iloc[0,3],
                    'age_death': gender_data.iloc[0,4],
                    'overall_success': overall_data.iloc[0,3],
                    'overall_death': gender_data.iloc[0,4]
                    }]
    
    return jsonify(bar_data)
        
    # pass

# @app.route("/api/v1.0/bar/<string:gender>&<string:age>&<string:solo>&<string:country>&<string:route>&<bool:any_o2>&<bool:ascent>&<bool:descent>&<bool:sleep>&<bool:std_route>&<string:job>", )


# @app.route("/api/v1.0/bar/<gender>&<age>&<solo>&<country>&<route>&<any_o2>&<ascent>&<descent>&<sleep>&<std_route>&<job>")
# def bar(gender, age, solo, country, route, any_o2, ascent, descent, sleep, std_route, job ):

@app.route('/api/v1.0/bar/', methods=['GET', 'POST'])
def bar():
      
    data = request.get_json()

    # Load the models and scaler
    success_model = load_model("models and scalers/success_model.h5")
    death_model = load_model("models and scalers/death_model.h5")
    crowding_model_success = load_model("models and scalers/crowding_model_success.h5")
    crowding_model_death = load_model("models and scalers/crowding_model_death.h5")

    scaler = joblib.load("models and scalers/data_scaler.pkl")

     # # crowding_state = data[0]('crowding-state')
    data = list(data[0].values())
    data[0] = int(data[0])
    data[1] = int(data[1])
    if data[3] == 'True':
        data[3] = True
    else:
        data[3] = False
    
    # Set the query string for the bar graph data request
    if data[1] <20:  
        query1 = "under 20"
    elif (data[1] >= 20) and (data[1] < 30):
        query1 = "20 - 30"
    elif (data[1] >= 30) and (data[1] < 40):
        query1 = "30 - 40"
    elif (data[1] >= 40) and (data[1] < 50):
        query1 = "40 - 50"
    elif (data[1] >= 50) and (data[1] < 60):
        query1 = "50 - 60"
    elif data[1] > 60:
        query1 = "over 60"
    
    # convert booleans to binary
    def bool_to_binary(val):
        if val == True:
            return 1
        elif val == False:
            return  0
    
    data[3] = bool_to_binary(data[3])
    data[5] = bool_to_binary(data[5])
    data[6] = bool_to_binary(data[6])
    data[7] = bool_to_binary(data[7])
    data[8] = bool_to_binary(data[8])
    data[9] = bool_to_binary(data[9])

    data[2] = country_label_map[data[2]]
    data[4] = route_label_map[data[4]]
    data[10] = status_label_map[data[10]]

    scaled_list = scaler.transform([data])

    # Run the model on the input data
    np.array(scaled_list)
    result1 = success_model.predict(scaled_list)
    result2 = death_model.predict(scaled_list)
    # result3 = crowding_model_success()

    predicted_success = round(result1[0][0]*100,2)
    predicted_death = result2[0][0]*100

    if data[0] == 0:
        query2 = "males"
    else:
        query2 = "females"

    # Retrieve the comaprison data
    session = Session(engine)
    compariason_data = pd.read_sql("SELECT * FROM averages", conn).reset_index()
    session.close()
    
    age_data = compariason_data[compariason_data['group'] == query1 ]
    gender_data = compariason_data[compariason_data['group'] == query2 ]
    overall_data = compariason_data[compariason_data['group'] == 'overall' ]

    crowding_state = 1
    
    # Fill the bar chart data based on whether crowding model is activated or not
    if crowding_state > 0: 
        bar_data = [{'your_success':predicted_success,
                    'your_death': predicted_death,
                    'gender_success': gender_data.iloc[0,3],
                    'gender_death': gender_data.iloc[0,4],
                    'age_success': age_data.iloc[0,3],
                    'age_death': gender_data.iloc[0,4],
                    'overall_success': overall_data.iloc[0,3],
                    'overall_death': gender_data.iloc[0,4]
                    }]
    else: 
        bar_data = [{ 'your_success':predicted_success,
                    'your_death': predicted_death,
                    'gender_success': gender_data.iloc[0,3],
                    'gender_death': gender_data.iloc[0,4],
                    'age_success': age_data.iloc[0,3],
                    'age_death': gender_data.iloc[0,4],
                    'overall_success': overall_data.iloc[0,3],
                    'overall_death': gender_data.iloc[0,4]
                    }]
    
    return jsonify(bar_data)







    success_model = load_model("models and scalers/success_model.h5")
    death_model = load_model("models and scalers/death_model.h5")
    crowding_model_success = load_model("models and scalers/crowding_model_success.h5")
    crowding_model_death = load_model("models and scalers/crowding_model_death.h5")

    scaler = joblib.load("models and scalers/data_scaler.pkl")
    # if (gender == "0" and age == "37"):
    



    # # Retrieve the form contents
    #     gender = int(request.form.get['gender'])
        







if __name__ == '__main__':
    app.run(port=5500, debug=True)