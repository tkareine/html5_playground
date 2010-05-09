public_dir = Dir.pwd
puts "Serving directory #{public_dir}"
run Rack::Directory.new(public_dir)
