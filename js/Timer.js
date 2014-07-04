function Timer(domDisplayElement) {
	this.timePassed = 0;
	this.isStopped = true;
	this.incrementTimer = null;
	this.domDisplayElement = domDisplayElement;
}

Timer.prototype.start = function(){
	// var now = new Date();

	this.isStopped = false;
	var that = this;
	
	this.incrementTimer = setInterval(function(){
		that.refreshTimeDom();
		that.timePassed++;
	}, 1000)
}

Timer.prototype.stop = function(){
	this.isStopped = true;
	var that = this;
	clearInterval(that.incrementTimer);
}

Timer.prototype.reset = function(){
	this.timePassed = 0;
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
			$(this.domDisplayElement).html(this.toString());
		}
		else{
			console.log(this.toString());
		}
	}
	catch(error){
		console.log("there was an error drawing to dom");
	}
}