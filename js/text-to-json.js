

/** 
 * Simulates a click in the file input (hidden)
*/
function openFile() {
	var file=document.getElementById("filename");
	file.click();
}

/**
 * To open or reopen a selected file to generate resized images
 * @param {DOMElement} newFile Optionally, the file input object. If no parameter is  
 */
function selectFile(callback){
	var file=document.getElementById("filename");
	if(!file.files[0]){
		//No file selected
		return;
	}
	readFile(callback);
}

/** 
 * Call to the resize process when a file is loaded. Otherwise, call to the file selection.
*/
function readFile(callback){
	var file=document.getElementById("filename");
	if(!file.files[0]){
		//No file selected yet
		openFile();
		return;
	}
	readBlob(file.files[0],callback);
}

/**
 * Read a file input and get the data contents.
 * @param {File} file File to be loaded
 */
function readBlob(file,callback) {
    var reader = new FileReader();

    reader.onload = function(loadedEvent) {
		console.log("Loaded");
        var data=(loadedEvent.target.result);
       
		callback(data);
    }
	
	reader.onprogress=function(progress){
		console.log("Progress: "+progress.loaded+"/"+progress.total);
	}
	
	reader.onerror=function(error){
		console.log("Error");
	}
	reader.readAsBinaryString(file);		
}


function CSVToArray( strData, strDelimiter ){
	if (strData.trim()==""){
		return [];
	}
	var lines=strData.split("\n");
	var sep=getSeparator(lines[0]);
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || sep);

	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
		);


	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];

	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;


	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec( strData )){

		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[ 1 ];

		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (
			strMatchedDelimiter.length &&
			strMatchedDelimiter !== strDelimiter
			){

			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push( [] );

		}

		var strMatchedValue;

		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[ 2 ]){

			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			strMatchedValue = arrMatches[ 2 ].replace(
				new RegExp( "\"\"", "g" ),
				"\""
				);

		} else {

			// We found a non-quoted value.
			strMatchedValue = arrMatches[ 3 ];

		}


		// Now that we have our value string, let's add
		// it to the data array.
		arrData[ arrData.length - 1 ].push( strMatchedValue );
	}

	// Return the parsed data.
	return( arrData );
}


function textToArray(string){
	
    var lines=string.split("\n");
	var sep=getSeparator(lines[0]);
	var result=[];
    for(var index in lines){
        lines[index]=lines[index].trim();
		var cols=lines[index].split(sep);
		console.log("COLS",cols);
		if (cols.length>0){
			if (cols[0]==""){
				console.log("Append",cols);
				for(var col in cols){
					if (cols[col]!=""){
						result[result.length-1][col]+="\n"+cols[col];
					}
				}
			}else{
				result.push(cols);
			}
		}
    }
	return result;
}

function arrayToJson(array,header){
	var tmp=array.concat([]);
	if (!header){
		header=tmp.shift();
	}
	var result=[];
	for(var index in tmp){
		var row={};
		for(var col in header){
			var colname=header[col];
			var colvalue=tmp[index][col];
			
			for(var key in header){
				var header1=header[key];
				if (colvalue){
					colvalue=colvalue.replace("${"+header1+"}",tmp[index][key]);
				}
                
            }
			if (colvalue=='#row'){
				colvalue=index*1;
			}
			
			if (colvalue && colvalue.length && colvalue.indexOf('#row+')==0){
				var parts=colvalue.split('+');
				colvalue=index*1+parts[1]*1;
			}
			if (colname && colname.indexOf('#')==0){
				colvalue*=1;
				colname=colname.substring(1);
			}
			row[colname]=colvalue;
		}
		result.push(row);
	}
	return result;
}

function getSeparator(line){
    var sep=[
        {sep:"\t",cols:line.split("\t")},
        {sep:"|",cols:line.split("|")},
        {sep:";",cols:line.split(";")},
        {sep:",",cols:line.split(",")},
    ]
    sep.sort(function(a,b){ 
	    if (b.cols.length>a.cols.length) return 1;
	    if (b.cols.length<a.cols.length) return -1;
	    return 0;
    });
    console.log(sep);
    console.log("Separator:",sep[0]);
    return sep[0].sep;
    
}
