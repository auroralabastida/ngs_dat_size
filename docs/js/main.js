
var read_len=100, no_reads=20000000, read_id_len=66;
var this_platform=Platform[3], this_chemistry=Chemistry_details[3];
var this_len=typical_len[3]; max_lanes=Lanes[3]; this_lanes=Lanes[3]
var u_Platform=Platform.filter(onlyUnique)
var seq_fmt="paired", mode=2, no_samples=1
var no_frags=max_frags[3], no_reads=max_frags[3]


$(document).ready(function() {

    selectElement('read_len', read_len)
    selectElement('no_reads', no_reads)
    selectElement('read_id_len', read_id_len)

    addOptions("platform", u_Platform)
    document.getElementById("by_platform").checked = true;
    document.getElementById("single").checked = true;
    selectElement("platform", this_platform) 
    selectElement('samples', no_samples)

    lanes_change("lanes", max_lanes, this_lanes, "max_lanes_p", "lanes_bubble")

    go_to_by_plat();

    var read_len_element = document.getElementById("read_len");
    read_len_element.addEventListener('change', (event) => { 
        read_len=Number(read_len_element.value)
        do_by_props()  });

    var no_reads_element = document.getElementById("no_reads");
    no_reads_element.addEventListener('change', (event) => {
        no_reads=Number(no_reads_element.value)
        do_by_props()  });

    var read_id_len_element = document.getElementById("read_id_len");
    read_id_len_element.addEventListener('change', (event) => {
        read_id_len=Number(read_id_len_element.value)
        do_by_props()  });


    $('input[type=radio][name="fmt_select"]').change(function() {
        mode=Number($(this).val())
        do_by_plat()
    });

    var samples_element = document.getElementById("samples");
    samples_element.addEventListener('change', (event) => { 
        no_samples=Number(samples_element.value)
        do_by_plat()
    });

    var platform_element = document.getElementById("platform");
    platform_element.addEventListener('change', (event) => { 
        this_platform=platform_element.value
        charge_chems()
       });

    var chemistry_element = document.getElementById("chemistry");
    chemistry_element.addEventListener('change', (event) => { 
        this_chemistry=chemistry_element.value
        charge_lens()  
        });

    var lanes_element = document.getElementById("lanes");
    lanes_element.addEventListener('change', (event) => { 
        this_lanes=lanes_element.value
        do_by_plat()  });

    var chem_len_element = document.getElementById("chem_length");
    chem_len_element.addEventListener('change', (event) => { 
        this_len=chem_len_element.value
        do_by_plat()  
        });

});




function change_how(panel_number){
        $("div.condpanel").hide();
        $("#condpanel" + panel_number).show();
}


function go_to_by_props(){

    change_how("1")

    console.log("Mode by properties:")

    $('.out_if_by_plat').hide(); 

    var through_arr=throughput(read_len, no_reads, through_levels)
    loadTable("throughput_table",["","Base Output"],through_arr)

    var size_arr=filesize(read_len, no_reads, read_id_len, size_levels)
    loadTable("sizes_table",["","Uncompressed","Compressed"],size_arr)

    document.getElementById("calc_message").innerHTML = "Data size for a sequence file containing "
    +formatnum(no_reads)+" reads of "+read_len+" bp and with sequence identifiers of "
    +read_id_len+" characters."
    document.getElementById("notes_message").innerHTML = notes_message_1b+" "+notes_message_2

}


function go_to_by_plat(){

    change_how("2")

    console.log("Mode by platform")

    $('.out_if_by_plat').show(); 

    charge_chems()

    document.getElementById("notes_message").innerHTML = notes_message_1a+" "+notes_message_2

}


function do_by_props(){

    console.log("Calculate with "+read_len+" "+no_reads+" "+read_id_len)

    var through_arr=throughput(read_len, no_reads, through_levels)
    loadTable("throughput_table",["","Base Output"],through_arr)

    var size_arr=filesize(read_len, no_reads, read_id_len, size_levels)
    loadTable("sizes_table",["","Uncompressed","Compressed"],size_arr)

}



