// Add options to <select>
function addOptions(name, array) {
 var select = document.getElementsByName(name)[0];

 for (value in array) {
  var option = document.createElement("option");
  option.text = array[value];
  select.add(option);
 }
}

// Pre-select an option in <select> or <number>
function selectElement(id, valueToSelect) {    
    var element = document.getElementById(id);
    element.value = valueToSelect;
}

// Apply unique to an array

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

// Return all indexes where value occurs
function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

// Use an array of indexes to subsample another array
function select_w_indexarr(idx_arr, array) {
  var selected = []; i=0
  for (i = 0; i < idx_arr.length; i++) {
    this_idx=idx_arr[i]
    selected.push(array[this_idx]);
  }
  return selected;
}

// Find all indexes of arr where matchval ocurs. 
// Only look among the indexes stored in idx_arr

function idx_of_match(arr, matchval, idx_arr){

    for (i = 0; i < idx_arr.length; i++) {
        this_idx=idx_arr[i]
        if(Read_Length[this_idx]==matchval)
        {
            match_idx=this_idx;
            return(match_idx)
            break
        }
    }
}

/*Charge a table from an array of arrays, where
each array has the data for a single row. First column
must be text (rownames) and the rest must be numbers and
will be converted to legible numeric format */

function loadTable(tableId, head_arr, arr_of_arrs) {
    //$('#' + tableId).empty(); //not really necessary
    var head='<tr>'; rows = ''; i=0; j=0; arr=[]

    for(i = 0; i < head_arr.length; i++)
    {
        head+='<th>' + head_arr[i] + '</th>'
    }
    head+='</tr>'

    for(i = 0; i < arr_of_arrs.length; i++) 
    {
        arr=arr_of_arrs[i]
        var row = '<tr>'
        for(j=0;j< arr.length;j++)
        {
            if(j==0){ row += '<td>' + arr_of_arrs[i][j] + '</td>' }
            else{
                if(arr_of_arrs[i][j] >= 10000 || arr_of_arrs[i][j] <= 0.001) 
                    row += '<td>' + writeScientificNum(arr_of_arrs[i][j]) + '</td>'
                else
                    row += '<td>' + formatnum(arr_of_arrs[i][j]) + '</td>' 
            }
        }
        rows += row + '</tr>'
    }
    $('#' + tableId).html(head + rows);
}

//Convert to scientific notation

function writeScientificNum(num) {
    var exp=0;
    var log=Math.log10(num); var sign=Math.sign(log)
    if(sign==-1) exp = Math.ceil(Math.abs(log))
    else exp = Math.floor(Math.abs(log))

    coef = (num/Math.pow(10,(sign*exp))).toFixed(2)
    scientific = coef.toString()+" x10"+((exp*sign).toString()).sup()
    return(scientific)
}

// Convert numbers to a legible string format 123,848,196.12

function formatnum(num){
    var num_sig="", num_dec=""
    var numStr=String(num)
    var numArr = numStr.split(".")
    num_sig=numArr[0].replace(/(.)(?=(\d{3})+$)/g,'$1,')
    if(numArr.length == 2){ 
        num_dec=numArr[1].substr(0,2)
        num_sig+="."+num_dec
    }
    return(num_sig)
}

function throughput(len, no_reads, through_levels){

    var through_arr=[];

    var through=len*no_reads
    for (i = 0; i < through_levels.length; i++) {
    through_i=through/Math.pow(1000,i)
    through_arr.push([through_levels[i],through_i]);
    }

    return(through_arr)
}

function filesize(len, no_reads, read_id_len, size_levels){

    var sep=1; new_lines=4; i=0; uncomp_i=0; comp_i=0; size_arr=[];

    var size=(read_id_len+(2*len)+sep+new_lines)*no_reads

    for (i = 0; i < size_levels.length; i++) {
    uncomp_i=size/Math.pow(1024, i)
    comp_i=uncomp_i/3.58;
    size_arr.push([size_levels[i],uncomp_i,comp_i]);
    }

    return(size_arr)
}
