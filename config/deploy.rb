# config valid only for current version of Capistrano
lock '3.4.1'

set :application, 'weaselsco'
set :repo_url, 'git@github.com:weaselsco/weaselsco.github.com.git'
set :scm, :git

set :format, :pretty
namespace :deploy do
  task :update_jekyll do
    on roles(:app) do
      within "#{deploy_to}/current" do
        execute :jekyll, "build"
      end
    end
  end
end

after "deploy:symlink:release", "deploy:update_jekyll"

