# config valid only for current version of Capistrano
lock '3.4.1'

set :application, 'weaselsco'
set :repo_url, 'git@github.com:weaselsco/website.git'
set :scm, :git

set :format, :pretty
namespace :deploy do
  task :update_jekyll do
    on roles(:app) do
      execute "cd #{ release_path } && rvm use 2.7.1 && bundle exec jekyll build"
    end
  end
end

after "deploy:symlink:release", "deploy:update_jekyll"
