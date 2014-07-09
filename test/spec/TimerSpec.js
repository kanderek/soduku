describe("Timer", function(){

	var myTimer;

	beforeEach(function(){
		myTimer = new GameTimer();
		// console.log(jasmine);
		jasmine.clock().install();
	});

	afterEach(function(){
		jasmine.clock().uninstall();
	});

	describe("myTimer object methods and properties", function(){

		it("should exist with zero time passed when created", function(){
			expect(myTimer.timePassed).toEqual(0);
			expect(myTimer.isStopped).toEqual(true);
		});

		it("should have a start method", function(){
			expect(myTimer.start).toBeDefined();
		});

		it("should have a stop method", function(){
			expect(myTimer.stop).toBeDefined();
		});

		it("should have a reset method", function(){
			expect(myTimer.reset).toBeDefined();
		});
	});

	describe("myTimer start", function(){
		it("should start the myTimer", function(){
			myTimer.start();
			expect(myTimer.isStopped).toBe(false);
		});

		it("myTimer should increment after being started", function(){
			// myTimer.start();
			// setTimeout(function(){
			// 	myTimer.stop();
			// }, 500); 
			// jasmine.clock().tick(50);
			// expect(myTimer.timePassed).toBeGreaterThan(0);
		});
	});

	describe("myTimer stop", function(){
		it("should stop the myTimer", function(){
			myTimer.stop();
			expect(myTimer.isStopped).toBe(true);
		});
	});

	describe("myTimer reset", function(){

		it("should reset time passed to zero", function(){
			myTimer.reset();
			expect(myTimer.timePassed).toEqual(0);
		});
	});
});