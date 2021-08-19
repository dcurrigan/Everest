import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask import render_template, redirect


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///SQL/everest_db.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Members = Base.classes.members


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




@app.route("/api/v1.0/model")
def model():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Load the model 

    # Run the model on the input data



    return 





@app.route("/api/v1.0/data")
def data():
    # Create our session (link) from Python to the DB
    session = Session(engine)


    sel = [Members. , Members. ]
    result = session.query(*sel).filter().all()

    return 


if __name__ == '__main__':
    app.run(port=5500, debug=True)