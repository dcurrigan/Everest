# Everest
Final Project - Quantifying the risk of climbing Earth's highest peak

> Created by Dale Currigan  
> August 2021  
  
  
![ML](/exoplanets.jpg)  

## Table of contents  
* [Project Intro](#Project-Intro)  
* [Project Structure](#Project-Structure)  
* [Setup](#Setup)  
* [Design](#Design) 
* [Sources](#Sources)  
* [Contributors](#Contributors)  
* [Status](#Status)  

# Project Intro
This project involved creating machine learning models capable of classifying possible exoplanets into one of three categores - 'CONFIRMED', 'FALSE POSITIVE', or 'CANDIDATE' - based upon data from the <a href="https://www.kaggle.com/nasa/kepler-exoplanet-search-results">NASA Kepler Space Telescope</a>. The briefing for the project was as follows: 
  
*Over a period of nine years in deep space, the NASA Kepler space telescope has been out on a planet-hunting mission to discover hidden planets outside of our solar system.
To help process this data, you will create machine learning models capable of classifying candidate exoplanets from the raw dataset.*  

  
# Project Structure  
```
machine-learning-challenge   
|  
|__ ipynb_checkpoints/                                           # Directory for notebook savepoints
|__ models and scalers/                                          # Directory for saved machine learning models
|  |__ everest_tune/                                             # Directory for neural network hyperparameter tuning
|  |__ (MAIN NOTEBOOK) Deep Learning - Success.ipynb             # Notebooks for the trialled ML models 
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
|

|__ README.md                               # This file
|__ exoplanets.jpg                          # images files for the readme
|__ matrix1.png
|__ matrix2.png
|                           
|__ model_1 - Decision_Tree.ipynb 
|__ model_2 - Deep Learning.ipynb           # Directory for css stylesheets                             
|__ model_3 - SVM.ipynb                               
|__ model_4 - KNN.ipynb                                 
|                                 
|__ model_2 - Deep Learning.ipynb           # The best performing model
|                             
|   
``` 
  
# Setup 
  
* Each model has been saved as individual jupyter notebook 
* The final, best performing model was the deep learning neural network. This has been saved in h5 file format
* This can be loaded by runnning the final cell in the deep learning notebook, or with the following code:  

```
# Load the model
from tensorflow.keras.models import load_model
model = load_model("Model 2 - Deep_learning.h5")
```   
   

# Design  
Four models were trialled for this project:  
1. Decision tree  
2. Deep learning neural network  
3. Support vector machine  
4. k-nearest neighbor  
  
<strong>Pre-processing</strong>  
Basic data cleaning was first performed with removal of Nan and null values  
Definitions for the columns headers was sourced from <a href="https://exoplanetarchive.ipac.caltech.edu/docs/API_kepcandidate_columns.html">NASA exoplanet archive</a>  
  
All columns relating to level of uncertainty (error) were removed as these would relate only to the individual feature and would be not relevant to classification.  

'koi_disposition' was used for *y* and consisted of three possible options - 'CONFIRMED', 'FALSE POSITIVE', or 'CANDIDATE'. All other features were inititially used for *X*.
  
*X* and *y* values were split into training and testing sets using SKlearns train_test_split. *X* values were then scaled using a MinMaxScaler. *y*-values were converted from categorical to numerical using label encoder. For the neural network keras to_categorical was additionally used.  

<strong>Feature Selection</strong>  
To optimise feature selection various methods were trialled. 

For the decision tree model feature importance was ranked. The model was re-run with after eliminating of models of low contribution to the model, but this this decreased the model score.  

For the deep learning model recursive feature elimination was used to find the optimal features to include in the model. 
  
<strong>Hyperparameter Tuning</strong>  
GridsearchCV was used for hyperparameter tuning for the decision tree, SVM and KNN models  
For the deep learning model Keras tuner was used to tune the numer of layers in the two hidden layers, as well as the learning rate    
  
<strong>Assumptions</strong>  
* I have assumed that the features are independent of one another - that is, there is no collinearity 
* Decision tree: At the beginning, the whole training set is considered as the root. Records are distributed recursively on the basis of attribute values
* Deep learning: The 2 hidden layers assumed a rectified linear unit activation function, whilst the output layer assumed a sigmoid function

<strong>Results</Strong>  
The deep learning model narrowly outperformed the decision tree model with comparative score of 0.898 vs 0.889 repectively. The SVM and KNN models had much lower performance with R2 scores of 0.8 and 0.81 even after hyperparameter tuning. 

Confusion matrices for the two better performing models are shown below:

<img src="/matrix1.png" alt="ML" width="400"/><img src="/matrix2.png" alt="ML" width="400"/>  
*Comparative confusion matrices for the best two performing final models, decision tree (left) and deep learning neural network (right)* 
<br>    
     
The confusion matrices show that the performance of the two models across the classification options was quite similar, although the decision tree model had slightly more incorrecly classified plaents as "FALSE POSITIVE" when they were in fact "CANDIDATE" (9 occurrences for decision tree vs 0 for deep learning model). 

In conclusion the deep learning model achieved relative success in classifying possible explanets, with almost 90% accuracy.

  
  
# Sources
|No|Source|url|
|-|-|-|
|1|NASA Kepler Space Telescope Data - Kaggle        |https://www.kaggle.com/nasa/kepler-exoplanet-search-results|
|2|NASA exoplanet archive                           |https://exoplanetarchive.ipac.caltech.edu/docs/API_kepcandidate_columns.html|


  
# Contributors  
Dale Currigan  
[@dcurrigan](https://github.com/dcurrigan)  
<dcurrigan@gmail.com>


## Status
Project is: 
````diff 
+ Completed
````
