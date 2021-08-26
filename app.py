import pandas as pd
import numpy as np
import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, request
from flask import render_template, redirect
from config import username, password, endpoint, country_label_map, route_label_map, status_label_map

from tensorflow.keras.models import load_model
import joblib



#################################################
# Database Setup
#################################################
# create database connection
db_url = db_url = f'postgresql://{username}:{password}@{endpoint}/everest_db'
engine = create_engine(db_url)
conn = engine.connect()

# reflect database
Base = automap_base()
Base.prepare(engine, reflect=True)

# Save reference to the table
Everest = Base.classes.everest
Averages = Base.classes.averages
Crowding = Base.classes.crowding


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
    return render_template("index.html")









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




@app.route('/api/v1.0/bar/', methods=['GET', 'POST'])
def bar():
      
    data = request.get_json()

    # Load the models and scaler
    normal_model_success = load_model("models and scalers/success_model.h5")
    normal_model_death = load_model("models and scalers/death_model.h5")
    crowding_model_success = load_model("models and scalers/crowding_model_success.h5")
    crowding_model_death = load_model("models and scalers/crowding_model_death.h5")

    normal_scaler = joblib.load("models and scalers/data_scaler.pkl")
    crowding_scaler = joblib.load("models and scalers/crowding_scaler.pkl")
   
    # convert json data to list
    data = list(data[0].values())

    # Retrieve whether crowding state is activate and get its value
    crowding_state = data[11]
    crowding_value = data[10]
    
    # Set the models then remove the crowding state from list
    if crowding_state == True:
        data = data[0:11]
        success_model = crowding_model_success
        death_model = crowding_model_death
        scaler = crowding_scaler
    else:
        data = data[0:10]
        success_model = normal_model_success
        death_model = normal_model_death
        scaler = normal_scaler
    
    # convert gender (0=male, 1=female) and age to int
    data[0] = int(data[0])
    data[1] = int(data[1])


    # Set the query strings for the bar graph data request
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
   
    if data[0] == 0:
        query2 = "males"
    else:
        query2 = "females"
    
    # convert booleans to binary
    def bool_to_binary(val):
        if val == True:
            return 1
        elif val == False:
            return  0
    
    data[4] = bool_to_binary(data[4])
    data[5] = bool_to_binary(data[5])
    data[6] = bool_to_binary(data[6])
    data[7] = bool_to_binary(data[7])
    data[8] = bool_to_binary(data[8])

    # map the route, country and job selections to their corresponging numbers 
    data[2] = country_label_map[data[2]]
    data[3] = route_label_map[data[3]]
    data[9] = status_label_map[data[9]]

    # scale the data
    scaled_list = scaler.transform([data])

    # Run the model on the input data
    np.array(scaled_list)
    success_result = success_model.predict(scaled_list)
    death_result = death_model.predict(scaled_list)

    predicted_success = success_result[0][0]*100
    predicted_death = death_result[0][0]*100
 
    # Retrieve the comaprison data
    session = Session(engine)
    compariason_data = pd.read_sql("SELECT * FROM averages", conn).reset_index()
    session.close()
    
    age_data = compariason_data[compariason_data['group'] == query1 ]
    gender_data = compariason_data[compariason_data['group'] == query2 ]
    overall_data = compariason_data[compariason_data['group'] == 'overall' ]

      
    # Fill the bar chart data based on whether crowding model is activated or not
    bar_data = [{'your_success':predicted_success,
                    'your_death': predicted_death,
                    'gender_success': gender_data.iloc[0,3],
                    'gender_death': gender_data.iloc[0,4],
                    'age_success': age_data.iloc[0,3],
                    'age_death': gender_data.iloc[0,4],
                    'overall_success': overall_data.iloc[0,3],
                    'overall_death': gender_data.iloc[0,4]
                    }]
    
    return jsonify(bar_data)



@app.route('/api/v1.0/line/')
def line():

    session = Session(engine)
  
    sel = [Crowding.climber_count,Crowding.success_avg, Crowding.death_avg]   
    result = session.query(*sel).all()
    session.close()
    
    result = pd.DataFrame(result)
    
    return result.to_json(orient = "records") 


@app.route('/api/v1.0/age/', methods=['GET', 'POST'])
def age():
      
    data = request.get_json()

    # Load the models and scaler
    normal_model_success = load_model("models and scalers/success_model.h5")
    normal_model_death = load_model("models and scalers/death_model.h5")
    crowding_model_success = load_model("models and scalers/crowding_model_success.h5")
    crowding_model_death = load_model("models and scalers/crowding_model_death.h5")

    normal_scaler = joblib.load("models and scalers/data_scaler.pkl")
    crowding_scaler = joblib.load("models and scalers/crowding_scaler.pkl")
   
    # convert json data to list
    data = list(data[0].values())

    # Retrieve whether crowding state is activate and get its value
    crowding_state = data[11]
    crowding_value = data[10]
    
    # Set the models then remove the crowding state from list
    if crowding_state == True:
        data = data[0:11]
        success_model = crowding_model_success
        death_model = crowding_model_death
        scaler = crowding_scaler
    else:
        data = data[0:10]
        success_model = normal_model_success
        death_model = normal_model_death
        scaler = normal_scaler
    
    # convert gender (0=male, 1=female) and age to int
    data[0] = int(data[0])
    data[1] = int(data[1])
      
    # convert booleans to binary
    def bool_to_binary(val):
        if val == True:
            return 1
        elif val == False:
            return  0
    
    data[4] = bool_to_binary(data[4])
    data[5] = bool_to_binary(data[5])
    data[6] = bool_to_binary(data[6])
    data[7] = bool_to_binary(data[7])
    data[8] = bool_to_binary(data[8])

    # map the route, country and job selections to their corresponging numbers 
    data[2] = country_label_map[data[2]]
    data[3] = route_label_map[data[3]]
    data[9] = status_label_map[data[9]]


    age_df = pd.DataFrame()
    for age in range(15,71):
        data[1] = age
        scaled_list = scaler.transform([data])
        np.array(scaled_list)
        success_result = success_model.predict(scaled_list)
        death_result = death_model.predict(scaled_list)
        
        age_df.loc[age, 'age'] = age
        age_df.loc[age, 'success'] = success_result[0][0]*100
        age_df.loc[age, 'death'] = death_result[0][0]*100


    return age_df.to_json(orient="records")

if __name__ == '__main__':
    app.run(port=5500, debug=True)