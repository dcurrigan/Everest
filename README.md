# Everest
Final Project - Quantifying the risk of climbing Earth's highest peak

> Created by Dale Currigan  
> August 2021  
  
  
![ML](/static/data/everest.jpg)  

## Table of contents  
* [Project Intro](#Project-Intro)  
* [Project Structure](#Project-Structure)  
* [Setup](#Setup)  
* [Design](#Design) 
* [Sources](#Sources)  
* [Contributors](#Contributors)  
* [Status](#Status)  

# Project Intro
2021 marks the 100-hundred-year anniversary of the first attempt (unsuccessful) to summit Earth’s highest peak – Mount Everest. Another 32 years would pass before Edmund Hillary and Tenzing Norgay conquered the mountain, stepping foot on the summit for the first time.  
  
Since then, more than 10000 expeditions and 78000 mountaineers have attempted the ascent. The success rate has steadily increased over time, but sadly so too has the count of those who have lost their live on the Mountain. To date 306 people have lost their lives attempting the ascent.  
  
Recently there have been reports of overcrowding on the mountain with social media photos of lines of climbers on the summit. This has drawn criticism over safety on the mountain and potential for increased death rates if not controlled  
  
Aims: Using historical data I sought to create a machine learning to model analyse factors contributing to success and failure in reaching Everest's peak. I also sought to analyse what influence crowding of climbers was having on safety and success on the mountain. 
  
  
# Project Structure  
```
Everest   
|  
|__ models and scalers/                                         # Directory for saved machine learning models
|  |__ ipynb_checkpoints/                                       # Directory for notebook savepoints
|  |__ everest_tune/                                            # Directory for neural network hyperparameter tuning
|  |__ (MAIN NOTEBOOK) Deep Learning - Success.ipynb            # Notebooks for the trialled ML models 
|  |__ Deep Learning - Death.ipynb
|  |__ Deep Learning - Success (crowding adapted).ipynb
|  |__ Deep Learning - Death (crowding adapted).ipynb
|  |__ Trial Model - Decision Tree.ipynb
|  |__ Trial Model - Random Forrest.ipynb
|  |__ success_model.h5                                         # The 4 final models
|  |__ death_model.h5
|  |__ crowding_model_success.h5
|  |__ crowding_model_death.h5
|  |__ data_scaler.pkl                                          # The 2 scalers
|  |__ crowding_scaler.pkl
|
|__ static
|  |__ css/
|  |   |__ style.css                                            # Website styles
|  |
|  |__ js/
|  |   |__ charts/                                              # Javascript files for the d3 charts
|  |   |         |__ ageLine.js
|  |   |         |__ barChart.js
|  |   |         |__ crowdingLine.js
|  |   |__ dataLoader.js                                        # A script to inititialise and update data for the site
|  |   |__ slider.js                                            # Custom script for the d3-slider functionality
|  |
|  |__ data
|     |__ mountain.jpg                                          # Image files for the website and readme
|     |__ everest.jpg
|
|__ templates/
|            |__ index.html                                     # Site landing page    
|
|__ README.md                                                   # This file
|__ ETL.ipynb                                                   # Notebook for ETL process
|__ Schema.sql                                                  # A copy of the SQL table schema
|__ app.py                                                      # The Flask app
|__ config.py                                                   # Access deatils for PostgresSQL, mapping of form data
|__ everest.csv                                                 # The base data
|__ clean_data.csv                                              # Output clean data files                             
|__ crowding_data.csv                           
|__ requirements.txt                                            # For Deployment to Heroku                               
|__ Procfile                                 
|__ Proposal - Everest.docx                                     # The project proposal
|                             
|   
``` 
  
# Setup 
  
* Data cleaning process is in the ETL file in the root directory  
* Each ML model has been saved as individual jupyter notebook under the 'models and scalers' folder  
* The final site can be accessed at: https://everest-calc.herokuapp.com/  
  

# Design  
## Machine Learning Models
  
<strong>Pre-processing</strong>  
*X* and *y* values were split into training and testing sets using SKlearns train_test_split. *X* values were then scaled using a MinMaxScaler. Categorical values were converted to numerical using label encoder.

<strong>Feature Selection</strong>  
For the deep learning models recursive feature elimination was used to find the optimal features to include in the model. 
The 'crowding models' include the number of climbers on the mountain as a feature, while the standard model does not. 
  
<strong>Hyperparameter Tuning</strong>  
A custom hyperparameter library, <a href="https://github.com/autonomio/talos">Talos</a> was used to find the optimised parameters for each of the four modelss. This allowed for a definig of a hyperparameter dictionary which could be trailled in different combination. A report was then generated as a dataframe comparing the accuracy of the diffrent parameter combinations.  
  
<strong>Results</Strong>  
The Success model had and accuracy of 88%, while the death model had 98.6% accuracy. The high score the the death model must be considered in the context of the low underlying death rate (1.4%). The crowding models had accuracy of 86% (success) and 98% (death). 

## Site Design and Deployment
Following data cleaning and creation of three core data tables the data was loaded into a PostgresSQL database which is stored on a <a href="https://aws.amazon.com/rds/">AWS RDS</a>.
  
The D3 Javascript Library was used to create the visualisations. <a href="https://www.mapbox.com/mapbox-gljs">MapboxGL</a> was used for the 3D terrain background to enhance the atmosphere and story telling of the site. <a href="https://github.com/johnwalley/d3-simple-slider">D3-simple slider</a> library was used to create a slider to alter the degree of crowding accounted for in the crowding ML model.  
  
The site has been deployed on Heroku. 

  
# Sources
|No|Source|url|
|-|-|-|
|1|The Himalayan Database                                                     |https://www.himalayandatabase.com/|
|2|NY Times - ‘It Was Like a Zoo’: Death on an Unruly, Overcrowded Everest    |https://www.nytimes.com/2019/05/26/world/asia/mount-everest-deaths.html|
|3|Talos Autonomy                                                             |https://github.com/autonomio/talos|
|4|D3 Simple Slider                                                           |https://github.com/johnwalley/d3-simple-slider|
|5|MapboxGL                                                                   |https://www.mapbox.com/mapbox-gljs|


  
# Contributors  
Dale Currigan  
[@dcurrigan](https://github.com/dcurrigan)  
<dcurrigan@gmail.com>


## Status
Project is: 
````diff 
+ Completed
````
