require 'json'
require 'pry'

result = { type: "FeatureCollection", features: [] }

Dir.glob(ARGV[0]).each do |file|
  json = JSON.parse(File.open(file).read)

  result[:features] += json["features"]
end

puts result.to_json
