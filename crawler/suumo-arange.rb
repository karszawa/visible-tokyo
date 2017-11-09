require 'json'
require 'pry'

class Array
  def sum
    reduce(:+)
  end

  def mean
    sum.to_f / size
  end

  def var
    m = mean
    reduce(0) { |a,b| a + (b - m) ** 2 } / (size - 1)
  end

  def sd
    Math.sqrt(var)
  end

  def med
    size % 2 == 0 ? self[size/2 - 1, 2].inject(:+) / 2.0 : self[size/2]
  end
end

json = JSON.parse(File.open(ARGV[0]).read)

results = {}

json["data"].each do |obj|
  place = obj["place"]

  results[place] = {} unless results[place]

  results[place] << obj
end

pp result.to_json
