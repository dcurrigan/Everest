CREATE TABLE everest (
	id INT PRIMARY KEY,
	expid VARCHAR ( 100 ),
	membid INT,
	myear INT,
    sex VARCHAR (1),
    calcage INT,
    citizen VARCHAR (100),
    status VARCHAR (100),
    msolo VARCHAR (100),
    msuccess VARCHAR (100),
    msmtdate1 VARCHAR (100),
    msmtdate2 VARCHAR (100),
    msmtdate3 VARCHAR (100),
    route1 VARCHAR (100),
    route2 VARCHAR (100),
    route3 VARCHAR (100),
    route4 VARCHAR (100),
    mo2used VARCHAR (100),
    mo2none VARCHAR (100),
    mo2climb VARCHAR (100),
    mo2descent VARCHAR (100),
    mo2sleep VARCHAR (100),
    death VARCHAR (100),
    deathdate VARCHAR (100),
    msmtbid INT,
    stdrte VARCHAR (100),
    new_route VARCHAR (100),	
	new_status VARCHAR (100),
	climber_count INT
);

CREATE TABLE averages (
    index INT PRIMARY KEY,
	"group" VARCHAR (100),
	success FLOAT,
	death FLOAT
)

drop table everest
drop table averages

select *
from everest