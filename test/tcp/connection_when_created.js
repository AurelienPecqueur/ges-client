var client = require('../../')
	, ges = require('apec-ges-test-helper').memory
	, should = require('../shouldExtensions')


describe('connection, when created', function() {
	var es
		, esSettings

	before(function(done) {
		es = ges(function(err, settings) {
			if(err) return done(err)

			esSettings = settings
			done()
		})
	})

	it('with a callback, should be connected when callback is called', function(done) {
		client(esSettings, function(err, connection) {
			if(err) return done(err)

			connection.on('close', function() {
				should.pass()
				done()
			}).on('error', done)

			connection.isInState('Connected').should.be.true
			connection.close()
		})
	})

	it('without a callback, should raise connect event with endpoint as data', function(done) {
		var connection = client(esSettings)

		connection.on('close', function() {
			should.pass()
			done()
		}).on('error', done)
		
		connection.on('connect', function(endpoint) {
			endpoint.port.should.equal(esSettings.port)
			connection.isInState('Connected').should.be.true
			connection.close()
		})
	})

	it('without a callback and with requireExplicitConnection flag set, should raise connect event with endpoint as data', function(done) {
		var connection = client(esSettings)
		
		connection.on('close', function() {
			should.pass()
			done()
		}).on('error', done)

		connection.on('connect', function(endpoint) {
			endpoint.port.should.equal(esSettings.port)
			connection.isInState('Connected').should.be.true
			connection.close()
		})

		connection.connect()
	})

	it('with a callback and with requireExplicitConnection flag set, should be connected when callback is called', function(done) {
		var con = client(esSettings, function(err, connection) {
			if(err) return done(err)

			connection.on('close', function() {
				should.pass()
				done()
			}).on('error', done)

			connection.isInState('Connected').should.be.true
			connection.close()
		})

		con.connect()
	})

  after(function(done) {
  	es.cleanup(done)
  })
})
