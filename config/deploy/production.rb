set :use_sudo, false
set :deploy_to, '/home/coderschool/app'
set :branch, 'master'

server 'ok.lasica.co', user: 'coderschool', roles: %w{web app db}
