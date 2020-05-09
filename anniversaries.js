// Anniversaries.js, by Felix Ogg, http://www.felixogg.nl/
// December 2009
// Purpose: calculates the anniversaries for a bumpy relationship.
// License: free to use and modify in the public domain, please mention my name as the (original) author. 
dojo.require("dojo.date");
dojo.require("dojo.date.locale");

function formatDutchDate(date) {
	return dojo.date.locale.format(date, {locale:'nl-nl',selector: 'date', formatLength:'full'})
}

function parseDutchDate(dstr) {
	if( /\d\d?-\d\d?-\d\d\d\d/.test(dstr)){
	var parts = dstr.split('-');
	return new Date(parts[2] +'/'+ parts[1] +'/'+ parts[0]);	
	} else
	  throw new Error("Verander "+dstr+" in een leesbare datum.");
}

function getTimeLine(f){
	var inputs = f.getElementsByTagName('input');
	var timeLine = [];
	for( var i=0; i < inputs.length; i++){
		timeLine[i] = parseDutchDate(inputs[i].value);
	}
	if (!isAscending(timeLine)) {
	 throw new Error("Zet alle datums op chronologische volgorde.");
	} else {
		return timeLine; 
	}
}

function isAscending(timeLine) {
  if (timeLine.length < 2)
    return true;

  for(var i=1; i < timeLine.length; i++) {
    if(timeLine[i-1] > timeLine[i])
      return false;
  }
  return true;   
}

function offDays(timeLine) {
	console.log(timeLine);
	var off = 0; 
	var i = 1;
	while( i+1 < timeLine.length) {
		diff = dojo.date.difference(timeLine[i], timeLine[i+1], "day");
		i += 2;
		off += diff;
	}
	return off;
}

// ret: first on-date + offDays 
function virtualStartDate(timeLine) {
	var firstOnDate = timeLine[0];
	return dojo.date.add(firstOnDate, "day", offDays(timeLine));		
}

// ret: virtual start-date + targetYears + targetMonths + targetDays
// 12.5 years anniversary => 12Y + 6M +0D
function anniversaryDate(timeLine,targetYears, targetMonths, targetDays){
	var vsd = virtualStartDate(timeLine);
	var anniyears = dojo.date.add(vsd, "year", targetYears);
	var annimonths = dojo.date.add(anniyears, "month", targetMonths);
	return dojo.date.add(annimonths, "day", targetDays);
}

function anniversaries(tl){
	// classic anniversaries other than full year anniversaries	
	var specials = [ 
					[0,0,7], // 1 week 
					[0,1,0], // 1 month
					[0,6,0], // 6 months
					[12,6,0], //12.5 years
			];
	var dates = [];		
	for(var i = 0; i < specials.length; i++){
		dates[i] = anniversaryDate(tl, specials[i][0],specials[i][1],specials[i][2]);
	}											
	return dates;											
}

function inputsReadyToCalculate(tl) {
	isTimeLineValid = tl.length >= 3
	isTimeLineLenOdd = tl.length % 2 == 1
	return isTimeLineValid && isTimeLineLenOdd;
}

function nextAnniversary(tl){
  today = new Date();
  vsd = virtualStartDate(tl);
  vsdThisYear = vsd.setYear( today.getFullYear() );
  thisYearsAnniversaryPassed = (today > vsdThisYear);
  nextAnni = (thisYearsAnniversaryPassed) ? vsd.setYear(1+ today.getFullYear()) : vsdThisYear;
  return new Date(nextAnni);
} 