function charge_chems(){


    $("#chemistry").empty()

    var i_plat=getAllIndexes(Platform, this_platform)
    var chems=select_w_indexarr(i_plat, Chemistry_details)

    this_chemistry=chems[0]

    addOptions("chemistry", chems)
    selectElement("chemistry", this_chemistry) 


    charge_lens()
}

function charge_lens(){

    $("#chem_length").empty()
    $("#if_lanes").hide()

    var i_chems=Chemistry_details.indexOf(this_chemistry)
    var lens=typical_len[i_chems].split(";")
    var lanes=Lanes[i_chems]

    max_lanes=lanes, this_lanes=lanes
    lanes_change("lanes", max_lanes, this_lanes, "max_lanes_p", "lanes_bubble")

    if(lanes > 1) $("#if_lanes").show()

    this_len=lens[0]

    addOptions("chem_length", lens)
    selectElement("chem_length", this_len) 
    
    do_by_plat()

}

var calc_message="", format_message=""

function do_by_plat(){

    i_chems=Chemistry_details.indexOf(this_chemistry)
    seq_fmt_opts=paired_avail[i_chems]
    plat_info=Source[i_chems]

    display_format_opts()

    lanes_change("lanes", max_lanes, this_lanes, "max_lanes_p", "lanes_bubble")

    lanes_factor=(1/max_lanes)*this_lanes

    no_frags=Number(max_frags[i_chems])*lanes_factor

    no_reads=(no_frags*mode)/no_samples

    console.log("do_by_plat: ")
    console.log(this_platform+" "+this_chemistry+" "+seq_fmt+"-"+this_len+
        " frag:"+no_frags+" read:"+no_reads+" samp:"+no_samples+
        " lanes:"+this_lanes+"of"+max_lanes)
   
    calc_message="Data generated "
    if(no_samples==1) calc_message=calc_message+"in a <em>whole sequencing run</em> with the <em>"
    else calc_message=calc_message+"<em>for each sample</em> in a <em>"+no_samples+"-sample sequencing run</em> with the <em>"
    calc_message=calc_message+this_platform+"</em> platform, the <em>"+this_chemistry+"</em> and <em>"+seq_fmt+"-end</em> reads of <em>"+this_len+" bp</em>. "+format_message

    

    document.getElementById("calc_message").innerHTML = calc_message
    document.getElementById("frags_message").innerHTML = "<b>DNA fragments read:</b> "+formatnum(no_frags/no_samples)
    document.getElementById("reads_message").innerHTML = "<b>Total reads :</b> "+formatnum(no_reads)

    var through_arr=throughput(this_len, no_reads, through_levels)
    loadTable("throughput_table",["","Base Output"],through_arr)

    var size_arr=filesize(this_len, no_reads, 66, size_levels)
    loadTable("sizes_table",["","Uncompressed","GZIP Compressed"],size_arr)
    document.getElementById('plat_info').href=plat_info


}

function display_format_opts(){

    $("#if_both_formats").hide()
    format_message=""
    if(seq_fmt_opts == "yes" && mode==2)
    {
        seq_fmt="paired";
        format_message="Both the <em>single and paired-end</em> sequencing formats <em>are available</em> with these technical options."
        document.getElementById("paired").checked = true
        $("#if_both_formats").show()

    }
    if(seq_fmt_opts == "yes" && mode==1)
    {
        seq_fmt="single";
        format_message="Both the <em>single and paired-end</em> sequencing formats <em>are available</em> with these technical options."
        document.getElementById("single").checked = true
        $("#if_both_formats").show()

    }
    if(seq_fmt_opts == "no")
    {
        seq_fmt="single"; mode=1
        format_message="Only the <em>"+seq_fmt+"-end format is available</em> with these technical options."
        document.getElementById("single").checked = true
        $("#if_both_formats").hide()
    }
}
