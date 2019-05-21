// from data.js
var tableData = data;
var hlist=[];

// HERE!


window.addEventListener('load', init);


function init(){
	d3.selectAll('th').each(function(d){
		hlist.push(d3.select(this).text().toLowerCase());
	});
	adjustUI();
	//filterTable();
	d3.select('#filter-btn').on('click', function(){
		d3.event.preventDefault();
		filterTable();
		putUFO();
	});
}


function addtabledata(mylist){
	d3.select('tbody').selectAll('tr').remove();
	hlen = hlist.length;
    var rlen=mylist.length;
	if (rlen<1){
		d3.select('tbody').append('tr').html('<td colspan="7">Sorry, there were no sightings that match the search criteria.</td>');
		return;
	}
    for (var i=0; i<rlen; i++){
        rec = mylist[i];
        rstr="";
        for (var j=0; j<hlen; j++){
            key=hlist[j];
			if (key==='date') key='datetime';
			else if (key==='duration') key = 'durationMinutes';
			addstr=rec[key]
			if (key==="city") addstr = toTitleCase(addstr);
			else if (key==="state" || key==="country") addstr = addstr.toUpperCase();
            rstr+="<td>"+addstr+"</td>";
        }
        d3.select('tbody').append('tr').html(rstr);
		
    }
}


function putUFO(){
	d3.selectAll('.f-ufo').remove();
	var unum = 6+ Math.floor(Math.random()*10);
	var size=30;
	for (var i=0; i<unum; i++){
		var x=parseInt(Math.random()*window.innerWidth)-size;
		var y=parseInt(Math.random()*window.innerHeight)+window.scrollY-size;
		var nx=200+Math.random()*200;
	  	nx = (Math.random()<.5)? nx:-nx;
	  	var ny=40+Math.random()*120;
	  	ny = (Math.random()<.5)? -ny:ny;
		d3.select('.wrapper').append('div').attr("class","f-ufo").style("left",x+"px").style("top",y+"px")
			.transition()
			.delay(i*200)
			.ease(d3.easeLinear)
      		.duration(1000)
			.style('visibility','visible')
      		.style("transform", "translate3d("+nx+"px,"+ny+"px,0px) scale(.5)")
			.style("opacity",0)
			.on("end", function(){this.remove();}); 
	}
}



function getUnique(keyval){
	var obj={};
	var mylist=[];
	tableData.map(function (rec) {
			if (!(rec[keyval] in obj)){
				obj[rec[keyval]]=1;
  				mylist.push(rec[keyval]);
			 }
		 });
	return mylist;
}


function adjustUI(){
	var dates=getUnique('datetime');
	dates.forEach(function(val){
		d3.select('#dateselect').append('option').attr("value",val).html(val);
	});
		
	var cities=getUnique('city');
	cities.sort();
	cities.forEach(function(val){
		d3.select('#cityselect').append('option').attr("value",val).html(toTitleCase(val));
	});
	
	var states=getUnique('state');
	states.sort();
	states.forEach(function(val){
		d3.select('#stateselect').append('option').attr("value",val).html(val.toUpperCase());
	});
	
	var countries=getUnique('country');
	countries.sort();
	countries.forEach(function(val){
		d3.select('#countryselect').append('option').attr("value",val).html(val.toUpperCase());
	});
	
	var shapes=getUnique('shape');
	shapes.sort();
	shapes.forEach(function(val){
		d3.select('#shapeselect').append('option').attr("value",val).html(val);
	});
}

function filterTable(){
	
	var selData = tableData.slice();
	var seldate = d3.select("#dateselect").node().value;
	if (seldate !=="all"){
		selData = selData.filter(item => item.datetime ===seldate);
	}
	
	var selcity = d3.select("#cityselect").node().value;
	if (selcity !=="all"){
		selData = selData.filter(item => item.city ===selcity);
	}
	
	var selstate = d3.select("#stateselect").node().value;
	if (selstate !=="all"){
		selData = selData.filter(item => item.state ===selstate);
	}
	
	var selcountry = d3.select("#countryselect").node().value;
	if (selcountry !=="all"){
		selData = selData.filter(item => item.country ===selcountry);
	}
	
	var selshape = d3.select("#shapeselect").node().value;
	if (selshape !=="all"){
		selData = selData.filter(item => item.shape ===selshape);
	}	
	
	addtabledata(selData);
}


function toTitleCase(str) {
  	return str.replace(
		/\w\S*/g,
		function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
}


