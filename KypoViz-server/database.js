var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('mydb.db')
var jsonfile = require('jsonfile')

jsonfile.spaces = 4;

exports.getEvents = function (req, res) {
    var events = [];

    var statement = 'SELECT  player_ID,timestamp, logical_time, level, event, game_instance_id FROM events';

    if(Object.keys(req.query).length != 0) {
        statement += queryBuilder(req.query);
        console.log("Querying events...");
    } else {
        console.log("No query specified, returning all events")
    }

    console.log(statement);

    db.each(statement,
        function (err, row) {
            // console.log(row);
            var event = {
                ID: row.player_ID,
                timestamp: row.timestamp,
                logical_time: row.logical_time,
                level: row.level,
                event: row.event,
                game_instance_id: row.game_instance_ID 
            };
            events.push(event);
        }, 
        function SendResponseToClientWhenDataIsLoaded () {
            res.json(events);
            console.log("Rows returned: " + events.length);
            res.end();
    });
}


exports.addEventsBulk = function(req, res) {
    var data = req.body;

    // Check integrity of data. If contract is not upheld, abort operation
    for(var i = 0; i<data.length; i++) {
        if(!isEventValid(data[i])) {
            console.log("Parsing error, operatation aborted. \nBody of request must contain array of JSON event objects with player_ID,timestamp,logical_time,level,event,game_instance_ID.");
            res.send("Parsing error, operatation aborted. \nBody of request must contain array of JSON event objects with player_ID,timestamp,logical_time,level,event,game_instance_ID.");
            res.end;
            return;
        }
    }

    //If Game game_instance_Id is specified as URL parameter, add it to events that have no game_instance_id property
    if(req.params.gameID) {
        console.log("Specified bulk game instance ID: '", req.params.gameID + "'");
        console.log("Adding specified game_instance_id to all events with indefined game_instance_ID. ");
        for(var i = 0; i< data.length; i++) {
            if(data[i].game_instance_id === undefined) {
                data[i].game_instance_id = req.params.gameID;
            }
        }
    } else {
           console.log("No game ID added as parameter. Inserting events 'as-is'. Request paramenters: ", req.params);
    }

    var statement = 'INSERT INTO events (player_ID,timestamp,logical_time,level,event, game_instance_id) VALUES ';        
    for(var i = 0; i<data.length; i++) {
      statement += stringifyEventJson(data[i]) + ',\n';
    }
    statement = statement.slice(0, -2);
    // console.log(statement);
    db.run(statement, function (err) {
        if(err) {
            // console.log(err);
            res.send('Database error: Operation failed.  \n');
            res.end();
        } else {
            console.log("\nAll events (" + data.length + ") successfully entered into database.");
            res.send("All events (" + data.length + ") successfully entered into database.");
            res.end();
        }
    });
}


exports.addEvent = function (req,res) {
    var event = req.body;
    if(!isEventValid(event)) {
        console.log("Parsing error, operatation aborted. Body of request must contain JSON event object with player_ID,timestamp,logical_time,level,event,game_instance_ID.");
        res.send("Parsing error, operatation aborted. Body of request must contain JSON event object with player_ID,timestamp,logical_time,level,event,game_instance_ID.");
        res.end;
        return;
    }
    var statement = 'INSERT INTO events (player_ID,timestamp,logical_time,level,event,game_instance_ID) VALUES '; 
    // console.log(event);
    statement += stringifyEventJson(event);   
    db.run(statement, function(err) {
         if(err) {
            // console.log(err);
            res.send('Database error: Operation failed.  \n');
            res.end();
        } else {
            console.log(statement + "\nEvent successfully entered into database.");
            res.send("Event successfully entered into database.");
            res.end();
        }
    });
}

exports.getGameIds = function (req,res) {
    var games = [];
    var statement = "SELECT DISTINCT game_instance_ID from events";


    if (req.params.playerID) {
        statement += " WHERE player_ID = " + req.params.playerID;
    }

    console.log(statement);

    db.each(statement,
        function AddEachResultToArray (err, row) {
            console.log(row);
            games.push(row.game_instance_ID);
        }, 
        function SendResponseToClientWhenDataIsLoaded () {
            res.json(games);
            console.log("GameIDs returned: " + games.length);
            res.end();
    });

}


function deleteAllEvents(callback) {
   console.log("cleaning database...");
   db.run("DELETE FROM events", [], function(err) {
        if(err) {
            console.log(err)
        } else {
            console.log(" >  All data succesfully removed.")
        }
   });
}



function jsonToDB() {
    var data = require('./testing-alltogether');
    var statement = 'INSERT INTO events (player_ID,timestamp,logical_time,level,event, game_instance_id) VALUES ';        
    for(var i = 0; i<data.length; i++) {
      statement += stringifyEventJson(data[i]) + ',\n';
    }
    statement = statement.slice(0, -2);
    // console.log(statement);
    db.run(statement);
}

function stringifyEventJson(event) {
  return "('" + event.ID +"','"+ event.timestamp +"','"+ 
                event.logical_time +"','"+ event.level +"','"+ event.event + "','"+
                 event.game_instance_id + "')";
 }


function queryBuilder(query) {
  var resultString = " WHERE "; 
  firstParam = true; 
  Object.keys(query).forEach(function(key) {
    if (firstParam) {
       firstParam = false;
    } else {
      resultString += " AND ";
    }
    resultString += key + " = '" + query[key] + "'";
  });
  return resultString;
}

function addGameIdToJsonFile(filePath, gameId) {
    console.log(filePath);
    jsonfile.readFile(filePath, function(err, obj) {
        for(var i = 0; i<obj.length; i++) {
            obj[i].game_instance_id = gameId;
        }
        console.log(obj);
        jsonfile.writeFile(filePath.slice(0,-5) + '-new' + ".json", obj, function (err) {
            if(err) {
              console.error(err);  
          } else {
              console.log("New file succesfully created.");
          }
        })
    })
}

function isEventValid(event) {
    if (event.ID === undefined || event.ID === null ||
        event.timestamp === undefined || event.timestamp === null ||
        event.logical_time === undefined || event.logical_time === null ||
        event.level === undefined || event.level === null ||
        event.event === undefined || event.event === null) {
        return false;
    } else {
        return true;
    }
}


// Calling maintanence fuctions from commandline
var args = process.argv.slice(2);

if(args[0] === "-clean") {
    deleteAllEvents();
}

// deleteAllEvents();
// jsonToDB();
// getAllEvents();