SERVER_PORT = 4567

namespace :run do
  desc "Run the server with Thin web server, reloading on each request"
  task :dev do
    sh %{shotgun -r rubygems -p #{SERVER_PORT} -s thin config.ru}
  end

  desc "Run the server with Thin web server"
  task :thin do
    sh %{thin -r rubygems -p #{SERVER_PORT} -R config.ru start}
  end
end

task :default => :"run:dev"
