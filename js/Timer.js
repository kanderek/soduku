function Timer(domDisplayElement) {
	this.timePassed = 0;
	this.isStopped = true;
	this.incrementTimer = null;
	this.domDisplayElement = domDisplayElement;
}

Timer.prototype.start = function(){
	// var now = new Date();

	this.isStopped = false;
	$(this.domDisplayElement + " .toggle").attr("checked", true);
	var that = this;
	
	this.incrementTimer = setInterval(function(){
		that.timePassed += 1;
		that.refreshTimeDom();
	}, 1000)
}

Timer.prototype.stop = function(){
	this.isStopped = true;
	$(this.domDisplayElement + " .toggle").attr("checked", false);
	var that = this;
	clearInterval(that.incrementTimer);
}

Timer.prototype.reset = function(){
	this.timePassed = 0;
	// var timerStarted = $(this.domDisplayElement + " .toggle").attr("checked") === "checked" ? true : false;
	// if(!timerStarted){
	// 	this.start();
	// }
	this.refreshTimeDom();
}

Timer.prototype.toString = function(){
	var seconds = this.timePassed < 60 ? this.timePassed : this.timePassed%60;
	var minutes = (this.timePassed - seconds)/60;

	seconds = seconds < 10 ? "0" + seconds : seconds; 

	return minutes + ":" + seconds;
}

Timer.prototype.refreshTimeDom = function(){
	try{
		if(this.domDisplayElement){
			$(this.domDisplayElement + " .time-passed").html(this.toString());
		}
		else{
			console.log(this.toString());
		}
	}
	catch(error){
		console.log("there was an error drawing to dom");
	}
}