###*
 # Index file 
 ## declare dependency modules
###
require './app/state/index'
require './common/component/index'
require './common/utils/index'

angular
  .module('application', [
    'templates'
    'ngAnimate'
    'ngResource'
    'lodash'
    'ui.router'
    
    'quickstartApp.common.utils'
    'quickstartApp.common.component'
    'quickstartApp.state' 

  ])
