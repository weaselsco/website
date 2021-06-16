require 'rvm1/capistrano3'

set :rvm1_map_bins, %w{rake bundle gem ruby}
set :rvm1_ruby_version, "2.7.1"
set :rvm1_user, :system
set :rvm1_auto_script_path, '/tmp/weaselsco'
fetch(:default_env).merge!( rvm_path: "/usr/local/rvm" )

set :use_sudo, false
set :deploy_to, '/home/coderschool/app'
set :branch, 'master'

server 'ok.lasica.co', user: 'coderschool', roles: %w{web app db}
