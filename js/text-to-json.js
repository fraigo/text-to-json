

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


function textToArray(string){
    var lines=string.split("\n");
	var sep=getSeparator(lines[0]);
	var result=[];
    for(var index in lines){
        lines[index]=lines[index].trim();
		var cols=lines[index].split(sep);
        result.push(cols);
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
