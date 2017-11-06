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

hash = {}
result = {}

json["data"].each do |obj|
  hash[obj["place"]] = {} unless hash[obj["place"]]
  hash[obj["place"]][obj["floor_plan"]] = [] unless hash[obj["place"]][obj["floor_plan"]]
  hash[obj["place"]][obj["floor_plan"]] << obj["rent"]
end

hash.each do |place, plans|
  plans.each do |plan, rents|
    rents = rents.map(&:to_f)

    result[place] = {
      place: place,
      plan: plan,
      sample_size: rents.size,
      rent_mean: rents.mean.round(1),
      rent_max: rents.max.round(1),
      rent_min: rents.min.round(1)
      # rent_var: rents.var.round(1),
      # rent_sd: rents.sd.round(1),
      # rent_med: rents.med.round(1)
    }
  end
end

pp result.to_json
