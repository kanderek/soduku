describe("Timer", function(){

	var timer;

	beforeEach(function(){
		timer = new Timer();
		// console.log(jasmine);
		jasmine.clock().install();
	});

	afterEach(function(){
		jasmine.clock().uninstall();
	});

	describe("timer object methods and properties", function(){

		it("should exist with zero time passed when created", function(){
			expect(timer.timePassed).toEqual(0);
			expect(timer.isStopped).toEqual(true);
		});

		it("should have a start method", function(){
			expect(timer.start).toBeDefined();
		});

		it("should have a stop method", function(){
			expect(timer.stop).toBeDefined();
		});

		it("should have a reset method", function(){
			expect(timer.reset).toBeDefined();
		});
	});

	describe("timer start", function(){
		it("should start the timer", function(){
			timer.start();
			expect(timer.isStopped).toBe(false);
		});

		it("timer should increment after being started", function(){
			// timer.start();
			// setTimeout(function(){
			// 	timer.stop();
			// }, 500); 
			// jasmine.clock().tick(50);
			// expect(timer.timePassed).toBeGreaterThan(0);
		});
	});

	describe("timer stop", function(){
		it("should stop the timer", function(){
			timer.stop();
			expect(timer.isStopped).toBe(true);
		});
	});

	describe("timer reset", function(){

		it("should reset time passed to zero", function(){
			timer.reset();
			expect(timer.timePassed).toEqual(0);
		});
	});
});