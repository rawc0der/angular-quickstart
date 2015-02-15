# Load Dependencies
express = require 'express'
routes = require './routes'

# Create server
app = express.createServer()

# Configure app
app.configure ->
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.static("#{__dirname}/public")
  app.use app.router

app.configure 'development', ->
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))

# Routes Setup
app.get '/', routes.index

# Start Server
app.listen 9000, ->
  console.log "server running on port 9000"